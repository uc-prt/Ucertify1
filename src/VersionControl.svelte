<script>
    /**
     *  File Name   : VersionControl.svelte
     *  Description : Revision history page
     *  Author      : Pradeep Yadav
     *  Version     : 1.2
     *  Package     : pe-items/svelte
     *  Created     : 30 Feb 2021
     *  Updated By  : Prabhat Kumar<prabhat.kumar@ucertify.com>
     *  Updated Date: 12-May-2021
     */
    import { onMount, beforeUpdate, onDestroy } from 'svelte';
    import { Button, Dialog } from 'svelte-mui/src';
    import { writable } from 'svelte/store';
    import { AH } from '../helper/HelperAI.svelte';
    import Loader from '../helper/Loader.svelte';
    export let versionToggle;
    export let guid;
    export let closeVersionDialog;
    export let l;
    
    let hdd = writable({
        open: false,
        tableData : [],
        currectVersion : "",
        guid : "",
        clicks: 0,
    });
    let state = {};
    const unsubscribe = hdd.subscribe((item)=> {
        state = item;
    })

    onMount(async ()=> {
        AH.listen(document, 'click','.edit_version',function(_this){
            let from_draft =  AH.select(".check-link").getAttribute("content_status");
			let url = window.location.href.replace(/&get-diff(.*?)$/g,'');
			url = url+'&get-diff=1&version_date=' + _this.getAttribute('data-version')+'&from_draft='+from_draft;
			window.location =  url;
		});
		AH.listen(document, 'click','.get-diff',function(_this) {
			AH.toggleDom('#diff_loader', 'show');
            AH.toggleDom('.diff-table', 'hide');
            let current_diff = (AH.select("#prev_btn").classList.contains("disabled")) ? "1" : "-1";
			AH.ajax({
                url: baseUrl+'educator/project/content_version.php',
                data: {ajax:1,current_diff:current_diff,content_guid :state.guid ,version_date : _this.getAttribute('data-version'), react_content_diff : 1, get_source : 1},                         
            }).then((response)=> {
                AH.toggleDom('#diff_loader', 'hide');
                AH.select('#back_to_list').classList.remove("h-imp");
                AH.select('#show_diff').innerHTML = response;
                AH.toggleDom('#show_diff', 'show');//.prepend('<button type="button" class="btn btn-light mb-xl pull-right" id="back_to_list">Back To List</button>').show();
			});
		});
		AH.listen(document, 'click','#back_to_list', function() {
			AH.toggleDom('.diff-table', 'show');
			AH.select('#back_to_list').classList.add("h-imp");
            AH.empty('#show_diff')
            AH.toggleDom('#show_diff','hide');
		}); 
    })

    onDestroy(()=> {
        AH.toggleDom('.diff-table', 'hide');
		AH.toggleDom('#getting_list', 'show');
    });

   // $: console.log("version-",state.tableData)

    beforeUpdate(async ()=> {
        if(versionToggle != state.open) {
            state.guid = guid, 
            state.open = versionToggle;
			AH.toggleDom('#getting_list', 'show');
            AH.toggleDom('.diff-table', 'hide');
			AH.ajax({ 
                url: baseUrl+'educator/project/content_version.php',
                data: {ajax: 1, action:"get_version_list", content_guid : guid },                         
            }).then((response)=> {
                if (response) {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        return false;
                    }
                    state.tableData = response;
                    AH.setCss('.diff_modal', {'padding-top': window.innerHeight/20});
                    AH.toggleDom('.diff-table', 'show');
                    AH.selectAll('#getting_list', 'hide');
                    var current_data = getParameterByName('version_date');
                    if (current_data) {
                        AH.parent(AH.contains("td", current_data), 'tr').classList.contains('bg-danger');
                    }
                    AH.toggleDom('#replaced_diff_loader', 'show');
                    if (response.length > 0) {
                        AH.ajax({
                            url: baseUrl+'educator/project/content_version.php',
                            data: {
                                ajax:1, 
                                current_diff: 1,
                                content_guid: state.guid,
                                version_date: response[0].version_date, 
                                react_content_diff : 1
                            },                         
                        }).then((_response)=> {
                            console.log("Inner ajax");
                            AH.toggleDom('#replaced_diff_loader', 'hide');
                            _response= _response.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/ucLT/g,"&lt;").replace(/ucGT/g,"&gt;");
                            AH.select('#changesData').innerHTML = _response;
                            AH.toggleDom('#changesData', 'show');
                        });
                    }
                }
			});
		}
    });

    function getParameterByName(name) {
		let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    
    function handleClose() {
		closeVersionDialog(false);
		state.open = false;
		AH.toggleDom('.diff-table', 'hide');		
    }
    
    function getDiffData(timeStamp, prev_indx){
		AH.toggleDom('#replaced_diff_loader', 'show');
        AH.toggleDom('#changesData', 'hide');
        let current_diff = (prev_indx == "0") ? "1" : "-1";
        let currentRequest = null;   
        
		currentRequest = AH.ajax({
			url: baseUrl+'educator/project/content_version.php',
            data: {ajax:1,current_diff:current_diff,content_guid :state.guid ,version_date : timeStamp, react_content_diff : 1}, 
            onStart: function()    {           
				if (currentRequest != null) {
					currentRequest.abort();
				}
			},                        
        }).then((response)=> {
            AH.toggleDom('#replaced_diff_loader', 'hide');
			response= response.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/ucLT/g,"&lt;").replace(/ucGT/g,"&gt;");
            AH.select('#changesData').innerHTML = (response);
            AH.toggleDom('#changesData','show');	
		});
    }
    
    function incrementItem (data) {
		if (state.clicks <= state.tableData.length - 2) {
			getDiffData(data.version_date, '1');
			state.clicks = state.clicks + 1;
		} else{
			state.clicks = state.tableData.length -1;
		}
	}
	function decreaseItem (data) {
        let prev_indx = state.clicks - 1;
		if (state.clicks <= 0) {
			state.clicks = 0;
		} else {
			state.clicks = state.clicks - 1;
			getDiffData(data.version_date, prev_indx);
		}	
	}
</script>

<Dialog bind:visible={state.open} style="width: 75%; background-color:#fff;">
    <h4 class="mt-0 font21 mb-5">
		{l.version_control}
	</h4>
    <div>
        <div id="show_diff" class="mt-xl" style="display:none; min-height:200px;"></div>
        <center id="diff_loader" class="mt-xl pt-5" style="display:none; min-height:200px;">
            <!-- Cirular progress-->
            <div>{l.getting_diff}</div>
        </center>
        <center id="getting_list" class="mt-xl" style="display:none;">
            <!-- Cirular progress-->
            <div>{l.getting_list}</div>
        </center>
        <div>
            {#if state.tableData && state.tableData.length > 0}
                <div key="one">
                    <div class="row m-0 diff-table">
                        <div class="row col-12 m-0 p-0">
                            <div class="col-5 m-0 pl-2 pr-2">
                                <b class="text-dark">{(state.tableData[state.clicks].ulist) ? Object.values(state.tableData[state.clicks].ulist).join(', ') : state.tableData[state.clicks].name}</b>
                                <br />
                                {new Date(state.tableData[state.clicks].version_date_format + " UTC").toString().replace(/GMT.*/g,"")} 
                            </div>
                            <div class="col-7 m-0 pl-2 pr-0 text-right">
                                <button 
                                    data-bs-toggle="tooltip" 
                                    id="prev_btn" 
                                    title="Previous" 
                                    class={(state.clicks <= 0) ? "btn btn-light mr-1 disabled" : "btn btn-light"} 
                                    on:click={decreaseItem.bind(this, state.tableData[state.clicks - 1])} 
                                    data-version={state.tableData[state.clicks].version_date}
                                >
                                    <i class="icomoon-24px-previous" style="font-size: 12px"></i>
                                </button>
                                <div class="relative text-right m-2 d-inline-block" style="top:3px;">
                                    <p class="font16">{state.clicks + 1} / {state.tableData.length}</p>
                                </div>
                                <button 
                                    data-bs-toggle="tooltip" 
                                    title="Next" 
                                    class={(state.clicks <= state.tableData.length - 2) ? "btn btn-light mr-1" : "btn btn-light mr-1 disabled"} 
                                    on:click={incrementItem.bind(this, state.tableData[state.clicks + 1])} 
                                    data-version={state.tableData[state.clicks].version_date}
                                >
                                    <i class="icomoon-24px-next"  style="font-size: 12px"></i>
                                </button>
                                <button 
                                    data-bs-toggle="tooltip" 
                                    title="Restore this Version" 
                                    type="button" 
                                    class={(state.tableData[state.clicks].name) ? "btn edit_version btn-light in_draft mr-1" : "btn edit_version btn-light mr-1"} 
                                    data-version={state.tableData[state.clicks].version_date}
                                >
                                    <span class="icomoon-new-tab-2"  style="font-size: 12px; text-align: center"></span> Restore
                                </button>
                                <button 
                                    data-bs-toggle="tooltip" 
                                    title="Source Code" 
                                    class="btn get-diff btn-light" 
                                    data-version={state.tableData[state.clicks].version_date}
                                >
                                    <i class="icomoon-embed" style="font-size: 12px; text-align: center"></i> Source Code
                                </button>
                            </div>
                        </div>
                        <div id="modifiedData" class="row col-12 mt-4 m-0 p-0 border-muted rounded border" style="height: 267px; overflow: overlay;">
                            <center id="replaced_diff_loader" class="pt-5" style="display:none;">
                                <Loader msg="Fetching next version history" size={70}/>
                            </center>
                            <div id="changesData" class="col-12 mt-4">
                                <center><Loader msg="Preparing Layout" size={70}/></center>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <div id="modifiedData" class="row col-12 mt-4 m-0 p-0 border-muted rounded border" style="height: 267px; overflow: overlay;">
                    <center id="replaced_diff_loader" class="pt-5">
                        <Loader msg="Fetching version history" size={70}/>
                    </center>
                    <div id="changesData" class="col-12 mt-4">
                    </div>
                </div>
            {/if}
        </div>
    </div>
    <div slot="footer" class="svelteFooter">
        <Button
            key = {"versionBack"}
            id="back_to_list"
            class="h-imp"
            color="#ccc"
            unelevated={true}
        >
            Back to list
        </Button>
        <Button
            key = {"versionClose"}
            on:click={handleClose}
            color="#ccc"
            unelevated={true}
        >
            Close
        </Button>  
    </div>
</Dialog>