/*
*TODO: Let every candidate be an object, read object attributes from csv file.
*/
window.onload=setfare;
function transact() 
{

    	var status_text =document.getElementById('status')
	status_text.innerHTML="Swipe Your RFID"

    	$.ajax({
	 	url:('http://localhost:5000/transact'),
          	dataType: 'text',
          	type:'get' ,
		data:
		{
			"fare":document.getElementById('fare').innerHTML
		},
		
          	success:function(response){
	      		status_text.innerHTML=response
          	},
          	error:function(response){
          		console.log(response)
			status_text.innerHTML='Application Error';
          	}
    	});
  
  	return false;
}

function setfare() 
{
	var fare_text = document.getElementById('fare')
	document.getElementById('status').innerHTML = ""
	var destination = document.getElementById('destination')
	
	var map = {'shivaji_nagar':10, "kothrud":5,
		'pimpri': 20,'chinchwad':25,'akurdi':30,'nigdi':35}
	
	var fare = map[destination.value]
	fare_text.innerHTML =  fare
}


