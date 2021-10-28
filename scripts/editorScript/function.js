/* eslint-disable no-control-regex */
/* eslint-disable no-regex-spaces */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
function addScript(jsString) {
	document.body.append('<script class="reactScript">' + jsString + "</script>");
}

//@TODO:? @abhishek we have similar function in prepengine footer too, why we can centalize funcion and define and use form one single file
function showUcExpStep(currStep) {
	let that = currStep.closest(".uc_step_explanation");
	AI.select(AI.find(that, '.uc_step', 'hidden')[0], 'show', 'block');
	let len = AI.find(that, '.uc_step', 'hidden').length;
	if (len === 0) {
		AI.select(currStep, 'hide');
	}
}

function activateMathMl(content, isALgo, mathMLRender) { 
	if (!isALgo && typeof mathMLRender == "function" && content.match(/\\begin/gm)) {
		mathMLRender("previewSection", true);
	}
}

function loadBackup(state, updateModule, setBasicData) {
    let currentGuid = document.querySelector(window.frameElement).getAttribute("guid");
    window.parent.contentDB.get('overallContent').then(function (doc) {
        if (doc.content) {
            for (let i in doc.content) {
                if (doc.content[i]['guid'] == currentGuid) {
                    setBasicData(formatData(doc.content[i].title), formatData(doc.content[i].stem), formatData(doc.content[i].remediation));
                    updateModule('guid', doc.content[i].guid);
                    updateModule('content_type', doc.content[i].content_type);
                    setTimeout(function () {
                        updateModule('item', "Blank");
                    }, 1000);
                    setTimeout(function () {
                        updateModule('item', parseInt(doc.content[i].item));
                        updateModule('xml', doc.content[i].xml + " ");
                    }, 1100);
                }
            }
        }
    });
}

function replaceUnwantedTags(content, type) {
	try {
		// eslint-disable-next-line no-regex-spaces
		content = content.replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ').replace(/   /g, ' &#160; ').replace(/  /g, '&#160; ');
		// content = content.replace(/&#160;/g, ' ').replace(/  /g, '&#160; ');
		content = content.replace(/\$/g, '&#36;');
		// @uc-abk Displaying same preview as eBook.
		content = content.replace(/<br><table/g, '<table');  // <br><table		
		content = content.replace(/<li><br>/g, '<li>');		// <li>\n
		content = content.replace(/<br><\/li>/g, '</li>');	// \n</li>
		content = content.replace(/<\/li><br>/g, '</li>');	// </li>\n
		content = content.replace(/<\/ul><br>/g, '</ul>');	// </ul>\n
		content = content.replace(/<br><\/ul>/g, '</ul>');	// \n</ul>
		content = content.replace(/<\/ol><br>/g, '</ol>');	// </ol>\n
		content = content.replace(/<br><\/ol>/g, '</ol>');	// \n</ol>
		content = content.replace(/<br><li>/g, '<li>');		// \n<li>
		content = content.replace(/<grammarly-btn([\s\S]*?)<\/grammarly-btn>/g, '');
		content = content.replace(/<grammarly([\s\S]*?)<\/grammarly([\s\S]*?)>/g, '');
		content = content.replace(/<main.*?data-remove="true"[\s\S]*?<\/main>/g, '');
		content = content.replace(/class\=(\"|\')ebook_item_text.*?(\"|\')/g, "class='ebook_item_text'");
		content = content.replace(/(\'|\")ebook_item_text(\'|\").*?\>/g, "'ebook_item_text'>");
		content = content.replace(/(\'|\")ebook_item_text inline(\'|\").*?\>/g, "'ebook_item_text inline'>");
		content = content.replace(/(\'|\")inline ebook_item_text(\'|\").*?\>/g, "'ebook_item_text inline'>");
		content = content.replace(/mce-item-table/g, "");
		content = content.replace(/\<input type="hidden".*?\>|\<input type="hidden".*?\/>/gm, "");
		if (type == "remediation") {
			content = content.replace(/inline_new/, 'inline');
			content = content.replace(/sec_button inline|sec_button/, 'sec_button inline').replace(/ebook_item_text inline|ebook_item_text/, 'ebook_item_text inline');
		}
		content.replace(/&nbsp;/g, ' ').replace(/  /g, ' &nbsp;').replace(/> </g, '>&nbsp;<');
	} catch (e) {
		console.log("It seems incorrect active area / cursor position");
	}
	return content;
}

function replacePreTag(content, config) {
	if (content && content.match(/\<pre.*?class=[\'\"](.*?)[\'\"].*?\>[\s\S]*?\<\/pre\>/gi)) {
		return(content.replace(/\<pre.*?class=[\'\"](.*?)[\'\"].*?\>[\s\S]*?\<\/pre\>/gi, function (value, className) {
			console.warn("Replacing Pre Tags");
			let replacedValue = value;
			config.map((item) => {
				replacedValue = replacedValue.replace(item.tag, item.customTag);
			});
			return convertUcSyntaxSpaceInEntity(replacedValue);
		}));
	} else {
		console.log("Pre tag Not found");
		return(content);
	}
}

// @TODO:? @abhishek we have similar function in prepengine footer too, why we can centalize funcion and define and use form one single file
function showHints(t) {
	let that = t.closest(".uc_answer_hint");
	AI.select(AI.find(that, "li", 'hidden')[0], 'show', 'block');
	let list_length = AI.find(that, "li", 'hidden').length;
	if (list_length === 0) {
		list_length = "No";
		AI.find(that, ".hint_show", {action: 'attr', actionData: {disabled: true} });
	}
	AI.find(that, ".li_count", {action: 'html', actionData: list_length});
}

//@TODO: @abhishek what is the diff between addscript and requireDcript funciton. also this function is duplicate and exist in other file too
function requireScript(path, callback) {
	const script = document.createElement("script");
	script.src = path;
	script.setAttribute("class", "reactScript");
	script.async = true;
	script.onload = callback;
	document.body.appendChild(script);
}

function refreshPopover() {
	// @uc-rku for display popover in authoring area for testing only
		AI.getBS('.image_popover[data-bs-toggle="popover"]','Popover', {
			html: true,
			content: function () {
				return document.getElementById('popover-content').innerHTML;
			}
		});
}

function toggleSave(save) {
	if (!AI.get('save_item')) {
		AI.set('save_item', (save == 1) ? true : false);
	}
}

function updateItemInfData(item) {
	if (item) {
		if (item.getAttribute('icon')) {
			AI.removeClass(".item_icon_list .active", 'active');
			AI.addClass(item, "active");
		} else if (item.id == "cong_level") {
			AI.set("cong_level", item.value);
		} else {
			item.setAttribute('contentEditable', true);
		}
		AI.select(".inf_update_btn").style.display = "inline-block";
	} else {
		AI.activate(2);
		let queryData = { 
			ajax: "1", 
			action: 'update_editor_item_inf', 
			content_guid: AI.get('current_guid'),
			ref_id: AI.select(".item_ref_id").textContent,
			isDraft: AI.get('draft'),
			content_icon:  AI.get("current_item_icon"),
			cong_level: AI.get("cong_level"),
			course: editor.course,
			anno_id: AI.select("#cong_level").getAttribute('annoid')
		};
		AI.ajax({
			url: baseUrl + 'editor/index.php',
			data: queryData
		}).then((response)=> {
				AI.activate(0);
				console.log(response);
				if (response == 1) {
					AI.showmsg("Data updated successfully.");
				} else {
					AI.showmsg("Updation failed.");
				}
			});
	}
}

function openDropDown(element, target, onChange) {
	if (onChange) {
		AI.select("#selected_item_icon").setAttribute('class', 'float-left s4 mr middle ' + element.getAttribute('data-filter-icon'));
		AI.select("#selected_item_title").textContent = element.getAttribute('data-filter-title');
		AI.set("current_item_icon", element.getAttribute('data-filter-value'));
		AI.selectAll(".inf_update_btn", 'show');
	} 
	AI.select(target);	
}

function checkNewGuid(newGuid, oldGuid) {
	if (newGuid != "" && newGuid != oldGuid) {
		let editorUrl = AI.url();
		editorUrl.set('content_guid', newGuid);
		if (editorUrl.get('router_guid')) {
			editorUrl.set('router_guid', editorUrl.get('router_guid').replace('#','') + "," + newGuid);
		} else {
			editorUrl.set('router_guid', oldGuid + "," + newGuid);
		}
		window.location = decodeURIComponent(editorUrl.toString());
	}
}

function updateDatabase(currentGuid, state) {
	if (window.parent) {
		window.parent.contentDB.get('overallContent').then(function (doc) {
			if (doc.content) {
				for (let i in doc.content) {
					if (doc.content[i]['guid'] == currentGuid) {
						doc.content[i] = AI.extend(doc.content[i], state);
						doc.content[i].guid = currentGuid;
					}
				}
				return window.parent.contentDB.put(doc).then(function (e) {
				}).catch(function (err) {
					console.log("Error found in update Database",err);
					updateDatabase(currentGuid);
				});
			}
		});
	}
}

function addUpdateDataBase() {
	AI.listen(window.parent.document, 'click', '#backupIt', function () { 
		//For single page preview
		timer['updateDataBaseTimer'] = setTimeout(function () {
			let currentGuid = AI.select(window.frameElement).getAttribute("guid");
			updateDatabase(currentGuid);
			clearTimeout(timer['updateDataBaseTimer']);
		}, 1000);
	});
}

//@TODO: @abhishek why we are only checking it for ul,ol, should we make it common function, do we have siimlar code for other area
function getParent(tag) {
	tag = typeof tag == "object" ? tag : document.querySelector(tag);
	let tag_parent = "";
	if (tag && tag.closest("ul, ol")) {
		tag_parent = tag.closest("ul, ol");
	}
	return tag_parent;
}

/**
 * This function is used for resolve the uc:syntax. 
 */
function get_ucsyntax(content) {
	if (content) {
		content = content.replace(/\$/g, "&#36;");
		let cnt_arr = content.match(/<uc:syntax([\s\S]*?)<\/uc:syntax>/gi);
		if (cnt_arr) {
			for (let i = 0; i < cnt_arr.length; i++) {
				let str = "";
				let classes = "";
				let get_content = cnt_arr[i];
				let uc_tag = get_content.match(/<uc:syntax(.*?)>/gi);
				if (uc_tag[0].match(/console/gim)) {
					classes = "prettyprint black linenums";
					if (uc_tag[0].match(/nonum/gim)) {
						classes += " hidelinenums";
					}
				} else if (uc_tag[0].match(/command/gim)) {
					classes = "prettyprint cmd linenums";
				} else if (uc_tag[0].match(/white/gim)) {
					if (uc_tag[0].match(/nonum/gim)) {
						classes = "prettyprint white";
					} else {
						classes = "prettyprint white linenums";
					}
				} else if (uc_tag[0].match(/nonum/gim)) {
					classes = "prettyprint hidelinenums";
				} else {
					classes = "prettyprint linenums";
				}
				if (uc_tag[0].match(/hidelinenums/gim)) {
					classes += " hidelinenums";
				}
				let number = get_content.match(/\snum="(.*?)"/gim);
				if (number) {
					number[0] = number[0].replace(/\snum=|"/gim, "");
					classes += ":" + number[0];
				}
				get_content = get_content.replace(/<uc:syntax(.*?)>/gim, "");
				get_content = get_content.replace(/<\/uc:syntax>/gim, "");
				str += `<pre class="${classes}">${get_content}</pre>`;
				let re = new RegExp(RegExp.quote(cnt_arr[i]), "gm");
				// var re = new RegExp(cnt_arr[i],"gm");
				content = content.replace(re, str);
			}
		}
		return content;
	}
}

// for timeline slide change
function changeSlide(el, n) {
	let currentSlide = el.parentElement.querySelector(".slider_fade.active");
	let nextMove = (n == 1) ? currentSlide.nextElementSibling : currentSlide.previousElementSibling;
	if (nextMove && nextMove.classList.contains('slider_fade')) {
		let allSlides = el.parentElement.querySelectorAll(".slider_fade")
		allSlides.forEach((item)=> {
			item.style.display = "none";
		});
		currentSlide.classList.remove('active');
		nextMove.classList.add('active');
		nextMove.style.display = "block";
	} else {
		console.warn("No slide found");
	}
}

//@TODO:? @abhishek what this function do
RegExp.quote = function (str) {
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

function seqTag(data, fromWebpage) {
	fromWebpage = fromWebpage ? fromWebpage : false;
	if (data && isValidContent(data)) {
		let seq = data.match(/<seq(.*?)><\/seq>|<snt(.*?)><\/snt>/gim);
		if (seq) {
			for (let i = 0; i < seq.length; i++) {
				let replaceSeq = seq[i].replace(/><\/seq>|><\/snt>/gim, " />").replace(/data-style/gim, "style");
				data = data.replace(seq[i], replaceSeq);
			}
		}
		data = customTableReplace(data);
		let tg = [
			"div",
			"li",
			"table",
			"tbody",
			"tr",
			"td",
			"th",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"pre",
			"p",
			"figure",
			"figcaption",
			"dl",
			"dt",
			"section",
			"main",
			"article"
		];
		for (let i in tg) {
			data = data
				.replace(new RegExp(tg[i] + ">\\s+<", "g"), tg[i] + "><")
				.replace(new RegExp(">\\s+<" + tg[i], "g"), "><" + tg[i])
				.replace(new RegExp(">\\s+</" + tg[i], "g"), "></" + tg[i])
				.replace(new RegExp("\n.<" + tg[i], "g"), "<" + tg[i])
				.replace(new RegExp(tg[i] + ">\n", "g"), tg[i] + ">");
		}
		data = data.replace(/<br \/> |<br\/> |<br> | <br \/>| <br\/>| <br>|<br \/>|<br\/>|<br>/gim, "\n"); //.replace(/\n&nbsp;/g,"");
		data = data.replace(/<g class([\s\S]*?)>|<\/g>/, ""); //code for removing grammarly tag
		data = data.replace(/<grammarly-btn([\s\S]*?)<\/grammarly-btn>/g, ""); //code for removing grammarly tag
		data = data.replace(/<grammarly([\s\S]*?)<\/grammarly([\s\S]*?)>/g, ""); //code for removing grammarly tag
		data = data.replace(/<p><\/p>/, "\n"); //code for removing blank <p>
		data = data.replace(new RegExp("\n.<ul|\n<ul", "g"), "<ul"); //Remove extra new line before ul
		data = data.replace(new RegExp("\n.<ol|\n<ol", "g"), "<ol"); //Remove extra new line after ol
		data = data.replace(/\[/g, "&lsqb;");
		// data = data.replace(new RegExp("<\/div>\n","g"),"</div>"); //Remove extra new line after div //@comment because we can't give newline after SNT
		data = data.replace(/<main data-remove="true"[\s\S]*?<\/main>/g, ""); //code for removing add item button in preview
		data = data.replace(/class\=(\"|\')ebook_item_text.*?(\"|\')/g, "class='ebook_item_text'"); //code for removing extra class added on ebook_item_text class
		data = data.replace(/(\'|\")ebook_item_text(\'|\").*?\>/g, "'ebook_item_text'>"); //code for removing extra attribute added on ebook_item_text class
		data = data.replace(/(\'|\")ebook_item_text inline(\'|\").*?\>/g, "'ebook_item_text inline'>");
		data = data.replace(/(\'|\")inline ebook_item_text(\'|\").*?\>/g, "'ebook_item_text inline'>");
		data = data.replace(/mce-item-table/g, ""); //remove tinymce table class
		data = data.replace(/\<input type="hidden".*?\>|\<input type="hidden".*?\/>/gm, ""); //code to remove extra input type hidden
		if (fromWebpage == "remed") {
			data = data
				.replace(/sec_button inline|sec_button/, "sec_button inline")
				.replace(/ebook_item_text inline|ebook_item_text/, "ebook_item_text inline");
		}
		if (fromWebpage == 1) {
			data = data.replace(/<p>/gim, "\n").replace(/<\/p>/, "");
		}
		return data;
	}
	return "";
}

function isValidContent(content) {
	if ( (content != '<br data-mce-bogus="1">') && (content != '<b class="text-muted">Title</b>') && (content != '&#160;') ) {
		return true;
	} else {
		console.log("Invalid = ", content);
		return false;
	}
}

//@TODO:? @abhishek reveiw ths also https://gist.github.com/yidas/41cc9272d3dff50f3c9560fb05e7255e
function br2nl(data) {
	if (data) {
		return data.replace(/<br \/> |<br\/> |<br> | <br \/>| <br\/>| <br>|<br \/>|<br\/>|<br>/gim, "\n").replace(/&nbsp;/g, " "); //.replace(/\n&nbsp;/g,"");
	}
}

function nl2br(data) {
	if (data) {
		return data.replace(/\r\n|\n/g, "<BR>"); //.replace(/\n&nbsp;/g,"");
	}
	return "";
}

function removeSection(item) {
	return new Promise((resolve)=> {
		try {
			let sectionClass = item.className;
			let newNode = document.createElement('DIV');
			newNode.setAttribute('data-section', sectionClass);
			newNode.setAttribute('type', item.getAttribute('type'));
			newNode.setAttribute('sub_type', item.getAttribute('sub_type'));
			if (item.getAttribute('class').includes('inline')) {
				newNode.setAttribute('class', 'ebook_item_text inline');
				newNode.innerHTML = item.childNodes.length == 1 ? item.firstChild.innerHTML : item.innerHTML;
			} else {
				newNode.setAttribute('class', 'ebook_item_text');
				newNode.innerHTML = item.innerHTML;
			}
			item.after(newNode);
		} catch(error) {
			console.log(item);
		}
		resolve(true);
	})
}

//format editable data on opening
function formatData(data, isConvertUc = false) {
	if (data) {
		let snt = data.match(/<snt(.*?)\/>/gim);
		if (snt) {
			for (let i = 0; i < snt.length; i++) {
				let replaceSeq = snt[i].replace(/style/gim, "data-style");
				data = data.replace(snt[i], replaceSeq);
			}
		}
		data = data.replace(/\r\n|\n/g, "<BR>"); // Removing new line by br tag
		if (isConvertUc) {
			data = convertUcSyntaxSpaceInEntity(data);
		} 
		return data;
	}
}

function convertUcSyntaxSpaceInEntity(str) {
	try {
		if (str && str.match(/<uc:syntax/gm)) {
			RegExp.escape = function (s) {
				return s.replace(/[-\/\\^$*+.()|[\]{}]/g, '\\$&');
			};
			let ucStx = str.match(/<uc\:syntax[\s\S]*?<\/uc\:syntax>/gim);
			if (ucStx) {
				for (let i in ucStx) {
					let temp = ucStx[i];
					ucStx[i] = ucStx[i].replace(/\s{2}/g, "&#160;&#160;").replace(/&#160;\s|\s&#160;/g, "&#160;&#160;");
					str = str.replace(new RegExp(RegExp.escape(temp), "gim"), ucStx[i]);
				}
			}
		}
	} catch (e) {
		console.warn("Issue in converting <uc:syntax",e);
	}
	return str;
}

function checkAnsMode(ans) {
	document.getElementById("ansModeAnswer").value = ans;
}

function getLabSimAnswer(_nRet) {
	document.getElementById("labAnswer").value = _nRet.result;
}

function customTableReplace(data) {
	data = data
		.replace(/<uc\:table/gim, "<table")
		.replace(/<uc\:thead/gim, "<thead")
		.replace(/<uc\:tbody/gim, "<tbody")
		.replace(/<uc\:tfoot/gim, "<tfoot")
		.replace(/<uc\:th/gim, "<th")
		.replace(/<uc\:td/gim, "<td")
		.replace(/<uc\:tr/gim, "<tr");
	data = data
		.replace(/<\/uc\:table>/gim, "</table>")
		.replace(/<\/uc\:thead>/gim, "</thead>")
		.replace(/<\/uc\:tbody>/gim, "</tbody>")
		.replace(/<\/uc\:tfoot>/gim, "</tfoot>")
		.replace(/<\/uc\:th>/gim, "</th>")
		.replace(/<\/uc\:td>/gim, "</td>")
		.replace(/<\/uc\:tr>/gim, "</tr>");
	return data;
}

function getQueryString(name) {
	// get url
	var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function getEditable(data) {
	if (data != '<br data-mce-bogus="1">' && data != '&#160;') {
		return data;
	} else {
		return  "";
	}
}

function showWeblinkIframeEditor(obj) {
	AI.select(".load_data", 'hide');
	let iframeContent = obj.contentDocument || obj.contentWindow.document;
	obj.setAttribute('height', "100%");
	obj.setAttribute('width', "100%");
	let _height = document.body.clientHeight;
	typeof iframeContent.querySelector(".editor_close")!='object'?iframeContent.querySelector(".editor_close").getAttribute("onclick", "window.parent.editorClose()"):'';
	AI.setCss(iframeContent.querySelector("#authoringSection"), { maxHeight: _height - 140, minHeight: _height / 2 });
	AI.setCss(iframeContent.querySelector("#previewSection"), { minHeight: _height / 2, maxHeight: _height - 113 });
}

function editorClose() {
	AI.trigger("#editor_close_btn", 'click');
	AI.select(".modal-backdrop.in").remove();
	AI.select("html").style.overflow = "auto";
}

function getURLParameter(sParam) {
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
        let sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

var EXAMMAPPING = "";
function checkedExamObjective(_this) {
	if (EXAMMAPPING != "" && EXAMMAPPING != "null") {
		let guid = EXAMMAPPING;
		AI.selectAll('input[name="exam_obj[]"]').forEach((elm)=> elm.checked=false);
		AI.select('input[name="exam_obj[]"]').parentElement.style.background = '#fff';
		let content_guid = getURLParameter('content_guid');
		for (let k in guid) {
			if ( (_this.previousElementSibling && _this.previousElementSibling.value == k) || window.frameElement.getAttribute("guid") == k || content_guid == k) {
				let tag_guid = (content_guid) ? content_guid : (from_myproject != 1 ? _this.previousElementSibling.value : window.frameElement.getAttribute("guid"));
				tag_guid = guid[tag_guid].split(',');
				for (i = 0; i<=tag_guid.length; i++) {
					AI.setCss(AI.select('#radio_'+tag_guid[i]).parentElement, {background : '#e3e3eb'});
					AI.select('#radio_'+tag_guid[i]).checked = true;
				}
			}
			
		}

		setTimeout(function() {
			AI.bind('input.exam_obj_radio', 'click', function(event) {
				if (AI) {
					AI.set('exma_obj_changed', true);
				}
			});
		}, 1000);
	}
}

function loadExamObjective(_this) {
	document.querySelectorAll( ".popover" ).forEach((_this2)=> _this2.style.display = "none");
	AI.select( ".parent_ul" ).classList.add('list-unstyled');
	if (document.querySelector('.exam_modal_body').querySelectorAll('.parent_ul li').length == 0) {
		AI.activate(1);
		AI.ajax({
			url: `${baseUrl}index_data.php?func=get_exam_obj_list&ajax=1&course_code=${editor.course}&get_mapping=1&from_myproject=${from_myproject}`
		}).then((data)=> {
			let obj_full = JSON.parse(data);
			let obj = obj_full.obj;
			EXAMMAPPING =  obj_full.mapping;
			document.querySelectorAll('.parent_ul li').forEach((elm)=> {
				elm.remove();
			});
			if (obj != "null") {
				for (let i in obj) {
					AI.insert('.parent_ul','<li class="radio parent_li_'+i+' my-2" tag_guid="'+i+'"><label class="border exam_obj_label w-100 p rounded"><input type="checkbox" class="exam_obj_radio h" id="radio_'+i+'" name="exam_obj[]" value="'+i+'" /><div class="mt-sm"></div><span>'+obj[i].n+'</span></label><ul class="child_ul list-unstyled"></ul></li>', 'beforeend');
					for (let j in obj[i].c) {
						AI.insert(AI.select('.parent_li_'+i).querySelector('.child_ul'), '<li class="radio child_li pl-4 my-2" tag_guid="'+j+'" ><label class="border exam_obj_label w-100 p rounded"><input type="checkbox" class="exam_obj_radio h" name="exam_obj[]" id="radio_'+j+'" value="'+j+'" /><div class="mt-sm"></div><span>'+obj[i].c[j].n+'</span></label></li>', 'beforeend');
					}
				}
			}
			//AI.getBS('#exam_objective_modal', 'Modal').show();
			checkedExamObjective(_this);
			AI.activate(0);
		});
	} else {
		//AI.getBS('#exam_objective_modal', 'Modal').show();
		checkedExamObjective(_this);
	}
}

function searchText(_this) {
	let $allListElements = document.querySelectorAll('.exam_modal_body ul > li');
	$allListElements.forEach(function(li) {
		let listItemText = li.textContent.toUpperCase(); 
		let searchText = _this.value.toUpperCase();
		if (listItemText.indexOf(searchText) != -1) {
			li.style.display = "block";
		} else {
			li.style.display = "none";
		}
	});
	//$allListElements.hide();
	//$matchingListElements.show(); 
}

function assignObjective(_this) {
	let content_guid = AI.prevElm(_this, '#guid_hidden').value;
	let tag_guid = AI.select('input[name="exam_obj"]','checked')[0].value;
	AI.activate(1);
	AI.ajax({
		url: `${baseUrl}?func=assign_exam_objective&course_code=${editor.course}>&content_guid=${content_guid}&tag_guid=${tag_guid}&save=1`
	}).then(function(data) {
		let tag = JSON.parse(data);
		AI.select('#exam_obj_'+content_guid).remove();
		if (document.getElementById('test_'+content_guid)) {
			AI.insert('#test_'+content_guid, '<div class="mb-md" id="exam_obj_'+content_guid+'"><b class="h">'+$l.exam_objective_uppercase +': </b><span class="parent'+content_guid+'"></span><span class="close pointer delete_tag float-right" content_guid="'+content_guid+'">&times;</span><div><b class="exam_b">'+$l.exam_objective_uppercase+': </b><span class="tag_name'+content_guid+'"></span></div></div>', 'afterend');
		}
		if (document.querySelector('.obj_'+content_guid)) {
			AI.insert('.obj_'+content_guid,`<div id="exam_obj_${content_guid}" class="exam_objective mb-md"><span class="close pointer delete_tag float-right" content_guid="${content_guid}">&times;</span><div class="float-left mt-sm mr"><img src="${themeUrl}images/certification_objective.png" alt="certification_objective"></div><div class="ml-xl pl-5 about font15 line_height1"><div class="h4">${l.exam_objectives}</div><div class="parent${content_guid}"></div><div class="tag_name${content_guid}"></div></div></div>`, 'beforebegin');
		}
		if (tag.parent) {
			if (document.getElementById('test_'+content_guid)) {
				document.querySelector('.exam_b').parentElement.style.textIndent = '164px';
				document.querySelector('.parent'+content_guid).previousElementSibling.classList.remove('h');
				document.querySelectorAll('.exam_b').forEach((item)=> item.style.display = "none");
			}
			if (document.querySelector('.obj_'+content_guid)) {
				document.querySelector('.tag_name'+content_guid).classList.add('sub_exam_obj');
			}
			document.querySelector('.parent'+content_guid).textContent = tag.parent;	
		}
		for (let i in tag) {
			for (let j in tag[i].exam_objective) {
				document.querySelector('.tag_name'+content_guid).textContent = tag[i].exam_objective[j];
			}
		}
		AI.showmsg("Exam objective saved successfully!");
		AI.activate(0);
	});
}

function selectObjRadio(_this) {
	if (_this.checked == false ) {	
		_this.parentElement && (_this.parentElement.style.background = '#fff');
		AI.selectAll("#assign_exam_obj", 'removeAttr', "disabled");
	} else {
		AI.select("#assign_exam_obj").disabled =  true;
		_this.parentElement && (_this.parentElement.style.background = '#e3e3eb');
	}
}

function formatXml(xml, cdata_format) {
    let cdata = cdata_format || false;
    let reg = /(>)(<)(\/*)/g;
    let wsexp = / *(.*) +\n/g;
    let contexp = /(<.+>)(.+\n)/g;
    if (cdata) {
        var old_cdata = xml.match(/<!--\[CDATA\[[\s\S]*?\]\]-->/gim);
    }
    xml = xml.replace(/\t/g, '');
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    if (cdata) {
        var new_cdata = xml.match(/<!--\[CDATA\[[\s\S]*?\]\]-->/gim);
        xml = xml.replace(new_cdata, old_cdata);
    }
    let pad = 0;
    let formatted = '';
    let lines = xml.split('\n');
    let indent = 0;
    let lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
    let transitions = {
        'single->single': 0,
        'single->closing': -1,
        'single->opening': 0,
        'single->other': 0,
        'closing->single': 0,
        'closing->closing': -1,
        'closing->opening': 0,
        'closing->other': 0,
        'opening->single': 1,
        'opening->closing': 0,
        'opening->opening': 1,
        'opening->other': 1,
        'other->single': 0,
        'other->closing': -1,
        'other->opening': 0,
        'other->other': 0
    };

    for (let i = 0; i < lines.length; i++) {
        var ln = lines[i];
        if (ln != '') {
            var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
            var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
            var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
            var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
            var fromTo = lastType + '->' + type;
            lastType = type;
            var padding = '';

            indent += transitions[fromTo];
            for (var j = 0; j < indent; j++) {
                padding += '\t';
            }
            if (fromTo == 'opening->closing')
                formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
            else
                formatted += padding + ln + '\n';
        }
    }
    return formatted;
}

function functionForFullscreen() {
	var frame_element = document.getElementById("authoringFrame");
	if (BigScreen.enabled) {
		BigScreen.toggle(frame_element);
	}
	BigScreen.onenter = function () {
		document.querySelector('#authoringFrame')
      .contentDocument
      .querySelector('#fullScreenButton').innerText = 'Back To Editor';
    
		const iconEle = document.querySelector('#authoringFrame')
      .contentDocument
      .querySelector('#smartFullscr i');
    if(iconEle){
    iconEle
      .classList
      .remove('icomoon-expand');
    iconEle
      .classList
			.add("icomoon-contract");
    }
    
		const myEducatorItems = document.querySelectorAll(".educator_my_items");
    
    myEducatorItems.length > 0? myEducatorItems.forEach(ele => ele.setAttribute('style', 'position: relative; z-index: -1;')): "";
    
    
		const titlebars = document.querySelectorAll("#titlebar");
		titlebars.length > 0
			? titlebars.forEach(ele => ele.setAttribute('style', 'display: none;')): "";
    
    const bottomBars = document.querySelectorAll("#bottombar"); 
		bottomBars.length > 0
			? bottomBars.forEach(ele => ele.setAttribute('style', 'display: none')): "";
	};
	BigScreen.onexit = function () {
    document.querySelector('#authoringFrame')
      .contentDocument
      .querySelector('#fullScreenButton')
	  .innerText = 'FullScreen';
    
		const iconEle = document.querySelector('#authoringFrame')
      .contentDocument
      .querySelector('#smartFullscr i');
    
    if(iconEle){
      iconEle
        .classList
        .add('icomoon-expand');
      iconEle
        .classList
        .remove("icomoon-contract");
    }
    
		const myEducatorItems = document.querySelectorAll(".educator_my_items");
    
    myEducatorItems.length > 0? myEducatorItems.forEach(ele => ele.setAttribute('style', 'z-index: initial;')): "";
    
    
		const titlebars = document.querySelectorAll("#titlebar");
		titlebars.length > 0
			? titlebars.forEach(ele => ele.setAttribute('style', 'display: block;')): "";
    
    const bottomBars = document.querySelectorAll("#bottombar"); 
		bottomBars.length > 0
			? bottomBars.forEach(ele => ele.setAttribute('style', 'display: block')): "";
	};
}
function scrollToTop (duration) {
    // cancel if already on top
    if (document.scrollingElement.scrollTop === 0) return;

    const totalScrollDistance = document.scrollingElement.scrollTop;
    let scrollY = totalScrollDistance, oldTimestamp = null;

    function step (newTimestamp) {
        if (oldTimestamp !== null) {
            // if duration is 0 scrollY will be -Infinity
            scrollY -= totalScrollDistance * (newTimestamp - oldTimestamp) / duration;
            if (scrollY <= 0) return document.scrollingElement.scrollTop = 0;
            document.scrollingElement.scrollTop = scrollY;
        }
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}
function scrollnow(px) {
	scrollToTop;
}

var UCUTIL = UCUTIL || {};
UCUTIL.overlay = {
    ui: function(type) {
        var uitpl = {
            1: '<div id="modal-from-test" class="modal test-modal" tabindex="-1"><div class="modal-body pt-0"><iframe title="Overlay window" name="test_frame" id="test_frame" frameBorder="0" src="" allowfullscreen="true"></iframe></div></div>'
        };
        return uitpl[type];
    }
};


UCUTIL.parseJSON = function(obj, showErr_data) {
    var showErr = showErr_data || false;
    try {
        return JSON.parse(obj);
    } catch (e) {
        if (showErr) {
            console.warn(e);
        }
        return {}; //Return blank object
    }
};

UCUTIL.param2Url = function(params) {
    var url = [];
    for (var i in params) {
        var uri = i + '=' + params[i];
        url.push(uri);
    }
    return url.join('&');
};

function getTestFrameworkDetail(checkViewAttr) {
    var detail = -1;
    const ucItemTest = document.querySelector('#uc-item-test-template');
	if (ucItemTest) {
        var tempTestView = ucItemTest.setAttribute('temp_test_view');
        if (!checkViewAttr && tempTestView && tempTestView != '') {
            return tempTestView;
        }
        return ucItemTest.attr('view');
    }
    return detail;
}


function createPlayerEmbed(embed, player_title, src, attributes, button_name) {
    var embed_html = '';
    src = src || false;
    player_title = player_title || false;
    button_name = button_name || false;
    if (embed == 'inline') {
        embed_html = '<iframe tabindex="0" title="' + player_title + '" src="' + src + '" onload="autoResize(this.id)" allow="fullscreen" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"' + attributes + '></iframe>';
    } else if (embed == 'overlay') {
        embed_html = '<button tabindex="0" type="button" ' + attributes + '>' + button_name + '</button>';
    } else if (embed == 'new_tab') {
        embed_html = '<a tabindex="0" href="' + src + '" target="_blank" ' + attributes + '>' + button_name + '</a>';
    }

    return embed_html;
}

function getPlayerAttrVal(self, item) {
    var option_attr = '',
        style_attr = '',
        data = '';
    if (self.getAttribute(item)) {
        data = self.getAttribute(item);
    } else {
        if (self.getAttribute('option')) {
            option_attr = UCUTIL.parseJSON(self.getAttribute('option'));
        }
        if (self.getAttribute('styles')) {
            style_attr = UCUTIL.parseJSON(self.getAttribute('styles'));
        }
        if (option_attr[item] != undefined) {
            data = option_attr[item];
        } else if (style_attr[item] != undefined) {
            item_val = style_attr[item];
            data = (!isNaN(item_val) && item_val.indexOf('px') == -1 && item_val.indexOf('%') == -1) ? item_val + 'px' : item_val;
        }
    }

    return data;
}


function createSimulationHtml(config, default_action, correct_ans, embed, self, is_review, hint, player_id, player_title) {
    var us_ans = [],
        default_act = [],
        button_name = '',
        lab_url = '',
        is_sql = '',
        attributes = '',
		single = ''
        title = '';
    var lab_html = '<div class="alert alert-info clearfix lab-title p-md">',
        dfault = '',
        correct = new Array();
    if (self.getAttribute('title')) {
        title = self.getAttribute('title');
    }
    if (config != '') {
        config = config.split('-');
    }
    if (document.querySelectorAll('#user_answer_details').length > 0) {
        us_ans = document.querySelector('#user_answer_details').value;
        us_ans = us_ans.replace('<!--[CDATA[', '').replace(']]-->', '').trim();
        us_ans = us_ans.split('\n');
    }
    if (default_action != '') {
        default_act = default_action.split('|');
    }
    var i;
    default_act = [...default_act, ...us_ans];
    default_act = default_act.filter(ele => ele);
    for (i = 0; i < default_act.length; i++) {
        var tmp = default_act[i].split('=');
        dfault += '&default[' + tmp[0] + ']=' + tmp[1];
    }
    if (correct_ans != '') {
        correct = correct_ans.split('|');
    }
    if (title != '') {
        lab_html += '<span class="float-left" style="padding-top: 5px;">' + title + '</span>';
    } else {
        lab_html += '<span class="float-left" style="padding-top: 5px;">&nbsp;</span>';
    }
    if (is_review == 1 && sub_type == 'assessment') {
        lab_url = 'javascipt:;\' disabled=\'disabled\'';
    } else {
        lab_url = baseUrl + 'sim/?module=' + config[0] + '&type=' + config[1] + '&version=' + config[2] + '&is_player=1' + dfault;
    }
    button_name = getPlayerAttrVal(self, 'button_name');
    if (self.getAttribute('correct') || embed == 'inline') {
        lab_url += '&show_click=1';
        single = 1;
    } else if (self.getAttribute('is_sql') || embed == 'overlay') {
        is_sql = 1;
    }
    if (hint) {
        hint_btn = '<button tabindex="0" type="button" style="margin-left:5px; background: #9B9B9B;" class="btn text-white" id="hintBtn' + player_id + '" onclick="swal({title:\'Hint\', text:\'' + hint + '\'});">Hint</button>';
        hint = '';
    } else {
        hint_btn = '';
    }
    if (single == 1) {
        lab_url += '&is_single=1';
        if (typeof(us_ans) == 'undefined') {
            us_ans = new Array();
        }
        var self_ele;
        if (correct.length > 0 && is_review == 1) {
            var table_str = '<table class="external"><tr><th>Correct Answer</th><th>Your Answer</th></tr>',
                correct_str = '',
                user_str = '';
            sql_correct = correct[0].split('=');
            if (sql_correct[0] == 'query_editor_area') {
                correct_str += sql_correct[1];
            } else {
                for (i = 0; i < correct.length; i++) {
                    var ch = correct[i].substring(correct[i].lastIndexOf('~'), correct[i].length);
                    if (ch == '~i') {
                        correct[i] = correct[i].replace(ch, '');
                    }
                    correct_str += correct[i] + '</br>';
                }
            }
            for (i = 0; i < us_ans.length; i++) {
                let query = us_ans[i].split('=');
                if (query[0] == 'query_editor_area') {
                    user_str += query[1] + '<br>';
                } else {
                    user_str += typeof(us_ans[i]) !== 'undefined' ? us_ans[i] + '</br>' : '';
                }
            }
            table_str += '<tr><td>' + correct_str + '</td><td>' + user_str + '</td></tr></table>';
            self_ele = self;
            if (getTestFrameworkDetail() === 'split') {
                self_ele = document.querySelector('#item_answer');
            }
            self_ele.innerHTML += table_str;
        } else if (correct.length > 0) {
            activate(1);
            self_ele = self;
            if (getTestFrameworkDetail() === 'split') {
                var new_player = self.cloneNode();
                self.remove();
                const specialModExtQues = document.querySelector('#specialModuleExtQuestion');
				specialModExtQues.innerHTML += new_player;
                self_ele = document.querySelector('player[type=\'external\']');
            }
            attributes = 'id="msoffice_frame" frameBorder="0" correct="' + correct_ans + '" user_answer="' + us_ans.join('|') + '" onload="autoResize(this.id)" scrolling="no" player_id="' + player_id + '"';
            self_ele.innerHTML += createPlayerEmbed('inline', player_title, lab_url + '&wmode=transparent', attributes);
            setTimeout(function() { activate(0); }, 5000);
        } else {
            if (!self.getAttribute('try_me') && self.getAttribute('try_me') != 'inline') {
                var tryMeBtn = self.getAttribute('custum-btn') ? '' : '<p tabindex="0" class="try-me-s">Click to see me in action</p>';
                
				const childrens = self.children || [];
				for(let child of childrens){
					child.innerHTML = '<a tabindex="' + tabindex.n + '" href="' + lab_url + '&nozoom=1" style="position:relative;display:inline-block;" onclick="return open_single_lab(this)">' + child.innerHTML + '</a>';
					child.querySelector('a').insertAdjacentHTML('afterbegin', tryMeBtn);
				}
                
				self.querySelector('img').classList.add('noImgModal');
            }
        }
    } else if (self.getAttribute('guids') && self.getAttribute('guids') != '') {
        if (title == '') title = 'Try it';
        lab_url += '&no_action=1&content_guid=' + self.getAttribute('guids');
        self.insertAdjacentHTML('afterbegin', '<a tabindex="0" class="btn btn-primary startlab focus_lab" href="' + lab_url + '" target="_blank">' + title + '</a>');
    } else if (is_sql != '') {
        lab_url += '&is_single=1';
        attributes = 'class=\'btn btn-success startlab' + player_id + '\' onclick=\'bindSql("' + lab_url + '", ' + player_id + ')\'';
        self.insertAdjacentHTML('afterbegin','<div class=\'text-center\'>' + createPlayerEmbed('overlay', false, false, attributes, (button_name) ? button_name : 'Start Lab') + hint_btn + '</div>');
    } else if (embed == 'new_tab') {
        attributes = 'class="btn btn-primary float-right startlab"';
        self.insertAdjacentHTML('afterbegin', lab_html + createPlayerEmbed(embed, false, lab_url, attributes, (button_name) ? button_name : 'Start Lab') + '</div>');
    } else {
        self.insertAdjacentHTML('afterbegin', lab_html + '<a tabindex="0" class="btn btn-primary float-right startlab" href="' + lab_url + '" target="_blank">Start Lab</a></div>');
    }
}

const AH = {
	jsAction: function(selected, data) {
        if (selected instanceof HTMLElement || selected instanceof Node) {
            switch(data.action) {
                case 'show': selected.style.display = data.actionData || "";
                break;
                case 'hide': selected.style.display = "none";
                break;
                case 'toggleDisplay': selected.style.display = (selected.style.display == "none") ? "block" : "none";
                break;
                case 'addClass': typeof data.actionData == "object" ? selected.classList.add(...data.actionData) : selected.classList.add(data.actionData);
                break;
                case 'removeClass': typeof data.actionData == "object" ? selected.classList.remove(...data.actionData) : selected.classList.remove(data.actionData);
                break;
                case 'toggleClass': selected.classList.toggle(data.actionData);
                break;
                case 'html' : selected.innerHTML = data.actionData;
                break;
                case 'value': selected.value = data.actionData;
                break;
                case 'text': selected.textContent = data.actionData;
                break;
                case 'checked':  selected.checked = data.actionData;
                break;
                case 'remove': selected.remove();
                break;
                case 'removeAttr': selected.removeAttribute(data.actionData);
                break;
                case 'css' : this.setCss(selected, data.actionData);
                break;
                case 'attr': this.setAttr(selected, data.actionData);
                break;
                case 'data': this.setData(selected, data.actionData);
                break;
                case 'getData': this.getData(selected, data.actionData);
                break;
            }
        }
    },
	selectAll: function(selector, action, actionData) {
		let selected = typeof selector == 'object' ? selector : document.querySelectorAll(selector);
		if (selected && selected.length > 0 && action) {
			Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action, actionData}));
		}
		return selected;
	},
	setAttr: function(selector, attrs) {
		let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
		if (selected) {
			for (let property in attrs) {
				selected.setAttribute(property, attrs[property]);
			}
		}
		return selected || {};
	},
	// add css using object
	setCss: function(selector, cssList) {
		let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
		if (selected) {
			for (let property in cssList) {
				selected.style && (selected.style[property] = cssList[property]);
			}
		}
		return selected || {};
	},
	ajax: function (sendData) {
        let longData = "";
        if (typeof (sendData.data) == 'object') {
            if (sendData.formData) {
                longData = sendData.data;
            } else if (sendData.withUrl) {
                let param = "?";
                for (let k in sendData.data) {
                    if (typeof sendData.data[k] != 'object') {
                        param += "&" + k + "=" + sendData.data[k];
                    }	
                }
                sendData.url += param;
            } else {
                longData = new FormData();
                for (let prop in sendData.data) {
                    if (typeof sendData.data[prop] == 'object' && this.isValid(sendData.data[prop])) {
                        longData = this.jsonFormEncode(longData, prop, sendData.data[prop]);
                    } else {
                        longData.append(prop, sendData.data[prop]);
                    }	
                }
            }
        }
        return new Promise((resolve, reject)=> {
            const request = new XMLHttpRequest();
            request.open(sendData.type || 'POST', sendData.url, true);
            if (sendData.responseType) {
                request.responseType = sendData.responseType;
            }
            request.onreadystatechange = (event) => {
                if (request.readyState == 4 && request.status === 200) {
                    try {
                        resolve(request.responseText, event);
                    } catch (err) {
                        reject(err);
                    }
                } 
            };
            request.onerror = (requestError) => {
                reject(requestError);
            };
            if (sendData.onStart) request.onloadstart = sendData.onStart;
            if (sendData.onEnd) request.onloadend = sendData.onEnd;
            request.send(longData);
        });
    },
    jsonFormEncode: function(formData, prop, jsonArray) {
        try {
            if (Array.isArray(jsonArray)) {
                for (let i = 0; i < jsonArray.length; i++) {
                    for (let key in jsonArray[i]) {
                        formData.append(`${prop}[${i}][${key}]`, jsonArray[i][key])
                    }
                }
            } else {
                for (var key in jsonArray) {
                    formData.append(`${prop}[${key}]`, jsonArray[key])
                }
            }
        } catch(error) {
            console.warn("Please provide valid JSON Object in ajax data."+ error);
        }
        return formData;
    },
	addScript: function(data, url, options={}) {
        let sc = document.createElement("script");
        if (url) {
            sc.src = url;
            sc.async = true;
            if (options.callback) {
                sc.onload = function() { 
                    options.callback();
                }
            }
        } else {
            sc.innerHTML = data;
        }
        let selector = options.target ? document.body : document.head;
        selector.append(sc);
        return sc;
    },
	activate(loader) {
        document.querySelector('#activateLoaderContainer') && document.querySelector('#activateLoaderContainer').remove(); 
        if (loader > 0) {
            document.body.insertAdjacentHTML('afterend', `<div id="activateLoaderContainer" class="activateOverlay" style="z-index:9999999;"><center><div class="activator" style="height:100px; width: 100px;"></div></center></div>`);
        }
    }
}

var html_editor = [];
var evalInline = {
    getRegString: function(str, smxml, isEval) {
        isEval = isEval ? 1 : 0;
        var regString = new RegExp('\\<' + str + '\\>([\\s\\S]*?)\\<\\/' + str + '\\>', 'gm');
        var code_data_matched = regString.exec(smxml);
        var code_data = '';
        if (code_data_matched) {
            code_data = code_data_matched[1];
            code_data = !isEval ? code_data.replace(/</g, '&lt;').replace(/>/, '&gt;') : code_data;
        }
        return code_data;
    },

    createEditor: function(e, id, mode, isEval, theme) {
        e.disabled = true;
		AH.activate(1);
        mode = mode == 'html' ? 'xml' : mode;

        if (typeof(CodeMirror) != 'function') {
			AH.ajax({
                type: 'POST',
				longData: true,
                url: themeUrl + 'svelte_items/lib/merged_codemirror.txt',
            }).then((res) => {
				const scriptStart = res.split("</script>");
				scriptStart[0] = scriptStart[0].replace("<script>", "");
				AH.addScript(scriptStart[0], "", {target: "body"});
				const style = document.createElement('style');
				scriptStart[1] = scriptStart[1].replace("<style>","");
				scriptStart[1] = scriptStart[1].replace("</style>","");
				style.innerHTML = scriptStart[1];
				document.head.append(style);
                setTimeout(() => evalInline.renderEditor(e, id, mode, isEval, theme), 500);
				AH.selectAll('#printPanel' + id, 'hide');
				AH.activate(0);
			});
        } else {
            AH.selectAll('#printPanel' + id, 'hide');
			setTimeout(() => evalInline.renderEditor(e, id, mode, isEval, theme), 500);
			AH.activate(0);
        }
    },

    getBack: function(id) {
        AH.selectAll('#printPanel' + id, 'show')
        AH.selectAll('#evalCreator' + id, 'attr', {'disabled': false})
        AH.selectAll('#editorPanel' + id, 'hide');
        AH.selectAll('#framePanel' + id, 'hide');
    },

    renderEditor: function(e, id, mode, isEval, theme) {
        AH.selectAll('#framePanel' + id, 'attr', {'style':'width:38.3%;float:left;margin-left:5px;'});
        AH.selectAll('#editorPanel' + id, 'attr', {'style': 'width:59.6%;float:left;min-height:580px'});
        if (theme > 0) {
            AH.selectAll('#editorPanel' + id + ' .panel-heading,#framePanel' + id + ' .panel-heading, #framePanel' + id + '.panel.panel-default.mb', 'attr', {'style': ' background: #474747;border-color: #000;color: #d5d5d5 !important;'});
            AH.selectAll('#framePanel' + id + ' textarea', 'attr', {'style': 'background: #272822;color: #fff;'});
        }
        AH.selectAll('#framePanel' + id,'attr', {'class': ''});
        AH.selectAll('#editorPanel' + id,'attr', {'class': ''});
        var parentDiv = document.querySelector('#htmlEditor' + id);
        parentDiv.style.border = '0';
        var webXmlData = parentDiv.firstElementChild.innerText;
        if (!webXmlData) {
            webXmlData = parentDiv.firstElementChild.value;
        }
        parentDiv.innerHTML = '<textarea class="h" id="htmlText' + (id) + '"></textarea>';
        AH.selectAll('#htmlText' + id, 'value', webXmlData);
        var webEditor = document.querySelector(('#htmlEditor' + id) + ' textarea');
        html_editor[id] = CodeMirror.fromTextArea(webEditor, {
            lineNumbers: true,
            mode: mode == 'xml' ? 'xml' : 'text/x-' + mode,
            styleActiveLine: true,
            autoCloseBrackets: true,
            theme: theme ? 'monokai' : 'default',
            lineWrapping: true,
            scrollbarStyle: 'simple',
            matchBrackets: true,
            gutters: ['CodeMirror-linenumbers', 'breakpoints']
        });
        AH.selectAll('.CodeMirror', 'css', {
            'min-height': '580px',
            'max-height': '580px',
            'border': '0',
            'line-height': '1.2',
            'font-size': '16px'
        });
        AH.selectAll('#frameDiv' + id, 'css', {
            'height': '458.5px',
            'position': 'relative'
        });
        AH.selectAll('.CodeMirror-scroll', 'css', { 'min-height': '558px', 'max-height': '558px' });
        AH.selectAll('.CodeMirror-gutters', 'css', {'height': '580px'});
        if (isEval < 2) {
            AH.selectAll('#inputPanel' + id, 'hide');
            AH.selectAll('#frameDiv' + id, 'css', {'height': '580.5px'});
        }
    },

    sendToFrame: function(id, isEval, type, dbName) {
        AH.selectAll('#runBtn' + id, 'attr', {'disabled': true});
        isEval = isEval ? isEval : 0;
        var input = 0;
        var code = evalInline.getCode(id);
        var video_and_audio_data = ['mp4', 'ogg', 'webm', 'mp3', 'wav'];
        var img_data = ['gif', 'tif', 'png', 'jpg'];
        var i;
        code = code.replace(/src[ ]*=[ ]*['"](.*?)['"]/gm, function(fullMatch, src) {
            if (src) {
                for (i = 0; i < video_and_audio_data.length; i++) {
                    if (src.includes(video_and_audio_data[i])) {
                        return fullMatch.replace(src, 'https://s3.amazonaws.com/jigyaasa_content_stream/' + src);
                    }
                }
                for (i = 0; i < img_data.length; i++) {
                    if (src.includes(img_data[i])) {
                        return fullMatch.replace(src, 'https://s3.amazonaws.com/jigyaasa_content_static/' + src);
                    }
                }
            }

        });

        code = code.replace(/url\(['"](.*?)['"]\)/g, 'url("https://s3.amazonaws.com/jigyaasa_content_static/$1")');
        //code = code.replace(/src="(.*?)"/g,'src="https://s3.amazonaws.com/jigyaasa_content_static/$1"').replace(/url\(['"](.*?)['"]\)/g,'url("https://s3.amazonaws.com/jigyaasa_content_static/$1")');
        var frameDiv = document.querySelector('#frameDiv' + id);
        frameDiv.style.position = 'relative';
        frameDiv.style.overflow = 'auto';
        AH.activate(1, '#frameDiv' + id, '', 'absolute');
        if (!isEval) {
            var codeContainer = document.createElement('iframe');
            codeContainer.className = 'fwidth bg-white border-0';
            codeContainer.style.height = '564px';
            codeContainer.style.width = '600px';
            frameDiv.innerHTML = '';
            frameDiv.appendChild(codeContainer);
            var frameContent = frameDiv.firstElementChild.contentDocument;
            frameContent.open();
            frameContent.write(code);
            frameContent.close();
            AH.activate(0);
            AH.selectAll('#runBtn' + id, 'attr', {'disabled': false});
        } else {
            if (isEval > 1) {
                evalInline.executeTestCases(id);
            }
            evalInline.runEvalPro(id, code, type, input, dbName);
        }
    },

    getCode: function(id) {
        var code = html_editor[id].getValue();
        return code;
    },

    executeTestCases: function(id) {
        var _userXml = AH.select('#evalXML' + id).value;
        var code = evalInline.getCode(id);
        _userXml = _userXml.replace(/\<editor\>[\s\S]*?\<\/editor\>/g, '<editor>' + code + '</editor>');
        _userXml = encodeURIComponent(_userXml);
        AH.ajax({
            type: 'POST',
            url: baseUrl + 'sim/evalpro/?user_code=' + _userXml + '&execute_testcases=1&isCompiled=0',
        }).then(function(res) {
            if (res == 1) {
                AH.selectAll('#evalCheck' + id, 'html', '<span class="item_score font-weight-bold"><span class="label-correct">Correct</span></span>');
            } else {
                AH.selectAll('#evalCheck' + id, 'html','<span class="item_score font-weight-bold"><span class="label-incorrect">Incorrect</span></span>');
            }
            AH.selectAll('#runBtn' + id, 'attr', {'disabled': false});
        });
    },

    resetDb: function(user_guid, dbName, id) {
        AH.activate(1, '#frameDiv' + id, '', 'absolute');
        AH.selectAll('#resetBtn' + id, 'attr', {'disabled': false});
        dbName = dbName ? dbName : 'myDBs';
        AH.ajax({
            type: 'POST',
            url: baseUrl + 'sim/evalpro/index.php',
            data: {
                'ajax': 1,
                'in_editor': 0,
                'user_guid': user_guid,
                'resetDB': 1
            },
        }).then(function() {
            AH.selectAll('#frameDiv' + id, 'html','<div class=\'fwidth bg-white border-0 font14\' style=\'height:282px\'>Database reset complete!</div>');
            AH.selectAll('#resetBtn' + id, 'attr',{'disabled': false});
        });
    },

    runEvalPro: function(id, code, type, stdin, dbName) {
        dbName = dbName ? dbName : 'myDBs';
        var _userXml = AH.select('#evalXML' + id).value;
        var pre = evalInline.getRegString('pre', _userXml, 1);
        var post = evalInline.getRegString('post', _userXml, 1);
        code = pre + code + post;
        stdin = stdin ? stdin : AH.select('#evalInput' + id).value;
        var result = '';
        AH.ajax({
            type: 'POST',
            url: baseUrl + 'sim/evalpro/',
            data: {
                code: code,
                repltype: type,
                stdin: stdin,
                user_guid: user_guid,
                dbName: dbName,
                'run_code': 1
            },
        }).then(function(res) {
			AH.activate(0);
			var out = res.output ? res.output : res.stderr ? res.stderr : 'Your code didn\'t print anything...';
			AH.selectAll('#frameDiv' + id,'html','<div class=\'fwidth bg-white border-0 font14\' style=\'height:282px\'>' + out + '</div>');
			AH.selectAll('#runBtn' + id, 'attr', {'disabled': false});
		});
    }
};
function createPlaygroundHtml(smxml, isEval, theme, web_count, self, title) {
    var mode = /language="(\w+)"/g.exec(smxml),
        dbName = '',
        prettyData = '';
    if (mode) {
        mode = mode[1];
    }
    if (smxml) {
        if (smxml.indexOf('type="22"') > -1) {
            mode = 'html';
            var html_data = evalInline.getRegString('tag', smxml);
            var css_data = evalInline.getRegString('css', smxml);
            var js_data = evalInline.getRegString('js', smxml);
            if (css_data.length > 1) {
                css_data = '&lt;style&gt;' + css_data + '&lt;/style&gt;\n';
            } else {
                css_data = '';
            }
            if (js_data.length > 1) {
                js_data = '&lt;script&gt;' + js_data + '&lt;/script&gt;';
            } else {
                js_data = '';
            }
            prettyData = html_data + css_data + js_data;
        } else {
            var editor_data = evalInline.getRegString('editor', smxml);
            var caseData = evalInline.getRegString('case', smxml);
            dbName = (/db_name="(.*?)"/gmi).exec(smxml);
            dbName = (dbName) ? dbName[1] : '';
            var evalInpData = caseData.replace(/\|\d+/g, '').replace(',', '\n');
            prettyData = editor_data;
        }
        self.innerHTML = (
            '<div class="row">' +
            '<textarea class="h-imp" id="evalXML' + (web_count) + '">' + smxml.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>' +
            '<div id="printPanel' + web_count + '" class="col-md-12"><div class="card"><div class="card-header height44">' +
            title + '<div class="d-inline-block ml" id="evalPCheck' + web_count + '"></div><button id="evalCreator' + web_count + '" onclick="evalInline.createEditor(this,' + web_count + ',\'' + mode + '\',' + isEval + ',' + theme + ')" style="margin-top: -8px" type="button" class="btn btn-primary m-t-n-xs float-right"><i class="fa fa-code"></i> Run</button>' +
            '</div>' +
            '<div id="htmlPEditor' + web_count + '" class="card-body p-0 border-0">' +
            '<pre class="prettyprint black linenums mb-0">' + prettyData + '</pre>' +
            '</div></div></div>' +
            '<div id="editorPanel' + web_count + '" class="h" style="max-height:500px;" class="col-md-12">' +
            '<div class="card">' +
            '<div class="card-header height44">' +
            title + '<div class="d-inline-block ml" id="evalCheck' + web_count + '"></div><button class="btn btn-success float-right" style="margin-top: -8px" onclick="evalInline.sendToFrame(' + web_count + ',' + isEval + ',\'' + mode + '\',\'' + dbName + '\')"><i class="fa fa-code"></i> Run</button><button type="button" class="btn btn-danger mr-sm float-right mr-1" style="margin-top: -8px" onclick="evalInline.getBack(' + web_count + ')">Back</button>' + (dbName ? '<button type="button" id="resetBtn' + web_count + '" class="btn btn-danger mr-sm float-right mr-1" style="margin-top: -8px" onclick="evalInline.resetDb(\'' + user_guid + '\',\'' + dbName + '\',' + web_count + ')">ResetDB</button>' : '') +
            '</div>' +
            '<div id="htmlEditor' + web_count + '" class="card-body p-0 border-0">' +
            '<pre class="prettyprint black linenums mb-0">' + prettyData + '</pre>' +
            '</div></div></div>' +
            '<div id="framePanel' + web_count + '" class="h-imp">' +
            '<div class="card mb" id="inputPanel' + web_count + '">' +
            '<div class="card-header height44">Input</div>' +
            '<div id="inputDiv' + web_count + '" class="card-body p-0">' +
            '<textarea rows="3" placeholder="Enter your input seperated by Enter.." class="form-control border-0 resize_none outline0 shadow-none p" id="evalInput' + web_count + '" autofocus>' + evalInpData + '</textarea>' +
            '</div></div>' +
            '<div class="card"><div class="card-header height44">Output</div>' +
            '<div id="frameDiv' + web_count + '" class="card-body p" style="resize: both;overflow: auto;background:#fff">' +
            '</div></div></div></div>'
        );
        prettyPrint();
    }
}