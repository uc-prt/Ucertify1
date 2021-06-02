<script>
    export let jsondataCategory;
    export let objValues;
    export let state;
    export let correct_ans_bg = '';
    export let your_ans_class = '';
    export let user_ans_table;
</script>
{#if jsondataCategory}
    <table class="table" id="alignmatch-table">
        <tbody>
            <tr class="remedcolumn height50">
                {#each jsondataCategory.categories as obj}
                    <td key={obj.text + '_' + obj.id} class="steel-bg">
                        <h3 tabindex="0" class="m-0 font-italic">{obj.text}</h3>
                    </td>
                {/each}
            </tr>
            {#each objValues as rowTagWise, i}
                <tr key={i} class="{correct_ans_bg} remedcolumn row_{i + 1}">
                    {#if rowTagWise }
                        {#each rowTagWise as col, ind}
                            <td key={ind} col={col.id} class='position-relative {your_ans_class} align-middle column_{ind + 1}'>
                                {#if user_ans_table == 1}
                                    {#if col.imagealt && col.imageurl && state.userAnswerArr[col.tags][ind].imageurl != ''}
                                        <img
                                            class="imagData"
                                            src="//s3.amazonaws.com/jigyaasa_content_static//{state.userAnswerArr[col.tags][ind].imageurl}"
                                            tabindex="0"
                                            alt="{col.imagealt}"
                                            title="{col.imagealt}"
                                        />
                                    {:else if col.label != ''}
                                        <div
                                            class="elementText"
                                            tabindex="0"
                                            title="{col.label}"
                                        >{ @html state.userAnswerArr[col.tags][ind].label }</div>
                                    {/if}
                                {:else}
                                    {#if col.imagealt && col.imageurl && col.imageurl != ''}
                                        <div>
                                            <img
                                                class="imagData"
                                                src="//s3.amazonaws.com/jigyaasa_content_static//{col.imageurl}"
                                                tabindex="0"
                                                alt="{col.imagealt}"
                                                title="{col.imagealt}"
                                            />
                                        </div>
                                    {:else if col.label != ''}
                                        <div
                                            class="elementText"
                                            tabindex="0"
                                            title={col.label}
                                        >{ @html col.label }</div>
                                    {/if}
                                {/if}
                            </td>
                        {/each}
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>
{/if}