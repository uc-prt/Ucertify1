
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    const l = {
        add_new_task : "Add new task",
        edit_task : "Edit task",
        you_cant_add_task_from_chapter : "You can't add task from chapter",
        status_update_success_txt : "Status has been updated successfully.",
        deleting_multiple_contents_will_also_delete_the_nested_contents: "If this item has nested sub-items, then deleting this will also delete sub-items.",
        viewer_error_msg_js: "You are participating as a viewer, You don't have permission to save.",
        add_new_part: "Add New Part",
        cut_js: "Cut",
        paste_js: "Paste",
        eng: "English",
        deleted: "Deleted",
        donot_select_multiseat: "Please do not select multi seat vouchers.",
        select_used_voucher: "Please select used voucher only.",
        edit_js: "Edit ",
        delete_js: "Delete ",
        add_existing_content: "Add Existing Content",
        duplicate_row: "Duplicate Row",
        author_lesson: "Author as Lesson",
        draft_js: "Draft",
        publish_js: "Publish",
        edit_mode: "Lesson Preview",
        import_from_epub: "Import a Lesson Below",
        select_new_content_type: "Select new content type",
        change_type_js: "Change type",
        objective_js: "Objective",
        fact_js: "Fact",
        embeded_content_js: "Embeded content",
        glossary_js: "Glossary",
        customize_saved: "Saved Successfully.",
        unable_save: "Error. Unable to save",
        add_txt : "Add",
        actions_txt : "Actions",
        bug_update : "Bug updated successfully.",
        org_url_exist : "Org Ucertify Url already exists!!",
        logo_validate : "logo must be less than 1MB.",
        logo_res : "logo size must be of maximum 300x100 pixel resolution.",
        image_validate : "Only jpeg, jpg, png, gif, bmp file types are supported.",
        country_update : "Country updated successfully.",
        country_not_updated : "Country not updated.",
        post_update : "Post updated successfully.",
        post_not_updated : "Post not updated.",
        user_deleted  : "The user has been deleted successfully! ",
        user_not_deleted  : "The user cannot be deleted.Please try after some time!",
        first_js_lang : "Js Testing",
        error_while_saving_please_try_again : "Error while saving, please try again",
        do_you_really_want_to_save : "Do you really want to Save?",
        off: "Off",
        lti_success: "Your score has been updated on your LMS.",
        lti_fail: "Score is not updated due to some technical issue.",
        select_an_option_txt : "Select an option",
        updated_please_reload : "Updated, please reload.",
        content_not_deleted_please_try_again : "Unable to delete the content. Please try again.",
        delete_content_with_child : "Item is deleted successfully with its child.",
        error_unable_to_delete : "Error. Unable to delete",
        no_changes_txt : "No changes.",
        content_has_been_added_successfully : "Content has been added successfully.",
        content_has_not_been_added_successfully : "Content has not been added successfully.",
        part_has_been_deleted_successfully : "Part has been deleted successfully.",
        content_has_been_moved_successfully : "Content has been moved successfully.",
        content_has_not_been_moved_successfully : "Content has not been moved successfully.",
        error_unable_to_move : "Error. Unable to move",
        content_level_has_been_changed_successfully : "Content level has been changed successfully.",
        content_level_has_not_been_changed_successfully : "Content level has not been changed successfully.",
        error_unable_to_changed_level : "Error. Unable to changed the level",
        taglist: "Tag List",
        formats: "Formats",
        inline: "Inline",
        bold: "Bold",
        bits: "bold",
        italic: "Italic",
        italics: "italic",
        underline: "Underline",
        underlines: "underline",
        strikethrough: "Strikethrough",
        strikethroughs: "strikethrough",
        superscript: "Superscript",
        superscripts: "superscript",
        subscript: "Subscript",
        subscripts: "subscript",
        small: "Small",
        smalls: "small",
        heading: "Heading",
        heading1: "Heading 1",
        heading2: "Heading 2",
        heading3: "Heading 3",
        heading4: "Heading 4",
        heading5: "Heading 5",
        heading6: "Heading 6",
        newspaper: "Newspaper Font",
        blocks: "Blocks",
        para: "Paragraph",
        div: "Div",
        block: "Blockquote",
        span: "Span",
        code: "Code",
        insnote: "Instructor Note",
        insans: "Instructor Answer",
        alignment: "Alignment",
        left: "Left",
        alignleft: "alignleft",
        center: "Center",
        aligncenter: "aligncenter",
        right: "Right",
        alignright: "alignright",
        justify: "Justify",
        alignjustify: "alignjustify",
        cases: "Cases",
        uppercase: "Uppercase",
        lowercase: "Lowercase",
        titlecase: "Titlecase",
        sentence_case: "Sentence Case",
        toggle_case: "Toggle Case",
        color: "Color",
        success: "Success",
        bsuccess: "b-success",
        warning: "Warning",
        bwarning: "b-warning",
        danger: "Danger",
        bdanger: "b-danger",
        white: "White",
        bwhite: "b-white",
        green: "Green",
        bgreen: "b-green",
        objref: "objref(italic)",
        borange: "b-orange",
        binfo: "b-info",
        bprimary: "b-primary",
        bgcolor: "Background color",
        lsuccess: "Label-Success",
        linfo: "Label-Info",
        lprimary: "Label-Primary",
        ldanger: "Label-Danger",
        lwarning: "Label-Warning",
        list: "List",
        withoutBullet: "Without Bullet",
        numlist: "Numbered list",
        alphlist: "Alphabetical list",
        romanlist: "Roman list",
        numalphlist: "Numeric alpha list",
        bullist: "Bullet list",
        blarlist: "Black arrow bullets",
        bluearlist: "Blue arrow bullets",
        blarbullet: "Blue arrow bullets with gray background",
        blcrcbbullet: "Blue circle bullets",
        bcbwbt: "Blue circle bullet with black text",
        redcrlist: "Red circle list",
        whcrclist: "White circle list",
        tickbull: "Tick Bullet",
        listtype1: "List type 1",
        listtype2: "List type 2",
        listtype3: "List type 3",
        listtype4: "List type 4",
        listtype5: "List type 5",
        listtype6: "List type 6",
        table: "Table",
        deftable: "Default Table",
        smplbortab: "Simple Bordered Table",
        unbortab: "Unbordered Table",
        borbacktab: "Bordered Background Table",
        hrowsbor: "Highlighted Rows Bordered",
        strptab: "Stripped Table",
        tabhovdes: "Table Hover Design",
        mulstrp: "Multiple Stripes",
        separate: "Separate",
        grycolor: "Gray color column",
        blueshade: "Blue header with shading table",
        box: "Box",
        panelblue: "Panel Box Blue",
        panelgreen: "Panel Box Green",
        panelsky: "Panel Box Sky-blue",
        panelgrad: "Panel Box gradient",
        block_with_border: "Panel Box with Border",
        blockgrey: "Block in grey background",
        symbols: "Symbols",
        ucsyntax: "UC Syntax",
        indentation: "Indentation",
        clear_formatting: "Clear Formatting",
        wrap_text: "Wrap your text in block element to indent",
        outdent: "outdent",
        removeformat: "removeformat",
        align_content_message: "Wrap your text in block element to align content",
        blue_color:"Blue",
        orange_color:"Orange",
        red_color: "Red",
        golden_brown_color: "Golden Brown",
        black_color: "Black",
        green_color: "Green",
        cyan_color:  "Cyan",
        uc_syntax_format1: "White with number",
        uc_syntax_format2: "White without number",
        uc_syntax_format3: "Black with number",
        uc_syntax_format4: "Black without number",
        line_break1: "Single line Break",
        line_break2: "Double line Break",
        quotes: "Quotes(Sayings)",
        code_block1: "Syntax",
        code_block2: "Black with number",
        code_block3: "Black without number",
        code_block4: "White with number",
        code_block5: "White without number",
        timeline: "Timeline",
        slideshow :"Slideshow",
        panel_success: "Panel Success",
        panel_info: "Panel Info",
        panel_primary: "Panel Primary",
        panel_danger: "Panel Danger",
        panel_warning: "Panel Warning",
        acc_list1: "Accordion List 1",
        acc_list2: "Accordion List 2",
        acc_list3: "Accordion List 3",
        acc_list4: "Accordion List 4",
        inlineAlign: "icomoon-inline",
        headings: "icomoon-heading",
        block_ico: "icomoon-blocks",
        alginments: "icomoon-align",
        case: "icomoon-cases",
        colors: "icomoon-color",
        background: "icomoon-background-color",
        lists: "icomoon-list",
        tables: "icomoon-table",
        boxes: "icomoon-24-px-box",
        symbol: "icomoon-symbols",
        ucsyntaxes: "icomoon-uC-syntax",
        ucfeed: "icomoon-uC-feedback",
        dummyText: "Enter Your Text Here",
        authoring : "Authoring",
        change_view : "Change View",
        render_tag : "Render Tags",
        version_control : "Revision History",
        preview : "Preview",
        remediation : "Remediation",
        back : "Back",
        save_header : "Confirmation",
        save_process : "Please, be patient. We are saving your data...",
        save_confirmation : "Do you want to save this content?",
        cancel : "Cancel",
        done : "Done",
        save_new : "Save as new",
        save : "Save",
        save_success : "Data saved successfully",
        save_success_owner : "Content is successfully saved. Get it published by the Reviewer/Owner to make it visible in the course.",
        save_error : "It seems that the course is not loaded. Please load the course before you save.",
        setting : "Settings",
        add_response : "Add Response",
        add_editable : "Add Editable",
        case_sensetive : "Case Sensitive",
        ignore_spcl_char : "Ignore Special Character",
        multi : "Multiple Correct Answer",
        fill_header : "Fill in the blanks - type",
        fill_text_title : "Fill in the blanks (with text)",
        fill_dropdown_title : "Fill in the blanks (with drop downs)",
        fill_dragdrop_title : "Fill in the blanks (with drag & drop)",
        short_text : "Short Text",
        fill_multiline_title : "Fill in the blanks (with multiline)",
        fill_math_title : "Fill in the blanks (with mathematical equations)",
        fill_text_placeholder : "Write correct answer here",
        fill_text_help1 : "1. To include multiple correct answers, type the answers and separate them with a comma (,).",
        fill_text_help2 : "2. Please do not include any space. Now, go back to the Settings and select Multiple Correct Answers from the drop-down.",
        fill_text_help3 : "Use #cm for comma (e.g., 5,000 as 5#cm000).",
        fill_math_help1 : "1. To make math equation initially, Click f(x) and then insert the equation.",
        fill_math_help2 : "2. To add user Response, place cursor before{*} and Click Add Response.",
        fill_math_help3 : "3. To edit the existing equation, Click Edit.",
        //fill_text_help3 : "Now, go back to Settings and select Multi from the drop-down.",
        fill_dropdown_placeholder : "Write Option here",
        fill_dropdown_help1 : "1. To choose correct answer, select any one radio button from the given options.",
        fill_dropdown_help2 : "2. To choose the display answer, put ‘+’ sign before it. For eg: (+value).",
        fill_dropdown_help3 : "3. To give comma (,) between the text use #cm symbol.",
        drag_single : "Allow single dragging",
        fill_dragdrop_help1 : "1. By default, all answer option is correct.",
        fill_dragdrop_help2 : "2. To make an option incorrect, uncheck the corresponding checkbox.",
        fill_dragdrop_help3 : "3. To give comma (,) between the text use #cm symbol.",
        fill_dragdrop_help4 : "4. To give Vertical bar (|) use #pipe symbol.",
        default_answer : "Default Answer",
        rows : "Rows",
        cols : "Cols",
        fill_multiline_help1 : "By default, all the options provided are correct.",
        matchlist_heading1 : "List 1 heading",
        matchlist_heading2 : "List 2 heading",
        matchlist_normal : "Normal",
        matchlist_dnd : "Drag & Drop",
        shuffle : "Click here to Shuffle",
        add_item : "Add item",
        allow_sort : "Sequence", //"Allow User to Sort",
        in_sentence : "Sentence",
        in_paragraph : "Paragraph",
        go_back : "Go Back",
        goback_header : "Confirmation",
        goback_confirmation : "Do you really want to go to item list?",
        sceneChange_confirmation: "Your changes will be lost. Do you want to save this content ? ",
        show_preview : "Preview",
        xml : "XML",
        back_authoring : "Back to Authoring",
        title : "Title",
        stem : "Stem",
        content : "Content",
        error : "Error",
        playertag : "Player Tag",
        equationeditor : "Equation Editor",
        error_occured : "Something went wrong, Please try again.",
        click_preview : "Click To Preview",
        loading_module : "Loading Module",
        something_wrong : "Something went wrong, Please try again.",
        reload : "Reload",
        search_here : "Search here...",
        all_item : "All Items",
        max_error : "More than 6 options may cause this item to not render properly on a smartphone.",
        reset : "Reset",
        resetDB : "Reset DB",
        calculate_answer : "Calculating Answer",
        add : "Add",
        remove : "Remove",
        correct_answer : "Correct Answer",
        your_answer : "Your Answer",
        correct : "Correct",
        incorrect : "Incorrect",
        select_language : "Language",
        please_wait : "Please, be patient. We are working things up for you. ",
        sequence : "Sequence",
        multi_check : "Multi Check",
        default : "Default",
        heading_correct : "Heading for correct list item",
        heading_all : "Heading for all list item",
        open_doc : "uCertify Team has open this content for editing. Your changes might be lost.",
        getting_diff : "Please, be patient. We are calculating the differences for you.",
        getting_list : "Please, be patient. We are generating the list for you.",
        restore_currect : "Restore Current Version",
        submit : "Submit",
        getting_webpage : "Please, be patient. We are generating the Webpage list for you.",
        getting_docx : "Please, be patient. We are generating the Content in Docx Formatting for you.",
        getting_help : "Please, be patient. We are generating the help for you.",
        warning : "Warning!",
        row_limit : "You have reached the minimum number of rows you can delete.",
        col_limit : "You have reached the minimum number of columns you can delete.",
        del_confirmation : "Are you sure you want to delete it?",
        wrong_value_information : "Values of the row and column should always be multiples of ",
        min_row_col_value : "Insufficient value to make a table; there should be atleast four values.",
        provide_value_suggestion : "Insufficient value to make a table; please increase or decrease the value by 1.",
        totaloption : 'Total number of values available : ',
        max_row_col_error : "More than five rows and five columns may not render properly on a smartphone.",
        create_existing_variable : "Create Existing Variable",
        create_new_variable : "Create New variable",
        update_variable : "Update Variable",
        use_existing_variable : "Use existing variable",
        help : "Help",
        create_variable : "Create Variable",
        all_function_help : "* Do not give a variable name containing space.",
        randInt_function_help : "* Default value will be 1.",
        randint_randfloat_function_help1 : "* This function is used to find a random number between two given numbers.",
        randint_randfloat_function_help2 : "* Do not provide the non-integer value in the minimum and maximum fields.",
        randint_randfloat_function_help3 : "* Minimum value should always be less than the maximum value.",
        randobj_function_help1 : "* This function is used to find a random character or string separated by "+"\",\" (comma).",
        randobj_function_help2 : "* Provide the value like Java, React, Php, and C.",
        custom_function_help1 : "* This function is used to solve any expression.",
        custom_function_help2 : "* Some of the functions take a character/word as an argument so the argument must be passed between the # (hash) symbol.",
        custom_function_help3 : "* If you want to find Intersection, then the argument must be passed like this: math.setIntersect([#a#,#b#],[#a#,#b#,#c#]).",
        custom_function_help4 : "* If you want to find Differentiation, then the argument must be passed like this: math.derivative(#var1*obj1<sup>var2</sup>-var3*obj1+var4#,#obj1#).",
        edit_token: "Highlight correct token",
        edit_template: "Enter text",
        word: "Word",
        sentance: "Sentence",
        paragraph: "Paragraph",
        clear: "Clear",
        no_of_token: "Selected",
        token_highlight: "Token Highlight",
        direction: "Direction:",
        enableline : "Enable-line",
        language: "Language",
        add_testcase: "Add Testcase",
        run: "Run",
        run_code: "Run Code",
        html_css_js: "HTML/ CSS/ JS",
        input: "Input",
        output: "Output",
        testcases: "Testcases",
        close: "Close",
        pre: "Pre",
        post: "Post",
        editor: "Editor",
        save_variable : "Save Variables",
        create_steps : "Create Steps",
        plain_text : "Plain text",
        interactive : "Interactive",
        no_validation : "No validation",
        sticky : "Sticky",
        "delete" : "Delete",
        confirm_delete_variable : "If this variable is used in steps it will be treated as text. Are you sure you want to delete it?",
        next : "Next",
        solve : "Solve",
        functions: "Functions",
        Allsymbols: "All Symbols",
        Basic: "Basic",
        xvariables: "x",
        sin: "sin",
        Misc: "Misc",
        Discrete: "Discrete",
        kg: "kg",
        lb: "lb",
        brackets: "Brackets",
        algo_xml: "Algo XML",
        val_variations: "Values variations",
        chem: "Chem",
        tools: "Tools",
        domain: "Domain",
        exam_objective: "Exam Objective",
        web_pages: "Web pages",
        docx_formatting: "Docx Formatting",
        analyze_ebook: "Analyze Ebook Item",
        inline: "Inline",
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        strikethrough: "Strikethrough",
        superscript: "Superscript",
        subscript: "Subscript",
        small: "Small",
        subtype: "Tag SubType:",
        showangle: "Show Angle",
        alignment: "Alignment:",
        raw: "RAW",
        html: "HTML",
        css: "CSS",
        js: "JS",
        result: "Result",
        autograde: "Autograde",
        disable: "Disable/Hide",
        editable: "Editable",
        hidden: "Hidden",
        disabled: "Disabled",
        internalScript: "Internal Script",
        externalScript: "External Script",
        detail: "Detail",
        element_name: "Element Name",
        convert: "Convert",
        analyze_content: "Analyze Content",
        analyzing: "Analyzing",
        show_more: "Show more",
        show_less: "Show less",
        task:"Task",
        task_objective:"Task Objective",
        textsnippet:"Text Snippet",
        sectiondetail:"Section Details",
        tags:"Tags",
        item:"Item",
        itemType:"Item Type",
        type:"Type",
        comments:"Comments",
        cognitive_level:"Cognitive Level",
        refer_content:"Refer Content",
        create_equation:"Create Equation",
        help_video:"Help Video",
        diagnostic:"Diagnostic",
        keyboard_shortcut:"Keyboard Shortcut",
        delete_exist_element: "Are you sure you want to delete existing elements?",
        edit_dialog: "Edit Dialog",
        update: "Update",
        add_category: "Add Category",
        import_csv: "Import CSV",
        create_new_question: "Create New Question",
        max: "Max",
        min: "Min",
        step: "step",
        slider: "Slider",
        oops_msg: "Oops! Something went wrong please check your ParseXML Function.",
        minimum: "Minimum",
        maximum: "Maximum",
        step: "Step",
        ignore_grading: "Ignore grading",
        eval_ada1_msg: "1. Press 'CTRL+SHIFT+Enter key' to RUN the code",
        eval_ada2_msg: "2. Press 'CTRL+SHIFT+SPACE key' to goto Input/Output side",
        eval_ada_info: "ADA Information",
        annotationId: "Enter image annotation item ID here",
        annotationPlaceholder: "Enter image annotation title here",
        imageAnnotation: "An annotation player is used to add the image annotation in the middle of the e-book lessons.",
        select_lang: "Please select language",
        show_transcript: "Show transcript",
        audio_recorder: "Audio Recorder",
        starting_message: "Click on record to start recording",
        spoken_label: "What we heard",
        note_label: "Note: ",
        insensitive_message: "Matching is case insensitive.",
        recording_warning: "Recording will end automatically after 15 sec.",
        english_us: "English (United States)",
        english_in: "English (U.K.)",
        italiano: "Italian",
        suomi: "Finnish",
        svenska: "Swedish",
        confirm_label: "Confirm",
        modal_data: "It will override the previous recording. Do you want to continue?",
        no_label: "No",
        yes_label: "Yes",
        browser_support_msg: "Your browser does not support this feature. Please use latest version of chrome browser to use this feature.",
        recording_ended: "Recording ended.",
        no_data_msg: "No recorded data found.",
        matching_msg: "No matching data is found.",
        space_warning: "Do not use more than one space unnecessary.",
        separate_by_quote: "separate with &quot; , &quot",
        pre_code: "pre code",
        write_function_here: "Write your function here...",
        postcode: "post code",
        seperate_by_enter_key: "Separate input by 'enter' key",
        minus_1: "-1",
        case_insensitive: "Case Insensitive",
        partial_matching: "Partial Matching",
        partial_match: "Partial Match",
        special_char: "Special Char",
        input_seperated_comma: "Input seperated by ','",
        ignore_special_char: "Ignore Special Char",
        testcase: "TestCase",
        markPointColor: "Point Color",
        lightGreen: "Light Green",
        black: "Black",
        orange : "Orange",
        select_case_match: "Select case match",
        decimal_position: "Please Enter the decimal position between 1 to ",
        grid_one_to_ten: "Number Must be between 1 to 10",
        col_less_one : "Column Not allowed less then 1",
        type_one_to_seven: "Please type between 1 to 7",
        row_less_one: "Row Not allowed less then 1",
        type_one_to_ten: "Please type between 1 to 10",
        double_digit: "Double digit not accepted",
        less_one : "Less then 1 not accepted",
        number_from: "Number insert only 0 to ",
        another_option: "Select another option",
        layout_options: "Layout Options",
        row_count: "Row Count",
        col_count: "Column Count",
        empty_field: "Field value can not be empty",
        lock_author_cell: "To Lock author shaded cells, it should be part of correct answer",
        delete_graph: 'Click on this button to delete the graph',
        delete_chart: 'Click on this button to delete the last point of the chart',
        ada_graph_msg: 'Press any key on this button to open modalbox to set the point for draw the graph without click on the graph board',
        ada_chart_msg: 'Press any key on this button to open modalbox to set the point for draw the chart without click on the chart board',
        add_chart_msg: 'Click on this button to add the point on the chart',
        edit_graph: 'Click on this button to open modalbox for change the graph view',
        edit_chart: 'Click on this button to open modalbox for change the chart view',
        validate_dialog: 'You have to put the image name',
        ada_message: "use control plus alt plus 1 to open the dialog for perform the task",
        token_message: "Please use ##pt for dot (.) and #cm for comma (,).",
        button_text: 'Shown on the button at the bottom of the intro screen.',
        level_text: 'Level',
        insert_note: 'Insert Note',
        load_more: 'Load More',
        placeholder_text: 'Enter the name of button',
        name_text: 'Name',
        note_placeholder: 'Insert text here',
        level_placeholder: 'Enter the label message',
        knowledge_check: 'This player tag is used to add questions in the middle of the ebook lessons.',
        enter_title: 'Enter the title',
        multi_item_id: 'Enter the comma-separated item id(s)',
        item_id: 'Item ID',
        graded: 'Graded Item(s)',
        coding: 'This player tag is used to test the web module’s XML and display its preview simultaneously in the ebook lessons.',
        simulation: 'This player tag is used to create menu-based questions in Word or Excel, in which only the tabs are working.',
        terminal: 'This player tag is used to add the Linux, DOS, or Java module questions in the middle of the ebook lessons.',
        lablink: 'This player tag is used to add live labs in the mid of ebook lessons which can then be clicked and opened in a new tab.',
        insight: 'This player tag is used to add the 3D chat questions in the middle of the ebook lessons.',
        playground: 'Coding Lab',
        simulation_txt: 'Simulation',
        terminal_txt: 'Terminal',
        livelab: 'Live Lab',
        lab3d: '3D Lab',
        java_txt: 'Java',
        linux_txt: 'Linux',
        dos_txt: 'DOS',
        default_val: 'Enter the default value. Example: dialog_name=options',
        enter_xml: 'Enter the XML',
        simulator_name: 'Simulator Name',
        simulator_place: 'Enter the simulator name. Example: msoffice-msword-2013',
        enter_item: 'Enter the item id',
        embed: 'Embed',
        new_tab: 'New Tab',
        overlay: 'Overlay',
        btn_name: 'Button Name',
        enter_btn_name: 'Enter the button name',
        correct_val: 'Enter the correct value. Example: dialog=fileoptionsdvanced',
        learn_mode: 'Learn Mode',
        audio_des: 'This player tag is used to add audios in the ebook lessons.',
        video_des: 'This player tag is used to add videos in the ebook lessons.',
        audio_txt: 'Audio',
        video_txt: 'Video',
        url_txt: 'URL',
        media_url: 'Enter the media url',
        transcript_id: 'Transcript ID',
        enter_id: 'Enter the transcript id',
        preview_img: 'Image Preview',
        preview_url: 'Enter the image preview url',
        security_info: 'This is required security configuration',
        security_txt: 'Security',
        security_place: "Enter the security data in json format {'token': '45674', 'wID': '89765'}",
        security_title: "Put the security data in json for example {'token': '45674', 'wID': '89765'}.",
        multiple_video: 'Multiple Videos',
        multiple_info: 'All media on this page will be grouped together in a single carousel.',
        add_interval: 'Add Interval',
        interval_txt: 'Interval',
        in_sec: '(In seconds)',
        action_txt: 'Action',
        caption_txt: 'Caption',
        one_num: '1',
        download_info: 'This player tag is used to attach pdf files, word documents, excel files, powerpoint presentations, or any kind of attachment in the ebook lessons.',
        pdf_info: 'This player tag is used to add the pdf files in the ebook lessons.',
        exhibit_info: 'This player tag is used to add an image or a table in a modal box in quizzes or questions.',
        weblink_info: 'This player tag is used to add the “Click to read” link, having an image in its background, in the middle of the ebook lessons, which redirects a user to the new link or web page.',
        download_txt: 'Download',
        exhibit_txt: 'Exhibit',
        pdf_txt: 'PDF',
        weblink_txt: 'Web Link',
        image_txt: 'Image',
        text: 'Text',
        select_img: 'Select an image',
        ms_access: 'MS Access',
        ms_excel: 'MS Excel',
        ms_word: 'MS Word',
        sas_txt: 'SAS',
        zip_txt: 'Zip',
        show_caption: 'Show Button Caption',
        img_show: 'When image will be shown',
        hide_caption: 'Hide Button Caption',
        img_hide: 'When image will be hide',
        btn_txt: 'Button',
        link_txt: 'Link',
        enter_url: 'Enter the url',
        enter_img_url: 'Enter the image url',
        enter_icon_url: 'Enter the image icon url',
        insert_img: 'Insert Image',
        img_alt: 'Image Alt',
        img_desc: "Enter the image's description in brief",
        img_height: 'Enter the image height. Example: 500px',
        frame_height: 'Enter the frame height. Example: 500px',
        frame_ht: 'Frame Height',
        imgage_ht: 'Image Height',
        img_width: 'Image Width',
        enter_img_width: 'Enter the image width. Example: 500px',
        enter_txt: 'Enter the text',
        border_txt: 'Bordered',
        player3d_des: 'A 3D Player tag is used to add images with their descriptions in a 3D structure in the middle of the e-book lessons.',
        snt_des: 'A UC Snt tag is used to add a statement notifying students that more than one option is correct for the given quiz or question.',
        snt_41: 'Each correct answer represents a complete solution. Choose all that apply.',
        snt_40: 'Each correct answer represents a part of the solution. Choose all that apply.',
        snt_39: 'Each correct answer represents a complete solution. Choose three.',
        snt_38: 'Each correct answer represents a part of the solution. Choose three.',
        snt_37: 'Each correct answer represents a complete solution. Choose two.',
        snt_36: 'Each correct answer represents a part of the solution. Choose two.',
        des_txt: 'Description',
        seq_des: 'A UC Seq tag is used to refer the correct and incorrect options in the single/multiple choice questions.',
        enter_seq_title: 'Enter the sequence letter',
        seq_lable: 'Sequence Letter: use a, b, c, d etc. as per the option',
        can_not_del: 'You can not Delete Default Node',
        unable_to_get: 'Unable to get data due to some error.',
        multi_err: 'Multiple item ids are not allowed.',
        invalid_id: 'Invalid Item id.',
        know_check_txt: 'Knowledge Check',
        lab_txt: 'Lab',
        media_txt: 'Media',
        obj3d_txt: '3D Object',
        instruction_txt: 'Instruction',
        opt_ref: 'Option Reference',
        edit_txt: 'Edit',
        list_content: 'List Contents',
        create_new_txt: 'Create New',
        search_item_txt: 'Search Item ID or text',
        no_record: 'No Record Found.',
        scorm_txt: 'Scorm',
        scorm_id: 'Scorm ID',
        scorm_place: 'Enter the scorm transcript id',
        mobile_url: 'Mobile URL',
        mobile_url_place: 'Enter the scorm URL for mobile devices',
        scorm_url: 'Enter the scorm URL',
        width_warning: 'The image width must be in between 100px to 1000px',
        height_warning: 'The image height must be in between 80px to 550px',
        valid_link: 'Please add a valid video link or Check the format for adding the transcript!',
        required_field: 'Please enter all the required fields!',
        vtt_unvalid: 'VTT format is Not valid!',
        vtt_added: 'Transcript ID is added!',
        load_course : 'Please load a course first!',
        asset_not_empty: 'URL can\'t be empty!',
        vtt_exists: 'Transcript is present for this video. ID added!',
        no_title: 'Do not show video title',
        normal_mode: 'Light Mode',
        dark_mode: 'Dark Mode',
        figure_caption_text: 'Figure caption',
        edit_marker_text: 'Edit Marker',
        markers_text: 'Markers',
        upload_media_text: 'Upload Media',
        image_url: 'Image Url',
        image_alt_type: 'Image Alt Text',
        are_you_sure_you_want_to_delete_marker: 'Are you sure you want to delete the marker?',
        add_image_text: 'Add image',
        upload_text: 'Upload',
        file_extension_text: 'File Extensions',
        number_of_files: 'Number of files',
        you_can_upload: '#You can upload upto 10 files only.',
        date_correct_answer_field_placeholder: 'Define The Date For Correct Answer',
        correct_answer_field_placeholder: 'Define The Value For Correct Answer',
        duration: 'Duration',
        vtt: 'VTT',
        enter_vtt: 'Enter VTT Here',
        add_vtt: 'ADD',
        add_transcript_msg: 'Add Transcript',
        edit_transcript_msg: 'Edit Transcript',
        edit_msg: 'Edit',
        parent_guid_found: 'You cannot make changes in a child item. Do you want to open the parent item for making changes?',
        del_row: 'Delete',
        update_child: 'Update Child Items',
        show_child: 'Show Child Item',
        show_all: 'Show all child items',
        generate_item: 'Generate Items',
        plz_sel: 'Please Select',
        csv_file: 'Import .csv file',
        show_all_label: 'Open',
        save_war_msg: 'The current item should be saved first before generating child items',
        generate_items: 'Generate child items',
        already_generated: 'Child items already generated',
        child_not_generated: 'Child items not generated yet',
        new_not_allowed: 'New .csv file cannot be added now, item already created',
        add_option: 'Add Option',
        add_child: 'Add row(s)',
        child_not_selected: 'Child items not selected yet',
        child_update: 'Changes have been made to the parent item. Do you want to update the child items?',
        deletion_not_allowed: 'Child items are created. Deletion is not allowed now',
        update_item: 'Update Item(s)',
        new_row_tooltip: 'New row(s) added. Update child items',
        interval_err: "Video interval can not be more than video duration",
        image_prev_msg: "Image preview cannot be added as video has intervals.",
        video_url_err: "Please add a valid video url",
        delete_warning: 'Do you really want to delete this form block?',
        add_elm: 'Add Elements',
        set_seq: 'Set Sequence',
        pass_elem: 'Password',
        num_elem: 'Number',
        time_elem: 'Time',
        textarea_elem: 'Long Message',
        text_elem: 'Short Message',
        file_elem: 'Upload Image',
        linear_elem: 'Linear Scale',
        select_elem: 'Drop Down',
        chk_elem: 'Checkbox',
        rad_elem: 'Radio',
        date_elem: 'Date',
        add_point: 'Add point',
        set_ans: 'Set Answer',
        ok_btn: 'OK',
        snap_to: 'SnapTo',
        yinterval_val: 'Y (enter multiple values)',
        xinterval_val: 'X (enter multiple values)',
        set_color: 'Set Color',
        primary_color: 'Primary',
        warning_color: 'Warning',
        danger_color: 'Danger',
        default_representation: 'Default representation of chart.',
        xaxis_title: 'X-axis Title',
        yaxis_title: 'Y-axis Title',
        chart_title: 'Chart Title',
        column_label: 'Column',
        line_label: 'Line',
        histogram_label: 'Histogram',
        height_label: 'Height [px]',
        width_label: 'Width [px]',
        chart_label: 'Chart',
        plot_graph: 'Plot Graph',
        xaxis_label: 'X-axis',
        yaxis_label: 'Y-axis',
        xaxis_interval: 'X-axis interval',
        yaxis_interval: 'Y-axis interval',
        width_label1: 'Width',
        height_label1: 'Height',
        axis_label: 'Axis',
        number_line_association: 'Numberline Association',
        numberline_plot: 'Numberline Plot',
        fill_warning: 'Please fill out this field',
        equation: 'Equation',
        both_xy: 'Both X & Y',
        only_x: 'X',
        only_y: 'Y',
        inequality_num: 'Inequality Number Line Equation:',
        equation_type: 'Equation Type',
        standard_form: 'Standard Form : y=m*x+c',
        circle_form: 'Standard Form : (x-x1)^2 + (y-y1)^2 = r^2',
        parabola_form: 'Vertex Form : y=a*(x-h)^2+k',
        sin_form: 'Standard Form : y=a*sin(b*x+c)+d',
        cos_form: 'Standard Form : y=a*cos(b*x+c)+d',
        polygon_type: 'Polygon Type',
        point_graph: 'Point Graph',
        line_graph: 'Line Graph',
        circle_graph: 'Circle Graph',
        ray_graph: 'Ray Graph',
        segment_graph: 'Segment Graph',
        vector_graph: 'Vector Graph',
        parabola_graph: 'Parabola Graph',
        sine_graph: 'Sine Graph',
        cos_graph: 'Cosine Graph',
        polygon_graph: 'Polygon Graph',
        association: 'Association',
        current_item: 'Current Item',
        used_in_items: 'Used In Items',
        file_uploaded: 'File uploaded successfully.',
        html5_not_supported: 'Browser does not support HTML5.',
        upload_valid_csv: 'Please upload a valid .csv file.',
        exact2_column_allowed: 'Exact 2 columns should be present in the .csv file. Upload denied.',
        blank_column_notallowed: 'Blank cell(s) found in the .csv file. Upload denied.',
        min_max_validation: 'Minimum 4 rows and maximum 500 rows are allowed in the .csv file. Upload denied.',
        check_network: 'Something went wrong. Please check your network connection and click the "Generate Items" button again.',
        min4_max500_allowed: 'Minimum 4 rows and maximum 500 rows are allowed for generate the child items.',
        child_items_generated: 'Child items generated successfully.',
        check_net_and_save: 'Something went wrong. Please check your network connection and save the current item.',
        min4_rows_allowed: 'Minimum number of rows should be 4.',
        child_updated: 'Child IDs updated successfully.',
        max500_rows_allowed: 'Maximum number of rows should be 500.',
        check_net_update_ids: 'Something went wrong. Please check your network connection and update the IDs again.',
        fill_required_field: 'Please fill all the required Field! ',
        image_width_range: 'Image width must be between 400px and 600px!',
        edit_image: 'Edit Image',
        image_url: 'Image URL',
        browse: 'Browse',
        image_alt: 'Image Alt',
        image_caption: 'Image Caption',
        image_width: 'Image Width',
        marker_color: 'Marker Color',
        text_align: 'Text Align',
        bottom: 'Bottom',
        on_click: 'On Click',
        mark_symbol: 'Mark Symbol',
        number_marker:'Number Marker',
        plus_marker:'Plus Marker',
        checkmark_marker:'Checkmark Marker',
        cross_marker:'Cross Marker',
        earth_marker:'Earth Marker',
        notification_marker:'Notification Marker',
        radio_marker:'Radio Marker',
        minus_marker:'Minus Marker',
        border: 'Border',
        copy: 'Copy',
        delete_points: 'Delete Points',
        delete_no_of_points: 'To delete the numbers or symbols from the list, delete their mark points.',
        change_image: "Changing Image or Image Width will reposition the markers (Not accurate).\n\n Do you want to reposition markers or reset the data?",
        reposition: 'Reposition',
        delete_confirmation: 'Deleting point will remove its content too! Do you want to delete?',
        copid_paste: ' copied, Click to Paste!',
        point: 'Point',
        deleted_text: ' Deleted!',
        image_err: 'Make Sure all the required fields are non-empty and Image width must be between 400px and 600px!',
        image_alt_text: 'Image Alternative Text ',
        reset_data: 'Do you really want to reset data?',
        delete_row: 'Delete Row',
        delete_column: 'Delete Column',
        min_val: 'Min Value',
        max_val: 'Max Value',
        current_val: 'Current Value',
        correct_val: 'Correct Answer',
        add_slider: 'Add Slider',
        canvas_options: 'Canvas Options',
        cell_width: 'Cell Width',
        multiple_of: 'Multiple of',
        cell_height: 'Cell Height',
        author_shaded: 'Author Shaded',
        lock_shaded_cells: 'Lock shaded cells',
        set_corr_ans: 'Set correct answer(s)',
        method: 'Method',
        set_corr_loc: 'Set Correct Location',
        set_corr_count: 'Set Correct Count',
        you_were_req_to_select: 'You were required to select',
        grid_mark_ans_correct: 'grids to mark the answer correct.',
        hindi_lang: 'Hindi',
        spanish_lang: 'Spanish',
        french_lang: 'French',
        german_lang: 'German',
        japanese_lang: 'Japanese',
        korean_lang: 'Korean',
        drag_drop_set_seq_msg: 'Drag and Drop to set sequence.'
    };
    window.LANG = l;
    var language = l;

    /* helper\ItemHelper.svelte generated by Svelte v3.29.0 */

    const { document: document_1 } = globals;

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-ri6gyf-style";
    	style.textContent = ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}";
    	append(document_1.head, style);
    }

    // (23:4) {#if reviewMode}
    function create_if_block(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Correct Answer";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Your Answer";
    			attr(button0, "type", "button");
    			attr(button0, "mode", "c");
    			attr(button0, "class", "btn btn-light correct-ans");
    			attr(button1, "type", "button");
    			attr(button1, "mode", "u");
    			attr(button1, "class", "btn btn-light your-ans active");
    			attr(div, "class", "smControlerBtn btn-group");
    			attr(div, "role", "group");
    			attr(div, "aria-label", "Answer buttons");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, button0);
    			append(div, t1);
    			append(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*handleSmClick*/ ctx[2]),
    					listen(button1, "click", /*handleSmClick*/ ctx[2])
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment(ctx) {
    	let center;
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = /*reviewMode*/ ctx[0] && create_if_block(ctx);

    	return {
    		c() {
    			center = element("center");
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr(button0, "type", "button");
    			attr(button0, "class", "h h-imp");
    			attr(button0, "id", "set-review");
    			attr(button1, "type", "button");
    			attr(button1, "class", "h h-imp");
    			attr(button1, "id", "unset-review");
    			attr(center, "class", "pb-2");
    		},
    		m(target, anchor) {
    			insert(target, center, anchor);
    			append(center, button0);
    			append(center, t0);
    			append(center, button1);
    			append(center, t1);
    			if (if_block) if_block.m(center, null);

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*click_handler*/ ctx[4]),
    					listen(button1, "click", /*click_handler_1*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (/*reviewMode*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(center, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(center);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { reviewMode = false } = $$props;
    	let { handleReviewClick } = $$props;
    	const dispatch = createEventDispatcher();

    	function handleSmClick(event) {
    		document.querySelectorAll(".smControlerBtn button").forEach(el => el.classList.remove("active"));
    		event.target.classList.add("active");
    		if (handleReviewClick) handleReviewClick(event.target.getAttribute("mode"), event);
    	}

    	const click_handler = () => dispatch("setReview");
    	const click_handler_1 = () => dispatch("unsetReview");

    	$$self.$$set = $$props => {
    		if ("reviewMode" in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ("handleReviewClick" in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
    	};

    	return [
    		reviewMode,
    		dispatch,
    		handleSmClick,
    		handleReviewClick,
    		click_handler,
    		click_handler_1
    	];
    }

    class ItemHelper extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1.getElementById("svelte-ri6gyf-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 });
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /**!
     * Sortable
     * @author	RubaXa   <trash@rubaxa.org>
     * @author	owenm    <owen23355@gmail.com>
     * @license MIT
     */

    var Sortable = createCommonjsModule(function (module) {
    (function sortableModule(factory) {

    	{
    		module.exports = factory();
    	}
    })(function sortableFactory() {

    	if (typeof window === "undefined" || !window.document) {
    		return function sortableError() {
    			throw new Error("Sortable.js requires a window with a document");
    		};
    	}

    	var dragEl,
    		parentEl,
    		ghostEl,
    		rootEl,
    		nextEl,
    		lastDownEl,
    		lastSwapEl,

    		cloneEl,
    		multiDragClones = [],
    		cloneHidden,

    		scrollEl,
    		scrollParentEl,
    		scrollCustomFn,

    		oldIndex,
    		newIndex,

    		activeGroup,
    		putSortable,

    		autoScrolls = [],
    		scrolling = false,

    		awaitingDragStarted = false,
    		ignoreNextClick = false,
    		sortables = [],

    		pointerElemChangedInterval,
    		lastPointerElemX,
    		lastPointerElemY,

    		multiDragElements = [],
    		lastMultiDragSelect, // for selection with modifier key down (SHIFT)
    		multiDragSortable,

    		tapEvt,
    		touchEvt,

    		moved,

    		lastTarget,
    		lastDirection,
    		pastFirstInvertThresh = false,
    		isCircumstantialInvert = false,

    		targetMoveDistance,

    		forRepaintDummy,
    		realDragElRect, // dragEl rect after current animation

    		/** @const */
    		R_SPACE = /\s+/g,

    		expando = 'Sortable' + (new Date).getTime(),

    		win = window,
    		document = win.document,
    		parseInt = win.parseInt,
    		setTimeout = win.setTimeout,

    		$ = win.jQuery || win.Zepto,
    		Polymer = win.Polymer,

    		captureMode = {
    			capture: false,
    			passive: false
    		},

    		IE11OrLess = !!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie|iemobile)/i),
    		Edge = !!navigator.userAgent.match(/Edge/i),
    		// FireFox = !!navigator.userAgent.match(/firefox/i),

    		CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',

    		// This will not pass for IE9, because IE9 DnD only works on anchors
    		supportDraggable = ('draggable' in document.createElement('div')),

    		supportCssPointerEvents = (function() {
    			// false when <= IE11
    			if (IE11OrLess) {
    				return false;
    			}
    			var el = document.createElement('x');
    			el.style.cssText = 'pointer-events:auto';
    			return el.style.pointerEvents === 'auto';
    		})(),

    		_silent = false,

    		abs = Math.abs,
    		min = Math.min,

    		savedInputChecked = [],

    		_detectDirection = function(el, options) {
    			var elCSS = _css(el),
    				elWidth = parseInt(elCSS.width),
    				child1 = _getChild(el, 0, options),
    				child2 = _getChild(el, 1, options),
    				firstChildCSS = child1 && _css(child1),
    				secondChildCSS = child2 && _css(child2),
    				firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + _getRect(child1).width,
    				secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + _getRect(child2).width;
    			if (elCSS.display === 'flex') {
    				return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse'
    				? 'vertical' : 'horizontal';
    			}
    			if (child1 && firstChildCSS.float !== 'none') {
    				var touchingSideChild2 = firstChildCSS.float === 'left' ? 'left' : 'right';

    				return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ?
    					'vertical' : 'horizontal';
    			}
    			return (child1 &&
    				(
    					firstChildCSS.display === 'block' ||
    					firstChildCSS.display === 'flex' ||
    					firstChildCSS.display === 'table' ||
    					firstChildCSS.display === 'grid' ||
    					firstChildWidth >= elWidth &&
    					elCSS[CSSFloatProperty] === 'none' ||
    					child2 &&
    					elCSS[CSSFloatProperty] === 'none' &&
    					firstChildWidth + secondChildWidth > elWidth
    				) ?
    				'vertical' : 'horizontal'
    			);
    		},

    		/**
    		 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
    		 * @param  {Number} x      X position
    		 * @param  {Number} y      Y position
    		 * @return {HTMLElement}   Element of the first found nearest Sortable
    		 */
    		_detectNearestEmptySortable = function(x, y) {
    			for (var i = 0; i < sortables.length; i++) {
    				if (sortables[i].children.length) continue;

    				var rect = _getRect(sortables[i]),
    					threshold = sortables[i][expando].options.emptyInsertThreshold,
    					insideHorizontally = x >= (rect.left - threshold) && x <= (rect.right + threshold),
    					insideVertically = y >= (rect.top - threshold) && y <= (rect.bottom + threshold);

    				if (insideHorizontally && insideVertically) {
    					return sortables[i];
    				}
    			}
    		},

    		_getParentAutoScrollElement = function(el, includeSelf) {
    			// skip to window
    			if (!el || !el.getBoundingClientRect) return _getWindowScrollingElement();

    			var elem = el;
    			var gotSelf = false;
    			do {
    				// we don't need to get elem css if it isn't even overflowing in the first place (performance)
    				if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
    					var elemCSS = _css(elem);
    					if (
    						elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') ||
    						elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')
    					) {
    						if (!elem || !elem.getBoundingClientRect || elem === document.body) return _getWindowScrollingElement();

    						if (gotSelf || includeSelf) return elem;
    						gotSelf = true;
    					}
    				}
    			/* jshint boss:true */
    			} while (elem = elem.parentNode);

    			return _getWindowScrollingElement();
    		},

    		_getWindowScrollingElement = function() {
    			if (IE11OrLess) {
    				return document.documentElement;
    			} else {
    				return document.scrollingElement;
    			}
    		},

    		_getScrollPosition = function(el) {
    			return [ el.scrollLeft, el.scrollTop ];
    		},

    		_scrollBy = function(el, x, y) {
    			el.scrollLeft += x;
    			el.scrollTop += y;
    		},

    		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl, /**Boolean*/isFallback) {
    			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
    			if (options.scroll) {
    				var _this = rootEl ? rootEl[expando] : window,
    					sens = options.scrollSensitivity,
    					speed = options.scrollSpeed,

    					x = evt.clientX,
    					y = evt.clientY,

    					winScroller = _getWindowScrollingElement(),

    					scrollThisInstance = false;

    				// Detect scrollEl
    				if (scrollParentEl !== rootEl) {
    					_clearAutoScrolls();

    					scrollEl = options.scroll;
    					scrollCustomFn = options.scrollFn;

    					if (scrollEl === true) {
    						scrollEl = _getParentAutoScrollElement(rootEl, true);
    						scrollParentEl = scrollEl;
    					}
    				}


    				var layersOut = 0;
    				var currentParent = scrollEl;
    				do {
    					var	el = currentParent,
    						rect = _getRect(el),

    						top = rect.top,
    						bottom = rect.bottom,
    						left = rect.left,
    						right = rect.right,

    						width = rect.width,
    						height = rect.height,

    						scrollWidth,
    						scrollHeight,

    						css,

    						vx,
    						vy,

    						canScrollX,
    						canScrollY,

    						scrollPosX,
    						scrollPosY;


    					scrollWidth = el.scrollWidth;
    					scrollHeight = el.scrollHeight;

    					css = _css(el);

    					scrollPosX = el.scrollLeft;
    					scrollPosY = el.scrollTop;

    					if (el === winScroller) {
    						canScrollX = width < scrollWidth && (css.overflowX === 'auto' || css.overflowX === 'scroll' || css.overflowX === 'visible');
    						canScrollY = height < scrollHeight && (css.overflowY === 'auto' || css.overflowY === 'scroll' || css.overflowY === 'visible');
    					} else {
    						canScrollX = width < scrollWidth && (css.overflowX === 'auto' || css.overflowX === 'scroll');
    						canScrollY = height < scrollHeight && (css.overflowY === 'auto' || css.overflowY === 'scroll');
    					}

    					vx = canScrollX && (abs(right - x) <= sens && (scrollPosX + width) < scrollWidth) - (abs(left - x) <= sens && !!scrollPosX);

    					vy = canScrollY && (abs(bottom - y) <= sens && (scrollPosY + height) < scrollHeight) - (abs(top - y) <= sens && !!scrollPosY);


    					if (!autoScrolls[layersOut]) {
    						for (var i = 0; i <= layersOut; i++) {
    							if (!autoScrolls[i]) {
    								autoScrolls[i] = {};
    							}
    						}
    					}

    					if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
    						autoScrolls[layersOut].el = el;
    						autoScrolls[layersOut].vx = vx;
    						autoScrolls[layersOut].vy = vy;

    						clearInterval(autoScrolls[layersOut].pid);

    						if (el && (vx != 0 || vy != 0)) {
    							scrollThisInstance = true;
    							/* jshint loopfunc:true */
    							autoScrolls[layersOut].pid = setInterval((function () {
    								// emulate drag over during autoscroll (fallback), emulating native DnD behaviour
    								if (isFallback && this.layer === 0) {
    									Sortable.active._emulateDragOver(true);
    								}
    								var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
    								var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

    								if ('function' === typeof(scrollCustomFn)) {
    									if (scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt, touchEvt, autoScrolls[this.layer].el) !== 'continue') {
    										return;
    									}
    								}

    								_scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
    							}).bind({layer: layersOut}), 24);
    						}
    					}
    					layersOut++;
    				} while (options.bubbleScroll && currentParent !== winScroller && (currentParent = _getParentAutoScrollElement(currentParent, false)));
    				scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
    			}
    		}, 30),

    		_clearAutoScrolls = function () {
    			autoScrolls.forEach(function(autoScroll) {
    				clearInterval(autoScroll.pid);
    			});
    			autoScrolls = [];
    		},

    		_prepareGroup = function (options) {
    			function toFn(value, pull) {
    				return function(to, from, dragEl, evt) {
    					var sameGroup = to.options.group.name &&
    									from.options.group.name &&
    									to.options.group.name === from.options.group.name;

    					if (value == null && (pull || sameGroup)) {
    						// Default pull value
    						// Default pull and put value if same group
    						return true;
    					} else if (value == null || value === false) {
    						return false;
    					} else if (pull && value === 'clone') {
    						return value;
    					} else if (typeof value === 'function') {
    						return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
    					} else {
    						var otherGroup = (pull ? to : from).options.group.name;

    						return (value === true ||
    						(typeof value === 'string' && value === otherGroup) ||
    						(value.join && value.indexOf(otherGroup) > -1));
    					}
    				};
    			}

    			var group = {};
    			var originalGroup = options.group;

    			if (!originalGroup || typeof originalGroup != 'object') {
    				originalGroup = {name: originalGroup};
    			}

    			group.name = originalGroup.name;
    			group.checkPull = toFn(originalGroup.pull, true);
    			group.checkPut = toFn(originalGroup.put);
    			group.revertClone = originalGroup.revertClone;

    			options.group = group;
    		},

    		_isTrueParentSortable = function(el, target) {
    			var trueParent = target;
    			while (!trueParent[expando]) {
    				trueParent = trueParent.parentNode;
    			}

    			return el === trueParent;
    		},

    		_artificalBubble = function(sortable, originalEvt, method) {
    			// Artificial IE bubbling
    			var nextParent = sortable.parentNode;
    			while (nextParent && !nextParent[expando]) {
    				nextParent = nextParent.parentNode;
    			}

    			if (nextParent) {
    				nextParent[expando][method](_extend(originalEvt, {
    					artificialBubble: true
    				}));
    			}
    		},

    		_hideGhostForTarget = function() {
    			if (!supportCssPointerEvents && ghostEl) {
    				_css(ghostEl, 'display', 'none');
    			}
    		},

    		_unhideGhostForTarget = function() {
    			if (!supportCssPointerEvents && ghostEl) {
    				_css(ghostEl, 'display', '');
    			}
    		};


    	// #1184 fix - Prevent click event on fallback if dragged but item not changed position
    	document.addEventListener('click', function(evt) {
    		if (ignoreNextClick) {
    			evt.preventDefault();
    			evt.stopPropagation && evt.stopPropagation();
    			evt.stopImmediatePropagation && evt.stopImmediatePropagation();
    			ignoreNextClick = false;
    			return false;
    		}
    	}, true);

    	var nearestEmptyInsertDetectEvent = function(evt) {
    		evt = evt.touches ? evt.touches[0] : evt;
    		if (dragEl) {
    			var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

    			if (nearest) {
    				nearest[expando]._onDragOver({
    					clientX: evt.clientX,
    					clientY: evt.clientY,
    					target: nearest,
    					rootEl: nearest
    				});
    			}
    		}
    	};
    	// We do not want this to be triggered if completed (bubbling canceled), so only define it here
    	_on(document, 'dragover', nearestEmptyInsertDetectEvent);
    	_on(document, 'mousemove', nearestEmptyInsertDetectEvent);
    	_on(document, 'touchmove', nearestEmptyInsertDetectEvent);


    	var _checkOutsideTargetEl = function(evt) {
    		if (dragEl) {
    			dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
    		}
    	};


    	/**
    	 * @class  Sortable
    	 * @param  {HTMLElement}  el
    	 * @param  {Object}       [options]
    	 */
    	function Sortable(el, options) {
    		if (!(el && el.nodeType && el.nodeType === 1)) {
    			throw 'Sortable: `el` must be HTMLElement, not ' + {}.toString.call(el);
    		}

    		this.el = el; // root element
    		this.options = options = _extend({}, options);


    		// Export instance
    		el[expando] = this;

    		// Default options
    		var defaults = {
    			group: null,
    			sort: true,
    			disabled: false,
    			store: null,
    			swap: false,
    			handle: null,
    			scroll: true,
    			scrollSensitivity: 30,
    			scrollSpeed: 10,
    			bubbleScroll: true,
    			draggable: /[uo]l/i.test(el.nodeName) ? '>li' : '>*',
    			swapThreshold: 1, // percentage; 0 <= x <= 1
    			invertSwap: false, // invert always
    			invertedSwapThreshold: null, // will be set to same as swapThreshold if default
    			removeCloneOnHide: true,
    			direction: function() {
    				return _detectDirection(el, this.options);
    			},
    			ghostClass: 'sortable-ghost',
    			chosenClass: 'sortable-chosen',
    			dragClass: 'sortable-drag',
    			swapClass: "sortable-swap-highlight",
    			selectedClass: 'sortable-selected', // for multi-drag
    			ignore: 'a, img',
    			filter: null,
    			preventOnFilter: true,
    			animation: 0,
    			easing: null,
    			setData: function (dataTransfer, dragEl) {
    				var data = '';
    				if (multiDragElements.length) {
    					for (var i = 0; i < multiDragElements.length; i++) {
    						data += (!i ? '' : ', ') + multiDragElements[i].textContent;
    					}
    				} else {
    					data = dragEl.textContent;
    				}
    				dataTransfer.setData('Text', data);
    			},
    			dropBubble: false,
    			dragoverBubble: false,
    			dataIdAttr: 'data-id',
    			delay: 0,
    			touchStartThreshold: parseInt(window.devicePixelRatio, 10) || 1,
    			forceFallback: false,
    			fallbackClass: 'sortable-fallback',
    			fallbackOnBody: false,
    			fallbackTolerance: 0,
    			fallbackOffset: {x: 0, y: 0},
    			supportPointer: Sortable.supportPointer !== false && (
    				('PointerEvent' in window) ||
    				window.navigator && ('msPointerEnabled' in window.navigator) // microsoft
    			),
    			emptyInsertThreshold: 5,
    			multiDrag: false
    		};


    		// Set default options
    		for (var name in defaults) {
    			!(name in options) && (options[name] = defaults[name]);
    		}

    		_prepareGroup(options);

    		// Bind all private methods
    		for (var fn in this) {
    			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
    				this[fn] = this[fn].bind(this);
    			}
    		}

    		// Setup drag mode
    		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

    		// Bind events
    		if (options.supportPointer) {
    			_on(el, 'pointerdown', this._onTapStart);

    			_on(document, 'pointerup', this._deselectMultiDrag);
    		} else {
    			_on(document, 'mouseup', this._deselectMultiDrag);
    			_on(document, 'touchend', this._deselectMultiDrag);

    			_on(el, 'mousedown', this._onTapStart);
    			_on(el, 'touchstart', this._onTapStart);
    		}

    		if (this.nativeDraggable) {
    			_on(el, 'dragover', this);
    			_on(el, 'dragenter', this);
    		}

    		sortables.push(this.el);

    		// Restore sorting
    		options.store && options.store.get && this.sort(options.store.get(this) || []);
    	}

    	Sortable.prototype = /** @lends Sortable.prototype */ {
    		constructor: Sortable,

    		_isOutsideThisEl: function(target) {
    			if (!this.el.contains(target) && target !== this.el) {
    				lastTarget = null;
    			}
    		},

    		_getDirection: function(evt, target) {
    			return (typeof this.options.direction === 'function') ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
    		},

    		_onTapStart: function (/** Event|TouchEvent */evt) {
    			if (!evt.cancelable) return;
    			var _this = this,
    				el = this.el,
    				options = this.options,
    				preventOnFilter = options.preventOnFilter,
    				type = evt.type,
    				touch = evt.touches && evt.touches[0],
    				target = (touch || evt).target,
    				originalTarget = evt.target.shadowRoot && ((evt.path && evt.path[0]) || (evt.composedPath && evt.composedPath()[0])) || target,
    				filter = options.filter,
    				startIndex;

    			_saveInputCheckedState(el);

    			// IE: Calls events in capture mode if event element is nested. This ensures only correct element's _onTapStart goes through.
    			// This process is also done in _onDragOver
    			if (IE11OrLess && !evt.artificialBubble && !_isTrueParentSortable(el, target)) {
    				return;
    			}

    			// Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
    			if (dragEl) {
    				return;
    			}

    			if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
    				return; // only left button and enabled
    			}

    			// cancel dnd if original target is content editable
    			if (originalTarget.isContentEditable) {
    				return;
    			}

    			target = _closest(target, options.draggable, el, false);

    			if (!target) {
    				if (IE11OrLess) {
    					_artificalBubble(el, evt, '_onTapStart');
    				}
    				return;
    			}

    			if (lastDownEl === target) {
    				// Ignoring duplicate `down`
    				return;
    			}

    			// Get the index of the dragged element within its parent
    			startIndex = _index(target);

    			// Check filter
    			if (typeof filter === 'function') {
    				if (filter.call(this, evt, originalTarget, this)) {
    					_dispatchEvent(_this, originalTarget, 'filter', target, el, el, startIndex);
    					preventOnFilter && evt.cancelable && evt.preventDefault();
    					return; // cancel dnd
    				}
    			}
    			else if (filter) {
    				filter = filter.split(',').some(function (criteria) {
    					criteria = _closest(originalTarget, criteria.trim(), el, false);

    					if (criteria) {
    						_dispatchEvent(_this, criteria, 'filter', target, el, el, startIndex);
    						return true;
    					}
    				});

    				if (filter) {
    					preventOnFilter && evt.cancelable && evt.preventDefault();
    					return; // cancel dnd
    				}
    			}

    			if (options.handle && !_closest(originalTarget, options.handle, el, false)) {
    				return;
    			}

    			// Prepare `dragstart`
    			this._prepareDragStart(evt, touch, target, startIndex);
    		},


    		_handleAutoScroll: function(evt, fallback) {
    			if (!dragEl || !this.options.scroll) return;
    			var x = evt.clientX,
    				y = evt.clientY,

    				elem = document.elementFromPoint(x, y),
    				_this = this;

    			// IE does not seem to have native autoscroll,
    			// Edge's autoscroll seems too conditional,
    			// Firefox and Chrome are good
    			if (fallback || Edge || IE11OrLess) {
    				_autoScroll(evt, _this.options, elem, fallback);

    				// Listener for pointer element change
    				var ogElemScroller = _getParentAutoScrollElement(elem, true);
    				if (
    					scrolling &&
    					(
    						!pointerElemChangedInterval ||
    						x !== lastPointerElemX ||
    						y !== lastPointerElemY
    					)
    				) {

    					pointerElemChangedInterval && clearInterval(pointerElemChangedInterval);
    					// Detect for pointer elem change, emulating native DnD behaviour
    					pointerElemChangedInterval = setInterval(function() {
    						if (!dragEl) return;
    						// could also check if scroll direction on newElem changes due to parent autoscrolling
    						var newElem = _getParentAutoScrollElement(document.elementFromPoint(x, y), true);
    						if (newElem !== ogElemScroller) {
    							ogElemScroller = newElem;
    							_clearAutoScrolls();
    							_autoScroll(evt, _this.options, ogElemScroller, fallback);
    						}
    					}, 10);
    					lastPointerElemX = x;
    					lastPointerElemY = y;
    				}

    			} else {
    				// if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
    				if (!_this.options.bubbleScroll || _getParentAutoScrollElement(elem, true) === _getWindowScrollingElement()) {
    					_clearAutoScrolls();
    					return;
    				}
    				_autoScroll(evt, _this.options, _getParentAutoScrollElement(elem, false), false);
    			}
    		},

    		_prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
    			var _this = this,
    				el = _this.el,
    				options = _this.options,
    				ownerDocument = el.ownerDocument,
    				dragStartFn;

    			if (target && !dragEl && (target.parentNode === el)) {
    				rootEl = el;
    				dragEl = target;
    				parentEl = dragEl.parentNode;
    				nextEl = dragEl.nextSibling;
    				lastDownEl = target;
    				activeGroup = options.group;
    				oldIndex = startIndex;

    				tapEvt = {
    					target: dragEl,
    					clientX: (touch || evt).clientX,
    					clientY: (touch || evt).clientY
    				};

    				this._lastX = (touch || evt).clientX;
    				this._lastY = (touch || evt).clientY;

    				dragEl.style['will-change'] = 'all';
    				// undo animation if needed
    				dragEl.style.transition = '';
    				dragEl.style.transform = '';

    				dragStartFn = function () {
    					// Delayed drag has been triggered
    					// we can re-enable the events: touchmove/mousemove
    					_this._disableDelayedDrag();

    					// Make the element draggable
    					dragEl.draggable = _this.nativeDraggable;

    					// Bind the events: dragstart/dragend
    					_this._triggerDragStart(evt, touch);

    					// Drag start event
    					_dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, rootEl, oldIndex);

    					// Chosen item
    					_toggleClass(dragEl, options.chosenClass, true);
    				};

    				// Disable "draggable"
    				options.ignore.split(',').forEach(function (criteria) {
    					_find(dragEl, criteria.trim(), _disableDraggable);
    				});

    				if (options.supportPointer) {
    					_on(ownerDocument, 'pointerup', _this._onDrop);
    				} else {
    					_on(ownerDocument, 'mouseup', _this._onDrop);
    					_on(ownerDocument, 'touchend', _this._onDrop);
    					_on(ownerDocument, 'touchcancel', _this._onDrop);
    				}

    				if (options.delay) {
    					// If the user moves the pointer or let go the click or touch
    					// before the delay has been reached:
    					// disable the delayed drag
    					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
    					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
    					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
    					_on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
    					_on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
    					options.supportPointer && _on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);

    					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
    				} else {
    					dragStartFn();
    				}
    			}
    		},

    		_delayedDragTouchMoveHandler: function (/** TouchEvent|PointerEvent **/e) {
    			var touch = e.touches ? e.touches[0] : e;
    			if (min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY))
    					>= this.options.touchStartThreshold
    			) {
    				this._disableDelayedDrag();
    			}
    		},

    		_disableDelayedDrag: function () {
    			var ownerDocument = this.el.ownerDocument;

    			clearTimeout(this._dragStartTimer);
    			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
    			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    			_off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    			_off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    			_off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
    		},

    		_triggerDragStart: function (/** Event */evt, /** Touch */touch) {
    			touch = touch || (evt.pointerType == 'touch' ? evt : null);

    			if (!this.nativeDraggable || touch) {
    				if (this.options.supportPointer) {
    					_on(document, 'pointermove', this._onTouchMove);
    				} else if (touch) {
    					_on(document, 'touchmove', this._onTouchMove);
    				} else {
    					_on(document, 'mousemove', this._onTouchMove);
    				}
    			} else {
    				_on(dragEl, 'dragend', this);
    				_on(rootEl, 'dragstart', this._onDragStart);
    			}

    			try {
    				if (document.selection) {
    					// Timeout neccessary for IE9
    					_nextTick(function () {
    						document.selection.empty();
    					});
    				} else {
    					window.getSelection().removeAllRanges();
    				}
    			} catch (err) {
    			}
    		},

    		_dragStarted: function (fallback) {
    			awaitingDragStarted = false;
    			if (rootEl && dragEl) {
    				if (this.nativeDraggable) {
    					_on(document, 'dragover', this._handleAutoScroll);
    					_on(document, 'dragover', _checkOutsideTargetEl);
    				}
    				var options = this.options;

    				// Apply effect
    				!fallback && _toggleClass(dragEl, options.dragClass, false);
    				_toggleClass(dragEl, options.ghostClass, true);

    				// In case dragging an animated element
    				_css(dragEl, 'transform', '');

    				Sortable.active = this;

    				fallback && this._appendGhost();

    				// Drag start event
    				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, rootEl, oldIndex);
    			} else {
    				this._nulling();
    			}
    		},

    		_emulateDragOver: function (bypassLastTouchCheck) {
    			if (touchEvt) {
    				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY && !bypassLastTouchCheck) {
    					return;
    				}
    				this._lastX = touchEvt.clientX;
    				this._lastY = touchEvt.clientY;

    				_hideGhostForTarget();

    				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
    				var parent = target;

    				while (target && target.shadowRoot) {
    					target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
    					parent = target;
    				}

    				dragEl.parentNode[expando]._isOutsideThisEl(target);

    				if (parent) {
    					do {
    						if (parent[expando]) {
    							var inserted;

    							inserted = parent[expando]._onDragOver({
    								clientX: touchEvt.clientX,
    								clientY: touchEvt.clientY,
    								target: target,
    								rootEl: parent
    							});

    							if (inserted && !this.options.dragoverBubble) {
    								break;
    							}
    						}

    						target = parent; // store last element
    					}
    					/* jshint boss:true */
    					while (parent = parent.parentNode);
    				}

    				_unhideGhostForTarget();
    			}
    		},


    		_onTouchMove: function (/**TouchEvent*/evt) {
    			if (tapEvt) {
    				var	options = this.options,
    					fallbackTolerance = options.fallbackTolerance,
    					fallbackOffset = options.fallbackOffset,
    					touch = evt.touches ? evt.touches[0] : evt,
    					matrix = ghostEl && _matrix(ghostEl),
    					scaleX = ghostEl && matrix && matrix.a,
    					scaleY = ghostEl && matrix && matrix.d,
    					dx = ((touch.clientX - tapEvt.clientX) + fallbackOffset.x) / (scaleX ? scaleX : 1),
    					dy = ((touch.clientY - tapEvt.clientY) + fallbackOffset.y) / (scaleY ? scaleY : 1),
    					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';


    				// only set the status to dragging, when we are actually dragging
    				if (!Sortable.active && !awaitingDragStarted) {
    					if (fallbackTolerance &&
    						min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance
    					) {
    						return;
    					}
    					this._onDragStart(evt, true);
    				}

    				this._handleAutoScroll(touch, true);


    				touchEvt = touch;


    				_css(ghostEl, 'webkitTransform', translate3d);
    				_css(ghostEl, 'mozTransform', translate3d);
    				_css(ghostEl, 'msTransform', translate3d);
    				_css(ghostEl, 'transform', translate3d);

    				evt.cancelable && evt.preventDefault();
    			}
    		},

    		_appendGhost: function () {
    			if (!ghostEl) {
    				var rect = _getRect(dragEl, this.options.fallbackOnBody ? document.body : rootEl, true),
    					css = _css(dragEl),
    					options = this.options;

    				ghostEl = dragEl.cloneNode(true);

    				_toggleClass(ghostEl, options.ghostClass, false);
    				_toggleClass(ghostEl, options.fallbackClass, true);
    				_toggleClass(ghostEl, options.dragClass, true);

    				_css(ghostEl, 'box-sizing', 'border-box');
    				_css(ghostEl, 'margin', 0);
    				_css(ghostEl, 'top', rect.top);
    				_css(ghostEl, 'left', rect.left);
    				_css(ghostEl, 'width', rect.width);
    				_css(ghostEl, 'height', rect.height);
    				_css(ghostEl, 'opacity', '0.8');
    				_css(ghostEl, 'position', 'fixed');
    				_css(ghostEl, 'zIndex', '100000');
    				_css(ghostEl, 'pointerEvents', 'none');

    				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);
    			}
    		},

    		_onDragStart: function (/**Event*/evt, /**boolean*/fallback) {
    			var _this = this;
    			var dataTransfer = evt.dataTransfer;
    			var options = _this.options;

    			lastSwapEl = dragEl;

    			if (!~multiDragElements.indexOf(dragEl) && multiDragSortable) {
    				multiDragSortable[expando]._deselectMultiDrag();
    			}

    			for (var i in multiDragElements) {
    				multiDragElements[i].sortableIndex = _index(multiDragElements[i]);
    			}

    			// Sort multi-drag elements
    			multiDragElements = multiDragElements.sort(function(a, b) {
    				return a.sortableIndex - b.sortableIndex;
    			});



    			// Setup clone(s)
    			if (multiDragElements.length) {
    				for (var i = 0; i < multiDragElements.length; i++) {
    					multiDragClones.push(_clone(multiDragElements[i]));

    					multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;

    					multiDragClones[i].draggable = false;
    					multiDragClones[i].style['will-change'] = '';

    					_toggleClass(multiDragClones[i], _this.options.selectedClass, false);
    					multiDragElements[i] === dragEl && _toggleClass(multiDragClones[i], _this.options.chosenClass, false);
    				}
    			} else {
    				cloneEl = _clone(dragEl);

    				cloneEl.draggable = false;
    				cloneEl.style['will-change'] = '';

    				_toggleClass(cloneEl, _this.options.chosenClass, false);
    			}

    			this._hideClone();


    			// #1143: IFrame support workaround
    			_this._cloneId = _nextTick(function() {
    				// Remove all auxiliary multidrag items from el, if sorting enabled
    				// (needs to be next tick, but before clone insert)
    				if (_this.options.sort) {
    					_removeMultiDragElements();
    				}

    				if (!_this.options.removeCloneOnHide) {
    					if (options.multiDrag) {
    						_insertMultiDrag(true);
    					} else {
    						rootEl.insertBefore(cloneEl, dragEl);
    					}
    				}
    				_dispatchEvent(_this, rootEl, 'clone', dragEl);
    			});


    			!fallback && _toggleClass(dragEl, options.dragClass, true);

    			// Set proper drop events
    			if (fallback) {
    				ignoreNextClick = true;
    				_this._loopId = setInterval(_this._emulateDragOver, 50);
    			} else {
    				// Undo what was set in _prepareDragStart before drag started
    				_off(document, 'mouseup', _this._onDrop);
    				_off(document, 'touchend', _this._onDrop);
    				_off(document, 'touchcancel', _this._onDrop);

    				if (dataTransfer) {
    					dataTransfer.effectAllowed = 'move';
    					options.setData && options.setData.call(_this, dataTransfer, dragEl);
    				}

    				_on(document, 'drop', _this);

    				// #1276 fix:
    				_css(dragEl, 'transform', 'translateZ(0)');
    			}

    			awaitingDragStarted = true;

    			_this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback));
    			_on(document, 'selectstart', _this);

    			moved = true;
    		},


    		// Returns true - if no further action is needed (either inserted or another condition)
    		_onDragOver: function (/**Event*/evt) {
    			var el = this.el,
    				target = evt.target,
    				dragRect,
    				targetRect,
    				revert,
    				options = this.options,
    				group = options.group,
    				activeSortable = Sortable.active,
    				isOwner = (activeGroup === group),
    				canSort = options.sort,
    				_this = this;

    			if (_silent) return;

    			// IE event order fix
    			if (IE11OrLess && !evt.rootEl && !evt.artificialBubble && !_isTrueParentSortable(el, target)) {
    				return;
    			}

    			// Return invocation when dragEl is inserted
    			function completed() {
    				if (isOwner) {
    					activeSortable._hideClone();
    				} else {
    					_removeMultiDragElements();
    					activeSortable._showClone(_this);
    				}

    				if (activeSortable) {
    					// Set ghost class to new sortable's ghost class
    					_toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
    					_toggleClass(dragEl, options.ghostClass, true);
    				}

    				if (putSortable !== _this && _this !== Sortable.active) {
    					putSortable = _this;
    				} else if (_this === Sortable.active) {
    					putSortable = null;
    				}


    				// Null lastTarget if it is not inside a previously swapped element
    				if ((target === dragEl && !dragEl.animated) || (target === el && !target.animated)) {
    					lastTarget = null;
    				}
    				// no bubbling and not fallback
    				if (!options.dragoverBubble && !evt.rootEl && target !== document) {
    					_this._handleAutoScroll(evt);
    					dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
    				}

    				!options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();

    				return true;
    			}

    			// Call when dragEl has been inserted
    			function changed() {
    				_dispatchEvent(_this, rootEl, 'change', target, el, rootEl, oldIndex, _index(lastSwapEl || dragEl), evt);
    			}


    			if (evt.preventDefault !== void 0) {
    				evt.cancelable && evt.preventDefault();
    			}


    			target = _closest(target, options.draggable, el, true);

    			// target is dragEl or target is animated
    			if (!!_closest(evt.target, null, dragEl, true) || target.animated) {
    				return true; // not completed() because dragEl not inserted
    			}

    			if (target !== dragEl) {
    				ignoreNextClick = false;
    			}

    			if (activeSortable && !options.disabled &&
    				(isOwner
    					? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
    					: (
    						putSortable === this ||
    						(
    							(this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) &&
    							group.checkPut(this, activeSortable, dragEl, evt)
    						)
    					)
    				)
    			) {
    				var axis = this._getDirection(evt, target);

    				dragRect = _getRect(dragEl);

    				if (options.swap) {
    					if (target && target !== el) {
    						var prevSwapEl = lastSwapEl;
    						if (_onMove(rootEl, el, dragEl, dragRect, target, _getRect(target), evt, false) !== false) {
    							_toggleClass(target, options.swapClass, true);
    							lastSwapEl = target;
    						} else {
    							lastSwapEl = null;
    						}

    						if (prevSwapEl && prevSwapEl !== lastSwapEl) {
    							_toggleClass(prevSwapEl, options.swapClass, false);
    						}
    					}
    					changed();

    					return completed();
    				}

    				if (revert) {
    					parentEl = rootEl; // actualization
    					this._hideClone();

    					if (multiDragElements.length) {
    						_insertMultiDrag();
    					} else {
    						if (nextEl) {
    							rootEl.insertBefore(dragEl, nextEl);
    						} else {
    							rootEl.appendChild(dragEl);
    						}
    					}

    					return completed();
    				}

    				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
    					_ghostIsLast(evt, axis, el) && !dragEl.animated
    				) {
    					//assign target only if condition is true
    					if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
    						target = _lastChild(el);
    					}

    					if (target) {
    						targetRect = _getRect(target);
    					}

    					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
    						el.appendChild(dragEl);
    						parentEl = el; // actualization
    						realDragElRect = null;

    						changed();
    						this._animate(dragRect, dragEl);
    						target && this._animate(targetRect, target);
    						return completed();
    					}
    				}
    				else if (target && target !== dragEl && target.parentNode === el) {
    					var direction = 0,
    						targetBeforeFirstSwap,
    						differentLevel = dragEl.parentNode !== el,
    						side1 = axis === 'vertical' ? 'top' : 'left',
    						scrolledPastTop = _isScrolledPast(target, side1) || _isScrolledPast(dragEl, side1),
    						scrollBefore = scrolledPastTop && (scrolledPastTop ? _getScrollPosition(scrolledPastTop)[1] : void 0);



    					if (lastTarget !== target) {
    						targetBeforeFirstSwap = _getRect(target)[side1];
    						pastFirstInvertThresh = false;
    						isCircumstantialInvert = options.invertSwap || differentLevel;
    					}

    					direction = _getSwapDirection(
    						evt, target, axis,
    						options.swapThreshold,
    						options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold,
    						isCircumstantialInvert,
    						lastTarget === target
    					);

    					if (direction === 0) return completed();

    					realDragElRect = null;
    					lastTarget = target;

    					lastDirection = direction;

    					targetRect = _getRect(target);

    					var nextSibling = target.nextElementSibling,
    						after = false;

    					after = direction === 1;

    					var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

    					if (moveVector !== false) {
    						if (moveVector === 1 || moveVector === -1) {
    							after = (moveVector === 1);
    						}

    						_silent = true;
    						setTimeout(_unsilent, 30);

    						if (after && !nextSibling) {
    							el.appendChild(dragEl);
    						} else {
    							target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
    						}

    						// Undo chrome's scroll adjustment (has no effect on other browsers)
    						if (scrolledPastTop) {
    							_scrollBy(scrolledPastTop, 0, scrollBefore - _getScrollPosition(scrolledPastTop)[1]);
    						}

    						parentEl = dragEl.parentNode; // actualization

    						// must be done before animation
    						if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
    							targetMoveDistance = abs(targetBeforeFirstSwap - _getRect(target)[side1]);
    						}
    						changed();

    						!differentLevel && this._animate(targetRect, target);
    						this._animate(dragRect, dragEl);

    						return completed();
    					}
    				}

    				if (el.contains(dragEl)) {
    					return completed();
    				}
    			}

    			if (IE11OrLess && !evt.rootEl) {
    				_artificalBubble(el, evt, '_onDragOver');
    			}

    			return false;
    		},

    		_animate: function (prevRect, target) {
    			var ms = this.options.animation;

    			if (ms) {
    				var currentRect = _getRect(target);

    				if (target === dragEl) {
    					realDragElRect = currentRect;
    				}

    				if (prevRect.nodeType === 1) {
    					prevRect = _getRect(prevRect);
    				}

    				// Check if actually moving position
    				if ((prevRect.left + prevRect.width / 2) !== (currentRect.left + currentRect.width / 2)
    					|| (prevRect.top + prevRect.height / 2) !== (currentRect.top + currentRect.height / 2)
    				) {
    					var matrix = _matrix(this.el),
    						scaleX = matrix && matrix.a,
    						scaleY = matrix && matrix.d;

    					_css(target, 'transition', 'none');
    					_css(target, 'transform', 'translate3d('
    						+ (prevRect.left - currentRect.left) / (scaleX ? scaleX : 1) + 'px,'
    						+ (prevRect.top - currentRect.top) / (scaleY ? scaleY : 1) + 'px,0)'
    					);

    					forRepaintDummy = target.offsetWidth; // repaint
    					_css(target, 'transition', 'transform ' + ms + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
    					_css(target, 'transform', 'translate3d(0,0,0)');
    				}

    				(typeof target.animated === 'number') && clearTimeout(target.animated);
    				target.animated = setTimeout(function () {
    					_css(target, 'transition', '');
    					_css(target, 'transform', '');
    					target.animated = false;
    				}, ms);
    			}
    		},

    		_offUpEvents: function () {
    			var ownerDocument = this.el.ownerDocument;

    			_off(document, 'touchmove', this._onTouchMove);
    			_off(document, 'pointermove', this._onTouchMove);
    			_off(ownerDocument, 'mouseup', this._onDrop);
    			_off(ownerDocument, 'touchend', this._onDrop);
    			_off(ownerDocument, 'pointerup', this._onDrop);
    			_off(ownerDocument, 'touchcancel', this._onDrop);
    			_off(document, 'selectstart', this);
    		},

    		_deselectMultiDrag: function(evt) {
    			// Only deselect if selection is in this sortable
    			if (multiDragSortable !== this.el) return;

    			// Only deselect if target is not item in this sortable
    			if (evt && _closest(evt.target, this.options.draggable, this.el, false)) return;

    			for (var i = 0; i < multiDragElements.length; i++) {
    				_toggleClass(multiDragElements[i], this.options.selectedClass, false);
    			}
    			multiDragElements = [];
    		},

    		_onDrop: function (/**Event*/evt) {
    			var el = this.el,
    				options = this.options,
    				i, n;

    			awaitingDragStarted = false;
    			scrolling = false;
    			isCircumstantialInvert = false;
    			pastFirstInvertThresh = false;

    			clearInterval(this._loopId);

    			clearInterval(pointerElemChangedInterval);
    			_clearAutoScrolls();
    			_cancelThrottle();

    			clearTimeout(this._dragStartTimer);

    			_cancelNextTick(this._cloneId);
    			_cancelNextTick(this._dragStartId);

    			// Unbind events
    			_off(document, 'mousemove', this._onTouchMove);


    			if (this.nativeDraggable) {
    				_off(document, 'drop', this);
    				_off(el, 'dragstart', this._onDragStart);
    				_off(document, 'dragover', this._handleAutoScroll);
    			}

    			this._offUpEvents();

    			lastSwapEl && _toggleClass(lastSwapEl, options.swapClass, false);
    			if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
    				if (dragEl !== lastSwapEl) {
    					var dragRect = _getRect(dragEl),
    						lastRect = _getRect(lastSwapEl);

    					_swapNodes(dragEl, lastSwapEl);

    					this._animate(dragRect, dragEl);
    					this._animate(lastRect, lastSwapEl);
    				}
    			}

    			// Multi-drag selection
    			if (!moved && options.multiDrag) {
    				_toggleClass(dragEl, options.selectedClass, !~multiDragElements.indexOf(dragEl));

    				if (!~multiDragElements.indexOf(dragEl)) {
    					multiDragElements.push(dragEl);
    					dragEl.sortableIndex = _index(dragEl);

    					// Modifier activated, select from last to dragEl
    					if (evt.shiftKey && lastMultiDragSelect && this.el.contains(lastMultiDragSelect)) {
    						var lastIndex = _index(lastMultiDragSelect),
    							currentIndex = _index(dragEl);

    						if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
    							var children = parentEl.children;


    							if (currentIndex > lastIndex) {
    								i = lastIndex + 1;
    								n = currentIndex;
    							} else {
    								i = currentIndex + 1;
    								n = lastIndex;
    							}

    							for (; i < n; i++) {
    								if (~multiDragElements.indexOf(children[i])) continue;
    								children[i].sortableIndex = _index(children[i]);
    								_toggleClass(children[i], options.selectedClass, true);
    								multiDragElements.push(children[i]);
    							}
    						}
    					}

    					lastMultiDragSelect = dragEl;
    					multiDragSortable = parentEl;
    				} else {
    					multiDragElements.splice(multiDragElements.indexOf(dragEl), 1);
    					lastMultiDragSelect = null;
    				}
    			}

    			// Multi-drag drop
    			if (moved && options.multiDrag && multiDragElements.length) {
    				// Do not "unfold" after around dragEl if sorting disabled (either reverted or never left it's sort:false root)
    				if (parentEl[expando].options.sort) {
    					var firstMultiDragElementIndex = _index(dragEl),
    						firstMultiDragRect = _getRect(dragEl);

    					// insert first multi drag at dragEl's position
    					parentEl.insertBefore(multiDragElements[0], dragEl);
    					multiDragElements[0] !== dragEl && parentEl.removeChild(dragEl);


    					for (i = 1; i < multiDragElements.length; i++) {
    						if (multiDragElements[i - 1].nextSibling) {
    							parentEl.insertBefore(multiDragElements[i], multiDragElements[i - 1].nextSibling);
    						} else {
    							parentEl.appendChild(multiDragElements[i]);
    						}

    						this._animate(firstMultiDragRect, multiDragElements[i]);
    					}
    				}

    				multiDragSortable = parentEl;
    			}

    			if (evt) {
    				if (moved) {
    					evt.cancelable && evt.preventDefault();
    					!options.dropBubble && evt.stopPropagation();
    				}

    				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

    				if (rootEl === parentEl || (putSortable && putSortable.lastPutMode !== 'clone')) {
    					// Remove clone
    					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
    				}

    				if (dragEl) {
    					if (this.nativeDraggable) {
    						_off(dragEl, 'dragend', this);
    					}

    					_disableDraggable(dragEl);
    					dragEl.style['will-change'] = '';

    					// Remove classes
    					// ghostClass is added in dragStarted
    					if (moved && !awaitingDragStarted) {
    						_toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
    					}
    					_toggleClass(dragEl, this.options.chosenClass, false);

    					// Drag stop event
    					_dispatchEvent(this, rootEl, 'unchoose', dragEl, parentEl, rootEl, oldIndex, null, evt);

    					if (rootEl !== parentEl) {
    						newIndex = _index(dragEl);

    						if (newIndex >= 0) {
    							// Add event
    							_dispatchEvent(null, parentEl, 'add', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

    							// Remove event
    							_dispatchEvent(this, rootEl, 'remove', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

    							// drag from one list and drop into another
    							_dispatchEvent(null, parentEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
    							_dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
    						}

    						putSortable && putSortable.save();
    					}
    					else {
    						// Get the index of the dragged element within its parent
    						newIndex = _index(dragEl);

    						if (dragEl.nextSibling !== nextEl) {
    							if (newIndex >= 0) {
    								// drag & drop within the same list
    								_dispatchEvent(this, rootEl, 'update', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
    								_dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
    							}
    						}
    					}

    					if (Sortable.active) {
    						/* jshint eqnull:true */
    						if (newIndex == null || newIndex === -1) {
    							newIndex = oldIndex;
    						}

    						if (options.swap && lastSwapEl)
    						{
    							_dispatchEvent(this, rootEl, 'end', dragEl, parentEl, rootEl, oldIndex, newIndex, evt, { swapItem: lastSwapEl });
    						}
    						else
    						{
    							_dispatchEvent(this, rootEl, 'end', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
    						}

    						// Save sorting
    						this.save();
    					}
    				}

    			}
    			this._nulling();
    		},

    		_nulling: function() {
    			rootEl =
    			dragEl =
    			parentEl =
    			ghostEl =
    			nextEl =
    			cloneEl =
    			lastDownEl =
    			lastSwapEl =

    			scrollEl =
    			scrollParentEl =
    			autoScrolls.length =

    			pointerElemChangedInterval =
    			lastPointerElemX =
    			lastPointerElemY =

    			tapEvt =
    			touchEvt =

    			moved =
    			newIndex =
    			oldIndex =

    			lastTarget =
    			lastDirection =

    			forRepaintDummy =
    			realDragElRect =

    			putSortable =
    			activeGroup =
    			Sortable.active = null;

    			savedInputChecked.forEach(function (el) {
    				el.checked = true;
    			});

    			savedInputChecked.length =
    			multiDragClones.length = 0;
    		},

    		handleEvent: function (/**Event*/evt) {
    			switch (evt.type) {
    				case 'drop':
    				case 'dragend':
    					this._onDrop(evt);
    					break;

    				case 'dragenter':
    				case 'dragover':
    					if (dragEl) {
    						this._onDragOver(evt);
    						_globalDragOver(evt);
    					}
    					break;

    				case 'selectstart':
    					evt.preventDefault();
    					break;
    			}
    		},


    		/**
    		 * Serializes the item into an array of string.
    		 * @returns {String[]}
    		 */
    		toArray: function () {
    			var order = [],
    				el,
    				children = this.el.children,
    				i = 0,
    				n = children.length,
    				options = this.options;

    			for (; i < n; i++) {
    				el = children[i];
    				if (_closest(el, options.draggable, this.el, false)) {
    					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
    				}
    			}

    			return order;
    		},


    		/**
    		 * Sorts the elements according to the array.
    		 * @param  {String[]}  order  order of the items
    		 */
    		sort: function (order) {
    			var items = {}, rootEl = this.el;

    			this.toArray().forEach(function (id, i) {
    				var el = rootEl.children[i];

    				if (_closest(el, this.options.draggable, rootEl, false)) {
    					items[id] = el;
    				}
    			}, this);

    			order.forEach(function (id) {
    				if (items[id]) {
    					rootEl.removeChild(items[id]);
    					rootEl.appendChild(items[id]);
    				}
    			});
    		},


    		/**
    		 * Save the current sorting
    		 */
    		save: function () {
    			var store = this.options.store;
    			store && store.set && store.set(this);
    		},


    		/**
    		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
    		 * @param   {HTMLElement}  el
    		 * @param   {String}       [selector]  default: `options.draggable`
    		 * @returns {HTMLElement|null}
    		 */
    		closest: function (el, selector) {
    			return _closest(el, selector || this.options.draggable, this.el, false);
    		},


    		/**
    		 * Set/get option
    		 * @param   {string} name
    		 * @param   {*}      [value]
    		 * @returns {*}
    		 */
    		option: function (name, value) {
    			var options = this.options;

    			if (value === void 0) {
    				return options[name];
    			} else {
    				options[name] = value;

    				if (name === 'group') {
    					_prepareGroup(options);
    				}
    			}
    		},


    		/**
    		 * Destroy
    		 */
    		destroy: function () {
    			var el = this.el;

    			el[expando] = null;

    			_off(el, 'mousedown', this._onTapStart);
    			_off(el, 'touchstart', this._onTapStart);
    			_off(el, 'pointerdown', this._onTapStart);

    			if (this.nativeDraggable) {
    				_off(el, 'dragover', this);
    				_off(el, 'dragenter', this);
    			}
    			// Remove draggable attributes
    			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
    				el.removeAttribute('draggable');
    			});

    			this._onDrop();

    			sortables.splice(sortables.indexOf(this.el), 1);

    			this.el = el = null;
    		},

    		_hideClone: function() {
    			if (!cloneHidden) {
    				for (var i = 0; i < (multiDragClones.length || 1); i++) {
    					var clone = multiDragClones[i];
    					if (!clone) {
    						clone = cloneEl;
    					}

    					_css(clone, 'display', 'none');
    					if (this.options.removeCloneOnHide && clone.parentNode) {
    						clone.parentNode.removeChild(clone);
    					}
    				}
    				cloneHidden = true;
    			}
    		},

    		_showClone: function(putSortable) {
    			if (putSortable.lastPutMode !== 'clone') {
    				this._hideClone();
    				return;
    			}


    			if (cloneHidden) {
    				if (multiDragClones.length) {
    					_insertMultiDrag(true);
    					for (var i = 0; i < multiDragClones.length; i++) {
    						_css(multiDragClones[i], 'display', '');
    					}
    				} else {
    					// show clone at dragEl or original position
    					if (rootEl.contains(dragEl) && !this.options.group.revertClone) {
    						rootEl.insertBefore(cloneEl, dragEl);
    					} else if (nextEl) {
    						rootEl.insertBefore(cloneEl, nextEl);
    					} else {
    						rootEl.appendChild(cloneEl);
    					}

    					if (this.options.group.revertClone) {
    						this._animate(dragEl, cloneEl);
    					}

    					_css(cloneEl, 'display', '');
    				}
    				cloneHidden = false;
    			}
    		}
    	};

    	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx, includeCTX) {
    		if (el) {
    			ctx = ctx || document;

    			do {
    				if (
    					selector != null &&
    					(
    						selector[0] === '>' && el.parentNode === ctx && _matches(el, selector.substring(1)) ||
    						_matches(el, selector)
    					) ||
    					includeCTX && el === ctx
    				) {
    					return el;
    				}

    				if (el === ctx) break;
    				/* jshint boss:true */
    			} while (el = _getParentOrHost(el));
    		}

    		return null;
    	}


    	function _getParentOrHost(el) {
    		return (el.host && el !== document && el.host.nodeType)
    			? el.host
    			: el.parentNode;
    	}


    	function _globalDragOver(/**Event*/evt) {
    		if (evt.dataTransfer) {
    			evt.dataTransfer.dropEffect = 'move';
    		}
    		evt.cancelable && evt.preventDefault();
    	}


    	function _on(el, event, fn) {
    		el.addEventListener(event, fn, captureMode);
    	}


    	function _off(el, event, fn) {
    		el.removeEventListener(event, fn, captureMode);
    	}


    	function _toggleClass(el, name, state) {
    		if (el && name) {
    			if (el.classList) {
    				el.classList[state ? 'add' : 'remove'](name);
    			}
    			else {
    				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
    				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    			}
    		}
    	}


    	function _css(el, prop, val) {
    		var style = el && el.style;

    		if (style) {
    			if (val === void 0) {
    				if (document.defaultView && document.defaultView.getComputedStyle) {
    					val = document.defaultView.getComputedStyle(el, '');
    				}
    				else if (el.currentStyle) {
    					val = el.currentStyle;
    				}

    				return prop === void 0 ? val : val[prop];
    			}
    			else {
    				if (!(prop in style) && prop.indexOf('webkit') === -1) {
    					prop = '-webkit-' + prop;
    				}

    				style[prop] = val + (typeof val === 'string' ? '' : 'px');
    			}
    		}
    	}

    	function _matrix(el) {
    		var appliedTransforms = '';
    		do {
    			var transform = _css(el, 'transform');

    			if (transform && transform !== 'none') {
    				appliedTransforms = transform + ' ' + appliedTransforms;
    			}
    			/* jshint boss:true */
    		} while (el = el.parentNode);

    		if (window.DOMMatrix) {
    			return new DOMMatrix(appliedTransforms);
    		} else if (window.WebKitCSSMatrix) {
    			return new WebKitCSSMatrix(appliedTransforms);
    		} else if (window.CSSMatrix) {
    			return new CSSMatrix(appliedTransforms);
    		}
    	}


    	function _find(ctx, tagName, iterator) {
    		if (ctx) {
    			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

    			if (iterator) {
    				for (; i < n; i++) {
    					iterator(list[i], i);
    				}
    			}

    			return list;
    		}

    		return [];
    	}



    	function _dispatchEvent(sortable, rootEl, name, targetEl, toEl, fromEl, startIndex, newIndex, originalEvt, eventOptions) {
    		sortable = (sortable || rootEl[expando]);
    		var evt,
    			options = sortable.options,
    			onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
    		// Support for new CustomEvent feature
    		if (window.CustomEvent && !IE11OrLess && !Edge) {
    			evt = new CustomEvent(name, {
    				bubbles: true,
    				cancelable: true
    			});
    		} else {
    			evt = document.createEvent('Event');
    			evt.initEvent(name, true, true);
    		}

    		evt.to = toEl || rootEl;
    		evt.from = fromEl || rootEl;
    		evt.item = targetEl || rootEl;
    		evt.items = multiDragElements || [];
    		evt.clone = cloneEl;
    		evt.clones = multiDragClones || [];

    		evt.oldIndex = startIndex;
    		evt.newIndex = newIndex;

    		evt.originalEvent = originalEvt;

    		if (eventOptions) {
    			for (var option in eventOptions) {
    				evt[option] = eventOptions[option];
    			}
    		}

    		if (rootEl) {
    			rootEl.dispatchEvent(evt);
    		}

    		if (options[onName]) {
    			options[onName].call(sortable, evt);
    		}
    	}


    	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
    		var evt,
    			sortable = fromEl[expando],
    			onMoveFn = sortable.options.onMove,
    			retVal;
    		// Support for new CustomEvent feature
    		if (window.CustomEvent && !IE11OrLess && !Edge) {
    			evt = new CustomEvent('move', {
    				bubbles: true,
    				cancelable: true
    			});
    		} else {
    			evt = document.createEvent('Event');
    			evt.initEvent('move', true, true);
    		}

    		evt.to = toEl;
    		evt.from = fromEl;
    		evt.dragged = dragEl;
    		evt.draggedRect = dragRect;
    		evt.related = targetEl || toEl;
    		evt.relatedRect = targetRect || _getRect(toEl);
    		evt.willInsertAfter = willInsertAfter;

    		evt.originalEvent = originalEvt;

    		fromEl.dispatchEvent(evt);

    		if (onMoveFn) {
    			retVal = onMoveFn.call(sortable, evt, originalEvt);
    		}

    		return retVal;
    	}

    	function _disableDraggable(el) {
    		el.draggable = false;
    	}

    	function _unsilent() {
    		_silent = false;
    	}

    	/**
    	 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
    	 * and non-draggable elements
    	 * @param  {HTMLElement} el       The parent element
    	 * @param  {Number} childNum      The index of the child
    	 * @param  {Object} options       Parent Sortable's options
    	 * @return {HTMLElement}          The child at index childNum, or null if not found
    	 */
    	function _getChild(el, childNum, options) {
    		var currentChild = 0,
    			i = 0,
    			children = el.children;

    		while (i < children.length) {
    			if (
    				children[i].style.display !== 'none' &&
    				children[i] !== ghostEl &&
    				children[i] !== dragEl &&
    				_closest(children[i], options.draggable, el, false)
    			) {
    				if (currentChild === childNum) {
    					return children[i];
    				}
    				currentChild++;
    			}

    			i++;
    		}
    		return null;
    	}

    	/**
    	 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
    	 * @param  {HTMLElement} el       Parent element
    	 * @return {HTMLElement}          The last child, ignoring ghostEl
    	 */
    	function _lastChild(el) {
    		var last = el.lastElementChild;

    		while (last === ghostEl || last.style.display === 'none') {
    			last = last.previousElementSibling;

    			if (!last) break;
    		}

    		return last || null;
    	}

    	function _ghostIsLast(evt, axis, el) {
    		var elRect = _getRect(_lastChild(el)),
    			mouseOnAxis = axis === 'vertical' ? evt.clientY : evt.clientX,
    			mouseOnOppAxis = axis === 'vertical' ? evt.clientX : evt.clientY,
    			targetS2 = axis === 'vertical' ? elRect.bottom : elRect.right,
    			targetS1Opp = axis === 'vertical' ? elRect.left : elRect.top,
    			targetS2Opp = axis === 'vertical' ? elRect.right : elRect.bottom,
    			spacer = 10;

    		return (
    			axis === 'vertical' ?
    				(mouseOnOppAxis > targetS2Opp + spacer || mouseOnOppAxis <= targetS2Opp && mouseOnAxis > targetS2 && mouseOnOppAxis >= targetS1Opp) :
    				(mouseOnAxis > targetS2 && mouseOnOppAxis > targetS1Opp || mouseOnAxis <= targetS2 && mouseOnOppAxis > targetS2Opp + spacer)
    		);
    	}

    	function _getSwapDirection(evt, target, axis, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
    		var targetRect = _getRect(target),
    			mouseOnAxis = axis === 'vertical' ? evt.clientY : evt.clientX,
    			targetLength = axis === 'vertical' ? targetRect.height : targetRect.width,
    			targetS1 = axis === 'vertical' ? targetRect.top : targetRect.left,
    			targetS2 = axis === 'vertical' ? targetRect.bottom : targetRect.right,
    			dragRect = _getRect(dragEl),
    			invert = false;


    		if (!invertSwap) {
    			// Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    			if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) { // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
    				// check if past first invert threshold on side opposite of lastDirection
    				if (!pastFirstInvertThresh &&
    					(lastDirection === 1 ?
    						(
    							mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2
    						) :
    						(
    							mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2
    						)
    					)
    				)
    				{
    					// past first invert threshold, do not restrict inverted threshold to dragEl shadow
    					pastFirstInvertThresh = true;
    				}

    				if (!pastFirstInvertThresh) {
    					var dragS1 = axis === 'vertical' ? dragRect.top : dragRect.left,
    						dragS2 = axis === 'vertical' ? dragRect.bottom : dragRect.right;
    					// dragEl shadow (target move distance shadow)
    					if (
    						lastDirection === 1 ?
    						(
    							mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
    						) :
    						(
    							mouseOnAxis > targetS2 - targetMoveDistance
    						)
    					)
    					{
    						return lastDirection * -1;
    					}
    				} else {
    					invert = true;
    				}
    			} else {
    				// Regular
    				if (
    					mouseOnAxis > targetS1 + (targetLength * (1 - swapThreshold) / 2) &&
    					mouseOnAxis < targetS2 - (targetLength * (1 - swapThreshold) / 2)
    				) {
    					return _getInsertDirection(target);
    					// return ((mouseOnAxis > targetS1 + targetLength / 2) ? -1 : 1);
    				}
    			}
    		}

    		invert = invert || invertSwap;

    		if (invert) {
    			// Invert of regular
    			if (
    				mouseOnAxis < targetS1 + (targetLength * invertedSwapThreshold / 2) ||
    				mouseOnAxis > targetS2 - (targetLength * invertedSwapThreshold / 2)
    			)
    			{
    				return ((mouseOnAxis > targetS1 + targetLength / 2) ? 1 : -1);
    			}
    		}

    		return 0;
    	}

    	/**
    	 * Gets the direction dragEl must be swapped relative to target in order to make it
    	 * seem that dragEl has been "inserted" into that element's position
    	 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
    	 * @param  {Object} options           options of the parent sortable
    	 * @return {Number}                   Direction dragEl must be swapped
    	 */
    	function _getInsertDirection(target, options) {
    		var dragElIndex = _index(dragEl),
    			targetIndex = _index(target);

    		if (dragElIndex < targetIndex) {
    			return 1;
    		} else {
    			return -1;
    		}
    	}


    	/**
    	 * Generate id
    	 * @param   {HTMLElement} el
    	 * @returns {String}
    	 * @private
    	 */
    	function _generateId(el) {
    		var str = el.tagName + el.className + el.src + el.href + el.textContent,
    			i = str.length,
    			sum = 0;

    		while (i--) {
    			sum += str.charCodeAt(i);
    		}

    		return sum.toString(36);
    	}

    	/**
    	 * Returns the index of an element within its parent for a selected set of
    	 * elements
    	 * @param  {HTMLElement} el
    	 * @return {number}
    	 */
    	function _index(el) {
    		var index = 0;

    		if (!el || !el.parentNode) {
    			return -1;
    		}

    		while (el && (el = el.previousElementSibling)) {
    			if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && el !== cloneEl) {
    				index++;
    			}
    		}

    		return index;
    	}

    	function _matches(/**HTMLElement*/el, /**String*/selector) {
    		if (el) {
    			try {
    				if (el.matches) {
    					return el.matches(selector);
    				} else if (el.msMatchesSelector) {
    					return el.msMatchesSelector(selector);
    				} else if (el.webkitMatchesSelector) {
    					return el.webkitMatchesSelector(selector);
    				}
    			} catch(_) {
    				return false;
    			}
    		}

    		return false;
    	}

    	var _throttleTimeout;
    	function _throttle(callback, ms) {
    		return function () {
    			if (!_throttleTimeout) {
    				var args = arguments,
    					_this = this;

    				_throttleTimeout = setTimeout(function () {
    					if (args.length === 1) {
    						callback.call(_this, args[0]);
    					} else {
    						callback.apply(_this, args);
    					}

    					_throttleTimeout = void 0;
    				}, ms);
    			}
    		};
    	}

    	function _cancelThrottle() {
    		clearTimeout(_throttleTimeout);
    		_throttleTimeout = void 0;
    	}

    	function _extend(dst, src) {
    		if (dst && src) {
    			for (var key in src) {
    				if (src.hasOwnProperty(key)) {
    					dst[key] = src[key];
    				}
    			}
    		}

    		return dst;
    	}

    	function _clone(el) {
    		if (Polymer && Polymer.dom) {
    			return Polymer.dom(el).cloneNode(true);
    		}
    		else if ($) {
    			return $(el).clone(true)[0];
    		}
    		else {
    			return el.cloneNode(true);
    		}
    	}

    	function _saveInputCheckedState(root) {
    		savedInputChecked.length = 0;

    		var inputs = root.getElementsByTagName('input');
    		var idx = inputs.length;

    		while (idx--) {
    			var el = inputs[idx];
    			el.checked && savedInputChecked.push(el);
    		}
    	}

    	function _nextTick(fn) {
    		return setTimeout(fn, 0);
    	}

    	function _cancelNextTick(id) {
    		return clearTimeout(id);
    	}

    	function _swapNodes(n1, n2) {

    		var p1 = n1.parentNode;
    		var p2 = n2.parentNode;
    		var i1, i2;

    		if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;

    		i1 = _index(n1);
    		i2 = _index(n2);

    		if (p1.isEqualNode(p2) && i1 < i2) {
    			i2++;
    		}
    		p1.insertBefore(n2, p1.children[i1]);
    		p2.insertBefore(n1, p2.children[i2]);
    	}


    	/**
    	 * Returns the "bounding client rect" of given element
    	 * @param  {HTMLElement} el                The element whose boundingClientRect is wanted
    	 * @param  {[HTMLElement]} container       the parent the element will be placed in
    	 * @param  {[Boolean]} adjustForTransform  Whether the rect should compensate for parent's transform
    	 * @return {Object}                        The boundingClientRect of el
    	 */
    	function _getRect(el, container, adjustForTransform) {
    		if (!el.getBoundingClientRect && el !== win) return;

    		var elRect,
    			top,
    			left,
    			bottom,
    			right,
    			height,
    			width;

    		if (el !== win && el !== _getWindowScrollingElement()) {
    			elRect = el.getBoundingClientRect();
    			top = elRect.top;
    			left = elRect.left;
    			bottom = elRect.bottom;
    			right = elRect.right;
    			height = elRect.height;
    			width = elRect.width;
    		} else {
    			top = 0;
    			left = 0;
    			bottom = window.innerHeight;
    			right = window.innerWidth;
    			height = window.innerHeight;
    			width = window.innerWidth;
    		}

    		if (adjustForTransform && el !== win) {
    			// Adjust for translate()
    			container = container || el.parentNode;

    			// solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    			// Not needed on <= IE11
    			if (!IE11OrLess) {
    				do {
    					if (container && container.getBoundingClientRect && _css(container, 'transform') !== 'none') {
    						var containerRect = container.getBoundingClientRect();

    						// Set relative to edges of padding box of container
    						top -= containerRect.top + parseInt(_css(container, 'border-top-width'));
    						left -= containerRect.left + parseInt(_css(container, 'border-left-width'));
    						bottom = top + elRect.height;
    						right = left + elRect.width;

    						break;
    					}
    					/* jshint boss:true */
    				} while (container = container.parentNode);
    			}

    			// Adjust for scale()
    			var matrix = _matrix(el),
    				scaleX = matrix && matrix.a,
    				scaleY = matrix && matrix.d;

    			if (matrix) {
    				top /= scaleY;
    				left /= scaleX;

    				width /= scaleX;
    				height /= scaleY;

    				bottom = top + height;
    				right = left + width;
    			}
    		}

    		return {
    			top: top,
    			left: left,
    			bottom: bottom,
    			right: right,
    			width: width,
    			height: height
    		};
    	}


    	/**
    	 * Checks if a side of an element is scrolled past a side of it's parents
    	 * @param  {HTMLElement}  el       The element who's side being scrolled out of view is in question
    	 * @param  {String}       side     Side of the element in question ('top', 'left', 'right', 'bottom')
    	 * @return {HTMLElement}           The parent scroll element that the el's side is scrolled past, or null if there is no such element
    	 */
    	function _isScrolledPast(el, side) {
    		var parent = _getParentAutoScrollElement(el, true),
    			elSide = _getRect(el)[side];

    		/* jshint boss:true */
    		while (parent) {
    			var parentSide = _getRect(parent)[side],
    				visible;

    			if (side === 'top' || side === 'left') {
    				visible = elSide >= parentSide;
    			} else {
    				visible = elSide <= parentSide;
    			}

    			if (!visible) return parent;

    			if (parent === _getWindowScrollingElement()) break;

    			parent = _getParentAutoScrollElement(parent, false);
    		}

    		return false;
    	}

    	function _insertMultiDrag(clones) {
    		var multiDrags = clones ? multiDragClones : multiDragElements;
    		for (var i = 0; i < multiDrags.length; i++) {
    			var target = rootEl.children[multiDrags[i].sortableIndex];
    			if (target) {
    				rootEl.insertBefore(multiDrags[i], target);
    			} else {
    				rootEl.appendChild(multiDrags[i]);
    			}
    		}
    	}

    	function _removeMultiDragElements() {
    		for (var i = 0; i < multiDragElements.length; i++) {
    			if (multiDragElements[i] === dragEl) continue;
    			multiDragElements[i].parentNode && multiDragElements[i].parentNode.removeChild(multiDragElements[i]);
    		}
    	}

    	// Fixed #973:
    	_on(document, 'touchmove', function(evt) {
    		if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
    			evt.preventDefault();
    		}
    	});


    	// Export utils
    	Sortable.utils = {
    		on: _on,
    		off: _off,
    		css: _css,
    		find: _find,
    		is: function (el, selector) {
    			return !!_closest(el, selector, el, false);
    		},
    		extend: _extend,
    		throttle: _throttle,
    		closest: _closest,
    		toggleClass: _toggleClass,
    		clone: _clone,
    		index: _index,
    		nextTick: _nextTick,
    		cancelNextTick: _cancelNextTick,
    		detectDirection: _detectDirection,
    		getChild: _getChild
    	};


    	/**
    	 * Create sortable instance
    	 * @param {HTMLElement}  el
    	 * @param {Object}      [options]
    	 */
    	Sortable.create = function (el, options) {
    		return new Sortable(el, options);
    	};


    	// Export
    	Sortable.version = '1.8.3';
    	return Sortable;
    });
    });

    /**
     * File: tagsView.js
     * Description: Create tag view on input box.
     * Author: Pradeep Yadav
     * className: 'tagin'
     * @param {selected elements using class or id} el 
     * @param {separator|duplicate|transform|placeholder} option 
     */
    function TagView(el, option = {}) {
        const classElement = 'tagin';
        const classWrapper = 'tagin-wrapper';
        const classTag = 'tagin-tag';
        const classRemove = 'tagin-tag-remove';
        const classInput = 'tagin-input';
        const classInputHidden = 'tagin-input-hidden';
        const defaultSeparator = ',';
        const defaultDuplicate = 'false';
        const defaultTransform = input => input;
        const defaultPlaceholder = '';
        const separator = el.dataset.separator || option.separator || defaultSeparator;
        const duplicate = el.dataset.duplicate || option.duplicate || defaultDuplicate;
        const transform = eval(el.dataset.transform) || option.transform || defaultTransform;
        const placeholder = el.dataset.placeholder || option.placeholder || defaultPlaceholder;
      
        const templateTag = value => `<span class="${classTag}">${value}<span class="${classRemove}"></span></span>`;
      
        const getValue = () => el.value;
        const getValues = () => getValue().split(separator)
      
        // Create
        ; (function () {
          const className = classWrapper + ' ' + el.className.replace(classElement, '').trim();
          const tags = getValue().trim() === '' ? '' : getValues().map(templateTag).join('');
          const template = `<div class="${className}">${tags}<input type="text" class="${classInput}" placeholder="${placeholder}"></div>`;
          el.insertAdjacentHTML('afterend', template); // insert template after element
        })();
      
        const wrapper = el.nextElementSibling;
        const input = wrapper.getElementsByClassName(classInput)[0];
        const getTags = () => [...wrapper.getElementsByClassName(classTag)].map(tag => tag.textContent);
        const getTag = () => getTags().join(separator);
      
        const updateValue = () => { el.value = getTag(); el.dispatchEvent(new Event('change')); };
      
        // Focus to input
        wrapper.addEventListener('click', () => input.focus());
      
        // Toggle focus class
        input.addEventListener('focus', () => wrapper.classList.add('focus'));
        input.addEventListener('blur', () => wrapper.classList.remove('focus'));
      
        // Remove by click
        document.addEventListener('click', e => {
          if (e.target.closest('.' + classRemove)) {
            e.target.closest('.' + classRemove).parentNode.remove();
            updateValue();
          }
        });
      
        // Remove with backspace
        input.addEventListener('keydown', e => {
          if (input.value === '' && e.keyCode === 8 && wrapper.getElementsByClassName(classTag).length) {
            wrapper.querySelector('.' + classTag + ':last-of-type').remove();
            updateValue();
          }
        });
      
        // Adding tag
        input.addEventListener('input', () => {
          addTag();
          autowidth();
        });
        input.addEventListener('blur', () => {
          addTag(true);
          autowidth();
        });
        autowidth();
      
        function autowidth() {
          const fakeEl = document.createElement('div');
          fakeEl.classList.add(classInput, classInputHidden);
          const string = input.value || input.getAttribute('placeholder') || '';
          fakeEl.innerHTML = string.replace(/ /g, '&nbsp;');
          document.body.appendChild(fakeEl);
          input.style.setProperty('width', Math.ceil(window.getComputedStyle(fakeEl).width.replace('px', '')) + 1 + 'px');
          fakeEl.remove();
        }
        function addTag(force = false) {
          const value = transform(input.value.replace(new RegExp(escapeRegex(separator), 'g'), '').trim());
          if (value === '') { input.value = ''; }
          if (input.value.includes(separator) || (force && input.value != '')) {
            if (getTags().includes(value) && duplicate === 'false') {
              alertExist(value);
            } else {
              input.insertAdjacentHTML('beforebegin', templateTag(value));
              updateValue();
            }
            input.value = '';
            input.removeAttribute('style');
          }
        }
        function alertExist(value) {
          for (const el of wrapper.getElementsByClassName(classTag)) {
            if (el.textContent === value) {
              el.style.transform = 'scale(1.09)';
              setTimeout(() => { el.removeAttribute('style'); }, 150);
            }
          }
        }
        function updateTag() {
          if (getValue() !== getTag()) {
            [...wrapper.getElementsByClassName(classTag)].map(tag => tag.remove());
            getValue().trim() !== '' && input.insertAdjacentHTML('beforebegin', getValues().map(templateTag).join(''));
          }
        }
        function escapeRegex(value) {
          return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        }
        el.addEventListener('change', () => updateTag());
    }
    var TagView_1 = TagView;

    var tagViewCss = {style: `.tagin{display:none}.tagin-wrapper{display:flex;flex-wrap:wrap;height:auto;padding:calc(.375rem - 2px) calc(.75rem - 2px);position:relative;overflow:hidden;cursor:text}.tagin-wrapper.focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.tagin.is-valid+.tagin-wrapper,.was-validated .tagin:valid+.tagin-wrapper{border-color:#28a745}.tagin.is-invalid+.tagin-wrapper,.was-validated .tagin:invalid+.tagin-wrapper{border-color:#dc3545}.tagin-tag{border-radius:.25rem;color:#fff;border:0;padding:0 4px;display:inline-flex;align-items:center;height:24px;margin:2px;font-weight:300;background-color:#6c757d;transition:transform .1s}.tagin-tag-remove{margin-left:2px;width:18px;height:18px;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-tag-remove:hover{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-input{margin-left:2px;border-color:transparent;outline:0;border-width:1px 0;padding:0 2px 0 0;height:28px;color:#495057}.tagin-input:not(.tagin-input-hidden){width:4px;min-width:4px}.tagin-input-hidden{position:absolute;top:0;left:-9999px;overflow:hidden;visibility:hidden;white-space:nowrap`};

    class API {
        constructor(options) {
            this._servers = [
                'http://localhost/pe-gold3/', 
                'https://www.ucertify.com/', 
                'https://www.jigyaasa.info/',
                'http://172.10.195.203/pe-gold3/',
            ];
            this._REMOTE_API_URL = this._servers[1] + 'pe-api/1/index.php';
            this._client = {
                email: "pradeep.yadav@ucertify.com",
                password: "786pradeep",
                isSocial: "false",
                clientId: "040MA"
            };
            window.JUITemp = {};
        }

        validateApp (checkExpired) {
            return new Promise((resolve, reject) => {
                let isExpired = checkExpired ? `&action=refresh_token&refresh_token=1` : "";
                let isSocial = this._client.isSocial ? '&social_login=1' : "";
                let url = `${this._REMOTE_API_URL}?func=cat2.authenticate&device_id=${this._client.clientId}&email=${this._client.email}&password=${this._client.password + isSocial + isExpired}`;
                let request = new XMLHttpRequest();
                request.open('POST', url, true);
                request.onreadystatechange = (event) => {
                    if (request.readyState == 4 && request.status === 200) {
                        try {
                            let responseBody = request.responseText;
                            let responseObject = responseBody.match(/<jsonstring>(.*?)<\/jsonstring>/);
                            resolve(JSON.parse(responseObject[1]));
                        } catch (err) {
                            reject(err);
                        }
                    } 
                };
                request.onerror = (requestError) => {
                    reject(requestError);
                };
                if (checkExpired) {
                    request.setRequestHeader("old-access-token", window.apiAccessToken);
                }
                request.send();
            });
        }
        
        getAPIDataJ (func, where, callback = function(){}) {
            let param = "";
            let _param2 = {};
            let str = '';
            let ajax_info = where.ajax_info ||{};
            where = this._assignPartial(where, {}, 'ajax_info', true);
            // if (typeof where.redis == 'undefined') {
            // 	_param2.redis = 0;
            // }
            //----------- code for acces_token based validation --------//
            _param2.device_id = this._client.clientId;
            //----------------------------------------------------------//
        
            if (typeof (where) == 'object') {
                for (let k in where) {
                    if (typeof where[k] != 'object') {
                        param += "&" + k + "=" + where[k];
                    }	
                }
            }
            if (typeof (func) !== "undefined" && func != "") {
                for (let k in _param2) {
                    if (typeof _param2[k] != 'object') {
                        str += "&" + k + "=" + _param2[k];
                    }	
                }
                str += "&func="+func;
            }
            
            this.getAPIDataJSON(this._REMOTE_API_URL + "?" + str + "&debug=0&"+param, param, ajax_info, (apidata)=> {
                if (apidata == 'Expired'){
                    this.getAPIDataJ(func, where, callback);
                } else {
                    callback(apidata);
                }
            }, func);
        }
        
        getAPIDataJSON (url, data, ajax_info, callback = function(){}, funcName) {
            let request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.onreadystatechange = (event) => {
                if (request.readyState == 4 && request.status === 200) {
                    let responseBody = request.responseText;
                    let responseData = {};
                    try {
                        let resStr = responseBody.match(/<jsonstring>(.*?)<\/jsonstring>/);
                        if (resStr[1] != '') {
                            let responseObject = JSON.parse(resStr[1]);
                            if (responseObject.error && ['Expired', '-9'].includes(responseObject.error.error_id)) {
                                console.log("Api Error = ", responseObject.error.error_id);
                                this.validateApp (responseObject.error.error_id != -9).then((validRes) => {
                                    if (validRes.status == 'Success') {
                                        this.setAccessKey(validRes);
                                        callback("Expired");
                                    }
                                }).catch((validateError)=> {
                                    //UI.storeError('Validate Error####no1:1####' + JSON.stringify(validateError || {}), true)
                                    console.log(validateError);
                                });
                                return;
                            } else {
                                if (responseObject['response']) {
                                    responseData = responseObject['response'];
                                    console.warn("Api data J reponse <-- Received -->", responseObject);
                                } else if(responseObject['response'] == undefined && responseObject.error == undefined) {
                                    responseData = responseObject;
                                    console.warn("Api data J reponse <-- Received II-->", responseData);
                                } else {
                                    responseData = undefined;
                                    console.warn({"Response_error":responseObject.error});
                                }
                            }
                        }
                    } catch (error) {
                        console.warn("Please check your Internet connection.");
                        console.log("Api data error = ", responseBody);
                        if (data.includes('must_reply_override')) {
                            responseData = undefined;
                        } else {
                            return (0);
                        }
                    }
                    callback(responseData);
                }
            };
            if (!data.includes('no_access_token_required')) {
                request.setRequestHeader("access-token", window.apiAccessToken);
            }
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader("Access-Control-Allow-Origin", "*");
            request.setRequestHeader("Access-Control-Allow-Headers", "*");
            request.send();
        }

        _assignPartial(iObj, oObj = {}, str, unsetOnly = false ) {
            str = str.split(',');
            if ( !unsetOnly ) {
              for ( let i in str ) {
                let index = str[i];
                if ( typeof iObj[index] != 'undefined') {
                  oObj[index] = iObj[index];
                }
              }
            }
            else {
              for ( let i in iObj ) {
                let index = str.indexOf( i ); 
                if ( index === -1) {
                  oObj[i] = iObj[i];
                }
              }
            }
            return oObj;
        }
        
        setAccessKey (api) {
            if (api.access_token && api.access_token.length > 50) {
                window.apiAccessToken = api.access_token;
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem('apiAccessToken', api.access_token);
                }
            }
        }
    }
    class JStore {
        constructor(options={}) {
            this._options = options;
            this._allowed = false;
            /**
             * session : true to enable sessionStorage
             * locastorage : by default true
             * onStore : to listen store changes
             */
            this._init();
        }

        _init() {
            if (typeof(Storage) !== "undefined") {
                this._allowed = true;
                // Code for localStorage/sessionStorage.
                window.onstorage = (e)=> {
                    if (this._options.onStore) this._options.onStore(e); 
                };
            } else {
                this._allowed = false;
                console.warn("Sorry! No Web Storage support..");
            }
        }

        //When passed a number n, this method will return the name of the nth key in the storage.
        key(n) {
            if (this._allowed) {
                return this._options.session ? console.warn("Session has not key method.") : window.localStorage.key(n)
            }
        }

        //When passed a key name, will return that key's value.
        get(name) {
            if (this._allowed) {
                return this._options.session ? window.sessionStorage.getItem(name) : window.localStorage.getItem(name);
            }
        }

        //When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
        set(name, value) {
            if (this._allowed) {
                return this._options.session ? window.sessionStorage.setItem(name, value) : window.localStorage.setItem(name, value);
            }
        }

        //When passed a key name, will remove that key from the storage.
        remove(name) {
            if (this._allowed) {
                return this._options.session ? window.sessionStorage.removeItem(name) : window.localStorage.removeItem(name);
            }
        }

        //clear all stored
        clearAll() {
            if (this._allowed) {
                return this._options.session ? window.sessionStorage.clear() : window.localStorage.clear();
            }
        }
    }
    class JUI extends API{
        constructor(options) {
            super();
            this.trackInf = {};
            this.buffer = {};
            this.bsCat1 = ['Modal', 'Tooltip', 'Collapse', 'Popover', 'ScrollSpy', 'Tab', 'Alert'];
            this.extraSelectors = ['hidden', 'visible', 'selected', 'checked', 'enabled'];
            this.parseHtml = this.templateHtml.bind(this);
            window.eventTracker = window.eventTracker || {};
        }

        validate(isExpired) {
            return new Promise((resolve, reject) => {
                this.validateApp(isExpired).then((tokenApi) => {
                    if (tokenApi.status != 'Success') {
                        reject(tokenApi);
                    } else {
                        try {
                            this.setAccessKey(tokenApi);
                            resolve(tokenApi);
                        } catch (err) {
                            reject(err);
                        }
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        }

        param2Url(params) {
            let url = [];
            for (var i in params) {
                var uri = i + '=' + params[i];
                url.push(uri);
            }
            return url.join('&');
        }

        // Provide unique in array
        unique(myArray) {
            return myArray.filter((v, i, a) => a.indexOf(v) === i);
        }

        // handle json parse
        parseJSON(obj, showErr_data) {
            let showErr = showErr_data || false;
            try {
                return JSON.parse(obj);
            } catch (e) {
                if (showErr) {
                    console.warn(e);
                }
                return {}; //Return blank object
            }
        }

        parseDom(str) {
            let parser = new DOMParser();
            let html = parser.parseFromString(str, 'text/html');
            return html;
        }

        // Add script data or url into page
        addScript(data, url, callback) {
            let sc = document.createElement("script");
            if (url) {
                sc.src = url;
                sc.async = true;
                sc.onload = function() { 
                    callback && callback();
                };
            } else {
                sc.innerHTML = data;
            }
            document.head.append(sc);
            return sc;
        }

        // used to genrate css links
        createLink(path) {
            let link = document.createElement('link');
            link.href = path;
            link.rel = "stylesheet";
            document.head.append(link);
        }

        // To enable Tag view on selected inputs
        // before use this call addTagViewCss once only
        enableTagView(options) {
            let selected = document.querySelectorAll('.tagin');
            for (const el of selected) {
                options ? TagView_1(el, options) : TagView_1(el);
            }
            return selected;
        }

        // Add css for tagsview inout
        addTagViewCss() {
            this.insert(document.head, `<style>${tagViewCss.style}</style>`, 'beforeend');
        }

        //check target selector is present in base selector/dom
        hasInall(selector, target) {
            let current = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            let result = [];
            if (current) {
                current.forEach((item)=> {
                    if (item.contains(target)) {
                        result.push(item);
                    }
                });
            }
            return result;
        }

        // removeAttr of jq like
        removeDomAttr(selector, attrArray) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (current) {
                attrArray.forEach((attr)=> {
                    current.removeAttribute(attr);
                });
            }

            return current || {};
        }

        // trigger events
        trigger(selector, evName, options) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (current) {
                options ? current.dispatchEvent(new Event(evName, options)) : current.dispatchEvent(new Event(evName));
            } else {
                console.warn("Selector not found.", selector);
            }
        }

        // Find in childrent of selected node
        findChild(selector, search, action) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let list = current.children || [];
            let found = [];
            if (search && list.length > 0) {
                let index = 0;
                while (list[index]) {
                    if (list[index].matches(search)) {
                        if (action) {
                            found.push(list[index]);
                        } else {
                            found = list[index];
                            break;
                        }
                    }
                    index++;
                }
                return found;
            } else {
                return list;
            }
        }

        closest(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let elm = current.parentElement;
            let result = [];
            if (search) {
                while (elm) {
                    if (this.find(elm, search)) {
                        result = this.find(elm, search);
                        break;
                    }
                    elm = elm.parentElement;
                }
            }
            return result;
        }

        parent(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let elm = current.parentElement;
            if (search) {
                while(elm) {
                    if (elm.matches(search)) {
                        break;
                    }
                    elm = elm.parentElement;
                }
            }

            return elm;
        }

        // find in sibiling or return imediate
        siblings(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let result = [];
            if (current) {
                var node = current.parentNode.firstChild;

                while ( node ) {
                    if ( node !== current && node.nodeType === Node.ELEMENT_NODE ) {
                        if (search) {
                                node.matches(search) ? result.push( node ) : "";
                        } else {
                            result.push( node );
                        }
                    }
                    node = node.nextElementSibling || node.nextSibling;
                }
            } 
            return result;
        }

        // find in next element or return all
        nextAll(selector) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let nextSibling = current.nextElementSibling;
            let result = [];
            if (nextSibling) {
                while(nextSibling) {
                    nextSibling = nextSibling.nextElementSibling;
                    result.push(nextSibling);
                }
            }

            return result;
        }

        // find in next 
        nextElm(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let nextSibling = current.nextElementSibling;
            if (search) {
                while(nextSibling) {
                    if (nextSibling.matches(search)) {
                        break;
                    }
                    nextSibling = nextSibling.nextElementSibling;
                }
            }

            return nextSibling;
        }

        // find in previous element
        prevElm(selector, search) {
            let current = (typeof selector == "object") ? selector : document.querySelector(selector);
            let previousSibling = current.previousElementSibling;
            if (search) {
                while(previousSibling) {
                    if (previousSibling.matches(search)) {
                        break;
                    }
                    previousSibling = previousSibling.previousElementSibling;
                }
            }

            return previousSibling;
        }

        // add dom loaded event
        onReady(func) {
            document.addEventListener('DOMContentLoaded', function(event) {
                func.call(event);
            });
        }

        // Create element from html string
        create(tagName, html) {
            let elem = document.createElement(tagName);
            if (html) {
                elem.innerHTML = html;
            }
            return elem;
            
        }

        clone(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return selected.cloneNode(true);
            }
            return null;
        }

        // Setrialize form nodes
        serialize(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return new URLSearchParams(new FormData(selected)).toString();
            }
            return null;
        }

        // Empty dom I.e $.empty()
        empty(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                while(selected.firstChild) selected.removeChild(selected.firstChild);
            }
            return selected;
        }

        // Get bootstrap5 instance accoridng to compoenent
        getBS(target, comp, options) {
            let selected = (typeof target == "object") ? target : document.querySelector(target);
            if (selected && this.bsCat1.includes(comp)) {
                let isIns = bootstrap[comp].getInstance(selected);
                if (isIns) {
                    return bootstrap[comp].getInstance(selected);
                } else {
                    let ref = new bootstrap[comp](selected, options);
                    return ref;
                }
            } else {
                return {};
            }
        }

        // Enable all mathced node's bootstrap5 compoenent
        enableBsAll(selector, comp) {
            if (this.bsCat1.includes(comp)) {
                let triggerList = [].slice.call(document.querySelectorAll(selector));
                let fireList = triggerList.map(function (triggerElm) {
                    return new bootstrap[comp](triggerElm)
                });
                return fireList;
            } else {
                console.error("Bootstrap can't enable for this component name");
                return [];
            }
        }

        // Hide enabled bootstrap5 compoenents
        hideBsAll(fireList, comp) {
            if (this.bsCat1.includes(comp)) {
                fireList.forEach(function (elm) {
                    elm.hide();
                });
            } else {
                console.error("Bootstrap can't disable for this component name");
            }
        }

        // Js based ajax i.e $.ajax
        ajax(sendData) {
            let longData = "";
            if (typeof (sendData.data) == 'object') {
                if (sendData.formData) {
                    longData = sendData.data;
                } else if (sendData.withUrl) {
                    let param = "?";
                    for (let k in sendData.data) {
                        if (typeof sendData.data[k] != 'object') {
                            param += "&" + k + "=" + sendData.data[k];
                        }	
                    }
                    sendData.url += param;
                } else {
                    longData = new FormData();
                    for (let prop in sendData.data) {
                        if (typeof sendData.data[prop] != 'object') {
                            longData.append(prop, sendData.data[prop]);
                        }	
                    }
                }
            }
            return new Promise((resolve, reject)=> {
                const request = new XMLHttpRequest();
                request.open(sendData.type || 'POST', sendData.url, true);
                if (sendData.responseType) {
                    request.responseType = sendData.responseType;
                }
                request.onreadystatechange = (event) => {
                    if (request.readyState == 4 && request.status === 200) {
                        try {
                            resolve(request.responseText, event);
                        } catch (err) {
                            reject(err);
                        }
                    } 
                };
                request.onerror = (requestError) => {
                    reject(requestError);
                };
                if (sendData.onStart) request.onloadstart = sendData.onStart;
                if (sendData.onEnd) request.onloadend = sendData.onEnd;
                request.send(longData);
            });
        }

        // get script from url
        getJSON(url) {
            var scr = document.createElement('script');
            scr.src = url;
            document.body.appendChild(scr);
        }

        // $.offset alternative
        offset(container) {
            let rect = (typeof container == "object") ? container : document.querySelector(container);
            let offset = {rect};
            if (rect) {
                let clientRect = rect.getBoundingClientRect();
                offset = { 
                    target: rect,
                    clientRect,
                    top: clientRect.top + window.scrollY, 
                    left: clientRect.left + window.scrollX, 
                };
            }
            
            return offset;
        }

        // find in array
        findInArray(value, baseArray) {
            if (value && baseArray) {
                return baseArray.find((item)=> item == value );
            }

            return false;
        }

        // comapre two array
        inArray(baseArray, compareArray) {
            let matched = [];
            if (baseArray && compareArray) {
                baseArray.forEach((item)=> {
                    compareArray.forEach((comp)=> {
                        if (item == comp) {
                            matched.includes(comp) ? "" : matched.push(comp);
                        }
                    });
                });
            }

            return matched.length > 0 ? matched.length : -1;
        }

        // Find target node into base node and some extra selectors
        find(baseSelector, target, data ) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            let typeAction = (typeof data == "object") ? "action" : data;
            if (base) {
                switch (typeAction) {
                    case 'all' : return base.querySelectorAll(target);
                    case 'child' : return base.querySelector(target).childNodes;
                    case 'hidden': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> elm.offsetWidth == 0 && elm.offsetHeight == 0);
                    case 'visible': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> elm.offsetWidth > 0 && elm.offsetHeight > 0);
                    case 'checked': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.checked);
                    case 'selected': return Array.prototype.filter.call(base.querySelectorAll(target), (elm)=> elm.selected);
                    case 'action': {
                        let found = base.querySelectorAll(target);
                        if (found && found.length > 0 && data.action) {
                            found.forEach((_elm)=> this.jsAction(_elm, {action: data.action, actionData: data.actionData}));
                        }
                        return found;
                    }
                    default: return base.querySelector(target);  
                }
            }
            return [];
        }

        // Select all using query selectors and perform action both
        selectAll(selector, action, actionData) {
            let selected = this.extraSelectors.includes(action) ?  this.selectAction(selector, action) : (typeof selector == 'object' ? selector : document.querySelectorAll(selector));
            if (selected && selected.length > 0 && action) {
                selected.forEach((elm)=> this.jsAction(elm, {action, actionData}));
            }
            return selected;
        }

        // Select and enhance selector like jquery
        select(selector, action, actionData) {
            if (this.extraSelectors.includes(action) ) {
                return this.selectAction(selector, action);
            } else {
                selector = (typeof selector == 'object') ? selector : document.querySelector(selector);
                if (selector) {
                    this.jsAction(selector, {action, actionData});
                }
                return  selector || {};
            }
        }

        getElm(selector, type) {
            return document.getElementById(selector) || {};
        }

        // Listen all node with events
        listenAll(target, eventName, func) {
            let selected = (typeof target == "object") ? target : document.querySelectorAll(target);
            if (selected && selected.length > 0) {
                for (let i = 0; i < selected.length; i++) {
                    selected[i].addEventListener(eventName, func, false);
                }
            }
        }

        // bind event directly on nodes
        bind(selector, eventName, handler) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                selected.addEventListener(eventName, handler);
            }
        }

        // Listen target with in base node listner
        listen(baseSelector, eventName, selector, handler) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            if (!base) return false;
            if (window.eventTracker[selector]) {
                base.removeEventListener(eventName, window.eventTracker[selector]);
            }
            window.eventTracker[selector] = this.onListen.bind(this, selector, handler, base);
            base.addEventListener(eventName, window.eventTracker[selector]);
        }

        // remove node classes
        removeClass(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> this.jsAction(elm, {action: 'removeClass', actionData: name}) );
            }
            return selected || {};
        }
        // add class for node
        addClass(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> this.jsAction(elm, {action: 'addClass', actionData: name}) );
            }
            return selected || {};
        }

        // dom visibility handle
        toggleDom(dom, action="toggleDisplay") {
            let selected =  typeof dom == "object" ? dom : document.querySelectorAll(dom);
            if (selected && selected.length > 0) {
                selected.forEach((elm)=> this.jsAction(elm, {action}));
            }
            return selected || {};
        }

        // alterntive of $.select2
        select2(selecor) {
            let found = document.querySelector(`${selecor} + span > .selection > span`);
            if (found) {
                found.click();
            }
        }

        // Set dataset on element
        setData(selector, attrs) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                for (let property in attrs) {
                    selected.dataset[property] = attrs[property];
                }
            }
            return selected || {};
        }

        // manage attr using object
        setAttr(selector, attrs) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                for (let property in attrs) {
                    selected.setAttribute(property, attrs[property]);
                }
            }
            return selected || {};
        }

        // add css using object
        setCss(selector, cssList) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                for (let property in cssList) {
                    selected.style && (selected.style[property] = cssList[property]);
                }
            }
            return selected || {};
        }

        //alternative of $.remove
        remove(dom) {
            let selected =  document.querySelectorAll(dom);
            if (selected.length > 0) {
                selected.forEach((elm)=> elm.remove());
            }
        }

        // alternive of $.replaceWith
        replaceWith(selector, domStr) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                let createdNode = this.templateHtml(domStr);
                selected.replaceWith(createdNode);
                return createdNode;
            }
            return selected;

        }

        wrap(selector, domStr) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                let createdNode = this.templateHtml(domStr);
                let innerNode = this.innerChild(createdNode);
                innerNode.innerHTML = selected.outerHTML;
                selected.parentNode.replaceChild(createdNode, selected);
                return innerNode.firstChild;
            }
            return selected;
        }

        unwrap(selector) {
            let nodeToRemove = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (nodeToRemove && nodeToRemove.length > 0) {
                nodeToRemove.forEach((item)=> {
                    item.outerHTML = item.innerHTML;
                });
            }
        }

        insertAfter(newNode, existingNode) {
            newNode = (typeof newNode == "object") ? newNode : document.querySelector(newNode);
            existingNode = (typeof existingNode == "object") ? existingNode : document.querySelector(existingNode);
            if (newNode && existingNode) {
                existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
            }

            return newNode;
        }

        // Insert using html string, need to provide position also
        insert(selector, domStr, position) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                switch (position) {
                    case 'beforebegin': selected.insertAdjacentHTML('beforebegin', domStr);
                    break;
                    case 'afterbegin': selected.insertAdjacentHTML('afterbegin', domStr);
                    break;
                    case 'beforeend': selected.insertAdjacentHTML('beforeend', domStr);
                    break;
                    case 'afterend': selected.insertAdjacentHTML('afterend', domStr);
                    break;
                }
            }
            return selected || {};
        }

        // provide dom index like $.index
        domIndex(selector) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            if (selected) {
                return Array.from( selected.parentNode.children ).indexOf( selected );
            } else {
                retunr -1;
            }
        }

        // compare selector in base node
        match(baseSelector, mathStr) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            let matched = [];
            if (base && base.length > 0 ) {
                base.forEach((elm)=> {
                    if (elm.matches(mathStr)) matched.push(elm);
                });
            } else {
                return base && base.matches(mathStr);
            }
            return matched;
        }

        // check selector in base node
        contains(selector, text) {
            var elements = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                return [].filter.call(elements, function(element) {
                    return RegExp(text).test(element.textContent);
                    });
            } else {
                return [];
            }
        }

        // added the stylesheet in head
        createLink (path) {
            let link = document.createElement('link');
            link.href = path;
            link.rel = "stylesheet";
            document.head.append(link);
        }

        // merge two object like $.extend
        extend() {
            //This function are alternative of $.extend which merge content of objects into first one
            // To create deep copy pass true as first argument
            // Variables
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;
        
            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }
        
            // Merge the object into the extended object
            var merge = function (obj) {
                for ( var prop in obj ) {
                    if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                        // If deep merge and property is an object, merge properties
                        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                            extended[prop] = extend( true, extended[prop], obj[prop] );
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };
        
            // Loop through each object and conduct a merge
            for ( ; i < length; i++ ) {
                var obj = arguments[i];
                merge(obj);
            }
        
            return extended;
        
        }

        // return querystring as object
        url(url = window.location.href) {
            return new URLSearchParams(url);
        }

        updateEditorUrl(data) {
            let newUrl = `?action=new&content_subtype=${data.subtype}&content_type=${data.type}&content_icon=${data.content_icon}&react_content=1`;
            window.history.replaceState(null, '', newUrl);
        }

        getUrlVars() {
            let vars = [], hash;
            let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (let i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        setApiKey(token) {
            window.apiAccessToken = token;
        }

        validateAjaxData(ajaxData, subtype) {
            if (subtype == 0 || subtype == 8) {
                if (ajaxData && !this.get('is_proposed')) {
                    if (ajaxData.content_text) {
                        try {
                            ajaxData.content_text.answers.forEach((item,index)=> {
                                ajaxData.content_text.answers[index].answer =  item.answer.replace(/\n/g, "");
                            });
                        } catch(e) {
                            console.log(e);
                            let tempAjaxData = {
                                answers: [
                                    {
                                        is_correct: "0",
                                        answer: "Option A.",
                                        id: "01"
                                    },
                                    {
                                        is_correct: "0",
                                        answer: "Option B.",
                                        id: "02"
                                    },
                                    {
                                        is_correct: "0",
                                        answer: "Option C.",
                                        id: "03"
                                    },
                                    {
                                        is_correct: "0",
                                        answer: "Option D.",
                                        id: "04"
                                    },
                                ],
                                correct_ans_str: "D",
                                total_answers: 4,
                                correct_answers: 1
                            };
                            return tempAjaxData;
                        }
                        //console.log(ajaxData.content_text.answers);
                        return ajaxData.content_text;
                    }
                    return ajaxData;
                } else {
                    let tempAjaxData = {
                        answers: [
                            {
                                is_correct: "0",
                                answer: "Option A.",
                                id: "01"
                            },
                            {
                                is_correct: "0",
                                answer: "Option B.",
                                id: "02"
                            },
                            {
                                is_correct: "0",
                                answer: "Option C.",
                                id: "03"
                            },
                            {
                                is_correct: "0",
                                answer: "Option D.",
                                id: "04"
                            },
                        ],
                        correct_ans_str: "D",
                        total_answers: 4,
                        correct_answers: 1
                    };
                    return tempAjaxData;
                }
            }
            return ajaxData;
            
        }
        
        // watch if dom changes
        watchDom(target, func, options={childList: true}) {
            let observer = new MutationObserver(function (mutationRecords) {
                    //if (mutationRecords[0].addedNodes[0].nodeName === "SPAN")
                    func && func(mutationRecords);
                });
            observer.observe(target, options);
            return observer;
        }

        // revert if enity blocked by html
        ignoreEnity(html) {
            return html.replace(/&amp;/g,'&');
        }

        // cahce funciton to avoid repated outputs
        cache(func) {
            var chacheData = new Map();
            return function(input) {
                if(chacheData.has(input)) {
                    return chacheData.get(input);
                }

                var newResult = func(input);
                chacheData.set(input,newResult);

                return newResult;
            }
        }

        // store data
        set(key, value) {
            window.JUITemp[key] = value;
        }

        // get data from store
        get(key) {
            return window.JUITemp[key];
        }

        // find caller
        caller() {
            console.log("called from " + arguments.callee.caller.toString());
        }

        // show warnign messages
        showmsg(msg, time = 10000) {
            let errorAlert = document.querySelector("#showMsgAlert");
            if (this.buffer['showmsg']) clearTimeout(this.buffer['showmsg']);
            if (errorAlert) {
                errorAlert.classList.add('show');
                this.select("#showMsgBody").innerHTML = msg;
            } else {
                this.insert(document.body, this.getModalHtml(msg, 'Alert'), 'beforeend');
            }
            setTimeout(()=> {
                let alterRef= this.getBS(document.querySelector("#showMsgAlert"), 'Alert');
                alterRef.close && alterRef.close();
            }, time);
        }

        alert(msgData) {
            if (document.getElementById('showBSModal')) {
                this.getBS("#showBSModal", 'Modal').show();
                this.select("#showBSBody").innerHTML = msgData|| "No msg provided...";
            } else {
                this.insert(document.body, this.getModalHtml(msgData, 'showBSModal'), 'beforeend');
                this.getBS("#showBSModal", 'Modal').show();
            }
        }

        getModalHtml(data, type) {
            switch(type) {
                case 'Alert' : 
                    return (`
                    <div id="showMsgAlert" class="alert alert-warning alert-dismissible text-center fade show" role="alert" style="z-index:9999;min-height:50px;position:fixed;width:100%;">
                        <span id="showMsgBody">${data}</span>
                        <button type="button" class="btn-close" style="margin-top: -3px;" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `)
                case 'showBSModal':
                  return(`
                    <div class="modal fade" id="showBSModal" tabindex="-1" aria-labelledby="Alert" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" id="showBSDialog">
                            <div class="modal-content">
                                <div class="modal-body text-center fs-5 pt-4" id="showBSBody">
                                    ${data}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn bg-light m-auto text-dark" data-bs-dismiss="modal">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>`
                    );
            }

        }

        // check data validity
        isValid(data, filter = false) {
            if (data && data != undefined && data != "" && data != "undefined" && data != null) {
                return true;
            } else {
                if (filter && data != filter) return true;
                return false;
            }
        }

        // store algo
        store(target,data) {
        }

        // convert query from objects
        query(data) {
            var inf = 'item_error_log=1';
                if (typeof (data) == 'object') {
                    for (let key in data) {
                    if (typeof data[key] != 'object') {
                        inf += "&" + key + "=" + data[key];
                    }	
                }
            }
            return inf;
        }
        
        // show activator
        activate(loader) {
            document.querySelector('#activateLoaderContainer') && document.querySelector('#activateLoaderContainer').remove(); 
            if (loader > 0) {
                this.insert(document.body, `<div id="activateLoaderContainer" class="activateOverlay" style="z-index:9999999;"><center><div class="activator" style="height:100px; width: 100px;"></div></center></div>`, 'afterend');
            }
        }
        
        // listner callback
        onListen(selector, handler, base, event) {
            let target = event.target; //|| event.relatedTarget || event.toElement;
            let closest = target.closest && target.closest(selector);
            if (closest && base.contains(closest)) {
                // passes the event to the handler and sets `this`
                // in the handler as the closest parent matching the
                // selector from the target element of the event
                handler.call(this, closest, event);
            }
        }

        isFocus(target) {
            let selected = typeof target == 'object' ? target : document.querySelector(target);
            if (selected == document.activeElement) {
                return true;
            }
            return false;
        }
        
        // find inner child in dom
        innerChild(node) {
            let currentNode = (typeof node == "object") ? node : document.querySelector(node);
            let result = currentNode;
            if (currentNode && currentNode.lastChild) {
                currentNode = currentNode.lastChild;
                while ( currentNode ) {
                    result = currentNode;
                    currentNode = currentNode.lastChild;
                }
            }
            
            return result;
        }
        
        // parse html into template and reurn nodes
        templateHtml(html) {
            let t = document.createElement('template');
            t.innerHTML = html;
            return t.content.firstElementChild.cloneNode(true);
        }
        
        // action of selector
        selectAction(selector, type) {
            switch (type) {
                case 'hidden': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.offsetWidth == 0 && elm.offsetHeight == 0);
                case 'visible': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.offsetWidth > 0 && elm.offsetHeight > 0);
                case 'selected': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.selected);
                case 'checked': return Array.prototype.filter.call(document.querySelectorAll(selector), (elm)=> elm.checked);
                case 'enabled': return document.querySelectorAll(selector + ':not([disabled]');
                default: return document.querySelector(selector);  
            }
        }
        
        // handle inline actions of js
        jsAction(selected, data) {
            switch(data.action) {
                case 'show': selected.style.display = "block";
                break;
                case 'hide': selected.style.display = "none";
                break;
                case 'toggleDisplay': selected.style.display = (selected.style.display == "none") ? "block" : "none";
                break;
                case 'addClass': typeof data.actionData == "object" ? selected.classList.add(...data.actionData) : selected.classList.add(data.actionData);
                break;
                case 'removeClass': typeof data.actionData == "object" ? selected.classList.remove(...data.actionData) : selected.classList.remove(data.actionData);
                break;
                case 'toggleClass': selected.classList.toggle(data.actionData);
                break;
                case 'html' : selected.innerHTML = data.actionData;
                break;
                case 'value': selected.value = data.actionData;
                break;
                case 'text': selected.textContent = data.actionData;
                break;
                case 'checked':  selected.checked = data.actionData;
                break;
                case 'remove': selected.remove();
                break;
                case 'removeAttr': selected.removeAttribute(data.actionData);
                break;
                case 'css' : this.setCss(selected, data.actionData);
                break;
                case 'attr': this.setAttr(selected, data.actionData);
                break;
                case 'data': this.setData(selected, data.actionData);
            }
        }
    } 

    const JS = new JUI();

    /*
     Copyright 2011-2013 Abdulla Abdurakhmanov
     Original sources are available at https://code.google.com/p/x2js/

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
     */

    var xml2json = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
         {
             module.exports = factory();
         }
     }(commonjsGlobal, function () {
    	return function (config) {
    			
    		var VERSION = "1.2.0";
    		
    		config = config || {};
    		initConfigDefaults();
    		
    		function initConfigDefaults() {
    			if(config.escapeMode === undefined) {
    				config.escapeMode = true;
    			}
    			
    			config.attributePrefix = config.attributePrefix || "_";
    			config.arrayAccessForm = config.arrayAccessForm || "none";
    			config.emptyNodeForm = config.emptyNodeForm || "text";		
    			
    			if(config.enableToStringFunc === undefined) {
    				config.enableToStringFunc = true; 
    			}
    			config.arrayAccessFormPaths = config.arrayAccessFormPaths || []; 
    			if(config.skipEmptyTextNodesForObj === undefined) {
    				config.skipEmptyTextNodesForObj = true;
    			}
    			if(config.stripWhitespaces === undefined) {
    				config.stripWhitespaces = true;
    			}
    			config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];
    	
    			if(config.useDoubleQuotes === undefined) {
    				config.useDoubleQuotes = false;
    			}
    			
    			config.xmlElementsFilter = config.xmlElementsFilter || [];
    			config.jsonPropertiesFilter = config.jsonPropertiesFilter || [];
    			
    			if(config.keepCData === undefined) {
    				config.keepCData = false;
    			}
    		}
    	
    		var DOMNodeTypes = {
    			ELEMENT_NODE 	   : 1,
    			TEXT_NODE    	   : 3,
    			CDATA_SECTION_NODE : 4,
    			COMMENT_NODE	   : 8,
    			DOCUMENT_NODE 	   : 9
    		};
    		
    		function getNodeLocalName( node ) {
    			var nodeLocalName = node.localName;			
    			if(nodeLocalName == null) // Yeah, this is IE!! 
    				nodeLocalName = node.baseName;
    			if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
    				nodeLocalName = node.nodeName;
    			return nodeLocalName;
    		}
    		
    		function getNodePrefix(node) {
    			return node.prefix;
    		}
    			
    		function escapeXmlChars(str) {
    			if(typeof(str) == "string")
    				return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    			else
    				return str;
    		}
    		
    		function checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
    			var idx = 0;
    			for(; idx < stdFiltersArrayForm.length; idx++) {
    				var filterPath = stdFiltersArrayForm[idx];
    				if( typeof filterPath === "string" ) {
    					if(filterPath == path)
    						break;
    				}
    				else
    				if( filterPath instanceof RegExp) {
    					if(filterPath.test(path))
    						break;
    				}				
    				else
    				if( typeof filterPath === "function") {
    					if(filterPath(obj, name, path))
    						break;
    				}
    			}
    			return idx!=stdFiltersArrayForm.length;
    		}
    		
    		function toArrayAccessForm(obj, childName, path) {
    			switch(config.arrayAccessForm) {
    				case "property":
    					if(!(obj[childName] instanceof Array))
    						obj[childName+"_asArray"] = [obj[childName]];
    					else
    						obj[childName+"_asArray"] = obj[childName];
    					break;
    				/*case "none":
    					break;*/
    			}
    			
    			if(!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
    				if(checkInStdFiltersArrayForm(config.arrayAccessFormPaths, obj, childName, path)) {
    					obj[childName] = [obj[childName]];
    				}			
    			}
    		}
    		
    		function fromXmlDateTime(prop) {
    			// Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
    			// Improved to support full spec and optional parts
    			var bits = prop.split(/[-T:+Z]/g);
    			
    			var d = new Date(bits[0], bits[1]-1, bits[2]);			
    			var secondBits = bits[5].split("\.");
    			d.setHours(bits[3], bits[4], secondBits[0]);
    			if(secondBits.length>1)
    				d.setMilliseconds(secondBits[1]);
    	
    			// Get supplied time zone offset in minutes
    			if(bits[6] && bits[7]) {
    				var offsetMinutes = bits[6] * 60 + Number(bits[7]);
    				var sign = /\d\d-\d\d:\d\d$/.test(prop)? '-' : '+';
    	
    				// Apply the sign
    				offsetMinutes = 0 + (sign == '-'? -1 * offsetMinutes : offsetMinutes);
    	
    				// Apply offset and local timezone
    				d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
    			}
    			else
    				if(prop.indexOf("Z", prop.length - 1) !== -1) {
    					d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));					
    				}
    	
    			// d is now a local time equivalent to the supplied time
    			return d;
    		}
    		
    		function checkFromXmlDateTimePaths(value, childName, fullPath) {
    			if(config.datetimeAccessFormPaths.length > 0) {
    				var path = fullPath.split("\.#")[0];
    				if(checkInStdFiltersArrayForm(config.datetimeAccessFormPaths, value, childName, path)) {
    					return fromXmlDateTime(value);
    				}
    				else
    					return value;			
    			}
    			else
    				return value;
    		}
    		
    		function checkXmlElementsFilter(obj, childType, childName, childPath) {
    			if( childType == DOMNodeTypes.ELEMENT_NODE && config.xmlElementsFilter.length > 0) {
    				return checkInStdFiltersArrayForm(config.xmlElementsFilter, obj, childName, childPath);	
    			}
    			else
    				return true;
    		}	
    	
    		function parseDOMChildren( node, path ) {
    			if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
    				var result = new Object;
    				var nodeChildren = node.childNodes;
    				// Alternative for firstElementChild which is not supported in some environments
    				for(var cidx=0; cidx <nodeChildren.length; cidx++) {
    					var child = nodeChildren.item(cidx);
    					if(child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
    						var childName = getNodeLocalName(child);
    						result[childName] = parseDOMChildren(child, childName);
    					}
    				}
    				return result;
    			}
    			else
    			if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
    				var result = new Object;
    				result.__cnt=0;
    				
    				var nodeChildren = node.childNodes;
    				
    				// Children nodes
    				for(var cidx=0; cidx <nodeChildren.length; cidx++) {
    					var child = nodeChildren.item(cidx); // nodeChildren[cidx];
    					var childName = getNodeLocalName(child);
    					
    					if(child.nodeType!= DOMNodeTypes.COMMENT_NODE) {
    						var childPath = path+"."+childName;
    						if (checkXmlElementsFilter(result,child.nodeType,childName,childPath)) {
    							result.__cnt++;
    							if(result[childName] == null) {
    								result[childName] = parseDOMChildren(child, childPath);
    								toArrayAccessForm(result, childName, childPath);					
    							}
    							else {
    								if(result[childName] != null) {
    									if( !(result[childName] instanceof Array)) {
    										result[childName] = [result[childName]];
    										toArrayAccessForm(result, childName, childPath);
    									}
    								}
    								(result[childName])[result[childName].length] = parseDOMChildren(child, childPath);
    							}
    						}
    					}								
    				}
    				
    				// Attributes
    				for(var aidx=0; aidx <node.attributes.length; aidx++) {
    					var attr = node.attributes.item(aidx); // [aidx];
    					result.__cnt++;
    					result[config.attributePrefix+attr.name]=attr.value;
    				}
    				
    				// Node namespace prefix
    				var nodePrefix = getNodePrefix(node);
    				if(nodePrefix!=null && nodePrefix!="") {
    					result.__cnt++;
    					result.__prefix=nodePrefix;
    				}
    				
    				if(result["#text"]!=null) {				
    					result.__text = result["#text"];
    					if(result.__text instanceof Array) {
    						result.__text = result.__text.join("\n");
    					}
    					//if(config.escapeMode)
    					//	result.__text = unescapeXmlChars(result.__text);
    					if(config.stripWhitespaces)
    						result.__text = result.__text.trim();
    					delete result["#text"];
    					if(config.arrayAccessForm=="property")
    						delete result["#text_asArray"];
    					result.__text = checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
    				}
    				if(result["#cdata-section"]!=null) {
    					result.__cdata = result["#cdata-section"];
    					delete result["#cdata-section"];
    					if(config.arrayAccessForm=="property")
    						delete result["#cdata-section_asArray"];
    				}
    				
    				if( result.__cnt == 0 && config.emptyNodeForm=="text" ) {
    					result = '';
    				}
    				else
    				if( result.__cnt == 1 && result.__text!=null  ) {
    					result = result.__text;
    				}
    				else
    				if( result.__cnt == 1 && result.__cdata!=null && !config.keepCData  ) {
    					result = result.__cdata;
    				}			
    				else			
    				if ( result.__cnt > 1 && result.__text!=null && config.skipEmptyTextNodesForObj) {
    					if( (config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
    						delete result.__text;
    					}
    				}
    				delete result.__cnt;			
    				
    				if( config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
    					result.toString = function() {
    						return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
    					};
    				}
    				
    				return result;
    			}
    			else
    			if(node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
    				return node.nodeValue;
    			}	
    		}
    		
    		function startTag(jsonObj, element, attrList, closed) {
    			var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
    			if(attrList!=null) {
    				for(var aidx = 0; aidx < attrList.length; aidx++) {
    					var attrName = attrList[aidx];
    					var attrVal = jsonObj[attrName];
    					if(config.escapeMode)
    						attrVal=escapeXmlChars(attrVal);
    					resultStr+=" "+attrName.substr(config.attributePrefix.length)+"=";
    					if(config.useDoubleQuotes)
    						resultStr+='"'+attrVal+'"';
    					else
    						resultStr+="'"+attrVal+"'";
    				}
    			}
    			if(!closed)
    				resultStr+=">";
    			else
    				resultStr+="/>";
    			return resultStr;
    		}
    		
    		function endTag(jsonObj,elementName) {
    			return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
    		}
    		
    		function endsWith(str, suffix) {
    			return str.indexOf(suffix, str.length - suffix.length) !== -1;
    		}
    		
    		function jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
    			if((config.arrayAccessForm=="property" && endsWith(jsonObjField.toString(),("_asArray"))) 
    					|| jsonObjField.toString().indexOf(config.attributePrefix)==0 
    					|| jsonObjField.toString().indexOf("__")==0
    					|| (jsonObj[jsonObjField] instanceof Function) )
    				return true;
    			else
    				return false;
    		}
    		
    		function jsonXmlElemCount ( jsonObj ) {
    			var elementsCnt = 0;
    			if(jsonObj instanceof Object ) {
    				for( var it in jsonObj  ) {
    					if(jsonXmlSpecialElem ( jsonObj, it) )
    						continue;			
    					elementsCnt++;
    				}
    			}
    			return elementsCnt;
    		}
    		
    		function checkJsonObjPropertiesFilter(jsonObj, propertyName, jsonObjPath) {
    			return config.jsonPropertiesFilter.length == 0
    				|| jsonObjPath==""
    				|| checkInStdFiltersArrayForm(config.jsonPropertiesFilter, jsonObj, propertyName, jsonObjPath);	
    		}
    		
    		function parseJSONAttributes ( jsonObj ) {
    			var attrList = [];
    			if(jsonObj instanceof Object ) {
    				for( var ait in jsonObj  ) {
    					if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(config.attributePrefix)==0) {
    						attrList.push(ait);
    					}
    				}
    			}
    			return attrList;
    		}
    		
    		function parseJSONTextAttrs ( jsonTxtObj ) {
    			var result ="";
    			
    			if(jsonTxtObj.__cdata!=null) {										
    				result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
    			}
    			
    			if(jsonTxtObj.__text!=null) {			
    				if(config.escapeMode)
    					result+=escapeXmlChars(jsonTxtObj.__text);
    				else
    					result+=jsonTxtObj.__text;
    			}
    			return result;
    		}
    		
    		function parseJSONTextObject ( jsonTxtObj ) {
    			var result ="";
    	
    			if( jsonTxtObj instanceof Object ) {
    				result+=parseJSONTextAttrs ( jsonTxtObj );
    			}
    			else
    				if(jsonTxtObj!=null) {
    					if(config.escapeMode)
    						result+=escapeXmlChars(jsonTxtObj);
    					else
    						result+=jsonTxtObj;
    				}
    			
    			return result;
    		}
    		
    		function getJsonPropertyPath(jsonObjPath, jsonPropName) {
    			if (jsonObjPath==="") {
    				return jsonPropName;
    			}
    			else
    				return jsonObjPath+"."+jsonPropName;
    		}
    		
    		function parseJSONArray ( jsonArrRoot, jsonArrObj, attrList, jsonObjPath ) {
    			var result = ""; 
    			if(jsonArrRoot.length == 0) {
    				result+=startTag(jsonArrRoot, jsonArrObj, attrList, true);
    			}
    			else {
    				for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
    					result+=startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
    					result+=parseJSONObject(jsonArrRoot[arIdx], getJsonPropertyPath(jsonObjPath,jsonArrObj));
    					result+=endTag(jsonArrRoot[arIdx],jsonArrObj);
    				}
    			}
    			return result;
    		}
    		
    		function parseJSONObject ( jsonObj, jsonObjPath ) {
    			var result = "";	
    	
    			var elementsCnt = jsonXmlElemCount ( jsonObj );
    			
    			if(elementsCnt > 0) {
    				for( var it in jsonObj ) {
    					
    					if(jsonXmlSpecialElem ( jsonObj, it) || (jsonObjPath!="" && !checkJsonObjPropertiesFilter(jsonObj, it, getJsonPropertyPath(jsonObjPath,it))) )
    						continue;			
    					
    					var subObj = jsonObj[it];						
    					
    					var attrList = parseJSONAttributes( subObj );
    					
    					if(subObj == null || subObj == undefined) {
    						result+=startTag(subObj, it, attrList, true);
    					}
    					else
    					if(subObj instanceof Object) {
    						
    						if(subObj instanceof Array) {					
    							result+=parseJSONArray( subObj, it, attrList, jsonObjPath );					
    						}
    						else if(subObj instanceof Date) {
    							result+=startTag(subObj, it, attrList, false);
    							result+=subObj.toISOString();
    							result+=endTag(subObj,it);
    						}
    						else {
    							var subObjElementsCnt = jsonXmlElemCount ( subObj );
    							if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
    								result+=startTag(subObj, it, attrList, false);
    								result+=parseJSONObject(subObj, getJsonPropertyPath(jsonObjPath,it));
    								result+=endTag(subObj,it);
    							}
    							else {
    								result+=startTag(subObj, it, attrList, true);
    							}
    						}
    					}
    					else {
    						result+=startTag(subObj, it, attrList, false);
    						result+=parseJSONTextObject(subObj);
    						result+=endTag(subObj,it);
    					}
    				}
    			}
    			result+=parseJSONTextObject(jsonObj);
    			
    			return result;
    		}
    		
    		this.parseXmlString = function(xmlDocStr) {
    			var isIEParser = window.ActiveXObject || "ActiveXObject" in window;
    			if (xmlDocStr === undefined) {
    				return null;
    			}
    			var xmlDoc;
    			if (window.DOMParser) {
    				var parser=new window.DOMParser();			
    				var parsererrorNS = null;
    				// IE9+ now is here
    				if(!isIEParser) {
    					try {
    						parsererrorNS = parser.parseFromString("INVALID", "text/xml").getElementsByTagName("parsererror")[0].namespaceURI;
    					}
    					catch(err) {					
    						parsererrorNS = null;
    					}
    				}
    				try {
    					xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
    					if( parsererrorNS!= null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
    						//throw new Error('Error parsing XML: '+xmlDocStr);
    						xmlDoc = null;
    					}
    				}
    				catch(err) {
    					xmlDoc = null;
    				}
    			}
    			else {
    				// IE :(
    				if(xmlDocStr.indexOf("<?")==0) {
    					xmlDocStr = xmlDocStr.substr( xmlDocStr.indexOf("?>") + 2 );
    				}
    				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    				xmlDoc.async="false";
    				xmlDoc.loadXML(xmlDocStr);
    			}
    			return xmlDoc;
    		};
    		
    		this.asArray = function(prop) {
    			if (prop === undefined || prop == null)
    				return [];
    			else
    			if(prop instanceof Array)
    				return prop;
    			else
    				return [prop];
    		};
    		
    		this.toXmlDateTime = function(dt) {
    			if(dt instanceof Date)
    				return dt.toISOString();
    			else
    			if(typeof(dt) === 'number' )
    				return new Date(dt).toISOString();
    			else	
    				return null;
    		};
    		
    		this.asDateTime = function(prop) {
    			if(typeof(prop) == "string") {
    				return fromXmlDateTime(prop);
    			}
    			else
    				return prop;
    		};
    	
    		this.xml2json = function (xmlDoc) {
    			return parseDOMChildren ( xmlDoc );
    		};
    		
    		this.xml_str2json = function (xmlDocStr) {
    			var xmlDoc = this.parseXmlString(xmlDocStr);
    			if(xmlDoc!=null)
    				return this.xml2json(xmlDoc);
    			else
    				return null;
    		};
    	
    		this.json2xml_str = function (jsonObj) {
    			return parseJSONObject ( jsonObj, "" );
    		};
    	
    		this.json2xml = function (jsonObj) {
    			var xmlDocStr = this.json2xml_str (jsonObj);
    			return this.parseXmlString(xmlDocStr);
    		};
    		
    		this.getVersion = function () {
    			return VERSION;
    		};	
    	}
    }));
    });

    /* helper\HelperAI.svelte generated by Svelte v3.29.0 */

    function XMLToJSON(myXml) {
    	//var myXml = xml;
    	myXml = myXml.replace(/<\!--\[CDATA\[/g, "<![CDATA[").replace(/\]\]-->/g, "]]>");

    	let x2js = new xml2json({ useDoubleQuotes: true });
    	let newXml = JSON.stringify(x2js.xml_str2json(myXml));
    	newXml = newXml.replace("SMXML", "smxml");
    	newXml = JSON.parse(newXml);
    	return newXml;
    }

    const AH = new JUI();
    const SSD = new JStore();

    /* clsSMChooseMultiGrid\ChooseMultiGridPreview.svelte generated by Svelte v3.29.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (412:16) {#if showcorrectanswer == false}
    function create_if_block_5(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*preview_data*/ ctx[4].correctxmlarray;
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data, box_width*/ 24) {
    				each_value_1 = /*preview_data*/ ctx[4].correctxmlarray;
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (432:28) {:else}
    function create_else_block_4(ctx) {
    	let t_value = /*value*/ ctx[25].value + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data*/ 16 && t_value !== (t_value = /*value*/ ctx[25].value + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (430:67) 
    function create_if_block_8(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	return {
    		c() {
    			img = element("img");
    			set_style(img, "height", "70px");
    			set_style(img, "width", "100%");
    			set_style(img, "object-fit", "contain");
    			attr(img, "class", "px-2");
    			if (img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[25].value.split("##")[0].slice(1))) attr(img, "src", img_src_value);

    			attr(img, "alt", img_alt_value = /*value*/ ctx[25].value.split("##")[1]
    			? /*value*/ ctx[25].value.split("##")[1]
    			: null);
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data*/ 16 && img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[25].value.split("##")[0].slice(1))) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*preview_data*/ 16 && img_alt_value !== (img_alt_value = /*value*/ ctx[25].value.split("##")[1]
    			? /*value*/ ctx[25].value.split("##")[1]
    			: null)) {
    				attr(img, "alt", img_alt_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    // (424:28) {#if value.value.charAt(0) == "!"}
    function create_if_block_6(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (show_if == null || dirty & /*preview_data*/ 16) show_if = !!(/*value*/ ctx[25].value.charAt(1) == "*");
    		if (show_if) return create_if_block_7;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (427:32) {:else}
    function create_else_block_3(ctx) {
    	let t_value = /*value*/ ctx[25].value.slice(1) + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data*/ 16 && t_value !== (t_value = /*value*/ ctx[25].value.slice(1) + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (425:32) {#if value.value.charAt(1) == "*"}
    function create_if_block_7(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	return {
    		c() {
    			img = element("img");
    			set_style(img, "height", "70px");
    			set_style(img, "width", "100%");
    			set_style(img, "object-fit", "contain");
    			attr(img, "class", "px-2");
    			if (img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[25].value.split("!")[1].split("##")[0].slice(1))) attr(img, "src", img_src_value);

    			attr(img, "alt", img_alt_value = /*value*/ ctx[25].value.split("##")[1]
    			? /*value*/ ctx[25].value.split("##")[1]
    			: null);
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data*/ 16 && img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[25].value.split("!")[1].split("##")[0].slice(1))) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*preview_data*/ 16 && img_alt_value !== (img_alt_value = /*value*/ ctx[25].value.split("##")[1]
    			? /*value*/ ctx[25].value.split("##")[1]
    			: null)) {
    				attr(img, "alt", img_alt_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    // (413:20) {#each preview_data.correctxmlarray as value, i}
    function create_each_block_1(ctx) {
    	let li;
    	let show_if;
    	let show_if_1;
    	let t;
    	let li_tabindex_value;
    	let li_id_value;
    	let li_name_value;
    	let li_key_value;
    	let li_data_optid_value;
    	let li_data_ischecked_value;
    	let li_class_value;

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*preview_data*/ 16) show_if = !!(/*value*/ ctx[25].value.charAt(0) == "!");
    		if (show_if) return create_if_block_6;
    		if (show_if_1 == null || dirty & /*preview_data*/ 16) show_if_1 = !!(/*value*/ ctx[25].value.charAt(0) == "*");
    		if (show_if_1) return create_if_block_8;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			attr(li, "tabindex", li_tabindex_value = /*value*/ ctx[25].ischecked == true ? "-1" : "0");
    			attr(li, "id", li_id_value = "p" + /*i*/ ctx[27]);
    			attr(li, "name", li_name_value = /*i*/ ctx[27]);
    			attr(li, "key", li_key_value = "p" + /*i*/ ctx[27]);
    			attr(li, "data-optid", li_data_optid_value = /*i*/ ctx[27]);
    			attr(li, "data-ischecked", li_data_ischecked_value = /*value*/ ctx[25].ischecked);

    			attr(li, "class", li_class_value = "matchlist_item pe-none " + (/*value*/ ctx[25].ischecked == true
    			? "bg-primary text-white"
    			: "") + " align-items-center justify-content-center d-flex position-relative ui-draggable m-0");

    			set_style(li, "width", /*box_width*/ ctx[3]);
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			if_block.m(li, null);
    			append(li, t);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t);
    				}
    			}

    			if (dirty & /*preview_data*/ 16 && li_tabindex_value !== (li_tabindex_value = /*value*/ ctx[25].ischecked == true ? "-1" : "0")) {
    				attr(li, "tabindex", li_tabindex_value);
    			}

    			if (dirty & /*preview_data*/ 16 && li_data_ischecked_value !== (li_data_ischecked_value = /*value*/ ctx[25].ischecked)) {
    				attr(li, "data-ischecked", li_data_ischecked_value);
    			}

    			if (dirty & /*preview_data*/ 16 && li_class_value !== (li_class_value = "matchlist_item pe-none " + (/*value*/ ctx[25].ischecked == true
    			? "bg-primary text-white"
    			: "") + " align-items-center justify-content-center d-flex position-relative ui-draggable m-0")) {
    				attr(li, "class", li_class_value);
    			}

    			if (dirty & /*box_width*/ 8) {
    				set_style(li, "width", /*box_width*/ ctx[3]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			if_block.d();
    		}
    	};
    }

    // (450:24) {#if targetView == 'block' && showcorrectanswer == true && value.ischecked == false}
    function create_if_block_3(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*value*/ ctx[25].iscorrect == true) return create_if_block_4;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (453:28) {:else}
    function create_else_block_2(ctx) {
    	let span;

    	return {
    		c() {
    			span = element("span");
    			attr(span, "class", "icomoon-new-24px-cancel-circle-1 s4 text-danger position-absolute userans_status");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (451:28) {#if value.iscorrect == true}
    function create_if_block_4(ctx) {
    	let span;

    	return {
    		c() {
    			span = element("span");
    			attr(span, "class", "icomoon-new-24px-checkmark-circle-1 s4 text-success position-absolute userans_status");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (465:24) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*value*/ ctx[25].value + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data*/ 16 && t_value !== (t_value = /*value*/ ctx[25].value + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (463:63) 
    function create_if_block_2(ctx) {
    	let img;
    	let img_img_val_value;
    	let img_src_value;
    	let img_alt_value;

    	return {
    		c() {
    			img = element("img");
    			attr(img, "img_val", img_img_val_value = /*value*/ ctx[25].value);
    			set_style(img, "height", "70px");
    			set_style(img, "width", "100%");
    			set_style(img, "object-fit", "contain");
    			attr(img, "class", "px-2");
    			if (img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[25].value.split("##")[0].slice(1))) attr(img, "src", img_src_value);

    			attr(img, "alt", img_alt_value = /*value*/ ctx[25].value.split("##")[1]
    			? /*value*/ ctx[25].value.split("##")[1]
    			: null);
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data*/ 16 && img_img_val_value !== (img_img_val_value = /*value*/ ctx[25].value)) {
    				attr(img, "img_val", img_img_val_value);
    			}

    			if (dirty & /*preview_data*/ 16 && img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[25].value.split("##")[0].slice(1))) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*preview_data*/ 16 && img_alt_value !== (img_alt_value = /*value*/ ctx[25].value.split("##")[1]
    			? /*value*/ ctx[25].value.split("##")[1]
    			: null)) {
    				attr(img, "alt", img_alt_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    // (457:24) {#if value.value.charAt(0) == "!"}
    function create_if_block$1(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type_4(ctx, dirty) {
    		if (show_if == null || dirty & /*preview_data*/ 16) show_if = !!(/*value*/ ctx[25].value.charAt(1) == "*");
    		if (show_if) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_4(ctx, -1);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_4(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (460:28) {:else}
    function create_else_block(ctx) {
    	let t_value = /*value*/ ctx[25].value.slice(1) + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data*/ 16 && t_value !== (t_value = /*value*/ ctx[25].value.slice(1) + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (458:28) {#if value.value.charAt(1) == "*"}
    function create_if_block_1(ctx) {
    	let img;
    	let img_img_val_value;
    	let img_src_value;
    	let img_alt_value;

    	return {
    		c() {
    			img = element("img");
    			attr(img, "img_val", img_img_val_value = /*value*/ ctx[25].value);
    			set_style(img, "height", "70px");
    			set_style(img, "width", "100%");
    			set_style(img, "object-fit", "contain");
    			attr(img, "class", "px-2");
    			if (img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[25].value.split("!")[1].split("##")[0].slice(1))) attr(img, "src", img_src_value);

    			attr(img, "alt", img_alt_value = /*value*/ ctx[25].value.split("##")[1]
    			? /*value*/ ctx[25].value.split("##")[1]
    			: null);
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*preview_data*/ 16 && img_img_val_value !== (img_img_val_value = /*value*/ ctx[25].value)) {
    				attr(img, "img_val", img_img_val_value);
    			}

    			if (dirty & /*preview_data*/ 16 && img.src !== (img_src_value = "//s3.amazonaws.com/jigyaasa_content_static/" + /*value*/ ctx[25].value.split("!")[1].split("##")[0].slice(1))) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*preview_data*/ 16 && img_alt_value !== (img_alt_value = /*value*/ ctx[25].value.split("##")[1]
    			? /*value*/ ctx[25].value.split("##")[1]
    			: null)) {
    				attr(img, "alt", img_alt_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    // (438:16) {#each preview_data.localCData as value, i}
    function create_each_block(ctx) {
    	let li;
    	let t0;
    	let show_if;
    	let show_if_1;
    	let t1;
    	let li_tabindex_value;
    	let li_id_value;
    	let li_name_value;
    	let li_key_value;
    	let li_data_optid_value;
    	let li_data_ischecked_value;
    	let li_class_value;
    	let li_ll_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*targetView*/ ctx[1] == "block" && /*showcorrectanswer*/ ctx[2] == true && /*value*/ ctx[25].ischecked == false && create_if_block_3(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (show_if == null || dirty & /*preview_data*/ 16) show_if = !!(/*value*/ ctx[25].value.charAt(0) == "!");
    		if (show_if) return create_if_block$1;
    		if (show_if_1 == null || dirty & /*preview_data*/ 16) show_if_1 = !!(/*value*/ ctx[25].value.charAt(0) == "*");
    		if (show_if_1) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_3(ctx, -1);
    	let if_block1 = current_block_type(ctx);

    	return {
    		c() {
    			li = element("li");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if_block1.c();
    			t1 = space();
    			attr(li, "tabindex", li_tabindex_value = /*value*/ ctx[25].ischecked == true ? "-1" : "0");
    			attr(li, "id", li_id_value = "p" + /*i*/ ctx[27]);
    			attr(li, "name", li_name_value = /*i*/ ctx[27]);
    			attr(li, "key", li_key_value = "p" + /*i*/ ctx[27]);
    			attr(li, "data-optid", li_data_optid_value = /*i*/ ctx[27]);
    			attr(li, "data-ischecked", li_data_ischecked_value = /*value*/ ctx[25].ischecked);

    			attr(li, "class", li_class_value = "matchlist_item " + (/*showcorrectanswer*/ ctx[2] == false
    			? "d-none"
    			: "d-flex") + " " + (/*isReview*/ ctx[0] ? "isreviewbgcolor pe-none" : "") + " " + (/*value*/ ctx[25].ischecked == true
    			? "bg-primary text-white pe-none"
    			: "") + " align-items-center justify-content-center position-relative ui-draggable m-0");

    			set_style(li, "width", /*value*/ ctx[25].width);
    			attr(li, "ll", li_ll_value = /*value*/ ctx[25].width);
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			if (if_block0) if_block0.m(li, null);
    			append(li, t0);
    			if_block1.m(li, null);
    			append(li, t1);

    			if (!mounted) {
    				dispose = listen(li, "keydown", /*hotkeysAda*/ ctx[9]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (/*targetView*/ ctx[1] == "block" && /*showcorrectanswer*/ ctx[2] == true && /*value*/ ctx[25].ischecked == false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(li, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type_3(ctx, dirty)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(li, t1);
    				}
    			}

    			if (dirty & /*preview_data*/ 16 && li_tabindex_value !== (li_tabindex_value = /*value*/ ctx[25].ischecked == true ? "-1" : "0")) {
    				attr(li, "tabindex", li_tabindex_value);
    			}

    			if (dirty & /*preview_data*/ 16 && li_data_ischecked_value !== (li_data_ischecked_value = /*value*/ ctx[25].ischecked)) {
    				attr(li, "data-ischecked", li_data_ischecked_value);
    			}

    			if (dirty & /*showcorrectanswer, isReview, preview_data*/ 21 && li_class_value !== (li_class_value = "matchlist_item " + (/*showcorrectanswer*/ ctx[2] == false
    			? "d-none"
    			: "d-flex") + " " + (/*isReview*/ ctx[0] ? "isreviewbgcolor pe-none" : "") + " " + (/*value*/ ctx[25].ischecked == true
    			? "bg-primary text-white pe-none"
    			: "") + " align-items-center justify-content-center position-relative ui-draggable m-0")) {
    				attr(li, "class", li_class_value);
    			}

    			if (dirty & /*preview_data*/ 16) {
    				set_style(li, "width", /*value*/ ctx[25].width);
    			}

    			if (dirty & /*preview_data*/ 16 && li_ll_value !== (li_ll_value = /*value*/ ctx[25].width)) {
    				attr(li, "ll", li_ll_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let link;
    	let link_href_value;
    	let t0;
    	let div4;
    	let itemhelper;
    	let t1;
    	let div3;
    	let div0;
    	let t2_value = /*state*/ ctx[5].headingCorrect + "";
    	let t2;
    	let t3;
    	let div1;
    	let ul;
    	let t4;
    	let ul_data_row_value;
    	let ul_data_col_value;
    	let t5;
    	let div2;
    	let current;

    	itemhelper = new ItemHelper({
    			props: {
    				reviewMode: /*isReview*/ ctx[0],
    				handleReviewClick: /*handleReviewMode*/ ctx[8]
    			}
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[6]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[7]);
    	let if_block = /*showcorrectanswer*/ ctx[2] == false && create_if_block_5(ctx);
    	let each_value = /*preview_data*/ ctx[4].localCData;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			link = element("link");
    			t0 = space();
    			div4 = element("div");
    			create_component(itemhelper.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			ul = element("ul");
    			if (if_block) if_block.c();
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div2 = element("div");
    			div2.textContent = `${language.drag_drop_set_seq_msg}`;
    			attr(link, "onload", "this.rel='stylesheet'");
    			attr(link, "rel", "preload");
    			attr(link, "as", "style");
    			attr(link, "href", link_href_value = editor.baseUrlTheme + "pe-items/clsSMChooseMultiGrid/css/ChooseMultiGrid.min.css");
    			attr(div0, "class", "choose_header font17 text-left rounded-top m-0");
    			attr(ul, "id", "sortable");
    			attr(ul, "data-row", ul_data_row_value = /*preview_data*/ ctx[4].maxRow);
    			attr(ul, "data-col", ul_data_col_value = /*preview_data*/ ctx[4].maxCol);
    			attr(ul, "class", "p-2 d-inline-block w-100 m-0");
    			attr(div1, "class", "choose_body bg-white");
    			attr(div2, "class", "choose_bottom font12 m-0 text-left font-weight-bold text-danger p-2 rounded-bottom");
    			attr(div2, "id", "instruction");
    			attr(div3, "id", "choose");
    			attr(div3, "class", "text-center mx-auto");
    			attr(div4, "id", "chid");
    		},
    		m(target, anchor) {
    			insert(target, link, anchor);
    			insert(target, t0, anchor);
    			insert(target, div4, anchor);
    			mount_component(itemhelper, div4, null);
    			append(div4, t1);
    			append(div4, div3);
    			append(div3, div0);
    			append(div0, t2);
    			append(div3, t3);
    			append(div3, div1);
    			append(div1, ul);
    			if (if_block) if_block.m(ul, null);
    			append(ul, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append(div3, t5);
    			append(div3, div2);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const itemhelper_changes = {};
    			if (dirty & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);
    			if ((!current || dirty & /*state*/ 32) && t2_value !== (t2_value = /*state*/ ctx[5].headingCorrect + "")) set_data(t2, t2_value);

    			if (/*showcorrectanswer*/ ctx[2] == false) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					if_block.m(ul, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*preview_data, showcorrectanswer, isReview, hotkeysAda, targetView*/ 535) {
    				each_value = /*preview_data*/ ctx[4].localCData;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*preview_data*/ 16 && ul_data_row_value !== (ul_data_row_value = /*preview_data*/ ctx[4].maxRow)) {
    				attr(ul, "data-row", ul_data_row_value);
    			}

    			if (!current || dirty & /*preview_data*/ 16 && ul_data_col_value !== (ul_data_col_value = /*preview_data*/ ctx[4].maxCol)) {
    				attr(ul, "data-col", ul_data_col_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(link);
    			if (detaching) detach(t0);
    			if (detaching) detach(div4);
    			destroy_component(itemhelper);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function makeshuffle(array) {
    	for (let i = array.length - 1; i > 0; i--) {
    		let j = Math.floor(Math.random() * (i + 1));
    		let temp = array[i];
    		array[i] = array[j];
    		array[j] = temp;
    	}

    	return array;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { showAns } = $$props;
    	let { isReview } = $$props;
    	let { editorState } = $$props;
    	let targetView = "none";
    	let showcorrectanswer, box_width, corr_ans_count;

    	let preview_data = {
    		layout: [],
    		maxRow: 0,
    		maxCol: 0,
    		localCData: [],
    		layoutchanged: [],
    		original_xml_copy: "",
    		countrow: 0,
    		countcol: 0,
    		totalheading: 0,
    		correctxmlarray: [],
    		user_ans_xml: [],
    		main_user_xml1: [],
    		isShuffeled: false,
    		imagepath: "//s3.amazonaws.com/jigyaasa_content_static/",
    		result: "correct"
    	};

    	let state = {
    		snackback: false,
    		xml: "",
    		headingCorrect: "",
    		static: false,
    		isdragging: false,
    		colstobeshown: 3,
    		isanyheading: false,
    		showlabelofshuffle: "block"
    	};

    	onMount(() => {
    		loadModule(xml);

    		try {
    			if (uxml == "<smans type=\"6\"></smans>") {
    				$$invalidate(10, uxml = "");
    			}
    		} catch(error) {
    			console.warn({ error });
    		}

    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}
    	});

    	afterUpdate(() => {
    		let el = AH.select("#sortable");

    		// for sorting
    		let sortable = new Sortable(el,
    		{
    				animation: 150,
    				swap: true,
    				swapClass: "bg-light",
    				onUpdate() {
    					$$invalidate(4, preview_data.user_ans_xml = [], preview_data);

    					AH.selectAll("#sortable li").forEach((value, i) => {
    						value.id = "p" + i;
    						value.setAttribute("data-optid", i);
    						value.setAttribute("name", i);

    						$$invalidate(
    							4,
    							preview_data.user_ans_xml = [
    								...preview_data.user_ans_xml,
    								{
    									id: i,
    									value: AH.select("#" + value.getAttribute("id")).innerText != ""
    									? AH.select("#" + value.getAttribute("id")).innerText
    									: AH.find("#" + value.getAttribute("id"), "img").getAttribute("img_val")
    								}
    							],
    							preview_data
    						);
    					});
    				}
    			});

    		// resets the localCData
    		preview_data.localCData.forEach(val => {
    			val.iscorrect = "";
    			corr_ans_count = 0;
    		});

    		// updates value of iscorrect in the localCData
    		preview_data.localCData.forEach((val, i) => {
    			if (val.ischecked == true) {
    				val.iscorrect = true;
    			}

    			preview_data.localCData.forEach(valu => {
    				if (preview_data.correctxmlarray[i].value == preview_data.user_ans_xml[i].value && valu.value == preview_data.correctxmlarray[i].value) {
    					valu.iscorrect = true;
    				}
    			});

    			val.width = box_width;
    		});

    		preview_data.localCData.forEach(val => {
    			if (val.iscorrect != true) {
    				val.iscorrect = false;
    				corr_ans_count++;
    			}

    			val.width = box_width;
    		});
    	});

    	// updates the value of sliders elements and load the module
    	function loadModule(loadXml) {
    		loadXml = XMLToJSON(loadXml);
    		$$invalidate(5, state.headingCorrect = loadXml.smxml.list._headingCorrect, state);
    		$$invalidate(4, preview_data.maxRow = parseInt(loadXml.smxml.list._row), preview_data);
    		$$invalidate(4, preview_data.maxCol = parseInt(loadXml.smxml.list._col), preview_data);
    		parseXMLPreview(loadXml);
    	}

    	// parses the xml and updates the values of sliders elements
    	function parseXMLPreview(MYXML) {
    		let cdata = MYXML.smxml.list.__cdata.split("\n");

    		for (let i in cdata) {
    			if (cdata[i].trim() != "") {
    				if (cdata[i].trim().charAt(0) == "!") {
    					$$invalidate(5, state.isanyheading = true, state);
    				}
    			}
    		}

    		$$invalidate(4, preview_data.localCData = [], preview_data);
    		$$invalidate(4, preview_data.correctxmlarray = [], preview_data);
    		$$invalidate(4, preview_data.totalheading = MYXML.smxml.list._col, preview_data);
    		$$invalidate(4, preview_data.countcol = MYXML.smxml.list._col, preview_data);
    		$$invalidate(4, preview_data.countrow = MYXML.smxml.list._row, preview_data);

    		for (let i in cdata) {
    			if (cdata[i].trim() != "") {
    				$$invalidate(5, state.colstobeshown = parseInt(preview_data.countcol), state);
    				datatopush(cdata[i].trim(), i);
    			} else {
    				let istobepushed = false;

    				for (let j = i; j < cdata.length; j++) {
    					if (cdata[j].trim() == "" && j != cdata.length - 1) {
    						istobepushed = false;
    					} else {
    						istobepushed = true;
    						break;
    					}
    				}

    				if (istobepushed == true) {
    					datatopush(cdata[i].trim(), i);
    				}
    			}
    		}

    		storeCorrectXYValue(preview_data.correctxmlarray);
    		storeCorrectXYValue(preview_data.localCData);
    		shuffle();
    		$$invalidate(4, preview_data.user_ans_xml = [], preview_data);

    		preview_data.localCData.forEach((val, i) => {
    			preview_data.user_ans_xml.push({ id: i, value: val.value });
    		});
    	}

    	// add values in the array
    	function datatopush(value, index) {
    		preview_data.localCData.push({
    			value: value.trim(),
    			colval: "",
    			rowval: "",
    			mainseq: "",
    			x: 0,
    			y: 0,
    			id: index
    		});

    		preview_data.correctxmlarray.push({
    			value: value.trim(),
    			colval: "",
    			rowval: "",
    			mainseq: "",
    			x: "",
    			y: "",
    			id: index
    		});
    	}

    	//store correct XY value
    	function storeCorrectXYValue(layout) {
    		let temporary = 0, counter = 0;

    		for (let i = 0; i < layout.length; i++) {
    			if (temporary == preview_data.countcol) {
    				temporary = 0;
    				counter = counter + 3;
    			}

    			layout[i].x = temporary;
    			layout[i].y = counter;
    			temporary++;
    		}
    	}

    	//for shuffleing
    	function shuffle() {
    		$$invalidate(4, preview_data.isShuffeled = true, preview_data);
    		$$invalidate(4, preview_data.localCData = shuffleArray(preview_data.localCData), preview_data);
    		storeCorrectXYValue(preview_data.localCData);
    		$$invalidate(5, state.showlabelofshuffle = "none", state);
    	}

    	//shuffling
    	function shuffleArray(array) {
    		let arraytoshuffle = [];

    		if (state.isanyheading == true) {
    			for (let i = 0; i < array.length; i++) {
    				if (array[i].value.charAt(0) != "!") {
    					arraytoshuffle.push(array[i]);
    					array[i].ischecked = false;
    				} else {
    					array[i].ischecked = true;
    				}
    			}

    			
    			arraytoshuffle = makeshuffle(arraytoshuffle);
    			let j = 0;

    			for (let i = 0; i < array.length; i++) {
    				if (array[i].value.charAt(0) != "!") {
    					array[i] = arraytoshuffle[j];
    					j++;
    				}
    			}
    		} else {
    			array = makeshuffle(array);
    		}

    		array = storeIndexValue(array);
    		return array;
    	}

    	//to store value of index
    	function storeIndexValue(array) {
    		let k = 1, j = 1, count = 1;

    		for (let i = 0; i < array.length; i++) {
    			array[i].colval = j;
    			$$invalidate(4, preview_data.correctxmlarray[i].colval = j, preview_data);
    			array[i].rowval = k;
    			$$invalidate(4, preview_data.correctxmlarray[i].rowval = k, preview_data);
    			array[i].mainseq = k + "-" + j;
    			$$invalidate(4, preview_data.correctxmlarray[i].mainseq = k + "-" + j, preview_data);
    			j++;

    			if (array[i].value.charAt(0) != "!") {
    				$$invalidate(4, preview_data.correctxmlarray[i].ischecked = false, preview_data);
    			} else {
    				$$invalidate(4, preview_data.correctxmlarray[i].ischecked = true, preview_data);
    			}

    			if (count == preview_data.totalheading) {
    				j = 1;
    				k++;
    				count = 0;
    			}

    			count++;
    		}

    		return array;
    	}

    	// checks and show the answer, shows correct answer and your answer button and not allow the user to perform the task
    	function setReview() {
    		$$invalidate(1, targetView = "block");
    		$$invalidate(5, state.snackback = true, state);
    		$$invalidate(5, state.static = true, state);
    		$$invalidate(2, showcorrectanswer = true);
    		displayAns();
    	}

    	// allow the user to perform the task and hides correct answer and your answer button
    	function unsetReview() {
    		$$invalidate(1, targetView = "none");
    		$$invalidate(5, state.snackback = false, state);
    		$$invalidate(5, state.static = false, state);
    	}

    	function handleReviewMode(mode) {
    		if (mode == "c") {
    			$$invalidate(2, showcorrectanswer = false);
    		} else if (mode == "u") {
    			$$invalidate(2, showcorrectanswer = true);
    		}
    	}

    	function checkAns() {
    		// used for switch on next question in prepengine if current question is attempted
    		ISSPECIALMODULEUSERXMLCHANGE = 1;

    		let result;

    		if (corr_ans_count > 0) {
    			result = "Incorrect";
    		} else {
    			result = "Correct";
    		}

    		return result;
    	}

    	// display the correct or incorrect according to the answer matched
    	function displayAns() {
    		// contains correct or incorrect according to the return value of checkAns method
    		let ans = checkAns();

    		if (editorState) {
    			// shows the answer correct or incorrect according to the value of variable 'ans'
    			showAns(ans);
    		}
    	}

    	//for keyboard navigation
    	function hotkeysAda(event) {
    		if (event.which === 13) {
    			let _id = event.target.id;

    			if (this.classList.contains("copied")) {
    				AH.selectAll("#" + _id, "removeClass", "copied");
    			} else {
    				AH.selectAll("#" + _id, "addClass", "copied");
    				let selected_opt = AH.select("#chid .copied");
    				exchangeValue(selected_opt, AH.select("#" + _id));
    			}
    		}
    	}

    	// function to update shuffing in case of keyboard navigation
    	function exchangeValue(selected_opt, removeclass) {
    		if (removeclass != undefined) {
    			if (selected_opt.getAttribute("id") != removeclass.getAttribute("id")) {
    				AH.selectAll(".copied", "removeClass", "copied");
    				$$invalidate(4, preview_data.main_user_xml1 = [], preview_data);

    				let idofselectedopt = selected_opt.getAttribute("data-optid"),
    					idofremoveddiv = removeclass.getAttribute("data-optid");

    				$$invalidate(
    					4,
    					[
    						preview_data.user_ans_xml[idofselectedopt].value,
    						preview_data.user_ans_xml[idofremoveddiv].value
    					] = [
    						preview_data.user_ans_xml[idofremoveddiv].value,
    						preview_data.user_ans_xml[idofselectedopt].value
    					],
    					preview_data
    				);

    				let aHolder = document.createElement("div");
    				let bHolder = document.createElement("div");
    				AH.select("#sortable").replaceChild(aHolder, AH.select(selected_opt));
    				AH.select("#sortable").replaceChild(bHolder, AH.select(removeclass));
    				AH.select("#sortable").replaceChild(AH.select(removeclass), aHolder);
    				AH.select("#sortable").replaceChild(AH.select(selected_opt), bHolder);

    				if (window.inNative) {
    					window.getHeight && window.getHeight();
    				}
    			}
    		}
    	}

    	$$self.$$set = $$props => {
    		if ("xml" in $$props) $$invalidate(11, xml = $$props.xml);
    		if ("uxml" in $$props) $$invalidate(10, uxml = $$props.uxml);
    		if ("showAns" in $$props) $$invalidate(12, showAns = $$props.showAns);
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("editorState" in $$props) $$invalidate(13, editorState = $$props.editorState);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isReview*/ 1) {
    			 {
    				if (isReview) {
    					$$invalidate(1, targetView = "block");
    					setReview();
    				} else {
    					$$invalidate(1, targetView = "none");
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*xml, state, preview_data, uxml*/ 3120) {
    			 {
    				if (xml != state.xml) {
    					$$invalidate(4, preview_data.isShuffeled = false, preview_data);
    					$$invalidate(5, state.showlabelofshuffle = "block", state);

    					if (preview_data.main_user_xml1.length > 0) {
    						$$invalidate(4, preview_data.main_user_xml1.length = 0, preview_data);
    					}

    					$$invalidate(5, state.isanyheading = false, state);

    					if (uxml) {
    						let counter = 1, tempxml = XMLToJSON(xml);
    						$$invalidate(4, preview_data.main_user_xml1 = uxml, preview_data);

    						if (tempxml.smxml.list._whichfixed == "horizontal") {
    							for (let i in preview_data.main_user_xml1) {
    								$$invalidate(4, preview_data.main_user_xml1[i].gid = "g" + (parseInt(preview_data.main_user_xml1[i].x) + 1), preview_data);

    								tempxml.smxml.list._col == counter
    								? counter = 1
    								: counter++;
    							}
    						}
    					}

    					// update the value of state 'xml'
    					$$invalidate(5, state.xml = xml, state);

    					// updates the value of sliders elements and load the module
    					loadModule(xml);

    					$$invalidate(3, box_width = (638 - preview_data.countcol * 2) / preview_data.countcol + "px");
    				}
    			}
    		}
    	};

    	return [
    		isReview,
    		targetView,
    		showcorrectanswer,
    		box_width,
    		preview_data,
    		state,
    		setReview,
    		unsetReview,
    		handleReviewMode,
    		hotkeysAda,
    		uxml,
    		xml,
    		showAns,
    		editorState
    	];
    }

    class ChooseMultiGridPreview extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			xml: 11,
    			uxml: 10,
    			showAns: 12,
    			isReview: 0,
    			editorState: 13
    		});
    	}
    }

    const defXMl = '<SMXML type="6" name="ChooseAndReorder"><list groupcheck="false" whichfixed ="" headingCorrect="IP Classes" row="2" col="3"><!--[CDATA[!Class A\n!Class B\n!Class C\n21.3.23.233\n128.1.1.1\n200.255.255.255]]--></list></SMXML>';

    const app = new ChooseMultiGridPreview({
    	target: document.getElementById(window.moduleContainer) || document.body,
    	props: {
    		xml: window.QXML || defXMl,
    		uxml: window.uaXML,
    		ansStatus: 0,
    		isReview: window.isReviewMode || false,
    		smqCounter : window.idCounter,
    		CM : window.idCounter
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle_q26.js.map
