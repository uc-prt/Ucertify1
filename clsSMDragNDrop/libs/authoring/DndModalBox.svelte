<!--
 *  File Name   : DndModalBox.svelte
 *  Description : Responsible for Modal Box
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (authoring)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import ModalEvent from "./ModalEvent.svelte";
    import l from '../../../src/libs/Lang';
    export let isDNDExtended = 0;
</script>
<div id="authoring-modal" class="modal fade" tabIndex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{l.draggable}</h4>
                <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body modal_height overflow-y">
                <div class="drag h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="drag-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="drag-width" name="width" placeholder="{l.width_of_draggable}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="drag-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="drag-height" name="height" placeholder="{l.height_of_drggable}" defaultvalue="30"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="drag-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="drag-top" name="top" placeholder="{l.top_of_draggable}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="drag-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="drag-left" name="left" placeholder="{l.left_of_drggable}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drag-value">{l.title}</label>
                                        <input type="text" class="form-control form-control-md" id="drag-value" name="value" placeholder="{l.title_of_drggable}" />
                                    </div>
                                </div>	
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drag-border_color">{l.border_color}</label>
                                        <select class="form-control form-control-md" id="drag-border_color" name="border_color">
                                            <option value="">{l.none}</option>
                                            <option value="black">{l.black}</option>
                                            <option value="gray">{l.gray}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drag-name">{l.grp_name}</label>
                                        <input type="text" class="form-control form-control-md" id="drag-name" name="name" placeholder="{l.name_of_draggable}" />
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drag-image">{l.background_image}</label>
                                        <input type="text" class="form-control form-control-md" id="drag-image" name="image" placeholder="{l.bg_of_draggble}" />
                                    </div>
                                    <button type="button" id="drag_upload_media" class="btn btn-outline-primary float-start">{l.upload_media_text}</button>
                                </div>
                                <div class="col-sm-6 px-1 pt-sm-4 mt-sm-1">
                                    <div class="form-group form-check form-check-inline">
                                        <input type="checkbox" class="checkbox form-check-input margin-bottom" id="drag-multi_drag" name="multi_drag" defaultvalue="1"/>
                                        <label class="control-label form-check-label font-weight-normal mb-0" for="drag-multi_drag">{l.multiple_drag}</label>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group form-check pt-3 form-check-inline">
                                        <input type="checkbox" class="checkbox form-check-input margin-bottom" id="ch-invisible" name="invisible" defaultvalue="1" />
                                        <label class="control-label form-check-label font-weight-normal mb-0" for="ch-invisible">{l.invisible}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 d-none">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="txt-style">{l.css_style}</label>
                                        <textarea id="txt-style" class="form-control form-control-md height_34 height_34" name="style" placeholder="{l.css_style_of_txt}"></textarea>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drag-detail">{l.detail}</label>
                                        <input type="text" class="form-control form-control-md" id="drag-detail" name="detail" placeholder="{l.detail_of_drag}" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" id="drag-id" name="id" />
                </div>
                <div class="dropitem h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="drop-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="drop-width" name="width" placeholder="{l.width_of_placeholder}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="drop-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="drop-height" name="height" placeholder="{l.height_of_placeholder}" defaultvalue="30"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="drop-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="drop-top" name="top" placeholder="{l.top_of_ph}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="drop-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="drop-left" name="left" placeholder="{l.left_of_ph}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drop-value">{l.title}</label>
                                        <input type="text" class="form-control form-control-md" id="drop-value" name="value" placeholder="{l.tilte_of_ph}" />
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drop-border">{l.border_color}</label>
                                        <select class="form-control form-control-md" id="drop-border" name="border">
                                            <option value="">{l.none}</option>
                                            <option value="black">{l.black}</option>
                                            <option value="gray">{l.gray}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drop-name">{l.grp_name}</label>
                                        <input type="text" class="form-control form-control-md" id="drop-name" name="name" placeholder="{l.name_of_ph}" />
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drop-anskey">{l.correct_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="drop-anskey" name="anskey" placeholder="{l.correct_answer_of_ph}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1 d-none">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="drop-defaultans">{l.default_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="drop-defaultans" name="defaultans" placeholder="{l.default_answer_of_ph}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <input type="checkbox" class="checkbox d-inline mr-2" id="drop-invisible" name="invisible" defaultvalue="1" />
                                        <label class="control-label font-weight-normal mb-0 position-relative bottom1" for="drop-invisible">{l.invisible}</label>
                                    </div>
                                </div>
                                <input type="hidden" id="drop-id" name="id" />
                            </div>
                        </div>
                        <div class="col-sm-6 pl-2 pr-1 d-none">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="drop-style">{l.css_style}</label>
                                <textarea id="drop-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_style_of_ph}"></textarea>
                            </div>
                            <div class="ev" type="drop">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inputbox h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="int-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="int-width" name="width" placeholder="{l.width_of_input}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="int-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="int-height" name="height" placeholder="{l.height_of_input}" defaultvalue="30"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="int-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="int-top" name="top" placeholder="{l.top_of_input}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="int-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="int-left" name="left" placeholder="{l.left_of_input}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="int-correctans">{l.correct_answer}</label>
                                        <input type="text" class="form-control form-control-md validate" id="int-correctans" name="correctans" placeholder="{l.correct_answer_of_input}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1 d-none">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="int-defaultans">{l.default_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="int-defaultans" name="defaultans" placeholder="{l.default_ans_of_input}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="int-placeholder">{l.placeholder}</label>
                                        <input type="text" class="form-control form-control-md" id="int-placeholder" name="placeholder" placeholder="{l.placeholder_of_ib}" />
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="int-type">{l.type}</label>
                                        <select class="form-control form-control-md" id="int-type" name="type">
                                            <option value="text" selected="selected">{l.text_box}</option>
                                            <option value="password">{l.password}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="int-parser">{l.parser}</label>
                                        <select class="form-control form-control-md" id="int-parser" name="parser">
                                            <option value="">{l.parser_of_txt}</option>
                                            <option value="sql">{l.sql}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group form-check form-check-inline">
                                        <input type="checkbox" class="checkbox form-check-input" id="int-nocase" name="nocase" defaultvalue="1" />
                                        <label class="control-label form-check-label font-weight-normal mb-0" for="int-nocase">{l.case_insensitive}</label>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group form-check form-check-inline">
                                        <input type="checkbox" class="checkbox form-check-input" id="int-ismultipleanswer" name="ismultipleanswer" defaultvalue="1" />
                                        <label class="control-label font-weight-normal mb-0 form-check-label" for="int-ismultipleanswer">Multiple Correct Answers</label>
                                    </div>
                                </div>
                                <input type="hidden" id="int-id" name="id" />
                            </div>
                        </div>
                        <div class="col-sm-6 pl-2 pr-1 d-none">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="int-style">{l.css_style}</label>
                                <textarea id="int-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_of_input}"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="custom_class_input">{l.font_style}</label>
                                <select class="form-control form-control-md" id="custom_class_input" name="custom_class"></select>
                            </div>
                            <div class="ev" type="int">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="multiline h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mlt-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="mlt-width" name="width" placeholder="{l.width_of_multiline}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mlt-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="mlt-height" name="height" placeholder="{l.height_of_multiline}" defaultvalue="30"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mlt-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="mlt-top" name="top" placeholder="{l.top_of_multiline}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mlt-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="mlt-left" name="left" placeholder="{l.left_of_multiline}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mlt-correctans">{l.correct_answer}</label>
                                        <textarea type="text" class="form-control form-control-md validate" id="mlt-correctans" name="correctans" placeholder="{l.crct_ans_multiline}"></textarea>
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1 d-none">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="mlt-defaultans">{l.default_answer}</label>
                                        <textarea type="text" class="form-control form-control-md" id="mlt-defaultans" name="defaultans" placeholder="{l.def_ans_multiline}"></textarea>
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="mlt-placeholder">{l.placeholder}</label>
                                        <input type="text" class="form-control form-control-md" id="mlt-placeholder" name="placeholder" placeholder="{l.placeholder_multiline}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="mlt-parser">{l.parser}</label>
                                        <select class="form-control form-control-md" id="mlt-parser" name="parser">
                                            <option value="">{l.parser_of_multiline}</option>
                                            <option value="sql">{l.sql}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group form-check form-check-inline">
                                        <input type="checkbox" class="checkbox form-check-input margin-bottom" id="mlt-nocase" name="nocase" defaultvalue="1" />
                                        <label class="control-label form-check-label font-weight-normal mb-0" for="mlt-nocase">{l.case_insensitive}</label>
                                    </div>
                                </div>
                                <input type="hidden" id="mlt-id" name="id" />
                            </div>
                        </div>
                        <div class="col-sm-6 pl-2 pr-1 d-none">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="mlt-style">{l.css_style}</label>
                                <textarea id="mlt-style" class="form-control form-control-md height_34" name="style" placeholder="CSS style of Multiline"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="custom_class">{l.css_class}</label>
                                <select class="form-control form-control-md" id="custom_class" name="custom_class"></select>
                            </div>
                            <div class="ev" type="mlt">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chekbox h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="chk-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="chk-width" name="width" placeholder="Width of Checkbox" defaultvalue="20"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="chk-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="chk-height" name="height" placeholder="{l.height_of_checkbox}" defaultvalue="20"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="chk-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="chk-top" name="top" placeholder="{l.top_of_checkbox}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="chk-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="chk-left" name="left" placeholder="{l.left_of_checkbox}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="chk-correctans">{l.correct_answer}</label>
                                        <input type="text" class="form-control form-control-md validate" id="chk-correctans" name="correctans" placeholder="{l.crct_of_chk}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="chk-defaultans">{l.default_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="chk-defaultans" name="defaultans" placeholder="{l.def_of_chk}" />
                                    </div>
                                </div>
                                <input type="hidden" id="chk-id" name="id" />
                            </div>
                        </div>
                        <div class="col-sm-6 pr-1 pl-2 d-none">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="chk-style">{l.css_style}</label>
                                <textarea id="chk-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_of_chk}"></textarea>
                            </div>
                            <div class="ev" type="chk">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rdio h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="rd-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="rd-width" name="width" placeholder="{l.width_of_radio}" defaultvalue="20"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="rd-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="rd-height" name="height" placeholder="{l.height_of_radio}" defaultvalue="20"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="rd-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="rd-top" name="top" placeholder="{l.top_of_radio}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="rd-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="rd-left" name="left" placeholder="{l.left_of_radio}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="rd-name">{l.name_text}</label>
                                        <input type="text" class="form-control form-control-md validate" id="rd-name" name="name" placeholder="Name of Radio" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="rd-correctans">{l.correct_answer}</label>
                                        <input type="text" class="form-control form-control-md validate" id="rd-correctans" name="correctans" placeholder="{l.crct_of_radio}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="rd-defaultans">{l.default_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="rd-defaultans" name="defaultans" placeholder="{l.def_of_radio}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="rd-checktype">{l.chk_type}</label>
                                        <input type="text" class="form-control form-control-md" id="rd-checktype" name="checktype" placeholder="{l.chktype_of_radio}" />
                                    </div>
                                </div>
                                <input type="hidden" id="rd-id" name="id" />
                            </div>
                        </div>
                        <div class="col-sm-6 pl-2 pr-1 d-none">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="rd-style">{l.css_style}</label>
                                <textarea id="rd-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_style_radio}"></textarea>
                            </div>
                            <div class="ev" type="rd">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="btn-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="btn-width" name="width" placeholder="{l.width_of_button}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="btn-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="btn-height" name="height" placeholder="{l.height_of_button}" defaultvalue="30"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="btn-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="btn-top" name="top" placeholder="{l.top_of_button}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="btn-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="btn-left" name="left" placeholder="{l.left_of_button}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="btn-value">Value</label>
                                        <input type="text" class="form-control form-control-md" id="btn-value" name="value" placeholder="{l.value_of_button}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="btn-class">{l.class}</label>
                                        <input type="text" class="form-control form-control-md" id="btn-class" name="class" placeholder="{l.class_of_button}" />
                                    </div>
                                    <input type="hidden" id="btn-id" name="id" />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 pr-1 pl-2 d-none">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="btn-style">{l.css_style}</label>
                                <textarea id="btn-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_style_btn}"></textarea>
                            </div>
                            <div class="ev" type="btn">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dropdown h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="ddn-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="ddn-width" name="width" placeholder="{l.width_of_dropdown}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="ddn-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="ddn-height" name="height" placeholder="{l.height_of_dropdown}" defaultvalue="30"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="ddn-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="ddn-top" name="top" placeholder="{l.top_of_dropdown}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="ddn-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="ddn-left" name="left" placeholder="{l.left_of_dropdown}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="ddn-value">{l.options}</label>
                                        <textarea class="form-control form-control-md" id="ddn-value" name="value" placeholder="{l.option_of_dropdown}"></textarea>
                                    </div>
                                    <input type="hidden" id="ddn-id" name="id" />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 pr-1 pl-2 d-none">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="ddn-style">{l.css_style}</label>
                                <textarea id="ddn-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_style_of_drpdwn}"></textarea>
                            </div>
                            <div class="ev" type="ddn">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="listbox h">
                    <div class="row mx-0">
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="lst-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="lst-width" name="width" placeholder="{l.width_of_listbox}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="lst-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="lst-height" name="height" placeholder="{l.height_of_listbox}" defaultvalue="30"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="lst-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="lst-top" name="top" placeholder="{l.top_of_listbox}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="lst-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="lst-left" name="left" placeholder="{l.left_of_listbox}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="lst-value">{l.options}</label>
                                        <textarea class="form-control form-control-md" id="lst-value" name="value" placeholder="{l.option_of_listbox}"></textarea>
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group form-check form-check-inline">
                                        <input type="checkbox" class="checkbox form-check-input margin-bottom" id="lst-multiple" name="multiple" defaultvalue="1"/>
                                        <label class="control-label font-weight-normal mb-0 form-check-label" for="lst-multiple">{l.select_multiple}</label>
                                    </div>
                                </div>
                                <input type="hidden" id="lst-size" name="size" defaultvalue="3" />
                                <input type="hidden" id="lst-id" name="id" />
                            </div>
                        </div>
                        <div class="col-sm-6 pr-1 pl-2">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="lst-style">{l.css_style}</label>
                                <textarea id="lst-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_style_of_listbox}"></textarea>
                            </div>
                            <div class="ev" type="lst">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tabhead h">
                    <div class="row mx-0">
                        
                        <div class="{(isDNDExtended == 1) ? "col-sm-6" : "col-sm-12"}">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="tbd-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="tbd-width" name="width" placeholder="{l.width_of_tabhead}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="tbd-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="tbd-height" name="height" placeholder="{l.height_of_tabhead}" defaultvalue="30"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="tbd-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="tbd-top" name="top" placeholder="{l.top_of_tabhead}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="tbd-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="tbd-left" name="left" placeholder="{l.left_of_tabhead}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="tbd-title">{l.title}</label>
                                        <input type="text" class="form-control form-control-md" id="tbd-title" name="title" placeholder="{l.title_of_tabhead}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="tbd-class">{l.class}</label>
                                        <input type="text" class="form-control form-control-md" id="tbd-class" name="class" placeholder="{l.class_of_tabhead}" />
                                    </div>
                                    <input type="hidden" id="tbd-id" name="id" />
                                </div>
                            </div>
                        </div>
                        {#if isDNDExtended == 1}
                            <div class="col-sm-6 pr-1 pl-2">
                                <div class="form-group">
                                    <label class="control-label font-weight-normal mb-0" for="tbd-style">{l.css_style}</label>
                                    <textarea id="tbd-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_style_of_tabhead}"></textarea>
                                </div>
                                <div class="ev" type="tbd">
                                    <ModalEvent/>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                <div class="img h">
                    <div class="row mx-0">
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="img-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="img-width" name="width" placeholder="{l.width_of_image}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="img-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="img-height" name="height" placeholder="{l.height_of_image}" defaultvalue="30"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="img-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="img-top" name="top" placeholder="{l.top_of_image}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="img-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="img-left" name="left" placeholder="{l.left_of_image}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="img-title">{l.title}</label>
                                        <input type="text" class="form-control form-control-md" id="img-title" name="title" placeholder="{l.title_of_image}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="img-bgimg">{l.background_image}</label>
                                        <input type="text" class="form-control form-control-md" id="img-bgimg" name="bgimg" placeholder="{l.bg_of_img}" />
                                        <input type="hidden" id="img-id" name="id" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 pr-1 pl-2">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="img-style">{l.css_style}</label>
                                <textarea id="img-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_style_of_image}"></textarea>
                            </div>
                            <div class="ev" type="img">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="labal h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="lbl-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="lbl-width" name="width" placeholder="{l.width_of_label}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="lbl-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="lbl-height" name="height" placeholder="{l.height_of_label}" defaultvalue="30"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="lbl-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="lbl-top" name="top" placeholder="{l.top_of_label}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="lbl-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="lbl-left" name="left" placeholder="{l.left_of_label}"/>
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="lbl-title">{l.title}</label>
                                        <input type="text" class="form-control form-control-md" id="lbl-title" name="title" placeholder="{l.title_of_label}" />
                                    </div>
                                </div>
                                <div class="col-sm-4 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="lbl_border_size">{l.border_size}</label>
                                        <select id="lbl_border_size" class="form-control form-control-md height_34" name="border_size">
                                            <option value="0">{l.none}</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-4 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="lbl_border_color">Border Color</label>
                                        <select id="lbl_border_color" class="form-control form-control-md height_34" name="border_color">
                                            <option value="white">{l.none}</option>
                                            <option value="black">{l.black}</option>
                                            <option value="blue">{l.blue}</option>
                                            <option value="green">{l.green}</option>
                                            <option value="red">{l.red}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-4 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="lbl_background_color">{l.bg_color}</label>
                                        <select id="lbl_background_color" class="form-control form-control-md height_34" name="background_color">
                                            <option value="">{l.none}</option>
                                            <option value="#c5d0fa">{l.primary_color}</option>
                                            <option value="#ffa354">{l.warning_color}</option>
                                            <option value="#f5785d">{l.danger_color}</option>
                                        </select>
                                        <input type="hidden" id="lbl-id" name="id" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="font-weight-normal mb-0" for="label_class">{l.font_style}</label>
                                        <select class="form-control form-control-md" id="label_class" name="label_class">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1 pb-2 d-none">
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="richtext" id="rich_label_title" />
                                        <label class="font-weight-normal mb-0 form-check-label" for="rich_label_title">{l.rich_text}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 d-none">
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="ev" type="lbl">
                                        <ModalEvent/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="area h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="area-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="area-width" name="width" placeholder="{l.width_of_area}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="area-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="area-height" name="height" placeholder="{l.height_of_area}" defaultvalue="30"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="area-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="area-top" name="top" placeholder="{l.top_of_area}"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="area-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="area-left" name="left" placeholder="{l.left_of_area}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="area-matrix">{l.matrix}</label>
                                        <input type="text" class="form-control form-control-md" id="area-matrix" name="matrix" placeholder="{l.matrix_of_area}" />
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="area-correctans">{l.correct_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="area-correctans" name="correctans" placeholder="{l.crt_of_area}" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="area-defaultans">{l.default_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="area-defaultans" name="defaultans" placeholder="{l.def_of_area}" />
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="area-id" name="id" />
                        </div>
                        <div class="col-sm-6">
                        </div>
                    </div>
                </div>
                <div class="menulist h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mnl-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="mnl-width" name="width" placeholder="{l.width_of_menulist}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mnl-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="mnl-height" name="height" placeholder="{l.height_of_menulist}" defaultvalue="30"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mnl-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="mnl-top" name="top" placeholder="{l.top_of_menulist}"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="mnl-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="mnl-left" name="left" placeholder="{l.left_of_menulist}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="mnl-matrix">{l.matrix}</label>
                                        <input type="text" class="form-control form-control-md" id="mnl-matrix" name="matrix" placeholder="{l.matrix_of_menulist}" />
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="mnl-correctans">{l.correct_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="mnl-correctans" name="correctans" placeholder="{l.crt_of_menulist}" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="mnl-value">{l.event_value}</label>
                                        <input type="text" class="form-control form-control-md" id="mnl-value" name="value" placeholder="{l.event_val_menulist}" />
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="mnl-id" name="id" />
                        </div>
                        <div class="col-sm-6">
                        </div>
                    </div>
                </div>
                <div class="hotspot h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="hpt-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="hpt-width" name="width" placeholder="{l.width_of_hotspot}" defaultvalue="200"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="hpt-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="hpt-height" name="height" placeholder="{l.height_of_hotspot}" defaultvalue="200"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="hpt-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="hpt-top" name="top" placeholder="{l.top_of_hotspot}"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="hpt-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="hpt-left" name="left" placeholder="{l.left_of_hotspot}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="hpt-title">{l.title}</label>
                                        <input type="text" class="form-control form-control-md" id="hpt-title" name="title" placeholder="{l.title_of_hotspot}" />
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="hpt-name">{l.name_text}</label>
                                        <input type="text" class="form-control form-control-md" id="hpt-name" name="name" placeholder="{l.name_of_hotspot}" />
                                    </div>
                                </div>
                            </div>
                            <div class="row h">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="hpt-targetimg">{l.target_img}</label>
                                        <input type="text" class="form-control form-control-md" id="hpt-targetimg" name="targetimg" placeholder="{l.target_img_hpt}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group mt-4 pt-sm form-check form-check-inline">
                                        <input type="checkbox" class="checkbox inline margin-bottom form-check-input" id="hpt-showtarget" name="showtarget" defaultvalue="1"/>
                                        <label class="control-label font-weight-normal mb-0 form-check-label" for="hpt-showtarget">{l.hide_target}</label>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="hpt-id" name="id" />
                        </div>
                    </div>
                </div>
                <div class="hotspot_click h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="hpt_clk-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="hpt_clk-width" name="width" placeholder="{l.width_of_click}" defaultvalue="100"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="hpt_clk-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="hpt_clk-height" name="height" placeholder="{l.height_of_click}" defaultvalue="30"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="hpt_clk-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="hpt_clk-top" name="top" placeholder="{l.top_of_click}"/>
                                    </div>
                                </div>
                                <div class="col-sm-3 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="hpt_clk-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="hpt_clk-left" name="left" placeholder="{l.left_of_click}"/>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="hpt_clk-id" name="id" />
                        </div>
                    </div>
                </div>
                <div class="tab h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="tab-title">{l.title}</label>
                                        <input type="text" class="form-control form-control-md" id="tab-title" name="value" placeholder="{l.title_of_tab}" defaultvalue="New"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="tab-alt">{l.alt_text}</label>
                                        <input type="text" class="form-control form-control-md" id="tab-alt" name="alt" placeholder="{l.alt_of_image}" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="tab-bgimg">{l.background_image}</label>
                                        <input type="text" class="form-control form-control-md" id="tab-bgimg" name="bgimg" placeholder="{l.bg_of_tab}" />
                                    </div>
                                    <button type="button" id="tab_upload_media" target="tab-bgimg" class="btn btn-outline-primary float-start">{l.upload_media_text}</button>
                                </div>
                                <div class="col-sm-6 px-1 mt-4 pt-sm">
                                    <div class="form-group form-check form-check-inline">
                                        <input type="checkbox" class="checkbox inline form-check-input margin-bottom" id="tab-display" name="display" defaultvalue="1" />
                                        <label class="control-label font-weight-normal mb-0 form-check-label" for="tab-display">{l.display}</label>
                                    </div> 
                                    <input type="hidden" id="tab-id" name="id" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="step h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="step-bgimg">{l.background_image}</label>
                                        <input type="text" class="form-control form-control-md" id="step-bgimg" name="bgimg" placeholder="{l.bg_of_step}" />
                                    </div>
                                    <button type="button" id="step_upload_media" target="step-bgimg" class="btn btn-outline-primary float-start">{l.upload_media_text}</button>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="step-alt">{l.img_alt}</label>
                                        <input type="text" class="form-control form-control-md" id="step-alt" name="alt" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group form-check form-check-inline">
                                        <input type="checkbox" class="checkbox inline margin-bottom form-check-input" id="step-display" name="display" defaultvalue="1" />
                                        <label class="control-label font-weight-normal mb-0 form-check-label" for="step-display">{l.display}</label>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="step-id" name="id" />
                        </div>
                    </div>
                </div>
                <div class="base h">
                    <div class="row mx-0">
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-sm-4 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="base-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="base-width" name="width" placeholder="{l.width_of_base}"/>
                                    </div>
                                </div>
                                <div class="col-sm-4 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="base-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="base-height" name="height" placeholder="{l.height_of_base}"/>
                                    </div>
                                </div>
                                <div class="col-sm-4 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="base-bgimg-alt">{l.bg_alt_text}</label>
                                        <input type="text" class="form-control form-control-md" id="base-bgimg-alt" name="alt" placeholder="{l.alt_text_base}" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="base-bgimg">{l.background_image}</label>
                                        <input readonly="readonly" type="text" class="form-control form-control-md" id="base-bgimg" name="bgimg" placeholder="{l.bg_of_base}" />
                                    </div>
                                </div>
                                <div class="col-sm-6 mt-3 pt-1 px-1">
                                    <button type="button" id="upload_media" class="btn btn-outline-primary float-start">{l.upload_media_text}</button>
                                    <div class="form-group float-start mt-2">
                                        <input type="checkbox" class="checkbox inline margin-bottom ml-3 position-relative top2" id="base-borderrequired" name="borderrequired" defaultvalue="1" checked/>
                                        <label class="control-label ml-1 font-weight-normal mb-0 position-relative top1" for="base-borderrequired">{l.add_border}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="jscript h">
                        <textarea id="code" name="jscript" style={{width:"100%",height:"300px"}}></textarea>
                </div>
                <div class="choicematrix h">
                    <div class="row mx-0">
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="choicematrix-width">{l.width_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="choicematrix-width" name="width" placeholder="{l.width_of_cm}" defaultvalue="20"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="choicematrix-height">{l.height_label1}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="choicematrix-height" name="height" placeholder="{l.height_of_cm}" defaultvalue="20"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="choicematrix-top">{l.top}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="choicematrix-top" name="top" placeholder="{l.top_of_cm}"/>
                                    </div>
                                </div>
                                <div class="col-sm-6 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0 mendatory_label" for="choicematrix-left">{l.left}</label>
                                        <input type="text" class="form-control form-control-md validate number_validate" id="choicematrix-left" name="left" placeholder="{l.left_of_cm}"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="choicematrix-name">{l.name_text}</label>
                                        <input type="text" class="form-control form-control-md" id="choicematrix-name" name="name" placeholder="{l.name_of_cm}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="choicematrix-correctans">{l.correct_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="choicematrix-correctans" name="correctans" placeholder="{l.crt_of_cm}" />
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="form-group">
                                        <label class="control-label font-weight-normal mb-0" for="choicematrix-defaultans">{l.default_answer}</label>
                                        <input type="text" class="form-control form-control-md" id="choicematrix-defaultans" name="defaultans" placeholder="{l.def_of_cm}" />
                                    </div>
                                </div>
                                <input type="hidden" id="choicematrix-id" name="id" />
                            </div>
                        </div>
                        <div class="col-sm-6 pl-2 pr-1">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0" for="choicematrix-style">{l.css_style}</label>
                                <textarea id="choicematrix-style" class="form-control form-control-md height_34" name="style" placeholder="{l.css_of_cm}"></textarea>
                            </div>
                            <div class="ev" type="rd">
                                <ModalEvent/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">{l.cancel}</button>
                <button type="button" class="btn btn-primary addElement" data-bs-dismiss="modal">{l.ok_btn}</button>
                <button type="button" class="btn btn-primary errorBtn h">{l.ok_btn}</button>
            </div>
        </div>
    </div>
</div>

<style>
    .modal_height {
        max-height: 350px;
    }
</style>