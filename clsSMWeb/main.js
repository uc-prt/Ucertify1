import App from './Web.svelte';

const defXMl = '';

const app = new App({
	target: document.getElementById(window.moduleContainer) || document.body,
	props: {
		xml: window.QXML || defXMl,
		uaXML: window.uaXML,
		ansStatus: 0,
		isReview: window.isReviewMode || false,
		smqCounter : window.idCounter,
		CM : window.idCounter
	}
});

export default app;