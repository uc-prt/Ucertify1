<script>
/**
 *  File Name   : LocalStorage.svelte
 *  Description : Localstorage component
 *	Author      : Prabhat Kumar<prabhat.kumar@ucetify.com>
 *  Version     : 1.0
 *  Package     : svelte_items
 *  Last update : 11 Sep 2021
 */

import { onMount, afterUpdate } from 'svelte';
import { writable } from 'svelte/store';
import { AH } from '../../helper/HelperAI.svelte';

export let allItemTemp;
let userData = [];
let counter = 0;
let localdata = {};
$: len = 0;
let state = {};
let user_guid = '';

let hdd = writable({
	localdata   : {},
	allItemTemp	: ''
});
const unsubscribe = hdd.subscribe((items) => {
	state = items;
});

const updateData = () => {
    state.localdata = JSON.parse(localStorage.getItem('storedata'));
    if(state.localdata){
        len = (state.localdata != null && state.localdata[user_guid] !=null) ? Object.keys(state.localdata[user_guid]).length : 0;
        userData = Object.values(state.localdata[user_guid]);
        if(allItemTemp) {
            state.allItemTemp = allItemTemp;
        }
    }
}
onMount(async ()=> {
    user_guid = window.user_guid
    updateData();
});


function discardstorage(_this, content_guid,user_guid) {
    if(confirm('Do you want to discard it?')) {
        var localdatatemp = state.localdata;
        delete localdatatemp[user_guid][content_guid];
        var newObj = (localdatatemp);
        state.localdata=newObj;
        localStorage.setItem('storedata',JSON.stringify(newObj));
        updateData();
    }
}

function saverecord(_this, content_guid_temp,user_guid) {
    AH.activate(1);
    var localdatatemp = state.localdata;
    var data = localdatatemp[user_guid][content_guid_temp];
    
    AH.ajax({
        url : baseUrl+'editor/index.php', // point to server-side PHP script
        cache : false,
        datatype : 'json',
        data : data,
        type : 'POST',
    }).then((save_response) => {
        var save_response = JSON.parse(save_response);
        if(!save_response['error']) {
            var content_guid = save_response['content_guid'];
            var localdatatemp = state.localdata;
            delete localdatatemp[user_guid][content_guid_temp];
            var newObj = (localdatatemp);
            state.localdata=newObj;
            localStorage.setItem('storedata',JSON.stringify(newObj));
            AH.alert("Your Content is saved and GUID is: "+content_guid);
        }
    }).catch((error) => {
        console.log("errorr");   
    }).finally(() => {    
        AH.activate(0);
        updateData();
    });
}

function viewrecord(_this, content_guid_temp,user_guid) {
    AH.activate(1);
    var localdatatemp = state.localdata;
    var data = localdatatemp[user_guid][content_guid_temp];
    AH.ajax({
        url : baseUrl+'editor/index.php', // point to server-side PHP script
        cache : false,
        datatype : 'json',
        data : data,
        type : 'POST',
    }).then((save_response) => {
            var save_response = JSON.parse(save_response);
            if(!save_response['error']) {
                var content_guid = save_response['content_guid'];
                var localdatatemp = state.localdata;
                delete localdatatemp[user_guid][content_guid_temp];
                var newObj = (localdatatemp);
                state.localdata=newObj;
                localStorage.setItem('storedata',JSON.stringify(newObj));
                window.open(baseUrl+'editor/v2/?action=edit&content_guid='+content_guid+'&react_content=1', '_tab');
            }
    }).catch((error)=> {
        console.log("errorr");  
    }).finally(() => {    
        AH.activate(0);
        updateData();
    });
}

function localStorageData(user_guid, data, type, content_guid) {
    AH.alert(type+"=="+content_guid);
    var localdata = JSON.parse(localStorage.getItem('storedata'));
    var counter = 1;
    if(type == 'save') {	
        var d = new Date();
        data['datetime'] = 	d.toString().replace(/GMT.*/g,"");
        if(localdata == null) {
            var localdata = {};
            localdata[user_guid] = {};	                                      
        }
        if(data.content_guid == "") {
            for(var i in localdata[user_guid]) {
                if(i.length != 5) {
                    counter++;
                }
            }
            localdata[user_guid]["n"+counter] = data;
        } else {
            localdata[user_guid][data.content_guid] = data;	
        }	       
        localStorage.setItem('storedata', JSON.stringify(localdata));
    } else if(type == 'remove') {
        if(localdata != null) {
            delete localdata[user_guid][content_guid];
            localStorage.setItem('storedata', JSON.stringify(localdata));
        }
    } 
}
</script>
{#if len > 0}
    <div class="card  mt-2 p-3" style={{width:'95%'}}>
        <div class="alert alert-warning mb-0">
            <span class="font-weight-bold">Note:</span> There {(len == 1)?"is":"are"} {len} unsaved {(len == 1)?"item":"items"}.
        </div>
        <table class="table border-left border-right">
            <thead>
                <tr>
                    <th class="text-center">GUID</th>
                    <th class="text-center">Item Type</th>
                    <th>Snippet</th>
                    <th class="text-center">Date</th>
                    <th class="text-center">Action</th>
                    </tr>
            </thead>			
            <tbody>			
                {#each userData as data, i}
                    {#if state.allItemTemp}
                        <tr key={counter++}>
                            <td class="text-center align-middle"><span class="mr-sm pl-2">{(data.content_guid?.length == 5) ? data.content_guid:"-"}</span></td>
                            <td class="text-center pt-3 span2 align-middle font22">
                                <span rel="tooltip" class="mr-sm pl-2 {state.allItemTemp[data.content_type][data.content_subtype][data.content_icon]?.icon}" data-original-title={state.allItemTemp[data.content_type][data.content_subtype][data.content_icon]?.title} ></span>
                            </td>	
                            <td class="span6 align-middle"> 
                                {@html (data.title != "") ? data.title :data['question'].replace(/<[^>]*>?/gm, '')}
                            </td>					
                            <td class="align-middle text-center" >
                            {data.datetime}
                            </td>
                            <td class="align-middle pb-0" >
                                <div class="float-right">
                                    <input type="button" class="btn btn-sm btn-secondary savecontinue mr-md mb-2" value="Save & Continue" on:click={e => saverecord(e.target,data.content_guid, user_guid)} />
                                    <input type="button" class="from_educator btn btn-sm btn-secondary savecontinue mr-md mb-2" value="View and Edit" on:click={e => viewrecord(e.target,data.content_guid, user_guid)}/>
                                    <input type="button" class="btn btn-sm btn-danger discardstorage mb-2" value="Discard" on:click={e => discardstorage(e.target,data.content_guid,user_guid)} />
                                </div>
                            </td>						
                        </tr>					
                    {/if}
                {/each}
            </tbody>
        </table>    		
    </div>
{/if}
<style>
    table>thead>tr>th {
        background-color: #e3e3e3;
    }
</style>