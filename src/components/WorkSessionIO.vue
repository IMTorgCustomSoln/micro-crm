
<template>
   <!-- Open modal button -->
   <b-button
        id='btnSaveContinue' 
        v-b-modal="'save-continue-modal'"
        type="button"
        >Data I/O
    </b-button>

    <!-- modal -->
    <b-modal id='save-continue-modal' ok-only>
        <template #modal-title>
            Save or load current work session
        </template>
        <br>
        <!-- Explanation TODO:fix -->
        <div >
            <p>
            Because this is an offline application, the Workspace cannot be automatically saved.  <bold style="font-weight: bold">If you close 
            your browser, all work will be lost.</bold> <br><br> 
            </p>
            
            <p>
            Select a previously saved session file (ie. <code>VDI_ApplicationStateData_v*.*.*.gz'</code>) to continue your work.
            </p>
            <b-form name="uploadForm">
            
            <label for="uploadAppDataInput" class="custom-file-upload">
                <b-icon-cloud-arrow-up-fill class="h2 mb-0" variant="success" /> Upload
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
           
            </b-form>
        </div>

        <!-- Control -->
        <template #modal-footer>
            <div >
                <b-button 
                  id=''
                  size="sm" 
                  class="my-2 my-sm-0" 
                  type="button"
                  @click="saveWorkStream"
                  >Save
                </b-button>
                <b-button 
                  id=''
                  size="sm" 
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
import { getFormattedFileSize, getSetDifferenceOfArrays } from '../assets/utils.js'

const ExportAppStateFileName = 'WorkSession.gz'

export default {
    name: "WorkSessionIO",
    data(){
        return{
            count: 0,
            preview:{
                fileName:'',
                fileSize:''
            }
        }
    },
    methods:{
        async saveWorkStream(e){
            const create = e.target
            const object = localStorage
            try {
                const readStream = new Blob( [JSON.stringify(object)], { type: 'application/json' }).stream()
                //const compressedStream = readStream.pipeThrough(new TextEncoderStream())    //(new CompressionStream('gzip'))   TODO: I don't know why decoding pipeline fails
                const compressedStream = readStream.pipeThrough(new CompressionStream('gzip'))
                const fileHandle = await showSaveFilePicker( {
                    suggestedName: ExportAppStateFileName,
                    types: [
                        {
                            description: "GZIP File",
                            accept: {
                                "application/gzip": [".gz"]
                            }
                        }
                    ]
                })
                const writableStream = await fileHandle.createWritable()
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
