<template>
  <div>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
        <div>
          <label for="">Username</label>
          <input v-model="form.username" />
          <label for="">Fullname</label>
          <input v-model="form.fullname" /> <br />
          <br />
          <label for="">Age</label>
          <input v-model="form.age" />
          <label for="">Email</label>
          <input v-model="form.email" />
          <br /><br />
          <button @click="addfriend" class="btn-link">Add Friend</button>
          <button @click="clearAll" class="btn-link">Clear Friends</button>
        </div>
        <br /><br /><br />
      </div>
      <div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Fullname</th>
              <th>Age</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="friend in friend_list">
              <td>{{ friend.Username }}</td>
              <td>{{ friend.Fullname }}</td>
              <td>{{ friend.Age }}</td>
              <td>{{ friend.Email }}</td>
            </tr>
          </tbody>
  </table>
      </div>
</template>



<script>

  import { useRepo } from "pinia-orm";
  import { useCollect } from 'pinia-orm/dist/helpers';
  import Person from "../stores/Person.js";
  import pinia from "../stores/config.js";

  const usePerson = useRepo(Person, pinia);


 

  export default {
    name: 'ContactsTable',
    computed: {
      friend_list: () => useCollect(usePerson.all()).sortBy('Username')
    },
    data() {
      return {
        form: {
          username: "",
          fullname: "",
          age: "",
          email: "",
        },
      };
    },
    mounted(){
      //this.syncData()
    },

    methods: {
      syncData(){
        //TODO: is this needed???
        const savedData = JSON.parse(localStorage.Person).data
        for(let key in savedData){
          let item = savedData[key]
          usePerson.save({
            Username: item.Username,
            Fullname: item.Fullname,
            Age: item.Age,
            Email: item.Email
          })
        }
        console.log(usePerson.all());
      },
      addfriend() {
        usePerson.save({
          Username: this.form.username,
          Fullname: this.form.fullname,
          Age: this.form.age,
          Email: this.form.email,
        });
        console.log(usePerson.all());
      },
      clearAll(){
        const ids = usePerson.all().map(item => item.id)
        console.log(ids)
        usePerson.destroy(ids)
      }
    },
};
</script>