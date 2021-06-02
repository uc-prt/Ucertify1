import App from './ListPreview.svelte';

const defXMl = `<SMXML type="57" name="List" imported_by="" file="" imported_on="" pt="" disabled_generate="1"><!--[CDATA[{"list": [
	{
		"c1": "Question", "c2": "Answer", "pg": "", "cg": "", "ag": [], "rn": []
	},
	{
		"c1": "Data1", "c2": "Meaning1", "pg": "", "cg": "", "ag": [], "rn": []
	},
	{
		"c1": "Data2", "c2": "Meaning2", "pg": "", "cg": "", "ag": [], "rn": []
	},
	{
		"c1": "Data3", "c2": "Meaning3", "pg": "", "cg": "", "ag": [], "rn": []
	},
	{
		"c1": "Data4", "c2": "Meaning4", "pg": "", "cg": "", "ag": [], "rn": []
	}]
}]]--></SMXML>`;

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