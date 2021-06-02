import App from './AudioPreview.svelte';

const defXMl = `<smxml type="43" name="AudioRecorder" status="" language="us-en" isReset="true" showTranscript="false"><!--[CDATA[]]--></smxml>`;

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