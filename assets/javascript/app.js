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

	var playerCount = 1;
	var database = firebase.database();
	var p1choice = "";
	var p2choice = "";
	var p1Stats = [0,0]; //win, lose
	var p2Stats = [0,0];
	var rps = ['rock', 'paper', 'scissors'];
  	

	$('#nameSend').on('click', function(){

		var player = $('#playerName').val().trim();

		database.ref()
			.child('player')
			.push('1')
			.set({
				name: player,
				win: 0,
				lose: 0 
			});

		$('#playerInput').hide();

	});



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