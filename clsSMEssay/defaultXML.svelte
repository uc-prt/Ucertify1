<script context="module">
    export function getDefaultXMl(type) {
    var xmls = {
        "editor_item_4.xml": '<smxml type="5" name="Essay"><default type="0"><!--[CDATA[]]--></default></smxml>',
        "sample": '<smxml type="5" name="Essay"><default type="0"><!--[CDATA[]]--></default></smxml>',	    
    };

    return xmls[type];
}
</script>