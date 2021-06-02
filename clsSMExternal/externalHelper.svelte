<script context="module">
	 export const itemHelper = {
		getXml: function(frameNode, xml, subtype) {
			let iframexml = frameNode.save_data(1, 0, true);
			let correct = iframexml.toString().match(/<correct>[\s\S]*?<\/correct>/img);
			correct = correct.toString().replace(/\$/g, '<ucdollor>');
			correct = xml.toString().replace(/<correct>[\s\S]*?<\/correct>/img, correct.toString());
			correct = correct.toString().replace(/<ucdollor>/g, '$');
			return correct;
		},
		verticalView: true,
		doNotformatXml: true,
		helpVideo: {
			"11": '//player.vimeo.com/external/373755193.hd.mp4?s=bcc2f06c653081342e3503fc3f056949baadf1bd',
		}
	};
</script>