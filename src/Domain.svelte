<script>
    import { onMount, beforeUpdate} from 'svelte';
	import { Button, Dialog, Checkbox } from 'svelte-mui/src';
    import { writable } from 'svelte/store';
    import { AH } from '../helper/HelperAI.svelte';
    export let guid;
    export let selectedDomain;
    export let selectedTest;
    export let isNew;
    export let smdata;
    export let setCourse;
    export let updateModule;
    export let saveDomain;
    export let closeDomainDialog;
    export let domainToggle;
    export let selectedObjective;
    export let selectedCoverage;
    export let editorState;
    export let caseid_val;

    let items = []; // array to store domains
    let action = "";
    let itemsCoverage = []; // coverage holder
    let testSetList = []; // test list
    let testType = []; // test type for list
    let courses = []; // courses
    let error = {};
    let state = {};
    let domainData = "";
    let fromProject = getQueryString("from_myproject") == 1 ? true : false;
    let url = AH.url();
    //State creation
    let hdd = writable({
        open: false,
        value: 0,
        domainArray: [],
        guid: "",
        coverage_guid: 0,
        itemsCoverage: [],
        courses: 0,
        showCoverage: true,
        mapping: false,
        disExercise: false,
        testSetList: [],
        caseid_val: "",
        test: {
            q: false,
            p: false,
            f: false,
            l: false,
            u: false,
            t: 0
        }
    });
    const unsubscribe = hdd.subscribe((item)=> {
        state = item;
    })

    onMount(async ()=> {
        init();
        if (AH.get('domainData')) {
            domainData= AH.get('domainData')[editorState.guid];
            setDomainData();
        } else if (fromProject && url.get('router_guid')) {
            AJ.ajax({
            url: baseUrl + "editor/index.php",
            data: {
                    ajax: "1",
                    course_code: editor.course,
                    action: "get_domain",
                    guids: url.get('router_guid').split(','), 
                    keys: 'e,d'
                },
            }).then((response)=> {
                response =JSON.parse(response);
                domainData = response[self.props.guid]
                AH.set('domainData', domainData);
                setDomainData();
            });
        }
        // Default Data for domain
        items.push({value: 0, key: "0", label: "Select Domain"});
        itemsCoverage.push({value: 0, key: "0", label: "Select Section"});
        courses.push({value: 0, key: "0", label: "Select Course"});
        if (!error['domains']) {
            let is_draft = '';
            for (let i in domains) {
                if (AH.isValid(domains[i].is_draft) && domains[i].is_draft == 1) {
                    is_draft = ' (Unpublished)';
                }
                items.push({value: i, key: i, label: domains[i].f + " " + domains[i].snippet.replace(/&nbsp;|&\#160;/g, " ") + is_draft });
            }
        }
        if (!error['my_coursess']) {
            for (let i in my_courses) {
                courses.push({value: my_courses[i]["course_code"], key: i, label: my_courses[i]["course_name"] + " "});
            }
        }
        // Get data setting from create url
        if ( (url.get("from_educator") == 1 && url.get("in_frame") == 1) || url.get("from_coverage") == 1 ) {
            setTestValue("t", url.get("e"));
            setTestValue("p", url.get("d"));
        }
        var objTemp = state.test;
        objTemp["t"] = objTemp["t"] ? parseInt(objTemp["t"]) : 0;
        objTemp["p"] = objTemp["p"] ? parseInt(objTemp["p"]) : 0;
        testSetList = [];
        testSetList.push({value: 0, key: "0", label: "Select Test"});
        if (test_set) {
            for (let i = 1; i <= test_set.p; i++) {
                testSetList.push({value: i, key: i, label: `Practice Test ${i}`});
            }
            if (test_set["-2"] == 1) {
                testSetList.push({value: -2, key: "-2", label: "Post Assessment"});
            }
            if (test_set["-13"] == 1) {
                testSetList.push({value: -13, key: "-13", label: "Lab1"});
                testSetList.push({value: -14, key: "-14", label: "Lab2"});
            }
        }

        testSetList.push({value: -3, key: "-3", label: "Quiz"});
        testSetList.push({value: -1, key: "-1", label: "Exercise"});
        //@ Vaibhav : for kc option at domain
        testSetList.push({value: -10, key: "-10", label: "Knowledge Check"});

        state.test = objTemp;
        if (objTemp.t == "-13" || objTemp.t == "-14") {
            state.disExercise =  true;
        }
        state.testSetList = testSetList;
        state.itemsCoverage = itemsCoverage; 
        // Get Item mapping
        AH.ajax({
            url: baseUrl + "editor/index.php",
            withUrl: true,
            data: {
                ajax: "1",
                course_code: editor.course,
                action: "get_items_mapping"
            },
        }).then((response)=> {
            state.mapping = JSON.parse(response);
            setDomainMapping();
        });
        // Checking mapping of domain
        setTimeout(function() {
            if (state.mapping && guid) {
                setDomainMapping();
            } else if (content_domain) {
                let tempValue = content_domain.match(/[0-9]/) ? content_domain : 0;
                state.value = tempValue;
                selectedDomain(tempValue);
            }
            selectedTest(state.test);
        }, 500);
    })

    function setDomainData() {
        if (domainData && url.get('router_guid')) {
            url.set("e", domainData["e"]);
            url.set("d", domainData["d"]);
            url.set("p1", domainData["p1"])
            url.set("p2", domainData["p2"]);
            url.set('group_type', "q,u,f,c");
            url.set('in_frame', 1);
            setTestValue("t", domainData["e"]);
            setTestValue("p", domainData["d"]);
        } else if ( (url.get("from_educator") == 1 && url.get("in_frame") == 1) || url.get("from_coverage") == 1 ) {
            setTestValue("t", url.get("e"));
            setTestValue("p", url.get("d"));
        }
    }

    beforeUpdate(async ()=> {
        state.caseid_val = caseid_val;
        if (domainToggle != state.open) {
            state.open = domainToggle;
            if (state.test.t == -3 || state.test.t == -14 || state.test.t == -13 || state.test.t == -1) {
                setTimeout(function() {
                    AH.selectAll(".preAssessment", 'hide');
                }, 100);
            } else {
                setTimeout(function() {
                    AH.selectAll(".preAssessment", 'show');
                }, 100);
            }
        }
    })

    // Checking data recieved from php and parse
    function init() {
        error = {};
        try {
            domains = typeof domains == "object" ? domains : JSON.parse(domains);
        } catch (err) {
            error['domains'] = err;
        }
        try {
            my_courses = typeof my_courses == "object" ? my_courses : JSON.parse(my_courses);
        } catch(err) {
            error['my_courses'] = err;
        }
        try {
            objectives = typeof objectives == "object" ? objectives : JSON.parse(objectives);
        } catch(e) {
            error['objectives'] = e;
        }
        try {
            coverage_data = typeof coverage_data == "object" ? coverage_data : JSON.parse(coverage_data);
        } catch(e) {
            error['coverage_data'] = e;
        }
        try {
            test_set = test_set ? (typeof test_set == "object" ? test_set : JSON.parse(test_set) ) : "";
        } catch(e) {
            error['test_set'] = e;
        }

        try {
            var isAssessment = isAssessment ? isAssessment.split(",") : null;
            if (isAssessment != null) {
                if (isAssessment[isAssessment.length - 1].length == 5) {
                    var converge_parent = isAssessment[isAssessment.length - 1];
                    isAssessment.splice(-1, 1);
                }
            }
        } catch (e) {
            error['isAssessment'] = e;
        }
        testType = { "-4": "p", "-2": "f", q: "q", u: "u", t: "t" };
    }

    // Handle Test change
    function setTestValue(type, value) {
        state.test[type] = value;
    }

    // Event for Exam objective changes
    function initExamListner() {
        AH.listen(document.body, 'click', '.exam-obj', function(_this) {
            loadExamObjective && loadExamObjective(_this);
        });
        AH.listen(document.body, 'keyup','#search_text', function(_this) {
            searchText && searchText(_this);
        });
        AH.listen(document.body, 'click','#assign_exam_obj',function(_this) {
            assignObjective && assignObjective(_this);
        });
        AH.listen(document.body, 'click','.exam_obj_radio', function(_this) {
            selectObjRadio && selectObjRadio(_this);
        });
    }

    // Handle domain data update
    function setDomainMapping() {
        if (state.mapping[guid]) {
            state.value = state.mapping[guid];
            selectedDomain(state.mapping[guid]);
            try {
                if (objectives) {
                    if (objectives[state.mapping[guid]]) {
                        let obj = objectives[state.mapping[guid]].toString().split(",");
                        for (let i = 0; i < obj.length - 1; i++) {
                            let seq_no = coverage_data[obj[i]].f;
                            itemsCoverage.push({value: obj[i], key: i, label: seq_no + " " + coverage_data[obj[i]].snippet.replace(/&nbsp;|&\#160;/g, " ")});
                        }
                    }
                    state.itemsCoverage = itemsCoverage; 
                    state.coverage_guid = 0;
                }
            } catch (e) {
                console.warn(e);
            }
            if (typeof converge_parent != "undefined") {
                state.coverage_guid = converge_parent;
            }
        } else {
            state.value = 0;
            selectedDomain(0);
        }
        if ((url.get("p1") || url.get("p2")) && fromProject) {
            setTimeout(function() {
                try {
                    if (objectives && typeof state.mapping[guid] === "undefined") {
                        if (objectives[url.get("p1")]) {
                            let obj = objectives[url.get("p1")].toString().split(",");
                            for (let i = 0; i < obj.length - 1; i++) {
                                itemsCoverage.push({value: obj[i], key: i, label: coverage_data[obj[i]].snippet.replace(/&nbsp;|&\#160;/g, " ")});
                            }
                        }
                    }
                    state.itemsCoverage = itemsCoverage;
                    state.value = url.get("p1");
                    state.coverage_guid = url.get("p2");
                    selectedDomain(url.get("p1"));
                    selectedCoverage(url.get("p2"));
                } catch(e) {
                    console.log(e);
                }
            }, 100);
        }
    }

    // Handle course change from list
    function  handleCourseChange(event) {
        let course = event.target.value;
        state.courses = course;
        setCourse(course);
        try {
            AH.activate(1);
            AH.ajax({
                url: baseUrl + "editor/index.php",
                withUrl: true,
                data: {
                    ajax: "1",
                    course_code: course,
                    action: "get_new_coverage"
                },
            }).then((response)=> {
                try {
                    var chapters = JSON.parse(response);
                    items.length = 0;
                    items.push({value: 0, key: "0", label: "Select Section"});
                    for (let i in chapters[0]) {
                        items.push({value: i, key: i, label: chapters[0][i].f + " " + chapters[0][i].snippet.replace(/&nbsp;|&\#160;/g, " ")});
                    }
                    state.objectives = chapters[1]; 
                    state.coverage = chapters[2]; 
                    state.value = items;
                    AH.activate(0);
                } catch (e) {
                    console.log("Coverage no found");
                }
            });
        } catch (e) {console.log(e);}
    }

    // Handle Objective change from list
    function handleChange(event) {
        let value = event.target.value;
        state.value = value;
        console.log('state.value', state.value);
        try {
            if (objectives || state.objectives) {
                if (state.objectives) {
                    objectives = state.objectives;
                    coverage_data = state.coverage;
                }
                itemsCoverage.length = 0;
                itemsCoverage.push({value: 0, key: "0", label: "Select Section"});
                if (objectives[value]) {
                    let obj = objectives[value].toString().split(",");
                    for (let i = 0; i < obj.length - 1; i++) {
                        let seq_no = coverage_data[obj[i]].f;
                        itemsCoverage.push({value: obj[i], key: i, label: seq_no + " " + coverage_data[obj[i]].snippet.replace(/&nbsp;|&\#160;/g, " ")});
                    }
                }
                state.itemsCoverage = itemsCoverage; 
                state.coverage_guid = 0;
            }
        } catch (e) { console.log(e);}
        AH.set('save_item', true);
    }

    // Handle coverage data change
    function handleCoverageChange(event) {
        let value = event.target.value;
        state.coverage_guid = value;
        AH.set('save_item', true);
    }

    // Handle case Id change from domain dialog
    function handleCaseID(e) {
        state.caseid_val = e.target.value;
        updateModule('caseid_val', e.target.value);
    }

    // Handle Test change from list
    function handleTestChange(event) {
        let value = event.target.value;
        let objTemp = state.test;
        objTemp["t"] = value;
        if (value == -3 || value == -14 || value == -13 || value == -1) {
            objTemp["p"] = false;
            AH.selectAll(".preAssessment", 'hide');
        } else {
            AH.selectAll(".preAssessment", 'show');
        }
        state.test = objTemp; 
        state.disExercise = (value == -13 || value == -14) ? true : false;
    }

    // Update json for test
    function updateTestValue(type) {
        let objTemp = state.test;
        objTemp[type] = +!objTemp[type];
        state.test = objTemp;
    }

    // check saving
    function handleSave() {
        handleClose();
        //set state of editor
        editorState.exam_objective_mapping_save = 1;
        setTimeout(function() {
            AH.activate(1);
            if (from_coverage) {
                // for add new content
                saveDomain(1);
            } else {
                saveDomain();
            }
        }, 100);
    }

    // Handle Close action
    function handleClose() {
        try {
            closeDomainDialog(false);
            selectedDomain(state.value);
            if (fromProject && objectives && coverage_data) {
                selectedCoverage(state.coverage_guid ? state.coverage_guid : state.value);
            }
            state.test ? selectedTest(state.test) : null;
            let tag_list = [];
            AH.select('input[name="exam_obj[]"]', 'checked').forEach(function(_this, i) {
                tag_list[i] = _this.value;
            });
            selectedObjective(tag_list.toString());
        } catch (e) {
            console.log(e);
        }
    }
    $: console.log('state.value2', state.value);
</script>

<Dialog bind:visible={state.open} width="700" style="background: #fff; border-radius: 5px;">
    <h4 class="mt-1 font21 mb-4">
        <div class="d-flex justify-content-between">
            <div>Content Settings</div>
        </div>
    </h4>
    <div class="overflow-hide" style="height:328px;">
        {#if fromProject}
            <ul 
                class="nav nav-pills"
                style="border-bottom: 2px solid #ebebeb !important;"
            >
                <li class="nav-item">
                    <a
                        class="nav-link active"
                        data-bs-toggle="pill"
                        href="#coverage"
                    >
                        Coverage
                    </a>
                </li>
                <li class="nav-item exam-obj">
                    <a
                        class="nav-link exam-obj"
                        data-bs-toggle="pill"
                        href="#ExamTab"
                        use:initExamListner={action}
                    >
                        Exam Objective
                    </a>
                </li>
                <li class="nav-item">
                    <a
                        class="nav-link"
                        data-bs-toggle="pill"
                        href="#refer_content"
                    >
                        Refer Content
                    </a>
                </li>
            </ul>
        {/if}
        <div class="tab-content mt-2" style="height: 296px;">
            <div id="coverage" class="tab-pane fade in active ">
                {#if isNew == 1}
                    <div class="ml-4 mb-4">
                        <label
                            style="
                                color: rgba(0, 0, 0, 0.87);
                                bottom: 15px;
                                width: 25%;
                            "
                            for="course_select"
                        >
                            Course
                        </label>
                        <select
                            id="course_select"
                            bind:value={state.courses}
                            on:blur={handleCourseChange}
                            style="margin: 2px 24px; width: 50%"
                            disabled={url.get("todo_table") == 1 ? true : false}
                        >
                            {#each courses as data}
                                <option value={data.value} key={data.key}>
                                    {data.label}
                                </option>
                            {/each}
                        </select>
                    </div>
                {/if}
                <div class="ml-4">
                    <label
                        class="coverage_label"
                        for="select_domain"
                    >
                        Lesson
                    </label>
                    <select
                        bind:value={state.value}
                        id="select_domain"
                        on:blur={handleChange}
                        style="margin: 2px 24px; width: 70%;"
                        class="domain_select"
                        disabled={url.get("todo_table") == 1 ? true : false}
                    >
                        {#each items as data}
                            <option value={data.value} key={data.key}>
                                {data.label}
                            </option>
                        {/each}
                    </select>
                </div>
                {#if state.showCoverage == true && fromProject && objectives && coverage_data}
                    <div class="mt-3 ml-4">
                        <label
                            class="coverage_label"
                            for="domain_select"
                        >
                            Section{" "}
                        </label>
                        <select
                            bind:value={state.coverage_guid}
                            on:blur={handleCoverageChange}
                            style="margin: 2px 24px; width: 70%;"
                            class="domain_select"
                            id="domain_select"
                            disabled={url.get("todo_table") == 1 ? true : false}
                        >
                            {#each state.itemsCoverage as data}
                                <option value={data.value} key={data.key}>
                                    {data.label}
                                </option>
                            {/each}
                        </select>
                    </div>
                {/if}
                {#if (url.get("in_frame") == 1 && fromProject && smdata.content_type != "f") || url.get("todo_table") == 1 || url.get("from_coverage") == 1}
                    <div class="col-md-12 pl-0 mt-3 ml-2">
                        <div class="col-md-12">
                            {#if window.objectives && window.coverage_data}
                                <div>
                                    <label
                                        class="coverage_label"
                                        for="test_select"
                                        style="width: 14%;"
                                    >
                                        Test{" "}
                                    </label>
                                    <select
                                        style="width: 73%;"
                                        on:blur={handleTestChange}
                                        class="domain_select"
                                        id="test_select"
                                        disabled={smdata.item == 36 ? true : false}
                                    >
                                        {#each state.testSetList as data}
                                            <option value={data.value} key={data.key} selected={state.test.t == data.value ? 'selected' : ''}>
                                                {data.label}
                                            </option>
                                        {/each}
                                    </select>
                                </div>
                            {/if}
                        </div>
                        {#if test_set["-4"] == 1}
                            <div class="col-md-12 preAssessment mt-3">
                                <Checkbox
                                    id="preAssessment"
                                    bind:checked={state.test.p}
                                    on:click={updateTestValue.bind(this, "p")}
                                    color = "primary"
                                    disabled={smdata.item == 36 ? true : false}
                                >
                                    <span>Pre Assessment</span>
                                </Checkbox>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
            <div id="ExamTab" class="tab-pane fade">
                <div class="exam_modal_body npt" id="exam_obj_body">
                <div class="row">
                    <div class="col-md-9 pr-0 search_box input-group">
                    <div class="input-group-prepend">
                        <span class="icomoon-search-3 input-group-text"></span>
                    </div>
                    <input
                        type="search"
                        class="form-control"
                        id="search_text"
                        placeholder="Search"
                        results
                    />
                    </div>
                    <div class="col-md-3 pl-2 pr-0">
                        <a
                            href={window.baseUrl + "educator/project/exam_objective_mapping.php?course_code=" + editor.course + "&from_myproject=1&exam_obj_h=1"}
                            rel="noreferrer"
                            target="_blank"
                            class="btn btn-primary"
                        >
                            Create new
                        </a>
                    </div>
                </div>
                <div class="col-md-12 border overflow-y exam_obj_list relative" style="top: 5px;height:250px;font-size: 14px;">
                    <ul class="parent_ul list-unstyled check-link"></ul>
                </div>
                </div>
            </div>
            <div id="refer_content" class="tab-pane fade">
                <div id="testcase" class="ml-4">
                    <label
                        for="caseid"
                        class = "coverage_label"
                    >
                        Case ID
                    </label>
                    <input
                        id="caseid"
                        type="text"
                        on:input={handleCaseID}
                        bind:value={state.caseid_val}
                        placeholder="Enter Case ID"
                        style = "margin-left: 10px; height: 40px; width: 50%;"
                        class='mt-3 domain_select'
                        variant="outlined"
                    />
                </div>
            </div>
        </div>
    </div>
    <div slot="footer" class="svelteFooter">
        <Button 
            key = {"domainClose"} 
            unelevated={true}
            outlined={true}
            on:click={handleClose} 
            color="#ccc"
        >
            Close
        </Button>
        <Button
            key = {"domainSave"}
            unelevated={true}
            outlined={true}
            classes="bg-primary text-white"
            on:click={handleSave}
            color="primary"
        >
            Save
        </Button>
    </div>
</Dialog>

<style>
    
</style>