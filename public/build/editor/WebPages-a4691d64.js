
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, M as append_styles, v as validate_slots, o as onMount, L as beforeUpdate, A as AH, am as editorConfig, a8 as afterUpdate, $ as tick, w as writable, e as element, j as attr_dev, k as add_location, n as insert_dev, al as action_destroyer, B as noop, x as detach_dev, C as validate_each_argument, D as validate_each_keys, z as empty, f as space, l as set_style, p as append_dev, q as listen_dev, H as run_all, I as update_keyed_each, J as destroy_block, E as is_function, a4 as HtmlTag } from './main-6c28fe47.js';

/* src\WebPages.svelte generated by Svelte v3.40.2 */
const file = "src\\WebPages.svelte";

function add_css(target) {
	append_styles(target, "svelte-1hjze4z", "\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViUGFnZXMuc3ZlbHRlIiwibWFwcGluZ3MiOiIiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsic3JjXFxXZWJQYWdlcy5zdmVsdGUiXX0= */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	child_ctx[18] = i;
	return child_ctx;
}

// (389:46) 
function create_if_block_2(ctx) {
	let div1;
	let html_tag;
	let raw0_value = /*getLabel*/ ctx[1]("Subject") + "";
	let t0;
	let div0;
	let div0_contenteditable_value;
	let t1;
	let html_tag_1;
	let raw1_value = /*getLabel*/ ctx[1]("Message") + "";
	let t2;
	let br;
	let t3;
	let textarea;
	let textarea_rows_value;
	let textarea_cols_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div1 = element("div");
			html_tag = new HtmlTag();
			t0 = space();
			div0 = element("div");
			t1 = space();
			html_tag_1 = new HtmlTag();
			t2 = space();
			br = element("br");
			t3 = space();
			textarea = element("textarea");
			html_tag.a = t0;
			attr_dev(div0, "class", "tinymce-editor auth-editor");
			attr_dev(div0, "contenteditable", div0_contenteditable_value = true);
			attr_dev(div0, "id", "subject");
			attr_dev(div0, "data-text", "Subject");
			set_style(div0, "border-bottom", "1px solid #e7e7e7");
			set_style(div0, "margin", "10px 0 5px 0");
			set_style(div0, "min-height", "80px");
			add_location(div0, file, 391, 12, 13717);
			html_tag_1.a = t2;
			add_location(br, file, 400, 12, 14114);
			attr_dev(textarea, "id", "message");
			attr_dev(textarea, "rows", textarea_rows_value = 10);
			attr_dev(textarea, "cols", textarea_cols_value = 90);
			attr_dev(textarea, "placeholder", "Message");
			textarea.value = "\t\r\n            ";
			add_location(textarea, file, 401, 12, 14133);
			add_location(div1, file, 389, 8, 13657);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			html_tag.m(raw0_value, div1);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div1, t1);
			html_tag_1.m(raw1_value, div1);
			append_dev(div1, t2);
			append_dev(div1, br);
			append_dev(div1, t3);
			append_dev(div1, textarea);

			if (!mounted) {
				dispose = [
					listen_dev(div0, "keyup", /*setContent*/ ctx[6].bind(this, "subject"), false, false, false),
					listen_dev(textarea, "Change", /*onMessagChange*/ ctx[5], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*getLabel*/ 2 && raw0_value !== (raw0_value = /*getLabel*/ ctx[1]("Subject") + "")) html_tag.p(raw0_value);
			if (dirty & /*getLabel*/ 2 && raw1_value !== (raw1_value = /*getLabel*/ ctx[1]("Message") + "")) html_tag_1.p(raw1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(389:46) ",
		ctx
	});

	return block;
}

// (373:4) {#if editorState.content_type == 'p'}
function create_if_block(ctx) {
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_1_anchor;
	let each_value = /*webData*/ ctx[3];
	validate_each_argument(each_value);
	const get_key = ctx => /*item*/ ctx[16].id;
	validate_each_keys(ctx, each_value, get_each_context, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*webData, setContent, getLabel, editorState*/ 75) {
				each_value = /*webData*/ ctx[3];
				validate_each_argument(each_value);
				validate_each_keys(ctx, each_value, get_each_context, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block, each_1_anchor, get_each_context);
			}
		},
		d: function destroy(detaching) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d(detaching);
			}

			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(373:4) {#if editorState.content_type == 'p'}",
		ctx
	});

	return block;
}

// (375:3) {#if item.view.includes(editorState.item)}
function create_if_block_1(ctx) {
	let div1;
	let html_tag;
	let raw_value = /*getLabel*/ ctx[1](/*item*/ ctx[16].label) + "";
	let t0;
	let div0;
	let div0_contenteditable_value;
	let t1;
	let div1_key_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div1 = element("div");
			html_tag = new HtmlTag();
			t0 = space();
			div0 = element("div");
			t1 = space();
			html_tag.a = t0;
			attr_dev(div0, "class", "tinymce-editor auth-editor");
			attr_dev(div0, "contenteditable", div0_contenteditable_value = true);
			attr_dev(div0, "id", "subject");
			attr_dev(div0, "data-text", "Subject");
			set_style(div0, "border-bottom", "1px solid #e7e7e7");
			set_style(div0, "margin", "10px 0 5px 0");
			set_style(div0, "min-height", "125px");
			add_location(div0, file, 377, 5, 13284);
			attr_dev(div1, "key", div1_key_value = /*item*/ ctx[16].id);
			add_location(div1, file, 375, 4, 13223);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			html_tag.m(raw_value, div1);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div1, t1);

			if (!mounted) {
				dispose = listen_dev(
					div0,
					"keyup",
					function () {
						if (is_function(/*setContent*/ ctx[6].bind(this, /*item*/ ctx[16].arg))) /*setContent*/ ctx[6].bind(this, /*item*/ ctx[16].arg).apply(this, arguments);
					},
					false,
					false,
					false
				);

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*getLabel, webData*/ 10 && raw_value !== (raw_value = /*getLabel*/ ctx[1](/*item*/ ctx[16].label) + "")) html_tag.p(raw_value);

			if (dirty & /*webData*/ 8 && div1_key_value !== (div1_key_value = /*item*/ ctx[16].id)) {
				attr_dev(div1, "key", div1_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(375:3) {#if item.view.includes(editorState.item)}",
		ctx
	});

	return block;
}

// (374:2) {#each webData as item, i (item.id)}
function create_each_block(key_1, ctx) {
	let first;
	let show_if = /*item*/ ctx[16].view.includes(/*editorState*/ ctx[0].item);
	let if_block_anchor;
	let if_block = show_if && create_if_block_1(ctx);

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			first = empty();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			this.first = first;
		},
		m: function mount(target, anchor) {
			insert_dev(target, first, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*webData, editorState*/ 9) show_if = /*item*/ ctx[16].view.includes(/*editorState*/ ctx[0].item);

			if (show_if) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(first);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(374:2) {#each webData as item, i (item.id)}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div;
	let didMount_action;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*editorState*/ ctx[0].content_type == 'p') return create_if_block;
		if (/*editorState*/ ctx[0].content_type == 'e') return create_if_block_2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(div, "id", "webPagesAuthoring");
			add_location(div, file, 371, 0, 13034);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);

			if (!mounted) {
				dispose = action_destroyer(didMount_action = /*didMount*/ ctx[2].call(null, div, /*activated*/ ctx[4]));
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);

			if (if_block) {
				if_block.d();
			}

			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function sendToFrame(data) {
	let allStyles = document.querySelectorAll('style');
	let allStylesLink = document.querySelectorAll('link');
	let allScripts = document.querySelectorAll('script');
	let Alltags = [allStyles, allStylesLink, allScripts];
	let libs = "";

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < Alltags[i].length; j++) {
			if ((/bundle\.js/gm).test(Alltags[i][j].outerHTML)) {
				continue;
			}

			libs += Alltags[i][j].outerHTML;
		}
	}

	let fullData = "<!DOCTYPE html><html><head>" + libs + "</head><body>" + data + "</body></html>";
	let frame = document.querySelector("#layoutMode").firstElementChild;
	frame.className = "fwidth border-0";
	frame.style.cssText = "min-height: 600px;";
	let iframeDoc = frame.contentDocument;
	iframeDoc.open();
	iframeDoc.write(fullData);
	iframeDoc.close();

	let frameInterval = setInterval(
		function () {
			let imgTags = iframeDoc.querySelectorAll(".video_preview img");

			if (imgTags.length > 0) {
				for (let i = 0; i < imgTags.length; i++) {
					imgTags[i].style.cssText = "transform:unset";
				}

				clearInterval(frameInterval);
			}
		},
		300
	);
}

function loadComponent() {
	let comp = [
		{
			label: "Exam",
			id: "exam",
			arg: "exam",
			view: [0]
		},
		{
			label: "Exam Details",
			id: "examdetails",
			arg: "examdetails",
			view: [0]
		},
		{
			label: "Meta Title",
			id: "meta_title",
			arg: "meta_title",
			view: [0, 1, 2, 3]
		},
		{
			label: "Meta Description",
			id: "meta_description",
			arg: "meta_description",
			view: [0, 1, 2, 3]
		},
		{
			label: "Meta Keywords",
			id: "meta_keywords",
			arg: "meta_keywords",
			view: [0, 1, 2, 3]
		},
		{
			label: "Google Suggestion",
			id: "google_suggestion",
			arg: "google_suggestion",
			view: [0, 1, 2]
		},
		{
			label: "Exam Groups",
			id: "exam_groups",
			arg: "exam_groups",
			view: [1]
		},
		{
			label: "Requirements",
			id: "requirements",
			arg: "requirements",
			view: [1]
		},
		{
			label: "Header",
			id: "header",
			arg: "header",
			view: [0, 2, 3]
		},
		{
			label: "Heading",
			id: "heading",
			arg: "heading",
			view: [3]
		},
		{
			label: "Details",
			id: "details",
			arg: "details",
			view: [3]
		},
		{
			label: "Content",
			id: "Content",
			arg: "Content",
			view: [3]
		},
		{
			label: "Usefull Links",
			id: "usefull_links",
			arg: "usefull_links",
			view: [3]
		},
		{
			label: "About",
			id: "about",
			arg: "about",
			view: [0, 1, 2]
		},
		{
			label: "About More",
			id: "about_more",
			arg: "about_more",
			view: [1, 2]
		},
		{
			label: "Footer",
			id: "footer",
			arg: "footer",
			view: [2]
		}
	];

	return comp;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('WebPages', slots, []);
	let { editorState } = $$props;
	let { content_guid } = $$props;
	let { getLabel } = $$props;
	let { didMount } = $$props;
	let webData = [];
	let activated;
	let state = {};

	let hdd = writable({
		content_type: "",
		content_subtype: "",
		exam: "",
		examdetails: "",
		subject: "",
		message: "",
		meta_title: "",
		meta_keywords: "",
		meta_description: "",
		meta_keywords: "",
		google_suggestion: "",
		exam_groups: "",
		requirements: "",
		about: "",
		about_more: "",
		header: "",
		footer: "",
		usefull_Links: "",
		content: "",
		details: "",
		Heading: ""
	});

	const unsubscribe = hdd.subscribe(item => {
		state = item;
	});

	onMount(async () => {
		$$invalidate(3, webData = loadComponent());

		if (editorState.viewConfig.showRefresh) {
			AI.set(editorState.content_type + "_refresh", refreshWebPage);
		}

		state.content_type = editorState.content_type;
		state.content_subtype = editorState.item;
		afterInit();
	});

	beforeUpdate(async () => {
		if (editorState.webpageArray != state.webpageArray) {
			for (let i in editorState.webpageArray) {
				state[i] = editorState.webpageArray[i];
			}

			state.webpageArray = editorState.webpageArray;

			setTimeout(
				function () {
					webPageData(getDataToSend(1));
				},
				200
			);
		}
	});

	function webPageData(data) {
		$$invalidate(0, editorState.webPageData = data, editorState);
	}

	function afterInit() {
		if (editorState.content_type == "e") {
			AH.insert('#content_show', '<div id="subject_show" class="pt-md bold" style="whiteSpace:pre-line;wordWrap:break-word;"></div><div id="message_show" class="pt-md" style="whiteSpace:pre-line;wordWrap:break-word;"></div>', 'afterend');
		}

		setTimeout(
			function () {
				updatePreview();
			},
			200
		);

		AH.listen('body', 'click', '#showPreview', _this => {
			let data = getDataToSend();
			$$invalidate(0, editorState.activator = true, editorState);

			AH.ajax({
				url: baseUrl + 'editor/index.php',
				data,
				type: 'post'
			}).then(response => {
				response = JSON.parse(response);

				if (editorState.propsAjaxData['page_data']) {
					document.querySelector('#layoutMode').innerHTML = "<iframe></iframe>";
					sendToFrame(response["page_data"]);
				}

				
				$$invalidate(0, editorState.activator = false, editorState);
			});
		});

		tinyMCE.PluginManager.add('changeInModule', function (editorPlugin) {
			editorPlugin.on('change click ExecCommand keyup', function (e) {
				try {
					setContent(tinyMCE.activeEditor.id);
				} catch(e) {
					
				}
			});
		});
	}

	function onMessagChange(event) {
		let content = event.target.value;
		document.querySelector('#message_show').innerHTML = get_ucsyntax(content);
		if (content.match(/<uc:syntax/gm)) prettyPrint();
		state.message = seqTag(content).replace(/&lsqb;/g, "[");
		webPageData(getDataToSend(1));
		let xmlRef = AH.select('#save_xml');

		if (xmlRef.classList.contains('disabled') && xmlRef.getAttribute('disabled') == "disabled") {
			if (editor.save == 1) {
				AH.select(xmlRef, 'removeClass', 'disabled');
				xmlRef.disabled = false;
			} else {
				AH.select(xmlRef, 'addClass', 'disabled');
				xmlRef.disabled = true;
			}
		}
	}

	function setContent(e) {
		let selector = typeof e == 'object' ? e.target.id : e;
		let content = tinyMCE.activeEditor.getContent({ format: 'raw' });
		document.querySelector('#' + selector + '_show').innerHTML = get_ucsyntax(content);
		if (content.match(/<uc:syntax/gm)) prettyPrint();
		let contentClear = AH.select('#webpageContentShow', 'html', tinyMCE.activeEditor.getContent());
		contentClear = contentClear.textContent; //Removing special symbol
		state[selector] = seqTag(contentClear, 1);
		webPageData(getDataToSend(1));
	}

	function refreshWebPage() {
		activate(2);

		AH.ajax({
			url: baseUrl + 'editor/index.php',
			cache: false,
			data: {
				ajax: "1",
				action: 'get_web_page_data',
				content_guid: editorState.content_guid,
				content_text: editorState.currentWebPageData
			},
			type: 'post'
		}).then(response => {
			document.querySelector('#layoutMode').innerHTML = "<iframe></iframe>";
			sendToFrame(response);
			activate(0);
		});
	}

	function getDataToSend(forSave = 0) {
		let data = {};

		if (state.content_type == 'p') {
			switch (parseInt(state.content_subtype)) {
				case 0:
					data['exam'] = seqTag(state.exam);
					data['examdetails'] = seqTag(state.examdetails);
					data['meta_title'] = seqTag(state.meta_title);
					data['meta_description'] = seqTag(state.meta_description);
					data['meta_keywords'] = seqTag(state.meta_keywords);
					data['google_suggestion'] = seqTag(state.google_suggestion);
					data['exam_groups'] = seqTag(state.exam_groups);
					data['header'] = seqTag(state.header);
					data['about'] = seqTag(state.about);
				case 1:
					data['meta_title'] = seqTag(state.meta_title);
					data['meta_keywords'] = seqTag(state.meta_keywords);
					data['meta_description'] = seqTag(state.meta_description);
					data['google_suggestion'] = seqTag(state.google_suggestion);
					data['exam_groups'] = seqTag(state.exam_groups);
					data['requirements'] = seqTag(state.requirements);
					data['about'] = seqTag(state.about);
					data['about_more'] = seqTag(state.about_more);
				case 2:
					data['meta_title'] = seqTag(state.meta_title);
					data['meta_description'] = seqTag(state.meta_description);
					data['meta_keywords'] = seqTag(state.meta_keywords);
					data['about'] = seqTag(state.about);
					data['about_more'] = seqTag(state.about_more);
					data['google_suggestion'] = seqTag(state.google_suggestion);
					data['header'] = seqTag(state.header);
					data['footer'] = seqTag(state.footer);
				case 3:
					data['meta_title'] = seqTag(state.meta_title);
					data['meta_description'] = seqTag(state.meta_description);
					data['meta_keywords'] = seqTag(state.meta_keywords);
					data['heading'] = seqTag(state.heading);
					data['details'] = seqTag(state.details);
					data['header'] = seqTag(state.header);
					data['content'] = seqTag(state.content);
					data['usefull_links'] = seqTag(state.usefull_links);
				default:
					data['exam'] = seqTag(state.exam);
					data['examdetails'] = seqTag(state.examdetails);
			}
		} else if (state.content_type == 'e') {
			data['subject'] = br2nl(state.subject);
			data['message'] = br2nl(state.message);
		}

		if (forSave) {
			data['content_icon'] = 0;
			data['course_code'] = editor.course;
			data['action'] = 'save';
		} else {
			data['func'] = 'react_get_preview';
			data['ajax'] = '1';
		}

		data['content_guid'] = state.content_type == 'p'
		? AH.select('#show_guid').innerHTML
		: content_guid;

		data['content_type'] = state.content_type;
		data['content_subtype'] = state.content_subtype;

		state.content_type == 'p'
		? data['webpage'] = AH.select('#show_guid').innerHTML
		: "";

		return JSON.parse(JSON.stringify(data));
	}

	function updatePreview(setAjaxContent = editorState.propsAjaxData) {
		if (setAjaxContent) {
			for (let i in setAjaxContent) {
				if (state[i] != undefined) {
					state[i] = setAjaxContent[i];

					if (AI.isValid(setAjaxContent[i])) {
						AH.selectAll(`#${i}, #${i}_show`, 'html', setAjaxContent[i].replace(/\n/g, '<br />'));

						i == 'message'
						? AH.select('#message', 'value', setAjaxContent[i].replace(/\n/g, '<br />'))
						: "";
					}
				}
			}

			webPageData(getDataToSend(1));

			if (setAjaxContent['page_data']) {
				AH.select('#layoutMode', 'html', "<iframe></iframe>");
				sendToFrame(setAjaxContent['page_data']);
			}

			
		} else {
			AH.select("#exam", 'html', editorConfig.getWebpageTags('exam'));
			AH.select("#examdetails", 'html', editorConfig.getWebpageTags('examdetails'));
		}
	}

	const writable_props = ['editorState', 'content_guid', 'getLabel', 'didMount'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WebPages> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('editorState' in $$props) $$invalidate(0, editorState = $$props.editorState);
		if ('content_guid' in $$props) $$invalidate(7, content_guid = $$props.content_guid);
		if ('getLabel' in $$props) $$invalidate(1, getLabel = $$props.getLabel);
		if ('didMount' in $$props) $$invalidate(2, didMount = $$props.didMount);
	};

	$$self.$capture_state = () => ({
		onMount,
		beforeUpdate,
		afterUpdate,
		tick,
		writable,
		AH,
		editorConfig,
		editorState,
		content_guid,
		getLabel,
		didMount,
		webData,
		activated,
		state,
		hdd,
		unsubscribe,
		webPageData,
		afterInit,
		onMessagChange,
		setContent,
		refreshWebPage,
		sendToFrame,
		getDataToSend,
		updatePreview,
		loadComponent
	});

	$$self.$inject_state = $$props => {
		if ('editorState' in $$props) $$invalidate(0, editorState = $$props.editorState);
		if ('content_guid' in $$props) $$invalidate(7, content_guid = $$props.content_guid);
		if ('getLabel' in $$props) $$invalidate(1, getLabel = $$props.getLabel);
		if ('didMount' in $$props) $$invalidate(2, didMount = $$props.didMount);
		if ('webData' in $$props) $$invalidate(3, webData = $$props.webData);
		if ('activated' in $$props) $$invalidate(4, activated = $$props.activated);
		if ('state' in $$props) state = $$props.state;
		if ('hdd' in $$props) hdd = $$props.hdd;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		editorState,
		getLabel,
		didMount,
		webData,
		activated,
		onMessagChange,
		setContent,
		content_guid
	];
}

class WebPages extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				editorState: 0,
				content_guid: 7,
				getLabel: 1,
				didMount: 2
			},
			add_css
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "WebPages",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*editorState*/ ctx[0] === undefined && !('editorState' in props)) {
			console.warn("<WebPages> was created without expected prop 'editorState'");
		}

		if (/*content_guid*/ ctx[7] === undefined && !('content_guid' in props)) {
			console.warn("<WebPages> was created without expected prop 'content_guid'");
		}

		if (/*getLabel*/ ctx[1] === undefined && !('getLabel' in props)) {
			console.warn("<WebPages> was created without expected prop 'getLabel'");
		}

		if (/*didMount*/ ctx[2] === undefined && !('didMount' in props)) {
			console.warn("<WebPages> was created without expected prop 'didMount'");
		}
	}

	get editorState() {
		throw new Error("<WebPages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<WebPages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get content_guid() {
		throw new Error("<WebPages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set content_guid(value) {
		throw new Error("<WebPages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getLabel() {
		throw new Error("<WebPages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getLabel(value) {
		throw new Error("<WebPages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get didMount() {
		throw new Error("<WebPages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set didMount(value) {
		throw new Error("<WebPages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default WebPages;
//# sourceMappingURL=WebPages-a4691d64.js.map
