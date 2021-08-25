<!--
 *  File Name   : DrawingModal.svelte
 *  Description : Responsible for DrawingModal
 *  Author      : Ayush Srivastava
 *  Package     : clsSMDrawing(Drawing Modal)
 *  Last update : 09-Apr-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    export let l;
</script>
<div id="drawing-modal" class="modal fade" tabIndex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{l.configuration}</h4>
                <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body overflow-y">
                <div class="authoring-modal">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group text-left">
                                <label class="control-label font-weight-normal d-inline-flex" for="backgroundImage">{l.background_image}</label>
                                <input type="text" disabled="disabled" readonly="readonly" class="form-control drawing_bgimg" id="backgroundImage" name="backgroundImage" />
                            </div>
                        </div>
                        <div class="col-6 margin-top-2">
                            <button id="upload_media" type="button" value={l.upload_media_text} margin="normal" class="btn btn-primary w-100" >{l.upload_media_text}</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group text-left">
                                <label class="control-label font-weight-normal d-inline-flex" for="imgAlt" ><span class="mendatory_label float-left">{l.alt_txt_image}</span></label>
                                <input type="text" class="form-control" id="imgAlt" value="" name="imgAlt" />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group text-left">
                                <label class="control-label font-weight-normal d-inline-flex" for="imgWidth"><span class="mendatory_label float-left">{l.width_of_image}</span></label>
                                <input type="number" class=" form-control num" id="imgWidth" value="" name="imgWidth" />
                            </div>
                        </div>
                        <div class="col-6">
                            <span>
                                <label for="lineColor" class="text-dark">{l.draw_color}</label>
                            </span>
                            <select id="lineColor" class="form-select">
                                <option value={l.red}>{l.red}</option>
                                <option value={l.green}>{l.green}</option>
                                <option value="#00BCD4" selected="selected">{l.light_blue}</option>
                                <option value={l.blue}>{l.blue}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <span>
                                <label for="markPointColor" class="text-dark">{l.markPointColor}</label>
                            </span>
                            <select id="markPointColor" class="form-select">
                                <option value="#00FF00" selected="selected">{l.lightGreen}</option>
                                <option value="#000">{l.black}</option>
                                <option value="#ff8c00">{l.orange}</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <span>
                            <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label class="mt-2 text-dark relative"><span class="mendatory_label float-left">{l.tools}</span></label>
                        </span>
                    </div>
                    <div class="d-block toolsCheckbox">
                        <div class="form-check form-check-inline">
                            <input type="checkbox" value="_scribble" class="checkbox-inline toolCheckbox form-check-input" name="scribble_checkbox" id="scribble_checkbox" />
                            <label for="scribble_checkbox" class="text-dark form-check-label">{l.scribble}</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="checkbox" value="_line" class="checkbox-inline toolCheckbox form-check-input" name="line_checkbox" id="line_checkbox" />
                            <label for="line_checkbox" class="text-dark form-check-label">{l.line}</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="checkbox" value="_compass" class="checkbox-inline toolCheckbox form-check-input" name="compass_checkbox" id="compass_checkbox" />
                            <label for="compass_checkbox" class="text-dark form-check-label">{l.compass}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">{l.cancel}</button>
                <button type="button" class="btn btn-secondary drawing_modal_submit">{l.submit}</button>
            </div>
        </div>
    </div>
</div>