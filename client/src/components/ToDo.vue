<template lang="html">
  <div>
    <form v-on:submit='addTodo($event)'>
      <input type='text' placeholder='Enter Todo' v-model='newTodo'/>
      <input type='submit' />
    </form>
    <ul> <!-- Add a button with a popup form to edit each todo -->
      <li v-for='todo in todos' :key='todo._id'>
        <input type="checkbox">
        {{todo}}
        <button @click="deleteTodo(todo._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import ToDoAPI from '@/services/ToDoAPI.js'
export default {
  data () {
    return {
      newTodo: '',
      todos: []
    }
  },
  mounted () {
    this.loadTodos()
  },
  methods: {
    async addTodo (evt) {
      evt.preventDefault() // prevents the form's default action from redirecting the page
      const response = await ToDoAPI.addTodo(this.newTodo)
      this.todos.push(response.data)
      this.newTodo = '' // clear the input field
    },
    async loadTodos () {
      const response = await ToDoAPI.getToDos()
      this.todos = response.data
    },
    deleteTodo(todoID){
        ToDoAPI.deleteTodo(todoID)
        //remove the array element with matching id
        this.todos = this.todos.filter(function(obj){
            return obj._id !== todoID
        })
    }
    //add an update function to update each todo
  }
}
</script>

<style lang="css">
</style>