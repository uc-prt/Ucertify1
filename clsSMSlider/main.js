import App from './SliderItemPreview.svelte';

const defXMl = `<smxml type="30" name="slider"><slider key="ID0" minmax="0,100" step="1" title="" anskey="0" defaultans="0"></slider></smxml>`;

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