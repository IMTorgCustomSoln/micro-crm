<template>
    <div>
    <label for="downloadOutput" class="custom-file-download">
        <b-icon-box-arrow-down 
            class="h2 mb-0" 
            variant="primary"
            font-scale="0.97" 
            /> {{ label }}
    </label>
    <input id="downloadOutput" 
        type="button"
        @click="exportToCsv" 
        /> 
    </div>
</template>

<script>
import {toRaw} from 'vue';


export default{
    name: 'ExportToCsv',
    props:['exportArray'],
    data(){
        return {
            ExportTextName: 'export.csv',
            label: null
        }
    },
    methods:{
        exportToCsv(e){
            // this.$props.exportArray = [{'col1': val1, 'col2': val2, ...},...]
            //ref: https://stackoverflow.com/questions/18848860/javascript-array-to-csv
            const create = e.target
            const exportArray = toRaw(this.exportArray)
            const lineArray = [];
            const columns = Object.keys(exportArray[0])
            //lineArray.push("data:text/csv;charset=utf-8," + columns.join(','))
            lineArray.push(columns.join(','))
            exportArray.forEach(function (infoArray, index) {
                const values = columns.map(item => {
                    //double-quote strings with commas so that they will not be separated as another cell
                    if(typeof(infoArray[item])=='string'){
                        if(infoArray[item].indexOf(',') != -1){
                            return `"${infoArray[item]}"`
                        }else{
                            return infoArray[item]
                        }
                    }else{
                        return infoArray[item]
                    }
            })
                var line = values.join(',');
                lineArray.push(line);
            });

            const strOutput = lineArray.join("\n");
            const a = document.createElement('a')
            var link = create.appendChild(a)
            link.setAttribute('download', this.ExportTextName)
            link.href = makeTextFile(strOutput)
            document.body.appendChild(link)

            // wait for the link to be added to the document
            window.requestAnimationFrame(function () {
                var event = new MouseEvent('click')
                link.dispatchEvent(event)
                document.body.removeChild(link)
            })
        }
    }
}


function makeTextFile(text) {
    let textFile = null
    const data = new Blob([text], {type: 'text/plain'})            
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile)
    }         
    textFile = window.URL.createObjectURL(data)          
    return textFile
}


</script>


<style scoped>
input[type="button"] {
    display: none;
}
.custom-file-download {
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}

/*TODO: move to the right edge
.move-right{
    position: absolute;
    right: 0px;
    margin-right: 35px;
}*/
</style>