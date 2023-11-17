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

            <div>
                <em>Admin Mode enables the user to make changes not typically available.</em>
                <b-button 
                    @click="toggleAdminState" 
                    size="sm" 
                    variant="danger"
                    :pressed.sync="adminMode"
                    >
                     Admin Mode is {{ adminDisplay }}
                </b-button>
            </div>


        </b-form>
        </div>
        <template #modal-footer>
            <b-button @click="addAccount" v-b-modal.modal-close_visit class="btn-sm m-1" >Add / Update</b-button>
        </template>
    </b-modal>

</template>

<script>
import { isEmpty } from '@/assets/utils';
import {useDisplayStore, useAccount} from '@/main';
import { useCollect } from 'pinia-orm/dist/helpers';

export default {
    name: 'ModalAccount',
    data(){
        return{
            adminMode: true,
            adminDisplay: 'On',
            form:{
                error:'',
                account: {
                    name:''
                }
            }
        }
    },
    mounted(){
      this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
        //console.log('Modal is about to be closed', bvEvent, modalId)
        let account = useCollect(useAccount.all()).sortBy('Fullname')[0]
        if(!isEmpty(account)){
            this.form.account.name = account.Fullname
        }
      })
    },
    methods:{
        addAccount(){
            return true
        },
        toggleAdminState(){
            this.adminMode = !useDisplayStore.enableAdmin;
            this.adminDisplay = this.adminMode ? 'On' : 'Off';
            useDisplayStore.enableAdmin = this.adminMode;
            console.log(useDisplayStore.enableAdmin)
        }
    }
}
</script>