
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, B as noop } from './main-0211720b.js';

/* clsSMMixedItem/itemPluginHelper.svelte generated by Svelte v3.29.0 */

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
	"isHideForContentIcon": 4,
	"doNotformatXml": true,
	helpVideo: {
		"1": "//player.vimeo.com/external/289408246.hd.mp4?s=f226bc1150053931cd33b664a69c5041c970070c"
	},
	doNotCheckStem() {
		if (state.content_icon == "3" || state.content_icon == "4") {
			return true;
		}

		return false;
	}
};

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("ItemPluginHelper", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ItemPluginHelper> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ itemHelper });
	return [];
}

class ItemPluginHelper extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ItemPluginHelper",
			options,
			id: create_fragment.name
		});
	}
}

export default ItemPluginHelper;
export { itemHelper };
//# sourceMappingURL=itemPluginHelper-674ba09e.js.map
