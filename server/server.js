const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

const leadAcidModel = tf.loadLayersModel('file://models/lead-acid-js/model.json')
const lithiumIonModel = tf.loadLayersModel('file://models/lithium-ion-js/model.json')

const app = express()
const port = process.env.PORT || 80

let soc_nn = 100.0

app.use(bodyParser.json())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));

const mqtt = require('mqtt')
const { Client } = require('es8')

const host = process.env.MQTT_HOST || 'localhost'
const mqttPort = process.env.MQTT_SERVER || '1883'
const clientID = process.env.MQTT_CLIENT_ID || 'mqtt_1'

const esClient = new Client({
  node: process.env.ELASTIC_URL || 'http://localhost:9200'
})

const connectURL = `mqtt://${host}:${mqttPort}`
const client = mqtt.connect(connectURL, {
    clientID,
    clean:true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
})

const topics = ['voltage_monitor/power_profile']
client.on('connect', () => {
  console.log('Connected')
  client.subscribe(topics, () => {
    console.log(`Subscribed to topic '${topics}'`)
  })
})

client.on('message', async (topic, payload) => {
  if(topic == "voltage_monitor/power_profile")  {
    try {
      const data = JSON.parse(payload.toString())
      if(data["batteryType"] == "LeadAcid") {
        leadAcidModel.then(async (res) => {
          const prediction = res.predict(tf.tensor([[data["current"],data["voltage"]/12]]));
          let temp_soc_nn = parseFloat((prediction.arraySync()[0][0] * 100).toFixed(2));
          console.log((temp_soc_nn));
          if(soc_nn >= temp_soc_nn)
            soc_nn = temp_soc_nn;
          console.log((soc_nn));
          data["soc_nn"] = soc_nn;
          console.log(data)
          const result = await esClient.index({
            index: 'power_profile',
            document: data
          })
        }, (err) => {
            console.log(err)
        })
      }
      else if(data["batteryType"] == "LithiumIon") {
        lithiumIonModel.then(async (res) => {
          const prediction = res.predict(tf.tensor([[data["current"],data["voltage"]/12]], [1, 2]));
          data["soc_nn"] = (prediction.arraySync()[0][0] * 100).toFixed(2)
          console.log(data)
          const result = await esClient.index({
            index: 'power_profile',
            document: data
          })
        }, (err) => {
          console.log(err)
        })
      }
      else  {
        data["soc_nn"] = 0
        console.log(data)
        const result = await esClient.index({
          index: 'power_profile',
          document: data
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
})

app.post('/power_profile', (req, res) => {
  client.publish("voltage_monitor/start", JSON.stringify(req.body), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
  console.log(req.body);
  res.send({
    status: 'success',
    result: 'OK'
  })
})

app.post('/set_value', (req, res) => {
  console.log(JSON.stringify(req.body));
  client.publish("voltage_monitor/mode", JSON.stringify(req.body), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
  res.send({
    status: 'success',
    result: 'OK'
  })
})

app.post('/reset', (req, res) => {
  console.log("Reset: "+JSON.stringify(req.body));
  client.publish("voltage_monitor/reset", JSON.stringify(req.body), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
  res.send({
    status: 'success',
    result: 'OK'
  })
})

app.listen(port,  () => {
  console.log(`Express server listening on port ${port}`)
})