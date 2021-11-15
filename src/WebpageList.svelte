<script>
    import { beforeUpdate, onMount } from 'svelte';
    import { Button, Dialog } from 'svelte-mui/src';
    import { writable } from 'svelte/store';
    import { AH } from '../helper/HelperAI.svelte';
    import Loader from '../helper/Loader.svelte';
    import l from './libs/editorLib/language';

    export let editorState;
    export let domainToggle;
    export let selectedDomain;

    //let webpage_selected = (webpage_selected) ? JSON.parse(webpage_selected) : [];
    let state = {};
    let hdd = writable({
	      open: false,
	      value : 0,
	      webpageArray : [],
          guid : "",
          domainArray: [],
        });
    const unsubscribe = hdd.subscribe((items)=> {
        state = items;
    });

    onMount(async()=> {
       // state.domainToggle = domainToggle;
        AH.listen(document, 'change','#domains', (_this)=>{
			let value = _this.value;
			editorState.domainToggle = false;
			AH.activate(2);
			state.value = value;
			if (value != 0) {
				AH.ajax({
                    url: baseUrl+"editor/",
                    data: {"action":"loadwebpage","content_guid":value,"ajax":1}
                }).then((data)=> {
                    data = JSON.parse(data);
					let webpageArray = [];
					for(let i in data) {
						AH.select('#'+i, 'html', data[i]);
						webpageArray[i] = data[i];
					}
					editorState.webpageArray = webpageArray;
					AH.select('#show_guid', 'html', value).style.display = 'block';
					editorState.guid = value;
					AH.activate(0);
				}, "json");
				AH.select('#save_xml', 'removeClass', 'disabled')
                AH.select('#save_xml', 'attr',{disabled: false});
			}
		});
    });

    beforeUpdate(async()=> {
        if (domainToggle != state.open) {
			state.open = domainToggle;
			AH.select('#showWebpage', 'show');
			AH.select('#webpage_list', 'hide');
            let items = [];
            AH.ajax({
                url: baseUrl+"editor/", 
                data: { 
                    ajax: 1, 
                    "action": "get_webpage_templates", 
                    content_subtype: editorState.item
                }
            }).then((data)=> {
                data = JSON.parse(data);
                if (data) {
                    for(var i in data) {
                        items.push({
                            key: i, 
                            value:i,
                            selected: AH.select('#show_guid').innerHTML == i ? true : false,
                            data: data[i],
                        });
                    }
                }
                AH.select('#showWebpage', 'hide');
                AH.select('#webpage_list', 'show');
                state.domainArray = items; 
                state.value = 0;
                try {										
                    AH.select2('.select2', {
                        placeholder: "Select for webpage",
                        allowClear: false
                    })
                    // .on("select2:opening", function() {
                    //         jQuery(".webpagedialog").removeAttr("tabindex", "-1");
                    // }).on("select2:close", function() { 
                    //         jQuery(".webpagedialog").attr("tabindex", "-1");
                    // });						
                } catch(e) {
                    console.log(e);
                }
            });
		}
    })
    function handleClose() {
        editorState.domainToggle = false;
        selectedDomain(state.value);
		//editorState.domain = state.value;
		state.open = false;	
	}
	function handleChange(event, index, value) {
		value = event.target.value;
		editorState.domainToggle = false;
		state.value = value;
		if (value != 0) {
            AH.activate(2);
			AH.ajax({
                url: baseUrl+"editor/",
                data: {"action":"loadwebpage","content_guid":value,"ajax":1}
            }).then((data)=> {
                data = JSON.parse(data);
				for (let i in data) {
					AH.select('#'+i, 'html', data[i]);
				}
				AH.select('#show_guid', 'html', value);
				editorState.guid = value;
				editorState.webPageData = data;
			}).finally(() => {
				AH.activate(0);
            });
			AH.select('#save_xml', 'removeClass', 'disabled')
            AH.select('#save_xml', 'attr', {disabled: false});
		}
	}
</script>

<Dialog width="600" bind:visible={state.open}>
    <div slot="title" style="text-align: left;">
        <div style="">Webpage List</div>
    </div>
    <div>
        <div id="showWebpage" style="min-width: 500px; min-height: 200px; margin: 25px 15px;">
            <center id="process">
                <Loader size={60} thickness={2} />
                <h3>{l.getting_webpage}</h3>
            </center>
        </div>
        <div id="webpage_list" style="min-width: 500px; min-height: 310px; margin: 25px 15px; display: none;">
            <label class="mr-md" for="domains">Select Webpage : </label>
                <div class="col-12">
                    <select 
                        id="domains" 
                        class="form-select w-100 select2 webpage_list" 
                        disabled="" 
                        name="webpage" 
                        on:blur={handleChange}
                    >
                        <option value="0" selected>Select for webpage</option>
                        {#each state.domainArray as items, i (items.key)}
                            <option key={items.key} value={items.key} selected={items.selected ? "selected" : null}>{items.data}</option>
                        {/each}
                    </select> 
                </div>
        </div>
    </div>
    <div slot="footer" class="footer">
        <button
            class="btn btn-outline-secondary float-end m-3"
            on:click={handleClose}
        >
            {l.close}
        </button>
    </div>
</Dialog>
