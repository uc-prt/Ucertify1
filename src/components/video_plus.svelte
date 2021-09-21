<div id="ada-cc-style">
    <style>video::cue(.ada) {visibility:hidden} c\.ada{display:none;}</style>
</div>
<div class="alert alert-success h alert-dismissible" id="video-plus-alert">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    <p></p> 
</div>
<div class="video_plus col-md-12 <{if $data.is_playlist==1}>is_playlist<{/if}> <{if $data.framework == 'pe-virtual_lab'}> np <{/if}>">
    <{if !$data.is_playlist}>
<{if $IS_DATA_DUMP}><{php}>global $theme; $theme->setRedisTpl(basename($_smarty_tpl->source->filepath),130);<{/php}><{/if}>
    <div class="row">
	    <{if $data.question !=1}>
	        <div class="col-md-7">
                <h2><{$asset.title|replace:'_':' '}></h2>
        	</div>
        <{/if}>
        <{if $data.is_edit == 1}>
<{if $IS_DATA_DUMP}><{php}>global $theme; $theme->setRedisTpl(basename($_smarty_tpl->source->filepath),137);<{/php}><{/if}>
	        <div class="col-md-5 mb-md">
	            <div class="float-right">
	                <span class="show-transcript">&nbsp;</span>
	                <button type="button" name="update" id="update-vtt" guid="<{$content_guid}>" class="btn btn-light h">Update VTT</button>
	                <button type="button" name="add" id="add-title" class="btn btn-light">Edit</button>
	            </div>
	         </div>
         <{/if}>
    </div>
    <{/if}>
     <div class="row">
        <div class="col-md-12 p-0">
            <div class="row video-container">
                <div class="col-md-7 col-sm-7 video-div p-0 <{if $data.framework == 'pe-virtual_lab'}>pl-0 pr-sm<{/if}>">
                    <div class="mr-sm-3">
                        <div id="video-container"></div>
                    </div>
                    <div class="hide-trans float-right h">&nbsp;</div>
                </div>
                <div class="col-md-5 col-sm-5 transcript-container p-0 mt-sm-0 mt-2">
                    <div role="tabpanel" class="help_item_content" id="js_help_container" style="">	
                        <ul class="nav nav-tabs border-0 sidetab_ul" role="tablist">
                            <li role="presentation" rel="tooltip" title="<{$l.transcript}>" class="nav-item"><a class="nav-link btn_icon video_side_btns active show" href="#sidebar_panel" aria-controls="sidebar_panel" role="tab" data-toggle="tab" aria-selected="true"><i class="icomoon-16px-notes-2"></i> <{$l.transcript}></a></li>
                            <li role="presentation" rel="tooltip" title="<{$l.notes2}>" class="nav-item"><a class="nav-link btn_icon video_side_btns jw-custom-comment" button="<{$data.content_guid}>" href="#video_notes_tab" aria-controls="video_notes_tab" role="tab" data-toggle="tab" aria-selected="false"><i class="icomoon-notebook"></i> <{$l.notes2}></a></li>
                            <li rel="tooltip" title="<{$l.settings}>" class="nav-item dropdown <{if $data.framework == 'pe-virtual_lab'}>h<{/if}>">
                                <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><i class="icomoon-24px-settings-1"></i></a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="#" name="hide-transcript" id="hide-transcript" rel="tooltip" title="<{$l.hide_tab}>"><span><span class="icomoon-eye-5 position-relative"></span> <{$l.hide}></span></a>
                                </div>
                            </li>
                        </ul>
                        <div class="tab-content pt-md bg-white border p-0">
                            <div role="tabpanel" class="tab-pane active show" id="sidebar_panel">
                                <div id="sidebar">
                                <!--<div class="trans_toolbar text-body <{if $data.framework == 'pe-virtual_lab'}>h<{/if}>">
                                        <div class="float-left">
                                            <div>
                                                <span tabindex="0" name="hide-transcript" id="hide-transcript" rel="tooltip" title="Hide Transcript" class="float-right pl-md pt-sm pb-sm pointer"> <span class="icomoon-eye-5 relative"></span> Hide</span>
                                            </div>    
                                        </div>
                                        <div class="float-right font-weight-bold">
                                            <span tabindex="0" class=" pointer pr-md font-weight-bold" id="download_file">
                                                <i class="icomoon-file-download"></i> Download
                                            </span>
                                            <span class="pr-md">
                                                <label class="switch_label">
                                                    <input id="ada-switch" type="checkbox" />
                                                    <div class="switch_btn"></div> Accessibility 
                                                </label>
                                            </span>
                                        </div>
                                    </div>-->
                                    <div id="transcript" class="pl-lg pr-md pb-5 hidescroll bg-white text-body">
                                    </div>
                                    <div class="transcript-ul h text-justify p-md bg-white text-body"></div>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="video_notes_tab">
                                <div class="video_comment_section overflow-y-scroll"></div>
                            </div>
                        </div>											
                    </div>
                </div>
            </div>
            <div class="skip-overlay h">
               <div class="overlay-inner relative text-center">
                    <div class="show_result"></div>
                    <div>
                       A quiz is about to start. Click continue to take the quiz. Click on skip to skip the quiz and  go back to video.
                   </div>
                   <div class="mt-xl">
                        <button type="button" name="action" value="continue" class="btn btn-success mr-md" id="continue-test"><{$l.continue}></button>
                        <input type="button" class="btn btn-light" id="skip-test" value="<{$l.skip}>"/>      
                   </div>
               </div>
            </div>
            <div class="fullscreen-overlay h">
               <div class="overlay-inner relative text-center">
                    <div>
                       You wouldn't be able to see transcript and practice if you are going in full screen mode.
                   </div>
                   <div class="mt-xl">
                        <button type="button" name="action" value="continue" class="btn btn-success mr-md" id="continue-fullscreen"><{$l.continue}></button>
                        <input type="button" class="btn btn-light" value="<{$l.skip}>" id="skip-fullscreen" />       
                   </div>
               </div>
            </div>
        </div>
    </div>
</div>
<div class="show_content">
    <div id="modal-from-test" class="test-modal modal" tabindex="-1">
        <div class="modal-body pt-0">
            <iframe name="test_frame" id="test_frame" <{if $is_frame}>target="_parent"<{/if}> frameBorder="0" src=""></iframe>
        </div>
    </div>
</div>
<div id="add-title-model" class="add-title-model modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Add Title </h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>  
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="add-title">
                            <input type="text" id="v_title" name="v_title" class="form-control" placeholder="Enter title.."/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <input type="button" id="save-title" value="<{$l.save}>" class="btn btn-success" data-dismiss="modal" aria-hidden="true"/>
                <button class="btn btn-light" data-dismiss="modal" aria-hidden="true"><{$l.cancel}></button>       
            </div>
        </div>
    </div>
</div>
<div id="add-tag-model" class="add-title-model modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Add Tag</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>  
            <div class="modal-body">
                <div class="row m-0">
                    <div class="col-md-12">
                        <div class="add-tag">
                            <div class="form-group row test-name-group test-name">
                                <label class="col-md-3 control-label text-left" for="test-name">Test Name</label>
                                <div class="col-md-9">
                                    <input type="text" id="test-name" name="test-name" class="form-control" placeholder="Enter test name..."/>
                                </div>
                            </div>
                            <div class="form-group row type-group">
                                <label class="col-md-3 control-label text-left" for="type">Type</label>
                                <div class="col-md-9">
                                    <select id="type" name="type" class="form-control">
                                        <option value="q">Question</option>
                                        <option value="f">Flashcard</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row test-set-group testset">
                                <label class="col-md-3 control-label text-left" for="test-set">Test Set</label>
                                <div class="col-md-9">
                                    <select id="test-set" name="test-set" class="form-control">
                                        <option value="0">Predefined</option>
                                        <option value="1">Customized</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row test-mode-group test-mode">
                                <label class="col-md-3 control-label text-left" for="test-mode">Test mode</label>
                                <div class="col-md-9">
                                    <select id="test-mode" name="test-mode" class="form-control">
                                        <option value="0">Learn</option>
                                        <option value="1">Test</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row time-group time">
                                <label class="col-md-3 control-label text-left" for="guid">Time allowed</label>
                                <div class="col-md-9">
                                    <input type="number" id="time" name="time" class="form-control" placeholder="Enter time.."/>
                                </div>
                            </div>
                            <div class="form-group row assignment-guid-group assignment-guid">
                                <label class="col-md-3 control-label text-left pr-0" for="assignment-guid">Assessment Code</label>
                                <div class="col-md-9">
                                    <input type="text" id="assignment-guid" name="assignment-guid" class="form-control" placeholder="Enter assignment code.."/>
                                </div>
                            </div>
                            <div class="form-group row guid-group content-guid">
                                <label class="col-md-3 control-label text-left" for="guid">Guid's</label>
                                <div class="col-md-9">
                                    <input type="text" id="guid" name="guid" class="form-control" placeholder="Enter Content guid.."/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer pl-md pr-md">
                <input type="button" id="save-tag" value="<{$l.save}>" class="btn btn-success" data-dismiss="modal" aria-hidden="true"/>
                <input type="button" id="delete-tag" value="<{$l.delete}>" class="btn btn-primary" data-dismiss="modal" aria-hidden="true"/>
                <button class="btn btn-light" data-dismiss="modal" aria-hidden="true"><{$l.cancel}></button>       
            </div>
        </div>
    </div>
</div>
