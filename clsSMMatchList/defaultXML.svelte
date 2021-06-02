<script context="module">
export function getDefaultXMl(type) {
    var xmls = {
        "editor_item_19.xml": '<smxml xmlns="http://www.w3.org/1999/xhtml" type="14" name="Match List"><matchlist listheading1="Error Message" listheading2="Description" multimatch="2"><!--[CDATA[\nMemory failure; replace RAM[MULTI_BIT_ECC_ERROR]\nThe CMOS battery probably needs replacement[CMOS_BATTERY_ERROR]\nCMOS RAM error. Try flashing the BIOS to fix[CMOS_CHECKSUM_ERROR]\nThe installed memory in each slot doesn\'t match for optimal performance[MEM_OPTIMAL_ERROR]]]--></matchlist></smxml>',
		"editor_item_20.xml": '<smxml type="14" name="Match List"><matchlist listheading1="Error Message" listheading2="Description" multimatch="1"><!--[CDATA[\nMemory failure; replace RAM[MULTI_BIT_ECC_ERROR]\nThe CMOS battery probably needs replacement[CMOS_BATTERY_ERROR]\nCMOS RAM error. Try flashing the BIOS to fix[CMOS_CHECKSUM_ERROR]\nThe installed memory in each slot doesn\'t match for optimal performance[MEM_OPTIMAL_ERROR]]]--></matchlist></smxml>',
        "editor_item_21.xml": '<smxml type="14" name="Match List"><matchlist listheading1="Power Connector Images" listheading2="Power Connector Names" multimatch="0"><!--[CDATA[\nATX Power Connector [*24-pin-atx-power_0002TR.jpg]\nSATA-2 Power Connector  [*15-pin-sata-power_0002Tq.jpg]\nFloppy Power Connector  [*4-pin-berg-floppy-power_0002TP.jpg]\nPCIe Power Connector  [*6-pin-pcie-power_0002TQ.jpg]\nMolex Peripheral Power Connector  [*4-pin-molex-peripheral_0002Tp.jpg]]]--></matchlist></smxml>',
        "sample": '<smxml type="14" name="Match List"><matchlist listheading1="Power Connector Images" listheading2="Power Connector Names" multimatch="0"><!--[CDATA[\nATX Power Connector [*24-pin-atx-power_0002TR.jpg]\nSATA-2 Power Connector  [*15-pin-sata-power_0002Tq.jpg]\nFloppy Power Connector  [*4-pin-berg-floppy-power_0002TP.jpg]\nPCIe Power Connector  [*6-pin-pcie-power_0002TQ.jpg]\nMolex Peripheral Power Connector  [*4-pin-molex-peripheral_0002Tp.jpg]]]--></matchlist></smxml>',
	};

    return xmls[type];
}
</script>