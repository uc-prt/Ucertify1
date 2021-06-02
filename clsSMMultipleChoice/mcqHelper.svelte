<script context="module">
    const alphabet = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');
    export const itemHelper = {
        doNotformatXml: function(type, xml) {
            return (+type == 0) ? '' : xml;
        },
        donNotSendXMl: true,
        checkDataOnSave: function(data, content_subtype, state, updateModule) {
            // let ansstr = "";
            // let arr = [];
            // Object.values(state.ajaxData.answers).map((item, index) => {
            //     let option = (item.is_correct == "1") ? "*" : '-';
            //     ansstr += '[[Option' + option + alphabet[index] + ': ' + seqTag(item.answer) + "\n";
            //     arr = removeBogus(ansstr);
            // });
            data['correct_answers'] = state.ajaxData.correct_answers;
            data['total_answers'] = state.ajaxData.total_answers;
            data['answers'] = state.ajaxData.answers;
            return data;
        },
        actionOnUpdate: function(state) {
            if (state.content_type == "q" && state.item == 0 && state.content_icon == 0) {
                jQuery('#xmlBtn').addClass("h");
            } else {
                jQuery('#xmlBtn').removeClass("h");
            }
        },
        checkBeforeSave: function(state, updateModule) {
            let checkOptionSelection = JSON.stringify(state.ajaxData.answers).match(/"is_correct":"[1-9]"/);
            if (checkOptionSelection == null) {
                updateModule('message',"You must select a option");
                updateModule('saveDialog',false);
                updateModule('snackback',true);
                return true;
            }
            return false;
        },
        helpVideo: '//player.vimeo.com/external/290348936.hd.mp4?s=a13a32bc22efff0e3b2813f64ee52ab6413166ea',

    };

    function removeBogus(data) {
        if (data) {
            data = data.replace(/<span data-mce-bogus[^>]*>/g, '');
            data = data.replace(/<span anscounter[^>]*>(.*?)<\/span>/g, (p1, p2) => {
                return p2;
            });
        }

        return data;
    }
</script>