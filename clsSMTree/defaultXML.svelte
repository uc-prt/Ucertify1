<script context="module">
    export function getDefaultXMl(type) {
    var xmls = {
        "editor_item_39.xml": '<SMXML type="7" name="TreeView"><tree headingCorrect="Permission Types" headingAll="Permissions" allowSort="0" allowMulti="1"><![CDATA[#Permissions\n##Standard NTFS folder permissons\n###[Read]\n###[Write]\n###[List Folder Contents]\n###[Read & Execute]\n###[Modify]\n###[Full Control]\n##Standard NTFS file permissions\n###[Read]\n###[Write]\n###[Read & Execute]\n###[Modify]\n###[Full Control]\n##Standard shared folder permission\n###[Read]\n###[Change]\n###[Full Control]\n ]]></tree></SMXML>',
        "sample": '<SMXML type="7" name="TreeView"><tree headingCorrect="Permission Types" headingAll="Permissions" allowSort="0" allowMulti="1"><![CDATA[#Permissions\n##Standard NTFS folder permissons\n###[Read]\n###[Write]\n###[List Folder Contents]\n###[Read & Execute]\n###[Modify]\n###[Full Control]\n##Standard NTFS file permissions\n###[Read]\n###[Write]\n###[Read & Execute]\n###[Modify]\n###[Full Control]\n##Standard shared folder permission\n###[Read]\n###[Change]\n###[Full Control]\n ]]></tree></SMXML>',
    };

    return xmls[type];
}
</script>