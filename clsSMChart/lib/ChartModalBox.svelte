<!--
 *  File Name   : ChartModalBox.svelte
 *  Description : Responsible for authoring modal box
 *  Author      : Ayush Srivastava
 *  Package     : clsSMChart (Modal box)
 *  Last update : 15-MAR-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import l from '../../src/libs/editorLib/language.js';
</script>

<div id="authoring-modal" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{l.chart_label}</h4>
                <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body modal_height overflow-y">
                <div class="plotchart h">
                    <div class="row mx-0">
                        <div class="col-sm-6 col-12 px-1">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0 d-inline-flex" for="chart-width"><div class="mendatory_label float-left">{l.width_label}</div><div class="mendatory_field"></div></label>
                                <input type="text" class="num validate form-control form-control-md" id="chart-width" name="width" placeholder="Width of chart" defaultValue="500" data-dwidth = "550" />
                            </div>
                        </div>
                        <div class="col-sm-6 col-12 px-1">
                            <div class="form-group">
                                <label class="control-label font-weight-normal mb-0 d-inline-flex" for="chart-height"><div class="mendatory_label float-left">{l.height_label}</div><div class="mendatory_field"></div></label>
                                <input type="text" class="num validate form-control form-control-md" id="chart-height" name="height" placeholder="Height of chart" defaultValue="500" data-dheight = "500"/>
                            </div>
                        </div>
                    </div>
                    <div class="row mx-0">
                        <div class="form-group col-sm-6 col-12 px-1">
                            <label class="control-label font-weight-normal mb-0 d-inline-flex" for="chart-type"><div class="mendatory_label float-left">{l.type}</div><div class="mendatory_field"></div></label>
                            <select  class="form-select" id="chart-type" name="type">
                                <option value="column">{l.column_label}</option>
                                <option value="line">{l.line_label}</option>
                                <option value="histogram">{l.histogram_label}</option>
                            </select>
                        </div>
                        <div class="form-group col-sm-6 col-12 px-1">
                            <label class="control-label font-weight-normal mb-0" for="chart_title">{l.chart_title}</label>
                            <input type="text" class="form-control form-control-md" id="chart_title" name="title" placeholder="Enter Chart Title" />
                        </div>
                    </div>
                    <div class="row mx-0">
                        <div class="form-group col-sm-6 col-12 px-1">
                            <label class="control-label font-weight-normal mb-0" for="xlabel">{l.xaxis_title}</label>
                            <input type="text" class="form-control form-control-md" id="xlabel" name="xlabel" placeholder="Enter Text" data-dxtitle ="Hours" />
                        </div>
                        <div class="form-group col-sm-6 col-12 px-1">
                            <label class="control-label font-weight-normal mb-0" for="ylabel">{l.yaxis_title}</label>
                            <input type="text" class="form-control form-control-md" id="ylabel" name="ylabel" placeholder="Enter Text" data-dytitle ="Values"/>
                        </div>
                    </div>
                    <div class="row mx-0">
                        <div class="form-group col-sm-6 col-12 px-1">
                            <label class="control-label font-weight-normal mb-0 d-inline-flex" for="defaultans"><div class="mendatory_label float-left">{l.default_answer}</div><div class="mendatory_field"></div></label>
                            <input type="text" class="validate form-control form-control-md" id="defaultans" name="defaultans" placeholder="Enter answer" data-dans = "10,20,30" readonly = "readonly" aria-describedby="defaultAnsHelpBlock" />
                            <small id="defaultAnsHelpBlock" class="text-danger font-weight-bold"> {l.default_representation}</small>	
                        </div>								
                        <div class="col-sm-6 col-12 form-group px-1">
                            <label class="control-label font-weight-normal mb-0" for="color">{l.set_color}</label>
                                <select class="form-select" id="color" name="color">
                                <option value="#7cb5ec" selected = "selected">{l.default}</option> 
                                <option value="#c5d0fa">{l.primary_color}</option>
                                <option value="#ffa354">{l.warning_color}</option>
                                <option value="#f5785d">{l.danger_color}</option>
                            </select>
                        </div>
                    </div>									
                    <div class="row mx-0 show_values">											
                        <div class="form-group col-sm-6 col-12 px-0 xmultiple">
                            <label class="control-label font-weight-normal mb-0 w-100 px-1" for="xaxisValues">												
                            {l.xinterval_val}</label>										
                            <div class="col-md-4 px-1 d-inline-block float-start">
                                <label class="control-label font-weight-normal mb-0" for="xmin">{l.min}</label>
                                <input type="number" class="num validate form-control form-control-md" id="xmin" name="xmin" placeholder="No." data-dxmin = "10" />
                            </div>
                            <div class="col-md-4 px-1 d-inline-block float-start">
                                <label class="control-label font-weight-normal mb-0" for="xmax">{l.max}</label>
                                <input type="number" class="num validate form-control form-control-md" id="xmax" name="xmax" placeholder="No." data-dxmax = "60" />
                            </div>
                            <div class="col-md-4 px-1 d-inline-block float-start">
                                <label class="control-label font-weight-normal mb-0" for="xinterval">{l.interval_txt}</label>
                                <input type="number" class="num validate form-control form-control-md" id="xinterval" name="xinterval" placeholder="No." data-dxinterval = "10" />
                            </div>
                        </div>
                        <div class="form-group col-sm-6 col-12 px-1 ymultiple details">
                            <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label class="control-label font-weight-normal mb-0 w-100 px-1">{l.yinterval_val}</label>										
                            <div class="col-md-4 px-1 d-inline-block float-start">
                                <label class="control-label font-weight-normal mb-0" for="ymin">{l.min}</label>
                                <input type="number" class="num validate form-control form-control-md" id="ymin" name="ymin" placeholder="No." data-dymin = "1" />
                            </div>
                            <div class="col-md-4 px-1 d-inline-block float-start">
                                <label class="control-label font-weight-normal mb-0" for="ymax">{l.max}</label>
                                <input type="number" class="num validate form-control form-control-md" id="ymax" name="ymax" placeholder="No." data-dymax = "50" />
                            </div>
                            <div class="col-md-4 px-1 d-inline-block float-start">
                                <label class="control-label font-weight-normal mb-0" for="yinterval">{l.interval_txt}</label>
                                <input type="number" class="num validate form-control form-control-md" id="yinterval" name="yinterval" placeholder="No." data-dyinterval = "5" />
                            </div>
                        </div>
                    </div>
                    <div class="row mx-0 show_values d-none">
                        <div class="col-sm-6 col-12 px-1 form-group">
                            <label class="control-label font-weight-normal mb-0 d-inline-flex" for="snapto"><div class="mendatory_label float-left">{l.snap_to}</div><div class="mendatory_field"></div></label>
                            <input type="text" class="num validate form-control form-control-md" id="snapto" name="snapto" placeholder="Enter Number Only" data-dsnapto = "10" />
                        </div>											
                    </div>						
                    <input type="hidden" id="chart-anskey" name="chart-anskey" placeholder="anskey"/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary resetElement">{l.reset}</button>
                <button type="button" class="btn btn-secondary addElement">{l.ok_btn}</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">{l.cancel}</button>
            </div>
        </div>
    </div>
</div>

<style>
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none; 
    }
    .modal_height {
        max-height: 350px;
    }
</style>