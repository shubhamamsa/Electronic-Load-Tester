#include "Controller.h" 
#include "LCD.h"
#include "WiFiController.h"

// Attributes

// Output Time interval
long long stime = millis();

// Main controller
Controller control;

// LCD
LCD lcd(20, 4);

// MQTT Client
WiFiController service(&control);

void setup()  {
  Serial.begin(115200);
  control.initialize();
  lcd.initialize();
  service.initialize();
}

void loop() {
  service.mqttListen();
  control.execute();
  if(millis() - stime > 1000) {
    lcd.clear();
    control.printPowerProfile();
    lcd.displayPowerProfile(control.getVoltage(), control.getCurrent(), control.getPower());
    if(control.getThresholdVoltage() < control.getVoltage())
      service.publishData();
    stime = millis();
  }
}
