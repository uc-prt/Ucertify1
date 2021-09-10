
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, e as element, k as add_location, l as set_style, j as attr_dev, n as insert_dev, p as append_dev, B as noop, x as detach_dev } from './main-743b5aca.js';

/* helper\UnderDev.svelte generated by Svelte v3.40.2 */

const file = "helper\\UnderDev.svelte";

function create_fragment(ctx) {
	let div;
	let h1;

	const block = {
		c: function create() {
			div = element("div");
			h1 = element("h1");
			h1.textContent = "Item is under developement.";
			add_location(h1, file, 5, 4, 104);
			set_style(div, "height", "200px");
			attr_dev(div, "class", "alert alert-primary");
			attr_dev(div, "role", "alert");
			add_location(div, file, 4, 0, 29);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h1);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
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

function instance($$self, $$props) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('UnderDev', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UnderDev> was created with unknown prop '${key}'`);
	});

	return [];
}

class UnderDev extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "UnderDev",
			options,
			id: create_fragment.name
		});
	}
}

export default UnderDev;
//# sourceMappingURL=UnderDev-a02cb739.js.map