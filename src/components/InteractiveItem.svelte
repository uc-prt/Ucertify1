<script>
    import {AH} from '../../helper/HelperAI.svelte';
    let snt_icon = "";
    function searchItem(_this) {
        document.querySelectorAll(".items_list").forEach((elm)=> {
            if(elm.textContent.toLowerCase().includes(_this.value.toLowerCase())) {
                AH.toggleDom(elm, 'show');
            } else {
                AH.toggleDom(elm, 'hide');
            }
        })
    }
    export function createItems() {
        AH.selectAll('.main_items,.modal_items', 'html', '');
        document.getElementById("searchText").value = '';
        interactive_item.map((data)=> {
            for (let item in data ) {
                let filter = AI.get('filter_item') ? AI.get('filter_item').includes(item) : true;
                if (filter) {
                    AH.insert("#main_items", `<li id="${item}" class="items_list font14">${item}</li>`, 'beforeend');
                }
            }
        });

        interactive_item.map(function(o) {
            Object.keys(o).forEach(function(key) { 
                Object.keys(o[key]).map(function(e) {
                    let item = o[key][e];
                    if (item.hide != true) {
                        document.querySelectorAll('.modal_items').forEach((elm)=> {
                            AH.insert(elm, `<div id="${item.label}" data-html="${item.html}" data-type="${key}" class="${key} item_int thumbnail btn col-sm-5 border" style="max-width:100%;height:130px;background-image:url(${item.default_image});background-size:contain;background-position:center;background-repeat:no-repeat;overflow:hidden;background-color:#fff;"><div class="item_labelClass">${item.label}</div></div>`, 'beforeend');
                        });
                    }
                });
            });
        });
        AI.listen('#main_items', 'click', '.items_list', function(_this, e) {
            AH.selectAll(".items_list", 'removeClass', "colorremover");
            var show = _this.textContent;
            AH.selectAll('.item_int', 'hide');
            AH.selectAll('.'+show, 'show');
            _this.classList.add("colorremover");
            AH.getBS("#items_list", 'Modal').show();
        });
        
        AH.bind('#go_back', 'click', function(event) {
            AH.getBS("#interactive_items", 'Modal').show();
            AH.getBS("#items_list", 'Modal').hide();
        });
        AH.bind("#advance_id", 'click', function(event) {
            AH.getBS("#advance_list", 'Modal').show();
        });
    }
</script>

<div class="items_block">
    <div class="modal fade left" id="type_change" role="dialog" style="z-index:9999!important;width:100%">
        <div class="modal-dialog">
            <div class="modal-content">
                <div style="padding: 20px 20px 20px 13px" class="border-bottom mb-3">
                    <div style="float:left;">Change Type</div>
                    <button type="button" class="advance_btn_class h-imp ml btn-primary" id="advance_id">Advance</button>
                    <button 
                        style="font-size:23px;position:relative;bottom:6px;float:right;" 
                        type="button" 
                        class="close" 
                        data-bs-dismiss="modal"
                    >&times;</button>
                </div>
                <div class="modal-body p-3">
                    <ul class="sub_type list-unstyled" style="padding:0">   
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="modal left fade in" id="interactive_items" role="dialog" data-backdrop="true" style="z-index:9999!important;width:321px">
        <div class="modal-dialog">
            <div class="modal-content">
                <div style="padding: 15px 15px 15px 8px" class="border-bottom mb-3">
                    <button 
                        style="font-size:23px;" 
                        type="button" 
                        class="close m-0" 
                        on:click="{()=> AH.getBS('#items_list', 'Modal').hide()}" 
                        data-bs-dismiss="modal"
                    >&times;</button>
                    <div class="">Block Library</div>
                </div>
                <div class="modal-body" style="padding:0">
                    <div class="px-2 input-group pb-3">
                    	<div class="input-group-prepend">
                    		<span class="icomoon-search-3 input-group-text"></span>
                    	</div>
                    	<input id="searchText" on:keyup="{searchItem}" placeholder="Search" class="form-control" type="text" />
                    </div>
                    <ul class="main_items" id="main_items">   
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="modal left_second fade" id="items_list" role="dialog" style="z-index:9998!important">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-body modal_items">  
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="edit_item_modal" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Edit content</h4>
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body edit_options"> 
                    <div id="edit_tab" class="edit_modal_body"></div>
                </div>
                <div class="modal-footer">
                    <button id="done_button" type="button" class="btn btn-light" data-bs-dismiss="modal">Done</button>
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal left fade in" id="advance_list" role="dialog" data-backdrop="true" style="z-index:9999!important;width:321px">
        <div class="modal-dialog">
            <div class="modal-content">
                <div style="padding: 20px 20px 20px 13px">
                    <button 
                        style="font-size:23px;position:relative;bottom:6px;" 
                        type="button" 
                        class="close" 
                        on:click="{()=>AH.getBS('#advance_list', 'Modal').hide()}" 
                        data-bs-dismiss="modal"
                    >&times;</button>
                    <div class="">Nested list</div>
                </div>
                <div class="modal-body" style="padding:0">
                    <ul class="nested_items">
                    </ul>
                    <div class="mr-md" style="text-align: right; margin-top: 6px;">
                        <button type="button" class="btn btn-primary save_sublist">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="alt_description" role="dialog" style="z-index: 99999 !important;">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body edit_options"> 
                    <textarea rows="20" style="width:100%" id="alt_text"></textarea>
                </div> 
                <div class="modal-footer">
                    <button id="alt_done" type="button" class="btn btn-light" data-bs-dismiss="modal">Done</button>
                </div>
            </div>
        </div>
    </div>
</div>