<script context="module">
    import X2JS from "../../../script/xml2json";
    export function XMLToJSON(myXml) {
        //var myXml = xml;
        myXml = myXml.replace(/<\!--\[CDATA\[/g, "<![CDATA[").replace(/\]\]-->/g, "]]>");
        let x2js = new X2JS({
            useDoubleQuotes: true
        });
        let newXml = JSON.stringify(x2js.xml_str2json(myXml));
        newXml = newXml.replace("SMXML", "smxml");
        newXml = JSON.parse(newXml);

        return newXml;
    }
    function checkmodule(targetData) {
        let yourScore = 0;
        console.log(targetData);
        if (targetData.y > targetData.top && targetData.y < targetData.ans_h && targetData.x > targetData.left && targetData.x < targetData.ans_w) {
            yourScore = 1;
        }
        return yourScore;
    }

    function createUserAnsXML(targetTop,targetLeft) {
        return '<SMANS type="4"><div targetTop="'+parseInt(targetTop)+'" targetLeft="'+parseInt(targetLeft)+'" /></SMANS>';
    }
    export function movetarget(e, ans_h, ans_w) {
        // let tObj = document.getElementById('target')[0];
        // let hObj = document.getElementById('hotArea')[0];
        let scoreFlag;
        let targetData = {x: e.layerX, y: e.layerY, top: 0, left : 0, uXml: "", ans: false, ans_h, ans_w};
        if (e.layerX && e.layerY) {
            targetData.top = e.layerY - 13;
            targetData.left = e.layerX - 13;
        } else {
            targetData.top = e.offsetY - 13;
            targetData.left = e.offsetX - 13;
        }
        // checking answer
        scoreFlag = checkmodule(targetData);

        // creating user ans xml
        targetData.uXml = createUserAnsXML(targetData.top, targetData.left);
        if (typeof calculatePoint != "undefined") {
            temp = (scoreFlag == 1) ? 1 : 0;
            calculatePoint(1, temp);
        }

        if (scoreFlag > 0) {
            targetData.ans = true;
        } else {
            targetData.ans = false;
        }

        return targetData;
    }
</script>