import ChooseNReorderPreview from './ChooseNReorderPreview.svelte';
import ChooseMultiGridPreview from './ChooseMultiGridPreview.svelte';
import {XMLToJSON} from '../helper/HelperAI.svelte'
var app;
const defXMl = '';
var newXml = XMLToJSON(window.QXML);
if(newXml.smxml.list._row && newXml.smxml.list._col) { 
	app = new ChooseMultiGridPreview({
		target: document.getElementById(window.moduleContainer) || document.body,
		props: {
			xml: window.QXML || defXMl,
			uxml: window.uaXML,
			ansStatus: 0,
			isReview: window.isReviewMode || false,
			smqCounter : window.idCounter,
			CM : window.idCounter
		}
	});
} else {
	app = new ChooseNReorderPreview({
		target: document.getElementById(window.moduleContainer) || document.body,
		props: {
			xml: window.QXML || defXMl,
			uxml: window.uaXML,
			ansStatus: 0,
			isReview: window.isReviewMode || false,
			smqCounter : window.idCounter,
			CM : window.idCounter
		}
	});
}
// app = new ChooseNReorderPreview({
// 	target: document.getElementById(window.moduleContainer) || document.body,
// 	props: {
// 		xml: window.QXML || defXMl,
// 		uaXML: window.uaXML,
// 		ansStatus: 0,
// 		isReview: window.isReviewMode || false,
// 		smqCounter : window.idCounter,
// 		CM : window.idCounter
// 	}
// });

export default app;