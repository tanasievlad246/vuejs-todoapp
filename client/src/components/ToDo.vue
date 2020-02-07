<template lang="html">
  <div>
    <nav class='navbar navbar-light bg-light'>
      <span>ToDo App</span>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" v-model='search'>
      </form>
    </nav>

    <div class='container content-center'>
      <form v-on:submit='addTodo($event)'>
        <div class="form-group mt-3">
          <input type='text'
                placeholder='Add or edit a todo'
                v-model='newTodo'
                class="form-control"/>
          <textarea placeholder='Add or edit a description'
                    v-model='newDescription'
                    class="form-control">
          </textarea>

          <input type='submit' class="btn btn-success btn-block mt-2" value="+" id="plusBtn"/>
        </div>
      </form>

      <div class="alert alert-danger text-center" role="alert" id="alert" style="display: none">
        You need to add a title!
      </div>

      <ul style="list-style-type: none;">
        <li v-for='todo in filterTodo' :key='todo._id' class='border border-dark rounded mt-3 text-center'>
          <button @click="deleteTodo(todo._id)"
                  class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>

          <div :style='todo.state === "complete" ?  "text-decoration: line-through;"  : "text-decoration: none;"' class='mt-1 lead text-break'>
            <strong>{{todo.title}}</strong>
          </div>

          <div :style='todo.state === "complete" ?  "text-decoration: line-through;"  : "text-decoration: none;"' class='lead text-break'>
            {{todo.description}}
          </div>

          <div class='lead'>
            {{todo.state}}
          </div>

          <button @click="updateTodo(todo._id)"
                  class="btn btn-primary mt-1 mb-1">Edit</button>

          <button v-if='todo.state === "active"'
                  class="btn btn-success mt-1 mb-1"
                  @click='changeState(todo._id, todo.state)'>Complete</button>

          <button v-else-if="todo.state === 'complete'"
                  class="btn btn-dark mt-1 mb-1"
                  @click='changeState(todo._id, todo.state)'>Activate</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ToDoAPI from '@/services/ToDoAPI.js'

export default {
  data () {
    return {
      newTodo: '',
      newDescription: '',
      state: 'active',
      todos: [],
      search: ''
    }
  },
  mounted () {
    this.loadTodos()
    console.log(this.todos)
  },
  methods: {
    async addTodo (evt) {
      if (this.newTodo) {
        evt.preventDefault() // prevents the form's default action from redirecting the page
        const response = await ToDoAPI.addTodo(this.newTodo, this.newDescription, this.state)
        this.todos.push(response.data)
        this.newTodo = '' // clear the input field
        this.newDescription = '' // clear description
      } else {
        alert('You need to add a title.')
      }
    },
    async loadTodos () {
      const response = await ToDoAPI.getToDos()
      this.todos = response.data
    },
    deleteTodo (todoID) {
      ToDoAPI.deleteTodo(todoID)
      // remove the array element with matching id
      this.todos = this.todos.filter(function (obj) {
        return obj._id !== todoID
      })
    },
    // add an update function to update each todo
    async updateTodo (todoID) {
      await ToDoAPI.updateTodo(todoID, this.newTodo, this.newDescription)
      this.loadTodos()
      this.newTodo = '' // clear the input field
      this.newDescription = '' // clear description
    },
    async changeState (todoID, state) {
      await ToDoAPI.changeState(todoID, state)
      this.loadTodos()
    }
  },
  computed: {
    filterTodo: function () {
      return this.todos.filter((todo) => {
        return todo.title.toLowerCase().match(this.search.toLowerCase())
      })
    }
  }
}
</script>

<style lang="css">

textarea {
  resize: none;
  margin-top: 10px;
}

.content-center{
  margin: auto;
  width: 500px;
}

li{
  width: 400px;
  background-color: #F8F9FA;
}

body{
  background-color: lightblue;
}
</style>
