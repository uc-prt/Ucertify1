<script context="module">
    export function getDefaultXMl(type) {
        var xmls = {
            "editor_item_86.xml": '<smxml type="30" name="slider"><slider key="ID0" minmax="0,100" step="1" title="" anskey="0" defaultans="0"></slider></smxml>',
            "sample": '<smxml type="30" name="slider"><slider key="ID0" minmax="0,100" step="1" title="" anskey="0" defaultans="0"></slider></smxml>',    
        };

        return xmls[type];
    }
</script>