const express = require('express');
const mongo = require('mongodb').MongoClient;

var app = express();

app.get('/', (request, response) => {
  response.send('Please append a URL to the URL to recieve a shortened form.');
});

app.get("/:inputURL(https://*.*|http://*.*)", (request, response) => { 
  var input = request.params.inputURL;
  
  if (input != 'favicon.ico') {
    
    console.log('input: ', input);
    console.log('inside /:inputURL');
    mongo.connect('mongodb://dsoucie:devpassword@ds161164.mlab.com:61164/url-shortener-microservice-dsoucie', (error, db) => {
      db.collection('myCol').find({
        inputURL: input,
      }).toArray( (error, documents) => {
        if (documents.length == 0) {
          db.collection('myCol').insert({
            inputURL: input,
          });
          response.send('this not found');
        } else {
          response.json(documents);
        }
      })
    })

  }


});

app.get('*', (request, response) => {
  response.send('please enter a valid URL');
})

app.listen(8080);