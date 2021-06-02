/**
 *  File Name   : main.js
 *  Author      : Ayush Srivastava
 *  Function    : Graph
 *  Version     : 1.0
 *  Packege     : clsSMGRAPH (preview)
 *  Last update : 02-MAR-2021
 */
import App from './GraphPreview.svelte';

const defXMl = `<smxml type="20" name="Math"><plot id="ID0" type="cosine" xtickdistance="90" ytickdistance="1" anskey="90,0|0,2" xaxis="720" yaxis="3" height="450" width="700" polygon_type="0" reflection="" equation="y=2*cos(x)"></plot></smxml>`;

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