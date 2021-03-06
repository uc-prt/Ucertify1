
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, B as noop } from './main-34a3b679.js';

/* clsSMLabSimulation\defaultXML.svelte generated by Svelte v3.40.2 */

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
		"editor_item_55.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="17" name="Lab Simulation"><side location="l"><category title="Processors" key="cat0"><component title="Intel Celeron D Processor 365" image="Intel_Celeron_D_Processor_365_000Fot.png,Intel_Celero_365_drag_000FoX.png,Intel_Celeron_D_Processor_365_0004Mk.png" detail="Intel Processor" infotabs=",Front,-,-" infoimgs="cpu_front_000e5M.png" key="k2"></component><component title="Intel Core 2 Duo Processor E6300" image="Processor-Intel-E8600_000FoV.png,Processor-Intel-E8600_darg_000Fow.png,Processor-Intel-E8600_0004Ml.png" detail="Intel Processor" infotabs=",Front,-,-" infoimgs="intel_cele_000e5z.png" key="k3"></component><component title="Intel Pentium D Processor 920" image="Intel_Pentium_D_show_000FjJ.png,Intel_Pentium_D_show_drg_000FoW.png,Intel_Pentium_D_Processor_920_0004ML.png" detail="Intel Processor" infotabs=",Front,-,-" infoimgs="intel_pen_000e60.png" key="k4"></component></category></side><main><step key="k24" display="1"><tab key="k1" title="Motherboard" bgimg="motherboard_000FoP.png" display="1"><component size="626,491" position="9,0" type="hotspot" key="k5">{"1":[235,152,51,44],"2":[99,240,28,220]}</component><component size="97,106" position="212,429" anskey="k4" key="k8"></component></tab></step></main></smxml>',
		"sample": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="17" name="Lab Simulation"><side location="l"><category title="Processors" key="cat0"><component title="Intel Celeron D Processor 365" image="Intel_Celeron_D_Processor_365_000Fot.png,Intel_Celero_365_drag_000FoX.png,Intel_Celeron_D_Processor_365_0004Mk.png" detail="Intel Processor" infotabs=",Front,-,-" infoimgs="cpu_front_000e5M.png" key="k2"></component><component title="Intel Core 2 Duo Processor E6300" image="Processor-Intel-E8600_000FoV.png,Processor-Intel-E8600_darg_000Fow.png,Processor-Intel-E8600_0004Ml.png" detail="Intel Processor" infotabs=",Front,-,-" infoimgs="intel_cele_000e5z.png" key="k3"></component><component title="Intel Pentium D Processor 920" image="Intel_Pentium_D_show_000FjJ.png,Intel_Pentium_D_show_drg_000FoW.png,Intel_Pentium_D_Processor_920_0004ML.png" detail="Intel Processor" infotabs=",Front,-,-" infoimgs="intel_pen_000e60.png" key="k4"></component></category></side><main><step key="k24" display="1"><tab key="k1" title="Motherboard" bgimg="motherboard_000FoP.png" display="1"><component size="626,491" position="9,0" type="hotspot" key="k5">{"1":[235,152,51,44],"2":[99,240,28,220]}</component><component size="97,106" position="212,429" anskey="k4" key="k8"></component></tab></step></main></smxml>'
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
//# sourceMappingURL=defaultXML-22731eeb.js.map
