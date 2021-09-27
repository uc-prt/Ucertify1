<script>
/**
 *  File Name   : AnalyzeEbook.svelte
 *  Description : Analyze Ebook Module
 *	Author      : Prabhat Kumar
 *  Version     : 1.0
 *  Package     : svelte_items
 *  Last update : 26 Sep 2021
 */
    import {onMount} from 'svelte';
    import { Button, Dialog, Checkbox, Snackbar } from 'svelte-mui/src';
    import Loader from '../../helper/Loader.svelte';
    import l from '../libs/editorLib/language';
    import jquery from "jquery";
    
    export let analyzeEbookMenu;
	export let oldStemData;
	export let controls;
	export let addItemButton;
	export let changeAnalyzeMenuProp;

    $: analyzeEbookContent = true;
    let analyzedItems = {};
    let analyzedItemsCount = 0;
    let showActivator = true;
    let processedItemsCount = 0;
    let oldStemData2 = "";

    const convertObject = (obj) => {
		for(let ele of obj) {
			ele['outerHTML2'] = (ele['nodeName'] == '#text') ? ele['textContent'] : ele['outerHTML'];
		}
		let newobj = {};
		let j = 0;
		let flag = 1;
		let validBlocks = ["UL", "DIV", "DL", "TABLE", "UC:SYNTAX"];
		for (let ele of obj) {
			let elem = ele['nodeName'];
			if (validBlocks.indexOf(elem) >= 0) {
				newobj[j] = ele;
				j = parseInt(j) + 1;
				flag = 1;
			} else {
				if (flag == 1) {
					if((elem == 'CENTER' || elem == 'UC:CAPTION') && ele['outerHTML2'].indexOf("uc:caption") >= 0) {
						let outerhtmlnew = ele['outerHTML2'];
						if(outerhtmlnew != undefined) {
							let lastkey = Object.keys(newobj)[Object.keys(newobj).length-1];
							newobj[lastkey]['outerHTML2'] = newobj[lastkey]['outerHTML2']+outerhtmlnew;
							newobj[lastkey]['className'] = 'old_table_format';
						}	
					} else {
						newobj[j] = ele;
						j = parseInt(j) + 1;
						flag = 0;
					}
				} else {
					var outerhtmlnew = ele['outerHTML2'];
					if(outerhtmlnew != undefined) {
						var lastkey = Object.keys(newobj)[Object.keys(newobj).length-1];
						newobj[lastkey]['outerHTML2'] = newobj[lastkey]['outerHTML2']+outerhtmlnew;
					}
				}			
			}
		}
		return newobj;
	}
    const analyzeEbookDialog = () => {
        let analyzedItemsCount2 = 0;

        const parser = new DOMParser();
        const doc = parser.parseFromString(oldStemData, 'text/html');

        let temphtml = convertObject(doc.body.childNodes);
        oldStemData2 = temphtml;
        
        let analyzedItems2 = [];
        for (let i in temphtml) {	
            const htmlcontent = temphtml[i]['outerHTML2'];
            if(htmlcontent != '') {
                analyzedItemsCount2 +=1;

                let type;
                let itemTypeJSON = {'#text': 'text', 'UL':'list', 'box':'box'};
                if(temphtml[i].nodeName == 'DIV') {
                    if(temphtml[i].className != "") {
                        if(temphtml[i].className.indexOf('box') >= 0) {
                            type = 'box';
                        }
                    }
                } else {
                    type = temphtml[i].nodeName;
                }
                let itemType = itemTypeJSON[type];

                analyzedItems2.push([itemType, temphtml[i].nodeName, htmlcontent]);
            }
        }
        
        analyzedItemsCount = analyzedItemsCount2;
        analyzedItems = analyzedItems2; 

        setTimeout(() => {                       
            analyzeEbookContent = false;
        }, 1000);
    }

    onMount(() => {
        analyzeEbookDialog();
        showActivator = false;
    });

    const showMore = index => {
        const ele = document.querySelector(`.row-${index}`);
        if(ele){
            ele.querySelector(`.part-text-${index}`).classList.add('d-none');
            ele.querySelector(`.whole-text-${index}`).classList.remove('d-none');
            ele.querySelector(`.show-more-btn-${index}`).classList.add('d-none');
            ele.querySelector(`.show-less-btn-${index}`).classList.remove('d-none');
        }
    }
    const showLess = index => {
        const ele = document.querySelector(`.row-${index}`);
        if(ele){
            ele.querySelector(`.part-text-${index}`).classList.remove('d-none');
            ele.querySelector(`.whole-text-${index}`).classList.add('d-none');
            ele.querySelector(`.show-more-btn-${index}`).classList.remove('d-none');
            ele.querySelector(`.show-less-btn-${index}`).classList.add('d-none');
        }
    }
</script>
<Dialog width="700" visible={true} style="background-color:#fff; border-radius: 5px;">
	{#if analyzeEbookContent}
        <div class='editor_modal_content overflow-hidden'>
            <Loader size={50} msg={"Please wait Analyzing"}/>
        </div>
    {:else}
        <h4 class="mb-5 font21">
            <div class="d-flex justify-content-between">
                <div>{l.analyze_content}</div>
            </div>
        </h4>
        <div class={(showActivator == false) ? "" : "h"}>
            <div class="alert alert-info alert-dismissible">
                <p class="mb-0">There are <span id="analyzeditemscount">{analyzedItemsCount}</span> elements which can be converted in ebook item.</p> 
            </div>

            {#if analyzedItemsCount > 0}
                <div>
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th class="h-imp"><label class="custom_checkbox_new float-left">
                                    <input type="checkbox" rel="chk_1" class="uc_checkbox" />
                                    <div class="check_mark_custom"></div>
                                </label></th>
                                <th class="text-dark text-nowrap">{l.element_name}</th>
                                <th class="text-dark">{l.detail}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each analyzedItems as item, i}
                                <tr key="{i}" class="row-{i}">
                                    <td class="h-imp">
                                    <label class="custom_checkbox_new">
                                        <input type="checkbox" parent="chk_1" class="uc_checkbox" data-id="{i}" data-itemtype="{item[0]}" />
                                        <div class="check_mark_custom"></div>
                                    </label></td>
                                    <td>"{item[1]}"</td>
                                    <td class="text-break text-wrap">
                                        <span class="part-text-{i}">{item[2].slice(0, 100)} {#if item[2].length>100}...{/if}</span>
                                        <span class="whole-text-{i} d-none">{item[2]}</span>
                                        <span class="text-danger show-more-btn-{i}" role="button" tabindex="0" on:click={() => showMore(i)}>Show more ></span>
                                        <span class="text-danger show-less-btn-{i} d-none" role="button" on:click={() => showLess(i)}>Show less</span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
        <div class="svelteFooter">
            <Button
                unelevated={true}
                outlined={true}
                variant="contained"
                color="#ccc"
            >
                {l.convert}
            </Button>
            <Button
                unelevated={true}
                outlined={true}
                on:click={changeAnalyzeMenuProp}
                color="#ccc"
            >
                {l.cancel}
            </Button>
        </div>
    {/if}

</Dialog>