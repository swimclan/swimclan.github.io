$(document).ready(function() {
  //log that the document is ready
  console.log("All resources are loaded");
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
});

//Here is your app's namespace so you dont collide with the global scope!
var app = app || {};

//Here is the create form data object function definition
app.createFormObject = function() {
  var retJson = new Object();

  retJson.userName = $('#user_name').val();
  // console.log(retJson.username);
  retJson.userEmail = $('#user_email').val();
  retJson.request = $('#user_request').val();
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
