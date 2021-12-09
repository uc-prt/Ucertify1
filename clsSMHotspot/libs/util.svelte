<script context="module">
    function checkmodule(targetData, pointer_size) {
        let yourScore = 0;
        let ansDivHeight = targetData.ans_top + targetData.ans_h;
        let ansDivWidth = targetData.ans_left + targetData.ans_w;
        if ((targetData.top + pointer_size) > targetData.ans_top && (targetData.top + parseInt(pointer_size / 2)) < ansDivHeight && (targetData.left + pointer_size) > targetData.ans_left && (targetData.left + parseInt(pointer_size / 2)) < ansDivWidth) {
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
        let pointer_size = 13;
        let scoreFlag;
        let targetData;
        
    //debugger;
        targetData = {
            x: e && e.layerX, 
            y: e && e.layerY, 
            top: 0, 
            left : 0, 
            uXml: "", 
            ans: false,
            ans_h, 
            ans_w, 
            ans_left, 
            ans_top
        };
        
        if(e && e.which != 13) {
            
            if (e.layerX && e.layerY) {
                targetData.top = e.layerY - pointer_size;
                targetData.left = e.layerX - pointer_size;
            } else {
                targetData.top = e.offsetY - pointer_size;
                targetData.left = e.offsetX - pointer_size;
            }
        } else {
                targetData.top = 20 - pointer_size;
                targetData.left = 20 - pointer_size;
        }
            
        // checking answer
        scoreFlag = checkmodule(targetData, pointer_size);

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