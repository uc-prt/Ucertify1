<script context="module">
export function getDefaultXMl(type) {
    var xmls = {
        "editor_item_078.xml": `<SMXML type="57" name="List" imported_by="" file="" imported_on="" pt="" disabled_generate="1"><!--[CDATA[{"list": [
                {
                    "c1": "Question", "c2": "Answer", "pg": "", "cg": "", "ag": [], "rn": []
                },
                {
                    "c1": "Data1", "c2": "Meaning1", "pg": "", "cg": "", "ag": [], "rn": []
                },
                {
                    "c1": "Data2", "c2": "Meaning2", "pg": "", "cg": "", "ag": [], "rn": []
                },
                {
                    "c1": "Data3", "c2": "Meaning3", "pg": "", "cg": "", "ag": [], "rn": []
                },
                {
                    "c1": "Data4", "c2": "Meaning4", "pg": "", "cg": "", "ag": [], "rn": []
                }]
            }
        ]]--></SMXML>`,
        "sample": `<SMXML type="57" name="List" imported_by="" file="" imported_on="" pt="" disabled_generate="1"><!--[CDATA[{"list": [
            {
                "c1": "Question", "c2": "Answer", "pg": "", "cg": "", "ag": [], "rn": []
            },
            {
                "c1": "Data1", "c2": "Meaning1", "pg": "", "cg": "", "ag": [], "rn": []
            },
            {
                "c1": "Data2", "c2": "Meaning2", "pg": "", "cg": "", "ag": [], "rn": []
            },
            {
                "c1": "Data3", "c2": "Meaning3", "pg": "", "cg": "", "ag": [], "rn": []
            },
            {
                "c1": "Data4", "c2": "Meaning4", "pg": "", "cg": "", "ag": [], "rn": []
            }]
        }]]--></SMXML>`,
    };
    
    return xmls[type];
}
</script>