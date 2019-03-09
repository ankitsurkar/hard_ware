/*
*TODO: Let every candidate be an object, read object attributes from csv file.
*/
var imagesCandidateArray = [ "images/candidates/narendra_modi.jpg" , "images/candidates/rahul_gandhi.jpg" , "images/candidates/arvind_kejriwal.jpg" ];
var imagesPartyArray = [ "images/party/bjp.jpg" , "images/party/congress.jpg" , "images/party/aap.jpg" ];
var textCandidateNameArray = [ "Mr. Narendra Modi" , "Mr. Rahul Gandhi" , "Mr. Arvind Kejriwal" ];
var textPartyNameArray = [ "BJP" , "Congress" , "Aam Aadmi Part" ];
var verifCounter = 0;
var currentValue = 0;
var flagPageChange = 0;

var URL='http://localhost:5000';
var DELAY = 5000;
var token;
/*
* For calling init.
* Elements present in index.html
*/
function begin()
{
  var button = document.getElementById("buttonBegin");
  var textStatus = document.getElementById("textInitStatus");
  button.className = "btn btn-primary disabled";

  if(flagPageChange == 1)
  {
    document.location.href = "choice.html";
    return false;
  }

  $.ajax({
        url:(URL+'/init'),
        dataType: 'json',
        type:'get' ,
        success:function(response){
            console.log(response)
            resp = JSON.parse(JSON.stringify(response))
            console.log(resp['all_ok'])
            if(resp['all_ok'] == true)
            {
              textStatus.innerHTML = "ALL OK (redirecting)";
              button.className = "btn btn-primary active";
              flagPageChange = 1;
              setTimeout(function() {
                document.location.href = "choice.html";
              }, DELAY);

            }
            else {
              textStatus.innerHTML = "FAILED";
            }
        },
        error:function(response){
          button.className = "btn btn-primary active";
          textStatus.innerHTML = "FAILED, Try again.";
        }
  });
}

function registerVoter()
{
//  var status=document.getElementById("textStatus");
  //var textStatus = document.getElementById("textVoteStatus");

  $.ajax({
        url:(URL+'/enroll'),
        dataType: 'json',
        type:'get' ,
        success:function(response){
            console.log(response)
            resp = JSON.parse(JSON.stringify(response))
            console.log(resp['is_enrolled'])
            if(resp['is_enrolled'] == true)
            {
              document.getElementById("textStatus").innerHTML = "<strong>Success!</strong>Succesfully enrolled, please wait "+DELAY+" ms";
              setTimeout(function() {
                window.close();
              }, DELAY);
            }
            else {
              document.getElementById("textStatus").innerHTML = "Status: Failed";
              setTimeout(function() {
                  window.close()
                }, DELAY);
            }

        },
        error:function(response){
          document.getElementById("textStatus").innerHTML = "Status: Failed";
          setTimeout(function() {
                  window.close()
                }, DELAY);
        }
  });
}




function proceedButtonHandler() //verify officer and candidate
{

  var textWhoIs = document.getElementById("textWhoIsVerif");
  var textStatus = document.getElementById("textStatusVerif");
  var buttonProceed = document.getElementById("buttonProceed");

  if(verifCounter == 0) //Presiding Officer
  {
    buttonProceed.className = "btn btn-info btn-disabled hidden";
    document.getElementById("textWhoIsVerif").innerHTML = "Fingerprint verification - Officer";
    document.getElementById("textStatusVerif").innerHTML = "Waiting";

    $.ajax({
          url:(URL+'/verify_officer'),
          dataType: 'json',
          type:'get' ,
          success:function(response){
              console.log(response)
              resp = JSON.parse(JSON.stringify(response))
              console.log(resp['is_verified_officer'])
              if(resp['is_verified_officer'] == true)
              {
                token = resp['token'];
                console.log("token is "+resp[token]);
                textStatus.innerHTML = "Status: Succesfully verified";
                sessionStorage.setItem("token",token);
                verifCounter++;
                setTimeout(function() {
                   document.getElementById("textStatusVerif").innerHTML = "Verified Succesfully";
                }, DELAY);
                setTimeout(function() {
                  proceedButtonHandler()
                }, DELAY);
              }
              else {
                //TODO: handle 400 bad response
                textStatus.innerHTML = "Status: Failed";
                setTimeout(function() {
                  window.close()
                }, DELAY);
              }

          },
          error:function(response){
            textStatus.innerHTML = "Status: Failed";
            setTimeout(function() {
                  window.close()
                }, DELAY);
          }
    });


  }
  //candidate verification
  if(verifCounter == 1)
  {
    textWhoIs.innerHTML = "Fingerprint verification - Candidate";
    textStatus.innerHTML = "Waiting";

    $.ajax({
          url:(URL+'/verify_voter/'+token),
          dataType: 'json',
          type:'get' ,
          success:function(response){
              console.log(response);
              resp = JSON.parse(JSON.stringify(response));
              console.log(resp['is_verified_voter']);
              if(resp['is_verified_voter'] == true)
              {
                textStatus.innerHTML = "Status: Succesfully verified, please wait redirecting";
                verifCounter++;
                setTimeout(function() {
                  document.location.href = "votingList.html";
                }, DELAY);
              }
              else {
                status.innerHTML = "Status: Failed";
              }

          },
          error:function(response){
          	resp = JSON.parse(JSON.stringify(response))
            textStatus.innerHTML = "Status : Failed";
            setTimeout(function() {
                  window.close()
                }, DELAY);
          }
    });
  }


  return false;
}

function nextButtonClick()
{
  currentValue += 1;
  if(currentValue > 2)
  {
    currentValue = 0;
  }

  document.getElementById("candidateImage").src = imagesCandidateArray[currentValue];
  document.getElementById("partyImage").src = imagesPartyArray[currentValue];
  document.getElementById("candidateName").innerHTML = textCandidateNameArray[currentValue];
  document.getElementById("partyName").innerHTML = textPartyNameArray[currentValue];

  return false;
}

function prevButtonClick()
{
  currentValue -= 1;

  if(currentValue < 0)
  {
    currentValue = 2;
  }

  document.getElementById("candidateImage").src = imagesCandidateArray[currentValue];
  document.getElementById("partyImage").src = imagesPartyArray[currentValue];
  document.getElementById("candidateName").innerHTML = textCandidateNameArray[currentValue];
  document.getElementById("partyName").innerHTML = textPartyNameArray[currentValue];

  return false;
}

function submitVote(id)
{
  var buttonText = id;
  var textForAPI = ["BJP" , "CONG" , "AAP"];
  if(buttonText == "submitVoteNAMO") {
    textForAPI = "BJP";
  }
  else if(buttonText == "submitVoteCONG") {
    textForAPI = "CONG";
  }
  else if(buttonText == "submitVoteAAP") {
    textForAPI = "AAP";
  }
  document.getElementById(buttonText).hidden = true
  token = sessionStorage.getItem('token');

  $.ajax({
        url:(URL+'/cast_vote/'+token+'/'+textForAPI),
        dataType: 'json',
        type:'get' ,
        success:function(response){
            console.log(response);
            resp = JSON.parse(JSON.stringify(response));
            console.log(resp['vote_cast']);
            if(resp['vote_cast'] == true)
            {
              document.getElementById("textVoteStatus").className = "alert alert-success";
              document.getElementById("textVoteStatus1").className = "alert alert-success";
              document.getElementById("textVoteStatus2").className = "alert alert-success";
              document.getElementById("textVoteStatus1").innerHTML = "<strong>Success!</strong> Vote casted";
	      document.getElementById("textVoteStatus2").innerHTML = "<strong>Success!</strong> Vote casted";

              setTimeout(function() {
                window.close();
              }, DELAY+5000);
            }
            else {
              document.getElementById("textVoteStatus").innerHTML = "<strong>Failed</strong>";
              document.getElementById("textVoteStatus1").innerHTML = "<strong>Failed</strong>";
              document.getElementById("textVoteStatus2").innerHTML = "<strong>Failed</strong>";
              

	      setTimeout(function() {
                window.close();
              }, DELAY+5000);

            }
        },
        error:function(response){
            document.getElementById("textVoteStatus").className = "alert alert-danger";
            document.getElementById("textVoteStatus1").className = "alert alert-danger";
            document.getElementById("textVoteStatus2").className = "alert alert-danger";
            document.getElementById("textVoteStatus").innerHTML = "<strong>Failed</strong>";
            document.getElementById("textVoteStatus1").innerHTML = "<strong>Failed</strong>";
            document.getElementById("textVoteStatus2").innerHTML = "<strong>Failed</strong>";
              
	     setTimeout(function() {
              window.close();
            }, DELAY+5000);

        }
  });
}
