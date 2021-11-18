<script context="module">

    import X2JS from "../scripts/editorScript/xml2json";
    import JUI, {JStore} from '../src/libs/javscript_helper/JUI.js';
    export const UCUTIL = {

    };

    // JUI.listen('body','keydown','.smControlerBtn .correct-ans',function(_this,e) {
    //     if(e.which === 13) {
    //         _this.click();
    //     }
    // })
    // JUI.listen('body','keydown','.smControlerBtn .your-ans',function(_this,e) {
    //     if(e.which === 13) {
    //         _this.click();
    //     }
    // })

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

    export function JSONToXML(a) {
        let b = new X2JS({
            useDoubleQuotes: !0
        })
        let c = b.json2xml_str(a);
        return c = c.replace("<![CDATA[", "\x3c!--[CDATA[").replace("]]>", "]]--\x3e")
    }

    // Accept Object argument with key ans and uXml to store user answer and status
    export function onUserAnsChange(result) {
        if (result) {
            AH.select("#answer", 'checked', result.ans ? true : false);
            AH.select("#special_module_user_xml", 'value', result.uXml);
            if (typeof window == 'object') {
                window.ISSPECIALMODULEUSERXMLCHANGE = 1;
                if (typeof calculatePoint != "undefined") {
                    calculatePoint(result.correctPoints || 1, result.ansPoint || result.ans);
                }
            }
            globalThis.saveUserAnswerInSapper?.(result);
        }
    }
    export function initCodeCopy() {
        setTimeout(function(){
            try {
                AH.selectAll('pre.prettyprint').forEach((curr) => {
                    var wrapper = AH.wrap(curr, '<div style="position:relative"></div>').parentNode;
                    var child_wrapper = AH.templateHtml('<span class="copyto prettyprint_copy pointer" title="Copy">Copy <i class="icomoon-copy-4 align-middle"></i></span>');
                    wrapper.prepend(child_wrapper);
                });
                
                AH.listenAll('pre.prettyprint', 'mouseenter', function (e) {
                    if (e.target.previousSibling.classList.contains('prettyprint_copy')) {
                        e.target.previousSibling.style.opacity = 1;
                    }
                });
                AH.listenAll('pre.prettyprint', 'mouseleave', function (e) {
                    if (e.target.previousSibling.classList.contains('prettyprint_copy')) {
                        e.target.previousSibling.style.opacity = 0;
                    }
                });
                AH.listenAll('.prettyprint_copy', 'mouseenter', function (e) {
                    e.target.style.cssText = 'opacity: 1; color: #222';
                });
                AH.listenAll('.prettyprint_copy', 'mouseleave', function (e) {
                    e.target.style.cssText = 'opacity: 0; color: #bbb';
                });

                // Init to Copy the code/text when clicked on copy icon
                if (typeof(ClipboardJS) == "function") {
                    copyPrettyPrint();
                } else {
                    AH.ajax({
                        type: "GET",
                        url: itemUrl + "src/libs/clipboard.min.js",
                        dataType: "script",
                    }).then((data)=> {
                        AH.addScript(data, "", {target: "body"});
                        copyPrettyPrint();
                    })
                }
            } catch(err) {
                console.warn(err);
            }
        }, 2000);
    }

    function copyPrettyPrint() {
        var a = new ClipboardJS('.prettyprint_copy', {
            target: function (trigger) {
                return trigger.nextElementSibling;
            }
        });
    }
    export const AH = new JUI();
    export const SSD = new JStore();

</script>