
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, v as validate_slots, o as onMount, A as AH, w as writable, c as create_component, m as mount_component, t as transition_in, a as transition_out, b as destroy_component, e as element, f as space, h as text, j as attr_dev, k as add_location, l as set_style, n as insert_dev, p as append_dev, q as listen_dev, r as group_outros, u as check_outros, x as detach_dev } from './main-ede87917.js';
import { O as OptionContainer } from './OptionContainer-b6bb8e2f.js';

/* clsSMMultipleChoice\MultipleChoice.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMMultipleChoice\\MultipleChoice.svelte";

// (170:1) {#if (state.optionData)}
function create_if_block(ctx) {
	let optioncontainer;
	let current;

	optioncontainer = new OptionContainer({
			props: {
				toggleChecked: /*toggleChecked*/ ctx[5],
				deleteOption: /*deleteOption*/ ctx[3],
				editOption: /*editOption*/ ctx[2],
				letters: /*letters*/ ctx[1],
				correctAnswers: /*state*/ ctx[0].correctAnswers,
				reviewMode: /*state*/ ctx[0].reviewMode,
				data: /*state*/ ctx[0].optionData
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(optioncontainer.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(optioncontainer, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const optioncontainer_changes = {};
			if (dirty & /*state*/ 1) optioncontainer_changes.correctAnswers = /*state*/ ctx[0].correctAnswers;
			if (dirty & /*state*/ 1) optioncontainer_changes.reviewMode = /*state*/ ctx[0].reviewMode;
			if (dirty & /*state*/ 1) optioncontainer_changes.data = /*state*/ ctx[0].optionData;
			optioncontainer.$set(optioncontainer_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(optioncontainer.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(optioncontainer.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(optioncontainer, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(170:1) {#if (state.optionData)}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div1;
	let t0;
	let div0;
	let button;
	let span;
	let t1;
	let current;
	let mounted;
	let dispose;
	let if_block = /*state*/ ctx[0].optionData && create_if_block(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			if (if_block) if_block.c();
			t0 = space();
			div0 = element("div");
			button = element("button");
			span = element("span");
			t1 = text("Add option");
			attr_dev(span, "class", "icomoon-plus pr-1");
			add_location(span, file, 189, 3, 5457);
			attr_dev(button, "variant", "fab");
			attr_dev(button, "color", "primary");
			attr_dev(button, "aria-label", "Add");
			attr_dev(button, "class", "rounded d-flex align-items-center btn btn-sm btn-outline-primary pr-md");
			set_style(button, "text-transform", "none");
			add_location(button, file, 181, 2, 5237);
			attr_dev(div0, "class", "mt-lg position-relative col-12 bottom20 pl-0");
			set_style(div0, "padding-top", "8px");
			add_location(div0, file, 180, 1, 5149);
			add_location(div1, file, 168, 0, 4852);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			if (if_block) if_block.m(div1, null);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, button);
			append_dev(button, span);
			append_dev(button, t1);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*addOption*/ ctx[4], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*state*/ ctx[0].optionData) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*state*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div1, t0);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
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

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MultipleChoice', slots, []);
	let { ucEditor } = $$props;
	let { getChildXml } = $$props;
	let { editorState } = $$props;
	let { xml } = $$props;
	let state = {};

	let hdd = writable({
		correctAnswers: "",
		optionData: "",
		optionDataCopy: "",
		reviewMode: false,
		xml: "",
		optionCounter: 1
	});

	const unsubscribe = hdd.subscribe(items => {
		$$invalidate(0, state = items);
	});

	let letters = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split('');

	onMount(async () => {
		didMount();
	});

	// Interate and load Options
	function didMount() {
		var init = setTimeout(
			function () {
				loadOldType();

				var loadTimer = setTimeout(
					function () {
						try {
							document.querySelectorAll("[id^='option']").forEach((_this, i) => {
								if (_this.querySelectorAll(".pln").length > 0) {
									_this.querySelectorAll(".pln").forEach(_this2 => {
										if (_this2.nextElementSibling.length > 0 && _this.previousElementSibling.length > 0) {
											if (_this2.nextElementSibling.nodeName == "BR" && _this2.previousElementSibling.nodeName == "BR") {
												_this.nextElementSibling.remove();
												_this2.remove();
											}
										}
									});

									xml ? editOption(i) : "";
								}
							});
						} catch(error) {
							console.log({
								err: "Removing PrettyPrint  BR from Authoring Error",
								func: 'componentDidMount'
							});
						}

						ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
						clearTimeout(loadTimer);
					},
					3000
				);

				clearTimeout(init);
			},
			200
		);

		AH.listen(document, 'keydown', '.answer_container .delete_element', function (_this, event) {
			if (event.keyCode == 13 || event.which == 13) {
				// click the element which currently get the focus and enter key is down
				AH.trigger(_this, 'click');
			}
		});

		// this condition used for that guid which is generated by the help of List Item module
		if (editorState.ajaxData.parent_guid) {
			// used for only show the preview
			preview_edit = 1;

			AI && AI.set('get_parent_guid', editorState.ajaxData.parent_guid);
		}
	}

	// TO update modified options
	function updateProps(newData) {
		$$invalidate(6, editorState.ajaxData.correct_answers = newData.correct_answers, editorState);
		$$invalidate(6, editorState.ajaxData.answers = newData.answers, editorState);
		getChildXml(editorState, "mcqType");
	}

	// Check options and set state
	function loadOldType() {
		$$invalidate(0, state.correctAnswers = editorState.ajaxData.correct_answers, state);
		$$invalidate(0, state.optionData = editorState.ajaxData.answers, state);
		$$invalidate(0, state.optionDataCopy = editorState.ajaxData.answers, state);
		$$invalidate(0, state.optionCounter = editorState.ajaxData.answers.length, state);
	}

	// Handle Edit of options
	function editOption(index) {
		let quesData = ucEditor.getContent("option" + index);
		$$invalidate(0, state.optionDataCopy[index]['answer'] = AI.ignoreEnity(quesData), state);

		updateProps({
			correct_answers: state.correctAnswers,
			answers: state.optionDataCopy
		});
	}

	//Handle Delete options
	function deleteOption(index) {
		let temp = [];

		state.optionDataCopy.map((data, i) => {
			if (i != index) {
				temp.push(data);
			}
		});

		console.log(temp);
		$$invalidate(0, state.optionDataCopy = temp, state);

		updateProps({
			correct_answers: state.correctAnswers,
			answers: temp
		});

		updateOptionData(temp);
	}

	// Handle addition of new options
	function addOption(index) {
		let temp1 = state.optionDataCopy;
		$$invalidate(0, state.optionCounter = state.optionCounter + 1, state);

		temp1.push({
			answer: "Option",
			id: "id" + state.optionCounter,
			is_correct: "0",
			seq_str: "",
			seq_tag: ""
		});

		$$invalidate(0, state.optionDataCopy = temp1, state);

		updateProps({
			correct_answers: state.correctAnswers,
			answers: temp1
		});

		updateOptionData(temp1);
		tinymce.EditorManager.editors = []; //@saquib:added this line
		ucEditor.initEditor();

		setTimeout(
			() => {
				ucEditor.initEditor(false, "#authoringSection .ebook_item_text");
			},
			1000
		);
	}

	// Update option's data
	function updateOptionData(data) {
		data = JSON.stringify(data);
		data = JSON.parse(data);
		$$invalidate(0, state.optionData = data, state);
	}

	// Handle checked
	function toggleChecked(index, e) {
		let correctAnswers = 0;
		$$invalidate(0, state.optionDataCopy[index]['is_correct'] = e.target.checked ? "1" : "0", state);

		for (let i in state.optionDataCopy) {
			if (state.optionDataCopy[i]["is_correct"] == "1") {
				correctAnswers++;
			}
		}

		$$invalidate(0, state.correctAnswers = correctAnswers, state);
		let temp = state.optionDataCopy;
		updateOptionData(temp);

		updateProps({
			correct_answers: correctAnswers,
			answers: state.optionDataCopy
		});
	}

	const writable_props = ['ucEditor', 'getChildXml', 'editorState', 'xml'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MultipleChoice> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('ucEditor' in $$props) $$invalidate(7, ucEditor = $$props.ucEditor);
		if ('getChildXml' in $$props) $$invalidate(8, getChildXml = $$props.getChildXml);
		if ('editorState' in $$props) $$invalidate(6, editorState = $$props.editorState);
		if ('xml' in $$props) $$invalidate(9, xml = $$props.xml);
	};

	$$self.$capture_state = () => ({
		onMount,
		writable,
		AH,
		OptionContainer,
		ucEditor,
		getChildXml,
		editorState,
		xml,
		state,
		hdd,
		unsubscribe,
		letters,
		didMount,
		updateProps,
		loadOldType,
		editOption,
		deleteOption,
		addOption,
		updateOptionData,
		toggleChecked
	});

	$$self.$inject_state = $$props => {
		if ('ucEditor' in $$props) $$invalidate(7, ucEditor = $$props.ucEditor);
		if ('getChildXml' in $$props) $$invalidate(8, getChildXml = $$props.getChildXml);
		if ('editorState' in $$props) $$invalidate(6, editorState = $$props.editorState);
		if ('xml' in $$props) $$invalidate(9, xml = $$props.xml);
		if ('state' in $$props) $$invalidate(0, state = $$props.state);
		if ('hdd' in $$props) hdd = $$props.hdd;
		if ('letters' in $$props) $$invalidate(1, letters = $$props.letters);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		state,
		letters,
		editOption,
		deleteOption,
		addOption,
		toggleChecked,
		editorState,
		ucEditor,
		getChildXml,
		xml
	];
}

class MultipleChoice extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			ucEditor: 7,
			getChildXml: 8,
			editorState: 6,
			xml: 9
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MultipleChoice",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*ucEditor*/ ctx[7] === undefined && !('ucEditor' in props)) {
			console_1.warn("<MultipleChoice> was created without expected prop 'ucEditor'");
		}

		if (/*getChildXml*/ ctx[8] === undefined && !('getChildXml' in props)) {
			console_1.warn("<MultipleChoice> was created without expected prop 'getChildXml'");
		}

		if (/*editorState*/ ctx[6] === undefined && !('editorState' in props)) {
			console_1.warn("<MultipleChoice> was created without expected prop 'editorState'");
		}

		if (/*xml*/ ctx[9] === undefined && !('xml' in props)) {
			console_1.warn("<MultipleChoice> was created without expected prop 'xml'");
		}
	}

	get ucEditor() {
		throw new Error("<MultipleChoice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ucEditor(value) {
		throw new Error("<MultipleChoice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<MultipleChoice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<MultipleChoice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<MultipleChoice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<MultipleChoice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xml() {
		throw new Error("<MultipleChoice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<MultipleChoice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default MultipleChoice;
//# sourceMappingURL=MultipleChoice-d7b92ac2.js.map
