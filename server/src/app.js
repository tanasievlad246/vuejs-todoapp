//the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

//mongodb connection for atlas
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://dbappuser1:zxcvbnm1@cluster0-gahmk.mongodb.net/todoapp?retryWrites=true";
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
//get the todos to display (READ)
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
//add a todo (CREATE)
app.post('/addTodo', (req, res) => {
    const collection = client.db('todoapp').collection('todos')
    let todo = req.body.todo //parse the data from the request body
    let description = req.body.description
    let state = req.body.state
    collection.insertOne({title: todo , description: description , state: state}, function(err, results) {
        if (err){
            console.log(err);
            res.send('');
            return
        }
        res.send(results.ops[0]) //retruns the new document
    })
})


//delete a todo (DELETE)
app.post('/deleteTodo', (req, res) => {
    const collection = client.db('todoapp').collection('todos');
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

//update a todo (UPDATE)
app.post('/updateTodo', (req, res) => {
    const collection = client.db('todoapp').collection('todos');
    let todo = req.body.todo;
    let description = req.body.description;
    let state = req.body.state;
    const updateOperation = {};

    if(todo) updateOperation.title = todo;
    if(description) updateOperation.description = description;
    if(state) updateOperation.state = state;

    collection.update({'_id': mongo.ObjectID(req.body.todoID)}, {$set: {...updateOperation}}, function(err, results){
        if(err) {
            console.log(err)
            res.send('')
            return
        }
        res.send()
    }) 
})
//change the state from active to complete
app.post('/changeState', (req, res) => {
    const collection = client.db('todoapp').collection('todos');
    let state = req.body.state;

    if(state === 'active'){
        collection.update({'_id': mongo.ObjectID(req.body.todoID)}, {$set: {state: 'complete'}}, function(err, results){
            if(err) {
                console.log(err)
                res.send('')
                return
            }
            res.send()
        })
    }else {
        collection.update({'_id': mongo.ObjectID(req.body.todoID)}, {$set: {state: 'active'}}, function(err, results){
            if(err) {
                console.log(err)
                res.send('')
                return
            }
            res.send()
        })
    }

})



//the server
app.listen(process.env.PORT || 8081) // client is already running on 8080