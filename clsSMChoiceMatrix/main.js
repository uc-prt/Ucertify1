import App from './ChoiceMatrixPreview.svelte';

const defXMl = `<smxml type="27" name="ChoiceMatrix" theme="theme1" font="Georgia" maxwidth="710"><!--[CDATA[Statement,True,False,
	In this approach not only is the perimeter secured#cm but individual systems within the network are also secured.,1,0,
	In this approach#cm  the bulk of security efforts are focused on the perimeter of the network.,0,1,
	One way to accomplish security in this approach is to divide the network into segments and secure each segment as if it were a separate network.,1,0,
	The focus#cm in this approach#cm might include firewalls#cm proxy servers#cm or password policies.,0,1,
	]]--></smxml>
`;

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