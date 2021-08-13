
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { O as JUI, a7 as l, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, M as append_styles, v as validate_slots, e as element, f as space, j as attr_dev, k as add_location, n as insert_dev, p as append_dev, B as noop, x as detach_dev, g as globals, L as beforeUpdate, A as AH, o as onMount, a9 as afterUpdate, X as XMLToJSON, w as writable, c as create_component, l as set_style, m as mount_component, q as listen_dev, G as prop_dev, t as transition_in, a as transition_out, b as destroy_component, H as run_all } from './main-55b2d529.js';

/**
 *  File Name   : chartAuthoringScript.js
 *  Author      : Ayush Srivastava
 *  Function    : Chart
 *  Version     : 1.0
 *  Packege     : clsSMChart (Authoring)
 *  Last update : 15 Mar 2021
 *  Dependency  : JUI
 */
const JS = new JUI();
let CHART_AUTH = {};
CHART_AUTH.isValid = true;
CHART_AUTH.visible_class = '';

// function for data storage of chart
CHART_AUTH.storage = {
    store: function(obj, key, val) {
        if (!obj) {
            return this.state;
        } else if (!key) {
            if (!(obj in this.state)) {
                return {};
            }
            return this.state[obj];
        } else if (arguments.length < 3) {
            if (!(obj in this.state)) {
                return undefined;
            }
            return this.state[obj][key];
        } else {
            if (!(obj in this.state)) {
                this.state[obj] = {};
            }
            this.state[obj][key] = val;
        }
    },
    remove: function(obj) {
        if (this.state[obj]) {
            delete this.state[obj];
        }
    },
    state: {}
};

// function used for initiating the chart and drawing the chart
CHART_AUTH.initChart = function () {
    if (JS.select('#special_module_xml').value && JS.select('#special_module_xml').value.trim() != '') {
        CHART_AUTH.bind_data(JS.parseHtml(JS.select('#special_module_xml').value));
    }
    let chart_main = JS.selectAll('#chartmain [type]');
    for (let index = 0; index < chart_main.length; index++) {
        // object that contains the attributes as key and their values as value of chart tag inside smxml tag of xml
        let attrs = CHART_AUTH.setInAssoc(CHART_AUTH.storage.store('#'+chart_main[index].id,'attributes'));
        // // draw the chart according to the value of variable 'attrs'
        CHART_AUTH.drawChart(attrs);
    }
};

// function for checking inNumeric in js
CHART_AUTH.isNumeric = function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
};

/* for checking that everything is perfect and under validation criteria then removes the showError class from each elements where it was exist before */
CHART_AUTH.checkAndRemove = function () {
    // used for check that validation is ok or not
    let check_count = 0;
    // contains all element where validation needed
    let elem_data = JS.selectAll('#authoring-modal .validate');
    for (let index_no = 0; index_no < elem_data.length; index_no += 1) {
        if ((elem_data[index_no].value == '') || (elem_data[index_no].classList.contains('num') && elem_data[index_no].value < 1) || (!(CHART_AUTH.isNumeric(elem_data[index_no].value)) && elem_data[index_no].classList.contains('num'))) {
            check_count += 1;
        }
    }

    let check_count_condition = (parseInt(JS.select('#xinterval').value) >= parseInt(JS.select('#xmax').value)) || (parseInt(JS.select('#yinterval').value) >= parseInt(JS.select('#ymax').value)) || (parseInt(JS.select('#xmin').value) >= parseInt(JS.select('#xmax').value)) || (parseInt(JS.select('#ymin').value) >= parseInt(JS.select('#ymax').value)) ;

    if (check_count_condition) {
        check_count += 1;
    }

    if (check_count == 0) {
        // removes 'showError' class from all elements where it was exist before if values are under validation
        JS.selectAll('.showError', 'removeClass','showError');
    }
};

// returns an object containing keys as attributes name and values as their values of the element passed in argument at the time of function calling
CHART_AUTH.setInAssoc = function (attrs) {
    let ret = {};
    if (attrs) {
        for (let index = 0; index < attrs.length; index++) {
            ret[attrs[index].name] = attrs[index].value;
        }
    }
    return ret;
};

// used for bind the attributes and their values of chart tag defined in smxml tag of xml in chart board containers attributes and values
CHART_AUTH.bind_data = function (xml) {
    let elem = '[type="' + xml.getAttribute('type') + '"]', attrs = [];
    if (xml) {
        if (xml.nodeName == "SMXML") {
            elem = "#chartmain";
        }
        
        // assign the data of available attributes and their value in attrs array in form of object
        for (let index = 0; index < xml.attributes.length; index++) {
            attrs[index] = {
                "name": xml.attributes[index].name,
                "value": xml.attributes[index].value
            };
        }

        if (typeof elem != "undefined") {
            // assign the value of attrs array in the xml tag's attributes according to their type attribute
            CHART_AUTH.storage.store('#'+ JS.select(elem).id, "attributes", attrs);
        }

        // checks if perticular xml tag have any other tag then also assign it's attributes and values and so on
        if (xml.children.length > 0) {
            for (let index = 0; index < xml.children.length; index++) {
                CHART_AUTH.bind_data(xml.children[index]);
            }
        }
    }
};

// used for removing error messages
CHART_AUTH.resetModal = function () {
    CHART_AUTH.isValid = true;
    JS.selectAll('input', 'removeAttr', 'style');
    JS.selectAll('.error', 'remove');
    JS.selectAll('.showError', 'removeClass','showError');
};

// shows the edit modalbox when it is clicked
CHART_AUTH.elemModal = function (type, key) {
    CHART_AUTH.resetModal();
    // hides the body content of the edit modalbox
    JS.selectAll('#authoring-modal .modal-body>.h', 'addClass', 'h');
    JS.listen('body', 'click', '.addElement', function () {
        if (CHART_AUTH.isValid == true && JS.selectAll('#authoring-modal .showError').length == 0) {
            // hides the edit modalbox if edited all field are under validation criteria
            JS.getBS('#authoring-modal', 'Modal').hide();
            if (JS.select('#authoring-modal #chart-type').value == 'dotplot') {
                // it will not work in any condition as there are only 3 types of chart used here column, line, histogram              
                JS.selectAll('#chartmain .setData', 'addClass', 'h');
            } else {
                // shows the '+' (add) and 'delete' button     
                JS.selectAll('#chartmain .setData', 'removeClass', 'h');
            }
            // updates the values of chart board container and also of xml according to the values changed in edit modalbox
            CHART_AUTH.updateElem(type, key);
        } else {
            if (JS.select('#authoring-modal .showError').nodeName) {
                JS.select('#authoring-modal .showError').focus();
                CHART_AUTH.validate(JS.select('#authoring-modal .showError'));
            }
        }
    });

    if (type == 'plotchart') {
        // changed the title of the edit modalbox
        JS.select('#authoring-modal .title').innerText = 'Plot Chart';
        // shows the edit modalbox body            
        JS.selectAll('#authoring-modal .plotchart', 'removeClass', 'h');
    }
    CHART_AUTH.visible_class = type;
    // shows the edit modalbox
    JS.getBS('#authoring-modal', 'Modal').show();
    if (key) {
        // used for set the data of elements exist in edit modalbox
        CHART_AUTH.setData(CHART_AUTH.storage.store('#' + key, 'attributes'));
    }
    CHART_AUTH.changeType(JS.select('#authoring-modal #chart-type'));
};

// updates the values of chart board container and also of xml according to the values changed in edit modalbox
CHART_AUTH.updateElem = function (type, key) {
    let attributes_list = JS.find(JS.select('#authoring-modal .' + CHART_AUTH.visible_class), 'select, textarea, input', 'all');
    let attributes = CHART_AUTH.serialize(attributes_list);
    let charttype, title, xlab, ylab, xval = '', yval, xmin, xmax, xint, ymin, ymax, yint, defans, color, snapTo, where;
    let attr = [], wd, hd;
    // used for define the x-axis values
    let interval_array = [];
    // find_index used for contain the xmax index in attributes array and defaultans_index used for contain the index of the defaultans field
    let find_index, defaultans_index;
    // loops through all existing array of object containing the name and value of selectbox, textarea and inputbox and assign their values in defined variables
    for (let index = 0; index < attributes.length; index++) {
        let value = attributes[index];
        // used for contain the value of width
        if (value.name == "width") wd = value.value;
        // used for contain the value of height
        if (value.name == "height") hd = value.value;
        // used for contain the value of chart type
        if (value.name == "type") charttype = value.value;
        // used for contain the value of color
        if (value.name == "color") color = value.value;
        // used for contain the value of snapTo
        if (value.name == "snapto") snapTo = value.value;
        // used for contain the value of title
        if (value.name == "title") title = value.value;
        // used for contain the value of x-axis label
        if (value.name == "xlabel") xlab = value.value;
        // used for contain the value of y-axis label
        if (value.name == "ylabel") ylab = value.value;
        // used for contain the value of xval
        if (value.name == "xval") xval = value.value;
        // used for contain the value of yval
        if (value.name == "yval") yval = value.value;
        // used for contain the minimum value of x-axis
        if (value.name == "xmin") xmin = value.value;
        // used for contain the value of xmax field and also contain the index of xmax field in 'find_index' variable
        if (value.name == "xmax") {
            xmax = value.value;
            find_index = index;
        }
        // used for contain the value of x-axis interval
        if (value.name == "xinterval") xint = value.value;
        // used for contain the value of yman field
        if (value.name == "ymin") ymin = value.value;
        // used for contain the value of ymax field
        if (value.name == "ymax") ymax = value.value;
        // used for contain the value of y-axis interval
        if (value.name == "yinterval") yint = value.value;
        // used for contain the value of defaultans field and also contain the index of defaultans field in 'defaultans_index' variable
        if (value.name == "defaultans") {
            defans = value.value;
            defaultans_index = index;
        }
        // assign the name of the fields as keys and their values as values in attr array 
        attr[value.name] = value.name;
    }
    // parses ymin field value into interger value
    ymin = parseInt(ymin);
    // parses yint variable value into interger value
    yint = parseInt(yint);
    // For update the x-axis interval according to update the min, max, interval value using chartModalbox
    let int_interval = parseInt(xint);
    for (let index_no = parseInt(xmin); index_no <= parseInt(xmax); index_no += int_interval) {
        // pushes the value of variable 'index_no' into array 'interval_array' for define the x-axis values
        interval_array.push(index_no);
    }
    if (interval_array.length <= defans.split(',').length) {
        // changed the value of xmax after adding the value of variable 'int_interval' into its previous value
        xmax = parseInt(xmax) + int_interval;
        if (xmax % int_interval != 0) {
            // change the value of xmax when reminder is greater than 0 after division of xmax by int_interval
            xmax = (xmax - (xmax % int_interval)) + int_interval;
        }
        // change the xmax value defined in attributes array
        attributes[find_index].value = xmax.toString();
    }
    // change the defaultans value defined in attributes array to escape non visibilty when interval value is 100 or 1000 times greater than default adding value when added after click on add button
    attributes[defaultans_index].value = (Math.ceil(ymin + yint / 5) + ',' + Math.ceil(ymin + yint / 4) + ',' + Math.ceil(ymin + yint / 3)).toString();
    if (xval == '') {
        for (let i = parseInt(xmin); i <= parseInt(xmax); i = i + parseInt(xint)) {
            xval = (xval == '') ? i : xval + ',' + i;
        }
        // wraps the value of the variable 'xval'
        xval = '[' + xval + ']';
    }

    if (key && type == "plotchart") {
        // selects chart board container
        where = '[id="' + key + '"]';
        // assign the attributes and their values of chart board container
        JS.setAttr(where, {
            "type": charttype,
            "class": charttype,
            "color": color,
            "title": title,
            "xlabel": xlab,
            "ylabel": ylab,
            "xval": xval,
            "yval": yval,
            "xmin": xmin,
            "xmax": xmax,
            "xinterval": xint,
            "ymin": ymin,
            "ymax": ymax,
            "yinterval": yint,
            "snapTo": snapTo,
            "defaultans": defans
        });

        CHART_AUTH.storage.store('#' + key, 'attributes', attributes);
        CHART_AUTH.storage.store('#chartmain', 'attributes', attributes);

        JS.setCss('#chartmain', {
            width: wd + 'px',
            height: parseInt(hd) + 41 + 'px'
        });

        JS.selectAll('#chartmain [id^="ID"]', 'css', {
            width: wd + 'px',
            height: hd + 'px'
        });

        // object containing keys as attributes name and values as their values of chart board container
        attr = CHART_AUTH.setInAssoc(CHART_AUTH.storage.store('#chartmain', 'attributes'));
        // updates id and xval keys value of object attr
        attr.id = key;
        attr.xval = xval;
        // draw the chart according to the value of attributes defined in object attr
        CHART_AUTH.drawChart(attr);
    }
    // updates the xml after removing the unnecessary attributes and also that one which have blank value
    CHART_AUTH.updateXML(where, attributes);
};

// function used for serializing
CHART_AUTH.serialize = function(element) {
    let serialize = [];
    for (let index = 0; index < element.length; index++) {
        if (element[index].getAttribute('type') == 'radio' || element[index].getAttribute('type') == 'checkbox') {
            if (element[index].checked) {
                serialize[serialize.length] = {
                    "name": element[index].name,
                    "value": 1
                };
            }
        } else if (element[index].name && !element[index].disabled) {
            serialize[serialize.length] = {
                "name": element[index].name,
                "value": element[index].value
            };
        }
    }
    return serialize;
};

// used for set the data of elements exist in edit modalbox
CHART_AUTH.setData = function(attributes) {
    for (let index = 0; index < attributes.length; index += 1) {
        // select the input field according to attributes at perticular index
        let element = JS.select('#authoring-modal .' + CHART_AUTH.visible_class + ' [name="' + attributes[index]['name'] + '"]');
        // sets the value of input fields 
        element.value = attributes[index]['value'];
    }
};

// updates the xml after removing the unnecessary attributes and also that one which have blank value
CHART_AUTH.updateXML = function(where, attributes) {
    if (JS.select('#special_module_xml').value && JS.select('#special_module_xml').value.trim() != '') {
        let xmlDom = JS.parseHtml(JS.select('#special_module_xml').value);
        let insert;
        if (where == "#chartmain") {
            // selects the smxml element
            insert = xmlDom;
        } else {
            // selects the chart element
            insert = JS.find(xmlDom, where);
        }
        if (insert.nodeName) {
            for (let index_no = 0; index_no < attributes.length; index_no += 1) {
                if (attributes[index_no].value !== "") {
                    // sets the attributes and their values with the name and value as defined in array of object 'attributes' at index  that is equals to the value of variable 'i'
                    insert.setAttribute(attributes[index_no].name, attributes[index_no].value);
                    if (attributes[index_no].name == 'xaxis_radio') {
                        // removes the attribute if their name is 'xaxis_radio'
                        insert.removeAttribute(attributes[index_no].name);
                    }
                } else {
                    // removes the attributes which values are blank
                    insert.removeAttribute(attributes[index_no].name);
                }
            }
            // defines the value of correct answer
            insert.setAttribute('correctans', CHART_AUTH.resetCorrectans(insert.getAttribute('type'), insert.getAttribute('defaultans')));
        }
        // update the xml
        JS.select("#special_module_xml").value = CHART_AUTH.formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom));
    }
};

// used for set the format of correct answer values 
CHART_AUTH.resetCorrectans = function (type, defans) {
    // contains the value of variable defans in json format
    defans = JSON.parse("[" + defans + "]");
    // contains string '|'
    let res = '|';
    // loops through the each values of json assigned into variable 'defans'
    for (let index = 0; index < defans.length; index++) {
        // need to check
        if (type == 'dotplot') {
            res = res + index + ',' + defans[index] * 10 + '|';
        } else {
            res = res + index + ',' + defans[index] + '|'; 
        }
    }
    // returns the formatted data
    return res;
};

// used for draw the chart
CHART_AUTH.drawChart  = function (attrs) {
    let xaxis = [],
    id = attrs.id,
    type = attrs.type,
    color = attrs.color,
    cans = '',
    gpad = 0.2,
    lspace,
    snapTo = attrs.snapto,
    defaultans = JSON.parse("[" + attrs.defaultans + "]"),
    correctAns = [],
    multiColor = false,
    simple_plot = true;
    
    if (attrs.correctans && attrs.correctans.length > 0) {
        // contain the correct answer value in array
        let tempCorrectAns = attrs.correctans.split('|');
        tempCorrectAns.map(function(item) {
            item = item.split(',');
            if (item[1]) {
                correctAns.push(+item[1]);
            }
        });
    }
    // contains the xmin value 
    let initial_point = parseInt(attrs.xmin);
    // contains the xmax value 
    let end_point = parseInt(attrs.xmax);
    // contains the xinterval value 
    let inc_interval = parseInt(attrs.xinterval);
    for (let index_no = initial_point; index_no <= end_point; index_no += inc_interval) {
        // used for update the x-axis value
        xaxis.push(index_no);
    }

    if (type == 'histogram') {
        multiColor = true;
        type = 'column';
        gpad = 0;
        color = 'transparent';
    }
    // it is not in use as there are only 3 type which are used here and they are: bar/column, line, histogram
    if (type == 'dotplot') {
        simple_plot = false;
        type = 'column';
        attrs.ylabel = '';
        lspace = 40;
        for (let index_no = 0; index_no < defaultans.length; index_no += 1) {
            defaultans[index_no] = parseInt(defaultans[index_no]) * 10;
        }
    }
    // placeholder for all other members, and various utility functions. The most important member of the namespace would be the chart constructor.
    let chart = new Highcharts.Chart({
        chart: {
            // The HTML element where the chart will be rendered
            renderTo: id,
            // disabled the animation throughout the chart
            animation: false,
            // An explicit width for the chart
            width: attrs.width - 2,
            // An explicit height for the chart
            height: attrs.height - 2,
            // The space between the right edge of the chart and the content (plot area, axis title and labels, title, subtitle or legend in top position)
            spacingRight: 40,
            // The space between the left edge of the chart and the content (plot area, axis title and labels, title, subtitle or legend in top position)
            spacingLeft: lspace
        },
        credits: {
            // Highchart by default puts a credits label in the lower right corner of the chart. This option changed this feature
            enabled: false
        },
        legend: {
            // The legend is a box containing a symbol and name for each series item or point item in the chart. By setting value 'false' it disable the legend
            enabled: false
        },
        title: {
            // Adds title on top of the legend
            text: attrs.title
        },
        // Options for the tooltip that appears when the user hovers over a series or point
        tooltip: {
            // Enable the tooltip
            enabled: true,
            // Used for how many decimals to show in each series' y value
            valueDecimals: 0,
            // Used for format the cluster tooltip
            formatter: function() {
                return Math.round(this.y)
            }
        },
        xAxis: {
            // defines x-axis categories
            categories: xaxis,
            // defines the width of the grid lines extending the ticks across the plot area
            gridLineWidth: simple_plot,
            // defines the color of the line marking the axis itself
            lineColor: 'black',
            // Used for categorized axes only. Here it denotes that the tick mark is placed in the center of the category
            tickmarkPlacement: 'on',
            // denotes the minimum value of the axis
            min: 0,
            // The axis title, showing next to the axis line
            title: {
                text: attrs.xlabel
            }
        },
        yAxis: [{
                // defines the width of the grid lines extending the ticks across the plot area
                gridLineWidth: simple_plot,
                // defines the width of the line marking the axis itself
                lineWidth: simple_plot,
                // defines the color of the line marking the axis itself
                lineColor: 'black',
                // not allow decimals in this axis' ticks
                allowDecimals: false,
                // defines the lowest allowed value for automatically computed axis extremes
                floor: parseInt(attrs.ymin),
                // defines the maximum value of the axis
                max: parseInt(attrs.ymax),
                // defines the minimum value of the axis
                min: parseInt(attrs.ymin),
                // defines the interval of the tick marks in axis units
                tickInterval: parseInt(attrs.yinterval),
                // defines the minimum tick interval allowed in axis values
                minTickInterval: 0,
                // defines the axis title, showing next to the axis line
                title: {
                    text: attrs.ylabel
                },
                // shows the number or category for each tick
                labels: {
                    enabled: simple_plot
                }
            },
            {
                // define the width of the line marking the axis itself
                lineWidth: simple_plot,
                // defines the color of the line marking the axis itself
                lineColor: '#C0C0C0',
                // allow to display the axis on the opposite side of the normal  
                opposite: true,
                // used for actual text of the axis title
                title: {
                    text: ''
                }
            }
        ],
        series: [{
            // An array of data points for the series
            data: (correctAns.length > 0) ? correctAns : defaultans,
            // Enable dragging in the Y dimension      
            draggableY: true,
            // Used as main color of the series
            color: color,
            // Set the minimum Y value the points can be moved to
            dragMinY: parseInt(attrs.ymin),
            // not clear why it is used
            snapgrid: snapTo,
            // Set the maximum Y value the points can be moved to
            dragMaxY: parseInt(attrs.ymax),
            // define the type of series
            type: type,
            // The minimal height for a column or width for a bar
            minPointLength: 1
        }],
        plotOptions: {
            series: {
                // Enable the mouse tracking for a specific series
                enableMouseTracking: true,
                // When using automatic point colors pulled from the global colors or series-specific 'plotOptions.column.colors' collections, this option determines whether the chart should receive one color per series or one color per point
                colorByPoint: multiColor,
                // used for style the cursor
                cursor: 'ns-resize',
                // defines the color of the border surrounding each column or bar
                borderColor: color,
                // Padding between each column or bar, in x axis units
                pointPadding: 0,
                // Padding between each value groups, in x axis units
                groupPadding: gpad,
                // The width of the border surrounding each column or bar
                borderWidth: simple_plot,
                // dashStyle:'dot',
                point: {
                    events: {
                        // Callback that fires when the point is dropped
                        drop: function() {
                            // contains the x and y value separated by comma (,)
                            cans = this.x + ',' + Math.round(this.y);
                            // sets the value of correctans attribute of chart tag exist in xml when position of column or point changes
                            CHART_AUTH.setAnswerkey(id, cans);
                        },
                        // Callback that fires while dragging a point
                        drag: function() {
                            if (!simple_plot) {
                                // calculate the height
                                let ht = (100 * snapTo) / this.y + '%';
                                // updates the pattern, width, height, dotcolor etc
                                chart.series[0].data[this.x].update({
                                    color: {
                                        pattern: ' ',
                                        width: '100%',
                                        height: ht,
                                        dotClr: color,
                                        cxWdth: cxWdth
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });
    if (!simple_plot) {
        let cxWdth = JS.select('.highcharts-series-group rect').getAttribute('width');
        for (let index = 0; index < defaultans.length; index++) {
            // calculates the height
            let ht = (100 * snapTo) / defaultans[index] + '%';
            // updates the value of y, pattern, width, height, dotcolor etc
            chart.series[0].data[index].update({
                y: parseInt(defaultans[index]),
                color: {
                    pattern: ' ',
                    width: '100%',
                    height: ht,
                    dotClr: color,
                    cxWdth: cxWdth
                }
            });
        }
    }
};

// used for add or remove the columns or points on the chart board or from chart board
CHART_AUTH.updatePoint = function (type, id) {
    // selects smxml tag of xml
    if (JS.select('#special_module_xml').value && JS.select('#special_module_xml').value.trim() != '') {
        // getting instance of chart
        
        let charts = Highcharts.charts, chart1;
        charts.forEach(function(chart) {
            if (chart && chart.renderTo.id === id) {
                chart1 = chart;
            }
        });
        if (typeof chart1 == "object") {
            let xmlDom = JS.parseHtml(JS.select('#special_module_xml').value),
            insert = JS.find(xmlDom, '#' + id),
            // A series is a set of data, for example a line graph or one set of columns. All data plotted on a chart comes from the series object
            series = chart1.series[0],
            // contains the value of attribute 'correctans' of chart tag
            cans = insert.getAttribute('correctans'),
            // contains the value of attribute 'xmax' of chart tag after parsing it in integer
            xmax_val = parseInt(insert.getAttribute('xmax')),
            // contains the value of attribute 'xinterval' of chart tag after parsing it in integer
            xinterval_val = parseInt(insert.getAttribute('xinterval')),
            // used to manage the xmax value when it goes over its defined xmax value
            arr_data = [],
            // contains the value of attribute 'ymin' of chart tag after parsing it in integer
            ymin_val = parseInt(insert.getAttribute('ymin')),
            // contains the value of attribute 'xmin' of chart tag after parsing it in integer
            xmin_val = parseInt(insert.getAttribute('xmin')),
            // contains the value of attribute 'yinterval' of chart tag after parsing it in integer
            yinterval_val = parseInt(insert.getAttribute('yinterval')),
            // contains the no of column or point plotted on chart board
            xaxisVal = series.data.length;

            if (type == 'addPoint') {
                // sets the default value of column/point
                let val = (ymin_val < yinterval_val / 10) ? yinterval_val / 10 : ymin_val + yinterval_val / 10;
                // rounds up the column/point value
                val = Math.ceil(val);
                // adds the points to the series
                series.addPoint([xaxisVal, val]);
                // adds the index and value of added column/point in correctans attribute of chart tag of xml
                insert.setAttribute('correctans', cans + (series.data.length - 1) + ',' + val + '|');
                /* Managed Interval Issue Performed Using Add Button In Case Of More Than Max Value Of X-Interval On Authoring Area */
                for (let index_no = xmin_val; index_no <= xmax_val; index_no += xinterval_val) {
                    // pushes the value from min value to max value in interval defined in variable 'xinterval_val' in array 'arr_data'
                    arr_data.push(index_no.toString());
                }
                if (xaxisVal >= arr_data.length) {
                    // contains value after adding the interval value in last value of array 'arr_data'
                    let auth_last_value = (parseInt(arr_data[arr_data.length - 1]) + xinterval_val).toString();
                    // pushes the value of variable 'auth_last_value' in 'arr_data' array
                    arr_data.push(auth_last_value);
                    // sets the value of xmax attribute of chart tag of xml
                    insert.setAttribute('xmax', auth_last_value);
                    // Set new axis categories and optionally redraw
                    chart1.xAxis[0].setCategories(arr_data);
                }
            }
            if (type == 'removePoint') {
                // need to check
                let ans, idx, str;
                if (xaxisVal > 1) {
                    // removes the last plotted column or point on chart board
                    let point_id = chart1.series[0].data[xaxisVal - 1].id;
                    chart1.series[0].data[xaxisVal - 1].remove();
                    point_id && JS.select('[point-id = "' + point_id + '"]', 'remove');
                    // contains value with '|' + exist no of plotted column/point on chart board  
                    ans = '|' + series.data.length;
                    // find the index of sting defined in variable 'ans' in string defined in variable 'cans' 
                    idx = cans.indexOf(ans);
                    if (idx >= 0) {
                        // contains the string extracted from string defined in variable 'cans' that starts with index defined in variable 'idx' and goes to index'|' + value of variable 'idx' after adding value 1 in its previous value
                        str = cans.slice(idx, cans.indexOf('|', idx + 1));
                        // replaces string defined in variable 'str' with blank in variable 'cans'
                        cans = cans.replace(str, '');
                        // removes '|' symbol from start and end of the string exist in 'cans' variable
                        cans = cans.substring(1, cans.length - 1);
                    }
                    // sets the correctans attribute value of chart tag of xml
                    insert.setAttribute('correctans', '|' + cans + '|');
                } else {
                    // warning messege when tried to delete the column or point that is only left on chart board and no any more column/point exist
                    //JS.showmsg("Default Item(s) can not be Deleted", 3000);
                    JS.alert("Default Item(s) can not be Deleted");
                }
            }

            // update the xml
            JS.select("#special_module_xml").value = CHART_AUTH.formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom));
        }
    }
};

// sets the value of correctans attribute of chart tag exist in xml when position of column or point changes
CHART_AUTH.setAnswerkey = function (mid, cans) {
    // selects smxml tag of xml
    if (JS.select('#special_module_xml').value && JS.select('#special_module_xml').value.trim() != '') {
        let xmlDom = JS.parseHtml(JS.select('#special_module_xml').value);
        // selects chart tag of xml
        let insert = JS.find(xmlDom ,'#' + mid);
        // finds the index of column or point that is re-positioned, plotted on chart board
        let temp = cans.split(',')[0];
        // contains the all plotted points or column with their index and value separated by comma and wrapped within '|' symbol
        let set = insert.getAttribute("correctans"), idx;
        temp = '|' + temp + ',';
        if (set == undefined || set == "") {
            // wraps the value of variable 'cans' with symbol '|' and assign in correctans attribute
            insert.setAttribute('correctans', '|' + cans + '|');
        } else {
            // finds the index of re-positioned column/point in correct answer string
            idx = set.indexOf(temp);
            if (idx >= 0) {
                // contains the previous 'x' and 'y' value separated by comma with prefix '|' of the column/point which is re-positioned
                let str = set.slice(idx, set.indexOf('|', idx + 1));
                // replaces previous value of x and y separated by comma with prefix '|' of column/point that is re-positioned with value store in variable 'cans' with prefix '|' of correct answer string 
                set = set.replace(str, '|' + cans);
                // sets the value of variable 'cans' with value of variable 'set' after removing the symbol '|' from start and end 
                cans = set.substring(1, set.length - 1);
            } else {
                // sets the value of variable 'cans' with value of variable 'set' after removing the symbol '|' from start and end and also add the value of variable 'cans' with prefix '|'
                cans = set.substring(1, set.length - 1) + '|' + cans;
            }
        }
        // senotes array of object containing keys as name and value which contains the value of attribute name and value of attribute
        let attributes = CHART_AUTH.storage.store('#' + mid, 'attributes');
        for (let index = 0; index < attributes.length; index++) {
            if (attributes[index].value !== "") {
                // sets the attribute name and value with value of key 'name' and 'value' defined in array of object 'attributes' at index that is equals to the value of variable 'i'
                insert.setAttribute(attributes[index].name, attributes[index].value);
            }
        }
        // sets the attribute 'correctans' with value wraped in symbol '|' defined in variable 'cans' 
        insert.setAttribute("correctans", '|' + cans + '|');
        // update the xml
        JS.select("#special_module_xml").value = CHART_AUTH.formatXml(xmlDom.xml ? xmlDom.xml : (new XMLSerializer()).serializeToString(xmlDom));
    }
};

// used to format the xml and according to this can be seen an updated graph view.
CHART_AUTH.formatXml = function (xml) {
    /* pattern of finding data where closing, opening angular bracket found together and optionally backslash meets but i think pattern is wrong */
    let reg = /(>)(<)(\/*)/g;
    /* pattern to match all spaces and then any characters and then one or more numbers of spaces and character back slash and n meets together */
    let wsexp = / *(.*) +\n/g;
    /* pattern for matching any data between open and closing angular bracket and one or more number of back slash and n character where meets together */
    let contexp = /(<.+>)(.+\n)/g;
    // replaces back slash and t characters where both meets together to blank
    xml = xml.replace(/\t/g, "");
    // replaces the matching pattern from xml to given data
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
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
            if (fromTo == 'opening->closing') {
                formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
            } else {
                // if opening and closing tab not found then adds tab then charaters and line break character
                formatted += padding + ln + '\n';
            }
        }
    }
    // returns formatted xml
    return formatted;
};

// function for validating the inputs
CHART_AUTH.validate = function (current) {
    if (current.nodeName) {
        CHART_AUTH.isValid = false;
        JS.selectAll('.error', 'remove');
        JS.setCss(current, {
            //border: '1px solid red',
            //background:  "#FFCECE"
        });
        if (current.value == '') {
            current.classList.add('showError');
            JS.insert(current.parentElement, '<span class="error text-danger">' + l.fill_field + '</span>', 'beforeend');
        } else if ( current.classList.contains('num') && current.value < 1) {
            current.classList.add('showError');
            JS.insert(current.parentElement, '<span class="error text-danger">' + l.value_gt_one + '</span>', 'beforeend');
        } else if (parseInt(JS.select('#xinterval').value) >= parseInt(JS.select('#xmax').value)) {
            JS.insert(JS.select('#xmax').parentElement, '<span class="error text-danger">' + l.value_gt_interval + '</span>', 'beforeend');
            JS.select('#xmax').classList.add('showError');
        } else if (parseInt(JS.select('#yinterval').value) >= parseInt(JS.select('#ymax').value)) {
            JS.insert(JS.select('#ymax').parentElement, '<span class="error text-danger">' + l.value_gt_interval + '</span>', 'beforeend');
            JS.select('#ymax').classList.add('showError');
        } else if (parseInt(JS.select('#xmin').value) >= parseInt(JS.select('#xmax').value)) {
            JS.insert(JS.select('#xmax').parentElement, '<span class="error text-danger">' + l.value_gt_min + '</span>', 'beforeend');
            JS.select('#xmax').classList.add('showError');
        } else if (parseInt(JS.select('#ymin').value) >= parseInt(JS.select('#ymax').value)) {
            JS.insert(JS.select('#ymax').parentElement, '<span class="error text-danger">' + l.value_gt_min + '</span>', 'beforeend');
            JS.select('#ymax').classList.add('showError');
        } else if (!CHART_AUTH.isNumeric(current.value) && current.classList.contains('num')) {
            JS.insert(current.parentElement, '<span class="error text-danger">' + l.enter_number + '</span>', 'beforeend');
            current.classList.add('showError');
        } else {
            CHART_AUTH.isValid = true;
            current.classList.remove('showError');
            JS.setCss(current, {
                border: '1px solid #ced4da',
                background:  "none"
            });
            if (JS.selectAll('.showError').length > 0) {
                // removes the 'showError' class from each element if all the elements passes the validation criteria
                CHART_AUTH.checkAndRemove();
            }
        }
    }
};

// function for changing the chart type
CHART_AUTH.changeType = function (current) {
    if (current.nodeName) {
        let value = current.value;
        JS.select('#snapto').readOnly = (value == 'dotplot');
        JS.select('#ylabel').readOnly = (value == 'dotplot');
        JS.select('#ymin').readOnly = (value == 'dotplot');
        JS.select('#ymax').readOnly = (value == 'dotplot');
        JS.select('#yinterval').readOnly = (value == 'dotplot');
        if (value == 'dotplot') {
            JS.select('#color').readOnly = false;
        } else {
            JS.select('.details').style.display = 'block';
            JS.select('#color').disabled = (value == 'histogram');
        }
        //JS.select('#chart_title').value = (value == 'histogram') ? 'Histogram' : ((value == 'line') ? 'Line Chart' : 'Bar Chart');
    }
};

/* clsSMChart\lib\ChartModalBox.svelte generated by Svelte v3.40.2 */
const file = "clsSMChart\\lib\\ChartModalBox.svelte";

function add_css(target) {
	append_styles(target, "svelte-m11977", "input[type=number].svelte-m11977::-webkit-inner-spin-button,input[type=number].svelte-m11977::-webkit-outer-spin-button{-webkit-appearance:none;-moz-appearance:none;appearance:none}.modal_height.svelte-m11977{max-height:350px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhcnRNb2RhbEJveC5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBZ0lJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxlQUFDLDJCQUEyQixDQUM3QyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sZUFBQywyQkFBMkIsQUFBQyxDQUFDLEFBQzNDLGtCQUFrQixDQUFFLElBQUksQ0FDeEIsZUFBZSxDQUFFLElBQUksQ0FDckIsVUFBVSxDQUFFLElBQUksQUFDcEIsQ0FBQyxBQUNELGFBQWEsY0FBQyxDQUFDLEFBQ1gsVUFBVSxDQUFFLEtBQUssQUFDckIsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJDaGFydE1vZGFsQm94LnN2ZWx0ZSJdfQ== */");
}

function create_fragment(ctx) {
	let div41;
	let div40;
	let div39;
	let div0;
	let h4;
	let t1;
	let button0;
	let t3;
	let div37;
	let div36;
	let div9;
	let div4;
	let div3;
	let label0;
	let div1;
	let div2;
	let t5;
	let input0;
	let t6;
	let div8;
	let div7;
	let label1;
	let div5;
	let div6;
	let t8;
	let input1;
	let t9;
	let div14;
	let div12;
	let label2;
	let div10;
	let div11;
	let t11;
	let select0;
	let option0;
	let option1;
	let option2;
	let t15;
	let div13;
	let label3;
	let t17;
	let input2;
	let t18;
	let div17;
	let div15;
	let label4;
	let t20;
	let input3;
	let t21;
	let div16;
	let label5;
	let t23;
	let input4;
	let t24;
	let div22;
	let div20;
	let label6;
	let div18;
	let div19;
	let t26;
	let input5;
	let t27;
	let small;
	let t29;
	let div21;
	let label7;
	let t31;
	let select1;
	let option3;
	let option4;
	let option5;
	let option6;
	let t36;
	let div31;
	let div26;
	let label8;
	let t38;
	let div23;
	let label9;
	let t40;
	let input6;
	let t41;
	let div24;
	let label10;
	let t43;
	let input7;
	let t44;
	let div25;
	let label11;
	let t46;
	let input8;
	let t47;
	let div30;
	let label12;
	let t49;
	let div27;
	let label13;
	let t51;
	let input9;
	let t52;
	let div28;
	let label14;
	let t54;
	let input10;
	let t55;
	let div29;
	let label15;
	let t57;
	let input11;
	let t58;
	let div35;
	let div34;
	let label16;
	let div32;
	let div33;
	let t60;
	let input12;
	let t61;
	let input13;
	let t62;
	let div38;
	let button1;
	let t64;
	let button2;
	let t66;
	let button3;

	const block = {
		c: function create() {
			div41 = element("div");
			div40 = element("div");
			div39 = element("div");
			div0 = element("div");
			h4 = element("h4");
			h4.textContent = `${l.chart_label}`;
			t1 = space();
			button0 = element("button");
			button0.textContent = "×";
			t3 = space();
			div37 = element("div");
			div36 = element("div");
			div9 = element("div");
			div4 = element("div");
			div3 = element("div");
			label0 = element("label");
			div1 = element("div");
			div1.textContent = `${l.width_label}`;
			div2 = element("div");
			t5 = space();
			input0 = element("input");
			t6 = space();
			div8 = element("div");
			div7 = element("div");
			label1 = element("label");
			div5 = element("div");
			div5.textContent = `${l.height_label}`;
			div6 = element("div");
			t8 = space();
			input1 = element("input");
			t9 = space();
			div14 = element("div");
			div12 = element("div");
			label2 = element("label");
			div10 = element("div");
			div10.textContent = `${l.type}`;
			div11 = element("div");
			t11 = space();
			select0 = element("select");
			option0 = element("option");
			option0.textContent = `${l.column_label}`;
			option1 = element("option");
			option1.textContent = `${l.line_label}`;
			option2 = element("option");
			option2.textContent = `${l.histogram_label}`;
			t15 = space();
			div13 = element("div");
			label3 = element("label");
			label3.textContent = `${l.chart_title}`;
			t17 = space();
			input2 = element("input");
			t18 = space();
			div17 = element("div");
			div15 = element("div");
			label4 = element("label");
			label4.textContent = `${l.xaxis_title}`;
			t20 = space();
			input3 = element("input");
			t21 = space();
			div16 = element("div");
			label5 = element("label");
			label5.textContent = `${l.yaxis_title}`;
			t23 = space();
			input4 = element("input");
			t24 = space();
			div22 = element("div");
			div20 = element("div");
			label6 = element("label");
			div18 = element("div");
			div18.textContent = `${l.default_answer}`;
			div19 = element("div");
			t26 = space();
			input5 = element("input");
			t27 = space();
			small = element("small");
			small.textContent = `${l.default_representation}`;
			t29 = space();
			div21 = element("div");
			label7 = element("label");
			label7.textContent = `${l.set_color}`;
			t31 = space();
			select1 = element("select");
			option3 = element("option");
			option3.textContent = `${l.default}`;
			option4 = element("option");
			option4.textContent = `${l.primary_color}`;
			option5 = element("option");
			option5.textContent = `${l.warning_color}`;
			option6 = element("option");
			option6.textContent = `${l.danger_color}`;
			t36 = space();
			div31 = element("div");
			div26 = element("div");
			label8 = element("label");
			label8.textContent = `${l.xinterval_val}`;
			t38 = space();
			div23 = element("div");
			label9 = element("label");
			label9.textContent = `${l.min}`;
			t40 = space();
			input6 = element("input");
			t41 = space();
			div24 = element("div");
			label10 = element("label");
			label10.textContent = `${l.max}`;
			t43 = space();
			input7 = element("input");
			t44 = space();
			div25 = element("div");
			label11 = element("label");
			label11.textContent = `${l.interval_txt}`;
			t46 = space();
			input8 = element("input");
			t47 = space();
			div30 = element("div");
			label12 = element("label");
			label12.textContent = `${l.yinterval_val}`;
			t49 = space();
			div27 = element("div");
			label13 = element("label");
			label13.textContent = `${l.min}`;
			t51 = space();
			input9 = element("input");
			t52 = space();
			div28 = element("div");
			label14 = element("label");
			label14.textContent = `${l.max}`;
			t54 = space();
			input10 = element("input");
			t55 = space();
			div29 = element("div");
			label15 = element("label");
			label15.textContent = `${l.interval_txt}`;
			t57 = space();
			input11 = element("input");
			t58 = space();
			div35 = element("div");
			div34 = element("div");
			label16 = element("label");
			div32 = element("div");
			div32.textContent = `${l.snap_to}`;
			div33 = element("div");
			t60 = space();
			input12 = element("input");
			t61 = space();
			input13 = element("input");
			t62 = space();
			div38 = element("div");
			button1 = element("button");
			button1.textContent = `${l.reset}`;
			t64 = space();
			button2 = element("button");
			button2.textContent = `${l.ok_btn}`;
			t66 = space();
			button3 = element("button");
			button3.textContent = `${l.cancel}`;
			attr_dev(h4, "class", "modal-title");
			add_location(h4, file, 16, 16, 506);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "close");
			attr_dev(button0, "data-bs-dismiss", "modal");
			add_location(button0, file, 17, 16, 568);
			attr_dev(div0, "class", "modal-header");
			add_location(div0, file, 15, 12, 462);
			attr_dev(div1, "class", "mendatory_label float-left");
			add_location(div1, file, 24, 117, 1046);
			attr_dev(div2, "class", "mendatory_field");
			add_location(div2, file, 24, 178, 1107);
			attr_dev(label0, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label0, "for", "chart-width");
			add_location(label0, file, 24, 32, 961);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "num validate form-control form-control-md");
			attr_dev(input0, "id", "chart-width");
			attr_dev(input0, "name", "width");
			attr_dev(input0, "placeholder", "Width of chart");
			attr_dev(input0, "defaultvalue", "500");
			attr_dev(input0, "data-dwidth", "550");
			add_location(input0, file, 25, 32, 1184);
			attr_dev(div3, "class", "form-group");
			add_location(div3, file, 23, 28, 903);
			attr_dev(div4, "class", "col-sm-6 col-12 px-1");
			add_location(div4, file, 22, 24, 839);
			attr_dev(div5, "class", "mendatory_label float-left");
			add_location(div5, file, 30, 118, 1655);
			attr_dev(div6, "class", "mendatory_field");
			add_location(div6, file, 30, 180, 1717);
			attr_dev(label1, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label1, "for", "chart-height");
			add_location(label1, file, 30, 32, 1569);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "class", "num validate form-control form-control-md");
			attr_dev(input1, "id", "chart-height");
			attr_dev(input1, "name", "height");
			attr_dev(input1, "placeholder", "Height of chart");
			attr_dev(input1, "defaultvalue", "500");
			attr_dev(input1, "data-dheight", "500");
			add_location(input1, file, 31, 32, 1794);
			attr_dev(div7, "class", "form-group");
			add_location(div7, file, 29, 28, 1511);
			attr_dev(div8, "class", "col-sm-6 col-12 px-1");
			add_location(div8, file, 28, 24, 1447);
			attr_dev(div9, "class", "row mx-0");
			add_location(div9, file, 21, 20, 791);
			attr_dev(div10, "class", "mendatory_label float-left");
			add_location(div10, file, 37, 112, 2291);
			attr_dev(div11, "class", "mendatory_field");
			add_location(div11, file, 37, 166, 2345);
			attr_dev(label2, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label2, "for", "chart-type");
			add_location(label2, file, 37, 28, 2207);
			option0.__value = "column";
			option0.value = option0.__value;
			add_location(option0, file, 39, 32, 2509);
			option1.__value = "line";
			option1.value = option1.__value;
			add_location(option1, file, 40, 32, 2591);
			option2.__value = "histogram";
			option2.value = option2.__value;
			add_location(option2, file, 41, 32, 2669);
			attr_dev(select0, "class", "form-select");
			attr_dev(select0, "id", "chart-type");
			attr_dev(select0, "name", "type");
			add_location(select0, file, 38, 28, 2418);
			attr_dev(div12, "class", "form-group col-sm-6 col-12 px-1");
			add_location(div12, file, 36, 24, 2132);
			attr_dev(label3, "class", "control-label font-weight-normal mb-0");
			attr_dev(label3, "for", "chart_title");
			add_location(label3, file, 45, 28, 2895);
			attr_dev(input2, "type", "text");
			attr_dev(input2, "class", "form-control form-control-md");
			attr_dev(input2, "id", "chart_title");
			attr_dev(input2, "name", "title");
			attr_dev(input2, "placeholder", "Enter Chart Title");
			add_location(input2, file, 46, 28, 3019);
			attr_dev(div13, "class", "form-group col-sm-6 col-12 px-1");
			add_location(div13, file, 44, 24, 2820);
			attr_dev(div14, "class", "row mx-0");
			add_location(div14, file, 35, 20, 2084);
			attr_dev(label4, "class", "control-label font-weight-normal mb-0");
			attr_dev(label4, "for", "xlabel");
			add_location(label4, file, 51, 28, 3344);
			attr_dev(input3, "type", "text");
			attr_dev(input3, "class", "form-control form-control-md");
			attr_dev(input3, "id", "xlabel");
			attr_dev(input3, "name", "xlabel");
			attr_dev(input3, "placeholder", "Enter Text");
			attr_dev(input3, "data-dxtitle", "Hours");
			add_location(input3, file, 52, 28, 3463);
			attr_dev(div15, "class", "form-group col-sm-6 col-12 px-1");
			add_location(div15, file, 50, 24, 3269);
			attr_dev(label5, "class", "control-label font-weight-normal mb-0");
			attr_dev(label5, "for", "ylabel");
			add_location(label5, file, 55, 28, 3727);
			attr_dev(input4, "type", "text");
			attr_dev(input4, "class", "form-control form-control-md");
			attr_dev(input4, "id", "ylabel");
			attr_dev(input4, "name", "ylabel");
			attr_dev(input4, "placeholder", "Enter Text");
			attr_dev(input4, "data-dytitle", "Values");
			add_location(input4, file, 56, 28, 3846);
			attr_dev(div16, "class", "form-group col-sm-6 col-12 px-1");
			add_location(div16, file, 54, 24, 3652);
			attr_dev(div17, "class", "row mx-0");
			add_location(div17, file, 49, 20, 3221);
			attr_dev(div18, "class", "mendatory_label float-left");
			add_location(div18, file, 61, 112, 4266);
			attr_dev(div19, "class", "mendatory_field");
			add_location(div19, file, 61, 176, 4330);
			attr_dev(label6, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label6, "for", "defaultans");
			add_location(label6, file, 61, 28, 4182);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "class", "validate form-control form-control-md");
			attr_dev(input5, "id", "defaultans");
			attr_dev(input5, "name", "defaultans");
			attr_dev(input5, "placeholder", "Enter answer");
			attr_dev(input5, "data-dans", "10,20,30");
			input5.readOnly = "readonly";
			attr_dev(input5, "aria-describedby", "defaultAnsHelpBlock");
			add_location(input5, file, 62, 28, 4403);
			attr_dev(small, "id", "defaultAnsHelpBlock");
			attr_dev(small, "class", "text-danger font-weight-bold");
			add_location(small, file, 63, 28, 4645);
			attr_dev(div20, "class", "form-group col-sm-6 col-12 px-1");
			add_location(div20, file, 60, 24, 4107);
			attr_dev(label7, "class", "control-label font-weight-normal mb-0");
			attr_dev(label7, "for", "color");
			add_location(label7, file, 66, 28, 4891);
			option3.__value = "#7cb5ec";
			option3.value = option3.__value;
			option3.selected = "selected";
			add_location(option3, file, 68, 32, 5097);
			option4.__value = "#c5d0fa";
			option4.value = option4.__value;
			add_location(option4, file, 69, 32, 5198);
			option5.__value = "#ffa354";
			option5.value = option5.__value;
			add_location(option5, file, 70, 32, 5282);
			option6.__value = "#f5785d";
			option6.value = option6.__value;
			add_location(option6, file, 71, 32, 5366);
			attr_dev(select1, "class", "form-select");
			attr_dev(select1, "id", "color");
			attr_dev(select1, "name", "color");
			add_location(select1, file, 67, 32, 5011);
			attr_dev(div21, "class", "col-sm-6 col-12 form-group px-1");
			add_location(div21, file, 65, 24, 4816);
			attr_dev(div22, "class", "row mx-0");
			add_location(div22, file, 59, 20, 4059);
			attr_dev(label8, "class", "control-label font-weight-normal mb-0 w-100 px-1");
			attr_dev(label8, "for", "xaxisValues");
			add_location(label8, file, 77, 28, 5701);
			attr_dev(label9, "class", "control-label font-weight-normal mb-0");
			attr_dev(label9, "for", "xmin");
			add_location(label9, file, 80, 32, 5978);
			attr_dev(input6, "type", "number");
			attr_dev(input6, "class", "num validate form-control form-control-md svelte-m11977");
			attr_dev(input6, "id", "xmin");
			attr_dev(input6, "name", "xmin");
			attr_dev(input6, "placeholder", "No.");
			attr_dev(input6, "data-dxmin", "10");
			add_location(input6, file, 81, 32, 6091);
			attr_dev(div23, "class", "col-md-4 px-1 d-inline-block float-start");
			add_location(div23, file, 79, 28, 5890);
			attr_dev(label10, "class", "control-label font-weight-normal mb-0");
			attr_dev(label10, "for", "xmax");
			add_location(label10, file, 84, 32, 6376);
			attr_dev(input7, "type", "number");
			attr_dev(input7, "class", "num validate form-control form-control-md svelte-m11977");
			attr_dev(input7, "id", "xmax");
			attr_dev(input7, "name", "xmax");
			attr_dev(input7, "placeholder", "No.");
			attr_dev(input7, "data-dxmax", "60");
			add_location(input7, file, 85, 32, 6489);
			attr_dev(div24, "class", "col-md-4 px-1 d-inline-block float-start");
			add_location(div24, file, 83, 28, 6288);
			attr_dev(label11, "class", "control-label font-weight-normal mb-0");
			attr_dev(label11, "for", "xinterval");
			add_location(label11, file, 88, 32, 6774);
			attr_dev(input8, "type", "number");
			attr_dev(input8, "class", "num validate form-control form-control-md svelte-m11977");
			attr_dev(input8, "id", "xinterval");
			attr_dev(input8, "name", "xinterval");
			attr_dev(input8, "placeholder", "No.");
			attr_dev(input8, "data-dxinterval", "10");
			add_location(input8, file, 89, 32, 6901);
			attr_dev(div25, "class", "col-md-4 px-1 d-inline-block float-start");
			add_location(div25, file, 87, 28, 6686);
			attr_dev(div26, "class", "form-group col-sm-6 col-12 px-0 xmultiple");
			add_location(div26, file, 76, 24, 5616);
			attr_dev(label12, "class", "control-label font-weight-normal mb-0 w-100 px-1");
			add_location(label12, file, 94, 28, 7320);
			attr_dev(label13, "class", "control-label font-weight-normal mb-0");
			attr_dev(label13, "for", "ymin");
			add_location(label13, file, 96, 32, 7537);
			attr_dev(input9, "type", "number");
			attr_dev(input9, "class", "num validate form-control form-control-md svelte-m11977");
			attr_dev(input9, "id", "ymin");
			attr_dev(input9, "name", "ymin");
			attr_dev(input9, "placeholder", "No.");
			attr_dev(input9, "data-dymin", "1");
			add_location(input9, file, 97, 32, 7650);
			attr_dev(div27, "class", "col-md-4 px-1 d-inline-block float-start");
			add_location(div27, file, 95, 28, 7449);
			attr_dev(label14, "class", "control-label font-weight-normal mb-0");
			attr_dev(label14, "for", "ymax");
			add_location(label14, file, 100, 32, 7934);
			attr_dev(input10, "type", "number");
			attr_dev(input10, "class", "num validate form-control form-control-md svelte-m11977");
			attr_dev(input10, "id", "ymax");
			attr_dev(input10, "name", "ymax");
			attr_dev(input10, "placeholder", "No.");
			attr_dev(input10, "data-dymax", "50");
			add_location(input10, file, 101, 32, 8047);
			attr_dev(div28, "class", "col-md-4 px-1 d-inline-block float-start");
			add_location(div28, file, 99, 28, 7846);
			attr_dev(label15, "class", "control-label font-weight-normal mb-0");
			attr_dev(label15, "for", "yinterval");
			add_location(label15, file, 104, 32, 8332);
			attr_dev(input11, "type", "number");
			attr_dev(input11, "class", "num validate form-control form-control-md svelte-m11977");
			attr_dev(input11, "id", "yinterval");
			attr_dev(input11, "name", "yinterval");
			attr_dev(input11, "placeholder", "No.");
			attr_dev(input11, "data-dyinterval", "5");
			add_location(input11, file, 105, 32, 8459);
			attr_dev(div29, "class", "col-md-4 px-1 d-inline-block float-start");
			add_location(div29, file, 103, 28, 8244);
			attr_dev(div30, "class", "form-group col-sm-6 col-12 px-1 ymultiple details");
			add_location(div30, file, 92, 24, 7141);
			attr_dev(div31, "class", "row mx-0 show_values");
			add_location(div31, file, 75, 20, 5545);
			attr_dev(div32, "class", "mendatory_label float-left");
			add_location(div32, file, 111, 108, 8944);
			attr_dev(div33, "class", "mendatory_field");
			add_location(div33, file, 111, 165, 9001);
			attr_dev(label16, "class", "control-label font-weight-normal mb-0 d-inline-flex");
			attr_dev(label16, "for", "snapto");
			add_location(label16, file, 111, 28, 8864);
			attr_dev(input12, "type", "text");
			attr_dev(input12, "class", "num validate form-control form-control-md");
			attr_dev(input12, "id", "snapto");
			attr_dev(input12, "name", "snapto");
			attr_dev(input12, "placeholder", "Enter Number Only");
			attr_dev(input12, "data-dsnapto", "10");
			add_location(input12, file, 112, 28, 9074);
			attr_dev(div34, "class", "col-sm-6 col-12 px-1 form-group");
			add_location(div34, file, 110, 24, 8789);
			attr_dev(div35, "class", "row mx-0 show_values d-none");
			add_location(div35, file, 109, 20, 8722);
			attr_dev(input13, "type", "hidden");
			attr_dev(input13, "id", "chart-anskey");
			attr_dev(input13, "name", "chart-anskey");
			attr_dev(input13, "placeholder", "anskey");
			add_location(input13, file, 115, 20, 9322);
			attr_dev(div36, "class", "plotchart h");
			add_location(div36, file, 20, 16, 744);
			attr_dev(div37, "class", "modal-body modal_height overflow-y svelte-m11977");
			add_location(div37, file, 19, 12, 678);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-secondary resetElement");
			add_location(button1, file, 119, 16, 9505);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-secondary addElement");
			add_location(button2, file, 120, 16, 9602);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "btn btn-light");
			attr_dev(button3, "data-bs-dismiss", "modal");
			add_location(button3, file, 121, 16, 9698);
			attr_dev(div38, "class", "modal-footer");
			add_location(div38, file, 118, 12, 9461);
			attr_dev(div39, "class", "modal-content");
			add_location(div39, file, 14, 8, 421);
			attr_dev(div40, "class", "modal-dialog");
			add_location(div40, file, 13, 4, 385);
			attr_dev(div41, "id", "authoring-modal");
			attr_dev(div41, "class", "modal fade");
			attr_dev(div41, "tabindex", "-1");
			add_location(div41, file, 12, 0, 320);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div41, anchor);
			append_dev(div41, div40);
			append_dev(div40, div39);
			append_dev(div39, div0);
			append_dev(div0, h4);
			append_dev(div0, t1);
			append_dev(div0, button0);
			append_dev(div39, t3);
			append_dev(div39, div37);
			append_dev(div37, div36);
			append_dev(div36, div9);
			append_dev(div9, div4);
			append_dev(div4, div3);
			append_dev(div3, label0);
			append_dev(label0, div1);
			append_dev(label0, div2);
			append_dev(div3, t5);
			append_dev(div3, input0);
			append_dev(div9, t6);
			append_dev(div9, div8);
			append_dev(div8, div7);
			append_dev(div7, label1);
			append_dev(label1, div5);
			append_dev(label1, div6);
			append_dev(div7, t8);
			append_dev(div7, input1);
			append_dev(div36, t9);
			append_dev(div36, div14);
			append_dev(div14, div12);
			append_dev(div12, label2);
			append_dev(label2, div10);
			append_dev(label2, div11);
			append_dev(div12, t11);
			append_dev(div12, select0);
			append_dev(select0, option0);
			append_dev(select0, option1);
			append_dev(select0, option2);
			append_dev(div14, t15);
			append_dev(div14, div13);
			append_dev(div13, label3);
			append_dev(div13, t17);
			append_dev(div13, input2);
			append_dev(div36, t18);
			append_dev(div36, div17);
			append_dev(div17, div15);
			append_dev(div15, label4);
			append_dev(div15, t20);
			append_dev(div15, input3);
			append_dev(div17, t21);
			append_dev(div17, div16);
			append_dev(div16, label5);
			append_dev(div16, t23);
			append_dev(div16, input4);
			append_dev(div36, t24);
			append_dev(div36, div22);
			append_dev(div22, div20);
			append_dev(div20, label6);
			append_dev(label6, div18);
			append_dev(label6, div19);
			append_dev(div20, t26);
			append_dev(div20, input5);
			append_dev(div20, t27);
			append_dev(div20, small);
			append_dev(div22, t29);
			append_dev(div22, div21);
			append_dev(div21, label7);
			append_dev(div21, t31);
			append_dev(div21, select1);
			append_dev(select1, option3);
			append_dev(select1, option4);
			append_dev(select1, option5);
			append_dev(select1, option6);
			append_dev(div36, t36);
			append_dev(div36, div31);
			append_dev(div31, div26);
			append_dev(div26, label8);
			append_dev(div26, t38);
			append_dev(div26, div23);
			append_dev(div23, label9);
			append_dev(div23, t40);
			append_dev(div23, input6);
			append_dev(div26, t41);
			append_dev(div26, div24);
			append_dev(div24, label10);
			append_dev(div24, t43);
			append_dev(div24, input7);
			append_dev(div26, t44);
			append_dev(div26, div25);
			append_dev(div25, label11);
			append_dev(div25, t46);
			append_dev(div25, input8);
			append_dev(div31, t47);
			append_dev(div31, div30);
			append_dev(div30, label12);
			append_dev(div30, t49);
			append_dev(div30, div27);
			append_dev(div27, label13);
			append_dev(div27, t51);
			append_dev(div27, input9);
			append_dev(div30, t52);
			append_dev(div30, div28);
			append_dev(div28, label14);
			append_dev(div28, t54);
			append_dev(div28, input10);
			append_dev(div30, t55);
			append_dev(div30, div29);
			append_dev(div29, label15);
			append_dev(div29, t57);
			append_dev(div29, input11);
			append_dev(div36, t58);
			append_dev(div36, div35);
			append_dev(div35, div34);
			append_dev(div34, label16);
			append_dev(label16, div32);
			append_dev(label16, div33);
			append_dev(div34, t60);
			append_dev(div34, input12);
			append_dev(div36, t61);
			append_dev(div36, input13);
			append_dev(div39, t62);
			append_dev(div39, div38);
			append_dev(div38, button1);
			append_dev(div38, t64);
			append_dev(div38, button2);
			append_dev(div38, t66);
			append_dev(div38, button3);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div41);
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
	validate_slots('ChartModalBox', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChartModalBox> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ l });
	return [];
}

class ChartModalBox extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ChartModalBox",
			options,
			id: create_fragment.name
		});
	}
}

/* clsSMChart\ChartAuthoring.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file$1 = "clsSMChart\\ChartAuthoring.svelte";

function create_fragment$1(ctx) {
	let main;
	let div4;
	let chartmodalbox;
	let t0;
	let center;
	let div3;
	let div1;
	let div0;
	let span2;
	let button0;
	let span0;
	let button0_title_value;
	let button0_aria_label_value;
	let button0_data_original_title_value;
	let t1;
	let button1;
	let span1;
	let button1_title_value;
	let button1_aria_label_value;
	let button1_data_original_title_value;
	let t2;
	let span4;
	let span3;
	let button2;
	let i;
	let button2_title_value;
	let button2_aria_label_value;
	let button2_data_original_title_value;
	let t3;
	let div2;
	let div2_type_value;
	let div2_width_value;
	let div2_height_value;
	let div2_class_value;
	let div2_snapto_value;
	let div2_xval_value;
	let div2_yval_value;
	let div2_yinterval_value;
	let div2_ymin_value;
	let div2_ymax_value;
	let div2_defaultans_value;
	let div2_correctans_value;
	let div2_xlabel_value;
	let div2_ylabel_value;
	let div2_title_value;
	let div2_color_value;
	let t4;
	let textarea;
	let textarea_value_value;
	let current;
	let mounted;
	let dispose;
	chartmodalbox = new ChartModalBox({ $$inline: true });

	const block = {
		c: function create() {
			main = element("main");
			div4 = element("div");
			create_component(chartmodalbox.$$.fragment);
			t0 = space();
			center = element("center");
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");
			span2 = element("span");
			button0 = element("button");
			span0 = element("span");
			t1 = space();
			button1 = element("button");
			span1 = element("span");
			t2 = space();
			span4 = element("span");
			span3 = element("span");
			button2 = element("button");
			i = element("i");
			t3 = space();
			div2 = element("div");
			t4 = space();
			textarea = element("textarea");
			attr_dev(span0, "class", "icomoon-plus s2 updateGraph");
			add_location(span0, file$1, 209, 32, 10260);
			attr_dev(button0, "title", button0_title_value = l.add);
			attr_dev(button0, "data-bs-toggle", "tooltip");
			attr_dev(button0, "aria-label", button0_aria_label_value = l.add);
			attr_dev(button0, "data-original-title", button0_data_original_title_value = l.add);
			attr_dev(button0, "tabindex", "0");
			attr_dev(button0, "class", "setdata btn-light btn m-0 w-auto h-auto p-1 bg-white border ml");
			add_location(button0, file$1, 208, 28, 9984);
			attr_dev(span1, "class", "icomoon-new-24px-delete-1 s2 updateGraph");
			add_location(span1, file$1, 212, 32, 10664);
			attr_dev(button1, "title", button1_title_value = l.delete);
			attr_dev(button1, "data-bs-toggle", "tooltip");
			attr_dev(button1, "aria-label", button1_aria_label_value = l.delete);
			attr_dev(button1, "data-original-title", button1_data_original_title_value = l.delete);
			attr_dev(button1, "tabindex", "0");
			attr_dev(button1, "class", "setdata btn btn-light m-0 w-auto h-auto p-1 bg-white border ml");
			add_location(button1, file$1, 211, 28, 10378);
			add_location(span2, file$1, 207, 24, 9948);
			attr_dev(i, "class", "icomoon-24px-edit-1");
			add_location(i, file$1, 217, 196, 11198);
			attr_dev(button2, "title", button2_title_value = l.edit_chart);
			attr_dev(button2, "aria-label", button2_aria_label_value = l.edit_chart);
			attr_dev(button2, "tabindex", "0");
			attr_dev(button2, "data-bs-toggle", "tooltip");
			attr_dev(button2, "data-original-title", button2_data_original_title_value = l.edit_chart);
			attr_dev(button2, "class", "bg-white btn btn-light p-1");
			add_location(button2, file$1, 217, 32, 11034);
			attr_dev(span3, "class", "btn-group model-icon tools");
			attr_dev(span3, "data-t", "plotchart");
			add_location(span3, file$1, 216, 28, 10880);
			attr_dev(span4, "id", "option-toolbar");
			add_location(span4, file$1, 215, 24, 10824);
			attr_dev(div0, "class", "float-end mr-2 pt-1");
			add_location(div0, file$1, 206, 20, 9889);
			set_style(div1, "height", "41px");
			attr_dev(div1, "class", "position-relative w-100");
			add_location(div1, file$1, 205, 16, 9809);
			attr_dev(div2, "id", "ID0");
			attr_dev(div2, "type", div2_type_value = /*state*/ ctx[0].moduleType);
			attr_dev(div2, "width", div2_width_value = /*state*/ ctx[0].width);
			attr_dev(div2, "height", div2_height_value = /*state*/ ctx[0].height);
			attr_dev(div2, "class", div2_class_value = 'drag-resize ' + /*state*/ ctx[0].moduleType);
			attr_dev(div2, "snapto", div2_snapto_value = /*state*/ ctx[0].snapTo);
			attr_dev(div2, "xval", div2_xval_value = /*state*/ ctx[0].xval);
			attr_dev(div2, "yval", div2_yval_value = /*state*/ ctx[0].yval);
			attr_dev(div2, "yinterval", div2_yinterval_value = /*state*/ ctx[0].yinterval);
			attr_dev(div2, "ymin", div2_ymin_value = /*state*/ ctx[0].ymin);
			attr_dev(div2, "ymax", div2_ymax_value = /*state*/ ctx[0].ymax);
			attr_dev(div2, "defaultans", div2_defaultans_value = /*state*/ ctx[0].defaultans);
			attr_dev(div2, "correctans", div2_correctans_value = /*state*/ ctx[0].correctans);
			attr_dev(div2, "xlabel", div2_xlabel_value = /*state*/ ctx[0].xlabel);
			attr_dev(div2, "ylabel", div2_ylabel_value = /*state*/ ctx[0].ylabel);
			attr_dev(div2, "title", div2_title_value = /*state*/ ctx[0].title);
			attr_dev(div2, "color", div2_color_value = /*state*/ ctx[0].color);
			set_style(div2, "width", /*width*/ ctx[1]);
			set_style(div2, "border", "1px solid #ccc");
			add_location(div2, file$1, 222, 16, 11382);
			attr_dev(div3, "id", "chartmain");
			set_style(div3, "width", /*width*/ ctx[1]);
			set_style(div3, "background", "#e8e8e8");
			attr_dev(div3, "class", "position-relative");
			add_location(div3, file$1, 204, 12, 9700);
			add_location(center, file$1, 203, 8, 9678);
			attr_dev(textarea, "class", "h");
			attr_dev(textarea, "id", "special_module_xml");
			attr_dev(textarea, "name", "special_module_xml");
			textarea.value = textarea_value_value = /*state*/ ctx[0].xml;
			attr_dev(textarea, "data-xml", "");
			add_location(textarea, file$1, 225, 8, 11873);
			attr_dev(div4, "id", "authoringDiv");
			add_location(div4, file$1, 201, 4, 9618);
			add_location(main, file$1, 200, 0, 9606);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div4);
			mount_component(chartmodalbox, div4, null);
			append_dev(div4, t0);
			append_dev(div4, center);
			append_dev(center, div3);
			append_dev(div3, div1);
			append_dev(div1, div0);
			append_dev(div0, span2);
			append_dev(span2, button0);
			append_dev(button0, span0);
			append_dev(span2, t1);
			append_dev(span2, button1);
			append_dev(button1, span1);
			append_dev(div0, t2);
			append_dev(div0, span4);
			append_dev(span4, span3);
			append_dev(span3, button2);
			append_dev(button2, i);
			append_dev(div3, t3);
			append_dev(div3, div2);
			append_dev(div4, t4);
			append_dev(div4, textarea);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false),
					listen_dev(span3, "click", /*click_handler_2*/ ctx[8], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*state*/ 1 && div2_type_value !== (div2_type_value = /*state*/ ctx[0].moduleType)) {
				attr_dev(div2, "type", div2_type_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_width_value !== (div2_width_value = /*state*/ ctx[0].width)) {
				attr_dev(div2, "width", div2_width_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_height_value !== (div2_height_value = /*state*/ ctx[0].height)) {
				attr_dev(div2, "height", div2_height_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_class_value !== (div2_class_value = 'drag-resize ' + /*state*/ ctx[0].moduleType)) {
				attr_dev(div2, "class", div2_class_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_snapto_value !== (div2_snapto_value = /*state*/ ctx[0].snapTo)) {
				attr_dev(div2, "snapto", div2_snapto_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_xval_value !== (div2_xval_value = /*state*/ ctx[0].xval)) {
				attr_dev(div2, "xval", div2_xval_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_yval_value !== (div2_yval_value = /*state*/ ctx[0].yval)) {
				attr_dev(div2, "yval", div2_yval_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_yinterval_value !== (div2_yinterval_value = /*state*/ ctx[0].yinterval)) {
				attr_dev(div2, "yinterval", div2_yinterval_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_ymin_value !== (div2_ymin_value = /*state*/ ctx[0].ymin)) {
				attr_dev(div2, "ymin", div2_ymin_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_ymax_value !== (div2_ymax_value = /*state*/ ctx[0].ymax)) {
				attr_dev(div2, "ymax", div2_ymax_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_defaultans_value !== (div2_defaultans_value = /*state*/ ctx[0].defaultans)) {
				attr_dev(div2, "defaultans", div2_defaultans_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_correctans_value !== (div2_correctans_value = /*state*/ ctx[0].correctans)) {
				attr_dev(div2, "correctans", div2_correctans_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_xlabel_value !== (div2_xlabel_value = /*state*/ ctx[0].xlabel)) {
				attr_dev(div2, "xlabel", div2_xlabel_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_ylabel_value !== (div2_ylabel_value = /*state*/ ctx[0].ylabel)) {
				attr_dev(div2, "ylabel", div2_ylabel_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_title_value !== (div2_title_value = /*state*/ ctx[0].title)) {
				attr_dev(div2, "title", div2_title_value);
			}

			if (!current || dirty & /*state*/ 1 && div2_color_value !== (div2_color_value = /*state*/ ctx[0].color)) {
				attr_dev(div2, "color", div2_color_value);
			}

			if (!current || dirty & /*state*/ 1 && textarea_value_value !== (textarea_value_value = /*state*/ ctx[0].xml)) {
				prop_dev(textarea, "value", textarea_value_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(chartmodalbox.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(chartmodalbox.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			destroy_component(chartmodalbox);
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
	validate_slots('ChartAuthoring', slots, []);
	let { xml } = $$props;
	let { editorState } = $$props;
	let { getChildXml } = $$props;
	let state = {};
	let width = '600px', cid = 'ID0';
	let is_resource_added = false;

	// created writable store
	let auth_store = writable({
		// used for contain the xml
		xml: '',
		// used for contain the type of chart used
		moduleType: '',
		// contains the height of the chart board
		height: "500",
		// contains the width of the chart board
		width: "550",
		// contains the xval value of the xml
		xval: "",
		// contains the yinterval value of the xml
		yinterval: "",
		// contains the ymax value of the xml
		ymax: "500",
		// contains the ymin value of the xml
		ymin: "",
		// contains the xmax value of the xml
		xmax: "",
		// contains the xmin value of the xml
		xmin: "",
		// contains the xinterval value of the xml
		xinterval: "",
		// contains the defaultans value of the xml
		defaultans: "",
		// contains the snapTo value of the xml
		snapTo: "",
		// contains the correctans value of the xml
		correctans: "",
		// contains the xlabel value of the xml
		xlabel: "",
		// contains the ylabel value of the xml
		ylabel: "",
		// contains the title value of the xml
		title: "",
		// contains the color value of the xml
		color: ""
	});

	// for subscribing the store
	const unsubscribe = auth_store.subscribe(value => {
		$$invalidate(0, state = value);
	});

	// for updating the module/xml whenever there is change in the xml
	beforeUpdate(async () => {
		if (state.xml != xml) {
			AH.select('#special_module_xml').value = xml;
			updateXmlAuthData(xml);
		}
	});

	// for binding some events
	onMount(async () => {
		AH.listen('body', 'keyup', '#authoring-modal .validate', function (current, event) {
			event.preventDefault();
			event.stopPropagation();

			if (event.keyCode == 13) {
				if (AH.selectAll('#authoring-modal .showError').length == 0) {
					AH.select('#authoring-modal .addElement').click();
				} else {
					AH.select('#authoring-modal .showError').focus();
				}
			}

			CHART_AUTH.validate(current);
		});

		AH.listen('body', 'change', 'select', function (current) {
			CHART_AUTH.changeType(current);
		});

		AH.listen('body', 'click', '.resetElement', function () {
			CHART_AUTH.resetModal();
			AH.select("#chart-width").value = AH.select("#chart-width").getAttribute("data-dwidth");
			AH.select("#chart-height").value = AH.select("#chart-height").getAttribute("data-dheight");
			AH.select("#xlabel").value = AH.select("#xlabel").getAttribute("data-dxtitle");
			AH.select("#ylabel").value = AH.select("#ylabel").getAttribute("data-dytitle");
			AH.select("#defaultans").value = AH.select("#defaultans").getAttribute("data-dans");
			AH.select("#color").selectedIndex = 0;
			AH.select("#snapto").value = AH.select("#snapto").getAttribute("data-dsnapto");
			AH.select("#ymin").value = AH.select("#ymin").getAttribute("data-dymin");
			AH.select("#ymax").value = AH.select("#ymax").getAttribute("data-dymax");
			AH.select("#yinterval").value = AH.select("#yinterval").getAttribute("data-dyinterval");
			AH.select("#xmin").value = AH.select("#xmin").getAttribute("data-dxmin");
			AH.select("#xmax").value = AH.select("#xmax").getAttribute("data-dxmax");
			AH.select("#xinterval").value = AH.select("#xinterval").getAttribute("data-dxinterval");

			if (AH.select("#chart-type").value == "dotplot") {
				AH.select("#authoring-modal #chart_title").value = "Dot Plot";
			} else if (AH.select("#chart-type").value == "column") {
				AH.select("#authoring-modal #chart_title").value = "Column";
			} else if (AH.select("#chart-type").value == "line") {
				AH.select("#authoring-modal #chart_title").value = "Line Chart";
			} else if (AH.select("#chart-type").value == "histogram") {
				AH.select("#authoring-modal #chart_title").value = "Histogram";
			}
		});

		AH.listen('body', 'mousemove', '#chartmain', function () {
			updateXML();
		});

		AH.listen('body', 'click', '#chartmain, .addElement, .updateGraph', function () {
			updateXML();
		});

		AH.listen('body', 'click', '#xmlDone', function () {
			CHART_AUTH.initChart();
		});
	});

	// for adding the highchart draggable plugin and initiating the chart
	afterUpdate(async () => {
		if (!is_resource_added && xml) {
			AH.addScript('', itemUrl + 'src/libs/highchart_draggable.js', {
				callback() {
					CHART_AUTH.initChart();
					$$invalidate(3, editorState.links = true, editorState);
				}
			});

			is_resource_added = true;
		}
	});

	// function for updating the xml
	function updateXML() {
		if (state.xml != AH.select('#special_module_xml').value) {
			getChildXml(AH.select('#special_module_xml').value);
		}
	}

	// updates all states value according to the value of xml
	function updateXmlAuthData(xml_data) {
		// contains the json data of the xml
		let newXml = XMLToJSON(xml_data);

		console.log("newXML", newXml);

		// parses the xml and updates the value of all states except 'xml' and 'moduleType'
		parseXml(newXml);

		auth_store.update(item => {
			item.xml = xml_data;
			item.moduleType = newXml.smxml.chart._type;
			return item;
		});

		// this block will not execute as there are only 3 types of chart used and they are line, column, histogram
		if (newXml.smxml.chart._type == 'dotplot') {
			AH.selectAll('#chartmain .setdata', 'css', { display: 'none' });
		}
	}

	// function for updating the state and parsing the xml
	function parseXml(QXML) {
		// updates the value of the states
		auth_store.update(item => {
			// updates the value of state 'color' with color attribute value of chart tag of xml
			item.color = QXML.smxml.chart._color;

			// updates the value of state 'correctans' with correctans attribute value of chart tag of xml
			item.correctans = QXML.smxml.chart._correctans;

			// updates the value of state 'defaultans' with defaultans attribute value of chart tag of xml
			item.defaultans = QXML.smxml.chart._defaultans;

			// updates the value of state 'height' with height attribute value of chart tag of xml
			item.height = QXML.smxml.chart._height;

			// updates the value of state 'snapTo' with snapTo attribute value of chart tag of xml
			item.snapTo = QXML.smxml.chart._snapTo;

			// updates the value of state 'title' with title attribute value of chart tag of xml
			item.title = QXML.smxml.chart._title;

			// updates the value of state 'width' with width attribute value of chart tag of xml
			item.width = QXML.smxml.chart._width;

			// updates the value of state 'xinterval' with xinterval attribute value of chart tag of xml
			item.xinterval = QXML.smxml.chart._xinterval;

			// updates the value of state 'xlabel' with xlabel attribute value of chart tag of xml
			item.xlabel = QXML.smxml.chart._xlabel;

			// updates the value of state 'xmax' with xmax attribute value of chart tag of xml
			item.xmax = QXML.smxml.chart._xmax;

			// updates the value of state 'xmin' with xmin attribute value of chart tag of xml
			item.xmin = QXML.smxml.chart._xmin;

			// updates the value of state 'xval' with xval attribute value of chart tag of xml
			item.xval = QXML.smxml.chart._xval;

			// updates the value of state 'yinterval' with yinterval attribute value of chart tag of xml
			item.yinterval = QXML.smxml.chart._yinterval;

			// updates the value of state 'ylabel' with ylabel attribute value of chart tag of xml
			item.ylabel = QXML.smxml.chart._ylabel;

			// updates the value of state 'ymax' with ymax attribute value of chart tag of xml
			item.ymax = QXML.smxml.chart._ymax;

			// updates the value of state 'ymin' with ymin attribute value of chart tag of xml
			item.ymin = QXML.smxml.chart._ymin;

			return item;
		});
	}

	const writable_props = ['xml', 'editorState', 'getChildXml'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ChartAuthoring> was created with unknown prop '${key}'`);
	});

	const click_handler = () => {
		CHART_AUTH.updatePoint('addPoint', cid);
	};

	const click_handler_1 = () => {
		CHART_AUTH.updatePoint('removePoint', cid);
	};

	const click_handler_2 = () => {
		CHART_AUTH.elemModal('plotchart', cid);
	};

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(4, xml = $$props.xml);
		if ('editorState' in $$props) $$invalidate(3, editorState = $$props.editorState);
		if ('getChildXml' in $$props) $$invalidate(5, getChildXml = $$props.getChildXml);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		beforeUpdate,
		onMount,
		writable,
		XMLToJSON,
		AH,
		CHART_AUTH,
		l,
		ChartModalBox,
		xml,
		editorState,
		getChildXml,
		state,
		width,
		cid,
		is_resource_added,
		auth_store,
		unsubscribe,
		updateXML,
		updateXmlAuthData,
		parseXml
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(4, xml = $$props.xml);
		if ('editorState' in $$props) $$invalidate(3, editorState = $$props.editorState);
		if ('getChildXml' in $$props) $$invalidate(5, getChildXml = $$props.getChildXml);
		if ('state' in $$props) $$invalidate(0, state = $$props.state);
		if ('width' in $$props) $$invalidate(1, width = $$props.width);
		if ('cid' in $$props) $$invalidate(2, cid = $$props.cid);
		if ('is_resource_added' in $$props) is_resource_added = $$props.is_resource_added;
		if ('auth_store' in $$props) auth_store = $$props.auth_store;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		state,
		width,
		cid,
		editorState,
		xml,
		getChildXml,
		click_handler,
		click_handler_1,
		click_handler_2
	];
}

class ChartAuthoring extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { xml: 4, editorState: 3, getChildXml: 5 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ChartAuthoring",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[4] === undefined && !('xml' in props)) {
			console_1.warn("<ChartAuthoring> was created without expected prop 'xml'");
		}

		if (/*editorState*/ ctx[3] === undefined && !('editorState' in props)) {
			console_1.warn("<ChartAuthoring> was created without expected prop 'editorState'");
		}

		if (/*getChildXml*/ ctx[5] === undefined && !('getChildXml' in props)) {
			console_1.warn("<ChartAuthoring> was created without expected prop 'getChildXml'");
		}
	}

	get xml() {
		throw new Error("<ChartAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<ChartAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<ChartAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<ChartAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<ChartAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<ChartAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default ChartAuthoring;
//# sourceMappingURL=ChartAuthoring-85b2f349.js.map
