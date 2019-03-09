import requests
import json
import RPi.GPIO as GPIO
import SimpleMFRC522

def get_data():
	url = 'http://10.44.15.94:8000/olps/write'
	try:
		r = requests.get(url)
	except Exception as e:
		print e
		
	#print(r.status_code)
	#print(json.loads(r.content)["rfid_value"])
        if r.status_code is 200:
                return json.loads(r.content)['rfid_value'] 
        else:
                return  None

def write_data():
	reader = SimpleMFRC522.SimpleMFRC522()
	
	try:
		print(" Getting RFID value from  server..." )
	        text = get_data() 
                if text is not None:
                        print(" Now place your tag to write RFID value... ")
	                reader.write(text)
                        print(" Data written... RFID tag is: "+ text)
                else:
                        print(" No pending RFID tags to write ")
	except Exception as e:
		print( e )
	finally:
	        GPIO.cleanup()

		
if __name__=="__main__":
	write_data()
	
  
