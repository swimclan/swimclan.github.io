$(document).ready(function() {
  //log that the document is ready
  console.log("All resources are loaded");

  //hide the marketing plugs
  $('.blurb p').hide();
  $('#passion').show();

  //hide the employee bios
  $('.bio').hide();
  $('#ceo').show();

  //hide your spinner, success message and error message divs
  $('.loading').hide();
  $('.error').hide();
  $('.success').hide();
  //on the click of the form submit button, generate the form data object and bind it to app
  $('#form_send').on('click', function() {
    var formdata = app.createFormObject();
    //log every action!
    console.log('Clicked the submit button...');
    app.sendEmail(formdata);
  });

  $('.project').on('click', function() {
    var currentMake = $(this).data('make');
    var description = $('#' + currentMake).text();
    app.typeDescription(description);
  });

  //show the marketing plugs on each mouse over
  $('.imgblock').on('mouseenter', function() {
    var $thisID = $(this).data('plug');
    $('.blurb p').hide();
    $('#' + $thisID).fadeIn(400);
  });

  //auto scroll down from the nav items
  $('nav a').on('click', function(e) {
    var navHeight = $('header').height();
  	e.preventDefault();
  	linkTo = this.hash;
  	var scrollToHash = $(linkTo).offset().top - navHeight;
  	$('html, body').animate({
  		scrollTop: scrollToHash
  	}, 600, 'swing');
  });

  //on click of the employees, show their bio
  $('.person').on('click', function() {
    var title = $(this).data('title');
    $('.bio').hide();

    console.log(title);
    $('#' + title).fadeIn(400);

  });

});

//Here is your app's namespace so you dont collide with the global scope!
var app = app || {};

//Here is the create form data object function definition
app.createFormObject = function() {
  var retJson = new Object();

  retJson.userFirstName = $('#user_first_name').val();
  retJson.userLastName = $('#user_last_name').val();
  retJson.userName = retJson.userFirstName + ' ' + retJson.userLastName
  // console.log(retJson.username);
  retJson.userEmail = $('#user_email').val();
  retJson.request = $('#user_notes').val();
  retJson.systems = new Object();
  //just get used to console logging the results of your functions
  console.log(retJson);
  //of course, return it all
  return retJson;
}


app.sendEmail = function(emaildata) {
  $('.loading').show();
  var ajaxData = {
    url: "http://imperialholonet.herokuapp.com/api/mail",
    type: 'POST',
    data: emaildata,
    success: function(data) {
      console.log(data);
      $('.loading').hide();
      $('.success').show();
    },
    error: function(err) {
      console.log(err);
      $('.loading').hide();
      $('.error').show();
    }
  }
  //You actually need to execute the AJAX call!!!! DO NOT FORGET THIS....
    $.ajax(ajaxData);
}

app.typeDescription = function(msg) {
  //initialize counter
  var i = 0;
  //define text
  var text = msg;
  //reset the description screen
  $('.description .typer').html("");
  //text is split up to letters
  $.each(text.split(''), function(i, letter){

      //we add 100*i ms delay to each letter
      setTimeout(function(){

          //we add the letter to the container
          $('.description .typer').html($('.description .typer').html() + letter);

      }, 50 * i);
  });
}
