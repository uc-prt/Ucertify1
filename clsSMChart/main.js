/**
 *  File Name   : main.js
 *  Author      : Ayush Srivastava
 *  Function    : Chart
 *  Version     : 1.0
 *  Packege     : clsSMChart (preview)
 *  Last update : 15-MAR-2021
 */
import App from './ChartPreview.svelte';

const defXMl = `<SMXML type="38" name="chart"><chart id="ID0" height="500" width="550" type="column" xval="[1,2,3,4,5,6]" yinterval="5" ymax="50" ymin="1" xmin="1" xmax="6" xinterval="1" defaultans="10,20,30" snapTo="5" correctans="|0,10|1,20|2,30|" xlabel="Years" ylabel="Quantity in Tons" title="Bar Chart" color="#7cb5ec" ></chart></SMXML>`;

const app = new App({
	target: document.getElementById(window.moduleContainer) || document.body,
	props: {
		xml: window.QXML || defXMl,
		uxml: window.uaXML,
		ansStatus: 0,
		isReview: window.isReviewMode || false,
	}
});

export default app;