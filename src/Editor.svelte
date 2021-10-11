<script>
import { onMount, tick, afterUpdate } from 'svelte';
import { Button, Dialog, Checkbox, Snackbar } from 'svelte-mui/src';
import { writable } from 'svelte/store';
//import {page} from '$app/stores';
import {AH, XMLToJSON } from '../helper/HelperAI.svelte';
import {editorConfig} from './EditorConfig.svelte';
import {ucEditor} from './ucEditor.svelte';
import EditorHeader from './EditorHeader.svelte';
import {getItems} from './ModuleQtype.svelte';
import EditorModal from './EditorModal.svelte';
import Player from './Player.svelte';
import Domain from './Domain.svelte';
import VersionControl from './VersionControl.svelte';
import WebpageList from './WebpageList.svelte';
import Loader from '../helper/Loader.svelte';
import CreateVariable from './libs/CreateVariable.svelte';
import InteractiveItem from './components/InteractiveItem.svelte';
import CommentModal from './components/CommentModal.svelte';
import {
	tag_player, 
	initEbookInteractivity, 
	ajaxContentUpdate, 
	mathMLRender,
	ucTimeline
} from '../helper/helperFunctions';
import Media from "./components/Media.svelte";
import l from './libs/editorLib/language';
import ImageAnnotation from './components/ImageAnnotation';
import EditorPopoverModal from './components/EditorPopoverModal.svelte';
import PeGlossaryContentLink from './components/PeGlossaryContentLink.svelte';
import AnalyzeEbook from './components/AnalyzeEbook.svelte';

// Taking Props
export let actionData;
export let advanceXml;
export let item;
export let itemXML;
export let moduleType;
export let content_icon;
export let content_guid;
export let inline_item;
export let is_algo;		
export let ajaxData = "";
export let _user;
export let subtype;
if ((window.origin).includes('https://') && (location.host != "localhost")) {
	window.baseUrl = (window.baseUrl).replace('http://', 'https://');
}
let snt_detail_array = {};
let stageComment = "";
let editorHeaderRef; // refrence of editorHeader
let editCount = 1;
let saveCheckbox; // handle check of saving check box
let createVariableCallback = {}; // refrence of createAlgo
let modalVisible = false; // handle Modal instance
let player_parent = ""; // check palyer tag
// Modal props for dynamic data
let modal = {
		header  : [],
		body    : [],
		footer  : [],
		width   : 300,
	};
	
let editorBuffer = {}; // Buffer storage for editor
let typeChangePosition = "";  // Current content change position
let Items = {}; // Instance of item comonenets
let changedKeys = []; // track which section is changing
let cursorPosition = ""; // Cursor's current position
let _interactiveItem = ""; // hold all intractive layouts
let _commentModal; // refrence of commentModal
let state = {};
let preview_edit;
let hdd = writable({
	title                   : "",
	stem                    : "",
	remediation             : "",
	remediationToggle       : false,
	verticalView            : true,
	item                    : "",
	xml                     : "",
	itemXML 				: false,
	itemListFilter			: "",
	content                 : "",
	open                    : false,
	xmlDialog               : false,
	saveDialog              : false,
	analyzeebookcontent     : false,
	errMessage              : "",
	snackback               : false,
	playerPopup             : false,
	vtt                     : "",
	info                    : "",
	guid                    : "",
	content_type            : "",
	content_icon            : "",
	webPageData             : "",
	sntTags                 : {},
	strForRender            : "",
	myComponent             : "SM",
	toggleMode              : false,
	activator               : false,
	versionToggle           : false,
	domain                  : "",
	domainToggle            : false,
	course_list             : false,
	save_publish            : false,
	webpageArray            : [],
	skipValidation          : false,
	coverage_guid           : "",
	open_doc                : false,
	testObj                 : false,
	inline_item             : "",
	is_algo                 : "",
	playerBookmark          : false,
	exam_objective          : false,
	examToggle              : false,
	algo_qxml               : "",
	single_variables        : [],
	variable_button         : false,
	draft                   : 0,
	netMsg                  : '',
	anchorEl                : null,
	stopAuthoringUpdate     : false,
	stopPreviewUpdate       : false,
	answerStr               : "",
	oldStemData             : "",
	AnalyzeEbookMenu        : false,
	caseid_val              : "",
	noTitle                 : false,
	todoState               : "Show Todo",
	db_changed              : false,
	player_render           : true,
	saveVal                 : "test",
	isCSV                   : false,
	ajaxData                : {},
	propsAjaxData			: {},
	editorModalHandle       : false,
	radioValue              : "plain",
	stausRadioValue         : "",
	exam_objective_mapping_save: 0,
	mcqAjaxData				: {},
	viewConfig              : {view: ""},
	render                  : 0,
	editorView				: "authoring",
	playerState				: false,
	playerArr				: {},
	prevPlayerValue			: {category: "knowledge_check"},
	prevPlayerState			: {},
	links					: false,
	message					: "",
	previewXml              : "", // In case of solve Variable we need to keep the preview and auth seperately.
	authXml                 : "", // In case of solve Variable we need to keep the preview and auth seperately.
});
let dxml = '';
let _media;
let _editorBuffer = {};
const unsubscribe = hdd.subscribe((items) => {
	state = items;
})

const ucStepContolPanel = '<main data-remove="true" contenteditable="false" class="controls_panel_button" style="height:1px;outline:none;float:right;margin-top:8px"><div class="panel-controls" style="opacity:1;position:relative;"><div class="panel-controls__container"><div class="panel-controls__bar"><div style="border-radius: 2.3rem;border: 1px solid rgba(49,53,55,.2);background:#FFF8DC;padding:6px 0" class="panel-controls__tools"><div><a class="panel-controls__duplicate" data-bs-toggle="tooltip" title="Copy"><i class="icomoon-copy-2"></i></a></div><div><a class="panel-controls__remove" data-bs-toggle="tooltip" title="Remove"><i class="icomoon-24px-delete-1"></i></a></div></div></div></div></div></main>';

$: {
	var url_string = window.location;
	var url = new URL(url_string);
	preview_edit = (url.searchParams.get("item") == 'listItem') ? url.searchParams.get("preview_only") : '';
}

onMount(async ()=> {
	AH.activate(2);
	ucEditor.setConfig(editorConfig); // Setting config for tinymce
	editorConfig.setParent(updateModuleState, handleModal); // Setting updator for external files
	let tempAjaxData = AH.validateAjaxData(ajaxData, item); // checking ajaxData
	state.item = item;
	state.content_type = moduleType;
	state.content_icon = content_icon;
	state.inline_item = inline_item;
	state.is_algo = is_algo;
	state.ajaxData = tempAjaxData;
	state.mcqAjaxData = (item == 0 || item == 8) ? JSON.parse(JSON.stringify(tempAjaxData)) : tempAjaxData;
	state.propsAjaxData = ajaxData;
	state.guid = content_guid ? content_guid : "";
	state.itemXML = itemXML;
	AH.set('is_proposed', getQueryString('is_proposed'));
	AH.set('save', true);
	AH.set('draft', (ajaxData && ajaxData.is_draft) ? ajaxData.is_draft : 0);
	if (content_guid) {
		initComments(content_guid, _user.user_guid);
	}
	interactive_item = editorConfig.createIteractive(); // Getting Intractive items layout
	AH.setCss("#editor", {background: '#e9ecef'});
	state.viewConfig = editorConfig.getConfig(state); // Getting editor config
	editorConfig.checkStage(state);  // Getting stage of current guid
	

	
		Items = await getItems(item, state);  // Getting Item compoenents
		if (ajaxData) {
			let xml = '', type = '';
			if (state.viewConfig.isQuestion) {
				xml = ajaxData.content_text.special_module_xml;
				type = ajaxData.content_subtype;
				// Getting Default XML
				if (!AH.isValid(xml)) {
					if(type === "26" && xml === "") { // If xml blank in case of multigrid then will execute if condition
						xml = Items?.default.getDefaultXMl("editor_item_75.xml"); 
						xml = formatXmlRef(xml, item);
					} else {
						xml = Items?.default.getDefaultXMl("sample"); 
						xml = formatXmlRef(xml, item);
					}
					
				}
				
				if (ajaxData.content_text.algo_qxml) {
					state.algo_qxml = ajaxData.content_text.algo_qxml;
				}
				if (ajaxData.content_text.case_id) {
					state.caseid_val = ajaxData.content_text.case_id;
				}
				// Checking item wise maniulations
				if (Items?.UI?.cleanItemWise) {
					({type, xml} = Items.UI.cleanItemWise(ajaxData, type, xml));
				}
				// Setting state for data
				state.title = ajaxData.content_text.title;
				state.stem = formatData(ajaxData.content_text.question, 'convertUcSyntax');
				state.remediation = formatData(ajaxData.content_text.explanation, 'convertUcSyntax');
			} else {
				// set state and fillter content and formatting
				state.content = replacePreTag(formatData(ajaxData.content_text.content), editorConfig.preTagTypes);
				state.title = ajaxData?.content_text.title;
				state.info = ajaxData?.content_text.info || '';
				state.vtt = ajaxData?.content_text.vtt || '';
			}
			state.content_icon = ajaxData.content_icon;
			state.draft = ajaxData.is_draft;
			setModule(xml); // Update xml for items
		} else { 
			//@Pradeep: require default xml from ModuleQtype and use here.
			if (itemXML) {
				dxml = Items.default.getDefaultXMl(itemXML); 
				dxml = formatXmlRef(dxml, item);
				AH.set("error", AH.isValid(dxml) ? false : "XML is not found.");
			}
			setModule(dxml); // Updating xml for items
		}
	// For debugging
	AH.set("setEditor", updateModuleState);
	AH.set('getEditor', getState);
});

afterUpdate(() => {
	if ( typeof state != 'undefined' && 'guid' in state && state.guid) {
		initComments(state.guid, _user.user_guid);
	}
});
// get State
function getState(name) {
	if (name) return state[name];
	return state;
}

//show version history dialogs
function versionControl(flag) {
	state.versionToggle = flag;
}

// Show Items status in snackback
function showAns(msg) {
	if (_editorBuffer['snack_timer']) clearTimeout(_editorBuffer['snack_timer']);
	_editorBuffer['snack_timer'] = setTimeout(()=> {
		state.message = msg;
		state.snackback = true;
	}, 500)
	
}

function initComments(guid, user_guid) {
	if (from_myproject == 1 && document.querySelector("#editor_comment_modal_btn:not([hidden])")) {
		AH.set('current_guid', guid);
		let type =  AH.isValid(AH.get('comments_type')) ? AH.get('comments_type') : -2;
		AH.ajax({
			url: `${baseUrl}educator/project/index.php?func=get_comments&content_guid=${guid}&user_guid=${user_guid}&tags=${type}`,
			withUrl: true,
		}).then(function(res) {
			document.querySelector('#comment_modal_body').innerHTML = res;
			AH.initDropdown();
			document.querySelector("#editor_comment_modal_btn").style.display = "block";
			_commentModal.init?.();
		});
	}
	
}

// Function to handle state from outside
function updateModuleState(key, value, action= "") {
	switch(action) {
		case 'renderPlayer': renderPlayer();
		break;
		case 'getXml': getXml();
		break;
		case 'addNew': actionData.loaditem = 'Default';
		break;
		case 'message': state.message = value;
		break;
		default:
			state[key] = value;
		break;
	}
}

// Method to take modal layout
function handleModal(modalData) {
	if (modalData) {
		modal = modalData;
		modalVisible = true;
	} else {
		modalVisible = false;
	}
}

// action which called after first paint 
function didMount(node, action) {
	if (editorBuffer['didMount']) clearTimeout(editorBuffer['didMount']);
	editorBuffer['didMount'] = setTimeout(()=> {
		let urlVars = AH.getUrlVars();
		if (preview_edit == 1) {
			showPreviewOnly(state, updateModuleState)
		} else {
			interactiveEditor();
			ucTimelineEditor(ucEditor);
			initEditorListeners();
			//update locally content
			addUpdateDataBase(state, updateModuleState);
			// for backup when net is not avialbale
			if (urlVars['load_backup'] == 1) {
				loadBackup(state, updateModuleState);
			}
		}
		if (ajaxData) {
			if (state.viewConfig.isQuestion) {
				setBasicData(state.title, state.stem, state.remediation, "skip_state_set");
				initAddFeature(state.title, editorConfig.maintainAlignments(state.stem), editorConfig.maintainAlignments(state.remediation));
			} else {
				let contentText = (state.propsAjaxData?.content.replace(/\n/g,"<br>") || state.content);
				contentText = (AH.isValid(contentText)) ? replaceUnwantedTags(contentText) : contentText;
				contentText = editorConfig.replaceUnwantedEntity(contentText, 'only_self_close');
				let tempContent = editorConfig.replaceUnwantedEntity(state.content, 'onlyEntity');
				AH.select("#content").innerHTML = editorConfig.maintainAlignments(tempContent);
				AH.select('#content_show').innerHTML = editorConfig.maintainAlignments(get_ucsyntax(contentText));
				AH.select("#title").innerHTML = editorConfig.replaceUnwantedEntity(state.title, 'onlyEntity');
				AH.select("#title_show").innerHTML = editorConfig.replaceUnwantedEntity(state.title, 'onlyEntity');
				AH.select("#info").innerHTML = state.info;
				AH.select("#info_show").innerHTML = state.info;
				if(AH.isValid(state.vtt)){
					AH.select("#vtt").innerHTML = state.vtt.replace(/&nbsp;/g, " ").replace(/  /g, " &nbsp;");
					AH.select("#vtt_show").innerHTML = state.vtt.replace(/&nbsp;/g, " ").replace(/  /g, " &nbsp;");
				}
				initAddFeature(false, false, false, tempContent || " ");
			}
		}
		AH.toggleDom('#savePublish', (state.guid.length == '5' && from_myproject == 1 ? 'show' : 'hide'));
		updateEbookContent();
		setupEditor(urlVars);
	}, 200);
	// check if uc_image_annotate is available in window or not
	if (typeof(window.uc_image_annotate) == "undefined") {
		window.uc_image_annotate = new ImageAnnotation();
	}
}

function showPreviewOnly() {
		//self.fullScreen();
		//$("#editor").hide();
		AH.select('#editor','css',{display:'none'});
		setTimeout(function () {
			//self.setState({ verticalView: true }, function () {
				state.verticalView = true;
				//$("#editor").show();
				AH.select('#editor','css',{display:'block'});
				//$('[href="#authoringDiv"]').addClass('disabled');
				AH.select('[href="#authoringDiv"]','addClass','disabled');
				let checkView = (Items[state.item] && Items[state.item].UI.verticalView);
				if (!checkView) {
					//$("#authoringDiv").hide();
					AH.select("#authoringDiv",'css',{display:'none'});
					//$('[href="#custom_columnize"]').tab('show');
					AH.select('[href="#custom_columnize"]').click();
				} 
				//$("#player_render_top, #back_editor_button").hide();
				AH.select("#player_render_top",'css',{dispaly: 'none'});
				AH.select("#back_editor_button",'css',{display: 'none'});
				//$('#preview_editor_new').css('pointer-events', 'none');
				AH.select('#preview_editor_new','css',{pointerEvents:'none'});
				//$(document).ready(function () {
					//$("#authoring_boxe, #device_btn").hide();
					AH.select("#authoring_boxe, #device_btn",'css',{display: 'none'});
					ajaxContentUpdate({ imgAltText: 1, container: ['#previewSection'] });
					if (checkView) {
						setTimeout(function () {
							//$('main[data-remove="true"]').hide();
							AH.select('main[data-remove="true"]','css',{display: none});
							externalToggle();
							//$("#remedToggle").addClass("h-imp");
							AH.select("#remedToggle",'addClass','h-imp')
						}, 500);
					}
				//});
			//});
		}, 200);
	}

// Set initially content for editor
function setBasicData(title, stem, remediation, skip = false) {
	if (!skip) {
		state.title = title;
		state.stem = stem;
		state.remediation = remediation;
	}
	AH.select("#title").innerHTML = title;
	AH.select("#title_show").innerHTML = title;
	stem = editorConfig.replaceUnwantedEntity(stem, 'cleanHiddenEnity');
	AH.select("#stem").innerHTML = stem;
	AH.select('#stem_show').innerHTML = editorConfig.maintainAlignments(get_ucsyntax(stem));
	remediation = editorConfig.replaceUnwantedEntity(remediation, 'cleanHiddenEnity');
	// This is code written here because in snt tag initAddFeature function call creating issue. So resovled value we need to pass. 
	state.remediation = remediation;
	AH.select("#remediation").innerHTML = remediation;
	AH.select("#remediation_show").innerHTML = editorConfig.maintainAlignments(get_ucsyntax(remediation));
}

// Update Player tag content
function renderPlayer() {
	let previewDom = document.getElementById('preview');
	document.querySelectorAll('#previewSection img[data-bigimage]').forEach(function (_this) {
		let bigimagesrc = _this.getAttribute('data-bigimage');
		if (bigimagesrc != '' && bigimagesrc != undefined) {
			AH.wrap(_this, "<figure class='fs-img uc-figure fullscreen'></figure>");
			AH.insert(_this.parentElement, `<img target="_blank" src="${bigimagesrc}"/>`, 'afterend');
		}
	});
	var fullscreenTimer = setTimeout(function () {
		document.querySelectorAll("#previewSection .fullscreen").forEach(function (_this, index) {
			let figureid = 'fullId' + index;
			_this.setAttribute('id', figureid);
		});
		clearTimeout(fullscreenTimer);
	}, 1000);
	let checkPlayground = 0;
	// Update on player tag change.
	previewDom.querySelectorAll('player').forEach((_this)=> {
		if (_this.getAttribute('type') == 'playground') {
			checkPlayground = 1;
		}
		if (_this.getAttribute('type') != 'exhibit' && _this.getAttribute('type') != 'playground') {
			_this.innerHTML = "";
		}
	});
	if (state.player_render) {
		tag_player(previewDom);
		state.player_render = false;
	}
	//Show player tag with full width for UI improvement when the player is rendering
	previewDom.querySelectorAll('player').forEach(function (_elm) {
		(_elm.innerHTML != '') ? _elm.classList.add('w-100') : _elm.classList.remove('w-100');
	});
	//working of ebook interactive items
	// initEbookInteractivity();
	//listStyleChange("list2", "list3", "list4", "list5", "list6");
	if (player_parent) {
		setContent(player_parent);
	}
	let checkSideshow = 1;
	previewDom.querySelectorAll('div').forEach(function (_tagElm) {
		if (_tagElm.getAttribute('id') == 'myCarousel') {
			checkSideshow = 0;
		}
	});
	if (checkSideshow) {
		initEbookInteractivity();
	}
	if (checkPlayground) {
		prettyPrint();
	}
	//commented due to get hidden when click submit on player tag
	try {
		document.querySelectorAll('#editor img').forEach(function (_this) {
			let imgSrc = _this.getAttribute('src');
			if (!_this.getAttribute('header-logo') && imgSrc.indexOf('vimeocdn') == -1 && !imgSrc.match(/\/\/s3.amazonaws.com\/jigyaasa_content_static|jigyaasa.net|ucertify.com|localhost\/pe-gold3|http:\/\/|https:\/\//gm)) {
				_this.setAttribute('src', '//s3.amazonaws.com/jigyaasa_content_static/' + imgSrc);
			}
		});
	} catch (e) {
		console.log({ Error: e, line: 2372 });
	}
	state.strForRender = "";
	editorConfig.getSnt(state.stem, state, state.strForRender);
	editorConfig.getSnt(state.content, state, state.strForRender);
	editorConfig.getSnt(state.remediation, state, state.strForRender);
	let snt_content_guid = Object.keys(state.sntTags).toString();
	if (snt_content_guid && snt_detail_array[snt_content_guid] == undefined) {
		state.activator = true;
		editorBuffer['ajaxTimer'] = setTimeout(function () {
			AH.ajax({
				url: baseUrl + 'editor/index.php', // point to server-side PHP script
				data: {
					ajax: "1",
					content_guid: snt_content_guid,
					str_content: state.strForRender,
					func: 'react_get_snt',
					action: 'react_get_snt'
				}}).then((response)=> {
					// If the new snt details comes from server then add the new details in array.
					snt_detail_array = {};
					snt_detail_array[snt_content_guid] = response;
					state.activator = false;
					setSntDetails(response, state, previewSnt);
					ajaxContentUpdate({ imgAltText: 1, container: ['#previewSection'] });
				});
			clearTimeout(editorBuffer['ajaxTimer']);
		}, 500);
	} else {
		let response = snt_detail_array[snt_content_guid];
		setSntDetails(response, state, previewSnt);
	}
	//self.handleMenuClose();
	ucStepImplement();
	if (!previewDom.querySelector('hotspot')) {
		ajaxContentUpdate({ imgAltText: 1, container: ['#previewSection'] });
	}
}

/**
 * Function to set the snt detials into preview, stem and remediation, 
*/
function setSntDetails(response, state, previewSnt ) {
	editorConfig.setSnt('#content_show', response, state, previewSnt);
	editorConfig.setSnt('#stem_show', response, state, previewSnt);
	editorConfig.setSnt('#remediation_show', response, state, previewSnt);
	editorConfig.setSnt('#remediationShow', response, state, previewSnt);
	editorConfig.setSnt('#stemShow', response, state, previewSnt);
}
/**
 * UcFeatures releated functions
 * Moved from Smeditor
 */
function ucStepImplement() {
	AH.selectAll('#previewSection .uc_answer_hint, #previewSection .uc_step_explanation').forEach(function (_this, i) {
		let exp_steps = _this.classList.contains('uc_step_explanation');
		if (exp_steps) {
			AH.selectAll(AH.find(_this, '.uc_step', 'all'), 'css', {'display': 'none'});
			AH.select(AH.find(_this, '.uc_step', 'all')[0], 'css', {'display':'block'});
			AH.find(_this, '.uc_step', 'all').forEach(function (elm) {
				if (_this.innerHTML.trim().match(/^<br/g) == null) {
					AH.insert(elm, "<br/>", 'beforebegin');
				}
			});
			let btnCaption = AH.find(_this, '.addnext_caption', '')?.textContent || 'Next';
			let btnhtml = '<button type="button" onclick="showUcExpStep(this)" class="exp_next_btn btn btn-sm btn-outline-primary bg-white imgcenter text-primary" style="width: 15%; font-size: 15px; margin-top: 15px;">' + btnCaption + '</button>';
			AH.find(_this, '.exp_next_btn', {action: 'remove'});
			AH.find(_this, '.addnext_caption', {action: 'remove'});
			AH.insert(_this, btnhtml, 'beforeend');
		} else {
			// for hint 
			let head_caption = "Hint";
			let step_caption = "hint";

			if (_this.querySelectorAll('.uc_hint_section').length > 0) {
				AH.select(_this, 'removeClass', 'list2');
				AH.find(_this, '.uc_hint_section', {action: 'remove'});
				_this.querySelectorAll('li').forEach(function (elm) {
					elm.style.display = '';
				});
			}

			if (_this.hasAttribute("head_caption")) {
				head_caption = _this.getAttribute("head_caption");
			}
			if (_this.hasAttribute("step_caption")) {
				step_caption = _this.getAttribute("step_caption");
			}
			let msg = "<b>" + head_caption + ": </b> <span class='li_count'>" + _this.querySelectorAll('li').length + "</span> " + step_caption + "(s) are available."
			let _btn = '<button type="button" style="margin-top:-8px" onclick="showHints(this)" class="hint_show btn btn-primary float-right">Show</button>';
			let pre_block = "<section id='uc_hint_" + i + "' class='mt uc_hint_section white-bg alert text_lightBlack m-b-md alert-info'>" + _btn + msg + "</section>";
			_this.innerHTML = pre_block + _this.innerHTML;
			_this.classList.add("list2");
		}
	});
}

// function listStyleChange(...list) {
// 	let authSection = document.getElementById('authoringSection');
// 	for (let arg of list) {
// 		if (document.querySelector("." + arg) && document.querySelector("." + arg).getAttribute("id") == "interactive_list") {
// 			authSection.querySelectorAll('.' + arg + ' li').each(function (_this) {
// 				_this.innerHTML = _this.innerHTML.replace(/<br data-mce-bogus="1">/g, "");
// 			});
// 			authSection.querySelector('.' + arg + ' li').contents().wrap('<div></div>');
// 			if (AH.nextElm(authSection.querySelector('.' + arg + ' li'), 'ul')) {
// 				authSection.querySelector('.' + arg + ' li + ul').appendTo(authSection.find('.' + arg + ' li + ul').prev());
// 			}
// 			if (authSection.find('.' + arg + ' li').next('ol').length > 0) {
// 				authSection.find('.' + arg + ' li + ol').appendTo(authSection.find('.' + arg + ' li + ol').prev());
// 			}
// 			authSection.find("." + arg).removeClass(arg).addClass(arg + "_new");
// 			if (authSection.find("." + arg + "_new").parents(".auth-editor").getAttribute("id")) {
// 				setContent(authSection.find("." + arg + "_new").parents(".auth-editor").getAttribute("id"));
// 			}
// 		}
// 	}
// }

// Panel switching 
function swapPanel(type) {
	let parent_tinymce_id = AH.parent(type, ".tinymce-editor");
	let active_node = type.closest('section[nd="1"]');
	AH.insertAfter(active_node, AH.nextElm(active_node));
	setContent(parent_tinymce_id.getAttribute("id"));
}

//Bind Event for editor controls
function interactiveEvents() {
	AH.listen(document, 'mouseover', '.block-controls', function (_this) {
		AH.setCss(_this, { "opacity": 1, "transition": "opacity .45s,transform .3s,-webkit-transform .3s" });
	});

	AH.listen(document, 'mouseout', '.block-controls', function (_this) {
		AH.setCss(_this, {"opacity": 0});
	});

	AH.listen(document, 'mouseover', '#authoringSection div[data-section]', function (_this) {
		let closest_control = AH.find(_this.previousElementSibling, ".block-controls");
		AH.setCss(closest_control, {"opacity": 1, "transition": "opacity .45s,transform .3s,-webkit-transform .3s" });
	});

	AH.listen(document, 'mouseout', '#authoringSection div[data-section]', function (_this) {
		let closest_control = AH.find(_this.previousElementSibling, ".block-controls");
		AH.setCss(closest_control, {"opacity": 0});
	});

	AH.listen(document, 'click', '.block-controls__move-up', function (_this) {
		let currentControl =  AH.parent(_this, ".controls_button");
		let currentSection = currentControl.nextElementSibling;
		let preSection = currentControl?.previousElementSibling?.previousElementSibling || false;
		if (preSection) {
			AH.insert(preSection, currentControl.outerHTML + currentSection.cloneNode(true).outerHTML, 'beforebegin');
			let currentAuthEditorId = AH.parent(_this, ".auth-editor").getAttribute("id");
			setContent(currentAuthEditorId);
			currentControl.remove?.();
			currentSection.remove?.();
			setTimeout(()=> {
				setContent(currentAuthEditorId);
				ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
			}, 500);
			
			AH.toggleDom('.tooltip', 'hide');
			AH.enableBsAll("[data-bs-toggle='tooltip']", 'Tooltip', {container: 'body' });
		} else {
			AH.alert("This is the Start of the content.");
		}
	});

	AH.listen(document, 'click', '.block-controls__move-down', function (_this) {
		let currentControl =  AH.parent(_this, ".controls_button");
		let currentSection = currentControl.nextElementSibling;
		let nextSection = currentSection.nextElementSibling;
		nextSection = nextSection?.nextElementSibling || false;
		if (nextSection) {
				AH.insert(nextSection, currentControl.outerHTML + currentSection.cloneNode(true).outerHTML, 'afterend');
				let currentAuthEditorId = AH.parent(_this, ".auth-editor").getAttribute("id");
				setContent(currentAuthEditorId);
				currentControl.remove();
				currentSection.remove();
				setTimeout(()=> {
					setContent(currentAuthEditorId);
					ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
				}, 500);
				AH.toggleDom('.tooltip', 'hide');
				AH.enableBsAll("[data-bs-toggle='tooltip']", 'Tooltip', {container: 'body' });
		} else {
			AH.alert("This is the end of the content.");
		}
	});

	AH.listen(document, 'click', '.block-controls__remove', function (_this) {
		window.curr = AH.parent(_this, ".auth-editor");
		let parent_tinymce_id = AH.parent(_this, ".auth-editor").getAttribute("id");
		var totalChild = document.querySelectorAll('#' + parent_tinymce_id + ' div[data-section]').length;
		if (totalChild > 1) {
			let _this_section = AH.parent(_this, ".controls_button").nextElementSibling;
			_this_section?.previousElementSibling.remove();
			_this_section.remove?.();
			setContent(parent_tinymce_id);
			AH.toggleDom('.tooltip', 'hide');
			toggleSave(1);
		} else {
			AH.alert("You can not delete Stem.");
		}
	});
	
	AH.listen(document,'click', '.block-controls__add', function (_this) {
		cursorPosition = AH.parent(_this, ".controls_button").nextElementSibling;
		AH.set('filter_item', false);
		openItems();
	});

	AH.listen(document, 'click', '.block-controls__change-type', function (_this) {
		AH.select('#advance_id', 'addClass', 'h-imp');
		AH.select(".nested_items", 'html', ' ');
		let currentControl = AH.parent(_this, ".controls_button");
		window.curr = currentControl;
		let currentSection = currentControl.nextElementSibling;
		typeChangePosition = "";
		let sub_type = currentSection.getAttribute("sub_type");
		//let sec_bttn = currentSection.querySelector('#interactive_list');
		if (interactive_item[0][sub_type]['config'] && interactive_item[0][sub_type]['config']['editing_type_1']) {
			let type_list = interactive_item[0][sub_type]['config']['editing_type_1'].split(",");
			let sub_elm_type = interactive_item[0][sub_type]['config']['editing_change_type'];
			let elm_selector = document.getElementById("type_change");
			AH.getBS(elm_selector, 'Modal').show();
			elm_selector.querySelector(".sub_type").innerHTML = '';
			for (let i in type_list) {
				let a = type_list[i].split("|");
				let a4_html = "";
				let htmlPart = (a[4] != 'default') ? `style="max-width:100%;height:130px;background-image:url(${interactive_item[0][sub_type][a[0]]['default_image']});background-size:contain;background-position:center;background-repeat:no-repeat;overflow:hidden;" data-html="${interactive_item[0][sub_type][a[0]]['html']}"><div class="item_labelClass">${interactive_item[0][sub_type][a[0]]['label']}</div></li>` : `data-default="${a[4]}">${a[0]}</li>${a4_html}`;
				let newHtml = `<li id="${a[0]}" data-value="${a[1]}" data-type="${a[3]}" data-elm_type="${sub_elm_type}" data-selector="${a[2]}" class="${(a[4] == 'default') ? 'type_list uc_float_left': 'type_list item_int thumbnail btn col-sm-5'}" data-sub_type="${sub_type}" ${htmlPart}`;
				AH.insert(elm_selector.querySelector(".sub_type"), newHtml, 'beforeend');
			}

			typeChangePosition = currentSection;
			if (currentControl.nextElementSibling.querySelector("[hidelinenums]") != null) {
				AH.select('#uc_checkbox_0').checked = true;
			} else {
				AH.select('#uc_checkbox_0').checked = false;
			}
		} else {
			AH.alert("This is the single type of the content.");
		}
	});

	AH.listen(document, 'click', '#type_change .type_list', function (currentTarget) {
		let _this_selector = currentTarget.getAttribute("data-selector");
		let _this_value = currentTarget.getAttribute("data-value");
		let _this_type = currentTarget.getAttribute("data-type");
		let _sub_type = currentTarget.getAttribute("data-sub_type");
		let _this_id = currentTarget.getAttribute("id");
		if (_this_type != 'undefined') {
			if (currentTarget.getAttribute('data-default') != 'default') {
				if (_this_selector == "uc\\:syntax") {
					AH.removeDomAttr(typeChangePosition.querySelector(_this_selector), ['console', 'command', 'white']);
				}
				AH.find(typeChangePosition, _this_selector, {action: 'attr', actionData: {[_this_type]: _this_value}});
				ucTimeline.ucInit();
			}
		} else {
			if (_this_value == "CUSTOM") {
				let customDOM = editorConfig.getSectionDef(interactive_item[0][_this_selector][_this_id]['html'], _sub_type);
				AH.insert(typeChangePosition, customDOM, 'afterend');
				typeChangePosition.remove();
			} else {
				let data_html = AH.parseDom(currentTarget.getAttribute("data-html"));
				let data_elm_type = currentTarget.getAttribute("data-elm_type");
				data_html = data_html.querySelector(_this_selector).cloneNode(true);
				AH.find(typeChangePosition, _this_selector, {action: 'attr', actionData: {"class": _this_value}});
				if(data_elm_type && data_elm_type != "undefined"){
					if (data_elm_type == 2) {
						AH.insert(typeChangePosition.querySelector('.' + _this_value), data_html.outerHTML, 'afterend');
						AH.find(typeChangePosition, '.' + _this_value, {action: 'remove'});
					} else {
						AH.find(typeChangePosition, _this_selector, {action: 'html', actionData: data_html.outerHTML});
					}
				}
			}
		}
		AH.getBS("#type_change", 'Modal').hide();
		setContent(AH.parent(typeChangePosition, ".auth-editor")?.getAttribute("id"));

		if (_this_value == "CUSTOM" || _sub_type == 'Timeline') {
			setTimeout(function() {
				ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
			}, 500);
		}
	});

	AH.listen(document, 'click', '#uc_checkbox_0', function (_this) {
		let _this_selector = _this.parentElement.previousElementSibling.getAttribute("data-selector");
		let _this_value = _this.parentElement.previousElementSibling.getAttribute("data-value");
		let _this_type = _this.parentElement.previousElementSibling.getAttribute("data-type");
		if (document.getElementById('uc_checkbox_0').checked) {
			document.getElementById('uc_checkbox_0').setAttribute("checked", true);
			AH.find(typeChangePosition, _this_selector, {action: 'attr', actionData: {[_this_type] : _this_value} });
			ucTimeline.ucInit();
		} else {
			document.getElementById('uc_checkbox_0').setAttribute("checked", false);
			AH.find(typeChangePosition, _this_selector, {action: 'removeAttr', actionData: 'hidelinenums'});
		}
		setContent('content');
	});
}

function ucTimelineEditor(ucEditor) {
	AH.getBS('#authoringSection', 'Tooltip', {selector: '[data-bs-toggle="tooltip"]', container: 'body' });
	AH.selectAll('.slide_data, #slide').forEach((elm)=> elm.setAttribute("contenteditable", "true"));
	AH.listen(document, 'click', '#Timeline, div[data-type="Timeline"] section:not(.listing_section), [data-type="Timeline"], [data-sub_type="Timeline"]', function () {
		let sections = document.querySelectorAll('#authoringSection li[data-parent="parent_element"], #authoringSection div[data-type="timeline"] section, #authoringSection .dot[data-parent="parent_element"]');
		for (let i = 0; i < sections.length; i++) {
			sections[i].setAttribute("id", (i + 1));
		}
	});

	AH.listen(document, 'click', '.removeData', function (_this) {
		_this.closest('section:not(.listing_section), li[data-parent="parent_element"], .dot[data-parent="parent_element"]').remove();
	});

	AH.listen(document, 'click', '.copyData', function (_this) {
		//let element = _this.closest('section:not(.listing_section), li[data-parent="parent_element"], .dot[data-parent="parent_element"]').cloneNode(true);
		let element = AH.closest(_this, 'section:not(.listing_section), [data-parent="parent_element"]');
		AH.find(element, '.ebook_item_text', {action: 'attr', actionData: {id: ''} });
		if (AH.find(_this.parentElement, ".verticle_timeline2", 'all').length > 0) {
			AH.find(element, ".timeline_controls", {action: 'remove'});
		} 
		element.after(element.cloneNode(true));
		AH.find(element.nextSibling, ".remove_me", {action: 'remove'});
		let sections = AH.selectAll('#authoringSection div[type="timeline"] section, #authoringSection div[type="slideshow"] section, #authoringSection li[data-parent="parent_element"],  #authoringSection li[data-parent="parent_element"]');
		for (let i = 0; i < sections.length; i++) {
			sections[i].setAttribute("id", (i + 1));
		}
		setTimeout(()=> {
			ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
		}, 300);
	});

	AH.listen(document,'click', '.swapData', function (_this) {
		let currentControls = _this.parentElement;
		let currentElm = AH.parent(currentControls, 'section:not(.listing_section), li[data-parent="parent_element"], .dot[data-parent="parent_element"]')
		if (currentElm?.previousElementSibling.getAttribute("id") != undefined) {
			let previousData = currentElm.previousElementSibling;
			AH.find(previousData, '.ebook_item_text', {action: 'attr', actionData: {id: ""} });
			AH.find(currentElm, '.ebook_item_text', {action: 'attr', actionData: {id: ""} });
			let currentData = currentElm.innerHTML;
			previousData = previousData.innerHTML;
			// let getPreviousData = currentElm.previousElementSibling.getAttribute("id");
			// let getCurrentData = currentElm.getAttribute("id");
			if (AH.selectAll(currentControls, ".verticle_timeline2").length > 0) { 
				previousData = previousData.replace(/<main[\s\S]*<\/main>/gm, '');
				currentData = currentData.replace(/<main[\s\S]*<\/main>/gm, '');
			}
			AH.select(currentElm, 'html', '');
			AH.select(currentElm, 'html', previousData);
			AH.select(currentElm.previousElementSibling, 'html', currentData);
			setTimeout(()=> {
				ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
			}, 300);
		} else {
			AH.alert("It's first element", 4, true);
		}
		AH.select('.remove_me').remove?.();
	});

	AH.listen(document, 'click', '.downData', function (currentTarget) {
		let currentControl = currentTarget.parentElement;
		let currentSection = AH.parent(currentControl, 'section:not(.listing_section), li[data-parent="parent_element"], .dot[data-parent="parent_element"]');
		if (currentSection && currentSection.nextElementSibling.getAttribute("id") != undefined) {
			let previousData = currentSection.nextElementSibling;
			AH.find(previousData, '.ebook_item_text', {action: 'attr', actionData: {id: ""} });
			AH.find(currentSection, '.ebook_item_text', {action: 'attr', actionData: {id: ""} });
			previousData = previousData.innerHTML;
			let currentData = currentSection.innerHTML;
			//let getPreviousData = currentSection.nextElementSibling.getAttribute("id");
			//let getCurrentData = currentSection.getAttribute("id");
			if (AH.find(currentControl, ".verticle_timeline2", 'all').length > 0) { 
				previousData = previousData.replace(/<main[\s\S]*<\/main>/gm, '');
				currentData = currentData.replace(/<main[\s\S]*<\/main>/gm, '');
			}
			AH.select(currentSection, 'html', '');
			AH.select(currentSection, 'html',  previousData);
			AH.select(currentSection.nextElementSibling, 'html',  currentData);
			AH.select('.remove_me').remove?.();
			setTimeout(()=> {
				ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
			}, 300);
		} else {
			AH.alert?.("It's last element", 4, true);
		}
		
	});

	AH.listen(document, 'click', '.Timeline', function () {
		let divSlide = document.querySelectorAll('#slide, .slide_data');
		let slideNo = 1;
		AH.listen(document, 'click', '.prev', function (_this) {
			let select = _this.parentElement;
			let totChild = select.getElementsByTagName("section");
			for (let i = 0; i < totChild.length; i++) {
				if (totChild[i].getAttribute('class').indexOf('active') != -1) {
					slideNo = i + 1;
				}
				totChild[i].querySelector('br').remove();
			}
			let current = select.querySelector('.active');
			let prevEl = current.previousElementSibling.getElementsByTagName('section');
			if (slideNo === totChild.length || slideNo > 1) {
				AH.toggleDom(select.querySelector(".next"), 'show');
				if (prevEl.length == 1) {
					prevEl = current.parentElement;
					current.classList.remove('active');
					current.classList.add('hideClass');

					prevEl.classList.add('active');
					prevEl.classList.add('animated');
					prevEl.classList.add('fadeInLeft');
					prevEl.classList.remove('hideClass');
				}
			} else {
				AH.toggleDom(select.querySelector(".prev"),'hide');
			}
		});
		AH.listen(document, 'click', '.next', function (_this) {
			let select = _this.parentElement;
			let totChild = select.getElementsByTagName("section");
			for (let i = 0; i < totChild.length; i++) {
				if (totChild[i].getAttribute('class').indexOf('active') != -1) {
					slideNo = i + 1;
				}
				totChild[i].querySelector('br').remove?.();
			}
			//totChild.children('br').remove();
			let current = AH.findChild(select,'.active');
			let prevEl = AH.nextElm(current,'section');
			if (slideNo === 1 || slideNo < totChild.length) {
				select.children(".prev").show();
				if (prevEl.length == 1) {
					prevEl = current.next();
					current.classList.remove('active');
					current.classList.add('hideClass');
					prevEl.classList.add('animated');
					prevEl.classList.add('fadeInRight');
					prevEl.classList.add('active');
					prevEl.classList.remove('hideClass');
				}
			} else {
				AH.findChild(select, ".next").hide();
			}
		});
	});
}


// Bind events for content
function initEditorListeners() {
	AH.listen('body', 'shown.bs.tab', '.specialPaste a[data-bs-toggle="tab"]', switchSpecialPaste.bind(this));
	AH.bind('#show_guid', 'click', (event)=> {
		let range = document.createRange();
		range.selectNode(document.getElementById("show_guid"));
		window.getSelection().removeAllRanges();    // clear current selection
		window.getSelection().addRange(range);      // to select text
		document.execCommand("copy");
		window.getSelection().removeAllRanges();
		event.target.setAttribute("data-bs-original-title", "ID Copied");
		AH.getBS(event.target, 'Tooltip', {container: 'body' }).show();
	});
	
	document.body.addEventListener('click', (e)=> {
		AH.selectAll('.image_popover[data-bs-toggle="popover"]').forEach((_this)=> {
			if (!_this.isSameNode(e.target) && _this.contains(e.target) && AH.hasInall('.popover', e.target).length === 0) {
				AH.getBS(_this, 'Popover').hide();
			}
		});
	});
	AH.listen("#stem", 'keyup', 'div[data-section*="sec_button"],div[data-section*="sec_button_new"]', (_this)=> {
		if (_this.querySelectorAll('.addnext_caption').length > 0) {
			let val = (_this.querySelector('.addnext_caption').textContent.trim() == '') ? 'Next' : _this.querySelector('.addnext_caption').textContent.trim();
			AH.find(_this, '.uc_step_explanation', {action: 'attr', actionData: {'data-btnnme' : val} });
		}
	});
	AH.listen("#content", 'keyup', 'div[data-section*="sec_button"],div[data-section*="sec_button_new"]', (_this)=> {
		if (_this.querySelectorAll('.addnext_caption').length > 0) {
			let val = (_this.querySelector('.addnext_caption').textContent.trim() == '') ? 'Next' : _this.querySelector('.addnext_caption').textContent.trim();
			AH.find(_this, '.uc_step_explanation', {action: 'attr', actionData: {'data-btnnme': val} });
		}
	});
	
	AH.listen('body', "click", '#publish_chbox_all', (_this)=> {
		AH.select('.course_list_action input[type="checkbox"]').checked = _this.checked;
	});

	AH.listen('body', 'click', '#authoringDiv player,#authoringDiv snt,#authoringDiv seq,#authoringDiv .link', function(_this) {
		try {
			player_parent = AH.parent(_this, ".auth-editor").getAttribute("id");
			if (_this.classList.contains('hidecontent') || _this.closest("#stemShow, #remediationShow")) { 
				return false; 
			}
			if (_this.parentElement.getAttribute('id') != 'authoringArea') {
				state.playeArr = {};
				let bookmark = tinyMCE.activeEditor.selection.getBookmark(2, true);
				Array.prototype.forEach.call(_this.attributes, (playerAttr)=> {
					if (playerAttr && playerAttr.specified) {
						state.playerArr[playerAttr.name] = playerAttr.value;
					}
				});
				if (_this.getAttribute('type') == 'playground' || _this.classList.contains('link')) {
					state.playerArr['playground'] = _this.textContent;
				}
				state.playerArr['obj'] = _this;
				state.playerArr['bookmark'] = bookmark;
				state.playerState = true;
				state.playerPopup = true;
			}
		} catch(err) {
			console.log("Error in Player update", err);
		}
	});

	AH.listen(document, 'click', '.panel-controls__change-type', (_this)=> {
		swapPanel(_this);
	});

	AH.listen(document, 'click', '#preview player', (_this)=> {
		if (_this.getAttribute('type') != 'exhibit') {
			renderPlayer();
		}
	});

	AH.listen(document, 'click', '.panel-controls__duplicate', (_this)=> {
		let _this_section = _this.closest('.uc_step');
		let cloned_this_section = _this_section.cloneNode(true);
		AH.find(cloned_this_section, '.controls_button', {action: 'remove'});
		AH.insertAfter(cloned_this_section, _this_section);

		AH.bind(cloned_this_section,'mouseenter', event=> {
			const _this = event.target;
			let control_panel = ucStepContolPanel;
			if (AH.find(_this, '.controls_panel_button', 'all').length == 0) {
				AH.insert(_this.closest('.uc_step'), control_panel, 'afterbegin');
			}
		});
		
		AH.bind(cloned_this_section, 'mouseleave', event=> {
			//element that has gained focus while enterting the edit buttons group
			const _this = event.target;
			if (!_this.closest('.uc_step').querySelector('.controls_panel_button')) {
				return;
			}
			AH.selectAll('.controls_panel_button', 'remove');
		});
	});

	AH.listen(document, 'click', '.panel-controls__remove', (_this)=> {
		let parent_tinymce_id = AH.parent(_this, ".tinymce-editor");
		if (_this.closest('.uc_step_explanation').querySelectorAll('.uc_step').length != 1) {
			_this.closest('.uc_step').remove();
			setContent(parent_tinymce_id.getAttribute("id"));
		}
	});
	
	AH.bind('#authoringLoadComponent', 'click', () => {
		if (!AH.get('save_item')) {
			AH.set('save_item', (editor.save == 1) ? true : false);
		}
	});
}

function refreshEvents() {
	if (uc_image_annotate) {
		uc_image_annotate.bindMulti();
	}
	AH.listenAll('#authoringSection .uc_step', 'mouseenter', event=> {
		const _this = event.target;
		let control_panel = ucStepContolPanel;
		if (AH.find(_this, '.controls_panel_button', 'all').length == 0) {
			AH.insert(_this.closest('.uc_step'), control_panel, 'afterbegin');
		}
	});

	AH.listenAll('#authoringSection .uc_step', 'mouseleave', event=> {
		//element that has gained focus while enterting the edit buttons group
		const _this = event.target;
		if (!_this.closest('.uc_step').querySelector('.controls_panel_button')) {
			return;
		}
		AH.selectAll('.controls_panel_button', 'remove');
	});

	AH.bind('#show_guid','mouseenter', (event)=> {
		AH.setCss(event.target, {cursor: 'pointer'});
		event.target.setAttribute("data-bs-original-title", "Tap to copy");
		AH.getBS(event.target, 'Tooltip', {container: 'body' }).show();
	});

	AH.listenAll('.controls_panel_button', 'mouseleave', (event)=> {
		event.target.remove();
		AH.toggleDom('.tooltip', 'hide');
	})

	// For accordion controls-----
	AH.listenAll('#authoringSection section[nd="1"] header', 'mouseenter', (event)=> {
		let _this = event.target;
		var control_panel = '<main data-remove="true" contenteditable="false" class="controls_panel_button" style="height:1px;outline:none;float:right;margin-top:8px"><div class="panel-controls" style="opacity:1;position:relative;"><div class="panel-controls__container"><div class="panel-controls__bar"><div style="border-radius: 2.3rem;border: 1px solid rgba(49,53,55,.2);background:#FFF8DC;padding:6px 0" class="panel-controls__tools"><div><a class="panel-controls__duplicate" data-bs-toggle="tooltip" title="Add"><i class="icomoon-file-plus-2"></i></a></div><div><a class="panel-controls__change-type" data-bs-toggle="tooltip" title="Swap"><i class="icomoon-tab"></i></a></div><div><a class="panel-controls__remove" data-bs-toggle="tooltip" title="Remove"><i class="icomoon-24px-delete-1"></i></a></div></div></div></div></div></main>';
		// let e = event.relatedTarget || event.toElement;
		let controlsAcc = AH.find(_this.closest('section[nd="1"]'), '.controls_panel_button', 'all');
		if (controlsAcc.length == 0) {
			AH.insert(_this.closest('section[nd="1"]'), control_panel, 'afterbegin');
			AH.listen(document, 'click', '.panel-controls__duplicate', function (_this2) {
				let _this_section = _this2.closest('section[nd="1"]');
				AH.find(_this_section, ".ebook_item_text", {action:'attr', actionData: {id: ""} });
				let cloned_this_section = AH.clone(_this_section);
				if (cloned_this_section.querySelector('.controls_button')) cloned_this_section.querySelector('.controls_button').remove();
				cloned_this_section.querySelector('article').removeAttribute('style');
				AH.insertAfter(cloned_this_section, _this_section);
				initEbookInteractivity();
				setContent(AH.parent(_this2, ".tinymce-editor").getAttribute("id"), 'refresh');
				ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
			});

			AH.listen(document, 'click', '.panel-controls__remove', function (_this3) {
				let parent_tinymce_id = AH.parent(_this3, ".tinymce-editor");
				if (_this3.closest('.drop_list').querySelectorAll('section[nd="1"]').length != 1) {
					_this3.closest('section[nd="1"]').remove();
					setContent(parent_tinymce_id.getAttribute("id"));
				}
			});
		}
	});

	AH.listenAll('#authoringSection section[nd="1"] header', 'mouseleave', (event)=> {
		let _this = event.target;
		let e = event.relatedTarget || event.toElement;
		let removeON = ['SECTION', 'ARTICLE'];
		//element that has gained focus while enterting the edit buttons group
		if ( removeON.includes(e?.tagName) ) {
			AH.selectAll('.controls_panel_button', 'remove');
		}
	});
	// --- end accordion contorl ----//
	// leve on timelines
	AH.listenAll('#authoringSection div[type="timeline"] section, #authoringSection div[type="slideshow"] section, #authoringSection [data-parent="parent_element"]', 'mouseleave', (event)=> {
		AH.find(event.target, ".remove_me", {action: 'remove'});
		AH.selectAll('.copyData, .removeData, .downData, .swapData', 'css', {outline: 'none'});
		AH.toggleDom('.tooltip', 'hide');
	});

	// Enter on timelines
	AH.listenAll('#authoringSection div[type="timeline"] section, #authoringSection div[type="slideshow"] section,  #authoringSection [data-parent="parent_element"]', 'mouseenter', (event)=> {
		let data;
		let currentTarget = event.target;
		if (AH.find(currentTarget, ".remove_me", 'all').length > 0 ) {
			AH.find(currentTarget, ".remove_me", {action: 'show'});
		} else {
			let right_pos = `right: ${currentTarget.getAttribute("data-right")}px;`;
			if (currentTarget.parentElement.querySelectorAll(".verticle_timeline2").length > 0) {
				right_pos = ((AH.domIndex(currentTarget) % 2) != 0) ? "right: " + currentTarget.getAttribute("data-right") + "px;" : "left: " + currentTarget.getAttribute("data-right") + "px;";
			}
			data = `<main data-remove='true' class='timeline_controls remove_me text-center' style='outline: none; position: ${currentTarget.getAttribute("data-position")}; top: ${currentTarget.getAttribute("data-top")}px;bottom: ${currentTarget.getAttribute("data-bottom")}px; ${right_pos}; float: ${currentTarget.getAttribute("data-float")}; left: ${currentTarget.getAttribute("data-left")}px;height: 32px; width: 155px;' contenteditable='false' class='buttonOpacity main_cont'><div contenteditable='false' class='swapData text-center rounded-circle bg-warning position absolute' style='left: 4px;' data-bs-toggle='tooltip' data-bs-original-title="${((currentTarget.getAttribute('data-arrow') == '2') ? 'MoveLeft': 'MoveUp')}">${((currentTarget.getAttribute('data-arrow') == '2') ? '&#x2190': '&#x2191')}</div><div contenteditable='false' class='downData text-center rounded-circle bg-warning position absolute' style='left: 42px;' data-bs-toggle='tooltip' data-bs-original-title="${((currentTarget.getAttribute('data-arrow') == '2') ? 'MoveRight': 'MoveDown')}">${((currentTarget.getAttribute('data-arrow') == '2') ? '&#x2192': '&#x2193')}</div><div contenteditable='false' class='copyData text-center rounded-circle bg-warning position absolute' style='left: 80px; ' data-bs-toggle='tooltip' data-bs-original-title='Add'>&#10010</div><div contenteditable='false'  class='removeData text-center rounded-circle bg-warning position width30 absolute' style='left: 119px;' data-bs-toggle='tooltip' data-bs-original-title='Delete'>&#10006</div></main>`;
			switch(currentTarget.getAttribute("ctrl-container")) {
				case 'child_prep': {
					AH.insert(AH.find(currentTarget, "[data-child='child_element']"), data, 'beforeend');
					break;
				}
				case 'child_app': {
					AH.insert(currentTarget.querySelector("[data-child='child_element']"), data, 'beforeend');
					break;
				}
				default: {
					AH.insert(currentTarget, data, 'afterbegin');
				}
			}
		}
	});

	activateEditor(200);
}

// XMl formatting
function formatXmlRef(xml, type) {
	if (Items && Items.UI.doNotformatXml) {
		return (typeof Items.UI.doNotformatXml == "function") ? Items.UI.doNotformatXml(type, xml) : xml;
	} else {
		return formatXml(xml);
	}
}

//Method to manage keydown events
function handleKeydown(e) {
	if (e.ctrlKey && e.altKey && e.keyCode == 40) {
		cursorPosition = e.target.closest('div[data-section]');
		if (!cursorPosition[0]) {
			cursorPosition = e.target.closest('section[data-section]');
		}
	}
}

// Method to handle add new section
function openItems() {
	AH.getBS('#interactive_items', 'Modal').show();
	_interactiveItem.createItems();
	AH.listen(document, "click", ".modal-backdrop", function () {
		AH.getBS('#interactive_items', 'Modal').hide();
	});
	AH.listen(document, "click", ".left_second", function (_this, e) {
		if (_this.classList.contains("modal-content") || _this.classList.contains("modal_items")) {
			return;
		}
		AH.getBS('#interactive_items', 'Modal').hide();
	});
}

// Mehtod to handle keyup events
function handleKeyup(e) {
	if (preview_edit != 1 && e.ctrlKey && e.altKey) {
		switch (e.keyCode) {
			case 83:
				//Save case
				console.warn("Save Action");
				state.saveDialog = true;
			break;
			case 84 :
				switchTabs();
			break;
			case 80 :
				//Previous case
				editorHeaderRef.checkNavigation(false)
			break;
			case 78 :
				//Next case
				editorHeaderRef.checkNavigation(1)
			break;
			case 76 :
				//List case
				editorHeaderRef.onItemListButton();
			break;
			case 187 :
				AH.set('filter_item', false);
				openItems();
			break;
			case 67 :
				//ctrl+alt+c , format in code tag
				try {
					tinymce.activeEditor.formatter.register('codeformat', {
						inline: 'code',
						remove: 'all',
						styles: { display: "inline" },
					});
					tinymce.activeEditor.execCommand("mceToggleFormat", false, "codeformat");
				} catch (e) {
					console.warn("It Seems you have not selected any text to wrap into code tag.");
				}
			break;
			case 86 :
				//ctrl+alt+v , show paste special dialog box
				try {
					handlePasteSpecial();
				} catch (e) {
					console.warn("Something went wrong during paste", e);
				}
			break;
			case 72 :
				//ctrl+alt+h , show help/keyboard dialog box
				try {
					modal = {
						header  : {
							body: l.keyboard_shortcut,
							class: "editor_modal_title"
						},
						body    : {
							body: editorConfig.keyboardShortcutLayout(),
							class:"editor_modal_content", 
							style:"height: 300px;"
						},
						footer  : {
							body: [],
							class:"editor_modal_action"
						},
						width: 500,
					};
					handleModal(modal);
				} catch (e) {
					console.warn("Failed to open keyboard shortcut dialog", e);
				}
			break;
		}
	}
}

// Switching in special paste dialog
function switchSpecialPaste(event) {
	state.radioValue = event.getAttribute('action') || 'plain';
}

// Mange special paste dilaog 
function handlePasteSpecial() {
	state.radioValue = 'plain';
	modal = {
		header  : {
			body: "Paste with Formatting",
			class: "editor_modal_title"
		},
		body    : {
			body: (
				`<div>
					<ul class="nav nav-tabs editorTabs specialPaste">
						<li><a data-bs-toggle="tab" href="#plain" class="active" action="plain">Plain</a></li>
						<li><a data-bs-toggle="tab" href="#formatted" action="formatted">Formatted</a></li>
					</ul>
					<div class="tab-content editorTabContent">
						<div id="plain" class="tab-pane fade in active">
							<textarea class="w-100 border border-dark" style="resize: none;" id="plainText" rows="9" cols="100"></textarea>
						</div>
						<div id="formatted" class="tab-pane fade">
							<div class="w-100 overflow-auto border border-dark" style="height: 200px;background: #fff;" id="formattedText" contenteditable="true"></div>
						</div>
					</div>
				</div>`
			),

			class: "editor_modal_content"
		},
		footer  : {
			body: [{label:'Ok', onAction: pasteSpecialFunc}],
			class:"editor_modal_action"
		},
		width: 500,
		};
		handleModal(modal);
	
}

// Handle paste action
function pasteSpecialFunc() {
	try {
		handleModal();
		let data ="";
		let filterAttr = ['class', 'id', 'style'];
		if (state.radioValue == 'plain') {
			data = AH.select('#plainText').value;
			data = "" + data.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/ /g, "&#160;").replace(/\n/g, "<br>") + "";
		} else if (state.radioValue == 'formatted') {
			data = document.getElementById('formattedText').innerHTML;
			filterAttr.forEach(function (attr) {
				let regx = new RegExp(` ${attr}="([^"]*?)"`, 'gi');
				data = data.replace(regx, '');
			});
		}
		ucEditor.insertContent(data, 'raw');
	} catch (e) {
		console.log({ Error: e.name, Line: 4003, File: "smeditor.js" });
	}
}

// Mange SaveXMl dialog
function saveXML() {
	//doesConnectionExist();
	state.saveDialog = true;
	if (state.domain.length != 5) {
		AH.toggleDom('#saveAs', 'hide');
	}
}

// CHeck stem is required
function doNotShowStem () {
	if (state.inline_item == "1") {
		AH.toggleDom("#stem, #remediation, #remedToggle", 'hide');
	}
}

// Update Item xml and init algo
async function setModule(DXML) {
	doNotShowStem();
	if (state.viewConfig.isQuestion) {
		state.xml = DXML;
	} 
	await initializeAlgo();
	didMount();
}

// Algo Initializtion
function initializeAlgo() {
	return new Promise((resolve)=> {
		var algo_qxml = state.algo_qxml;
		if (algo_qxml == '') {
			let algo_str = 'var1=algo_randInt(6,10)\nvar2=5\nvar3=algo_current("var1")+2\nvar4=algo_randInt(1,10)\nvar5=algo_randInt(2,20)';
			let algo = algo_str.split('\n');
			state.single_variables = algo;
		} else {
			algo_qxml = algo_qxml.replace(/<br \/>/g, "");
			setTimeout(() => {
				state.algo_qxml = algo_qxml;
			}, 500);
			algo_qxml = algo_qxml.replace("<algostatic>", "");
			algo_qxml = algo_qxml.replace("</algostatic>", "");
			let algo = algo_qxml.split('\n');
			//algo.pop();
			state.variable_button = true;
			state.single_variables = algo;
		}
		resolve(true);
	});
}

// Hnadle External Review mode
function externalToggle() {
	setTimeout(function () {
		renderPlayer();
		const fullModeHide = AH.find('body', '.controls_button, .full_mode_hide', 'all');
		if(fullModeHide && fullModeHide.length>0){
			fullModeHide.forEach(ele => {
				const nextEle = ele.nextElementSibling;
				if(nextEle.querySelectorAll("player").length == 0 && nextEle.textContent.trim() == "Edit" || nextEle.textContent.trim() == ""){
					ele.style.visibility = 'visible'
				}
			});
		}
	}, 500);
	if ((state.item == '32') && document.getElementById("authoringFrame").getAttribute('data-authoring') == '1') {
		try {
			document.getElementById("authoringFrame").contentWindow.getData();
			if (document.getElementById("authoringFrame").contentWindow.returnFalse == 1) {
				return;
			} else {
				state.toggleMode =  !state.toggleMode;
			}
		} catch (e) { }
	} else {
		state.toggleMode = !state.toggleMode;
	}
}

// Manage tab switching of editor
function editorPaneShow(event) {
	if (true) {
		externalToggle();
	}
	if (event.target.getAttribute('href') == "#authoringDiv") {
		state.remediationToggle = false;
		AH.toggleDom("#device_btn", 'hide');
		state.editorView = 'authoring';
	} else {
		AH.toggleDom("#device_btn", 'show');
		let currentRefreshFunc = AH.get(state.content_type+"_refresh");
		if (currentRefreshFunc) {
			currentRefreshFunc();
		}
		// Render equation
		activateMathMl(state.stem + state.remediation + state.content, state.variable_button, mathMLRender);
		AH.selectAll('.mce-panel', 'hide', {action: 'hiden'})
		state.editorView = 'preview';
	}
}

// Setup tinymce controls config and data init
function setupEditor(urlVars) {
	window.parent.edit_content = 0; // For editor
	AH.set('save_item', false);
	window.mm = mathMLRender;
	//document.querySelector('a[data-bs-toggle="tab"]').addEventListener('shown.bs.tab', editorPaneShow.bind(this));
	AH.listenAll('#edi_tabs a[data-bs-toggle="tab"]', 'shown.bs.tab', editorPaneShow.bind(this));
	if (in_frame && new_title != '' && new_guid != '') {
		editorConfig.setParentData(new_guid, urlVars['content_subtype']);
	}
	AH.toggleDom(".activator, .footerstr, .tooltip", 'hide');
	let tinymce_editor = document.querySelector(".tinymce-editor");
	if (tinymce_editor) {
		tinymce_editor.addEventListener("click", function () {
			tinyMCE.activeEditor.focus();
			if (!AH.get('editorActivated')) {
				activateEditor(100, true);
			}
		});
	}
	
	if ( (in_frame == 1) && (state.guid || "s,f".includes(state.content_type)) ) {
		AH.toggleDom(AH.select('.backBtn').parentElement, 'hide');
	}
	if (from_coverage_edit) {
		AH.toggleDom(".editor_close", 'hide');
	}
	if (preview_edit != 1) {
		if (in_frame != 1 && document.getElementById('authoringDiv').clientWidth > 360) {
			AH.setCss(document.getElementById("toolbar_container"), {visibility: "visible"});
		}
		
		tinyMCE.PluginManager.add('addnewsection', function (editorPlugin) {
			editorPlugin.addMenuItem('addnew', {
				icon: 'mytextwithicon',
				text: 'Add New',
				context: "tools",
				onClick: function () {
					cursorPosition = document.querySelector(`#${tinymce.activeEditor.id}`);
					AH.set('filter_item', false);
					if (cursorPosition.getAttribute('id').startsWith('option')) {
						cursorPosition = false;
						AH.set('filter_item', 'code-block');
					} else if(!cursorPosition.getAttribute('data-section')) {
						cursorPosition = cursorPosition.closest('div[data-section]')
						if (!cursorPosition[0]) {
							cursorPosition = cursorPosition.closest('section[data-section]');
						}
					}
					openItems();
				}
			});
		});

		tinyMCE.PluginManager.add('placeholder', function(editor) {
			editor.on('init', function () {
				let elem = editor.getElement();
				if (!elem) return;
				let wrapper = AH.parent(elem, ".tinymce-editor") ? AH.parent(elem,".tinymce-editor") : elem;
				let placeHolder = wrapper.previousElementSibling;
				if (placeHolder && wrapper.querySelectorAll("player").length == 0 && (wrapper.textContent == "" || wrapper.textContent == "Edit")) {
					AH.setCss(placeHolder, {visibility: 'visible'});
				}
			});
			editor.on('focus', function() {
				let childDom = editor.getElement();
				if (childDom && childDom.getAttribute('id') != 'title') {
					childDom = AH.parent(childDom, ".tinymce-editor");
				}
				if (!childDom) return;
				let placeHolder = childDom.previousElementSibling;
				if (childDom.textContent.trim() != "" || childDom.textContent != "Edit" ) {
					AH.setCss(placeHolder, {visibility: 'hidden'});
				}
				
			});
			editor.on('blur', function() {
				let childDom = editor.getElement();
				if (childDom && childDom.getAttribute('id') != 'title') {
					childDom = AH.parent(childDom, ".tinymce-editor");
				}
				if (!childDom) return;
				let placeHolder = childDom.previousElementSibling;
				if (childDom.querySelectorAll("player").length == 0 && childDom.textContent.trim() == "Edit" || childDom.textContent.trim() == "") {
					placeHolder.style.visibility = 'visible';
				}
			});
			
		})

		tinyMCE.PluginManager.add('playertag', function (editorPlugin) {
			editorPlugin.addMenuItem('player', {
				text: "Embed",
				icon: 'mytextwithicon',
				context: "tools",
				onclick: function () {
					state.playerArr = {};
					let bookmark = tinyMCE.activeEditor.selection.getBookmark(2, true);
					state.playerState = true;
					state.playerBookmark = bookmark;
					state.playerPopup = true;
				}
			});
			editorPlugin.on('keydown', function (e) {
				let currentNode = document.getElementById(e.target.id);
				if (currentNode.textContent.length < 2 && e.keyCode == 8) {
					e.preventDefault();
					e.stopPropagation();
					currentNode.innerHTML = '&nbsp;';
					return false;
				}
			});
			editorPlugin.on('change', function (e) {
				let currentNode = document.getElementById(e.target.id);
				if (currentNode) {
					if (currentNode.classList.contains("auth-editor")) {
						setContent(tinymce.activeEditor.id);
					} else {
						let authId = AH.parent(currentNode, ".auth-editor").getAttribute("id");
						setContent(authId);
					}
					toggleSave(editor.save);
				}
			});
	
			editorPlugin.on('click', function () {
				let authSection = document.getElementById('authoringSection');
				if (authSection.querySelectorAll(".list6_new").length > 0 || authSection.querySelectorAll(".list5_new").length > 0 || authSection.querySelectorAll(".list4_new").length > 0 || authSection.querySelectorAll(".list3_new").length > 0 || authSection.querySelectorAll(".list2_new").length > 0) {
					tinyMCE.activeEditor.undoManager.undo();
				}
			});
		});
		tinymce.EditorManager.editors = [];
		ucEditor.initEditor();
	}
	let tempHeight = (from_myproject == "1") ? window.parent.document.body.clientHeight : window.innerHeight;
	let calculatedHeight = (tempHeight - (tempHeight * 0.08)) + 'px';
	AH.setCss("#editorViewPane", {minHeight: calculatedHeight, height: calculatedHeight });
	if (preview_edit != 1) {
		editorConfig.findMathError();
		checkSection();
		if (getQueryString('switch_preview') == 1) {
			if (AH.getBS('[href="#custom_columnize"]', 'Tab').hasOwnProperty('show')) {
				AH.getBS('[href="#custom_columnize"]', 'Tab').show();
			}
		}
	}
	activateMathMl(state.stem + state.remediation + state.content, state.variable_button, mathMLRender);
	AH.selectAll("#stem, #content, #remediation").forEach((_elm)=> {
		AH.watchDom(_elm, (changes)=> {
			console.warn(changes);
			if (_editorBuffer['watchDom']) clearTimeout(_editorBuffer['watchDom']);
			_editorBuffer['watchDom'] = setTimeout(refreshEvents, 500);
		});
	})
	activateEditor(200, true);
}

// Section validation on edit

async function checkSection() {
	console.warn("Section being Removing.");
	let sections = document.querySelectorAll('#authoringSection .sec_button, #authoringSection .sec_button_new');
	console.warn("Section Found = ", sections.length);
	if (sections.length > 0) {
		for (let item of sections) {
			await removeSection(item);
		}
		document.querySelectorAll('#authoringSection .sec_button, #authoringSection .sec_button_new').forEach((elm)=>elm.remove());
	}
	console.warn("Section checked...");
	AH.enableBsAll("[data-bs-toggle='tooltip']", 'Tooltip', {container: 'body' });
	await tick();
}

// Init tinymce plugin
function activateEditor(timer = 100, ignore=false) {
	if (AH.get('editorActivated')) return true;
	if (editorBuffer['activateEditor']) clearTimeout(editorBuffer['activateEditor']);
	editorBuffer['activateEditor'] = setTimeout(()=> {
		ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
		AH.remove('br[data-mce-bogus="1"]');
		AH.activate(0);
		editorConfig.mathMl('add', "", state);
		//jQuery('.load_data', window.parent.document).hide();
		AH.toggleDom(window.parent.document.querySelector(".load_data"), 'hide');
		if (!ignore) AH.set("editorActivated", true);
		console.warn("activated...");
	}, timer);
	
}

// Create content contorls
function setInitialButton() {
	return editorConfig.controls('text') + `<div data-section="sec_button" type='ebook-item' sub_type='text' class='ebook_item_text'></div>`;
}

// analyze content to add wrapper
function keepAnalyzeData(content) {
	if (document.getElementById('content section')) {
		content = document.querySelector('#content section .ebook_item_text').innerHTML;
	}
	if (content) {
		content = content.replace('<node>', '').replace('</node>', '');
	}
	state.oldStemData = content;
}

// check whole content to add controls and missed wrapper
function initAddFeature(title, stem, remediation, content) {
	let sectionList = editorConfig.initAddFeatureSelector(stem, remediation, content);
	let filter = content ? "#content" : "#stem,#remediation";
	//console.warn(filter, "initAddFeature called");
	//Future code for automatic init
	for (let key in sectionList) {
		//console.warn({[key]:filter.includes(key)});
		if (filter.includes(key)) {
			let container = `#authoringSection ${key}`;
			let innerSelector = document.querySelector(container)?.querySelector(editorConfig.eBookItemTypeOld) ? editorConfig.eBookItemTypeOld : editorConfig.eBookItemType;
			let sectionData = sectionList[key];
			let findSection = `${innerSelector} .ebook_item_text`;
			if (AH.find(container,findSection,'all')?.length == 0 || editorConfig.shouldWrap(container)) {
				//console.warn("Warapping");
				content ? keepAnalyzeData(content) : "";
				if (sectionData.data) {
					let wrapped =  editorConfig.getSection(sectionData.data, sectionData.inline, key);
					//sectionData.store[sectionData.holder] = wrapped;
					state[sectionData.holder] = wrapped;
					if (sectionData.copyInto) state[sectionData.copyInto] = sectionData.data;
					//self.setState(sectionData.store);
					AH.select(key).innerHTML = wrapped;
				} else {
					AH.select(key).innerHTML = setInitialButton(sectionData.holder);
				}
			} else {
				content ? keepAnalyzeData(sectionData.data) : "";
			}
			if (AH.find(container,innerSelector, 'all').length > 0) {
				//console.warn("Adding Controls");
				document.querySelector(container).querySelectorAll(innerSelector).forEach(function (_this, index) {
					AH.insert(_this, editorConfig.controls(_this.getAttribute('sub_type')), 'beforebegin');
					if (index == 0 && sectionData.inline && !_this.classList.contains(sectionData.inline)) {
						_this.classList.add(sectionData.inline);
					}
				});
				callInlineEditor(key);
			}
		}
	}
}

// check whether init editor needed
function callInlineEditor(where) {
	if (document.querySelector("#authoringSection " + where + " .ebook_item_text").classList.contains("mce-content-body")) {
		editCount++;
	} else {
		if (editCount < 100) {
			setTimeout(function () {
				editCount++;
				setInlineEditor(where);
				callInlineEditor(where);
			}, 200);
		}
	}
}

// Enabale editor if anything not editable
function setInlineEditor(where) {
	document.querySelectorAll("#authoringSection " + where + " .ebook_item_text").forEach(function (item) {
		item.setAttribute("id", "");
	});
	ucEditor.initEditor(false, "#authoringSection " + where + " .ebook_item_text");
}

// Update if ebook content coming from parent side
function updateEbookContent() {
	if (in_frame && new_title != '') {
		state.title = new_title;
		AH.select('#title, #title_show', 'html', {action: 'html', actionData: new_title});
	}
	if (ebook_flashTitle != '' || ebook_flashContent != '') {
		//setTimeout(function () {
			state.title = ebook_flashTitle;
			state.content = ebook_flashContent;
			AH.selectAll("#title, #title_show",'html', ebook_flashTitle);
			AH.selectAll("#content, #content_show", 'html', editorConfig.getSection(ebook_flashContent, '#content'));
			setTimeout(function () {
				ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
			}, 200);
		//}, 1000);
	}
}

// Add place holder for editor sections
function addPlaceHolder (placeholder, addOn) {
	let domKey = "placeHolder"+placeholder;
	if (addOn) {
		// eslint-disable-next-line react/jsx-key
		return(`<br /><div style="background:#e9ecef; z-index: 100"><b key="${domKey}" class="text-muted" id="${domKey}">${placeholder}</b></div>`);
	} else {
		return(`<div style="background:#e9ecef; z-index: 100"><b key="${domKey}" class="text-muted" id="${domKey}">${placeholder}</b></div>`);
	}
	
}

// select suitable class for sections
function editorClass() {
	if (Items.UI && Items.UI.isHideForContentIcon && Items.UI.isHideForContentIcon == +state.content_icon) {
		return "h";
	} else {
		return "tinymce-editor auth-editor";
	}
}

// Check snt and preview
function previewSnt(content) {
	let sntTag = (content) ? content.match(/<snt(.*?)<\/snt>/gmi) : "";
	if (sntTag) {
		for (let i in sntTag) {
			let refid = sntTag[i].match(/refid="(.*?)"/gmi);
			refid = (refid[0]) ? refid[0].replace(/refid=|"/gmi, '') : "";
			if (state.sntTags[refid]) {
				content = content.replace(sntTag[i], state.sntTags[refid] + "</div><div style=background-Color:#fff>");
			}
		}
	}
	return content;
}

// Adding event for intractive layouts
function interactiveEditor() {
	AH.listen(document, 'click', '.save_xml_btn', function (_this, event) {
		if (_this.getAttribute('action') == "none") return;
		var isOnOpenSave = (Items && Items.UI.onOpenSave);
		if (isOnOpenSave && Items.UI.onOpenSave(state)) {
			modal = {
				header  : {
					body: 'Warning',
					class: "editor_modal_title",
				},
				body    : {
					body: "You haven't changed the database name, do you wish to continue?",
					class: "editor_modal_content",
				},
				footer  : {
					class: "editor_modal_action",
					body: [{'label':'Yes', onAction: ()=> {
							handleModal();
							updateModuleState('db_changed',true);
							saveXML();
						}}]
				},
				width: 300,
			};
			handleModal(modal);
			return 1;
		}
		AH.set('save', true);
		if (_this.getAttribute('action')) {
			saveAction(event, _this.getAttribute('action'), "skip");
		} else {
			saveXML();
		}
	});
	if (!AH.get('isAjax')) {
		AH.selectAll("#content, #stem, #remediation", 'html', setInitialButton());
	}
	AH.listen(document, 'click', '.modal_items .item_int', function (_this) {
		//@pradeep: this event will call when we select anyting from sidepane.
		AH.getBS("#items_list", 'Modal').hide();
		let insertHtml = editorConfig.controls(_this.getAttribute('data-type')) + editorConfig.getSection(_this);
		if (cursorPosition) {
			AH.insert(cursorPosition, insertHtml, 'afterend');
			setContent(AH.parent(cursorPosition, ".auth-editor").getAttribute("id"));
		} else {
			ucEditor.insertContent(insertHtml);
		}
		initEbookInteractivity();
		AH.getBS("#interactive_items",'Modal').hide();
		ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
		if (!AH.get('save_item')) {
			AH.set('save_item', (editor.save == 1) ? true : false);
		}
		AH.enableBsAll("[data-bs-toggle='tooltip']", 'Tooltip', {container: 'body' });
	});
	interactiveEvents();
}

function editorModalUpdate(status) {
	state.editorModalHandle = status;
}


function smValidate(_this) {
	if (state.skipValidation == false) {
		if (_this && _this.error == true) {
			//self.setState({errMessage:_this.message});
			
			state.errMessage = _this.message;
			
			modal = {
				header  : {
					body: "Warning",
					class: "editor_modal_title .bg-light",
				},
				body    : {
					body: "More than 6 options may cause this item to not render properly on a smartphone",
					class: "editor_modal_content",
					style:{height:'300'}
				},
				footer  : {
					class: "editor_modal_action",
					body: [{'label':'Do not show again', onAction: ()=> {
								handleModal();
								editorModalUpdate(false);
								updateModuleState('skipValidation', true);
							}
					}]
				},
				maxWidth: 'sm',
			};				
			editorModalUpdate(true);
			handleModal(modal);
		} else {
			console.log("Error in module on calling of smValidate", _this);
		} 
	}
}

//reflect changes in preview
function setContent(type, isRefresh) {
	player_parent && (player_parent = "");
	(editorBuffer['lastAction']) ? clearTimeout(editorBuffer['lastAction']) : "";
	editorBuffer['lastAction'] = setTimeout(function () {
		let content = ucEditor.getContent(type, 'raw');
		if (AH.isValid(content)) {
			!changedKeys.includes(type) && changedKeys.push(type);
			content = replaceUnwantedTags(content, type);
			if (content.indexOf('contenteditable') > -1) {
				state.message = "Something went wrong, your data may be in inaccurate while saving";
				state.activate = true;
			}
			let typeSelector = document.querySelector(`#${type}_show`);
			if (typeSelector) typeSelector.innerHTML = previewSnt(get_ucsyntax(content));
			let previewSec = document.getElementById("previewSection");
			editorConfig.mathMl('reset');
			editorConfig.mathMl('set');
			//@saquib added this line due to multiple rendering of prettyprint
			AH.removeClass(previewSec.querySelectorAll(".prettyprintReplica"), ["prettyprint","linenums"]);
			if (content.match(/<uc:syntax/gm)) {
				prettyPrint();
			};
			AH.addClass(AH.find(previewSec, ".prettyprint", 'all'), "prettyprintReplica");
			AH.addClass(AH.find(previewSec, ".prettyprintReplica", "all"), ["prettyprint","linenums"]);
			state[type] = ucEditor.getContent(type, 'raw'); 
			state.player_render =  true; 
		}
		if (isRefresh) {
			(editorBuffer['isRefresh']) && clearTimeout(editorBuffer['isRefresh']);
			editorBuffer['isRefresh'] = setTimeout(refreshEvents, 500);
		}
	}, 200);
}

// method to get xml from frame based compoenents
function getXml(forSave = 0) {
	try {
		let authFrame = document.getElementById("authoringFrame");
		if (authFrame && authFrame.getAttribute('data-authoring') == '1') {
			let frameNode = authFrame.contentWindow;
			state.activator = true;
			editorBuffer['iframe'] = setTimeout(function () {
				if(Items.UI.getXmlFunc) {
					state.xml = frameNode[Items.UI.getXmlFunc]();
				} else {
					state.xml = Items.UI.getXml(frameNode, state.xml, state.item);
				} 
				state.activator = false;
			}, 100);
		}
	} catch (e) { 
		console.log(e);
	}
	if (forSave != 1) {
		setTimeout(function () {
			state.xmlDialog = true;
		}, 100);
	}
}

// Update framebased and item xmls
function updateXml(e, moduleXMl = document.getElementById("xml_Dialog").value) {
	state.xmlDialog = false;
	var newXml = XMLToJSON(moduleXMl);
	if (!newXml) {
		newXml = { "smxml": { "_type": AH.parseHtml(moduleXMl).getAttribute('type') } };
	}
	if (moduleXMl != state.xml) {
		AH.set('save_item', true);
	}
	state.item = parseInt(newXml.smxml._type),
	state.xml = moduleXMl;
}

// avoid re-updating
function updateContent(id) {
	return new Promise((resolve, reject) => {
		try {
			setContent(id);
			var upConTimer = setTimeout(function () {
				clearTimeout(upConTimer);
				resolve(true);
			}, 400);
		} catch (error) {
			cosole.log({ error, func: '@3281' });
			reject(error);
		}
	})
}

// Solve algo varraibles
async function solveVariable() {
	AH.activate(2);
	await updateContent("stem");
	await updateContent("remediation");
	//@TOOD: @abhishek we should also evaluate all the answers
	updateChildXml(state.xml + " ");
	state.authXml = state.xml;
	setTimeout(function () {
		var data = {};
		data['question'] = document.getElementById("stem_show").innerHTML;
		data['special_module_xml'] = state.authXml;
		data['answers'] = state.ajaxData ? state.ajaxData.answers : "";
		data['explanation'] = state.remediation;
		data['algo_qxml'] = state.algo_qxml;
		AH.ajax({
			url: baseUrl + 'editor/index.php',
			cache: false,
			data: { ajax: "1", action: 'parse_algo', content_text: JSON.stringify(data) },
			type: 'post',
		}).then((response)=> {
			let res = JSON.parse(response);
			// used for get algo data in List Item module
			AH && AH.set('algo_var_data', res.algo_qxml);
			//@TOOD: @abhishek we got data from #stem but putting data in #stem_show also what about remdiateion and answers and xml
			document.getElementById("stem_show").innerHTML = res.question;
			document.getElementById("remediation_show").innerHTML = res.explanation;
			state.stopAuthoringUpdate = true;
			state.mcqAjaxData && (state.mcqAjaxData.answers = res.answers);
			state.xml = res.special_module_xml;
			state.previewXml = state.xml;
			state.stopAuthoringUpdate = false;
			state.stopPreviewUpdate = true;
			(typeof mathMLRender == "function") && mathMLRender("previewSection", true);
			//tempRemed = res.explanation;
			//state.xml = tempXml;
			AH.activate(0);
		});
	}, 200);
}

// Show analyzed algo varriable's data
function analyzeVariable() {
	AH.activate(2);
	AH.ajax({
		url: baseUrl + 'editor/index.php',
		cache: false,
		data: {
			ajax: "1",
			action: 'parse_algo',
			get_variables: 1,
			algo_qxml: state.algo_qxml
		}
	}).then((response) => {
		let res = JSON.parse(response);
		createVariableCallback.analyzeValues(res);
		AH.activate(0);
	})
}

// Handle algo change
function handleCheckbox() {
	//state.variable_button = state.variable_button ? false : true;
	//if (state.variable_button) {
		// show algo task pane
		createVariableCallback.showPane();
	//}
}

// show editor dialog for algo
function editAlgo() {
	createVariableCallback.showPane()
}

// Method for item side communication
function updateChildXml(childXml, action = "") {
	if (action == "mcqType") {
		//state.ajaxData = childXml.ajaxData;
		state.mcqAjaxData = JSON.parse(JSON.stringify(childXml.ajaxData));
	} else if (action == "deepUpdate") {
		updateXml("", childXml);
	} else {
		state.stopPreviewUpdate = false 
		state.xml = childXml;
		window.QXML = state.xml;
	}
}

//check saving of content
function saveAction(event, customAction, saveType) {
	var action = customAction ? customAction : event.target.value;
	AH.set('saveType', saveType);
	document.querySelectorAll(".save_buttons button").forEach((elm)=> elm.style.pointerEvents = 'none');
	switch (action) {
		case 'cancel':
			console.warn("cancel action");
			state.saveDialog = false;
			editorHeaderRef.callPendingAction();
			break;
		case 'save':
			console.warn("Save action");
			if (AH.get('save')) {
				if (from_myproject == 1 && state.guid.length == 5 && state.course_list) {
					publishSelected();
				} else {
					saveData('0');
				}
			} else {
				updateStage();
				AH.alert("Item is not saved.");
			}
			break;
		case 'save_as':
			modal = {
				header  : {
					body: "Save As",
					class: "editor_modal_title"
				},
				body    : {
					body: "Do you want to save current changes as new item?",
					class:"editor_modal_content",
				},
				footer  : {
					body: [{label:'Yes', onAction: saveData.bind(this, '1')}],
					class:"editor_modal_action"
				}
			};
			handleModal(modal);
			break;
		case 'reject':
			console.warn("Reject As action");
			changeStatusOnly(-1);
			break;
			//@TODO:? @abhishek what is saveAction@3612
		default: console.log({ Error: "Action not defined", action, func: "saveAction@3612" });
			break;

	}
}

// gather content and send to server for save
function saveData(is_new, coverageCourses = false, saveCoverage = false) {
	//jQuery("span[data-mce-bogus]").contents().unwrap();
	AH.unwrap("[data-mce-bogus='1']");
	changedKeys.map((type)=> {
		state[type] =  ucEditor.getContent(type, 'raw');
	})
	if (is_owner != 1 && is_viewer == 1) {
		state.message = JSL.viewer_error_msg_js;
		state.snackback = true;
		state.saveDialog = false;
		return false;
	}
	if (is_domain == 1 && state.domain.length != 5 && (state.viewConfig.isQuestion || getQueryString("is_flashcard") == 1)) {
		if (from_coverage == "" && is_new != 1 && in_frame == "1") {
			state.message = "Please select a domain.";
			state.snackback = true;
			state.domainToggle = true;
			state.saveDialog = false;
			return;
		}
	}
	let reject = editorConfig.checkBlank(state, Items, updateModuleState);
	if (reject) {
		return;
	}
	if (state.viewConfig.isQuestion && Items && Items.UI.checkBeforeSave) {
		let check = Items.UI.checkBeforeSave(state, updateModuleState);
		if (check) {
			AH.activate(0);
			return;
		}
		
	}
	if (is_new == "1" && from_coverage == "1" && !saveCoverage) {
		state.domainToggle = true;
		state.saveDialog = false;
		return;
	}
	let temp_content_guid = (is_new == '1') ? '' : state.guid;
	if ((is_new == 1 || temp_content_guid == "")  && !editor.course) {
		state.message = "Please select a course.";
		state.is_new = "1";
		state.snackback = true;
		state.domainToggle = true;
		state.saveDialog = false;
		return true;
	} else {
		state.is_new = "0";
	}
	if (is_new == 2) {
		state.is_new = "1";
	}
	if (!AH.isValid(state.courses)) {
		state.courses = editor.course;
	} 
	if (editor.course || temp_content_guid.length == 5 || state.viewConfig.typeAllowedSave) {
		AH.selectAll('#savingContent, #saveAs, #saveButton, #cancelButton, #publish_selected, #publishContent, #savePublish', 'hide');
		AH.toggleDom('#saveProcess', 'show');
		AH.toggleDom('.saveDropDown', 'hide');
		getXml(1);
		if ('03j6z,03j71,03j74,03j77'.split(',').includes(temp_content_guid)) { //Sample Data for Coverage
			editorConfig.setParentData(temp_content_guid, state.item);
			temp_content_guid = '';
		} 
		setTimeout(function () {
			let data = state.viewConfig.isQuestion ? saveTypeQ(temp_content_guid) : saveTypeOther(temp_content_guid);
			data['draft'] = ((from_myproject == 1 && temp_content_guid.length != 5) || (user_current_permission < 3 && from_myproject == 1) || is_new == 1) ? 1 : state.draft;
			data['status'] = 1;
			data['from_myproject'] = from_myproject;
			data['user_current_permission'] = user_current_permission;
			data['is_owner'] = is_owner;
			if (coverageCourses && coverageCourses.toString() != "[object Object]") {
				data['coverage_courses'] = coverageCourses;
				data['old_content_guid'] = state.guid;
			}
			if (getQueryString("from_temp_id")) {
				data['from_temp_id'] = getQueryString("from_temp_id");
			}
			if (getQueryString("from_myproject") == 1) {
				window.parent.content_info = { "p1": data['domain'], "p2": data['add_coverage'], "test_obj": data['test_obj'], "data": data };
			}

			data = removeBogus(data, 'filterData');
			window.parent.is_new_content = (temp_content_guid.length == 5) ? 0 : 1; //For in_editor
			
			if (is_new == 1) {
				AH.activate(2);
			}

			if (AH.get('stop')){
				console.warn("Saving is paused -");
				return;
			} 
			console.log('baseUrl', baseUrl);
			AH.ajax({
				url: baseUrl + 'editor/index.php', // point to server-side PHP script
				datatype: 'json',
				data: data,
				type: 'POST',
				longUrl: true,
			}).then((save_response)=> {
				AH.set('save_response', save_response);
				let isContinue = 0;
				localStorageData(data, 'remove');
				let json_response = save_response;
				AH.selectAll('#savingContent, #saveAs, #saveButton,#cancelButton, #savePublish', 'show');
				AH.toggleDom('#saveProcess', 'hide');
				handleModal(''); // to hide the modal
				if (state.viewConfig.showOtherType) {
					showOtherType(save_response);
					state.message = l.save_success;
					state.snackback = true;
				} else {
					save_response = JSON.parse(save_response);
					if (!save_response['error'] || save_response['error'].length == 0) {
						if (state.guid != '') {
							checkNewGuid(save_response['content_guid'], state.guid);
						}
						if (from_myproject == 1) {
							if (user_current_permission == 3 || is_owner == 1) {
								state.message = l.save_success;
							} else {
								state.message = l.save_success_owner;
							}
						} else {
							state.message = l.save_success;
						}
						AH.set('save_item', false);
						AH.set('current_guid', save_response['content_guid']);
						state.guid = save_response['content_guid']; 
						state.save_publish = false; 
						state.draft = save_response['draft'];
						window.parent.editor_guid = save_response['content_guid'];
						window.parent.edit_content = 1;
						if (state.is_new != 1) {
							if (window.in_full_preview == 1 && state.exam_objective_mapping_save != 1) {
								window.parent.saveFromEditor(json_response, window.parent.is_new_content);
								AH.toggleDom(document.querySelector('.backBtn').parentElement, 'hide');
							}
						}

						if (AH.isValid(state.exam_objective)) {
							AH.ajax({
								url: `${baseUrl}?func=assign_exam_objective&course_code=${editor.course}&content_guid=${save_response['content_guid']}&tag_guid=${state.exam_objective}&save=1&from_myproject=1`
							}).then((data)=> {
								if (data) {
									AH.activate(0);
									state.snackback = true;
								}
							});
						} else {
							isContinue = 1;
						}
						// if (getQueryString("refer_content") == 1) {
						// 	//Do not remove previous item id when creating a new item
						// 	let item_id = window.parent.document.querySelector("#asset, #refid, #no").value.trim();
						// 	item_id = (item_id != '') ? item_id + ',' + save_response['content_guid'] : item_id;
						// 	window.parent.document.querySelectorAll("#asset, #refid, #no").forEach((elm)=> elm.value = item_id);
						// 	window.parent.editorClose();
						// }

						if (getQueryString("from_temp_id")) {
							window.parent.from_temp_id = 1;
							window.parent.editorClose(1);
						}
						if (getQueryString("content_type") == 's' || getQueryString("content_type") == 'f') {
							window.parent.addButtonsOnAction && window.parent.addButtonsOnAction();
						}
					}
					else {
						state.message = save_response['error'].toString();
						if (state.message == "You Must Specify title for the content.") {
							modal = {
								header  : {
									body: "No Title",
									class: "editor_modal_title"
								},
								body    : {
									body: "Do you want to save without title ?",
									class:"editor_modal_content", 
									style:{height:'300'}
								},
								footer  : {
									body: [{'label': "Yes", onAction: setNoTitle}],
									class:"editor_modal_action"
								}
							};
							handleModal(modal);
						}
						if (window.in_full_preview == 1) {
							state.saveDialog = false;
							window.parent.showErrorMessage(state.message, window.frameElement);
							AH.toggleDom(document.querySelector('.backBtn').parentElement, 'hide');
						}
						state.snackback = true;
					}
				}
				updateStage();
				state.saveDialog = false;
				if (isContinue == 1) { state.snackback = true; AH.activate(0); }
				is_new == 1 ? AH.activate(0) : "";
				//self.editorModalUpdate(false);
			}).catch((error)=> {
				console.log(error);
				if (window.in_full_preview == 1) {
					state.saveDialog = false;
					window.parent.showErrorMessage("Failed to save", window.frameElement);
				}
				localStorageData(data, 'save');
				AH.toggleDom('#saveProcess', 'hide');
				state.message = "Data stored in Local Storage";
				state.snackback = true;
				state.saveDialog = false;
				AH.activate(0);
			});
		}, 200);
	} else {
		state.saveDialog = false;
		state.message = l.save_error;
		state.snackback = true;
		if (window.in_full_preview == 1) {
			window.parent.showErrorMessage(l.save_error, window.frameElement);
		}
	}
}

// Stage update for current guid
function updateStage() {
	if (AH.isValid(stageComment) && state.guid) {
		let _data = { 
				'user_guid_r' : user_guid, 
				'content_guid': state.guid, 
				'text':stageComment,  
				'annotation_type': 3, 
				'tags': -2
			}
		AH.ajax({
			url    : baseUrl + "educator/project/index.php?func=new_comment",
			method : "POST",
			data   : _data,
		}).then((data)=> {
		    //comment update
		});
	}
	switch (AH.get('saveType')) {
		case 'approve':
			// eslint-disable-next-line no-case-declarations
			let stageConfig = editorConfig.status();
			if (stageConfig[3].stage < AH.get('stageLimit') ) {
				changeStatusOnly(stageConfig[3].stage, true);
			} else {
				console.warn("No Need to update status here.");
				editorHeaderRef.callPendingAction();
			}
		break;
		case 'rework': 
			if (AH.get('stage')) {
				changeStatusOnly(-1);
			} 
		break;
		case 'skip': 
			console.warn("Skipped stage update by user.");
			editorHeaderRef.callPendingAction();
		break;
	}
	state.saveDialog = false;
}

// Status update for current guid
function changeStatusOnly(newStatus = false, isDraft) {
	AH.selectAll('.save_buttons, #savingContent', 'hide');
	AH.toggleDom(document.getElementById('saveProcess'), 'hide');
	let status = 2;
	status = (user_current_permission > 1) ? 3 : 2;
	status = (newStatus.toString() != "[object Object]") ? newStatus : status;
	AH.ajax({
		url: baseUrl + 'editor/index.php',
		cache: false,
		data: {
			ajax: "1",
			content_guid: state.guid,
			func: 'update_status_only',
			action: 'update_status_only',
			status: status,
			newStage: newStatus,
			user_current_permission: user_current_permission,
			is_owner: is_owner,
			isDraft: isDraft ? 1 : 0,
		},
	}).then((response)=> {
		AH.toggleDom(document.getElementById('saveProcess'), 'hide');
		AH.selectAll('.save_buttons, #savingContent', 'show');
		state.message = "Status has been changed successfully";
		try {
			response = JSON.parse(response);
			if (response.stage && AH.get('stage') != response.stage) {
				AH.set('stage', response.stage);
			} else if (response.content && response.content[state.guid] == "Content status chagned. Draft") {
				AH.set('stage', -1);
			}
		} catch(error) {
			console.log(response);
		}
		state.snackback = true;
		state.saveDialog = false;
		editorHeaderRef.callPendingAction();
	});
}

// check whether not required title
function setNoTitle() {
	AH.selectAll("#title,#title_show", 'html', "<notitle></notitle>");
	setContent('title');
	state.noTitle = false;
	setTimeout(function () {
		AH.trigger("#save_xml", "click");
		AH.trigger("#saveButton", "click");
		//self.editorModalUpdate(false);
	}, 200);
}

// Future use and it store data if net is lost
function localStorageData(data, type) {
	let localdata = JSON.parse(localStorage.getItem('storedata'));
	let counter = 1;
	let userGuid = window.user_guid;
	let flag = 0;
	if (type == 'save') {
		let d = new Date();
		data['datetime'] = d.toString().replace(/GMT.*/g, "");
		if (localdata == null) {
			localdata = {};
			localdata[userGuid] = {};
		}
		let tempvar2 = Object.assign({}, data);
		tempvar2['datetime'] = '';
		for (var i in localdata[userGuid]) {
			let tempvar1 = Object.assign({}, localdata[userGuid][i]);
			tempvar1['datetime'] = '';

			if (JSON.stringify(tempvar2) == JSON.stringify(tempvar1)) {
				flag = 1;
				break;
			}
		}

		if (data.content_guid == "") {
			for (let i in localdata[userGuid]) {
				if (i.length != 5) {
					counter++;
				}
			}
			if (flag != 1) {
				localdata[userGuid] && (localdata[userGuid]["n" + counter] = data);
				localStorage.setItem('storedata', JSON.stringify(localdata));
			} else {
				console.warn("Data Duplication in Localstorage");
			}
		} else {
			localdata[userGuid][data.content_guid] = data;
			localStorage.setItem('storedata', JSON.stringify(localdata));
		}
	} else if (type == 'remove') {
		if (AH.isValid(localdata) && AH.isValid(userGuid) && AH.isValid(localdata[userGuid])) {
			delete localdata[userGuid][data.content_guid];
			localStorage.setItem('storedata', JSON.stringify(localdata));
		}
	}
}

// check removalable eneity before save
function removeBogus(data, action) {
	if (AH.isValid(data)) {
		if (action == "filterData") {
			data['question'] = editorConfig.replaceUnwantedEntity(data['question'], "revert");
			data['explanation'] = editorConfig.replaceUnwantedEntity(data['explanation'], "revert");
			data['content'] = editorConfig.replaceUnwantedEntity(data['content'], 'revert');
		} else {
			data = data.replace(/<span data-mce-bogus[^>]*>/g, '');
			data = data.replace(/<span anscounter[^>]*>(.*?)<\/span>/g, (p1, p2) => {
				return p2;
			});
			//content = content.replace(/<\/?g[^>]*>/g, ""); // remove gramerly
		}
	}
	return data;
}

// Filter save data before saving
function filterContent() {
	let filterData = {};
	filterData['question'] = replaceUnwantedTags(seqTag(state.stem), "stem");
	filterData['explanation'] = replaceUnwantedTags(seqTag(state.remediation, "remed"), "remediation");
	filterData['title'] = seqTag(state.title);
	filterData['is_new'] = state.is_new;
	filterData['course_code'] = state.is_new ? state.courses : editor.course;
	filterData['answerArray'] = [{
		answer: true,
		id: '01',
		is_correct: '1'
	}];

	return filterData;
}

// Check qtype save data
function saveTypeQ(content_guid) {
	var response = filterContent();
	//@todo: @abhishek we already hae funciton removeBogus to remove this <br data-mce-bogus="1">
	if (state.testObj) {
		response['test_obj'] = (state.testObj) ? state.testObj : null;
		try {
			coverage_data = JSON.parse(coverage_data);
			response['chapter_name'] = coverage_data[state.domain]['snippet'];
		} catch (e) { 
			console.log(e); 
		}
	}
	if (Items.UI.isManualGrade && Items.UI.isManualGrade(state.xml)) {
		response['manual_grade'] = '0';
	}
	var data = {
		action: 'save',
		react_content: 'react',
		correct_answers: '1',
		total_answers: '1',
		answers: response['answerArray'],
		is_new: response['is_new'],
		title: response['title'],
		course_code: response['course_code'],
		domain: (state.domain.length == 5) ? state.domain : null,
		question: response['question'],
		explanation: response['explanation'],
		content_type: state.content_type,
		content_subtype: state.item,
		content_guid: (response['is_new'] == 1) ? "" : content_guid,
		content_icon: (state.content_icon) ? state.content_icon : 0,
		add_coverage: (state.coverage_guid.length == 5 && add_coverage) ? state.coverage_guid : null,
		test_obj: response['test_obj'],
		chapter_name: response['chapter_name'],
		algo_qxml: (state.variable_button) ? state.algo_qxml : "",
	};
	if (state.caseid_val || state.caseid_val == '') {
		data["case_id"] = state.caseid_val;
	}
	//@todo: @abhishek why we need this?: done,I moved into item package
	if (Items.UI.checkDataOnSave) {
		data = Items.UI.checkDataOnSave(data, state.item, state, updateModuleState);
	}
	if (!Items.UI.donNotSendXMl) {
		data['special_module_xml'] = state.xml;
	}
	(response['manual_grade'] == '0' || response['manual_grade'] == '1') ? data.manual_grade = response['manual_grade'] : "";
	return data;
}

// check content type save data
function saveTypeOther(content_guid) {
	var response = {};
	response['content'] = replaceUnwantedTags(seqTag(state.content), "content");
	response['title'] = seqTag(state.title);
	response['is_new'] = state.is_new;
	//@TODO:? @abhishek why there is two way of setting coruse code
	response['course_code'] = (response['is_new']) ? state.courses : editor.course;
	//@TODO:? @abhishek are we keeping complete coverage here: It is guid of coverage
	if (state.viewConfig.loadWebPages) {
		return state.webPageData;
	} 
	let data = {
		action: 'save',
		react_content: 'react',
		content_type: state.content_type,
		content_subtype: state.item,
		content_icon: 0,
		course_code: response['course_code'],
		title: getEditable(response['title']),
		content: response['content'],
		content_guid: (response['is_new'] == 1) ? "" : content_guid,
		author_area: author_area
	};
	if (state.viewConfig.save_content_text) {
		data['content_text'] =  state.ajaxData.content_text;
	} else if (state.viewConfig.save_vtt_info) {
		let vtt = getEditable(state.vtt);
		vtt = (vtt) ? vtt.replace(/<br>|<br\/>|<br \/>/gim, "\n").replace(/<span>|<\/span>/gim, '') : "";
		data['vtt'] = (vtt) ? vtt.replace(/ \n|\n |\n/g, "\n") : "";
		data['info'] = getEditable(state.info);
	} else {
		data['author_area'] = author_area;
		if (state.coverage_guid.length == 5 && add_coverage) {
			data.add_coverage = state.coverage_guid
		}
	}
	if (state.caseid_val || state.caseid_val == '') {
		data["case_id"] = state.caseid_val;
	}
	return data;
}

// mange domain objective
function selectedObjective(guid, examObjecitveChange = false) {
	if (guid != false) {
		state.exam_objective = guid;
	} else {
		//@pradeep: when guid not found. 
		// ("not_assigned" replaced by "undefined")
		// becuase on pe-gold3/index.php tag_guid chekcing undefined only.
		examObjecitveChange = AH.get('exma_obj_changed') ? true : false;
		state.exam_objective = (examObjecitveChange ? "deleted" : "undefined");
	}
}

// manage domain state
function saveDomain(is_new) {
	if (is_new == 1) {
		saveData("1", false, true);
	} else if (is_new == 2) {
		saveData("2")
	} else {
		saveData("0")
	}
}

function onDomainSelect(domainID) {
	if (domainID && domainID.match(/[0-9]/)) {
		state.domain = domainID;
	}
}

// manage exam objective state
function exam_objective_mapping_state() {
	state.exam_objective_mapping_save = 0;
	toggleDomain();
}

// show domain dialog
function toggleDomain(flag) {
	state.domainToggle = flag;
}

function updateAlignMatch(action, type) {
	if (action == 'csv') {
		state.isCSV = type;
	}
}

// show review dialog for items only
function toggleRemediation(event) {
	if (state.viewConfig.isFullMode) {
		externalToggle();
		return;
	}
	state.remediationToggle = !state.remediationToggle;
	if (state.remediationToggle == true) {
		renderPlayer();
	} 
}

// handle switch tab for shortcuts
function switchTabs() {
	if (preview_edit != 1) {
		if (state.editorView == "authoring") {
			if (state.viewConfig.isFullMode) {
				AH.trigger('[href="fullMode_custom_columnize"]','click');
			} else {
				AH.getBS('[href="#custom_columnize"]', 'Tab').show();
			}
			let currentRefreshFunc = AH.get(state.content_type+"_refresh");
			if (currentRefreshFunc) {
				currentRefreshFunc();
			}
			state.editorView = 'preview';
		} else {
			if (state.viewConfig.isFullMode) {
				AH.trigger('[href="#authoringDiv"]', 'click');
			} else {
				AH.getBS('[href="#authoringDiv"]', 'Tab').show();
			}
			state.remediationToggle = false;
			state.editorView = 'authoring';
		}
	}
}
//@Prabhat: If the solve variable option clicked and authoring and preview tab switching then need to take the auth and preview xml.
$: if (state.editorView == 'preview' && state.previewXml) { 
	state.xml = state.previewXml;
} else if (state.authXml) {
	state.xml = state.authXml;
}

const insertBlockPanel = (idStr) => {
	const eleList = AH.find(idStr,'[data-section^="sec_button"]', 'all');
	if(eleList?.length > 0 ){
		eleList.forEach(ele => AH.insert(ele, editorConfig.controls(ele.getAttribute('sub_type')), 'beforebegin'));
	}
};
afterUpdate(() => {
	AH.selectAll(".controls_button", 'remove', {action: 'remove'});
	insertBlockPanel("#stem");
	insertBlockPanel("#remediation");
	insertBlockPanel("#content");
});
</script>
<main role="main" tabindex="0">
	<EditorHeader
		bind:this={editorHeaderRef}
		bind:editorState={state}
		updateEditorModule={updateModuleState}
		handleModal={handleModal}
		toolMenu={editorConfig.createToolMenu(state, l)}
		solveVariable={solveVariable}
		analyzeVariable={analyzeVariable}
		handleCheckbox={handleCheckbox}
		editAlgo={editAlgo}
		itemHelper={Items}
		toggleRemediation={toggleRemediation}
		l={l}
	/>
    <div 
        id="editorViewPane" 
        class="col-lg-11 mx-auto" 
        key="1" 
		tabindex="0"
	>
        <ul class="nav nav-tabs editorTabs" id="edi_tabs">
            <li><a data-bs-toggle="tab" href="#authoringDiv" class="active">{"Authoring"}</a></li>
            <li><a data-bs-toggle="tab" href={state.viewConfig.isFullMode ? "#fullMode_custom_columnize" : "#custom_columnize"}>{"Preview"}</a></li>
        </ul>
        <div class="tab-content editorTabContent">
            <div
                id="authoringDiv"
                class="tab-pane fade in active"
                style="
                    margin-bottom: 5px;
                    width: {(state.verticalView == true) ? '100' : '50'}%;
                    float: left;
                    position: {(state.verticalView == true) ? "relative" : "absolute"};
                    left: 0px;
                    top: 0px;
                "
            >
                <div id="overlayAuthoring" style="position: absolute; width: 0;"></div>
                <div id="authoringSection" class="ignoreMath">
                    <div id="columnize">
                        {#if state.viewConfig.title}
                            {@html addPlaceHolder(state.viewConfig.title.label)}
							{#if state.editorView == 'authoring'}
								<div class="editor_placeholder full_mode_hide">{state.viewConfig.title.placeHolder}</div>
                            {/if}
							<div
                                class={editorClass()}
                                contentEditable={true}
                                id="title"
                                data-text="Title"
                                data-placeholder={state.viewConfig.title.placeHolder}
                                style="borderBottom: 2px solid #e7e7e7; margin: 0 0 5px 0"
                                on:keyup={()=> setContent('title')}
                            ></div>
                        {/if}
                        {#if state.viewConfig.stem}
                            {@html addPlaceHolder(state.viewConfig.stem.label)}
							{#if state.editorView == 'authoring'}						
								<div class="editor_placeholder full_mode_hide">{state.viewConfig.stem.placeHolder}</div>
                            {/if}
							<div
								class={editorClass()}
                                id="stem"
                                readOnly="readonly"
                                data-text={"Stem"}
                                style="
                                    border-bottom: 1px solid #e7e7e7; 
                                    margin: 5px 0 5px 0;
                                    padding-top: 10px;
                                    margin-top: -18px;
                                "
                                on:Keyup={()=> setContent('stem')}
                            ></div>
                            <br />
						{/if}
						{#if state.viewConfig.content}
							{@html addPlaceHolder(state.viewConfig.content.label)}
							{#if state.editorView == 'authoring'}
								<div class="editor_placeholder full_mode_hide">{state.viewConfig.content.placeHolder}</div>
							{/if}
							<div
								class="tinymce-editor auth-editor"
								id="content"
								readOnly="readonly"
								data-text={"Content"}
								on:keyup={()=> setContent('content')}
								style="
									border-bottom: 1px solid #e7e7e7;
									margin: 5px 0 5px 0;
									white-space: pre-line;
									clear: both;
									min-height: 125px;
									padding-top: 10px;
									margin-top: -18px;
								"
							>
							</div>
						{/if}
						{#if state.viewConfig.itemModule}
							<div id="authoringLoadComponent" style = {state.viewConfig.itemModule.style}>
								<svelte:component 
									this={Items.auth} 
									xml = {state.xml}
									inEditor={1}
									subtype ={state.item}
									itemIcons = {editorConfig.getItemDetails()['q']}
									isReview = {state.remediationToggle}
									getChildXml={updateChildXml}
									ucEditor={ucEditor}
									bind:editorState={state}
									getLabel={addPlaceHolder}
									didMount={didMount}
									showAns={showAns}
									smValidate= {smValidate}
									l={l}
									user={_user}
									setInlineEditor={setInlineEditor}
									toggleMode={state.toggleMode}
									updateCSV={updateAlignMatch}
									changed_advance_xml={advanceXml}
								/>
							</div>
						{/if}
						{#if state.viewConfig.remediation}
							{@html addPlaceHolder(state.viewConfig.remediation.label, "br")}
							{#if state.editorView == 'authoring'}
								<div class="editor_placeholder full_mode_hide">{state.viewConfig.remediation.placeHolder}</div>
							{/if}
							<div
								class={editorClass()}
								id="remediation"
								readOnly="readonly"
								data-text="Remediation"
								on:keyup={()=> setContent('remediation')}
								style="
									border-bottom: 1px solid #e7e7e7;
									margin: 5px 0 5px 0;
									white-space: pre-line;
									clear: both;
									padding-top: 10px;
									margin-top: -18px;
								"
							>
							</div>
						{/if}
                    </div>
                </div>
                <br/>
                <br/>
            </div>
            <div 
                id="custom_columnize" 
                class="tab-pane fade" 
                is_editor = {1}
            >
                <div
                    id="preview"
                    style="
                        width: {(state.verticalView == true) ? '100%' : '50%'};
                        float: right;
                        position: {(state.verticalView == true) ? 'relative' : 'absolute'};
                        right: 0px;
                        top: 0px;
                    "
                >
                    <div id="ebook_container">
                        <div id="columnize">
                            <div 
                                id="previewSection" 
                                class="px-2 base" 
                                annotation_id={state.guid}
                                data-parent-guid={state.guid}
                                style="overflow-X: auto; padding-bottom: 15px;"
                            >
                                <div id="todo_preview" style="display: none;">
                                    <div id="todo_table"></div>
                                    <div id="todo_obj"></div>
								</div>
								<div id="layoutMode">
									{#if state.viewConfig.title}
										<div 
											id="title_show" 
											style="white-space: pre-line; word-wrap: break-word; font-weight: bold; font-size: 17px"
										></div>
									{/if}
									{#if state.viewConfig.stem}
										<div
											id="stem_show"
											class="base"
											style="padding: 10px 0 10px 0; white-space: pre-line; word-wrap: break-word; font-size: 14px"
										></div>
									{/if}
									{#if state.viewConfig.content}
										<div 
											id="content_show" 
											style="padding: 10px 0 10px 0; white-space: pre-wrap word-wrap: break-word; font-size: 14px"
										></div>
									{/if}
									{#if state.viewConfig.itemModule}
										<div id="xml_show" class="overflow" role="application" tabindex="0" aria-label="application. {l['itemtype_' + subtype]}">
											<svelte:component 
												this={Items.preview} 
												editorState={state}
												xml = {state.xml}
												setInlineEditor={setInlineEditor}
												isReview = {state.remediationToggle}
												showAns={showAns}
												smValidate = {smValidate}
												ucEditor={ucEditor}
												showAnswer={showAns.bind(this)}
												toggleMode={true}
												user={_user}
												didMount={()=> console.warn("Did mounted")}
											/>
										</div>
									{/if}
							
									{#if state.viewConfig.remediation}
										<div 
											id="remediation_show" 
											class="mt-4" 
											style="word-wrap: break-word; font-size: 14px"
										></div>
									{/if}
								</div>
                            </div>
                            <br />
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
		
	</div>
</main>
{#if state.playerState}
	<Player
		bind:editorState={state}
		playerBookmark={state.playerBookmark}
		visible={state.playerPopup}
		value={state.playerArr}
		content_type={state.content_type}
		content_subtype={state.item}
		renderPlayerFunc={renderPlayer}
	/>
{/if}
<EditorModal 
	bind:modal={modal}
	bind:visible={modalVisible}
	updateEditorModule={updateModuleState}	
/>
<Dialog bind:visible={state.saveDialog} width="575" style="background-color:#fff; border-radius: 5px;">
	<center id="saveProcess" style="display: none; width: 100%; height: 120px; padding-top: 40px;">
		<div>{l.save_process}</div>
		<Loader size={50} />
	</center>
	<div id="savingContent">
		{(state.open_doc) ? l.open_doc : ""} 
		<h4>{"Confirmation"}</h4>
		{state.netMsg}
	</div>
	<div id="publishContent" class="h">
		{#if state.course_list}
			<div>
				<span class="text-danger">This content have published in these courses, Select to replace course content</span>
				<table class="table table-bordered table-striped">
					<thead>
						<tr>
							<th class="width33"><input type="checkbox" name="publish_chbox_all" id="publish_chbox_all" /></th>
							<th>Course Name</th>
						</tr>
					</thead>
					<tbody class="course_list_action">
						{#each state.course_list as data}
							<tr course_code={data.course_code} key={data.course_code}>
								<td><input type="checkbox" name="publish_chbox" id="publish_chbox" /></td>
								<td>[{data.crn}]-{data.course_name}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
	<div class="status_box" style="padding-bottom: 15px;">
		<div class="stage_comment_box">
			<textarea 
				name="stage_comment" 
				rows="3" 
				class="form-controls" 
				id="stage_comment" 
				placeholder="Enter comments here." 
				bind:value={stageComment}
				style="width: 100%; resize: none"></textarea>
		</div>
		<Checkbox 
			id="saveCheckbox"
			bind:checked={saveCheckbox}
			value="Save any unsaved changes"
			color="primary"
			name="saveCheckbox"
			ripple={false}
			style="background-color: none;margin-left:-11px;"
			title={"Check to save changes"}
		>
			<span>Save any unsaved changes</span>
		</Checkbox>
		<br/>
		<div class="contentStage" style="margin-bottom: -25px">
			<b>{"Current Stage: "}<span class={AH.get('stage') > 2 ? "text-success" : "text-danger"}>{editorConfig.stage(AH.get('stage'))}</span></b>
		</div>	
	</div>
	<div class="save_buttons svelteFooter" key={"actionSaveEditor"} slot="footer">
		{#each editorConfig.status() as item }
			{#if item.permission}
				<Button
					id={item.type}
					style="margin-right: 10px;"
					title={item.tooltip}
					color={item.func  ? "primary" : "#ccc"}
					unelevated={true}
            		outlined={true}
					on:click={(event)=> item.func ? saveAction(event, 'save', item.type) : saveAction(event, "cancel", item.type)}
				>
					{item.label}
				</Button>
			{/if}
		{/each}	
	</div>
</Dialog>
<Dialog bind:visible={state.activator} style="background-color:#fff; border-radius: 5px;">
	<div class='editor_modal_content overflow-hidden'>
		<Loader size={50} msg={"Please wait editor is working."}/>
	</div>
</Dialog>
<!-- SHow XML Dialog -->
<Dialog width="700" bind:visible={state.xmlDialog} style="background-color:#fff; border-radius: 5px;">
	<h4 class="mt-0 font21">
		<div class="d-flex justify-content-between">
			<div>{l.xml}</div>
			<button type="button" class="icomoon-incorrect-sm xml_smbtn" style="float: right; cursor: pointer;" on:click={() => state.xmlDialog = false}></button>
		</div>
	</h4>
	<div>
		<textarea
			class="font15"
			id="xml_Dialog"
			style="
				width: 100%;
				margin: 3px 0;
				min-height: {window.in_frame == 1 ? '200' : '340'}px;
				border: 0px;
				resize: none;
				outline: none;
				box-shadow: none;
				background-color: transparent;
			"
		>{formatXmlRef(state.xml, state.item)}</textarea>
	</div>
	<div slot="footer" class="svelteFooter">
		<Button
			unelevated={true}
            outlined={true}
			on:click={() => state.xmlDialog = false}
			color="#ccc"
		>
			{l.cancel}
		</Button>
		<Button
			id="xmlDone"
			unelevated={true}
            outlined={true}
			on:click={updateXml}
			color="primary"
		>
			{l.done}
		</Button>
	</div>
</Dialog>
<Snackbar bind:visible={state.snackback} bg="#333" bottom={true}  timeout={10} style="position:fixed; bottom:50px">
	{#if state.message}
		{state.message}
	{:else} 
		Some Error occured during this process.
	{/if}
	<span slot="action">
		<Button color="#ff0" class="fs-3 pb-1" on:click={() => (state.snackback = false)}>&times;</Button>
	</span>
</Snackbar>
{#if (window.is_domain && state.viewConfig.domain)}
	<Domain 
		bind:editorState={state}
		selectedObjective={selectedObjective} 
		setCourse={(course)=> state.courses = course}
		saveDomain={saveDomain} 
		domainToggle={state.domainToggle} 
		isNew={state.is_new} 
		closeDomainDialog={exam_objective_mapping_state} 
		selectedDomain={onDomainSelect} 
		selectedCoverage={(guid) => state.coverage_guid = guid} 
		selectedTest={(testObj) => state.testObj = testObj} 
		guid={state.guid} 
		smdata={state} 
		caseid_val={state.caseid_val}
		updateModule = {updateModuleState}
	/> 
{/if}
{#if (window.content_for_newEditor)}
	<VersionControl 
		versionToggle={state.versionToggle} 
		closeVersionDialog={versionControl} 
		guid={state.guid}
		l={l}
	/>
{/if}
{#if state.viewConfig.webPageList} 
	<WebpageList 
		bind:editorState={state}
		domainToggle={state.domainToggle} 
		selectedDomain={onDomainSelect}
	/> 

{/if}
<CreateVariable
	handleAlgoState={handleCheckbox}
	algo_qxml={state.algo_qxml}
	labelview={"none"}
	view={state.variable_button}
	single_variables={state.single_variables}
	l={l}
	bind:editorState={state}
	bind:this={createVariableCallback}
/>
{#if state.guid && window.from_myproject == 1}
	<CommentModal 
		bind:this={_commentModal}
		user_guid={_user.user_guid}
		user={_user}
		questionGuid = {state.guid}
		l= {l}
	/>
{/if}
<Media 
	bind:this={_media}
	default_media_configuration = {{
		file_type: 'image/*',
		file_ext: 'png,gif,jpg,jpeg,svg', 
		max_file_allowed: 1,
		set_name: true, 
		is_editor: 1,
		image_annotation: 1,
	}}
/>

{#if state?.AnalyzeEbookMenu}
<AnalyzeEbook 
	analyzeEbookMenu = {state.AnalyzeEbookMenu} 
	oldStemData={state.oldStemData} 
	controls={editorConfig.controls} 
	addItemButton={editorConfig.add_item_button}
	changeAnalyzeMenuProp = {() => state.AnalyzeEbookMenu = false}	
/>
{/if}

<svelte:window on:keyup={handleKeyup} on:keydown={handleKeydown} />
<InteractiveItem bind:this={_interactiveItem}/>
<EditorPopoverModal />
<PeGlossaryContentLink />
