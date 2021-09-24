<!--
 *  File Name   : ModalEvent.svelte
 *  Description : Responsible for ModalEvent
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (authoring)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    import l from '../../../src/libs/editorLib/language.js';
</script>
<div>
    <div class="row-fluid events" style="height: 221px;">
        <div class="list-group">
            <a for="onclick" class="list-group-item active" href={"javascript:;"}>{l.on_click}</a>
            <a for="ondblclick" class="list-group-item" href={"javascript:;"}>{l.on_dbl_click}</a>
            <a for="oncontextmenu" class="list-group-item" href={"javascript:;"}>{l.on_context}</a>
            <a for="ondragstart" class="list-group-item" href={"javascript:;"}>{l.on_drag_start}</a>
            <a for="ondrag" class="list-group-item" href={"javascript:;"}>{l.on_drag}</a>
            <a for="ondragend" class="list-group-item" href={"javascript:;"}>{l.on_drag_end}</a>
            <a for="ondrop" class="list-group-item" href={"javascript:;"}>{l.on_drop}</a>
            <a for="onmouseover" class="list-group-item" href={"javascript:;"}>{l.on_mouse_over}</a>
            <a for="onmouseup" class="list-group-item" href={"javascript:;"}>{l.on_mouse_up}</a>
            <a for="onmousedown" class="list-group-item" href={"javascript:;"}>{l.on_mouse_down}</a>
            <a for="onchange" class="list-group-item" href={"javascript:;"}>{l.on_change}</a>
            <a for="onfocus" class="list-group-item" href={"javascript:;"}>{l.on_focus}</a>
            <a for="onblur" class="list-group-item" href={"javascript:;"}>{l.on_blur}</a>
            <a for="onkeyup" class="list-group-item" href={"javascript:;"}>{l.on_key_up}</a>
            <a for="onkeypress" class="list-group-item" href={"javascript:;"}>{l.on_key_press}</a>
            <a for="onkeydown" class="list-group-item" href={"javascript:;"}>{l.on_key_down}</a>
        </div>
    </div>
    <div class="clearboth mb-3"></div>
    <div class="row-fluid margin-top1 event-input">
        <input type="text" id="onclick" class="form-control form-control-md show w-100 border rounded" name="onclick" placeholder="{l.func_for + l.on_click}"/>
        <input type="text" id="ondblclick" class="form-control form-control-md h w-100 border rounded" name="ondblclick" placeholder="{l.func_for + l.on_dbl_click}"/>
        <input type="text" id="oncontextmenu" class="form-control form-control-md h w-100 border rounded" name="oncontextmenu" placeholder="{l.func_for + l.on_context}"/>
        <input type="text" id="ondragstart" class="form-control form-control-md h w-100 border rounded" name="ondragstart" placeholder="{l.func_for + l.on_drag_start}"/>
        <input type="text" id="ondrag" class="form-control form-control-md h w-100 border rounded" name="ondrag" placeholder="{l.func_for + l.on_drag}"/>
        <input type="text" id="ondragend" class="form-control form-control-md h w-100 border rounded" name="ondragend" placeholder="{l.func_for + l.on_drag_end}"/>
        <input type="text" id="ondrop" class="form-control form-control-md h w-100 border rounded" name="ondrop" placeholder="{l.func_for + l.on_drop}"/>
        <input type="text" id="onmouseover" class="form-control form-control-md h w-100 border rounded" name="onmouseover" placeholder="{l.func_for + l.on_mouse_over}"/>
        <input type="text" id="onmouseup" class="form-control form-control-md h w-100 border rounded" name="onmouseup" placeholder="{l.func_for + l.on_mouse_up}"/>
        <input type="text" id="onmousedown" class="form-control form-control-md h w-100 border rounded" name="onmousedown" placeholder="{l.func_for + l.on_mouse_down}"/>
        <input type="text" id="onchange" class="form-control form-control-md h w-100 border rounded" name="onchange" placeholder="{l.func_for + l.on_change}"/>
        <input type="text" id="onfocus" class="form-control form-control-md h w-100 border rounded" name="onfocus" placeholder="{l.func_for + l.on_focus}"/>
        <input type="text" id="onblur" class="form-control form-control-md h w-100 border rounded" name="onblur" placeholder="{l.func_for + l.on_blur}"/>
        <input type="text" id="onkeyup" class="form-control form-control-md h w-100 border rounded" name="onkeyup" placeholder="{l.func_for + l.on_key_up}"/>
        <input type="text" id="onkeypress" class="form-control form-control-md h w-100 border rounded" name="onkeypress" placeholder="{l.func_for + l.on_key_press}"/>
        <input type="text" id="onkeydown" class="form-control form-control-md h w-100 border rounded" name="onkeydown" placeholder="{l.func_for + l.on_key_down}"/>
    </div>
</div>
		