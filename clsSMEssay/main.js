import App from './EssayPreview.svelte';

const defXMl = `<smxml type="5" name="Essay"><!--[CDATA[]]--></smxml>`;

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