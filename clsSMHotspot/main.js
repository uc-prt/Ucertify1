import HotspotPreview from './HotspotPreview.svelte';
import HotspotTokenPreview from './HotspotTokenPreview.svelte';

const defXMl = `<smxml type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" alt="" width="600" height="250">
<div id="ID0" type="hotspot" top="172" left="220" width="112" height="80"  imgheight="" imgwidth="">
	<!--[CDATA[]]-->
</div>
</smxml>`;
let app;
if(window.$contentIcon == 2 || window.$contentIcon == 4) {
	app = new HotspotTokenPreview({
		target: document.getElementById(window.moduleContainer) || document.body,
		props: {
			xml: window.QXML || defXMl,
			uxml: window.uaXML,
			ansStatus: 0,
			isReview: window.isReviewMode || false,
		}
	});
} else {
	app = new HotspotPreview({
		target: document.getElementById(window.moduleContainer) || document.body,
		props: {
			xml: window.QXML || defXMl,
			uxml: window.uaXML,
			ansStatus: 0,
			isReview: window.isReviewMode || false,
		}
	});
}


export default app;