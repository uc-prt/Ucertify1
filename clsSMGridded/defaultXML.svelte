<script context="module">
export function getDefaultXMl(type) {
    var xmls = {
        "editor_item_q56_01.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="56" plusminus="0" fixed_point="0" slash="0" decimal="0" font="14" row="4" col="4" correctAns=""><!--[CDATA[]]--></smxml>',
        "sample": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="56" plusminus="0" fixed_point="0" slash="0" decimal="0" font="14" row="4" col="4" correctAns=""><!--[CDATA[]]--></smxml>',
    };

    return xmls[type];
}
</script>