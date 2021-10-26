<script>
    import l from './editorLib/language';
    import { beforeUpdate, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { AH } from '../../helper/HelperAI.svelte';
    export let spanId;
    export let divId;
    export let action;
    export let show;
    
    let state = {};
    let type;
    $: type = "1";
    let hdd = writable({
        spanId: 0,
        divId: 'elem0'
    });

    const unsubscribe = hdd.subscribe((items)=> {
        state = items;
    })

    beforeUpdate(()=> {
        state.spanId = spanId
        state.divId = divId
    })

    onMount(()=> {
        state.spanId = spanId;
        state.divId = divId;
    })    

    function latexInput(latexValue) {  
        let fill = action;
        fill.innerFields[spanId].write(latexValue);
        fill.innerFields[spanId].focus();
        AH.trigger("#fillmain", 'change');
    }

    function input(valueOne) {
        let fill = action;
        fill.innerFields[spanId].cmd(valueOne);
        fill.innerFields[spanId].focus();
        AH.trigger("#fillmain", 'change');
    }

    function cursorEvent(eventTriger) {
       // let customKeyDownEvent = $.Event('keydown');
       let customeKeyDownEvent = new Event('keydown');
        customKeyDownEvent.bubbles = true;
        customKeyDownEvent.cancelable = true;

        if (eventTriger == 'cursorFor') {
            customKeyDownEvent.which = 39;  
        } else if (eventTriger == 'cursorBack') {
            customKeyDownEvent.which = 37;   
        } else if(eventTriger == 'backspace') {
            customKeyDownEvent.which = 8;	
        }

        AH.selectAll('#'+divId+' .mq-editable-field')[spanId].dispatchEvent(customKeyDownEvent);
        AH.trigger("#fillmain", 'change');
    }

    function closeToolbar() {
        show(false);
    }
</script>
<div class="toolbar_container_one" id="toolbar_container_one">
    <div class="upper_part_toolbar">
        <div class="draggable_area" on:click={closeToolbar}>
            <div class="dots_container">
                <span class="dots"></span>
                <span class="dots"></span>
                <span class="dots"></span>
                <span class="dots"></span>
            </div>
                <button type="button" class="icomoon-24px-incorrect-2 close_toolbar"></button>
        </div>
    </div>
    <div class="toolbar_types_area">
        <div class="select_area">
            <select name="basic_select" id="selectbox" bind:value={type} class="option_selectbox">
                <option value="1">{l.Allsymbols}</option>
                <option value="2" selected="selected">{l.Basic}</option>
                <option value="3">{l.xvariables}</option>
                <option value="4">&lt;</option>
                <option value="5">&ang;</option>
                <option value="6">&#8898;</option>
                <option value="7">{l.sin}</option>
                <option value="8">&alpha;</option>
                <option value="9">{l.Mis}c</option>
                <option value="10">{l.Discrete}</option>
                <option value="11">{l.kg}</option>
                <option value="12">{l.lb}</option>
                <option value="13">{l.brackets}</option>
                <option value="14">&Delta;</option>
                <option value="15">{l.chem}</option>
            </select>
        </div>
        <div class="show_text_area"></div>
    </div>
    <div class="lower_part_toolbar">
        <div class="btn-group button_designs font_changer">
            <div class="column_one columns_design">
                    <button type="button" class="first_btn bborder_remover orange_container" on:click={latexInput.bind(this, 7)}>7</button>
                    <button type="button" class="scnd_btn orange_container" on:click={latexInput.bind(this, 4)}>4</button>
                    <button type="button" class="thrd_btn bborder_remover orange_container" on:click={latexInput.bind(this, 1)}>1</button>
                    <button type="button" class="fourth_btn orange_container" on:click={latexInput.bind(this, 0)}>0</button>
                    <button type="button" class="fifth_btn bborder_remover light_purpl_container" on:click={cursorEvent.bind(this, "cursorBack")}>
                    <span><i class="icomoon-arrow-left"></i></span>
                </button>
            </div>
            <div class="column_two columns_design">
                    <button type="button" class="first_btn bborder_remover orange_container" on:click={latexInput.bind(this, 8)}>8</button>
                    <button type="button" class="scnd_btn orange_container" on:click={latexInput.bind(this, 5)}>5</button>
                    <button type="button" class="thrd_btn bborder_remover orange_container" on:click={latexInput.bind(this, 2)}>2</button>
                    <button type="button" class="fourth_btn orange_container" on:click={input.bind(this, ".")}>.</button>
                    <button type="button" class="fifth_btn bborder_remover light_purpl_container" on:click={cursorEvent.bind(this, "cursorFor")}>
                    <span><i class="icomoon-arrow-right-2"></i></span>
                </button>
            </div>
            <div class="column_three columns_design">
                    <button type="button" class="first_btn bborder_remover orange_container" on:click={latexInput.bind(this,9)}>9</button>
                    <button type="button" class="scnd_btn orange_container" on:click={latexInput.bind(this, 6)}>6</button>
                    <button type="button" class="thrd_btn bborder_remover orange_container" on:click={latexInput.bind(this, 3)}>3</button>
                    <button type="button" class="fourth_btn orange_container" on:click={input.bind(this, ",")}>,</button>
                    <button type="button" class="fifth_btn bborder_remover light_purpl_container" on:click={cursorEvent.bind(this, "backspace")}>
                    <span><i class=" icomoon-backspace-2"></i></span>
                </button>
            </div>
            <div class="column_four columns_design">
                    <button type="button" class="first_btn bborder_remover hovr_btn" on:click={input.bind(this, "\\div")}>&#247;</button>
                    <button type="button" class="scnd_btn hovr_btn" on:click={input.bind(this, "×")}>&times;</button>
                    <button type="button" class="thrd_btn bborder_remover hovr_btn" on:click={input.bind(this,"-")}>-</button>
                    <button type="button" class="fourth_btn hovr_btn" on:click={input.bind(this,"+")}>+</button>
                    <button type="button" class="fifth_btn bborder_remover hovr_btn" on:click={input.bind(this,"=")}>=</button>
            </div>
        </div>
        {#if type == "1"}
            <div class="button_designs select_changer height_modifier" id="select_butns_1">
                <div class="column_five dec_widther blue_container columns_design">
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"x")}>
                        <div class="xvariable"></div>
                    </div>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"b")}>b</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther bborder_adder blue_container" on:click={latexInput.bind(this,"\\text{abc}")}>abc</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this, "$")}>$</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"\\div")}>&#247;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"&ge;")}>&ge;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\perp")}>&perp;</button>
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\nless")}>
                        <div class="not-lesser"></div>
                    </div>
                    <div class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\left[\\right)")}>
                        <div class="rec-brackets"></div>
                    </div>
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"x")}>
                        <div class="xvariable"></div>
                    </div>
                    <div class="scnd_btn dec_widther blue_container padder_btn" on:click={input.bind(this,"/")}>
                        <div class="xfraction"></div>
                    </div>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\lt")}>&lt;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"\pi")}>&pi;</button>
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"y")}>
                        <div class="yvariable"></div>
                    </div>
                    <div class="scnd_btn dec_widther blue_container padder_btn" on:click={input.bind(this,"/")}>
                        <div class="x-times-fraction"></div>
                    </div>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\gt")}>></button>
                    <div class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"\infin")}>
                        <div class="infinity"></div>
                    </div>
                    <div class="first_btn bborder_remover dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\^{2}")}>
                        <div class="xsquare"></div>
                    </div>
                    <div class="scnd_btn dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\^{}")}>
                        <div class="xpower"></div>
                    </div>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"±")}>&plusmn;</button>
                    <div class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\left(\\right)")}>
                        <div class="brackets"></div>
                    </div>
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\sqrt")}>
                        <div class="square-root"></div>
                    </div>
                    <div class="fourth_btn dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\sqrt[]{}")}>
                        <div class="square-root-two"></div>
                    </div>
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"|")}>
                        <div class="modulus"></div>
                    </div>
                    <div class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\left[\\right]")}>
                        <div class="square-brackets"></div>
                    </div>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"a")}>a</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"\\vert")}>|</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\lceil")}>&lceil;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\wedge")}>&and;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\forall")}>&forall;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{mi}")}>mi</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{gal}")}>gal</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"f")}>f</button>
                    <div class="first_btn bborder_remover dec_widther padder_remover blue_container" on:click={latexInput.bind(this,"\\int_{ }^{ }")}>
                        <div class="integrtion"></div>
                    </div>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\Delta")}>&Delta;</button>
                    <div class="first_btn bborder_remover dec_widther blue_container padder_btn" on:click={latexInput.bind(this,"\\sum_{ }^{ }")}>
                        <div class="sigma"></div>
                    </div>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\rightleftharpoons")}>&#8652;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\prime")}>'</button>
                        <button type="button" class="scnd_btn dec_widther bborder_remover blue_container" on:click={latexInput.bind(this,"\\text{&micro;g}")}>&micro;g</button>
                </div>
                <div class="column_six dec_widther blue_container columns_design">
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"y")}>
                        <div class="yvariable"></div>
                    </div>
                    <div class="scnd_btn dec_widther blue_container padder_btn" on:click={input.bind(this,"/")}>
                        <div class="x-times-fraction"></div>
                    </div>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\gt")}>></button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\degree")}>&deg;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\pi")}>&pi;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"&ne;")}>&ne;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\lt")}>&lt;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"&le;")}>&le;</button>
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\ngtr")}>
                        <div class="not-greater"></div>
                    </div>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"&asymp;")}>&asymp;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\gt")}>></button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"&ge;")}>&ge;</button>
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\nless")}>
                        <div class="not-lesser"></div>
                    </div>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\perp")}>&perp;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\angle")}>&ang;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\triangle")}>&Delta;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\degree")}>&deg;</button>
                    <div class="fourth_btn dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\\overline{ }")}>
                        <div class="bar-block"></div>
                    </div>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\parallel")}>&#8741;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\measuredangle")}>m&ang;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container bborder_adder" on:click={input.bind(this,"\circledot")}>&#8857;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"&prime;")}>&prime;</button>
                    <div class="fourth_btn dec_widther padder_remover blue_container" on:click={latexInput.bind(this,"\\\overrightarrow{ }")}>
                        <div class="topbar-arrow"></div>
                    </div>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\nparallel")}>&#8742;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"\\sim")}>&sim;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\parallelogram")}>&#9649;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"&prime;")}>&Prime;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther padder_remover blue_container" on:click={latexInput.bind(this,"\\ldots")}>&#8943;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container blue_container padder_less" on:click={latexInput.bind(this,"\\ddots")}>&#8945;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\cong")}>&cong;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\vdots")}>&#8942;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"&pi;")}>&pi;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"\\square")}>&#9633;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\propto")}>&prop;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\rfloor")}>&rfloor;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\equiv")}>&equiv;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"\\exists")}>&exist;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{mg}")}>mg</button>
                        <button type="button" class="scnd_btn dec_widther bborder_remover blue_container" on:click={latexInput.bind(this,"\\text{cm}")}>cm</button>
                </div>
                <div class="column_seven dec_widther blue_container columns_design">
                    <div class="first_btn bborder_remover dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\^{2}")}>
                        <div class="xsquare"></div>
                    </div>
                    <div class="scnd_btn dec_widther blue_container padder_remover" on:click={latexInput.bind(this,"\\^{}")}>
                        <div class="xpower"></div>
                    </div>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"±")}>&plusmn;</button>
                    <div class="fourth_btn dec_widther blue_container padder_less" on:click={input.bind(this,":")}>
                        <div class="colon"></div>
                    </div>
                    <div class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\infin")}>
                        <div class="infinity"></div>
                    </div>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\subset")}>&sub;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\in")}>&#8714;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"\\cup")}>&cup;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,",")}>,</button>
                    <div class="fourth_btn dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\left(\\right)")}>
                        <div class="brackets"></div>
                    </div>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\supset")}>&sup;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"\\notin")}>&notin;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\cap")}>&cap;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,":")}>:</button>
                    <div class="first_btn bborder_remover dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\left\\{\\right\\}")}>
                        <div class="curly-brackets"></div>
                    </div>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\subseteq")}>&sube;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\ni")}>&#8717;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"\\varnothing")}>&empty;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"!")}>!</button>
                    <div class="fourth_btn dec_widther padder_less blue_container" on:click={latexInput.bind(this,"\\left[\\right)")}>
                        <div class="rec-brackets"></div>
                    </div>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\sec^{-1}")}>sec<sup>-1</sup></button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\csc^{-1}")}>csc<sup>-1</sup></button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\cot^{-1}")}>cot<sup>-1</sup></button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\sin")}>sin</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\cos")}>cos</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\tan")}>tan</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\sec^{-1}")}>sec<sup>-1</sup></button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\csc^{-1}")}>csc<sup>-1</sup></button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\cot^{-1}")}>cot<sup>-1</sup></button>	
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"b")}>b</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\cdot")}>.</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{lb}")}>lb</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{ft}")}>ft</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{pt}")}>pt</button>
                    <div class="first_btn bborder_remover dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\^{}")}>
                        <div class="h-sup"></div>
                    </div>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"\\rightarrow")}>&rarr;</button>
                    <div class="thrd_btn bborder_remover dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\xrightarrow[]\\{}")}>
                        <div class="x-power-y"></div>
                    </div>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{g}\ \\text{mol}^{-1}")}>g mol<sup>-1</sup></button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\partial")}>&part;</button>
                </div>
                <div class="column_eight dec_widther columns_design blue_container">
                    <div class="first_btn bborder_remover dec_widther blue_container padder_field" on:click={input.bind(this,"\\sqrt")}>
                        <div class="square-root"></div>
                    </div>
                    <div class="scnd_btn dec_widther blue_container padder_less" on:click={latexInput.bind(this,"\\_{}")}>
                        <div class="xsubscript"></div>
                    </div>
                    <div class="thrd_btn bborder_remover dec_widther blue_container padder_less" on:click={latexInput.bind(this,"$")}>
                        <div class="dollar"></div>
                    </div>
                    <div class="fourth_btn dec_widther blue_container padder_field" on:click={latexInput.bind(this,"\\left(\\right)")}>
                        <div class="brackets"></div>
                    </div>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\sec")}>sec</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\csc")}>csc</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\cot")}>cot</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\sin^{-1}")}>sin<sup>-1</sup></button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\cos^{-1}")}>cos<sup>-1</sup></button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\tan^{-1}")}>tan<sup>-1</sup></button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\alpha")}>&alpha;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"\\theta")}>&theta;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\Theta")}>&Theta;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"\\tau")}>&zeta;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\gamma")}>&gamma;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"\\sigma")}>&sigma;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\Sigma")}>&Sigma;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\varepsilon")}>&epsilon;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\Delta")}>&delta;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\Delta")}>&Delta;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\lambda")}>&lambda;</button>
                        <button type="button" class="fourth_btn dec_widther blue_container" on:click={input.bind(this,"\\beta")}>&beta;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\pi")}>&pi;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\Pi")}>&Pi;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\phi")}>&empty;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\lfloor")}>&lfloor;</button>
                        <button type="button" class="thrd_btn bborder_remover dec_widther blue_container" on:click={input.bind(this,"\\uparrow")}>&uarr;</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={input.bind(this,"\\neg")}>&not;</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{oz}")}>oz</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{in}")}>in</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{fl oz}")}>fl oz</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{g}")}>g</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{m}")}>m</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{L}")}>L</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{s}")}>s</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{kg}")}>kg</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{km}")}>km</button>
                        <button type="button" class="scnd_btn dec_widther blue_container" on:click={latexInput.bind(this,"\\text{mL}")}>mL</button>
                        <button type="button" class="first_btn bborder_remover dec_widther blue_container" on:click={latexInput.bind(this,"\\text{ms}")}>ms</button>
                </div>
            </div>
        {/if}
        {#if type == "2"}
        <div class="button_designs select_changer" id="select_butns_2">
            <div class="column_five blue_container columns_design">
                <div class="first_btn bborder_remover blue_container" on:click={latexInput.bind(this,"x")}>
                    <div class="xvariable"></div>
                </div>
                <div class="blue_container scnd_btn padder_btn" on:click={input.bind(this,"/")}>
                    <div class="xfraction"></div>
                </div>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\lt")}>&lt;</button>
                    <button type="button" class="blue_container fourth_btn" on:click={input.bind(this,"%")}>%</button>
                <div class="blue_container fifth_btn bborder_remover padder_less" on:click={input.bind(this,"|")}>
                    <div class="modulus"></div>
                </div>
            </div>
            <div class="column_six blue_container columns_design">
                <div class="first_btn bborder_remover blue_container" on:click={latexInput.bind(this,"y")}>
                    <div class="yvariable"></div>
                </div>
                <div class="scnd_btn padder_btn blue_container" on:click={input.bind(this,"/")}>
                    <div class="x-times-fraction"></div>
                </div>
                    <button type="button" class="thrd_btn bborder_remover blue_container" on:click={input.bind(this,"\gt")}>&gt;</button>
                    <button type="button" class="fourth_btn blue_container" on:click={latexInput.bind(this,"\\degree")}>&deg;</button>
                    <button type="button" class="fifth_btn bborder_remover blue_container" on:click={input.bind(this,"\pi")}>&pi;</button>
            </div>
            <div class="column_seven blue_container columns_design">
                <div class="blue_container first_btn bborder_remover padder_less" on:click={latexInput.bind(this,"\\^{2}")}>
                    <div class="xsquare"></div>
                </div>
                <div class="blue_container scnd_btn padder_remover" on:click={latexInput.bind(this,"\\^{}")}>
                    <div class="xpower"></div>
                </div>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"±")}>&plusmn;</button>
                <div class="blue_container fourth_btn padder_less" on:click={input.bind(this,":")}>
                    <div class="colon"></div>
                </div>
                <div class="blue_container fifth_btn bborder_remover" on:click={input.bind(this,"\infin")}>
                    <div class="infinity"></div>
                </div>
            </div>
            <div class="column_eight columns_design">
                <div class="blue_container first_btn bborder_remover blue_container padder_field" on:click={input.bind(this,"\\sqrt")}>
                    <div class="square-root"></div>
                </div>
                <div class="blue_container scnd_btn blue_container padder_less" on:click={latexInput.bind(this,"\\_{}")}>
                    <div class="xsubscript"></div>
                </div>
                <div class="blue_container thrd_btn bborder_remover blue_container padder_less" on:click={latexInput.bind(this,"$")}>
                    <div class="dollar"></div>
                </div>
                <div class="blue_container fourth_btn blue_container padder_field" on:click={latexInput.bind(this,"\\left(\\right)")}>
                    <div class="brackets"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "3"}
        <div class="btn-group button_designs select_changer" id="select_butns_3">
            <div class="column_five blue_container columns_design">
                <div class="blue_container first_btn bborder_remover" on:click={input.bind(this,"x")}>
                    <div class="xvariable"></div>
                </div>
                <div class="blue_container scnd_btn padder_btn" on:click={input.bind(this,"/")}>
                    <div class="xfraction"></div>
                </div>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\lt")}>&lt;</button>
                    <button type="button" class="blue_container fourth_btn" on:click={input.bind(this,"\pi")}>&pi;</button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_six blue_container columns_design">
                <div class="blue_container first_btn bborder_remover" on:click={input.bind(this,"y")}>
                    <div class="yvariable"></div>
                </div>
                <div class="blue_container scnd_btn padder_btn" on:click={input.bind(this,"/")}>
                    <div class="x-times-fraction"></div>
                </div>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\gt")}>&gt;</button>
                <div class="blue_container fourth_btn" on:click={input.bind(this,"\infin")}>
                    <div class="infinity"></div>
                </div>
                <div class="fifth_btn bborder_remover blank_color rborder_remover"></div>
            </div>
            <div class="column_seven blue_container columns_design">
                <div class="blue_container first_btn bborder_remover padder_less" on:click={latexInput.bind(this,"\\^{2}")}>
                    <div class="xsquare"></div>
                </div>
                <div class="blue_container scnd_btn padder_less" on:click={latexInput.bind(this,"\\^{}")}>
                    <div class="xpower"></div>
                </div>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"±")}>&plusmn;</button>
                <div class="blue_container fourth_btn padder_less" on:click={latexInput.bind(this,"\\left(\\right)")}>
                    <div class="brackets"></div>
                </div>
                <div class="fifth_btn bborder_remover blank_color rborder_remover"></div>
            </div>
            <div class="column_eight columns_design">
                <div class="first_btn bborder_remover blue_container padder_field" on:click={input.bind(this,"\\sqrt")}>
                    <div class="square-root"></div>
                </div>
                <div class="scnd_btn blue_container padder_remover" on:click={latexInput.bind(this,"\\sqrt[]{}")}>
                    <div class="square-root-two"></div>
                </div>
                <div class="thrd_btn bborder_remover blue_container padder_less" on:click={input.bind(this,"|")}>
                    <div class="modulus"></div>
                </div>
                <div class="fourth_btn blue_container padder_less" on:click={latexInput.bind(this,"\\left[\\right]")}>
                    <div class="square-brackets"></div>
                </div>
                <div class="fifth_btn bborder_remover blank_color"></div>
            </div>
        </div>
        {/if}
        {#if type == "4"}
        <div class="btn-group button_designs select_changer" id="select_butns_4">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={input.bind(this,"&ne;")}>&ne;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\lt")}>&lt;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"&le;")}>&le;</button>
                <div class="blue_container fourth_btn" on:click={latexInput.bind(this,"\\ngtr")}>
                    <div class="not-greater"></div>
                </div>
                <div class="fifth_btn bborder_remover rborder_remover blank_color"></div>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={input.bind(this,"&asymp;")}>&asymp;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\gt")}>&gt;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"&ge;")}>&ge;</button>
                <div class="blue_container fourth_btn" on:click={latexInput.bind(this,"\\nless")}>
                    <div class="not-lesser"></div>
                </div>
                <div class="fifth_btn bborder_remover blank_color"></div>
            </div>
            <div class="remove_border"></div>
        </div>
        {/if}
        {#if type == "5"}
        <div class="btn-group button_designs select_changer" id="select_butns_5">
            <div class="column_five blue_container columns_design">
                <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\perp")}>&perp;</button>
                <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\angle")}>&ang;</button>
                <button type="button" class="blue_container thrd_btn bborder_remover" on:click={latexInput.bind(this,"\\triangle")}>&Delta;</button>
                <button type="button" class="blue_container fourth_btn" on:click={latexInput.bind(this,"\\degree")}>&deg;</button>
                <div class="blue_container fifth_btn bborder_remover padder_less" on:click={latexInput.bind(this,"\\\overline{ }")}>
                    <div class="bar-block"></div>
                </div>
            </div>
            <div class="column_six blue_container columns_design">
                <button type="button" class="blue_container first_btn bborder_remover" on:click={input.bind(this,"\parallel")}>&#8741;</button>
                <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\measuredangle")}>m&ang;</button>
                <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\circledot")}>&#8857;</button>
                <button type="button" class="blue_container fourth_btn" on:click={input.bind(this,"&prime;")}>&prime;</button>
                <div class="blue_container fifth_btn bborder_remover padder_remover" on:click={latexInput.bind(this,"\\\overrightarrow{ }")}>
                    <div class="topbar-arrow"></div>
                </div>
            </div>
            <div class="column_seven blue_container columns_design">
                <button type="button" class="blue_container first_btn bborder_remover" on:click={input.bind(this,"\\nparallel")}>&#8742;</button>
                <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\sim")}>&sim;</button>
                <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\\parallelogram")}>&#9649;</button>
                <button type="button" class="blue_container fourth_btn" on:click={input.bind(this,"&prime;")}>&Prime;</button>
                <button type="button" class="blue_container fifth_btn bborder_remover padder_remover" on:click={latexInput.bind(this,"\\ldots")}>&#8943;</button>
            </div>
            <div class="column_eight columns_design">
                <button type="button" class="first_btn bborder_remover blue_container padder_less" on:click={latexInput.bind(this,"\\ddots")}>&#8945;</button>
                <button type="button" class="scnd_btn blue_container" on:click={input.bind(this,"\\cong")}>&cong;</button>
                <button type="button" class="thrd_btn bborder_remover blue_container" on:click={latexInput.bind(this,"\\vdots")}>&#8942;</button>
                <button type="button" class="fourth_btn blue_container" on:click={input.bind(this,"&pi;")}>&pi;</button>
                <button type="button" class="fifth_btn bborder_remover blue_container" on:click={input.bind(this,"\\square")}>&#9633;</button>
            </div>
        </div>
        {/if}
        {#if type == "6"}
        <div class="button_designs select_changer" id="select_butns_6">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\subset")}>&sub;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\in")}>&#8714;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\\cup")}>&cup;</button>
                    <button type="button" class="blue_container fourth_btn" on:click={input.bind(this,",")}>,</button>
                <div class="blue_container fifth_btn bborder_remover padder_less" on:click={latexInput.bind(this,"\\left(\\right)")}>
                    <div class="brackets"></div>
                </div>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\supset")}>&sup;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\notin")}>&notin;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\\cap")}>&cap;</button>
                    <button type="button" class="blue_container fourth_btn" on:click={latexInput.bind(this,":")}>:</button>
                <div class="blue_container fifth_btn bborder_remover padder_less" on:click={latexInput.bind(this,"\\left\\{\\right\\}")}>
                    <div class="curly-brackets"></div>
                </div>
            </div>
            <div class="column_seven blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\subseteq")}>&sube;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\ni")}>&#8717;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\\varnothing")}>&empty;</button>
                    <button type="button" class="blue_container fourth_btn" on:click={input.bind(this,"!")}>!</button>
                <div class="blue_container fifth_btn bborder_remover padder_less" on:click={latexInput.bind(this,"\\left[\\right)")}>
                    <div class="rec-brackets"></div>
                </div>
            </div>
            <div class="column_eight columns_design">
                    <button type="button" class="first_btn bborder_remover blue_container" on:click={input.bind(this,"\\supseteq")}>&supe;</button>
                    <button type="button" class="scnd_btn blue_container" on:click={latexInput.bind(this,"\\not\subset")}>&nsub;</button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fourth_btn blue_container" on:click={latexInput.bind(this,"\\backslash")}>\</button>
                <div class="thrd_btn bborder_remover blue_container padder_less" on:click={latexInput.bind(this,"\\left(\\right]")}>
                    <div class="opp-recbrackets"></div>
                </div>
            </div>
        </div>
        {/if}
        {#if type == "7"}
        <div class="button_designs select_changer" id="select_butns_7">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\sin")}>sin</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\cos")}>cos</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={latexInput.bind(this,"\\tan")}>tan</button>
                    <button type="button" class="fourth_btn blank_color bborder_remover rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\sec")}>sec</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\csc")}>csc</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\cot")}>cot</button>
                    <button type="button" class="fourth_btn blank_color bborder_remover rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\sin^{-1}")}>sin<sup>-1</sup></button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\cos^{-1}")}>cos<sup>-1</sup></button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={latexInput.bind(this,"\\tan^{-1}")}>tan<sup>-1</sup></button>
                    <button type="button" class="fourth_btn blank_color bborder_remover rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_eight columns_design">
                    <button type="button" class="first_btn bborder_remover blue_container" on:click={latexInput.bind(this,"\\sec^{-1}")}>sec<sup>-1</sup></button>
                    <button type="button" class="scnd_btn blue_container" on:click={latexInput.bind(this,"\\csc^{-1}")}>csc<sup>-1</sup></button>
                    <button type="button" class="thrd_btn bborder_remover blue_container" on:click={latexInput.bind(this,"\\cot^{-1}")}>cot<sup>-1</sup></button>
                    <button type="button" class="fourth_btn blue_container bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "8"}
        <div class="button_designs select_changer" id="select_butns_8">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\alpha")}>&alpha;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\theta")}>&theta;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\Theta")}>&Theta;</button>
                    <button type="button" class="blue_container fourth_btn" on:click={input.bind(this,"\\tau")}>&zeta;</button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\gamma")}>&gamma;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\sigma")}>&sigma;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\Sigma")}>&Sigma;</button>
                    <button type="button" class="blue_container fourth_btn" on:click={latexInput.bind(this,"\\varepsilon")}>&epsilon;</button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\Delta")}>&delta;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\Delta")}>&Delta;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\\lambda")}>&lambda;</button>
                    <button type="button" class="blue_container fourth_btn" on:click={input.bind(this,"\\beta")}>&beta;</button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_eight columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover blue_container" on:click={input.bind(this,"\\pi")}>&pi;</button>
                    <button type="button" class="blue_container scnd_btn blue_container" on:click={latexInput.bind(this,"\\Pi")}>&Pi;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover blue_container" on:click={latexInput.bind(this,"\\phi")}>&empty;</button>
                    <button type="button" class="blue_container fourth_btn blue_container bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "9"}
        <div class="button_designs select_changer" id="select_butns_9">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={input.bind(this,"a")}>a</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\vert")}>|</button>
                    <button type="button" class="thrd_btn bborder_remover blank_color bborder_remover rborder_remover"></button>
                    <button type="button" class="fourth_btn blank_color tborder_remover bborder_remover rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={input.bind(this,"b")}>b</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\cdot")}>.</button>
                    <button type="button" class="thrd_btn bborder_remover blank_color bborder_remover rborder_remover"></button>
                    <button type="button" class="fourth_btn blank_color tborder_remover bborder_remover rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\propto")}>&prop;</button>
                <div class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\longdiv{ }")}>
                    <div class="long-division"></div>
                </div>
                    <button type="button" class="thrd_btn bborder_remover blank_color bborder_remover rborder_remover"></button>
                    <button type="button" class="fourth_btn blank_color tborder_remover bborder_remover rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_eight columns_design">
                    <button type="button" class="first_btn bborder_remover blue_container" on:click={latexInput.bind(this,"\\text{abc}")}>abc</button>
                    <button type="button" class="scnd_btn blue_container" on:click={latexInput.bind(this,"\\mathbb{R}")}>&#8477;</button>
                    <button type="button" class="thrd_btn bborder_remover blue_container bborder_remover blank_color"></button>
                    <button type="button" class="fourth_btn blue_container tborder_remover bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "10"}
        <div class="button_designs select_changer" id="select_butns_10">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\lfloor")}>&lfloor;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\uparrow")}>&uarr;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\\neg")}>&not;</button>
                    <button type="button" class="fourth_btn rborder_remover bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\rfloor")}>&rfloor;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\equiv")}>&equiv;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\\exists")}>&exist;</button>
                    <button type="button" class="fourth_btn rborder_remover bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\lceil")}>&lceil;</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\wedge")}>&and;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={input.bind(this,"\\forall")}>&forall;</button>
                    <button type="button" class="fourth_btn rborder_remover bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_eight columns_design">
                    <button type="button" class="first_btn bborder_remover blue_container" on:click={input.bind(this,"\\rceil")}>&rceil;</button>
                    <button type="button" class="scnd_btn blue_container" on:click={latexInput.bind(this,"\\vee")}>&or;</button>
                    <button type="button" class="thrd_btn bborder_remover blue_container" on:click={latexInput.bind(this,"\\oplus")}>&oplus;</button>
                    <button type="button" class="fourth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "11"}
        <div class="btn-group button_designs select_changer" id="select_butns_11">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\text{g}")}>g</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\text{m}")}>m</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={latexInput.bind(this,"\\text{L}")}>L</button>
                    <button type="button" class="blue_container fourth_btn" on:click={latexInput.bind(this,"\\text{s}")}>s</button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\text{kg}")}>kg</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\text{km}")}>km</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={latexInput.bind(this,"\\text{mL}")}>mL</button>
                    <button type="button" class="blue_container fourth_btn" on:click={latexInput.bind(this,"\\text{ms}")}>ms</button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\text{mg}")}>mg</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\text{cm}")}>cm</button>
                    <button type="button" class="thrd_btn bborder_remover blank_color bborder_remover rborder_remover"></button>
                    <button type="button" class="fourth_btn blank_color tborder_remover bborder_remover rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color bborder_remover rborder_remover"></button>
            </div>
            <div class="column_eight columns_design">
                    <button type="button" class="first_btn bborder_remover blue_container" on:click={latexInput.bind(this,"\\text{&micro;g}")}>&micro;g</button>
                    <button type="button" class="scnd_btn blue_container" on:click={latexInput.bind(this,"\\text{mm}")}>mm</button>
                    <button type="button" class="thrd_btn bborder_remover bborder_remover blank_color"></button>
                    <button type="button" class="fourth_btn bborder_remover tborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "12"}
        <div class="button_designs select_changer" id="select_butns_12">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\text{oz}")}>oz</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\text{in}")}>in</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover " on:click={latexInput.bind(this,"\\text{fl oz}")}>fl oz</button>
                    <button type="button" class="fourth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\\text{lb}")}>lb</button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\text{ft}")}>ft</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={latexInput.bind(this,"\\text{pt}")}>pt</button>
                    <button type="button" class="fourth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                    <button type="button" class="first_btn bborder_remover blank_color"></button>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\text{mi}")}>mi</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover" on:click={latexInput.bind(this,"\\text{gal}")}>gal</button>
                    <button type="button" class="fourth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "13"}
        <div class="button_designs select_changer" id="select_butns_13">
            <div class="column_five blue_container columns_design">
                <div class="blue_container first_btn bborder_remover bborder_adder padder_less" on:click={latexInput.bind(this,"\\left(\\right)")}>
                    <div class="brackets"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_six blue_container columns_design">
                <div class="blue_container first_btn bborder_remover bborder_adder padder_less" on:click={latexInput.bind(this,"\\left[\\right]")}>
                    <div class="square-brackets"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                <div class="blue_container first_btn bborder_remover bborder_adder padder_less" on:click={latexInput.bind(this,"\\left\\{\\right\\}")}>
                    <div class="curly-brackets"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "14"}
        <div class="button_designs select_changer" id="select_butns_14">
            <div class="column_five blue_container columns_design">
                    <button type="button" class="first_btn blue_container bborder_remover" on:click={latexInput.bind(this,"d")}>d</button>
                <div class="scnd_btn blue_container padder_remover" on:click={latexInput.bind(this,"\\left(\\right)")}>
                    <div class="brackets"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_six blue_container columns_design">
                    <button type="button" class="first_btn blue_container bborder_remover" on:click={latexInput.bind(this,"f")}>f</button>
                <div class="scnd_btn blue_container padder_remover" on:click={latexInput.bind(this,"\\int_{ }^{ }")}>
                    <div class="integrtion"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                    <button type="button" class="first_btn blue_container bborder_remover" on:click={latexInput.bind(this,"\\Delta")}>&Delta;</button>
                <div class="scnd_btn blue_container padder_btn" on:click={latexInput.bind(this,"\\sum_{ }^{ }")}>
                    <div class="sigma"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color rborder_remover"></button>
            </div>
            <div class="column_eight columns_design">
                <div class="first_btn bborder_remover padder_remover blue_container" on:click={input.bind(this,"/")}>
                    <div class="x-button"></div>
                </div>
                    <button type="button" class="scnd_btn blue_container" on:click={latexInput.bind(this,"\\partial")}>&part;</button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
        {#if type == "15"}
        <div class="button_designs select_changer" id="select_butns_15">
            <div class="column_five blue_container columns_design">
                <div class="blue_container first_btn bborder_remover padder_less" on:click={latexInput.bind(this,"\^{}")}>
                    <div class="h-sup"></div>
                </div>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\rightarrow")}>&rarr;</button>
                <div class="thrd_btn bborder_remover blue_container bborder_adder padder_less" on:click={latexInput.bind(this,"\\xrightarrow[]\\{}")}>
                    <div class="x-power-y"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_six blue_container columns_design">
                <div class="blue_container first_btn bborder_remover" on:click={latexInput.bind(this,"\_{}")}>
                    <div class="h-sub"></div>
                </div>
                    <button type="button" class="blue_container scnd_btn" on:click={input.bind(this,"\\leftarrow")}>&larr;</button>
                    <button type="button" class="blue_container thrd_btn bborder_remover bborder_adder" on:click={latexInput.bind(this,"\\text{mol}")}>mol</button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_seven blue_container columns_design">
                <div class="blue_container first_btn bborder_remover padder_less" on:click={latexInput.bind(this,"\\_{ }^{ }")}>
                    <div class="h-sup-sub"></div>
                </div>
                    <button type="button" class="blue_container scnd_btn" on:click={latexInput.bind(this,"\\rightleftharpoons")}>&#8652;</button>
                    <button type="button" class="thrd_btn bborder_remover blue_container bborder_adder" on:click={input.bind(this,"\\prime")}>'</button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover rborder_remover blank_color"></button>
            </div>
            <div class="column_eight columns_design">
                <div class="first_btn bborder_remover padder_less blue_container" on:click={latexInput.bind(this,"\\_{ }{}\\^{ }")}>
                    <div class="h-power"></div>
                </div>
                    <button type="button" class="scnd_btn blue_container" on:click={latexInput.bind(this,"\\longleftrightarrow")}>&harr;</button>
                <div class="thrd_btn bborder_remover padder_less bborder_adder blue_container" on:click={latexInput.bind(this,"\\overset{ }\\{ }")}>
                    <div class="h-bar"></div>
                </div>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
                    <button type="button" class="fifth_btn bborder_remover blank_color"></button>
            </div>
        </div>
        {/if}
    </div>
</div>	
<style>
    .toolbar_container_one {
        max-height: 359px;
        max-width: 641px;
        margin: 0 auto;
        border: 1px solid #91653E;
        border-width: 0 1px 1px 1px;
        z-index: 1;
        font-size: 17px !important;
        }

    .draggable_area {
        display: inline-flex;
        height: 24px;
        width: 100%;
        background-color: #654320;
    }

    .dots_container {
        margin: auto;
        text-align: center;
    }

    .dots {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        display: inline-block;
        background-color: #888;
    }

    .toolbar_types_area {
        max-height: 35px;
        display: inline-flex;
        width: -webkit-fill-available;
        width: 100%;
        background-color: #F0F0F0;
    }

    .select_area {
        width: 162px;
        margin: 4px 0;
    }

    .option_selectbox {
        width: 155px;
        padding: 4px 2px;
        border: none;
        margin-left: 2px;
        border: 1px solid;
    }

    .show_text_area {
        width: 605px;
    }

    .lower_part_toolbar {
        border: 1px solid #91653E;
        border-width: 1px 0;
    }

    .orange_container {
        background-color: #FCFCD3;
    }

    .column_four {
        background-color: #DDDDDD;
    }

    .blue_container {
        background-color:#E6F2FC;
    }

    .light_purpl_container {
        background-color: #F0F0F0;
    }

    .blank_color {
        background-color: #D7E7DA;
    }

    .blank_color:hover {
        outline: none;
    }

    .font_changer {
        font-weight: bold;
        font-size: 17px !important;
    }

    .first_btn,
    .scnd_btn,
    .thrd_btn,
    .fourth_btn,
    .fifth_btn {
        text-align: center;
        width: 80px;
        height: 58px;
        padding: 20px;
        border-right: 1px solid #91653E;
    }

    .first_btn:hover,
    .scnd_btn:hover,
    .thrd_btn:hover,
    .fourth_btn:hover,
    .fifth_btn:hover {
        outline: 1px solid;
        outline-offset: -6px;
    }

    .button_designs,
    .lower_part_toolbar {
        display: inline-flex;
    }

    .scnd_btn,
    .fourth_btn {
        border-top: 1px solid #91653E;
        border-bottom: 1px solid #91653E;
    }

    .columns_design {
        width: 80px;
    }

    .padder_btn {
        padding-top: 2px;
    }

    /* .mathfield_container {
        display: inline-flex;
        width: 100%; not in used
    } */  

    /* .output_padder {
        padding: 20px 0 10px; not in use
    } */

    /* .basic_container {
        padding-bottom: 20px;
        z-index: 0; Not in used
    } */

    /* .border_line {
        border-top: 1px solid #eee;  // remove unused css
    } */

    .remove_border {
        border: none;
    }

    /* .toolbar_column {
        width: 200px; unused css
    } */

    /* .button_container {
        margin-top: 20px; unused css
    } */

    /* .code_output {
        padding-bottom: 20px; // unused css
    } */

    /* .box {
        height: 10px;
        width: 10px;
        border: 1px solid; // unused css
    } */

    .xvariable {
        width: 20px; 
        margin: auto;
        height: 19px;
        background: url(../images/toolbar_images.png) -32px -487px;
    }

    .yvariable {
        width: 22px; 
        margin: auto;
        height: 22px;
        background: url(../images/toolbar_images.png) -30px -714px;
    }

    .xfraction {
        width: 21px; 
        margin: auto;
        height: 49px;
        background: url(../images/toolbar_images.png) -23px -922px;;
    }

    .modulus {
        width: 25px; 
        margin: auto;
        height: 30px;
        background: url(../images/toolbar_images.png) -27px -848px; 
    }

    .padder_less {
        padding-top: 15px;
    }

    .padder_remover {
        padding-top: 10px;
    }

    .padder_field {
        padding-top: 12px;
    }

    .sigma {
        width: 16px; 
        margin: auto;
        height: 48px;
        background: url(../images/toolbar_images.png) -36px -381px; 
    }

    .h-bar {
        width: 17px; 
        margin: auto;
        height: 34px;
        background: url(../images/toolbar_images.png) -32px -507px; 
    }

    /* .block-equal {
        width: 18px; 
        margin: auto;
        height: 38px;
        background: url(../images/toolbar_images.png) -34px -436px;  unued css
    } */

    .x-power-y {
        width: 21px; 
        margin: auto;
        height: 38px;
        background: url(../images/toolbar_images.png) -1px -899px; 
    }

    /* .nine-matrix { 
        background: url(../images/toolbar_images.png) -1px -0px; 
        width: 52px; 
        height: 37px;
        margin: auto;  // unused css
    } */
    /* .horizontal-matrix { 
        background: url(../images/toolbar_images.png) -1px -38px; 
        width: 47px; 
        height: 40px;
        margin: auto;
    } */
    .long-division { 
        background: url(../images/toolbar_images.png) -1px -79px; 
        width: 45px; 
        height: 32px;
        margin: auto;
    }
    /* .vertical-matrix { 
        background: url(../images/toolbar_images.png) -1px -112px; 
        width: 45px; 
        margin: auto;
        height: 40px;  unused css
    } */
    /* .four-matrix { 
        background: url(../images/toolbar_images.png) -1px -153px; 
        margin: auto;
        width: 38px; 
        height: 29px;  unused css
    } */
    .square-root-two { 
        background: url(../images/toolbar_images.png) -1px -183px; 
        width: 38px; 
        height: 39px;
        margin: auto; 
    }
    .x-times-fraction { 
        background: url(../images/toolbar_images.png) -1px -223px;
        margin: auto;
        width: 37px; 
        height: 50px; 
    }
    .square-root { 
        background: url(../images/toolbar_images.png) -1px -274px; 
        width: 36px; 
        height: 34px; 
        margin: auto;
    }
    .brackets { 
        background: url(../images/toolbar_images.png) -1px -309px; 
        width: 35px; 
        height: 34px; 
        margin: auto;
    }
    .h-power { 
        background: url(../images/toolbar_images.png) -1px -344px; 
        width: 35px; 
        height: 36px; 
        margin: auto;
    }
    /* .single-matrix { 
        background: url(../images/toolbar_images.png) -1px -381px; 
        width: 34px; 
        height: 26px;  // unused css
        margin: auto;
    } */
    .curly-brackets { background: url(../images/toolbar_images.png) -1px -408px; 
        width: 33px; 
        margin: auto;
        height: 27px; 
    }
    /* .matrix-form { 
        background: url(../images/toolbar_images.png) -1px -436px; 
        width: 32px; 
        height: 24px; 
        margin: auto;
    } */
    .xsquare { 
        background: url(../images/toolbar_images.png) -1px -461px; 
        width: 31px; 
        height: 25px; 
        margin: auto;
    }
    .integrtion { 
        background: url(../images/toolbar_images.png) -1px -487px; 
        width: 30px; 
        height: 40px;
        margin: auto; 
    }
    .opp-recbrackets { 
        background: url(../images/toolbar_images.png) -1px -528px; 
        width: 30px; 
        height: 27px;
        margin: auto; 
    }
    .square-brackets { 
        background: url(../images/toolbar_images.png) -1px -556px; 
        width: 30px; 
        height: 34px;
        margin: auto;
    }
    .xsubscript { 
        background: url(../images/toolbar_images.png) -1px -591px; 
        width: 30px; 
        height: 31px; 
        margin: auto;
    }
    .dollar { 
        background: url(../images/toolbar_images.png) -1px -623px; 
        width: 29px; 
        height: 31px; 
        margin: auto;
    }
    .h-sub { 
        background: url(../images/toolbar_images.png) -1px -655px; 
        margin: auto;
        width: 29px; 
        height: 30px; 
    }
    .rec-brackets { 
        background: url(../images/toolbar_images.png) -1px -686px; 
        width: 28px; 
        height: 31px; 
        margin: auto;
    }
    .xpower { 
        background: url(../images/toolbar_images.png) -1px -718px; 
        width: 28px; 
        height: 30px; 
        margin: auto;
    }
    .bar-block { 
        background: url(../images/toolbar_images.png) -1px -749px; 
        width: 26px; 
        height: 34px; 
        margin: auto;
    }
    .infinity { 
        background: url(../images/toolbar_images.png) -1px -784px; 
        width: 26px; 
        height: 20px; 
        margin: auto;
    }
    .topbar-arrow { 
        background: url(../images/toolbar_images.png) -1px -805px; 
        width: 26px; 
        height: 42px; 
        margin: auto;
    }
    .h-sup { 
        background: url(../images/toolbar_images.png)-1px -848px; 
        width: 25px; 
        height: 26px; 
        margin: auto;
    }
    .colon { 
        background: url(../images/toolbar_images.png) -28px -749px; 
        width: 24px; 
        height: 31px; 
        margin: auto;
    }
    .not-lesser { 
        background: url(../images/toolbar_images.png) -28px -781px; 
        width: 24px; 
        height: 23px; 
        margin: auto;
    }
    .h-sup-sub { 
        background: url(../images/toolbar_images.png) -28px -805px; 
        width: 23px; 
        height: 36px; 
        margin: auto;
    }
    /* .info-img { 
        background: url(../images/toolbar_images.png) -1px -875px; 
        margin: auto;
        width: 23px;  // unused css
        height: 23px; 
    } */
    .not-greater { 
        background: url(../images/toolbar_images.png) -30px -686px; 
        width: 22px; 
        margin: auto;
        height: 27px; 
    }
    /* .topbar-doublearrow { 
        background: url(../images/toolbar_images.png) -25px -879px; 
        width: 22px;
        margin: auto; // unused css
        height: 42px; 
    } */

    /* .x-div { 
        background: url(../images/toolbar_images.png) -31px -623px; 
        width: 21px; 
        height: 44px; // unused css
        margin: auto;
    } */

    .rborder_remover {
        border-right: 0;
    }

    .dec_widther {
        width: 78px;
    }

    .bborder_remover {
        border-bottom: 0;
    }

    .blank_color:hover {
        outline: 0;
    }

    .bborder_adder {
        border-bottom: 1px solid #91653E;
    }

    /* .increase_size {
        width: 133px;
    } */

    /* .toolbar_sizing {
        width: 601px; // unused css
    } */

    /* .color_changer {
        background-color: #FCD4BA; // unused css
    } */

    /* .input_padder {
        padding-left: 20px;
    } */

    @media (max-width: 556px) {
        .first_btn,
        .scnd_btn,
        .thrd_btn,
        .fourth_btn,
        .fifth_btn,
        .columns_design{
            width: 30px;
        }
    }

     @media (max-width: 768px) {
        .first_btn,
        .scnd_btn,
        .thrd_btn,
        .fourth_btn,
        .fifth_btn,
        .columns_design {
            width: 50px;
        }
    }

    @media (max-width: 992px) {
        .first_btn,
        .scnd_btn,
        .thrd_btn,
        .fourth_btn,
        .fifth_btn,
        .columns_design {
            width: 80px;
        }
    }

    .height_modifier {
        max-height: 290px;
        overflow-y: scroll;
    }

    .tborder_remover {
        border-top: 0;
    }

    .close_toolbar {
        padding: 5px;
        color: #888;
        border: none;
        background-color: #654320;
    }
</style>