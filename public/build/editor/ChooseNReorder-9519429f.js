
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { O as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, M as append_styles, W as Checkbox, C as validate_each_argument, P as Dialog, Q as binding_callbacks, R as bind, v as validate_slots, L as beforeUpdate, X as XMLToJSON, N as JSONToXML, y as l$1, V as Button, w as writable, A as AH$1, e as element, f as space, j as attr_dev, l as set_style, k as add_location, n as insert_dev, p as append_dev, q as listen_dev, E as is_function, G as prop_dev, x as detach_dev, H as run_all, c as create_component, h as text, m as mount_component, Z as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, K as destroy_each, B as noop } from './main-fb7bc328.js';
import './style-inject.es-1c867377.js';
import './choose.min-28dd96e2.js';

/** 

 *  Filename    : Lang.js
 *  @Author     : Saquib Ajaz <saquib.ajaz@ucertify.com>
 *  @Version    : 1.0
 *  Last updated : 15 July 2020
 *  Last updated by: Dharmendra Mishra
 */
var l = {
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
    fill_text_help3 : "3. Use #cm for comma (e.g., 5,000 as 5#cm000, function(a,b) as function(a#cmb)).",
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
    icon_not_blank: 'Icons name should not be blank!',
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

    select_icon: "You can get the icon name by clicking on the Icon list button!"
};

/**
 *  Filename    : ValidateItems.js
 *  @Author     : Saquib Ajaz <saquib.ajaz@ucertify.com>
 *  @Version    : 1.0
 *  Last update : 29 May 2020
 *  Last updated by: Dharmendra Mishra
 */
const AH = new JUI();

let smVal = {
  err: {
    q9: l.max_error,
    q27:
      "You have exceeded the module limit. You can only create 6 statement nodes and 4 option nodes.",
    q6_advance: l.max_row_col_error
  },

  processError: function(err, msg) {
    let smErr = {
      error: err,
      message: msg
    };
    return smErr;
  },
  //@TOOD:? @pradeep item-refactor
  validate: function(type, subtype, content_icon) {
    if (type == "q" || type == "u") {
      switch (subtype) {
        case 9:
          return this.validate9(content_icon);
        case 14:
          return this.validate14(content_icon);
        case 6:
          return this.validate6(content_icon);
        case 26:
          return this.validate26(content_icon);
        case 27:
          return this.validate27(content_icon);
      }
    }
  },

  validate9: function(icon) {
    //var len = jQuery("#fillmain").find("[id^=elem]").length;
    let len = AH.selectAll("#fillmain [id^=elem]").length;
    if (len > 6) {
      return this.processError(true, this.err.q9);
    } else {
      return this.processError(false, "valid");
    }
  },

  validate6: function(icon) {
    //var len = jQuery("#choose").find("#sortable li").length;
    let len = AH.selectAll("#choose #sortable li").length;
    console.log("len =>"+len);
    if (len > 5) {
      return this.processError(true, this.err.q9);
    } else {
      return this.processError(false, "valid");
    }
  },

  validate26: function(icon) {
    //var len = jQuery("#mytable >tbody >tr").length;
    let len = AH.selectAll("#mytable >tbody >tr").length;
    //var len1 = jQuery("#mytable >thead >tr >th").length;
    let len1 = AH.selectAll("#mytable >thead >tr >th").length;
    if (len > 5 || len1 > 6) {
      return this.processError(true, this.err.q6_advance);
    } else {
      return this.processError(false, "valid");
    }
  },

  validate14: function(icon) {
    //var len1 = jQuery("#matchListArea [class*='textarea_1']").length;
    let len1  = AH.selectAll("#matchListArea [class*='textarea_1']").length;
    //var len2 = jQuery("#matchListArea [class*='textarea_2']").length;
    let len2 = selectAll("#matchListArea [class*='textarea_2']").length;
    if (len1 > 6 || len2 > 6) {
      return this.processError(true, this.err.q9);
    } else {
      return this.processError(false, "valid");
    }
  },
  validate27: function(icon) {
    //var len1 = jQuery("#choicemain").find(".testmode_table tbody tr").length;
    let len1 = AH.selectAll("#choicemain .testmode_table tbody tr").length;
    //var len2 = jQuery("#choicemain").find(".testmode_table thead tr th").length;
    let len2 = AH.selectAll("#choicemain .testmode_table thead tr th").length;
    if (len1 > 6 || len2 > 5) {
      return this.processError(true, this.err.q27);
    } else {
      return this.processError(false, "valid");
    }
  }
};

/* clsSMChoose\ChooseNReorder.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMChoose\\ChooseNReorder.svelte";

function add_css(target) {
	append_styles(target, "svelte-1afsy3o", ".colorgray{width:56px;background-color:lightgrey}.addbutton.svelte-1afsy3o{position:relative;left:32px;height:31px}.addbuttonplus.svelte-1afsy3o{font-size:24px}.height30.svelte-1afsy3o{height:30px !important}.top1.svelte-1afsy3o{top:1px}.top6{top:6px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hvb3NlTlJlb3JkZXIuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXNoQlksVUFBVSxBQUFFLENBQUMsQUFDakIsTUFBTSxJQUFJLENBQ1YsZ0JBQWdCLENBQUUsU0FBUyxBQUMvQixDQUFDLEFBQ0QsVUFBVSxlQUFDLENBQUMsQUFDUixRQUFRLENBQUUsUUFBUSxDQUNsQixJQUFJLENBQUUsSUFBSSxDQUNWLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFDRCxjQUFjLGVBQUMsQ0FBQyxBQUNaLFNBQVMsQ0FBRSxJQUFJLEFBQ25CLENBQUMsQUFFRCxTQUFTLGVBQUUsQ0FBQyxBQUNSLE1BQU0sQ0FBRSxJQUFJLENBQUMsVUFBVSxBQUMzQixDQUFDLEFBRUQsS0FBSyxlQUFDLENBQUMsQUFDSCxHQUFHLENBQUUsR0FBRyxBQUNaLENBQUMsQUFDTyxLQUFLLEFBQUUsQ0FBQyxBQUNmLEdBQUcsQ0FBRSxHQUFHLEFBQ1QsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJDaG9vc2VOUmVvcmRlci5zdmVsdGUiXX0= */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[25] = list[i];
	child_ctx[27] = i;
	return child_ctx;
}

// (461:28) <Checkbox on:click={updateSetting} id="allowSort" color="" checked = {((state.allowSort == 1)? true : false)}>
function create_default_slot_4(ctx) {
	let t_value = l$1.allow_sort + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(461:28) <Checkbox on:click={updateSetting} id=\\\"allowSort\\\" color=\\\"\\\" checked = {((state.allowSort == 1)? true : false)}>",
		ctx
	});

	return block;
}

// (464:32) <Checkbox on:click={updateSetting} id="isSentence" color="primary" checked = {((state.isSentence == 1)? true : false)} >
function create_default_slot_3(ctx) {
	let t_value = l$1.in_sentence + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(464:32) <Checkbox on:click={updateSetting} id=\\\"isSentence\\\" color=\\\"primary\\\" checked = {((state.isSentence == 1)? true : false)} >",
		ctx
	});

	return block;
}

// (467:32) <Checkbox on:click={updateSetting} id="isParagraph" color="primary" checked = {((state.isParagraph == 1)? true : false)}>
function create_default_slot_2(ctx) {
	let t_value = l$1.in_paragraph + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(467:32) <Checkbox on:click={updateSetting} id=\\\"isParagraph\\\" color=\\\"primary\\\" checked = {((state.isParagraph == 1)? true : false)}>",
		ctx
	});

	return block;
}

// (473:20) {#each localCData as data, i}
function create_each_block(ctx) {
	let div4;
	let div3;
	let div0;
	let input;
	let input_checked_value;
	let t0;
	let div1;
	let textarea;
	let textarea_value_value;
	let t1;
	let div2;
	let span;
	let div4_key_value;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[13](/*data*/ ctx[25]);
	}

	const block = {
		c: function create() {
			div4 = element("div");
			div3 = element("div");
			div0 = element("div");
			input = element("input");
			t0 = space();
			div1 = element("div");
			textarea = element("textarea");
			t1 = space();
			div2 = element("div");
			span = element("span");
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "id", "check_correct_ans");
			attr_dev(input, "name", "check_correct_ans");
			attr_dev(input, "class", "secure-icon float-end");
			input.checked = input_checked_value = /*data*/ ctx[25].value.charAt(0) == "*" ? true : false;
			set_style(input, "position", "relative");
			set_style(input, "top", "11px");
			set_style(input, "right", "15px");
			add_location(input, file, 476, 36, 19035);
			attr_dev(div0, "class", "col-1");
			add_location(div0, file, 475, 36, 18978);
			attr_dev(textarea, "class", "height32 outline0 mb-1 ms-0 ");

			textarea.value = textarea_value_value = /*data*/ ctx[25].value.charAt(0) == "*"
			? /*data*/ ctx[25].value.slice(1)
			: /*data*/ ctx[25].value;

			add_location(textarea, file, 478, 40, 19384);
			attr_dev(div1, "class", "col");
			add_location(div1, file, 477, 36, 19325);
			attr_dev(span, "class", "remove-item icomoon-24px-delete-1 height30 top1 position-relative float-start svelte-1afsy3o");
			attr_dev(span, "tabindex", "0");
			set_style(span, "right", "39px");
			add_location(span, file, 484, 40, 19827);
			add_location(div2, file, 483, 36, 19780);
			attr_dev(div3, "class", "form-row mt-head");
			add_location(div3, file, 474, 32, 18910);
			attr_dev(div4, "class", "clearfix mt choose_options");
			attr_dev(div4, "key", div4_key_value = /*i*/ ctx[27]);
			add_location(div4, file, 473, 28, 18828);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, div3);
			append_dev(div3, div0);
			append_dev(div0, input);
			append_dev(div3, t0);
			append_dev(div3, div1);
			append_dev(div1, textarea);
			append_dev(div3, t1);
			append_dev(div3, div2);
			append_dev(div2, span);

			if (!mounted) {
				dispose = [
					listen_dev(
						input,
						"click",
						function () {
							if (is_function(/*updateCorrect*/ ctx[5].bind(/*data*/ ctx[25].value, /*i*/ ctx[27]))) /*updateCorrect*/ ctx[5].bind(/*data*/ ctx[25].value, /*i*/ ctx[27]).apply(this, arguments);
						},
						false,
						false,
						false
					),
					listen_dev(
						textarea,
						"change",
						function () {
							if (is_function(/*editCdata*/ ctx[6].bind(/*data*/ ctx[25].value, /*i*/ ctx[27], /*isCorrect*/ ctx[2][/*i*/ ctx[27]]))) /*editCdata*/ ctx[6].bind(/*data*/ ctx[25].value, /*i*/ ctx[27], /*isCorrect*/ ctx[2][/*i*/ ctx[27]]).apply(this, arguments);
						},
						false,
						false,
						false
					),
					listen_dev(span, "click", click_handler, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*localCData*/ 1 && input_checked_value !== (input_checked_value = /*data*/ ctx[25].value.charAt(0) == "*" ? true : false)) {
				prop_dev(input, "checked", input_checked_value);
			}

			if (dirty & /*localCData*/ 1 && textarea_value_value !== (textarea_value_value = /*data*/ ctx[25].value.charAt(0) == "*"
			? /*data*/ ctx[25].value.slice(1)
			: /*data*/ ctx[25].value)) {
				prop_dev(textarea, "value", textarea_value_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(473:20) {#each localCData as data, i}",
		ctx
	});

	return block;
}

// (516:4) <Dialog bind:visible={state.open} on:close={() => {state.open = false}} >
function create_default_slot_1(ctx) {
	let h4;
	let t1;
	let div;
	let span;

	const block = {
		c: function create() {
			h4 = element("h4");
			h4.textContent = "Confirmation";
			t1 = space();
			div = element("div");
			span = element("span");
			span.textContent = "Do you really want to delete?";
			add_location(h4, file, 516, 8, 21514);
			attr_dev(span, "class", "col-md-12 mt-4");
			add_location(span, file, 518, 12, 21576);
			attr_dev(div, "class", "row");
			add_location(div, file, 517, 8, 21545);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h4, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div, anchor);
			append_dev(div, span);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h4);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(516:4) <Dialog bind:visible={state.open} on:close={() => {state.open = false}} >",
		ctx
	});

	return block;
}

// (524:12) <Button variant="contained" on:click={removeItem.bind(this,state.data_value,state.data_id)}                  class="bg-primary text-white">
function create_default_slot(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Yes");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(524:12) <Button variant=\\\"contained\\\" on:click={removeItem.bind(this,state.data_value,state.data_id)}                  class=\\\"bg-primary text-white\\\">",
		ctx
	});

	return block;
}

// (522:8) 
function create_footer_slot(ctx) {
	let div;
	let input;
	let t;
	let button;
	let current;
	let mounted;
	let dispose;

	button = new Button({
			props: {
				variant: "contained",
				class: "bg-primary text-white",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", function () {
		if (is_function(/*removeItem*/ ctx[7].bind(this, /*state*/ ctx[1].data_value, /*state*/ ctx[1].data_id))) /*removeItem*/ ctx[7].bind(this, /*state*/ ctx[1].data_value, /*state*/ ctx[1].data_id).apply(this, arguments);
	});

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			t = space();
			create_component(button.$$.fragment);
			attr_dev(input, "type", "button");
			attr_dev(input, "variant", "contained");
			attr_dev(input, "class", "btn btn-light colorgray");
			input.value = "No";
			add_location(input, file, 522, 12, 21723);
			attr_dev(div, "slot", "footer");
			attr_dev(div, "class", "svelteFooter");
			add_location(div, file, 521, 8, 21669);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
			append_dev(div, t);
			mount_component(button, div, null);
			current = true;

			if (!mounted) {
				dispose = listen_dev(input, "click", /*click_handler_1*/ ctx[14], false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const button_changes = {};

			if (dirty & /*$$scope*/ 268435456) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_footer_slot.name,
		type: "slot",
		source: "(522:8) ",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let div9;
	let center;
	let div8;
	let div5;
	let div0;
	let label;
	let t1;
	let input0;
	let input0_value_value;
	let t2;
	let div4;
	let div1;
	let checkbox0;
	let t3;
	let div2;
	let checkbox1;
	let t4;
	let div3;
	let checkbox2;
	let t5;
	let div7;
	let t6;
	let div6;
	let p;
	let t7;
	let b;
	let t9;
	let t10;
	let button;
	let span;
	let t12;
	let t13;
	let input1;
	let t14;
	let input2;
	let input2_defaultvalue_value;
	let t15;
	let dialog;
	let updating_visible;
	let current;
	let mounted;
	let dispose;

	checkbox0 = new Checkbox({
			props: {
				id: "allowSort",
				color: "",
				checked: /*state*/ ctx[1].allowSort == 1 ? true : false,
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	checkbox0.$on("click", /*updateSetting*/ ctx[4]);

	checkbox1 = new Checkbox({
			props: {
				id: "isSentence",
				color: "primary",
				checked: /*state*/ ctx[1].isSentence == 1 ? true : false,
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	checkbox1.$on("click", /*updateSetting*/ ctx[4]);

	checkbox2 = new Checkbox({
			props: {
				id: "isParagraph",
				color: "primary",
				checked: /*state*/ ctx[1].isParagraph == 1 ? true : false,
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	checkbox2.$on("click", /*updateSetting*/ ctx[4]);
	let each_value = /*localCData*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	function dialog_visible_binding(value) {
		/*dialog_visible_binding*/ ctx[15](value);
	}

	let dialog_props = {
		$$slots: {
			footer: [create_footer_slot],
			default: [create_default_slot_1]
		},
		$$scope: { ctx }
	};

	if (/*state*/ ctx[1].open !== void 0) {
		dialog_props.visible = /*state*/ ctx[1].open;
	}

	dialog = new Dialog({ props: dialog_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog, 'visible', dialog_visible_binding));
	dialog.$on("close", /*close_handler*/ ctx[16]);

	const block = {
		c: function create() {
			main = element("main");
			div9 = element("div");
			center = element("center");
			div8 = element("div");
			div5 = element("div");
			div0 = element("div");
			label = element("label");
			label.textContent = "Title";
			t1 = space();
			input0 = element("input");
			t2 = space();
			div4 = element("div");
			div1 = element("div");
			create_component(checkbox0.$$.fragment);
			t3 = space();
			div2 = element("div");
			create_component(checkbox1.$$.fragment);
			t4 = space();
			div3 = element("div");
			create_component(checkbox2.$$.fragment);
			t5 = space();
			div7 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t6 = space();
			div6 = element("div");
			p = element("p");
			t7 = text("Add a new item by clicking the ");
			b = element("b");
			b.textContent = "Add Item";
			t9 = text(" button at the bottom-left corner.");
			t10 = space();
			button = element("button");
			span = element("span");
			span.textContent = "+";
			t12 = text("   Add option");
			t13 = space();
			input1 = element("input");
			t14 = space();
			input2 = element("input");
			t15 = space();
			create_component(dialog.$$.fragment);
			attr_dev(label, "for", "headingCorrect");
			attr_dev(label, "class", "mt-1 pt-1");
			add_location(label, file, 449, 24, 17328);
			attr_dev(input0, "id", "headingCorrect");
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "sm_input_text mt mb");
			input0.value = input0_value_value = /*state*/ ctx[1].headingCorrect;
			add_location(input0, file, 450, 24, 17413);
			attr_dev(div0, "class", "d-flex ms-2 ps-4");
			add_location(div0, file, 448, 20, 17272);
			attr_dev(div1, "class", "col-md-3 pd-0 float-left");
			add_location(div1, file, 459, 24, 17822);
			attr_dev(div2, "class", "col-md-3 pd-0 float-left");
			add_location(div2, file, 462, 24, 18084);
			attr_dev(div3, "class", "col-md-3 pd-0 float-left");
			add_location(div3, file, 465, 24, 18360);
			attr_dev(div4, "class", "clearfix mt ps-4");
			add_location(div4, file, 458, 20, 17766);
			attr_dev(div5, "class", "choose_head_content px-3 pt-3 pb-0");
			add_location(div5, file, 447, 16, 17202);
			add_location(b, file, 497, 59, 20615);
			attr_dev(p, "class", "mb-md");
			add_location(p, file, 496, 24, 20537);
			attr_dev(div6, "class", "alert alert-info message_content");
			add_location(div6, file, 495, 20, 20465);
			attr_dev(span, "class", "addbuttonplus svelte-1afsy3o");
			add_location(span, file, 506, 44, 21071);
			attr_dev(button, "type", "button");
			attr_dev(button, "id", "add-item");
			attr_dev(button, "class", "btn btn-sm btn-outline-primary btn-sm float-left d-flex align-items-center mt-3 addbutton svelte-1afsy3o");
			add_location(button, file, 500, 20, 20744);
			attr_dev(div7, "class", "choose_item_container mb ps-4");
			add_location(div7, file, 470, 16, 18682);
			attr_dev(input1, "id", "check");
			attr_dev(input1, "type", "hidden");
			attr_dev(input1, "class", "");
			input1.value = "";
			add_location(input1, file, 509, 16, 21202);
			attr_dev(input2, "type", "hidden");
			attr_dev(input2, "name", "special_module_xml");
			attr_dev(input2, "id", "special_module_xml");
			attr_dev(input2, "defaultvalue", input2_defaultvalue_value = /*state*/ ctx[1].xml);
			add_location(input2, file, 510, 16, 21273);
			attr_dev(div8, "id", "main");
			attr_dev(div8, "class", "border");
			add_location(div8, file, 446, 12, 17154);
			add_location(center, file, 445, 8, 17132);
			add_location(div9, file, 444, 4, 17117);
			add_location(main, file, 443, 0, 17105);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div9);
			append_dev(div9, center);
			append_dev(center, div8);
			append_dev(div8, div5);
			append_dev(div5, div0);
			append_dev(div0, label);
			append_dev(div0, t1);
			append_dev(div0, input0);
			append_dev(div5, t2);
			append_dev(div5, div4);
			append_dev(div4, div1);
			mount_component(checkbox0, div1, null);
			append_dev(div4, t3);
			append_dev(div4, div2);
			mount_component(checkbox1, div2, null);
			append_dev(div4, t4);
			append_dev(div4, div3);
			mount_component(checkbox2, div3, null);
			append_dev(div8, t5);
			append_dev(div8, div7);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div7, null);
			}

			append_dev(div7, t6);
			append_dev(div7, div6);
			append_dev(div6, p);
			append_dev(p, t7);
			append_dev(p, b);
			append_dev(p, t9);
			append_dev(div7, t10);
			append_dev(div7, button);
			append_dev(button, span);
			append_dev(button, t12);
			append_dev(div8, t13);
			append_dev(div8, input1);
			append_dev(div8, t14);
			append_dev(div8, input2);
			append_dev(main, t15);
			mount_component(dialog, main, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input0, "change", /*updateSetting*/ ctx[4], false, false, false),
					listen_dev(button, "click", /*addNewItem*/ ctx[3], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*state*/ 2 && input0_value_value !== (input0_value_value = /*state*/ ctx[1].headingCorrect) && input0.value !== input0_value_value) {
				prop_dev(input0, "value", input0_value_value);
			}

			const checkbox0_changes = {};
			if (dirty & /*state*/ 2) checkbox0_changes.checked = /*state*/ ctx[1].allowSort == 1 ? true : false;

			if (dirty & /*$$scope*/ 268435456) {
				checkbox0_changes.$$scope = { dirty, ctx };
			}

			checkbox0.$set(checkbox0_changes);
			const checkbox1_changes = {};
			if (dirty & /*state*/ 2) checkbox1_changes.checked = /*state*/ ctx[1].isSentence == 1 ? true : false;

			if (dirty & /*$$scope*/ 268435456) {
				checkbox1_changes.$$scope = { dirty, ctx };
			}

			checkbox1.$set(checkbox1_changes);
			const checkbox2_changes = {};
			if (dirty & /*state*/ 2) checkbox2_changes.checked = /*state*/ ctx[1].isParagraph == 1 ? true : false;

			if (dirty & /*$$scope*/ 268435456) {
				checkbox2_changes.$$scope = { dirty, ctx };
			}

			checkbox2.$set(checkbox2_changes);

			if (dirty & /*state, localCData, editCdata, isCorrect, updateCorrect*/ 103) {
				each_value = /*localCData*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div7, t6);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty & /*state*/ 2 && input2_defaultvalue_value !== (input2_defaultvalue_value = /*state*/ ctx[1].xml)) {
				attr_dev(input2, "defaultvalue", input2_defaultvalue_value);
			}

			const dialog_changes = {};

			if (dirty & /*$$scope, state*/ 268435458) {
				dialog_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible && dirty & /*state*/ 2) {
				updating_visible = true;
				dialog_changes.visible = /*state*/ ctx[1].open;
				add_flush_callback(() => updating_visible = false);
			}

			dialog.$set(dialog_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(checkbox0.$$.fragment, local);
			transition_in(checkbox1.$$.fragment, local);
			transition_in(checkbox2.$$.fragment, local);
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(checkbox0.$$.fragment, local);
			transition_out(checkbox1.$$.fragment, local);
			transition_out(checkbox2.$$.fragment, local);
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			destroy_component(checkbox0);
			destroy_component(checkbox1);
			destroy_component(checkbox2);
			destroy_each(each_blocks, detaching);
			destroy_component(dialog);
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
	validate_slots('ChooseNReorder', slots, []);
	let localCData = [];
	let oldCData = [];
	let state = {};
	let { xml } = $$props;
	let { getChildXml } = $$props;
	let { changed_advance_xml } = $$props;
	let { editorState } = $$props;
	let { smValidate } = $$props;

	//export uaXML
	/// Declare States
	let stateData = writable({
		xml: "",
		headingCorrect: "",
		allowSort: "",
		isSentence: "",
		isParagraph: "",
		isadvance: false,
		CDATA: "",
		istoggled: false,
		openImageDialog: false,
		openErrorDialog: false,
		row_value: '',
		col_value: '',
		err_message: l$1.min_row_col_value,
		tomaketable: 'none',
		open: false,
		data_id: '',
		data_value: '',
		stateXMLToJSON: ''
	});

	const unsubscribe = stateData.subscribe(items => {
		$$invalidate(1, state = items);
	});

	let isCorrect = [];

	beforeUpdate(() => {
		if (state.xml != xml) {
			$$invalidate(1, state.xml = xml, state);

			// load module with the changed xml
			$$invalidate(1, state.stateXMLToJSON = XMLToJSON(xml), state);

			//loadModule(xml);
			loadModule();
		}
	});

	// this function responsible for loading the module
	function loadModule() {
		//loadXml = XMLToJSON(loadXml);   // convert xml to json using XMLToJSON Function
		parseXMLAuthoring(state.stateXMLToJSON); // xml parsing function
	}

	// xml parsing function
	function parseXMLAuthoring(MYXML) {
		let cdata, oldcdata;

		try {
			$$invalidate(0, localCData = []);
			oldCData = [];

			//this.forceUpdate();
			/* used to check if 'MYXML.smxml.list._oldCData' is set or not */
			if (MYXML.smxml.list._oldCData) {
				oldcdata = MYXML.smxml.list._oldCData.split('###');
			}

			// split the cdata with new line
			cdata = MYXML.smxml.list.__cdata.split("\n");

			// finding the row and col then change the module to multogrid using changed_advance_xml
			if (MYXML.smxml.list._row && MYXML.smxml.list._col) {
				delete MYXML.smxml.list._allowsort;
				delete MYXML.smxml.list._headingAll;
				changed_advance_xml(JSONToXML(MYXML), 26);
			}

			// extracting data in localCData array
			cdata.forEach(function (data, i) {
				if (cdata[i].trim() != "") {
					localCData.push({
						value: cdata[i].replace(/^\s+/g, ""),
						id: i
					});
				}
			});

			if (oldcdata) {
				oldcdata.forEach(function (data, index_no) {
					if (oldcdata[index_no].trim() != "") {
						oldCData.push({
							value: oldcdata[index_no].replace(/^\s+/g, ""),
							id: index_no
						});
					}
				});
			}

			// it update the attribute in lower case
			updateAttrToLower(MYXML);

			// setting state
			$$invalidate(1, state.headingCorrect = MYXML.smxml.list._headingcorrect, state);

			$$invalidate(1, state.allowSort = MYXML.smxml.list._allowsort, state);
			$$invalidate(1, state.isSentence = MYXML.smxml.list._issentence, state);
			$$invalidate(1, state.isParagraph = MYXML.smxml.list._isparagraph, state);
		} catch(error) {
			console.warn({
				error, //forceUpdate();
				'function name': 'parseXMLAuthoring',
				'File name': 'ChooseNReorder.js'
			});
		}
	}

	// Used for Add new option if it passes the limit criteria
	function addNewItem() {
		let len = AH$1.find("#choose", "#sortable li", 'all').length;

		if (len <= 9) {
			addAfterPassedLimitCriteria();
		} else {
			AH$1 && AH$1.alert('Maximum possible value of nodes are 10.');
		}
	}

	// this function is reponsible for updating the xml on the basis of checkbox option
	// selected (sequencing, in sentence, in paragraph) and the change in heading title
	function updateSetting(e) {
		//let xml = XMLToJSON(state.xml);
		let xml = state.stateXMLToJSON;

		switch (e.target.id) {
			case "allowSort":
				// if allowsort is checked
				xml.smxml.list._allowsort = e.target.checked == true ? "1" : "0";
				break;
			case "isSentence":
				// if issentence is checked
				if (e.target.checked == true) {
					if (document.querySelector('#allowSort').checked == false) {
						document.querySelector("#allowSort").click();
						document.querySelector("#allowSort").disabled = true;
					} else {
						document.querySelector('#allowSort').disabled = true;
					}

					$$invalidate(1, state.isSentence = "1", state);
					$$invalidate(1, state.allowSort = "1", state);

					// changing the value of the attribute
					xml.smxml.list._issentence = "1";

					xml.smxml.list._allowSort = "1";
					xml.smxml.list._isparagraph = "0";
				} else {
					// if unchecked
					document.querySelector('#allowSort').disabled = false;

					document.querySelector('#allowSort').click();
					$$invalidate(1, state.isSentence = "0", state);
					$$invalidate(1, state.allowSort = "1", state);

					// updating attributes
					xml.smxml.list._issentence = "0";

					xml.smxml.list._allowSort = "0";
				}
				break;
			case "isParagraph":
				// if isParagraph is checked 
				if (e.target.checked == true) {
					if (document.querySelector("#allowSort").getAttribute("checked") == false) {
						// disable allowshort option when check isSentence and isParagraph
						document.querySelector('#allowSort').click();

						document.querySelector('#allowSort').disabled = true;
					} else {
						document.querySelector("#allowSort").disabled = true;
					}

					$$invalidate(1, state.isParagraph = "1", state);
					$$invalidate(1, state.allowSort = "1", state);

					// updating attributes
					xml.smxml.list._isparagraph = "1";

					xml.smxml.list._allowSort = "1";
					xml.smxml.list._issentence = "0";
				} else {
					// if unchecked
					document.querySelector("#allowSort").disabled = false; // removing disable on allowsort

					document.querySelector("#allowSort").click();
					$$invalidate(1, state.isParagraph = "0", state);
					$$invalidate(1, state.allowSort = "1", state);

					// changing the value of the attribute
					xml.smxml.list._isparagraph = "0";

					xml.smxml.list._allowSort = "0";
				}
				//xml.smxml.list._isparagraph = ((e.target.checked == true)? "1" : "0");
				break;
			case "headingCorrect":
				// if change ocuur in heading
				$$invalidate(1, state.headingCorrect = e.target.value, state);
				// update attribute
				xml.smxml.list._headingCorrect = e.target.value;
				break;
		}

		// updating the xml
		getChildXml(JSONToXML(xml));
	}

	// it update the correct answer on clicking of checkbox button is clicked
	function updateCorrect(i, e) {
		if (e.target.checked == true) {
			// if checkbox is checked that means answer is correct so add * 
			$$invalidate(0, localCData[i].value = "*" + localCData[i].value.trim(), localCData);
		} else {
			$$invalidate(0, localCData[i].value = localCData[i].value.trim().slice(1), localCData);
		}

		// xml to json
		//let xml = XMLToJSON(state.xml);
		let xml = state.stateXMLToJSON;

		var timer = setTimeout(
			(function () {
				let newCData = "\n";

				// storing new data in newCData
				localCData.forEach(function (data, i) {
					newCData += localCData[i].value + "\n";
				});

				// updating attributes
				xml.smxml.list.__cdata = newCData;

				// updating the xml
				getChildXml(JSONToXML(xml));

				clearTimeout(timer);
			}).bind(this),
			200
		);
	}

	// to add new option/item
	function addAfterPassedLimitCriteria() {
		// change the xml to json
		//let xml = XMLToJSON(state.xml);
		let xml = state.stateXMLToJSON;

		// update the cdata with new value
		xml.smxml.list.__cdata = xml.smxml.list.__cdata + "\n*Option value";

		/* It is used for update the data of 'xml.smxml.list._oldCData' after adding the new item to make it visible also in MultiGrid mode */
		if (xml.smxml.list._oldCData) {
			if (xml.smxml.list._oldCData.lastIndexOf('###') == xml.smxml.list._oldCData.length - 3) {
				xml.smxml.list._oldCData += '*Option value';
			} else {
				xml.smxml.list._oldCData += '###*Option value';
			}
		}

		// update and store the xml
		getChildXml(JSONToXML(xml));

		if (!xml.smxml.list._row && !xml.smxml.list._col) {
			var errMsg = smVal.validate(editorState.content_type, editorState.item, editorState.content_icon);
			smValidate(errMsg);
		}
	}

	//// Function call from multigrid item ////////////
	function moveToAdvance(e) {
		if (localCData.length >= 4) {
			if (localCData.length % 2 == 0) {
				$$invalidate(1, state.istoggled = !state.istoggled, state);
				$$invalidate(1, state.openImageDialog = true, state);
			} else {
				var temp = Math.sqrt(localCData.length);

				if (Number.isInteger(temp)) {
					$$invalidate(1, state.istoggled = !state.istoggled, state);
					$$invalidate(1, state.openImageDialog = true, state);
				} else {
					$$invalidate(1, state.istoggled = !state.istoggled, state);
					$$invalidate(1, state.openErrorDialog = true, state);
					$$invalidate(1, state.err_message = l$1.provide_value_suggestion, state);
				}
			}
		} else {
			$$invalidate(1, state.istoggled = !state.istoggled, state);
			$$invalidate(1, state.openErrorDialog = true, state);
			$$invalidate(1, state.err_message = l$1.min_row_col_value, state);
		}
	}

	// it update the attribute in lower case
	function updateAttrToLower(data) {
		let xml = data;
		let isLower = false;

		// convert headingCorrect attribute to headingcorrect
		if (xml.smxml.list._headingCorrect) {
			xml.smxml.list._headingcorrect = xml.smxml.list._headingCorrect;
			delete xml.smxml.list._headingCorrect;
			isLower = true;
		}

		// convert allowSort attribute to allowsort
		if (xml.smxml.list._allowSort) {
			xml.smxml.list._allowsort = xml.smxml.list._allowSort;
			delete xml.smxml.list._allowSort;
			isLower = true;
		}

		// convert isParagraph attribute to isparagraph
		if (xml.smxml.list._isParagraph) {
			xml.smxml.list._isparagraph = xml.smxml.list._isParagraph;
			delete xml.smxml.list._isParagraph;
			isLower = true;
		}

		// convert isSentence attribute to issentence
		if (xml.smxml.list._isSentence) {
			xml.smxml.list._issentence = xml.smxml.list._isSentence;
			delete xml.smxml.list._isSentence;
			isLower = true;
		}

		// update ans store the xml
		if (isLower == true) getChildXml(JSONToXML(xml));
	}

	// calls whenever there is change in option value and update the cdata accordingly
	function editCdata(i, isCorr, e) {
		$$invalidate(0, localCData[i].value = e.target.value, localCData);

		try {
			if (oldCData[i]) {
				if (oldCData[i].value.indexOf('##') > 0) {
					oldCData[i].value = oldCData[i].value.split('##')[0] + '##' + e.target.value;
				} else if (oldCData[i].value.indexOf('##') < 1 && oldCData[i].value.indexOf('!') == 0) {
					oldCData[i].value = '!' + e.target.value;
				} else {
					oldCData[i].value = e.target.value;
				}
			}
		} catch(error) {
			console.warn({ error });
		}

		//this.forceUpdate();
		// if answer is correct then add * 
		$$invalidate(
			0,
			localCData[i].value = isCorr == true
			? "*" + localCData[i].value
			: localCData[i].value,
			localCData
		);

		// xml to json
		//let xml = XMLToJSON(state.xml);
		let xml = state.stateXMLToJSON;

		setTimeout(
			(function () {
				let newCData = "\n", newoldCData = '###';

				// getting all values in newCData
				localCData.forEach(function (data, i) {
					newCData += localCData[i].value + "\n";
				});

				if (oldCData) {
					oldCData.forEach(function (data, index_no) {
						if (newoldCData == '') {
							newoldCData += oldCData[index_no].value;
						} else {
							newoldCData += '###' + oldCData[index_no].value;
						}
					});
				}

				// updating it in cdata
				xml.smxml.list.__cdata = newCData;

				/* For update the 'xml.smxml.list._oldCData' when textual data are changed in Normal mode */
				xml.smxml.list._oldCData = newoldCData;

				// update and store the xml
				getChildXml(JSONToXML(xml));
			}).bind(this),
			200
		);
	}

	// calls to remove the item
	function removeItem(data, id) {
		let a = "", newoldcdata_container = "";

		// getting all the values in a except the deleted one
		localCData.forEach(function (data, i) {
			if (localCData[i].id != id) {
				a += localCData[i].value + "\n";
			}
		});

		/* Checks if oldCData exist then after deletion the element it assigned left value in newoldcdata_container variable */
		if (oldCData) {
			oldCData.forEach(function (data, index_no) {
				if (oldCData[index_no].id != id) {
					if (newoldcdata_container == '') {
						newoldcdata_container += oldCData[index_no].value;
					} else {
						newoldcdata_container += '###' + oldCData[index_no].value;
					}
				}
			});
		}

		$$invalidate(1, state.open = false, state);

		// xml to json
		//let xml = XMLToJSON(state.xml);
		let xml = state.stateXMLToJSON;

		// update cdata
		xml.smxml.list.__cdata = a;

		/* For Assigning value in 'xml.smxml.list._oldCData' which is not deleted */
		xml.smxml.list._oldCData = newoldcdata_container;

		// update the cdata
		getChildXml(JSONToXML(xml));
	}

	const writable_props = ['xml', 'getChildXml', 'changed_advance_xml', 'editorState', 'smValidate'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ChooseNReorder> was created with unknown prop '${key}'`);
	});

	const click_handler = data => {
		($$invalidate(1, state.open = true, state), $$invalidate(1, state.data_value = data.value, state), $$invalidate(1, state.data_id = data.id, state));
	};

	const click_handler_1 = () => {
		$$invalidate(1, state.open = false, state);
	};

	function dialog_visible_binding(value) {
		if ($$self.$$.not_equal(state.open, value)) {
			state.open = value;
			$$invalidate(1, state);
		}
	}

	const close_handler = () => {
		$$invalidate(1, state.open = false, state);
	};

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(8, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(9, getChildXml = $$props.getChildXml);
		if ('changed_advance_xml' in $$props) $$invalidate(10, changed_advance_xml = $$props.changed_advance_xml);
		if ('editorState' in $$props) $$invalidate(11, editorState = $$props.editorState);
		if ('smValidate' in $$props) $$invalidate(12, smValidate = $$props.smValidate);
	};

	$$self.$capture_state = () => ({
		l: l$1,
		Button,
		Dialog,
		Checkbox,
		writable,
		AH: AH$1,
		XMLToJSON,
		JSONToXML,
		beforeUpdate,
		smVal,
		localCData,
		oldCData,
		state,
		xml,
		getChildXml,
		changed_advance_xml,
		editorState,
		smValidate,
		stateData,
		unsubscribe,
		isCorrect,
		loadModule,
		parseXMLAuthoring,
		addNewItem,
		updateSetting,
		updateCorrect,
		addAfterPassedLimitCriteria,
		moveToAdvance,
		updateAttrToLower,
		editCdata,
		removeItem
	});

	$$self.$inject_state = $$props => {
		if ('localCData' in $$props) $$invalidate(0, localCData = $$props.localCData);
		if ('oldCData' in $$props) oldCData = $$props.oldCData;
		if ('state' in $$props) $$invalidate(1, state = $$props.state);
		if ('xml' in $$props) $$invalidate(8, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(9, getChildXml = $$props.getChildXml);
		if ('changed_advance_xml' in $$props) $$invalidate(10, changed_advance_xml = $$props.changed_advance_xml);
		if ('editorState' in $$props) $$invalidate(11, editorState = $$props.editorState);
		if ('smValidate' in $$props) $$invalidate(12, smValidate = $$props.smValidate);
		if ('stateData' in $$props) stateData = $$props.stateData;
		if ('isCorrect' in $$props) $$invalidate(2, isCorrect = $$props.isCorrect);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*localCData*/ 1) {
			 {
				localCData.forEach(function (data, i) {
					$$invalidate(2, isCorrect[i] = data.value.charAt(0) == "*" ? true : false, isCorrect);
				});
			}
		}
	};

	return [
		localCData,
		state,
		isCorrect,
		addNewItem,
		updateSetting,
		updateCorrect,
		editCdata,
		removeItem,
		xml,
		getChildXml,
		changed_advance_xml,
		editorState,
		smValidate,
		click_handler,
		click_handler_1,
		dialog_visible_binding,
		close_handler
	];
}

class ChooseNReorder extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				xml: 8,
				getChildXml: 9,
				changed_advance_xml: 10,
				editorState: 11,
				smValidate: 12
			},
			add_css
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ChooseNReorder",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[8] === undefined && !('xml' in props)) {
			console_1.warn("<ChooseNReorder> was created without expected prop 'xml'");
		}

		if (/*getChildXml*/ ctx[9] === undefined && !('getChildXml' in props)) {
			console_1.warn("<ChooseNReorder> was created without expected prop 'getChildXml'");
		}

		if (/*changed_advance_xml*/ ctx[10] === undefined && !('changed_advance_xml' in props)) {
			console_1.warn("<ChooseNReorder> was created without expected prop 'changed_advance_xml'");
		}

		if (/*editorState*/ ctx[11] === undefined && !('editorState' in props)) {
			console_1.warn("<ChooseNReorder> was created without expected prop 'editorState'");
		}

		if (/*smValidate*/ ctx[12] === undefined && !('smValidate' in props)) {
			console_1.warn("<ChooseNReorder> was created without expected prop 'smValidate'");
		}
	}

	get xml() {
		throw new Error("<ChooseNReorder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<ChooseNReorder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<ChooseNReorder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<ChooseNReorder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get changed_advance_xml() {
		throw new Error("<ChooseNReorder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set changed_advance_xml(value) {
		throw new Error("<ChooseNReorder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<ChooseNReorder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<ChooseNReorder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get smValidate() {
		throw new Error("<ChooseNReorder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set smValidate(value) {
		throw new Error("<ChooseNReorder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default ChooseNReorder;
//# sourceMappingURL=ChooseNReorder-9519429f.js.map
