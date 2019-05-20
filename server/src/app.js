//the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

//mongodb connection for atlas
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = 'mongodb+srv://default-user:zxcvbnm1@cluster0-erm9w.mongodb.net/todoapp?retryWrites=true';
let client;

let mongoClient = new MongoClient(uri, {reconnectTries : Number.MAX_VALUE, autoReconnect : true, useNewUrlParser : true })

mongoClient.connect((err, db) => {
    if(err != null){
        console.log(err);
        return
    }
    client = db;
})

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());


//the routes
app.get("/todo", (req, res) => {
    const collection = client.db('todoapp').collection("todos"); //connecting to the atlas collection

    collection.find().toArray(function (err, results){ //filtering the results
        if(err){
            console.log(err)
            res.send([])
            return
        }

        res.send(results)
    })
})

app.post('/addTodo', (req, res) => {
    const collection = client.db ('todoapp').collection('todos')
    let todo = req.body.todo //parse the data from the request body
    collection.insertOne({title: todo}, function(err, results) {
        if (err){
            console.log(err);
            res.send('');
            return
        }
        res.send(results.ops[0]) //retruns the new document
    })
})

app.post('/deleteTodo', (req, res) => {
    const collection = client.db ('todoapp').collection('todos')
    // remove the document by the unique id
    collection.removeOne({'_id': mongo.ObjectID(req.body.todoID)}, function(err, results){
        if(err) {
            console.log(err)
            res.send('')
            return
        }
        res.send()
    })
})

// add an update functio to update the existing mongodb data by its unique id





//the server
app.listen(process.env.PORT || 8081) // client is already running on 8080