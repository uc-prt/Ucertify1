
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, B as noop } from './main-200a9144.js';

/* clsSMMatchList\defaultXML.svelte generated by Svelte v3.40.2 */

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
	var xmls = {
		"editor_item_19.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="14" name="Match List"><matchlist listheading1="Error Message" listheading2="Description" multimatch="2"><!--[CDATA[\nMemory failure; replace RAM[MULTI_BIT_ECC_ERROR]\nThe CMOS battery probably needs replacement[CMOS_BATTERY_ERROR]\nCMOS RAM error. Try flashing the BIOS to fix[CMOS_CHECKSUM_ERROR]\nThe installed memory in each slot doesn\'t match for optimal performance[MEM_OPTIMAL_ERROR]]]--></matchlist></smxml>',
		"editor_item_20.xml": '<smxml type="14" name="Match List"><matchlist listheading1="Error Message" listheading2="Description" multimatch="1"><!--[CDATA[\nMemory failure; replace RAM[MULTI_BIT_ECC_ERROR]\nThe CMOS battery probably needs replacement[CMOS_BATTERY_ERROR]\nCMOS RAM error. Try flashing the BIOS to fix[CMOS_CHECKSUM_ERROR]\nThe installed memory in each slot doesn\'t match for optimal performance[MEM_OPTIMAL_ERROR]]]--></matchlist></smxml>',
		"editor_item_21.xml": '<smxml type="14" name="Match List"><matchlist listheading1="Power Connector Images" listheading2="Power Connector Names" multimatch="0"><!--[CDATA[\nATX Power Connector [*24-pin-atx-power_0002TR.jpg]\nSATA-2 Power Connector  [*15-pin-sata-power_0002Tq.jpg]\nFloppy Power Connector  [*4-pin-berg-floppy-power_0002TP.jpg]\nPCIe Power Connector  [*6-pin-pcie-power_0002TQ.jpg]\nMolex Peripheral Power Connector  [*4-pin-molex-peripheral_0002Tp.jpg]]]--></matchlist></smxml>',
		"sample": '<smxml type="14" name="Match List"><matchlist listheading1="Power Connector Images" listheading2="Power Connector Names" multimatch="0"><!--[CDATA[\nATX Power Connector [*24-pin-atx-power_0002TR.jpg]\nSATA-2 Power Connector  [*15-pin-sata-power_0002Tq.jpg]\nFloppy Power Connector  [*4-pin-berg-floppy-power_0002TP.jpg]\nPCIe Power Connector  [*6-pin-pcie-power_0002TQ.jpg]\nMolex Peripheral Power Connector  [*4-pin-molex-peripheral_0002Tp.jpg]]]--></matchlist></smxml>'
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
//# sourceMappingURL=defaultXML-a2b79467.js.map
