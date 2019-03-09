import requests
import json

def put_data(rfid_val,amount):
	url = 'http://10.44.15.94:8000/olps/transact'
	header = {"Authorization": "", "Content-Type":"application/json"}
	Data = {
	"rfid":{
		"rfid_value": "",
		"label": "First label",
		"is_enabled": "false",
		"disability_reason": "None"
	},
	"pos":{ 
		"api_key":"82209121725a48fe1fb0af7da4c599c4b4f689f7",
		"label": "My device",
		"is_enabled": "true"
	},
	"amount":0,
	"lat":1.2,
	"lan":1.2
	}
	Data["amount"]=amount
	Data["rfid"]["rfid_value"]=rfid_val

	# Adding empty header as parameters are being sent in payload

	r = requests.post(url, data=json.dumps(Data), headers=header)

	print(r.content)
        return r.content 
		
