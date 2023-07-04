#ifndef CONTROLLER_H
#define CONTROLLER_H

#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <Adafruit_MCP4725.h> 
#include "PID.h"

class Controller  {

  private:
    // ADC
    Adafruit_ADS1115 ads1115;
    float voltageMultiplier;
    float currentMultiplier;
    float shuntResistance;

    // DAC
    Adafruit_MCP4725 MCP4725;

    // Power Profile
    float voltage;
    float current;
    float power;
    float resistance;
    double soc;
    float maxCapacity;
    unsigned long lastTime;
    float thresholdVoltage;
    String batteryType;
    long batteryVersion;
    int currentMode;

    // PID Controller
    PID *pid;
    float dCurrent;
    float dPower;
    float dResistance;

  public:
    Controller();
    
    void initialize();
    
    void execute();
    
    void readVoltage();
    void readCurrent();
    void calculatePower();
    void calculateResistance();
    void calculateSOC();

    float getVoltage(); 
    float getCurrent();    
    float getPower();
    float getResistance();
    double getSOC();
    float getMaxCapacity();
    
    void setDesiredCurrent(float);
    void setDesiredPower(float);
    void setDesiredResistance(float);
    void setSOC(double);
    void setMaxCapacity(float);
    
    void setThresholdVoltage(float);

    float getThresholdVoltage();
    
    void setBatteryType(String);
    void setBatteryVersion(long);
    
    String getBatteryType(); 
    long getBatteryVersion();
    
    void setVoltageLevel(int voltageLevel);
    
    void printPowerProfile();
    
    bool setMode(int);

    // Temporary functions will be deprecated in future
    void setP(float kp);
    void setI(float ki);
    void setD(float kd);
    void clear();
};

#endif CONTROLLER_H
