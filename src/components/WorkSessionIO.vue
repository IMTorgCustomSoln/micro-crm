<template>
   <!-- Open modal button -->
   <b-button
        id='btnSaveContinue'
        size="sm" 
        class="my-2 my-sm-0" 
        v-b-modal="'save-continue-modal'"
        type="button"
        >Data I/O
    </b-button>

    <!-- modal -->
    <b-modal id='save-continue-modal' ok-only>
        <template #modal-title>
            Save or load current work session
        </template>
        <div>
            <p>
                Because this is an offline application, the Workspace cannot be automatically saved to disk.  <bold style="font-weight: bold">If you clear 
                    your browser cache, all work will be lost.</bold> <br><br>
                To save your current Workspace data, press <code>Save</code>, below.
            </p>
            <p>
                Or, select a previously saved Workspace session file (ie. <code>MicroCRM_ApplicationStateData_v*.*.*.gz'</code>) to continue your work.
            </p>

            <b-card bg-variant="light">
                <b-form-group
                label-cols-lg="3"
                label="Workspace"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
                >
            <b-form name="uploadForm">
                <label for="uploadAppDataInput" class="custom-file-upload">
                    <b-icon-cloud-arrow-up-fill class="h2 mb-0" variant="success" /> Upload Workspace
                </label><br/>
                <input id="uploadAppDataInput" 
                       type="file" 
                       @change="previewWorkspace"
                       accept=".gz"
                />
                <ul class="no-li-dot">
                    <li><label for="fileName">File: &nbsp</label><output id="fileName">{{ preview.fileName }}</output></li>
                    <li><label for="fileSize">Size: &nbsp</label><output id="fileSize">{{ preview.fileSize }}</output></li>
                </ul>
                Then, press <code>Load</code> to populate the Workspace.
            </b-form>
            </b-form-group>
            </b-card>
            
            <b-card bg-variant="light">
            <b-form-group
                label-cols-lg="3"
                label="Demo Data"
                label-size="lg"
                label-class="font-weight-bold pt-0"
                class="mb-0"
                >
            <div v-if="getAdminState">
                <p>
                    For learning purposes, demo data can be loaded.  This allows the user to try features that are available, otherwise.
                    <ul class="no-li-dot">
                        <li>To load the app with demo data: <b-button @click="populateDemoData" size="sm" class="my-2 my-sm-0" >Load Demo</b-button></li>
                        <li>To clear the app of all data: <b-button @click="clearDemoData" size="sm" class="my-2 my-sm-0" >Clear All Data</b-button></li>
                    </ul>
                </p>
            </div>
            </b-form-group>
            </b-card>

        </div>

        <!-- Control -->
        <template #modal-footer>
            <div >
                <b-button 
                  id=''
                  size="md" 
                  class="my-2 my-sm-0" 
                  type="button"
                  @click="saveWorkStream"
                  >Save
                </b-button>
                <b-button 
                  id=''
                  size="md" 
                  class="my-2 my-sm-0" 
                  type="button"
                  @click="uploadAppDataInput"
                  >Load
                </b-button>
            </div>
        </template>

    </b-modal>
</template>

<script>
import { useDisplayStore,
            useLifecycle, 
            useAccount, 
            useProject, 
            usePerson,
            usePersonProject,
            useEvent,
            useFeedback
        } from '@/main';
import { getFormattedFileSize, getSetDifferenceOfArrays } from '../assets/utils.js';

// fixed values
import {populateLifecycleTestData,
        populateAccountTestData,
        populateProjectTestData, 
        populateContactTestData,
        populateEventTestData,
        populateFeedbackTestData,
        populatePersonProject
        } from '@/assets/demo.js';
/*
// generated values
import {populateLifecycleTestData,
        populateAccountTestData,
        populateProjectTestData, 
        populateContactTestData,
        populateEventTestData,
        populateFeedbackTestData
        } from '@/assets/generateData'
*/


export default {
    name: "WorkSessionIO",
    data(){
        return{
            count: 0,
            preview:{
                fileName:'',
                fileSize:''
            },
            config: {
                fileHandle: '',
                fileName: '',
                fileSize: '',
                autoSave: true,
            },
            resultDisplay: {
                error: ''
            },
        }
    },
    computed:{
        getAdminState(){ return useDisplayStore.enableAdmin},
    },
    methods:{
        populateDemoData(){
            //load test data
            if(useDisplayStore.populateTestData){
                populateLifecycleTestData(useLifecycle)
                populateAccountTestData(useAccount)
                populateProjectTestData(useProject)
                populateContactTestData(usePerson)    //, useProject)
                populateEventTestData(useEvent)    //, usePersonProject, usePerson)
                populateFeedbackTestData(useFeedback)   //, usePersonProject, usePerson)
                populatePersonProject(usePersonProject, usePerson, useDisplayStore)
            }
        },
        clearDemoData(){
            const keys = Object.keys(localStorage)
            for(let key of keys){
                if( ['Lifecycle', 'LifecycleStep'].indexOf(key) == -1 ){
                    localStorage.removeItem(key)
                }
            }
        },
        async saveWorkStream(e){
            const create = e.target
            const object = localStorage
            try {
                const readStream = new Blob( [JSON.stringify(object)], { type: 'application/json' }).stream()
                //const compressedStream = readStream.pipeThrough(new TextEncoderStream())    //(new CompressionStream('gzip'))   TODO: I don't know why decoding pipeline fails
                const compressedStream = readStream.pipeThrough(new CompressionStream('gzip'))
                if(!this.config.fileHandle){
                    this.config.fileHandle = await showSaveFilePicker( {
                        suggestedName: useDisplayStore.exportAppStateFileName,
                        types: [
                            {
                                description: "GZIP File",
                                accept: {
                                    "application/gzip": [".gz"]
                                }
                            }
                        ]
                    })
                    this.config.fileName = this.config.fileHandle.name
                }
                const writableStream = await this.config.fileHandle.createWritable()
                compressedStream.pipeTo(writableStream)
              } catch (err) {
                console.error(err.name, err.message);
              }
              this.$bvModal.hide("save-continue-modal")
        },
        async uploadAppDataInput(){
            let buffer = ''
            let stream = uploadAppDataInput.files[0].stream()
            //const reader = stream.getReader()
            //const decompressedStream = stream.pipeThrough(new TextDecoderStream())
            const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'))    //.pipeThrough(new TextDocoderStream())  TODO: decoding fails
            const reader = decompressedStream.getReader();
            while( true ) {
                const { done, value } = await reader.read()
                if( done ) { break; }
                console.log( "received a new buffer", value.byteLength)
                buffer += new TextDecoder().decode(value)
            }
            const upload = JSON.parse(buffer)
            const keysOriginal = Object.keys(localStorage)
            const keysNew = Object.keys(upload)
            for(let key of keysOriginal){
                localStorage.removeItem(key)
            }
            for(let key of keysNew){
                localStorage.setItem(key, upload[key])
            }
            const diff = getSetDifferenceOfArrays(keysNew, keysOriginal)
            console.log(`CHECK: original and new keys should be the same.  The different keys are: ${diff}`)

            this.resetModal()
        },
        previewWorkspace(){
            // Preview files to upload and process
            const file = uploadAppDataInput.files[0]
            const fileSize = getFormattedFileSize(file.size)
            this.preview = {...this.preview, fileSize: fileSize}
            this.preview = {...this.preview, fileName: file.name}
            this.uploadWorkspaceBtn = false
        },
        resetModal(){
            this.preview.fileName = ''
            this.preview.fileSize = ''
            this.$bvModal.hide('save-continue-modal')
        }
    }
}
</script>


<style scoped>
.no-li-dot{
    list-style-type: none;
}

.custom-file-upload {
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}

input[type="file"] {
    display: none;
}
</style>