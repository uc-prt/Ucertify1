/**
 *  File Name   : main.js
 *  Author      : Ayush Srivastava
 *  Function    : DND
 *  Version     : 1.0
 *  Packege     : Drag and Drop (prev)
 *  Last update : 19 Jan 2021
 */
import App from './DragNDropPreview.svelte';

const defXMl = `<smxml type="1" name="DragNDrop" bgimg="lab-26_0007C9_000CsS.png" height="495" width="607"><drag id="ID0" top="442" left="307" width="120" height="25" value="Port operational"></drag><drag id="ID1" top="442" left="454" width="120" height="25" value="Layer 2 problem"></drag><drag id="ID2" top="442" left="10" width="120" height="25" value="Layer 1 problem"></drag><drag id="ID3" top="442" left="160" width="120" height="25" value="Port disabled"></drag><drop id="ID4" top="76" left="414" width="120" height="25" anskey="ID0" value="Drop Here"></drop><drop id="ID5" top="173" left="414" width="120" height="25" anskey="ID1" value="Drop Here"></drop><drop id="ID6" top="272" left="414" width="120" height="25" anskey="ID2" value="Drop Here"></drop><drop id="ID7" top="366" left="414" width="120" height="25" anskey="ID3" value="Drop Here"></drop></smxml>`;

// creating app
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