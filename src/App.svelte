<script>
	export let ajaxData;
	//export let type;
	export let subtype;
	//export let content_guid;
	//export let content_icon;
	//export let userArray;
	import { onMount, beforeUpdate, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import Drawer from '../helper/Drawer.svelte';
	import { AH, SSD } from '../helper/HelperAI.svelte';
	import Loader from '../helper/Loader.svelte';
	import Editor from './Editor.svelte';
	import EditorModules from './EditorModules.svelte';
	import l from './libs/Lang';
	import Button from 'svelte-mui/src/Button.svelte';

	let allItem = [];
	let groupList = [];
	let keywordsList = [];
	let newGroupList = [];
	let newKeywordsList = [];
	let editorItems = [];
	let editorUrl = new URLSearchParams(window.location.search);
	let ajaxRes = "";
	let apiData = {};
	let server = window.baseUrl + "/editor/svelteEditor.php";
	let state = {};
	let hdd = writable({
		loaditem: "Default",
		_user: {},
		_course: "",
		drawerBox: false,
		itemXML: "",
		sidePane: true,
		type: "",
		content_icon: "",
		fullMenu: false,
		ajaxData: '',
		inline_item: "",
		is_algo: "",
		allItemTemp: "",
		menuView: "main",
		mainBackColor: "#4c4c4c",
		assetBackColor: "#dddddd",
		editorKey: 1,
		editorModalHandle: false,
		embed: false,
	});

	const unsubscribe = hdd.subscribe((items) => {
		state = items;
	})

	beforeUpdate(()=> {
		if (!window.AI) window.AI = AH;
	})

	onMount(async () => {
		let appPass = SSD.get('apiAccessToken') ? {status: 'Success', access_token: SSD.get('apiAccessToken')} : await AH.validateApp(false);
		if (appPass.status == 'Success') {
			console.warn("Access key set successfull.");
			window.ssd = SSD;
			if (SSD.get('apiAccessToken') !== appPass.access_token) {
				console.warn("Access key not found in storage.");
				SSD.set('apiAccessToken', appPass.access_token);
			}
			AH.setApiKey(appPass.access_token);
			let where = {
				content_guid: editorUrl.get('content_guid'),
				columns: 'content_text,content_guid,content_type,content_subtype,content_icon,snippet,content_id',
				full_data: 3
			};
			let searchQuery = {};
			for (const [key,value] of editorUrl.entries()) {
				if (window.hasOwnProperty(key)) {
					window[key] = value;
				}
				searchQuery[key] = value;
			}
			if (editorUrl.get('content_guid')) {
				AH.getAPIDataJ('cat2.item_content_draft_get', where, async (res)=> {
					apiData = await checkRevision(res);
					apiData = apiData[editorUrl.get('content_guid')];
					searchQuery['content'] = JSON.stringify(apiData);
					ajaxRes = await AI.ajax({url: server, data: searchQuery });
					onDataGet();
				});
			} else {
				ajaxRes = await AH.ajax({url: server, data: searchQuery});
				onDataGet();
			}
		}
	});

	function checkRevision(res) {
		return new Promise((resolve, reject)=> {
			if (editorUrl.get('get-diff')) {
					let where = {
						version_date: editorUrl.get('version_date'),
						content_guid: editorUrl.get('content_guid'),
					};
					if ( editorUrl.get('from_draft') != '' ) {
						where.isDraft = editorUrl.get('from_draft');
					}
					AH.getAPIDataJ( 'cat2.deliveryengine_get_previous_content', where, (result)=> {
						res[where.content_guid]['content_text'] = result['content_text'];
						resolve(res);
					});
			} else {
				resolve(res);
			}
		});
	}

	function onDataGet() {
		if (AH.isValid(ajaxRes)) {
			ajaxRes = JSON.parse(ajaxRes);
			Object.keys(ajaxRes).forEach((key)=>{
				if (window.hasOwnProperty(key)) window[key] = ajaxRes[key];
			});
			if (ajaxRes['userArray']) {
				window.userArray = ajaxRes['userArray'];
				let response = JSON.parse(ajaxRes['userArray']);
				window.editor.save = response.save;
				window.editor.course = response.course;
				window.user_guid = response.user_guid;
				state._user = {
					first_name: response.first_name,
					last_name: response.last_name,
					user_guid: response.user_guid,
				}
				baseUrl = response.siteurl;
				window.editor.baseUrlTheme = response.siteurl + "layout/themes/bootstrap4/";

				/* Grouping of All Editor Item */
				newGroupList = [];
				newKeywordsList = [];
				groupList = response.editor_item_group_detail;
				keywordsList = response.editor_item_type_keywords;
				for (let i in keywordsList) {
					newKeywordsList.push({
						icon: keywordsList[i].icon,
						title: keywordsList[i].title,
						name: i
					});
				}

				newGroupList.push({
					name: "all_item",
					icon: "icomoon-stack-3",
					title: l.all_item,
				});

				let count_grp = 0;
				for (let i in groupList) {
					newGroupList.push({
						name: i,
						icon: groupList[i].icon,
						title: groupList[i].heading,
						group_seq: count_grp + "_" + i
					});
					count_grp++;
				}
				/* END */

				/* Listing of All Editor Item */
				let alphabet = "a,c,e,f,p,q,s".split(',');
				let getUrlVarsData = AH.getUrlVars();
				if (getUrlVarsData['group_type'] && getUrlVarsData['group_type'] != 0) { //Code for Show 1 group of items
					alphabet.length = 0;
					if (getUrlVarsData['group_type'] == 's') {
						alphabet = ['s', 'f'];
					} else if (getUrlVarsData['group_type'].indexOf(",")) {
						alphabet = getUrlVarsData['group_type'].split(',');
					} else {
						alphabet[0] = getUrlVarsData['group_type'];
					}
				}
				allItem = response.editor_item_type_details;
				state.allItemTemp = allItem;
				allItem = JSON.stringify(allItem);
				allItem = JSON.parse(allItem);
				alphabet.forEach((letter) => {
					createEditorArray(allItem[letter], editorItems, letter);
				});
				/* END */
				if (editorUrl.get('content_subtype') && editorUrl.get('content_type')) {
					state.type =  editorUrl.get('content_type');
					state.content_icon = editorUrl.get('content_icon');
					editorItems.forEach((n)=> {
						if (editorUrl.get('content_type') == n.type && editorUrl.get('content_subtype') == n.subtype && editorUrl.get('content_icon') == n.content_icon) {
							state.itemXML = n.xml;
							state.inline_item = n.inline_item;
							state.is_algo = n.is_algo;
						}
					});
					state.loaditem = parseInt(editorUrl.get('content_subtype'));
				}
			}
			if (ajaxRes['domains'] && editorUrl.get('from_myproject') == "1") {
				window.is_domain = Object.keys(ajaxRes['domains']).length > 0 ? 1 : 0;
			}
			//if (ajaxRes['user']) state._user = ajaxRes['user'];
			if (editorUrl.get('content_guid')) {
				content_for_newEditor = ajaxRes['content_for_newEditor'] ? JSON.parse(ajaxRes['content_for_newEditor']) : "";
				ajaxData = content_for_newEditor;
				state.content_guid = ajaxData.content_guid;
				state.type = ajaxData.content_type;
				subtype = parseInt(ajaxData.content_subtype);
				state.content_icon = ajaxData.content_icon;
				state.loaditem = parseInt(ajaxData.content_subtype);
			}
		}
	}

	function createEditorArray(allItem, editorItems, content_type) {
		let getUrlVarsData = AH.getUrlVars();
		let id = 0;
		for (let subtype in allItem) {
			for (let icon in allItem[subtype]) {
				let currentItem = allItem[subtype][icon];
				if (getUrlVarsData['is_flashcard'] == '1' && content_type == "f" && (currentItem.is_flashcard != 1)) {
					continue;
				}
				if (is_external == "1") {
					if (currentItem.visible < 1) {
						continue;
						// Hiding selected item for External users.
					} 
				}
				editorItems.push({
					id:  content_type + "_" + id,
					title: currentItem.title,
					icon: currentItem.icon,
					type: currentItem.type,
					subtype: currentItem.subtype,
					content_icon: currentItem.content_icon,
					grading: currentItem.grading,
					category: currentItem.category,
					xml: currentItem.xml,
					group: currentItem.group,
					visible: currentItem.visible,
					inline_item: (currentItem.inline_item) ? currentItem.inline_item : "0",
					is_algo: (currentItem.algo) ? currentItem.algo : "0",
					grp_seq: setGrpSeq(currentItem.group),
					keywords: (currentItem.keywords) ? currentItem.keywords : ""
				});
				id++;
			}
		}
		return editorItems;
	}

	function setGrpSeq(grp) {
		for (let g in newGroupList) {
			if (newGroupList[g].name == grp) {
				return newGroupList[g].group_seq
			}
		}
	}

	function advanceXml(newXMl, subtype) {
		state.loaditem = "Blank";
		setTimeout(()=> {
			state.loaditem = parseInt(subtype);
		},100);
		
	}
	
</script>

<main class="p-0">
	{#if window.editor.course == null}
		<center style="position:relative;top:{window.innerHeight*(.4)}px;">
			<b>Please do login and load course first.</b>
			<br/>
			<Button
				color={"primary"}
				unelevated={true}
				outlined={true}
				on:click={(event)=> location.href= baseUrl + '?func=get_course_list&show=courses'}
			>
				Library
			</Button>
		</center>
	{:else if state.loaditem != 'Default'}
		{#if state.loaditem == "Blank"} 
			<center style="position:relative;top:{window.innerHeight*(.4)}px;">Checking Module...</center>
		{:else}
			<Editor 
				key = {state.editorKey}
				bind:actionData = {state}
				ajaxData={ajaxData}
				content_guid={state.content_guid}
				item={state.loaditem}
				itemXML={state.itemXML}
				moduleType={state.type}
				subtype={state.loaditem}
				content_icon={state.content_icon}
				inline_item={state.inline_item}
				is_algo={state.is_algo}
				_user={state._user}
				advanceXml={advanceXml}
			/>
		{/if}
	{:else}
		{#if editorItems.length == 0}
			<center style="position:relative;top:{window.innerHeight*(.4)}px;"><Loader size={100} /></center>
		{:else}
			<EditorModules 
				editorItems = {editorItems}
				bind:actionData = {state}
				bind:ajaxData={ajaxData}
				newKeywordsList = {newKeywordsList}
				newGroupList = {newGroupList}
				openDrawer = {true}
			/>
		{/if}
	{/if}
	{#if state.drawerBox}
		<Drawer 
			width={700}
			on:close={()=> state.drawerBox = false}
		>
			<div slot="header">Pradeep</div>
			<div slot="content">
				<EditorModules 
					editorItems = {editorItems}
					bind:actionData = {state}
					newKeywordsList = {newKeywordsList}
					newGroupList = {newGroupList}
					openDrawer = {true}
					isAjax={true}
				/>
			</div>
		</Drawer>
	{/if}
</main>