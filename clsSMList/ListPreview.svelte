<script>
    import l from '../src/libs/editorLib/language.js';
    import {writable} from 'svelte/store';
    import { beforeUpdate } from "svelte";
    import {XMLToJSON} from "../helper/HelperAI.svelte";
    

    export let xml;
    let state = {};

    let stateData = writable({
        data_cdata_prev         :''
    })


    const unsubscribe = stateData.subscribe((items)=>{
        state = items;
    })

    beforeUpdate(()=>{
        if (xml != state.xml) {
            loadModule(xml);
        }
    })

    // loads the module
    function loadModule(xml) {
        // contains the json data of xml
        var newXML = XMLToJSON(xml);
        // parses the xml data and updates the xml
        parseXMLPreview(newXML);
    }

    // parses the xml data and updates the xml
    function parseXMLPreview(MYXML) {
        try {
                // contains the each row data in json format
            state.data_cdata_prev = JSON.parse(MYXML.smxml.__cdata).list;
        } catch(error) {
            console.log({'error': error});
        }
    }
</script>
<main>
    <div id="preview_container" class="container w-100 px-3 py-3 svelte_items_testing">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    {#if state.data_cdata_prev}
                        <table class="table w-100" id="prev_csv_data_table" tabindex={0}>
                            <tr>
                                <th class="text-center align-middle" tabindex={0}><b class="font17">#</b></th>
                                <th class="align-middle text-center" tabindex={0}><b class="font17">{state.data_cdata_prev[0].c1}</b></th>
                                <th class="align-middle text-center" tabindex={0}><b class="font17">{state.data_cdata_prev[0].c2}</b></th>
                                <th class="align-middle text-center" tabindex={0}><b class="font17">{l.current_item}</b></th>
                                <th class="align-middle text-center" tabindex={0}><b class="font17">{l.used_in_items}</b></th>
                            </tr>
                            
                                {#each state.data_cdata_prev as object_data, index}
                                        {#if index > 0}
                                            <tr>
                                                <td class="text-center align-middle" tabindex={0}>{((index < 10)? '0' + index: index)}</td>
                                                <td class="align-middle word-wrap-break text-center" tabindex={0}>{object_data.c1}</td>
                                                <td class="align-middle word-wrap-break text-center" tabindex={0}>{object_data.c2}</td>
                                                <td class="align-middle text-center" tabindex={0}>{object_data.cg}</td>
                                                <td class="align-middle word-wrap-break text-center" tabindex={0}>{object_data.ag.join(',')}</td>
                                            </tr>
                                        {/if}
                                {/each}
                        </table>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</main>