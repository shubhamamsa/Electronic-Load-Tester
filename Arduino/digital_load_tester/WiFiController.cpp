#include "WiFiController.h"

Controller* WiFiController::control;

WiFiController::WiFiController(Controller *control)    {
    this->ssid = WIFI_SSID;
    this->password = WIFI_PASSWORD;
    this->control = control;
    this->mqttServer = MQTT_SERVER;
    this->mqttPort = MQTT_PORT;
    this->mqttClient = new PubSubClient(espClient);
    this->ntpServer = "pool.ntp.org";
    this->epochTime = 0;
}

void WiFiController::initialize()  {
    this->connect();
    this->mqttClient->setServer(this->mqttServer, this->mqttPort);
    this->mqttClient->setCallback(mqttCallback);
    this->mqttConnect();
    configTime(0, 0, ntpServer);
    while(this->epochTime < 100000)
      this->epochTime = this->getInitialEpochTime();
    this->epochTime *= 1000;
    this->initialMillis = millis();
}

void WiFiController::connect() {
    WiFi.mode(WIFI_STA); //Optional
    WiFi.begin(this->ssid, this->password);
    Serial.println("\nConnecting");
    while(WiFi.status() != WL_CONNECTED){
        Serial.print(".");
        delay(1000);
    }
    Serial.println("\nConnected to the WiFi network");
    Serial.print("Local ESP32 IP: ");
    Serial.println(WiFi.localIP());
}

void WiFiController::mqttConnect()  {
  Serial.print("Attempting MQTT connection...");
  if (this->mqttClient->connect("ESP32Client")) {
    Serial.println("connected");
    this->mqttClient->subscribe("voltage_monitor/start");
    this->mqttClient->subscribe("voltage_monitor/mode");
    this->mqttClient->subscribe("voltage_monitor/reset");
  } 
  else {
    Serial.print("failed, rc=");
    Serial.print(this->mqttClient->state());
  }
}

unsigned long WiFiController::getInitialEpochTime() {
    struct timeval tv;
    if (gettimeofday(&tv, NULL)!= 0)
        return 0;
    return tv.tv_sec;
}

unsigned long long WiFiController::getEpochTime() {
    return (this->epochTime + (millis() - this->initialMillis));
}

// ToDo
void WiFiController::mqttCallback(char* topic, byte* message, unsigned int length)  {
  String data = "";
  for(int i=0;i<length;i++) {
    data += (char)message[i];
  }
  if(!strcmp(topic, "voltage_monitor/reset"))
    resetHandler(data);
  else if(!strcmp(topic, "voltage_monitor/mode"))
    modeHandler(data);
  else if(!strcmp(topic, "voltage_monitor/start"))
    startHandler(data);

}

void WiFiController::resetHandler(String data)  {
  control->setMode(0);
}

void WiFiController::modeHandler(String data) {
  DynamicJsonDocument json(1024);
  DeserializationError error = deserializeJson(json, data);
  if(error) {
    Serial.println("Error in start handler");
    return;
  }
  int _mode = json["mode"].as<int>();
  float dVal = json["val"].as<float>();
  switch(_mode) {
    case 1: control->setDesiredCurrent(dVal); break;
    case 2: control->setDesiredPower(dVal); break;
    case 3: control->setDesiredResistance(dVal); break;
  }
  control->setMode(_mode);
}

void WiFiController::startHandler(String data) {
  Serial.println(data);
  DynamicJsonDocument json(1024);
  DeserializationError error = deserializeJson(json, data);
  if(error) {
    Serial.println("Error in start handler");
    return;
  }
  int _mode = json["mode"].as<int>();
  float dVal = json["val"].as<float>();
  float thresholdVoltage = json["threshold"].as<float>();
  double soc = json["soc"].as<double>();
  float maxCapacity = json["capacity"].as<float>();
  String batteryType = json["type"].as<const char*>();
  long batteryVersion = json["version"].as<long>();
  control->setThresholdVoltage(thresholdVoltage);
  control->setBatteryType(batteryType);
  control->setBatteryVersion(batteryVersion);
  control->setSOC(soc);
  control->setMaxCapacity(maxCapacity);
  switch(_mode) {
    case 1: control->setDesiredCurrent(dVal); break;
    case 2: control->setDesiredPower(dVal); break;
    case 3: control->setDesiredResistance(dVal); break;
 }
 control->setMode(_mode);
}

void WiFiController::mqttListen() {
  if(!this->mqttClient->connected())  {
    this->mqttConnect();
  }
  this->mqttClient->loop();
}

void WiFiController::publishData()  {
  DynamicJsonDocument data(1024);
  String body;
  data["timestamp"] = this->getEpochTime();
  data["batteryType"] = this->control->getBatteryType();
  data["version"] = this->control->getBatteryVersion();
  data["voltage"] = this->control->getVoltage();
  data["current"] = this->control->getCurrent() / 1000.0;
  data["resistance"] = this->control->getResistance() * 1000.0;
  data["power"] = this->control->getPower() / 1000.0;
  data["soc"] = this->control->getSOC();
  serializeJson(data, body);
  this->mqttClient->publish("voltage_monitor/power_profile", &body[0]);
  Serial.println(body);
}

float WiFiController::sToF(String num) {
    return num.toFloat();
}
