#!/usr/bin/env python
import serial
import minimalmodbus
import serial.rs485

minimalmodbus.CLOSE_PORT_AFTER_EACH_CALL = True

deviceId = [
    10, 11, 12
]
instrument = [
    minimalmodbus.Instrument('COM6', deviceId[0]),
	minimalmodbus.Instrument('COM6', deviceId[1]),
	minimalmodbus.Instrument('COM6', deviceId[2])
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
	
fails = [0,0,0]
while True:
    for index, inst in enumerate(instrument):
        try:
            values = inst.read_registers(1,15,4) # registers from 1 to 15
            print ('device = ', deviceId[index], 'values = ', values)
        except:
            fails[index] = fails[index] + 1
            print("Failed to read Device #", inst.address, "fails: ", fails[index])


