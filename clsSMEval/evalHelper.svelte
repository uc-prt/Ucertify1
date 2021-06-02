<script context="module">
    export const itemHelper = {
        getXml: function(frameNode, xml, subtype) {
            return frameNode.generateXml();
        },
        onOpenSave: function(state, func) {
            if (!state.db_changed) {
                return true;
            } else {
                return false;
            }
        },
        checkDataOnSave: function(data, content_subtype, self, updateModule) {
            let xml = self.state.xml;
            let parsed24Xml = XMLToJSON(xml);
            if (parsed24Xml && parsed24Xml.smxml._language == "sql") {
                let changedXML = xml.match(/<case>[\s\S]*?<\/case>/g).join("").split("<case>");
                for (let index = 0; index < changedXML.length; index++) {
                    changedXML[index] = changedXML[index].substring(changedXML[index].indexOf("|") + 1);
                }
                changedXML = changedXML.join("<case>|");
                xml = xml.replace(/<testcases>[\s\S]*?<\/testcases>/g, "<testcases>" + changedXML + "</testcases>")
                updateModule({ xml: xml });
            }
            data['special_module_xml'] = xml;
            return data;
        },
        verticalView: true,
        doNotformatXml: true,
        helpVideo: '//player.vimeo.com/external/287909057.hd.mp4?s=294a3cad46aec8d3cd8620b56ad7fa7e4aca731b',
    };
</script>