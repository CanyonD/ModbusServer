#!/usr/bin/env python
import serial
import minimalmodbus
import traceback
import serial.rs485
import time

minimalmodbus.CLOSE_PORT_AFTER_EACH_CALL = True

deviceId = [
    10, 11, 12
]
instrument = [
    minimalmodbus.Instrument('COM6', deviceId[0]),
    minimalmodbus.Instrument('COM6', deviceId[1]),
    minimalmodbus.Instrument('COM6', deviceId[2])
]
# instrument = minimalmodbus.Instrument('COM6',10) # port name, slave address (in decimal)
# instrument[0].mode = minimalmodbus.MODE_RTU # rtu or ascii mode
# instrument[0].serial.baudrate = 38400 # Baud
# instrument.serial.rs485_mode = serial.rs485.RS485Settings()
# instrument[0].serial.bytesize = 8
# instrument[0].serial.parity   = serial.PARITY_NONE
# instrument[0].serial.stopbits = 1
# instrument[0].serial.timeout = 1
# instrument.debug = True
# print instrument
for inst in instrument:
    inst.mode = minimalmodbus.MODE_RTU # rtu or ascii mode
    inst.serial.baudrate = 38400 # Baud
    inst.serial.rs485_mode = serial.rs485.RS485Settings()
    inst.serial.bytesize = 8
    inst.serial.parity   = serial.PARITY_NONE
    inst.serial.stopbits = 1
    inst.serial.timeout = 1

fails = 0
while True:
    for index, inst in enumerate(instrument):
        try:
            count = inst.read_register(4,0,4) # Registernumber, number of decimals
            print ('device = ', deviceId[index], 'count = ', count)
            # print ('count = ', count)
            # time.sleep(0.01)
        except:
            # print traceback.format_exc()
            # print ('device = ', index, "Failed to read from instrument")
            fails = fails + 1
            print("Failed to read #", fails)
    print 
    # if False:
    #     break
# if instrument.serial.isOpen():


