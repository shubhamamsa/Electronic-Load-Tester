#ifndef WIFI_CONTROLLER_H
#define WIFI_CONTROLLER_H

#include <WiFi.h>
#include<PubSubClient.h>
#include<time.h>
#include <ArduinoJson.h>
#include "Controller.h"
#include "Dotenv.h"

class WiFiController  {
  private:
        const char *ssid;
        const char *password;

        static Controller *control;

        const char* ntpServer;
        unsigned long long epochTime;
        unsigned long initialMillis;
        unsigned long getInitialEpochTime();

        const char* mqttServer;
        uint16_t mqttPort;
        WiFiClient espClient;
        PubSubClient *mqttClient;
        static void mqttCallback(char*, byte*, unsigned int);
        static void resetHandler(String);
        static void startHandler(String);
        static void modeHandler(String);
        void mqttConnect();

        static float sToF(String);
    
    public:
        WiFiController(Controller *control);
        void initialize();
        void connect();
        void mqttListen();
        void publishData();
        unsigned long long getEpochTime();
};

#endif WIFI_CONTROLLER_H
