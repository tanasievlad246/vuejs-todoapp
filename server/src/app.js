//the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const mongo = require('mongodb');

var mongoDB = 'mongodb://127.0.0.1/todo_app';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*
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
*/


const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());


//the routes
//get the todos to display (READ)
app.get("/todo", (req, res) => {
    const collection = db.collection('todos'); //connecting to the atlas collection

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
    const collection = db.collection('todos')
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
    const collection = db.collection('todos');
    // remove the document by the unique id
    collection.deleteOne({'_id': mongo.ObjectId(req.body.todoID)}, function(err, results){
        if(err) {
            console.log(err)
            res.send('')
            return
        }
        res.send()
        console.log(req.body.todoID)
    })
})

//update a todo (UPDATE)
app.post('/updateTodo', (req, res) => {
    const collection = db.collection('todos');
    let todo = req.body.todo;
    let description = req.body.description;
    let state = req.body.state;
    const updateOperation = {};

    if(todo) updateOperation.title = todo;
    if(description) updateOperation.description = description;
    if(state) updateOperation.state = state;

    collection.update({'_id': mongo.ObjectId(req.body.todoID)}, {$set: {...updateOperation}}, function(err, results){
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
    const collection = db.collection('todos');
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


//get projects route
app.get('/getProjects', (req,res)=>{
    const collection = db.collection('projects'); //connecting to the atlas collection

    collection.find().toArray(function (err, results){ //filtering the results
        if(err){
            console.log(err)
            res.send([])
            return
        }

        res.send(results)
    })
})

//ToDo schema
const todoSchema = mongoose.Schema({
    title: String,
    description: String,
    state: String,
    priority: Number
})

//project schema
const schema = mongoose.Schema({
    title: String,
    todos: [{type: mongoose.Types.ObjectId, ref: 'Todo'}]
});

const Todo = mongoose.model('Todo', schema);
const Project = mongoose.model('Project', schema);

//add a project
app.post('/addProject', (req, res) => {
    const collection = db.collection('projects')
    const proj = new Project({title: req.body.title});
    collection.insertOne(proj, function(err, results) {
        if (err){
            console.log(err);
            res.send('Error');
            return
        }
        res.send(results.ops[0]) //retruns the new document
    })
})

//add a todo to a project
app.post('/addTodoProject/:id', (req,res) => {
    const collection = db.collection('projects')
    collection.updateOne({_id: mongo.ObjectID(req.params.id)},{
        $push: {
            todos: {
                title: req.body.title,
                description: req.body.description,
                state: req.body.state,
                priority: req.body.priority
            }
        }
    },function(err, results) {
        if (err){
            console.log(err);
            res.send('Error');
            return
        }
        res.send() //retruns the new document
    });
});




//the server
app.listen(process.env.PORT || 8081) // client is already running on 8080
console.log("App is running on localhost:8081")

