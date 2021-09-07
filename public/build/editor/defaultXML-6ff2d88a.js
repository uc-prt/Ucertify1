
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, B as noop } from './main-2e9e1732.js';

/* clsSMFill\defaultXML.svelte generated by Svelte v3.40.2 */

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

function getDefaultXMl(type) {
	let xmls = {
		"editor_item_5.xml": '<smxml type="9" name="FillInTheBlank"><text matchtype="1"><![CDATA[Education, then, beyond all other devices of %{human}% origin, is the great equalizer of the %{conditions}% of man.]]></text></smxml>',
		"editor_item_1.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, beyond all other devices of %{a+b|e}% origin, is the great equalizer of the conditions.]]--></text></smxml>',
		"editor_item_3.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, beyond all other devices of %{data|{"defaultAns":"ds","rows":"2","cols":"10"}}% origin, is the great equalizer of the conditions.]]--></text></smxml>',
		"editor_item_6.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, beyond all other devices of %{person,*human,+man|s}% origin, is the great equalizer of the %{situations,*conditions|s}% of man.]]--></text></smxml>',
		"editor_item_7.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, %{beyond|d}% all other devices of %{human|d}% origin, is the great equalizer of the %{conditions|d}% of man.]]--></text></smxml>',
		"sample": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, %{beyond|d}% all other devices of %{human|d}% origin, is the great equalizer of the %{conditions|d}% of man.]]--></text></smxml>'
	};

	return xmls[type];
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DefaultXML', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DefaultXML> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ getDefaultXMl });
	return [];
}

class DefaultXML extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DefaultXML",
			options,
			id: create_fragment.name
		});
	}
}

export default DefaultXML;
export { getDefaultXMl };
//# sourceMappingURL=defaultXML-6ff2d88a.js.map
