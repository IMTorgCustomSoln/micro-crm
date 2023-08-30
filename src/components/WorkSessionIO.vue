
<template>
   <!-- Open modal button -->
   <b-button
        id='btnSaveContinue' 
        v-b-modal="'save-continue-modal'"
        >Data I/O
    </b-button>

    <!-- modal -->
    <b-modal id='save-continue-modal' ok-only>
        <template #modal-title>
            Save or load current work session
        </template>
        <br>
        <!-- Explanation TODO:fix-->
        <div >
            <p>
            Because this is an offline application, the Workspace cannot be automatically saved.  <bold style="font-weight: bold">If you close 
            your browser, all work will be lost.</bold> <br><br> 
            </p>
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
const ExportAppStateFileName = 'WorkSession.gz'

export default {
    name: "WorkSessionIO",
    data(){
        return{
            count: 0
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
            const object = JSON.parse(buffer)

            this.documentsIndex.documents.length = 0
            this.managedNotes.topics.length = 0
            this.managedNotes.notes.length = 0

            Object.assign(this.documentsIndex, object.documentsIndex)
            Object.assign(this.managedNotes.topics, object.managedNotes.topics)
            Object.assign(this.managedNotes.notes, object.managedNotes.notes)

            this.$emit('imported-workspace', true)
            this.disableWorkspaceBtn = true
            this.resetModal()
            this.btnText = 'Add More Files'
        },
    }
}
</script>
