<script context="module">
    export function getDefaultXMl(type) {
    let xmls = {
        "editor_item_106.xml": `
			<smxml type="8">
				<!--[CDATA[[
                    {
                        "is_correct":0,
                        "answer":"True",
                        "id":"01",
                        "seq_str":"A",
                        "user_answer":0
                    },
                    {
                        "is_correct":0,
                        "answer":"False",
                        "id":"02",
                        "seq_str":"B",
                        "user_answer":0
                    },
                    {
                        "is_correct":0,
                        "answer":"True",
                        "id":"03",
                        "seq_str":"C",
                        "user_answer":0
                    },
                    {
                        "is_correct":0,
                        "answer":"False",
                        "id":"04",
                        "seq_str":"D",
                        "user_answer":0
                    }
                ]]]-->
			</smxml>`,
    };

    return xmls[type];
}
</script>
