
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, v as validate_slots, o as onMount, A as AH, L as beforeUpdate, w as writable, e as element, f as space, j as attr_dev, l as set_style, k as add_location, n as insert_dev, p as append_dev, q as listen_dev, B as noop, x as detach_dev, H as run_all } from './main-6c28fe47.js';

/* src\components\VideoPlus.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "src\\components\\VideoPlus.svelte";

function create_fragment(ctx) {
	let div2;
	let div0;
	let div0_contenteditable_value;
	let t;
	let div1;
	let div1_contenteditable_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			t = space();
			div1 = element("div");
			attr_dev(div0, "class", "tinymce-editor auth-editor");
			attr_dev(div0, "contenteditable", div0_contenteditable_value = true);
			attr_dev(div0, "id", "vtt");
			attr_dev(div0, "data-text", "Vtt");
			set_style(div0, "border-bottom", "1px solid #e7e7e7");
			set_style(div0, "margin", "5px 0 5px 0");
			set_style(div0, "whiteSpace", "pre-line");
			set_style(div0, "clear", "both");
			set_style(div0, "min-height", "125px");
			add_location(div0, file, 123, 4, 5131);
			attr_dev(div1, "class", "tinymce-editor auth-editor");
			attr_dev(div1, "contenteditable", div1_contenteditable_value = true);
			attr_dev(div1, "id", "info");
			attr_dev(div1, "data-text", "Info");
			set_style(div1, "border-bottom", "1px solid #e7e7e7");
			set_style(div1, "margin", "5px 0 5px 0");
			set_style(div1, "whiteSpace", "pre-line");
			set_style(div1, "clear", "both");
			set_style(div1, "min-height", "125px");
			add_location(div1, file, 131, 4, 5450);
			attr_dev(div2, "id", "authoringArea");
			add_location(div2, file, 122, 0, 5101);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div2, t);
			append_dev(div2, div1);

			if (!mounted) {
				dispose = [
					listen_dev(div0, "keyup", /*setContent*/ ctx[0].bind(this, 'vtt'), false, false, false),
					listen_dev(div1, "keyup", /*setContent*/ ctx[0].bind(this, 'info'), false, false, false)
				];

				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
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

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('VideoPlus', slots, []);
	let { setAjaxContent } = $$props;
	let { editorState } = $$props;
	let lastAction = "";
	let state = {};
	let hdd = writable({ sequence: '0', info: "", vtt: "" });

	const unsubscribe = hdd.subscribe(items => {
		state = items;
	});

	onMount(() => {
		if (setAjaxContent) {
			var ajaxPageData = setAjaxContent['page_data'];
			(state.vtt = setAjaxContent['vtt'], state.info = setAjaxContent['info']);

			if (ajaxPageData) {
				ajaxPageData = setAjaxContent['page_data'].replace(/id="update-vtt"/gmi, 'id="update-vtt" in_editor="1" ');
				AH.select('#previewSection').innerHTML = ajaxPageData;
			}
		}

		AH.listen(document, 'click', '#showPreview', updateVideoContent.bind(this));

		AH.listen(document, 'click', '#update-vtt', function (_this) {
			AH.selectAll(".text").forEach((elm, index) => {
				captions[index].text = elm.textContent;
			});

			var vtt_data = JSON.stringify(captions);
			$$invalidate(1, editorState.activator = true, editorState);

			AH.ajax({
				url: baseUrl + "editor/index.php",
				type: 'POST',
				data: {
					ajax: 1,
					content_guid: self.props.guid,
					text: vtt_data,
					tag: [],
					action: 'update_vtt',
					in_editor: 1
				}
			}).then(data => {
				try {
					AH.select('#save_xml').classList.remove('disabled');
					AH.select('#save_xml').setAttribute('disabled', false);
					data = JSON.parse(data);
					state.vtt = data.vtt;
					state.info = data.info;
					AH.select('#vtt').innerHTML = data.vtt;
					AH.select('#info').innerHTML = data.info;
					AH.select('#showPreview').click();
				} catch(err) {
					console.log({ err, func: 'componentDidMount @ 70' });
				}
			});
		});

		tinyMCE.PluginManager.add('changeInModule', function (editorPlugin, url) {
			editorPlugin.on('change click', function (e) {
				try {
					setContent(tinyMCE.activeEditor.id);
				} catch(error) {
					console.log({ error, func: 'loadVideoListener @ 1173' });
				}
			});
		});
	});

	beforeUpdate(async () => {
		let videoHeight = AH.select(".video-container").clientHeight;

		if (videoHeight > 100 && videoHeight > AH.select("#sidebar").clientHeight) {
			AH.select("#sidebar").style.height = videoHeight - (isNaN(AH.select('.sidetab_ul').clientHeight)
			? 0
			: AH.select('.sidetab_ul').clientHeight);

			let reduceHeight = videoHeight - (AH.select(".trans_toolbar").clientHeight + 10);
			AH.select("#transcript").style.height = reduceHeight;
			AH.selectAll("#transcript,.transcript-ul").forEach(elm => elm.style.height = AH.select('#video-container').outerHeight - AH.select('.sidetab_ul').outerHeight - 4 + 'px');
			AH.select('.video_comment_section').style.height = AH.select('#video-container').outerHeight - AH.select('.sidetab_ul').outerHeight - 4;
		}
	});

	function updateVideoContent() {
		var content = {};
		content['title'] = editorState.title;

		content['content'] = editorState.content
		? editorState.content.replace(/'/g, '"')
		: '';

		content['info'] = state.info;

		var vtt = state.vtt
		? state.vtt.replace(/<br>|<br\/>|<br \/>/gim, "\n").replace(/<span>|<\/span>/gim, '')
		: "";

		content['vtt'] = vtt.replace(/ \n|\n |\n/g, "\n");
		$$invalidate(1, editorState.activator = true, editorState);

		AH.ajax({
			url: baseUrl + 'editor/index.php',
			cache: false,
			data: {
				ajax: 1,
				content_guid: editorState.guid,
				title: content['title'],
				content: content['content'],
				info: content['info'],
				vtt: content['vtt'],
				content_type: 'f',
				content_subtype: '45',
				content_text: content,
				func: 'react_get_preview'
			}
		}).then(response => {
			response = JSON.parse(response);
			response['page_data'] = response['page_data'].replace(/id="update-vtt"/gmi, 'id="update-vtt" in_editor="1" ');
			AH.select('#previewSection').innerHTML = response['page_data'];
			$$invalidate(1, editorState.activator = false, editorState);
		});
	}

	function setContent(type) {
		lastAction ? clearTimeout(lastAction) : "";

		lastAction = setTimeout(
			function () {
				var content = tinyMCE.activeEditor.getContent({ format: 'raw' });
				content = content.replace(/<span class="nanospell-typo" data-mce-bogus="1">/g, '');
				content = content.replace(/<span class="" data-mce-bogus="1">/g, '');
				content.match(/<uc:syntax/gm) ? prettyPrint() : '';
				state[type] = content.replace(/<br>|<br\/>|<br \/>/gim, "\n").replace(/<span>|<\/span>/gim, '');
				updateVttAndInfo(state.vtt, state.info);
				clearTimeout(lastAction);
			},
			200
		);
	}

	function updateVttAndInfo(vtt, info) {
		$$invalidate(1, editorState.vtt = vtt, editorState);
		$$invalidate(1, editorState.info = info, editorState);
	}

	const writable_props = ['setAjaxContent', 'editorState'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<VideoPlus> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('setAjaxContent' in $$props) $$invalidate(2, setAjaxContent = $$props.setAjaxContent);
		if ('editorState' in $$props) $$invalidate(1, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		writable,
		beforeUpdate,
		onMount,
		AH,
		setAjaxContent,
		editorState,
		lastAction,
		state,
		hdd,
		unsubscribe,
		updateVideoContent,
		setContent,
		updateVttAndInfo
	});

	$$self.$inject_state = $$props => {
		if ('setAjaxContent' in $$props) $$invalidate(2, setAjaxContent = $$props.setAjaxContent);
		if ('editorState' in $$props) $$invalidate(1, editorState = $$props.editorState);
		if ('lastAction' in $$props) lastAction = $$props.lastAction;
		if ('state' in $$props) state = $$props.state;
		if ('hdd' in $$props) hdd = $$props.hdd;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [setContent, editorState, setAjaxContent];
}

class VideoPlus extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { setAjaxContent: 2, editorState: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "VideoPlus",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*setAjaxContent*/ ctx[2] === undefined && !('setAjaxContent' in props)) {
			console_1.warn("<VideoPlus> was created without expected prop 'setAjaxContent'");
		}

		if (/*editorState*/ ctx[1] === undefined && !('editorState' in props)) {
			console_1.warn("<VideoPlus> was created without expected prop 'editorState'");
		}
	}

	get setAjaxContent() {
		throw new Error("<VideoPlus>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set setAjaxContent(value) {
		throw new Error("<VideoPlus>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<VideoPlus>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<VideoPlus>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default VideoPlus;
//# sourceMappingURL=VideoPlus-94b60261.js.map
