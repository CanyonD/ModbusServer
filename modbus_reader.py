#!/usr/bin/env python
import serial
import minimalmodbus
import traceback
import serial.rs485
import time
import sqlite3

dbConn = sqlite3.connect('database_server.db')
dbCursor = dbConn.cursor()

dbCursor.execute("CREATE TABLE IF NOT EXISTS `server_values` ("+
    "`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, "+
    "`device_id` INTEGER NOT NULL,"+
    "`value` REAL DEFAULT 0,"+
    "`timestamp` INTEGER);")
dbConn.commit()
dbConn.close()

dbConn = sqlite3.connect('database_server.db')
dbCursor = dbConn.cursor()

#values = [(3,2),(3,6)]
#dbCursor.executemany('INSERT INTO server_values (device_id, value) VALUES (?,?)', values)
#dbConn.commit()

#dbCursor.execute("SELECT * FROM server_values")
#for row in dbCursor:
#    print row
# print dbCursor.fetchone()
#dbConn.close()

#exit(0)

minimalmodbus.CLOSE_PORT_AFTER_EACH_CALL = True

port = '/dev/ttyUSB1'

deviceId = [
    10, 11, 12, 
	21, 22, 23
]
instrument = [
    minimalmodbus.Instrument(port, deviceId[0]),
    minimalmodbus.Instrument(port, deviceId[1]),
    minimalmodbus.Instrument(port, deviceId[2]),
    minimalmodbus.Instrument(port, deviceId[3]),
    minimalmodbus.Instrument(port, deviceId[4]),
    minimalmodbus.Instrument(port, deviceId[5])
]
for inst in instrument:
    inst.mode = minimalmodbus.MODE_RTU # rtu or ascii mode
    inst.serial.baudrate = 9600 # Baud
#    inst.serial.rs485_mode = serial.rs485.RS485Settings()
    inst.serial.bytesize = 8
    inst.serial.parity   = serial.PARITY_NONE
    inst.serial.stopbits = 1
    inst.serial.timeout = 1
#    inst.debug = True
#    print inst

fails = [0] * len(deviceId)
while True:
    for index, inst in enumerate(instrument):
        try:
            values = inst.read_registers(1,10,4) # registers from 1 to 10
            
            # for i in range(0, 5):
            #    dbCursor.executemany('INSERT INTO server_values (device_id, value) VALUES (?,?)', [(inst.address*100 + i, values[i])])
            #    dbConn.commit()
            for i in range(0, 10):
                dbCursor.executemany('INSERT OR REPLACE INTO server_values (id, device_id, value) VALUES ((SELECT id from server_values WHERE device_id=(?) ), ?,?)', [(inst.address*100 + i, inst.address*100 + i, values[i])])
                dbConn.commit()
#                print i
                # dbCursor.execute("SELECT * FROM server_values WHERE device_id=(?) ORDER BY id DESC LIMIT 1;", (inst.address*100 + i))
                # if (len(dbCursor.fetchall()) != 0):
                #     for row in dbCursor:
                #         if (row[2] != values[i]):
                #             dbCursor.executemany('INSERT INTO server_values (device_id, value) VALUES (?,?)', [(inst.address*100 + i, values[i])])
                #             dbConn.commit()
                # else:
                #     dbCursor.executemany('INSERT INTO server_values (device_id, value) VALUES (?,?)', [(inst.address*100 + i, values[i])])
                #     dbConn.commit()
        except:
            fails[index] = fails[index] + 1
            print ("Failed to read Device #", inst.address, "fails: ", fails[index])
    time.sleep(0.5)
dbConn.close()
