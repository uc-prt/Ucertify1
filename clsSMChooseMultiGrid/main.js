import App from './ChooseMultiGridPreview.svelte';

const defXMl = '<SMXML type="6" name="ChooseAndReorder"><list groupcheck="false" whichfixed ="" headingCorrect="IP Classes" row="2" col="3"><!--[CDATA[!Class A\n!Class B\n!Class C\n21.3.23.233\n128.1.1.1\n200.255.255.255]]--></list></SMXML>';

const app = new App({
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

export default app;