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
	var playerNum = 0;			//firebase use this to designate a player
	var clientNum = 0;			//lets the client internally know what player it is
	var checkPlayer1 = false;	//check if player 1 exist
	var checkPlayer2 = false;	//check if player 2 exists
	var gameOn = false;			//lets firebase know if game is stared
	var playersTurn = 0;		//used for client to keep track of turns
	var chatName = 'Guest'+Math.round(Math.random()*100000);	//generate guest number for watchers

	//chat listener
	database.ref('chat').on("child_added", function(snapChat){
				var line = snapChat.val();
				console.log(line);
				$('<div>').text(line.chatName +": "+line.chatMessage).appendTo($('#chatLog'));


			}, function(errObj){console.log("Something went horribly wrong in chat! ErrorCode: "+errObj.code)})

	//firebase listener (root)
	database.ref().on("value", function(snap){



		//checks if players exists
		checkPlayer1 = snap.child('player/1').exists();
		checkPlayer2 = snap.child('player/2').exists();
		doesBothExist = (checkPlayer1 && checkPlayer2);
		checkTurns = snap.child('turns').exists();
		//store chosen value if both players are playing
		if(checkPlayer1 && checkPlayer2 && gameOn){
			var p1chosen = snap.child('player/1').val().chosen;
			var p2chosen = snap.child('player/2').val().chosen;
		}


		//update guest text depending on client status
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
		//displays waiting status
		else{
			if(clientNum == 1){
				$('#playerStatus').text("Waiting for Player 2 to join");
			}
			else if(clientNum == 2){
				$('#playerStatus').text("Waiting for Player 1 to join");
			}
			else {
				$('#playerStatus').text("Waiting for a Player to join")
			}
		}

		//display info in Player1's play area
		if(checkPlayer1){
			
			$('#P1Name').text(snap.child('player/1').val().name);
			if(!gameOn)clearChoices(1);
			$('#P1-Score').text('Wins: '+snap.child('player/1').val().win+' Loses: '+snap.child('player/1').val().lose);
		}
		else{
			$('#P1Name').text("Waiting for Player 1");
			if(!gameOn)clearChoices(1);
			$('#P1-Score').empty();
		}
		
		//display info in Player2's play area
		if(checkPlayer2){
			
			$('#P2Name').text(snap.child('player/2').val().name);
			if(!gameOn)clearChoices(2);
			$('#P2-Score').text('Wins: '+snap.child('player/2').val().win+' Loses: '+snap.child('player/2').val().lose);
		}
		else{
			$('#P2Name').text("Waiting for Player 2");
			if(!gameOn)clearChoices(2);
			$('#P2-Score').empty();
		}
		
		//detrmines which player object will be made
		if(!checkPlayer1){
			playerNum = 1;
		}
		else if(!checkPlayer2){
			playerNum = 2;
		}

		//only show when players are needed
		if(clientNum == 0 && !(checkPlayer1 && checkPlayer2)) $('#playerInput').show();
		else $('#playerInput').hide();


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

		//game logic
		if(gameOn && p1chosen != undefined && p2chosen != undefined){	//checks if game is on and both player picked something
			
			//stop firebase from looping into infinity
			database.ref('player/1').update({chosen: null});
			database.ref('player/2').update({chosen: null});

			//if tied
			if(p1chosen == p2chosen){
				console.log('tied');
				$('#results').text('TIED!')
				//empty chosens just in case
				p1chosen = undefined;
				p2chosen = undefined;
			}//end of ties
			//when player 1 wins
			else if((p1chosen == "rock" && p2chosen == "scissors") || 
					(p1chosen == "paper" && p2chosen == "rock") || 
					(p1chosen == "scissors" && p2chosen == "paper")){
				//p1 wins
				console.log('Player 1 wins');
				$('#results').text(snap.child('player/1').val().name + " Wins!"); //declare the winner
				//empty chosens just in case
				p1chosen = undefined;	
				p2chosen = undefined;
				console.log(snap.child('player/1').val().win);
				var temp1 = snap.child('player/1').val().win;	//get player 1 wins
				var temp2 = snap.child('player/2').val().lose;	//get player 2 loses
				temp1++;	//increment wins
				temp2++;	//increment loses
				console.log(temp1);

				database.ref('player/1').update({win: temp1});	//update player 1 database
				database.ref('player/2').update({lose: temp2});	//update player 2 database

			}//end of player 1 wins
			//when player 2 wins
			else{
				console.log('Player 2 wins');
				$('#results').text(snap.child('player/1').val().name + " Wins!");
				//empty chosens just in case
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
				
			}//end of player 2 win

			//lets display sit on screen for a bit then start another round
			setTimeout(function(){
				$('#results').text('');
				database.ref('turns').set(1);
				displayChoices(clientNum);

			}, 3000);

		}//end of game logic

	}, 
		//catch any problems in firebase
		function(errorObj){
		console.log("Something went horibly wrong! Error Code: " + errorObj.code);
	});//end of fire base listener

	

	//submits player info
	$('#nameSend').on('click', function(){
		clientNum = playerNum;
		var newPlayer = database.ref('player').child(playerNum);

		newPlayer.onDisconnect().remove();
		chatName = $('#playerName').val().trim();
		newPlayer.set({
			name: chatName,
			win: 0,
			lose:0
		})

		$('#playerInput').hide();

	})
  	
  	//player 1 click handler
	$('.P1choice').on('click', function(){
		if(1 == clientNum && clientNum == playersTurn){
			database.ref('player/1').update({chosen: $(this).data('choice')});
			displayChosen(1, $(this).data('choice'));
			database.ref('turns').set(2);
		}
	})

	//player 2 click handler
	$('.P2choice').on('click', function(){
		if(2 == clientNum && clientNum == playersTurn){
			database.ref('player/2').update({chosen: $(this).data('choice')});
			displayChosen(2, $(this).data('choice'));
		}
	})

	//chat button handler
	$('#chatSend').on('click', function(){

		var message = $('#chatInput').val().trim();
		database.ref('chat').push({'chatName': chatName, 'chatMessage': message});
		$('#chatInput').val('');

	})

	//need to figure out how and where to use this...
	function disconnectMessage(playerName){
		$('<div>').text(playerName +" has disconnected").appendTo($('#chatLog'));
	}

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
  	
});