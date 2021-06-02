<script context="module">
export function getDefaultXMl(type) {
    var xmls = {
        "editor_item_75.xml": '<SMXML type="6" name="ChooseAndReorder"><list groupcheck="false" whichfixed ="" headingCorrect="IP Classes" row="2" col="3"><!--[CDATA[!Class A\n!Class B\n!Class C\n21.3.23.233\n128.1.1.1\n200.255.255.255]]--></list></SMXML>',
    };

    return xmls[type];
}
</script>
