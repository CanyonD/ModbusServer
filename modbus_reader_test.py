#!/usr/bin/env python
import serial
import minimalmodbus
import serial.rs485

minimalmodbus.CLOSE_PORT_AFTER_EACH_CALL = True

port = 'COM6'

deviceId = [
    10, 11, 12, 13, 21, 22, 23
]
instrument = [
    minimalmodbus.Instrument(port, deviceId[0]),
    minimalmodbus.Instrument(port, deviceId[1]),
    minimalmodbus.Instrument(port, deviceId[2]),
    minimalmodbus.Instrument(port, deviceId[3]),
    minimalmodbus.Instrument(port, deviceId[4]),
    minimalmodbus.Instrument(port, deviceId[5]),
    minimalmodbus.Instrument(port, deviceId[6])
]
for inst in instrument:
    inst.mode = minimalmodbus.MODE_RTU # rtu or ascii mode
    inst.serial.baudrate = 9600 # Baud
    inst.serial.rs485_mode = serial.rs485.RS485Settings()
    inst.serial.bytesize = 8
    inst.serial.parity   = serial.PARITY_NONE
    inst.serial.stopbits = 1
    inst.serial.timeout = 1
#    inst.debug = True
    print inst
	
fails = [0] * len(deviceId)
while True:
    for index, inst in enumerate(instrument):
        try:
            values = inst.read_registers(1,10,4) # registers from 1 to 10
            print ('device = ', inst.address, 'values = ', values)
        except:
            fails[index] = fails[index] + 1
            print ("Failed to read Device #", inst.address, "fails: ", fails[index])


