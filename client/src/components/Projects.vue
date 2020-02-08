<template lang="html">
    <div>
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
    }
  } 
}
</script>

<style lang="css">
.striketrough{
  text-decoration: line-through;
}
</style>
