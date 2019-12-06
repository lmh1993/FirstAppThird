//Install express server
const express = require('express');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const path = require('path');

var CONTACTS_COLLECTION = "contacts";

const app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://<dbuser>:<dbpassword>@ds211875.mlab.com:11875/heroku_7mt753c8", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

// Save database object from the callback for reuse.
db = client.db();
console.log("Database connection ready");




// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/docs'));


app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/docs/index.html'));
});

// Start the app by listening on the default Heroku port
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }
  
  /*  "/api/contacts"
   *    GET: finds all contacts
   *    POST: creates a new contact
   */
  
  app.get("/api/contacts", function(req, res) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
          handleError(res, err.message, "Failed to get contacts.");
        } else {
          res.status(200).json(docs);
        }
      });
  });
  
  app.post("/api/contacts", function(req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();
  
    if (!req.body.name) {
      handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else {
      db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new contact.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
  });
  
  /*  "/api/contacts/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  
  app.get("/api/contacts/:id", function(req, res) {
  });
  
  app.put("/api/contacts/:id", function(req, res) {
  });
  
  app.delete("/api/contacts/:id", function(req, res) {
  });