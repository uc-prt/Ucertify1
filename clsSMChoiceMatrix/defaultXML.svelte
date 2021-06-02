<script context="module">
    export function getDefaultXMl(type) {
        var xmls = {
        "editor_item_82.xml": `
        <smxml type="27" name="ChoiceMatrix" theme="theme1" font="arial" maxwidth="500">
	            <!--[CDATA[Statements,True,False,
	                Term Sample text,1,0,
                    Term Sample text,0,1,
                    Term Sample text,1,0,
                ]]-->
            </smxml>`,
    };

        return xmls[type];
    }
</script>