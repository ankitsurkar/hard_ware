from flask import Flask, render_template, request, make_response, jsonify
import webbrowser

import RPi.GPIO as GPIO
import SimpleMFRC522
from api import put_data
import json

reader = SimpleMFRC522.SimpleMFRC522()


app = Flask(__name__)



app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

_fare = " "
_status = " "

 
@app.route("/", methods=['GET', 'POST'])
def homepage():
	return render_template('index.html',fare=_fare, status=_status)



@app.route("/transact")
def process():
	#process rfid code
	
	try:
	        id, text = reader.read()
	        print(id)
	        print(text)
		
		data = put_data(text, int(request.args.get('fare')))
		
                data = json.loads(data)
            	txn_status = data['txn_status']
		
		return txn_status
	
	except Exception as e:
		print (e)
		return "error"
	
	        


if __name__ == "__main__":
	url = 'http://127.0.0.1:5000'
 	webbrowser.open_new(url)
    	try:
		app.run()
	except Exception as e:
		print(e)
		GPIO.cleanup()

