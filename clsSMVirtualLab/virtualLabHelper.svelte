<script context="module">
	export const itemHelper = {
		isManualGrade: function(xml) {
			if (xml.match(/<smxml\s.*?autograde="1"|<smxml\s.*?autograde='1'/gmi)) {
				return true;
			}
		},
	};
</script>