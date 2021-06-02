<!--
 *  File Name   : defaultXML.svelte
 *  Description : Responsible for defaultXML
 *  Author      : Ayush Srivastava
 *  Package     : clsSMChart(xml)
 *  Last update : 15-MAR-2021
 *  Last Updated By : Ayush Srivastava
-->
<script context="module">
    export function getDefaultXMl(type) {
        let xmls = {
            "editor_item_45.xml": '<SMXML type="38" name="chart"><chart id="ID0" height="500" width="550" type="column" xval="[1,2,3,4,5,6]" yinterval="5" ymax="50" ymin="1" xmin="1" xmax="6" xinterval="1" defaultans="10,20,30" snapTo="5" correctans="|0,10|1,20|2,30|" xlabel="Years" ylabel="Quantity in Tons" title="Bar Chart" color="#7cb5ec" ></chart></SMXML>',
            "editor_item_46.xml": '<smxml type="38" name="chart"><chart id="ID0" height="500" width="550" type="line" xval="[1,2,3,4,5,6]" yinterval="5" ymax="50" ymin="1" xmin="1" xmax="6" xinterval="1" defaultans="10,20,30" snapto="5" correctans="|0,10|1,20|2,30|" xlabel="Hours" ylabel="Values" title="Line Chart" color="#7cb5ec"></chart></smxml>',
            "editor_item_47.xml": '<smxml type="38" name="chart"><chart id="ID0" height="500" width="550" type="histogram" xval="[10,20,30,40,50,60]" yinterval="5" ymax="50" ymin="1" xmin="10" xmax="60" xinterval="10" defaultans="10,20,30" snapto="5" correctans="|0,10|1,20|2,30|" xlabel="Hours" ylabel="Values" title="Histogram Chart"></chart></smxml>',
            "editor_item_48.xml": '<smxml type="38" name="chart"><chart id="ID0" height="500" width="550" type="dotplot" xval="[1,2,3,4,5,6]" yinterval="5" ymax="50" ymin="1" xmin="1" xmax="6" xinterval="1" defaultans="1,2,3" snapto="10" correctans="|0,10|1,20|2,30|" xlabel="Set Frequency" title="Dot Plot" color="#7cb5ec"></chart></smxml>',
            "sample": '<smxml type="38" name="chart"><chart id="ID0" height="500" width="550" type="dotplot" xval="[1,2,3,4,5,6]" yinterval="5" ymax="50" ymin="1" xmin="1" xmax="6" xinterval="1" defaultans="1,2,3" snapto="10" correctans="|0,10|1,20|2,30|" xlabel="Set Frequency" title="Dot Plot" color="#7cb5ec"></chart></smxml>',  
        };
        return xmls[type];
    }
</script>