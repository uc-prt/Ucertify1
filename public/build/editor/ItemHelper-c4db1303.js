
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, v as validate_slots, a0 as createEventDispatcher, f as space, j as attr_dev, k as add_location, n as insert_dev, q as listen_dev, B as noop, x as detach_dev, H as run_all, z as empty } from './main-b83e0690.js';

/* helper\ItemHelper.svelte generated by Svelte v3.29.0 */

const { document: document_1 } = globals;
const file = "helper\\ItemHelper.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-ri6gyf-style";
	style.textContent = ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbUhlbHBlci5zdmVsdGUiLCJzb3VyY2VzIjpbIkl0ZW1IZWxwZXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjwhLS1cclxuICogIEZpbGUgTmFtZSAgIDogSXRlbUhlbHBlci5zdmVsdGVcclxuICogIERlc2NyaXB0aW9uIDogUmVzcG9uc2libGUgZm9yIHNldHRpbmcgcmV2aWV3XHJcbiAqICBBdXRob3IgICAgICA6IFByYWRlZXAgWWFkYXZcclxuICogIFBhY2thZ2UgICAgIDogRWRpdG9yXHJcbiAqICBMYXN0IHVwZGF0ZSA6IDEwLURlYy0yMDIwXHJcbiAqICBMYXN0IFVwZGF0ZWQgQnkgOiBBeXVzaCBTcml2YXN0YXZhXHJcbi0tPlxyXG48c2NyaXB0PlxyXG4gICAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJztcclxuICAgIGV4cG9ydCBsZXQgcmV2aWV3TW9kZSA9IGZhbHNlO1xyXG4gICAgZXhwb3J0IGxldCBoYW5kbGVSZXZpZXdDbGljaztcclxuICAgIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVTbUNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNtQ29udHJvbGVyQnRuIGJ1dHRvbicpLmZvckVhY2goKGVsKT0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKTtcclxuICAgICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgaWYgKGhhbmRsZVJldmlld0NsaWNrKSBoYW5kbGVSZXZpZXdDbGljayhldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdtb2RlJyksIGV2ZW50KTtcclxuICAgIH1cclxuPC9zY3JpcHQ+XHJcbjxidXR0b24gdGFiaW5kZXg9XCIwXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiaCBoLWltcFwiIGlkPVwic2V0LXJldmlld1wiIG9uOmNsaWNrPVwieygpPT5kaXNwYXRjaCgnc2V0UmV2aWV3Jyl9XCI+PC9idXR0b24+XHJcbjxidXR0b24gdGFiaW5kZXg9XCIwXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiaCBoLWltcFwiIGlkPVwidW5zZXQtcmV2aWV3XCIgb246Y2xpY2s9XCJ7KCk9PmRpc3BhdGNoKCd1bnNldFJldmlldycpfVwiPjwvYnV0dG9uPlxyXG57I2lmIHJldmlld01vZGV9XHJcbiAgICA8ZGl2IGNsYXNzPVwic21Db250cm9sZXJCdG4gYnRuLWdyb3VwIG1iLTNcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPVwiQW5zd2VyIGJ1dHRvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHRhYmluZGV4PVwiMFwiIHR5cGU9XCJidXR0b25cIiBtb2RlPVwiY1wiIGNsYXNzPVwiYnRuIGJ0bi1saWdodCBjb3JyZWN0LWFuc1wiIG9uOmNsaWNrPVwie2hhbmRsZVNtQ2xpY2t9XCI+Q29ycmVjdCBBbnN3ZXI8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHRhYmluZGV4PVwiMFwiIHR5cGU9XCJidXR0b25cIiBtb2RlPVwidVwiIGNsYXNzPVwiYnRuIGJ0bi1saWdodCB5b3VyLWFucyBhY3RpdmVcIiBvbjpjbGljaz1cIntoYW5kbGVTbUNsaWNrfVwiPllvdXIgQW5zd2VyPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuey9pZn1cclxuPHN0eWxlPlxyXG4gICAgOmdsb2JhbCguc21Db250cm9sZXJCdG4gLmJ0bi1saWdodDpub3QoW2Rpc2FibGVkXSk6bm90KC5kaXNhYmxlZCkuYWN0aXZlKSB7XHJcbiAgICAgICAgY29sb3I6ICNmZmYhaW1wb3J0YW50O1xyXG4gICAgICAgIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAycHggMCAjMTI2NmYxIWltcG9ydGFudDtcclxuICAgICAgICBib3gtc2hhZG93OiBpbnNldCAwIDJweCAwICMxMjY2ZjEhaW1wb3J0YW50O1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICMyNTcyZjIhaW1wb3J0YW50O1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogIzI1NzJmMiFpbXBvcnRhbnQ7XHJcbiAgICAgICAgYm9yZGVyLXRvcC1jb2xvcjogIzBjNTdkMyFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcbjwvc3R5bGU+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE0QlksZ0VBQWdFLEFBQUUsQ0FBQyxBQUN2RSxLQUFLLENBQUUsSUFBSSxVQUFVLENBQ3JCLGtCQUFrQixDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLFVBQVUsQ0FDbkQsVUFBVSxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLFVBQVUsQ0FDM0MsZ0JBQWdCLENBQUUsT0FBTyxVQUFVLENBQ25DLFlBQVksQ0FBRSxPQUFPLFVBQVUsQ0FDL0IsZ0JBQWdCLENBQUUsT0FBTyxVQUFVLEFBQ3ZDLENBQUMifQ== */";
	append_dev(document_1.head, style);
}

// (22:0) {#if reviewMode}
function create_if_block(ctx) {
	let div;
	let button0;
	let t1;
	let button1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			button0 = element("button");
			button0.textContent = "Correct Answer";
			t1 = space();
			button1 = element("button");
			button1.textContent = "Your Answer";
			attr_dev(button0, "tabindex", "0");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "mode", "c");
			attr_dev(button0, "class", "btn btn-light correct-ans");
			add_location(button0, file, 23, 8, 1066);
			attr_dev(button1, "tabindex", "0");
			attr_dev(button1, "type", "button");
			attr_dev(button1, "mode", "u");
			attr_dev(button1, "class", "btn btn-light your-ans active");
			add_location(button1, file, 24, 8, 1204);
			attr_dev(div, "class", "smControlerBtn btn-group mb-3");
			attr_dev(div, "role", "group");
			attr_dev(div, "aria-label", "Answer buttons");
			add_location(div, file, 22, 4, 972);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button0);
			append_dev(div, t1);
			append_dev(div, button1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*handleSmClick*/ ctx[2], false, false, false),
					listen_dev(button1, "click", /*handleSmClick*/ ctx[2], false, false, false)
				];

				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(22:0) {#if reviewMode}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let button0;
	let t0;
	let button1;
	let t1;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*reviewMode*/ ctx[0] && create_if_block(ctx);

	const block = {
		c: function create() {
			button0 = element("button");
			t0 = space();
			button1 = element("button");
			t1 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr_dev(button0, "tabindex", "0");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "h h-imp");
			attr_dev(button0, "id", "set-review");
			add_location(button0, file, 19, 0, 712);
			attr_dev(button1, "tabindex", "0");
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "h h-imp");
			attr_dev(button1, "id", "unset-review");
			add_location(button1, file, 20, 0, 829);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, button0, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, button1, anchor);
			insert_dev(target, t1, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*reviewMode*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button0);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(button1);
			if (detaching) detach_dev(t1);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
	validate_slots("ItemHelper", slots, []);
	let { reviewMode = false } = $$props;
	let { handleReviewClick } = $$props;
	const dispatch = createEventDispatcher();

	function handleSmClick(event) {
		document.querySelectorAll(".smControlerBtn button").forEach(el => el.classList.remove("active"));
		event.target.classList.add("active");
		if (handleReviewClick) handleReviewClick(event.target.getAttribute("mode"), event);
	}

	const writable_props = ["reviewMode", "handleReviewClick"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ItemHelper> was created with unknown prop '${key}'`);
	});

	const click_handler = () => dispatch("setReview");
	const click_handler_1 = () => dispatch("unsetReview");

	$$self.$$set = $$props => {
		if ("reviewMode" in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
		if ("handleReviewClick" in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		reviewMode,
		handleReviewClick,
		dispatch,
		handleSmClick
	});

	$$self.$inject_state = $$props => {
		if ("reviewMode" in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
		if ("handleReviewClick" in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		reviewMode,
		dispatch,
		handleSmClick,
		handleReviewClick,
		click_handler,
		click_handler_1
	];
}

class ItemHelper extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document_1.getElementById("svelte-ri6gyf-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ItemHelper",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*handleReviewClick*/ ctx[3] === undefined && !("handleReviewClick" in props)) {
			console.warn("<ItemHelper> was created without expected prop 'handleReviewClick'");
		}
	}

	get reviewMode() {
		throw new Error("<ItemHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set reviewMode(value) {
		throw new Error("<ItemHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get handleReviewClick() {
		throw new Error("<ItemHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set handleReviewClick(value) {
		throw new Error("<ItemHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export { ItemHelper as I };
//# sourceMappingURL=ItemHelper-c4db1303.js.map
