
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, y as l, A as AH, z as empty, n as insert_dev, B as noop, x as detach_dev, C as validate_each_argument, e as element, h as text, f as space, j as attr_dev, k as add_location, l as set_style, p as append_dev, q as listen_dev, D as is_function, E as set_data_dev, F as prop_dev, G as run_all, H as destroy_each } from './main-34a3b679.js';

/* clsSMMultipleChoice\OptionContainer.svelte generated by Svelte v3.40.2 */
const file = "clsSMMultipleChoice\\OptionContainer.svelte";

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	child_ctx[11] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	child_ctx[11] = i;
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[11] = i;
	return child_ctx;
}

// (118:0) {:else}
function create_else_block_1(ctx) {
	let div;
	let each_value_2 = /*data*/ ctx[1];
	validate_each_argument(each_value_2);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", "mb-xl clear-both ml-lg overflow");
			attr_dev(div, "id", "user_answer");
			add_location(div, file, 118, 4, 6259);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*deleteOption, editOption, data, letters, correctAnswers, toggleChecked*/ 63) {
				each_value_2 = /*data*/ ctx[1];
				validate_each_argument(each_value_2);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(118:0) {:else}",
		ctx
	});

	return block;
}

// (22:0) {#if previewMode}
function create_if_block(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (preview_edit == 1 && AH.get('get_parent_guid')) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type_1();
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
			if_block.p(ctx, dirty);
		},
		d: function destroy(detaching) {
			if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(22:0) {#if previewMode}",
		ctx
	});

	return block;
}

// (120:8) {#each data as items, i}
function create_each_block_2(ctx) {
	let span;
	let section;
	let div8;
	let div3;
	let div2;
	let label;
	let div0;
	let t0_value = /*letters*/ ctx[0][/*i*/ ctx[11]] + "";
	let t0;
	let div0_value_value;
	let t1;
	let div1;
	let input;
	let input_type_value;
	let input_checked_value;
	let input_id_value;
	let input_value_value;
	let label_access_key_value;
	let label_for_value;
	let t2;
	let div6;
	let div5;
	let div4;
	let raw_value = /*items*/ ctx[14].answer + "";
	let div4_id_value;
	let t3;
	let div7;
	let i_1;
	let t4;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			span = element("span");
			section = element("section");
			div8 = element("div");
			div3 = element("div");
			div2 = element("div");
			label = element("label");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			input = element("input");
			t2 = space();
			div6 = element("div");
			div5 = element("div");
			div4 = element("div");
			t3 = space();
			div7 = element("div");
			i_1 = element("i");
			t4 = space();
			attr_dev(div0, "class", "ansoptlabel form-control ansopt");
			attr_dev(div0, "value", div0_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]]);
			add_location(div0, file, 126, 36, 6767);
			attr_dev(input, "tabindex", "0");
			attr_dev(input, "type", input_type_value = /*correctAnswers*/ ctx[3] < 1 ? "radio" : "checkbox");
			input.checked = input_checked_value = /*items*/ ctx[14].is_correct == 1 ? true : false;
			attr_dev(input, "class", "answer_radio");
			attr_dev(input, "id", input_id_value = "userans-" + /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(input, "name", "userans[]");
			input.value = input_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]];
			add_location(input, file, 130, 40, 7064);
			attr_dev(div1, "class", "ansoptinput input-group-text");
			attr_dev(div1, "tabindex", "0");
			add_location(div1, file, 129, 36, 6967);
			attr_dev(label, "access-key", label_access_key_value = /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(label, "class", "d-flex");
			attr_dev(label, "for", label_for_value = "userans-" + /*letters*/ ctx[0][/*i*/ ctx[11]]);
			add_location(label, file, 125, 32, 6656);
			attr_dev(div2, "class", "input-group");
			add_location(div2, file, 124, 28, 6597);
			attr_dev(div3, "class", "span1 float-left");
			add_location(div3, file, 123, 24, 6537);
			attr_dev(div4, "id", div4_id_value = "option" + /*i*/ ctx[11]);
			attr_dev(div4, "class", "ebook_item_text auth-editor pt-2");
			add_location(div4, file, 146, 32, 7999);
			attr_dev(div5, "class", "answer");
			add_location(div5, file, 145, 28, 7945);
			attr_dev(div6, "class", "printer");
			add_location(div6, file, 144, 24, 7894);
			attr_dev(i_1, "class", "icomoon-new-24px-delete-1 s3");
			add_location(i_1, file, 161, 28, 8746);
			attr_dev(div7, "class", "float-right delete_element mr-1 position-relative");
			set_style(div7, "bottom", "32px");
			attr_dev(div7, "tabindex", "0");
			add_location(div7, file, 155, 24, 8436);
			set_style(div8, "min-height", "46px");
			attr_dev(div8, "class", "option");
			add_location(div8, file, 122, 20, 6464);
			attr_dev(section, "class", "answer_container");
			add_location(section, file, 121, 16, 6408);
			attr_dev(span, "anscounter", "0");
			add_location(span, file, 120, 12, 6369);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, section);
			append_dev(section, div8);
			append_dev(div8, div3);
			append_dev(div3, div2);
			append_dev(div2, label);
			append_dev(label, div0);
			append_dev(div0, t0);
			append_dev(label, t1);
			append_dev(label, div1);
			append_dev(div1, input);
			append_dev(div8, t2);
			append_dev(div8, div6);
			append_dev(div6, div5);
			append_dev(div5, div4);
			div4.innerHTML = raw_value;
			append_dev(div8, t3);
			append_dev(div8, div7);
			append_dev(div7, i_1);
			append_dev(span, t4);

			if (!mounted) {
				dispose = [
					listen_dev(
						input,
						"click",
						function () {
							if (is_function(/*toggleChecked*/ ctx[4].bind(this, /*i*/ ctx[11]))) /*toggleChecked*/ ctx[4].bind(this, /*i*/ ctx[11]).apply(this, arguments);
						},
						false,
						false,
						false
					),
					listen_dev(
						div4,
						"blur",
						function () {
							if (is_function(/*editOption*/ ctx[2].bind(this, /*i*/ ctx[11]))) /*editOption*/ ctx[2].bind(this, /*i*/ ctx[11]).apply(this, arguments);
						},
						false,
						false,
						false
					),
					listen_dev(
						div7,
						"click",
						function () {
							if (is_function(/*deleteOption*/ ctx[5].bind(this, /*i*/ ctx[11]))) /*deleteOption*/ ctx[5].bind(this, /*i*/ ctx[11]).apply(this, arguments);
						},
						false,
						false,
						false
					)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*letters*/ 1 && t0_value !== (t0_value = /*letters*/ ctx[0][/*i*/ ctx[11]] + "")) set_data_dev(t0, t0_value);

			if (dirty & /*letters*/ 1 && div0_value_value !== (div0_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(div0, "value", div0_value_value);
			}

			if (dirty & /*correctAnswers*/ 8 && input_type_value !== (input_type_value = /*correctAnswers*/ ctx[3] < 1 ? "radio" : "checkbox")) {
				attr_dev(input, "type", input_type_value);
			}

			if (dirty & /*data*/ 2 && input_checked_value !== (input_checked_value = /*items*/ ctx[14].is_correct == 1 ? true : false)) {
				prop_dev(input, "checked", input_checked_value);
			}

			if (dirty & /*letters*/ 1 && input_id_value !== (input_id_value = "userans-" + /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*letters*/ 1 && input_value_value !== (input_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]]) && input.value !== input_value_value) {
				prop_dev(input, "value", input_value_value);
			}

			if (dirty & /*letters*/ 1 && label_access_key_value !== (label_access_key_value = /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(label, "access-key", label_access_key_value);
			}

			if (dirty & /*letters*/ 1 && label_for_value !== (label_for_value = "userans-" + /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(label, "for", label_for_value);
			}

			if (dirty & /*data*/ 2 && raw_value !== (raw_value = /*items*/ ctx[14].answer + "")) div4.innerHTML = raw_value;		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(120:8) {#each data as items, i}",
		ctx
	});

	return block;
}

// (80:4) {:else}
function create_else_block(ctx) {
	let div;
	let each_value_1 = /*data*/ ctx[1];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", "mb-xl ml-lg overflow");
			attr_dev(div, "id", "user_answer");
			add_location(div, file, 80, 8, 4131);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*letters, get_ucsyntax, data, reviewMode, correctAnswers*/ 75) {
				each_value_1 = /*data*/ ctx[1];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(80:4) {:else}",
		ctx
	});

	return block;
}

// (23:1) {#if (preview_edit == 1) && AH.get('get_parent_guid')}
function create_if_block_1(ctx) {
	let div5;
	let section;
	let div3;
	let div2;
	let div0;
	let b;
	let t1;
	let div1;
	let button;
	let t3;
	let div4;
	let mounted;
	let dispose;
	let each_value = /*data*/ ctx[1];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div5 = element("div");
			section = element("section");
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			b = element("b");
			b.textContent = `${l.parent_guid_found}`;
			t1 = space();
			div1 = element("div");
			button = element("button");
			button.textContent = `${l.yes_label}`;
			t3 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			add_location(b, file, 27, 51, 1195);
			attr_dev(div0, "class", "float-left mt");
			add_location(div0, file, 27, 24, 1168);
			attr_dev(button, "tabindex", "0");
			attr_dev(button, "id", "show_parent_guid");
			attr_dev(button, "name", "show_parent_guid");
			attr_dev(button, "class", "btn btn-primary width90");
			add_location(button, file, 29, 28, 1321);
			attr_dev(div1, "class", "float-right ml-lg-auto");
			add_location(div1, file, 28, 24, 1255);
			attr_dev(div2, "class", "row mx-0");
			add_location(div2, file, 26, 20, 1120);
			attr_dev(div3, "tabindex", "0");
			attr_dev(div3, "class", "alert alert-primary mb-lg ");
			attr_dev(div3, "id", "open_test_session");
			attr_dev(div3, "role", "alert");
			add_location(div3, file, 25, 16, 1009);
			attr_dev(section, "id", "warning_label_container");
			attr_dev(section, "class", "w-100");
			add_location(section, file, 24, 12, 939);
			attr_dev(div4, "class", "mb-xl ml-lg overflow");
			attr_dev(div4, "id", "user_answer");
			add_location(div4, file, 42, 12, 1854);
			add_location(div5, file, 23, 8, 920);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			append_dev(div5, section);
			append_dev(section, div3);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div0, b);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div1, button);
			append_dev(div5, t3);
			append_dev(div5, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div4, null);
			}

			if (!mounted) {
				dispose = listen_dev(button, "click", /*showParentGuid*/ ctx[8], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*letters, data, reviewMode, correctAnswers*/ 75) {
				each_value = /*data*/ ctx[1];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(23:1) {#if (preview_edit == 1) && AH.get('get_parent_guid')}",
		ctx
	});

	return block;
}

// (82:12) {#each data as mcqItem, i}
function create_each_block_1(ctx) {
	let span;
	let section;
	let label1;
	let div3;
	let div2;
	let label0;
	let div0;
	let t0_value = /*letters*/ ctx[0][/*i*/ ctx[11]] + "";
	let t0;
	let div0_value_value;
	let t1;
	let div1;
	let input;
	let input_type_value;
	let input_id_value;
	let input_value_value;
	let div1_class_value;
	let label0_for_value;
	let label0_access_key_value;
	let t2;
	let div5;
	let div4;
	let raw_value = get_ucsyntax(/*mcqItem*/ ctx[12].answer) + "";
	let label1_for_value;
	let t3;

	const block = {
		c: function create() {
			span = element("span");
			section = element("section");
			label1 = element("label");
			div3 = element("div");
			div2 = element("div");
			label0 = element("label");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			input = element("input");
			t2 = space();
			div5 = element("div");
			div4 = element("div");
			t3 = space();
			attr_dev(div0, "class", "ansoptlabel form-control ansopt");
			attr_dev(div0, "value", div0_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]]);
			add_location(div0, file, 88, 40, 4674);
			attr_dev(input, "type", input_type_value = /*correctAnswers*/ ctx[3] <= 1 ? 'radio' : 'checkbox');
			attr_dev(input, "class", "answer_radio");
			attr_dev(input, "id", input_id_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(input, "name", "userans[]");
			input.value = input_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]];
			add_location(input, file, 95, 44, 5216);
			attr_dev(div1, "tabindex", "0");

			attr_dev(div1, "class", div1_class_value = /*reviewMode*/ ctx[6] == true && /*mcqItem*/ ctx[12].is_correct == 1
			? 'ansoptinput input-group-text active'
			: 'ansoptinput input-group-text');

			add_location(div1, file, 91, 40, 4888);
			attr_dev(label0, "for", label0_for_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(label0, "access-key", label0_access_key_value = /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(label0, "class", "d-flex");
			add_location(label0, file, 87, 36, 4556);
			attr_dev(div2, "class", "input-group");
			add_location(div2, file, 86, 32, 4493);
			attr_dev(div3, "class", "span1 float-left");
			add_location(div3, file, 85, 28, 4429);
			attr_dev(div4, "class", "answer");
			set_style(div4, "min-height", "21px");
			add_location(div4, file, 107, 32, 5911);
			attr_dev(div5, "class", "printer");
			add_location(div5, file, 106, 28, 5856);
			attr_dev(label1, "for", label1_for_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(label1, "class", "option glow");
			add_location(label1, file, 84, 24, 4343);
			attr_dev(section, "class", "answer_container");
			add_location(section, file, 83, 20, 4283);
			attr_dev(span, "anscounter", "0");
			add_location(span, file, 82, 16, 4240);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, section);
			append_dev(section, label1);
			append_dev(label1, div3);
			append_dev(div3, div2);
			append_dev(div2, label0);
			append_dev(label0, div0);
			append_dev(div0, t0);
			append_dev(label0, t1);
			append_dev(label0, div1);
			append_dev(div1, input);
			append_dev(label1, t2);
			append_dev(label1, div5);
			append_dev(div5, div4);
			div4.innerHTML = raw_value;
			append_dev(span, t3);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*letters*/ 1 && t0_value !== (t0_value = /*letters*/ ctx[0][/*i*/ ctx[11]] + "")) set_data_dev(t0, t0_value);

			if (dirty & /*letters*/ 1 && div0_value_value !== (div0_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(div0, "value", div0_value_value);
			}

			if (dirty & /*correctAnswers*/ 8 && input_type_value !== (input_type_value = /*correctAnswers*/ ctx[3] <= 1 ? 'radio' : 'checkbox')) {
				attr_dev(input, "type", input_type_value);
			}

			if (dirty & /*letters*/ 1 && input_id_value !== (input_id_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*letters*/ 1 && input_value_value !== (input_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]]) && input.value !== input_value_value) {
				prop_dev(input, "value", input_value_value);
			}

			if (dirty & /*reviewMode, data*/ 66 && div1_class_value !== (div1_class_value = /*reviewMode*/ ctx[6] == true && /*mcqItem*/ ctx[12].is_correct == 1
			? 'ansoptinput input-group-text active'
			: 'ansoptinput input-group-text')) {
				attr_dev(div1, "class", div1_class_value);
			}

			if (dirty & /*letters*/ 1 && label0_for_value !== (label0_for_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(label0, "for", label0_for_value);
			}

			if (dirty & /*letters*/ 1 && label0_access_key_value !== (label0_access_key_value = /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(label0, "access-key", label0_access_key_value);
			}

			if (dirty & /*data*/ 2 && raw_value !== (raw_value = get_ucsyntax(/*mcqItem*/ ctx[12].answer) + "")) div4.innerHTML = raw_value;
			if (dirty & /*letters*/ 1 && label1_for_value !== (label1_for_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(label1, "for", label1_for_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(82:12) {#each data as mcqItem, i}",
		ctx
	});

	return block;
}

// (44:16) {#each data as item, i}
function create_each_block(ctx) {
	let span;
	let section;
	let label1;
	let div3;
	let div2;
	let label0;
	let div0;
	let t0_value = /*letters*/ ctx[0][/*i*/ ctx[11]] + "";
	let t0;
	let div0_value_value;
	let t1;
	let div1;
	let input;
	let input_type_value;
	let input_id_value;
	let input_value_value;
	let div1_class_value;
	let label0_for_value;
	let label0_access_key_value;
	let t2;
	let div5;
	let div4;
	let t3_value = /*item*/ ctx[9].answer + "";
	let t3;
	let label1_for_value;
	let t4;

	const block = {
		c: function create() {
			span = element("span");
			section = element("section");
			label1 = element("label");
			div3 = element("div");
			div2 = element("div");
			label0 = element("label");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			input = element("input");
			t2 = space();
			div5 = element("div");
			div4 = element("div");
			t3 = text(t3_value);
			t4 = space();
			attr_dev(div0, "class", "ansoptlabel form-control ansopt");
			attr_dev(div0, "value", div0_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]]);
			add_location(div0, file, 50, 44, 2420);
			attr_dev(input, "type", input_type_value = /*correctAnswers*/ ctx[3] <= 1 ? "radio" : "checkbox");
			attr_dev(input, "class", "answer_radio");
			attr_dev(input, "id", input_id_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(input, "name", "userans[]");
			input.value = input_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]];
			add_location(input, file, 57, 48, 2981);
			attr_dev(div1, "tabindex", "0");

			attr_dev(div1, "class", div1_class_value = /*reviewMode*/ ctx[6] == true && /*item*/ ctx[9].is_correct == 1
			? "ansoptinput input-group-text active"
			: "ansoptinput input-group-text");

			add_location(div1, file, 53, 44, 2644);
			attr_dev(label0, "for", label0_for_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(label0, "access-key", label0_access_key_value = /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(label0, "class", "d-flex");
			add_location(label0, file, 49, 40, 2300);
			attr_dev(div2, "class", "input-group");
			add_location(div2, file, 48, 32, 2233);
			attr_dev(div3, "class", "span1 float-left");
			add_location(div3, file, 47, 32, 2169);
			attr_dev(div4, "class", "answer");
			set_style(div4, "min-height", "21px");
			add_location(div4, file, 69, 40, 3746);
			attr_dev(div5, "class", "printer");
			add_location(div5, file, 68, 36, 3683);
			attr_dev(label1, "for", label1_for_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]]);
			attr_dev(label1, "class", "option glow");
			add_location(label1, file, 46, 28, 2079);
			attr_dev(section, "class", "answer_container");
			add_location(section, file, 45, 24, 2015);
			attr_dev(span, "anscounter", "0");
			add_location(span, file, 44, 20, 1968);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, section);
			append_dev(section, label1);
			append_dev(label1, div3);
			append_dev(div3, div2);
			append_dev(div2, label0);
			append_dev(label0, div0);
			append_dev(div0, t0);
			append_dev(label0, t1);
			append_dev(label0, div1);
			append_dev(div1, input);
			append_dev(label1, t2);
			append_dev(label1, div5);
			append_dev(div5, div4);
			append_dev(div4, t3);
			append_dev(span, t4);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*letters*/ 1 && t0_value !== (t0_value = /*letters*/ ctx[0][/*i*/ ctx[11]] + "")) set_data_dev(t0, t0_value);

			if (dirty & /*letters*/ 1 && div0_value_value !== (div0_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(div0, "value", div0_value_value);
			}

			if (dirty & /*correctAnswers*/ 8 && input_type_value !== (input_type_value = /*correctAnswers*/ ctx[3] <= 1 ? "radio" : "checkbox")) {
				attr_dev(input, "type", input_type_value);
			}

			if (dirty & /*letters*/ 1 && input_id_value !== (input_id_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*letters*/ 1 && input_value_value !== (input_value_value = /*letters*/ ctx[0][/*i*/ ctx[11]]) && input.value !== input_value_value) {
				prop_dev(input, "value", input_value_value);
			}

			if (dirty & /*reviewMode, data*/ 66 && div1_class_value !== (div1_class_value = /*reviewMode*/ ctx[6] == true && /*item*/ ctx[9].is_correct == 1
			? "ansoptinput input-group-text active"
			: "ansoptinput input-group-text")) {
				attr_dev(div1, "class", div1_class_value);
			}

			if (dirty & /*letters*/ 1 && label0_for_value !== (label0_for_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(label0, "for", label0_for_value);
			}

			if (dirty & /*letters*/ 1 && label0_access_key_value !== (label0_access_key_value = /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(label0, "access-key", label0_access_key_value);
			}

			if (dirty & /*data*/ 2 && t3_value !== (t3_value = /*item*/ ctx[9].answer + "")) set_data_dev(t3, t3_value);

			if (dirty & /*letters*/ 1 && label1_for_value !== (label1_for_value = "pUserans-" + /*letters*/ ctx[0][/*i*/ ctx[11]])) {
				attr_dev(label1, "for", label1_for_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(44:16) {#each data as item, i}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (/*previewMode*/ ctx[7]) return create_if_block;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
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
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if_block.d(detaching);
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
	validate_slots('OptionContainer', slots, []);
	let { letters } = $$props;
	let { data } = $$props;
	let { editOption } = $$props;
	let { correctAnswers } = $$props;
	let { toggleChecked } = $$props;
	let { deleteOption } = $$props;
	let { reviewMode = false } = $$props;
	let { previewMode = false } = $$props;

	// used for open the parent guid of this guid which created this guid using List Item module when clicked on 'Yes' button of alert label
	function showParentGuid() {
		// url for open the parent guid
		let futureUrl = baseUrl + 'editor/?action=edit&content_guid=' + AH.get('get_parent_guid') + '&no_header=1&react_content=1&no_domain=1';

		// opens the url in new tab with parent guid
		window.open(futureUrl, '_blank');
	}

	const writable_props = [
		'letters',
		'data',
		'editOption',
		'correctAnswers',
		'toggleChecked',
		'deleteOption',
		'reviewMode',
		'previewMode'
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OptionContainer> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('letters' in $$props) $$invalidate(0, letters = $$props.letters);
		if ('data' in $$props) $$invalidate(1, data = $$props.data);
		if ('editOption' in $$props) $$invalidate(2, editOption = $$props.editOption);
		if ('correctAnswers' in $$props) $$invalidate(3, correctAnswers = $$props.correctAnswers);
		if ('toggleChecked' in $$props) $$invalidate(4, toggleChecked = $$props.toggleChecked);
		if ('deleteOption' in $$props) $$invalidate(5, deleteOption = $$props.deleteOption);
		if ('reviewMode' in $$props) $$invalidate(6, reviewMode = $$props.reviewMode);
		if ('previewMode' in $$props) $$invalidate(7, previewMode = $$props.previewMode);
	};

	$$self.$capture_state = () => ({
		l,
		AH,
		letters,
		data,
		editOption,
		correctAnswers,
		toggleChecked,
		deleteOption,
		reviewMode,
		previewMode,
		showParentGuid
	});

	$$self.$inject_state = $$props => {
		if ('letters' in $$props) $$invalidate(0, letters = $$props.letters);
		if ('data' in $$props) $$invalidate(1, data = $$props.data);
		if ('editOption' in $$props) $$invalidate(2, editOption = $$props.editOption);
		if ('correctAnswers' in $$props) $$invalidate(3, correctAnswers = $$props.correctAnswers);
		if ('toggleChecked' in $$props) $$invalidate(4, toggleChecked = $$props.toggleChecked);
		if ('deleteOption' in $$props) $$invalidate(5, deleteOption = $$props.deleteOption);
		if ('reviewMode' in $$props) $$invalidate(6, reviewMode = $$props.reviewMode);
		if ('previewMode' in $$props) $$invalidate(7, previewMode = $$props.previewMode);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		letters,
		data,
		editOption,
		correctAnswers,
		toggleChecked,
		deleteOption,
		reviewMode,
		previewMode,
		showParentGuid
	];
}

class OptionContainer extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			letters: 0,
			data: 1,
			editOption: 2,
			correctAnswers: 3,
			toggleChecked: 4,
			deleteOption: 5,
			reviewMode: 6,
			previewMode: 7
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "OptionContainer",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*letters*/ ctx[0] === undefined && !('letters' in props)) {
			console.warn("<OptionContainer> was created without expected prop 'letters'");
		}

		if (/*data*/ ctx[1] === undefined && !('data' in props)) {
			console.warn("<OptionContainer> was created without expected prop 'data'");
		}

		if (/*editOption*/ ctx[2] === undefined && !('editOption' in props)) {
			console.warn("<OptionContainer> was created without expected prop 'editOption'");
		}

		if (/*correctAnswers*/ ctx[3] === undefined && !('correctAnswers' in props)) {
			console.warn("<OptionContainer> was created without expected prop 'correctAnswers'");
		}

		if (/*toggleChecked*/ ctx[4] === undefined && !('toggleChecked' in props)) {
			console.warn("<OptionContainer> was created without expected prop 'toggleChecked'");
		}

		if (/*deleteOption*/ ctx[5] === undefined && !('deleteOption' in props)) {
			console.warn("<OptionContainer> was created without expected prop 'deleteOption'");
		}
	}

	get letters() {
		throw new Error("<OptionContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set letters(value) {
		throw new Error("<OptionContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get data() {
		throw new Error("<OptionContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set data(value) {
		throw new Error("<OptionContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editOption() {
		throw new Error("<OptionContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editOption(value) {
		throw new Error("<OptionContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get correctAnswers() {
		throw new Error("<OptionContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set correctAnswers(value) {
		throw new Error("<OptionContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggleChecked() {
		throw new Error("<OptionContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggleChecked(value) {
		throw new Error("<OptionContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteOption() {
		throw new Error("<OptionContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteOption(value) {
		throw new Error("<OptionContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get reviewMode() {
		throw new Error("<OptionContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set reviewMode(value) {
		throw new Error("<OptionContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get previewMode() {
		throw new Error("<OptionContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set previewMode(value) {
		throw new Error("<OptionContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export { OptionContainer as O };
//# sourceMappingURL=OptionContainer-2f7e0b1a.js.map
