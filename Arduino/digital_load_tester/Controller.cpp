#include "Controller.h"

Controller::Controller()
  : voltageMultiplier(0.9275),
    currentMultiplier(0.1875),
    shuntResistance(1.1),
    dCurrent(0.0),
    dPower(0.0),
    dResistance(0.0),
    thresholdVoltage(0.0),
    soc(0.0),
    lastTime(0),
    maxCapacity(0.0),
    batteryType("null"),
    batteryVersion(0),
    currentMode(0)
{
  this->pid = new PID(0.0, 0.2, 0.6, 0.07, 0.0, 4095.0);
}

void Controller::initialize() {
  while(!this->ads1115.begin())  {
    Serial.println("ADC fuk gya");
  }
  while(!this->MCP4725.begin(0x60))  {
    Serial.println("DAC fuk gya");
  }
  this->MCP4725.setVoltage(0, false);
  this->lastTime = millis();
}

void Controller::execute() {
  this->readVoltage();
  this->readCurrent();
  this->calculatePower();
  this->calculateResistance();
  this->calculateSOC();
  float curVal;
  switch(this->currentMode) {
    case 0:
      curVal = 0.0;
      this->pid->setSetPoint(0.0);
      break;
    case 1:
      curVal = this->current;
      this->pid->setSetPoint(dCurrent);
      break;
    case 2:
      curVal = this->current;
      this->pid->setSetPoint(this->dPower / this->voltage);
      break;
    case 3:
      curVal = this->current;
      this->pid->setSetPoint((this->voltage / this->dResistance) * 1000.0);
  }
  if(this->thresholdVoltage > this->voltage)  {
    this->MCP4725.setVoltage(0, false);
    this->setMode(0);
  }
  else  
    this->MCP4725.setVoltage((int)this->pid->feedback(curVal), false);
}

void Controller::readVoltage() {
  int16_t adc0 = this->ads1115.readADC_SingleEnded(0);
  this->voltage = ((float)adc0 * this->voltageMultiplier) / 1000.0;
}

void Controller::readCurrent() {
  int16_t adc1 = this->ads1115.readADC_SingleEnded(1);
  this->current = (((float)adc1 * this->currentMultiplier) / this->shuntResistance);
}

void Controller::calculatePower() {
  this->power = this->voltage * this->current;
}

void Controller::calculateResistance() {
  if(this->current < 1.0)
    this->resistance = 1e9;
  else
    this->resistance = this->voltage / this->current;
}

void Controller::calculateSOC() {
  double dt = millis() - this->lastTime;
  double charge = ((((this->current * dt) / 3600.0) / 10.0) / this->maxCapacity);
  this->soc = this->soc - charge;
  this->lastTime = millis();
}

float Controller::getVoltage()  {
  return this->voltage;
}

float Controller::getCurrent()  {
  return this->current;  
}

float Controller::getPower()  {
  return this->power;
}

float Controller::getResistance() {
  return this->resistance;
}

double Controller::getSOC()  {
  return this->soc;
}

float Controller::getMaxCapacity()  {
  return this->maxCapacity;
}

void Controller::setDesiredCurrent(float dCurrent) {
  this->dCurrent = dCurrent;
}

void Controller::setDesiredPower(float dPower) {
  this->dPower = dPower;
}

void Controller::setDesiredResistance(float dResistance) {
  this->dResistance = dResistance;
}

void Controller::setSOC(double soc)  {
  this->soc = soc;
}

void Controller::setMaxCapacity(float maxCapacity)  {
  this->maxCapacity = maxCapacity;
}

void Controller::setThresholdVoltage(float thresholdVoltage) {
  this->thresholdVoltage = thresholdVoltage;
}

float Controller::getThresholdVoltage()  {
  return this->thresholdVoltage;
}

void Controller::setBatteryType(String batteryType)  {
  this->batteryType = batteryType;
}

void Controller::setBatteryVersion(long batteryVersion)  {
  this->batteryVersion = batteryVersion;
}

String Controller::getBatteryType()  {
  return this->batteryType;
}

long Controller::getBatteryVersion()  {
  return this->batteryVersion;
}

void Controller::setVoltageLevel(int voltageLevel)  {
  this->MCP4725.setVoltage(voltageLevel, false);
}

bool Controller::setMode(int num) {
  if(num < 0 || num > 3)
    return false;
  this->currentMode = num;
  return true;
}

void Controller::setP(float kp)  {
  return this->pid->setP(kp);
}

void Controller::setI(float ki)  {
  return this->pid->setI(ki);
}

void Controller::setD(float kd)  {
  return this->pid->setD(kd);
}

void Controller::clear()  {
  this->pid->clear();
}

void Controller::printPowerProfile()  {
  Serial.print("Voltage: ");
  Serial.println(this->voltage);
  Serial.print("Current: ");
  Serial.println(this->current);
  Serial.print("Power: ");
  Serial.println(this->power);
  Serial.print("Error: ");
  Serial.println(this->dCurrent - this->current);
  Serial.print("dCurrent: ");
  Serial.println(this->dCurrent);
  Serial.print("dPower: ");
  Serial.println(this->dPower);
  Serial.print("Mode: ");
  Serial.println(this->currentMode);
  Serial.println();
  Serial.println();
  
}
