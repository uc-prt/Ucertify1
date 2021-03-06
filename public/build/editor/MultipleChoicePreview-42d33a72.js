
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, v as validate_slots, o as onMount, I as beforeUpdate, A as AH, w as writable, c as create_component, m as mount_component, t as transition_in, a as transition_out, b as destroy_component, z as empty, n as insert_dev, r as group_outros, u as check_outros, x as detach_dev } from './main-34a3b679.js';
import { O as OptionContainer } from './OptionContainer-2f7e0b1a.js';

/* clsSMMultipleChoice\MultipleChoicePreview.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;

// (47:0) {#if state.optionData}
function create_if_block(ctx) {
	let optioncontainer;
	let current;

	optioncontainer = new OptionContainer({
			props: {
				letters: /*letters*/ ctx[1],
				correctAnswers: /*state*/ ctx[0].correctAnswers,
				reviewMode: /*state*/ ctx[0].reviewMode,
				data: /*state*/ ctx[0].optionData,
				previewMode: true
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
		source: "(47:0) {#if state.optionData}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*state*/ ctx[0].optionData && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
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
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
	validate_slots('MultipleChoicePreview', slots, []);
	let { isReview } = $$props;
	let { editorState } = $$props;
	let letters = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split('');
	let state = {};

	let hdd = writable({
		correctAnswers: "",
		optionData: "",
		reviewMode: false
	});

	const unsubscribe = items => {
		$$invalidate(0, state = items);
	};

	onMount(async () => {
		loadOldModule();
	});

	beforeUpdate(async () => {
		loadOldModule();

		if (isReview != state.reviewMode) {
			$$invalidate(0, state.reviewMode = isReview, state);
		}
	});

	function loadOldModule() {
		$$invalidate(0, state.correctAnswers = editorState.mcqAjaxData.correct_answers, state);
		$$invalidate(0, state.optionData = editorState.mcqAjaxData.answers, state);

		setTimeout(
			function () {
				AH.addClass(AH.find("#previewSection", ".prettyprintReplica", 'all'), ["prettyprint", "linenums"]);

				try {
					JSON.stringify(editorState.mcqAjaxData.answers).match(/<uc:syntax/gm)
					? prettyPrint()
					: '';
				} catch(e) {
					console.warn(e);
				}

				AH.addClass(AH.find("#previewSection", ".prettyprint"), "prettyprintReplica");
				AH.addClass(AH.find("#previewSection", ".prettyprintReplica"), ["prettyprint", "linenums"]);
			},
			200
		);
	}

	const writable_props = ['isReview', 'editorState'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MultipleChoicePreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('isReview' in $$props) $$invalidate(2, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(3, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		beforeUpdate,
		onMount,
		writable,
		AH,
		OptionContainer,
		isReview,
		editorState,
		letters,
		state,
		hdd,
		unsubscribe,
		loadOldModule
	});

	$$self.$inject_state = $$props => {
		if ('isReview' in $$props) $$invalidate(2, isReview = $$props.isReview);
		if ('editorState' in $$props) $$invalidate(3, editorState = $$props.editorState);
		if ('letters' in $$props) $$invalidate(1, letters = $$props.letters);
		if ('state' in $$props) $$invalidate(0, state = $$props.state);
		if ('hdd' in $$props) hdd = $$props.hdd;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [state, letters, isReview, editorState];
}

class MultipleChoicePreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { isReview: 2, editorState: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MultipleChoicePreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*isReview*/ ctx[2] === undefined && !('isReview' in props)) {
			console_1.warn("<MultipleChoicePreview> was created without expected prop 'isReview'");
		}

		if (/*editorState*/ ctx[3] === undefined && !('editorState' in props)) {
			console_1.warn("<MultipleChoicePreview> was created without expected prop 'editorState'");
		}
	}

	get isReview() {
		throw new Error("<MultipleChoicePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<MultipleChoicePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<MultipleChoicePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<MultipleChoicePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default MultipleChoicePreview;
//# sourceMappingURL=MultipleChoicePreview-42d33a72.js.map
