$(document).ready(function(){

	//firebase info


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDV0Aj3VtUufQMqaxxo18_b0cVKracIRlE",
    authDomain: "rpsdatabase-64d10.firebaseapp.com",
    databaseURL: "https://rpsdatabase-64d10.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var p1choice = "";
  var p2choice = "";
  var p1Stats = [0,0]; //win, lose
  var p2Stats = [0,0];

  //get whats in chat input and print on text area
   $('#chatSend').on('click', function(){

   		var c = $('#chatInput').val().trim();

   		

   		$('#chatLog').text(c)

   		return false;
   });

   $('.P1choice').on('click', function(){

   		console.log(p1choice);
   		if(p1choice == ""){
	   		p1choice = $(this).data('choice');
	   		$('.P1choice').html('<br>');
	   		$('#chosen1').text(p1choice);
   		}
   		if(p2choice != "") playGame();

   });

      $('.P2choice').on('click', function(){

   		console.log(p2choice);
   		if(p2choice == ""){
	   		p2choice = $(this).data('choice');
	   		$('.P2choice').html('<br>');
	   		$('#chosen2').text(p2choice);
   		}
   		if(p1choice != "") playGame();

   });

    function playGame(){
    	if(p1choice == p2choice){
    		$('#results p').text("TIED");
    		p1choice = "";
    		p2choice = "";
    		return;
    	}
    	if( (p1choice == 'rock' && p2choice == 'scissors' )||
    		(p1choice == 'scissors' && p2choice == 'paper' )||
    		(p1choice == 'paper' && p2choice == 'rock')){
    		$('#results p').text("Player 1 wins");

    	}
    	else{
    		$('#results p').text("Player 2 wins");
    	}
    	
    	p1choice = "";
    	p2choice = "";
    }

});