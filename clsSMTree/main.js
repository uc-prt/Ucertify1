import App from './TreeViewPreview.svelte';

const defXMl = `<SMXML type="7" name="TreeView"><tree headingCorrect="Permission Types" headingAll="Permissions" allowSort="0" allowMulti="1"><![CDATA[#Permissions\n##Standard NTFS folder permissons\n###[Read]\n###[Write]\n###[List Folder Contents]\n###[Read & Execute]\n###[Modify]\n###[Full Control]\n##Standard NTFS file permissions\n###[Read]\n###[Write]\n###[Read & Execute]\n###[Modify]\n###[Full Control]\n##Standard shared folder permission\n###[Read]\n###[Change]\n###[Full Control]\n ]]></tree></SMXML>`;

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