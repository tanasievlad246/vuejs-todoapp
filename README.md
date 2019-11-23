A small todo app project 

run npm start && npm start in the client folder
run npm start && npm start in the server folder


This app uses mongo atlas as a database

The app runs on localhost:8080
The api runs on localhost:8081

Created the client folder and initialized vue js with webpack
Created the server folder and initizlied node in it
Added nodemon to the server folder
Added express, body-parser, morgan and cors to the server folder
Added axios for the communication between front-end and back-end
Created the main component for the front end
Created the routes in express and tested it with postman
Added a get function to get the data from the db in the services/ToDoAPI.js file
Rendered the data from the db as a list in ToDo.vue
Added the route functions to send data to the db in the services/ToDoAPI.js file and ToDo.vue
Added some styles with Bootstrap and css