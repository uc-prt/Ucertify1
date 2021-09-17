<!-- 
	* File-Name  : 'editor_popover_modal.svelte'
	* Detail     : 'Used to load editor module'
	* Area       : 'author'
-->
<script>
    import {AH} from '../helper/HelperAI.svelte';

	// $("#modal_editor").on('shown.bs.modal', function (e) {
	//     setTimeout(function() {
	//         $('.modal-backdrop').addClass('modal-backdrop-custom');
	//         $('.modal-backdrop.show').addClass('modal-backdrop-custom.show');
	//     });
	// });

    AH.bind("#modal_editor shown.bs.modal",function(){
        setTimeout(function() {
            AH.selectAll('.modal-backdrop','addClass','modal-backdrop-custom');
            AH.selectAll('.modal-backdrop.show','addClass','modal-backdrop-custom.show');
        })
    })



	// $("#modal_editor").on('hidden.modal', function() {
	// 	setTimeout(function() {
	//         $('.modal-backdrop').removeClass('modal-backdrop-custom');
	//         $('.modal-backdrop.show').removeClass('modal-backdrop-custom.show');
	//     });
	// });

    AH.bind("#modal_editor hidden.modal",function(){
        setTimeout(function() {
            AH.select('.modal-backdrop','removeClass','modal-backdrop-custom');
            AH.select('.modal-backdrop.show','removeClass','modal-backdrop-custom.show');
        })
        
    })

</script>

<div id="modal_editor" class="modal white-bg p-0 modal_editor" role="dialog" tabindex="">
	<div class="modal-dialog modal-dialog-centered no-top-pd h-100">
		<div class="modal-content h-100 mw-100">
			<div class="modal-body mh-100 overflow-hide no-pd no-top-pd h-100">
				<div id="frame_container" class="h-100"></div>
				<button class="h" id="editor_close_btn" data-dismiss="modal"></button>
			</div> 
		</div>
	</div>
</div>

<style>
    :global(#modal_editor) {
        margin-top:-1px;
        overflow: hidden;
        z-index: 9999 !important;
    }
    :global(.modal-backdrop-custom) {
        background:#FFFFFF!important;
    }
    :global(.modal-backdrop-custom.show) {
        opacity:0!important;
        z-index:0!important;
    }
    :global(.no-top-pd) {
        padding: 0!important;
        margin: 0!important;
        }
    :global(#modal_editor>.modal-dialog>.modal-content) {
        box-shadow:none;
    }
    :global(.no_margin_top) {
        margin-top: 0px !important;
    }
</style>