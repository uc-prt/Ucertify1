/* eslint-disable no-control-regex */
/* eslint-disable no-regex-spaces */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
function addScript(jsString) {
	document.body.append('<script class="reactScript">' + jsString + "</script>");
}

//@TODO:? @abhishek we have similar function in prepengine footer too, why we can centalize funcion and define and use form one single file
function showUcExpStep(currStep) {
	//let that = currStep.closest(".uc_step_explanation");
	let that = AI.prevElm(currStep, '.uc_step_explanation');
	window.curr = that;
	AI.select(AI.find(that, '.uc_step', 'hidden')[0], 'show');
	let len = AI.find(that, '.uc_step', 'hidden').length;
	if (len === 0) {
		AI.select(currStep, 'hide');
	}
}

function activateMathMl(content, isALgo, mathMLRender) { 
	console.log(content.match(/\\begin/gm));
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
		content = content.replace(/&#160;/g, ' ').replace(/   /g, '&#160; &#160;').replace(/  /g, '&#160;&#160;').replace(/> /g, ">&#160;");
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
	AI.select(AI.find(that, "li", 'hidden')[0], 'show');
	let list_length = AI.find(that, "li", 'hidden').length;
	if (list_length === 0) {
		list_length = "No";
		AI.find(that, ".hint_show").setAttribute("disabled", true);
	}
	AI.find(that, ".li_count").innerHTML = list_length;
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

//@TODO:? @abhishek does it match exactly with our PHP function?
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
				return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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
	obj.setAttribute(height, "100%");
	obj.setAttribute(width, "100%");
	let _height = document.body.clientHeight;
	iframeContent.querySelector(".editor_close").getAttribute("onclick", "window.parent.editorClose()");
	AI.setCss(iframeContent.querySelector("#authoringSection"), { maxHeight: _height - 140, minHeight: _height / 2 });
	AI.setCss(iframeContent.querySelector("#previewSection"), { minHeight: _height / 2, maxHeight: _height - 113 });
}

function editorClose() {
	AI.event("#editor_close_btn", 'click');
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
		AI.selectAll('input[name="exam_obj[]"]').forEach((elm)=> elm.setAttribute('checked',''));
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
					AI.insert('.parent_ul','<li class="radio parent_li_'+i+' my-2" tag_guid="'+i+'"><label class="border exam_obj_label d-flex p rounded"><input type="checkbox" class="exam_obj_radio h" id="radio_'+i+'" name="exam_obj[]" value="'+i+'" /><div class="mt-sm"></div><span>'+obj[i].n+'</span></label><ul class="child_ul list-unstyled"></ul></li>', 'beforeend');
					for (let j in obj[i].c) {
						AI.insert(AI.select('.parent_li_'+i).querySelector('.child_ul'), '<li class="radio child_li pl-4 my-2" tag_guid="'+j+'" ><label class="border exam_obj_label d-flex p rounded"><input type="checkbox" class="exam_obj_radio h" name="exam_obj[]" id="radio_'+j+'" value="'+j+'" /><div class="mt-sm"></div><span>'+obj[i].c[j].n+'</span></label></li>', 'beforeend');
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
		if (listItemText.indexOf(searchText)) {
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
	if (_this.getAttribute("checked") == '') {	
		_this.parentElement && (_this.parentElement.style.background = '#fff');
		 AI.selectAll("#assign_exam_obj", 'removeAttr', "disabled");
		_this.removeAttribute("checked");
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