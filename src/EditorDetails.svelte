<script context="module">
    const content_type = ['q','u','p','a','e','f','s','c','v','x'];
    export const editorDetails = {}
    content_type.map((type)=> {
        editorDetails[type] = {
            title: {view: false, label: "Title", placeHolder: "Place Your Text Here", restrict: null},
            stem: {view: false, label: "Stem", placeHolder: "Place Your Text Here", restrict: null}, 
            content: {view: false, label: "Content", placeHolder: "Place Your Text Here", restrict: null},
            remediation: {view: false, label: "Remediation", placeHolder: "Place Your Text Here", restrict: [57]}, 
            itemModule: {view: false, style: null, restrict: null}, 
            isFullMode: {view: false},
            showItemMetaIcon: {view: false},
            isQuestion: false,
            required: false,
            checkRequired: {view: "*", restrict: null},
            defaultVerticalView: false,
            typeAllowedSave: "*",
            domain: "*",
            showRefresh: {view: false, restrict: null},
        };
    });

// q and u are used for question type
editorDetails.q.title.view = "*"
editorDetails.q.stem.view = "*";
editorDetails.q.remediation.view = "*";
editorDetails.q.itemModule.view = "*";
editorDetails.q.isQuestion = "*";
editorDetails.q.required = "stem";
editorDetails.q.isFullMode.view = [16,17,18,24,22,23,32,36];
editorDetails.q.showItemMetaIcon.view = [25];
editorDetails.q.showXMl = {view: "*", restrict: [0,8]};

editorDetails.u.title.view = "*";
editorDetails.u.stem.view = "*";
editorDetails.u.remediation.view = "*";
editorDetails.u.itemModule.view = "*";
editorDetails.u.isQuestion = "*";
editorDetails.u.required = "stem";
editorDetails.u.isFullMode.view = [16,17,18,24,22,36,23,32];
editorDetails.u.showItemMetaIcon.view = [25];
editorDetails.u.showXMl = {view: "*", restrict: [0,8]};
//------------END--------------------//

//---------Web Pages ------------------//
editorDetails.p.itemModule.view = "*";
editorDetails.p.itemModule.style = {overflowX: "auto"};
//editorDetails.p.content.view = "*";
editorDetails.p.defaultVerticalView = false;
editorDetails.p.domain = false;
editorDetails.p.webPageList = "*";
editorDetails.p.loadWebPages = "*"; 
editorDetails.p.showOtherType = "*";
editorDetails.p.showRefresh.view = "*";
//------------END------------------------//

//--------------Type f -------------------//
editorDetails.f.title.view = "*";
editorDetails.f.required = "title";
editorDetails.f.checkRequired = {view: "*", restrict:[52]};
editorDetails.f.title.restrict = [52];
editorDetails.f.content.view = "*";
editorDetails.f.content.restrict = [52];
editorDetails.f.itemModule.view = [45,52];
editorDetails.f.itemModule.style = {overflowX: "auto"};
editorDetails.f.defaultVerticalView = false;
editorDetails.f.save_content_text = {view: [52]};
editorDetails.f.save_vtt_info = {view: [45]};
editorDetails.f.showRefresh.view = "*";
//--------------END-----------------------//

//--------- Other type ------------------//
editorDetails.a.title.view = "*";
editorDetails.a.content.view = "*";
editorDetails.a.loadWebPages = "*";
editorDetails.a.showRefresh.view = "*";

editorDetails.e.title.view = "*";
editorDetails.e.itemModule.view = "*";
editorDetails.e.itemModule.style = {overflowX: "auto"};
editorDetails.e.defaultVerticalView = false;
editorDetails.e.loadWebPages = "*";
editorDetails.e.showOtherType = "*";

editorDetails.s.title.view = "*";
editorDetails.s.required = "title";
editorDetails.s.content.view = "*";
editorDetails.s.showRefresh.view = "*";

editorDetails.c.title.view = "*";
editorDetails.c.title.required = "*";
editorDetails.c.content.view = "*";
editorDetails.c.showRefresh.view = "*";

editorDetails.v.title.view = "*";
editorDetails.v.content.view = "*";
editorDetails.v.showRefresh.view = "*";

editorDetails.x.title.view = "*";
editorDetails.x.content.view = "*";
editorDetails.x.showRefresh.view = "*";
//------------END------------------------//
</script>