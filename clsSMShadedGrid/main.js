import App from './ShadingPreview.svelte';

const defXMl = `<smxml type="44" name="Shading" rowCount="1" colCount="4" cellWidth="2" cellHeight="2" correctAns="" correctCount="" shadedCell="" lockedCell="false" HiddenCell="" lockedCellValue=""><!--[CDATA[]]--></smxml>`;

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