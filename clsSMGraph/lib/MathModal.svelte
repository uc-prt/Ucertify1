<!--
 *  File Name   : MathModal.svelte
 *  Description : Responsible for MathModal
 *  Author      : Ayush Srivastava
 *  Package     : clsSMGRAPH (Math Modal)
 *  Last update : 02-Mar-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    export let l;
    export let is_association;
</script>
<div>
    <div id="authoring-modal" class="modal fade" tabIndex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{l.plot_graph}</h4>
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body overflow-y">
                    <div class="graphitem plotgraph h">
                        <div class="row mx-0">
                            <div class="col-sm-3 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="graph-width"><div class="mendatory_label float-left">{l.width_label}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="integer validate form-control" id="graph-width" name="width" placeholder={l.graph_width} defaultValue="500" />
                                </div>
                            </div>
                            <div class="col-sm-3 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="graph-height"><div class="mendatory_label float-left">{l.height_label}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="integer validate form-control" id="graph-height" name="height" placeholder={l.graph_height} defaultValue="500" />
                                </div>
                            </div>
                            <div class="col-sm-6 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="graph-type"><div class="mendatory_label float-left">{l.type}</div><div class="mendatory_field"></div></label>
                                    <select class="form-select select" id="graph-type" name="type">
                                        <option value="point">{l.point_graph}</option>
                                        <option value="line">{l.line_graph}</option>
                                        <option value="circle">{l.circle_graph}</option>
                                        <option value="ray">{l.ray_graph}</option>
                                        <option value="segment">{l.segment_graph}</option>
                                        <option value="vector">{l.vector_graph}</option>
                                        <option value="parabola">{l.parabola_graph}</option>
                                        <option value="sine">{l.sine_graph}</option>
                                        <option value="cosine">{l.cos_graph}</option>
                                        <option value="polygon">{l.polygon_graph}</option>
                                        {#if is_association}
                                            <option disabled="disabled" value="association">{l.association}</option>
                                        {/if}
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" class="form-control" id="graph-id" name="id" placeholder={l.title} value="ID0"/>
                            <div class="col-sm-3 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="xaxis"><div class="mendatory_label float-left">{l.xaxis_label}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="form-control validate integer" id="xaxis" name="xaxis" placeholder={l.xaxis_value} min="2" defaultValue="10" />
                                </div>
                            </div>
                            <div class="col-sm-3 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="yaxis"><div class="mendatory_label float-left">{l.yaxis_label}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="form-control validate integer" id="yaxis" name="yaxis" placeholder={l.yaxis_value} min="2" defaultValue="10" />
                                </div>
                            </div>
                            <input type="hidden" id="graph-anskey" name="anskey" placeholder={l.anskey} />
                            <div class="col-sm-3 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="xtickdistance"><div class="mendatory_label float-left">{l.xaxis_interval}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="form-control validate integer" id="xtickdistance" name="xtickdistance" placeholder={l.xaxis_interval} min="1" defaultValue="1" />
                                </div>
                            </div>
                            <div class="col-sm-3 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="ytickdistance"><div class="mendatory_label float-left">{l.yaxis_interval}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="form-control validate integer" id="ytickdistance" name="ytickdistance" placeholder={l.yaxis_interval} min="1" defaultValue="1" />
                                </div>
                            </div>
                            <div class="col-sm-12 px-1">
                                <div class="numberlinePlot form-group text-left h" id="numberlinePlot" style="border: 1px solid #ccc">
                                    <!-- svelte-ignore a11y-label-has-associated-control -->
                                    <label class="control-label font-weight-normal mb-0">{l.inequality_num}</label>
                                    <div class="plotEq">
                                        <div class="position-relative p-1">
                                            <input type="text" class="text-center" defaultValue="" style="width: 40px; height: 25px;"/>
                                            <select class="form-select" style="height: 25px">
                                                <option value="0">&equals;</option>
                                                <option value="1">&lt;</option>
                                                <option value="2">&gt;</option>
                                                <option value="3">&le;</option>
                                                <option value="4">&ge;</option>
                                            </select>
                                            <input type="text" defaultValue="x" class="text-center" style="width: 40px; height: 25px;" readOnly="readonly" />
                                            <select class="form-select" style="height: 25px">
                                                <option value="0">&equals;</option>
                                                <option value="1">&lt;</option>
                                                <option value="2">&gt;</option>
                                                <option value="3">&le;</option>
                                                <option value="4">&ge;</option>
                                            </select>
                                            <input type="text" defaultValue="" class="text-center" style="width: 40px; height: 25px;" />
                                            <span class="remove-eq h position-absolute right5">&times;</span>
                                        </div>
                                    </div>
                                    <!-- svelte-ignore a11y-label-has-associated-control -->
                                    <label id="add-equation" class="add-equation btn btn-primary btn-xs pull-right mr-sm" title="Add item"><i class="icomoon-plus"></i></label>
                                </div>
                            </div>
                            <div class="form-group equation_select col-sm-6 px-1 text-left h" id="line">
                                <label class="control-label font-weight-normal mb-0" for="line-eq">{l.equation_type}</label>
                                <select class="form-select" id="line-eq" name="line-eq" disabled="disabled">
                                    <option value="y=m*x+c">{l.standard_form}</option>
                                </select>
                            </div>
                            <div class="form-group equation_select col-sm-7 px-1 text-left h" id="circle">
                                <label class="control-label font-weight-normal mb-0" for="circle-eq">{l.equation_type}</label>
                                <select class="form-select" id="circle-eq" name="circle-eq" disabled="disabled">
                                    <option value="(x-x1)^2 + (y-y1)^2 = r^2">{l.circle_form}</option>
                                </select>
                            </div>
                            <div class="form-group equation_select col-sm-6 px-1 text-left h" id="parabola">
                                <label class="control-label font-weight-normal mb-0" for="parabola-eq">{l.equation_type}</label>
                                <select class="form-select" id="parabola-eq" name="parabola-eq" disabled="disabled">
                                    <option value="y=a*(x-h)^2+k">{l.parabola_form}</option>
                                </select>
                            </div>
                            <div class="form-group equation_select col-sm-6 px-1 text-left h" id="sine">
                                <label class="control-label font-weight-normal mb-0" for="sine-eq">{l.equation_type}</label>
                                <select class="form-select" id="sine-eq" name="sine-eq" disabled="disabled">
                                    <option value="y=A*sin(B*x+C)+D">{l.sin_form}</option>
                                </select>
                            </div>
                            <div class="form-group equation_select col-sm-6 px-1 text-left h" id="cosine">
                                <label class="control-label font-weight-normal mb-0" for="cosine-eq">{l.equation_type}</label>
                                <select class="form-select" id="cosine-eq" name="cosine-eq" disabled="disabled">
                                    <option value="y=A*cos(B*x+C)+D">{l.cos_form}</option>
                                </select>
                            </div>
                            <div class="form-group equation_select col-sm-6 px-1 text-left h" id="polygon">
                                <label class="control-label font-weight-normal mb-0" for="polygon_type">{l.polygon_type}</label>
                                <select class="form-select" id="polygon_type" name="polygon_type">
                                    <option value="0">{l.matchlist_normal}</option>
                                    <option value="1">{l.only_x}</option>
                                    <option value="2">{l.only_y}</option>
                                    <option value="3">{l.both_xy}</option>
                                </select>
                                <input type="hidden" id="reflection" name="reflection" placeholder={l.reflection} />
                            </div>
                            <div class="form-group col-sm-6 px-1 text-left h eq d-none">
                                <label class="control-label font-weight-normal mb-0 d-inline-flex" for="graph-equation"><div class="mendatory_label float-left">{l.equation}</div><div class="mendatory_field"></div></label>
                                <input type="text" class="equation form-control" id="graph-equation" name="equation" placeholder={l.equation} />
                                <div class="text-danger err-msg d-none">{l.fill_warning}</div>
                            </div>
                        </div>
                    </div>
                    <div class="numberline h">
                        <div class="row mx-0">
                            <div class="col-sm-6 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="numberline-width"><div class="mendatory_label float-left">{l.width_label1}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="integer form-control" id="numberline-width" name="width" placeholder={l.graph_width} defaultValue="420" />
                                </div>
                            </div>
                            <div class="col-sm-6 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="numberline-height"><div class="mendatory_label float-left">{l.height_label1}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="integer form-control" id="numberline-height" name="height" placeholder={l.graph_height} defaultValue="250" />
                                </div>
                            </div>
                            <div class="col-sm-6 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="numberline-type"><div class="mendatory_label float-left">{l.type}</div><div class="mendatory_field"></div></label>
                                    <select class="form-select select" id="numberline-type" name="type">
                                        <option value="numberline association">{l.number_line_association}</option>
                                        <option value="numberline plot">{l.numberline_plot}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-6 px-1">
                                <div class="form-group text-left">
                                    <label class="control-label font-weight-normal mb-0 d-inline-flex" for="axis"><div class="mendatory_label float-left">{l.axis_label}</div><div class="mendatory_field"></div></label>
                                    <input type="text" class="form-control" id="axis" name="axis" placeholder="{l.axis_label}" defaultValue="5" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="jscript h p-1">
                        <textarea id="code" class="w-100" name="jscript" style="height: 300px"></textarea>
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
</div>