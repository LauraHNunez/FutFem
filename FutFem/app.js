$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    // questions options and answers data
    questions: {
      q1: 'Jugadora española en ganar 2 balones de Oro?',
      q2: 'Jugadora holandesa, que su sueño es jugar en el Barça?',
      q3: 'Cuantas veces ha ganado el Olimpique de Lyon la Champions?',
      q4: 'Cual fue el resultado del partido barça-wolfsburgo en el camp Nou?',
      q5: "Quien es actualmente la jugadora con mas partidos en el Barça)",
      q6: 'Una leyenda del Olimpique de lyon y la seleccion francesa?',
      q7: "Cual es el record de asistencia a un partido de futbol femenino?",
      q8: "Con que entrenador el barça ganó el triplete?",
      q9: "Jugadora del Atletico de Madrid que ha superado un cancer y volvió al campo en la final de la supercopa de 2022?",
      q10: "En que ciudad ganó el Barcelona su primera champions?",
      q11: "Como se llama el/la seleccionador/a que llevó a Holanda i Inglaterra a ser las campeonas de la Euro2017(Holanda), Euro2022(Inglaterra)?",
      q12: "Primera ganadora del balón de oro femenino en 2018?"
    },
    options: {
      q1: ['Alexia Putellas', 'Ada Hegerberg', 'Megan Rapinoe', 'Marta Da Silva'],
      q2: ['Danielle Van Donk', 'Jill Roord', 'Claudia Pina', 'Lina Magull'],
      q3: ['5', '2', '1', '8'],
      q4: ['3-2', '5-1', '2-1', '1-1'],
      q5: ['Melanie Serrano','Sandra Paños','Laura Rafols','Vicky Losada'],
      q6: ['Wendie Renard','Delphine Cascarino','Christine Endler','Linsey Horan'],
      q7: ['91.553', '91.648', '60.063','87.192'],
      q8: ['Jorge Vilda', 'Lluis Cortés', 'Jonathan Giràldez','Xavier Puig'],
      q9: ['Virginia Torrecilla', 'Andrea Medina', 'Angela Sosa','Carmen Menayo'],
      q10: ['Turín', 'Budapest', 'Gotteborg','Eindhoven'],
      q11: ['Sarina Weigman', 'Sonia Bompastor', 'Vlatko Andonovski','Pia Sundhage'],
      q12: ['Alexia Putellas', 'Ada Hegerberg', 'Megan Rapinoe', 'Marta Da Silva']
    },
    answers: {
      q1: 'Alexia Putellas',
      q2: 'Jill Roord',
      q3: '8',
      q4: '5-1',
      q5: 'Melanie Serrano',
      q6: 'Wendie Renard',
      q7: '91.648',
      q8: 'Lluis Cortés',
      q9: 'Virginia Torrecilla',
      q10: 'Gotteborg',
      q11: 'Sarina Weigman',
      q12: 'Ada Hegerberg'
    },
    
    // trivia methods
    // method to initialize game
    startGame: function(){
      // restarting game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $('#game').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);
      
      // remove start button
      $('#start').hide();
  
      $('#remaining-time').show();
      
      // ask first question
      trivia.nextQuestion();
      
    },
    // method to loop through and display questions and options 
    nextQuestion : function(){
      
      // set timer to 20 seconds each question
      trivia.timer = 10;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      // to prevent timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // an array of all the user options for the current question
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // creates all the trivia guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // the time has run out and increment unanswered, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // if all the questions have been shown end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Thank you for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please play again!</p>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button to begin a new game
        $('#start').show();
      }
      
    },
    // method to evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // turn button clicked red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
      }
      
    },
    // method to remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      trivia.currentSet++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // begin next question
      trivia.nextQuestion();
       
    }
  
  }