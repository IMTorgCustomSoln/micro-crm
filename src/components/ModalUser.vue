<template>

    <b-modal 
        id="account-modal"
        >
        <template #modal-title>
            Account
        </template>
        
        <div>
          <div v-if="this.form.error">
            <span>{{ this.form.error }}</span>
          </div>
          <b-form>
            <b-card bg-variant="light">
                <b-form-group
                  label="Name:"
                  label-for="nested-street"
                  label-cols-sm="3"
                  label-align-sm="right"
                >
                  <b-form-input id="nested-street" v-model="form.account.name"></b-form-input>
                </b-form-group>
            </b-card>
        </b-form>
        </div>
        <template #modal-footer>
            <b-button @click="addAccount" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update</b-button>
        </template>
    </b-modal>

</template>

<script>

export default{

}


</script>