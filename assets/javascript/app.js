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
	var connectedRef = database.ref('.info/connected');
	var connectionsRef = database.ref('/connections');
	var p1choice = "";
	var p2choice = "";
	var p1Stats = [0,0]; //win, lose
	var p2Stats = [0,0];
	var rps = ['rock', 'paper', 'scissors'];
	var player1Exists = false;
	var player2Exists = false;
	var currentPlayer = 0;
  	var playerCount = 0;
  	//creating xor function
  	function XOR(a,b){
  		return (a && !b) || (b && !a)
  	}


  	//check player values---------------------------------------------------------------------------------------
	database.ref('player').on("value", function(snapShot){
		
		//console.log(snapShot.val());

		player1Exists = snapShot.child('1').exists();//checks player 1's existance
		player2Exists = snapShot.child('2').exists();//checks player 2's existance

		//keeps track of number of players
		if(player1Exists && !player2Exists){
			playerCount = 2;
			
		}
		else if(!player1Exists){
			playerCount = 1;
			
		}

		//if not enough players
		if(player1Exists && player2Exists) 
  			database.ref('turns').set(1);
  		else{
  			database.ref('turns').set(null);
  		}


		if(currentPlayer == 0 && !player1Exists ||  XOR(player2Exists,  player1Exists)) 
			$('#playerInput').show();
		
		//---------------------------
		

	}, 
	function(errorObj){console.log(errorObj.code)});
	//--------------------------------------------------------------------------------


	//set player
	$('#nameSend').on('click', function(){
		console.log(playerCount);
		currentPlayer = playerCount;
		var playerName = $('#playerName').val().trim();

		players = database.ref('/player');

			
		
		//
		connectedRef.on("value", function(snap){

  		if(snap.val()){
  			
  			var con = players.child(playerCount).push({

			name: playerName,
			win: 0,
			lose: 0

		});

  			con.onDisconnect().remove();
  			console.log(player1Exists, player2Exists);
  			

  		}


  	}, function(err){});

			//console.log(player1Exists);
		if(player1Exists && player2Exists) database.ref().child('turns').set(1);
		$('#playerInput').hide();
		




	});



  	//get whats in chat input and print on text area
	$('#chatSend').on('click', function(){

		var c = $('#chatInput').val().trim();
		var chat = database.ref().child('chat').push(c);
		$('#chatInput').val('');
		//$('#chatLog').text(c)

		return false;
	});

	$('.P1choice').on('click', function(){

		console.log(p1choice);
		if(p1choice == ""){
			p1choice = $(this).data('choice');
			$('.P1choice').html('<br>');
			$('.chosen1').text(p1choice);
		}
		if(p2choice != "") playGame();

	});

	$('.P2choice').on('click', function(){

		console.log(p2choice);
		if(p2choice == ""){
			p2choice = $(this).data('choice');
			$('.P2choice').html('<br>');
			$('.chosen2').text(p2choice);
		}
		if(p1choice != "") playGame();

	});

	function setP1Game(){
		
		for(var i = 0; i < rps.length; i++){
			$('#P1-'+(i+1)).text($('#P1-'+(i+1)).data('choice'));
			/*$('<p>')
				.attr('id', 'P1-'+i)
				.addClass('choice')
				.data('choice', rps[i])
				.text(rps[i])
				.appendTo($('#player1'));*/

		}
		
		$('#P1-Score')
			.html('Wins: <span class="P1Wins">'+p1Stats[0]+'</span> Loses: <span class="P1Loses">'+p1Stats[1]+'</span>')
			
		
	}

	function setP2Game(){
		
		for(var i = 0; i < rps.length; i++){
			$('#P2-'+(i+1)).text($('#P1-'+(i+1)).data('choice'));
			
			/*$('<p>')
				.attr('id', 'P1-'+i)
				.addClass('choice')
				.data('choice', rps[i])
				.text(rps[i])
				.appendTo($('#player1'));*/

		}
		$('#P2-Score')
			.html('Wins: <span class="P2Wins">'+p2Stats[0]+'</span> Loses: <span class="P2Loses">'+p2Stats[1]+'</span>')
		
	}

    setP1Game();
    setP2Game();
    
    //run the comparison game
    function playGame(){
    	if(p1choice == p2choice){
    		$('#results p').text("TIED");
    		
    	}
    	else if( (p1choice == 'rock' && p2choice == 'scissors' )||
    		(p1choice == 'scissors' && p2choice == 'paper' )||
    		(p1choice == 'paper' && p2choice == 'rock')){
    		$('#results p').text("Player 1 wins");
    		p1Stats[0]++;
    		p2Stats[1]++;

    		$('#P1-Score')
			.html('Wins: <span class="P1Wins">'+p1Stats[0]+'</span> Loses: <span class="P1Loses">'+p1Stats[1]+'</span>')

			$('#P2-Score')
			.html('Wins: <span class="P2Wins">'+p2Stats[0]+'</span> Loses: <span class="P2Loses">'+p2Stats[1]+'</span>')


    	}
    	else{
    		$('#results p').text("Player 2 wins");
    		p1Stats[1]++;
    		p2Stats[0]++;

    		$('#P1-Score')
			.html('Wins: <span class="P1Wins">'+p1Stats[0]+'</span> Loses: <span class="P1Loses">'+p1Stats[1]+'</span>')

			$('#P2-Score')
			.html('Wins: <span class="P2Wins">'+p2Stats[0]+'</span> Loses: <span class="P2Loses">'+p2Stats[1]+'</span>')

    	}
    	
    	p1choice = "";
    	p2choice = "";

    	setTimeout(function(){
    		setP1Game();
    		setP2Game();

    	}, 3000);
    }

});