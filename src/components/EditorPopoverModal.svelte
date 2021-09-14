<script>
/**
* File-Name    : EditorPopoverModal.tpl
* Detail       : Used to load editor module
* Created By   : Prabhat Kumar <prabhat.kumar@ucertify.com>
* Updated By   : Prabhat Kumar
* Updated Date : 14 Sep 2021
* Area         : Editor
*/
import { AH } from '../../helper/HelperAI.svelte';
AH.select('#modal_editor', 'shown.bs.modal', function() {
    setTimeout(function() {
        AH.select('.modal-backdrop', 'addClass', ['modal-backdrop-custom']);
        AH.select('.modal-backdrop.show', 'addClass', ['modal-backdrop-custom.show']);
    });
});

AH.select('#modal_editor', 'hidden.modal', function() {
    setTimeout(function() {
        AH.select('.modal-backdrop', 'removeClass', ['modal-backdrop-custom']);
        AH.select('.modal-backdrop.show', 'removeClass', ['modal-backdrop-custom.show']);
    });
});
</script>
<div id="modal_editor" class="modal white-bg p-0 modal_editor" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered no-top-pd h-100">
        <div class="modal-content h-100 mw-100">
            <div class="modal-body mh-100 overflow-hide no-pd no-top-pd h-100">
                <div id="frame_container" class="h-100"></div>
                <button class="h" id="editor_close_btn" data-bs-dismiss="modal"></button>
            </div> 
        </div>
    </div>
</div>
<style>
#modal_editor {
    margin-top:-1px;
    overflow: hidden;
    z-index: 9999 !important;
}
.modal-backdrop-custom {
    background:#FFFFFF!important;
}
.modal-backdrop-custom.show {
    opacity:0!important;
    z-index:0!important;
}
.no-top-pd {
    padding: 0!important;
    margin: 0!important;
}
#modal_editor>.modal-dialog>.modal-content {
    box-shadow:none;
}
.no_margin_top {
    margin-top: 0px !important;
}
</style>