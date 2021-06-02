/**
 *  File Name   : main.js
 *  Author      : Ayush Srivastava
 *  Function    : Graph
 *  Version     : 1.0
 *  Packege     : clsSMGRAPH (preview)
 *  Last update : 02-MAR-2021
 */
import App from './DrawingPreview.svelte';

const defXMl = `<smxml xmlns="http://www.w3.org/1999/xhtml" type="41" name="Drawing" bgimg="useraccount_000ANv.png" imgAlt="Triangle image" width="600" markPointColor="#00FF00" color="#00BCD4"><div selectedDrawingType="_scribble,_line,_compass"><!--[CDATA[]]--></div><backgroundPoint type="backgroundPoints"><!--[CDATA[]]--></backgroundPoint></smxml>`;

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