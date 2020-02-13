<template lang="html">
    <div>
      <!-- temporary toggle button -->
      <button v-if='this.button_toggle.proj_attr === true' @click='toggleProjectModal("block")'>Add Project</button>
      <button v-else-if='this.button_toggle.proj_attr === false' @click='toggleProjectModal("none")'>Add Project</button>
      
      <!-- Start of the submit form for projects-->
      <form v-on:submit='addProject($event)' class="add-project-modal" id="project-modal">
        <div class="form-group mt-3 submit-project">
          <input type='text'
                placeholder='Add a project title'
                v-model='projectTitle'
                class="form-control"/>

          <input type='submit' class="btn btn-success btn-block mt-2" value="Create Project"/>
        </div>
      </form>
      <!-- End of the submit form for projects-->

      <!-- Start of the submit form for todos-->
      <form class="add-todo-modal" v-on:submit='addTodo($event, todoTitle, todoDescription, todoState, todoPriority, projectKey)'>
        <div class="form-group mt-3 submit-project">
          <input type='text'
                placeholder='Add a todo title title'
                v-model='todoTitle'
                class="form-control"/>
          <input type="textbox" placeholder="Add todo description" class="form-control" v-model="todoDescription"/>
          <select v-model='todoPriority'>
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
          <input type='submit' class="btn btn-success btn-block mt-2" value="+"/>
        </div>
      </form>
      <!-- End of the submit form for todos-->

      <!-- Start of the projects rendering -->
      <ul>
        <li v-for="project in projects" :key='project._id' class="project-pannel">
          {{project.title}}
          <ul>
            <li v-for="todo in project.todos" :key='todo._id'>
              <button v-on:click="deleteTodo(todo._id,project._id)">X</button>
              <h4>{{todo.title}}</h4>
              <p>{{todo.description}}</p>
              <p>{{todo.state}}</p>
              <p>{{todo.priority}}</p>
            </li>
          </ul>
          <button v-on:click="projectKeyChanger(project._id)">Add Todo</button>          
        </li>
      </ul>
      <!-- End of the projects rendering -->
    </div>
</template>
<script>
import ToDoAPI from '@/services/ToDoAPI.js'

export default {
  data () {
    return {
      projectTitle: '',
      projects: [],
      todoTitle: '',
      todoDescription: '',
      todoPriority: '',
      todoState: 'active',
      button_toggle: {
        proj_attr: true,
        todo_attr: true
      }, //attribut to toggle the add project modal
      projectKey: '' //holds the key for the project in which you insert the todo
    }
  },
  mounted(){
    this.getProjects();
  },
  methods: {
    async getProjects(){
      const response = await ToDoAPI.getProjects()
      this.projects = response.data
    },
    async addProject (evt) {
      if (this.projectTitle) {
        evt.preventDefault() // prevents the form's default action from redirecting the page
        const response = await ToDoAPI.addProject(this.projectTitle);
        this.getProjects()
        this.projectTitle = ''
      } else {
        alert('You need to add a title.')
      }
    },
    async addTodo(evt,todoTitle,todoDescription,todoState,todoPriority,url){
      if (this.todoTitle){
        evt.preventDefault()
        await ToDoAPI.addTodoInProject(todoTitle,todoDescription,todoState,todoPriority,url)
        this.getProjects()
      } else {
        alert('You need a todo title')
      }
    },
    async deleteTodo(todoId,projectId){
      await ToDoAPI.deleteTodoInProject(todoId,projectId);
      this.getProjects();
    },
    toggleAddModal(attr){
      const project = document.getElementById('project-modal');
      if (attr == 'block') {
        project.style.display = 'block'
        this.button_toggle.proj_attr = false;
      }else if(attr == 'none') {
        project.style.display = 'none'
        this.button_toggle.proj_attr = true
      }
    },
    projectKeyChanger(key){
      this.projectKey = key;
      console.log(key)
    }
  }
}
</script>

<style lang="css">
.striketrough{
  text-decoration: line-through;
}

.submit-project{
  position:absolute;
  width: 400px;
  top: 40vh;
  left: 40vw;
  border: 3px solid black;
  border-radius: 25px;
  padding: 10px;
}

.add-project-modal{
  display: none;
  position: fixed;
  background: rgba(255, 125, 50, .3);
  width: 100%;
  height: 100%;
}

.project-pannel{
  border: 5px black solid;
  width: 400px;
}

.project-pannel li {
  border: 2px black solid;
  margin: 5px;
  width: 300px;
}

.add-todo-modal{
  display: none;
}
</style>
