
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
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
    function append_styles(target, style_sheet_id, styles) {
        var _a;
        const append_styles_to = get_root_for_styles(target);
        if (!((_a = append_styles_to) === null || _a === void 0 ? void 0 : _a.getElementById(style_sheet_id))) {
            const style = element('style');
            style.id = style_sheet_id;
            style.textContent = styles;
            append_stylesheet(append_styles_to, style);
        }
    }
    function get_root_for_node(node) {
        if (!node)
            return document;
        return (node.getRootNode ? node.getRootNode() : node.ownerDocument); // check for getRootNode because IE is still supported
    }
    function get_root_for_styles(node) {
        const root = get_root_for_node(node);
        return root.host ? root : root;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
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
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.40.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
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
        strptab: "Striped Table",
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
        math_eq         : 'Mathematical Equation',
        fill_text_placeholder : "Write correct answer here",
        fill_text_help1 : "1. To include multiple correct answers, type the answers and separate them with a comma (,).",
        fill_text_help2 : "2. Please do not include any space. Now, go back to the Settings and select Multiple Correct Answers from the drop-down.",
        fill_text_help3 : "3. Use #cm for comma (e.g., 5,000 as 5#cm000, function(a,b) as function(a#cmb)).",
        fill_math_help1 : "1. To make math equation initially, Click f(x) and then insert the equation.",
        fill_math_help2 : "2. To add user Response, place cursor before{*} and Click Add Response.",
        fill_math_help3 : "3. To edit the existing equation, Click Edit.",
        star_note : '* Note:',
        do_not_include_space : '2. Please do not include space.',
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
        is_graph : "Is Graph",
        ignore_error: "Ignore Error",
        ignore_formatting: "Ignore Formatting",
        ignore_reset_db: 'Ignore Reset DB',
        pre_tag: "Pre Tag",
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
        decimal_position: "please enter the decimal position between 1 to ",
        grid_one_to_ten: "Number Must be between 1 to 10",
        col_less_one : "Column Not allowed less then 1",
        type_one_to_seven: "Please type between 1 to 7",
        row_less_one: "Row Not allowed less then 1",
        type_one_to_ten: "Please type between 1 to 10",
        double_digit: "Double digit not accepted",
        less_one : "Less then 1 not accepted",
        number_from: "Insert number between 0 to ",
        another_option: "Select another option",
        layout_options: "Layout Options",
        row_count: "Row Count",
        col_count: "Column Count",
        empty_field: "Field value can not be empty",
        lock_author_cell: "To lock author shaded cells, it should be part of correct answer",
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
        drag_drop_set_seq_msg: 'Drag and Drop to set sequence.',
        please_enter_reply_comment : 'Please enter the reply comment',
        exhibit_err: 'Exhibit player does not support this format',	
        embed_player: 'This player tag is used to embed a content.',
        icon_not_blank: 'Icons name should not be blank!',	
        check_net_update_ids: 'Something went wrong. Please check your network connection and update the IDs again.',
        heading_info: "Here, # is the parent (root) element of the tree and it will not be dragged, ## is the child of the parent element and it will also not be dragged, ### is the child of the parent's child element and it can be dragged and dropped.",	
        key_info: "Key|Option text|Icon (Put comma after each line) Where  option text is the label for option of contextmenu list and icon is icon for that label and key is numeric value that helps to create the list option.",	
        note_text: "*Note:",	
        icons_list: "Icons List",	
        hase_icon_3: "### icon",	
        hase_icon_2: "## icon",	
        hase_icon_1: "# icon",	
        no_icons: 'No icons found!',	
        search_icons: 'Search Icons',	
        loading_icons: 'Please wait, Loading Icons...',	
        select_icon: "You can get the icon name by clicking on the Icon list button!",
        light_blue: "Light Blue",
        dark_blue: "Dark Blue",
        peach: "Peach",
        green: "Green",
        purple: "Purple",
        table_width: "Table width",
        themes: "Themes",
        add_row: "Add row",
        add_column: 'Add column',
        upload_data: 'Upload Data',
        hour: 'Hour',
        day: 'Day',
        week: 'Week',
        month: 'Month',
        graph: 'Graph :',
        users: 'Users',
        course_code: 'Course Code',
        iot_graph: 'IOT Graphs',
        from: 'From',
        to: 'To',
        star: '*',
        apply: 'Apply',
        colon: ':',
        both_field_necessary: 'Both Date Field is necessary!',
        load_efficiency: 'Load Efficiency',
        avg_max_speed: 'Average load & max speed',
        recent_fuel: 'Recent Fuel Reading',
        truck_list: 'Truck List',
        show_graph: 'Show Graph',
        get_truck_list: 'Get Truck List',
        no_data_found : 'No data Found!',
        total_users: 'Total Users',
        time_interval : 'Time Interval',
        total_unique_users: 'Total Unique Users',
        total_unique_users_per_day: 'Total Unique Users Per Day',
        load_efficiency_for_truck: 'Load efficiency for Truck id',
        max_speed: 'Max Speed',
        avg_load : 'Average Load',
        fuel_reading: 'Fuel Reading',
        truck_id : 'Truck ID',
        comment_choiceMatrix : 'Use #cm for comma.',
        // dndAuthString.js
        draggable: 'Draggable',
        placeholder: 'Place Holder',
        input_box: 'Input Box',
        checkbox_input: 'Check Box Input',
        multiline_text_box: 'Multiline Text Box',
        radio_inout: 'Radio input',
        select: 'Select',
        select_dropdown: 'Select Dropdown',
        new_menu: 'New Menu',
        clickable: 'Clickable',
        new_label: 'New Label',
        hotspot : 'Hotspot',
        new_steps: 'New Step',
        insert_script: 'Insert Script',
        select_list: 'Select List',
        label: 'Label',
        area_matrix: 'Area Matrix',
        new_pills: 'New Pills',
        base: 'Base',
        choice_matrix: 'Choice Matrix',
        delete_txt: 'Do you want to delete it?',
        select_style: '-- Select Style --',
        heading_arial: 'Heading Arial',
        heading_georgia: 'Heading Georgia',
        heading_cambria: 'Heading Cambria',
        heading_calibri: 'Heading Calibri',
        heading_verdana: 'Heading Verdana',
        heading_roman: 'Heading Times New Roman',
        content_arial: 'Content Arial',
        content_georgia: 'Content Georgia',
        content_cambria: 'Content Camabria',
        content_calibri: 'Content Calibri',
        content_verdana: 'Content Verdana',
        content_roman: 'Content Times New Roman',
        select_class: '-- Select Class --',
        sql_terminal: 'SQL Terminal',
        width_of_draggable: 'Width of Draggable',
        height_of_drggable: 'Height of Draggable',
        top_of_draggable: 'Top of Draggable',
        top: 'Top',
        left: 'Left',
        left_of_drggable: 'Left of Draggable',
        title_of_drggable: 'Title of draggable',
        name_of_draggable: 'Name of draggable',
        border_color: 'Border Color',
        none: 'None',
        black: 'Black',
        gray: 'Gray',
        grp_name: 'Group Name',
        background_image: 'Background Image',
        bg_of_draggble: 'Background image of draggable',
        multiple_drag: 'Multiple Drag',
        invisible: 'Invisible',
        css_style: 'CSS Style',
        css_style_of_txt: 'CSS style of Textbox',
        detail_of_drag: 'Detail of draggable (guid or text)',
        width_of_placeholder: 'Width of Place holder',
        height_of_placeholder: 'Height of Place holder',
        top_of_ph: 'Top of Place holder',
        left_of_ph: 'Left of Place holder',
        tilte_of_ph: 'Title of Place holder',
        name_of_ph : 'Name of Place holder',
        correct_answer_of_ph: 'Correct answer of Place holder',
        default_answer_of_ph: 'Default answer of Place holder',
        css_style_of_ph: 'CSS style of Place holder',
        width_of_input : 'Width of Input box',
        height_of_input: 'Height of Input box',
        top_of_input: 'Top of Input box',
        left_of_input: 'Left of Input box',
        correct_answer_of_input: 'Correct answer of Input box',
        default_ans_of_input: 'Default answer of Input box',
        placeholder_of_ib: 'Place holder of Input box',
        text_box: 'Text box',
        password: 'Password',
        parser: 'Parser',
        parser_of_txt: 'Parser of Textbox',
        sql: 'SQL',
        case_insensitive: 'Case-insensitive',
        multi_crct_answer: 'Multiple Correct Answers',
        css_of_input: 'CSS style of Input box',
        font_style: 'Font Style',
        height_of_multiline: 'Height of Multiline',
        width_of_multiline: 'Width of Multiline',
        top_of_multiline: 'Top of Multiline',
        left_of_multiline: 'Left of Multiline',
        crct_ans_multiline: 'Correct answer of Multiline',
        def_ans_multiline: 'Default answer of Multiline',
        placeholder_multiline: 'Place holder of Multiline',
        parser_of_multiline: 'Parser of Multiline',
        css_class: 'CSS Class',
        width_of_checkbox: 'Width of Checkbox',
        height_of_checkbox: 'Height of Checkbox',
        top_of_checkbox: 'Top of Checkbox',
        left_of_checkbox: 'Left of Checkbox',
        crct_of_chk: 'Correct answer of Checkbox',
        def_of_chk : 'Default answer of checkbox',
        css_of_chk: 'CSS style of checkbox',
        width_of_radio: 'Width of Radio',
        height_of_radio: 'Height of Radio',
        top_of_radio: 'Top of Radio',
        left_of_radio: 'Left of Radio',
        crct_of_radio: 'Correct answer of Radio',
        def_of_radio : 'Default answer of Radio',
        chktype_of_radio: 'Check Type of Radio',
        chk_type: 'Check Type',
        css_style_radio: 'CSS style of Radio',
        width_of_button: 'Width of button',
        height_of_button: 'Height of button',
        top_of_button: 'Top of button',
        left_of_button: 'Left of button',
        value_of_button: 'Value of button',
        class_of_button: 'Class of button',
        value: 'Value',
        class: 'Class',
        css_style_btn: 'CSS style of Button',
        width_of_dropdown: 'Width of dropdown',
        height_of_dropdown: 'Height of dropdown',
        top_of_dropdown: 'Top of dropdown',
        left_of_dropdown: 'Left of dropdown',
        value_of_dropdown: 'Value of dropdown',
        class_of_dropdown: 'Class of dropdown',
        option_of_dropdown: 'Option of dropdown',
        css_style_of_drpdwn: 'CSS style of Dropdown',
        options: 'Options',
        width_of_listbox: 'Width of listbox',
        height_of_listbox: 'Height of listbox',
        top_of_listbox: 'Top of listbox',
        left_of_listbox: 'Left of listbox',
        option_of_listbox: 'Option of listbox',
        select_multiple: 'Select Multiple',
        css_style_of_listbox: 'CSS style of listbox',
        width_of_tabhead: 'Width of tabhead',
        height_of_tabhead: 'Height of tabhead',
        top_of_tabhead: 'Top of tabhead',
        left_of_tabhead: 'Left of tabhead',
        title_of_tabhead: 'Title of tabhead',
        class_of_tabhead: 'Class of tabhead',
        css_style_of_tabhead: 'CSS style of tabhead',
        width_of_image: 'Width of image',
        height_of_image: 'Height of image',
        top_of_image: 'Top of image',
        left_of_image: 'Left of image',
        title_of_image: 'Title of image',
        css_style_of_image: 'CSS style of image',
        bg_of_img: 'Background image of Image',
        width_of_label: 'Width of label',
        height_of_label: 'Height of label',
        top_of_label: 'Top of label',
        left_of_label: 'Left of label',
        title_of_label: 'Title of label',
        border_size: 'Border Size',
        blue: 'Blue',
        red: 'Red',
        bg_color: 'Background Color',
        rich_text: 'Rich Textbox',
        matrix: 'Matrix',
        width_of_area: 'Width of area',
        height_of_area: 'Height of area',
        top_of_area: 'Top of area',
        left_of_area: 'Left of area',
        matrix_of_area: 'Matrix of area',
        crt_of_area: 'Correct Answer of area',
        def_of_area: 'Default Answer of area',
        width_of_menulist: 'Width of menulist',
        height_of_menulist: 'Height of menulist',
        top_of_menulist: 'Top of menulist',
        left_of_menulist: 'Left of menulist',
        matrix_of_menulist: 'Matrix of menulist',
        crt_of_menulist: 'Correct Answer of menulist',
        event_value: 'Events value',
        event_val_menulist: 'Events value of Menulist',
        width_of_hotspot: 'Width of hotspot',
        height_of_hotspot: 'Height of hotspot',
        top_of_hotspot: 'Top of hotspot',
        left_of_hotspot: 'Left of hotspot',
        title_of_hotspot: 'Title of hotspot',
        name_of_hotspot: 'Title of hotspot',
        target_img: 'Target Image',
        hide_target: 'Hide Target',
        target_img_hpt: 'Target Image of Hotspot',
        width_of_click: 'Width of click',
        height_of_click: 'Height of click',
        top_of_click: 'Top of click',
        left_of_click: 'Left of click',
        title_of_tab: 'Title of tab',
        alt_of_image: 'Alt of image',
        bg_of_tab: 'Background image of tab',
        bg_of_step: 'Background image of Step',
        alt_text: 'Alt',
        display: 'Display',
        width_of_base: 'Width of base',
        height_of_base: 'Height of base',
        bg_alt_text: 'Background Alt Text',
        alt_text_base: 'Alt text of Base',
        bg_of_base: 'Background image of Base',
        add_border: 'Add Border',
        width_of_cm: 'Width of Choice Matrix',
        height_of_cm: 'Height of Choice Matrix',
        top_of_cm: 'Top of Choice Matrix',
        left_of_cm: 'Left of Choice Matrix',
        name_of_cm: 'Name of Choice Matrix',
        crt_of_cm: 'Correct Answer of Choice Matrix',
        def_of_cm: 'Default Answer of Choice Matrix',
        css_of_cm: 'CSS style of Choice Matrix',
        on_click: 'On Click',
        on_dbl_click: 'On Double Click',
        on_context: 'On Right Click',
        on_drag_start: 'On Drag Start',
        on_drag: 'On Drag',
        on_drag_end: 'On Drag End',
        on_drop: 'On Drop',
        on_mouse_over: 'On Mouse over',
        on_mouse_up : 'On Mouse Up',
        on_mouse_down: 'On Mouse Down',
        on_change: 'On Change',
        on_focus: 'On Focus',
        on_blur: 'On Blur',
        on_key_up: 'On Key Up',
        on_key_press: 'On Key Press',
        on_key_down: 'On Key Down',
        func_for: 'Function for ',
        old_xml: 'This is old version of XML<br/>If you edit this item it might not work in the Prepkit<br/>For further assistance, please contact New Editor Team.',
        base_steps: 'Base||Steps:',
        timestream: 'Timestream',
        edit_base: 'Base Settings',
        sample_img: 'Sample Image',
        module: 'Module',
        select_instruction: 'Select Module & Click List Contents button for finding all the guid. To select any guid click on the guid.',
        scene: 'Scene',
        intro: 'Intro',
        characters: 'Characters',
        assets: 'Assets',
        chat_windows: 'Chat Windows',
        mission: 'Mission',
        mission_name: 'Mission Name',
        communication: 'Communication',
        animation: 'Animation',
        click_to_select: 'Click to select the ',
        test: "Test",
        learn: "Learn",
        character_voice: 'Character Voice',
        male_one: 'Male 1',
        male_two: 'Male 2',
        male_three: 'Male 3',
        male_four: 'Male 4',
        male: 'Male',
        female: 'Female',
        female_one: 'Female 1',
        female_two: 'Female 2',
        female_three: 'Female 3',
        female_four: 'Female 4',
        female_five: 'Female 5',
        female_six: 'Female 6',
        visibility: 'Visibility',
        asset_visibility: 'Asset Visibility.',
        asset_animation: 'Asset animation.',
        tooltip: 'Tooltip',
        tooltip_txt: 'Tooltip Text',
        onclick_step: 'Onclick Step',
        points: 'Points',
        points_text: 'Provide points for the mission.',
        add_mission: 'Add Mission',
        choose_character: 'Choose character',
        not_visible: 'Not visible',
        voice: 'Voice',
        narrater_voice: 'Narrator Voice',
        conversion_type: 'Conversation Type',
        statement: 'Statement',
        choice: 'Choice',
        item: 'Item',
        multichoice: 'Multi Choice',
        alert: 'Alert',
        autocomplete: 'Auto Complete',
        autocomplete_txt: 'After enabling this it will automatically switch to next step when the statement of this step will end.',
        image_size_txt: 'Select image size more then 256KB and in png format.',
        result_bg: 'Upload Background Image For Result',
        result_info: 'Image displayed on game result screen.',

        image_link: 'Image Link',
        score: 'Score',
        score_value: 'Score Value',
        speech: 'Speech',
        speech_txt: 'Enable speech convertor.',
        speech_input: "After enabling this user will be able to answer by speaking. This feature will work on ucertify.com only.",
        branch_condition: 'Branching Condition',
        no_anim_avail: 'No animation available',
        enter_choice_text: 'Enter Choice Text',
        choice_text: 'Choice Text',
        enter_choice_feedback: 'Enter Choice Feedback',
        feedback_text: 'Feedback text',
        fb_char_name: "Select the feedback character's name.",
        fb_char: 'Feedback Character',
        true: 'True',
        false: 'False',
        step_index: "Step Index",
        step_index_txt: 'Provide the step index to go to that step.',
        new_mission: 'Click to add a new mission.',
        add_choice: 'Add Choice',
        new_step: 'Click to add a new step.',
        add_anim : 'Add Animation',
        animation_play: 'Animation Play',
        dialog: 'Dialog',
        enter_result_title: 'Enter result title',
        result_title: 'Result title',
        result_btn_info: 'If you want to write the result title of your choice, write another title, otherwise skip this step.',
        one_option_correct: 'Only one option can be selected or marked as correct.',
        one_option_require: 'Please set one option as correct answer.',
        delete_textbox: 'Do you want to delete the text box?',
        delete_msg: 'Click the plotted points to delete them.',
        last_delete_msg: '"Click the last plotted point of the item to delete the item!',
        fill_field: 'Please fill out this field.',
        value_gt_zero: 'Value must be greater than 0.',
        enter_number: 'Please enter only number.',
        graph_width: 'Width of graph',
        graph_height: 'Height of graph',
        xaxis_value: 'X-axis value',
        yaxis_value: 'Y-axis value',
        anskey: 'anskey',
        reflection: 'reflection',
        curve_start_point: 'This is the start point of the curve so you cannot delete this point',
        warning_this_for: 'In this case this.for gets undefined and curve does not remove but xml of user answer updated. So prevented xml for being update.',
        last_point: 'You are trying to delete a polygon but either the polygon is not drawn completely or you are trying to delete the polygon by clicking the point, which is not the last point',
        insert_numeric_data: 'Insert numeric data',
        pointy2: 'Point Y2',
        pointx2: 'Point X2',
        pointx1: 'Point X1',
        pointy1: 'Point Y1',
        pointx: 'Point X ',
        pointy: 'Point Y ',
        select_choics: 'Select true or false to indicate if the choice correct or not.',
        select_game_mode: 'Select the game mode.',
        start_button: 'Start Button.',
        set_chr_visiblity: 'Set character visibility.',
        add_chr_nm: 'Provide a character name.',
        chr_voice: "Select the character's voice.",
        type_of_step: 'Select the type of this step',
        guid_value: 'Guid Value',
        value_gt_one: 'Value must be greater than or equals to 1',
        value_gt_interval: 'Value must be greater than interval',
        value_gt_min: 'Value must be greater than min',
        deprecated: 'Association Module is deprecated and will not work!',
        exhibit_err: 'Exhibit player does not support this format',
        open_modal: 'ADA button click to open modal box',
        val_gt_limit: 'Value must be greater than 599!',
        select_one_tool: 'Please select at least one tool.',
        delete_point_msg: '* To delete the points, right click on the points.',
        reset_module: 'Do you want reset the module?',
        ans_correct: "Your's answer is correct!",
        ans_incorrect: "Your's answer is incorrect!",
        shortcuts: 'Shortcuts',
        keys: 'Keys',
        ctrl_z: 'Ctrl + Z or Ctrl + fn + Z',
        undo: 'Undo',
        ctrl_x: 'Ctrl + X or Ctrl + fn + X',
        cut: 'Cut',
        ctrl_y: 'Ctrl + Y or Ctrl + fn + Y',
        redo: 'Redo',
        enter : 'Enter',
        enable_tool: 'Enable the Draw Tool',
        shift_enter: 'Shift + Enter',
        shift_arrow: 'Shift + arrow keys',
        start_stop_tool: 'Start/Stop Drawing by Drawing tool',
        compass_tools: 'Move the Compass components like Radius,center or its Angle / Move the Drawing point',
        locking: 'Shift + L',
        locking_txt: 'Lock the current Point when user is already pressed Enter on current Point',
        draw_key: 'D',
        draw_txt: 'When drawing by scribble tool by key events then fixed the path',
        tab: 'Tab',
        shift_tab: 'Shift + Tab',
        esc: 'Esc',
        focus_next: 'To move towards the next focus points',
        focus_prev: 'To move towards the previous focus points',
        exit_txt: 'To Exit this shortcut window',
        compass_center: 'Compass Center',
        shift_arrow_use : 'Use Shift and arrow keys to move the compass',
        compass_radius: 'Compass Radius, Your Current Radius is ',
        shift_arrow_radius: 'Use Shift and arrow keys to increase or decrease the radius.',
        compass_angle: 'Compass Angle, Your Current Angle is ',
        degree: ' degree',
        compass_draw: 'Compass Draw',
        shift_arrow_draw: ' Use Shift and arrow keys to draw throughout the circumference',
        shift_arrow_angle: 'Use Shift and arrow keys to increase or decrease the radius angle',
        reset_btn: 'Reset Button',
        marking_tools: 'Marking tools',
        removing_tools: 'Removing tools',
        drawing_tools: 'Drawing Tools Container',
        draw_tools: 'Draw tools',
        scribble_tool: 'Scribble tool', 
        line_tool: 'line tool',
        compass_tool: 'compass tool',
        line: 'Line',
        compass: 'Compass',
        scribble: 'Scribble',
        delete_tool: 'Delete tool',
        clear_screen: 'Clear Screen',
        mark_finish_point: 'Mark/Finish Points',
        mark_ans_point: 'Mark/Finish Answer Points',
        mark_pnt: 'Mark Points',
        delete_points: 'Do you want to delete the points?',
        answer_point: 'Answer Points',
        add_show_point: 'Add/Show Point',
        add_finish_point: 'Add/Finish Focus Point',
        add_focus_pnt: 'Add Focus Point',
        def_mode: 'Default Mode',
        access_mode: 'Accessibility Mode',
        configuration: 'Configuration',
        alt_txt_image: 'Alt Text of Image',
        draw_color: 'Drawing Color',
        itemtype_0 : "This task contains the radio buttons and checkboxes for options. The shortcut keys to perform this task are A to H and alt+1 to alt+9.",
        itemtype_1 : "To perform the given task, you have to select an item from one side and place it in front of its correct item on the other side. The shortcut keys to perform this task are Press the Alt+down arrow key to activate. Press the arrow key to navigate through all the items. Copy the left item using the Enter key. Paste the item using the Enter key. If you want to remove any navigated item, then selected that item and press the Delete key to remove for Windows and the Fn+Delete key for Mac.",
        itemtype_4 : "In this type of question, you have to point out the specific area asked in the question. The shortcut keys to perform this task are. The Alt+down arrow key to activate the target. The arrow key to move the target.",
        itemtype_6 : "Here, you have to select the options given in the list. The shortcut keys to perform this task are. The Alt+down arrow key to activate the answer area.  Use the arrow key for navigation. Press the Enter key to select the item. Again, press the Enter key to deselect the item.",
        itemtype_7 : "Here, you have to arrange the options given in the list into their correct order. The shortcut keys to perform this task are. Press the Alt+down arrow key to activate the answer area. Navigate to the item using the arrow key. Press the Enter key to copy the item. Navigate the copied item to the desired position using the arrow keys. Press the Enter key to paste the item. If the item is at its correct position, just press the Enter key to keep that item in sequence. If you want to remove the item from its position, press the Delete key for Windows and the Fn+Delete key for Mac.",
        itemtype_9 : "Here, this type of question contains the select box, text box, and drag and drop boxes. The shortcut keys to perform this task are. Press the Alt+down arrow key to activate the target. Press the arrow key to navigate through all the items. If the selected item is a text box or a select box, it will automatically get focused. If you want to drop the item in the droppable field, navigate to any of the draggable using the Tab key, and press the Enter key to copy the draggable, Now, navigate to any of the droppable field and press the Enter key to drop the copied item. If you want to remove the item from the droppable field, navigate to the droppable field and press the Delete key for Windows and the Fn+Delete key to remove the item.",
        itemtype_14 : "Here, in this type of question, you have to match the item on the left with the correct item on the right by selecting and placing the item to its correct answer. Shortcut key to perform this task are. Press the Alt+down arrow key to activate the target. Press the arrow key to navigate through all the item. Copy the left item using the Enter key. Paste the item using the Enter key. If you want to remove the item, navigate to any of the left side items and press the Delete key to remove for Windows and the Fn+Delete key for Mac.",
        itemtype_26 : "To perform the given task, you have to select and place it in correct item on the. The shortcut keys to perform this task are Press the Alt+down arrow key to activate. Press the arrow key to navigate through all the items. Copy the left item using the Enter key. Paste the item using the Enter key. If you want to remove any navigated item, then selected that item and press the Delete key to remove for Windows and the Fn+Delete key for Mac.",
        itemtype_30 : "Here, in this type of questions, you have to access the range. you can use left arrow key for decreasing the value and right for increasing the value.",
        itemtype_17 : "Here, you have to select the options given in the list. The shortcut keys to perform this task are: Press the tab for navigation. Press the Enter key to select the item and move using the tab key. Again, press the Enter key to deselect the item and place it on the correct option.",
        itemtype_27 : "Here, in this type of questions, you have to identify the correct and incorrect statements by checking the True or False check boxes. The shortcut key to perform the task are. Press Tab for navigation. Press the Enter key for selecting the check box.",
        itemtype_15 : "To perform the given task, you have to select an item from one side and place it in front of its correct item on the other side. The shortcut keys to perform this task are Press the Alt+down arrow key to activate. Press the arrow key to navigate through all the items. Copy the left item using the Enter key. Paste the item using the Enter key. If you want to remove any navigated item, then selected that item and press the Delete key to remove for Windows and the Fn+Delete key for Mac.",
        itemtype_13 : "Here, this type of question contains the terminal. You have to write command to perform this task.",
        itemtype_22 : "Here, this type of question contains the cisco terminal. You have to write command to perform this task.",
        es6_warining: "You are using Internet Explorer, ES6 functionality of javascript will not work!",
    };

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* helper\ItemHelper.svelte generated by Svelte v3.40.2 */
    const file = "helper\\ItemHelper.svelte";

    function add_css(target) {
    	append_styles(target, "svelte-ri6gyf", ".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbUhlbHBlci5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBOEJZLGdFQUFnRSxBQUFFLENBQUMsQUFDdkUsS0FBSyxDQUFFLElBQUksVUFBVSxDQUNyQixrQkFBa0IsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQ25ELFVBQVUsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxVQUFVLENBQzNDLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxDQUNuQyxZQUFZLENBQUUsT0FBTyxVQUFVLENBQy9CLGdCQUFnQixDQUFFLE9BQU8sVUFBVSxBQUN2QyxDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkl0ZW1IZWxwZXIuc3ZlbHRlIl19 */");
    }

    // (23:0) {#if reviewMode}
    function create_if_block(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Correct Answer";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Your Answer";
    			attr_dev(button0, "tabindex", "0");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "mode", "c");
    			attr_dev(button0, "class", "btn btn-light correct-ans");
    			add_location(button0, file, 24, 8, 1076);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "mode", "u");
    			attr_dev(button1, "class", "btn btn-light your-ans active");
    			add_location(button1, file, 25, 8, 1214);
    			attr_dev(div, "class", "smControlerBtn btn-group mb-3");
    			attr_dev(div, "role", "group");
    			attr_dev(div, "aria-label", "Answer buttons");
    			add_location(div, file, 23, 4, 982);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleSmClick*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*handleSmClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:0) {#if reviewMode}",
    		ctx
    	});

    	return block;
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

    	const block = {
    		c: function create() {
    			center = element("center");
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(button0, "tabindex", "0");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "h h-imp");
    			attr_dev(button0, "id", "set-review");
    			add_location(button0, file, 20, 0, 722);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "h h-imp");
    			attr_dev(button1, "id", "unset-review");
    			add_location(button1, file, 21, 0, 839);
    			add_location(center, file, 19, 0, 712);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, button0);
    			append_dev(center, t0);
    			append_dev(center, button1);
    			append_dev(center, t1);
    			if (if_block) if_block.m(center, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemHelper', slots, []);
    	let { reviewMode = false } = $$props;
    	let { handleReviewClick } = $$props;
    	const dispatch = createEventDispatcher();

    	function handleSmClick(event) {
    		document.querySelectorAll('.smControlerBtn button').forEach(el => el.classList.remove('active'));
    		event.target.classList.add('active');
    		if (handleReviewClick) handleReviewClick(event.target.getAttribute('mode'), event);
    	}

    	const writable_props = ['reviewMode', 'handleReviewClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemHelper> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch('setReview');
    	const click_handler_1 = () => dispatch('unsetReview');

    	$$self.$$set = $$props => {
    		if ('reviewMode' in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ('handleReviewClick' in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		reviewMode,
    		handleReviewClick,
    		dispatch,
    		handleSmClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('reviewMode' in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ('handleReviewClick' in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		reviewMode,
    		dispatch,
    		handleSmClick,
    		handleReviewClick,
    		click_handler,
    		click_handler_1
    	];
    }

    class ItemHelper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 }, add_css);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemHelper",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleReviewClick*/ ctx[3] === undefined && !('handleReviewClick' in props)) {
    			console.warn("<ItemHelper> was created without expected prop 'handleReviewClick'");
    		}
    	}

    	get reviewMode() {
    		throw new Error("<ItemHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reviewMode(value) {
    		throw new Error("<ItemHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleReviewClick() {
    		throw new Error("<ItemHelper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleReviewClick(value) {
    		throw new Error("<ItemHelper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

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

    var tagViewCss = { style: `.tagin{display:none}.tagin-wrapper{border: 1px solid #ccc;display:flex;flex-wrap:wrap;height:auto;padding:calc(.375rem - 2px) calc(.75rem - 2px);position:relative;overflow:hidden;cursor:text}.tagin-wrapper.focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.tagin.is-valid+.tagin-wrapper,.was-validated .tagin:valid+.tagin-wrapper{border-color:#28a745}.tagin.is-invalid+.tagin-wrapper,.was-validated .tagin:invalid+.tagin-wrapper{border-color:#dc3545}.tagin-tag{border-radius:.25rem;color:#fff;border:0;padding:0 4px;display:inline-flex;align-items:center;height:24px;margin:2px;font-weight:300;background-color:#6c757d;transition:transform .1s}.tagin-tag-remove{margin-left:2px;width:18px;height:18px;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-tag-remove:hover{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'/%3E%3C/svg%3E")}.tagin-input{margin-left:2px;border-color:transparent;outline:0;border-width:1px 0;padding:0 2px 0 0;height:28px;color:#495057}.tagin-input:not(.tagin-input-hidden){width:4px;min-width:4px}.tagin-input-hidden{position:absolute;top:0;left:-9999px;overflow:hidden;visibility:hidden;white-space:nowrap` };

    class API {
        constructor(options) {
            this._servers = [
                'http://localhost/pe-gold3/', 
                'https://www.ucertify.com/', 
                'https://www.jigyaasa.info/',
                'http://172.10.195.203/pe-gold3/',
            ];
            this._REMOTE_API_URL = this._servers[1] + 'pe-api/1/index.php';
            //@Prabhat: Why is this here. Need to remove this.
            this._client = {
                email: "pradeep.yadav@ucertify.com",
                password: "786pradeep",
                isSocial: "false",
                clientId: "040MA"
            };
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
                    request.setRequestHeader("old-access-token", globalThis.apiAccessToken);
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
                request.setRequestHeader("access-token", globalThis.apiAccessToken);
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
                globalThis.apiAccessToken = api.access_token;
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
            this.bsCat1 = ['Modal', 'Tooltip', 'Collapse', 'Popover', 'ScrollSpy', 'Tab', 'Alert', 'Dropdown'];
            this.extraSelectors = ['hidden', 'visible', 'selected', 'checked', 'enabled', 'children', 'childNodes'];
            this.parseHtml = this.templateHtml.bind(this);
            this.isSSDloaded = "";
            this.loadSSD();
        }

        loadSSD() {
            if (typeof globalThis == 'object') {
                globalThis.eventTracker = globalThis.eventTracker || {};
                globalThis.JUITemp = globalThis.JUITemp || {};
            } else {
                this.isSSDloaded = setInterval(()=> {
                    if (typeof globalThis == 'object') {
                        globalThis.eventTracker = globalThis.eventTracker || {};
                        globalThis.JUITemp = globalThis.JUITemp || {};
                        clearInterval(this.isSSDloaded);
                    }
                }, 500);
            }   
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
        addScript(data, url, options={}) {
            let sc = document.createElement("script");
            if (url) {
                sc.src = url;
                sc.async = true;
                if (options.callback) {
                    sc.onload = function() { 
                        options.callback();
                    };
                }
            } else {
                sc.innerHTML = data;
            }
            let selector = options.target ? document.body : document.head;
            selector.append(sc);
            return sc;
        }

        // used to genrate css links
        createLink(path, options={}) {
            let link = document.createElement('link');
            let selector = options.target ? document.body : document.head;
            link.href = path;
            if  (options.preload) {
                link.rel = "preload";
                link.onload = function() {
                    this.rel= options.type || "stylesheet";
                };
                link.as = options.as || "style";
                link.crossorigin = "anonymous";
            } else {
                link.rel = "stylesheet";
            }
            selector.append(link);
            return link;
        }

        // To enable Tag view on selected inputs
        // before use this call addTagViewCss once only
        enableTagView(options) {
            let selected = document.querySelectorAll('.tagin');
            for (const el of selected) {
                options ? TagView(el, options) : TagView(el);
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
                Array.prototype.forEach.call(current, (item)=> {
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
                Array.prototype.forEach.call(attrArray, (attr)=> {
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
            let elm = current ? current.parentElement : null;
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
            let elm = current ? current.parentElement : null;
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
        enableBsAll(selector, comp, options) {
            if (this.bsCat1.includes(comp)) {
                let triggerList = [].slice.call(document.querySelectorAll(selector));
                let fireList = triggerList.map(function (triggerElm) {
                    if (options) {
                        return new bootstrap[comp](triggerElm, options);
                    } else {
                        return new bootstrap[comp](triggerElm);
                    }
                });
                return fireList;
            } else {
                console.error("Bootstrap can't enable for this component name");
                return [];
            }
        }

        // Hide enabled bootstrap5 compoenents
        hideBsAll(selector, comp) {
            let fireList = [].slice.call(document.querySelectorAll(selector));
            if (this.bsCat1.includes(comp)) {
                fireList.forEach(function (elm) {
                    let ref = bootstrap[comp].getInstance(elm);
                    ref?.hide?.();
                });
            } else {
                console.error("Bootstrap can't disable for this component name");
            }
        }
        initDropdown() { // Hide the dropdown click outside, when dropdown is appended in dom using ajax call.
            let _this= this;
            _this.enableBsAll('[data-toggle="dropdown"]', 'Dropdown');
            _this.bind('body', 'click', function(event) {
                if (!event.target.closest('[data-toggle="dropdown"]')) {
                    _this.selectAll('[data-toggle="dropdown"]').forEach(function(currElem) {
                        currElem.classList.remove('show');
                    });
                    _this.selectAll('.dropdown-menu').forEach(function(currElem) {
                        currElem.classList.remove('show');
                    });
                }
            });
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
                        if (typeof sendData.data[prop] == 'object' && this.isValid(sendData.data[prop])) {
                            longData = this.jsonFormEncode(longData, prop, sendData.data[prop]);
                        } else {
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

        jsonFormEncode(formData, prop, jsonArray) {
            try {
                if (Array.isArray(jsonArray)) {
                    for (let i = 0; i < jsonArray.length; i++) {
                        for (let key in jsonArray[i]) {
                            formData.append(`${prop}[${i}][${key}]`, jsonArray[i][key]);
                        }
                    }
                } else {
                    for (var key in jsonArray) {
                        formData.append(`${prop}[${key}]`, jsonArray[key]);
                    }
                }
            } catch(error) {
                console.warn("Please provide valid JSON Object in ajax data."+ error);
            }
            return formData;
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

        // serialize nodes into array
        serializeArray(nodeArr, filter) {
            let result = [];
            nodeArr.forEach((item)=> {
                if (!filter || item.matches(filter)) {
                    console.log(item.attributes.length);
                    if (item.attributes.length > 0) {
                        let tempData = {};
                        for (let _attr of item.attributes) {
                            tempData[_attr.name] = _attr.value;
                        }
                        result.push(tempData);
                    }
                }
            });
            return result;
        }

        // Find target node into base node and some extra selectors
        find(baseSelector, target, data ) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            let typeAction = (typeof data == "object") ? "action" : data;
            if (base) {
                switch (typeAction) {
                    case 'all' : return base?.querySelectorAll(target);
                    case 'child' : return base?.querySelector(target).childNodes;
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
            let selected = this.isExtraSelectors(action, actionData) ? this.selectAction(selector, action) : (typeof selector == 'object' ? selector : document.querySelectorAll(selector));
            if (selected && selected.length > 0 && action) {
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action, actionData}));
            }
            return selected;
        }

        isExtraSelectors(action, actionData) {
            if (this.extraSelectors.includes(action)) {
                return (action == "checked" && typeof actionData != 'undefined') ? false : true;
            }
            return false;
        }

        // Select and enhance selector like jquery
        select(selector, action, actionData) {
            if (this.isExtraSelectors(action, actionData)) {
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
            let base = (typeof baseSelector == "object") ? baseSelector : (typeof document !== 'undefined' ? document.querySelector(baseSelector) : false);
            if (!base) return false;
            if (globalThis.eventTracker[selector]) {
                base.removeEventListener(eventName, globalThis.eventTracker[selector]);
            }
            globalThis.eventTracker[selector] = this.onListen.bind(this, selector, handler, base);
            base.addEventListener(eventName, globalThis.eventTracker[selector]);
        }

        // remove node classes
        removeClass(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected?.length > 0) {
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action: 'removeClass', actionData: name}));
            } else if (typeof selected == 'object') {
                this.jsAction(selected, {action: 'removeClass', actionData: name});
            }
            return selected || {};
        }
        // add class for node
        addClass(selector, name) {
            let selected = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (selected && selected?.length > 0) {
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action: 'addClass', actionData: name}));
            } else if (typeof selected == 'object') {
                this.jsAction(selected, {action: 'addClass', actionData: name});
            }
            return selected || {};
        }

        // dom visibility handle
        toggleDom(dom, action="toggleDisplay") {
            let selected =  typeof dom == "object" ? dom : document.querySelectorAll(dom);
            if (selected && selected.length > 0) {
                Array.prototype.forEach.call(selected, (elm)=> this.jsAction(elm, {action}) );
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

        // Set dataset on element
        getData(selector, attr) {
            let selected = (typeof selector == "object") ? selector : document.querySelector(selector);
            return selected?.dataset[attr] || {};
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
                Array.prototype.forEach.call(selected, (elm)=> elm.remove() );
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
                return -1;
            }
        }

        // compare selector in base node
        match(baseSelector, mathStr) {
            let base = (typeof baseSelector == "object") ? baseSelector : document.querySelector(baseSelector);
            let matched = [];
            if (base && base.length > 0 ) {
                Array.prototype.forEach.call(base, (elm)=> {
                    if (elm.matches(mathStr)) matched.push(elm);
                });
            } else {
                return base && base.matches(mathStr);
            }
            return matched;
        }

        // check selector in base node
        contains(selector, text) {
            let elements = (typeof selector == "object") ? selector : document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                return [].filter.call(elements, function(element) {
                    return RegExp(text).test(element.textContent);
                    });
            } else {
                return [];
            }
        }

        // merge two object like $.extend
        extend() {
            //This function are alternative of $.extend which merge content of objects into first one
            // To create deep copy pass true as first argument
            let extended = {};
            let deep = false;
            let i = 0;
            let length = arguments.length;
            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }
            // Merge the object into the extended object
            const merge = function (obj) {
                for ( let prop in obj ) {
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
                let obj = arguments[i];
                merge(obj);
            }
            return extended;
        }

        // return querystring as object
        url (url) {
            url = url || (typeof window == 'object' ? window.location.href : "");
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
            globalThis.apiAccessToken = token;
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
            if (typeof globalThis == 'object') globalThis.JUITemp[key] = value;
        }

        // get data from store
        get(key) {
            return globalThis.JUITemp[key];
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

        formatXml(xml, cdata_format) {
            let cdata = cdata_format || false;
            let reg = /(>)(<)(\/*)/g;
            let wsexp = / *(.*) +\n/g;
            let contexp = /(<.+>)(.+\n)/g;
            let old_cdata = cdata ? xml.match(/<!--\[CDATA\[[\s\S]*?\]\]-->/gim) : "";
            xml = xml.replace(/\t/g, '').replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
            if (cdata) {
                let new_cdata = xml.match(/<!--\[CDATA\[[\s\S]*?\]\]-->/gim);
                xml = xml.replace(new_cdata, old_cdata);
            }
            let formatted = '';
            let lines = xml.split('\n');
            let indent = 0;
            let lastType = 'other';
            // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
            let transitions = {
                'single->single': 0,
                'single->closing': -1,
                'single->opening': 0,
                'single->other': 0,
                'closing->single': 0,
                'closing->closing': -1,
                'closing->opening': 0,
                'closing->other': 0,
                'opening->single': 1,
                'opening->closing': 0,
                'opening->opening': 1,
                'opening->other': 1,
                'other->single': 0,
                'other->closing': -1,
                'other->opening': 0,
                'other->other': 0
            };
        
            for (let i = 0; i < lines.length; i++) {
                let ln = lines[i];
                if (ln != '') {
                    let single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
                    let closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
                    let opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
                    let type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
                    let fromTo = lastType + '->' + type;
                    lastType = type;
                    let padding = '';
        
                    indent += transitions[fromTo];
                    for (let j = 0; j < indent; j++) {
                        padding += '\t';
                    }
                    if (fromTo == 'opening->closing')
                        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
                    else
                        formatted += padding + ln + '\n';
                }
            }
            return formatted;
        }

        getModalHtml(data, type) {
            switch(type) {
                case 'Alert' : 
                    return (`
                    <div id="showMsgAlert" class="alert alert-warning alert-dismissible text-center fade show" role="alert" style="z-index:99999;min-height:50px;position:fixed;width:100%;">
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
                default : return "<div>Nothing</div>";
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
                case 'children': return document.querySelector(selector).children;
                case 'childNodes': return document.querySelector(selector).childNodes;
                default: return document.querySelector(selector);  
            }
        }
        
        // handle inline actions of js
        jsAction(selected, data) {
            if (selected instanceof HTMLElement) {
                switch(data.action) {
                    case 'show': selected.style.display = data.actionData || "";
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
                    break;
                    case 'getData': this.getData(selected, data.actionData);
                    break;
                }
            }
        }
        
        slideUp (target, duration = 500) {
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.boxSizing = 'border-box';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout( () => {
                target.style.display = 'none';
                target.style.removeProperty('height');
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
            }, duration);
        }

        slideDown (target, duration = 500) {
            target.style.removeProperty('display');
            let display = window.getComputedStyle(target).display;
            if (display === 'none') display = 'block';
            target.style.display = display;
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.boxSizing = 'border-box';
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout( () => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
            }, duration);
        }

        slideToggle (target, duration = 500) {
            if (window.getComputedStyle(target).display === 'none') {
                return this.slideDown(target, duration);
            } else {
                return this.slideUp(target, duration);
            }
        }
    } 

    const JS = new JUI();

    class X2JS {
    	config = {};
    	VERSION = "1.2.0";

    	DOMNodeTypes = {
    		ELEMENT_NODE 	   : 1,
    		TEXT_NODE    	   : 3,
    		CDATA_SECTION_NODE : 4,
    		COMMENT_NODE	   : 8,
    		DOCUMENT_NODE 	   : 9
    	}
    	constructor() {
    		this.initConfigDefaults();
    		this.initRequiredPolyfills();
    	}
    	initConfigDefaults() {
    		if(this.config.escapeMode === undefined) {
    			this.config.escapeMode = true;
    		}
    		
    		this.config.attributePrefix = this.config.attributePrefix || "_";
    		this.config.arrayAccessForm = this.config.arrayAccessForm || "none";
    		this.config.emptyNodeForm = this.config.emptyNodeForm || "text";		
    		
    		if(this.config.enableToStringFunc === undefined) {
    			this.config.enableToStringFunc = true; 
    		}
    		this.config.arrayAccessFormPaths = this.config.arrayAccessFormPaths || []; 
    		if(this.config.skipEmptyTextNodesForObj === undefined) {
    			this.config.skipEmptyTextNodesForObj = true;
    		}
    		if(this.config.stripWhitespaces === undefined) {
    			this.config.stripWhitespaces = true;
    		}
    		this.config.datetimeAccessFormPaths = this.config.datetimeAccessFormPaths || [];

    		if(this.config.useDoubleQuotes === undefined) {
    			this.config.useDoubleQuotes = false;
    		}
    		
    		this.config.xmlElementsFilter = this.config.xmlElementsFilter || [];
    		this.config.jsonPropertiesFilter = this.config.jsonPropertiesFilter || [];
    		
    		if(this.config.keepCData === undefined) {
    			this.config.keepCData = false;
    		}
    	}

        initRequiredPolyfills() {		
    	}

    	getNodeLocalName( node ) {
    		var nodeLocalName = node.localName;			
    		if(nodeLocalName == null) // Yeah, this is IE!! 
    			nodeLocalName = node.baseName;
    		if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
    			nodeLocalName = node.nodeName;
    		return nodeLocalName;
    	}
    	
    	getNodePrefix(node) {
    		return node.prefix;
    	}
    		
    	escapeXmlChars(str) {
    		if(typeof(str) == "string")
    			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    		else
    			return str;
    	}

    	unescapeXmlChars(str) {
    		return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
    	}
    	
    	checkInStdFiltersArrayForm(stdFiltersArrayForm, obj, name, path) {
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
    	
    	toArrayAccessForm(obj, childName, path) {
    		switch(this.config.arrayAccessForm) {
    			case "property":
    				if(!(obj[childName] instanceof Array))
    					obj[childName+"_asArray"] = [obj[childName]];
    				else
    					obj[childName+"_asArray"] = obj[childName];
    				break;
    			/*case "none":
    				break;*/
    		}
    		
    		if(!(obj[childName] instanceof Array) && this.config.arrayAccessFormPaths.length > 0) {
    			if(this.checkInStdFiltersArrayForm(this.config.arrayAccessFormPaths, obj, childName, path)) {
    				obj[childName] = [obj[childName]];
    			}			
    		}
    	}
    	
    	fromXmlDateTime(prop) {
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
    	
    	checkFromXmlDateTimePaths(value, childName, fullPath) {
    		if(this.config.datetimeAccessFormPaths.length > 0) {
    			var path = fullPath.split("\.#")[0];
    			if(this.checkInStdFiltersArrayForm(this.config.datetimeAccessFormPaths, value, childName, path)) {
    				return this.fromXmlDateTime(value);
    			}
    			else
    				return value;			
    		}
    		else
    			return value;
    	}
    	
    	checkXmlElementsFilter(obj, childType, childName, childPath) {
    		if( childType == this.DOMNodeTypes.ELEMENT_NODE && this.config.xmlElementsFilter.length > 0) {
    			return this.checkInStdFiltersArrayForm(this.config.xmlElementsFilter, obj, childName, childPath);	
    		}
    		else
    			return true;
    	}	

    	parseDOMChildren( node, path ) {
    		if(node.nodeType == this.DOMNodeTypes.DOCUMENT_NODE) {
    			var result = new Object;
    			var nodeChildren = node.childNodes;
    			// Alternative for firstElementChild which is not supported in some environments
    			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
    				var child = nodeChildren.item(cidx);
    				if(child.nodeType == this.DOMNodeTypes.ELEMENT_NODE) {
    					var childName = this.getNodeLocalName(child);
    					result[childName] = this.parseDOMChildren(child, childName);
    				}
    			}
    			return result;
    		}
    		else
    		if(node.nodeType == this.DOMNodeTypes.ELEMENT_NODE) {
    			var result = new Object;
    			result.__cnt=0;
    			
    			var nodeChildren = node.childNodes;
    			
    			// Children nodes
    			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
    				var child = nodeChildren.item(cidx); // nodeChildren[cidx];
    				var childName = this.getNodeLocalName(child);
    				
    				if(child.nodeType!= this.DOMNodeTypes.COMMENT_NODE) {
    					var childPath = path+"."+childName;
    					if (this.checkXmlElementsFilter(result,child.nodeType,childName,childPath)) {
    						result.__cnt++;
    						if(result[childName] == null) {
    							result[childName] = this.parseDOMChildren(child, childPath);
    							this.toArrayAccessForm(result, childName, childPath);					
    						}
    						else {
    							if(result[childName] != null) {
    								if( !(result[childName] instanceof Array)) {
    									result[childName] = [result[childName]];
    									this.toArrayAccessForm(result, childName, childPath);
    								}
    							}
    							(result[childName])[result[childName].length] = this.parseDOMChildren(child, childPath);
    						}
    					}
    				}								
    			}
    			
    			// Attributes
    			for(var aidx=0; aidx <node.attributes.length; aidx++) {
    				var attr = node.attributes.item(aidx); // [aidx];
    				result.__cnt++;
    				result[this.config.attributePrefix+attr.name]=attr.value;
    			}
    			
    			// Node namespace prefix
    			var nodePrefix = this.getNodePrefix(node);
    			if(nodePrefix!=null && nodePrefix!="") {
    				result.__cnt++;
    				result.__prefix=nodePrefix;
    			}
    			
    			if(result["#text"]!=null) {				
    				result.__text = result["#text"];
    				if(result.__text instanceof Array) {
    					result.__text = result.__text.join("\n");
    				}
    				//if(this.config.escapeMode)
    				//	result.__text = this.unescapeXmlChars(result.__text);
    				if(this.config.stripWhitespaces)
    					result.__text = result.__text.trim();
    				delete result["#text"];
    				if(this.config.arrayAccessForm=="property")
    					delete result["#text_asArray"];
    				result.__text = this.checkFromXmlDateTimePaths(result.__text, childName, path+"."+childName);
    			}
    			if(result["#cdata-section"]!=null) {
    				result.__cdata = result["#cdata-section"];
    				delete result["#cdata-section"];
    				if(this.config.arrayAccessForm=="property")
    					delete result["#cdata-section_asArray"];
    			}
    			
    			if( result.__cnt == 0 && this.config.emptyNodeForm=="text" ) {
    				result = '';
    			}
    			else
    			if( result.__cnt == 1 && result.__text!=null  ) {
    				result = result.__text;
    			}
    			else
    			if( result.__cnt == 1 && result.__cdata!=null && !this.config.keepCData  ) {
    				result = result.__cdata;
    			}			
    			else			
    			if ( result.__cnt > 1 && result.__text!=null && this.config.skipEmptyTextNodesForObj) {
    				if( (this.config.stripWhitespaces && result.__text=="") || (result.__text.trim()=="")) {
    					delete result.__text;
    				}
    			}
    			delete result.__cnt;			
    			
    			if( this.config.enableToStringFunc && (result.__text!=null || result.__cdata!=null )) {
    				result.toString = function() {
    					return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
    				};
    			}
    			
    			return result;
    		}
    		else
    		if(node.nodeType == this.DOMNodeTypes.TEXT_NODE || node.nodeType == this.DOMNodeTypes.CDATA_SECTION_NODE) {
    			return node.nodeValue;
    		}	
    	}
    	
    	startTag(jsonObj, element, attrList, closed) {
    		var resultStr = "<"+ ( (jsonObj!=null && jsonObj.__prefix!=null)? (jsonObj.__prefix+":"):"") + element;
    		if(attrList!=null) {
    			for(var aidx = 0; aidx < attrList.length; aidx++) {
    				var attrName = attrList[aidx];
    				var attrVal = jsonObj[attrName];
    				if(this.config.escapeMode)
    					attrVal=this.escapeXmlChars(attrVal);
    				resultStr+=" "+attrName.substr(this.config.attributePrefix.length)+"=";
    				if(this.config.useDoubleQuotes)
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
    	
    	endTag(jsonObj,elementName) {
    		return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
    	}
    	
    	endsWith(str, suffix) {
    		return str.indexOf(suffix, str.length - suffix.length) !== -1;
    	}
    	
    	jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
    		if((this.config.arrayAccessForm=="property" && this.endsWith(jsonObjField.toString(),("_asArray"))) 
    				|| jsonObjField.toString().indexOf(this.config.attributePrefix)==0 
    				|| jsonObjField.toString().indexOf("__")==0
    				|| (jsonObj[jsonObjField] instanceof Function) )
    			return true;
    		else
    			return false;
    	}
    	
    	jsonXmlElemCount ( jsonObj ) {
    		var elementsCnt = 0;
    		if(jsonObj instanceof Object ) {
    			for( var it in jsonObj  ) {
    				if(this.jsonXmlSpecialElem ( jsonObj, it) )
    					continue;			
    				elementsCnt++;
    			}
    		}
    		return elementsCnt;
    	}
    	
    	checkJsonObjPropertiesFilter(jsonObj, propertyName, jsonObjPath) {
    		return this.config.jsonPropertiesFilter.length == 0
    			|| jsonObjPath==""
    			|| this.checkInStdFiltersArrayForm(this.config.jsonPropertiesFilter, jsonObj, propertyName, jsonObjPath);	
    	}
    	
    	parseJSONAttributes ( jsonObj ) {
    		var attrList = [];
    		if(jsonObj instanceof Object ) {
    			for( var ait in jsonObj  ) {
    				if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf(this.config.attributePrefix)==0) {
    					attrList.push(ait);
    				}
    			}
    		}
    		return attrList;
    	}
    	
    	parseJSONTextAttrs ( jsonTxtObj ) {
    		var result ="";
    		
    		if(jsonTxtObj.__cdata!=null) {										
    			result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
    		}
    		
    		if(jsonTxtObj.__text!=null) {			
    			if(this.config.escapeMode)
    				result+=this.escapeXmlChars(jsonTxtObj.__text);
    			else
    				result+=jsonTxtObj.__text;
    		}
    		return result;
    	}
    	
    	parseJSONTextObject ( jsonTxtObj ) {
    		var result ="";

    		if( jsonTxtObj instanceof Object ) {
    			result+=this.parseJSONTextAttrs ( jsonTxtObj );
    		}
    		else
    			if(jsonTxtObj!=null) {
    				if(this.config.escapeMode)
    					result+=this.escapeXmlChars(jsonTxtObj);
    				else
    					result+=jsonTxtObj;
    			}
    		
    		return result;
    	}
    	
    	getJsonPropertyPath(jsonObjPath, jsonPropName) {
    		if (jsonObjPath==="") {
    			return jsonPropName;
    		}
    		else
    			return jsonObjPath+"."+jsonPropName;
    	}
    	
    	parseJSONArray ( jsonArrRoot, jsonArrObj, attrList, jsonObjPath ) {
    		var result = ""; 
    		if(jsonArrRoot.length == 0) {
    			result+=this.startTag(jsonArrRoot, jsonArrObj, attrList, true);
    		}
    		else {
    			for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
    				result+=this.startTag(jsonArrRoot[arIdx], jsonArrObj, this.parseJSONAttributes(jsonArrRoot[arIdx]), false);
    				result+=this.parseJSONObject(jsonArrRoot[arIdx], this.getJsonPropertyPath(jsonObjPath,jsonArrObj));
    				result+=this.endTag(jsonArrRoot[arIdx],jsonArrObj);
    			}
    		}
    		return result;
    	}
    	
    	parseJSONObject ( jsonObj, jsonObjPath ) {
    		var result = "";	

    		var elementsCnt = this.jsonXmlElemCount ( jsonObj );
    		
    		if(elementsCnt > 0) {
    			for( var it in jsonObj ) {
    				
    				if(this.jsonXmlSpecialElem ( jsonObj, it) || (jsonObjPath!="" && !this.checkJsonObjPropertiesFilter(jsonObj, it, this.getJsonPropertyPath(jsonObjPath,it))) )
    					continue;			
    				
    				var subObj = jsonObj[it];						
    				
    				var attrList = this.parseJSONAttributes( subObj );
    				
    				if(subObj == null || subObj == undefined) {
    					result+=this.startTag(subObj, it, attrList, true);
    				}
    				else
    				if(subObj instanceof Object) {
    					
    					if(subObj instanceof Array) {					
    						result+=this.parseJSONArray( subObj, it, attrList, jsonObjPath );					
    					}
    					else if(subObj instanceof Date) {
    						result+=this.startTag(subObj, it, attrList, false);
    						result+=subObj.toISOString();
    						result+=this.endTag(subObj,it);
    					}
    					else {
    						var subObjElementsCnt = this.jsonXmlElemCount ( subObj );
    						if(subObjElementsCnt > 0 || subObj.__text!=null || subObj.__cdata!=null) {
    							result+=this.startTag(subObj, it, attrList, false);
    							result+=this.parseJSONObject(subObj, this.getJsonPropertyPath(jsonObjPath,it));
    							result+=this.endTag(subObj,it);
    						}
    						else {
    							result+=this.startTag(subObj, it, attrList, true);
    						}
    					}
    				}
    				else {
    					result+=this.startTag(subObj, it, attrList, false);
    					result+=this.parseJSONTextObject(subObj);
    					result+=this.endTag(subObj,it);
    				}
    			}
    		}
    		result+=this.parseJSONTextObject(jsonObj);
    		
    		return result;
    	}
    	
    	parseXmlString (xmlDocStr) {
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
    	
    	asArray (prop) {
    		if (prop === undefined || prop == null)
    			return [];
    		else
    		if(prop instanceof Array)
    			return prop;
    		else
    			return [prop];
    	};
    	
    	toXmlDateTime (dt) {
    		if(dt instanceof Date)
    			return dt.toISOString();
    		else
    		if(typeof(dt) === 'number' )
    			return new Date(dt).toISOString();
    		else	
    			return null;
    	};
    	
    	asDateTime (prop) {
    		if(typeof(prop) == "string") {
    			return this.fromXmlDateTime(prop);
    		}
    		else
    			return prop;
    	};

    	xml2json (xmlDoc) {
    		return this.parseDOMChildren ( xmlDoc );
    	};
    	
    	xml_str2json (xmlDocStr) {
    		var xmlDoc = this.parseXmlString(xmlDocStr);
    		if(xmlDoc!=null)
    			return this.xml2json(xmlDoc);
    		else
    			return null;
    	};

    	json2xml_str (jsonObj) {
    		return this.parseJSONObject ( jsonObj, "" );
    	};

    	json2xml (jsonObj) {
    		var xmlDocStr = this.json2xml_str (jsonObj);
    		return this.parseXmlString(xmlDocStr);
    	};
    	
    	getVersion () {
    		return this.VERSION;
    	}
    }

    /* helper\HelperAI.svelte generated by Svelte v3.40.2 */

    function XMLToJSON(myXml) {
    	//var myXml = xml;
    	myXml = myXml.replace(/<\!--\[CDATA\[/g, "<![CDATA[").replace(/\]\]-->/g, "]]>");

    	let x2js = new X2JS({ useDoubleQuotes: true });
    	let newXml = JSON.stringify(x2js.xml_str2json(myXml));
    	newXml = newXml.replace("SMXML", "smxml");
    	newXml = JSON.parse(newXml);
    	return newXml;
    }

    function onUserAnsChange(result) {
    	if (result) {
    		AH.select("#answer", 'checked', result.ans ? true : false);
    		AH.select("#special_module_user_xml", 'value', result.uXml);

    		if (typeof window == 'object') {
    			window.ISSPECIALMODULEUSERXMLCHANGE = 1;

    			if (typeof calculatePoint != "undefined") {
    				calculatePoint(result.correctPoints || 1, result.ansPoint || result.ans);
    			}
    		}

    		globalThis.saveUserAnswerInSapper?.(result);
    	}
    }

    const AH = new JUI();
    const SSD = new JStore();

    /**
     *  File Name   : mathString.js
     *  Author      : Ayush Srivastava
     *  Function    : Graph
     *  Version     : 1.0
     *  Packege     : clsSMGRAPH (Preview)
     *  Last update : 02 Mar 2021
     *  Dependency  : JUI
     */
    const JS$1 = new JUI();

    let GRAPH = {};
    GRAPH.userAnsXML = "";
    GRAPH.sinfo = false;
    GRAPH.ajax_eId = "#mathmain";
    let board, point, prevPoint, is_correct;

    // plot the graph on the graph board with some binded events
    GRAPH.readyThis = function (mid) {
        // plot the graph on the graph board
        GRAPH.plotgraphPreview(mid);
    };

    // initialize the preview graph board
    GRAPH.initBoardPreview = function (mid, pElem) {
        JXG.Options.point.snapToGrid = true; // point lie only on grid
        JXG.Options.point.snapSizeX = JS$1.select(pElem).getAttribute('data-xtickdistance'); // x-axis interval
        JXG.Options.point.snapSizeY = JS$1.select(pElem).getAttribute('data-ytickdistance'); // y-axis interval
        JXG.Options.point.showInfobox = false;
        /* 
            xright denotes number of grid will be draw on positive x-axis from center of the grid 
            xleft is same as xright only difference is of sign. Minus (-) denotes negative axis
            ytop denotes number of grid will be draw on positive y-axis from center of the grid
            ybottom is same as ytop only difference is of sign. Minus (-) denotes negative axis
        */
        let xright = JS$1.select(pElem).getAttribute('data-xaxis'), xleft = -xright, ytop = JS$1.select(pElem).getAttribute('data-yaxis'), ybottom = -ytop;

        for (let index in JXG.boards) {
            if ( JXG.boards[index].container.includes('Preview') ) {
                if (JS$1.select(pElem).getAttribute('id') == JXG.boards[index].container) {
                    JXG.JSXGraph.freeBoard(JXG.boards[index]);
                }
            }
        }
        // hides the footer toolbox from the graph board	

        JS$1.find(mid, '.footer_toolbox').style.display = 'none';
        // shows the delete button after removing the h class from delete button's container
        JS$1.find(mid, '.delElem').classList.remove('h-imp');
        let board, axis, xaxis, yaxis, points, polygon;
        if (JS$1.select(pElem).classList.contains('association')) {
            /* discarded by Pete sir */
            board = JXG.JSXGraph.initBoard(JS$1.select(pElem).getAttribute('id'), {
                'boundingbox': [xleft, 3.4, xright, -5.4],//[-0.2, 3.4, 3.2, -5.4]
                'axis': false,
                'grid': false,
                'zoom': { 'factorX': 1.25, 'factorY': 1.25, 'wheel': true, 'needshift': true, 'eps': 0.1 },
                'showCopyright': false,
                'shownavigation': false
            });
            axis = board.create('line', [[0, 0], [1, 0]], { 'firstArrow': true, 'lastArrow': true, 'strokecolor': '#3E3E3E', 'fillcolor': '#3E3E3E', 'fixed': true });
            board.axis = axis;
            board.texts = [];
            board.create('ticks', [axis, JS$1.select(pElem).getAttribute('data-xtickdistance')], {
                'minorTicks': 9,
                'majorHeight': 15,
                'minorHeight': 5,
                'drawLabels': true,
                'label': { 'offset': [2, -10] },
                'drawZero': true
            });
            JS$1.find(mid, '.delElem').classList.add('h-imp');

            xaxis = Math.abs(JS$1.select(pElem).getAttribute('data-xaxis')) + Math.abs(JS$1.select(pElem).getAttribute('data-xtickdistance'));
            yaxis = JS$1.select(pElem).getAttribute('data-yaxis');
            polygon = board.create('polygon', [[-(xaxis), -2.4], [-(xaxis), -5.4], [(xaxis), -5.4], [(xaxis), -2.4]], { 'fillcolor': "#ccc", 'highlightfillcolor': "#ccc", 'withLines': false });
        } else if (JS$1.select(pElem).classList.contains('plot')) {
            // Initialise a new board	
            board = JXG.JSXGraph.initBoard(JS$1.select(pElem).getAttribute('id'), {
                'boundingbox': [xleft, ytop, xright, -1], /* An array containing four numbers describing the left, top, right and bottom boundary of the board in user coordinates */
                'axis': false, /* If set to true, show the axis. Can also be set to an object that is given to both axes as an attribute object. */
                'grid': false, /* If set to true, shows the grid. Can also be set to an object that is given to the grid as its attribute object. */
                'zoom': { 'factorX': 1.25, 'factorY': 1.25, 'wheel': true, 'needshift': true, 'eps': 0.1 }, /* Allow the user to zoom with the mouse wheel or the two-fingers-zoom gesture. */
                'showCopyright': false, /* If it is true shows the copyright string in the top left corner. */
                'shownavigation': false /* If it is true shows the navigation buttons in the bottom right corner. */
            });
            // Creates an instance of line
            axis = board.create('line', [[0, 0], [1, 0]], { 'firstArrow': true, 'lastArrow': true, 'strokecolor': '#3E3E3E', 'fillcolor': '#3E3E3E', 'fixed': true });
            // Creates an instance of ticks, ticks are used as distance markers on a line
            board.create('ticks', [axis, JS$1.select(pElem).getAttribute('data-xtickdistance')], {
                'minorTicks': 0, /* The number of minor ticks between two major ticks. */
                'majorHeight': 15, /* Total height of a major tick. */
                'minorHeight': 5, /* Total height of a minor tick. */
                'drawLabels': true, /* Draw labels yes/no */
                'label': { 'offset': [-6, -16] }, /* User defined labels for special ticks. */
                'drawZero': true /* Draw the zero tick, that lies at line.point1 */
            });
            // defines maximun x-axis value 
            board.xmax = xright;
            // hides the element have class 'delElem'
            JS$1.find(mid, '.delElem').classList.add('h-imp');

            // shows the element have class 'footer_toolbox'
            JS$1.find(mid, '.footer_toolbox').style.display = 'block';
        } else {
            // Initialise a new board
            board = JXG.JSXGraph.initBoard(JS$1.select(pElem).getAttribute('id'), {
                'boundingbox': [xleft, ytop, xright, ybottom], /* An array containing four numbers describing the left, top, right and bottom boundary of the board in user coordinates */
                'axis': false, /* If set to true, show the axis. Can also be set to an object that is given to both axes as an attribute object. */
                'grid': false, /* If set to true, shows the grid. Can also be set to an object that is given to the grid as its attribute object. */
                'zoom': { 'factorX': 1.25, 'factorY': 1.25, 'wheel': true, 'needshift': true, 'eps': 0.1 }, /* Allow the user to zoom with the mouse wheel or the two-fingers-zoom gesture. */
                'showCopyright': false, /* If it is true shows the copyright string in the top left corner. */
                'shownavigation': false /* If it is true shows the navigation buttons in the bottom right corner. */
            });
            // Creates an instance of x-axis
            xaxis = board.create('axis', [[-(Math.abs(JS$1.select(pElem).getAttribute('data-xtickdistance')) / 2), 0], [(Math.abs(JS$1.select(pElem).getAttribute('data-xtickdistance')) / 2), 0]]);
            // removes all ticks from x-axis 
            xaxis.removeAllTicks();
            // Creates an instance of ticks, ticks are used as distance markers on a line
            board.create('ticks', [xaxis, JS$1.select(pElem).getAttribute('data-xtickdistance')], {
                'strokeColor': '#ccc', // color of the stroke
                'majorHeight': -1, /* Total height of a major tick */
                'drawLabels': true, /* Draw labels */
                'label': { 'offset': [2, -10] }, /* Attributes for the axis label */
                'minorTicks': 3, /* The number of minor ticks between two major ticks. */
                'drawZero': true /* Draw the zero tick, that lies at line.point1 */
            });
            // Creates an instance of y-axis
            yaxis = board.create('axis', [[0, -(Math.abs(JS$1.select(pElem).getAttribute('data-ytickdistance')) / 2)], [0, (Math.abs(JS$1.select(pElem).getAttribute('data-ytickdistance')) / 2)]]);
            // removes all ticks from y-axis
            yaxis.removeAllTicks();
            // Creates an instance of ticks, ticks are used as distance markers on a line
            board.create('ticks', [yaxis, JS$1.select(pElem).getAttribute('data-ytickdistance')], {
                'strokeColor': '#ccc', // color of the stroke
                'majorHeight': -1, /* Total height of a major tick */
                'drawLabels': true, /* Draw labels */
                'label': { 'offset': [4, -6] }, /* Attributes for the axis label */
                'minorTicks': 3, /* The number of minor ticks between two major ticks. */
                'drawZero': false /* If it is true then draw the zero tick, that lies at line.point1 */
            });
        }
        board.points = [];
        board.xtick = JS$1.select(pElem).getAttribute('data-xtickdistance'); /* defines the x-axis interval of the graph board */
        board.ytick = JS$1.select(pElem).getAttribute('data-ytickdistance'); /* defines the y-axis interval of the graph board */
        board.xaxis = JS$1.select(pElem).getAttribute('data-xaxis'); /* defines no of grid will be draw on each (positive and negative) x-axis of the graph board */
        board.yaxis = JS$1.select(pElem).getAttribute('data-yaxis'); /* defines no of grid will be draw on each (positive and negative) y-axis of the graph board */
        // Shows the name of the graph selected in left side of toolbar in capitalize form
        let li = JS$1.find(mid, 'li.selected-option', 'all');
        if (li.length) {
            li.forEach((el) => {
                el.innerHTML = JS$1.select(pElem).getAttribute('type');
                el.style.textTransform = 'capitalize';
            });
        }

        if (JS$1.select(pElem).getAttribute('type') == "polygon" && JS$1.select(pElem).getAttribute('data-reflection') && JS$1.select(pElem).getAttribute('data-reflection')) {
            points = JS$1.select(pElem).getAttribute('data-reflection').split('|');
            polygon = [];

            for (let index = 0; index < points.length; index++) {
                let k = points[index].split(',');
                // Creates an instance of point
                let point = board.create("point", [k[0], k[1]], { 'name': "", 'strokecolor': "darkgray", 'strokewidth': 2, 'fillcolor': "darkgray" });
                // pushes the instance of deffent-2 point into polygon array
                polygon.push(point);
            }
            // Creates an instance of polygon
            board.create('polygon', polygon, { 'withline': true, 'fillcolor': "darkgray", 'borders': { 'strokecolor': "darkgray", 'strokewidth': 2 } });
        }
        // returns reference to the created board
        return board;
    };

    // plot the graph on the graph board
    GRAPH.plotgraphPreview = function (mid) {
        let elements = JS$1.find(mid, '.drag-resize', 'all');
        for (let index = 0; index < elements.length; index++) {
            let elem = elements[index].getAttribute('id');
            // assign reference of the created board
            board = GRAPH.initBoardPreview(mid, elements[index]);
            board.prevPoint = null;
            let pointy = 1;
            /* The function getMouseCoords extracts the click coordinates from the event object and returns a JXG.Coords object with the point's coordinates on the board */
            let getMouseCoords = function (e) {
                /* Calculates mouse coordinates relative to the boards container. */
                let cPos = board.getCoordsTopLeftCorner(e),
                    absPos = JXG.getPosition(e, 0), /* Get the position of the mouse in screen coordinates, relative to the upper left corner of the host tag */
                    dx = absPos[0] - cPos[0],
                    dy = absPos[1] - cPos[1];
                return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
            },
            down = function (e) {
                let canCreate = true, coords, el;
                // instance of mouse coordinate
                coords = getMouseCoords(e);
                for (el in board.objects) {
                    if (JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                        // used for check if point will be draw or not
                        canCreate = false;
                        break;
                    }
                }
                // allow to create the point if it is not exist on the board with same co-ordinate value
                if (canCreate) {
                    let point, type;
                    if (JS$1.select('#' + elem).classList.contains('plot')) {
                        // Creates an instance of point
                        point = board.create('point', [coords.usrCoords[1], pointy], { 'name': "", 'showInfobox': false });
                        point.Xjc = point.X() + Math.abs(point.board.xtick);
                        type = JS$1.select('.footer_toolbox li.btn_active').getAttribute('data-value'); 
                        pointy++;
                        if (pointy == point.board.yaxis) {
                            board.off('down');
                        }
                    } else {
                        // Creates an instance of point
                        point = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]], { 'name': "" });
                    }
                    // Updates and draw the graph
                    GRAPH.updateAndDrawPreview(mid, elem, point, type);
                    // update the attributes of graph board container
                    GRAPH.updateAttrsPreview(elem, point);
                }
                // check the answer
                GRAPH.checkAns(mid);
            };
            if (JS$1.select('#' + elem).classList.contains('association')) {
                // It is discarded by Pete sir
                if (JS$1.select('#' + elem).getAttribute('data-userans') == "") {
                    let anskey = JS$1.select('#' + elem).getAttribute('data-anskey').split('|'), p1 = -(JS$1.select('#' + elem).getAttribute('data-xaxis') - JS$1.select('#' + elem).getAttribute('data-xtickdistance')), p2 = -4.4;
                    for (let subindex = 0; subindex < anskey.length; subindex++) {
                        let k = anskey[subindex].split(',');
                        let txt = GRAPH.updateNumberline(mid, elem, p1, p2, k[0]);
                        GRAPH.updateNumbelineAttr(elem, txt);
                        p1 = p1 + 1 + (Math.abs(JS$1.select('#' + elem).getAttribute('data-xtickdistance')) / 10);
                        GRAPH.checkAns(mid);
                    }
                }
            } else {
                // create the point according to the condition if point will be draw or not
                board.off('down').on('down', down);
            }
        }
    };

    // It is used with association that is discarded by  Pete sir
    GRAPH.updateNumberline = function (mid, elem, p1, p2, k) {
        if (board.texts.length < JS$1.select('#' + elem).getAttribute('data-anskey').split('|').length) {
            let text = board.create('text', [p1, p2, k], { 'cssClass': "cursor-down", 'fontSize': '20px', 'highlightCssClass': "cursor-down", 'display': 'html', 'snapSizeX': (Math.abs(JS$1.select('#' + elem).getAttribute('data-xtickdistance')) / 10), 'snapSizeY': 0.4, 'snapToGrid': true, 'anchorX': 'middle', 'anchorY': 'bottom' });
            board.texts.push(text);
            text.on('down', function () {
                this.startPosition = this.X().toFixed(1) + ',' + this.Y() + ',' + this.htmlStr;
            });
            text.on('up', function () {
                if (this.Y().toFixed(1) > 0.4) {
                    board.removeObject(this); board.texts.pop(this);
                    GRAPH.updateNumberline(mid, elem, parseFloat(this.X().toFixed(1)), 0.4, this.htmlStr);
                    this.upPosition = this.X().toFixed(1) + ',' + 0.4 + ',' + this.htmlStr;
                } else if (this.Y().toFixed(1) < 0.4) {
                    board.removeObject(this); board.texts.pop(this);
                    GRAPH.updateNumberline(mid, elem, parseFloat(this.X().toFixed(1)), -4.4, this.htmlStr);
                    this.upPosition = this.X().toFixed(1) + ',' + -4.4 + ',' + this.htmlStr;
                } else {
                    this.upPosition = this.X().toFixed(1) + ',' + this.Y().toFixed(1) + ',' + this.htmlStr;
                }
                GRAPH.updateNumbelineAttr(elem, this, true);
                GRAPH.checkAns(mid);
            });
            text.on('over', function () {
                if (!this.visProp.fixed) {
                    board.containerObj.style.cursor = 'move';
                    this.setAttribute({ 'cssClass': "cursor-down-hover", 'highlightCssClass': "cursor-down-hover" });
                }
            });
            text.on('out', function () {
                if (!this.visProp.fixed) {
                    board.containerObj.style.cursor = 'default';
                    this.setAttribute({ 'cssClass': "cursor-down", 'highlightCssClass': "cursor-down" });
                }
            });
            return text;
        }
    };

    // It is used with association that is discarded by  Pete sir
    GRAPH.updateNumbelineAttr = function (elem, txt, isUpdate) {
        let userans = JS$1.select('#' + elem).getAttribute('data-userans');
        if (typeof isUpdate == "undefined") {
            userans = userans.split('|').filter(function (element) { return element != '' });
            userans.push(txt.X().toFixed(1) + ',' + txt.Y() + ',' + txt.htmlStr);
            JS$1.select('#' + elem).setAttribute('data-userans', userans.join('|'));
        } else {
            userans = JS$1.select('#' + elem).getAttribute('data-userans').replace(txt.startPosition, txt.upPosition);
            JS$1.select('#' + elem).setAttribute('data-userans', userans);
        }
    };

    // used to draw the graph on the board and according to defined events and also fill the point and sroke color of line or curve
    GRAPH.updateAndDrawPreview = function (mid, elem, point, isUpdate) {
        if (JS$1.select('#' + elem).classList.contains('plot')) {
            point.setAttribute({ 'fillcolor': '#52A8EC', 'strokecolor': '#52A8EC' });
            if (JS$1.select('[data-value="' + isUpdate + '"]').nodeName && JS$1.select('[data-value="' + isUpdate + '"]').getAttribute('rel') && JS$1.select('[data-value="' + isUpdate + '"]').getAttribute('rel').indexOf('segment') == 0) {
                // creates the instance of point
                point.board.prevPoint = point.board.create('point', [point.Xjc, point.Y()], { 'name': "", 'fillcolor': '#52A8EC', 'strokecolor': '#52A8EC', 'fixed': true });
                // creates the instance of line
                point.for = point.board.create('line', [point.board.prevPoint, point], { 'straightFirst': false, 'straightLast': false, 'firstArrow': false, 'lastArrow': false, 'strokeWidth': "2", 'fillcolor': '#52A8EC', 'strokecolor': '#52A8EC' });
                // assign the value of 'isUpdate' in the name for point instance	
                point.for.name = isUpdate;
                switch (isUpdate) {
                    // sets the stroke and fill color of the point
                    case "SLH":
                        point.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                        break;
                    case "SRH":
                        point.board.prevPoint.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                        break;
                    case "SBH":
                        point.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                        point.board.prevPoint.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                        break;
                }
            } else if ( JS$1.select('[data-value="' + isUpdate + '"]').nodeName && JS$1.select('[data-value="' + isUpdate + '"]').getAttribute('rel') && JS$1.select('[data-value="' + isUpdate + '"]').getAttribute('rel').indexOf('ray') == 0 ) {
                // creates the instance of point
                switch (isUpdate) {
                    case "RL":
                        point.board.prevPoint = point.board.create('point', [-Math.abs(point.board.xmax), point.Y()], { 'visible': false });
                        break;
                    case "RR":
                        point.board.prevPoint = point.board.create('point', [Math.abs(point.board.xmax), point.Y()], { 'visible': false });
                        break;
                    case "RRH":
                        point.setAttribute({ 'fillcolor': '#fff', 'strokecolor': '#52A8EC' });
                        point.board.prevPoint = point.board.create('point', [-Math.abs(point.board.xmax), point.Y()], { 'visible': false });
                        break;
                    case "RLH":
                        point.setAttribute({ 'fillcolor': '#fff' });
                        point.board.prevPoint = point.board.create('point', [Math.abs(point.board.xmax), point.Y()], { 'visible': false });
                        break;
                }
                // creates the instance of line
                point.for = point.board.create('line', [point.board.prevPoint, point], { 'straightFirst': true, 'straightLast': false, 'firstArrow': true, 'lastArrow': false, 'strokeWidth': "2", 'fillcolor': '#52A8EC', 'strokecolor': '#52A8EC' });
                // assign the name in point reference to value of variable 'isUpdate'
                point.for.name = isUpdate;
            }
            board.on('move', function () {
                if (point.Yjc != null) {
                    // sets the initial point where mouse moved on the graph board
                    point.moveTo([point.X(), point.Yjc]);
                }
            });
            point.on('over', function () {
                if (!this.visProp.fixed) {
                    // change the style of the cursor to 'e-resize'
                    board.containerObj.style.cursor = 'e-resize';
                }
            });
            point.on('out', function () {
                if (!this.visProp.fixed) {
                    // change the style of the cursor to 'default'
                    board.containerObj.style.cursor = 'default';
                }
            });
        } else {
            GRAPH.sinfo = false;
            point.board.points.push(point);
            if (point.board.prevPoint == null) {
                point.board.prevPoint = point;
            } else {
                let i, s;
                if (JS$1.select('#' + elem).classList.contains('line')) {
                    // assign the value to is_correct variable returned by 'GRAPH.getEquationPreview' method
                    is_correct = GRAPH.getEquationPreview(elem, point.X(), point.Y(), point.board.prevPoint.X(), point.board.prevPoint.Y());
                    // creates the instance of line
                    point.for = point.board.create('line', [point, point.board.prevPoint], { 'straightFirst': true, 'straightLast': true, 'firstArrow': true, 'lastArrow': true, 'strokeWidth': "2" });
                    GRAPH.sinfo = (is_correct) ? true : false;
                } else if (JS$1.select('#' + elem).classList.contains('circle')) {
                    // creates the instance of circle
                    point.for = point.board.create('circle', [point.board.prevPoint, point], { 'straightFirst': true, 'straightLast': true, 'firstArrow': true, 'lastArrow': true, 'strokeWidth': "2" });
                    // instance of center points of the circle
                    point.for.center.for = point.for;
                } else if (JS$1.select('#' + elem).classList.contains('segment')) {
                    // creates the instance of line
                    point.for = point.board.create('line', [point, point.board.prevPoint], { 'straightFirst': false, 'straightLast': false, 'firstArrow': false, 'lastArrow': false, 'strokeWidth': "2" });
                } else if (JS$1.select('#' + elem).classList.contains('vector')) {
                    /*
                        * creates instance of the line.
                        * straightFirst: If true, line stretches infinitely in direction of its first point.
                        * straightLast: If true, line stretches infinitely in direction of its last point.
                        * strokeWidth: Denotes width of the line.
                        * firstArrow: Line has an arrow head at the position of its first point or the corresponding intersection with the canvas border.
                        * lastArrow: Line has an arrow head at the position of its second point or the corresponding intersection with the canvas border.
                    */
                    point.for = point.board.create('line', [point, point.board.prevPoint], { 'straightFirst': false, 'straightLast': false, 'firstArrow': true, 'lastArrow': false, 'strokeWidth': "2" });
                } else if (JS$1.select('#' + elem).classList.contains('ray')) {
                    // same as defined in above for vector class condition
                    point.for = point.board.create('line', [point, point.board.prevPoint], { 'straightFirst': true, 'straightLast': false, 'firstArrow': true, 'lastArrow': false, 'strokeWidth': "2" });
                } else if (JS$1.select('#' + elem).classList.contains('parabola')) {
                    point.setAttribute({ 'fixed': true }); point.board.prevPoint.setAttribute({ 'fixed': true });
                    let eq = JS$1.select('#' + elem).getAttribute('data-equation').split('=');
                    // assign the parabola equation to variable fx returned by 'GRAPH.getEquationPreview' method
                    let fx = GRAPH.getEquationPreview(elem, point.X(), point.Y(), point.board.prevPoint.X(), point.board.prevPoint.Y());
                    /* 
                        * Parses a JessieCode snippet, e.g. "3+4", and wraps it into a function, if desired. 
                        * First argument is a small snippet of JessieCode. Must not be an assignment.
                        * If second argument is true, the code is wrapped in a function.
                        * Third argument is the name of the parameter(s).
                        * Fourth variable is geonext compatibility mode. 
                    */
                    let f = board.jc.snippet(fx, true, 'x', true);
                    // provides a constructor for functiongraph, which is just a wrapper for element Curve with JXG.Curve#X() set to x
                    point.for = point.board.create('functiongraph', [f]);
                    GRAPH.sinfo = (fx == eq[1]) ? true : false;
                    // sets the initial and final points instance
                    point.for.point1 = point.board.prevPoint; point.for.point2 = point;
                    point.board.prevPoint = null;
                } else if (JS$1.select('#' + elem).classList.contains('polygon')) {
                    if (typeof isUpdate == "undefined") {
                        // creates the instance of the polygon
                        point.for = point.board.create('polygon', [point.board.prevPoint, point]);
                        // defines the initial point instance
                        point.board.prevPoint = point;
                    } else {
                        if (isUpdate.length == point.board.points.length) {
                            // creates the instance of the polygon
                            point.for = point.board.create('polygon', point.board.points, { 'boadres': { 'strokecolor': "darkgray", 'strokeWidth': 2 } });
                            point.for.parents.for = point.for; point.board.prevPoint = null; point.board.points = [];
                        }
                    }
                } else if (JS$1.select('#' + elem).classList.contains('sine')) {
                    // assign the value to is_correct variable returned by 'GRAPH.getEquationPreview' method
                    is_correct = GRAPH.getEquationPreview(elem, point.X(), point.Y(), point.board.prevPoint.X(), point.board.prevPoint.Y());
                    i = point.board.prevPoint;
                    s = point;
                    // creates the instance of the curve
                    point.for = point.board.create('curve', [function (e) {
                        return e;
                    }, function (e) {
                        let t = i.coords.usrCoords, n = s.coords.usrCoords,
                            r = t[1], o = t[2], u = n[1], a = n[2], f = a - o, l = 1 / (4 * (u - r));
                        return f * Math.sin(2 * Math.PI * l * (e - r)) + o;
                    }]);
                    // defines the instance of initial and last point 
                    point.for.point1 = point.board.prevPoint; point.for.point2 = point;
                    GRAPH.sinfo = (is_correct) ? true : false;
                } else if (JS$1.select('#' + elem).classList.contains('cosine')) {
                    // assign the value to is_correct variable returned by 'GRAPH.getEquationPreview' method
                    is_correct = GRAPH.getEquationPreview(elem, point.X(), point.Y(), point.board.prevPoint.X(), point.board.prevPoint.Y());
                    i = point.board.prevPoint;
                    s = point;
                    // creates the instance of the curve
                    point.for = point.board.create('curve', [function (e) {
                        return e;
                    }, function (e) {
                        let t = i.coords.usrCoords, n = s.coords.usrCoords,
                            r = t[1], o = t[2], u = n[1], a = n[2], f = (a - o), l = 1 / (4 * (r - u));
                        return f * Math.cos(2 * Math.PI * l * (e - u)) + o;
                    }]);
                    point.for.point1 = point.board.prevPoint; point.for.point2 = point;
                    GRAPH.sinfo = (is_correct) ? true : false;
                }
                if (!JS$1.select('#' + elem).classList.contains('polygon')) {
                    // assign the initial point instance to null
                    point.board.prevPoint = null;
                }
            }
        }
        point.on('down', function () {
            if (JS$1.select('#' + elem).classList.contains('plot')) {
                // assign the value of y co-ordinate
                this.Yjc = this.Y();
                if (typeof this.for == "undefined") {
                    // contains the x-axis co-ordinate and name with ',' separated, not aware of 'this.name'
                    this.startPosition = this.X() + ',' + this.name;
                } else {
                    // contains the x-axis co-ordinates of the points and name with ',' separated, not aware of 'this.name'
                    this.startPosition = this.for.point2.X() + ',' + this.for.point1.X() + ',' + this.for.name;
                }
            } else {
                this.startPosition = this.X() + "," + this.Y();
                if (JS$1.select('#' + elem).classList.contains('polygon') && point.board.points.length > 0) {
                    if (this.X() + "," + this.Y() == point.board.points[0].X() + "," + point.board.points[0].Y()) {
                        // creates the instance of the polygon
                        point.for = point.board.create('polygon', point.board.points, { 'boadres': { 'strokecolor': "darkgray", 'strokeWidth': 2 } });
                        point.for.parents.for = point.for;
                        // sets the initial point instance of the graph to null
                        point.board.prevPoint = null;
                        point.board.points = [];
                    }
                }
            }
            if (typeof this.for != "undefined" && this.for.elType == "circle") {
                // assign the value of radius to 'this.startPosition' after mousedown on the points of the circle
                this.startPosition = Math.round(this.for.Radius());
            }
        });
        point.on('up', function () {
            let remove_active = false;
            if (!JS$1.select('.delElem').children[0].classList.contains('active')) {
                // update the attributes of the graph board container and draw the graph accordingly
                GRAPH.updateAttrsPreview(elem, this, true);
                // returns Correct or Incorrect after matching the answer
                GRAPH.checkAns(mid);
            } else {
                /* removes the plotted point when mouse up on it and according to this also removes graph if the children of the element having id deleteElm has active */
                if (JS$1.select('#' + elem).classList.contains('point')) {
                    //removes the point from board on which mouse up
                    board.removeObject(this);
                    // it is co-ordinate of the point on which mouse up
                    this.position = this.startPosition;
                    remove_active = true;
                } else if (JS$1.select('#' + elem).classList.contains('circle')) {
                    //removes the reference of the circle
                    board.removeObject(this);
                    // removes the center of the circle
                    board.removeObject(this.for.center);
                    /* removes second point which lies on circumference of the circle for decide the radius of circle */
                    board.removeObject(this.for.point2);
                    GRAPH.modeOn();  // @pradeep : added for delete complete.
                    /* contains center and radius of the circle which is deleted */
                    this.position = this.for.center.X() + "," + this.for.center.Y() + "/" + Math.round(this.for.Radius());
                    remove_active = true;
                } else if (JS$1.select('#' + elem).classList.contains('polygon') && typeof this.for != "undefined") {
                    let vertices = [];
                    if (typeof this.for.parents.for != "undefined") {
                        for (let i = 0; i < point.for.vertices.length; i++) {
                            // removes the vertics of the polygon with specified index
                            point.board.removeObject(this.for.parents.for.vertices[i]);
                            // push the co-ordinates of the vertics at specified index in vertices array
                            vertices.push(this.for.parents.for.vertices[i].X() + ',' + this.for.parents.for.vertices[i].Y());
                        }
                        // removes the polygon reference
                        point.board.removeObject(this.for.parents.for);
                        // removes last index value from vertices array
                        vertices.pop(vertices[vertices.length - 1]);
                        // assign the values of vertices array after joining it by '|' into 'this.position' 
                        this.position = vertices.join('|');
                        remove_active = true;
                    }
                } else {
                    if (typeof this.for != "undefined") {
                        // removes the point reference from graph board
                        board.removeObject(this.for);
                        // removes the first point from graph board
                        board.removeObject(this.for.point1);
                        // removes the second point from graph board
                        board.removeObject(this.for.point2);
                        // sets the position key value for manage the anskey
                        this.position = this.for.point1.X() + ',' + this.for.point1.Y() + '|' + this.for.point2.X() + ',' + this.for.point2.Y();
                        remove_active = true;
                    } else {
                        if (JS$1.select('#' + elem).classList.contains('parabola')) {
                            JS$1 && JS$1.showmsg(l.curve_start_point, 3000);
                        }
                    }
                }

                /* for warning in parabola when clicked other than last point of the curve to delete it */
                if (JS$1.select('#' + elem).classList.contains('parabola')) {
                    if (typeof this.for != "undefined") {
                        /* removes the value from data-userans attribute of graph board container and also removes the graph according to remove this value */
                        GRAPH.updateDeleteAttrs(elem, this.position);
                        // returns Correct or Incorrect after matching the answer
                        GRAPH.checkAns(mid);
                        // removes the active class from delete button inside Preview container
                        JS$1.select('.delElem').children[0].classList.remove('active');
                    } else {
                        console.warn({ msg: l.warning_this_for });
                    }
                } else {
                    /* removes the value from data-userans attribute of graph board container and also removes the graph according to remove this value */
                    GRAPH.updateDeleteAttrs(elem, this.position);
                    // returns Correct or Incorrect after matching the answer
                    GRAPH.checkAns(mid);
                }

                if (remove_active) {
                    let remove_focus = setTimeout(function (){
                        JS$1.selectAll('#mathmain #delButton.active', 'removeClass','active');
                        clearTimeout(remove_focus);
                    }, 100);
                }
            }
        });
        point.on('over', function () {
            /* if delete button on preview container has active classs then on hover it, it shows the text 'Delete',hides the box which contains the co-ordinate of that point on which mouseover and sets its stroke and fill color to 'black' */
            if (!this.visProp.fixed && JS$1.select('.delElem').children[0].classList.contains('active')) {
                if (JS$1.select('#' + elem).classList.contains('point')) {
                    this.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                } else if (JS$1.select('#' + elem).classList.contains('circle') && typeof this.for != "undefined") {
                    this.for.center.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                    this.for.point2.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                } else if (JS$1.select('#' + elem).classList.contains('polygon') && typeof this.for != "undefined") {
                    if (typeof this.for.parents.for != "undefined") {
                        this.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                    }
                } else if (JS$1.select('#' + elem).classList.contains('sine') || JS$1.select('#' + elem).classList.contains('cosine')) {
                    if (typeof this.for != "undefined") {
                        this.for.point2.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                    }
                } else {
                    if (typeof this.for != "undefined") {
                        this.for.point1.setAttribute({ 'name': 'Delete', 'showInfobox': false, 'fillcolor': '#000', 'strokecolor': '#000' });
                    }
                }
            }
        });
        point.on('out', function () {
            /* if delete button on preview container has active classs then mouseout on it, it sets the text blank, allow to show the box which contains the co-ordinate of that point on which mouseout and sets its stroke and fill color to 'red' */
            if (!this.visProp.fixed && JS$1.select('.delElem').children[0].classList.contains('active')) {
                if (JS$1.select('#' + elem).classList.contains('point')) {
                    this.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                } else if (JS$1.select('#' + elem).classList.contains('circle') && typeof this.for != "undefined") {
                    this.for.center.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                    this.for.point2.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                } else if (JS$1.select('#' + elem).classList.contains('polygon') && typeof this.for != "undefined") {
                    if (typeof this.for.parents.for != "undefined") {
                        this.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                    }
                } else if (JS$1.select('#' + elem).classList.contains('sine') || JS$1.select('#' + elem).classList.contains('cosine')) {
                    if (typeof this.for != "undefined") {
                        this.for.point2.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                    }
                } else {
                    if (typeof this.for != "undefined") {
                        this.for.point1.setAttribute({ 'name': '', 'showInfobox': true, 'fillcolor': '#ff0000', 'strokecolor': '#ff0000' });
                    }
                }
            }
        });
    };

    // returns the equation of parabola if type is parabola otherwise returns true or false
    GRAPH.getEquationPreview = function (elem, pointx, pointy, prevx, prevy) {
        // splite the value of data-equation attribute with '='
        let eq = JS$1.select('#' + elem).getAttribute('data-equation').split('='), a;
        let _this = JS$1.select('#' + elem).getAttribute('type'), str;
        let equation = '';
        let is_correct;
        switch (_this) {
            case "parabola":
                {

                    if (!eq[0].includes('x')) {
                        // find the value of 'a' after calculation
                        a = Math.round(eval((pointy - prevy) / (Math.pow((pointx - prevx), 2))) * 10) / 10;
                        // equation of parabola if region covering the y-axis
                        equation = "a*(x-h)^2+k";
                    } else {
                        // equation of parabola if region covering the x-axis
                        equation = "a*(y-h)^2+k";
                        // find the value of 'a' after calculation	
                        a = eval(pointx - prevy) / (Math.pow((pointy - prevx), 2));
                    }
                    // equation of parabola after substituting the value of 'a', 'h', 'k' in it's general equation
                    let eqn = equation.replace('a', a).replace('h', prevx).replace('k', prevy);
                    // changes the sign of operator according to math formula as (- * - = +), (+ * - = -)
                    //returns the equation of parabola after substituting the value of 'a', 'h', 'k' in it's general equation
                    eqn = eqn.replace(/\\-\\-/g, '+').replace(/\\+\\-/g, '-');
                    return eqn;
                }
            case "sine":
            case "cosine":
                {
                    if (JS$1.select('#' + elem).classList.contains('sine')) {
                        str = eq[1].replace('sin', 'Math.sin').replace('x', '(x/180)*Math.PI'); /* converts 'sin' into 'Math.sin' and 'x' which is in degree converts it into radian */
                    } else if (JS$1.select('#' + elem).classList.contains('cosine')) {
                        str = eq[1].replace('cos', 'Math.cos').replace('x', '(x/180)*Math.PI'); /* converts 'cos' into 'Math.cos' and 'x' which is in degree converts it into radian */
                    }
                    // assign the value 1 to 'a' if the value of 'eq[1].charAt(0)' represents javascript number otherwise returns the value of 'eq[1].charAt(0)' 
                    a = (!(!isNaN(parseFloat(eq[1].charAt(0))) && isFinite(eq[1].charAt(0)))) ? 1 : eq[1].charAt(0);
                    // assign the value of is_correct variable to true or false after calculating the given condition
                    is_correct = (Math.round(eval(str.replace('x', pointx)) * 100 / 100) == pointy &&
                        Math.round(eval(str.replace('x', prevx)) * 100 / 100) == prevy &&
                        a == Math.abs(prevy)) ? true : false;
                    // returns the true of false value
                    return is_correct;
                }
            case "line":
                {
                    // assign the value of is_correct variable to true or false after calculating the given condition
                    is_correct = (Math.round(eval(eq[1].replace('x', pointx))) == Math.round(eval(eq[0].replace('y', pointy))) && Math.round(eval(eq[1].replace('x', prevx))) == Math.round(eval(eq[0].replace('y', prevy)))) ? true : false;
                    //returns the variable is_correct
                    return is_correct;
                }
        }
    };

    // updates the data-userans attribute value of graph board container after removing the point on which clicked for delete
    GRAPH.updateDeleteAttrs = function (elem, point) {
        let ans = JS$1.select('#' + elem).getAttribute('data-userans').split('|'), val = [];
        switch (JS$1.select('#' + elem).getAttribute('type')) {
            case "point":
            case "circle":
                for (let index = 0; index < ans.length; index++) {
                    if (ans[index] != point) {
                        val.push(ans[index]);
                    }
                }
                break;
            case "segment":
            case "ray":
            case "vector":
            case "sine":
            case "cosine":
            case "line":
            case "parabola":
                if (point != null) {
                    let sub_point = point.split('|');
                    val = ans.filter( function(element) { return !this.has(element) }, new Set(sub_point) );
                }
                break;
        }
        /* sets the value of val array to 'data-userans' attribute of graph board container after joining it into string with '|' separator */
        JS$1.select('#' + elem).setAttribute('data-userans', val.join('|'));
    };

    // updates the 'data-userans' atrribute of the graph board container
    GRAPH.updateAttrsPreview = function (elem, point, isUpdate) {
        // contains the value of 'data-userans' attribute of graph board container
        let userans = JS$1.select('#' + elem).getAttribute('data-userans');
        // contains the value of 'type' attribute of graph board container
        let _this = JS$1.select('#' + elem).getAttribute('type');
        if (typeof point.for != "undefined" && point.for.elType == "circle") {
            let center = point.for.center, cp = center.X() + "," + center.Y();
            if (typeof point.startPosition != "undefined") {
                cp += '/' + point.startPosition;
            }
            // stores the value for set it to 'data-userans' attribute of graph board container
            userans = userans.replace(cp, center.X() + "," + center.Y() + "/" + Math.round(point.for.Radius()));
            // assign the value of variable 'userans' to 'data-userans' attribute of graph board container
            JS$1.select('#' + elem).setAttribute('data-userans', userans);
        } else if (isUpdate) {
            if (JS$1.select('#' + elem).classList.contains('plot')) {
                if (typeof point.for == "undefined") {
                    userans = JS$1.select('#' + elem).getAttribute('data-userans').replace(point.startPosition, point.X() + ',' + point.name);
                } else {
                    userans = JS$1.select('#' + elem).getAttribute('data-userans').replace(point.startPosition, point.for.point2.X() + ',' + point.for.point1.X() + ',' + point.for.name);
                }
            } else {
                // assign the value to variable 'userans' after replacing the value of 'point.startPosition' from 'data-userans' attribute of graph board container with the value of 'point.X()' and 'point.Y()' separated by comma
                userans = JS$1.select('#' + elem).getAttribute('data-userans').replace(point.startPosition, point.X() + ',' + point.Y());
            }
            // assign the value of variable 'userans' to 'data-userans' attribute of graph board container
            JS$1.select('#' + elem).setAttribute('data-userans', userans);
            switch (_this) {
                case "line":
                case "sine":
                case "cosine":
                    {
                        let is_false = 0, prev = null;
                        let user_ans = userans.split('|');
                        for (let index = 0; index < user_ans.length; index++) {
                            let key = user_ans[index].split(',');
                            if (prev == null) {
                                prev = key;
                            } else {
                                let is_correct = GRAPH.getEquationPreview(elem, key[0], key[1], prev[0], prev[1]);
                                if (is_correct == false) {
                                    is_false++;
                                }
                                prev = null;
                            }
                        }
                        GRAPH.sinfo = (is_false > 0) ? false : true;
                    }

            }
        }
        if (typeof point.for == "undefined" || point.for.elType != "circle") {
            userans = userans.split('|').filter((el) => {return el});
            if (JS$1.select('#' + elem).classList.contains('plot')) {
                if (typeof point.for == "undefined") {
                    userans.push(point.X() + ',' + point.name);
                } else {
                    userans.push(point.for.point2.X() + ',' + point.for.point1.X() + ',' + point.for.name);
                }
            } else {
                // push the x and y co-ordinate value in userans array sepaated with comma
                userans.push(point.X() + ',' + point.Y());
            }
            if (typeof isUpdate == "undefined") {
                // assign the value of array 'userans' to 'data-userans' attribute of graph board container after joining it with '|'
                JS$1.select('#' + elem).setAttribute('data-userans', userans.join('|'));
                if (JS$1.select('#' + elem).classList.contains('polygon')) {
                    if (point.board.points.length == 0) {
                        JS$1.select('#' + elem).setAttribute('data-userans', GRAPH.getUnique(JS$1.select('#' + elem).getAttribute('data-userans').split('|')).join('|'));
                    }
                }
            }
        }
    };

    // for getting the unique data
    GRAPH.getUnique = function(array) {
        let unique = array.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
        return unique;
    };

    // returns Correct or Incorrect after matching the answer 
    GRAPH.checkAns = function (mid) {
        // used to create user answer xml
        GRAPH.userAnsXML = "<smans type='20'>\n";
        GRAPH.result = true;	// There is pass False value by Abhishek Kumar 9th april 2019
        // finds the closest grap board container inside preview container

        let elements = JS$1.selectAll('#mathmain > .drag-resize');
        for (let index = 0; index < elements.length; index++) {
            GRAPH.userAnsXML = GRAPH.checkChildAnswer(mid, elements[index]);
        }
        GRAPH.userAnsXML += "</smans>";
        
        if (window.inNative) {
            // used for mobile team
            window.getHeight();
            window.postMessage(JSON.stringify({
                userAnswers: GRAPH.userAnsXML,
                inNativeIsCorrect: GRAPH.result
            }), '*');
        }

        return {uXml: GRAPH.userAnsXML, ans: GRAPH.result};
    };

    // returns the user answer xml and defines the GRAPH.result value according to matching the answer that helps chackAns method to show the Correct or Incorrect on the basis of variable GRAPH.result
    GRAPH.checkChildAnswer = function (mid, pElem) {
        let _this = JS$1.select(pElem).getAttribute('type'), ansKey, userKey, index_no;
        switch (_this) {
            case "plot":
            case "association":
            case "point":
            case "segment":
                {
                    // converts the value of data-anskey attribute of graph board container into array and sorts it then again converts it into string
                    ansKey = JS$1.select(pElem).getAttribute('data-anskey').split('|').sort().join('|');
                    // converts the value of data-userans attribute of graph board container into array and sorts it then again converts it into string
                    userKey = JS$1.select(pElem).getAttribute('data-userans').split('|').sort().join('|');
                    if (ansKey != userKey) {
                        // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                        GRAPH.result = false;
                    }
                    break;
                }
            case "circle":
            case "vector":
            case "ray": {
                if (JS$1.select(pElem).getAttribute("data-anskey") != JS$1.select(pElem).getAttribute("data-userans")) {
                    /* assign the value false to variable GRAPH.result if value of attributes data-anskey and data-userans are not same */
                    GRAPH.result = false;
                }
                break;
            }
            /* these all 2 values can be assign with fist case where the answer checking done for 'plot', point, segment and association */
            case "sine":
            case "cosine": {
                // converts the value of data-anskey attribute of graph board container into array and sorts it then again converts it into string
                ansKey = JS$1.select(pElem).getAttribute('data-anskey').split('|').sort().join('|');
                // converts the value of data-userans attribute of graph board container into array and sorts it then again converts it into string
                userKey = JS$1.select(pElem).getAttribute('data-userans').split('|').sort().join('|');
                if (ansKey != userKey) {
                    // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                    GRAPH.result = false;
                }
                break;
            }
            case "parabola": {
                // converts the value of data-anskey attribute of graph board container into array and sorts it then again converts it into string
                ansKey = JS$1.select(pElem).getAttribute('data-anskey').split('|').filter(function (element) { return element != '' });
                // converts the value of data-userans attribute of graph board container into array and sorts it then again converts it into string
                userKey = JS$1.select(pElem).getAttribute('data-userans').split('|').filter(function (element) { return element != '' });
                if (ansKey.length == userKey.length) {
                    for (index_no = 0; index_no < userKey.length; index_no += 2) {
                        let question_index_no = ansKey.indexOf(userKey[index_no]);
                        if (question_index_no > -1) {
                            // finding value of a using equation 'f(x) = a(x-h)^2 + k' by substituting the value of 'f(x)', 'h', 'k' and 'x' where 'h' is the x-axis co-ordinate of vertix, 'k' is the y-axis co-ordinate of vertix, 'f(x)' is the y-axis co-ordinate which lies on the curve of parabola other than vertix, 'x' is the x-axis co-ordinate which lies on the curve of parabola other than vertix
                            let distancefromvertix_to_foci = (ansKey[question_index_no + 1].split(',')[1] - ansKey[question_index_no].split(',')[1]) / ((ansKey[question_index_no + 1].split(',')[0] - ansKey[question_index_no].split(',')[0]) * (ansKey[question_index_no + 1].split(',')[0] - ansKey[question_index_no].split(',')[0]));
                            let distancefromvertix_to_foci_ansKey = (userKey[index_no + 1].split(',')[1] - userKey[index_no].split(',')[1]) / ((userKey[index_no + 1].split(',')[0] - userKey[index_no].split(',')[0]) * (userKey[index_no + 1].split(',')[0] - userKey[index_no].split(',')[0]));
                            if (distancefromvertix_to_foci != distancefromvertix_to_foci_ansKey) {
                                // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                                GRAPH.result = false;
                            } else {
                                GRAPH.result = true;
                            }
                        } else {
                            // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                            GRAPH.result = false;
                        }
                    }
                } else {
                    // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                    GRAPH.result = false;
                }
                break;
            }
            case "line": {
                try {
                    // converts the value of data-anskey attribute of graph board container into array
                    ansKey = JS$1.select(pElem).getAttribute('data-anskey').split('|');
                    // converts the value of data-userans attribute of graph board container into array
                    userKey = JS$1.select(pElem).getAttribute('data-userans').split('|');
                    if (userKey.length == 0 || userKey.length == 1) {
                        // assign the value false to variable GRAPH.result if value of ansKey.length or userKey.length is equals to zero means line is not draw either during question creation or during provide the answer
                        GRAPH.result = false;
                        break;
                    } else {
                        index_no = 0;
                        let index_no1 = 0;
                        let count_data = 0;
                        let not_match = 0;
                        while (index_no < ansKey.length) {
                            count_data = 0;
                            while (index_no1 < userKey.length) {
                                let left1, left2, right1, right2;
                                /* left1 is the left hand side value and right1 is the right hand side value after putting the values of user answer in standard line equation '(y-y1)(x2-x1) = (y2-y1)(x-x1)', where y and x are the values of first point's x and y value of line created at the time of question creation and x1, y1, x2, y2 are the points draw by user to create the line graph  */
                                left1 = (((userKey[index_no1].split(',')[1]) - (ansKey[index_no].split(',')[1])) * ((ansKey[index_no + 1].split(',')[0]) - (ansKey[index_no].split(',')[0])));
                                right1 = (((userKey[index_no1].split(',')[0]) - (ansKey[index_no].split(',')[0])) * ((ansKey[index_no + 1].split(',')[1]) - (ansKey[index_no].split(',')[1])));
                                /* left2 is the left hand side value and right2 is the right hand side value after putting the values of user answer in standard line equation '(y-y1)(x2-x1) = (y2-y1)(x-x1)', where y and x are the values of second point's x and y value of line created at the time of question creation and x1, y1, x2, y2 are the points draw by user to create the line graph  */
                                left2 = (((userKey[index_no1 + 1].split(',')[1]) - (ansKey[index_no].split(',')[1])) * ((ansKey[index_no + 1].split(',')[0]) - (ansKey[index_no].split(',')[0])));
                                right2 = (((userKey[index_no1 + 1].split(',')[0]) - (ansKey[index_no].split(',')[0])) * ((ansKey[index_no + 1].split(',')[1]) - (ansKey[index_no].split(',')[1])));
                                if ((parseFloat(left1) == parseFloat(right1)) && (parseFloat(left2) == parseFloat(right2))) {
                                    // assign the value to this variable will help to return the value of variable GRAPH.result
                                    count_data += 1;
                                } else {
                                    GRAPH.result = false;
                                    not_match = 1;
                                    break;
                                }
                                // increase the value 2 more in there previous value
                                index_no1 += 2;
                            }
                            if (not_match == 1) {
                                break;
                            }
                            // increase the value 2 more in there previous value
                            index_no += 2;
                        }
                        if (count_data == 0) {
                            // assign the value false to variable GRAPH.result if value of count_data is equals to 0, means data not matched
                            GRAPH.result = false;
                        } else {
                            // assign the value true to variable GRAPH.result if value of count_data is not equals to 0, means data matched
                            GRAPH.result = true;
                        }
                    }
                } catch (e) {
                    console.warn(e);
                }
                break;
            }
            case "polygon":
                {
                    /* converts the value of data-anskey attribute of graph board container into array and sorts it then removes the duplicate value then again converts it into string */
                    ansKey = GRAPH.getUnique(JS$1.select(pElem).getAttribute('data-anskey').split('|').sort()).join('|');
                    /* converts the value of data-userans attribute of graph board container into array and sorts it   then removes the duplicate value then again converts it into string */
                    userKey = GRAPH.getUnique(JS$1.select(pElem).getAttribute('data-userans').split('|').sort()).join('|');
                    if (ansKey != userKey) {
                        // assign the value false to variable GRAPH.result if value of ansKey and userKey is not same
                        GRAPH.result = false;
                    }
                    break;
                }
        }
        // assign the value into GRAPH.userAnsXML with it's pre value and creates user answer xml
        GRAPH.userAnsXML += "<div id='" + JS$1.select(pElem).getAttribute('id') + "' userAns='" + JS$1.select(pElem).getAttribute('data-userans') + "'></div>\n";
        // returns the user answer xml
        return GRAPH.userAnsXML;
    };

    /* used to call the method 'showchildansdrag' for every graph and passed arguments are id of preview container, id of graph board container, andType have 2 values 'c' for correct answer and 'u' for user answer, review have 2 values '0' and '1' */
    GRAPH.showansdrag = function (mid, ansType, review) {
        if (typeof review === "undefined") {
            review = 0;
        }
        let elements = JS$1.selectAll('#mathmain > .drag-resize');

        for (let index = 0; index < elements.length; index++) {
            GRAPH.showchildansdrag(mid, elements[index], ansType, review);
        }
    };

    /* used for show the stroke and fill color of point and graph according to the value of 'data-userans'  attribute of graph board container and argument 'review', Also update the graph board and draw the graph */
    GRAPH.showchildansdrag = function (mid, pElem, ansType, review) {
        if (review == 1) {
            // assign reference of the created board
            board = GRAPH.initBoardPreview(mid, pElem);
            // disabled the 'li' element and removes the class 'btn_active' and add the class 'btn_active_disabled' to it that exist inside the element have class 'footer_toolbox' in preview container
            let footer_li = JS$1.find(mid, '.footer_toolbox li', 'all');
            if (footer_li.length > 0) {
                footer_li.forEach(function(element) {
                    element.disabled = true;
                    element.classList.add('btn_active_disabled');
                    element.classList.remove('btn_active');
                });
            }
        }
        // defines the name of graph
        let _this = JS$1.select(pElem).getAttribute('type');
        // defines the id of the graph board container
        let elem = JS$1.select(pElem).getAttribute('id'), cans;
        if (JS$1.select(pElem).getAttribute("data-anskey") != '') {
            // defines the array of correct answer points
            cans = JS$1.select(pElem).getAttribute("data-anskey").split('|');
        }
        // defines the array of user answer points
        let uans = JS$1.select(pElem).getAttribute("data-userans").split('|');
        let is_point, k;
        if (ansType == "c") {
            if (JS$1.select('#' + elem).classList.contains('association')) {
                /* it is discarded by Pete sir */
                for (let index = 0; index < cans.length; index++) {
                    k = cans[index].split(',');
                    let text = GRAPH.updateNumberline(mid, elem, k[0], k[1], k[2]);
                    text.setAttribute({ 'cssClass': "cursor-down-active", 'highlightCssClass': "cursor-down-active", 'fixed': true });
                }
            } else if (JS$1.select('#' + elem).classList.contains('plot')) {
                is_point = 1;
                for (let index = 0; index < cans.length; index++) {
                    let point;
                    if (cans[index].indexOf(',') == -1) {
                        // creates the instance of point
                        point = board.create('point', [parseInt(cans[index]), is_point], { 'name': "", 'fixed': true });
                        // update and draw the point on the graph board and according to point also draw the graph
                        GRAPH.updateAndDrawPreview(mid, elem, point);
                    } else {
                        k = cans[index].split(',');
                        // creates the instance of point
                        point = board.create('point', [parseInt(k[0]), is_point], { 'name': "", 'fixed': true });
                        point.Xjc = parseInt(k[1]);
                        // update and draw the point on the graph board and according to point also draw the graph
                        GRAPH.updateAndDrawPreview(mid, elem, point, k[2]);
                    }
                    is_point++;
                }
            } else {
                for (let index = 0; index < cans.length; index++) {
                    // creates the array of x and y coordinates of the point
                    k = cans[index].split(',');
                    // creates the instance of the point
                    let point = board.create('point', [parseInt(k[0]), parseInt(k[1])], { 'name': "", 'fixed': true, 'strokeColor': "#0000FF", 'fillColor': "#0000FF" });
                    if (! JS$1.select(pElem).classList.contains('circle')) {
                        // update and draw the graph on graph board according to their type
                        GRAPH.updateAndDrawPreview(mid, elem, point, cans);
                    } else {
                        // draw the circle on preview graph board
                        GRAPH.drawCirclePreview(mid, elem, cans[index]);
                    }
                }
            }
            // sets the border color of preview container to #0000ff
            JS$1.setCss(mid, {
                border: "1px solid #0000ff"
            });
        } else if (ansType == "u") {
            let is_false = 0, is_correctln = null, is_flag = false;
            is_point = 1;
            if (!JS$1.select('#' + elem).classList.contains('association')) {
                for (let index = 0; index < uans.length; index++) {
                    let val = uans[index];
                    if (JS$1.select('#' + elem).classList.contains('plot')) {
                        if (JS$1.select(pElem).getAttribute("data-userans") != '') {
                            if (val.indexOf(',') == -1) {
                                // creates the instance of point
                                point = board.create('point', [parseInt(val), is_point], { 'name': "" });
                                // update and draw the point on the board
                                GRAPH.updateAndDrawPreview(mid, elem, point);
                            } else {
                                // array of x and y coordinates
                                k = val.split(',');
                                // creates the instance of point
                                point = board.create('point', [parseInt(k[0]), is_point], { 'name': "" });
                                // not clear what is this
                                point.Xjc = parseInt(k[1]);
                                // update and draw the point on the board
                                GRAPH.updateAndDrawPreview(mid, elem, point, k[2]);
                            }
                            is_point++;
                        }
                    } else {
                        // array of x and y coordinates
                        k = val.split(',');
                        // creates the instance of point
                        point = board.create('point', [parseInt(k[0]), parseInt(k[1])], { 'name': "" });
                        if (JS$1.select(pElem).getAttribute("data-userans") != '') {
                            if (! JS$1.select(pElem).classList.contains('circle')) {
                                // update and draw the point on the board
                                GRAPH.updateAndDrawPreview(mid, elem, point, uans);
                            } else {
                                // draw the circle on the board
                                GRAPH.drawCirclePreview(mid, elem, val);
                            }
                        }
                    }
                    if (typeof review != "undefined" && review == 1 && JS$1.select(pElem).getAttribute("data-userans") != '') {
                        point.setAttribute({ 'fixed': true });
                        switch (_this) {
                            case "point":
                                {
                                    if ( cans.includes(val) ) {
                                        /* if any value of uans array exist in cans array then sets the fill and stroke color of that point to #00FF00 */
                                        point.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                                    } else {
                                        /* if any value of uans array does not exist in cans array then sets the fill and stroke color of that point to #FF0000 */
                                        point.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                                        // iincrease the value of is_false variable
                                        is_false++;
                                    }
                                    break;
                                }
                            case "circle":
                                {
                                    if (typeof point.for != "undefined") {
                                        /* assign the value of is_flag variable to 'true' if the value of uans at perticular index exist in cans array otherwise false */
                                        is_flag = (cans.includes(val)) ? true : false;
                                        /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                        is_false = GRAPH.drawelem(elem, is_flag, is_false);
                                    }
                                    break;
                                }
                            case "plot":
                                {
                                    /* assign the value of is_flag variable to 'true' if the value of uans at perticular index exist in cans array otherwise false */
                                    is_flag = (cans.includes(val)) ? true : false;
                                    /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                    is_false = GRAPH.drawelem(elem, is_flag, is_false);
                                    break;
                                }
                            case "line":
                            case "parabola":
                            case "sine":
                            case "cosine":
                                {
                                    if (typeof point.for == "undefined") {
                                        // defines the initial point of the graph
                                        prevPoint = point.board.prevPoint;
                                    } else {
                                        /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                        is_false = GRAPH.drawelem(elem, GRAPH.sinfo, is_false);
                                    }
                                    break;
                                }
                            case "segment":
                            case "vector":
                            case "ray":
                                {
                                    let is_correct;
                                    if (JS$1.select(pElem).classList.contains('segment') || JS$1.select(pElem).classList.contains('polygon')) {
                                        /* assign the value of is_correct variable to 'true' if the value of uans at perticular index exist in cans array otherwise false */
                                        is_correct = (cans.includes(val)) ? true : false;
                                    }
                                    if (JS$1.select(pElem).classList.contains('ray') || JS$1.select(pElem).classList.contains('vector')) {
                                        /* assign the value of is_correct variable to 'true' if the index of any value in uans array is same for index of that perticular value in cans array otherwise false */
                                        is_correct = (cans.indexOf(val) == uans.indexOf(val)) ? true : false;
                                    }
                                    if (typeof point.for == "undefined") {
                                        // reference of initial point on the board
                                        prevPoint = point.board.prevPoint;
                                        is_correctln = is_correct;
                                    } else {
                                        // assign the value of is_flag variable according to the value of 'is_correctln' and 'is_correct' variables
                                        is_flag = (is_correctln && is_correct) ? true : false;
                                        /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                        is_false = GRAPH.drawelem(elem, is_flag, is_false);
                                    }
                                    break;
                                }
                            case "polygon":
                                {   
                                    let shallow_cans = [...cans];
                                    let shallow_uans = [...uans];

                                    /* assign the value of is_flag according to the value of correct answer and your answer after spliting the value of these variables with '|' and sorting it*/
                                    is_flag = (shallow_cans.sort().join('|') == shallow_uans.sort().join('|')) ? true : false;
                                    /* calls GRAPH.drawelem for value of is_false after setting the stroke and color of the point */
                                    is_false = GRAPH.drawelem(elem, is_flag, is_false);
                                    break;
                                }

                        }
                        /* change the border color of the preview container according to correct or incorrect */
                        GRAPH.setCorrectAns(mid, is_false);
                    } else if (typeof review != "undefined" && review == 1 && JS$1.select(pElem).getAttribute("data-userans") == '') {
                        /* shows the border color of the preview container in red color */
                        JS$1.setCss(mid, {
                            border: "1px solid #ff0000"
                        });
                    }
                }
            } else {
                /* It is discarded by Pete sir */
                for (let index = 0; index < uans.length; index++) {
                    let val = uans[index];
                    k = val.split(',');
                    let text = GRAPH.updateNumberline(mid, elem, parseFloat(k[0]), parseFloat(k[1]), k[2]);
                    if (typeof review != "undefined" && review == 1) {
                        if (k[1] == '0.4') {
                            if (cans.includes(val)) {
                                text.setAttribute({ 'cssClass': "cursor-down-correct", 'highlightcssClass': "cursor-down-correct", 'fixed': true });
                            } else {
                                text.setAttribute({ 'cssClass': "cursor-down-incorrect", 'highlightcssClass': "cursor-down-incorrect", 'fixed': true });
                                is_false++;
                            }
                        } else {
                            text.setAttribute({ 'fixed': true });
                            is_false++;
                        }
                        GRAPH.setCorrectAns(mid, is_false);
                    }
                }
            }
        }
    };

    // change the border color of the preview container according tho the answer matched
    GRAPH.setCorrectAns = function (mid, is_false) {
        if (is_false == 0) {
            // set the border color of preview container to show that answer is correct
            JS$1.setCss(mid, {
                border: "1px solid #00ff00"
            });
            // check the element have id: answer
            JS$1.select("#answer").checked = true;
            // sets the attribute 'as' value 1 of preview container
            JS$1.select(mid).setAttribute('as', 1);
        } else {
            // set the border color of preview container to show that answer is incorrect
            JS$1.setCss(mid, {
                border: "1px solid #ff0000"
            });
            // uncheck the element have id: answer
            JS$1.select("#answer").checked = false;
            // sets the attribute 'as' value -1 of preview container
            JS$1.select(mid).setAttribute('as', -1);
        }
    };

    // sets the fill and stroke color of point and returns the value of variable is_flase 
    GRAPH.drawelem = function (elem, is_flag, is_false) {
        if (JS$1.select('#' + elem).classList.contains('plot')) {
            if (is_flag == true) {
                if (typeof point.for == "undefined") {
                    // sets the stroke and fill color of point to #00FF00
                    point.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                } else {
                    // sets the stroke color of point to #00FF00
                    point.for.setAttribute({ 'strokeColor': "#00FF00" });
                    // sets the stroke and fill color of the first point to #00FF00
                    point.for.point1.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                    // sets the stroke and fill color of the second point to #00FF00
                    point.for.point2.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                }
            } else {
                if (typeof point.for == "undefined") {
                    // sets the stroke and fill color of point to #FF0000
                    point.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                } else {
                    // sets the stroke color of point to #FF0000
                    point.for.setAttribute({ 'strokeColor': "#FF0000" });
                    // sets the stroke and fill color of the first point to #FF0000
                    point.for.point1.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                    // sets the stroke and fill color of the second point to #FF0000
                    point.for.point2.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                }
                is_false++;
            }
        } else if (JS$1.select('#' + elem).classList.contains('polygon')) {
            let i;
            if (is_flag == true) {
                if (typeof point.for != "undefined") {
                    for (i = 0; i < point.for.vertices.length; i++) {
                        // sets the stroke and fill color of the vertics to #00FF00
                        point.for.vertices[i].setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                    }
                }
            } else {
                if (typeof point.for != "undefined") {
                    for (i = 0; i < point.for.vertices.length; i++) {
                        // sets the stroke and fill color of the vertics to #FF0000
                        point.for.vertices[i].setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                    }
                    // fills the color of the polygon to #FF0000 with opacity 0.5
                    point.for.setAttribute({ 'fillColor': "#FF0000", 'opacity': 0.5 });
                }
                is_false++;
            }
        } else {
            if (is_flag == true) {
                /* sets the stroke and fill color of the last point to #00FF00 if the graph board container have not class polygon or plot and value of is_flag is true */
                point.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                /* sets the stroke and fill color of the initial point to #00FF00 if the graph board container have not class polygon or plot and value of is_flag is true */
                prevPoint.setAttribute({ 'strokeColor': "#00FF00", 'fillColor': "#00FF00" });
                /* sets the stroke color to #00FF00 if the graph board container have not class polygon or plot and value of is_flag is true */
                point.for.setAttribute({ 'strokeColor': "#00FF00" });
            } else {
                /* sets the stroke and fill color of the last point to #FF0000 if the graph board container have not class polygon or plot and value of is_flag is false */
                point.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                /* sets the stroke and fill color of the initial point to #FF0000 if the graph board container have not class polygon or plot and value of is_flag is false */
                prevPoint.setAttribute({ 'strokeColor': "#FF0000", 'fillColor': "#FF0000" });
                /* sets the stroke color to #FF0000 if the graph board container have not class polygon or plot and value of is_flag is false */
                point.for.setAttribute({ 'strokeColor': "#FF0000" });
                is_false++;
            }

        }
        // returns the value of variable is_false
        return is_false;
    };

    // function for draw the circle on preview side
    GRAPH.drawCirclePreview = function (mid, elem, val) {
        // split the data combined of center and radius of the circle separated by '/'
        let key = val.split('/');

        for (let index = 0; index < key.length; index++) {
            let n = key[0].split(','), point;
            if (key[index].indexOf(',') != -1) {
                // create instance of point
                point = board.create('point', [parseInt(n[0]), parseInt(n[1])], { 'name': "" });
                //assign the center point
                prevPoint = point;
            } else {
                let next = (parseInt(n[0]) - parseInt(key[1]));
                // creates the instance of point
                point = board.create('point', [parseInt(next), parseInt(n[1])], { 'name': "" });
            }
            // update and draw the graph on graph board according to the type and point on the graph board
            GRAPH.updateAndDrawPreview(mid, elem, point);
        }
    };

    /* ajax based code */
    GRAPH.labbinded = true;

    // shows the UI indicting correct or incorrect and correct answer and your answer button and not allowed to perform the task if the value of its  argument is not equals to undefined
    GRAPH.modeOn = function (modeType) {
        // adds the class 'h' to the element have class 'test' or 'review'. Basically hides the correct and your answer buttons
        JS$1.selectAll('.test, .review', 'addClass', 'h');
        if (modeType) {
            // shows the correct and your answer buttons
            JS$1.selectAll('.review', 'removeClass', 'h');
            /* prevents the user to perform the task when review mode is on and changes the color of button which is currently clicked */
            GRAPH.unBindLab();
            GRAPH.showansdrag(GRAPH.ajax_eId, 'u', 1);
        } else {
            // removes the class 'h' from element have class 'test'
            JS$1.selectAll('.test', 'removeClass', 'h');
            // allows the user to perform the task when review mode is off
            GRAPH.bindLab();
            // shows the user answer which was performed by the user
            GRAPH.showansdrag(GRAPH.ajax_eId, 'u');
            // sets the border color of preview container
            JS$1.setCss(GRAPH.ajax_eId).style.border = '1px solid #CCCCCC';
        }
    };


    // allows the user to perform the task when review mode is off
    GRAPH.bindLab = function () {
        // assign the value true to variable GRAPH.labbinded
        GRAPH.labbinded = true;
        // plot the graph on the graph board with some binded events
        GRAPH.readyThis(GRAPH.ajax_eId);
        // shows delete button when review mode is off
        JS$1.find(GRAPH.ajax_eId, '.delElem').removeAttribute('style');
        // shows ada button when review mode is off
        JS$1.find(GRAPH.ajax_eId, '#ADA_button').style.display = 'block';
    };


    // prevents the user to perform the task when review mode is on and changes the color of button which is currently clicked
    GRAPH.unBindLab = function () {
        // assign the value false to variable GRAPH.labbinded
        GRAPH.labbinded = false;
        // hides delete button when review mode is on
        JS$1.find(GRAPH.ajax_eId, '.delElem').style.display = 'none';
        // hides ada button when review mode is on
        JS$1.find(GRAPH.ajax_eId, '#ADA_button').style.display = 'none';
    };

    /* clsSMGraph\GraphPreview.svelte generated by Svelte v3.40.2 */
    const file$1 = "clsSMGraph\\GraphPreview.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-e5vip7", "#graph_modal.svelte-e5vip7 .modal-body.svelte-e5vip7{max-height:350px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGhQcmV2aWV3LnN2ZWx0ZSIsIm1hcHBpbmdzIjoiQUEyaUJJLDBCQUFZLENBQUMsV0FBVyxjQUFDLENBQUMsQUFDdEIsVUFBVSxDQUFFLEtBQUssQUFDckIsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJHcmFwaFByZXZpZXcuc3ZlbHRlIl19 */");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (414:8) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let div_id_value;
    	let div_data_userans_value;
    	let div_data_anskey_value;
    	let div_type_value;
    	let div_class_value;
    	let div_data_xtickdistance_value;
    	let div_data_ytickdistance_value;
    	let div_data_xaxis_value;
    	let div_data_yaxis_value;
    	let div_data_snapsize_value;
    	let div_data_equation_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", div_id_value = /*state*/ ctx[1].QXML._id + "Preview");
    			attr_dev(div, "data-userans", div_data_userans_value = /*state*/ ctx[1].userAns_data);
    			attr_dev(div, "data-anskey", div_data_anskey_value = /*state*/ ctx[1].QXML._anskey);
    			attr_dev(div, "type", div_type_value = /*state*/ ctx[1].QXML._type);
    			attr_dev(div, "class", div_class_value = "drag-resize dropable " + /*state*/ ctx[1].QXML._type);
    			attr_dev(div, "data-xtickdistance", div_data_xtickdistance_value = /*state*/ ctx[1].QXML._xtickdistance);
    			attr_dev(div, "data-ytickdistance", div_data_ytickdistance_value = /*state*/ ctx[1].QXML._ytickdistance);
    			attr_dev(div, "data-xaxis", div_data_xaxis_value = /*state*/ ctx[1].QXML._xaxis);
    			attr_dev(div, "data-yaxis", div_data_yaxis_value = /*state*/ ctx[1].QXML._yaxis);
    			attr_dev(div, "data-snapsize", div_data_snapsize_value = /*state*/ ctx[1].QXML._snapsize);
    			attr_dev(div, "data-equation", div_data_equation_value = /*state*/ ctx[1].QXML._equation);
    			set_style(div, "height", /*state*/ ctx[1].QXML._height - 40 + "px");
    			set_style(div, "width", /*state*/ ctx[1].QXML._width + "px");
    			set_style(div, "border", "1px solid #ccc");
    			add_location(div, file$1, 414, 12, 18503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2 && div_id_value !== (div_id_value = /*state*/ ctx[1].QXML._id + "Preview")) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_userans_value !== (div_data_userans_value = /*state*/ ctx[1].userAns_data)) {
    				attr_dev(div, "data-userans", div_data_userans_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_anskey_value !== (div_data_anskey_value = /*state*/ ctx[1].QXML._anskey)) {
    				attr_dev(div, "data-anskey", div_data_anskey_value);
    			}

    			if (dirty & /*state*/ 2 && div_type_value !== (div_type_value = /*state*/ ctx[1].QXML._type)) {
    				attr_dev(div, "type", div_type_value);
    			}

    			if (dirty & /*state*/ 2 && div_class_value !== (div_class_value = "drag-resize dropable " + /*state*/ ctx[1].QXML._type)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_xtickdistance_value !== (div_data_xtickdistance_value = /*state*/ ctx[1].QXML._xtickdistance)) {
    				attr_dev(div, "data-xtickdistance", div_data_xtickdistance_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_ytickdistance_value !== (div_data_ytickdistance_value = /*state*/ ctx[1].QXML._ytickdistance)) {
    				attr_dev(div, "data-ytickdistance", div_data_ytickdistance_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_xaxis_value !== (div_data_xaxis_value = /*state*/ ctx[1].QXML._xaxis)) {
    				attr_dev(div, "data-xaxis", div_data_xaxis_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_yaxis_value !== (div_data_yaxis_value = /*state*/ ctx[1].QXML._yaxis)) {
    				attr_dev(div, "data-yaxis", div_data_yaxis_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_snapsize_value !== (div_data_snapsize_value = /*state*/ ctx[1].QXML._snapsize)) {
    				attr_dev(div, "data-snapsize", div_data_snapsize_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_equation_value !== (div_data_equation_value = /*state*/ ctx[1].QXML._equation)) {
    				attr_dev(div, "data-equation", div_data_equation_value);
    			}

    			if (dirty & /*state*/ 2) {
    				set_style(div, "height", /*state*/ ctx[1].QXML._height - 40 + "px");
    			}

    			if (dirty & /*state*/ 2) {
    				set_style(div, "width", /*state*/ ctx[1].QXML._width + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(414:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (394:8) {#if state.QXML._reflection}
    function create_if_block_3(ctx) {
    	let div;
    	let div_id_value;
    	let div_data_userans_value;
    	let div_data_anskey_value;
    	let div_type_value;
    	let div_class_value;
    	let div_data_xtickdistance_value;
    	let div_data_ytickdistance_value;
    	let div_data_xaxis_value;
    	let div_data_yaxis_value;
    	let div_data_snapsize_value;
    	let div_data_equation_value;
    	let div_data_reflection_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", div_id_value = /*state*/ ctx[1].QXML._id + "Preview");
    			attr_dev(div, "data-userans", div_data_userans_value = /*state*/ ctx[1].userAns_data);
    			attr_dev(div, "data-anskey", div_data_anskey_value = /*state*/ ctx[1].QXML._anskey);
    			attr_dev(div, "type", div_type_value = /*state*/ ctx[1].QXML._type);
    			attr_dev(div, "class", div_class_value = "drag-resize dropable " + /*state*/ ctx[1].QXML._type);
    			attr_dev(div, "data-xtickdistance", div_data_xtickdistance_value = /*state*/ ctx[1].QXML._xtickdistance);
    			attr_dev(div, "data-ytickdistance", div_data_ytickdistance_value = /*state*/ ctx[1].QXML._ytickdistance);
    			attr_dev(div, "data-xaxis", div_data_xaxis_value = /*state*/ ctx[1].QXML._xaxis);
    			attr_dev(div, "data-yaxis", div_data_yaxis_value = /*state*/ ctx[1].QXML._yaxis);
    			attr_dev(div, "data-snapsize", div_data_snapsize_value = /*state*/ ctx[1].QXML._snapsize);
    			attr_dev(div, "data-equation", div_data_equation_value = /*state*/ ctx[1].QXML._equation);
    			attr_dev(div, "data-reflection", div_data_reflection_value = /*state*/ ctx[1].QXML._reflection);
    			set_style(div, "height", /*state*/ ctx[1].QXML._height - 40 + "px");
    			set_style(div, "width", /*state*/ ctx[1].QXML._width + "px");
    			set_style(div, "border", "1px solid #ccc");
    			add_location(div, file$1, 394, 12, 17590);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2 && div_id_value !== (div_id_value = /*state*/ ctx[1].QXML._id + "Preview")) {
    				attr_dev(div, "id", div_id_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_userans_value !== (div_data_userans_value = /*state*/ ctx[1].userAns_data)) {
    				attr_dev(div, "data-userans", div_data_userans_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_anskey_value !== (div_data_anskey_value = /*state*/ ctx[1].QXML._anskey)) {
    				attr_dev(div, "data-anskey", div_data_anskey_value);
    			}

    			if (dirty & /*state*/ 2 && div_type_value !== (div_type_value = /*state*/ ctx[1].QXML._type)) {
    				attr_dev(div, "type", div_type_value);
    			}

    			if (dirty & /*state*/ 2 && div_class_value !== (div_class_value = "drag-resize dropable " + /*state*/ ctx[1].QXML._type)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_xtickdistance_value !== (div_data_xtickdistance_value = /*state*/ ctx[1].QXML._xtickdistance)) {
    				attr_dev(div, "data-xtickdistance", div_data_xtickdistance_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_ytickdistance_value !== (div_data_ytickdistance_value = /*state*/ ctx[1].QXML._ytickdistance)) {
    				attr_dev(div, "data-ytickdistance", div_data_ytickdistance_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_xaxis_value !== (div_data_xaxis_value = /*state*/ ctx[1].QXML._xaxis)) {
    				attr_dev(div, "data-xaxis", div_data_xaxis_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_yaxis_value !== (div_data_yaxis_value = /*state*/ ctx[1].QXML._yaxis)) {
    				attr_dev(div, "data-yaxis", div_data_yaxis_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_snapsize_value !== (div_data_snapsize_value = /*state*/ ctx[1].QXML._snapsize)) {
    				attr_dev(div, "data-snapsize", div_data_snapsize_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_equation_value !== (div_data_equation_value = /*state*/ ctx[1].QXML._equation)) {
    				attr_dev(div, "data-equation", div_data_equation_value);
    			}

    			if (dirty & /*state*/ 2 && div_data_reflection_value !== (div_data_reflection_value = /*state*/ ctx[1].QXML._reflection)) {
    				attr_dev(div, "data-reflection", div_data_reflection_value);
    			}

    			if (dirty & /*state*/ 2) {
    				set_style(div, "height", /*state*/ ctx[1].QXML._height - 40 + "px");
    			}

    			if (dirty & /*state*/ 2) {
    				set_style(div, "width", /*state*/ ctx[1].QXML._width + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(394:8) {#if state.QXML._reflection}",
    		ctx
    	});

    	return block;
    }

    // (521:28) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let label0;
    	let t0_value = l.pointx1 + "";
    	let t0;
    	let t1;
    	let input0;
    	let input0_placeholder_value;
    	let t2;
    	let label1;
    	let t3_value = l.pointy1 + "";
    	let t3;
    	let t4;
    	let input1;
    	let input1_placeholder_value;
    	let t5;
    	let label2;
    	let t6_value = l.pointx2 + "";
    	let t6;
    	let t7;
    	let input2;
    	let input2_placeholder_value;
    	let t8;
    	let label3;
    	let t9_value = l.pointy2 + "";
    	let t9;
    	let t10;
    	let input3;
    	let input3_placeholder_value;
    	let t11;
    	let div1_key_value;
    	let div1_id_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			label1 = element("label");
    			t3 = text(t3_value);
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			label2 = element("label");
    			t6 = text(t6_value);
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			label3 = element("label");
    			t9 = text(t9_value);
    			t10 = space();
    			input3 = element("input");
    			t11 = space();
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "resetvalue", "1");
    			attr_dev(input0, "class", "point_x_1 getFieldVal form-control");
    			attr_dev(input0, "id", "setAnsByKey");
    			attr_dev(input0, "placeholder", input0_placeholder_value = l.insert_numeric_data);
    			add_location(input0, file$1, 525, 44, 26244);
    			attr_dev(label0, "class", "text-body");
    			add_location(label0, file$1, 523, 40, 26116);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "resetvalue", "1");
    			attr_dev(input1, "class", "point_y_1 getFieldVal form-control");
    			attr_dev(input1, "id", "setAnsByKey");
    			attr_dev(input1, "placeholder", input1_placeholder_value = l.insert_numeric_data);
    			add_location(input1, file$1, 529, 44, 26602);
    			attr_dev(label1, "class", "ml-2 text-body");
    			add_location(label1, file$1, 527, 40, 26469);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "resetvalue", "1");
    			attr_dev(input2, "class", "point_x_2 getFieldVal form-control");
    			attr_dev(input2, "id", "setAnsByKey");
    			attr_dev(input2, "placeholder", input2_placeholder_value = l.insert_numeric_data);
    			add_location(input2, file$1, 533, 44, 26955);
    			attr_dev(label2, "class", "text-body");
    			add_location(label2, file$1, 531, 40, 26827);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "resetvalue", "1");
    			attr_dev(input3, "class", "point_y_2 getFieldVal form-control");
    			attr_dev(input3, "id", "setAnsByKey");
    			attr_dev(input3, "placeholder", input3_placeholder_value = l.insert_numeric_data);
    			add_location(input3, file$1, 537, 44, 27313);
    			attr_dev(label3, "class", "ml-2 text-body");
    			add_location(label3, file$1, 535, 40, 27180);
    			attr_dev(div0, "class", "col-12 text-center");
    			add_location(div0, file$1, 522, 36, 26042);
    			attr_dev(div1, "class", "row mainDiv mt-4");
    			attr_dev(div1, "key", div1_key_value = "divAllTextBox" + /*data*/ ctx[23].index);
    			attr_dev(div1, "id", div1_id_value = "divAllTextBox" + /*data*/ ctx[23].index);
    			add_location(div1, file$1, 521, 32, 25901);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, t0);
    			append_dev(label0, t1);
    			append_dev(label0, input0);
    			append_dev(div0, t2);
    			append_dev(div0, label1);
    			append_dev(label1, t3);
    			append_dev(label1, t4);
    			append_dev(label1, input1);
    			append_dev(div0, t5);
    			append_dev(div0, label2);
    			append_dev(label2, t6);
    			append_dev(label2, t7);
    			append_dev(label2, input2);
    			append_dev(div0, t8);
    			append_dev(div0, label3);
    			append_dev(label3, t9);
    			append_dev(label3, t10);
    			append_dev(label3, input3);
    			append_dev(div1, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2 && div1_key_value !== (div1_key_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
    				attr_dev(div1, "key", div1_key_value);
    			}

    			if (dirty & /*state*/ 2 && div1_id_value !== (div1_id_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
    				attr_dev(div1, "id", div1_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(521:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (508:97) 
    function create_if_block_2(ctx) {
    	let div1;
    	let div0;
    	let label0;
    	let t0_value = l.pointx + (/*data*/ ctx[23].index + 1) + "";
    	let t0;
    	let t1;
    	let input0;
    	let input0_name_value;
    	let input0_id_value;
    	let input0_placeholder_value;
    	let t2;
    	let label1;
    	let t3_value = l.pointy + (/*data*/ ctx[23].index + 1) + "";
    	let t3;
    	let t4;
    	let input1;
    	let input1_name_value;
    	let input1_id_value;
    	let input1_placeholder_value;
    	let t5;
    	let div1_key_value;
    	let div1_id_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			label1 = element("label");
    			t3 = text(t3_value);
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "resetvalue", "1");
    			attr_dev(input0, "class", "form-control getFieldVal");
    			attr_dev(input0, "name", input0_name_value = "point_" + /*data*/ ctx[23].index);
    			attr_dev(input0, "id", input0_id_value = "x_" + /*data*/ ctx[23].index);
    			attr_dev(input0, "placeholder", input0_placeholder_value = l.insert_numeric_data);
    			add_location(input0, file$1, 512, 44, 25129);
    			attr_dev(label0, "class", "text-body");
    			add_location(label0, file$1, 510, 40, 24983);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "resetvalue", "1");
    			attr_dev(input1, "class", "form-control getFieldVal");
    			attr_dev(input1, "name", input1_name_value = "point_" + /*data*/ ctx[23].index);
    			attr_dev(input1, "id", input1_id_value = "y_" + /*data*/ ctx[23].index);
    			attr_dev(input1, "placeholder", input1_placeholder_value = l.insert_numeric_data);
    			add_location(input1, file$1, 516, 44, 25534);
    			attr_dev(label1, "class", "ml-2 text-body");
    			add_location(label1, file$1, 514, 40, 25383);
    			attr_dev(div0, "class", "col-12 text-center");
    			add_location(div0, file$1, 509, 36, 24909);
    			attr_dev(div1, "class", "row mainDiv mt-2");
    			attr_dev(div1, "key", div1_key_value = "divAllTextBox" + /*data*/ ctx[23].index);
    			attr_dev(div1, "id", div1_id_value = "divAllTextBox" + /*data*/ ctx[23].index);
    			add_location(div1, file$1, 508, 32, 24768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, t0);
    			append_dev(label0, t1);
    			append_dev(label0, input0);
    			append_dev(div0, t2);
    			append_dev(div0, label1);
    			append_dev(label1, t3);
    			append_dev(label1, t4);
    			append_dev(label1, input1);
    			append_dev(div1, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2 && t0_value !== (t0_value = l.pointx + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*state*/ 2 && input0_name_value !== (input0_name_value = "point_" + /*data*/ ctx[23].index)) {
    				attr_dev(input0, "name", input0_name_value);
    			}

    			if (dirty & /*state*/ 2 && input0_id_value !== (input0_id_value = "x_" + /*data*/ ctx[23].index)) {
    				attr_dev(input0, "id", input0_id_value);
    			}

    			if (dirty & /*state*/ 2 && t3_value !== (t3_value = l.pointy + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*state*/ 2 && input1_name_value !== (input1_name_value = "point_" + /*data*/ ctx[23].index)) {
    				attr_dev(input1, "name", input1_name_value);
    			}

    			if (dirty & /*state*/ 2 && input1_id_value !== (input1_id_value = "y_" + /*data*/ ctx[23].index)) {
    				attr_dev(input1, "id", input1_id_value);
    			}

    			if (dirty & /*state*/ 2 && div1_key_value !== (div1_key_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
    				attr_dev(div1, "key", div1_key_value);
    			}

    			if (dirty & /*state*/ 2 && div1_id_value !== (div1_id_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
    				attr_dev(div1, "id", div1_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(508:97) ",
    		ctx
    	});

    	return block;
    }

    // (486:72) 
    function create_if_block_1(ctx) {
    	let div2;
    	let div0;
    	let span;
    	let label0;
    	let t0_value = l.pointx + (/*data*/ ctx[23].index + 1) + "";
    	let t0;
    	let t1;
    	let input0;
    	let input0_placeholder_value;
    	let t2;
    	let label1;
    	let t3_value = l.pointy + (/*data*/ ctx[23].index + 1) + "";
    	let t3;
    	let t4;
    	let input1;
    	let input1_placeholder_value;
    	let t5;
    	let div1;
    	let label2;
    	let t6_value = l.pointx2 + "";
    	let t6;
    	let t7;
    	let input2;
    	let input2_placeholder_value;
    	let t8;
    	let div2_key_value;
    	let div2_id_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			span = element("span");
    			label0 = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			label1 = element("label");
    			t3 = text(t3_value);
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div1 = element("div");
    			label2 = element("label");
    			t6 = text(t6_value);
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "resetvalue", "1");
    			attr_dev(input0, "class", "association_x_point getFieldVal form-control");
    			attr_dev(input0, "placeholder", input0_placeholder_value = l.insert_numeric_data);
    			add_location(input0, file$1, 492, 48, 23464);
    			attr_dev(label0, "class", "ml-2 text-body");
    			add_location(label0, file$1, 489, 44, 23255);
    			attr_dev(input1, "type", "number");
    			input1.value = "0.4";
    			input1.disabled = "disabled";
    			attr_dev(input1, "class", "point_y_1 pe-none getFieldVal form-control");
    			attr_dev(input1, "placeholder", input1_placeholder_value = l.insert_numeric_data);
    			add_location(input1, file$1, 496, 48, 23849);
    			attr_dev(label1, "class", "ml-2 text-body");
    			add_location(label1, file$1, 494, 44, 23690);
    			attr_dev(span, "class", "text-justify");
    			add_location(span, file$1, 488, 40, 23182);
    			attr_dev(div0, "class", "col-12 text-center");
    			add_location(div0, file$1, 487, 36, 23108);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "resetvalue", "1");
    			attr_dev(input2, "class", "association_point getFieldVal form-control");
    			attr_dev(input2, "placeholder", input2_placeholder_value = l.insert_numeric_data);
    			add_location(input2, file$1, 503, 44, 24377);
    			attr_dev(label2, "class", "text-body");
    			add_location(label2, file$1, 501, 40, 24249);
    			attr_dev(div1, "class", "col-12 text-center");
    			add_location(div1, file$1, 500, 36, 24175);
    			attr_dev(div2, "class", "row mainDiv mt-2");
    			attr_dev(div2, "key", div2_key_value = "divAllTextBox" + /*data*/ ctx[23].index);
    			attr_dev(div2, "id", div2_id_value = "divAllTextBox" + /*data*/ ctx[23].index);
    			add_location(div2, file$1, 486, 32, 22967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, span);
    			append_dev(span, label0);
    			append_dev(label0, t0);
    			append_dev(label0, t1);
    			append_dev(label0, input0);
    			append_dev(span, t2);
    			append_dev(span, label1);
    			append_dev(label1, t3);
    			append_dev(label1, t4);
    			append_dev(label1, input1);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, label2);
    			append_dev(label2, t6);
    			append_dev(label2, t7);
    			append_dev(label2, input2);
    			append_dev(div2, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2 && t0_value !== (t0_value = l.pointx + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*state*/ 2 && t3_value !== (t3_value = l.pointy + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*state*/ 2 && div2_key_value !== (div2_key_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
    				attr_dev(div2, "key", div2_key_value);
    			}

    			if (dirty & /*state*/ 2 && div2_id_value !== (div2_id_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
    				attr_dev(div2, "id", div2_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(486:72) ",
    		ctx
    	});

    	return block;
    }

    // (465:28) {#if data.moduleType == 'circle'}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let span;
    	let label0;
    	let t0_value = l.pointx + (/*data*/ ctx[23].index + 1) + "";
    	let t0;
    	let t1;
    	let input0;
    	let input0_placeholder_value;
    	let t2;
    	let label1;
    	let t3_value = l.pointy + (/*data*/ ctx[23].index + 1) + "";
    	let t3;
    	let t4;
    	let input1;
    	let input1_placeholder_value;
    	let t5;
    	let div1;
    	let label2;
    	let t6_value = "Radius " + (/*data*/ ctx[23].index + 1) + "";
    	let t6;
    	let t7;
    	let input2;
    	let input2_placeholder_value;
    	let t8;
    	let div2_key_value;
    	let div2_id_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			span = element("span");
    			label0 = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			label1 = element("label");
    			t3 = text(t3_value);
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div1 = element("div");
    			label2 = element("label");
    			t6 = text(t6_value);
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "resetvalue", "1");
    			attr_dev(input0, "class", "point_x_1 getFieldVal form-control ");
    			attr_dev(input0, "id", "setAnsByKey");
    			attr_dev(input0, "placeholder", input0_placeholder_value = l.insert_numeric_data);
    			add_location(input0, file$1, 470, 48, 21694);
    			attr_dev(label0, "class", "ml-2 text-body");
    			add_location(label0, file$1, 468, 44, 21535);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "resetvalue", "1");
    			attr_dev(input1, "class", "point_y_1 getFieldVal form-control");
    			attr_dev(input1, "placeholder", input1_placeholder_value = l.insert_numeric_data);
    			add_location(input1, file$1, 474, 48, 22087);
    			attr_dev(label1, "class", "ml-2 text-body");
    			add_location(label1, file$1, 472, 44, 21928);
    			attr_dev(span, "class", "text-justify");
    			add_location(span, file$1, 467, 40, 21462);
    			attr_dev(div0, "class", "col-12 text-center");
    			add_location(div0, file$1, 466, 36, 21388);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "resetvalue", "1");
    			attr_dev(input2, "class", "point_x_2 getFieldVal form-control");
    			attr_dev(input2, "placeholder", input2_placeholder_value = l.insert_numeric_data);
    			add_location(input2, file$1, 481, 44, 22609);
    			attr_dev(label2, "class", "text-body");
    			add_location(label2, file$1, 479, 40, 22462);
    			attr_dev(div1, "class", "col-12 text-center");
    			add_location(div1, file$1, 478, 36, 22388);
    			attr_dev(div2, "class", "row mainDiv mt-4");
    			attr_dev(div2, "key", div2_key_value = "divAllTextBox" + /*data*/ ctx[23].index);
    			attr_dev(div2, "id", div2_id_value = "divAllTextBox" + /*data*/ ctx[23].index);
    			add_location(div2, file$1, 465, 32, 21247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, span);
    			append_dev(span, label0);
    			append_dev(label0, t0);
    			append_dev(label0, t1);
    			append_dev(label0, input0);
    			append_dev(span, t2);
    			append_dev(span, label1);
    			append_dev(label1, t3);
    			append_dev(label1, t4);
    			append_dev(label1, input1);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, label2);
    			append_dev(label2, t6);
    			append_dev(label2, t7);
    			append_dev(label2, input2);
    			append_dev(div2, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2 && t0_value !== (t0_value = l.pointx + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*state*/ 2 && t3_value !== (t3_value = l.pointy + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*state*/ 2 && t6_value !== (t6_value = "Radius " + (/*data*/ ctx[23].index + 1) + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*state*/ 2 && div2_key_value !== (div2_key_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
    				attr_dev(div2, "key", div2_key_value);
    			}

    			if (dirty & /*state*/ 2 && div2_id_value !== (div2_id_value = "divAllTextBox" + /*data*/ ctx[23].index)) {
    				attr_dev(div2, "id", div2_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(465:28) {#if data.moduleType == 'circle'}",
    		ctx
    	});

    	return block;
    }

    // (464:24) {#each  state.modalViewLayout as data}
    function create_each_block(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*data*/ ctx[23].moduleType == 'circle') return create_if_block$1;
    		if (/*data*/ ctx[23].moduleType == 'association') return create_if_block_1;
    		if (/*data*/ ctx[23].moduleType == 'point' || /*data*/ ctx[23].moduleType == 'polygon') return create_if_block_2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
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
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(464:24) {#each  state.modalViewLayout as data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div13;
    	let link;
    	let link_href_value;
    	let t0;
    	let center;
    	let itemhelper;
    	let t1;
    	let div2;
    	let div1;
    	let ul0;
    	let li0;
    	let t2_value = /*state*/ ctx[1].QXML._type + "";
    	let t2;
    	let t3;
    	let button0;
    	let span0;
    	let span0_title_value;
    	let button0_aria_label_value;
    	let t4;
    	let div0;
    	let button1;
    	let span1;
    	let span1_title_value;
    	let span1_class_value;
    	let button1_aria_label_value;
    	let t5;
    	let t6;
    	let ul1;
    	let li1;
    	let t7;
    	let li2;
    	let t8;
    	let li3;
    	let t9;
    	let li4;
    	let t10;
    	let li5;
    	let t11;
    	let li6;
    	let t12;
    	let li7;
    	let t13;
    	let li8;
    	let t14;
    	let li9;
    	let t15;
    	let div12;
    	let div11;
    	let div10;
    	let div6;
    	let h5;
    	let t17;
    	let div5;
    	let div4;
    	let div3;
    	let button2;
    	let t19;
    	let button3;
    	let t21;
    	let div8;
    	let div7;
    	let t22;
    	let div9;
    	let button4;
    	let t24;
    	let button5;
    	let current;
    	let mounted;
    	let dispose;

    	itemhelper = new ItemHelper({
    			props: {
    				reviewMode: /*isReview*/ ctx[0],
    				handleReviewClick: /*handleReviewMode*/ ctx[6]
    			},
    			$$inline: true
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[4]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[5]);

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[1].QXML._reflection) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value = /*state*/ ctx[1].modalViewLayout;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			link = element("link");
    			t0 = space();
    			center = element("center");
    			create_component(itemhelper.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			t2 = text(t2_value);
    			t3 = space();
    			button0 = element("button");
    			span0 = element("span");
    			t4 = space();
    			div0 = element("div");
    			button1 = element("button");
    			span1 = element("span");
    			t5 = space();
    			if_block.c();
    			t6 = space();
    			ul1 = element("ul");
    			li1 = element("li");
    			t7 = space();
    			li2 = element("li");
    			t8 = space();
    			li3 = element("li");
    			t9 = space();
    			li4 = element("li");
    			t10 = space();
    			li5 = element("li");
    			t11 = space();
    			li6 = element("li");
    			t12 = space();
    			li7 = element("li");
    			t13 = space();
    			li8 = element("li");
    			t14 = space();
    			li9 = element("li");
    			t15 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div6 = element("div");
    			h5 = element("h5");
    			h5.textContent = `${l.set_ans}`;
    			t17 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			button2 = element("button");
    			button2.textContent = `${l.add_point}`;
    			t19 = space();
    			button3 = element("button");
    			button3.textContent = `${l.del_row}`;
    			t21 = space();
    			div8 = element("div");
    			div7 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t22 = space();
    			div9 = element("div");
    			button4 = element("button");
    			button4.textContent = `${l.cancel}`;
    			t24 = space();
    			button5 = element("button");
    			button5.textContent = `${l.ok_btn}`;
    			attr_dev(link, "onload", "this.rel='stylesheet'");
    			attr_dev(link, "rel", "preload");
    			attr_dev(link, "as", "style");
    			attr_dev(link, "href", link_href_value = itemUrl + "src/libs/Math.min.css");
    			add_location(link, file$1, 351, 4, 15853);
    			li0.value = "plotgraph";
    			attr_dev(li0, "class", "selected-option text-uppercase m-0");
    			add_location(li0, file$1, 367, 16, 16492);
    			attr_dev(ul0, "class", "controls");
    			add_location(ul0, file$1, 366, 12, 16453);
    			attr_dev(span0, "data-bs-toggle", "tooltip");
    			attr_dev(span0, "title", span0_title_value = l.ada_graph_msg);
    			attr_dev(span0, "class", "icomoon-keyboard-2 s2");
    			add_location(span0, file$1, 375, 16, 16855);
    			attr_dev(button0, "tabindex", "0");
    			attr_dev(button0, "id", "ADA_button");
    			attr_dev(button0, "class", "ADAButton float-start mt-1 btn w-auto h-auto p-1 btn-light ml");
    			attr_dev(button0, "aria-label", button0_aria_label_value = l.ada_graph_msg);
    			add_location(button0, file$1, 369, 12, 16613);
    			attr_dev(span1, "title", span1_title_value = l.delete);
    			attr_dev(span1, "data-bs-toggle", "tooltip");
    			attr_dev(span1, "class", span1_class_value = "icomoon-new-24px-delete-1");
    			add_location(span1, file$1, 388, 20, 17381);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-light p-1 focus_div");
    			attr_dev(button1, "id", "delButton");
    			attr_dev(button1, "data-placement", "right");
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "aria-label", button1_aria_label_value = l.ada_message);
    			add_location(button1, file$1, 380, 16, 17078);
    			attr_dev(div0, "class", "btn-group tools delElem h-imp");
    			add_location(div0, file$1, 377, 12, 16985);
    			attr_dev(div1, "id", "option-toolbar");
    			attr_dev(div1, "class", "text-dark");
    			add_location(div1, file$1, 365, 8, 16396);
    			attr_dev(li1, "class", "btn_active btn-point");
    			attr_dev(li1, "rel", "point");
    			attr_dev(li1, "data-value", "P");
    			add_location(li1, file$1, 434, 12, 19393);
    			attr_dev(li2, "rel", "segment");
    			attr_dev(li2, "class", "btn-segment");
    			attr_dev(li2, "data-value", "S");
    			add_location(li2, file$1, 435, 12, 19472);
    			attr_dev(li3, "rel", "segment_left_point_hollow");
    			attr_dev(li3, "class", "btn-SLH");
    			attr_dev(li3, "data-value", "SLH");
    			add_location(li3, file$1, 436, 12, 19544);
    			attr_dev(li4, "rel", "segment_right_point_hollow");
    			attr_dev(li4, "class", "btn-SRH");
    			attr_dev(li4, "data-value", "SRH");
    			add_location(li4, file$1, 437, 12, 19632);
    			attr_dev(li5, "rel", "segment_both_point_hollow");
    			attr_dev(li5, "class", "btn-SBH");
    			attr_dev(li5, "data-value", "SBH");
    			add_location(li5, file$1, 438, 12, 19721);
    			attr_dev(li6, "rel", "ray_left_direction");
    			attr_dev(li6, "class", "btn-RL");
    			attr_dev(li6, "data-value", "RL");
    			add_location(li6, file$1, 439, 12, 19809);
    			attr_dev(li7, "rel", "ray_right_direction");
    			attr_dev(li7, "class", "btn-RR");
    			attr_dev(li7, "data-value", "RR");
    			add_location(li7, file$1, 440, 12, 19888);
    			attr_dev(li8, "rel", "ray_left_direction_right_hollow");
    			attr_dev(li8, "class", "btn-RRH");
    			attr_dev(li8, "data-value", "RRH");
    			add_location(li8, file$1, 441, 12, 19968);
    			attr_dev(li9, "rel", "ray_right_direction_left_hollow");
    			attr_dev(li9, "class", "btn-RLH");
    			attr_dev(li9, "data-value", "RLH");
    			add_location(li9, file$1, 442, 12, 20062);
    			attr_dev(ul1, "class", "footer_toolbox h");
    			add_location(ul1, file$1, 433, 8, 19350);
    			attr_dev(div2, "id", "mathmain");
    			attr_dev(div2, "class", "userAns position-relative bg-white");
    			set_style(div2, "height", Number(/*state*/ ctx[1].QXML._height) + 2 + "px");
    			set_style(div2, "width", /*state*/ ctx[1].QXML._width + "px");
    			add_location(div2, file$1, 360, 8, 16192);
    			add_location(center, file$1, 353, 4, 15969);
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$1, 451, 20, 20417);
    			attr_dev(button2, "class", "btn btn-light");
    			attr_dev(button2, "id", "updateRow");
    			add_location(button2, file$1, 455, 32, 20629);
    			attr_dev(button3, "class", "btn btn-light ml-1");
    			attr_dev(button3, "id", "delete_btn");
    			add_location(button3, file$1, 456, 32, 20765);
    			attr_dev(div3, "class", "float-end");
    			add_location(div3, file$1, 454, 28, 20572);
    			attr_dev(div4, "class", "col-12");
    			add_location(div4, file$1, 453, 24, 20522);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file$1, 452, 20, 20479);
    			attr_dev(div6, "class", "modal-header");
    			add_location(div6, file$1, 450, 16, 20369);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file$1, 462, 20, 21069);
    			attr_dev(div8, "class", "modal-body overflow-y svelte-e5vip7");
    			add_location(div8, file$1, 461, 16, 21012);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-light");
    			attr_dev(button4, "data-bs-dismiss", "modal");
    			add_location(button4, file$1, 546, 20, 27766);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn btn-secondary");
    			add_location(button5, file$1, 547, 20, 27875);
    			attr_dev(div9, "class", "modal-footer");
    			add_location(div9, file$1, 545, 16, 27718);
    			attr_dev(div10, "class", "modal-content");
    			add_location(div10, file$1, 449, 12, 20324);
    			attr_dev(div11, "class", "modal-dialog modal-dialog-centered");
    			add_location(div11, file$1, 448, 8, 20262);
    			attr_dev(div12, "id", "graph_modal");
    			attr_dev(div12, "class", "modal fade svelte-e5vip7");
    			attr_dev(div12, "tabindex", "-1");
    			add_location(div12, file$1, 447, 4, 20197);
    			add_location(div13, file$1, 350, 0, 15842);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, link);
    			append_dev(div13, t0);
    			append_dev(div13, center);
    			mount_component(itemhelper, center, null);
    			append_dev(center, t1);
    			append_dev(center, div2);
    			append_dev(div2, div1);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, button0);
    			append_dev(button0, span0);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, button1);
    			append_dev(button1, span1);
    			append_dev(div2, t5);
    			if_block.m(div2, null);
    			append_dev(div2, t6);
    			append_dev(div2, ul1);
    			append_dev(ul1, li1);
    			append_dev(ul1, t7);
    			append_dev(ul1, li2);
    			append_dev(ul1, t8);
    			append_dev(ul1, li3);
    			append_dev(ul1, t9);
    			append_dev(ul1, li4);
    			append_dev(ul1, t10);
    			append_dev(ul1, li5);
    			append_dev(ul1, t11);
    			append_dev(ul1, li6);
    			append_dev(ul1, t12);
    			append_dev(ul1, li7);
    			append_dev(ul1, t13);
    			append_dev(ul1, li8);
    			append_dev(ul1, t14);
    			append_dev(ul1, li9);
    			append_dev(div13, t15);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div6);
    			append_dev(div6, h5);
    			append_dev(div6, t17);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, button2);
    			append_dev(div3, t19);
    			append_dev(div3, button3);
    			append_dev(div10, t21);
    			append_dev(div10, div8);
    			append_dev(div8, div7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div7, null);
    			}

    			append_dev(div10, t22);
    			append_dev(div10, div9);
    			append_dev(div9, button4);
    			append_dev(div9, t24);
    			append_dev(div9, button5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button2, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(button3, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(button5, "click", /*modifyUxmlOnKey*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const itemhelper_changes = {};
    			if (dirty & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);
    			if ((!current || dirty & /*state*/ 2) && t2_value !== (t2_value = /*state*/ ctx[1].QXML._type + "")) set_data_dev(t2, t2_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, t6);
    				}
    			}

    			if (!current || dirty & /*state*/ 2) {
    				set_style(div2, "height", Number(/*state*/ ctx[1].QXML._height) + 2 + "px");
    			}

    			if (!current || dirty & /*state*/ 2) {
    				set_style(div2, "width", /*state*/ ctx[1].QXML._width + "px");
    			}

    			if (dirty & /*state, l*/ 2) {
    				each_value = /*state*/ ctx[1].modalViewLayout;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div7, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemhelper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemhelper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			destroy_component(itemhelper);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GraphPreview', slots, []);
    	let { xml } = $$props;
    	let { uxml } = $$props;
    	let { isReview } = $$props;
    	let { showAns } = $$props;
    	let { editorState } = $$props;
    	let state = {};

    	let preview_store = writable({
    		xml: "",
    		QXML: "",
    		userAns_data: "",
    		moduleType: "none",
    		noOfRow: 1,
    		review: false,
    		init: false,
    		open: false,
    		modalViewLayout: [],
    		checked: true
    	});

    	const unsubscribe = preview_store.subscribe(value => {
    		$$invalidate(1, state = value);
    	});

    	// functions responsible for loading the module
    	beforeUpdate(async () => {
    		if (!state.init) {
    			if (typeof JXG == 'object' && editorState) {
    				$$invalidate(1, state.init = true, state);
    			} else if (typeof editorState == 'undefined') {
    				AH.addScript('', itemUrl + 'src/libs/jsxgraph.min.js', {
    					callback() {
    						$$invalidate(1, state.init = true, state);
    					}
    				});
    			}
    		}

    		if (editorState && editorState.stopPreviewUpdate) {
    			$$invalidate(7, xml = AH.select('#special_module_xml').value);
    		}

    		if (state.init && state.xml != xml) {
    			loadModule(xml);
    		}
    	});

    	// functions responsible for doing the changes according to the xml
    	afterUpdate(async () => {
    		if (state.init) {
    			if (state.xml != xml) {
    				if (editorState) {
    					// resetting the answer
    					resetAdaModal();

    					AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", "");
    				}

    				initModule();

    				preview_store.update(item => {
    					item.xml = xml;
    					return item;
    				});

    				if (isReview && typeof editorState == 'undefined') {
    					setReview();
    				}
    			}

    			if (state.review != isReview && editorState) {
    				preview_store.update(item => {
    					item.review = isReview;
    					return item;
    				});

    				if (isReview) {
    					GRAPH.modeOn(1);
    					displayAns();
    				} else {
    					GRAPH.modeOn(0);
    				}

    				AH.selectAll('#mathmain #delButton.active', 'removeClass', 'active');
    			}

    			if (state.checked && typeof showAns == 'undefined') {
    				GRAPH.checkAns("#mathmain");
    				$$invalidate(1, state.checked = false, state);
    			}

    			AH.enableBsAll('[data-bs-toggle="tooltip"]', 'Tooltip');
    		}
    	});

    	// Responible for binding the events
    	onMount(async () => {
    		if (window.inNative) {
    			window.getHeight && window.getHeight();
    		}

    		AH.set("q_refresh", refreshModule);

    		if (!editorState) {
    			refreshModule();
    		}

    		AH.listen('body', 'keydown', '#mathmain #delButton', function (current, event) {
    			if (event.ctrlKey && event.altKey && (event.which == 49 || event.keyCode == 49)) {
    				openModal();
    			}
    		});

    		AH.listen('body', 'keydown', '#mathmain #ADA_button', function (current, event) {
    			if (event.keyCode == 13) {
    				openModal();
    			}
    		});

    		AH.listen('body', 'click', '#mathmain', function (current, event) {
    			if (event.target.parentNode.id != 'delButton' && event.target.id != 'ADA_button' && event.target.id != 'delButton' && event.target.parentNode.id != 'ADA_button' && event.target.id != 'option-toolbar') {
    				displayAns();
    			}
    		});

    		AH.listen('body', 'mouseup', '#mathmain', function (current, event) {
    			if (event.target.parentNode.id != 'delButton' && event.target.id != 'ADA_button' && event.target.id != 'delButton' && event.target.parentNode.id != 'ADA_button' && event.target.id != 'option-toolbar') {
    				displayAns();
    			}
    		});

    		AH.listen('body', 'click', '.delElem', function (current) {
    			let cur_elem = current.children[0];
    			cur_elem.classList.toggle('active');

    			if (AH.select('.selected-option').innerHTML == 'point' || AH.select('.selected-option').innerHTML == 'circle' || AH.select('.selected-option').innerHTML == 'association') {
    				if (cur_elem.classList.contains('active')) {
    					AH.alert(l.delete_msg);
    					AH.find('#mathmain', '#ID0Preview').style.cursor = "pointer";
    				} else {
    					AH.find('#mathmain', '#ID0Preview').style.cursor = "default";
    					cur_elem.style.color = 'black';
    				}
    			} else if (cur_elem.classList.contains('active')) {
    				cur_elem.style.color = 'black';
    				AH.alert(l.last_delete_msg);

    				AH.setCss(current, {
    					backgroundColor: "transparent",
    					boxShadow: "none"
    				});

    				AH.find('#mathmain', '#ID0Preview').style.cursor = "default";
    			}
    		});

    		AH.listen('body', 'click', '#mathmain .footer_toolbox li', function (current) {
    			current.classList.add('btn_active');
    			AH.selectAll(AH.siblings(current), 'removeClass', 'btn_active');
    		});
    	});

    	// for refreshing the module
    	function refreshModule() {
    		if (typeof JXG != 'undefined' && AH.select('#ID0Preview').nodeName && AH.select('#ID0Preview').offsetHeight) {
    			initModule();
    		}
    	}

    	// function for iniating module 
    	function initModule() {
    		GRAPH.readyThis("#mathmain");

    		// called for update the graph on graph board
    		GRAPH.showansdrag("#mathmain", 'u', 1);

    		/* allows user to perform the task and hides 'correct answer' and 'your answer' button */
    		GRAPH.modeOn();
    	}

    	// responsible for showing the answer
    	function displayAns() {
    		// used for switch on next question in prepengine if current question is attempted
    		//ISSPECIALMODULEUSERXMLCHANGE = 1;
    		// collect Correct or Incorrect which is returned by checkAns method 
    		let result = GRAPH.checkAns("#mathmain");

    		if (typeof is_sm != "undefined") AH.showmsg(result.ans ? "Correct" : "Incorrect", 3000);

    		if (editorState) {
    			// shows the answer according to the value of its argument passed
    			showAns(result.ans ? "Correct" : "Incorrect");
    		}

    		onUserAnsChange(result);
    	}

    	// function responsible for loading the module
    	function loadModule(loadXml) {
    		loadXml = XMLToJSON(loadXml);
    		parseXMLAuthoring(loadXml);
    		let uaXML = {};

    		if (uxml) {
    			// converts the user answer xml value into json which is store in 'uxml'
    			uaXML = XMLToJSON(uxml);

    			if (uaXML && uaXML.smans && uaXML.smans.div && uaXML.smans.div._userAns) {
    				preview_store.update(item => {
    					item.userAns_data = uaXML.smans.div._userAns;
    					return item;
    				});
    			}
    		}
    	}

    	// function responsible for parsing the xml
    	function parseXMLAuthoring(MYXML) {
    		preview_store.update(item => {
    			item.QXML = MYXML.smxml.plot;
    			item.moduleType = MYXML.smxml.plot._type;
    			return item;
    		});
    	}

    	// function responsible for opening the modal
    	function openModal() {
    		AH.getBS('#graph_modal', 'Modal').show();
    		loadModalView();
    		AH.selectAll('[resetValue="1"]', 'value', '');
    	}

    	// function for setting the uxml on key update
    	function modifyUxmlOnKey() {
    		let tempRowVal = [];
    		let row;

    		switch (state.moduleType) {
    			case "circle":
    				// selects all row
    				row = document.querySelectorAll('.mainDiv');
    				//var tempRowVal = [];
    				row.forEach(function (item) {
    					// selects all input field in perticular row
    					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);

    					// creates array with input fields value which are defined for x and y co-ordinate and radius after separating comma and '/' which is required where it is suitable 
    					let tempCol = [col[0].value + "," + col[1].value + "/" + col[2].value];

    					// pushes the value of 'tempCol' array into array 'tempRowVal'
    					tempRowVal.push(tempCol);
    				});
    				// updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|' 
    				AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", tempRowVal.join('|'));
    				// calls unsetReview method
    				unsetReview();
    				break;
    			case "point":
    			case "polygon":
    				// selects the all rows available in ADA modal box
    				row = document.querySelectorAll('.mainDiv');
    				//var tempRowVal = [];
    				row.forEach(function (item) {
    					// selects all input field in perticular row
    					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);

    					// creates array with input fields value which are defined for x and y co-ordinate
    					let tempCol = [col[0].value + "," + col[1].value];

    					// pushes the data of 'tempCol' in array 'tempRowVal'
    					tempRowVal.push(tempCol);
    				});
    				// updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|' 
    				AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", tempRowVal.join('|'));
    				// calls unsetReview method
    				unsetReview();
    				break;
    			case "sine":
    			case "cosine":
    			case "line":
    			case "ray":
    			case "segment":
    			case "vector":
    			case "parabola":
    				row = document.querySelectorAll('.mainDiv');
    				//var tempRowVal = [];
    				row.forEach(function (item) {
    					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);

    					// contains the array of value point x1, y1 and  x2, y2 separated with '|' from ADA dialog box
    					let tempCol = [
    						col[0].value + "," + col[1].value + "|" + col[2].value + "," + col[3].value
    					];

    					// pushes the data in 'tempRowVal' array
    					tempRowVal.push(tempCol);
    				});
    				// updates the value of 'data-userans' attribute of graph board container inside preview container where id starts with 'ID' character after joining the 'tempRowVal' array value with '|'
    				AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", tempRowVal.join('|'));
    				// calls unsetReview method
    				unsetReview();
    				break;
    			case "association":
    				// it is discarded by Pete sir
    				row = document.querySelectorAll('.mainDiv');
    				//var tempRowVal = [];
    				row.forEach(function (item) {
    					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);
    					let tempCol = [col[0].value + "," + col[1].value + "," + col[2].value];
    					tempRowVal.push(tempCol);
    				});
    				AH.find("#mathmain", '[id^=ID]').setAttribute("data-userans", tempRowVal.join('|'));
    				unsetReview();
    				break;
    		}

    		displayAns();
    		AH.getBS('#graph_modal', 'Modal').hide();
    	}

    	// used for ADA and adds or removes the row 
    	function updateRow(type) {
    		if (type == "add") {
    			// increases the row by 1 if 'add' button clicked
    			$$invalidate(1, state.noOfRow = state.noOfRow + 1, state);
    		} else if (type == 'remove') {
    			if (state.noOfRow == 1) {
    				AH.alert("Default row can't be deleted");
    			} else {
    				//  decreases the row by 1 if 'remove' button clicked and row is greater than 1
    				$$invalidate(1, state.noOfRow = state.noOfRow - 1, state);
    			}
    		}

    		loadModalView();
    	}

    	// loads the ADA modal box according to the value of state 'moduleType'
    	function loadModalView() {
    		let modalViewLayout = [];

    		for (let index = 0; index < state.noOfRow; index++) {
    			// pushes the value return by getRow method in array 'modalViewLayout'
    			modalViewLayout = [...modalViewLayout, { moduleType: state.moduleType, index }];
    		}

    		preview_store.update(item => {
    			item.modalViewLayout = modalViewLayout;
    			return item;
    		});
    	}

    	/* shows correct or incorrect message and correct answer and your answer button and does not allow user to perform the task */
    	function setReview() {
    		AH.selectAll('#mathmain #delButton.active', 'removeClass', 'active');
    		$$invalidate(0, isReview = true);

    		// does not allow user to perform the task and shows correct answer and your answer button
    		GRAPH.modeOn("on");

    		// shows the stroke and fill color of the point and graph
    		GRAPH.showansdrag('#mathmain', 'u', 1);

    		// display the correct or incorrect 
    		displayAns();
    	}

    	/* hides correct or incorrect message and correct answer and your answer button and allow user to perform the task removes red or green color of border of preview container */
    	function unsetReview() {
    		AH.selectAll('#mathmain #delButton.active', 'removeClass', 'active');
    		$$invalidate(0, isReview = false);

    		// allow user to perform the task
    		GRAPH.modeOn();

    		// does not show the point and graph stroke and fill color to indicate that answer is correct or incorrect, shows border color of preview container in gray color */
    		GRAPH.showansdrag('#mathmain', 'u', 0);
    	}

    	// function for handling the review mode
    	function handleReviewMode(mode) {
    		if (mode == 'c') {
    			GRAPH.showansdrag('#mathmain', 'c', 1);
    		} else if (mode == 'u') {
    			GRAPH.showansdrag('#mathmain', 'u', 1);
    		}
    	}

    	// function for resetting the modal
    	function resetAdaModal() {
    		$$invalidate(1, state.noOfRow = 1, state);
    		AH.selectAll('[id^=divAllTextBox]:not([id="divAllTextBox0"])', 'remove');
    		AI.selectAll('.getFieldVal:not(:disabled)', 'value', '');
    	}

    	const writable_props = ['xml', 'uxml', 'isReview', 'showAns', 'editorState'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GraphPreview> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		updateRow("add");
    	};

    	const click_handler_1 = () => {
    		updateRow("remove");
    	};

    	$$self.$$set = $$props => {
    		if ('xml' in $$props) $$invalidate(7, xml = $$props.xml);
    		if ('uxml' in $$props) $$invalidate(8, uxml = $$props.uxml);
    		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ('showAns' in $$props) $$invalidate(9, showAns = $$props.showAns);
    		if ('editorState' in $$props) $$invalidate(10, editorState = $$props.editorState);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		beforeUpdate,
    		onMount,
    		l,
    		writable,
    		ItemHelper,
    		XMLToJSON,
    		AH,
    		onUserAnsChange,
    		GRAPH,
    		xml,
    		uxml,
    		isReview,
    		showAns,
    		editorState,
    		state,
    		preview_store,
    		unsubscribe,
    		refreshModule,
    		initModule,
    		displayAns,
    		loadModule,
    		parseXMLAuthoring,
    		openModal,
    		modifyUxmlOnKey,
    		updateRow,
    		loadModalView,
    		setReview,
    		unsetReview,
    		handleReviewMode,
    		resetAdaModal
    	});

    	$$self.$inject_state = $$props => {
    		if ('xml' in $$props) $$invalidate(7, xml = $$props.xml);
    		if ('uxml' in $$props) $$invalidate(8, uxml = $$props.uxml);
    		if ('isReview' in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ('showAns' in $$props) $$invalidate(9, showAns = $$props.showAns);
    		if ('editorState' in $$props) $$invalidate(10, editorState = $$props.editorState);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('preview_store' in $$props) preview_store = $$props.preview_store;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isReview,
    		state,
    		modifyUxmlOnKey,
    		updateRow,
    		setReview,
    		unsetReview,
    		handleReviewMode,
    		xml,
    		uxml,
    		showAns,
    		editorState,
    		click_handler,
    		click_handler_1
    	];
    }

    class GraphPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				xml: 7,
    				uxml: 8,
    				isReview: 0,
    				showAns: 9,
    				editorState: 10
    			},
    			add_css$1
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphPreview",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*xml*/ ctx[7] === undefined && !('xml' in props)) {
    			console.warn("<GraphPreview> was created without expected prop 'xml'");
    		}

    		if (/*uxml*/ ctx[8] === undefined && !('uxml' in props)) {
    			console.warn("<GraphPreview> was created without expected prop 'uxml'");
    		}

    		if (/*isReview*/ ctx[0] === undefined && !('isReview' in props)) {
    			console.warn("<GraphPreview> was created without expected prop 'isReview'");
    		}

    		if (/*showAns*/ ctx[9] === undefined && !('showAns' in props)) {
    			console.warn("<GraphPreview> was created without expected prop 'showAns'");
    		}

    		if (/*editorState*/ ctx[10] === undefined && !('editorState' in props)) {
    			console.warn("<GraphPreview> was created without expected prop 'editorState'");
    		}
    	}

    	get xml() {
    		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uxml() {
    		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uxml(value) {
    		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isReview() {
    		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showAns() {
    		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showAns(value) {
    		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editorState() {
    		throw new Error("<GraphPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<GraphPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     *  File Name   : main.js
     *  Author      : Ayush Srivastava
     *  Function    : Graph
     *  Version     : 1.0
     *  Packege     : clsSMGRAPH (preview)
     *  Last update : 02-MAR-2021
     */

    const defXMl = `<smxml type="20" name="Math"><plot id="ID0" type="cosine" xtickdistance="90" ytickdistance="1" anskey="90,0|0,2" xaxis="720" yaxis="3" height="450" width="700" polygon_type="0" reflection="" equation="y=2*cos(x)"></plot></smxml>`;

    const app = new GraphPreview({
    	target: document.getElementById(window.moduleContainer) || document.body,
    	props: {
    		xml: window.QXML || defXMl,
    		uxml: window.uaXML,
    		ansStatus: 0,
    		isReview: window.isReviewMode || false,
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle_q20.js.map
