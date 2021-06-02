<script context="module">
export const itemHelper = {
    "isHideForContentIcon": 4,
    "doNotformatXml": true,
    helpVideo: {"1":'//player.vimeo.com/external/289408246.hd.mp4?s=f226bc1150053931cd33b664a69c5041c970070c'},
    doNotCheckStem: function() {
        if (state.content_icon == "3" || state.content_icon == "4") {
            return true;
        }
        return false;
    }
};
</script>