$(document).ready(function(){
//$('#playerInput').hide();
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
	var playerNum = 0;
	var clientNum = 0;
	var checkPlayer1 = false;
	var checkPlayer2 = false;
	var gameOn = false;
	var playersTurn = 0;


	database.ref().on("value", function(snap){

		//checks if players exists
		checkPlayer1 = snap.child('player/1').exists();
		checkPlayer2 = snap.child('player/2').exists();
		checkTurns = snap.child('turns').exists();
		if(checkPlayer1 && checkPlayer2 && gameOn){
			var p1chosen = snap.child('player/1').val().chosen;
			var p2chosen = snap.child('player/2').val().chosen;
		}

		//update guest text
		if(clientNum == 1)
			$('#playerGreeting').text('Hi, '+snap.child('player/1').val().name+'! You are player 1');
		else if(clientNum == 2)
			$('#playerGreeting').text('Hi, '+snap.child('player/2').val().name+'! You are player 2');
		else
			$('#playerGreeting').text('Hi Guest!');

		//displays who's turn it is
		if(checkPlayer1 && checkPlayer2 && checkTurns){
			playersTurn = snap.child('turns').val();
			if(clientNum == playersTurn){
				$('#playerStatus').text("It's your turn");
			}
			else{
				$('#playerStatus').text("Waiting for "+ snap.child('player/'+playersTurn).val().name +" to choose.")
			}
		}

		//display info in play area
		if(checkPlayer1){
			
			$('#P1Name').text(snap.child('player/1').val().name);
			if(!gameOn)clearChoices(1);
			$('#P1-Score').text('Wins: '+snap.child('player/1').val().win+' Loses: '+snap.child('player/1').val().lose);
		}
		
		if(checkPlayer2){
			
			$('#P2Name').text(snap.child('player/2').val().name);
			if(!gameOn)clearChoices(2);
			$('#P2-Score').text('Wins: '+snap.child('player/2').val().win+' Loses: '+snap.child('player/2').val().lose);
		}
		
		//detrmines which player object will be made
		if(!checkPlayer1){
			playerNum = 1;
		}
		else if(!checkPlayer2){
			playerNum = 2;
		}

		//only show when players are needed
		if(!(checkPlayer1 && checkPlayer2)) $('#playerInput').show();


		//sets turn counter and choices
		if(!gameOn && checkPlayer1 && checkPlayer2){
			database.ref('turns').set(1);

			if(clientNum != 0){
				displayChoices(clientNum);
			}

			gameOn = true;
		}
		//turns off turn counter
		if(!(checkPlayer1 && checkPlayer2))
		{
			database.ref('turns').set(null);
			gameOn = false;
		}

		//game
		if(gameOn && p1chosen != undefined && p2chosen != undefined){
			//stop firebase from looping
			database.ref('player/1').update({chosen: null});
			database.ref('player/2').update({chosen: null});

			if(p1chosen == p2chosen){
				console.log('tied');
				p1chosen = undefined;
				p2chosen = undefined;
			}
			else if((p1chosen == "rock" && p2chosen == "scissors") || 
					(p1chosen == "paper" && p2chosen == "rock") || 
					(p1chosen == "scissors" && p2chosen == "paper")){
				//p1 wins
				console.log('Player 1 wins');
				p1chosen = undefined;
				p2chosen = undefined;
				console.log(snap.child('player/1').val().win);
				var temp1 = snap.child('player/1').val().win;
				var temp2 = snap.child('player/2').val().lose;
				temp1++;
				temp2++;
				console.log(temp1);

				database.ref('player/1').update({win: temp1});
				database.ref('player/2').update({lose: temp2});

				//database.ref('player/2').update({lose: snap.child('player/2').val().lose++}); 

			}
			else{
				console.log('Player 2 wins');
				p1chosen = undefined;
				p2chosen = undefined;
				console.log(snap.child('player/2').val().win);
				var temp1 = snap.child('player/2').val().win;
				var temp2 = snap.child('player/1').val().lose;
				temp1++;
				temp2++;
				console.log(temp1);

				database.ref('player/2').update({win: temp1});
				database.ref('player/1').update({lose: temp2});
				//database.ref('player/2').update({win: snap.child('player/2').val().win++}); 
				//database.ref('player/1').update({lose: snap.child('player/1').val().lose++}); 
			}
		}

	}, 
		//catch any problems in firebase
		function(errorObj){
		console.log("Something went horibly wrong! Error Code: " + errorObj.code);
	})

	//submits player info
	$('#nameSend').on('click', function(){
		clientNum = playerNum;
		var newPlayer = database.ref('player').child(playerNum);

		newPlayer.onDisconnect().remove();

		newPlayer.set({
			name: $('#playerName').val().trim(),
			win: 0,
			lose:0
		})

		$('#playerInput').hide();

	})
  	
	$('.P1choice').on('click', function(){
		if(1 == clientNum && clientNum == playersTurn){
			database.ref('player/1').update({chosen: $(this).data('choice')});
			displayChosen(1, $(this).data('choice'));
			database.ref('turns').set(2);
		}
	})

	$('.P2choice').on('click', function(){
		if(2 == clientNum && clientNum == playersTurn){
			database.ref('player/2').update({chosen: $(this).data('choice')});
			displayChosen(2, $(this).data('choice'));
		}
	})



  	//clears out choices
  	function clearChoices(player){
  		for(var i = 1; i <= 3; i++){
  			$('#P'+player+'-'+i).html('<br>');
  		}
  	}

  	//displays all choices
  	function displayChoices(player){
  		for(var i = 1; i <= 3; i++){
  			$('#P'+player+'-'+i).text($('#P'+player+'-'+i).data('choice'));
  		}
  	}

  	//display player's choice
  	function displayChosen(player, choice){

  		clearChoices(player);
  		$('.chosen'+player).text(choice);
  	}
  	
  	function playGame(){

  	}

});