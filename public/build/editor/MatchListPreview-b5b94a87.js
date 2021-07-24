
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, M as append_styles, P as Dialog, Q as binding_callbacks, R as bind, v as validate_slots, o as onMount, U as Draggable, A as AH, L as beforeUpdate, X as XMLToJSON, a6 as l, a0 as onUserAnsChange, V as Button, e as element, j as attr_dev, l as set_style, k as add_location, n as insert_dev, q as listen_dev, B as noop, x as detach_dev, f as space, c as create_component, h as text, p as append_dev, m as mount_component, F as set_data_dev, Z as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, H as run_all, C as validate_each_argument, K as destroy_each, a4 as HtmlTag, Y as src_url_equal } from './main-90e9db53.js';
import { I as ItemHelper } from './ItemHelper-9f43880d.js';
import { s as styleInject } from './style-inject.es-1c867377.js';

var css_248z = "[id^=matchmain]{width:700px;min-height:10px;font-size:12px;position:relative;font-family:Arial,\"Helvetica Neue\",Helvetica,sans-serif;font-size:14px}[id^=matchmain] .row-fluid{width:100%}[id^=matchmain] .row-fluid:after,[id^=matchmain] .row-fluid:before{display:table;line-height:0;content:\"\"}[id^=matchmain] .row-fluid:after{clear:both}[id^=matchmain] .row-fluid [class*=span]{display:block;float:left;width:100%;min-height:30px;margin-left:2.127659574468085%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}[id^=matchmain] .row-fluid [class*=span]:first-child{margin-left:0}[id^=matchmain] .row-fluid .span4{width:36.914893617021278%}[id^=matchmain] .row-fluid .span3{width:21.914893617021278%!important;}[id^=matchmain] .heading{font-size:17px!important;font-weight:400;margin-bottom:20px;line-height:30px}[id^=matchmain] .arrow{min-height:44px;padding:7px 10px;background:url(../../images/arrow_matchtype.png) no-repeat 100% 50%;margin-left:-10.5%;margin-right:-10%}[id^=matchmain] .list4{display:inline-table;width:214px;margin-right:1.3%;cursor:move}[id^=matchmain] .list1,[id^=matchmain] .list2,[id^=matchmain] .list4{padding:7px 10px;margin-bottom:5px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;font-size:12px;line-height:20px;min-height:40px;word-wrap:break-word}[id^=matchmain] .list3{padding:7px 10px;text-align:center;margin-bottom:5px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;font-size:12px;min-height:40px;word-wrap:break-word;line-height:25px}[id^=matchmain] .list1{border:1px solid #000;background-color:#cfc;cursor:move;line-height:22px}[id^=matchmain] .list2,[id^=matchmain] .list4{border:1px solid #000;background-color:#ffc;position:relative}[id^=matchmain] .list3{border:1px solid #000;background-color:#fff;position:relative}[id^=matchmain] .clone{z-index:0!important;background-color:#fffcc1!important;border:none!important}[id^=matchmain] .drop-hover{border:1px dashed #000;box-shadow:0 0 0 1px #000 inset}[id^=matchmain] #lines{width:100%;height:100%;position:absolute;top:7px;left:0}[id^=matchmain] .line{stroke:#000;stroke-width:2px;z-index:11}[id^=matchmain] .serial{float:left;padding-right:1px}[id^=matchmain] .correct{stroke:#5bb75b;stroke-width:2px;z-index:0}[id^=matchmain] .list1 img,[id^=matchmain] .list2 img,[id^=matchmain] .list3 img,[id^=matchmain] .list4 img{max-width:100px;max-height:100px}.match_options{background:#e4eeff;margin-top:3%;margin-bottom:1%;padding:15px 10px 10px 20px;box-shadow:0 0 2px 1px gray;height:auto}.dropped{background-color:#ffc!important;cursor:move}.matchlist-delete{cursor:pointer;height:20px;width:20px;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;background-color:#000;color:#fff;font-weight:700;font-size:20px;line-height:20px;position:absolute;z-index:16}.list1,.list2,.list3,.list4{color:#000!important}.selmatch{border:solid 2px red!important;border-radius:2px!important}.remoutline{outline:solid 3px red!important}.copiedclr{background-color:#ccc!important}.bla [id^=matchmain] .list1:focus,.bla [id^=matchmain] .list2:focus,.bla [id^=matchmain] .list3:focus,.bla [id^=matchmain] .list4:focus{box-shadow:inset 0 0 0 1px transparent,inset 0 0 0 1px #fff,inset 0 0 0 2px #fff;outline:0}.textdel>span{top:0}\r\n\r\n.context {\r\n    position: absolute;\r\n    top: 0px;\r\n    left: 0px;\r\n    min-width: 180px;\r\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\r\n    color: #000;\r\n    background: #f5f5f5;\r\n    font-size: 9pt;\r\n    border: 1px solid #333333;\r\n    box-shadow: 4px 4px 3px -1px rgba(0, 0, 0, 0.5);\r\n    padding: 3px 0px;\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    z-index: 1061;\r\n}\r\n\r\n.context .item {\r\n    padding: 4px 19px;\r\n    cursor: default;\r\n    color: inherit;\r\n    text-align: left\r\n}\r\n\r\n.context .item:hover {\r\n    background: #e3e3e3 !important;\r\n}\r\n\r\n.context .item:hover .hotkey {\r\n    color: #000 !important;\r\n}\r\n\r\n.context .disabled {\r\n    color: #878B90 !important;\r\n}\r\n\r\n.context .disabled:hover {\r\n    background: inherit !important;\r\n}\r\n\r\n.context .disabled:hover .hotkey {\r\n    color: #878B90 !important;\r\n}\r\n\r\n.context .separator {\r\n    margin: 4px 0px;\r\n    height: 0;\r\n    padding: 0;\r\n    border-top: 1px solid #b3b3b3;\r\n}\r\n\r\n.hotkey {\r\n    color: #878B90;\r\n    float: right;\r\n}";
styleInject(css_248z);

/* clsSMMatchList\MatchListPreview.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMMatchList\\MatchListPreview.svelte";

function add_css(target) {
	append_styles(target, "svelte-bi3u6x", ".u-sr-only.svelte-bi3u6x{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}@media(max-width:500px){.shuffle.svelte-bi3u6x{text-align:center}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF0Y2hMaXN0UHJldmlldy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBaTRCQyxVQUFVLGNBQUMsQ0FBQyxBQUNYLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLElBQUksQ0FBRSxRQUFRLENBQ2QsR0FBRyxDQUFFLElBQUksQ0FDVCxNQUFNLEdBQUcsQ0FDVCxPQUFPLEdBQUcsQ0FDVixTQUFTLE1BQU0sQUFDaEIsQ0FBQyxBQUNELE1BQU0sV0FBVyxLQUFLLENBQUMsQUFBQyxDQUFDLEFBQ3hCLFFBQVEsY0FBQyxDQUFDLEFBQ1QsV0FBVyxNQUFNLEFBQ2xCLENBQUMsQUFDRixDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIk1hdGNoTGlzdFByZXZpZXcuc3ZlbHRlIl19 */");
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[52] = list[i];
	child_ctx[54] = i;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[52] = list[i];
	child_ctx[54] = i;
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[52] = list[i];
	child_ctx[54] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[52] = list[i];
	child_ctx[54] = i;
	return child_ctx;
}

// (723:3) {#if editorState}
function create_if_block_1(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = `${l.shuffle}`;
			attr_dev(div, "id", "shuffleArea");
			attr_dev(div, "class", "shuffle text-center svelte-bi3u6x");
			set_style(div, "font-size", "17px");
			set_style(div, "cursor", "pointer");
			set_style(div, "display", "none");
			set_style(div, "color", "#aaa");
			add_location(div, file, 723, 4, 22075);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (!mounted) {
				dispose = listen_dev(div, "click", /*shuffleItems*/ ctx[15], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(723:3) {#if editorState}",
		ctx
	});

	return block;
}

// (805:4) {:else}
function create_else_block(ctx) {
	let div1;
	let t;
	let div0;
	let each_value_3 = /*list1*/ ctx[7];
	validate_each_argument(each_value_3);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	let each_value_2 = /*list2*/ ctx[8];
	validate_each_argument(each_value_2);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const block = {
		c: function create() {
			div1 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "row-fluid match_options shuffleList2");
			add_location(div0, file, 841, 6, 26046);
			attr_dev(div1, "class", "row-fluid shuffleList1");
			add_location(div1, file, 805, 5, 24963);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div1, null);
			}

			append_dev(div1, t);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1, setList1Html*/ 65664) {
				each_value_3 = /*list1*/ ctx[7];
				validate_each_argument(each_value_3);
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_3(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div1, t);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_3.length;
			}

			if (dirty[0] & /*list2, setList2Html, alphabet*/ 133376) {
				each_value_2 = /*list2*/ ctx[8];
				validate_each_argument(each_value_2);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(805:4) {:else}",
		ctx
	});

	return block;
}

// (766:4) {#if (multimatch == 0 || multimatch == 1)}
function create_if_block(ctx) {
	let div3;
	let div0;
	let t0;
	let div1;
	let t1;
	let div2;
	let each_value_1 = /*list1*/ ctx[7];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*list2*/ ctx[8];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div3 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = space();
			div1 = element("div");
			t1 = space();
			div2 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "span4 shuffleList1");
			attr_dev(div0, "dragable", "1");
			add_location(div0, file, 767, 5, 23933);
			attr_dev(div1, "class", "span3");
			add_location(div1, file, 785, 5, 24453);
			attr_dev(div2, "class", "span4 shuffleList2");
			add_location(div2, file, 786, 5, 24485);
			attr_dev(div3, "class", "row-fluid");
			add_location(div3, file, 766, 4, 23903);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div0, null);
			}

			append_dev(div3, t0);
			append_dev(div3, div1);
			append_dev(div3, t1);
			append_dev(div3, div2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div2, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1, setList1Html*/ 65664) {
				each_value_1 = /*list1*/ ctx[7];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div0, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty[0] & /*list2, setList2Html, alphabet*/ 133376) {
				each_value = /*list2*/ ctx[8];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div2, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(766:4) {#if (multimatch == 0 || multimatch == 1)}",
		ctx
	});

	return block;
}

// (807:6) {#each list1 as data,i}
function create_each_block_3(ctx) {
	let div3;
	let span0;
	let div0;
	let raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[52], /*i*/ ctx[54]) + "";
	let div0_id_value;
	let div0_tabindex_value;
	let div0_data_correctans_value;
	let div0_data_userans_value;
	let div0_data_originalseq_value;
	let t0;
	let span1;
	let div1;
	let div1_id_value;
	let t1;
	let span2;
	let div2;
	let t2;
	let div2_id_value;
	let div2_data_correctans_value;
	let div2_data_userans_value;
	let div2_mrel_value;
	let div2_tabindex_value;
	let div2_aria_label_value;
	let div2_data_originalseq_value;
	let div3_key_value;

	const block = {
		c: function create() {
			div3 = element("div");
			span0 = element("span");
			div0 = element("div");
			t0 = space();
			span1 = element("span");
			div1 = element("div");
			t1 = space();
			span2 = element("span");
			div2 = element("div");
			t2 = text("Place Here");
			attr_dev(div0, "id", div0_id_value = /*data*/ ctx[52].id);
			attr_dev(div0, "class", "list1");
			attr_dev(div0, "tabindex", div0_tabindex_value = 0);
			attr_dev(div0, "data-correctans", div0_data_correctans_value = /*data*/ ctx[52].correctans);
			attr_dev(div0, "data-userans", div0_data_userans_value = /*data*/ ctx[52].userans);

			attr_dev(div0, "data-originalseq", div0_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div0, file, 809, 9, 25111);
			attr_dev(span0, "class", "span4");
			add_location(span0, file, 808, 8, 25080);
			attr_dev(div1, "id", div1_id_value = /*data*/ ctx[52].id);
			attr_dev(div1, "class", "arrow");
			add_location(div1, file, 820, 9, 25459);
			attr_dev(span1, "class", "span3");
			add_location(span1, file, 819, 8, 25428);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[52].id);
			attr_dev(div2, "class", "list3 ui-droppable");
			attr_dev(div2, "data-droped", "");
			attr_dev(div2, "data-correctans", div2_data_correctans_value = /*data*/ ctx[52].correctans);
			attr_dev(div2, "data-userans", div2_data_userans_value = /*data*/ ctx[52].userans);
			attr_dev(div2, "mrel", div2_mrel_value = /*data*/ ctx[52].id);
			attr_dev(div2, "dropzone", "1");
			attr_dev(div2, "draggable", "true");
			attr_dev(div2, "tabindex", div2_tabindex_value = 0);
			attr_dev(div2, "aria-label", div2_aria_label_value = `Droped`);

			attr_dev(div2, "data-originalseq", div2_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div2, file, 823, 9, 25555);
			attr_dev(span2, "class", "span4");
			add_location(span2, file, 822, 8, 25524);
			attr_dev(div3, "key", div3_key_value = /*i*/ ctx[54]);
			attr_dev(div3, "class", "row-fluid");
			add_location(div3, file, 807, 7, 25039);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, span0);
			append_dev(span0, div0);
			div0.innerHTML = raw_value;
			append_dev(div3, t0);
			append_dev(div3, span1);
			append_dev(span1, div1);
			append_dev(div3, t1);
			append_dev(div3, span2);
			append_dev(span2, div2);
			append_dev(div2, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1*/ 128 && raw_value !== (raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[52], /*i*/ ctx[54]) + "")) div0.innerHTML = raw_value;
			if (dirty[0] & /*list1*/ 128 && div0_id_value !== (div0_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div0, "id", div0_id_value);
			}

			if (dirty[0] & /*list1*/ 128 && div0_data_correctans_value !== (div0_data_correctans_value = /*data*/ ctx[52].correctans)) {
				attr_dev(div0, "data-correctans", div0_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div0_data_userans_value !== (div0_data_userans_value = /*data*/ ctx[52].userans)) {
				attr_dev(div0, "data-userans", div0_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div0_data_originalseq_value !== (div0_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div0, "data-originalseq", div0_data_originalseq_value);
			}

			if (dirty[0] & /*list1*/ 128 && div1_id_value !== (div1_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div1, "id", div1_id_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_id_value !== (div2_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_data_correctans_value !== (div2_data_correctans_value = /*data*/ ctx[52].correctans)) {
				attr_dev(div2, "data-correctans", div2_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_data_userans_value !== (div2_data_userans_value = /*data*/ ctx[52].userans)) {
				attr_dev(div2, "data-userans", div2_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_mrel_value !== (div2_mrel_value = /*data*/ ctx[52].id)) {
				attr_dev(div2, "mrel", div2_mrel_value);
			}

			if (dirty[0] & /*list1*/ 128 && div2_data_originalseq_value !== (div2_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div2, "data-originalseq", div2_data_originalseq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_3.name,
		type: "each",
		source: "(807:6) {#each list1 as data,i}",
		ctx
	});

	return block;
}

// (843:7) {#each list2 as data,i}
function create_each_block_2(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[52], /*alphabet*/ ctx[11][/*i*/ ctx[54]]) + "";
	let t;
	let div_key_value;
	let div_id_value;
	let div_tabindex_value;
	let div_data_originalseq_value;

	const block = {
		c: function create() {
			div = element("div");
			html_tag = new HtmlTag();
			t = space();
			html_tag.a = t;
			attr_dev(div, "key", div_key_value = /*i*/ ctx[54]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[52].id);
			attr_dev(div, "class", "list4 ui-draggable");
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "dragable", "1");
			attr_dev(div, "draggable", "true");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "tabindex", div_tabindex_value = 0);

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div, file, 843, 8, 26138);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list2*/ 256 && raw_value !== (raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[52], /*alphabet*/ ctx[11][/*i*/ ctx[54]]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list2*/ 256 && div_id_value !== (div_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list2*/ 256 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div, "data-originalseq", div_data_originalseq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(843:7) {#each list2 as data,i}",
		ctx
	});

	return block;
}

// (769:6) {#each list1 as data,i}
function create_each_block_1(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[52], /*i*/ ctx[54]) + "";
	let t;
	let div_key_value;
	let div_id_value;
	let div_data_correctans_value;
	let div_data_userans_value;
	let div_style_value;
	let div_tabindex_value;
	let div_data_originalseq_value;

	const block = {
		c: function create() {
			div = element("div");
			html_tag = new HtmlTag();
			t = space();
			html_tag.a = t;
			attr_dev(div, "key", div_key_value = /*i*/ ctx[54]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[52].id);
			attr_dev(div, "class", "list1 ui-draggable");
			attr_dev(div, "data-correctans", div_data_correctans_value = /*data*/ ctx[52].correctans);
			attr_dev(div, "data-userans", div_data_userans_value = /*data*/ ctx[52].userans);
			attr_dev(div, "style", div_style_value = 'position:relative;');
			attr_dev(div, "tabindex", div_tabindex_value = 0);
			attr_dev(div, "draggable", "true");

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div, file, 769, 8, 24019);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list1*/ 128 && raw_value !== (raw_value = /*setList1Html*/ ctx[16](/*data*/ ctx[52], /*i*/ ctx[54]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list1*/ 128 && div_id_value !== (div_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list1*/ 128 && div_data_correctans_value !== (div_data_correctans_value = /*data*/ ctx[52].correctans)) {
				attr_dev(div, "data-correctans", div_data_correctans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div_data_userans_value !== (div_data_userans_value = /*data*/ ctx[52].userans)) {
				attr_dev(div, "data-userans", div_data_userans_value);
			}

			if (dirty[0] & /*list1*/ 128 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div, "data-originalseq", div_data_originalseq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(769:6) {#each list1 as data,i}",
		ctx
	});

	return block;
}

// (788:5) {#each list2 as data,i}
function create_each_block(ctx) {
	let div;
	let html_tag;
	let raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[52], /*alphabet*/ ctx[11][/*i*/ ctx[54]]) + "";
	let t;
	let div_key_value;
	let div_id_value;
	let div_style_value;
	let div_tabindex_value;
	let div_data_originalseq_value;

	const block = {
		c: function create() {
			div = element("div");
			html_tag = new HtmlTag();
			t = space();
			html_tag.a = t;
			attr_dev(div, "key", div_key_value = /*i*/ ctx[54]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[52].id);
			attr_dev(div, "class", "list2 ui-droppable");
			attr_dev(div, "data-correctans", "");
			attr_dev(div, "data-userans", "");
			attr_dev(div, "dropzone", "1");
			attr_dev(div, "style", div_style_value = 'position:relative;');
			attr_dev(div, "tabindex", div_tabindex_value = 0);

			attr_dev(div, "data-originalseq", div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0");

			add_location(div, file, 788, 6, 24555);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			html_tag.m(raw_value, div);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*list2*/ 256 && raw_value !== (raw_value = /*setList2Html*/ ctx[17](/*data*/ ctx[52], /*alphabet*/ ctx[11][/*i*/ ctx[54]]) + "")) html_tag.p(raw_value);

			if (dirty[0] & /*list2*/ 256 && div_id_value !== (div_id_value = /*data*/ ctx[52].id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (dirty[0] & /*list2*/ 256 && div_data_originalseq_value !== (div_data_originalseq_value = /*data*/ ctx[52].originalseq
			? /*data*/ ctx[52].originalseq
			: "0")) {
				attr_dev(div, "data-originalseq", div_data_originalseq_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(788:5) {#each list2 as data,i}",
		ctx
	});

	return block;
}

// (872:5) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>
function create_default_slot_1(ctx) {
	let i_1;
	let span;

	const block = {
		c: function create() {
			i_1 = element("i");
			span = element("span");
			span.textContent = "close";
			attr_dev(span, "class", "u-sr-only svelte-bi3u6x");
			add_location(span, file, 872, 29, 26967);
			attr_dev(i_1, "class", "mi mi-close");
			add_location(i_1, file, 872, 6, 26944);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i_1, anchor);
			append_dev(i_1, span);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i_1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(872:5) <Button style={'position:relative;left:21px;bottom:6px;'} on:click={()=>{state.dropDialog = false}}>",
		ctx
	});

	return block;
}

// (865:1) <Dialog     bind:visible={state.dropDialog}     style={'width:450px;height:254px;'}    >
function create_default_slot(ctx) {
	let div2;
	let div0;
	let t1;
	let div1;
	let button;
	let t2;
	let div4;
	let div3;
	let img;
	let img_src_value;
	let t3;
	let br;
	let t4;
	let span;
	let input;
	let t5;
	let label;
	let current;

	button = new Button({
			props: {
				style: 'position:relative;left:21px;bottom:6px;',
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", /*click_handler_3*/ ctx[30]);

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			div0.textContent = "How to drop?";
			t1 = space();
			div1 = element("div");
			create_component(button.$$.fragment);
			t2 = space();
			div4 = element("div");
			div3 = element("div");
			img = element("img");
			t3 = space();
			br = element("br");
			t4 = space();
			span = element("span");
			input = element("input");
			t5 = space();
			label = element("label");
			label.textContent = "Do not show this dialog again";
			attr_dev(div0, "title", "How to drop?");
			attr_dev(div0, "class", "float-start");
			add_location(div0, file, 869, 4, 26736);
			attr_dev(div1, "class", "float-end");
			add_location(div1, file, 870, 4, 26806);
			set_style(div2, "font-weight", "bold");
			attr_dev(div2, "class", "clearfix");
			add_location(div2, file, 868, 3, 26682);
			attr_dev(img, "alt", "gif file");
			if (!src_url_equal(img.src, img_src_value = AH.select("#matchmain").getAttribute('path') + "match_drop_000BOG.gif")) attr_dev(img, "src", img_src_value);
			add_location(img, file, 879, 5, 27093);
			add_location(br, file, 883, 5, 27222);
			attr_dev(input, "type", "checkbox");
			set_style(input, "top", "2px");
			attr_dev(input, "class", "relative donotshowdialog");
			attr_dev(input, "id", "dropId");
			add_location(input, file, 885, 6, 27261);
			attr_dev(label, "for", "dropId");
			add_location(label, file, 886, 6, 27356);
			attr_dev(span, "class", "mt-2");
			add_location(span, file, 884, 5, 27234);
			attr_dev(div3, "class", "row");
			add_location(div3, file, 877, 4, 27062);
			add_location(div4, file, 876, 3, 27051);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div2, t1);
			append_dev(div2, div1);
			mount_component(button, div1, null);
			insert_dev(target, t2, anchor);
			insert_dev(target, div4, anchor);
			append_dev(div4, div3);
			append_dev(div3, img);
			append_dev(div3, t3);
			append_dev(div3, br);
			append_dev(div3, t4);
			append_dev(div3, span);
			append_dev(span, input);
			append_dev(span, t5);
			append_dev(span, label);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty[1] & /*$$scope*/ 134217728) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_component(button);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(div4);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(865:1) <Dialog     bind:visible={state.dropDialog}     style={'width:450px;height:254px;'}    >",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let div10;
	let center;
	let t0;
	let div9;
	let div0;
	let itemhelper;
	let t1;
	let div2;
	let div1;
	let button0;
	let button0_tabindex_value;
	let t3;
	let button1;
	let button1_tabindex_value;
	let t5;
	let button2;
	let button2_tabindex_value;
	let div2_class_value;
	let t7;
	let div8;
	let div4;
	let div3;
	let t8;
	let t9;
	let div5;
	let t10;
	let div7;
	let div6;
	let t11;
	let t12;
	let t13;
	let dialog;
	let updating_visible;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*editorState*/ ctx[1] && create_if_block_1(ctx);

	itemhelper = new ItemHelper({
			props: {
				handleReviewClick: /*handleReview*/ ctx[18],
				reviewMode: /*isReview*/ ctx[0]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[13]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[14]);

	function select_block_type(ctx, dirty) {
		if (/*multimatch*/ ctx[2] == 0 || /*multimatch*/ ctx[2] == 1) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);

	function dialog_visible_binding(value) {
		/*dialog_visible_binding*/ ctx[31](value);
	}

	let dialog_props = {
		style: 'width:450px;height:254px;',
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	if (/*state*/ ctx[10].dropDialog !== void 0) {
		dialog_props.visible = /*state*/ ctx[10].dropDialog;
	}

	dialog = new Dialog({ props: dialog_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog, 'visible', dialog_visible_binding));

	const block = {
		c: function create() {
			main = element("main");
			div10 = element("div");
			center = element("center");
			if (if_block0) if_block0.c();
			t0 = space();
			div9 = element("div");
			div0 = element("div");
			create_component(itemhelper.$$.fragment);
			t1 = space();
			div2 = element("div");
			div1 = element("div");
			button0 = element("button");
			button0.textContent = "Correct Answer";
			t3 = space();
			button1 = element("button");
			button1.textContent = "Compare";
			t5 = space();
			button2 = element("button");
			button2.textContent = "Your Answer";
			t7 = space();
			div8 = element("div");
			div4 = element("div");
			div3 = element("div");
			t8 = text(/*listheading1*/ ctx[5]);
			t9 = space();
			div5 = element("div");
			t10 = space();
			div7 = element("div");
			div6 = element("div");
			t11 = text(/*listheading2*/ ctx[6]);
			t12 = space();
			if_block1.c();
			t13 = space();
			create_component(dialog.$$.fragment);
			attr_dev(div0, "class", "btn-group clearfix review_2 h");
			attr_dev(div0, "id", "sm_controller");
			add_location(div0, file, 740, 4, 22522);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "tabindex", button0_tabindex_value = 0);
			attr_dev(button0, "class", "btn btn-light correct-ans clr");
			add_location(button0, file, 750, 6, 22900);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "tabindex", button1_tabindex_value = 0);
			attr_dev(button1, "class", "btn btn-primary both-ans clr");
			add_location(button1, file, 751, 6, 23134);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "tabindex", button2_tabindex_value = 0);
			attr_dev(button2, "class", "btn btn-light your-answer clr");
			add_location(button2, file, 752, 6, 23352);
			attr_dev(div1, "class", "btn-group clearfix review_default h");
			attr_dev(div1, "id", "sm_controller_default");
			add_location(div1, file, 749, 5, 22816);
			attr_dev(div2, "class", div2_class_value = /*btnflag*/ ctx[12] == 0 ? "h" : "");
			add_location(div2, file, 748, 4, 22774);
			attr_dev(div3, "class", "heading");
			add_location(div3, file, 757, 6, 23657);
			attr_dev(div4, "class", "span4");
			add_location(div4, file, 756, 5, 23630);
			attr_dev(div5, "class", "span3");
			add_location(div5, file, 759, 5, 23718);
			attr_dev(div6, "class", "heading");
			add_location(div6, file, 761, 6, 23777);
			attr_dev(div7, "class", "span4");
			add_location(div7, file, 760, 5, 23750);
			attr_dev(div8, "class", "row-fluid");
			add_location(div8, file, 755, 4, 23600);
			attr_dev(div9, "id", /*containerID*/ ctx[3]);
			attr_dev(div9, "path", "//s3.amazonaws.com/jigyaasa_content_static/");
			attr_dev(div9, "multimatch", /*multimatch*/ ctx[2]);
			attr_dev(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[9]);
			set_style(div9, "font-family", "Roboto, sans-serif");
			set_style(div9, "font-size", "1em");
			add_location(div9, file, 732, 3, 22291);
			add_location(center, file, 721, 2, 22039);
			attr_dev(div10, "id", "previewSection");
			attr_dev(div10, "class", "px-2");
			add_location(div10, file, 720, 4, 21997);
			add_location(main, file, 719, 0, 21985);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div10);
			append_dev(div10, center);
			if (if_block0) if_block0.m(center, null);
			append_dev(center, t0);
			append_dev(center, div9);
			append_dev(div9, div0);
			mount_component(itemhelper, div0, null);
			append_dev(div9, t1);
			append_dev(div9, div2);
			append_dev(div2, div1);
			append_dev(div1, button0);
			append_dev(div1, t3);
			append_dev(div1, button1);
			append_dev(div1, t5);
			append_dev(div1, button2);
			append_dev(div9, t7);
			append_dev(div9, div8);
			append_dev(div8, div4);
			append_dev(div4, div3);
			append_dev(div3, t8);
			append_dev(div8, t9);
			append_dev(div8, div5);
			append_dev(div8, t10);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, t11);
			append_dev(div9, t12);
			if_block1.m(div9, null);
			append_dev(main, t13);
			mount_component(dialog, main, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[24], false, false, false),
					listen_dev(button0, "keyup", /*keyup_handler*/ ctx[25], false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[26], false, false, false),
					listen_dev(button1, "keyup", /*keyup_handler_1*/ ctx[27], false, false, false),
					listen_dev(button2, "click", /*click_handler_2*/ ctx[28], false, false, false),
					listen_dev(button2, "keyup", /*keyup_handler_2*/ ctx[29], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (/*editorState*/ ctx[1]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(center, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			const itemhelper_changes = {};
			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);
			if (!current || dirty[0] & /*listheading1*/ 32) set_data_dev(t8, /*listheading1*/ ctx[5]);
			if (!current || dirty[0] & /*listheading2*/ 64) set_data_dev(t11, /*listheading2*/ ctx[6]);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div9, null);
				}
			}

			if (!current || dirty[0] & /*containerID*/ 8) {
				attr_dev(div9, "id", /*containerID*/ ctx[3]);
			}

			if (!current || dirty[0] & /*multimatch*/ 4) {
				attr_dev(div9, "multimatch", /*multimatch*/ ctx[2]);
			}

			if (!current || dirty[0] & /*totalCorrectAns*/ 512) {
				attr_dev(div9, "totalcorrectans", /*totalCorrectAns*/ ctx[9]);
			}

			const dialog_changes = {};

			if (dirty[0] & /*state*/ 1024 | dirty[1] & /*$$scope*/ 134217728) {
				dialog_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible && dirty[0] & /*state*/ 1024) {
				updating_visible = true;
				dialog_changes.visible = /*state*/ ctx[10].dropDialog;
				add_flush_callback(() => updating_visible = false);
			}

			dialog.$set(dialog_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(itemhelper.$$.fragment, local);
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(itemhelper.$$.fragment, local);
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			if (if_block0) if_block0.d();
			destroy_component(itemhelper);
			if_block1.d();
			destroy_component(dialog);
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

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

// it removes the dplicate element in a array
function remove_duplicates_es6(arr) {
	arr = arr.filter(function (value, index, array) {
		return array.indexOf(value) == index;
	});

	return arr;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('MatchListPreview', slots, []);
	let { showAns } = $$props;
	let { cmed } = $$props;
	let { xml } = $$props;
	let { isReview } = $$props;
	let { uxml } = $$props;
	let { editorState } = $$props;
	let listheading1 = "";
	let listheading2 = "";
	let multimatch = "";
	let list1 = [];
	let list2 = [];
	let cdata = "";
	let isShuffeled = false;
	let totalCorrectAns = 0;

	let alphabet = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z"
	];

	let is_algo = false;
	let max_node = 0;
	let is_remediation = false;
	let match_lines = [];
	let errorCatchFlag = 1;
	let originalseq1 = "";
	let originalseq2 = "";
	ucMlid.sinfo = true;

	// let setList1Html;
	// let setList2Html;
	let btnflag = 1;

	let listenCall = 0;
	let containerID = cmed ? "matchmain" + cmed : "matchmain";
	let dragable;
	var top1 = 0;
	let ucMlid = {};

	let state = {
		xml: '',
		remedStatus: '',
		dropDialog: '',
		isReview: false
	};

	// for displaying the answer
	function displayAns() {
		let ans = ucMlid.checkAns("#" + containerID);
		onUserAnsChange({ uXml: ans.u, ans: ans.ans });

		if (editorState) {
			showAns(ans.ans);
		}
	}

	function loadLibs() {
		let config = {
			preload: true,
			type: 'stylesheet',
			as: 'style'
		};

		//AH.createLink(window.itemFolder + 'clsSMMatchList/css/matchList.min.css', config);
		AH.createLink("https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css", config);
	}

	onMount(async () => {
		$$invalidate(4, ucMlid = await import('./matchlistJSString-62f5ffec.js'));
		loadLibs();

		dragable = new Draggable({
				onDragEnter: event => {
					AH.select(event.target, 'addClass', 'drop-hover');
				},
				onDragLeave: event => {
					AH.select(event.target, 'removeClass', 'drop-hover');
				},
				onDragEnd: event => {
					displayAns();

					AH.selectAll('.list2').forEach(function (data, _this) {
						AH.select(data, 'removeClass', 'drop-hover');
					});

					AH.selectAll('.list3').forEach(function (data, _this) {
						AH.select(data, 'removeClass', 'drop-hover');
					});

					console.log('onDragEnd');

					if (!ucMlid.is_valid_drop) {
						if (ucMlid.sinfo) {
							$$invalidate(4, ucMlid.sinfo = false, ucMlid);

							setTimeout(
								function () {
									$$invalidate(4, ucMlid.sinfo = true, ucMlid);
								},
								60 * 1000
							);

							// if (!UCINFO.isIphone) {
							if (typeof AH.alert == 'function') AH.showmsg('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.');

							console.log('checking box');

							if (ucMlid.chkDoNotShow(user_guid) != true) {
								$$invalidate(10, state.dropDialog = true, state);
							} // if (typeof(bindDialog) == 'function') 
							// bindDialog({ click: this, wd: 450, ht: 236, data: '<div title="How to drop?"><img src="' + jQuery(mlid).attr('path') + 'match_drop_000BOG.gif" /><br/><span><label><input type="checkbox" style="top:2px;" class="relative donotshowdialog"> Do not show this dialog again</label></span></div>' });
						} //}
					} // return true;
				}
			});

		// AH.listen(document,'mouseup','.shuffleList1',function(){
		// 	console.log('shuffleList1');
		// 	setTimeout(function(){
		// 		displayAns();
		// 	},200)
		// }) // Replaced
		// AH.listen(document,'mouseup','.shuffleList2',function(){
		// 	console.log('shuffleList2');
		// 	setTimeout(function(){
		// 		displayAns();
		// 	},200)
		// })
		AI.listen('#matchmain ', 'click', '.matchlist-delete', function (e) {
			setTimeout(
				function () {
					displayAns();
				},
				200
			);
		});

		AH.listen(document, 'click', '#set-review', function () {
			setReview();
		});

		// binding up the unsetreview function 
		// jQuery("#unset-review").on('click',function(){
		// 	unsetReview();
		// });// Will Replaced
		AH.listen(document, 'click', '#unset-review', function () {
			unsetReview();
		});

		setTimeout(
			(function () {
				//jQuery("#"+containerID+" img").on('load', function() {
				let imgContainerId = AH.select("#" + containerID + " img");

				AH.listen(document, 'load', imgContainerId, () => {
					// if review mode is on
					if (isReview) {
						// if multimatch is normal or swap list
						if (multimatch == 1 || multimatch == 0) {
							AH.select("#" + containerID + " #sm_controller", 'addClass', 'h');
							AH.select("#" + containerID + " #sm_controller_default", "removeClass", "h");
						} else {
							AH.select("#" + containerID + " #sm_controller_default", 'addClass', 'h');
							AH.select("#" + containerID + " #sm_controller", 'removeClass', 'h');
						}

						unsetReview();
						setReview();
					} else {
						setReview();
						unsetReview();
					}
				});
			}).bind(this),
			500
		);

		setTimeout(
			function () {
				listen();
			},
			1500
		);
	});

	// function for binding keyup using hotkeys function which is defined in prepengine-footer.js
	function listen() {
		if (listenCall > 3) return false;

		if (typeof hotkeys == "function") {
			setTimeout(
				function () {
					console.log("hotkey function is ", typeof hotkeys == "function");
					ucMlid.bindKeyup();
				},
				1000
			);
		} else {
			console.log("Hotkey try = ", listenCall);
			listenCall++;
			listen();
		}
	}

	// function calls when remediation mode is on it basically display the ans
	function setReview() {
		$$invalidate(0, isReview = true);
		is_remediation = true;

		// check the answer
		displayAns();

		//jQuery("#shuffleArea").hide();
		if (document.querySelector('#shuffleAre') != null) document.querySelector('#shuffleAre').style.display = "none"; //WIll Replaced

		// for showing the answer
		ucMlid.modeOn("on");

		// if mode is normal mode or swap list
		if (multimatch == 1 || multimatch == 0) {
			AH.find("#" + containerID, "#sm_controller").classList.add("h");
			AH.find("#" + containerID, "#sm_controller").style.display = "none";
			AH.find("#" + containerID, "#sm_controller_default").style.display = "inline-block";

			var timer = setTimeout(
				function () {
					//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
					AH.find("#" + containerID, '#sm_controller_default .both-ans').click();

					clearTimeout(timer);
				},
				50
			);
		} else {
			// if drag & drop
			AH.select("#" + containerID + " " + "#sm_controller_default").classList.add("h");

			AH.find("#" + containerID, "#sm_controller_default").style.display = "none";
			AH.selectAll("#" + containerID + " " + "#sm_controller").style.display = "inline-block";

			//containerId.querySelector('#ssm_controller').style.display = "inline-block";
			var timer_next = setTimeout(
				function () {
					//jQuery("#"+containerID).find('#sm_controller_default .your-ans').click();
					AI.find("#" + containerID, '#sm_controller_default .your-ans').click();

					clearTimeout(timer_next);
				},
				200
			);
		}
	}

	// function calls when remediation mode is off after on.
	function unsetReview() {
		$$invalidate(0, isReview = false);

		//jQuery('.review_2, .review_default').addClass('h');
		AH.addClass('.review_2, .review_default', 'h');

		//jQuery('.review_2, .review_default').hide();
		let removeclass = document.querySelectorAll('.review_2, .review_default');

		for (let i = 0; i < removeclass.length; i++) {
			removeclass[i].style.display = "none";
		}

		// review_default2.style.display = "none";
		is_remediation = false;

		// if shuffled
		if (isShuffeled == true) {
			AH.select('#shuffleArea', 'css', { display: 'none' });
		} else {
			AH.select('#shuffleArea', 'css', { display: 'block' });
		}

		// set the user ans in the module 
		ucMlid.modeOn();
	}

	beforeUpdate(() => {
		// checking for the change in the new xml
		if (state.xml != xml) {
			$$invalidate(10, state.xml = xml, state);

			if (cmed) {
				$$invalidate(3, containerID = "matchmain" + cmed);
				$$invalidate(4, ucMlid.ajax_eId = "#matchmain" + cmed, ucMlid);
			}

			$$invalidate(23, isShuffeled = false);
			AH.select('#shuffleArea', 'css', { display: 'block' });

			// convert the xml into the json
			var newXml = XMLToJSON(xml);

			// parse the xml for the preview mode
			parseXMLPreview(newXml);

			//forceUpdate();  Only react uses
			runModule();
		} /*For Shuffling */ /*if(!window.QXML) {
	var err  = smVal.validate(this.props.content_type, this.props.subtype , this.props.content_icon);
	this.props.smValidate(err);
}*/
	});

	// calls whenever xml is updated and update the module accordingly
	function runModule() {
		try {
			showModule();
		} catch(e) {
			if (errorCatchFlag <= 100) {
				var timer = setTimeout(
					function () {
						runModule();
						clearTimeout(timer);
					},
					50
				);
			} else {
				console.log("runModule14:Error");
				console.log(e);
			}

			errorCatchFlag++;
		}
	}

	// it basically parse the user answer and calls only one time in test area 
	function parseUserAnswer() {
		let matchUa = XMLToJSON(uxml);

		if (uxml && matchUa.smans && matchUa.smans.matchlist && matchUa.smans.matchlist._userans) {
			let matchUa = XMLToJSON(uxml);
			let listseq1 = matchUa.smans.matchlist._list1seq.split(",");
			let listseq2 = matchUa.smans.matchlist._list2seq.split(",");

			originalseq1 = matchUa.smans.matchlist._originalseq1
			? matchUa.smans.matchlist._originalseq1.split(",")
			: "";

			originalseq2 = matchUa.smans.matchlist._originalseq2
			? matchUa.smans.matchlist._originalseq2.split(",")
			: "";

			/* Preserve List Sequence1*/
			let newArr = [];

			for (let i of listseq1) {
				for (let j in list1) {
					if (list1[j]['id'] == i) {
						newArr.push(list1[j]);
					}
				}
			}

			$$invalidate(7, list1 = newArr);

			/*****/
			/* Preserve List Sequence2*/
			let newArr2 = [];

			for (let i of listseq2) {
				for (let j in list2) {
					if (list2[j]['id'] == i) {
						newArr2.push(list2[j]);
					}
				}
			}

			$$invalidate(8, list2 = newArr2);

			/*****/
			if (matchUa.smans.matchlist._userans) {
				const userAns = matchUa.smans.matchlist._userans.split(",");

				for (let k in userAns) {
					for (let m in list1) {
						let uans = userAns[k].split(/\[|\]/g)[1];
						uans = uans.split("|");

						for (let n in uans) {
							if (list1[m]['id'] == uans[n]) {
								$$invalidate(7, list1[m]['userans'] += userAns[k].split(/\[|\]/g)[0] + ",", list1);
							}
						}
					}
				}
			}
		} else {
			// shuffle list 1
			shuffleArray(list1); // self.forceUpdate(); it works only in react

			// shuffle list 2
			shuffleArray(list2);

			// remove the user ans
			ucMlid.removeUserAns();
		} //forceUpdate();

		ucMlid.showUserAns("#" + containerID);
		ucMlid.remove_lines("#" + containerID);

		// set the user ans in the module 
		ucMlid.modeOn();
	}

	// it is called whenever xml is updated 
	function showModule() {
		// for checking user ans
		if (!uxml) {
			// remove the user ans if there is no user ans
			ucMlid.removeUserAns();
		}

		// adding draggable and drop events
		ucMlid.showUserAns("#" + containerID);

		ucMlid.remove_lines("#" + containerID);
		ucMlid.modeOn();

		if (!editorState) {
			// if it is open in test area parse the user answer
			console.log('parseUserAnswer');

			parseUserAnswer();
		}

		// checking for the reviewMode
		if (isReview) {
			//jQuery("#"+containerID).find('#sm_controller_default .both-ans').click();
			AH.find("#" + containerID, '#sm_controller_default .both-ans').click();

			var timer = setTimeout(
				function () {
					is_remediation = true;
					displayAns();
					AH.select("#shuffleArea", 'css', { display: 'none' });
					ucMlid.modeOn("on");

					if (multimatch == 1 || multimatch == 0) {
						AH.select("#" + containerID + " #sm_controller", 'addClass', 'h');
						AH.select("#" + containerID + " #sm_controller_default", "removeClass", "h");
					} else {
						AH.select("#" + containerID + " #sm_controller_default", 'addClass', 'h');
						AH.select("#" + containerID + " #sm_controller", "removeClass", "h");
					}

					clearTimeout(timer);
				},
				100
			);
		} else {
			//jQuery('.review_2, .review_default').addClass('h');
			let review = document.querySelectorAll(".review_2, .review_default");

			for (let i = 0; i < review.length; i++) {
				review[i].classList.add("h");
			}
		}
	}

	// it is called whenever xml is updated  and parse the xml for preview
	function parseXMLPreview(QXML) {
		try {
			$$invalidate(7, list1 = []);
			$$invalidate(8, list2 = []);

			// fetching value from the xml
			$$invalidate(5, listheading1 = QXML.smxml.matchlist._listheading1);

			$$invalidate(6, listheading2 = QXML.smxml.matchlist._listheading2);
			$$invalidate(2, multimatch = QXML.smxml.matchlist._multimatch);
			cdata = QXML.smxml.matchlist.__cdata;

			// if is_algo is in xml, if is_algo is equal to true then set its value true otherwise set the valur to false
			if (QXML.smxml.matchlist._is_algo) {
				is_algo = QXML.smxml.matchlist._is_algo == "true" ? true : false;
			} else {
				is_algo = false;
			}

			// checking for the max_node (max no of node)
			if (QXML.smxml.matchlist._max_node) {
				var num = Number(QXML.smxml.matchlist._max_node);
				max_node = num > 0 ? num : 0;
			} else {
				max_node = 0;
			}

			// splitting the cdata with the new line
			cdata = cdata.split("\n");

			var count = 0;
			var countList1 = 1;
			var multipleValue = false;
			var multipleValueList2 = false;
			var tempAns = "";

			// traversing through the cdata
			cdata.forEach(function (data, i) {
				if (cdata[i].trim() != "") {
					$$invalidate(9, totalCorrectAns++, totalCorrectAns);
					var correctAns = "";

					// finding the text which start with [ and end with ]
					if (cdata[i].match(/\[(.*?)\]/g)) {
						// storing the value in ans then removing the brackets and spliting it with | symbol
						var ans = cdata[i].match(/\[(.*?)\]/g)[0];

						ans = ans.replace("[", "").replace("]", "");
						ans = ans.split("|");
					}

					// traversing through list 2 
					list2.forEach(function (data, l) {
						if (list2[l].value == cdata[i].replace(cdata[i].match(/\[(.*?)\]/g), "").trim()) {
							tempAns = list2[l].id;
							multipleValueList2 = true;
						}
					});

					if (multipleValueList2 != true) {
						list2.push({
							id: alphabet[count],
							correctans: "",
							value: cdata[i].replace(cdata[i].match(/\[(.*?)\]/g), "").trim()
						});

						correctAns = list2[count].id;
					} else {
						correctAns = tempAns;
					}

					// traversing through list one
					list1.forEach(function (data1, k) {
						if (list1[k].value == ans) {
							// value will never true as here string is comparing with array
							multipleValue = true;

							if (multipleValueList2 != true) {
								$$invalidate(7, list1[k].correctans = list1[k].correctans + "," + list2[count].id, list1);
							} else {
								$$invalidate(7, list1[k].correctans = list1[k].correctans + "," + tempAns, list1);
							}
						}
					});

					if (multipleValue != true) {
						ans.forEach(function (data, i) {
							list1.push({
								id: countList1,
								correctans: correctAns,
								userans: "",
								value: ans[i]
							});

							countList1++;
						});
					}

					multipleValue = false;
					multipleValueList2 == false ? count++ : "";
					multipleValueList2 = false;
				}
			});

			// for the max node
			if (max_node > 0 && max_node <= list1.length) {
				//  shuffling the list
				$$invalidate(7, list1 = shuffleArray(list1));

				var temparr = [];

				for (var i = 0; i < max_node; i++) {
					temparr.push(list1[i]);
				}

				$$invalidate(7, list1 = temparr);
				temparr = [];
				temparr.length = 0;
				var f = 0;

				for (var i = 0; i < list1.length; i++) {
					var correctarr = list1[i].correctans.split(",");

					for (var j = 0; j < correctarr.length; j++) {
						for (var k = 0; k < list2.length; k++) {
							f = 0;

							if (correctarr[j] == list2[k].id) {
								if (temparr.length <= 0) {
									temparr.push(list2[k]);
								} else {
									for (var l = 0; l < temparr.length; l++) {
										if (correctarr[j] == temparr[l].id) {
											f = 1;
											break;
										}
									}

									if (f != 1) {
										temparr.push(list2[k]);
									}
								}
							}
						}
					}
				}

				$$invalidate(8, list2 = temparr);
			}
		} catch(error) {
			console.log({
				error,
				fun: 'ParseXMLPreview',
				file: 'MatchlistPreview.js'
			});
		}
	}

	// shuffle the option
	function shuffleItems() {
		console.log("Shuffled");
		$$invalidate(23, isShuffeled = true);
		ucMlid.removeUserAns();
		ucMlid.showUserAns("#" + containerID);
		ucMlid.remove_lines("#" + containerID);
		ucMlid.modeOn();
		$$invalidate(7, list1 = shuffleArray(list1));
		$$invalidate(8, list2 = shuffleArray(list2));
		AH.select('#shuffleArea', 'css', { display: 'none' });
	}

	let setList1;
	let setList2;

	// function randomChoice (arr) {
	// 	console.log("arr arr");
	// 	let randIndex = Math.floor(Math.random() * arr.length);
	// 	item.originalseq = randIndex; // change
	// 	return arr[randIndex];
	// }
	function setList1Html(item, count) {
		function randomChoice(arr) {
			console.log("arr arr");
			let randIndex = Math.floor(Math.random() * arr.length);
			item.originalseq = randIndex; // change
			return arr[randIndex];
		}

		if (is_algo == true && is_remediation != true) {
			if (originalseq1) {
				var seq = originalseq1[i];
				item.originalseq = seq; // change
				item.value = item.value.split("%%")[seq];
			} else {
				item.value = randomChoice(item.value.split("%%"));
			}
		}

		let img_src = item.value.substr(1).split("##")[0].split('%%')[0]; // For alt implementating with ##

		let img_alt = item.value.substr(1).split("##")[1]
		? item.value.substr(1).split("##")[1]
		: "";

		setList1 = `<span class="serial">${count + 1}.</span>` + (item.value.charAt(0) == "*"
		? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />`
		: is_algo == true ? item.value : item.value);

		return setList1;
	}

	function setList2Html(item, count) {
		function randomChoice(arr) {
			var randIndex = Math.floor(Math.random() * arr.length);

			//data.originalseq = randIndex;
			item.originalseq = randIndex;

			return arr[randIndex];
		}

		if (is_algo == true && is_remediation != true) {
			if (originalseq2) {
				var seq = originalseq2[i];
				data.originalseq = seq;
				item.value = item.value.split("%%")[seq];
			} else {
				item.value = randomChoice(item.value.split("%%"));
			}
		}

		let img_src = item.value.substr(1).split("##")[0].split('%%')[0]; // For alt implementating with ##

		let img_alt = item.value.substr(1).split("##")[1]
		? item.value.substr(1).split("##")[1]
		: "";

		setList2 = `<span class="serial">${count}.</span>` + (item.value.charAt(0) == "*"
		? `<img class="pe-none" src="//s3.amazonaws.com/jigyaasa_content_static/${img_src}" alt="${img_alt}" />`
		: is_algo == true ? item.value : item.value);

		return setList2;
	}

	function handleReview(mode) {
		if (mode == 'c') {
			ucMlid.showAllCorrectAns('#' + containerID);
		} else {
			ucMlid.showAllAns('#' + containerID);
		}
	}

	AH.listen('body', 'click', '.clr', _this => {
		AH.selectAll('.clr', 'removeClass', 'btn-primary');
		AH.selectAll('.clr', 'addClass', 'btn-light');
		AH.select(_this, 'removeClass', 'btn-light');
		AH.select(_this, 'addClass', 'btn-primary');
	});

	const writable_props = ['showAns', 'cmed', 'xml', 'isReview', 'uxml', 'editorState'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MatchListPreview> was created with unknown prop '${key}'`);
	});

	const click_handler = () => ucMlid.showCorrect('#' + containerID);

	const keyup_handler = e => {
		if (e.keyCode == 13) ucMlid.showCorrect('#' + containerID);
	};

	const click_handler_1 = () => ucMlid.showAll('#' + containerID);

	const keyup_handler_1 = e => {
		if (e.keyCode == 13) ucMlid.showAll('#' + containerID);
	};

	const click_handler_2 = () => ucMlid.showYour('#' + containerID);

	const keyup_handler_2 = e => {
		if (e.keyCode == 13) ucMlid.showYour('#' + containerID);
	};

	const click_handler_3 = () => {
		$$invalidate(10, state.dropDialog = false, state);
	};

	function dialog_visible_binding(value) {
		if ($$self.$$.not_equal(state.dropDialog, value)) {
			state.dropDialog = value;
			$$invalidate(10, state);
		}
	}

	$$self.$$set = $$props => {
		if ('showAns' in $$props) $$invalidate(19, showAns = $$props.showAns);
		if ('cmed' in $$props) $$invalidate(20, cmed = $$props.cmed);
		if ('xml' in $$props) $$invalidate(21, xml = $$props.xml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(22, uxml = $$props.uxml);
		if ('editorState' in $$props) $$invalidate(1, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		Draggable,
		l,
		beforeUpdate,
		onMount,
		ItemHelper,
		AH,
		XMLToJSON,
		onUserAnsChange,
		Button,
		Dialog,
		showAns,
		cmed,
		xml,
		isReview,
		uxml,
		editorState,
		listheading1,
		listheading2,
		multimatch,
		list1,
		list2,
		cdata,
		isShuffeled,
		totalCorrectAns,
		alphabet,
		is_algo,
		max_node,
		is_remediation,
		match_lines,
		errorCatchFlag,
		originalseq1,
		originalseq2,
		btnflag,
		listenCall,
		containerID,
		dragable,
		top1,
		ucMlid,
		state,
		displayAns,
		loadLibs,
		listen,
		setReview,
		unsetReview,
		runModule,
		parseUserAnswer,
		showModule,
		parseXMLPreview,
		shuffleArray,
		shuffleItems,
		remove_duplicates_es6,
		setList1,
		setList2,
		setList1Html,
		setList2Html,
		handleReview
	});

	$$self.$inject_state = $$props => {
		if ('showAns' in $$props) $$invalidate(19, showAns = $$props.showAns);
		if ('cmed' in $$props) $$invalidate(20, cmed = $$props.cmed);
		if ('xml' in $$props) $$invalidate(21, xml = $$props.xml);
		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ('uxml' in $$props) $$invalidate(22, uxml = $$props.uxml);
		if ('editorState' in $$props) $$invalidate(1, editorState = $$props.editorState);
		if ('listheading1' in $$props) $$invalidate(5, listheading1 = $$props.listheading1);
		if ('listheading2' in $$props) $$invalidate(6, listheading2 = $$props.listheading2);
		if ('multimatch' in $$props) $$invalidate(2, multimatch = $$props.multimatch);
		if ('list1' in $$props) $$invalidate(7, list1 = $$props.list1);
		if ('list2' in $$props) $$invalidate(8, list2 = $$props.list2);
		if ('cdata' in $$props) cdata = $$props.cdata;
		if ('isShuffeled' in $$props) $$invalidate(23, isShuffeled = $$props.isShuffeled);
		if ('totalCorrectAns' in $$props) $$invalidate(9, totalCorrectAns = $$props.totalCorrectAns);
		if ('alphabet' in $$props) $$invalidate(11, alphabet = $$props.alphabet);
		if ('is_algo' in $$props) is_algo = $$props.is_algo;
		if ('max_node' in $$props) max_node = $$props.max_node;
		if ('is_remediation' in $$props) is_remediation = $$props.is_remediation;
		if ('match_lines' in $$props) match_lines = $$props.match_lines;
		if ('errorCatchFlag' in $$props) errorCatchFlag = $$props.errorCatchFlag;
		if ('originalseq1' in $$props) originalseq1 = $$props.originalseq1;
		if ('originalseq2' in $$props) originalseq2 = $$props.originalseq2;
		if ('btnflag' in $$props) $$invalidate(12, btnflag = $$props.btnflag);
		if ('listenCall' in $$props) listenCall = $$props.listenCall;
		if ('containerID' in $$props) $$invalidate(3, containerID = $$props.containerID);
		if ('dragable' in $$props) dragable = $$props.dragable;
		if ('top1' in $$props) top1 = $$props.top1;
		if ('ucMlid' in $$props) $$invalidate(4, ucMlid = $$props.ucMlid);
		if ('state' in $$props) $$invalidate(10, state = $$props.state);
		if ('setList1' in $$props) setList1 = $$props.setList1;
		if ('setList2' in $$props) setList2 = $$props.setList2;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*isReview, ucMlid, multimatch, containerID, isShuffeled*/ 8388637) {
			 {
				if (isReview == true) {
					console.log('review mode');

					// for displaying the ans
					displayAns();

					AH.select("#shuffleArea", "hide");
					ucMlid.modeOn("on");

					// if mode is normal or swap list
					if (multimatch == 1 || multimatch == 0) {
						AH.select(".both-ans").click();

						//AH.find("#"+containerID , "#sm_controller", {action: "addClass", actionData: "h"});
						AH.select("#" + containerID + " #sm_controller", 'addClass', 'h');

						//AH.find("#"+containerID, "#sm_controller_default", {action: 'removeClass', actionData: 'h'});
						AH.select("#" + containerID + ' #sm_controller_default', 'removeClass', 'h');

						//AH.find("#"+containerID, "#sm_controller_default", "css", {display:'inline-block'});
						AH.select("#" + containerID + " #sm_controller_default", "css", { display: "inline-block" });
					} else {
						// if mode is drag & drop
						//jQuery("#"+containerID).find("#sm_controller_default").addClass("h");
						AH.select("#" + containerID + " " + "#sm_controller_default", "addClass", "h");

						//jQuery("#"+containerID).find("#sm_controller").removeClass("h");
						AH.select("#" + containerID + " " + "#sm_controller", "removeClass", "h");

						setTimeout(
							function () {
								document.getElementsByClassName("your-ans")[0].click();
							},
							500
						);
					}
				} else {
					// if remdiation mode is off
					$$invalidate(0, isReview = false);

					//jQuery("#"+containerID).find("#sm_controller_default").css("display", "none");
					AH.select("#" + containerID + " " + "#sm_controller_default", "css", { display: 'none' });

					if (isShuffeled == true) {
						AH.select("#shuffleArea", "css", { display: 'none' });
					} else {
						AH.select("#shuffleArea", "css", { display: "block" });
					}

					// set the user ans in the module 
					ucMlid.modeOn();
				}
			}
		}
	};

	return [
		isReview,
		editorState,
		multimatch,
		containerID,
		ucMlid,
		listheading1,
		listheading2,
		list1,
		list2,
		totalCorrectAns,
		state,
		alphabet,
		btnflag,
		setReview,
		unsetReview,
		shuffleItems,
		setList1Html,
		setList2Html,
		handleReview,
		showAns,
		cmed,
		xml,
		uxml,
		isShuffeled,
		click_handler,
		keyup_handler,
		click_handler_1,
		keyup_handler_1,
		click_handler_2,
		keyup_handler_2,
		click_handler_3,
		dialog_visible_binding
	];
}

class MatchListPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				showAns: 19,
				cmed: 20,
				xml: 21,
				isReview: 0,
				uxml: 22,
				editorState: 1
			},
			add_css,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MatchListPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*showAns*/ ctx[19] === undefined && !('showAns' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'showAns'");
		}

		if (/*cmed*/ ctx[20] === undefined && !('cmed' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'cmed'");
		}

		if (/*xml*/ ctx[21] === undefined && !('xml' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'xml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'isReview'");
		}

		if (/*uxml*/ ctx[22] === undefined && !('uxml' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'uxml'");
		}

		if (/*editorState*/ ctx[1] === undefined && !('editorState' in props)) {
			console_1.warn("<MatchListPreview> was created without expected prop 'editorState'");
		}
	}

	get showAns() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get cmed() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set cmed(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xml() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<MatchListPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<MatchListPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default MatchListPreview;
//# sourceMappingURL=MatchListPreview-b5b94a87.js.map
