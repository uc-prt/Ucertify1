
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, B as noop } from './main-b83e0690.js';

/* clsSMSlider\SliderItemHelper.svelte generated by Svelte v3.29.0 */

function create_fragment(ctx) {
	const block = {
		c: noop,
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
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

const itemHelper = {
	helpVideo: {
		"0": "//player.vimeo.com/external/289408519.hd.mp4?s=6d8d295403eb3a6354f41dfb28269c11f25d9a20"
	}
};

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("SliderItemHelper", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SliderItemHelper> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ itemHelper });
	return [];
}

class SliderItemHelper extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SliderItemHelper",
			options,
			id: create_fragment.name
		});
	}
}

export default SliderItemHelper;
export { itemHelper };
//# sourceMappingURL=SliderItemHelper-3a684f68.js.map
