<script>
    import {onMount} from 'svelte';
    import {AH, XMLToJSON} from '../helper/HelperAI.svelte';
    import {Checkbox, Dialog, Button } from 'svelte-mui/src';
    import l from '../src/libs/Lang';
    import IconsList from './IconsList.js';
    import { writable } from 'svelte/store';
    export let xml;
    export let getChildXml;
    export let visible = false;

    const note1 = "Here # is the parent (root) element of tree and it will not be drag, ## are child of parent element and it will also not be drag, ### are the child of parent element’s childs and it can be drag and drop.";
    const note2 = "Key|Option text|Icon (Put comma after each line) Where  option text is the label for option of contextmenu list and icon is icon for that label and key is numeric value that helps to create the list option.";
    let sort = 0;
    let allowSort = 1;
    let icons_html = IconsList;
    let state = {};

    const hdd = writable({
        xml: '',
        sort: false,
        allowSort: 1,
        openHelp: false,
    });
    const unsubscribe = hdd.subscribe((items)=> {state = items});

    onMount(()=> { 
        state.xml = xml;
        parseXml(xml);
        AH.bind('#main', 'keyup', ()=> {
            var auth_timer2 = setTimeout(function () {
                updateXmlValue();
                clearTimeout(auth_timer2);
            }.bind(this), 500);
        })
        AH.bind('#main', 'click', ()=> {
            updateXmlValue();
        });
        AH.listen(document, 'click', '#xmlDone', ()=> {
            window.xml_button_clicked = true;
        });
    });

    function parseXml(xml) {
        var newXml = XMLToJSON(xml);
        var seq = newXml.smxml.tree ? newXml.smxml.tree : newXml.smxml.list;
        if (seq) {
            (seq._options) ? (AH.select('#options').value = seq._options) : '';
            AH.select('#tree').value = seq.__cdata.replace(/\t/gmi, '');
            (seq._allowSort != "0") ? (state.allowSort = true) : (((seq._allowsort != "0") ? state.allowsort= true : ''));
            (seq._headingCorrect) ? (AH.select('#headingcorrect').value = seq._headingCorrect) : (((seq._headingcorrect) ? (AH.select('#headingcorrect').value = seq._headingcorrect) : ''));
            (seq._headingAll) ? (AH.select('#headingall').value = seq._headingAll) : ((seq._headingall) ? (AH.select('#headingall').value = seq._headingall) : '');
            (seq._sort == 1) ? state.sort= true : state.sort= false;
            let icons = ["database-icon","table-icon","file-icon"];

            if (seq.icons) {
                let new_icons = seq.icons.split(',');
                icons = (new_icons.length == 3) ? new_icons : icons;
            }
            AH.select('#parent_icon').value = (icons[0]);
            AH.select('#subparent_icon').value = (icons[1]);
            AH.select('#default_icon').value = (icons[2]);
        }
        updateXmlValue();
    }

    function updateXmlValue() {
        let xmlDom = AH.parseHtml(state.xml);
        let elem = AH.findChild(xmlDom, 'tree');
        sort = (AH.select("#sort").checked) ? 1 : 0;
        
        if (!elem) {
            elem = AH.findChild(xmlDom, 'list');
        }
        if (AH.select("#headingcorrect").value == "" || AH.select("#headingall").value == "") {
            AH.showmsg("Heading should not be blank!");
        }
        let parent_icon = AH.select('#parent_icon').value;
        let subparent_icon = AH.select('#subparent_icon').value;
        let default_icon = AH.select('#default_icon').value;
        let icons = "database-icon,table-icon,file-icon";
        if (parent_icon.trim() != '' && subparent_icon.trim() != '' && default_icon.trim() != '') {
            icons = parent_icon + ',' + subparent_icon + ',' + default_icon;
        } else {
            AI && AI.showmsg(l.icon_not_blank);
        }
        if (elem) {
            AH.setAttr(elem, {
                "headingCorrect": AH.select("#headingcorrect").value,
                "headingAll": AH.select("#headingall").value,
                "options": AH.select("#options").value.trim().replace(/\\n{2,}/g, "\\n").replace(/\\n/g, ","),
                "sort": sort,
                "allowSort": allowSort,
                "icons": icons,
            });
            elem.innerHTML = ("<![CDATA[\n" + AH.select("#tree").value + "\n]]>");
        }
        state.xml= formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom));
        getChildXml(formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom)));
    }

    function handleDialog() {
        state.openHelp = true;
        visible = true;
    }

    // used to close the configuration dialog box
    function handleClose() {
        visible = false;
        state.openHelp = false;
    }

    // for searching in the table
    function searchTable(inputVal, class_name) {
        var table = AH.select(class_name);
        AH.toggleDom(table, 'show');
        if (inputVal.trim() == '') {
            AH.selectAll('.treeview_record' , 'hide');
            AH.selectAll(class_name + ' tr', 'show');
        } else {
            if (table.nodeName != undefined) {
                AH.find(table, 'tr', 'all').forEach((row, index)=> {
                    var allCells = AH.find(row, '.search', 'all');
                    if (allCells.length > 0) {
                        var found = false;
                        allCells.forEach((td, index)=> {
                            var regExp = new RegExp(inputVal, 'i');
                            if (regExp.test(td.textContent)) {
                                found = true;
                                return false;
                            }
                        });
                        (found == true) ? AH.select(row,'css',{display:''}) :  AH.select(row,'css',{display:'none'});
                    }
                });
                if (AH.find(table, '.search', 'visible').length > 0) {
                    AH.selectAll('.treeview_record', 'hide')
                    AH.toggleDom(table, 'show');
                } else {
                    AH.toggleDom('.treeview_record', 'show');
                    AH.toggleDom(table, 'hide');   
                }
            }
        }
    }
</script>
    
<main>
    <div id="authoringArea" class="border">
        <center>
            <div id="main" class="py-3 min_height_20 width98">
                <div class="border-0" style= "width: 95%">
                    <div>
                        <div class="row my-2">
                            <div class="border-0 col-6 pr-1">
                                <div class="text-left">
                                    <label for="headingcorrect" class="text-dark">{l.heading_correct}</label>
                                </div>
                                <input
                                    type="text"
                                    id="headingcorrect"
                                    defaultValue=" "
                                    class="form-control"
                                />
                            </div>
                            <div class="border-0 col-6 pl-1">
                                <div class="text-left">
                                    <label for="headingall" class="text-dark">{l.heading_all}</label>
                                </div>
                                <input
                                    type="text"
                                    id="headingall"
                                    defaultValue=" "
                                    class="form-control"
                                />
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="border-0 col-3 pr-1">
                                <div class="text-left">
                                    <label for="parent_icon" class="text-dark"># icon</label>
                                </div>
                                <input
                                    type="text"
                                    id="parent_icon"
                                    class="form-control"
                                />
                            </div>
                            <div class="border-0 col-3 pl-1">
                                <div class="text-left">
                                    <label for="subparent_icon" class="text-dark">## icon</label>
                                </div>
                                <input
                                    type="text"
                                    id="subparent_icon"
                                    class="form-control"
                                />
                            </div>
                            <div class="border-0 col-3 pl-1">
                                <div class="text-left">
                                    <label for="default_icon" class="text-dark">### icon</label>
                                </div>
                                <input
                                    type="text"
                                    id="default_icon"
                                    class="form-control"
                                />
                            </div>
                            <div class="border-0 col-3 pl-1" style="top:28px;">
                            <button class="btn btn-outline-primary w-100" id="icons_info" on:click={handleDialog}>Icons List</button>
                            </div>
                        </div>
                        <div class="text-left">
                            <Checkbox id="sort" bind:checked={state.sort} value="Sort Options" name="sort" title={"Sort Options"}><span>Sort Options</span></Checkbox>
                        </div>
                        <textarea id="tree" wrap="off" class="sm_input_textarea mb-0 resize_none" style="height:150px;"></textarea>
                        <textarea id="options" wrap="off" style="height:100px;" class="sm_input_textarea mt-2 resize_none mb-0" placeholder="Key|Option text|Icon (Put comma after each line)"></textarea>
                    </div>
                </div>
                <div class="font13 mx-3 text-left text-danger">
                    <strong class="ml-lg-3">{l.note_text}</strong>
                    <ol>
                        <li>{l.select_icon}</li>
                        <li>{l.heading_info}</li>
                        <li>{l.key_info}</li>
                    </ol>
                </div>
                <!-- <div class="font13 mx-3 text-left text-danger"><strong>*Note:</strong>{note1}</div>
                <div class="font13 mx-3 text-left text-danger"><strong>*Note:</strong>{note2}</div> -->
            </div>
        </center>
    </div>
    <Dialog width="400" bind:visible={state.openHelp} style="background: #fff; border-radius: 5px;">
        <h4 class="mt-1 font21 mb-4">
            <div class="d-flex justify-content-between">
                <div>Icon List</div>
            </div>
        </h4>
        <div class="text-center" style="overflow-y:auto">
            <input type="text" id="tableSearch" placeholder="Search Icons" class="form-control" on:keyup = {(event)=>{searchTable(event.target.value,'.icons_table')}}/>
            <div class="alert alert-danger treeview_record my-2 h">{l.no_icons}</div>
            <div class="treemodule_table">
                {#if icons_html} 
                    {@html icons_html}
                {:else}
                    <div class="alert alert-info my-2">{l.loading_icons}</div>
                {/if}
            </div>
        </div>
        <div slot="footer" class="svelteFooter">
            <Button
				on:click={handleClose}
				class="btnColor"
			> {l.close} </Button>
        </div>
    </Dialog>
</main>
<style>
:global(.btnColor) {
    background-color: #dee2e6!important;
    box-shadow: 2px 2px 5px #000;
}
</style>