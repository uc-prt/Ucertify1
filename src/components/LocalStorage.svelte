<script>
/**
 *  File Name   : LocalStorage.svelte
 *  Description : Localstorage component
 *	Author      : Prabhat Kumar<prabhat.kumar@ucetify.com>
 *  Version     : 1.0
 *  Package     : svelte_items
 *  Last update : 11 Sep 2021
 */

import { onMount, beforeUpdate } from 'svelte';
import { writable } from 'svelte/store';
import { AH } from '../../helper/HelperAI.svelte';

export let allItemTemp;
let self1;
let state = {};
let hdd = writable({
	localdata   : {},
	allItemTemp	: ''
});
const unsubscribe = hdd.subscribe((items) => {
	state = items;
});
onMount(async ()=> {
    state.localdata = JSON.parse(localStorage.getItem('storedata'));
});
beforeUpdate(async () => {
    setTimeout(function() {
        if(allItemTemp) {
            state.allItemTemp = allItemTemp;
        }
    }, 200);
});

function discardstorage(content_guid,user_guid) {
    if(confirm('Do you want to discard it?')) {
        var localdatatemp = state.localdata;
        delete localdatatemp[user_guid][content_guid];
        var newObj = (localdatatemp);
        state.localdata=newObj;
        localStorage.setItem('storedata',JSON.stringify(newObj));
    }		
}

function saverecord(content_guid_temp,user_guid) {
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
                AH.activate(0);

                var localdatatemp = state.localdata;
                delete localdatatemp[user_guid][content_guid_temp];
                var newObj = (localdatatemp);
                state.localdata=newObj;
                localStorage.setItem('storedata',JSON.stringify(newObj));
                AH.alert("Your Content is saved and GUID is: "+content_guid);
            }
        }).catch((error) => {
            console.log("errorr");   
        });
    });
}

function viewrecord(content_guid_temp,user_guid) {
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
                activate(0);

                var localdatatemp = state.localdata;
                delete localdatatemp[user_guid][content_guid_temp];
                var newObj = (localdatatemp);
                state.localdata=newObj;
                localStorage.setItem('storedata',JSON.stringify(newObj));
                window.open(baseUrl+'editor/?action=edit&content_guid='+content_guid+'&react_content=1', '_tab');
            }
    }).catch((error)=> {
        console.log("errorr");  
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

// Need to convert this code.
function render() {
    var localdata = this.state.localdata;
    var len = (localdata != null && localdata[user_guid] !=null) ? Object.keys(localdata[user_guid]).length : 0;
    var dataArray = [];

    if(len > 0) {
        var userData = localdata[user_guid];
        var counter = 0;
        for(var i in userData) {
            var content_type = userData[i]['content_type'];
            var content_subtype = userData[i]['content_subtype'];
            var content_icon = userData[i]['content_icon'];
            //var title = (i.length != 5) ? 'New Content' : userData[i]['content_guid'];	
            var title = userData[i]['title'];
            var datetime = userData[i]['datetime'];
            counter++;	
            if(this.state.allItemTemp) {
                try {	
                    dataArray.push(
                        <tr key={counter}>
                            <td class="text-center align-middle"><span class="mr-sm pl-2">{(i.length == 5) ? i:"-"}</span></td>
                            <td class="text-center pt-3 span2 align-middle font22">
                                <span rel="tooltip" class="mr-sm pl-2" data-original-title={this.state.allItemTemp[content_type][content_subtype][content_icon]['title']} class={this.state.allItemTemp[content_type][content_subtype][content_icon]['icon']}></span>
                            </td>	
                            <td class="span6 align-middle"> 
                                {(title != "") ? title :userData[i]['question'].replace(/<[^>]*>?/gm, '')}
                            </td>					
                            <td class="align-middle text-center" >
                            {datetime}
                            </td>
                            <td class="align-middle pb-0" >
                                <div class="float-right">
                                    <input type="button" class="btn btn-sm btn-secondary savecontinue mr-md mb-2" value="Save & Continue" onClick={this.saverecord.bind(this,i,user_guid)} />
                                    <input type="button" class="from_educator btn btn-sm btn-secondary savecontinue mr-md mb-2" value="View and Edit" onClick={this.viewrecord.bind(this,i,user_guid)}/>
                                    <input type="button" class="btn btn-sm btn-danger discardstorage mb-2" value="Discard" onClick={this.discardstorage.bind(this,i,user_guid)} />
                                </div>
                            </td>						
                        </tr>					
                    );
                } catch(e) {
                    console.log("Error in Data");
                }
            }
        }
    }
}
</script>
<div>
    {#if len > 0}
        <div class="card ml-lg mt-md p-md" style={{width:'95%'}}>
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
                    {dataArray}
                </tbody>
            </table>    		
        </div>
    {/if}
</div>