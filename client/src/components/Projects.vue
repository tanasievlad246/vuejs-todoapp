<template lang="html">
    <div>
      <!-- temporary toggle button -->
      <button>Add Project</button>

      <!-- Start of the submit form -->
      <form v-on:submit='addProject($event)' class="add-project-modal">
        <div class="form-group mt-3 submit-project">
          <input type='text'
                placeholder='Add a project title'
                v-model='projectTitle'
                class="form-control"/>

          <input type='submit' class="btn btn-success btn-block mt-2" value="Create Project"/>
        </div>
      </form>
      <!-- End of the submit form -->

      <!-- Start of the projects rendering -->
      <ul>
        <li v-for="project in projects" :key='project._id'>
          {{project.title}}
          <ul>
            <li v-for="todo in project.todos" :key='todo._id'>
              <h4>{{todo.title}}</h4>
              <p>{{todo.description}}</p>
              <p>{{todo.state}}</p>
              <p>{{todo._id}}</p>
            </li>
          </ul>          
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
      todoState: 'active'
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
</style>
