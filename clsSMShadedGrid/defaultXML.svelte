<script context="module">
    export function getDefaultXMl(type) {
        var xmls = {
            "editor_item_120.xml": '<smxml type="44" name="Shading" rowCount="1" colCount="4" cellWidth="2" cellHeight="2" correctAns="" correctCount="" shadedCell="" lockedCell="false" HiddenCell="" lockedCellValue=""><!--[CDATA[]]--></smxml>',
            "sample": '<smxml type="44" name="Shading" rowCount="1" colCount="4" cellWidth="2" cellHeight="2" correctAns="" correctCount="" shadedCell="" lockedCell="false" HiddenCell="" lockedCellValue=""><!--[CDATA[]]--></smxml>',
        };
        
        return xmls[type];
    }
</script>