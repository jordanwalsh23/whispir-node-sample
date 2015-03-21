var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);

//Start the process
var port = Number(process.env.PORT || 3000);

console.log("port is: " + port);

server.listen(port, function(){
  console.log('listening on *:'+port);
});

//Functions
var data = {
  "recipients" : "<number>",
  "subject" : "<subject>",
  "msg" : "<body>"
};

sendMessage(data);

/*
DATA Format
{
  "recipients" : "<recipient list>"
  "subject" : "<message subject>"
  "msg" : "<message content>"
}
*/
function sendMessage(data) {

    var username = "<REPLACEME>";
    var password = "<REPLACEME>";
    var apikey = "<REPLACEME>";

    // the post options
    var post = {
        host : 'api.whispir.com',
        port : 80,
        path : '/messages?apikey='+apikey,
        method : 'POST',
        headers : prepareHeaders(username, password)
    };

    // do the POST call
    var reqPost = http.request(post, function(res) {
        console.log("statusCode: ", res.statusCode);
        // uncomment it for header details
        console.log("headers: ", res.headers);
     
        res.on('data', function(d) {
            console.info('POST result:\n');
            process.stdout.write(d);
            console.info('\n\nPOST completed');
        });
    });

    var request = prepareRequest(data);

    console.log('request is: ' + request);
     
    // write the json data
    reqPost.write(request);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
    });
}


function prepareRequest(data) {

  var recipients = data.recipients;
  var message = data.msg;
  var subject = data.subject;

  jsonObject = JSON.stringify({
      "to" : recipients,
      "subject" : subject,
      "body" : message
  });

  return jsonObject;
}

function prepareHeaders(username, password) {
  
  var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
  // prepare the header
  var postheaders = {
      'Content-Type' : 'application/vnd.whispir.message-v1+json',
      'Authorization' : auth
  };

  return postheaders;
}