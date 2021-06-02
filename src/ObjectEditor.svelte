<script>
    import { beforeUpdate, onMount } from "svelte";
    export let editorState;
    export let didMount;
    let activated;
    let ajaxData = {};
	let state = {
            error: false,
            cText: {},
        };
        
    onMount(()=> {
        if (editorState.ajaxData) {
            ajaxData = editorState.ajaxData;
        } else {
            ajaxData = {
                'content_type' : 'f',
                'content_subtype': 52,
                'content_icon': 0,
                'content_text': {
                    "name": "",
                    "display_image": "",
                    "zipfile": "",
                    "preview_image": "",
                    "about": "",
                    "light": true,
                    "rotationX": "0",
                    "rotationY": "Math.PI / -2",
                    "positionX": "0",
                    "positionY": "0",
                    "positionZ": "0",
                    "scale": "45",
                    "point_light": "2"
                },
            };
        }
        state.cText = ajaxData.content_text;
    });

    function handleChange(index, event) {
        state.cText[index] = event.target.value; 
    }

    function enableSave() {
        if (!AI.get('save_item')) {
            AI.set('save_item', true);
        }
    }

    function handleBlur(index, event) {
        ajaxData['content_text'] = state.cText;
        enableSave();
        editorState.ajaxData = ajaxData;
    }
</script>

<div key="3d_object" style="width: 98%;" use:didMount={activated}>
    <h1>{"3D Object"}</h1>
    {#each Object.keys(state.cText) as index, i}
         <div class="row form-group">
            <div class="col-sm-2">
                <label for={index}>{index}</label>
            </div>
            <div class="col-sm-10">
                <input 
                    type="text" 
                    id={index} 
                    on:change={handleChange.bind(this, index)}
                    on:blur = {handleBlur.bind(this, index)}
                    class={"inputBox form-control"} 
                    value={state.cText[index]} 
                />
            </div>
        </div>
    {/each}
</div>