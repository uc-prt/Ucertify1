
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, J as append_styles, v as validate_slots, I as beforeUpdate, o as onMount, A as AH, y as l, X as XMLToJSON, w as writable, K as JSONToXML, C as validate_each_argument, z as empty, n as insert_dev, H as destroy_each, x as detach_dev, e as element, h as text, f as space, j as attr_dev, k as add_location, l as set_style, p as append_dev, q as listen_dev, E as set_data_dev, B as noop, G as run_all } from './main-34a3b679.js';

/* clsSMHotspot\HotspotToken.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMHotspot\\HotspotToken.svelte";

function add_css(target) {
	append_styles(target, "svelte-1cdvsco", ".token_selected.svelte-1cdvsco{background-color:#64bb63;color:#fff}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90c3BvdFRva2VuLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUFnV0ksZUFBZSxlQUFDLENBQUMsQUFDYixnQkFBZ0IsQ0FBRSxPQUFPLENBQ3pCLEtBQUssQ0FBRSxJQUFJLEFBQ2YsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJIb3RzcG90VG9rZW4uc3ZlbHRlIl19 */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	child_ctx[22] = i;
	return child_ctx;
}

// (315:8) {#if state.itemLayout}
function create_if_block(ctx) {
	let each_1_anchor;
	let each_value = /*state*/ ctx[0].itemLayout;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
			if (dirty & /*state, setSelected*/ 17) {
				each_value = /*state*/ ctx[0].itemLayout;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(315:8) {#if state.itemLayout}",
		ctx
	});

	return block;
}

// (328:16) {:else}
function create_else_block(ctx) {
	let div;
	let t0_value = /*data*/ ctx[20].value + "";
	let t0;
	let t1;
	let div_data_id_value;
	let div_data_selected_value;
	let div_class_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(div, "data-id", div_data_id_value = "ID" + /*i*/ ctx[22]);
			attr_dev(div, "data-selected", div_data_selected_value = /*data*/ ctx[20].selected);
			attr_dev(div, "tabindex", "0");

			attr_dev(div, "class", div_class_value = "token float-start mx-1 mb-1 p-1 border border-secondary pointer text-left " + (/*data*/ ctx[20].selected
			? 'token_selected'
			: 'token bg-white') + " svelte-1cdvsco");

			set_style(div, "user-select", "none");
			set_style(div, "border-radius", "3px");
			set_style(div, "font", "14px");
			add_location(div, file, 328, 20, 12751);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t0);
			append_dev(div, t1);

			if (!mounted) {
				dispose = listen_dev(div, "click", /*setSelected*/ ctx[4].bind(this, /*i*/ ctx[22]), false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*state*/ 1 && t0_value !== (t0_value = /*data*/ ctx[20].value + "")) set_data_dev(t0, t0_value);

			if (dirty & /*state*/ 1 && div_data_selected_value !== (div_data_selected_value = /*data*/ ctx[20].selected)) {
				attr_dev(div, "data-selected", div_data_selected_value);
			}

			if (dirty & /*state*/ 1 && div_class_value !== (div_class_value = "token float-start mx-1 mb-1 p-1 border border-secondary pointer text-left " + (/*data*/ ctx[20].selected
			? 'token_selected'
			: 'token bg-white') + " svelte-1cdvsco")) {
				attr_dev(div, "class", div_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(328:16) {:else}",
		ctx
	});

	return block;
}

// (326:53) 
function create_if_block_2(ctx) {
	let br;

	const block = {
		c: function create() {
			br = element("br");
			add_location(br, file, 326, 20, 12699);
		},
		m: function mount(target, anchor) {
			insert_dev(target, br, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(br);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(326:53) ",
		ctx
	});

	return block;
}

// (317:16) {#if data.value == "," || data.value == "."}
function create_if_block_1(ctx) {
	let div;
	let span;
	let t0_value = /*data*/ ctx[20].value + "";
	let t0;
	let t1;

	const block = {
		c: function create() {
			div = element("div");
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(span, "class", "position-absolute float-start top5");
			set_style(span, "left", "-3px");
			add_location(span, file, 318, 24, 12366);
			attr_dev(div, "class", "float-start position-relative done_percent_bar");
			set_style(div, "width", "2px");
			add_location(div, file, 317, 20, 12261);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, span);
			append_dev(span, t0);
			append_dev(div, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*state*/ 1 && t0_value !== (t0_value = /*data*/ ctx[20].value + "")) set_data_dev(t0, t0_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(317:16) {#if data.value == \\\",\\\" || data.value == \\\".\\\"}",
		ctx
	});

	return block;
}

// (316:12) {#each state.itemLayout as data, i }
function create_each_block(ctx) {
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (/*data*/ ctx[20].value == "," || /*data*/ ctx[20].value == ".") return create_if_block_1;
		if (/*data*/ ctx[20].value == "#newline#") return create_if_block_2;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d: function destroy(detaching) {
			if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(316:12) {#each state.itemLayout as data, i }",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div9;
	let div3;
	let div0;
	let button0;
	let t0_value = l.edit_template + "";
	let t0;
	let button0_class_value;
	let t1;
	let button1;
	let t2_value = l.edit_token + "";
	let t2;
	let button1_class_value;
	let t3;
	let div2;
	let div1;
	let button2;
	let t4_value = l.word + "";
	let t4;
	let button2_class_value;
	let t5;
	let button3;
	let t6_value = l.sentance + "";
	let t6;
	let button3_class_value;
	let t7;
	let button4;
	let t8_value = l.paragraph + "";
	let t8;
	let button4_class_value;
	let t9;
	let button5;
	let t11;
	let textarea;
	let t12;
	let div5;
	let div4;
	let t13;
	let div7;
	let div6;
	let t14_value = /*state*/ ctx[0].correctAns.length + "";
	let t14;
	let t15;
	let t16_value = l.no_of_token + "";
	let t16;
	let t17;
	let div8;
	let span0;
	let t20;
	let span1;
	let mounted;
	let dispose;
	let if_block = /*state*/ ctx[0].itemLayout && create_if_block(ctx);

	const block = {
		c: function create() {
			div9 = element("div");
			div3 = element("div");
			div0 = element("div");
			button0 = element("button");
			t0 = text(t0_value);
			t1 = space();
			button1 = element("button");
			t2 = text(t2_value);
			t3 = space();
			div2 = element("div");
			div1 = element("div");
			button2 = element("button");
			t4 = text(t4_value);
			t5 = space();
			button3 = element("button");
			t6 = text(t6_value);
			t7 = space();
			button4 = element("button");
			t8 = text(t8_value);
			t9 = space();
			button5 = element("button");
			button5.textContent = `${l.clear}`;
			t11 = space();
			textarea = element("textarea");
			t12 = space();
			div5 = element("div");
			div4 = element("div");
			if (if_block) if_block.c();
			t13 = space();
			div7 = element("div");
			div6 = element("div");
			t14 = text(t14_value);
			t15 = space();
			t16 = text(t16_value);
			t17 = space();
			div8 = element("div");
			span0 = element("span");
			span0.textContent = `* ${l.note_label}`;
			t20 = space();
			span1 = element("span");
			span1.textContent = `${l.token_message}`;
			attr_dev(button0, "type", "button");

			attr_dev(button0, "class", button0_class_value = /*state*/ ctx[0].viewTemplate == "block"
			? "btn btn-light active"
			: "btn btn-light ");

			add_location(button0, file, 263, 12, 9958);
			attr_dev(button1, "type", "button");

			attr_dev(button1, "class", button1_class_value = /*state*/ ctx[0].viewToken == "block"
			? "btn btn-light active"
			: "btn btn-light");

			add_location(button1, file, 270, 12, 10261);
			attr_dev(div0, "class", "btn-group amazonpaybutton mb-2 mr-4");
			attr_dev(div0, "role", "group");
			add_location(div0, file, 262, 8, 9882);
			attr_dev(button2, "type", "button");

			attr_dev(button2, "class", button2_class_value = /*state*/ ctx[0].activeToken == "w"
			? "btn btn-light active"
			: "btn btn-light");

			add_location(button2, file, 280, 16, 10679);
			attr_dev(button3, "type", "button");

			attr_dev(button3, "class", button3_class_value = /*state*/ ctx[0].activeToken == "s"
			? "btn btn-light active"
			: "btn btn-light");

			add_location(button3, file, 287, 16, 10981);
			attr_dev(button4, "type", "button");

			attr_dev(button4, "class", button4_class_value = /*state*/ ctx[0].activeToken == "p"
			? "btn btn-light active"
			: "btn btn-light");

			add_location(button4, file, 294, 16, 11287);
			attr_dev(div1, "class", "btn-group border-0 bg-none");
			add_location(div1, file, 279, 12, 10621);
			attr_dev(button5, "type", "button");
			attr_dev(button5, "class", "btn btn-outline-primary ml-2");
			add_location(button5, file, 302, 12, 11609);
			set_style(div2, "display", /*state*/ ctx[0].viewToken);
			add_location(div2, file, 278, 8, 10567);
			attr_dev(div3, "class", "row ml-sm2");
			add_location(div3, file, 261, 4, 9848);
			set_style(textarea, "display", /*state*/ ctx[0].viewTemplate);
			attr_dev(textarea, "rows", "10");
			attr_dev(textarea, "cols", "65");
			attr_dev(textarea, "class", "text_area p-2 mt-3 fwidth");
			add_location(textarea, file, 305, 4, 11753);
			attr_dev(div4, "class", "d-inline-block px-1 py-2 word_break");
			add_location(div4, file, 313, 8, 12046);
			set_style(div5, "display", /*state*/ ctx[0].viewToken);
			attr_dev(div5, "class", "mt-3 light-cyan-bg border");
			add_location(div5, file, 312, 4, 11962);
			attr_dev(div6, "class", "pl-2 pt-2 font-weight-bold");
			add_location(div6, file, 344, 8, 13428);
			set_style(div7, "display", /*state*/ ctx[0].viewToken);
			add_location(div7, file, 343, 4, 13378);
			attr_dev(span0, "class", "font-weight-bolder");
			add_location(span0, file, 347, 8, 13598);
			add_location(span1, file, 348, 8, 13664);
			attr_dev(div8, "class", "text-danger pl-2 pt-2");
			set_style(div8, "font", "13px");
			add_location(div8, file, 346, 4, 13533);
			attr_dev(div9, "class", "hotspot-token p-2 border");
			add_location(div9, file, 260, 0, 9804);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div9, anchor);
			append_dev(div9, div3);
			append_dev(div3, div0);
			append_dev(div0, button0);
			append_dev(button0, t0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, t2);
			append_dev(div3, t3);
			append_dev(div3, div2);
			append_dev(div2, div1);
			append_dev(div1, button2);
			append_dev(button2, t4);
			append_dev(div1, t5);
			append_dev(div1, button3);
			append_dev(button3, t6);
			append_dev(div1, t7);
			append_dev(div1, button4);
			append_dev(button4, t8);
			append_dev(div2, t9);
			append_dev(div2, button5);
			append_dev(div9, t11);
			append_dev(div9, textarea);
			append_dev(div9, t12);
			append_dev(div9, div5);
			append_dev(div5, div4);
			if (if_block) if_block.m(div4, null);
			append_dev(div9, t13);
			append_dev(div9, div7);
			append_dev(div7, div6);
			append_dev(div6, t14);
			append_dev(div6, t15);
			append_dev(div6, t16);
			append_dev(div9, t17);
			append_dev(div9, div8);
			append_dev(div8, span0);
			append_dev(div8, t20);
			append_dev(div8, span1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*toggleTemplateToken*/ ctx[2].bind(this, "none", "block"), false, false, false),
					listen_dev(button1, "click", /*toggleTemplateToken*/ ctx[2].bind(this, "block", "none"), false, false, false),
					listen_dev(button2, "click", /*setTemplateType*/ ctx[3].bind(this, "w"), false, false, false),
					listen_dev(button3, "click", /*setTemplateType*/ ctx[3].bind(this, "s"), false, false, false),
					listen_dev(button4, "click", /*setTemplateType*/ ctx[3].bind(this, "p"), false, false, false),
					listen_dev(button5, "click", /*clearToken*/ ctx[5].bind(this), false, false, false),
					listen_dev(textarea, "change", /*updateCdata*/ ctx[1].bind(this), false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*state*/ 1 && button0_class_value !== (button0_class_value = /*state*/ ctx[0].viewTemplate == "block"
			? "btn btn-light active"
			: "btn btn-light ")) {
				attr_dev(button0, "class", button0_class_value);
			}

			if (dirty & /*state*/ 1 && button1_class_value !== (button1_class_value = /*state*/ ctx[0].viewToken == "block"
			? "btn btn-light active"
			: "btn btn-light")) {
				attr_dev(button1, "class", button1_class_value);
			}

			if (dirty & /*state*/ 1 && button2_class_value !== (button2_class_value = /*state*/ ctx[0].activeToken == "w"
			? "btn btn-light active"
			: "btn btn-light")) {
				attr_dev(button2, "class", button2_class_value);
			}

			if (dirty & /*state*/ 1 && button3_class_value !== (button3_class_value = /*state*/ ctx[0].activeToken == "s"
			? "btn btn-light active"
			: "btn btn-light")) {
				attr_dev(button3, "class", button3_class_value);
			}

			if (dirty & /*state*/ 1 && button4_class_value !== (button4_class_value = /*state*/ ctx[0].activeToken == "p"
			? "btn btn-light active"
			: "btn btn-light")) {
				attr_dev(button4, "class", button4_class_value);
			}

			if (dirty & /*state*/ 1) {
				set_style(div2, "display", /*state*/ ctx[0].viewToken);
			}

			if (dirty & /*state*/ 1) {
				set_style(textarea, "display", /*state*/ ctx[0].viewTemplate);
			}

			if (/*state*/ ctx[0].itemLayout) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div4, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*state*/ 1) {
				set_style(div5, "display", /*state*/ ctx[0].viewToken);
			}

			if (dirty & /*state*/ 1 && t14_value !== (t14_value = /*state*/ ctx[0].correctAns.length + "")) set_data_dev(t14, t14_value);

			if (dirty & /*state*/ 1) {
				set_style(div7, "display", /*state*/ ctx[0].viewToken);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div9);
			if (if_block) if_block.d();
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
	validate_slots('HotspotToken', slots, []);
	let { xml } = $$props;
	let { isReview } = $$props;
	let { editorState } = $$props;
	let { getChildXml } = $$props;
	let state = {};

	let hdd = writable({
		xml: "",
		cdata: "",
		viewToken: "",
		viewTemplate: "",
		correctAns: [],
		itemLayout: [],
		activeToken: "",
		confirmDialog: false
	});

	const unsub = hdd.subscribe(items => {
		$$invalidate(0, state = items);
	});

	// calls whenever there is change in state or props 
	beforeUpdate(() => {
		// check if there is change in xml
		if (xml != state.xml) {
			$$invalidate(0, state.xml = xml, state);

			// for refreshing the module with new xml
			loadModule(xml);
		}
	});

	// called just after rendering
	onMount(() => {
		// check the conditions if it is IE
		// if (isIE) {
		//     AH.listen(document, "keyup", ".hotspot-token .token", (_this, event)=> {
		//         // binding the enter key in case of ada
		//         if (event.which == 13) {
		//             AH.trigger(_this, 'click');
		//         }
		//     });
		// }
		// storing and updating the xml
		getChildXml(xml + " ");

		// for showing the Enter text tab by default 
		toggleTemplateToken("none", "block");

		// for showing the text into the editable area of the Enter text
		AH.selectAll('.text_area', 'value', state.cdata.trim().replace(/[ ]+/gm, ' '));

		// function for showing warning for the unneccessary space
		AH.bind(".text_area", "keydown", event => {
			let key_pressed = event;
			var element_name = document.querySelector('.text_area');

			// getting start pos
			var startPos = element_name.selectionStart;

			// getting end pos
			var endPos = element_name.selectionEnd;

			if (endPos == startPos) {
				// if space key is pressed
				if (key_pressed.which == 32) {
					if (AH.select('.text_area').value.charAt(startPos - 1) == " " || AH.select('.text_area').value.charAt(startPos) == " ") {
						AH.alert(l.space_warning);
						key_pressed.preventDefault();
					}
				}
			}
		});
	});

	// parse the xml and load the module accordingly
	function loadModule(loadXml) {
		// Here xml is converted into the json and pass into the parseXMLAuthoring for xml parsing
		loadXml = XMLToJSON(loadXml);

		parseXMLAuthoring(loadXml);
	}

	// parsing the xml for authoring
	async function parseXMLAuthoring(MYXML) {
		// getting the correct ans sepereted by , in array format
		$$invalidate(
			0,
			state.correctAns = MYXML.smxml.div._correctAns.trim()
			? MYXML.smxml.div._correctAns.split(",")
			: [],
			state
		);

		$$invalidate(0, state.cdata = MYXML.smxml.div.__cdata, state);
		$$invalidate(0, state.activeToken = MYXML.smxml.div._type, state);

		// switching the module on the basis of the type used
		switch (MYXML.smxml.div._type) {
			case "w":
				// in case of word
				parseWord(state.cdata);
				break;
			case "s":
				// in case of sentence
				parseSentance(state.cdata);
				break;
			case "p":
				// in case of paragraph
				parseParagraph(state.cdata);
				break;
			default:
				console.warn("No type found to parse");
				break;
		}
	}

	// parsing the word
	function parseWord(str) {
		// replace the newline with " #newline# "
		str = str.replace(/\n/g, " #newline# ");

		//Split the string with space and remove array which contain null value
		let word = str.split(" ").map(item => {
			return item.trim();
		}).filter(arr => {
			return arr != "";
		});

		let tempWord = [];

		/* split punctuation mark in word and store in the tempWord array */
		word.map((data, i) => {
			let special_symbol = data.match(/[.,]/g);

			if (special_symbol) {
				let splitText = data.split(special_symbol[0]);
				tempWord.push(splitText[0]);
				tempWord.push(special_symbol[0]);

				if (splitText[1].trim()) {
					tempWord.push(splitText[1]);
				}
			} else {
				tempWord.push(data);
			}
		});

		/*end*/
		let wordArray = [];

		// store id, value and selected in wordArray
		// Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
		tempWord.map((data, i) => {
			wordArray.push({
				id: "ID" + i,
				value: data,
				selected: getSelected(i)
			});
		});

		$$invalidate(0, state.itemLayout = wordArray, state);
	}

	// parsing the sentence
	function parseSentance(str) {
		//Split the string with fullstop and remove array which contain null value
		let sentance = str.split(".").map(item => {
			return item.trim();
		}).filter(arr => {
			return arr != "";
		});

		let sentanceArray = [];

		// store id, value and selected in sentanceArray
		// Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
		sentance.map((data, i) => {
			sentanceArray.push({
				id: "ID" + i,
				value: data + ".",
				selected: getSelected(i)
			});
		});

		$$invalidate(0, state.itemLayout = sentanceArray, state);
	}

	// parsing the paragraph
	function parseParagraph(str) {
		//Split the string with paragraph and remove array which contain null value
		let paragraph = str.split("\n").map(item => {
			return item.trim();
		}).filter(arr => {
			return arr != "";
		});

		let paragraphArray = [];

		// store id, value and selected in paragraphArray
		// Here id is unique id of that element , value stores the element value and selected stores wether it is selected or not
		paragraph.map((data, i) => {
			paragraphArray.push({
				id: "ID" + i,
				value: data,
				selected: getSelected(i)
			});
		});

		$$invalidate(0, state.itemLayout = paragraphArray, state);
	}

	// update the cdata whenever there is chamge in textarea
	function updateCdata(e) {
		// convert the XML into JSON using XMLToJSON func and stored in xml
		let xml = XMLToJSON(state.xml);

		// clear the correctAns 
		xml.smxml.div._correctAns = "";

		// updtae the cdata
		xml.smxml.div.__cdata = e.target.value;

		// stores and update the xml 
		getChildXml(JSONToXML(xml));
	}

	// calls whenever tab is changed
	function toggleTemplateToken(viewToken, viewTemplate) {
		$$invalidate(0, state.viewToken = viewToken, state);
		$$invalidate(0, state.viewTemplate = viewTemplate, state);
	}

	// return true if that particular position was selected
	function getSelected(pos) {
		return AH.findInArray("ID" + pos, state.correctAns)
		? true
		: false;
	}

	// for changing the mode word, sentence, paragraph
	function setTemplateType(type) {
		// convert the XML into JSON using XMLToJSON func and stored in xml
		let xml = XMLToJSON(state.xml);

		// update the type w,p,s 
		xml.smxml.div._type = type;

		// clear the correctAns 
		xml.smxml.div._correctAns = "";

		// stores and update the xml 
		getChildXml(JSONToXML(xml));
	}

	// for setting the correct answer which is selected
	function setSelected(pos) {
		$$invalidate(0, state.itemLayout[pos].selected = !state.itemLayout[pos].selected, state);
		setCorrectAnswer(pos, state.itemLayout[pos].selected);
	}

	// set the correct answer
	function setCorrectAnswer(id, selected) {
		if (selected == true) {
			// if token is selected then push it in correctAns
			state.correctAns.push("ID" + id);
		} else if (selected == false) {
			let deleteValue = state.correctAns.indexOf("ID" + id);

			if (deleteValue > -1) {
				// if token is deselected then delete that element from the correctAns
				state.correctAns.splice(deleteValue, 1);
			}
		}

		// join the correctAns with , sepereted and stored in crt
		let crt = state.correctAns.filter(function (arr) {
			return arr != "";
		}).join();

		// update the correctAns attribute in the xml
		updateCorrect(crt);
	}

	// update correct answer
	function updateCorrect(correct) {
		// convert the XML into JSON using XMLToJSON func and stored in xml
		let xml = XMLToJSON(state.xml);

		// updating the correctAns
		xml.smxml.div._correctAns = correct;

		// stores and update the xml 
		getChildXml(JSONToXML(xml));
	}

	// whenever clear button is clicked
	function clearToken() {
		// convert the XML into JSON using XMLToJSON func and stored in xml
		let xml = XMLToJSON(state.xml);

		// updating the correctAns
		xml.smxml.div._correctAns = "";

		// stores and update the xml 
		getChildXml(JSONToXML(xml));
	}

	const writable_props = ['xml', 'isReview', 'editorState', 'getChildXml'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<HotspotToken> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(6, xml = $$props.xml);
		if ('isReview' in $$props) $$invalidate(7, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(8, editorState = $$props.editorState);
		if ('getChildXml' in $$props) $$invalidate(9, getChildXml = $$props.getChildXml);
	};

	$$self.$capture_state = () => ({
		beforeUpdate,
		onMount,
		writable,
		AH,
		JSONToXML,
		XMLToJSON,
		l,
		xml,
		isReview,
		editorState,
		getChildXml,
		state,
		hdd,
		unsub,
		loadModule,
		parseXMLAuthoring,
		parseWord,
		parseSentance,
		parseParagraph,
		updateCdata,
		toggleTemplateToken,
		getSelected,
		setTemplateType,
		setSelected,
		setCorrectAnswer,
		updateCorrect,
		clearToken
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(6, xml = $$props.xml);
		if ('isReview' in $$props) $$invalidate(7, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(8, editorState = $$props.editorState);
		if ('getChildXml' in $$props) $$invalidate(9, getChildXml = $$props.getChildXml);
		if ('state' in $$props) $$invalidate(0, state = $$props.state);
		if ('hdd' in $$props) hdd = $$props.hdd;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		state,
		updateCdata,
		toggleTemplateToken,
		setTemplateType,
		setSelected,
		clearToken,
		xml,
		isReview,
		editorState,
		getChildXml
	];
}

class HotspotToken extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				xml: 6,
				isReview: 7,
				editorState: 8,
				getChildXml: 9
			},
			add_css
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "HotspotToken",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[6] === undefined && !('xml' in props)) {
			console_1.warn("<HotspotToken> was created without expected prop 'xml'");
		}

		if (/*isReview*/ ctx[7] === undefined && !('isReview' in props)) {
			console_1.warn("<HotspotToken> was created without expected prop 'isReview'");
		}

		if (/*editorState*/ ctx[8] === undefined && !('editorState' in props)) {
			console_1.warn("<HotspotToken> was created without expected prop 'editorState'");
		}

		if (/*getChildXml*/ ctx[9] === undefined && !('getChildXml' in props)) {
			console_1.warn("<HotspotToken> was created without expected prop 'getChildXml'");
		}
	}

	get xml() {
		throw new Error("<HotspotToken>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<HotspotToken>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<HotspotToken>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<HotspotToken>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<HotspotToken>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<HotspotToken>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<HotspotToken>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<HotspotToken>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default HotspotToken;
//# sourceMappingURL=HotspotToken-1644de07.js.map
