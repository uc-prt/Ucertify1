
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, B as noop } from './main-1f6da6d4.js';

/* clsSMHotspot\defaultXML.svelte generated by Svelte v3.34.0 */

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
		"editor_item_22.xml": "<smxml type=\"4\" name=\"HotSpot\" bgimg=\"star_topology_000dlj.jpg\" path=\"\" width=\"600\" height=\"250\"><div id=\"ID0\" type=\"imagehighlight\" top=\"10\" left=\"20\" width=\"30\" height=\"50\"><!--[CDATA[{\"1\":{\"x\":[192.5,191.5,190.5,187.5,186.5,185.5,184.5,183.5,183.5,182.5,181.5,181.5,180.5,180.5,178.5,177.5,177.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,176.5,177.5,178.5,179.5,181.5,182.5,183.5,184.5,186.5,187.5,188.5,189.5,190.5,192.5,195.5,197.5,199.5,203.5,207.5,210.5,215.5,221.5,223.5,227.5,232.5,235.5,239.5,244.5,251.5,255.5,259.5,264.5,267.5,271.5,274.5,277.5,281.5,284.5,286.5,293.5,297.5,301.5,306.5,309.5,313.5,316.5,320.5,322.5,325.5,327.5,331.5,333.5,335.5,339.5,341.5,344.5,348.5,351.5,355.5,360.5,362.5,366.5,368.5,370.5,372.5,373.5,374.5,377.5,379.5,381.5,382.5,385.5,386.5,389.5,390.5,391.5,391.5,392.5,393.5,393.5,393.5,393.5,393.5,393.5,393.5,393.5,393.5,393.5,392.5,391.5,390.5,390.5,389.5,388.5,388.5,387.5,386.5,385.5,384.5,383.5,381.5,378.5,376.5,374.5,370.5,368.5,366.5,363.5,360.5,358.5,355.5,353.5,351.5,349.5,345.5,341.5,339.5,336.5,332.5,329.5,325.5,322.5,319.5,317.5,316.5,314.5,314.5,312.5,311.5,309.5,308.5,306.5,305.5,304.5,303.5,302.5,301.5,300.5,298.5,296.5,295.5,293.5,290.5,286.5,284.5,282.5,279.5,277.5,275.5,272.5,270.5,268.5,266.5,265.5,263.5,262.5,260.5,259.5,257.5,256.5,254.5,253.5,251.5,250.5,249.5,247.5,246.5,245.5,244.5,243.5,242.5,241.5,240.5,238.5,237.5,237.5,236.5,235.5,234.5,232.5,231.5,230.5,229.5,228.5,227.5,225.5,224.5,223.5,222.5,221.5,220.5,219.5,217.5,217.5,215.5,215.5,214.5,213.5,212.5,211.5,210.5,210.5,209.5,208.5,207.5,206.5,205.5,205.5,204.5,203.5,203.5,202.5,201.5,201.5,200.5,200.5,199.5,198.5,198.5,198.5,197.5,197.5,196.5,196.5,195.5,195.5,195.5,195.5,194.5,194.5,193.5,193.5,193.5,193.5,192.5,192.5,192.5,192.5,192.5,192.5],\"y\":[137,139,143,148,151,155,157,159,161,163,165,168,170,173,178,182,186,190,193,198,200,202,204,206,208,210,212,214,216,219,222,225,228,231,233,235,238,241,243,245,248,250,252,253,255,257,258,261,263,265,267,271,274,278,280,282,285,287,289,291,292,294,294,294,295,295,295,295,295,295,295,295,295,295,295,295,295,295,293,292,292,291,291,290,289,288,287,285,283,282,281,278,277,275,272,271,269,268,267,265,263,261,257,255,251,246,241,237,234,229,226,222,217,213,208,204,198,189,183,178,173,169,166,164,162,159,157,156,154,153,152,151,149,147,146,143,141,139,136,134,132,128,127,125,122,121,119,118,116,114,112,111,110,109,107,106,106,105,105,104,104,104,104,104,103,103,103,103,102,101,101,100,99,98,97,96,95,95,94,94,94,94,92,92,92,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,91,92,92,93,93,94,95,95,96,96,97,98,99,100,101,101,102,103,104,104,105,105,106,106,107,108,109,109,110,110,110,111,111,111,112,112,112,113,113,113,114,115,115,116,116,116,117,118,119,120,121,122,123,123,124,124,125,125,126,127,128,129,130,130,131,132,133,134,135,136,137,138,139]}}]]--></div></smxml>",
		"editor_item_23.xml": "<smxml xmlns=\"http://www.w3.org/1999/xhtml\" type=\"4\" name=\"HotSpot\" bgimg=\"\" path=\"\" width=\"600\" height=\"250\"><div id=\"ID0\" type=\"textselect\" top=\"10\" left=\"20\" width=\"30\" height=\"50\"><!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--></div></smxml>",
		"editor_item_24.xml": "<smxml type=\"4\" name=\"HotSpot\" bgimg=\"\" path=\"\" width=\"600\" height=\"250\"><div id=\"ID0\" type=\"textclick\" top=\"10\" left=\"20\" width=\"30\" height=\"50\"><!--[CDATA[His manner was not effusive. It %{seldom}% was; but he was glad, I think, to see me. With hardly a word spoken, but with a kindly eye, he waved me to an armchair, threw across his case of %{cigars,}% and indicated a spirit case and a %{gasogene}% in the corner. Then he stood before the fire and looked me over in his singular %{introspective}% fashion.]]--></div></smxml>",
		"editor_item_25.xml": "<smxml type=\"4\" name=\"HotSpot\" bgimg=\"star_topology_000dlj.jpg\" path=\"\" alt=\"\" width=\"600\" height=\"250\"><div id=\"ID0\" type=\"hotspot\" top=\"172\" left=\"220\" width=\"112\" height=\"80\"  imgheight=\"\" imgwidth=\"\"><!--[CDATA[]]--></div></smxml>",
		"editor_item_101.xml": `<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" top="10" left="20" width="30" height="50" type="w" correctAns="ID0,ID6"><!--[CDATA[Every object has an owner1, whether in an NTFS volume or in Active Directory. The owner controls how permissions are set on the object and to who permissions are granted. \r\n Every object has an owner1, whether in an NTFS volume or in Active Directory. The owner controls how permissions are set on the object and to who permissions are granted.]]--></div></smxml>`,
		"sample": `<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" top="10" left="20" width="30" height="50" type="w" correctAns="ID0,ID6"><!--[CDATA[Every object has an owner1, whether in an NTFS volume or in Active Directory. The owner controls how permissions are set on the object and to who permissions are granted. \r\n Every object has an owner1, whether in an NTFS volume or in Active Directory. The owner controls how permissions are set on the object and to who permissions are granted.]]--></div></smxml>`
	};

	return xmls[type];
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("DefaultXML", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DefaultXML> was created with unknown prop '${key}'`);
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
//# sourceMappingURL=defaultXML-53394ec2.js.map
