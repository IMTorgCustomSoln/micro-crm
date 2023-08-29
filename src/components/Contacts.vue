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
  import { createPinia } from "pinia";
  import { createORM } from "pinia-orm";
  import Person from "../stores/Person.js";

  import { useCollect } from 'pinia-orm/dist/helpers' //.. const usePerson =

  const pinia = createPinia().use(createORM());
  const usePerson = useRepo(Person, pinia);

  usePerson.all() // sort the record by 'Username' attributes


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

    methods: {
      addfriend() {
        usePerson.save({
          Username: this.form.username,
          Fullname: this.form.fullname,
          Age: this.form.age,
          Email: this.form.email,
        });
        console.log(usePerson.all());
      },
    },
};
</script>