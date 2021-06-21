import App from './MatchListPreview.svelte';

const defXMl = '';

const app = new App({
	target: document.getElementById(window.moduleContainer) || document.body,
	props: {
		xml: window.QXML || defXMl,
		uxml: window.uaXML,
		ansStatus: 0,
		isReview: window.isReviewMode || false,
		smqCounter : window.idCounter,
		cmed : window.idCounter
	}
});

export default app;