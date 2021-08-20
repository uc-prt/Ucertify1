
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, M as append_styles, v as validate_slots, L as beforeUpdate, ab as afterUpdate, o as onMount, X as XMLToJSON, A as AH, a3 as onUserAnsChange, w as writable, C as validate_each_argument, z as empty, n as insert_dev, K as destroy_each, x as detach_dev, e as element, h as text, j as attr_dev, a4 as null_to_empty, l as set_style, k as add_location, p as append_dev, F as set_data_dev, f as space, c as create_component, m as mount_component, t as transition_in, a as transition_out, b as destroy_component, q as listen_dev, G as prop_dev } from './main-0cad436a.js';
import { I as ItemHelper } from './ItemHelper-f4bd8832.js';
import { l as lib } from './parseCSV-66f989c1.js';

/* clsSMChoiceMatrix\ChoiceMatrixPreview.svelte generated by Svelte v3.40.2 */
const file = "clsSMChoiceMatrix\\ChoiceMatrixPreview.svelte";

function add_css(target) {
	append_styles(target, "svelte-ugc9ab", ".fa-check{color:#46A546;position:relative;left:50px}.fa-close{color:#A80000;left:50px}.fa-close{margin-left:-26px;font-size:18px;position:relative;bottom:10px}.fa-check{margin-left:-26px;font-size:18px;position:relative;bottom:10px}.fa-close,.fa-check.svelte-ugc9ab,.middle_align.svelte-ugc9ab{vertical-align:middle!important}.middle_align{width:164px;min-width:164px}.topic_input{min-width:257px}.preview_header{font-size:16pt;font-weight:bold;vertical-align:middle}.adjust_width{width:10%;text-align:center}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hvaWNlTWF0cml4UHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBa2pCWSxTQUFTLEFBQUUsQ0FBQyxBQUNoQixLQUFLLENBQUUsT0FBTyxDQUNkLFNBQVMsUUFBUSxDQUNqQixLQUFLLElBQUksQUFDYixDQUFDLEFBRU8sU0FBUyxBQUFFLENBQUMsQUFDaEIsS0FBSyxDQUFFLE9BQU8sQ0FDZCxLQUFLLElBQUksQUFDYixDQUFDLEFBRU8sU0FBUyxBQUFFLENBQUMsQUFDaEIsV0FBVyxDQUFFLEtBQUssQ0FDbEIsU0FBUyxDQUFFLElBQUksQ0FDZixRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBRU8sU0FBUyxBQUFFLENBQUMsQUFDaEIsV0FBVyxDQUFFLEtBQUssQ0FDbEIsU0FBUyxDQUFFLElBQUksQ0FDZixRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBQ08sU0FBUyxBQUFDLENBQUUsdUJBQVMsQ0FBQyxhQUFhLGNBQUMsQ0FBQyxBQUN6QyxjQUFjLENBQUUsTUFBTSxVQUFVLEFBQ3BDLENBQUMsQUFFTyxhQUFhLEFBQUUsQ0FBQyxBQUNwQixLQUFLLENBQUUsS0FBSyxDQUNaLFNBQVMsQ0FBRSxLQUFLLEFBQ3BCLENBQUMsQUFFTyxZQUFZLEFBQUUsQ0FBQyxBQUNuQixTQUFTLENBQUUsS0FBSyxBQUNwQixDQUFDLEFBRU8sZUFBZSxBQUFFLENBQUMsQUFDdEIsU0FBUyxDQUFFLElBQUksQ0FDZixXQUFXLENBQUUsSUFBSSxDQUNqQixjQUFjLENBQUUsTUFBTSxBQUMxQixDQUFDLEFBRU8sYUFBYSxBQUFFLENBQUMsQUFDcEIsS0FBSyxDQUFFLEdBQUcsQ0FDVixVQUFVLENBQUUsTUFBTSxBQUN0QixDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkNob2ljZU1hdHJpeFByZXZpZXcuc3ZlbHRlIl19 */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[29] = list[i];
	child_ctx[31] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[32] = list[i];
	child_ctx[34] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[29] = list[i];
	child_ctx[31] = i;
	return child_ctx;
}

// (491:24) {#if state.cdata}
function create_if_block_1(ctx) {
	let each_1_anchor;
	let each_value_2 = /*state*/ ctx[2].cdata.option;
	validate_each_argument(each_value_2);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
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
			if (dirty[0] & /*state, theme_color*/ 20) {
				each_value_2 = /*state*/ ctx[2].cdata.option;
				validate_each_argument(each_value_2);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(491:24) {#if state.cdata}",
		ctx
	});

	return block;
}

// (492:28) {#each state.cdata.option as data, i}
function create_each_block_2(ctx) {
	let th;
	let t_value = /*data*/ ctx[29].text.replace(/\n/gm, "</br>").replace(/#cm/gm, ",") + "";
	let t;
	let th_key_value;
	let th_class_value;
	let th_tabindex_value;

	const block = {
		c: function create() {
			th = element("th");
			t = text(t_value);
			attr_dev(th, "key", th_key_value = /*i*/ ctx[31]);

			attr_dev(th, "class", th_class_value = "" + (null_to_empty("preview_header adjust_width " + (/*state*/ ctx[2].theme !== "theme3"
			? /*data*/ ctx[29].id + "text-center text-white"
			: /*data*/ ctx[29].id + "text-center")) + " svelte-ugc9ab"));

			attr_dev(th, "tabindex", th_tabindex_value = 0);
			set_style(th, "background-color", /*theme_color*/ ctx[4][/*state*/ ctx[2].theme], 1);
			add_location(th, file, 492, 32, 16867);
		},
		m: function mount(target, anchor) {
			insert_dev(target, th, anchor);
			append_dev(th, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 4 && t_value !== (t_value = /*data*/ ctx[29].text.replace(/\n/gm, "</br>").replace(/#cm/gm, ",") + "")) set_data_dev(t, t_value);

			if (dirty[0] & /*state*/ 4 && th_class_value !== (th_class_value = "" + (null_to_empty("preview_header adjust_width " + (/*state*/ ctx[2].theme !== "theme3"
			? /*data*/ ctx[29].id + "text-center text-white"
			: /*data*/ ctx[29].id + "text-center")) + " svelte-ugc9ab"))) {
				attr_dev(th, "class", th_class_value);
			}

			if (dirty[0] & /*state*/ 4) {
				set_style(th, "background-color", /*theme_color*/ ctx[4][/*state*/ ctx[2].theme], 1);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(th);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(492:28) {#each state.cdata.option as data, i}",
		ctx
	});

	return block;
}

// (504:20) {#if cm.cdata}
function create_if_block(ctx) {
	let each_1_anchor;
	let each_value = /*cm*/ ctx[1].cdata.term;
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
			if (dirty[0] & /*cm, theme_color_terms, state, setUserAns, isIE*/ 302) {
				each_value = /*cm*/ ctx[1].cdata.term;
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
		source: "(504:20) {#if cm.cdata}",
		ctx
	});

	return block;
}

// (513:32) {#each cm.cdata.option as data2, j}
function create_each_block_1(ctx) {
	let td;
	let i0;
	let i0_style_value;
	let t0;
	let i1;
	let i1_style_value;
	let t1;
	let input;
	let input_style_value;
	let input_value_value;
	let input_name_value;
	let input_id_value;
	let input_data_termid_value;
	let input_data_correct_value;
	let input_tabindex_value;
	let t2;
	let label;
	let label_tabindex_value;
	let label_class_value;
	let label_for_value;
	let td_key_value;
	let td_id_value;
	let td_class_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			td = element("td");
			i0 = element("i");
			t0 = space();
			i1 = element("i");
			t1 = space();
			input = element("input");
			t2 = space();
			label = element("label");
			attr_dev(i0, "class", "fa fa-check svelte-ugc9ab");
			attr_dev(i0, "aria-hidden", "true");
			attr_dev(i0, "style", i0_style_value = setIconStyle(/*isIE*/ ctx[3]));
			add_location(i0, file, 520, 36, 18680);
			attr_dev(i1, "class", "fa fa-close");
			attr_dev(i1, "aria-hidden", "true");
			attr_dev(i1, "style", i1_style_value = setIconStyle(/*isIE*/ ctx[3]));
			add_location(i1, file, 525, 36, 18960);
			attr_dev(input, "type", "radio");
			attr_dev(input, "class", "test_radio CMRad");
			attr_dev(input, "style", input_style_value = 'vertical-align:middle;');
			input.value = input_value_value = /*data2*/ ctx[32].id;
			attr_dev(input, "name", input_name_value = "tm" + (/*i*/ ctx[31] + 1));
			attr_dev(input, "id", input_id_value = 't' + /*i*/ ctx[31] + /*j*/ ctx[34]);
			attr_dev(input, "data-termid", input_data_termid_value = /*data*/ ctx[29].id);
			attr_dev(input, "data-correct", input_data_correct_value = /*data*/ ctx[29].correct);
			attr_dev(input, "data-userans", "");
			attr_dev(input, "data-role", "none");
			attr_dev(input, "tabindex", input_tabindex_value = -1);
			add_location(input, file, 530, 36, 19238);
			attr_dev(label, "tabindex", label_tabindex_value = 0);

			attr_dev(label, "class", label_class_value = "label_choice customRadCM " + (/*j*/ ctx[34] % 2 == 0
			? 'tureitemColorCM'
			: 'falseitemColorCM'));

			attr_dev(label, "for", label_for_value = 't' + /*i*/ ctx[31] + /*j*/ ctx[34]);
			add_location(label, file, 544, 36, 20088);
			attr_dev(td, "key", td_key_value = /*j*/ ctx[34]);
			attr_dev(td, "id", td_id_value = 'tb' + /*i*/ ctx[31] + /*j*/ ctx[34]);

			attr_dev(td, "class", td_class_value = "" + (null_to_empty("text-center test_area " + (/*data2*/ ctx[32].id == /*data*/ ctx[29].correct
			? "dbg-success"
			: "dbg-danger")) + " svelte-ugc9ab"));

			set_style(td, "background-color", /*i*/ ctx[31] % 2 == 0
			? /*theme_color_terms*/ ctx[5][/*state*/ ctx[2].theme]
			: "#FFF");

			add_location(td, file, 513, 32, 18199);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			append_dev(td, i0);
			append_dev(td, t0);
			append_dev(td, i1);
			append_dev(td, t1);
			append_dev(td, input);
			append_dev(td, t2);
			append_dev(td, label);

			if (!mounted) {
				dispose = listen_dev(input, "click", /*setUserAns*/ ctx[8], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*cm*/ 2 && input_value_value !== (input_value_value = /*data2*/ ctx[32].id)) {
				prop_dev(input, "value", input_value_value);
			}

			if (dirty[0] & /*cm*/ 2 && input_data_termid_value !== (input_data_termid_value = /*data*/ ctx[29].id)) {
				attr_dev(input, "data-termid", input_data_termid_value);
			}

			if (dirty[0] & /*cm*/ 2 && input_data_correct_value !== (input_data_correct_value = /*data*/ ctx[29].correct)) {
				attr_dev(input, "data-correct", input_data_correct_value);
			}

			if (dirty[0] & /*cm*/ 2 && td_class_value !== (td_class_value = "" + (null_to_empty("text-center test_area " + (/*data2*/ ctx[32].id == /*data*/ ctx[29].correct
			? "dbg-success"
			: "dbg-danger")) + " svelte-ugc9ab"))) {
				attr_dev(td, "class", td_class_value);
			}

			if (dirty[0] & /*state*/ 4) {
				set_style(td, "background-color", /*i*/ ctx[31] % 2 == 0
				? /*theme_color_terms*/ ctx[5][/*state*/ ctx[2].theme]
				: "#FFF");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(513:32) {#each cm.cdata.option as data2, j}",
		ctx
	});

	return block;
}

// (505:24) {#each cm.cdata.term as data,i}
function create_each_block(ctx) {
	let tr;
	let td;
	let t0_value = /*data*/ ctx[29].text.replace(/\n/gm, "</br>").replace(/#cm/gm, ",") + "";
	let t0;
	let td_class_value;
	let td_tabindex_value;
	let t1;
	let t2;
	let tr_key_value;
	let each_value_1 = /*cm*/ ctx[1].cdata.option;
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			tr = element("tr");
			td = element("td");
			t0 = text(t0_value);
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			attr_dev(td, "class", td_class_value = "" + (null_to_empty(/*data*/ ctx[29].id) + " svelte-ugc9ab"));
			attr_dev(td, "tabindex", td_tabindex_value = 0);

			set_style(
				td,
				"background-color",
				/*i*/ ctx[31] % 2 == 0
				? /*theme_color_terms*/ ctx[5][/*state*/ ctx[2].theme]
				: "#FFF",
				1
			);

			set_style(td, "font-size", "14pt");
			set_style(td, "vertical-align", "middle");
			set_style(td, "font-family", /*state*/ ctx[2].font);
			add_location(td, file, 506, 32, 17658);
			attr_dev(tr, "key", tr_key_value = /*i*/ ctx[31]);
			add_location(tr, file, 505, 28, 17610);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td);
			append_dev(td, t0);
			append_dev(tr, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tr, null);
			}

			append_dev(tr, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*cm*/ 2 && t0_value !== (t0_value = /*data*/ ctx[29].text.replace(/\n/gm, "</br>").replace(/#cm/gm, ",") + "")) set_data_dev(t0, t0_value);

			if (dirty[0] & /*cm*/ 2 && td_class_value !== (td_class_value = "" + (null_to_empty(/*data*/ ctx[29].id) + " svelte-ugc9ab"))) {
				attr_dev(td, "class", td_class_value);
			}

			if (dirty[0] & /*state*/ 4) {
				set_style(
					td,
					"background-color",
					/*i*/ ctx[31] % 2 == 0
					? /*theme_color_terms*/ ctx[5][/*state*/ ctx[2].theme]
					: "#FFF",
					1
				);
			}

			if (dirty[0] & /*state*/ 4) {
				set_style(td, "font-family", /*state*/ ctx[2].font);
			}

			if (dirty[0] & /*cm, theme_color_terms, state, setUserAns, isIE*/ 302) {
				each_value_1 = /*cm*/ ctx[1].cdata.option;
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tr, t2);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(505:24) {#each cm.cdata.term as data,i}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let div;
	let itemhelper;
	let t0;
	let center;
	let table;
	let thead;
	let tr;
	let th;
	let t1_value = /*state*/ ctx[2].stem.replace(/\n/gm, "</br>").replace(/#cm/gm, ",") + "";
	let t1;
	let th_class_value;
	let th_tabindex_value;
	let t2;
	let t3;
	let tbody;
	let table_class_value;
	let table_style_value;
	let div_style_value;
	let current;

	itemhelper = new ItemHelper({
			props: {
				handleReviewClick: /*handleReview*/ ctx[9],
				reviewMode: /*isReview*/ ctx[0]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[6]);
	itemhelper.$on("unsetReview", /*unSetReview*/ ctx[7]);
	let if_block0 = /*state*/ ctx[2].cdata && create_if_block_1(ctx);
	let if_block1 = /*cm*/ ctx[1].cdata && create_if_block(ctx);

	const block = {
		c: function create() {
			main = element("main");
			div = element("div");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			center = element("center");
			table = element("table");
			thead = element("thead");
			tr = element("tr");
			th = element("th");
			t1 = text(t1_value);
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			tbody = element("tbody");
			if (if_block1) if_block1.c();

			attr_dev(th, "class", th_class_value = "" + (null_to_empty("preview_header " + (/*state*/ ctx[2].theme !== "theme3"
			? "text-center text-white"
			: "text-center")) + " svelte-ugc9ab"));

			attr_dev(th, "tabindex", th_tabindex_value = 0);
			set_style(th, "background-color", /*theme_color*/ ctx[4][/*state*/ ctx[2].theme], 1);
			add_location(th, file, 484, 24, 16330);
			attr_dev(tr, "class", "table-head");
			add_location(tr, file, 483, 20, 16279);
			add_location(thead, file, 482, 16, 16250);
			add_location(tbody, file, 502, 16, 17479);
			attr_dev(table, "class", table_class_value = "table testmode_table ");
			attr_dev(table, "id", "test_table");
			attr_dev(table, "style", table_style_value = "" + ('position:relative; margin-top:20px;width:' + /*state*/ ctx[2].maxWidth + "px" + ";font-family: Georgia;"));
			add_location(table, file, 481, 12, 16079);
			add_location(center, file, 480, 8, 16057);
			attr_dev(div, "id", "choicemain");
			attr_dev(div, "style", div_style_value = 'margin-bottom:20px');
			add_location(div, file, 473, 4, 15795);
			add_location(main, file, 472, 0, 15783);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div);
			mount_component(itemhelper, div, null);
			append_dev(div, t0);
			append_dev(div, center);
			append_dev(center, table);
			append_dev(table, thead);
			append_dev(thead, tr);
			append_dev(tr, th);
			append_dev(th, t1);
			append_dev(tr, t2);
			if (if_block0) if_block0.m(tr, null);
			append_dev(table, t3);
			append_dev(table, tbody);
			if (if_block1) if_block1.m(tbody, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const itemhelper_changes = {};
			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);
			if ((!current || dirty[0] & /*state*/ 4) && t1_value !== (t1_value = /*state*/ ctx[2].stem.replace(/\n/gm, "</br>").replace(/#cm/gm, ",") + "")) set_data_dev(t1, t1_value);

			if (!current || dirty[0] & /*state*/ 4 && th_class_value !== (th_class_value = "" + (null_to_empty("preview_header " + (/*state*/ ctx[2].theme !== "theme3"
			? "text-center text-white"
			: "text-center")) + " svelte-ugc9ab"))) {
				attr_dev(th, "class", th_class_value);
			}

			if (!current || dirty[0] & /*state*/ 4) {
				set_style(th, "background-color", /*theme_color*/ ctx[4][/*state*/ ctx[2].theme], 1);
			}

			if (/*state*/ ctx[2].cdata) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(tr, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*cm*/ ctx[1].cdata) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(tbody, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (!current || dirty[0] & /*state*/ 4 && table_style_value !== (table_style_value = "" + ('position:relative; margin-top:20px;width:' + /*state*/ ctx[2].maxWidth + "px" + ";font-family: Georgia;"))) {
				attr_dev(table, "style", table_style_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(itemhelper.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(itemhelper.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			destroy_component(itemhelper);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
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

function previewUserAns() {
	let test_radio_len = document.getElementsByClassName('test_radio');

	for (let i = 0; i < test_radio_len.length; i++) {
		if (test_radio_len[i].getAttribute('id') == test_radio_len[i].getAttribute('data-userans')) {
			test_radio_len[i].checked = true;
		} else {
			test_radio_len[i].checked = false;
		}
	}
}

/////// Hiding correct or incorrect answer ////////////////
function hideCorIncorIcon() {
	//jQuery(".fa-check"); // Replaced
	//jQuery(".fa-close").hide(); // Replaced
	let hide_icon_length = document.getElementsByClassName('fa-check');

	let hide_icon_length1 = document.getElementsByClassName('fa-close');

	for (let i = 0; i < hide_icon_length.length; i++) {
		hide_icon_length[i].style.display = 'none';
		hide_icon_length1[i].style.display = 'none';
	}
}

// for setting the icon style
function setIconStyle(ie) {
	if (ie == true) {
		return {
			paddingLeft: '14px',
			display: 'inline-flex',
			position: 'absolute'
		};
	} else {
		return {
			paddingLeft: "15px",
			display: 'none',
			position: 'absolute'
		};
	}
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ChoiceMatrixPreview', slots, []);
	let { showAns } = $$props;
	let { editorState } = $$props;
	let { xml } = $$props;
	let { uxml } = $$props;
	let { isReview } = $$props;
	let useransNew;
	let cm = { cdata: "" };
	let isIE;
	let mainId = "";
	let state = {};
	let ansDisable = 0;

	let stateData = writable({
		cdata: "",
		stem: "",
		xml: "",
		theme: "",
		font: "",
		maxWidth: "",
		totalcorrectans: ""
	});

	let theme_color = {
		theme1: '#5B9BD5',
		theme2: '#3B67BC',
		theme3: '#F6C3A2',
		theme4: '#70AD47',
		theme5: '#745998'
	};

	let theme_color_terms = {
		theme1: '#DEEAF6',
		theme2: '#D4DEF1',
		theme3: '#FAE0CF',
		theme4: '#E2EFD9',
		theme5: '#E1DAE9'
	};

	const unsubscribe = stateData.subscribe(items => {
		$$invalidate(2, state = items);
	});

	///////  XML change then automatically reload code ///////////////
	beforeUpdate(() => {
		if (xml != state.xml) {
			$$invalidate(2, state.xml = xml, state);
			loadModule(xml, uxml);
		}
	});

	// function for checking the focus
	/*    function checkFocus(list){
        let is_focus = false;
        jQuery(".choiceMatrixRender").find("."+list).each(function() {
            if(jQuery(this).is(":focus")) {
                is_focus = true;
                return false;
            }
        });
        return is_focus;
    }  */
	afterUpdate(() => {
		if (!isReview) hideCorIncorIcon();
	});

	onMount(() => {
		// Check the radio when press the Enter Key ADA
		AI.listen('body', 'keydown', '.label_choice', function (_this, e) {
			if (e.which === 13) {
				_this.click();
			}
		});
	});

	function setReview() {
		modeOn();
	}

	function unSetReview() {
		previewUserAns();
		modeOff();
	}

	/////////////// Loding the xml and uaXML ///////////////////
	function loadModule(loadXml, uaXML) {
		loadXml = XMLToJSON(loadXml);
		parseXMLPreview(loadXml, uaXML);
	}

	///////// FUnction parsing the xml ////////////////////////
	function parseXMLPreview(MYXML, uaXML) {
		// setting state of theme, font, maxwidth
		$$invalidate(2, state.theme = MYXML.smxml._theme, state);

		$$invalidate(2, state.font = MYXML.smxml._font, state);
		$$invalidate(2, state.maxWidth = MYXML.smxml._maxwidth ? MYXML.smxml._maxwidth : 800, state);
		let formattedData = lib.parseCSVFormat(MYXML.smxml.__cdata);
		let cdata = formattedData;
		let rawData = [];

		// copy cdata into rawData////// 
		/* jQuery.map(cdata, function (value, index) {
    rawData[index] = value;
});   Replaced     */
		rawData = JSON.parse(JSON.stringify(cdata));

		$$invalidate(2, state.cdata = rawData, state);
		$$invalidate(2, state.stem = rawData.stem, state);
		$$invalidate(1, cm.cdata = rawData, cm);
		let len = cm.cdata.term.length;
		$$invalidate(2, state.totalcorrectans = len, state);
		modeOff();

		// User anser checking/////////
		if (uaXML) {
			try {
				// parsing the json data
				uaXML = JSON.parse(uaXML);

				let rawUaXML = [];

				// storing uaXML in rawUaXML and storing its value
				/*    jQuery.map(uaXML, function (value, index) {
        rawUaXML[index] = value;
    }); replaced   */
				rawUaXML = JSON.parse(JSON.stringify(uaXML));

				//    setting the data-userans on the basis of ans
				setTimeout(
					function () {
						rawUaXML.ans.map(function (data, i) {
							//alert("#"+data.userAns);
							//jQuery(".test_area").find("#"+data.userAns).attr("data-userans",data.userAns);
							AH.selectAll(".test_area" + " #" + data.userAns, 'attr', { "data-userans": data.userAns });
						});

						previewUserAns();
					},
					100
				);
			} catch(e) {
				
			} // let datauser;
			//uaXML = "";
		} else {
			// if is not user ans then unchecked all the radio btn
			/*    jQuery(".test_radio").each(function () {
        jQuery(this)[0].checked = false;
        jQuery(this).attr('data-userans',"");
    })  */
			let test_radio_len = document.getElementsByClassName('test_radio');

			for (let i = 0; i < test_radio_len.length; i++) {
				test_radio_len[i].checked = false;
				test_radio_len[i].setAttribute('data-userans', "");
			}
		}
	}

	///////////  Storing the user answer whenever clicked////////////////
	function setUserAns(e) {
		let id = e.target.id;
		let name = e.target.name;

		// set the user ans blank
		//    jQuery(mainId+" .test_area input[name=" + name + "]").attr("data-userans", ""); Replaced
		let test_area_input = document.querySelectorAll(mainId + " .test_area input[name=" + name + "]");

		for (let i = 0; i < test_area_input.length; i++) {
			test_area_input[i].setAttribute("data-userans", "");
		}

		// setting the data-userans on which user is clicked
		//jQuery(mainId+" .test_area").find("#" + id + "").attr("data-userans", id);// Replaced
		AH.selectAll(mainId + " .test_area" + " #" + id + "", 'attr', { "data-userans": id });

		let userans = { "type": "34", "ans": [] };

		/////////// updating the user ans /////////////////////////
		/* jQuery(mainId+" .test_radio").each(function () {
    if (jQuery(this)[0].checked == true) {
        userans.ans.push({
            id: jQuery(this).attr("data-termid"),
            userAns: jQuery(this).attr("id")
        });
    }
});*/
		let test_radio = document.getElementsByClassName('test_radio');

		for (let i = 0; i < test_radio.length; i++) {
			if (test_radio[i].checked == true) {
				userans.ans.push({
					id: test_radio[i].getAttribute("data-termid"),
					userAns: test_radio[i].getAttribute("id")
				});
			}
		}

		// for autograding
		// updaing the value in the textarea 
		//jQuery("#special_module_user_xml").val(JSON.stringify(userans)); // Replaced;
		//AH('special_module_user_xml').value = JSON.stringify(userans);
		useransNew = JSON.stringify(userans);

		displayAnswer();
	}

	///////////////////////// This function display answer wether the function is correct or incorrect///////////////////
	function displayAnswer() {
		// check the ans
		let ans = checkAns();

		// mark the answer correct or incorrect x
		ans = ans == 1 ? true : false;

		if (uxml) {
			AH.select("#answer").checked = ans;
		} else {
			if (editorState) showAns(ans ? "Correct" : "Incorrect");
		}

		onUserAnsChange({ uXml: useransNew, ans });
	}

	// function check the answer
	function checkAns() {
		let is_correct = 0;
		let temp = 0;
		let test_radio_ans = document.getElementsByClassName('test_radio');

		for (let i = 0; i < test_radio_ans.length; i++) {
			if (test_radio_ans[i].getAttribute('value') == test_radio_ans[i].getAttribute('data-correct')) {
				if (test_radio_ans[i].checked == true) {
					test_radio_ans[i].setAttribute('as', 1);
					is_correct = 1;
				} else {
					is_correct = 0;
					test_radio_ans[i].setAttribute('as', 0);
					return false;
				}
			}
		}

		// for calculating the point
		for (let i = 0; i < test_radio_ans.length; i++) {
			if (test_radio_ans[i].getAttribute('value') == test_radio_ans[i].getAttribute('data-correct')) {
				if (test_radio_ans[i].checked == true) {
					temp++;
				}
			}

			if (typeof calculatePoint != "undefined") {
				calculatePoint(state.totalcorrectans, temp);
			}
		}

		return is_correct;
	}

	// for user aswer tab
	function yourAnswer() {
		previewUserAns();

		// for showing the correct/incorrect icon
		showCorIncorIcon();
	}

	// correct answer tab
	function correctAnswer() {
		previewCorrectAns();

		// for showing the correct/incorrect icon
		hideCorIncorIcon();
	}

	// for showing correct answer
	function previewCorrectAns() {
		let test_radio = document.querySelectorAll(mainId + " .test_radio");

		for (let i = 0; i < test_radio.length; i++) {
			if (test_radio[i].getAttribute('value') == test_radio[i].getAttribute('data-correct')) {
				test_radio[i].checked = true;
			} else {
				test_radio[i].checked = false;
			}
		}
	}

	/////// This function setReview mode ////////////// 
	function modeOn() {
		$$invalidate(0, isReview = true);

		//jQuery(mainId+" .test_radio").attr('disabled', true); // Replaced
		let test_radio = AH.selectAll(mainId + " .test_radio");

		for (let i = 0; i < test_radio.length; i++) {
			test_radio[i].disabled = true;
		}

		yourAnswer();
	}

	/////// This function unsetReview mode //////////////  
	function modeOff() {
		$$invalidate(0, isReview = false);
		let testRadios = document.getElementsByClassName('test_radio');

		for (let i = 0; i < testRadios.length; i++) {
			testRadios[i].disabled = false;
		}

		hideCorIncorIcon();
	} //jQuery(".dbg-success input:checked").siblings(".label_choice").attr("title",""); // Replaced
	// AH.select(".dbg-success input","checked").forEach((_elm)=>{

	//     AH.siblings(_elm,".label_choice").forEach((_e)=>{
	//         _e.setAttribute("title","")                    
	//     })
	// }); Fix
	//jQuery(".dbg-danger input:checked").siblings(".label_choice").attr("title", ""); // Replaced
	// AH.select(".dbg-danger input:checked").forEach((_elm)=>{
	//     AH.siblings(_elm,".label_choice").forEach((_e)=>{
	//         _e.setAttribute("title","")                    
	//     })
	// }); Fix
	// This function showing correct or incorrect icon////////////////
	function showCorIncorIcon() {
		AH.select(".dbg-success input", "checked").forEach(_elm => {
			AH.siblings(_elm, '.fa-check').forEach(_e => {
				_e.style.display = "inline-flex";
			});
		});

		AH.select(".dbg-danger input", "checked").forEach(_elm => {
			AH.siblings(_elm, '.fa-close').forEach(_e => {
				_e.style.display = "inline-flex";
			});
		});

		AH.selectAll('.dbg-success input, .dbg-danger input', 'removeAttr', 'as');

		AH.select(".dbg-success input", "checked").forEach(_succRem => {
			_succRem.setAttribute("as", 1);
		});

		//jQuery(".dbg-danger input:checked").attr("as", 0); // Removed
		AH.select(".dbg-success input", "checked").forEach(_dangRem => {
			_dangRem.setAttribute("as", 0);
		});

		AH.select(".dbg-success input", "checked").forEach(_elm => {
			AH.siblings(_elm, '.label_choice').forEach(_e => {
				_e.setAttribute("title", "is marked as correct");
			});
		});

		//jQuery(".dbg-danger input:checked").siblings(".label_choice").attr("title", "is marked as incorrect");
		AH.select(".dbg-danger input", "checked").forEach(_elm => {
			AH.siblings(_elm, '.label_choice').forEach(_e => {
				_e.setAttribute("title", "is marked as incorrect");
			});
		});
	}

	//To handle review toggle
	function handleReview(mode, event) {
		if (mode == 'c') {
			correctAnswer();
		} else {
			yourAnswer();
		}
	}

	const writable_props = ['showAns', 'editorState', 'xml', 'uxml', 'isReview'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChoiceMatrixPreview> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('showAns' in $$props) $$invalidate(10, showAns = $$props.showAns);
		if ('editorState' in $$props) $$invalidate(11, editorState = $$props.editorState);
		if ('xml' in $$props) $$invalidate(12, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(13, uxml = $$props.uxml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
	};

	$$self.$capture_state = () => ({
		lib,
		onMount,
		beforeUpdate,
		afterUpdate,
		AH,
		XMLToJSON,
		onUserAnsChange,
		writable,
		ItemHelper,
		showAns,
		editorState,
		xml,
		uxml,
		isReview,
		useransNew,
		cm,
		isIE,
		mainId,
		state,
		ansDisable,
		stateData,
		theme_color,
		theme_color_terms,
		unsubscribe,
		setReview,
		unSetReview,
		loadModule,
		parseXMLPreview,
		setUserAns,
		displayAnswer,
		checkAns,
		yourAnswer,
		previewUserAns,
		correctAnswer,
		previewCorrectAns,
		modeOn,
		modeOff,
		showCorIncorIcon,
		hideCorIncorIcon,
		setIconStyle,
		handleReview
	});

	$$self.$inject_state = $$props => {
		if ('showAns' in $$props) $$invalidate(10, showAns = $$props.showAns);
		if ('editorState' in $$props) $$invalidate(11, editorState = $$props.editorState);
		if ('xml' in $$props) $$invalidate(12, xml = $$props.xml);
		if ('uxml' in $$props) $$invalidate(13, uxml = $$props.uxml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('useransNew' in $$props) useransNew = $$props.useransNew;
		if ('cm' in $$props) $$invalidate(1, cm = $$props.cm);
		if ('isIE' in $$props) $$invalidate(3, isIE = $$props.isIE);
		if ('mainId' in $$props) mainId = $$props.mainId;
		if ('state' in $$props) $$invalidate(2, state = $$props.state);
		if ('ansDisable' in $$props) $$invalidate(14, ansDisable = $$props.ansDisable);
		if ('stateData' in $$props) stateData = $$props.stateData;
		if ('theme_color' in $$props) $$invalidate(4, theme_color = $$props.theme_color);
		if ('theme_color_terms' in $$props) $$invalidate(5, theme_color_terms = $$props.theme_color_terms);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*isReview, editorState, ansDisable*/ 18433) {
			 {
				if (isReview) {
					// this condition will true in test area
					modeOn();

					if (editorState && ansDisable == 0) {
						$$invalidate(14, ansDisable = 1);
						displayAnswer();
					}
				} else {
					$$invalidate(14, ansDisable = 0);
					previewUserAns();
					modeOff();
				}
			}
		}
	};

	return [
		isReview,
		cm,
		state,
		isIE,
		theme_color,
		theme_color_terms,
		setReview,
		unSetReview,
		setUserAns,
		handleReview,
		showAns,
		editorState,
		xml,
		uxml,
		ansDisable
	];
}

class ChoiceMatrixPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				showAns: 10,
				editorState: 11,
				xml: 12,
				uxml: 13,
				isReview: 0
			},
			add_css,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ChoiceMatrixPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*showAns*/ ctx[10] === undefined && !('showAns' in props)) {
			console.warn("<ChoiceMatrixPreview> was created without expected prop 'showAns'");
		}

		if (/*editorState*/ ctx[11] === undefined && !('editorState' in props)) {
			console.warn("<ChoiceMatrixPreview> was created without expected prop 'editorState'");
		}

		if (/*xml*/ ctx[12] === undefined && !('xml' in props)) {
			console.warn("<ChoiceMatrixPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[13] === undefined && !('uxml' in props)) {
			console.warn("<ChoiceMatrixPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console.warn("<ChoiceMatrixPreview> was created without expected prop 'isReview'");
		}
	}

	get showAns() {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xml() {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<ChoiceMatrixPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default ChoiceMatrixPreview;
//# sourceMappingURL=ChoiceMatrixPreview-cee5cbd3.js.map
