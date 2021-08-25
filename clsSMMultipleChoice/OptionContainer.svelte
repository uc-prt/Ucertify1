<script>
    import l from '../src/libs/editorLib/language';
    export let letters;
    export let data;
    export let editOption;
    export let correctAnswers;
    export let toggleChecked;
    export let deleteOption;
    export let reviewMode = false;
    export let previewMode = false;
    
    // used for open the parent guid of this guid which created this guid using List Item module when clicked on 'Yes' button of alert label
	function showParentGuid() {
        // url for open the parent guid
        let futureUrl = baseUrl + 'editor/?action=edit&content_guid=' + AI.get('get_parent_guid') + '&no_header=1&react_content=1&no_domain=1';
        // opens the url in new tab with parent guid
        window.open(futureUrl, '_blank');
    }
    

</script>

{#if previewMode}
	{#if (preview_edit == 1) && AI.get('get_parent_guid')}
        <div>
            <section id="warning_label_container" class="w-100">
                <div tabIndex="0" class="alert alert-primary mb-lg " id="open_test_session" role="alert">
                    <div class="row mx-0">
                        <div class="float-left mt"><b>{l.parent_guid_found}</b></div>
                        <div class="float-right ml-lg-auto">
                            <button 
                                tabIndex="0" 
                                id="show_parent_guid" 
                                name="show_parent_guid" 
                                class="btn btn-primary width90" 
                                on:click={showParentGuid}
                            >
                                {l.yes_label}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <div class="mb-xl ml-lg overflow" id="user_answer">
                {#each data as item, i}
                    <span anscounter="0">
                        <section class="answer_container">
                            <label for="pUserans-{letters[i]}" class="option glow">	
                                <div class="span1 float-left">
                                <div class="input-group">
                                        <label for="pUserans-{letters[i]}" access-key={letters[i]} class="d-flex">
                                            <div class="ansoptlabel form-control ansopt" value={letters[i]}>
                                                {letters[i]}
                                            </div>
                                            <div 
                                                tabIndex="0"
                                                class={(reviewMode == true && item.is_correct == 1) ? "ansoptinput input-group-text active":"ansoptinput input-group-text"}
                                            >
                                                <input 
                                                    type = {(correctAnswers <= 1) ? "radio" : "checkbox"} 
                                                    class = "answer_radio" 
                                                    id = "pUserans-{letters[i]}" 
                                                    name = "userans[]"
                                                    value = {letters[i]} 
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    </div>
                                    <div class="printer">
                                        <div class="answer" style="min-height: 21px;">
                                            {item.answer}
                                        </div>
                                    </div>
                            </label>
                        </section>	
                    </span>
                {/each}
            </div>
        </div>
    {:else}
        <div class="mb-xl ml-lg overflow" id="user_answer">
            {#each data as mcqItem, i (mcqItem.id)}
                <span key={mcqItem.id} anscounter="0">
                    <section class="answer_container">
                        <label for="pUserans-{letters[i]}" class="option glow">	
                            <div class="span1 float-left">
                                <div class="input-group">
                                    <label for="pUserans-{letters[i]}" access-key="{letters[i]}" class="d-flex">
                                        <div class="ansoptlabel form-control ansopt" value="{letters[i]}">
                                            {letters[i]}
                                        </div>
                                        <div 
                                            tabIndex="0"
                                            class="{(reviewMode == true && mcqItem.is_correct == 1) ? 'ansoptinput input-group-text active' : 'ansoptinput input-group-text'}"
                                        >
                                            <input 
                                                type="{(correctAnswers <= 1) ? 'radio' : 'checkbox'}"
                                                class="answer_radio" 
                                                id="pUserans-{letters[i]}"
                                                name="userans[]"
                                                value={letters[i]} 
                                            />
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div class="printer">
                                <div class="answer" style="min-height: 21px;">
                                    {@html mcqItem.answer}
                                </div>
                            </div>
                        </label>
                    </section>	
                </span>
            {/each}
        </div>
	{/if}
{:else}
    <div class="mb-xl clear-both ml-lg overflow" id="user_answer">
        {#each data as items, i(items.id)}
            <span key={items.id} anscounter="0">
                <section class="answer_container">
                    <div style="min-height: 46px;" class="option">	
                        <div class="span1 float-left">
                            <div class="input-group">
                                <label access-key={letters[i]} class="d-flex" for="userans-{letters[i]}">
                                    <div class="ansoptlabel form-control ansopt" value={letters[i]}>
                                        {letters[i]}
                                    </div>
                                    <div class="ansoptinput input-group-text" tabIndex="0">
                                        <input 
                                            tabIndex="0" 
                                            type={(correctAnswers < 1)?"radio":"checkbox"} 
                                            on:click={toggleChecked.bind(this, i)} 
                                            checked={(items.is_correct == 1) ? true : false} 
                                            class="answer_radio" 
                                            id="userans-{letters[i]}" 
                                            name="userans[]" 
                                            value={letters[i]} 
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div class="printer">
                            <div class="answer">
                                <div 
                                    id={"option"+i} 
                                    on:blur={editOption.bind(this, i)} 
                                    class="ebook_item_text auth-editor pt-2"
                                >
                                    {@html items.answer}
                                </div>
                            </div>
                        </div>
                        <div 
                            on:click={deleteOption.bind(this, i)} 
                            class="float-right delete_element mr-1 position-relative"
                            style="bottom:32px;" 
                            tabindex="0"
                        >
                            <i class="icomoon-new-24px-delete-1 s3"></i>
                        </div>
                    </div>
                </section>	
            </span>
        {/each}
    </div>
{/if}