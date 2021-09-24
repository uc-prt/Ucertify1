/**
 *  File Name   : chartAuthoringScript.js
 *  Author      : Ayush Srivastava
 *  Function    : Chart
 *  Version     : 1.0
 *  Packege     : clsSMChart (Authoring)
 *  Last update : 15 Mar 2021
 *  Dependency  : JUI
 */

// importing JUI
import JUI from '../../src/libs/javscript_helper/JUI';
import l from '../../src/libs/editorLib/language.js';
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
            delete this.state[obj]
        }
    },
    state: {}
}

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
}

// function for checking inNumeric in js
CHART_AUTH.isNumeric = function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

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
}

// returns an object containing keys as attributes name and values as their values of the element passed in argument at the time of function calling
CHART_AUTH.setInAssoc = function (attrs) {
    let ret = {};
    if (attrs) {
        for (let index = 0; index < attrs.length; index++) {
            ret[attrs[index].name] = attrs[index].value;
        }
    }
    return ret;
}

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
            }
        }

        if (typeof elem != "undefined") {
            // assign the value of attrs array in the xml tag's attributes according to their type attribute
            CHART_AUTH.storage.store('#'+ JS.select(elem).id, "attributes", attrs)
        }

        // checks if perticular xml tag have any other tag then also assign it's attributes and values and so on
        if (xml.children.length > 0) {
            for (let index = 0; index < xml.children.length; index++) {
                CHART_AUTH.bind_data(xml.children[index]);
            }
        }
    }
}

// used for removing error messages
CHART_AUTH.resetModal = function () {
    CHART_AUTH.isValid = true;
    JS.selectAll('input', 'removeAttr', 'style');
    JS.selectAll('.error', 'remove');
    JS.selectAll('.showError', 'removeClass','showError');
}

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
}

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
        })

        CHART_AUTH.storage.store('#' + key, 'attributes', attributes);
        CHART_AUTH.storage.store('#chartmain', 'attributes', attributes);

        JS.setCss('#chartmain', {
            width: wd + 'px',
            height: parseInt(hd) + 41 + 'px'
        })

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
}

// function used for serializing
CHART_AUTH.serialize = function(element) {
    let serialize = [];
    for (let index = 0; index < element.length; index++) {
        if (element[index].getAttribute('type') == 'radio' || element[index].getAttribute('type') == 'checkbox') {
            if (element[index].checked) {
                serialize[serialize.length] = {
                    "name": element[index].name,
                    "value": 1
                }
            }
        } else if (element[index].name && !element[index].disabled) {
            serialize[serialize.length] = {
                "name": element[index].name,
                "value": element[index].value
            };
        }
    }
    return serialize;
}

// used for set the data of elements exist in edit modalbox
CHART_AUTH.setData = function(attributes) {
    for (let index = 0; index < attributes.length; index += 1) {
        // select the input field according to attributes at perticular index
        let element = JS.select('#authoring-modal .' + CHART_AUTH.visible_class + ' [name="' + attributes[index]['name'] + '"]')
        // sets the value of input fields 
        element.value = attributes[index]['value'];
    }
}

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
}

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
}

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
}

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
}

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
}

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
}

// function for validating the inputs
CHART_AUTH.validate = function (current) {
    if (current.nodeName) {
        CHART_AUTH.isValid = false;
        JS.selectAll('.error', 'remove');
        JS.setCss(current, {
            //border: '1px solid red',
            //background:  "#FFCECE"
        })
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
}

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
}

export default CHART_AUTH;