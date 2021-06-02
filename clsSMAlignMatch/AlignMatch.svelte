<!--
 *  File Name   : AlignMatch.svelte
 *  Description : Container for AlignMatch Authoring Module
 *  Author      : Rashmi Kumari
 *  Package     : pe-items
 *  Last update : 05-Jan-2021
 *  Last Updated By : Rashmi Kumari
-->
<script>
	import { onMount,beforeUpdate,afterUpdate } from "svelte";
	import { writable } from "svelte/store";
    import { XMLToJSON, AH } from '../helper/HelperAI.svelte';
    import l from '../src/libs/editorLib/language';
    import AlignMatchButton from "./AlignMatchButton.svelte";
    export let getChildXml;
    export let editorState;
    export let xml;
    let files;
	let state = {},
	// used for delete icon
	icon_class = "icomoon-new-24px-delete-1 position-relative s3",
	// used to uniquily define the id of the cells
	con = 1,
	//used for update the value of state authordata
	myObj = [],
	// container for match data
	matchdata = {
        // container for category key of matchdata
        category: {
            // container for categories key of category key of matchdata
            categories: []
        },
        // container for item key of matchdata
	    item: {
            // container for items key of item key of matchdata
            items: []
        },
        // not used any where
        settings: {}
    };
	
	// id of the cell on which clicked for change the text
	let blnUserChange = null;
	let authordata = writable({ 
		// contains the xml data
		xml: "",
		// not used
		csv: "",
		// not used
		json: "",
		// used to show the UI of the component
		authordata: "",
		// used to set the max with
		maxWidth: "",
		// contains the type of cell that have to update such as category cell or item cell when click on it
		editType: "",
		// contains the cell id that have to be update when click on it
		editId: "",
    });
	const unsubscribe = authordata.subscribe((items) => {
		state = items;
    })

	afterUpdate(() => {
        if (xml!=state.xml) {
			state.xml = xml
			loadModule(xml); 	
		}
    });

    beforeUpdate(() => {
        if (editorState) {
            AH.set('alignMatchReset', true);
        }
        if (editorState.stopAuthoringUpdate == true) {
            return;
        }
    })

	onMount(() => {	
        state.xml = xml;
		loadModule(xml);
    });

	function loadModule(loadXml) {
		// convert the xml into json and pass it in the parseXMLAuthoring function to parse the xml
		loadXml = XMLToJSON(loadXml);
		parseXMLAuthoring(loadXml);
    }

	// update the value of state xml, maxWidth, and authordata
	function parseXMLAuthoring(MYXML) {
        // contains json data of cdata of xml
        let jsonData = JSON.parse(MYXML.smxml.__cdata);
        // sets the value of state authordata
        manipulate(jsonData);
		// sets the value of state 'xml' with the value of variable jsonData
		state.xml = jsonData;
		// sets the value of state 'maxWidth'
		state.maxWidth = ((MYXML.smxml._maxwidth) ? parseInt(MYXML.smxml._maxwidth) : 800)
    }

	// sets the value of state authordata
	function manipulate(qwerty) {
        // creates temporary object of cdata of xml
        let tempObj = JSON.parse(JSON.stringify(qwerty));
        // makes blank array myObj
        myObj = [];
        // creates an array
        let ele = [];
        tempObj.category.categories.forEach(function (index) {
            // creates a temporary object
            let deArr = {};
            // creates id key with value defined in 'id' key of object stored in varaible 'index'
            deArr.id = index.id;
            // creates class key with value 'categories'
            deArr.class = 'categories';
            // creates class key with value 'Tags 0'
            deArr.tags = 'Tags 0';
            // creates text key with value defined in 'text' key of object stored in varaible 'index'
            deArr.text = index.text;
            // pushes temporary object 'deArr' into array ele
            ele.push(deArr);
        });
        // pushes array ele into array myObj
        myObj.push(ele);
        // findes no of categories available
        let catLen = tempObj.category.categories.length;
        let itemsArray = splitArrayIntoChunksOfLen(tempObj.item.items,catLen);
        itemsArray.forEach((value) => {
            let rowArr = [];
            value.forEach((item_val) => {
                let deArr = {};
                deArr.id = item_val.id;
                deArr.class = 'items';
                deArr.tags = 'Tags ';
                if (blnUserChange == item_val.id) {
                    // sets the value null of blnUserChange
                    blnUserChange = null;
                    // creates 'text' key with value of key 'label' of variable item_val
                    deArr.text = item_val.label;
                } else {
                    // creates 'text' key with value '*' + value of key 'imageurl' of variable item_val + '[' + value of key 'imagealt' of variable item_val + ']' if key 'imageurl' is not blank otherwise value will be the value of key 'label' of variable item_val
                    deArr.text = (item_val.imageurl != '') ? '*' + item_val.imageurl + '[' + item_val.imagealt + ']' : item_val.label;
                }
                rowArr = [...rowArr, deArr];
            })
            myObj = [...myObj, rowArr];
        });
		// assign the value of array myObj to state authordata
		state.authordata = myObj;
    }

    // split xml in chunks 
    function splitArrayIntoChunksOfLen(arr, len) {
        let chunks = [], i = 0, n = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    }

	// close the edit dialog box and update the xml after click on update or close (x) button
	function closeDialog() {
        if (AH.select('#editValue').value.trim() != '') {
            AH.getBS('#editModal','Modal').hide();
            // change the xml and update the xml
            reverseXml();
        }
    }

	// change the xml and update the xml
    function reverseXml() {
        try {
            // contains the string data of xml json
            let reversedata = JSON.stringify(state.xml, null, 4);
            // creates new xml 
            let updatedXml = '<smxml type="35" name="AlignMatch" maxwidth="' + state.maxWidth + '"><!--[CDATA[' + reversedata + ']]--></smxml>';
            // updates xml
            getChildXml(updatedXml);
        } catch (event) {
            console.warn(event.message);
        }
    }

	// open the edit dialog box to update the text of that cell which is clicked
    function openEditDialog(type, id, event) {
        // updates the value of state 'editType'
		state.editType = type,
		// updates the value of state 'editId' 
        state.editId = id;
        // shows the edit dialog box when clicked on any cell for update the text of that cell
        AH.getBS('#editModal','Modal').show();
        // contains the value of cell, which is clicked and sets that value in the body of edit dialog box
        AH.select("#editValue").value = event.target.value;
        // focus the body of edit dialog box
        AH.select("#editValue").focus();
    }

	// updates the data of category
    function updateCategory(xelement, event) {
        state.xml.category.categories.map(function (data) {
            if (data.id == xelement) {
                // updates the data of category
                data.text = (event.target.value != '') ? event.target.value : '';
            }
            if (data.text.trim() == '') {
                AH.selectAll('#editValue', 'addClass', 'border-danger');
                AH.selectAll('.error_msg', 'removeClass', 'h');
            } else {
                AH.selectAll('#editValue', 'removeClass', 'border-danger');
                AH.selectAll('.error_msg', 'addClass', 'h');
            }
        });
    }

	// used to update the cell value
    function updateItem(xelement, event) {
        try {
            state.xml.item.items.map(function (data) {
                if (data.id == xelement) {
                    if (event.target.value != '') {
                        if (event.target.value.charAt(0) == '*') {
                            // contains the index of '[' in target element value
                            let startIndex = event.target.value.indexOf('['),
                                // contains the index of ']' in target element value
                                endIndex = event.target.value.indexOf(']');
                            if (startIndex > -1 && endIndex > -1) {
                                // contains the image data
                                let imageurl = event.target.value.substr(1, startIndex - 1);
                                // sets the value of key 'imageurl' of array key 'items' of object key item of state object xml that is equals to the value of variable imageurl
                                data.imageurl = imageurl;
                                // sets the value blank of key 'label' of array key 'items' of object key item of state object xml
                                data.label = '';
                                // contains the alt message of image
                                let imagealt = event.target.value.substring(event.target.value.lastIndexOf("[") + 1, event.target.value.lastIndexOf("]"));
                                // sets the value of key 'imagealt' of array key 'items' of object key item of state object xml that is equals to the value of variable imagealt
                                (imagealt != '') ? (data.imagealt = imagealt) : (data.imagealt = "imagealt");
                            } else {
                                // sets the value of key 'label' of array key 'items' of object key item of state object xml that is equals to the value of target element
                                data.label = event.target.value;
                                // makes the image value blank
                                data.imageurl = "";
                                // makes the image alt message value blank
                                data.imagealt = "";
                                // shows the warning message
                                AH.alert("Image format is not correct");
                            }
                        } else {
                            // makes the image value blank
                            data.imageurl = "";
                            // makes the image alt message value blank
                            data.imagealt = '';
                        }
                        if (AH.select('#editValue').value.trim() == '') {
                            AH.selectAll('#editValue', 'addClass', 'border-danger');
                            AH.selectAll('.error_msg', 'removeClass', 'h');
                        } else {
                            AH.selectAll('#editValue', 'removeClass', 'border-danger');
                            AH.selectAll('.error_msg', 'addClass', 'h');
                        }
                    }
                    data.label = event.target.value;
                    // id of the cell on which clicked for change the text
                    blnUserChange = xelement;
                }
            });
        } catch (event) {
            console.warn(event.message);
        }
    }

	// removes the row and updates the value of key 'tags' of each cell and update the xml
    function removeItems(event) {
        // find the number of categories exist
        let collen = state.xml.category.categories.length;
        // finds the number of items row exist
        let rowlen = state.xml.item.items.length / collen;
        if (rowlen > 2) {
            // contains numeric data from id of delete button used for delete the row with prefix 'Tags '
            let tag = 'Tags ' + this.getAttribute("row_tags");
            // creates temporary array
            let tempArr = [];
            state.xml.item.items.map(function (data, i) {
                if (data.tags != tag) {
                    // pushes the cell data into array tempArr which not lies in the row which we want to delete
                    tempArr.push(state.xml.item.items[i]);
                }
            });
            // used to uniquely define the 'tags' key value of array key 'items' of object key 'item' of state object 'xml'
            let _count = 1;
            // contains the categories used
            state.authordata.map(function (datai) {
                // contains the perticular category at specified index
                datai.map(function (dataj) {
                    tempArr.map(function (datak) {
                        if (dataj.id == datak.id) {
                            // defines the value for key 'tags' of array object key 'items' where column id match with category id of key object 'item' of state object xml
                            datak.tags = 'Tags ' + (_count++);
                        }
                    });
                });
            });
            // finds the number of row exist after removing the desired row
            rowlen = tempArr.length / collen;
            for (let i = 0, k = 0; i < rowlen; i++) {
                for (let j = 0; j < collen; j++ , k++) {
                    // updates value of key 'tags' of array object key 'items' for row 'i' and column 'j' of key object 'item' of state object xml
                    tempArr[k].tags = 'Tags ' + (i + 1);
                }
            }
            // updates the value of array key 'items' of object key 'item' of state object 'xml'
            state.xml.item.items = tempArr;
            // change the xml and update the xml
            reverseXml();
        } else {
            // shows the warning message
            AH.alert("You can't have less than 2 rows.");
        }
    }

	// removes the category column have specified 'id' and update the xml
    function removeCategory(id) {
        if (state.xml.category.categories.length > 2) {
            state.xml.category.categories.map(function (data, i) {
                if (data.id == id) {
                    // removes the data at index 'i' from array key 'categories' of key object 'category' of state object 'xml'
                    state.xml.category.categories.splice(i, 1);
                    state.xml.item.items.map(function (data1, j) {
                        if (data.id == data1.category) {
                            // removes the data at index 'j' from array key 'items' of object key 'item' of state object 'xml'
                            state.xml.item.items.splice(j, 1);
                        }
                    });
                }
            });
            // change the xml and update the xml
            reverseXml();
        } else {
            // shows the warning message
            AH.alert("You can't have less than 2 categories.");
        }
    }

	// used to add the row
    function addItem() {
        // object containing numeric value from id of last category and item
        let ids = getIds();
        // contains category available
        let cat = state.xml.category.categories;
        // used to defined the unique id of the cells in added row
        let itemId = ids.itemId + 1;
        // contains no of column exist
        let noOfCols = state.xml.category.categories.length;
        // contains the value after adding 1 in no of avialable cells 
        let itemLen = state.xml.item.items.length + 1;
        // contains no of item row available
        let noOfRow = (itemLen - 1) / noOfCols;
        if (state.xml.category.categories.length >= 1) {
            if (noOfRow <= 3) {
                for (let i = 1; i <= noOfCols; i++) {
                    state.xml.item.items.push({
                        imageurl: "",
                        imagealt: "",
                        // defines the id of the added cell 
                        id: 'item_' + itemId,
                        label: "",
                        // defines in which category it lies
                        category: cat[i - 1].id,
                        // used at the time of deletion
                        tags: "Tags " + (noOfRow + 1)
                    });
                    // increases the value of item cell
                    itemLen++;
                    // increases the value for uniquley define the id of item cell
                    itemId++;
                }
                // change the xml and update the xml
                reverseXml();
            } else {
                // shows the warning message
                AH.alert("You can't have more than 4 rows.");
            }
        } else {
            // shows the warning message
            AH.alert('First add category.');
        }
    }

	// used to add the category column and update that column with cell item also update the xml
    function addCategory() {
        if (state.xml.category.categories.length <= 3) {
            // defines category number
            let catLen = state.xml.category.categories.length + 1;
            // object containing numeric value from id of last category and item
            let ids = getIds();
            // used to set the id of the category
            let catId = ids.catId + 1;
            // used to set the id of the items added in last category which is currently added
            let itemId = ids.itemId + 1;
            // used for define the number of row exist
            let itemLen = state.xml.item.items.length + 1;
            // finds no of row exist for items
            let noOfRow = (itemLen - 1) / (catLen - 1);
            // used for define the id of new added category
            let newcat = ('category_' + catId);
            // sets the id and text of the category
            state.xml.category.categories.push({
                id: newcat,
                text: "Default Category"
            });
            for (let i = 0; i < noOfRow; i++) {
                // used for define the id of new added cell/item
                let newitem = ('item_' + itemId);
                // used to add the default cells for added category column with same category id and unique cell id
                state.xml.item.items.splice((catLen - 1) * (i + 1) + i, 0, {
                    imageurl: "",
                    imagealt: "",
                    // defines the id of the added cell 
                    id: newitem,
                    label: "",
                    // defines in which category it lies
                    category: newcat,
                    // used at the time of deletion
                    tags: "Tags " + (i + 1)
                });
                // increase by 1 for defined unique id of each cell item of added category column
                itemId++;
            }
            // enabled the button have class matchbutton
            AH.select('.matchbutton').disabled = false;
            // shows the element have class alignTestarea 
            AH.select('.alignTestarea').style.display = 'block';
            // change the xml and update the xml
            reverseXml();
        } else {
            // shows the warning message
            AH.alert("You can't have more than 4 categories.");
        }
    }

	// returns object containing numeric value from id of last category and item
    function getIds() {
		// contains category available
        let cat = state.xml.category.categories,
            // contains items available
            _item = state.xml.item.items;
        // used for contain the category id
        let catId,
            // used for contain the items id
            itemId;
        if (cat.length > 0) {
            // contains the last category
            let catLast = cat[cat.length - 1];
            // contains the numeric part from id of last category
            catId = parseInt(catLast.id.split('_')[1]);
        } else {
            catId = 0;
        }

        if (_item.length > 0) {
            // contains last item
            let itemLast = _item[_item.length - 1];
            // contains the numeric part from id of last item
            itemId = parseInt(itemLast.id.split('_')[1]);
        } else {
            itemId = 0;
        }
        // returns object containing numeric value from id of last category and item
        return {
            catId: catId,
            itemId: itemId
        };
    }

	// upload the file and change the xml and update the xml also change the textarea value of that cell with image file name
    function uploadFile(container) {
        // creates an empty FormData object
        let fd = new FormData();
        Array.prototype.forEach.call(files, (_f)=> {
            // append the new value onto the end of the existing set of values of secified key
            fd.append('image_file', _f); 
        });
        AH.ajax({
            // path of the server from which you want to communicate
            url: baseUrl + "sim/smartsim/imageAudioUpload.php?func=upload_pic&ajax=1&user_guid=1&extension=jpg",
            formData: true,
            data: fd,
        }).then((urlPath)=> {
            // contains only file name after removing the path
            let imagePath;
            if (urlPath == "0") {
                // shows the warning message
                AH.alert('Error In Uploading Image File!');
                AH.activate(0);
            } else {
                AH.activate(0);
                // contains null or as an Array object according to not match or match of http: in return data from server
                let matching = urlPath.match(/http:/g);
                if (matching) {
                    // removes the path of the uploaded image
                    imagePath = urlPath.replace("http://s3.amazonaws.com/jigyaasa_content_static//", "");
                } else {
                    // removes the path of the uploaded image
                    imagePath = urlPath.replace("//s3.amazonaws.com/jigyaasa_content_static//", "");
                }

                // sets the value of variable imagePath with prefix '*' and sufix '[]' in textarea of cell have id equals to the value of variable container
                AH.select('#' + container).querySelector('textarea').value = '*' + imagePath + '[]';
                // changes the image and alt text and update the xml
                updateImageUrl(container, imagePath);
            }
        }).catch((e)=> {
            console.warn("error in upload", e);
        });
    }

	// changes the image and alt text and update the xml
    function updateImageUrl(container, imagePath) {
        state.xml.item.items.map(function (data, index) {
            if (data.id == container) {
                // change the value of key 'imageurl' of items object at index retuned by the map method with the value equals to the value of variable imagePath of item key of state xml 
                data.imageurl = imagePath;
                // change the value of key 'imagealt' of items object at index retuned by the map method with the value of index retuned by the map method with prefix 'imagealt_text' of item key of state xml
                data.imagealt = 'imagealt_text' + index;
                // change the value of key 'label' of items object at index retuned by the map method with blank value of item key of state xml
                data.label = '';
            }
            // change the xml and update the xml
            reverseXml();
        });
    }

	// change and update the xml after upload the image
    function getChosenFile(event) {
        let container = event.target.closest('.columnContainer').id;
        AH.activate(2);
        // uploades the image and change the xml and update the xml
        uploadFile(container);
    }

    // For ADA
    function keydownAda(event) {
        if (event.which === 13) {
            // click the textarea element or image upload icon on which keydown
            this.click();
        }
    }
</script>
<div class="border">
	<div class="categoryAuthorcontainer">
		<div class="d-flex align-items-center mx-2 mt-2">
			<div class="tableContainer light-cyan-bg mx-auto">
				{#if state.authordata}
					{#each state.authordata as data, i}
						<div key={i} class="rowContainer pt-2 d-flex align-items-center pe-3">
							{#each data as data4, j}
								<div key={j} class="columnContainer border-0" id={data4.id}>
									<div class="d-flex flex-column-reverse width180">
										<textarea aria-label="{data4.text}" class={data4.class == 'categories' ? 'categories pointer text_alignmatch' : 'items pointer text_alignmatch'}
                                            value={data4.text} on:keydown="{keydownAda}" 
                                            on:click={data4.class == 'categories' ? openEditDialog.bind(this, "categories", data4.id) : openEditDialog.bind(this, "items", data4.id)}
                                            placeholder={data4.class == 'categories' ? 'Category Name' : 'Item Information'}
                                            readonly="readonly"
                                        ></textarea>
                                        {#if data4.class == 'categories'}
                                            <button type="button"
                                                class='btn_category btn mx-auto'
                                                on:click={removeCategory.bind(this, data4.id)}
                                            >
                                                <span title="{l.delete_column}" data-bs-toggle="tooltip" class={icon_class}></span>
                                            </button>
                                        {/if}
                                    </div>
                                    {#if data4.class == 'items'}
                                        <label class='fileUpload btn btn-outline-primary bg-white rounded-0' tabindex="0" on:keydown="{keydownAda}">
                                            <span title="{l.file_elem}" class="icomoon-images position-relative"></span>
                                            <input type="file" bind:files id={'imgUpload' + data4.id} class="imgUpload h" on:change="{getChosenFile}" />
                                        </label>
                                    {/if}
								</div>
                            {/each}
                            {#if i != 0}
                                <button type="button" id="tags_{i}" row_tags={i} class='btn_category btn me-2 pt-0' on:click={removeItems}>
                                    <span class="icomoon-new-24px-delete-1 position-relative s3" title="{l.delete_row}" data-bs-toggle="tooltip"></span>
                                </button>
                            {/if}
						</div>
					{/each}
				{/if}
			</div>
			<div class="text-center position-relative">
                <AlignMatchButton
                    btnClass="span16 add_cat_btn w-auto"
                    id="add_cat_btn"
                    on:btnClick = {addCategory}
                    btnName={l.add_category}
                />
			</div>
		</div>
		<div class="text-center my-2">
            <AlignMatchButton
                id="btn"
                on:btnClick = {addItem}
                btnName={l.add_item}
            />
		</div>
	</div>
	<div class="modal" id="editModal">
		<div class="modal-dialog modal-dialog-centered span4">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">{l.edit_dialog}</h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body text-center">
					<textarea class="text-start w-100 h-100 form-control" id="editValue" on:change={state.editType == 'categories' ? updateCategory.bind(this, state.editId) : updateItem.bind(this, state.editId)}></textarea>
                    <p class="error_msg text-left text-danger mb-0 h">Please enter some valid data.</p>
                </div>
				<div class="modal-footer mt-0">
					<button type="button" id="updateButton" class="sure btn btn-primary" on:click={closeDialog.bind(this)}>{l.update}</button>
				</div>
			</div>
		</div>
	</div>
</div>