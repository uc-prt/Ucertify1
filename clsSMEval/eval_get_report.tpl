<!--filename - eval_get_report.tpl-->
<h2>Complete code</h2>
<textarea class="form-control" rows="7" id="usercode" name="usercode">
    <{$pre_code}><{$editor_code}><{$post_code}>
</textarea>
<h2 class="mt-4">Testcase Result</h2>
<{for $index = 0 to $testcase_arraysize - 1}>
    <{if stripos($testOutput, "<TR>") != -1}>
        <{$testOutput = "<TABLE><{$testOutput}></TABLE>"}>
    <{/if}>

    <{$status_class = "badge-danger"}>
    <{if $resultCode[$index] == "Passed"}>
        <{$status_class = "badge-success"}>
    <{/if}> 
    <div class="accordion" id="accordion_eval<{$index}>">
        <div class="card z-depth-0 bordered">
        <div class="card-header" id="heading<{$index}>" data-toggle="collapse" data-target="#collapse<{$index}>"
        aria-expanded="true" aria-controls="collapse<{$index}>">
            <h5 class="mb-0">
                <Label>
                    Test Case <{$index + 1}>: 
                </Label>
                <span class="badge <{$status_class}>"><{$resultCode[$index]}></span>
            </h5>
        </div>
        <div id="collapse<{$index}>" class="collapse show" aria-labelledby="heading<{$index}>"
            data-parent="#accordion_eval<{$index}>">
            <div class="card-body">
                <div class="accordion" id="accordion_input<{$index}>">
                    <div class="card z-depth-0 bordered">
                    <div class="card-header" id="heading_inner_one" data-toggle="collapse" data-target="#collaps_one<{$index}>"
                    aria-expanded="true" aria-controls="collaps_one<{$index}>">
                        <h5 class="mb-0">Input</h5>
                    </div>
                    <div id="collaps_one<{$index}>" class="collapse show" aria-labelledby="heading_one"
                        data-parent="#accordion_input<{$index}>">
                        <div class="card-body">
                            <{$testcase_array[$index][0]}>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="accordion" id="accordion_output<{$index}>">
                    <div class="card z-depth-0 bordered">
                    <div class="card-header" id="heading_inner_two" data-toggle="collapse" data-target="#collaps_two<{$index}>"
                    aria-expanded="true" aria-controls="collaps_two<{$index}>">
                        <h5 class="mb-0">Output</h5>
                    </div>
                    <div id="collaps_two<{$index}>" class="collapse show" aria-labelledby="heading_two"
                        data-parent="#accordion_output<{$index}>">
                        <div class="card-body overflow-auto">
                            <{$testcase_array[$index][1]}>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="accordion" id="accordion_uoutput<{$index}>">
                    <div class="card z-depth-0 bordered">
                    <div class="card-header" id="heading_inner_three" data-toggle="collapse" data-target="#collaps_three<{$index}>"
                    aria-expanded="true" aria-controls="collaps_three<{$index}>">
                        <h5 class="mb-0">User output</h5>
                    </div>
                    <div id="collaps_three<{$index}>" class="collapse show" aria-labelledby="heading_three"
                        data-parent="#accordion_uoutput<{$index}>">
                        <div class="card-body overflow-auto">
                            <{$userOutput[$index]}>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
<{/for}>