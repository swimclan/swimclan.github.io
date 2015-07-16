$(document).ready(function() {
  //log that the document is ready
  console.log("All resources are loaded");

  //set mobile nav state to false (menu not mobile)
  app.mobileNav = false;

  //setup Google Maps location options
  app.mapOptions = {
    chicago: {
      center: new google.maps.LatLng(41.891653, -87.632470),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    losangeles: {
      center: new google.maps.LatLng(33.836251, -118.338172),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    lasvegas: {
      center: new google.maps.LatLng(36.181136, -115.123630),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    brooklyn: {
      center: new google.maps.LatLng(40.703242, -73.990854),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
  }

  //initialize Google maps and markers objects
  app.maps = new Object();
  app.markers = new Object();

  //render default map to Chicago
  app.renderGoogleMap('chicago');

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
  //make the mobile nav work
  $('.hamburger li').on('click', function() {
    if (!app.mobileNav) {
      $(this).css('top', '-430px');
      $('.nav-links').show();
      $(this).html('&times;');
      app.mobileNav = true;
    } else {
      $(this).css('top', '-103px');
      $('.nav-links').hide();
      $(this).html('&equiv;');
      app.mobileNav =  false;
    }
  });

  $('.navlinks li, .nav-links a').on('click', function() {
    if (app.mobileNav) {
      console.log(app.mobileNav);
      $('.nav-links').hide();
      app.mobileNav = false;
      $('.hamburger li').css('top', '-100px');
      $('.hamburger li').html('&equiv;')
    }
  });

  //Google maps tab selector
  $('.tabs button').on('click', function() {
    var locale = $(this).data('location');
    //set the highlighted tab
    $('.tabs button').css('border-top', '5px solid rgb(106, 117, 208)')
    $(this).css('border-top', '5px solid rgb(136, 147, 238)')
    //render the correct Google Map with Marker
    app.renderGoogleMap(locale);
  });

  //if the user resizes the window make sure the we get the nav items back
  $(window).resize(function () {
  	if ($(window).width() >= 890) {
  		$('.nav-links').show();
      app.mobileNav = false;
  	} else if ($(window).width() < 890) {
      $('.nav-links').hide();
      app.mobileNav = false;
      $('.hamburger li').html('&equiv;')
    }
  });

  //populate the 'choose system' dropdown from AJAX api call
  app.getComputersList();

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

app.renderGoogleMap = function(location) {
  //draw first
  app.maps[location] = new google.maps.Map($('#mapCanvas')[0], app.mapOptions[location]);

  app.markers[location] = new google.maps.Marker({
      position: app.mapOptions[location].center,
      map: app.maps[location],
      title: '4K Restorations: ' + location
  });

  //set the marker on chicago location as default
  app.markers[location].setMap(app.maps[location]);
}

app.getComputersList = function() {
  var ajaxData = {
    url: 'data/computers.json',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      for (var item in data) {
        console.log(data[item].system);
        $('#computer_model').append('<option>' + data[item].system + '</option>');
      }
    },
    error: function(err) {
      console.log(err);
    }
  }
  $.ajax(ajaxData);
}
