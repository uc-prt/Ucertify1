<script>
    import { createEventDispatcher } from 'svelte';
    export let label, classVal, name, id, value, min, max, key, disabledValue, funcChange, funcBlur, inputText, inputRange, defaultValue, step;
    const dispatch = createEventDispatcher();

    function preventNonNumericalInput(e) {
        e = e || window.event;
        var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
        var charStr = String.fromCharCode(charCode);

        if (!charStr.match(/^[0-9]+$/)) {
            e.preventDefault();
        }
    }
</script>
{#if inputText == 1}
    <input
        id={id}
        type="text"
        name="slider_title"
        class="sm_input_text slidertitle mb-3 form-control {classVal}"
        value={value}
        aria-label="Title"
        placeholder="Title"
        on:change={(e)=>dispatch('updateXmlValue', {index: key, func: funcChange, value: e})}
    />
{:else if inputRange == 1}
    <input
        id={id}
        type="range"
        name="sliderrange"
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        class="slideritem"
        aria-label="Range"
        on:input={(e)=>dispatch('updateXmlValue', {index: key, func: funcChange, value: e})}
        value={value}
        disabled={disabledValue}
    />
{:else}
<div class="float-start mb-2 pr-2 width100">
    <label for={id} class="pr-1 mb-0">{label} </label>
    <input
        class="sm_input_text sm-num {classVal} mt-0"
        type="number"
        name="{name}"
        id={id}
        value={value}
        on:change={(e)=>dispatch('updateXmlValue', {index: key, func: funcChange, value: e})}
        min={min}
        max={max}
        on:blur={(e)=>dispatch('updateXmlValue', {index: key, func: funcBlur, value: e})}
        on:keypress="{preventNonNumericalInput}"
        disabled={disabledValue}
    />
</div>
{/if}