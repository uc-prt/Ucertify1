<script context="module">
    function checkmodule(targetData) {
        let yourScore = 0;
        let ansDivHeight = targetData.ans_top + targetData.ans_h;
        let ansDivWidth = targetData.ans_left + targetData.ans_w;
        if (targetData.top > targetData.ans_top && targetData.top < ansDivHeight && targetData.left > targetData.ans_left && targetData.left < ansDivWidth) {
            yourScore = 1;
        }
        return yourScore;
    }

    function createUserAnsXML(targetTop,targetLeft) {
        return '<SMANS type="4"><div targetTop="'+parseInt(targetTop)+'" targetLeft="'+parseInt(targetLeft)+'" /></SMANS>';
    }
    export function movetarget(e, ans_h, ans_w, ans_left, ans_top) {
        // let tObj = document.getElementById('target')[0];
        // let hObj = document.getElementById('hotArea')[0];
        let scoreFlag;
        let targetData = {x: e.layerX, y: e.layerY, top: 0, left : 0, uXml: "", ans: false, ans_h, ans_w, ans_left, ans_top};
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