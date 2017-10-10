const express = require('express');
const mongo = require('mongodb').MongoClient;

var app = express();

app.set('view engine', 'pug');

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/:shortened', (request, response) => {
  var shortened = Number(request.params.shortened);
  
  if (shortened != 'favicon.ico') {
    console.log('shortened:', shortened);
    mongo.connect('mongodb://dsoucie:devpassword@ds161164.mlab.com:61164/url-shortener-microservice-dsoucie', (error, db) => {
      var col = db.collection('myCol')
      
      col.find({
        shortened: shortened,
      }).toArray((error, documents) => {
        if (documents.length == 0) {
          response.send("that shortend URL is invalid.");
        } else {
          //redirect here
          response.redirect(documents[0].inputURL);
        }
      })
    })
  }
});

app.get("/create/:inputURL(https?://[A-Za-z0-9-\.]+\.[A-Za-z0-9]+)", (request, response) => { //
  var input = request.params.inputURL;

  if (input != 'favicon.ico') {

    console.log('input: ', input);
    console.log('inside /:inputURL');
    mongo.connect('mongodb://dsoucie:devpassword@ds161164.mlab.com:61164/url-shortener-microservice-dsoucie', (error, db) => {
      var col = db.collection('myCol')
      
      col.find({
        inputURL: input,
      }).toArray((error, documents) => {
        if (documents.length == 0) {
          
          var allDocsLength;
          col.find({}).toArray( (error, allDocs) => {
            if (error) {
              console.error(error);
            } else {
              allDocsLength = allDocs.length;
            }
            col.insert({
              inputURL: input,
              shortened: allDocsLength,
            });
            console.log('alldokslength: ', allDocsLength);
            response.json({
              inputURL: input, shortened: `https://shrt-dsoucie.c9users.io/${allDocsLength}`
            });
          });
        } else {
          var responseJSON = {};
          responseJSON.inputURL = input;
          responseJSON.shortened = `https://shrt-dsoucie.c9users.io/${documents[0].shortened}`
          response.json(responseJSON);
        }
      })
    })

  }


});

app.get('*', (request, response) => {
  response.send('please enter a valid URL');
})

app.listen(process.env.PORT || 8080);
