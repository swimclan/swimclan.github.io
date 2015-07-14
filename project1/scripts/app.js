$(document).ready(function() {

  console.log("All resources are loaded");
  $('#form_send').on('click', function() {
    var formdata = app.createFormObject();
    console.log('Clicked the submit button...');
  });
});

var app = app || {};

app.createFormObject = function() {
  var retJson = new Object();

  retJson.username = $('#user_name').val();
  console.log(retJson.username);
  retJson.email = $('#user_email').val();
  retJson.request = $('#user_request').val();

  console.log(retJson);

  return retJson;
}
