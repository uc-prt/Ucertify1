<script context="module">
    export function getDefaultXMl(type) {
        let xmls = {
            "editor_item_077.xml": `<smxml type="43" name="AudioRecorder" status="" language="us-en" isReset="true" showTranscript="false"><!--[CDATA[]]--></smxml>`,
            "sample": `<smxml type="43" name="AudioRecorder" status="" language="us-en" isReset="true" showTranscript="false"><!--[CDATA[]]--></smxml>`,
        };

        return xmls[type];
    }
</script>