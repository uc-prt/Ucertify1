<!--
 *  File Name   : defaultXML.svelte
 *  Description : Responsible for defaultXML
 *  Author      : Ayush Srivastava
 *  Package     : clsSMDrawing (xml)
 *  Last update : 09-APRIL-2021
 *  Last Updated By : Ayush Srivastava
-->
<script context="module">
    export function getDefaultXMl(type) {
        var xmls = {
            "editor_item_108.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="41" name="Drawing" bgimg="useraccount_000ANv.png" imgAlt="Triangle image" width="600" markPointColor="#00FF00" color="#00BCD4"><div selectedDrawingType="_scribble,_line,_compass"><!--[CDATA[]]--></div><backgroundPoint type="backgroundPoints"><!--[CDATA[]]--></backgroundPoint></smxml>',
            "sample": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="41" name="Drawing" bgimg="useraccount_000ANv.png" imgAlt="Triangle image" width="600" markPointColor="#00FF00" color="#00BCD4"><div selectedDrawingType="_scribble,_line,_compass"><!--[CDATA[]]--></div><backgroundPoint type="backgroundPoints"><!--[CDATA[]]--></backgroundPoint></smxml>',
        };
        return xmls[type];
    }
</script>