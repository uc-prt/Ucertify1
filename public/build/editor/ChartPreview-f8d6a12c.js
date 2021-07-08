
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { N as JUI, a5 as createCommonjsModule, a6 as commonjsGlobal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, C as validate_each_argument, v as validate_slots, L as beforeUpdate, A as AH, a9 as afterUpdate, o as onMount, X as XMLToJSON$1, _ as onUserAnsChange, w as writable, a7 as Lang, z as empty, n as insert_dev, x as detach_dev, c as create_component, f as space, j as attr_dev, $ as null_to_empty, l as set_style, k as add_location, m as mount_component, q as listen_dev, t as transition_in, a as transition_out, b as destroy_component, K as destroy_each, H as run_all, h as text, G as prop_dev } from './main-b321cc47.js';
import { I as ItemHelper } from './ItemHelper-2131c126.js';

/**
 *  File Name   : chart.js
 *  Author      : Ayush Srivastava
 *  Function    : Chart
 *  Version     : 1.0
 *  Packege     : clsSMChart (Preview)
 *  Last update : 15 Mar 2021
 *  Dependency  : JUI
 */
const JS = new JUI();

let CHART = {};
let result = false;
// defines the array 'CHART.correct'
CHART.correct = [];
// contains the id of the chart container
CHART.ajax_eId = "#chartmain0";
// makes blank the value of variable 'CHART.defaultans'
CHART.defaultans = '';
// holds the value 'u' to show the user answer
CHART.tempVar = 'u';
// sets initially value of variable 'CHART.labBinded' true that denotes that remediation mode is not on
CHART.labBinded = true;
// sets initially result value false

// used for load and draw the chart
CHART.readyThis = function(mid, review, uxml) {
    CHART.drawChartPreview(mid, review, uxml);
};

// returns the result status and creates the user answer xml and shows the correct or incorrect message according to the status of result
CHART.checkAns = function(mid) {
    if (!CHART.labBinded) {
        // return the false if remediation mode is off
        return false;
    }
    let userAnsXML = "";
    if (CHART.tempVar == 'u') {
        // creates user answer xml
        userAnsXML = "<smans type='19'>\\n";
        // by default set the value of result true
        result = true;
        let elements = JS.select(mid).children;
        for (let index = 0; index < elements.length; index++) {
            userAnsXML = CHART.checkChildAnswer(mid, elements[index], userAnsXML);
        }
        userAnsXML += "</smans>";

        // this block is used for mobile team
        if (window.inNative) {
            window.getHeight && window.getHeight();
        }
    }
    // returns the status of the result
    return {uXml: userAnsXML, ans:result};
};

// sets the value of result and returns the user answer xml after update it
CHART.checkChildAnswer = function(mid, pElem, userAnsXML) {
    if (CHART.tempVar == 'u') {
        // selects the chart board container
        let _this = JS.select(pElem).getAttribute('type');
        switch (_this) {
            case "column":
            case "line":
            case "histogram":
            case "dotplot": {
                // For short and removed blank values from correct answer array.
                let ansKey = JS.select(pElem).getAttribute('correctans').split('|').filter(function(element) {
                    return element != ''
                }).sort().join('|');
                // For short and removed blank values from user answer array.
                let userKey = JS.select(pElem).getAttribute('userans').split('|').filter(function(element) {
                    return element != ''
                }).sort().join('|');
                if (ansKey != userKey) {
                    // sets the result value false
                    result = false;
                }
                // sets the value of user answer
                userAnsXML += "<div id='" + JS.select(pElem).getAttribute('id') + "' userAns='" + JS.select(pElem).getAttribute('userans') + "'></div>\\n";
                break;
            }
        }
    }
    // returns the user answer xml
    return userAnsXML;
};

// sets the value '0' of argument variable 'review' if it is undefined and shows the correct answer or user answer according to the value of argument variable 'ansType' and 'c' for correct answer and 'u' for user answer
CHART.showansdrag = function(mid, ansType, review) {
    if (typeof review === "undefined") review = 0;
    let elements = JS.select(mid).children;
    for (let index = 0; index < elements.length; index++) {
        CHART.showchildansdrag(mid, elements[index], ansType, review);
    }
};

// used for check and show the answer when value of argument 'ansType' is 'u' means user answer has to be show and when value of argument 'ansType' is 'c' shows the correct answer
CHART.showchildansdrag = function(mid, pElem, ansType, review) {
    let _this = JS.select(pElem).getAttribute('type'),
        elem = JS.select(pElem).getAttribute('id'),
        color = JS.select(pElem).getAttribute('color'),
        snapto = JS.select(pElem).getAttribute('snapto');
    let indx = [], indx1 = [], user = [];
    switch (_this) {
        case "column":
        case "line":
        case "histogram":
        case "dotplot": {
            if (ansType == 'c') {
                // used for contain the correct answer value
                CHART.correct = [];
                // contains the correct answer value after sorting in assending order
                let ansKey = JS.select(pElem).getAttribute("correctans").split('|').sort();
                // filters elements of array 'ansKey' having values
                ansKey = ansKey.filter(function(e) {
                    return e
                });

                for (let i = 0; i < ansKey.length; i++) {
                    // contains the index value of correct answer column/point
                    indx[i] = ansKey[i].split(',')[0];
                    if (ansKey[i].split(',')[1]) {
                        // contains the value of correct answer column/point
                        CHART.correct.push(ansKey[i].split(',')[1]);
                    }
                }
                // sets the correct answer value of columns/points of chart
                CHART.setCorrectAnswer(elem, _this, color, snapto, indx, CHART.correct);
            } else if (ansType == 'u') {
                if (JS.select(pElem).getAttribute('userans') != '') {
                    // contains the user answer value after sorting in assending order
                    let uans = JS.select(pElem).getAttribute('userans').split('|').sort();
                    // filters elements of array 'uans' having values
                    uans = uans.filter(function(e) {
                        return e
                    });
                    for (let i = 0; i < uans.length; i++) {
                        // contains the index value of column/point
                        indx1[i] = uans[i].split(',')[0];
                        // contains the value of column/point
                        user[i] = uans[i].split(',')[1];
                    }
                } else {
                    // contains 'defaultans' attribute value in json format
                    let uans = JSON.parse(JS.select(pElem).getAttribute("[" + 'defaultans' + "]"));
                    for (let i = 0; i < uans.length; i++) {
                        // contains the index value
                        indx1[i] = i;
                        // contains value defined in array 'uans' at index that is equals to the value of variable 'i'
                        user[i] = _this == 'dotplot' ? uans[i] * 10 : uans[i];
                    }
                }
                // used for set the correct/incorrect symbol for each and every column/point to indicate that which one is correct and which one is incorrect and also set the correct of incorrect symbol and border color of chart board according to overall answer status
                CHART.setUserAnswer(elem, _this, color, review, snapto, indx1, user, CHART.correct);
            }
            break;
        }
    }
};

// used for draw the chart with defined values
CHART.drawChartPreview = function(mid, review, uxml) {
    // selects the chart board
    let chartData = JS.select(mid + ' [type]');
    let xaxis = [],
        userans, gpad = 0.2,
        lspace, id = chartData.getAttribute('id'),
        type = chartData.getAttribute('type'),
        color = chartData.getAttribute('color'),
        xval = chartData.getAttribute('xval'),
        snapTo = chartData.getAttribute('snapto'),
        multiColor = false,
        interval_data,
        simple_plot = true,
        // contains the label value of y-axis
        ylabel = chartData.getAttribute('ylabel');
    if (chartData.getAttribute('defaultans')) {
        // contains the defaultans value in json format
        CHART.defaultans = JSON.parse("[" + chartData.getAttribute('defaultans') + "]");
    } else {
        // makes blank value of defaultans
        CHART.defaultans = '';
    }
    if (xval == undefined) {
        // defines an array if x
        xval = '[]';
    }
    // contains the value of xval after removing the square brackets from start and end and spliting it with comma (,)
    xval = xval.slice(1, xval.length - 1).split(',');
    // Managed Interval Issue Performed Using ADA In Case Of More Than Max Value Of X-Interval  
    let ada_data = JS.select("#answerID0").getAttribute('userans').split('|').filter(function(element) {
        return element != ''
    });
    if (ada_data.length > 0) {
        // finds the interval between to points on x-axis
        interval_data = parseInt(xval[1] - xval[0]);
        let first_data = parseInt(xval[0]);
        for (let index_no = 0; index_no < ada_data.length; index_no += 1) {
            // sets the new value of xval to prevent from repeating value when value reaches the xmax value by adding columns/points using ADA button
            if (index_no != 0) {
                xval[index_no] = (first_data + index_no * interval_data).toString();
            } else {
                xval[index_no] = first_data.toString();
            }
        }
    }
    
    for (let index_no = 0; index_no < xval.length; index_no++) {
        xaxis.push(xval[index_no]);
    }
    
    if (type == 'histogram') {
        // enable multicolor, ignore border, defines type as column, groupPadding '0' and color transparent
        multiColor = true;
        type = 'column';
        gpad = 0;
        color = 'transparent';
    }
    // not in use as only 3 types of chart used here and they are line, column, histogram
    if (type == 'dotplot') {
        simple_plot = false;
        type = 'column';
        ylabel = '';
        lspace = 40;
        for (let index_no = 0; index_no < CHART.defaultans.length; index_no += 1) {
            CHART.defaultans[index_no] = parseInt(CHART.defaultans[index_no]) * 10;
        }
    }

    // this block is used when user anser is set
    if (uxml) {
        // contains user answer xml
        let newXml = XMLToJSON(uxml);
        // contains the co-ordinates of x-axis and y-axis of each plotted point or chart
        let ans_data = newXml.smans.div._userAns.split('|').filter(function(elem) {
            return elem != ''
        });
        for (let index_no = 0; index_no < ans_data.length; index_no += 1) {
            // sets the y-axis value of each points in default answer array
            CHART.defaultans[index_no] = parseInt(ans_data[index_no].split(',')[1]);
            // sets the x-axis value of each points
            xaxis[index_no] = ((index_no + 1) * interval_data).toString();
        }
    }

    let chart = new Highcharts.Chart({
        chart: {
            // The HTML element where the chart will be rendered
            renderTo: id,
            // disabled the animation throughout the chart
            animation: false,
            // An explicit width for the chart
            width: chartData.getAttribute('width') - 2,
            // An explicit height for the chart
            height: chartData.getAttribute('height') - 2,
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
            text: chartData.getAttribute('title')
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
                text: chartData.getAttribute('xlabel')
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
                floor: parseInt(chartData.getAttribute('ymin')),
                // defines the minimum value of the axis
                min: parseInt(chartData.getAttribute('ymin')),
                // defines the maximum value of the axis
                max: parseInt(chartData.getAttribute('ymax')),
                // defines the interval of the tick marks in axis units
                tickInterval: parseInt(chartData.getAttribute('yinterval')),
                // defines the minimum tick interval allowed in axis values
                minTickInterval: 0,
                // defines the axis title, showing next to the axis line
                title: {
                    text: ylabel
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
            data: CHART.defaultans,
            // Enable dragging in the Y dimension  
            draggableY: true,
            // Used as main color of the series
            color: color,
            // Set the minimum Y value the points can be moved to
            dragMinY: parseInt(chartData.getAttribute('ymin')),
            // Set the maximum Y value the points can be moved to
            dragMaxY: parseInt(chartData.getAttribute('ymax')),
            // not clear why it is used
            snapgrid: snapTo,
            // define the type of series
            type: type,
            // The minimal height for a column or width for a bar
            minPointLength: 1
        }],
        plotOptions: {
            series: {
                // When using automatic point colors pulled from the global colors or series-specific 'plotOptions.column.colors' collections, this option determines whether the chart should receive one color per series or one color per point
                colorByPoint: multiColor,
                // Enable the mouse tracking for a specific series
                enableMouseTracking: true,
                // used for style the cursor
                cursor: 'ns-resize',
                // defines the color of the border surrounding each column or bar
                borderColor: color,
                // Padding between each column or bar, in x axis units
                pointPadding: 0,
                // Padding between each value groups, in x axis units
                groupPadding: gpad,
                // The width of the border surrounding each column or bar
                borderWidth: true,
                point: {
                    events: {
                        // Callback that fires when the point is dropped
                        drop: function() {
                            let obj = JS.select('#' + id);
                            // contains the x and y value separated by comma (,)
                            userans = this.x + ',' + Math.round(this.y);
                            // updates the user answer value when any column/point re-positioned using drag and drop
                            CHART.setAnswerkeyPreview(obj, userans);
                        },
                        // Callback that fires while dragging a point
                        drag: function() {
                            if (!simple_plot) {
                                // calculates the height
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
    if (!review && JS.select('#' + id).getAttribute('userans') == '') CHART.resetUserAns(id, type, CHART.defaultans); // reset the default value in user answer
    if (!simple_plot) {
        let cxWdth = JS.select('.highcharts-series-group rect').getAttribute('width');
        for (let i = 0; i < CHART.defaultans.length; i++) {
            // calculates the height
            let ht = (100 * snapTo) / CHART.defaultans[i] + '%';
            // updates the value of y, pattern, width, height, dotcolor etc
            chart.series[0].data[i].update({
                y: parseInt(CHART.defaultans[i]),
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

// reset the default value in user answer
CHART.resetUserAns = function(id, type, defans) {
    // contains string '|'
    let res = '|';
    // loops through the each values of default answer
    for (let index = 0; index < defans.length; index++) {
        if (type == 'dotplot') {
            res = res + index + ',' + defans[index] * 10 + '|';
        } else {
            res = res + index + ',' + defans[index] + '|'; // sets the index no and values of each column or point enclosing inside '|' symbol
        }
    }

    // updates the user answer value
    JS.select('#' + id).setAttribute('userans', res);
};

// used for add and remove the column/point
CHART.updatePointPreview = function(type, id) {
    // instance of chart
    let charts = Highcharts.charts, chart1;
    charts.forEach(function(chart) {
        if (chart && chart.renderTo.id === id) {
            chart1 = chart;
        }
    });   
    if (typeof chart1 == "object") {

        // A series is a set of data, for example a line graph or one set of columns. All data plotted on a chart comes from the series object
        let series = chart1.series[0],
        // contains the no of column or point plotted on chart board
        xaxisVal = series.data.length,
        // contains the value of xval
        xaxis_data = JS.select('#' + id).getAttribute('xval'),
        // array 
        xaxis_arr,
        // contains the min value of 'y' after parsing it into integer
        ymin_preVal = parseInt(JS.select('#' + id).getAttribute('ymin')),
        // contains the yinterval value of 'y' after parsing it into integer
        yinterval_preVal = parseInt(JS.select('#' + id).getAttribute('yinterval')),
        // stes the value of point/comumn that will be added
        val = (ymin_preVal < yinterval_preVal / 10) ? yinterval_preVal / 10 : ymin_preVal + yinterval_preVal / 10,
        data_array = [],
        // contains the user answer value
        userAnswer = JS.select('#' + id).getAttribute('userans');
        if (type == 'addPoint') {
            // rounds up to the nearest integer value
            val = Math.ceil(val);
            // Managed Interval Issue Performed Using Add Button In Case Of More Than Max Value Of X-Interval
            xaxis_arr = xaxis_data.slice(1, xaxis_data.length - 1).split(',');
            // contains the x-axis interval
            let newval = xaxis_arr[1] - xaxis_arr[0];
            let first_element = parseInt(xaxis_arr[0]);
            for (let index_no = 0; index_no <= series.data.length; index_no += 1) {
                if (index_no != 0) {
                    // contains data that will be set for x-axis
                    data_array.push((first_element + index_no * newval).toString());
                    // contains data of attribute 'xval'
                    xaxis_arr[index_no] = first_element + index_no * newval;
                } else {
                    // contains data that will be set for x-axis
                    data_array.push(first_element.toString());
                    // contains data of attribute 'xval'
                    xaxis_arr[index_no] = first_element;
                }
            }
            // sets the value of xval
            JS.select('#' + id).setAttribute('xval', '[' + xaxis_arr.join(',') + ']');
            // Set new axis categories and optionally redraw
            chart1.xAxis[0].setCategories(data_array);
            // sets the column/point at index equals to the value of variable 'xaxisVal' and value equals to the value of variable 'val'
            series.addPoint([xaxisVal, val]);
            if (userAnswer == '') {
                // sets user answer value in case when previously no user answer set
                userAnswer = '|' + parseInt(series.data.length - 1) + ',' + val + '|';
            } else {
                // sets user answer value in case when previously some user answer exist
                userAnswer = userAnswer + parseInt(series.data.length - 1) + ',' + val + '|';
            }
            // updates the user answer value
            JS.select('#' + id).setAttribute('userans', userAnswer);
        }
        if (type == 'removePoint') {
            let cans, ans, idx;
            if (xaxisVal > 1) {
                // removes the last plotted column or point on chart board
                let point_id = chart1.series[0].data[xaxisVal - 1].id;
                chart1.series[0].data[xaxisVal - 1].remove();
                point_id && JS.select('[point-id = "' + point_id + '"]', 'remove');

                // contains the value of user answer
                cans = userAnswer;
                // contains the last index value with prefix '|'
                ans = '|' + parseInt(series.data.length);
                // findes the index of value stored in variable 'ans' in user answer string 
                idx = cans.indexOf(ans);
                if (idx >= 0) {
                    // contains the extracted part of string excluding the last index value
                    cans = cans.slice(0, idx);
                    // updates the user answer value after removing the deleted value
                    JS.select('#' + id).setAttribute('userans', '|' + cans + '|');
                }
                if (JS.select('#' + id).getAttribute('userans') == "|||") {
                    // when user answer value becomes '|||' then makes it blank
                    JS.select('#' + id).setAttribute('userans', '');
                }
            }
        }
    }
};

// updates the user answer value when any column/point re-positioned using drag and drop
CHART.setAnswerkeyPreview = function(insert, cans) {
    let idx,
        // finds the index of column or point that is re-positioned, plotted on chart board
        temp = cans.split(',')[0],
        // contains the correct answer value
        set = insert.getAttribute("userans"),
        // defines variable 'str' with blank data
        str = '';
    // updates the value of variable 'temp' with prefix '|' and sufix comma (,)
    temp = '|' + temp + ',';
    if (set == undefined || set == "") {
        // wraps the value of variable 'cans' with symbol '|' and assign it in user answer
        insert.setAttribute('userans', '|' + cans + '|');
    } else {
        // finds the index of re-positioned column/point in user answer string
        idx = set.indexOf(temp);
        if (idx >= 0) {
            // contains the previous 'x' and 'y' value separated by comma with prefix '|' of the column/point which is re-positioned
            str = set.slice(idx, set.indexOf('|', idx + 1));
            // replaces previous value of x and y separated by comma with prefix '|' of column/point that is re-positioned with value store in variable 'cans' with prefix '|' of user answer string 
            set = set.replace(str, '|' + cans);
            // contains the user answer string after removing '|' from start and end of the string
            cans = set.substring(1, set.length - 1);
        } else {
            // contains the user answer string after removing '|' from start and end of the string and after adding '|' + value of variable 'cans'
            cans = set.substring(1, set.length - 1) + '|' + cans;
        }
        // updates the user answer value
        insert.setAttribute("userans", '|' + cans + '|');
    }
};

// used for set the correct/incorrect symbol for each and every column/point to indicate that which one is correct and which one is incorrect and also set the correct of incorrect symbol and border color of chart board according to overall answer status
CHART.setUserAnswer = function(id, type, color, ansreview, snapto, indx1, user, correct) {
    // used for show the incorrect icon
    let close_class;
    // used for show the correct icon
    let check_class;
    // sets the value of 'close_class' and 'check_class'
    if (window.inNative) {
        close_class = "icomoon-closed";
        check_class = "icomoon-checkmarks-3";
    } else {
        close_class = "icomoon-24px-incorrect-2";
        check_class = "icomoon-checkmark-3";
    }
    let charts = Highcharts.charts, chart2;
    charts.forEach(function(chart) {
        if (chart && chart.renderTo.id === id) {
            chart2 = chart;
        }
    }); 
    // id of chart container
    let cid = JS.select('#' + id).parentElement.getAttribute('id');
    // width of chart container
    let wd = JS.find('#' + cid,'.highcharts-container').offsetWidth;
    // used for set the color of the border surrounding the column or bar
    let flagCorrect = 1;
    // modified the width value
    wd = (wd - 100) / user.length;
    if (type == 'column' || type == 'line' || type == 'dotplot') {
        // used for height and position from top of the red or green portion seen just below the cross (x) or check symbol
        let ht = 3, tp = 13;
        // modified the width value
        wd = (wd / 2) + user.length;
        if (type == 'line') ht = tp = 0;
        // removes the all columns/points
        chart2.series[0].setData([]);
        for (let i = 0; i < user.length; i++) {
            if (correct[i] == user[i]) {
                // used for add the columns/points
                chart2.series[0].addPoint({
                    // sets the x value of the point
                    x: parseInt(indx1[i]),
                    // sets the y value of the point
                    y: parseInt(user[i]),
                    // sets the color for the point
                    color: ansreview ? '#98E98A' : color,
                    // sets the color of the border surrounding the column or bar
                    borderColor: ansreview ? 'green' : '',
                    dataLabels: {
                        // Enable or disable the data labels according to the value of variable 'ansreview'
                        enabled: ansreview,
                        // Used HTML to render the labels
                        useHTML: true,
                        // Callback JavaScript function to format the data label
                        formatter: function() {
                            return '<div id="chart' + i + '" as="1" style="width:' + wd + 'px;text-align:center;height:' + ht + 'px;background:green;position:relative;top:' + tp + 'px;"><span class="' + check_class + ' s3" style="color:green;position:relative;bottom:20px;"></span></div>';
                        }
                    },
                });
            } else {
                // used for add the columns/points
                chart2.series[0].addPoint({
                    // sets the x value of the point
                    x: parseInt(indx1[i]),
                    // sets the y value of the point
                    y: parseInt(user[i]),
                    // sets the color for the point
                    color: ansreview ? '#FF6666' : color,
                    // sets the color of the border surrounding the column or bar
                    borderColor: ansreview ? 'red' : '',
                    dataLabels: {
                        // Enable or disable the data labels according to the value of variable 'ansreview'
                        enabled: ansreview,
                        // Used HTML to render the labels
                        useHTML: true,
                        // Callback JavaScript function to format the data label
                        formatter: function() {
                            return '<div id="chart' + i + '" as="-1" style="width:' + wd + 'px;text-align:center;height:' + ht + 'px;background:red;position:relative;top:' + tp + 'px;"><span class="' + close_class + ' s3" style="color:red;position:relative;bottom:20px;"></span></div>';
                        }
                    },
                });
                // assign the value 0 to indicate that answer is incorrect
                flagCorrect = 0;
            }
            if (user.length != correct.length) {
                // assign the value 0 to indicate that answer is incorrect
                flagCorrect = 0;
            }

            if (chart2.series[0].data[i].plotY < 5) {
                JS.select('#chart' + i , 'css', {
                    top: (type == 'line') ? '-8px': '0',
                });
            }
        }
    } else if (type == 'histogram') {
        // removes all the columns/points
        chart2.series[0].setData([]);
        for (let i = 0; i < user.length; i++) {
            if (correct[i] == user[i]) {
                // used for add the columns/points
                chart2.series[0].addPoint({
                    // sets the x value of the point
                    x: parseInt(indx1[i]),
                    // sets the y value of the point
                    y: parseInt(user[i]),
                    dataLabels: {
                        // Enable or disable the data labels according to the value of variable 'ansreview'
                        enabled: ansreview,
                        // Used HTML to render the labels
                        useHTML: true,
                        // Callback JavaScript function to format the data label
                        formatter: function() {
                            return '<div id="chart' + i + '" as="1" style="width:' + (wd - 3) + 'px;text-align:center;height:3px;background:green;position:relative;top:13px;"><span class="' + check_class + ' s3" style="color:green;position:relative;bottom:20px;"></span></div>';
                        }
                    },
                });
            } else {
                // used for add the columns/points
                chart2.series[0].addPoint({
                    // sets the x value of the point
                    x: parseInt(indx1[i]),
                    // sets the y value of the point
                    y: parseInt(user[i]),
                    dataLabels: {
                        // Enable or disable the data labels according to the value of variable 'ansreview'
                        enabled: ansreview,
                        // Used HTML to render the labels
                        useHTML: true,
                        // Callback JavaScript function to format the data label
                        formatter: function() {
                            return '<div id="chart' + i + '" as="-1" style="width:' + (wd - 3) + 'px;text-align:center;height:3px;background:red;position:relative;top:13px;"><span class="' + close_class + ' s3" style="color:red;position:relative;bottom:20px;"></span></div>';
                        }
                    },
                });
                // assign the value '0' to indiacate that answer is incorrect
                flagCorrect = 0;
            }
            if (user.length != correct.length) {
                // assign the value '0' to indiacate that answer is incorrect
                flagCorrect = 0;
            }
            if (chart2.series[0].data[i].plotY < 5) {
                JS.select('#chart' + i , 'css', {
                    top: '0',
                });
            }
        }
    }

    if (!flagCorrect && ansreview) {
        // used for contain the class for cross (x) symbol
        let wrong_ans;
        if (window.inNative) {
            wrong_ans = "icomoon-cancel-circles";
        } else {
            wrong_ans = "icomoon-cancel-circle";
        }
        // shows the incorrect mark icon
        JS.insert('#' + id, '<span class="correct_incorrect_icon" style="position: absolute;z-index:100;width:18px;height:18px;background:white;border-radius:12px;font-size: 21px;right: -7px;margin-top: -9px;"> <span class="' + wrong_ans + ' red" style="vertical-align:7px"></span></span>', 'afterbegin');
        // shows red border color
        JS.setCss('#' + id, {
            borderColor: 'red',
            position: 'relative'
        });
    } else {
        if (ansreview) {
            // used for contain the class for correct symbol
            let corr_ans;
            if (window.inNative) {
                corr_ans = "icomoon-checkmark-circles";
            } else {
                corr_ans = "icomoon-checkmark-circle";
            }
            // shows the correct mark icon
            JS.insert('#' + id, '<span class="correct_incorrect_icon" style="position: absolute;z-index:100;width:18px;height:18px;background:white;border-radius:12px;font-size: 21px;right: -7px;margin-top: -9px;"> <span class="' + corr_ans + '" style="vertical-align:7px;color:green;"></span></span>', 'afterbegin');
            // shows green border color
            JS.setCss('#' + id, {
                borderColor: 'green',
                position: 'relative'
            });
        }
    }

};

// sets the correct answer value of columns/points of chart
CHART.setCorrectAnswer = function(id, type, color, snapto, indx, correct) {
    // contains the highcharts object
    let charts = Highcharts.charts, chart2;
    charts.forEach(function(chart) {
        if (chart && chart.renderTo.id === id) {
            chart2 = chart;
        }
    }); 
    
    // removes all the points from chart board
    chart2.series[0].setData([]);
    chart2.series[0].update({
        // disable the mouse tracking for series
        enableMouseTracking: false,
        // disable the data labels
        dataLabels: {
            enabled: false
        }
    });
    if (type == 'column' || type == 'histogram' || type == 'line' || type == 'dotplot') {
        for (let i = 0; i < correct.length; i++) {
            // adds the x and y values of correct answer points
            chart2.series[0].addPoint({
                x: parseInt(indx[i]),
                y: parseInt(correct[i]),
            });
        }
    }
    if ( JS.selectAll('.correct_incorrect_icon').length > 0) {
        // removes the correct incorrect icon container
        JS.select('.correct_incorrect_icon').remove();
        // change the border color of the chart container
        JS.setCss('#' + id, {
            borderColor: '#ccc'
        });
    }
};

/*
 Highcharts JS v9.0.1 (2021-02-15)

 (c) 2009-2021 Torstein Honsi

 License: www.highcharts.com/license
*/

var highcharts = createCommonjsModule(function (module) {
(function(W,P){module.exports?(P["default"]=P,module.exports=W.document?P(W):P):(W.Highcharts&&W.Highcharts.error(16,!0),W.Highcharts=P(W));})("undefined"!==typeof window?window:commonjsGlobal,function(W){function P(f,d,k,x){f.hasOwnProperty(d)||(f[d]=x.apply(null,k));}var k={};P(k,"Core/Globals.js",[],function(){var f="undefined"!==typeof W?W:"undefined"!==typeof window?window:{},d=f.document,
k=f.navigator&&f.navigator.userAgent||"",x=d&&d.createElementNS&&!!d.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,B=/(edge|msie|trident)/i.test(k)&&!f.opera,G=-1!==k.indexOf("Firefox"),D=-1!==k.indexOf("Chrome"),H=G&&4>parseInt(k.split("Firefox/")[1],10),t=function(){};return {product:"Highcharts",version:"9.0.1",deg2rad:2*Math.PI/360,doc:d,hasBidiBug:H,hasTouch:!!f.TouchEvent,isMS:B,isWebKit:-1!==k.indexOf("AppleWebKit"),isFirefox:G,isChrome:D,isSafari:!D&&-1!==k.indexOf("Safari"),
isTouchDevice:/(Mobile|Android|Windows Phone)/.test(k),SVG_NS:"http://www.w3.org/2000/svg",chartCount:0,seriesTypes:{},supportsPassiveEvents:function(){var C=!1;if(!B){var l=Object.defineProperty({},"passive",{get:function(){C=!0;}});f.addEventListener&&f.removeEventListener&&(f.addEventListener("testPassive",t,l),f.removeEventListener("testPassive",t,l));}return C}(),symbolSizes:{},svg:x,win:f,marginNames:["plotTop","marginRight","marginBottom","plotLeft"],noop:t,charts:[],dateFormats:{}}});P(k,"Core/Utilities.js",
[k["Core/Globals.js"]],function(f){function d(a,c,v,L){var p=c?"Highcharts error":"Highcharts warning";32===a&&(a=p+": Deprecated member");var K=l(a),h=K?p+" #"+a+": www.highcharts.com/errors/"+a+"/":a.toString();p=function(){if(c)throw Error(h);b.console&&-1===d.messages.indexOf(h)&&console.warn(h);};if("undefined"!==typeof L){var g="";K&&(h+="?");m(L,function(p,a){g+="\n - "+a+": "+p;K&&(h+=encodeURI(a)+"="+encodeURI(p));});h+=g;}v?e(v,"displayError",{code:a,message:h,params:L},p):p();d.messages.push(h);}
function k(){var a,b=arguments,v={},L=function(p,a){"object"!==typeof p&&(p={});m(a,function(b,u){"__proto__"!==u&&"constructor"!==u&&(!H(b,!0)||C(b)||t(b)?p[u]=a[u]:p[u]=L(p[u]||{},b));});return p};!0===b[0]&&(v=b[1],b=Array.prototype.slice.call(b,2));var p=b.length;for(a=0;a<p;a++)v=L(v,b[a]);return v}function x(a,b){var v={};m(a,function(L,p){if(H(a[p],!0)&&!a.nodeType&&b[p])L=x(a[p],b[p]),Object.keys(L).length&&(v[p]=L);else if(H(a[p])||a[p]!==b[p])v[p]=a[p];});return v}function B(a,b){return parseInt(a,
b||10)}function G(a){return "string"===typeof a}function D(a){a=Object.prototype.toString.call(a);return "[object Array]"===a||"[object Array Iterator]"===a}function H(a,b){return !!a&&"object"===typeof a&&(!b||!D(a))}function t(a){return H(a)&&"number"===typeof a.nodeType}function C(a){var b=a&&a.constructor;return !(!H(a,!0)||t(a)||!b||!b.name||"Object"===b.name)}function l(a){return "number"===typeof a&&!isNaN(a)&&Infinity>a&&-Infinity<a}function E(a){return "undefined"!==typeof a&&null!==a}function g(a,
b,v){var L;G(b)?E(v)?a.setAttribute(b,v):a&&a.getAttribute&&((L=a.getAttribute(b))||"class"!==b||(L=a.getAttribute(b+"Name"))):m(b,function(p,b){a.setAttribute(b,p);});return L}function y(a,b){var v;a||(a={});for(v in b)a[v]=b[v];return a}function c(){for(var a=arguments,b=a.length,v=0;v<b;v++){var L=a[v];if("undefined"!==typeof L&&null!==L)return L}}function q(a,b){f.isMS&&!f.svg&&b&&"undefined"!==typeof b.opacity&&(b.filter="alpha(opacity="+100*b.opacity+")");y(a.style,b);}function n(b,e,v,L,p){b=
a.createElement(b);e&&y(b,e);p&&q(b,{padding:"0",border:"none",margin:"0"});v&&q(b,v);L&&L.appendChild(b);return b}function A(a,b){return parseFloat(a.toPrecision(b||14))}function M(a,b,v,L){a=+a||0;b=+b;var p=f.defaultOptions.lang,K=(a.toString().split(".")[1]||"").split("e")[0].length,e=a.toString().split("e"),h=b;if(-1===b)b=Math.min(K,20);else if(!l(b))b=2;else if(b&&e[1]&&0>e[1]){var u=b+ +e[1];0<=u?(e[0]=(+e[0]).toExponential(u).split("e")[0],b=u):(e[0]=e[0].split(".")[0]||0,a=20>b?(e[0]*Math.pow(10,
e[1])).toFixed(b):0,e[1]=0);}var m=(Math.abs(e[1]?e[0]:a)+Math.pow(10,-Math.max(b,K)-1)).toFixed(b);K=String(B(m));u=3<K.length?K.length%3:0;v=c(v,p.decimalPoint);L=c(L,p.thousandsSep);a=(0>a?"-":"")+(u?K.substr(0,u)+L:"");a=0>+e[1]&&!h?"0":a+K.substr(u).replace(/(\d{3})(?=\d)/g,"$1"+L);b&&(a+=v+m.slice(-b));e[1]&&0!==+a&&(a+="e"+e[1]);return a}function z(a,b){if(!a)return b;var v=a.split(".").reverse();if(1===v.length)return b[a];for(a=v.pop();"undefined"!==typeof a&&"undefined"!==typeof b&&null!==
b;)b=b[a],a=v.pop();return b}function m(a,b,v){for(var e in a)Object.hasOwnProperty.call(a,e)&&b.call(v||a[e],a[e],e,a);}function r(a,b,v){function e(p,b){var u=a.removeEventListener||f.removeEventListenerPolyfill;u&&u.call(a,p,b,!1);}function p(p){var u;if(a.nodeName){if(b){var v={};v[b]=!0;}else v=p;m(v,function(a,b){if(p[b])for(u=p[b].length;u--;)e(b,p[b][u].fn);});}}var K="function"===typeof a&&a.prototype||a;if(Object.hasOwnProperty.call(K,"hcEvents")){var h=K.hcEvents;b?(K=h[b]||[],v?(h[b]=K.filter(function(a){return v!==
a.fn}),e(b,v)):(p(h),h[b]=[])):(p(h),delete K.hcEvents);}}function e(b,e,v,L){v=v||{};if(a.createEvent&&(b.dispatchEvent||b.fireEvent)){var p=a.createEvent("Events");p.initEvent(e,!0,!0);y(p,v);b.dispatchEvent?b.dispatchEvent(p):b.fireEvent(e,p);}else if(b.hcEvents){v.target||y(v,{preventDefault:function(){v.defaultPrevented=!0;},target:b,type:e});p=[];for(var K=b,h=!1;K.hcEvents;)Object.hasOwnProperty.call(K,"hcEvents")&&K.hcEvents[e]&&(p.length&&(h=!0),p.unshift.apply(p,K.hcEvents[e])),K=Object.getPrototypeOf(K);
h&&p.sort(function(a,p){return a.order-p.order});p.forEach(function(a){!1===a.fn.call(b,v)&&v.preventDefault();});}L&&!v.defaultPrevented&&L.call(b,v);}var h=f.charts,a=f.doc,b=f.win;(d||(d={})).messages=[];var w;Math.easeInOutSine=function(a){return -.5*(Math.cos(Math.PI*a)-1)};var J=Array.prototype.find?function(a,b){return a.find(b)}:function(a,b){var v,e=a.length;for(v=0;v<e;v++)if(b(a[v],v))return a[v]};m({map:"map",each:"forEach",grep:"filter",reduce:"reduce",some:"some"},function(a,b){f[b]=
function(v){var e;d(32,!1,void 0,(e={},e["Highcharts."+b]="use Array."+a,e));return Array.prototype[a].apply(v,[].slice.call(arguments,1))};});var O,F=function(){var a=Math.random().toString(36).substring(2,9)+"-",b=0;return function(){return "highcharts-"+(O?"":a)+b++}}(),N=f.getOptions=function(){return f.defaultOptions},R=f.setOptions=function(a){f.defaultOptions=k(!0,f.defaultOptions,a);(a.time||a.global)&&f.time.update(k(f.defaultOptions.global,f.defaultOptions.time,a.global,a.time));return f.defaultOptions};
b.jQuery&&(b.jQuery.fn.highcharts=function(){var a=[].slice.call(arguments);if(this[0])return a[0]?(new (f[G(a[0])?a.shift():"Chart"])(this[0],a[0],a[1]),this):h[g(this[0],"data-highcharts-chart")]});return {addEvent:function(a,b,v,e){void 0===e&&(e={});var p="function"===typeof a&&a.prototype||a;Object.hasOwnProperty.call(p,"hcEvents")||(p.hcEvents={});p=p.hcEvents;f.Point&&a instanceof f.Point&&a.series&&a.series.chart&&(a.series.chart.runTrackerClick=!0);var K=a.addEventListener||f.addEventListenerPolyfill;
K&&K.call(a,b,v,f.supportsPassiveEvents?{passive:void 0===e.passive?-1!==b.indexOf("touch"):e.passive,capture:!1}:!1);p[b]||(p[b]=[]);p[b].push({fn:v,order:"number"===typeof e.order?e.order:Infinity});p[b].sort(function(a,b){return a.order-b.order});return function(){r(a,b,v);}},arrayMax:function(a){for(var b=a.length,v=a[0];b--;)a[b]>v&&(v=a[b]);return v},arrayMin:function(a){for(var b=a.length,v=a[0];b--;)a[b]<v&&(v=a[b]);return v},attr:g,clamp:function(a,b,v){return a>b?a<v?a:v:b},cleanRecursively:x,
clearTimeout:function(a){E(a)&&clearTimeout(a);},correctFloat:A,createElement:n,css:q,defined:E,destroyObjectProperties:function(a,b){m(a,function(v,e){v&&v!==b&&v.destroy&&v.destroy();delete a[e];});},discardElement:function(a){w||(w=n("div"));a&&w.appendChild(a);w.innerHTML="";},erase:function(a,b){for(var v=a.length;v--;)if(a[v]===b){a.splice(v,1);break}},error:d,extend:y,extendClass:function(a,b){var v=function(){};v.prototype=new a;y(v.prototype,b);return v},find:J,fireEvent:e,format:function(a,
b,v){var e="{",p=!1,K=[],h=/f$/,c=/\.([0-9])/,u=f.defaultOptions.lang,m=v&&v.time||f.time;for(v=v&&v.numberFormatter||M;a;){var I=a.indexOf(e);if(-1===I)break;var g=a.slice(0,I);if(p){g=g.split(":");e=z(g.shift()||"",b);if(g.length&&"number"===typeof e)if(g=g.join(":"),h.test(g)){var w=parseInt((g.match(c)||["","-1"])[1],10);null!==e&&(e=v(e,w,u.decimalPoint,-1<g.indexOf(",")?u.thousandsSep:""));}else e=m.dateFormat(g,e);K.push(e);}else K.push(g);a=a.slice(I+1);e=(p=!p)?"}":"{";}K.push(a);return K.join("")},
getMagnitude:function(a){return Math.pow(10,Math.floor(Math.log(a)/Math.LN10))},getNestedProperty:z,getOptions:N,getStyle:function(a,e,v){if("width"===e)return e=Math.min(a.offsetWidth,a.scrollWidth),v=a.getBoundingClientRect&&a.getBoundingClientRect().width,v<e&&v>=e-1&&(e=Math.floor(v)),Math.max(0,e-f.getStyle(a,"padding-left")-f.getStyle(a,"padding-right"));if("height"===e)return Math.max(0,Math.min(a.offsetHeight,a.scrollHeight)-f.getStyle(a,"padding-top")-f.getStyle(a,"padding-bottom"));b.getComputedStyle||
d(27,!0);if(a=b.getComputedStyle(a,void 0))a=a.getPropertyValue(e),c(v,"opacity"!==e)&&(a=B(a));return a},inArray:function(a,b,v){d(32,!1,void 0,{"Highcharts.inArray":"use Array.indexOf"});return b.indexOf(a,v)},isArray:D,isClass:C,isDOMElement:t,isFunction:function(a){return "function"===typeof a},isNumber:l,isObject:H,isString:G,keys:function(a){d(32,!1,void 0,{"Highcharts.keys":"use Object.keys"});return Object.keys(a)},merge:k,normalizeTickInterval:function(a,b,v,e,p){var K=a;v=c(v,1);var h=a/
v;b||(b=p?[1,1.2,1.5,2,2.5,3,4,5,6,8,10]:[1,2,2.5,5,10],!1===e&&(1===v?b=b.filter(function(a){return 0===a%1}):.1>=v&&(b=[1/v])));for(e=0;e<b.length&&!(K=b[e],p&&K*v>=a||!p&&h<=(b[e]+(b[e+1]||b[e]))/2);e++);return K=A(K*v,-Math.round(Math.log(.001)/Math.LN10))},numberFormat:M,objectEach:m,offset:function(e){var h=a.documentElement;e=e.parentElement||e.parentNode?e.getBoundingClientRect():{top:0,left:0,width:0,height:0};return {top:e.top+(b.pageYOffset||h.scrollTop)-(h.clientTop||0),left:e.left+(b.pageXOffset||
h.scrollLeft)-(h.clientLeft||0),width:e.width,height:e.height}},pad:function(a,b,v){return Array((b||2)+1-String(a).replace("-","").length).join(v||"0")+a},pick:c,pInt:B,relativeLength:function(a,b,v){return /%$/.test(a)?b*parseFloat(a)/100+(v||0):parseFloat(a)},removeEvent:r,setOptions:R,splat:function(a){return D(a)?a:[a]},stableSort:function(a,b){var v=a.length,e,p;for(p=0;p<v;p++)a[p].safeI=p;a.sort(function(a,p){e=b(a,p);return 0===e?a.safeI-p.safeI:e});for(p=0;p<v;p++)delete a[p].safeI;},syncTimeout:function(a,
b,v){if(0<b)return setTimeout(a,b,v);a.call(0,v);return -1},timeUnits:{millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5,month:24192E5,year:314496E5},uniqueKey:F,useSerialIds:function(a){return O=c(a,O)},wrap:function(a,b,v){var e=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments),b=arguments,h=this;h.proceed=function(){e.apply(h,arguments.length?arguments:b);};a.unshift(e);a=v.apply(this,a);h.proceed=null;return a};}}});P(k,"Core/Renderer/HTML/AST.js",[k["Core/Globals.js"],
k["Core/Utilities.js"]],function(f,d){var k=f.SVG_NS,x=d.attr,B=d.createElement,G=d.discardElement,D=d.error,H=d.isString,t=d.objectEach,C=d.splat;var l=!1;try{l=!!(new DOMParser).parseFromString("","text/html");}catch(E){}return function(){function E(g){this.nodes="string"===typeof g?this.parseMarkup(g):g;}E.filterUserAttributes=function(g){t(g,function(y,c){var q=!0;-1===E.allowedAttributes.indexOf(c)&&(q=!1);-1!==["background","dynsrc","href","lowsrc","src"].indexOf(c)&&(q=H(y)&&E.allowedReferences.some(function(c){return 0===
y.indexOf(c)}));q||(D("Highcharts warning: Invalid attribute '"+c+"' in config"),delete g[c]);});return g};E.setElementHTML=function(g,y){g.innerHTML="";y&&(new E(y)).addToDOM(g);};E.prototype.addToDOM=function(g){function y(c,g){var n;C(c).forEach(function(c){var q=c.tagName,A=c.textContent?f.doc.createTextNode(c.textContent):void 0;if(q)if("#text"===q)var m=A;else if(-1!==E.allowedTags.indexOf(q)){q=f.doc.createElementNS("svg"===q?k:g.namespaceURI||k,q);var r=c.attributes||{};t(c,function(e,h){"tagName"!==
h&&"attributes"!==h&&"children"!==h&&"textContent"!==h&&(r[h]=e);});x(q,E.filterUserAttributes(r));A&&q.appendChild(A);y(c.children||[],q);m=q;}else D("Highcharts warning: Invalid tagName '"+q+"' in config");m&&g.appendChild(m);n=m;});return n}return y(this.nodes,g)};E.prototype.parseMarkup=function(g){var y=[];if(l)g=(new DOMParser).parseFromString(g,"text/html");else {var c=B("div");c.innerHTML=g;g={body:c};}var q=function(c,g){var n=c.nodeName.toLowerCase(),A={tagName:n};if("#text"===n){n=c.textContent||
"";if(/^[\s]*$/.test(n))return;A.textContent=n;}if(n=c.attributes){var m={};[].forEach.call(n,function(e){m[e.name]=e.value;});A.attributes=m;}if(c.childNodes.length){var r=[];[].forEach.call(c.childNodes,function(e){q(e,r);});r.length&&(A.children=r);}g.push(A);};[].forEach.call(g.body.childNodes,function(c){return q(c,y)});c&&G(c);return y};E.allowedTags="a b br button caption circle clipPath code dd defs div dl dt em feComponentTransfer feFuncA feFuncB feFuncG feFuncR feGaussianBlur feOffset feMerge feMergeNode filter h1 h2 h3 h4 h5 h6 hr i img li linearGradient marker ol p path pattern pre rect small span stop strong style sub sup svg table text thead tbody tspan td th tr ul #text".split(" ");
E.allowedAttributes="aria-controls aria-describedby aria-expanded aria-haspopup aria-hidden aria-label aria-labelledby aria-live aria-pressed aria-readonly aria-roledescription aria-selected class clip-path color colspan cx cy d dx dy disabled fill height href id in markerHeight markerWidth offset opacity orient padding paddingLeft patternUnits r refX refY role scope slope src startOffset stdDeviation stroke stroke-linecap stroke-width style result rowspan summary target tabindex text-align textAnchor textLength type valign width x x1 xy y y1 y2 zIndex".split(" ");
E.allowedReferences="https:// http:// mailto: / ../ ./ #".split(" ");return E}()});P(k,"Core/Color/Color.js",[k["Core/Globals.js"],k["Core/Utilities.js"]],function(f,d){var k=d.isNumber,x=d.merge,B=d.pInt;d=function(){function d(D){this.parsers=[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(d){return [B(d[1]),B(d[2]),B(d[3]),parseFloat(d[4],10)]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(d){return [B(d[1]),
B(d[2]),B(d[3]),1]}}];this.rgba=[];if(f.Color!==d)return new f.Color(D);if(!(this instanceof d))return new d(D);this.init(D);}d.parse=function(f){return new d(f)};d.prototype.init=function(f){var k,t;if((this.input=f=d.names[f&&f.toLowerCase?f.toLowerCase():""]||f)&&f.stops)this.stops=f.stops.map(function(l){return new d(l[1])});else {if(f&&f.charAt&&"#"===f.charAt()){var C=f.length;f=parseInt(f.substr(1),16);7===C?k=[(f&16711680)>>16,(f&65280)>>8,f&255,1]:4===C&&(k=[(f&3840)>>4|(f&3840)>>8,(f&240)>>
4|f&240,(f&15)<<4|f&15,1]);}if(!k)for(t=this.parsers.length;t--&&!k;){var l=this.parsers[t];(C=l.regex.exec(f))&&(k=l.parse(C));}}this.rgba=k||[];};d.prototype.get=function(d){var f=this.input,t=this.rgba;if("undefined"!==typeof this.stops){var C=x(f);C.stops=[].concat(C.stops);this.stops.forEach(function(l,E){C.stops[E]=[C.stops[E][0],l.get(d)];});}else C=t&&k(t[0])?"rgb"===d||!d&&1===t[3]?"rgb("+t[0]+","+t[1]+","+t[2]+")":"a"===d?t[3]:"rgba("+t.join(",")+")":f;return C};d.prototype.brighten=function(d){var f,
t=this.rgba;if(this.stops)this.stops.forEach(function(C){C.brighten(d);});else if(k(d)&&0!==d)for(f=0;3>f;f++)t[f]+=B(255*d),0>t[f]&&(t[f]=0),255<t[f]&&(t[f]=255);return this};d.prototype.setOpacity=function(d){this.rgba[3]=d;return this};d.prototype.tweenTo=function(d,f){var t=this.rgba,C=d.rgba;C.length&&t&&t.length?(d=1!==C[3]||1!==t[3],f=(d?"rgba(":"rgb(")+Math.round(C[0]+(t[0]-C[0])*(1-f))+","+Math.round(C[1]+(t[1]-C[1])*(1-f))+","+Math.round(C[2]+(t[2]-C[2])*(1-f))+(d?","+(C[3]+(t[3]-C[3])*(1-
f)):"")+")"):f=d.input||"none";return f};d.names={white:"#ffffff",black:"#000000"};return d}();f.Color=d;f.color=d.parse;return d});P(k,"Core/Color/Palette.js",[],function(){return {colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),backgroundColor:"#ffffff",neutralColor100:"#000000",neutralColor80:"#333333",neutralColor60:"#666666",neutralColor40:"#999999",neutralColor20:"#cccccc",neutralColor10:"#e6e6e6",neutralColor5:"#f2f2f2",neutralColor3:"#f7f7f7",
highlightColor100:"#003399",highlightColor80:"#335cad",highlightColor60:"#6685c2",highlightColor20:"#ccd6eb",highlightColor10:"#e6ebf5",indicatorPositiveLine:"#06b535",indicatorNegativeLine:"#f21313"}});P(k,"Core/Animation/Fx.js",[k["Core/Globals.js"],k["Core/Utilities.js"]],function(f,d){var k=f.win,x=d.isNumber,B=d.objectEach;d=function(){function d(d,f,t){this.pos=NaN;this.options=f;this.elem=d;this.prop=t;}d.prototype.dSetter=function(){var d=this.paths,f=d&&d[0];d=d&&d[1];var t=[],C=this.now||
0;if(1!==C&&f&&d)if(f.length===d.length&&1>C)for(var l=0;l<d.length;l++){for(var E=f[l],g=d[l],y=[],c=0;c<g.length;c++){var q=E[c],n=g[c];x(q)&&x(n)&&("A"!==g[0]||4!==c&&5!==c)?y[c]=q+C*(n-q):y[c]=n;}t.push(y);}else t=d;else t=this.toD||[];this.elem.attr("d",t,void 0,!0);};d.prototype.update=function(){var d=this.elem,f=this.prop,t=this.now,C=this.options.step;if(this[f+"Setter"])this[f+"Setter"]();else d.attr?d.element&&d.attr(f,t,null,!0):d.style[f]=t+this.unit;C&&C.call(d,t,this);};d.prototype.run=
function(f,H,t){var C=this,l=C.options,E=function(c){return E.stopped?!1:C.step(c)},g=k.requestAnimationFrame||function(c){setTimeout(c,13);},y=function(){for(var c=0;c<d.timers.length;c++)d.timers[c]()||d.timers.splice(c--,1);d.timers.length&&g(y);};f!==H||this.elem["forceAnimate:"+this.prop]?(this.startTime=+new Date,this.start=f,this.end=H,this.unit=t,this.now=this.start,this.pos=0,E.elem=this.elem,E.prop=this.prop,E()&&1===d.timers.push(E)&&g(y)):(delete l.curAnim[this.prop],l.complete&&0===Object.keys(l.curAnim).length&&
l.complete.call(this.elem));};d.prototype.step=function(d){var f=+new Date,t=this.options,C=this.elem,l=t.complete,E=t.duration,g=t.curAnim;if(C.attr&&!C.element)d=!1;else if(d||f>=E+this.startTime){this.now=this.end;this.pos=1;this.update();var y=g[this.prop]=!0;B(g,function(c){!0!==c&&(y=!1);});y&&l&&l.call(C);d=!1;}else this.pos=t.easing((f-this.startTime)/E),this.now=this.start+(this.end-this.start)*this.pos,this.update(),d=!0;return d};d.prototype.initPath=function(d,f,t){function C(c,g){for(;c.length<
A;){var m=c[0],n=g[A-c.length];n&&"M"===m[0]&&(c[0]="C"===n[0]?["C",m[1],m[2],m[1],m[2],m[1],m[2]]:["L",m[1],m[2]]);c.unshift(m);y&&c.push(c[c.length-1]);}}function l(g,n){for(;g.length<A;)if(n=g[g.length/c-1].slice(),"C"===n[0]&&(n[1]=n[5],n[2]=n[6]),y){var m=g[g.length/c].slice();g.splice(g.length/2,0,n,m);}else g.push(n);}var E=d.startX,g=d.endX;f=f&&f.slice();t=t.slice();var y=d.isArea,c=y?2:1;if(!f)return [t,t];if(E&&g){for(d=0;d<E.length;d++)if(E[d]===g[0]){var q=d;break}else if(E[0]===g[g.length-
E.length+d]){q=d;var n=!0;break}else if(E[E.length-1]===g[g.length-E.length+d]){q=E.length-d;break}"undefined"===typeof q&&(f=[]);}if(f.length&&x(q)){var A=t.length+q*c;n?(C(f,t),l(t,f)):(C(t,f),l(f,t));}return [f,t]};d.prototype.fillSetter=function(){d.prototype.strokeSetter.apply(this,arguments);};d.prototype.strokeSetter=function(){this.elem.attr(this.prop,f.color(this.start).tweenTo(f.color(this.end),this.pos),null,!0);};d.timers=[];return d}();f.Fx=d;f.timers=d.timers;return d});P(k,"Core/Animation/AnimationUtilities.js",
[k["Core/Animation/Fx.js"],k["Core/Globals.js"],k["Core/Utilities.js"]],function(f,d,k){var x=k.defined,B=k.getStyle,S=k.isArray,D=k.isNumber,H=k.isObject,t=k.merge,C=k.objectEach,l=k.pick;k=d.setAnimation=function(c,g){g.renderer.globalAnimation=l(c,g.options.chart.animation,!0);};var E=d.animObject=function(c){return H(c)?t({duration:500,defer:0},c):{duration:c?500:0,defer:0}},g=d.getDeferredAnimation=function(c,g,n){var q=E(g),y=0,l=0;(n?[n]:c.series).forEach(function(c){c=E(c.options.animation);
y=g&&x(g.defer)?q.defer:Math.max(y,c.duration+c.defer);l=Math.min(q.duration,c.duration);});c.renderer.forExport&&(y=0);return {defer:Math.max(0,y-l),duration:Math.min(y,l)}},y=d.stop=function(c,g){for(var n=f.timers.length;n--;)f.timers[n].elem!==c||g&&g!==f.timers[n].prop||(f.timers[n].stopped=!0);};return {animate:function(c,g,n){var q,l="",d,m;if(!H(n)){var r=arguments;n={duration:r[2],easing:r[3],complete:r[4]};}D(n.duration)||(n.duration=400);n.easing="function"===typeof n.easing?n.easing:Math[n.easing]||
Math.easeInOutSine;n.curAnim=t(g);C(g,function(e,h){y(c,h);m=new f(c,n,h);d=null;"d"===h&&S(g.d)?(m.paths=m.initPath(c,c.pathArray,g.d),m.toD=g.d,q=0,d=1):c.attr?q=c.attr(h):(q=parseFloat(B(c,h))||0,"opacity"!==h&&(l="px"));d||(d=e);d&&d.match&&d.match("px")&&(d=d.replace(/px/g,""));m.run(q,d,l);});},animObject:E,getDeferredAnimation:g,setAnimation:k,stop:y}});P(k,"Core/Renderer/SVG/SVGElement.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Renderer/HTML/AST.js"],k["Core/Color/Color.js"],k["Core/Globals.js"],
k["Core/Color/Palette.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G){var D=f.animate,H=f.animObject,t=f.stop,C=x.deg2rad,l=x.doc,E=x.hasTouch,g=x.noop,y=x.svg,c=x.SVG_NS,q=x.win,n=G.attr,A=G.createElement,M=G.css,z=G.defined,m=G.erase,r=G.extend,e=G.fireEvent,h=G.isArray,a=G.isFunction,b=G.isNumber,w=G.isString,J=G.merge,O=G.objectEach,F=G.pick,N=G.pInt,R=G.syncTimeout,Q=G.uniqueKey;f=function(){function f(){this.height=this.element=void 0;this.opacity=1;this.renderer=void 0;this.SVG_NS=c;
this.symbolCustomAttribs="x y width height r start end innerR anchorX anchorY rounded".split(" ");this.width=void 0;}f.prototype._defaultGetter=function(a){a=F(this[a+"Value"],this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a};f.prototype._defaultSetter=function(a,b,p){p.setAttribute(b,a);};f.prototype.add=function(a){var b=this.renderer,p=this.element;a&&(this.parentGroup=a);this.parentInverted=a&&a.inverted;"undefined"!==typeof this.textStr&&
"text"===this.element.nodeName&&b.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)var e=this.zIndexSetter();e||(a?a.element:b.box).appendChild(p);if(this.onAdd)this.onAdd();return this};f.prototype.addClass=function(a,b){var p=b?"":this.attr("class")||"";a=(a||"").split(/ /g).reduce(function(a,b){-1===p.indexOf(b)&&a.push(b);return a},p?[p]:[]).join(" ");a!==p&&this.attr("class",a);return this};f.prototype.afterSetters=function(){this.doTransform&&(this.updateTransform(),this.doTransform=
!1);};f.prototype.align=function(a,b,p){var e,v={};var c=this.renderer;var u=c.alignedObjects;var h,I;if(a){if(this.alignOptions=a,this.alignByTranslate=b,!p||w(p))this.alignTo=e=p||"renderer",m(u,this),u.push(this),p=void 0;}else a=this.alignOptions,b=this.alignByTranslate,e=this.alignTo;p=F(p,c[e],c);e=a.align;c=a.verticalAlign;u=(p.x||0)+(a.x||0);var g=(p.y||0)+(a.y||0);"right"===e?h=1:"center"===e&&(h=2);h&&(u+=(p.width-(a.width||0))/h);v[b?"translateX":"x"]=Math.round(u);"bottom"===c?I=1:"middle"===
c&&(I=2);I&&(g+=(p.height-(a.height||0))/I);v[b?"translateY":"y"]=Math.round(g);this[this.placed?"animate":"attr"](v);this.placed=!0;this.alignAttr=v;return this};f.prototype.alignSetter=function(a){var b={left:"start",center:"middle",right:"end"};b[a]&&(this.alignValue=a,this.element.setAttribute("text-anchor",b[a]));};f.prototype.animate=function(a,b,p){var e=this,v=H(F(b,this.renderer.globalAnimation,!0));b=v.defer;F(l.hidden,l.msHidden,l.webkitHidden,!1)&&(v.duration=0);0!==v.duration?(p&&(v.complete=
p),R(function(){e.element&&D(e,a,v);},b)):(this.attr(a,void 0,p),O(a,function(a,b){v.step&&v.step.call(this,a,{prop:b,pos:1,elem:this});},this));return this};f.prototype.applyTextOutline=function(a){var b=this.element;-1!==a.indexOf("contrast")&&(a=a.replace(/contrast/g,this.renderer.getContrast(b.style.fill)));var p=a.split(" ");a=p[p.length-1];if((p=p[0])&&"none"!==p&&x.svg){this.fakeTS=!0;this.ySetter=this.xSetter;p=p.replace(/(^[\d\.]+)(.*?)$/g,function(a,b,p){return 2*Number(b)+p});this.removeTextOutline();
var e=l.createElementNS(c,"tspan");n(e,{"class":"highcharts-text-outline",fill:a,stroke:a,"stroke-width":p,"stroke-linejoin":"round"});[].forEach.call(b.childNodes,function(a){var b=a.cloneNode(!0);b.removeAttribute&&["fill","stroke","stroke-width","stroke"].forEach(function(a){return b.removeAttribute(a)});e.appendChild(b);});a=l.createElementNS(c,"tspan");a.textContent="\u200b";n(a,{x:b.getAttribute("x"),y:b.getAttribute("y")});e.appendChild(a);b.insertBefore(e,b.firstChild);}};f.prototype.attr=function(a,
b,p,e){var K=this.element,v,u=this,c,h,g=this.symbolCustomAttribs;if("string"===typeof a&&"undefined"!==typeof b){var L=a;a={};a[L]=b;}"string"===typeof a?u=(this[a+"Getter"]||this._defaultGetter).call(this,a,K):(O(a,function(b,p){c=!1;e||t(this,p);this.symbolName&&-1!==g.indexOf(p)&&(v||(this.symbolAttr(a),v=!0),c=!0);!this.rotation||"x"!==p&&"y"!==p||(this.doTransform=!0);c||(h=this[p+"Setter"]||this._defaultSetter,h.call(this,b,p,K),!this.styledMode&&this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(p)&&
this.updateShadows(p,b,h));},this),this.afterSetters());p&&p.call(this);return u};f.prototype.clip=function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":"none")};f.prototype.crisp=function(a,b){b=b||a.strokeWidth||0;var p=Math.round(b)%2/2;a.x=Math.floor(a.x||this.x||0)+p;a.y=Math.floor(a.y||this.y||0)+p;a.width=Math.floor((a.width||this.width||0)-2*p);a.height=Math.floor((a.height||this.height||0)-2*p);z(a.strokeWidth)&&(a.strokeWidth=b);return a};f.prototype.complexColor=
function(a,b,p){var K=this.renderer,v,c,u,g,I,m,L,w,n,r,q=[],F;e(this.renderer,"complexColor",{args:arguments},function(){a.radialGradient?c="radialGradient":a.linearGradient&&(c="linearGradient");if(c){u=a[c];I=K.gradients;m=a.stops;n=p.radialReference;h(u)&&(a[c]=u={x1:u[0],y1:u[1],x2:u[2],y2:u[3],gradientUnits:"userSpaceOnUse"});"radialGradient"===c&&n&&!z(u.gradientUnits)&&(g=u,u=J(u,K.getRadialAttr(n,g),{gradientUnits:"userSpaceOnUse"}));O(u,function(a,b){"id"!==b&&q.push(b,a);});O(m,function(a){q.push(a);});
q=q.join(",");if(I[q])r=I[q].attr("id");else {u.id=r=Q();var e=I[q]=K.createElement(c).attr(u).add(K.defs);e.radAttr=g;e.stops=[];m.forEach(function(a){0===a[1].indexOf("rgba")?(v=k.parse(a[1]),L=v.get("rgb"),w=v.get("a")):(L=a[1],w=1);a=K.createElement("stop").attr({offset:a[0],"stop-color":L,"stop-opacity":w}).add(e);e.stops.push(a);});}F="url("+K.url+"#"+r+")";p.setAttribute(b,F);p.gradient=q;a.toString=function(){return F};}});};f.prototype.css=function(a){var b=this.styles,p={},e=this.element,c="",
v=!b,u=["textOutline","textOverflow","width"];a&&a.color&&(a.fill=a.color);b&&O(a,function(a,u){b&&b[u]!==a&&(p[u]=a,v=!0);});if(v){b&&(a=r(b,p));if(a)if(null===a.width||"auto"===a.width)delete this.textWidth;else if("text"===e.nodeName.toLowerCase()&&a.width)var h=this.textWidth=N(a.width);this.styles=a;h&&!y&&this.renderer.forExport&&delete a.width;if(e.namespaceURI===this.SVG_NS){var g=function(a,b){return "-"+b.toLowerCase()};O(a,function(a,b){-1===u.indexOf(b)&&(c+=b.replace(/([A-Z])/g,g)+":"+
a+";");});c&&n(e,"style",c);}else M(e,a);this.added&&("text"===this.element.nodeName&&this.renderer.buildText(this),a&&a.textOutline&&this.applyTextOutline(a.textOutline));}return this};f.prototype.dashstyleSetter=function(a){var b=this["stroke-width"];"inherit"===b&&(b=1);if(a=a&&a.toLowerCase()){var p=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,
"").split(",");for(a=p.length;a--;)p[a]=""+N(p[a])*F(b,NaN);a=p.join(",").replace(/NaN/g,"none");this.element.setAttribute("stroke-dasharray",a);}};f.prototype.destroy=function(){var a=this,b=a.element||{},p=a.renderer,e=p.isSVG&&"SPAN"===b.nodeName&&a.parentGroup||void 0,c=b.ownerSVGElement;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;t(a);if(a.clipPath&&c){var h=a.clipPath;[].forEach.call(c.querySelectorAll("[clip-path],[CLIP-PATH]"),function(a){-1<a.getAttribute("clip-path").indexOf(h.element.id)&&
a.removeAttribute("clip-path");});a.clipPath=h.destroy();}if(a.stops){for(c=0;c<a.stops.length;c++)a.stops[c].destroy();a.stops.length=0;a.stops=void 0;}a.safeRemoveChild(b);for(p.styledMode||a.destroyShadows();e&&e.div&&0===e.div.childNodes.length;)b=e.parentGroup,a.safeRemoveChild(e.div),delete e.div,e=b;a.alignTo&&m(p.alignedObjects,a);O(a,function(b,p){a[p]&&a[p].parentGroup===a&&a[p].destroy&&a[p].destroy();delete a[p];});};f.prototype.destroyShadows=function(){(this.shadows||[]).forEach(function(a){this.safeRemoveChild(a);},
this);this.shadows=void 0;};f.prototype.destroyTextPath=function(a,b){var p=a.getElementsByTagName("text")[0];if(p){if(p.removeAttribute("dx"),p.removeAttribute("dy"),b.element.setAttribute("id",""),this.textPathWrapper&&p.getElementsByTagName("textPath").length){for(a=this.textPathWrapper.element.childNodes;a.length;)p.appendChild(a[0]);p.removeChild(this.textPathWrapper.element);}}else if(a.getAttribute("dx")||a.getAttribute("dy"))a.removeAttribute("dx"),a.removeAttribute("dy");this.textPathWrapper&&
(this.textPathWrapper=this.textPathWrapper.destroy());};f.prototype.dSetter=function(a,b,p){h(a)&&("string"===typeof a[0]&&(a=this.renderer.pathToSegments(a)),this.pathArray=a,a=a.reduce(function(a,b,p){return b&&b.join?(p?a+" ":"")+b.join(" "):(b||"").toString()},""));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");this[b]!==a&&(p.setAttribute(b,a),this[b]=a);};f.prototype.fadeOut=function(a){var b=this;b.animate({opacity:0},{duration:F(a,150),complete:function(){b.attr({y:-9999}).hide();}});};f.prototype.fillSetter=
function(a,b,p){"string"===typeof a?p.setAttribute(b,a):a&&this.complexColor(a,b,p);};f.prototype.getBBox=function(b,e){var p,c=this.renderer,h=this.element,g=this.styles,u=this.textStr,m=c.cache,I=c.cacheKeys,v=h.namespaceURI===this.SVG_NS;e=F(e,this.rotation,0);var L=c.styledMode?h&&f.prototype.getStyle.call(h,"font-size"):g&&g.fontSize;if(z(u)){var w=u.toString();-1===w.indexOf("<")&&(w=w.replace(/[0-9]/g,"0"));w+=["",e,L,this.textWidth,g&&g.textOverflow,g&&g.fontWeight].join();}w&&!b&&(p=m[w]);
if(!p){if(v||c.forExport){try{var n=this.fakeTS&&function(a){var b=h.querySelector(".highcharts-text-outline");b&&M(b,{display:a});};a(n)&&n("none");p=h.getBBox?r({},h.getBBox()):{width:h.offsetWidth,height:h.offsetHeight};a(n)&&n("");}catch(da){}if(!p||0>p.width)p={width:0,height:0};}else p=this.htmlGetBBox();c.isSVG&&(b=p.width,c=p.height,v&&(p.height=c={"11px,17":14,"13px,20":16}[g&&g.fontSize+","+Math.round(c)]||c),e&&(g=e*C,p.width=Math.abs(c*Math.sin(g))+Math.abs(b*Math.cos(g)),p.height=Math.abs(c*
Math.cos(g))+Math.abs(b*Math.sin(g))));if(w&&0<p.height){for(;250<I.length;)delete m[I.shift()];m[w]||I.push(w);m[w]=p;}}return p};f.prototype.getStyle=function(a){return q.getComputedStyle(this.element||this,"").getPropertyValue(a)};f.prototype.hasClass=function(a){return -1!==(""+this.attr("class")).split(" ").indexOf(a)};f.prototype.hide=function(a){a?this.attr({y:-9999}):this.attr({visibility:"hidden"});return this};f.prototype.htmlGetBBox=function(){return {height:0,width:0,x:0,y:0}};f.prototype.init=
function(a,b){this.element="span"===b?A(b):l.createElementNS(this.SVG_NS,b);this.renderer=a;e(this,"afterInit");};f.prototype.invert=function(a){this.inverted=a;this.updateTransform();return this};f.prototype.on=function(a,b){var p,e,c=this.element,h;E&&"click"===a?(c.ontouchstart=function(a){p=a.touches[0].clientX;e=a.touches[0].clientY;},c.ontouchend=function(a){p&&4<=Math.sqrt(Math.pow(p-a.changedTouches[0].clientX,2)+Math.pow(e-a.changedTouches[0].clientY,2))||b.call(c,a);h=!0;!1!==a.cancelable&&
a.preventDefault();},c.onclick=function(a){h||b.call(c,a);}):c["on"+a]=b;return this};f.prototype.opacitySetter=function(a,b,p){this.opacity=a=Number(Number(a).toFixed(3));p.setAttribute(b,a);};f.prototype.removeClass=function(a){return this.attr("class",(""+this.attr("class")).replace(w(a)?new RegExp("(^| )"+a+"( |$)"):a," ").replace(/ +/g," ").trim())};f.prototype.removeTextOutline=function(){var a=this.element.querySelector("tspan.highcharts-text-outline");a&&this.safeRemoveChild(a);};f.prototype.safeRemoveChild=
function(a){var b=a.parentNode;b&&b.removeChild(a);};f.prototype.setRadialReference=function(a){var b=this.element.gradient&&this.renderer.gradients[this.element.gradient];this.element.radialReference=a;b&&b.radAttr&&b.animate(this.renderer.getRadialAttr(a,b.radAttr));return this};f.prototype.setTextPath=function(a,e){var p=this.element,c=this.text?this.text.element:p,h={textAnchor:"text-anchor"},m=!1,u=this.textPathWrapper,v=!u;e=J(!0,{enabled:!0,attributes:{dy:-5,startOffset:"50%",textAnchor:"middle"}},
e);var I=d.filterUserAttributes(e.attributes);if(a&&e&&e.enabled){u&&null===u.element.parentNode?(v=!0,u=u.destroy()):u&&this.removeTextOutline.call(u.parentGroup);this.options&&this.options.padding&&(I.dx=-this.options.padding);u||(this.textPathWrapper=u=this.renderer.createElement("textPath"),m=!0);var w=u.element;(e=a.element.getAttribute("id"))||a.element.setAttribute("id",e=Q());if(v)for(c.setAttribute("y",0),b(I.dx)&&c.setAttribute("x",-I.dx),a=[].slice.call(c.childNodes),v=0;v<a.length;v++){var n=
a[v];n.nodeType!==Node.TEXT_NODE&&"tspan"!==n.nodeName||w.appendChild(n);}m&&u&&u.add({element:c});w.setAttributeNS("http://www.w3.org/1999/xlink","href",this.renderer.url+"#"+e);z(I.dy)&&(w.parentNode.setAttribute("dy",I.dy),delete I.dy);z(I.dx)&&(w.parentNode.setAttribute("dx",I.dx),delete I.dx);O(I,function(a,b){w.setAttribute(h[b]||b,a);});p.removeAttribute("transform");this.removeTextOutline.call(u);this.text&&!this.renderer.styledMode&&this.attr({fill:"none","stroke-width":0});this.applyTextOutline=
this.updateTransform=g;}else u&&(delete this.updateTransform,delete this.applyTextOutline,this.destroyTextPath(p,a),this.updateTransform(),this.options&&this.options.rotation&&this.applyTextOutline(this.options.style.textOutline));return this};f.prototype.shadow=function(a,b,p){var e=[],c=this.element,h=!1,u=this.oldShadowOptions;var g={color:B.neutralColor100,offsetX:1,offsetY:1,opacity:.15,width:3};var I;!0===a?I=g:"object"===typeof a&&(I=r(g,a));I&&(I&&u&&O(I,function(a,b){a!==u[b]&&(h=!0);}),h&&
this.destroyShadows(),this.oldShadowOptions=I);if(!I)this.destroyShadows();else if(!this.shadows){var m=I.opacity/I.width;var v=this.parentInverted?"translate(-1,-1)":"translate("+I.offsetX+", "+I.offsetY+")";for(g=1;g<=I.width;g++){var w=c.cloneNode(!1);var L=2*I.width+1-2*g;n(w,{stroke:a.color||B.neutralColor100,"stroke-opacity":m*g,"stroke-width":L,transform:v,fill:"none"});w.setAttribute("class",(w.getAttribute("class")||"")+" highcharts-shadow");p&&(n(w,"height",Math.max(n(w,"height")-L,0)),
w.cutHeight=L);b?b.element.appendChild(w):c.parentNode&&c.parentNode.insertBefore(w,c);e.push(w);}this.shadows=e;}return this};f.prototype.show=function(a){return this.attr({visibility:a?"inherit":"visible"})};f.prototype.strokeSetter=function(a,b,p){this[b]=a;this.stroke&&this["stroke-width"]?(f.prototype.fillSetter.call(this,this.stroke,"stroke",p),p.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0):"stroke-width"===b&&0===a&&this.hasStroke?(p.removeAttribute("stroke"),this.hasStroke=
!1):this.renderer.styledMode&&this["stroke-width"]&&(p.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0);};f.prototype.strokeWidth=function(){if(!this.renderer.styledMode)return this["stroke-width"]||0;var a=this.getStyle("stroke-width"),b=0;if(a.indexOf("px")===a.length-2)b=N(a);else if(""!==a){var p=l.createElementNS(c,"rect");n(p,{width:a,"stroke-width":0});this.element.parentNode.appendChild(p);b=p.getBBox().width;p.parentNode.removeChild(p);}return b};f.prototype.symbolAttr=
function(a){var b=this;"x y r start end width height innerR anchorX anchorY clockwise".split(" ").forEach(function(p){b[p]=F(a[p],b[p]);});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)});};f.prototype.textSetter=function(a){a!==this.textStr&&(delete this.textPxLength,this.textStr=a,this.added&&this.renderer.buildText(this));};f.prototype.titleSetter=function(a){var b=this.element,p=b.getElementsByTagName("title")[0]||l.createElementNS(this.SVG_NS,"title");b.insertBefore?b.insertBefore(p,
b.firstChild):b.appendChild(p);p.textContent=String(F(a,"")).replace(/<[^>]*>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">");};f.prototype.toFront=function(){var a=this.element;a.parentNode.appendChild(a);return this};f.prototype.translate=function(a,b){return this.attr({translateX:a,translateY:b})};f.prototype.updateShadows=function(a,b,p){var e=this.shadows;if(e)for(var c=e.length;c--;)p.call(e[c],"height"===a?Math.max(b-(e[c].cutHeight||0),0):"d"===a?this.d:b,a,e[c]);};f.prototype.updateTransform=
function(){var a=this.translateX||0,b=this.translateY||0,p=this.scaleX,e=this.scaleY,c=this.inverted,h=this.rotation,u=this.matrix,g=this.element;c&&(a+=this.width,b+=this.height);a=["translate("+a+","+b+")"];z(u)&&a.push("matrix("+u.join(",")+")");c?a.push("rotate(90) scale(-1,1)"):h&&a.push("rotate("+h+" "+F(this.rotationOriginX,g.getAttribute("x"),0)+" "+F(this.rotationOriginY,g.getAttribute("y")||0)+")");(z(p)||z(e))&&a.push("scale("+F(p,1)+" "+F(e,1)+")");a.length&&g.setAttribute("transform",
a.join(" "));};f.prototype.visibilitySetter=function(a,b,p){"inherit"===a?p.removeAttribute(b):this[b]!==a&&p.setAttribute(b,a);this[b]=a;};f.prototype.xGetter=function(a){"circle"===this.element.nodeName&&("x"===a?a="cx":"y"===a&&(a="cy"));return this._defaultGetter(a)};f.prototype.zIndexSetter=function(a,b){var p=this.renderer,e=this.parentGroup,c=(e||p).element||p.box,h=this.element,u=!1;p=c===p.box;var g=this.added;var I;z(a)?(h.setAttribute("data-z-index",a),a=+a,this[b]===a&&(g=!1)):z(this[b])&&
h.removeAttribute("data-z-index");this[b]=a;if(g){(a=this.zIndex)&&e&&(e.handleZ=!0);b=c.childNodes;for(I=b.length-1;0<=I&&!u;I--){e=b[I];g=e.getAttribute("data-z-index");var m=!z(g);if(e!==h)if(0>a&&m&&!p&&!I)c.insertBefore(h,b[I]),u=!0;else if(N(g)<=a||m&&(!z(a)||0<=a))c.insertBefore(h,b[I+1]||null),u=!0;}u||(c.insertBefore(h,b[p?3:0]||null),u=!0);}return u};return f}();f.prototype["stroke-widthSetter"]=f.prototype.strokeSetter;f.prototype.yGetter=f.prototype.xGetter;f.prototype.matrixSetter=f.prototype.rotationOriginXSetter=
f.prototype.rotationOriginYSetter=f.prototype.rotationSetter=f.prototype.scaleXSetter=f.prototype.scaleYSetter=f.prototype.translateXSetter=f.prototype.translateYSetter=f.prototype.verticalAlignSetter=function(a,b){this[b]=a;this.doTransform=!0;};x.SVGElement=f;return x.SVGElement});P(k,"Core/Renderer/SVG/SVGLabel.js",[k["Core/Renderer/SVG/SVGElement.js"],k["Core/Utilities.js"]],function(f,d){function k(f,d){D(f)?f!==this[d]&&(this[d]=f,this.updateTextPadding()):this[d]=void 0;}var x=this&&this.__extends||
function(){var f=function(d,g){f=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(g,c){g.__proto__=c;}||function(g,c){for(var q in c)c.hasOwnProperty(q)&&(g[q]=c[q]);};return f(d,g)};return function(d,g){function y(){this.constructor=d;}f(d,g);d.prototype=null===g?Object.create(g):(y.prototype=g.prototype,new y);}}(),B=d.defined,G=d.extend,D=d.isNumber,H=d.merge,t=d.pick,C=d.removeEvent;return function(d){function l(g,f,c,q,n,A,M,z,m,r){var e=d.call(this)||this;e.paddingSetter=k;e.paddingLeftSetter=
k;e.paddingRightSetter=k;e.init(g,"g");e.textStr=f;e.x=c;e.y=q;e.anchorX=A;e.anchorY=M;e.baseline=m;e.className=r;"button"!==r&&e.addClass("highcharts-label");r&&e.addClass("highcharts-"+r);e.text=g.text("",0,0,z).attr({zIndex:1});if("string"===typeof n){var h=/^url\((.*?)\)$/.test(n);if(e.renderer.symbols[n]||h)e.symbolKey=n;}e.bBox=l.emptyBBox;e.padding=3;e.baselineOffset=0;e.needsBox=g.styledMode||h;e.deferredAttr={};e.alignFactor=0;return e}x(l,d);l.prototype.alignSetter=function(g){g={left:0,
center:.5,right:1}[g];g!==this.alignFactor&&(this.alignFactor=g,this.bBox&&D(this.xSetting)&&this.attr({x:this.xSetting}));};l.prototype.anchorXSetter=function(g,l){this.anchorX=g;this.boxAttr(l,Math.round(g)-this.getCrispAdjust()-this.xSetting);};l.prototype.anchorYSetter=function(g,l){this.anchorY=g;this.boxAttr(l,g-this.ySetting);};l.prototype.boxAttr=function(g,l){this.box?this.box.attr(g,l):this.deferredAttr[g]=l;};l.prototype.css=function(g){if(g){var d={};g=H(g);l.textProps.forEach(function(c){"undefined"!==
typeof g[c]&&(d[c]=g[c],delete g[c]);});this.text.css(d);var c="width"in d;"fontSize"in d||"fontWeight"in d?this.updateTextPadding():c&&this.updateBoxSize();}return f.prototype.css.call(this,g)};l.prototype.destroy=function(){C(this.element,"mouseenter");C(this.element,"mouseleave");this.text&&this.text.destroy();this.box&&(this.box=this.box.destroy());f.prototype.destroy.call(this);};l.prototype.fillSetter=function(g,l){g&&(this.needsBox=!0);this.fill=g;this.boxAttr(l,g);};l.prototype.getBBox=function(){var g=
this.bBox,l=this.padding,c=t(this.paddingLeft,l);return {width:this.width,height:this.height,x:g.x-c,y:g.y-l}};l.prototype.getCrispAdjust=function(){return this.renderer.styledMode&&this.box?this.box.strokeWidth()%2/2:(this["stroke-width"]?parseInt(this["stroke-width"],10):0)%2/2};l.prototype.heightSetter=function(g){this.heightSetting=g;};l.prototype.on=function(g,l){var c=this,q=c.text,n=q&&"SPAN"===q.element.tagName?q:void 0;if(n){var d=function(q){("mouseenter"===g||"mouseleave"===g)&&q.relatedTarget instanceof
Element&&(c.element.compareDocumentPosition(q.relatedTarget)&Node.DOCUMENT_POSITION_CONTAINED_BY||n.element.compareDocumentPosition(q.relatedTarget)&Node.DOCUMENT_POSITION_CONTAINED_BY)||l.call(c.element,q);};n.on(g,d);}f.prototype.on.call(c,g,d||l);return c};l.prototype.onAdd=function(){var g=this.textStr;this.text.add(this);this.attr({text:B(g)?g:"",x:this.x,y:this.y});this.box&&B(this.anchorX)&&this.attr({anchorX:this.anchorX,anchorY:this.anchorY});};l.prototype.rSetter=function(g,l){this.boxAttr(l,
g);};l.prototype.shadow=function(g){g&&!this.renderer.styledMode&&(this.updateBoxSize(),this.box&&this.box.shadow(g));return this};l.prototype.strokeSetter=function(g,l){this.stroke=g;this.boxAttr(l,g);};l.prototype["stroke-widthSetter"]=function(g,l){g&&(this.needsBox=!0);this["stroke-width"]=g;this.boxAttr(l,g);};l.prototype["text-alignSetter"]=function(g){this.textAlign=g;};l.prototype.textSetter=function(g){"undefined"!==typeof g&&this.text.attr({text:g});this.updateTextPadding();};l.prototype.updateBoxSize=
function(){var g=this.text.element.style,d={},c=this.padding,q=this.bBox=D(this.widthSetting)&&D(this.heightSetting)&&!this.textAlign||!B(this.text.textStr)?l.emptyBBox:this.text.getBBox();this.width=this.getPaddedWidth();this.height=(this.heightSetting||q.height||0)+2*c;this.baselineOffset=c+Math.min(this.renderer.fontMetrics(g&&g.fontSize,this.text).b,q.height||Infinity);this.needsBox&&(this.box||(g=this.box=this.symbolKey?this.renderer.symbol(this.symbolKey):this.renderer.rect(),g.addClass(("button"===
this.className?"":"highcharts-label-box")+(this.className?" highcharts-"+this.className+"-box":"")),g.add(this)),g=this.getCrispAdjust(),d.x=g,d.y=(this.baseline?-this.baselineOffset:0)+g,d.width=Math.round(this.width),d.height=Math.round(this.height),this.box.attr(G(d,this.deferredAttr)),this.deferredAttr={});};l.prototype.updateTextPadding=function(){var g=this.text;this.updateBoxSize();var l=this.baseline?0:this.baselineOffset,c=t(this.paddingLeft,this.padding);B(this.widthSetting)&&this.bBox&&
("center"===this.textAlign||"right"===this.textAlign)&&(c+={center:.5,right:1}[this.textAlign]*(this.widthSetting-this.bBox.width));if(c!==g.x||l!==g.y)g.attr("x",c),g.hasBoxWidthChanged&&(this.bBox=g.getBBox(!0)),"undefined"!==typeof l&&g.attr("y",l);g.x=c;g.y=l;};l.prototype.widthSetter=function(g){this.widthSetting=D(g)?g:void 0;};l.prototype.getPaddedWidth=function(){var g=this.padding,l=t(this.paddingLeft,g);g=t(this.paddingRight,g);return (this.widthSetting||this.bBox.width||0)+l+g};l.prototype.xSetter=
function(g){this.x=g;this.alignFactor&&(g-=this.alignFactor*this.getPaddedWidth(),this["forceAnimate:x"]=!0);this.xSetting=Math.round(g);this.attr("translateX",this.xSetting);};l.prototype.ySetter=function(g){this.ySetting=this.y=Math.round(g);this.attr("translateY",this.ySetting);};l.emptyBBox={width:0,height:0,x:0,y:0};l.textProps="color direction fontFamily fontSize fontStyle fontWeight lineHeight textAlign textDecoration textOutline textOverflow width".split(" ");return l}(f)});P(k,"Core/Renderer/SVG/TextBuilder.js",
[k["Core/Globals.js"],k["Core/Utilities.js"],k["Core/Renderer/HTML/AST.js"]],function(f,d,k){var x=f.doc,B=f.SVG_NS,S=d.attr,D=d.isString,H=d.objectEach,t=d.pick;return function(){function d(l){var d=l.styles;this.renderer=l.renderer;this.svgElement=l;this.width=l.textWidth;this.textLineHeight=d&&d.lineHeight;this.textOutline=d&&d.textOutline;this.ellipsis=!(!d||"ellipsis"!==d.textOverflow);this.noWrap=!(!d||"nowrap"!==d.whiteSpace);this.fontSize=d&&d.fontSize;}d.prototype.buildSVG=function(){var l=
this.svgElement,d=l.element,g=l.renderer,f=t(l.textStr,"").toString(),c=-1!==f.indexOf("<"),q=d.childNodes,n=q.length;g=this.width&&!l.added&&g.box;var A=/<br.*?>/g;var M=[f,this.ellipsis,this.noWrap,this.textLineHeight,this.textOutline,this.fontSize,this.width].join();if(M!==l.textCache){l.textCache=M;for(delete l.actualWidth;n--;)d.removeChild(q[n]);c||this.ellipsis||this.width||-1!==f.indexOf(" ")&&(!this.noWrap||A.test(f))?""!==f&&(g&&g.appendChild(d),f=new k(f),this.modifyTree(f.nodes),f.addToDOM(l.element),
this.modifyDOM(),this.ellipsis&&-1!==(d.textContent||"").indexOf("\u2026")&&l.attr("title",this.unescapeEntities(l.textStr||"",["&lt;","&gt;"])),g&&g.removeChild(d)):d.appendChild(x.createTextNode(this.unescapeEntities(f)));D(this.textOutline)&&l.applyTextOutline&&l.applyTextOutline(this.textOutline);}};d.prototype.modifyDOM=function(){var d=this,f=this.svgElement,g=S(f.element,"x");[].forEach.call(f.element.querySelectorAll("tspan.highcharts-br"),function(c){c.nextSibling&&c.previousSibling&&S(c,
{dy:d.getLineHeight(c.nextSibling),x:g});});var y=this.width||0;if(y){var c=function(c,q){var n=c.textContent||"",l=n.replace(/([^\^])-/g,"$1- ").split(" "),m=!d.noWrap&&(1<l.length||1<f.element.childNodes.length),r=d.getLineHeight(q),e=0,h=f.actualWidth;if(d.ellipsis)n&&d.truncate(c,n,void 0,0,Math.max(0,y-parseInt(d.fontSize||12,10)),function(a,b){return a.substring(0,b)+"\u2026"});else if(m){n=[];for(m=[];q.firstChild&&q.firstChild!==c;)m.push(q.firstChild),q.removeChild(q.firstChild);for(;l.length;)l.length&&
!d.noWrap&&0<e&&(n.push(c.textContent||""),c.textContent=l.join(" ").replace(/- /g,"-")),d.truncate(c,void 0,l,0===e?h||0:0,y,function(a,b){return l.slice(0,b).join(" ").replace(/- /g,"-")}),h=f.actualWidth,e++;m.forEach(function(a){q.insertBefore(a,c);});n.forEach(function(a){q.insertBefore(x.createTextNode(a),c);a=x.createElementNS(B,"tspan");a.textContent="\u200b";S(a,{dy:r,x:g});q.insertBefore(a,c);});}},q=function(g){[].slice.call(g.childNodes).forEach(function(n){n.nodeType===Node.TEXT_NODE?c(n,
g):(-1!==n.className.baseVal.indexOf("highcharts-br")&&(f.actualWidth=0),q(n));});};q(f.element);}};d.prototype.getLineHeight=function(d){var l;d=d.nodeType===Node.TEXT_NODE?d.parentElement:d;this.renderer.styledMode||(l=d&&/(px|em)$/.test(d.style.fontSize)?d.style.fontSize:this.fontSize||this.renderer.style.fontSize||12);return this.textLineHeight?parseInt(this.textLineHeight.toString(),10):this.renderer.fontMetrics(l,d||this.svgElement.element).h};d.prototype.modifyTree=function(d){var l=this,g=function(f,
c){var q=f.tagName,n=l.renderer.styledMode,A=f.attributes||{};if("b"===q||"strong"===q)n?A["class"]="highcharts-strong":A.style="font-weight:bold;"+(A.style||"");else if("i"===q||"em"===q)n?A["class"]="highcharts-emphasized":A.style="font-style:italic;"+(A.style||"");D(A.style)&&(A.style=A.style.replace(/(;| |^)color([ :])/,"$1fill$2"));"br"===q&&(A["class"]="highcharts-br",f.textContent="\u200b",(c=d[c+1])&&c.textContent&&(c.textContent=c.textContent.replace(/^ +/gm,"")));"#text"!==q&&"a"!==q&&(f.tagName=
"tspan");f.attributes=A;f.children&&f.children.filter(function(c){return "#text"!==c.tagName}).forEach(g);};for(d.forEach(g);d[0]&&"tspan"===d[0].tagName&&!d[0].children;)d.splice(0,1);};d.prototype.truncate=function(d,f,g,y,c,q){var n=this.svgElement,l=n.renderer,M=n.rotation,z=[],m=g?1:0,r=(f||g||"").length,e=r,h,a=function(a,b){b=b||a;var e=d.parentNode;if(e&&"undefined"===typeof z[b])if(e.getSubStringLength)try{z[b]=y+e.getSubStringLength(0,g?b+1:b);}catch(F){}else l.getSpanWidth&&(d.textContent=
q(f||g,a),z[b]=y+l.getSpanWidth(n,d));return z[b]};n.rotation=0;var b=a(d.textContent.length);if(y+b>c){for(;m<=r;)e=Math.ceil((m+r)/2),g&&(h=q(g,e)),b=a(e,h&&h.length-1),m===r?m=r+1:b>c?r=e-1:m=e;0===r?d.textContent="":f&&r===f.length-1||(d.textContent=h||q(f||g,e));}g&&g.splice(0,e);n.actualWidth=b;n.rotation=M;};d.prototype.unescapeEntities=function(d,f){H(this.renderer.escapes,function(g,l){f&&-1!==f.indexOf(g)||(d=d.toString().replace(new RegExp(g,"g"),l));});return d};return d}()});P(k,"Core/Renderer/SVG/SVGRenderer.js",
[k["Core/Color/Color.js"],k["Core/Globals.js"],k["Core/Color/Palette.js"],k["Core/Renderer/SVG/SVGElement.js"],k["Core/Renderer/SVG/SVGLabel.js"],k["Core/Renderer/HTML/AST.js"],k["Core/Renderer/SVG/TextBuilder.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G,D,H){var t=H.addEvent,C=H.attr,l=H.createElement,E=H.css,g=H.defined,y=H.destroyObjectProperties,c=H.extend,q=H.isArray,n=H.isNumber,A=H.isObject,M=H.isString,z=H.merge,m=H.pick,r=H.pInt,e=H.uniqueKey,h=d.charts,a=d.deg2rad,b=d.doc,w=d.isFirefox,
J=d.isMS,O=d.isWebKit;H=d.noop;var F=d.SVG_NS,N=d.symbolSizes,R=d.win,Q,T=function(){function d(a,b,e,c,h,u,g){this.width=this.url=this.style=this.isSVG=this.imgCount=this.height=this.gradients=this.globalAnimation=this.defs=this.chartIndex=this.cacheKeys=this.cache=this.boxWrapper=this.box=this.alignedObjects=void 0;this.init(a,b,e,c,h,u,g);}d.prototype.init=function(a,p,e,c,h,u,g){var K=this.createElement("svg").attr({version:"1.1","class":"highcharts-root"});g||K.css(this.getStyle(c));c=K.element;
a.appendChild(c);C(a,"dir","ltr");-1===a.innerHTML.indexOf("xmlns")&&C(c,"xmlns",this.SVG_NS);this.isSVG=!0;this.box=c;this.boxWrapper=K;this.alignedObjects=[];this.url=this.getReferenceURL();this.createElement("desc").add().element.appendChild(b.createTextNode("Created with Highcharts 9.0.1"));this.defs=this.createElement("defs").add();this.allowHTML=u;this.forExport=h;this.styledMode=g;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(p,e,!1);var m;w&&a.getBoundingClientRect&&
(p=function(){E(a,{left:0,top:0});m=a.getBoundingClientRect();E(a,{left:Math.ceil(m.left)-m.left+"px",top:Math.ceil(m.top)-m.top+"px"});},p(),this.unSubPixelFix=t(R,"resize",p));};d.prototype.definition=function(a){return (new G([a])).addToDOM(this.defs.element)};d.prototype.getReferenceURL=function(){if((w||O)&&b.getElementsByTagName("base").length){if(!g(Q)){var a=e();a=(new G([{tagName:"svg",attributes:{width:8,height:8},children:[{tagName:"defs",children:[{tagName:"clipPath",attributes:{id:a},children:[{tagName:"rect",
attributes:{width:4,height:4}}]}]},{tagName:"rect",attributes:{id:"hitme",width:8,height:8,"clip-path":"url(#"+a+")",fill:"rgba(0,0,0,0.001)"}}]}])).addToDOM(b.body);E(a,{position:"fixed",top:0,left:0,zIndex:9E5});var p=b.elementFromPoint(6,6);Q="hitme"===(p&&p.id);b.body.removeChild(a);}if(Q)return R.location.href.split("#")[0].replace(/<[^>]*>/g,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20")}return ""};d.prototype.getStyle=function(a){return this.style=c({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
fontSize:"12px"},a)};d.prototype.setStyle=function(a){this.boxWrapper.css(this.getStyle(a));};d.prototype.isHidden=function(){return !this.boxWrapper.getBBox().width};d.prototype.destroy=function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();y(this.gradients||{});this.gradients=null;a&&(this.defs=a.destroy());this.unSubPixelFix&&this.unSubPixelFix();return this.alignedObjects=null};d.prototype.createElement=function(a){var b=new this.Element;b.init(this,a);return b};d.prototype.getRadialAttr=
function(a,b){return {cx:a[0]-a[2]/2+b.cx*a[2],cy:a[1]-a[2]/2+b.cy*a[2],r:b.r*a[2]}};d.prototype.buildText=function(a){(new D(a)).buildSVG();};d.prototype.getContrast=function(a){a=f.parse(a).rgba;a[0]*=1;a[1]*=1.2;a[2]*=.5;return 459<a[0]+a[1]+a[2]?"#000000":"#FFFFFF"};d.prototype.button=function(a,b,e,h,g,u,m,I,w,d){var p=this.label(a,b,e,w,void 0,void 0,d,void 0,"button"),K=0,n=this.styledMode,q=g?z(g):{};a=q&&q.style||{};q=G.filterUserAttributes(q);p.attr(z({padding:8,r:2},q));if(!n){q=z({fill:k.neutralColor3,
stroke:k.neutralColor20,"stroke-width":1,style:{color:k.neutralColor80,cursor:"pointer",fontWeight:"normal"}},{style:a},q);var r=q.style;delete q.style;u=z(q,{fill:k.neutralColor10},G.filterUserAttributes(u||{}));var aa=u.style;delete u.style;m=z(q,{fill:k.highlightColor10,style:{color:k.neutralColor100,fontWeight:"bold"}},G.filterUserAttributes(m||{}));var f=m.style;delete m.style;I=z(q,{style:{color:k.neutralColor20}},G.filterUserAttributes(I||{}));var v=I.style;delete I.style;}t(p.element,J?"mouseover":
"mouseenter",function(){3!==K&&p.setState(1);});t(p.element,J?"mouseout":"mouseleave",function(){3!==K&&p.setState(K);});p.setState=function(a){1!==a&&(p.state=K=a);p.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-"+["normal","hover","pressed","disabled"][a||0]);n||p.attr([q,u,m,I][a||0]).css([r,aa,f,v][a||0]);};n||p.attr(q).css(c({cursor:"default"},r));return p.on("click",function(a){3!==K&&h.call(p,a);})};d.prototype.crispLine=function(a,b,e){void 0===e&&
(e="round");var p=a[0],c=a[1];p[1]===c[1]&&(p[1]=c[1]=Math[e](p[1])-b%2/2);p[2]===c[2]&&(p[2]=c[2]=Math[e](p[2])+b%2/2);return a};d.prototype.path=function(a){var b=this.styledMode?{}:{fill:"none"};q(a)?b.d=a:A(a)&&c(b,a);return this.createElement("path").attr(b)};d.prototype.circle=function(a,b,e){a=A(a)?a:"undefined"===typeof a?{}:{x:a,y:b,r:e};b=this.createElement("circle");b.xSetter=b.ySetter=function(a,b,p){p.setAttribute("c"+b,a);};return b.attr(a)};d.prototype.arc=function(a,b,e,c,h,u){A(a)?
(c=a,b=c.y,e=c.r,a=c.x):c={innerR:c,start:h,end:u};a=this.symbol("arc",a,b,e,e,c);a.r=e;return a};d.prototype.rect=function(a,b,e,c,h,u){h=A(a)?a.r:h;var p=this.createElement("rect");a=A(a)?a:"undefined"===typeof a?{}:{x:a,y:b,width:Math.max(e,0),height:Math.max(c,0)};this.styledMode||("undefined"!==typeof u&&(a.strokeWidth=u,a=p.crisp(a)),a.fill="none");h&&(a.r=h);p.rSetter=function(a,b,e){p.r=a;C(e,{rx:a,ry:a});};p.rGetter=function(){return p.r};return p.attr(a)};d.prototype.setSize=function(a,b,
e){var p=this.alignedObjects,c=p.length;this.width=a;this.height=b;for(this.boxWrapper.animate({width:a,height:b},{step:function(){this.attr({viewBox:"0 0 "+this.attr("width")+" "+this.attr("height")});},duration:m(e,!0)?void 0:0});c--;)p[c].align();};d.prototype.g=function(a){var b=this.createElement("g");return a?b.attr({"class":"highcharts-"+a}):b};d.prototype.image=function(a,b,e,h,g,u){var p={preserveAspectRatio:"none"},K=function(a,b){a.setAttributeNS?a.setAttributeNS("http://www.w3.org/1999/xlink",
"href",b):a.setAttribute("hc-svg-href",b);},m=function(b){K(w.element,a);u.call(w,b);};1<arguments.length&&c(p,{x:b,y:e,width:h,height:g});var w=this.createElement("image").attr(p);u?(K(w.element,"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),p=new R.Image,t(p,"load",m),p.src=a,p.complete&&m({})):K(w.element,a);return w};d.prototype.symbol=function(a,p,e,w,d,u){var K=this,I=/^url\((.*?)\)$/,q=I.test(a),n=!q&&(this.symbols[a]?a:"circle"),r=n&&this.symbols[n],J;if(r){"number"===
typeof p&&(J=r.call(this.symbols,Math.round(p||0),Math.round(e||0),w||0,d||0,u));var f=this.path(J);K.styledMode||f.attr("fill","none");c(f,{symbolName:n,x:p,y:e,width:w,height:d});u&&c(f,u);}else if(q){var v=a.match(I)[1];f=this.image(v);f.imgwidth=m(N[v]&&N[v].width,u&&u.width);f.imgheight=m(N[v]&&N[v].height,u&&u.height);var F=function(){f.attr({width:f.width,height:f.height});};["width","height"].forEach(function(a){f[a+"Setter"]=function(a,b){var p={},e=this["img"+b],c="width"===b?"translateX":
"translateY";this[b]=a;g(e)&&(u&&"within"===u.backgroundSize&&this.width&&this.height&&(e=Math.round(e*Math.min(this.width/this.imgwidth,this.height/this.imgheight))),this.element&&this.element.setAttribute(b,e),this.alignByTranslate||(p[c]=((this[b]||0)-e)/2,this.attr(p)));};});g(p)&&f.attr({x:p,y:e});f.isImg=!0;g(f.imgwidth)&&g(f.imgheight)?F():(f.attr({width:0,height:0}),l("img",{onload:function(){var a=h[K.chartIndex];0===this.width&&(E(this,{position:"absolute",top:"-999em"}),b.body.appendChild(this));
N[v]={width:this.width,height:this.height};f.imgwidth=this.width;f.imgheight=this.height;f.element&&F();this.parentNode&&this.parentNode.removeChild(this);K.imgCount--;if(!K.imgCount&&a&&!a.hasLoaded)a.onload();},src:v}),this.imgCount++);}return f};d.prototype.clipRect=function(a,b,c,h){var p=e()+"-",u=this.createElement("clipPath").attr({id:p}).add(this.defs);a=this.rect(a,b,c,h,0).add(u);a.id=p;a.clipPath=u;a.count=0;return a};d.prototype.text=function(a,b,e,c){var p={};if(c&&(this.allowHTML||!this.forExport))return this.html(a,
b,e);p.x=Math.round(b||0);e&&(p.y=Math.round(e));g(a)&&(p.text=a);a=this.createElement("text").attr(p);c||(a.xSetter=function(a,b,p){var e=p.getElementsByTagName("tspan"),u=p.getAttribute(b),c;for(c=0;c<e.length;c++){var h=e[c];h.getAttribute(b)===u&&h.setAttribute(b,a);}p.setAttribute(b,a);});return a};d.prototype.fontMetrics=function(a,b){a=!this.styledMode&&/px/.test(a)||!R.getComputedStyle?a||b&&b.style&&b.style.fontSize||this.style&&this.style.fontSize:b&&x.prototype.getStyle.call(b,"font-size");
a=/px/.test(a)?r(a):12;b=24>a?a+3:Math.round(1.2*a);return {h:b,b:Math.round(.8*b),f:a}};d.prototype.rotCorr=function(b,p,e){var c=b;p&&e&&(c=Math.max(c*Math.cos(p*a),4));return {x:-b/3*Math.sin(p*a),y:c}};d.prototype.pathToSegments=function(a){for(var b=[],e=[],c={A:8,C:7,H:2,L:3,M:3,Q:5,S:5,T:3,V:2},h=0;h<a.length;h++)M(e[0])&&n(a[h])&&e.length===c[e[0].toUpperCase()]&&a.splice(h,0,e[0].replace("M","L").replace("m","l")),"string"===typeof a[h]&&(e.length&&b.push(e.slice(0)),e.length=0),e.push(a[h]);
b.push(e.slice(0));return b};d.prototype.label=function(a,b,e,c,h,u,g,m,w){return new B(this,a,b,e,c,h,u,g,m,w)};return d}();T.prototype.Element=x;T.prototype.SVG_NS=F;T.prototype.draw=H;T.prototype.escapes={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"};T.prototype.symbols={circle:function(a,b,e,c){return this.arc(a+e/2,b+c/2,e/2,c/2,{start:.5*Math.PI,end:2.5*Math.PI,open:!1})},square:function(a,b,e,c){return [["M",a,b],["L",a+e,b],["L",a+e,b+c],["L",a,b+c],["Z"]]},triangle:function(a,
b,e,c){return [["M",a+e/2,b],["L",a+e,b+c],["L",a,b+c],["Z"]]},"triangle-down":function(a,b,e,c){return [["M",a,b],["L",a+e,b],["L",a+e/2,b+c],["Z"]]},diamond:function(a,b,e,c){return [["M",a+e/2,b],["L",a+e,b+c/2],["L",a+e/2,b+c],["L",a,b+c/2],["Z"]]},arc:function(a,b,e,c,h){var p=[];if(h){var u=h.start||0,K=h.end||0,I=h.r||e;e=h.r||c||e;var w=.001>Math.abs(K-u-2*Math.PI);K-=.001;c=h.innerR;w=m(h.open,w);var d=Math.cos(u),n=Math.sin(u),q=Math.cos(K),r=Math.sin(K);u=m(h.longArc,.001>K-u-Math.PI?0:1);
p.push(["M",a+I*d,b+e*n],["A",I,e,0,u,m(h.clockwise,1),a+I*q,b+e*r]);g(c)&&p.push(w?["M",a+c*q,b+c*r]:["L",a+c*q,b+c*r],["A",c,c,0,u,g(h.clockwise)?1-h.clockwise:0,a+c*d,b+c*n]);w||p.push(["Z"]);}return p},callout:function(a,b,e,c,h){var p=Math.min(h&&h.r||0,e,c),u=p+6,g=h&&h.anchorX;h=h&&h.anchorY||0;var m=[["M",a+p,b],["L",a+e-p,b],["C",a+e,b,a+e,b,a+e,b+p],["L",a+e,b+c-p],["C",a+e,b+c,a+e,b+c,a+e-p,b+c],["L",a+p,b+c],["C",a,b+c,a,b+c,a,b+c-p],["L",a,b+p],["C",a,b,a,b,a+p,b]];if(!n(g))return m;a+
g>=e?h>b+u&&h<b+c-u?m.splice(3,1,["L",a+e,h-6],["L",a+e+6,h],["L",a+e,h+6],["L",a+e,b+c-p]):m.splice(3,1,["L",a+e,c/2],["L",g,h],["L",a+e,c/2],["L",a+e,b+c-p]):0>=a+g?h>b+u&&h<b+c-u?m.splice(7,1,["L",a,h+6],["L",a-6,h],["L",a,h-6],["L",a,b+p]):m.splice(7,1,["L",a,c/2],["L",g,h],["L",a,c/2],["L",a,b+p]):h&&h>c&&g>a+u&&g<a+e-u?m.splice(5,1,["L",g+6,b+c],["L",g,b+c+6],["L",g-6,b+c],["L",a+p,b+c]):h&&0>h&&g>a+u&&g<a+e-u&&m.splice(1,1,["L",g-6,b],["L",g,b-6],["L",g+6,b],["L",e-p,b]);return m}};d.SVGRenderer=
T;d.Renderer=d.SVGRenderer;return d.Renderer});P(k,"Core/Renderer/HTML/HTMLElement.js",[k["Core/Globals.js"],k["Core/Renderer/SVG/SVGElement.js"],k["Core/Utilities.js"]],function(f,d,k){var x=k.css,B=k.defined,S=k.extend,D=k.pick,H=k.pInt,t=f.isFirefox;S(d.prototype,{htmlCss:function(d){var f="SPAN"===this.element.tagName&&d&&"width"in d,t=D(f&&d.width,void 0);if(f){delete d.width;this.textWidth=t;var g=!0;}d&&"ellipsis"===d.textOverflow&&(d.whiteSpace="nowrap",d.overflow="hidden");this.styles=S(this.styles,
d);x(this.element,d);g&&this.htmlUpdateTransform();return this},htmlGetBBox:function(){var d=this.element;return {x:d.offsetLeft,y:d.offsetTop,width:d.offsetWidth,height:d.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var d=this.renderer,f=this.element,t=this.translateX||0,g=this.translateY||0,y=this.x||0,c=this.y||0,q=this.textAlign||"left",n={left:0,center:.5,right:1}[q],A=this.styles,M=A&&A.whiteSpace;x(f,{marginLeft:t,marginTop:g});!d.styledMode&&this.shadows&&this.shadows.forEach(function(e){x(e,
{marginLeft:t+1,marginTop:g+1});});this.inverted&&[].forEach.call(f.childNodes,function(e){d.invertChild(e,f);});if("SPAN"===f.tagName){A=this.rotation;var z=this.textWidth&&H(this.textWidth),m=[A,q,f.innerHTML,this.textWidth,this.textAlign].join(),r;(r=z!==this.oldTextWidth)&&!(r=z>this.oldTextWidth)&&((r=this.textPxLength)||(x(f,{width:"",whiteSpace:M||"nowrap"}),r=f.offsetWidth),r=r>z);r&&(/[ \-]/.test(f.textContent||f.innerText)||"ellipsis"===f.style.textOverflow)?(x(f,{width:z+"px",display:"block",
whiteSpace:M||"normal"}),this.oldTextWidth=z,this.hasBoxWidthChanged=!0):this.hasBoxWidthChanged=!1;m!==this.cTT&&(M=d.fontMetrics(f.style.fontSize,f).b,!B(A)||A===(this.oldRotation||0)&&q===this.oldAlign||this.setSpanRotation(A,n,M),this.getSpanCorrection(!B(A)&&this.textPxLength||f.offsetWidth,M,n,A,q));x(f,{left:y+(this.xCorr||0)+"px",top:c+(this.yCorr||0)+"px"});this.cTT=m;this.oldRotation=A;this.oldAlign=q;}}else this.alignOnAdd=!0;},setSpanRotation:function(d,f,k){var g={},l=this.renderer.getTransformKey();
g[l]=g.transform="rotate("+d+"deg)";g[l+(t?"Origin":"-origin")]=g.transformOrigin=100*f+"% "+k+"px";x(this.element,g);},getSpanCorrection:function(d,f,t){this.xCorr=-d*t;this.yCorr=-f;}});return d});P(k,"Core/Renderer/HTML/HTMLRenderer.js",[k["Core/Globals.js"],k["Core/Renderer/HTML/AST.js"],k["Core/Renderer/SVG/SVGElement.js"],k["Core/Renderer/SVG/SVGRenderer.js"],k["Core/Utilities.js"]],function(f,d,k,x,B){var S=f.isFirefox,D=f.isMS,H=f.isWebKit,t=f.win,C=B.attr,l=B.createElement,E=B.extend,g=B.pick;
E(x.prototype,{getTransformKey:function(){return D&&!/Edge/.test(t.navigator.userAgent)?"-ms-transform":H?"-webkit-transform":S?"MozTransform":t.opera?"-o-transform":""},html:function(f,c,q){var n=this.createElement("span"),A=n.element,M=n.renderer,z=M.isSVG,m=function(c,e){["opacity","visibility"].forEach(function(h){c[h+"Setter"]=function(a,b,g){var m=c.div?c.div.style:e;k.prototype[h+"Setter"].call(this,a,b,g);m&&(m[b]=a);};});c.addedSetters=!0;};n.textSetter=function(c){c!==this.textStr&&(delete this.bBox,
delete this.oldTextWidth,d.setElementHTML(this.element,g(c,"")),this.textStr=c,n.doTransform=!0);};z&&m(n,n.element.style);n.xSetter=n.ySetter=n.alignSetter=n.rotationSetter=function(c,e){"align"===e?n.alignValue=n.textAlign=c:n[e]=c;n.doTransform=!0;};n.afterSetters=function(){this.doTransform&&(this.htmlUpdateTransform(),this.doTransform=!1);};n.attr({text:f,x:Math.round(c),y:Math.round(q)}).css({position:"absolute"});M.styledMode||n.css({fontFamily:this.style.fontFamily,fontSize:this.style.fontSize});
A.style.whiteSpace="nowrap";n.css=n.htmlCss;z&&(n.add=function(c){var e=M.box.parentNode,h=[];if(this.parentGroup=c){var a=c.div;if(!a){for(;c;)h.push(c),c=c.parentGroup;h.reverse().forEach(function(b){function c(a,e){b[e]=a;"translateX"===e?q.left=a+"px":q.top=a+"px";b.doTransform=!0;}var g=C(b.element,"class"),d=b.styles||{};a=b.div=b.div||l("div",g?{className:g}:void 0,{position:"absolute",left:(b.translateX||0)+"px",top:(b.translateY||0)+"px",display:b.display,opacity:b.opacity,cursor:d.cursor,
pointerEvents:d.pointerEvents},a||e);var q=a.style;E(b,{classSetter:function(a){return function(b){this.element.setAttribute("class",b);a.className=b;}}(a),on:function(){h[0].div&&n.on.apply({element:h[0].div},arguments);return b},translateXSetter:c,translateYSetter:c});b.addedSetters||m(b);});}}else a=e;a.appendChild(A);n.added=!0;n.alignOnAdd&&n.htmlUpdateTransform();return n});return n}});return x});P(k,"Core/Time.js",[k["Core/Globals.js"],k["Core/Utilities.js"]],function(f,d){var k=f.win,x=d.defined,
B=d.error,G=d.extend,D=d.isObject,H=d.merge,t=d.objectEach,C=d.pad,l=d.pick,E=d.splat,g=d.timeUnits;d=function(){function d(c){this.options={};this.variableTimezone=this.useUTC=!1;this.Date=k.Date;this.getTimezoneOffset=this.timezoneOffsetFunction();this.update(c);}d.prototype.get=function(c,g){if(this.variableTimezone||this.timezoneOffset){var d=g.getTime(),q=d-this.getTimezoneOffset(g);g.setTime(q);c=g["getUTC"+c]();g.setTime(d);return c}return this.useUTC?g["getUTC"+c]():g["get"+c]()};d.prototype.set=
function(c,g,d){if(this.variableTimezone||this.timezoneOffset){if("Milliseconds"===c||"Seconds"===c||"Minutes"===c&&0===this.getTimezoneOffset(g)%36E5)return g["setUTC"+c](d);var n=this.getTimezoneOffset(g);n=g.getTime()-n;g.setTime(n);g["setUTC"+c](d);c=this.getTimezoneOffset(g);n=g.getTime()+c;return g.setTime(n)}return this.useUTC?g["setUTC"+c](d):g["set"+c](d)};d.prototype.update=function(c){var g=l(c&&c.useUTC,!0);this.options=c=H(!0,this.options||{},c);this.Date=c.Date||k.Date||Date;this.timezoneOffset=
(this.useUTC=g)&&c.timezoneOffset;this.getTimezoneOffset=this.timezoneOffsetFunction();this.variableTimezone=g&&!(!c.getTimezoneOffset&&!c.timezone);};d.prototype.makeTime=function(c,g,d,A,M,z){if(this.useUTC){var m=this.Date.UTC.apply(0,arguments);var n=this.getTimezoneOffset(m);m+=n;var e=this.getTimezoneOffset(m);n!==e?m+=e-n:n-36E5!==this.getTimezoneOffset(m-36E5)||f.isSafari||(m-=36E5);}else m=(new this.Date(c,g,l(d,1),l(A,0),l(M,0),l(z,0))).getTime();return m};d.prototype.timezoneOffsetFunction=
function(){var c=this,g=this.options,d=g.moment||k.moment;if(!this.useUTC)return function(c){return 6E4*(new Date(c.toString())).getTimezoneOffset()};if(g.timezone){if(d)return function(c){return 6E4*-d.tz(c,g.timezone).utcOffset()};B(25);}return this.useUTC&&g.getTimezoneOffset?function(c){return 6E4*g.getTimezoneOffset(c.valueOf())}:function(){return 6E4*(c.timezoneOffset||0)}};d.prototype.dateFormat=function(c,g,d){var n;if(!x(g)||isNaN(g))return (null===(n=f.defaultOptions.lang)||void 0===n?void 0:
n.invalidDate)||"";c=l(c,"%Y-%m-%d %H:%M:%S");var q=this;n=new this.Date(g);var z=this.get("Hours",n),m=this.get("Day",n),r=this.get("Date",n),e=this.get("Month",n),h=this.get("FullYear",n),a=f.defaultOptions.lang,b=null===a||void 0===a?void 0:a.weekdays,w=null===a||void 0===a?void 0:a.shortWeekdays;n=G({a:w?w[m]:b[m].substr(0,3),A:b[m],d:C(r),e:C(r,2," "),w:m,b:a.shortMonths[e],B:a.months[e],m:C(e+1),o:e+1,y:h.toString().substr(2,2),Y:h,H:C(z),k:z,I:C(z%12||12),l:z%12||12,M:C(this.get("Minutes",
n)),p:12>z?"AM":"PM",P:12>z?"am":"pm",S:C(n.getSeconds()),L:C(Math.floor(g%1E3),3)},f.dateFormats);t(n,function(a,b){for(;-1!==c.indexOf("%"+b);)c=c.replace("%"+b,"function"===typeof a?a.call(q,g):a);});return d?c.substr(0,1).toUpperCase()+c.substr(1):c};d.prototype.resolveDTLFormat=function(c){return D(c,!0)?c:(c=E(c),{main:c[0],from:c[1],to:c[2]})};d.prototype.getTimeTicks=function(c,d,n,f){var q=this,A=[],m={};var r=new q.Date(d);var e=c.unitRange,h=c.count||1,a;f=l(f,1);if(x(d)){q.set("Milliseconds",
r,e>=g.second?0:h*Math.floor(q.get("Milliseconds",r)/h));e>=g.second&&q.set("Seconds",r,e>=g.minute?0:h*Math.floor(q.get("Seconds",r)/h));e>=g.minute&&q.set("Minutes",r,e>=g.hour?0:h*Math.floor(q.get("Minutes",r)/h));e>=g.hour&&q.set("Hours",r,e>=g.day?0:h*Math.floor(q.get("Hours",r)/h));e>=g.day&&q.set("Date",r,e>=g.month?1:Math.max(1,h*Math.floor(q.get("Date",r)/h)));if(e>=g.month){q.set("Month",r,e>=g.year?0:h*Math.floor(q.get("Month",r)/h));var b=q.get("FullYear",r);}e>=g.year&&q.set("FullYear",
r,b-b%h);e===g.week&&(b=q.get("Day",r),q.set("Date",r,q.get("Date",r)-b+f+(b<f?-7:0)));b=q.get("FullYear",r);f=q.get("Month",r);var w=q.get("Date",r),J=q.get("Hours",r);d=r.getTime();!q.variableTimezone&&q.useUTC||!x(n)||(a=n-d>4*g.month||q.getTimezoneOffset(d)!==q.getTimezoneOffset(n));d=r.getTime();for(r=1;d<n;)A.push(d),d=e===g.year?q.makeTime(b+r*h,0):e===g.month?q.makeTime(b,f+r*h):!a||e!==g.day&&e!==g.week?a&&e===g.hour&&1<h?q.makeTime(b,f,w,J+r*h):d+e*h:q.makeTime(b,f,w+r*h*(e===g.day?1:7)),
r++;A.push(d);e<=g.hour&&1E4>A.length&&A.forEach(function(a){0===a%18E5&&"000000000"===q.dateFormat("%H%M%S%L",a)&&(m[a]="day");});}A.info=G(c,{higherRanks:m,totalRange:e*h});return A};return d}();f.Time=d;return f.Time});P(k,"Core/Options.js",[k["Core/Globals.js"],k["Core/Color/Color.js"],k["Core/Color/Palette.js"],k["Core/Time.js"],k["Core/Utilities.js"]],function(f,d,k,x,B){var G=f.isTouchDevice,D=f.svg;d=d.parse;B=B.merge;f.defaultOptions={colors:k.colors,symbols:["circle","diamond","square",
"triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{},time:{Date:void 0,getTimezoneOffset:void 0,timezone:void 0,
timezoneOffset:0,useUTC:!0},chart:{styledMode:!1,borderRadius:0,colorCount:10,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],resetZoomButton:{theme:{zIndex:6},position:{align:"right",x:-10,y:10}},zoomBySingleTouch:!1,width:null,height:null,borderColor:k.highlightColor80,backgroundColor:k.backgroundColor,plotBorderColor:k.neutralColor20},title:{text:"Chart title",align:"center",margin:15,widthAdjust:-44},subtitle:{text:"",align:"center",widthAdjust:-44},caption:{margin:15,text:"",
align:"left",verticalAlign:"bottom"},plotOptions:{},labels:{style:{position:"absolute",color:k.neutralColor80}},legend:{enabled:!0,align:"center",alignColumns:!0,layout:"horizontal",labelFormatter:function(){return this.name},borderColor:k.neutralColor40,borderRadius:0,navigation:{activeColor:k.highlightColor100,inactiveColor:k.neutralColor20},itemStyle:{color:k.neutralColor80,cursor:"pointer",fontSize:"12px",fontWeight:"bold",textOverflow:"ellipsis"},itemHoverStyle:{color:k.neutralColor100},itemHiddenStyle:{color:k.neutralColor20},
shadow:!1,itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},squareSymbol:!0,symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:k.backgroundColor,opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,animation:D,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",
day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",padding:8,snap:G?25:10,headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',backgroundColor:d(k.neutralColor3).setOpacity(.85).get(),borderWidth:1,shadow:!0,style:{color:k.neutralColor80,cursor:"default",fontSize:"12px",whiteSpace:"nowrap"}},credits:{enabled:!0,href:"https://www.highcharts.com?credits",
position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:k.neutralColor40,fontSize:"9px"},text:"Highcharts.com"}};f.defaultOptions.chart.styledMode=!1;f.time=new x(B(f.defaultOptions.global,f.defaultOptions.time));f.dateFormat=function(d,t,k){return f.time.dateFormat(d,t,k)};return {dateFormat:f.dateFormat,defaultOptions:f.defaultOptions,time:f.time}});P(k,"Core/Axis/Tick.js",[k["Core/Globals.js"],k["Core/Utilities.js"]],function(f,d){var k=f.deg2rad,x=d.clamp,B=
d.correctFloat,G=d.defined,D=d.destroyObjectProperties,H=d.extend,t=d.fireEvent,C=d.isNumber,l=d.merge,E=d.objectEach,g=d.pick;d=function(){function d(c,g,d,f,l){this.isNewLabel=this.isNew=!0;this.axis=c;this.pos=g;this.type=d||"";this.parameters=l||{};this.tickmarkOffset=this.parameters.tickmarkOffset;this.options=this.parameters.options;t(this,"init");d||f||this.addLabel();}d.prototype.addLabel=function(){var c=this,d=c.axis,n=d.options,f=d.chart,l=d.categories,z=d.logarithmic,m=d.names,r=c.pos,
e=g(c.options&&c.options.labels,n.labels),h=d.tickPositions,a=r===h[0],b=r===h[h.length-1];m=this.parameters.category||(l?g(l[r],m[r],r):r);var w=c.label;l=(!e.step||1===e.step)&&1===d.tickInterval;h=h.info;var J,O;if(d.dateTime&&h){var F=f.time.resolveDTLFormat(n.dateTimeLabelFormats[!n.grid&&h.higherRanks[r]||h.unitName]);var N=F.main;}c.isFirst=a;c.isLast=b;c.formatCtx={axis:d,chart:f,isFirst:a,isLast:b,dateTimeLabelFormat:N,tickPositionInfo:h,value:z?B(z.lin2log(m)):m,pos:r};n=d.labelFormatter.call(c.formatCtx,
this.formatCtx);if(O=F&&F.list)c.shortenLabel=function(){for(J=0;J<O.length;J++)if(w.attr({text:d.labelFormatter.call(H(c.formatCtx,{dateTimeLabelFormat:O[J]}))}),w.getBBox().width<d.getSlotWidth(c)-2*g(e.padding,5))return;w.attr({text:""});};l&&d._addedPlotLB&&c.moveLabel(n,e);G(w)||c.movedLabel?w&&w.textStr!==n&&!l&&(!w.textWidth||e.style&&e.style.width||w.styles.width||w.css({width:null}),w.attr({text:n}),w.textPxLength=w.getBBox().width):(c.label=w=c.createLabel({x:0,y:0},n,e),c.rotation=0);};d.prototype.createLabel=
function(c,g,d){var n=this.axis,f=n.chart;if(c=G(g)&&d.enabled?f.renderer.text(g,c.x,c.y,d.useHTML).add(n.labelGroup):null)f.styledMode||c.css(l(d.style)),c.textPxLength=c.getBBox().width;return c};d.prototype.destroy=function(){D(this,this.axis);};d.prototype.getPosition=function(c,g,d,f){var n=this.axis,q=n.chart,m=f&&q.oldChartHeight||q.chartHeight;c={x:c?B(n.translate(g+d,null,null,f)+n.transB):n.left+n.offset+(n.opposite?(f&&q.oldChartWidth||q.chartWidth)-n.right-n.left:0),y:c?m-n.bottom+n.offset-
(n.opposite?n.height:0):B(m-n.translate(g+d,null,null,f)-n.transB)};c.y=x(c.y,-1E5,1E5);t(this,"afterGetPosition",{pos:c});return c};d.prototype.getLabelPosition=function(c,g,d,f,l,z,m,r){var e=this.axis,h=e.transA,a=e.isLinked&&e.linkedParent?e.linkedParent.reversed:e.reversed,b=e.staggerLines,w=e.tickRotCorr||{x:0,y:0},n=l.y,q=f||e.reserveSpaceDefault?0:-e.labelOffset*("center"===e.labelAlign?.5:1),F={};G(n)||(n=0===e.side?d.rotation?-8:-d.getBBox().height:2===e.side?w.y+8:Math.cos(d.rotation*k)*
(w.y-d.getBBox(!1,0).height/2));c=c+l.x+q+w.x-(z&&f?z*h*(a?-1:1):0);g=g+n-(z&&!f?z*h*(a?1:-1):0);b&&(d=m/(r||1)%b,e.opposite&&(d=b-d-1),g+=e.labelOffset/b*d);F.x=c;F.y=Math.round(g);t(this,"afterGetLabelPosition",{pos:F,tickmarkOffset:z,index:m});return F};d.prototype.getLabelSize=function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0};d.prototype.getMarkPath=function(c,g,d,f,l,z){return z.crispLine([["M",c,g],["L",c+(l?0:-d),g+(l?d:0)]],f)};d.prototype.handleOverflow=
function(c){var d=this.axis,f=d.options.labels,l=c.x,t=d.chart.chartWidth,z=d.chart.spacing,m=g(d.labelLeft,Math.min(d.pos,z[3]));z=g(d.labelRight,Math.max(d.isRadial?0:d.pos+d.len,t-z[1]));var r=this.label,e=this.rotation,h={left:0,center:.5,right:1}[d.labelAlign||r.attr("align")],a=r.getBBox().width,b=d.getSlotWidth(this),w=b,J=1,O,F={};if(e||"justify"!==g(f.overflow,"justify"))0>e&&l-h*a<m?O=Math.round(l/Math.cos(e*k)-m):0<e&&l+h*a>z&&(O=Math.round((t-l)/Math.cos(e*k)));else if(t=l+(1-h)*a,l-h*
a<m?w=c.x+w*(1-h)-m:t>z&&(w=z-c.x+w*h,J=-1),w=Math.min(b,w),w<b&&"center"===d.labelAlign&&(c.x+=J*(b-w-h*(b-Math.min(a,w)))),a>w||d.autoRotation&&(r.styles||{}).width)O=w;O&&(this.shortenLabel?this.shortenLabel():(F.width=Math.floor(O)+"px",(f.style||{}).textOverflow||(F.textOverflow="ellipsis"),r.css(F)));};d.prototype.moveLabel=function(c,g){var d=this,f=d.label,q=!1,l=d.axis,m=l.reversed;f&&f.textStr===c?(d.movedLabel=f,q=!0,delete d.label):E(l.ticks,function(e){q||e.isNew||e===d||!e.label||e.label.textStr!==
c||(d.movedLabel=e.label,q=!0,e.labelPos=d.movedLabel.xy,delete e.label);});if(!q&&(d.labelPos||f)){var r=d.labelPos||f.xy;f=l.horiz?m?0:l.width+l.left:r.x;l=l.horiz?r.y:m?l.width+l.left:0;d.movedLabel=d.createLabel({x:f,y:l},c,g);d.movedLabel&&d.movedLabel.attr({opacity:0});}};d.prototype.render=function(c,d,f){var n=this.axis,q=n.horiz,l=this.pos,m=g(this.tickmarkOffset,n.tickmarkOffset);l=this.getPosition(q,l,m,d);m=l.x;var r=l.y;n=q&&m===n.pos+n.len||!q&&r===n.pos?-1:1;f=g(f,1);this.isActive=!0;
this.renderGridLine(d,f,n);this.renderMark(l,f,n);this.renderLabel(l,d,f,c);this.isNew=!1;t(this,"afterRender");};d.prototype.renderGridLine=function(c,d,f){var n=this.axis,q=n.options,l=this.gridLine,m={},r=this.pos,e=this.type,h=g(this.tickmarkOffset,n.tickmarkOffset),a=n.chart.renderer,b=e?e+"Grid":"grid",w=q[b+"LineWidth"],J=q[b+"LineColor"];q=q[b+"LineDashStyle"];l||(n.chart.styledMode||(m.stroke=J,m["stroke-width"]=w,q&&(m.dashstyle=q)),e||(m.zIndex=1),c&&(d=0),this.gridLine=l=a.path().attr(m).addClass("highcharts-"+
(e?e+"-":"")+"grid-line").add(n.gridGroup));if(l&&(f=n.getPlotLinePath({value:r+h,lineWidth:l.strokeWidth()*f,force:"pass",old:c})))l[c||this.isNew?"attr":"animate"]({d:f,opacity:d});};d.prototype.renderMark=function(c,d,f){var n=this.axis,q=n.options,l=n.chart.renderer,m=this.type,r=m?m+"Tick":"tick",e=n.tickSize(r),h=this.mark,a=!h,b=c.x;c=c.y;var w=g(q[r+"Width"],!m&&n.isXAxis?1:0);q=q[r+"Color"];e&&(n.opposite&&(e[0]=-e[0]),a&&(this.mark=h=l.path().addClass("highcharts-"+(m?m+"-":"")+"tick").add(n.axisGroup),
n.chart.styledMode||h.attr({stroke:q,"stroke-width":w})),h[a?"attr":"animate"]({d:this.getMarkPath(b,c,e[0],h.strokeWidth()*f,n.horiz,l),opacity:d}));};d.prototype.renderLabel=function(c,d,f,l){var n=this.axis,q=n.horiz,m=n.options,r=this.label,e=m.labels,h=e.step;n=g(this.tickmarkOffset,n.tickmarkOffset);var a=!0,b=c.x;c=c.y;r&&C(b)&&(r.xy=c=this.getLabelPosition(b,c,r,q,e,n,l,h),this.isFirst&&!this.isLast&&!g(m.showFirstLabel,1)||this.isLast&&!this.isFirst&&!g(m.showLastLabel,1)?a=!1:!q||e.step||
e.rotation||d||0===f||this.handleOverflow(c),h&&l%h&&(a=!1),a&&C(c.y)?(c.opacity=f,r[this.isNewLabel?"attr":"animate"](c),this.isNewLabel=!1):(r.attr("y",-9999),this.isNewLabel=!0));};d.prototype.replaceMovedLabel=function(){var c=this.label,g=this.axis,d=g.reversed;if(c&&!this.isNew){var f=g.horiz?d?g.left:g.width+g.left:c.xy.x;d=g.horiz?c.xy.y:d?g.width+g.top:g.top;c.animate({x:f,y:d,opacity:0},void 0,c.destroy);delete this.label;}g.isDirty=!0;this.label=this.movedLabel;delete this.movedLabel;};return d}();
f.Tick=d;return f.Tick});P(k,"Core/Axis/Axis.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Color/Color.js"],k["Core/Globals.js"],k["Core/Color/Palette.js"],k["Core/Options.js"],k["Core/Axis/Tick.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G,D){var H=f.animObject,t=B.defaultOptions,C=D.addEvent,l=D.arrayMax,E=D.arrayMin,g=D.clamp,y=D.correctFloat,c=D.defined,q=D.destroyObjectProperties,n=D.erase,A=D.error,M=D.extend,z=D.fireEvent,m=D.format,r=D.getMagnitude,e=D.isArray,h=D.isFunction,
a=D.isNumber,b=D.isString,w=D.merge,J=D.normalizeTickInterval,O=D.objectEach,F=D.pick,N=D.relativeLength,R=D.removeEvent,Q=D.splat,T=D.syncTimeout;var v=k.deg2rad;f=function(){function f(a,b){this.zoomEnabled=this.width=this.visible=this.userOptions=this.translationSlope=this.transB=this.transA=this.top=this.ticks=this.tickRotCorr=this.tickPositions=this.tickmarkOffset=this.tickInterval=this.tickAmount=this.side=this.series=this.right=this.positiveValuesOnly=this.pos=this.pointRangePadding=this.pointRange=
this.plotLinesAndBandsGroups=this.plotLinesAndBands=this.paddedTicks=this.overlap=this.options=this.offset=this.names=this.minPixelPadding=this.minorTicks=this.minorTickInterval=this.min=this.maxLabelLength=this.max=this.len=this.left=this.labelFormatter=this.labelEdge=this.isLinked=this.height=this.hasVisibleSeries=this.hasNames=this.coll=this.closestPointRange=this.chart=this.categories=this.bottom=this.alternateBands=void 0;this.init(a,b);}f.prototype.init=function(a,b){var e=b.isX,p=this;p.chart=
a;p.horiz=a.inverted&&!p.isZAxis?!e:e;p.isXAxis=e;p.coll=p.coll||(e?"xAxis":"yAxis");z(this,"init",{userOptions:b});p.opposite=F(b.opposite,p.opposite);p.side=F(b.side,p.side,p.horiz?p.opposite?0:2:p.opposite?1:3);p.setOptions(b);var u=this.options,g=u.type;p.labelFormatter=u.labels.formatter||p.defaultLabelFormatter;p.userOptions=b;p.minPixelPadding=0;p.reversed=F(u.reversed,p.reversed);p.visible=!1!==u.visible;p.zoomEnabled=!1!==u.zoomEnabled;p.hasNames="category"===g||!0===u.categories;p.categories=
u.categories||p.hasNames;p.names||(p.names=[],p.names.keys={});p.plotLinesAndBandsGroups={};p.positiveValuesOnly=!!p.logarithmic;p.isLinked=c(u.linkedTo);p.ticks={};p.labelEdge=[];p.minorTicks={};p.plotLinesAndBands=[];p.alternateBands={};p.len=0;p.minRange=p.userMinRange=u.minRange||u.maxZoom;p.range=u.range;p.offset=u.offset||0;p.max=null;p.min=null;p.crosshair=F(u.crosshair,Q(a.options.tooltip.crosshairs)[e?0:1],!1);b=p.options.events;-1===a.axes.indexOf(p)&&(e?a.axes.splice(a.xAxis.length,0,p):
a.axes.push(p),a[p.coll].push(p));p.series=p.series||[];a.inverted&&!p.isZAxis&&e&&"undefined"===typeof p.reversed&&(p.reversed=!0);p.labelRotation=p.options.labels.rotation;O(b,function(a,b){h(a)&&C(p,b,a);});z(this,"afterInit");};f.prototype.setOptions=function(a){this.options=w(f.defaultOptions,"yAxis"===this.coll&&f.defaultYAxisOptions,[f.defaultTopAxisOptions,f.defaultRightAxisOptions,f.defaultBottomAxisOptions,f.defaultLeftAxisOptions][this.side],w(t[this.coll],a));z(this,"afterSetOptions",{userOptions:a});};
f.prototype.defaultLabelFormatter=function(){var b=this.axis,e=a(this.value)?this.value:NaN,c=b.chart.time,g=b.categories,u=this.dateTimeLabelFormat,h=t.lang,d=h.numericSymbols;h=h.numericSymbolMagnitude||1E3;var f=d&&d.length,w=b.options.labels.format;b=b.logarithmic?Math.abs(e):b.tickInterval;var n=this.chart,q=n.numberFormatter;if(w)var r=m(w,this,n);else if(g)r=""+this.value;else if(u)r=c.dateFormat(u,e);else if(f&&1E3<=b)for(;f--&&"undefined"===typeof r;)c=Math.pow(h,f+1),b>=c&&0===10*e%c&&null!==
d[f]&&0!==e&&(r=q(e/c,-1)+d[f]);"undefined"===typeof r&&(r=1E4<=Math.abs(e)?q(e,-1):q(e,-1,void 0,""));return r};f.prototype.getSeriesExtremes=function(){var b=this,e=b.chart,g;z(this,"getSeriesExtremes",null,function(){b.hasVisibleSeries=!1;b.dataMin=b.dataMax=b.threshold=null;b.softThreshold=!b.isXAxis;b.stacking&&b.stacking.buildStacks();b.series.forEach(function(p){if(p.visible||!e.options.chart.ignoreHiddenSeries){var u=p.options,h=u.threshold;b.hasVisibleSeries=!0;b.positiveValuesOnly&&0>=h&&
(h=null);if(b.isXAxis){if(u=p.xData,u.length){u=b.logarithmic?u.filter(b.validatePositiveValue):u;g=p.getXExtremes(u);var d=g.min;var f=g.max;a(d)||d instanceof Date||(u=u.filter(a),g=p.getXExtremes(u),d=g.min,f=g.max);u.length&&(b.dataMin=Math.min(F(b.dataMin,d),d),b.dataMax=Math.max(F(b.dataMax,f),f));}}else if(p=p.applyExtremes(),a(p.dataMin)&&(d=p.dataMin,b.dataMin=Math.min(F(b.dataMin,d),d)),a(p.dataMax)&&(f=p.dataMax,b.dataMax=Math.max(F(b.dataMax,f),f)),c(h)&&(b.threshold=h),!u.softThreshold||
b.positiveValuesOnly)b.softThreshold=!1;}});});z(this,"afterGetSeriesExtremes");};f.prototype.translate=function(b,e,c,g,u,h){var p=this.linkedParent||this,d=1,f=0,m=g&&p.old?p.old.transA:p.transA;g=g&&p.old?p.old.min:p.min;var w=p.minPixelPadding;u=(p.isOrdinal||p.brokenAxis&&p.brokenAxis.hasBreaks||p.logarithmic&&u)&&p.lin2val;m||(m=p.transA);c&&(d*=-1,f=p.len);p.reversed&&(d*=-1,f-=d*(p.sector||p.len));e?(b=(b*d+f-w)/m+g,u&&(b=p.lin2val(b))):(u&&(b=p.val2lin(b)),b=a(g)?d*(b-g)*m+f+d*w+(a(h)?m*h:0):
void 0);return b};f.prototype.toPixels=function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)};f.prototype.toValue=function(a,b){return this.translate(a-(b?0:this.pos),!0,!this.horiz,null,!0)};f.prototype.getPlotLinePath=function(b){function e(a,b,e){if("pass"!==n&&a<b||a>e)n?a=g(a,b,e):Z=!0;return a}var c=this,p=c.chart,u=c.left,h=c.top,d=b.old,f=b.value,m=b.translatedValue,w=b.lineWidth,n=b.force,r,q,l,J,v=d&&p.oldChartHeight||p.chartHeight,V=d&&p.oldChartWidth||p.chartWidth,
Z,N=c.transB;b={value:f,lineWidth:w,old:d,force:n,acrossPanes:b.acrossPanes,translatedValue:m};z(this,"getPlotLinePath",b,function(b){m=F(m,c.translate(f,null,null,d));m=g(m,-1E5,1E5);r=l=Math.round(m+N);q=J=Math.round(v-m-N);a(m)?c.horiz?(q=h,J=v-c.bottom,r=l=e(r,u,u+c.width)):(r=u,l=V-c.right,q=J=e(q,h,h+c.height)):(Z=!0,n=!1);b.path=Z&&!n?null:p.renderer.crispLine([["M",r,q],["L",l,J]],w||1);});return b.path};f.prototype.getLinearTickPositions=function(a,b,e){var c=y(Math.floor(b/a)*a);e=y(Math.ceil(e/
a)*a);var p=[],g;y(c+a)===c&&(g=20);if(this.single)return [b];for(b=c;b<=e;){p.push(b);b=y(b+a,g);if(b===h)break;var h=b;}return p};f.prototype.getMinorTickInterval=function(){var a=this.options;return !0===a.minorTicks?F(a.minorTickInterval,"auto"):!1===a.minorTicks?null:a.minorTickInterval};f.prototype.getMinorTickPositions=function(){var a=this.options,b=this.tickPositions,e=this.minorTickInterval,c=[],u=this.pointRangePadding||0,g=this.min-u;u=this.max+u;var h=u-g;if(h&&h/e<this.len/3){var d=this.logarithmic;
if(d)this.paddedTicks.forEach(function(a,b,p){b&&c.push.apply(c,d.getLogTickPositions(e,p[b-1],p[b],!0));});else if(this.dateTime&&"auto"===this.getMinorTickInterval())c=c.concat(this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(e),g,u,a.startOfWeek));else for(a=g+(b[0]-g)%e;a<=u&&a!==c[0];a+=e)c.push(a);}0!==c.length&&this.trimTicks(c);return c};f.prototype.adjustForMinRange=function(){var a=this.options,b=this.min,e=this.max,g=this.logarithmic,u=0,h,d,f,m;this.isXAxis&&"undefined"===typeof this.minRange&&
!g&&(c(a.min)||c(a.max)?this.minRange=null:(this.series.forEach(function(a){f=a.xData;m=a.xIncrement?1:f.length-1;if(1<f.length)for(h=m;0<h;h--)if(d=f[h]-f[h-1],!u||d<u)u=d;}),this.minRange=Math.min(5*u,this.dataMax-this.dataMin)));if(e-b<this.minRange){var w=this.dataMax-this.dataMin>=this.minRange;var n=this.minRange;var r=(n-e+b)/2;r=[b-r,F(a.min,b-r)];w&&(r[2]=this.logarithmic?this.logarithmic.log2lin(this.dataMin):this.dataMin);b=l(r);e=[b+n,F(a.max,b+n)];w&&(e[2]=g?g.log2lin(this.dataMax):this.dataMax);
e=E(e);e-b<n&&(r[0]=e-n,r[1]=F(a.min,e-n),b=l(r));}this.min=b;this.max=e;};f.prototype.getClosest=function(){var a;this.categories?a=1:this.series.forEach(function(b){var e=b.closestPointRange,p=b.visible||!b.chart.options.chart.ignoreHiddenSeries;!b.noSharedTooltip&&c(e)&&p&&(a=c(a)?Math.min(a,e):e);});return a};f.prototype.nameToX=function(a){var b=e(this.categories),p=b?this.categories:this.names,g=a.options.x;a.series.requireSorting=!1;c(g)||(g=!1===this.options.uniqueNames?a.series.autoIncrement():
b?p.indexOf(a.name):F(p.keys[a.name],-1));if(-1===g){if(!b)var u=p.length;}else u=g;"undefined"!==typeof u&&(this.names[u]=a.name,this.names.keys[a.name]=u);return u};f.prototype.updateNames=function(){var a=this,b=this.names;0<b.length&&(Object.keys(b.keys).forEach(function(a){delete b.keys[a];}),b.length=0,this.minRange=this.userMinRange,(this.series||[]).forEach(function(b){b.xIncrement=null;if(!b.points||b.isDirtyData)a.max=Math.max(a.max,b.xData.length-1),b.processData(),b.generatePoints();b.data.forEach(function(e,
c){if(e&&e.options&&"undefined"!==typeof e.name){var p=a.nameToX(e);"undefined"!==typeof p&&p!==e.x&&(e.x=p,b.xData[c]=p);}});}));};f.prototype.setAxisTranslation=function(){var a=this,e=a.max-a.min,c=a.axisPointRange||0,g=0,u=0,h=a.linkedParent,d=!!a.categories,f=a.transA,m=a.isXAxis;if(m||d||c){var w=a.getClosest();h?(g=h.minPointOffset,u=h.pointRangePadding):a.series.forEach(function(e){var p=d?1:m?F(e.options.pointRange,w,0):a.axisPointRange||0,h=e.options.pointPlacement;c=Math.max(c,p);if(!a.single||
d)e=e.is("xrange")?!m:m,g=Math.max(g,e&&b(h)?0:p/2),u=Math.max(u,e&&"on"===h?0:p);});h=a.ordinal&&a.ordinal.slope&&w?a.ordinal.slope/w:1;a.minPointOffset=g*=h;a.pointRangePadding=u*=h;a.pointRange=Math.min(c,a.single&&d?1:e);m&&(a.closestPointRange=w);}a.translationSlope=a.transA=f=a.staticScale||a.len/(e+u||1);a.transB=a.horiz?a.left:a.bottom;a.minPixelPadding=f*g;z(this,"afterSetAxisTranslation");};f.prototype.minFromRange=function(){return this.max-this.range};f.prototype.setTickInterval=function(b){var e=
this,p=e.chart,g=e.logarithmic,u=e.options,h=e.isXAxis,d=e.isLinked,f=u.maxPadding,m=u.minPadding,w=u.tickInterval,n=u.tickPixelInterval,q=e.categories,l=a(e.threshold)?e.threshold:null,v=e.softThreshold;e.dateTime||q||d||this.getTickAmount();var N=F(e.userMin,u.min);var O=F(e.userMax,u.max);if(d){e.linkedParent=p[e.coll][u.linkedTo];var V=e.linkedParent.getExtremes();e.min=F(V.min,V.dataMin);e.max=F(V.max,V.dataMax);u.type!==e.linkedParent.options.type&&A(11,1,p);}else {if(v&&c(l))if(e.dataMin>=l)V=
l,m=0;else if(e.dataMax<=l){var Z=l;f=0;}e.min=F(N,V,e.dataMin);e.max=F(O,Z,e.dataMax);}g&&(e.positiveValuesOnly&&!b&&0>=Math.min(e.min,F(e.dataMin,e.min))&&A(10,1,p),e.min=y(g.log2lin(e.min),16),e.max=y(g.log2lin(e.max),16));e.range&&c(e.max)&&(e.userMin=e.min=N=Math.max(e.dataMin,e.minFromRange()),e.userMax=O=e.max,e.range=null);z(e,"foundExtremes");e.beforePadding&&e.beforePadding();e.adjustForMinRange();!(q||e.axisPointRange||e.stacking&&e.stacking.usePercentage||d)&&c(e.min)&&c(e.max)&&(p=e.max-
e.min)&&(!c(N)&&m&&(e.min-=p*m),!c(O)&&f&&(e.max+=p*f));a(e.userMin)||(a(u.softMin)&&u.softMin<e.min&&(e.min=N=u.softMin),a(u.floor)&&(e.min=Math.max(e.min,u.floor)));a(e.userMax)||(a(u.softMax)&&u.softMax>e.max&&(e.max=O=u.softMax),a(u.ceiling)&&(e.max=Math.min(e.max,u.ceiling)));v&&c(e.dataMin)&&(l=l||0,!c(N)&&e.min<l&&e.dataMin>=l?e.min=e.options.minRange?Math.min(l,e.max-e.minRange):l:!c(O)&&e.max>l&&e.dataMax<=l&&(e.max=e.options.minRange?Math.max(l,e.min+e.minRange):l));a(e.min)&&a(e.max)&&
!this.chart.polar&&e.min>e.max&&(c(e.options.min)?e.max=e.min:c(e.options.max)&&(e.min=e.max));e.tickInterval=e.min===e.max||"undefined"===typeof e.min||"undefined"===typeof e.max?1:d&&!w&&n===e.linkedParent.options.tickPixelInterval?w=e.linkedParent.tickInterval:F(w,this.tickAmount?(e.max-e.min)/Math.max(this.tickAmount-1,1):void 0,q?1:(e.max-e.min)*n/Math.max(e.len,n));h&&!b&&e.series.forEach(function(a){var b,c;a.processData(e.min!==(null===(b=e.old)||void 0===b?void 0:b.min)||e.max!==(null===
(c=e.old)||void 0===c?void 0:c.max));});e.setAxisTranslation();z(this,"initialAxisTranslation");e.pointRange&&!w&&(e.tickInterval=Math.max(e.pointRange,e.tickInterval));b=F(u.minTickInterval,e.dateTime&&!e.series.some(function(a){return a.noSharedTooltip})?e.closestPointRange:0);!w&&e.tickInterval<b&&(e.tickInterval=b);e.dateTime||e.logarithmic||w||(e.tickInterval=J(e.tickInterval,void 0,r(e.tickInterval),F(u.allowDecimals,.5>e.tickInterval||void 0!==this.tickAmount),!!this.tickAmount));this.tickAmount||
(e.tickInterval=e.unsquish());this.setTickPositions();};f.prototype.setTickPositions=function(){var a=this.options,b=a.tickPositions;var e=this.getMinorTickInterval();var g=a.tickPositioner,h=this.hasVerticalPanning(),d="colorAxis"===this.coll,f=(d||!h)&&a.startOnTick;h=(d||!h)&&a.endOnTick;this.tickmarkOffset=this.categories&&"between"===a.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===e&&this.tickInterval?this.tickInterval/5:e;this.single=this.min===this.max&&c(this.min)&&
!this.tickAmount&&(parseInt(this.min,10)===this.min||!1!==a.allowDecimals);this.tickPositions=e=b&&b.slice();!e&&(this.ordinal&&this.ordinal.positions||!((this.max-this.min)/this.tickInterval>Math.max(2*this.len,200))?e=this.dateTime?this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(this.tickInterval,a.units),this.min,this.max,a.startOfWeek,this.ordinal&&this.ordinal.positions,this.closestPointRange,!0):this.logarithmic?this.logarithmic.getLogTickPositions(this.tickInterval,this.min,this.max):
this.getLinearTickPositions(this.tickInterval,this.min,this.max):(e=[this.min,this.max],A(19,!1,this.chart)),e.length>this.len&&(e=[e[0],e.pop()],e[0]===e[1]&&(e.length=1)),this.tickPositions=e,g&&(g=g.apply(this,[this.min,this.max])))&&(this.tickPositions=e=g);this.paddedTicks=e.slice(0);this.trimTicks(e,f,h);this.isLinked||(this.single&&2>e.length&&!this.categories&&!this.series.some(function(a){return a.is("heatmap")&&"between"===a.options.pointPlacement})&&(this.min-=.5,this.max+=.5),b||g||this.adjustTickAmount());
z(this,"afterSetTickPositions");};f.prototype.trimTicks=function(a,b,e){var g=a[0],p=a[a.length-1],h=!this.isOrdinal&&this.minPointOffset||0;z(this,"trimTicks");if(!this.isLinked){if(b&&-Infinity!==g)this.min=g;else for(;this.min-h>a[0];)a.shift();if(e)this.max=p;else for(;this.max+h<a[a.length-1];)a.pop();0===a.length&&c(g)&&!this.options.tickPositions&&a.push((p+g)/2);}};f.prototype.alignToOthers=function(){var a={},b,e=this.options;!1===this.chart.options.chart.alignTicks||!1===e.alignTicks||!1===
e.startOnTick||!1===e.endOnTick||this.logarithmic||this.chart[this.coll].forEach(function(e){var c=e.options;c=[e.horiz?c.left:c.top,c.width,c.height,c.pane].join();e.series.length&&(a[c]?b=!0:a[c]=1);});return b};f.prototype.getTickAmount=function(){var a=this.options,b=a.tickAmount,e=a.tickPixelInterval;!c(a.tickInterval)&&!b&&this.len<e&&!this.isRadial&&!this.logarithmic&&a.startOnTick&&a.endOnTick&&(b=2);!b&&this.alignToOthers()&&(b=Math.ceil(this.len/e)+1);4>b&&(this.finalTickAmt=b,b=5);this.tickAmount=
b;};f.prototype.adjustTickAmount=function(){var b=this.options,e=this.tickInterval,g=this.tickPositions,h=this.tickAmount,u=this.finalTickAmt,d=g&&g.length,f=F(this.threshold,this.softThreshold?0:null);if(this.hasData()&&a(this.min)&&a(this.max)){if(d<h){for(;g.length<h;)g.length%2||this.min===f?g.push(y(g[g.length-1]+e)):g.unshift(y(g[0]-e));this.transA*=(d-1)/(h-1);this.min=b.startOnTick?g[0]:Math.min(this.min,g[0]);this.max=b.endOnTick?g[g.length-1]:Math.max(this.max,g[g.length-1]);}else d>h&&(this.tickInterval*=
2,this.setTickPositions());if(c(u)){for(e=b=g.length;e--;)(3===u&&1===e%2||2>=u&&0<e&&e<b-1)&&g.splice(e,1);this.finalTickAmt=void 0;}}};f.prototype.setScale=function(){var a,b,e,c,g,h,d=!1,f=!1;this.series.forEach(function(a){var b;d=d||a.isDirtyData||a.isDirty;f=f||(null===(b=a.xAxis)||void 0===b?void 0:b.isDirty)||!1;});this.setAxisSize();(h=this.len!==(null===(a=this.old)||void 0===a?void 0:a.len))||d||f||this.isLinked||this.forceRedraw||this.userMin!==(null===(b=this.old)||void 0===b?void 0:b.userMin)||
this.userMax!==(null===(e=this.old)||void 0===e?void 0:e.userMax)||this.alignToOthers()?(this.stacking&&this.stacking.resetStacks(),this.forceRedraw=!1,this.getSeriesExtremes(),this.setTickInterval(),this.isDirty||(this.isDirty=h||this.min!==(null===(c=this.old)||void 0===c?void 0:c.min)||this.max!==(null===(g=this.old)||void 0===g?void 0:g.max))):this.stacking&&this.stacking.cleanStacks();d&&this.panningState&&(this.panningState.isDirty=!0);z(this,"afterSetScale");};f.prototype.setExtremes=function(a,
b,e,c,g){var h=this,p=h.chart;e=F(e,!0);h.series.forEach(function(a){delete a.kdTree;});g=M(g,{min:a,max:b});z(h,"setExtremes",g,function(){h.userMin=a;h.userMax=b;h.eventArgs=g;e&&p.redraw(c);});};f.prototype.zoom=function(a,b){var e=this,g=this.dataMin,h=this.dataMax,p=this.options,d=Math.min(g,F(p.min,g)),f=Math.max(h,F(p.max,h));a={newMin:a,newMax:b};z(this,"zoom",a,function(a){var b=a.newMin,p=a.newMax;if(b!==e.min||p!==e.max)e.allowZoomOutside||(c(g)&&(b<d&&(b=d),b>f&&(b=f)),c(h)&&(p<d&&(p=d),
p>f&&(p=f))),e.displayBtn="undefined"!==typeof b||"undefined"!==typeof p,e.setExtremes(b,p,!1,void 0,{trigger:"zoom"});a.zoomed=!0;});return a.zoomed};f.prototype.setAxisSize=function(){var a=this.chart,b=this.options,e=b.offsets||[0,0,0,0],c=this.horiz,g=this.width=Math.round(N(F(b.width,a.plotWidth-e[3]+e[1]),a.plotWidth)),h=this.height=Math.round(N(F(b.height,a.plotHeight-e[0]+e[2]),a.plotHeight)),d=this.top=Math.round(N(F(b.top,a.plotTop+e[0]),a.plotHeight,a.plotTop));b=this.left=Math.round(N(F(b.left,
a.plotLeft+e[3]),a.plotWidth,a.plotLeft));this.bottom=a.chartHeight-h-d;this.right=a.chartWidth-g-b;this.len=Math.max(c?g:h,0);this.pos=c?b:d;};f.prototype.getExtremes=function(){var a=this.logarithmic;return {min:a?y(a.lin2log(this.min)):this.min,max:a?y(a.lin2log(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}};f.prototype.getThreshold=function(a){var b=this.logarithmic,e=b?b.lin2log(this.min):this.min;b=b?b.lin2log(this.max):this.max;null===
a||-Infinity===a?a=e:Infinity===a?a=b:e>a?a=e:b<a&&(a=b);return this.translate(a,0,1,0,1)};f.prototype.autoLabelAlign=function(a){var b=(F(a,0)-90*this.side+720)%360;a={align:"center"};z(this,"autoLabelAlign",a,function(a){15<b&&165>b?a.align="right":195<b&&345>b&&(a.align="left");});return a.align};f.prototype.tickSize=function(a){var b=this.options,e=b["tick"===a?"tickLength":"minorTickLength"],c=F(b["tick"===a?"tickWidth":"minorTickWidth"],"tick"===a&&this.isXAxis&&!this.categories?1:0);if(c&&e){"inside"===
b[a+"Position"]&&(e=-e);var g=[e,c];}a={tickSize:g};z(this,"afterTickSize",a);return a.tickSize};f.prototype.labelMetrics=function(){var a=this.tickPositions&&this.tickPositions[0]||0;return this.chart.renderer.fontMetrics(this.options.labels.style&&this.options.labels.style.fontSize,this.ticks[a]&&this.ticks[a].label)};f.prototype.unsquish=function(){var a=this.options.labels,b=this.horiz,e=this.tickInterval,g=e,h=this.len/(((this.categories?1:0)+this.max-this.min)/e),d,f=a.rotation,m=this.labelMetrics(),
w,n=Number.MAX_VALUE,r,l=Math.max(this.max-this.min,0),q=function(a){var b=a/(h||1);b=1<b?Math.ceil(b):1;b*e>l&&Infinity!==a&&Infinity!==h&&l&&(b=Math.ceil(l/e));return y(b*e)};b?(r=!a.staggerLines&&!a.step&&(c(f)?[f]:h<F(a.autoRotationLimit,80)&&a.autoRotation))&&r.forEach(function(a){if(a===f||a&&-90<=a&&90>=a){w=q(Math.abs(m.h/Math.sin(v*a)));var b=w+Math.abs(a/360);b<n&&(n=b,d=a,g=w);}}):a.step||(g=q(m.h));this.autoRotation=r;this.labelRotation=F(d,f);return g};f.prototype.getSlotWidth=function(b){var e,
c=this.chart,g=this.horiz,h=this.options.labels,d=Math.max(this.tickPositions.length-(this.categories?0:1),1),p=c.margin[3];if(b&&a(b.slotWidth))return b.slotWidth;if(g&&h&&2>(h.step||0))return h.rotation?0:(this.staggerLines||1)*this.len/d;if(!g){b=null===(e=null===h||void 0===h?void 0:h.style)||void 0===e?void 0:e.width;if(void 0!==b)return parseInt(b,10);if(p)return p-c.spacing[3]}return .33*c.chartWidth};f.prototype.renderUnsquish=function(){var a=this.chart,e=a.renderer,c=this.tickPositions,g=
this.ticks,h=this.options.labels,d=h&&h.style||{},f=this.horiz,m=this.getSlotWidth(),w=Math.max(1,Math.round(m-2*(h.padding||5))),n={},r=this.labelMetrics(),l=h.style&&h.style.textOverflow,q=0;b(h.rotation)||(n.rotation=h.rotation||0);c.forEach(function(a){a=g[a];a.movedLabel&&a.replaceMovedLabel();a&&a.label&&a.label.textPxLength>q&&(q=a.label.textPxLength);});this.maxLabelLength=q;if(this.autoRotation)q>w&&q>r.h?n.rotation=this.labelRotation:this.labelRotation=0;else if(m){var J=w;if(!l){var F="clip";
for(w=c.length;!f&&w--;){var v=c[w];if(v=g[v].label)v.styles&&"ellipsis"===v.styles.textOverflow?v.css({textOverflow:"clip"}):v.textPxLength>m&&v.css({width:m+"px"}),v.getBBox().height>this.len/c.length-(r.h-r.f)&&(v.specificTextOverflow="ellipsis");}}}n.rotation&&(J=q>.5*a.chartHeight?.33*a.chartHeight:q,l||(F="ellipsis"));if(this.labelAlign=h.align||this.autoLabelAlign(this.labelRotation))n.align=this.labelAlign;c.forEach(function(a){var b=(a=g[a])&&a.label,e=d.width,c={};b&&(b.attr(n),a.shortenLabel?
a.shortenLabel():J&&!e&&"nowrap"!==d.whiteSpace&&(J<b.textPxLength||"SPAN"===b.element.tagName)?(c.width=J+"px",l||(c.textOverflow=b.specificTextOverflow||F),b.css(c)):b.styles&&b.styles.width&&!c.width&&!e&&b.css({width:null}),delete b.specificTextOverflow,a.rotation=n.rotation);},this);this.tickRotCorr=e.rotCorr(r.b,this.labelRotation||0,0!==this.side);};f.prototype.hasData=function(){return this.series.some(function(a){return a.hasData()})||this.options.showEmpty&&c(this.min)&&c(this.max)};f.prototype.addTitle=
function(a){var b=this.chart.renderer,e=this.horiz,c=this.opposite,g=this.options.title,h,d=this.chart.styledMode;this.axisTitle||((h=g.textAlign)||(h=(e?{low:"left",middle:"center",high:"right"}:{low:c?"right":"left",middle:"center",high:c?"left":"right"})[g.align]),this.axisTitle=b.text(g.text,0,0,g.useHTML).attr({zIndex:7,rotation:g.rotation||0,align:h}).addClass("highcharts-axis-title"),d||this.axisTitle.css(w(g.style)),this.axisTitle.add(this.axisGroup),this.axisTitle.isNew=!0);d||g.style.width||
this.isRadial||this.axisTitle.css({width:this.len+"px"});this.axisTitle[a?"show":"hide"](a);};f.prototype.generateTick=function(a){var b=this.ticks;b[a]?b[a].addLabel():b[a]=new G(this,a);};f.prototype.getOffset=function(){var a=this,b=this,e=b.chart,g=e.renderer,h=b.options,d=b.tickPositions,f=b.ticks,m=b.horiz,w=b.side,n=e.inverted&&!b.isZAxis?[1,0,3,2][w]:w,r,l=0,q=0,J=h.title,v=h.labels,N=0,V=e.axisOffset;e=e.clipOffset;var Z=[-1,1,1,-1][w],k=h.className,t=b.axisParent;var y=b.hasData();b.showAxis=
r=y||F(h.showEmpty,!0);b.staggerLines=b.horiz&&v.staggerLines;if(!b.axisGroup){var A=function(b,e,c){return g.g(b).attr({zIndex:c}).addClass("highcharts-"+a.coll.toLowerCase()+e+" "+(a.isRadial?"highcharts-radial-axis"+e+" ":"")+(k||"")).add(t)};b.gridGroup=A("grid","-grid",h.gridZIndex||1);b.axisGroup=A("axis","",h.zIndex||2);b.labelGroup=A("axis-labels","-labels",v.zIndex||7);}y||b.isLinked?(d.forEach(function(a,e){b.generateTick(a,e);}),b.renderUnsquish(),b.reserveSpaceDefault=0===w||2===w||{1:"left",
3:"right"}[w]===b.labelAlign,F(v.reserveSpace,"center"===b.labelAlign?!0:null,b.reserveSpaceDefault)&&d.forEach(function(a){N=Math.max(f[a].getLabelSize(),N);}),b.staggerLines&&(N*=b.staggerLines),b.labelOffset=N*(b.opposite?-1:1)):O(f,function(a,b){a.destroy();delete f[b];});if(J&&J.text&&!1!==J.enabled&&(b.addTitle(r),r&&!1!==J.reserveSpace)){b.titleOffset=l=b.axisTitle.getBBox()[m?"height":"width"];var R=J.offset;q=c(R)?0:F(J.margin,m?5:10);}b.renderLine();b.offset=Z*F(h.offset,V[w]?V[w]+(h.margin||
0):0);b.tickRotCorr=b.tickRotCorr||{x:0,y:0};J=0===w?-b.labelMetrics().h:2===w?b.tickRotCorr.y:0;q=Math.abs(N)+q;N&&(q=q-J+Z*(m?F(v.y,b.tickRotCorr.y+8*Z):v.x));b.axisTitleMargin=F(R,q);b.getMaxLabelDimensions&&(b.maxLabelDimensions=b.getMaxLabelDimensions(f,d));m=this.tickSize("tick");V[w]=Math.max(V[w],b.axisTitleMargin+l+Z*b.offset,q,d&&d.length&&m?m[0]+Z*b.offset:0);h=h.offset?0:2*Math.floor(b.axisLine.strokeWidth()/2);e[n]=Math.max(e[n],h);z(this,"afterGetOffset");};f.prototype.getLinePath=function(a){var b=
this.chart,e=this.opposite,c=this.offset,g=this.horiz,h=this.left+(e?this.width:0)+c;c=b.chartHeight-this.bottom-(e?this.height:0)+c;e&&(a*=-1);return b.renderer.crispLine([["M",g?this.left:h,g?c:this.top],["L",g?b.chartWidth-this.right:h,g?c:b.chartHeight-this.bottom]],a)};f.prototype.renderLine=function(){this.axisLine||(this.axisLine=this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),this.chart.styledMode||this.axisLine.attr({stroke:this.options.lineColor,"stroke-width":this.options.lineWidth,
zIndex:7}));};f.prototype.getTitlePosition=function(){var a=this.horiz,b=this.left,e=this.top,c=this.len,g=this.options.title,h=a?b:e,d=this.opposite,f=this.offset,m=g.x||0,w=g.y||0,n=this.axisTitle,r=this.chart.renderer.fontMetrics(g.style&&g.style.fontSize,n);n=Math.max(n.getBBox(null,0).height-r.h-1,0);c={low:h+(a?0:c),middle:h+c/2,high:h+(a?c:0)}[g.align];b=(a?e+this.height:b)+(a?1:-1)*(d?-1:1)*this.axisTitleMargin+[-n,n,r.f,-n][this.side];a={x:a?c+m:b+(d?this.width:0)+f+m,y:a?b+w-(d?this.height:
0)+f:c+w};z(this,"afterGetTitlePosition",{titlePosition:a});return a};f.prototype.renderMinorTick=function(a){var b=this.chart.hasRendered&&this.old,e=this.minorTicks;e[a]||(e[a]=new G(this,a,"minor"));b&&e[a].isNew&&e[a].render(null,!0);e[a].render(null,!1,1);};f.prototype.renderTick=function(a,b){var e,c=this.ticks,g=this.chart.hasRendered&&this.old;if(!this.isLinked||a>=this.min&&a<=this.max||(null===(e=this.grid)||void 0===e?0:e.isColumn))c[a]||(c[a]=new G(this,a)),g&&c[a].isNew&&c[a].render(b,
!0,-1),c[a].render(b);};f.prototype.render=function(){var b=this,e=b.chart,c=b.logarithmic,g=b.options,h=b.isLinked,d=b.tickPositions,f=b.axisTitle,m=b.ticks,w=b.minorTicks,n=b.alternateBands,r=g.stackLabels,q=g.alternateGridColor,l=b.tickmarkOffset,J=b.axisLine,F=b.showAxis,v=H(e.renderer.globalAnimation),V,N;b.labelEdge.length=0;b.overlap=!1;[m,w,n].forEach(function(a){O(a,function(a){a.isActive=!1;});});if(b.hasData()||h)b.minorTickInterval&&!b.categories&&b.getMinorTickPositions().forEach(function(a){b.renderMinorTick(a);}),
d.length&&(d.forEach(function(a,e){b.renderTick(a,e);}),l&&(0===b.min||b.single)&&(m[-1]||(m[-1]=new G(b,-1,null,!0)),m[-1].render(-1))),q&&d.forEach(function(a,g){N="undefined"!==typeof d[g+1]?d[g+1]+l:b.max-l;0===g%2&&a<b.max&&N<=b.max+(e.polar?-l:l)&&(n[a]||(n[a]=new k.PlotLineOrBand(b)),V=a+l,n[a].options={from:c?c.lin2log(V):V,to:c?c.lin2log(N):N,color:q,className:"highcharts-alternate-grid"},n[a].render(),n[a].isActive=!0);}),b._addedPlotLB||(b._addedPlotLB=!0,(g.plotLines||[]).concat(g.plotBands||
[]).forEach(function(a){b.addPlotBandOrLine(a);}));[m,w,n].forEach(function(a){var b,c=[],g=v.duration;O(a,function(a,b){a.isActive||(a.render(b,!1,0),a.isActive=!1,c.push(b));});T(function(){for(b=c.length;b--;)a[c[b]]&&!a[c[b]].isActive&&(a[c[b]].destroy(),delete a[c[b]]);},a!==n&&e.hasRendered&&g?g:0);});J&&(J[J.isPlaced?"animate":"attr"]({d:this.getLinePath(J.strokeWidth())}),J.isPlaced=!0,J[F?"show":"hide"](F));f&&F&&(g=b.getTitlePosition(),a(g.y)?(f[f.isNew?"attr":"animate"](g),f.isNew=!1):(f.attr("y",
-9999),f.isNew=!0));r&&r.enabled&&b.stacking&&b.stacking.renderStackTotals();b.old={len:b.len,max:b.max,min:b.min,transA:b.transA,userMax:b.userMax,userMin:b.userMin};b.isDirty=!1;z(this,"afterRender");};f.prototype.redraw=function(){this.visible&&(this.render(),this.plotLinesAndBands.forEach(function(a){a.render();}));this.series.forEach(function(a){a.isDirty=!0;});};f.prototype.getKeepProps=function(){return this.keepProps||f.keepProps};f.prototype.destroy=function(a){var b=this,e=b.plotLinesAndBands,
c;z(this,"destroy",{keepEvents:a});a||R(b);[b.ticks,b.minorTicks,b.alternateBands].forEach(function(a){q(a);});if(e)for(a=e.length;a--;)e[a].destroy();"axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" ").forEach(function(a){b[a]&&(b[a]=b[a].destroy());});for(c in b.plotLinesAndBandsGroups)b.plotLinesAndBandsGroups[c]=b.plotLinesAndBandsGroups[c].destroy();O(b,function(a,e){-1===b.getKeepProps().indexOf(e)&&delete b[e];});};f.prototype.drawCrosshair=function(a,b){var e=this.crosshair,
g=F(e.snap,!0),h,f=this.cross,m=this.chart;z(this,"drawCrosshair",{e:a,point:b});a||(a=this.cross&&this.cross.e);if(this.crosshair&&!1!==(c(b)||!g)){g?c(b)&&(h=F("colorAxis"!==this.coll?b.crosshairPos:null,this.isXAxis?b.plotX:this.len-b.plotY)):h=a&&(this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos);if(c(h)){var p={value:b&&(this.isXAxis?b.x:F(b.stackY,b.y)),translatedValue:h};m.polar&&M(p,{isCrosshair:!0,chartX:a&&a.chartX,chartY:a&&a.chartY,point:b});p=this.getPlotLinePath(p)||null;}if(!c(p)){this.hideCrosshair();
return}g=this.categories&&!this.isRadial;f||(this.cross=f=m.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-"+(g?"category ":"thin ")+e.className).attr({zIndex:F(e.zIndex,2)}).add(),m.styledMode||(f.attr({stroke:e.color||(g?d.parse(x.highlightColor20).setOpacity(.25).get():x.neutralColor20),"stroke-width":F(e.width,1)}).css({"pointer-events":"none"}),e.dashStyle&&f.attr({dashstyle:e.dashStyle})));f.show().attr({d:p});g&&!e.width&&f.attr({"stroke-width":this.transA});this.cross.e=
a;}else this.hideCrosshair();z(this,"afterDrawCrosshair",{e:a,point:b});};f.prototype.hideCrosshair=function(){this.cross&&this.cross.hide();z(this,"afterHideCrosshair");};f.prototype.hasVerticalPanning=function(){var a,b=null===(a=this.chart.options.chart)||void 0===a?void 0:a.panning;return !!(b&&b.enabled&&/y/.test(b.type))};f.prototype.validatePositiveValue=function(b){return a(b)&&0<b};f.prototype.update=function(a,b){var e=this.chart,c=a&&a.events||{};a=w(this.userOptions,a);e.options[this.coll].indexOf&&
(e.options[this.coll][e.options[this.coll].indexOf(this.userOptions)]=a);O(e.options[this.coll].events,function(a,b){"undefined"===typeof c[b]&&(c[b]=void 0);});this.destroy(!0);this.init(e,M(a,{events:c}));e.isDirtyBox=!0;F(b,!0)&&e.redraw();};f.prototype.remove=function(a){for(var b=this.chart,c=this.coll,g=this.series,h=g.length;h--;)g[h]&&g[h].remove(!1);n(b.axes,this);n(b[c],this);e(b.options[c])?b.options[c].splice(this.options.index,1):delete b.options[c];b[c].forEach(function(a,b){a.options.index=
a.userOptions.index=b;});this.destroy();b.isDirtyBox=!0;F(a,!0)&&b.redraw();};f.prototype.setTitle=function(a,b){this.update({title:a},b);};f.prototype.setCategories=function(a,b){this.update({categories:a},b);};f.defaultOptions={dateTimeLabelFormats:{millisecond:{main:"%H:%M:%S.%L",range:!1},second:{main:"%H:%M:%S",range:!1},minute:{main:"%H:%M",range:!1},hour:{main:"%H:%M",range:!1},day:{main:"%e. %b"},week:{main:"%e. %b"},month:{main:"%b '%y"},year:{main:"%Y"}},endOnTick:!1,labels:{enabled:!0,indentation:10,
x:0,style:{color:x.neutralColor60,cursor:"default",fontSize:"11px"}},maxPadding:.01,minorTickLength:2,minorTickPosition:"outside",minPadding:.01,showEmpty:!0,startOfWeek:1,startOnTick:!1,tickLength:10,tickPixelInterval:100,tickmarkPlacement:"between",tickPosition:"outside",title:{align:"middle",style:{color:x.neutralColor60}},type:"linear",minorGridLineColor:x.neutralColor5,minorGridLineWidth:1,minorTickColor:x.neutralColor40,lineColor:x.highlightColor20,lineWidth:1,gridLineColor:x.neutralColor10,
tickColor:x.highlightColor20};f.defaultYAxisOptions={endOnTick:!0,maxPadding:.05,minPadding:.05,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{animation:{},allowOverlap:!1,enabled:!1,crop:!0,overflow:"justify",formatter:function(){var a=this.axis.chart.numberFormatter;return a(this.total,-1)},style:{color:x.neutralColor100,fontSize:"11px",fontWeight:"bold",textOutline:"1px contrast"}},gridLineWidth:1,lineWidth:0};f.defaultLeftAxisOptions=
{labels:{x:-15},title:{rotation:270}};f.defaultRightAxisOptions={labels:{x:15},title:{rotation:90}};f.defaultBottomAxisOptions={labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}};f.defaultTopAxisOptions={labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}};f.keepProps="extKey hcEvents names series userMax userMin".split(" ");return f}();k.Axis=f;return k.Axis});P(k,"Core/Axis/DateTimeAxis.js",[k["Core/Axis/Axis.js"],k["Core/Utilities.js"]],function(f,d){var k=d.addEvent,x=d.getMagnitude,
B=d.normalizeTickInterval,G=d.timeUnits,D=function(){function d(d){this.axis=d;}d.prototype.normalizeTimeTickInterval=function(d,f){var l=f||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]];f=l[l.length-1];var k=G[f[0]],g=f[1],t;for(t=0;t<l.length&&!(f=l[t],k=G[f[0]],g=f[1],l[t+1]&&d<=(k*g[g.length-1]+G[l[t+1][0]])/2);t++);k===G.year&&d<5*k&&(g=[1,2,5]);
d=B(d/k,g,"year"===f[0]?Math.max(x(d/k),1):1);return {unitRange:k,count:d,unitName:f[0]}};return d}();d=function(){function d(){}d.compose=function(d){d.keepProps.push("dateTime");d.prototype.getTimeTicks=function(){return this.chart.time.getTimeTicks.apply(this.chart.time,arguments)};k(d,"init",function(d){"datetime"!==d.userOptions.type?this.dateTime=void 0:this.dateTime||(this.dateTime=new D(this));});};d.AdditionsClass=D;return d}();d.compose(f);return d});P(k,"Core/Axis/LogarithmicAxis.js",[k["Core/Axis/Axis.js"],
k["Core/Utilities.js"]],function(f,d){var k=d.addEvent,x=d.getMagnitude,B=d.normalizeTickInterval,G=d.pick,D=function(){function d(d){this.axis=d;}d.prototype.getLogTickPositions=function(d,f,l,k){var g=this.axis,y=g.len,c=g.options,q=[];k||(this.minorAutoInterval=void 0);if(.5<=d)d=Math.round(d),q=g.getLinearTickPositions(d,f,l);else if(.08<=d){c=Math.floor(f);var n,A;for(y=.3<d?[1,2,4]:.15<d?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];c<l+1&&!A;c++){var t=y.length;for(n=0;n<t&&!A;n++){var z=this.log2lin(this.lin2log(c)*
y[n]);z>f&&(!k||m<=l)&&"undefined"!==typeof m&&q.push(m);m>l&&(A=!0);var m=z;}}}else f=this.lin2log(f),l=this.lin2log(l),d=k?g.getMinorTickInterval():c.tickInterval,d=G("auto"===d?null:d,this.minorAutoInterval,c.tickPixelInterval/(k?5:1)*(l-f)/((k?y/g.tickPositions.length:y)||1)),d=B(d,void 0,x(d)),q=g.getLinearTickPositions(d,f,l).map(this.log2lin),k||(this.minorAutoInterval=d/5);k||(g.tickInterval=d);return q};d.prototype.lin2log=function(d){return Math.pow(10,d)};d.prototype.log2lin=function(d){return Math.log(d)/
Math.LN10};return d}();d=function(){function d(){}d.compose=function(d){d.keepProps.push("logarithmic");k(d,"init",function(d){var f=this.logarithmic;"logarithmic"!==d.userOptions.type?this.logarithmic=void 0:f||(this.logarithmic=new D(this));});k(d,"afterInit",function(){var d=this.logarithmic;d&&(this.lin2val=function(f){return d.lin2log(f)},this.val2lin=function(f){return d.log2lin(f)});});};return d}();d.compose(f);return d});P(k,"Core/Axis/PlotLineOrBand.js",[k["Core/Axis/Axis.js"],k["Core/Globals.js"],
k["Core/Color/Palette.js"],k["Core/Utilities.js"]],function(f,d,k,x){var B=x.arrayMax,G=x.arrayMin,D=x.defined,H=x.destroyObjectProperties,t=x.erase,C=x.extend,l=x.fireEvent,E=x.merge,g=x.objectEach,y=x.pick;x=function(){function c(c,g){this.axis=c;g&&(this.options=g,this.id=g.id);}c.prototype.render=function(){l(this,"render");var c=this,d=c.axis,f=d.horiz,t=d.logarithmic,z=c.options,m=z.label,r=c.label,e=z.to,h=z.from,a=z.value,b=D(h)&&D(e),w=D(a),J=c.svgElem,O=!J,F=[],N=z.color,R=y(z.zIndex,0),
Q=z.events;F={"class":"highcharts-plot-"+(b?"band ":"line ")+(z.className||"")};var C={},v=d.chart.renderer,x=b?"bands":"lines";t&&(h=t.log2lin(h),e=t.log2lin(e),a=t.log2lin(a));d.chart.styledMode||(w?(F.stroke=N||k.neutralColor40,F["stroke-width"]=y(z.width,1),z.dashStyle&&(F.dashstyle=z.dashStyle)):b&&(F.fill=N||k.highlightColor10,z.borderWidth&&(F.stroke=z.borderColor,F["stroke-width"]=z.borderWidth)));C.zIndex=R;x+="-"+R;(t=d.plotLinesAndBandsGroups[x])||(d.plotLinesAndBandsGroups[x]=t=v.g("plot-"+
x).attr(C).add());O&&(c.svgElem=J=v.path().attr(F).add(t));if(w)F=d.getPlotLinePath({value:a,lineWidth:J.strokeWidth(),acrossPanes:z.acrossPanes});else if(b)F=d.getPlotBandPath(h,e,z);else return;!c.eventsAdded&&Q&&(g(Q,function(a,b){J.on(b,function(a){Q[b].apply(c,[a]);});}),c.eventsAdded=!0);(O||!J.d)&&F&&F.length?J.attr({d:F}):J&&(F?(J.show(!0),J.animate({d:F})):J.d&&(J.hide(),r&&(c.label=r=r.destroy())));m&&(D(m.text)||D(m.formatter))&&F&&F.length&&0<d.width&&0<d.height&&!F.isFlat?(m=E({align:f&&
b&&"center",x:f?!b&&4:10,verticalAlign:!f&&b&&"middle",y:f?b?16:10:b?6:-4,rotation:f&&!b&&90},m),this.renderLabel(m,F,b,R)):r&&r.hide();return c};c.prototype.renderLabel=function(c,g,d,f){var n=this.label,m=this.axis.chart.renderer;n||(n={align:c.textAlign||c.align,rotation:c.rotation,"class":"highcharts-plot-"+(d?"band":"line")+"-label "+(c.className||"")},n.zIndex=f,f=this.getLabelText(c),this.label=n=m.text(f,0,0,c.useHTML).attr(n).add(),this.axis.chart.styledMode||n.css(c.style));m=g.xBounds||
[g[0][1],g[1][1],d?g[2][1]:g[0][1]];g=g.yBounds||[g[0][2],g[1][2],d?g[2][2]:g[0][2]];d=G(m);f=G(g);n.align(c,!1,{x:d,y:f,width:B(m)-d,height:B(g)-f});n.show(!0);};c.prototype.getLabelText=function(c){return D(c.formatter)?c.formatter.call(this):c.text};c.prototype.destroy=function(){t(this.axis.plotLinesAndBands,this);delete this.axis;H(this);};return c}();C(f.prototype,{getPlotBandPath:function(c,g,d){void 0===d&&(d=this.options);var f=this.getPlotLinePath({value:g,force:!0,acrossPanes:d.acrossPanes});
d=this.getPlotLinePath({value:c,force:!0,acrossPanes:d.acrossPanes});var n=[],l=this.horiz,m=1;c=c<this.min&&g<this.min||c>this.max&&g>this.max;if(d&&f){if(c){var r=d.toString()===f.toString();m=0;}for(c=0;c<d.length;c+=2){g=d[c];var e=d[c+1],h=f[c],a=f[c+1];"M"!==g[0]&&"L"!==g[0]||"M"!==e[0]&&"L"!==e[0]||"M"!==h[0]&&"L"!==h[0]||"M"!==a[0]&&"L"!==a[0]||(l&&h[1]===g[1]?(h[1]+=m,a[1]+=m):l||h[2]!==g[2]||(h[2]+=m,a[2]+=m),n.push(["M",g[1],g[2]],["L",e[1],e[2]],["L",a[1],a[2]],["L",h[1],h[2]],["Z"]));
n.isFlat=r;}}return n},addPlotBand:function(c){return this.addPlotBandOrLine(c,"plotBands")},addPlotLine:function(c){return this.addPlotBandOrLine(c,"plotLines")},addPlotBandOrLine:function(c,g){var f=this,l=new d.PlotLineOrBand(this,c),q=this.userOptions;this.visible&&(l=l.render());if(l){this._addedPlotLB||(this._addedPlotLB=!0,(q.plotLines||[]).concat(q.plotBands||[]).forEach(function(c){f.addPlotBandOrLine(c);}));if(g){var k=q[g]||[];k.push(c);q[g]=k;}this.plotLinesAndBands.push(l);}return l},removePlotBandOrLine:function(c){for(var g=
this.plotLinesAndBands,d=this.options,f=this.userOptions,l=g.length;l--;)g[l].id===c&&g[l].destroy();[d.plotLines||[],f.plotLines||[],d.plotBands||[],f.plotBands||[]].forEach(function(g){for(l=g.length;l--;)(g[l]||{}).id===c&&t(g,g[l]);});},removePlotBand:function(c){this.removePlotBandOrLine(c);},removePlotLine:function(c){this.removePlotBandOrLine(c);}});d.PlotLineOrBand=x;return d.PlotLineOrBand});P(k,"Core/Tooltip.js",[k["Core/Globals.js"],k["Core/Color/Palette.js"],k["Core/Utilities.js"]],function(f,
d,k){var x=f.doc,B=k.clamp,G=k.css,D=k.defined,H=k.discardElement,t=k.extend,C=k.fireEvent,l=k.format,E=k.isNumber,g=k.isString,y=k.merge,c=k.pick,q=k.splat,n=k.syncTimeout,A=k.timeUnits;var M=function(){function z(c,g){this.container=void 0;this.crosshairs=[];this.distance=0;this.isHidden=!0;this.isSticky=!1;this.now={};this.options={};this.outside=!1;this.chart=c;this.init(c,g);}z.prototype.applyFilter=function(){var c=this.chart;c.renderer.definition({tagName:"filter",attributes:{id:"drop-shadow-"+
c.index,opacity:.5},children:[{tagName:"feGaussianBlur",attributes:{"in":"SourceAlpha",stdDeviation:1}},{tagName:"feOffset",attributes:{dx:1,dy:1}},{tagName:"feComponentTransfer",children:[{tagName:"feFuncA",attributes:{type:"linear",slope:.3}}]},{tagName:"feMerge",children:[{tagName:"feMergeNode"},{tagName:"feMergeNode",attributes:{"in":"SourceGraphic"}}]}]});c.renderer.definition({tagName:"style",textContent:".highcharts-tooltip-"+c.index+"{filter:url(#drop-shadow-"+c.index+")}"});};z.prototype.bodyFormatter=
function(c){return c.map(function(c){var e=c.series.tooltipOptions;return (e[(c.point.formatPrefix||"point")+"Formatter"]||c.point.tooltipFormatter).call(c.point,e[(c.point.formatPrefix||"point")+"Format"]||"")})};z.prototype.cleanSplit=function(c){this.chart.series.forEach(function(g){var e=g&&g.tt;e&&(!e.isActive||c?g.tt=e.destroy():e.isActive=!1);});};z.prototype.defaultFormatter=function(c){var g=this.points||q(this);var e=[c.tooltipFooterHeaderFormatter(g[0])];e=e.concat(c.bodyFormatter(g));e.push(c.tooltipFooterHeaderFormatter(g[0],
!0));return e};z.prototype.destroy=function(){this.label&&(this.label=this.label.destroy());this.split&&this.tt&&(this.cleanSplit(this.chart,!0),this.tt=this.tt.destroy());this.renderer&&(this.renderer=this.renderer.destroy(),H(this.container));k.clearTimeout(this.hideTimer);k.clearTimeout(this.tooltipTimeout);};z.prototype.getAnchor=function(c,g){var e=this.chart;var d=e.pointer;var a=e.inverted,b=e.plotTop,f=e.plotLeft,m=0,n=0,l,r;c=q(c);this.followPointer&&g?("undefined"===typeof g.chartX&&(g=d.normalize(g)),
d=[g.chartX-f,g.chartY-b]):c[0].tooltipPos?d=c[0].tooltipPos:(c.forEach(function(c){l=c.series.yAxis;r=c.series.xAxis;m+=c.plotX||0;n+=c.plotLow?(c.plotLow+(c.plotHigh||0))/2:c.plotY||0;r&&l&&(a?(m+=b+e.plotHeight-r.len-r.pos,n+=f+e.plotWidth-l.len-l.pos):(m+=r.pos-f,n+=l.pos-b));}),m/=c.length,n/=c.length,d=[a?e.plotWidth-n:m,a?e.plotHeight-m:n],this.shared&&1<c.length&&g&&(a?d[0]=g.chartX-f:d[1]=g.chartY-b));return d.map(Math.round)};z.prototype.getDateFormat=function(c,g,e,d){var a=this.chart.time,
b=a.dateFormat("%m-%d %H:%M:%S.%L",g),h={millisecond:15,second:12,minute:9,hour:6,day:3},f="millisecond";for(m in A){if(c===A.week&&+a.dateFormat("%w",g)===e&&"00:00:00.000"===b.substr(6)){var m="week";break}if(A[m]>c){m=f;break}if(h[m]&&b.substr(h[m])!=="01-01 00:00:00.000".substr(h[m]))break;"week"!==m&&(f=m);}if(m)var n=a.resolveDTLFormat(d[m]).main;return n};z.prototype.getLabel=function(){var c,g,e,d=this,a=this.chart.renderer,b=this.chart.styledMode,w=this.options,n="tooltip"+(D(w.className)?
" "+w.className:""),l=(null===(c=w.style)||void 0===c?void 0:c.pointerEvents)||(!this.followPointer&&w.stickOnContact?"auto":"none"),q;c=function(){d.inContact=!0;};var k=function(){var a=d.chart.hoverSeries;d.inContact=!1;if(a&&a.onMouseOut)a.onMouseOut();};if(!this.label){if(this.outside){var t=null===(g=this.chart.options.chart)||void 0===g?void 0:g.style;this.container=q=f.doc.createElement("div");q.className="highcharts-tooltip-container";G(q,{position:"absolute",top:"1px",pointerEvents:l,zIndex:Math.max((null===
(e=this.options.style)||void 0===e?void 0:e.zIndex)||0,((null===t||void 0===t?void 0:t.zIndex)||0)+3)});f.doc.body.appendChild(q);this.renderer=a=new f.Renderer(q,0,0,t,void 0,void 0,a.styledMode);}this.split?this.label=a.g(n):(this.label=a.label("",0,0,w.shape||"callout",null,null,w.useHTML,null,n).attr({padding:w.padding,r:w.borderRadius}),b||this.label.attr({fill:w.backgroundColor,"stroke-width":w.borderWidth}).css(w.style).css({pointerEvents:l}).shadow(w.shadow));b&&(this.applyFilter(),this.label.addClass("highcharts-tooltip-"+
this.chart.index));if(d.outside&&!d.split){var y=this.label,z=y.xSetter,v=y.ySetter;y.xSetter=function(a){z.call(y,d.distance);q.style.left=a+"px";};y.ySetter=function(a){v.call(y,d.distance);q.style.top=a+"px";};}this.label.on("mouseenter",c).on("mouseleave",k).attr({zIndex:8}).add();}return this.label};z.prototype.getPosition=function(g,d,e){var h=this.chart,a=this.distance,b={},f=h.inverted&&e.h||0,m,n=this.outside,l=n?x.documentElement.clientWidth-2*a:h.chartWidth,r=n?Math.max(x.body.scrollHeight,
x.documentElement.scrollHeight,x.body.offsetHeight,x.documentElement.offsetHeight,x.documentElement.clientHeight):h.chartHeight,q=h.pointer.getChartPosition(),k=function(b){var c="x"===b;return [b,c?l:r,c?g:d].concat(n?[c?g*q.scaleX:d*q.scaleY,c?q.left-a+(e.plotX+h.plotLeft)*q.scaleX:q.top-a+(e.plotY+h.plotTop)*q.scaleY,0,c?l:r]:[c?g:d,c?e.plotX+h.plotLeft:e.plotY+h.plotTop,c?h.plotLeft:h.plotTop,c?h.plotLeft+h.plotWidth:h.plotTop+h.plotHeight])},y=k("y"),v=k("x"),t=!this.followPointer&&c(e.ttBelow,
!h.inverted===!!e.negative),p=function(e,c,g,d,h,m,p){var u=n?"y"===e?a*q.scaleY:a*q.scaleX:a,w=(g-d)/2,l=d<h-a,r=h+a+d<c,J=h-u-g+w;h=h+u-w;if(t&&r)b[e]=h;else if(!t&&l)b[e]=J;else if(l)b[e]=Math.min(p-d,0>J-f?J:J-f);else if(r)b[e]=Math.max(m,h+f+g>c?h:h+f);else return !1},z=function(e,c,g,d,h){var f;h<a||h>c-a?f=!1:b[e]=h<g/2?1:h>c-d/2?c-d-2:h-g/2;return f},A=function(a){var b=y;y=v;v=b;m=a;},E=function(){!1!==p.apply(0,y)?!1!==z.apply(0,v)||m||(A(!0),E()):m?b.x=b.y=0:(A(!0),E());};(h.inverted||1<this.len)&&
A();E();return b};z.prototype.getXDateFormat=function(c,g,e){g=g.dateTimeLabelFormats;var d=e&&e.closestPointRange;return (d?this.getDateFormat(d,c.x,e.options.startOfWeek,g):g.day)||g.year};z.prototype.hide=function(g){var d=this;k.clearTimeout(this.hideTimer);g=c(g,this.options.hideDelay,500);this.isHidden||(this.hideTimer=n(function(){d.getLabel().fadeOut(g?void 0:g);d.isHidden=!0;},g));};z.prototype.init=function(g,d){this.chart=g;this.options=d;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=
!0;this.split=d.split&&!g.inverted&&!g.polar;this.shared=d.shared||this.split;this.outside=c(d.outside,!(!g.scrollablePixelsX&&!g.scrollablePixelsY));};z.prototype.isStickyOnContact=function(){return !(this.followPointer||!this.options.stickOnContact||!this.inContact)};z.prototype.move=function(c,g,e,d){var a=this,b=a.now,h=!1!==a.options.animation&&!a.isHidden&&(1<Math.abs(c-b.x)||1<Math.abs(g-b.y)),f=a.followPointer||1<a.len;t(b,{x:h?(2*b.x+c)/3:c,y:h?(b.y+g)/2:g,anchorX:f?void 0:h?(2*b.anchorX+e)/
3:e,anchorY:f?void 0:h?(b.anchorY+d)/2:d});a.getLabel().attr(b);a.drawTracker();h&&(k.clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){a&&a.move(c,g,e,d);},32));};z.prototype.refresh=function(g,f){var e=this.chart,h=this.options,a=g,b={},m=[],n=h.formatter||this.defaultFormatter;b=this.shared;var l=e.styledMode;if(h.enabled){k.clearTimeout(this.hideTimer);this.followPointer=q(a)[0].series.tooltipOptions.followPointer;var r=this.getAnchor(a,f);f=r[0];var N=r[1];!b||a.series&&
a.series.noSharedTooltip?b=a.getLabelConfig():(e.pointer.applyInactiveState(a),a.forEach(function(a){a.setState("hover");m.push(a.getLabelConfig());}),b={x:a[0].category,y:a[0].y},b.points=m,a=a[0]);this.len=m.length;e=n.call(b,this);n=a.series;this.distance=c(n.tooltipOptions.distance,16);!1===e?this.hide():(this.split?this.renderSplit(e,q(g)):(g=this.getLabel(),h.style.width&&!l||g.css({width:this.chart.spacingBox.width+"px"}),g.attr({text:e&&e.join?e.join(""):e}),g.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-"+
c(a.colorIndex,n.colorIndex)),l||g.attr({stroke:h.borderColor||a.color||n.color||d.neutralColor60}),this.updatePosition({plotX:f,plotY:N,negative:a.negative,ttBelow:a.ttBelow,h:r[2]||0})),this.isHidden&&this.label&&this.label.attr({opacity:1}).show(),this.isHidden=!1);C(this,"refresh");}};z.prototype.renderSplit=function(m,n){function e(a,b,e,c,g){void 0===g&&(g=!0);e?(b=aa?0:U,a=B(a-c/2,x.left,x.right-c)):(b-=I,a=g?a-c-p:a+p,a=B(a,g?a:x.left,x.right));return {x:a,y:b}}var h=this,a=h.chart,b=h.chart,
w=b.plotHeight,l=b.plotLeft,q=b.plotTop,r=b.pointer,k=b.renderer,y=b.scrollablePixelsY,z=void 0===y?0:y;y=b.scrollingContainer;y=void 0===y?{scrollLeft:0,scrollTop:0}:y;var A=y.scrollLeft,v=y.scrollTop,E=b.styledMode,p=h.distance,C=h.options,M=h.options.positioner,x={left:A,right:A+b.chartWidth,top:v,bottom:v+b.chartHeight},u=h.getLabel(),aa=!(!a.xAxis[0]||!a.xAxis[0].opposite),I=q+v,X=0,U=w-z;g(m)&&(m=[!1,m]);m=m.slice(0,n.length+1).reduce(function(a,b,g){if(!1!==b&&""!==b){g=n[g-1]||{isHeader:!0,
plotX:n[0].plotX,plotY:w,series:{}};var f=g.isHeader,m=f?h:g.series,r=m.tt,J=g.isHeader;var F=g.series;var N="highcharts-color-"+c(g.colorIndex,F.colorIndex,"none");r||(r={padding:C.padding,r:C.borderRadius},E||(r.fill=C.backgroundColor,r["stroke-width"]=C.borderWidth),r=k.label("",0,0,C[J?"headerShape":"shape"]||"callout",void 0,void 0,C.useHTML).addClass((J?"highcharts-tooltip-header ":"")+"highcharts-tooltip-box "+N).attr(r).add(u));r.isActive=!0;r.attr({text:b});E||r.css(C.style).shadow(C.shadow).attr({stroke:C.borderColor||
g.color||F.color||d.neutralColor80});b=m.tt=r;J=b.getBBox();m=J.width+b.strokeWidth();f&&(X=J.height,U+=X,aa&&(I-=X));F=g.plotX;F=void 0===F?0:F;N=g.plotY;N=void 0===N?0:N;var O=g.series;if(g.isHeader){F=l+F;var y=q+w/2;}else r=O.xAxis,O=O.yAxis,F=r.pos+B(F,-p,r.len+p),O.pos+N>=v+q&&O.pos+N<=v+q+w-z&&(y=O.pos+N);F=B(F,x.left-p,x.right+p);"number"===typeof y?(J=J.height+1,N=M?M.call(h,m,J,g):e(F,y,f,m),a.push({align:M?0:void 0,anchorX:F,anchorY:y,boxWidth:m,point:g,rank:c(N.rank,f?1:0),size:J,target:N.y,
tt:b,x:N.x})):b.isActive=!1;}return a},[]);!M&&m.some(function(a){return a.x<x.left})&&(m=m.map(function(a){var b=e(a.anchorX,a.anchorY,a.point.isHeader,a.boxWidth,!1);return t(a,{target:b.y,x:b.x})}));h.cleanSplit();f.distribute(m,U);m.forEach(function(a){var b=a.pos;a.tt.attr({visibility:"undefined"===typeof b?"hidden":"inherit",x:a.x,y:b+I,anchorX:a.anchorX,anchorY:a.anchorY});});m=h.container;a=h.renderer;h.outside&&m&&a&&(b=u.getBBox(),a.setSize(b.width+b.x,b.height+b.y,!1),r=r.getChartPosition(),
m.style.left=r.left+"px",m.style.top=r.top+"px");};z.prototype.drawTracker=function(){if(this.followPointer||!this.options.stickOnContact)this.tracker&&this.tracker.destroy();else {var c=this.chart,g=this.label,e=c.hoverPoint;if(g&&e){var d={x:0,y:0,width:0,height:0};e=this.getAnchor(e);var a=g.getBBox();e[0]+=c.plotLeft-g.translateX;e[1]+=c.plotTop-g.translateY;d.x=Math.min(0,e[0]);d.y=Math.min(0,e[1]);d.width=0>e[0]?Math.max(Math.abs(e[0]),a.width-e[0]):Math.max(Math.abs(e[0]),a.width);d.height=0>
e[1]?Math.max(Math.abs(e[1]),a.height-Math.abs(e[1])):Math.max(Math.abs(e[1]),a.height);this.tracker?this.tracker.attr(d):(this.tracker=g.renderer.rect(d).addClass("highcharts-tracker").add(g),c.styledMode||this.tracker.attr({fill:"rgba(0,0,0,0)"}));}}};z.prototype.styledModeFormat=function(c){return c.replace('style="font-size: 10px"','class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g,'class="highcharts-color-{$1.colorIndex}"')};z.prototype.tooltipFooterHeaderFormatter=
function(c,g){var e=g?"footer":"header",d=c.series,a=d.tooltipOptions,b=a.xDateFormat,f=d.xAxis,m=f&&"datetime"===f.options.type&&E(c.key),n=a[e+"Format"];g={isFooter:g,labelConfig:c};C(this,"headerFormatter",g,function(e){m&&!b&&(b=this.getXDateFormat(c,a,f));m&&b&&(c.point&&c.point.tooltipDateKeys||["key"]).forEach(function(a){n=n.replace("{point."+a+"}","{point."+a+":"+b+"}");});d.chart.styledMode&&(n=this.styledModeFormat(n));e.text=l(n,{point:c,series:d},this.chart);});return g.text};z.prototype.update=
function(c){this.destroy();y(!0,this.chart.options.tooltip.userOptions,c);this.init(this.chart,y(!0,this.options,c));};z.prototype.updatePosition=function(c){var g=this.chart,e=g.pointer,d=this.getLabel(),a=c.plotX+g.plotLeft;g=c.plotY+g.plotTop;e=e.getChartPosition();c=(this.options.positioner||this.getPosition).call(this,d.width,d.height,c);if(this.outside){var b=(this.options.borderWidth||0)+2*this.distance;this.renderer.setSize(d.width+b,d.height+b,!1);if(1!==e.scaleX||1!==e.scaleY)G(this.container,
{transform:"scale("+e.scaleX+", "+e.scaleY+")"}),a*=e.scaleX,g*=e.scaleY;a+=e.left-c.x;g+=e.top-c.y;}this.move(Math.round(c.x),Math.round(c.y||0),a,g);};return z}();f.Tooltip=M;return f.Tooltip});P(k,"Core/Pointer.js",[k["Core/Color/Color.js"],k["Core/Globals.js"],k["Core/Color/Palette.js"],k["Core/Tooltip.js"],k["Core/Utilities.js"]],function(f,d,k,x,B){var G=f.parse,D=d.charts,H=d.noop,t=B.addEvent,C=B.attr,l=B.css,E=B.defined,g=B.extend,y=B.find,c=B.fireEvent,q=B.isNumber,n=B.isObject,A=B.objectEach,
M=B.offset,z=B.pick,m=B.splat;f=function(){function f(e,c){this.lastValidTouch={};this.pinchDown=[];this.runChartClick=!1;this.chart=e;this.hasDragged=!1;this.options=c;this.unbindContainerMouseLeave=function(){};this.unbindContainerMouseEnter=function(){};this.init(e,c);}f.prototype.applyInactiveState=function(e){var c=[],a;(e||[]).forEach(function(b){a=b.series;c.push(a);a.linkedParent&&c.push(a.linkedParent);a.linkedSeries&&(c=c.concat(a.linkedSeries));a.navigatorSeries&&c.push(a.navigatorSeries);});
this.chart.series.forEach(function(a){-1===c.indexOf(a)?a.setState("inactive",!0):a.options.inactiveOtherPoints&&a.setAllPointsToState("inactive");});};f.prototype.destroy=function(){var e=this;"undefined"!==typeof e.unDocMouseMove&&e.unDocMouseMove();this.unbindContainerMouseLeave();d.chartCount||(d.unbindDocumentMouseUp&&(d.unbindDocumentMouseUp=d.unbindDocumentMouseUp()),d.unbindDocumentTouchEnd&&(d.unbindDocumentTouchEnd=d.unbindDocumentTouchEnd()));clearInterval(e.tooltipTimeout);A(e,function(c,
a){e[a]=void 0;});};f.prototype.drag=function(e){var c=this.chart,a=c.options.chart,b=e.chartX,g=e.chartY,d=this.zoomHor,f=this.zoomVert,m=c.plotLeft,l=c.plotTop,q=c.plotWidth,r=c.plotHeight,y=this.selectionMarker,v=this.mouseDownX||0,t=this.mouseDownY||0,p=n(a.panning)?a.panning&&a.panning.enabled:a.panning,z=a.panKey&&e[a.panKey+"Key"];if(!y||!y.touch)if(b<m?b=m:b>m+q&&(b=m+q),g<l?g=l:g>l+r&&(g=l+r),this.hasDragged=Math.sqrt(Math.pow(v-b,2)+Math.pow(t-g,2)),10<this.hasDragged){var A=c.isInsidePlot(v-
m,t-l);c.hasCartesianSeries&&(this.zoomX||this.zoomY)&&A&&!z&&!y&&(this.selectionMarker=y=c.renderer.rect(m,l,d?1:q,f?1:r,0).attr({"class":"highcharts-selection-marker",zIndex:7}).add(),c.styledMode||y.attr({fill:a.selectionMarkerFill||G(k.highlightColor80).setOpacity(.25).get()}));y&&d&&(b-=v,y.attr({width:Math.abs(b),x:(0<b?0:b)+v}));y&&f&&(b=g-t,y.attr({height:Math.abs(b),y:(0<b?0:b)+t}));A&&!y&&p&&c.pan(e,a.panning);}};f.prototype.dragStart=function(e){var c=this.chart;c.mouseIsDown=e.type;c.cancelClick=
!1;c.mouseDownX=this.mouseDownX=e.chartX;c.mouseDownY=this.mouseDownY=e.chartY;};f.prototype.drop=function(e){var d=this,a=this.chart,b=this.hasPinched;if(this.selectionMarker){var f={originalEvent:e,xAxis:[],yAxis:[]},m=this.selectionMarker,n=m.attr?m.attr("x"):m.x,r=m.attr?m.attr("y"):m.y,k=m.attr?m.attr("width"):m.width,y=m.attr?m.attr("height"):m.height,t;if(this.hasDragged||b)a.axes.forEach(function(a){if(a.zoomEnabled&&E(a.min)&&(b||d[{xAxis:"zoomX",yAxis:"zoomY"}[a.coll]])&&q(n)&&q(r)){var c=
a.horiz,g="touchend"===e.type?a.minPixelPadding:0,h=a.toValue((c?n:r)+g);c=a.toValue((c?n+k:r+y)-g);f[a.coll].push({axis:a,min:Math.min(h,c),max:Math.max(h,c)});t=!0;}}),t&&c(a,"selection",f,function(e){a.zoom(g(e,b?{animation:!1}:null));});q(a.index)&&(this.selectionMarker=this.selectionMarker.destroy());b&&this.scaleGroups();}a&&q(a.index)&&(l(a.container,{cursor:a._cursor}),a.cancelClick=10<this.hasDragged,a.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[]);};f.prototype.findNearestKDPoint=
function(e,c,a){var b=this.chart,g=b.hoverPoint;b=b.tooltip;if(g&&b&&b.isStickyOnContact())return g;var d;e.forEach(function(b){var e=!(b.noSharedTooltip&&c)&&0>b.options.findNearestPointBy.indexOf("y");b=b.searchPoint(a,e);if((e=n(b,!0)&&b.series)&&!(e=!n(d,!0))){e=d.distX-b.distX;var g=d.dist-b.dist,f=(b.series.group&&b.series.group.zIndex)-(d.series.group&&d.series.group.zIndex);e=0<(0!==e&&c?e:0!==g?g:0!==f?f:d.series.index>b.series.index?-1:1);}e&&(d=b);});return d};f.prototype.getChartCoordinatesFromPoint=
function(e,c){var a=e.series,b=a.xAxis;a=a.yAxis;var g=z(e.clientX,e.plotX),d=e.shapeArgs;if(b&&a)return c?{chartX:b.len+b.pos-g,chartY:a.len+a.pos-e.plotY}:{chartX:g+b.pos,chartY:e.plotY+a.pos};if(d&&d.x&&d.y)return {chartX:d.x,chartY:d.y}};f.prototype.getChartPosition=function(){if(this.chartPosition)return this.chartPosition;var e=this.chart.container,c=M(e);this.chartPosition={left:c.left,top:c.top,scaleX:1,scaleY:1};var a=e.offsetWidth;e=e.offsetHeight;2<a&&2<e&&(this.chartPosition.scaleX=c.width/
a,this.chartPosition.scaleY=c.height/e);return this.chartPosition};f.prototype.getCoordinates=function(e){var c={xAxis:[],yAxis:[]};this.chart.axes.forEach(function(a){c[a.isXAxis?"xAxis":"yAxis"].push({axis:a,value:a.toValue(e[a.horiz?"chartX":"chartY"])});});return c};f.prototype.getHoverData=function(e,g,a,b,d,f){var h,m=[];b=!(!b||!e);var w=g&&!g.stickyTracking,l={chartX:f?f.chartX:void 0,chartY:f?f.chartY:void 0,shared:d};c(this,"beforeGetHoverData",l);w=w?[g]:a.filter(function(a){return l.filter?
l.filter(a):a.visible&&!(!d&&a.directTouch)&&z(a.options.enableMouseTracking,!0)&&a.stickyTracking});g=(h=b||!f?e:this.findNearestKDPoint(w,d,f))&&h.series;h&&(d&&!g.noSharedTooltip?(w=a.filter(function(a){return l.filter?l.filter(a):a.visible&&!(!d&&a.directTouch)&&z(a.options.enableMouseTracking,!0)&&!a.noSharedTooltip}),w.forEach(function(a){var b=y(a.points,function(a){return a.x===h.x&&!a.isNull});n(b)&&(a.chart.isBoosting&&(b=a.getPoint(b)),m.push(b));})):m.push(h));l={hoverPoint:h};c(this,"afterGetHoverData",
l);return {hoverPoint:l.hoverPoint,hoverSeries:g,hoverPoints:m}};f.prototype.getPointFromEvent=function(e){e=e.target;for(var c;e&&!c;)c=e.point,e=e.parentNode;return c};f.prototype.onTrackerMouseOut=function(e){e=e.relatedTarget||e.toElement;var c=this.chart.hoverSeries;this.isDirectTouch=!1;if(!(!c||!e||c.stickyTracking||this.inClass(e,"highcharts-tooltip")||this.inClass(e,"highcharts-series-"+c.index)&&this.inClass(e,"highcharts-tracker")))c.onMouseOut();};f.prototype.inClass=function(e,c){for(var a;e;){if(a=
C(e,"class")){if(-1!==a.indexOf(c))return !0;if(-1!==a.indexOf("highcharts-container"))return !1}e=e.parentNode;}};f.prototype.init=function(e,c){this.options=c;this.chart=e;this.runChartClick=c.chart.events&&!!c.chart.events.click;this.pinchDown=[];this.lastValidTouch={};x&&(e.tooltip=new x(e,c.tooltip),this.followTouchMove=z(c.tooltip.followTouchMove,!0));this.setDOMEvents();};f.prototype.normalize=function(e,c){var a=e.touches,b=a?a.length?a.item(0):z(a.changedTouches,e.changedTouches)[0]:e;c||(c=
this.getChartPosition());a=b.pageX-c.left;b=b.pageY-c.top;a/=c.scaleX;b/=c.scaleY;return g(e,{chartX:Math.round(a),chartY:Math.round(b)})};f.prototype.onContainerClick=function(e){var d=this.chart,a=d.hoverPoint;e=this.normalize(e);var b=d.plotLeft,f=d.plotTop;d.cancelClick||(a&&this.inClass(e.target,"highcharts-tracker")?(c(a.series,"click",g(e,{point:a})),d.hoverPoint&&a.firePointEvent("click",e)):(g(e,this.getCoordinates(e)),d.isInsidePlot(e.chartX-b,e.chartY-f)&&c(d,"click",e)));};f.prototype.onContainerMouseDown=
function(e){var c=1===((e.buttons||e.button)&1);e=this.normalize(e);if(d.isFirefox&&0!==e.button)this.onContainerMouseMove(e);if("undefined"===typeof e.button||c)this.zoomOption(e),c&&e.preventDefault&&e.preventDefault(),this.dragStart(e);};f.prototype.onContainerMouseLeave=function(e){var c=D[z(d.hoverChartIndex,-1)],a=this.chart.tooltip;e=this.normalize(e);c&&(e.relatedTarget||e.toElement)&&(c.pointer.reset(),c.pointer.chartPosition=void 0);a&&!a.isHidden&&this.reset();};f.prototype.onContainerMouseEnter=
function(e){delete this.chartPosition;};f.prototype.onContainerMouseMove=function(e){var c=this.chart;e=this.normalize(e);this.setHoverChartIndex();e.preventDefault||(e.returnValue=!1);("mousedown"===c.mouseIsDown||this.touchSelect(e))&&this.drag(e);c.openMenu||!this.inClass(e.target,"highcharts-tracker")&&!c.isInsidePlot(e.chartX-c.plotLeft,e.chartY-c.plotTop)||this.runPointActions(e);};f.prototype.onDocumentTouchEnd=function(e){D[d.hoverChartIndex]&&D[d.hoverChartIndex].pointer.drop(e);};f.prototype.onContainerTouchMove=
function(e){if(this.touchSelect(e))this.onContainerMouseMove(e);else this.touch(e);};f.prototype.onContainerTouchStart=function(e){if(this.touchSelect(e))this.onContainerMouseDown(e);else this.zoomOption(e),this.touch(e,!0);};f.prototype.onDocumentMouseMove=function(e){var c=this.chart,a=this.chartPosition;e=this.normalize(e,a);var b=c.tooltip;!a||b&&b.isStickyOnContact()||c.isInsidePlot(e.chartX-c.plotLeft,e.chartY-c.plotTop)||this.inClass(e.target,"highcharts-tracker")||this.reset();};f.prototype.onDocumentMouseUp=
function(e){var c=D[z(d.hoverChartIndex,-1)];c&&c.pointer.drop(e);};f.prototype.pinch=function(e){var c=this,a=c.chart,b=c.pinchDown,d=e.touches||[],f=d.length,m=c.lastValidTouch,n=c.hasZoom,l=c.selectionMarker,q={},r=1===f&&(c.inClass(e.target,"highcharts-tracker")&&a.runTrackerClick||c.runChartClick),k={};1<f&&(c.initiated=!0);n&&c.initiated&&!r&&!1!==e.cancelable&&e.preventDefault();[].map.call(d,function(a){return c.normalize(a)});"touchstart"===e.type?([].forEach.call(d,function(a,e){b[e]={chartX:a.chartX,
chartY:a.chartY};}),m.x=[b[0].chartX,b[1]&&b[1].chartX],m.y=[b[0].chartY,b[1]&&b[1].chartY],a.axes.forEach(function(b){if(b.zoomEnabled){var e=a.bounds[b.horiz?"h":"v"],c=b.minPixelPadding,g=b.toPixels(Math.min(z(b.options.min,b.dataMin),b.dataMin)),d=b.toPixels(Math.max(z(b.options.max,b.dataMax),b.dataMax)),f=Math.max(g,d);e.min=Math.min(b.pos,Math.min(g,d)-c);e.max=Math.max(b.pos+b.len,f+c);}}),c.res=!0):c.followTouchMove&&1===f?this.runPointActions(c.normalize(e)):b.length&&(l||(c.selectionMarker=
l=g({destroy:H,touch:!0},a.plotBox)),c.pinchTranslate(b,d,q,l,k,m),c.hasPinched=n,c.scaleGroups(q,k),c.res&&(c.res=!1,this.reset(!1,0)));};f.prototype.pinchTranslate=function(e,c,a,b,g,d){this.zoomHor&&this.pinchTranslateDirection(!0,e,c,a,b,g,d);this.zoomVert&&this.pinchTranslateDirection(!1,e,c,a,b,g,d);};f.prototype.pinchTranslateDirection=function(e,c,a,b,g,d,f,m){var h=this.chart,n=e?"x":"y",l=e?"X":"Y",w="chart"+l,q=e?"width":"height",r=h["plot"+(e?"Left":"Top")],p,J,F=m||1,k=h.inverted,u=h.bounds[e?
"h":"v"],y=1===c.length,I=c[0][w],t=a[0][w],z=!y&&c[1][w],O=!y&&a[1][w];a=function(){"number"===typeof O&&20<Math.abs(I-z)&&(F=m||Math.abs(t-O)/Math.abs(I-z));J=(r-t)/F+I;p=h["plot"+(e?"Width":"Height")]/F;};a();c=J;if(c<u.min){c=u.min;var A=!0;}else c+p>u.max&&(c=u.max-p,A=!0);A?(t-=.8*(t-f[n][0]),"number"===typeof O&&(O-=.8*(O-f[n][1])),a()):f[n]=[t,O];k||(d[n]=J-r,d[q]=p);d=k?1/F:F;g[q]=p;g[n]=c;b[k?e?"scaleY":"scaleX":"scale"+l]=F;b["translate"+l]=d*r+(t-d*I);};f.prototype.reset=function(e,c){var a=
this.chart,b=a.hoverSeries,g=a.hoverPoint,d=a.hoverPoints,f=a.tooltip,h=f&&f.shared?d:g;e&&h&&m(h).forEach(function(a){a.series.isCartesian&&"undefined"===typeof a.plotX&&(e=!1);});if(e)f&&h&&m(h).length&&(f.refresh(h),f.shared&&d?d.forEach(function(a){a.setState(a.state,!0);a.series.isCartesian&&(a.series.xAxis.crosshair&&a.series.xAxis.drawCrosshair(null,a),a.series.yAxis.crosshair&&a.series.yAxis.drawCrosshair(null,a));}):g&&(g.setState(g.state,!0),a.axes.forEach(function(a){a.crosshair&&g.series[a.coll]===
a&&a.drawCrosshair(null,g);})));else {if(g)g.onMouseOut();d&&d.forEach(function(a){a.setState();});if(b)b.onMouseOut();f&&f.hide(c);this.unDocMouseMove&&(this.unDocMouseMove=this.unDocMouseMove());a.axes.forEach(function(a){a.hideCrosshair();});this.hoverX=a.hoverPoints=a.hoverPoint=null;}};f.prototype.runPointActions=function(e,c){var a=this.chart,b=a.tooltip&&a.tooltip.options.enabled?a.tooltip:void 0,g=b?b.shared:!1,f=c||a.hoverPoint,h=f&&f.series||a.hoverSeries;h=this.getHoverData(f,h,a.series,(!e||
"touchmove"!==e.type)&&(!!c||h&&h.directTouch&&this.isDirectTouch),g,e);f=h.hoverPoint;var m=h.hoverPoints;c=(h=h.hoverSeries)&&h.tooltipOptions.followPointer;g=g&&h&&!h.noSharedTooltip;if(f&&(f!==a.hoverPoint||b&&b.isHidden)){(a.hoverPoints||[]).forEach(function(a){-1===m.indexOf(a)&&a.setState();});if(a.hoverSeries!==h)h.onMouseOver();this.applyInactiveState(m);(m||[]).forEach(function(a){a.setState("hover");});a.hoverPoint&&a.hoverPoint.firePointEvent("mouseOut");if(!f.series)return;a.hoverPoints=
m;a.hoverPoint=f;f.firePointEvent("mouseOver");b&&b.refresh(g?m:f,e);}else c&&b&&!b.isHidden&&(f=b.getAnchor([{}],e),b.updatePosition({plotX:f[0],plotY:f[1]}));this.unDocMouseMove||(this.unDocMouseMove=t(a.container.ownerDocument,"mousemove",function(a){var b=D[d.hoverChartIndex];if(b)b.pointer.onDocumentMouseMove(a);}));a.axes.forEach(function(b){var c=z((b.crosshair||{}).snap,!0),g;c&&((g=a.hoverPoint)&&g.series[b.coll]===b||(g=y(m,function(a){return a.series[b.coll]===b})));g||!c?b.drawCrosshair(e,
g):b.hideCrosshair();});};f.prototype.scaleGroups=function(e,c){var a=this.chart,b;a.series.forEach(function(g){b=e||g.getPlotBox();g.xAxis&&g.xAxis.zoomEnabled&&g.group&&(g.group.attr(b),g.markerGroup&&(g.markerGroup.attr(b),g.markerGroup.clip(c?a.clipRect:null)),g.dataLabelsGroup&&g.dataLabelsGroup.attr(b));});a.clipRect.attr(c||a.clipBox);};f.prototype.setDOMEvents=function(){var e=this,c=this.chart.container,a=c.ownerDocument;c.onmousedown=this.onContainerMouseDown.bind(this);c.onmousemove=this.onContainerMouseMove.bind(this);
c.onclick=this.onContainerClick.bind(this);this.unbindContainerMouseEnter=t(c,"mouseenter",this.onContainerMouseEnter.bind(this));this.unbindContainerMouseLeave=t(c,"mouseleave",this.onContainerMouseLeave.bind(this));d.unbindDocumentMouseUp||(d.unbindDocumentMouseUp=t(a,"mouseup",this.onDocumentMouseUp.bind(this)));for(var b=this.chart.renderTo.parentElement;b&&"BODY"!==b.tagName;)t(b,"scroll",function(){delete e.chartPosition;}),b=b.parentElement;d.hasTouch&&(t(c,"touchstart",this.onContainerTouchStart.bind(this),
{passive:!1}),t(c,"touchmove",this.onContainerTouchMove.bind(this),{passive:!1}),d.unbindDocumentTouchEnd||(d.unbindDocumentTouchEnd=t(a,"touchend",this.onDocumentTouchEnd.bind(this),{passive:!1})));};f.prototype.setHoverChartIndex=function(){var e=this.chart,c=d.charts[z(d.hoverChartIndex,-1)];if(c&&c!==e)c.pointer.onContainerMouseLeave({relatedTarget:!0});c&&c.mouseIsDown||(d.hoverChartIndex=e.index);};f.prototype.touch=function(e,c){var a=this.chart,b;this.setHoverChartIndex();if(1===e.touches.length)if(e=
this.normalize(e),(b=a.isInsidePlot(e.chartX-a.plotLeft,e.chartY-a.plotTop))&&!a.openMenu){c&&this.runPointActions(e);if("touchmove"===e.type){c=this.pinchDown;var g=c[0]?4<=Math.sqrt(Math.pow(c[0].chartX-e.chartX,2)+Math.pow(c[0].chartY-e.chartY,2)):!1;}z(g,!0)&&this.pinch(e);}else c&&this.reset();else 2===e.touches.length&&this.pinch(e);};f.prototype.touchSelect=function(e){return !(!this.chart.options.chart.zoomBySingleTouch||!e.touches||1!==e.touches.length)};f.prototype.zoomOption=function(e){var c=
this.chart,a=c.options.chart,b=a.zoomType||"";c=c.inverted;/touch/.test(e.type)&&(b=z(a.pinchType,b));this.zoomX=e=/x/.test(b);this.zoomY=b=/y/.test(b);this.zoomHor=e&&!c||b&&c;this.zoomVert=b&&!c||e&&c;this.hasZoom=e||b;};return f}();return d.Pointer=f});P(k,"Core/MSPointer.js",[k["Core/Globals.js"],k["Core/Pointer.js"],k["Core/Utilities.js"]],function(f,d,k){function x(){var c=[];c.item=function(c){return this[c]};E(y,function(g){c.push({pageX:g.pageX,pageY:g.pageY,target:g.target});});return c}function B(c,
g,d,l){"touch"!==c.pointerType&&c.pointerType!==c.MSPOINTER_TYPE_TOUCH||!D[f.hoverChartIndex]||(l(c),l=D[f.hoverChartIndex].pointer,l[g]({type:d,target:c.currentTarget,preventDefault:t,touches:x()}));}var G=this&&this.__extends||function(){var c=function(g,d){c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(c,g){c.__proto__=g;}||function(c,g){for(var d in g)g.hasOwnProperty(d)&&(c[d]=g[d]);};return c(g,d)};return function(g,d){function f(){this.constructor=g;}c(g,d);g.prototype=null===
d?Object.create(d):(f.prototype=d.prototype,new f);}}(),D=f.charts,H=f.doc,t=f.noop,C=k.addEvent,l=k.css,E=k.objectEach,g=k.removeEvent,y={},c=!!f.win.PointerEvent;return function(d){function f(){return null!==d&&d.apply(this,arguments)||this}G(f,d);f.prototype.batchMSEvents=function(g){g(this.chart.container,c?"pointerdown":"MSPointerDown",this.onContainerPointerDown);g(this.chart.container,c?"pointermove":"MSPointerMove",this.onContainerPointerMove);g(H,c?"pointerup":"MSPointerUp",this.onDocumentPointerUp);};
f.prototype.destroy=function(){this.batchMSEvents(g);d.prototype.destroy.call(this);};f.prototype.init=function(c,g){d.prototype.init.call(this,c,g);this.hasZoom&&l(c.container,{"-ms-touch-action":"none","touch-action":"none"});};f.prototype.onContainerPointerDown=function(c){B(c,"onContainerTouchStart","touchstart",function(c){y[c.pointerId]={pageX:c.pageX,pageY:c.pageY,target:c.currentTarget};});};f.prototype.onContainerPointerMove=function(c){B(c,"onContainerTouchMove","touchmove",function(c){y[c.pointerId]=
{pageX:c.pageX,pageY:c.pageY};y[c.pointerId].target||(y[c.pointerId].target=c.currentTarget);});};f.prototype.onDocumentPointerUp=function(c){B(c,"onDocumentTouchEnd","touchend",function(c){delete y[c.pointerId];});};f.prototype.setDOMEvents=function(){d.prototype.setDOMEvents.call(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(C);};return f}(d)});P(k,"Core/Series/Point.js",[k["Core/Renderer/HTML/AST.js"],k["Core/Animation/AnimationUtilities.js"],k["Core/Globals.js"],k["Core/Options.js"],
k["Core/Utilities.js"]],function(f,d,k,x,B){var G=d.animObject,D=x.defaultOptions,H=B.addEvent,t=B.defined,C=B.erase,l=B.extend,E=B.fireEvent,g=B.format,y=B.getNestedProperty,c=B.isArray,q=B.isFunction,n=B.isNumber,A=B.isObject,M=B.merge,z=B.objectEach,m=B.pick,r=B.syncTimeout,e=B.removeEvent,h=B.uniqueKey;d=function(){function a(){this.colorIndex=this.category=void 0;this.formatPrefix="point";this.id=void 0;this.isNull=!1;this.percentage=this.options=this.name=void 0;this.selected=!1;this.total=
this.series=void 0;this.visible=!0;this.x=void 0;}a.prototype.animateBeforeDestroy=function(){var a=this,c={x:a.startXPos,opacity:0},e,g=a.getGraphicalProps();g.singular.forEach(function(b){e="dataLabel"===b;a[b]=a[b].animate(e?{x:a[b].startXPos,y:a[b].startYPos,opacity:0}:c);});g.plural.forEach(function(b){a[b].forEach(function(b){b.element&&b.animate(l({x:a.startXPos},b.startYPos?{x:b.startXPos,y:b.startYPos}:{}));});});};a.prototype.applyOptions=function(b,c){var e=this.series,g=e.options.pointValKey||
e.pointValKey;b=a.prototype.optionsToObject.call(this,b);l(this,b);this.options=this.options?l(this.options,b):b;b.group&&delete this.group;b.dataLabels&&delete this.dataLabels;g&&(this.y=a.prototype.getNestedProperty.call(this,g));this.formatPrefix=(this.isNull=m(this.isValid&&!this.isValid(),null===this.x||!n(this.y)))?"null":"point";this.selected&&(this.state="select");"name"in this&&"undefined"===typeof c&&e.xAxis&&e.xAxis.hasNames&&(this.x=e.xAxis.nameToX(this));"undefined"===typeof this.x&&
e&&(this.x="undefined"===typeof c?e.autoIncrement(this):c);return this};a.prototype.destroy=function(){function a(){if(c.graphic||c.dataLabel||c.dataLabels)e(c),c.destroyElements();for(m in c)c[m]=null;}var c=this,g=c.series,d=g.chart;g=g.options.dataSorting;var f=d.hoverPoints,h=G(c.series.chart.renderer.globalAnimation),m;c.legendItem&&d.legend.destroyItem(c);f&&(c.setState(),C(f,c),f.length||(d.hoverPoints=null));if(c===d.hoverPoint)c.onMouseOut();g&&g.enabled?(this.animateBeforeDestroy(),r(a,h.duration)):
a();d.pointCount--;};a.prototype.destroyElements=function(a){var b=this;a=b.getGraphicalProps(a);a.singular.forEach(function(a){b[a]=b[a].destroy();});a.plural.forEach(function(a){b[a].forEach(function(a){a.element&&a.destroy();});delete b[a];});};a.prototype.firePointEvent=function(a,c,e){var b=this,g=this.series.options;(g.point.events[a]||b.options&&b.options.events&&b.options.events[a])&&b.importEvents();"click"===a&&g.allowPointSelect&&(e=function(a){b.select&&b.select(null,a.ctrlKey||a.metaKey||
a.shiftKey);});E(b,a,c,e);};a.prototype.getClassName=function(){return "highcharts-point"+(this.selected?" highcharts-point-select":"")+(this.negative?" highcharts-negative":"")+(this.isNull?" highcharts-null-point":"")+("undefined"!==typeof this.colorIndex?" highcharts-color-"+this.colorIndex:"")+(this.options.className?" "+this.options.className:"")+(this.zone&&this.zone.className?" "+this.zone.className.replace("highcharts-negative",""):"")};a.prototype.getGraphicalProps=function(a){var b=this,c=
[],e,g={singular:[],plural:[]};a=a||{graphic:1,dataLabel:1};a.graphic&&c.push("graphic","upperGraphic","shadowGroup");a.dataLabel&&c.push("dataLabel","dataLabelUpper","connector");for(e=c.length;e--;){var d=c[e];b[d]&&g.singular.push(d);}["dataLabel","connector"].forEach(function(c){var e=c+"s";a[c]&&b[e]&&g.plural.push(e);});return g};a.prototype.getLabelConfig=function(){return {x:this.category,y:this.y,color:this.color,colorIndex:this.colorIndex,key:this.name||this.category,series:this.series,point:this,
percentage:this.percentage,total:this.total||this.stackTotal}};a.prototype.getNestedProperty=function(a){if(a)return 0===a.indexOf("custom.")?y(a,this.options):this[a]};a.prototype.getZone=function(){var a=this.series,c=a.zones;a=a.zoneAxis||"y";var e=0,g;for(g=c[e];this[a]>=g.value;)g=c[++e];this.nonZonedColor||(this.nonZonedColor=this.color);this.color=g&&g.color&&!this.options.color?g.color:this.nonZonedColor;return g};a.prototype.hasNewShapeType=function(){return (this.graphic&&(this.graphic.symbolName||
this.graphic.element.nodeName))!==this.shapeType};a.prototype.init=function(a,c,e){this.series=a;this.applyOptions(c,e);this.id=t(this.id)?this.id:h();this.resolveColor();a.chart.pointCount++;E(this,"afterInit");return this};a.prototype.optionsToObject=function(b){var e={},g=this.series,d=g.options.keys,f=d||g.pointArrayMap||["y"],h=f.length,m=0,l=0;if(n(b)||null===b)e[f[0]]=b;else if(c(b))for(!d&&b.length>h&&(g=typeof b[0],"string"===g?e.name=b[0]:"number"===g&&(e.x=b[0]),m++);l<h;)d&&"undefined"===
typeof b[m]||(0<f[l].indexOf(".")?a.prototype.setNestedProperty(e,b[m],f[l]):e[f[l]]=b[m]),m++,l++;else "object"===typeof b&&(e=b,b.dataLabels&&(g._hasPointLabels=!0),b.marker&&(g._hasPointMarkers=!0));return e};a.prototype.resolveColor=function(){var a=this.series;var c=a.chart.options.chart.colorCount;var e=a.chart.styledMode;delete this.nonZonedColor;e||this.options.color||(this.color=a.color);a.options.colorByPoint?(e||(c=a.options.colors||a.chart.options.colors,this.color=this.color||c[a.colorCounter],
c=c.length),e=a.colorCounter,a.colorCounter++,a.colorCounter===c&&(a.colorCounter=0)):e=a.colorIndex;this.colorIndex=m(this.options.colorIndex,e);};a.prototype.setNestedProperty=function(a,c,e){e.split(".").reduce(function(a,b,e,g){a[b]=g.length-1===e?c:A(a[b],!0)?a[b]:{};return a[b]},a);return a};a.prototype.tooltipFormatter=function(a){var b=this.series,c=b.tooltipOptions,e=m(c.valueDecimals,""),d=c.valuePrefix||"",f=c.valueSuffix||"";b.chart.styledMode&&(a=b.chart.tooltip.styledModeFormat(a));(b.pointArrayMap||
["y"]).forEach(function(b){b="{point."+b;if(d||f)a=a.replace(RegExp(b+"}","g"),d+b+"}"+f);a=a.replace(RegExp(b+"}","g"),b+":,."+e+"f}");});return g(a,{point:this,series:this.series},b.chart)};a.prototype.update=function(a,c,e,g){function b(){d.applyOptions(a);var b=h&&d.hasDummyGraphic;b=null===d.y?!b:b;h&&b&&(d.graphic=h.destroy(),delete d.hasDummyGraphic);A(a,!0)&&(h&&h.element&&a&&a.marker&&"undefined"!==typeof a.marker.symbol&&(d.graphic=h.destroy()),a&&a.dataLabels&&d.dataLabel&&(d.dataLabel=
d.dataLabel.destroy()),d.connector&&(d.connector=d.connector.destroy()));l=d.index;f.updateParallelArrays(d,l);q.data[l]=A(q.data[l],!0)||A(a,!0)?d.options:m(a,q.data[l]);f.isDirty=f.isDirtyData=!0;!f.fixedBox&&f.hasCartesianSeries&&(n.isDirtyBox=!0);"point"===q.legendType&&(n.isDirtyLegend=!0);c&&n.redraw(e);}var d=this,f=d.series,h=d.graphic,l,n=f.chart,q=f.options;c=m(c,!0);!1===g?b():d.firePointEvent("update",{options:a},b);};a.prototype.remove=function(a,c){this.series.removePoint(this.series.data.indexOf(this),
a,c);};a.prototype.select=function(a,c){var b=this,e=b.series,g=e.chart;this.selectedStaging=a=m(a,!b.selected);b.firePointEvent(a?"select":"unselect",{accumulate:c},function(){b.selected=b.options.selected=a;e.options.data[e.data.indexOf(b)]=b.options;b.setState(a&&"select");c||g.getSelectedPoints().forEach(function(a){var c=a.series;a.selected&&a!==b&&(a.selected=a.options.selected=!1,c.options.data[c.data.indexOf(a)]=a.options,a.setState(g.hoverPoints&&c.options.inactiveOtherPoints?"inactive":""),
a.firePointEvent("unselect"));});});delete this.selectedStaging;};a.prototype.onMouseOver=function(a){var b=this.series.chart,c=b.pointer;a=a?c.normalize(a):c.getChartCoordinatesFromPoint(this,b.inverted);c.runPointActions(a,this);};a.prototype.onMouseOut=function(){var a=this.series.chart;this.firePointEvent("mouseOut");this.series.options.inactiveOtherPoints||(a.hoverPoints||[]).forEach(function(a){a.setState();});a.hoverPoints=a.hoverPoint=null;};a.prototype.importEvents=function(){if(!this.hasImportedEvents){var a=
this,c=M(a.series.options.point,a.options).events;a.events=c;z(c,function(b,c){q(b)&&H(a,c,b);});this.hasImportedEvents=!0;}};a.prototype.setState=function(a,c){var b=this.series,e=this.state,g=b.options.states[a||"normal"]||{},d=D.plotOptions[b.type].marker&&b.options.marker,h=d&&!1===d.enabled,n=d&&d.states&&d.states[a||"normal"]||{},q=!1===n.enabled,r=b.stateMarkerGraphic,w=this.marker||{},p=b.chart,k=b.halo,y,t=d&&b.markerAttribs;a=a||"";if(!(a===this.state&&!c||this.selected&&"select"!==a||!1===
g.enabled||a&&(q||h&&!1===n.enabled)||a&&w.states&&w.states[a]&&!1===w.states[a].enabled)){this.state=a;t&&(y=b.markerAttribs(this,a));if(this.graphic){e&&this.graphic.removeClass("highcharts-point-"+e);a&&this.graphic.addClass("highcharts-point-"+a);if(!p.styledMode){var u=b.pointAttribs(this,a);var z=m(p.options.chart.animation,g.animation);b.options.inactiveOtherPoints&&u.opacity&&((this.dataLabels||[]).forEach(function(a){a&&a.animate({opacity:u.opacity},z);}),this.connector&&this.connector.animate({opacity:u.opacity},
z));this.graphic.animate(u,z);}y&&this.graphic.animate(y,m(p.options.chart.animation,n.animation,d.animation));r&&r.hide();}else {if(a&&n){e=w.symbol||b.symbol;r&&r.currentSymbol!==e&&(r=r.destroy());if(y)if(r)r[c?"animate":"attr"]({x:y.x,y:y.y});else e&&(b.stateMarkerGraphic=r=p.renderer.symbol(e,y.x,y.y,y.width,y.height).add(b.markerGroup),r.currentSymbol=e);!p.styledMode&&r&&r.attr(b.pointAttribs(this,a));}r&&(r[a&&this.isInside?"show":"hide"](),r.element.point=this);}a=g.halo;g=(r=this.graphic||r)&&
r.visibility||"inherit";a&&a.size&&r&&"hidden"!==g&&!this.isCluster?(k||(b.halo=k=p.renderer.path().add(r.parentGroup)),k.show()[c?"animate":"attr"]({d:this.haloPath(a.size)}),k.attr({"class":"highcharts-halo highcharts-color-"+m(this.colorIndex,b.colorIndex)+(this.className?" "+this.className:""),visibility:g,zIndex:-1}),k.point=this,p.styledMode||k.attr(l({fill:this.color||b.color,"fill-opacity":a.opacity},f.filterUserAttributes(a.attributes||{})))):k&&k.point&&k.point.haloPath&&k.animate({d:k.point.haloPath(0)},
null,k.hide);E(this,"afterSetState");}};a.prototype.haloPath=function(a){return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX)-a,this.plotY-a,2*a,2*a)};return a}();return k.Point=d});P(k,"Core/Legend.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Globals.js"],k["Core/Series/Point.js"],k["Core/Utilities.js"]],function(f,d,k,x){var B=f.animObject,G=f.setAnimation;f=d.isFirefox;var D=d.marginNames,H=d.win,t=x.addEvent,C=x.createElement,l=x.css,E=x.defined,g=x.discardElement,
y=x.find,c=x.fireEvent,q=x.format,n=x.isNumber,A=x.merge,M=x.pick,z=x.relativeLength,m=x.stableSort,r=x.syncTimeout;x=x.wrap;var e=function(){function e(a,b){this.allItems=[];this.contentGroup=this.box=void 0;this.display=!1;this.group=void 0;this.offsetWidth=this.maxLegendWidth=this.maxItemWidth=this.legendWidth=this.legendHeight=this.lastLineHeight=this.lastItemY=this.itemY=this.itemX=this.itemMarginTop=this.itemMarginBottom=this.itemHeight=this.initialItemY=0;this.options={};this.padding=0;this.pages=
[];this.proximate=!1;this.scrollGroup=void 0;this.widthOption=this.totalItemWidth=this.titleHeight=this.symbolWidth=this.symbolHeight=0;this.chart=a;this.init(a,b);}e.prototype.init=function(a,b){this.chart=a;this.setOptions(b);b.enabled&&(this.render(),t(this.chart,"endResize",function(){this.legend.positionCheckboxes();}),this.proximate?this.unchartrender=t(this.chart,"render",function(){this.legend.proximatePositions();this.legend.positionItems();}):this.unchartrender&&this.unchartrender());};e.prototype.setOptions=
function(a){var b=M(a.padding,8);this.options=a;this.chart.styledMode||(this.itemStyle=a.itemStyle,this.itemHiddenStyle=A(this.itemStyle,a.itemHiddenStyle));this.itemMarginTop=a.itemMarginTop||0;this.itemMarginBottom=a.itemMarginBottom||0;this.padding=b;this.initialItemY=b-5;this.symbolWidth=M(a.symbolWidth,16);this.pages=[];this.proximate="proximate"===a.layout&&!this.chart.inverted;this.baseline=void 0;};e.prototype.update=function(a,b){var e=this.chart;this.setOptions(A(!0,this.options,a));this.destroy();
e.isDirtyLegend=e.isDirtyBox=!0;M(b,!0)&&e.redraw();c(this,"afterUpdate");};e.prototype.colorizeItem=function(a,b){a.legendGroup[b?"removeClass":"addClass"]("highcharts-legend-item-hidden");if(!this.chart.styledMode){var e=this.options,g=a.legendItem,d=a.legendLine,f=a.legendSymbol,h=this.itemHiddenStyle.color;e=b?e.itemStyle.color:h;var m=b?a.color||h:h,l=a.options&&a.options.marker,n={fill:m};g&&g.css({fill:e,color:e});d&&d.attr({stroke:m});f&&(l&&f.isMarker&&(n=a.pointAttribs(),b||(n.stroke=n.fill=
h)),f.attr(n));}c(this,"afterColorizeItem",{item:a,visible:b});};e.prototype.positionItems=function(){this.allItems.forEach(this.positionItem,this);this.chart.isResizing||this.positionCheckboxes();};e.prototype.positionItem=function(a){var b=this,e=this.options,g=e.symbolPadding,d=!e.rtl,f=a._legendItemPos;e=f[0];f=f[1];var h=a.checkbox,m=a.legendGroup;m&&m.element&&(g={translateX:d?e:this.legendWidth-e-2*g-4,translateY:f},d=function(){c(b,"afterPositionItem",{item:a});},E(m.translateY)?m.animate(g,void 0,
d):(m.attr(g),d()));h&&(h.x=e,h.y=f);};e.prototype.destroyItem=function(a){var b=a.checkbox;["legendItem","legendLine","legendSymbol","legendGroup"].forEach(function(b){a[b]&&(a[b]=a[b].destroy());});b&&g(a.checkbox);};e.prototype.destroy=function(){function a(a){this[a]&&(this[a]=this[a].destroy());}this.getAllItems().forEach(function(b){["legendItem","legendGroup"].forEach(a,b);});"clipRect up down pager nav box title group".split(" ").forEach(a,this);this.display=null;};e.prototype.positionCheckboxes=
function(){var a=this.group&&this.group.alignAttr,b=this.clipHeight||this.legendHeight,c=this.titleHeight;if(a){var e=a.translateY;this.allItems.forEach(function(g){var d=g.checkbox;if(d){var f=e+c+d.y+(this.scrollOffset||0)+3;l(d,{left:a.translateX+g.checkboxOffset+d.x-20+"px",top:f+"px",display:this.proximate||f>e-6&&f<e+b-6?"":"none"});}},this);}};e.prototype.renderTitle=function(){var a=this.options,b=this.padding,c=a.title,e=0;c.text&&(this.title||(this.title=this.chart.renderer.label(c.text,b-
3,b-4,null,null,null,a.useHTML,null,"legend-title").attr({zIndex:1}),this.chart.styledMode||this.title.css(c.style),this.title.add(this.group)),c.width||this.title.css({width:this.maxLegendWidth+"px"}),a=this.title.getBBox(),e=a.height,this.offsetWidth=a.width,this.contentGroup.attr({translateY:e}));this.titleHeight=e;};e.prototype.setText=function(a){var b=this.options;a.legendItem.attr({text:b.labelFormat?q(b.labelFormat,a,this.chart):b.labelFormatter.call(a)});};e.prototype.renderItem=function(a){var b=
this.chart,c=b.renderer,e=this.options,g=this.symbolWidth,d=e.symbolPadding,f=this.itemStyle,h=this.itemHiddenStyle,m="horizontal"===e.layout?M(e.itemDistance,20):0,l=!e.rtl,n=a.legendItem,q=!a.series,p=!q&&a.series.drawLegendSymbol?a.series:a,r=p.options;r=this.createCheckboxForItem&&r&&r.showCheckbox;m=g+d+m+(r?20:0);var k=e.useHTML,y=a.options.className;n||(a.legendGroup=c.g("legend-item").addClass("highcharts-"+p.type+"-series highcharts-color-"+a.colorIndex+(y?" "+y:"")+(q?" highcharts-series-"+
a.index:"")).attr({zIndex:1}).add(this.scrollGroup),a.legendItem=n=c.text("",l?g+d:-d,this.baseline||0,k),b.styledMode||n.css(A(a.visible?f:h)),n.attr({align:l?"left":"right",zIndex:2}).add(a.legendGroup),this.baseline||(this.fontMetrics=c.fontMetrics(b.styledMode?12:f.fontSize,n),this.baseline=this.fontMetrics.f+3+this.itemMarginTop,n.attr("y",this.baseline)),this.symbolHeight=e.symbolHeight||this.fontMetrics.f,p.drawLegendSymbol(this,a),this.setItemEvents&&this.setItemEvents(a,n,k));r&&!a.checkbox&&
this.createCheckboxForItem&&this.createCheckboxForItem(a);this.colorizeItem(a,a.visible);!b.styledMode&&f.width||n.css({width:(e.itemWidth||this.widthOption||b.spacingBox.width)-m+"px"});this.setText(a);b=n.getBBox();a.itemWidth=a.checkboxOffset=e.itemWidth||a.legendItemWidth||b.width+m;this.maxItemWidth=Math.max(this.maxItemWidth,a.itemWidth);this.totalItemWidth+=a.itemWidth;this.itemHeight=a.itemHeight=Math.round(a.legendItemHeight||b.height||this.symbolHeight);};e.prototype.layoutItem=function(a){var b=
this.options,c=this.padding,e="horizontal"===b.layout,g=a.itemHeight,d=this.itemMarginBottom,f=this.itemMarginTop,h=e?M(b.itemDistance,20):0,m=this.maxLegendWidth;b=b.alignColumns&&this.totalItemWidth>m?this.maxItemWidth:a.itemWidth;e&&this.itemX-c+b>m&&(this.itemX=c,this.lastLineHeight&&(this.itemY+=f+this.lastLineHeight+d),this.lastLineHeight=0);this.lastItemY=f+this.itemY+d;this.lastLineHeight=Math.max(g,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];e?this.itemX+=b:(this.itemY+=
f+g+d,this.lastLineHeight=g);this.offsetWidth=this.widthOption||Math.max((e?this.itemX-c-(a.checkbox?0:h):b)+c,this.offsetWidth);};e.prototype.getAllItems=function(){var a=[];this.chart.series.forEach(function(b){var c=b&&b.options;b&&M(c.showInLegend,E(c.linkedTo)?!1:void 0,!0)&&(a=a.concat(b.legendItems||("point"===c.legendType?b.data:b)));});c(this,"afterGetAllItems",{allItems:a});return a};e.prototype.getAlignment=function(){var a=this.options;return this.proximate?a.align.charAt(0)+"tv":a.floating?
"":a.align.charAt(0)+a.verticalAlign.charAt(0)+a.layout.charAt(0)};e.prototype.adjustMargins=function(a,b){var c=this.chart,e=this.options,g=this.getAlignment();g&&[/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/].forEach(function(d,f){d.test(g)&&!E(a[f])&&(c[D[f]]=Math.max(c[D[f]],c.legend[(f+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][f]*e[f%2?"x":"y"]+M(e.margin,12)+b[f]+(c.titleOffset[f]||0)));});};e.prototype.proximatePositions=function(){var a=this.chart,b=[],c="left"===this.options.align;
this.allItems.forEach(function(e){var g;var d=c;if(e.yAxis){e.xAxis.options.reversed&&(d=!d);e.points&&(g=y(d?e.points:e.points.slice(0).reverse(),function(a){return n(a.plotY)}));d=this.itemMarginTop+e.legendItem.getBBox().height+this.itemMarginBottom;var f=e.yAxis.top-a.plotTop;e.visible?(g=g?g.plotY:e.yAxis.height,g+=f-.3*d):g=f+e.yAxis.height;b.push({target:g,size:d,item:e});}},this);d.distribute(b,a.plotHeight);b.forEach(function(b){b.item._legendItemPos[1]=a.plotTop-a.spacing[0]+b.pos;});};e.prototype.render=
function(){var a=this.chart,b=a.renderer,e=this.group,g=this.box,d=this.options,f=this.padding;this.itemX=f;this.itemY=this.initialItemY;this.lastItemY=this.offsetWidth=0;this.widthOption=z(d.width,a.spacingBox.width-f);var h=a.spacingBox.width-2*f-d.x;-1<["rm","lm"].indexOf(this.getAlignment().substring(0,2))&&(h/=2);this.maxLegendWidth=this.widthOption||h;e||(this.group=e=b.g("legend").attr({zIndex:7}).add(),this.contentGroup=b.g().attr({zIndex:1}).add(e),this.scrollGroup=b.g().add(this.contentGroup));
this.renderTitle();var n=this.getAllItems();m(n,function(a,b){return (a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});d.reversed&&n.reverse();this.allItems=n;this.display=h=!!n.length;this.itemHeight=this.totalItemWidth=this.maxItemWidth=this.lastLineHeight=0;n.forEach(this.renderItem,this);n.forEach(this.layoutItem,this);n=(this.widthOption||this.offsetWidth)+f;var l=this.lastItemY+this.lastLineHeight+this.titleHeight;l=this.handleOverflow(l);l+=f;g||(this.box=g=b.rect().addClass("highcharts-legend-box").attr({r:d.borderRadius}).add(e),
g.isNew=!0);a.styledMode||g.attr({stroke:d.borderColor,"stroke-width":d.borderWidth||0,fill:d.backgroundColor||"none"}).shadow(d.shadow);0<n&&0<l&&(g[g.isNew?"attr":"animate"](g.crisp.call({},{x:0,y:0,width:n,height:l},g.strokeWidth())),g.isNew=!1);g[h?"show":"hide"]();a.styledMode&&"none"===e.getStyle("display")&&(n=l=0);this.legendWidth=n;this.legendHeight=l;h&&this.align();this.proximate||this.positionItems();c(this,"afterRender");};e.prototype.align=function(a){void 0===a&&(a=this.chart.spacingBox);
var b=this.chart,c=this.options,e=a.y;/(lth|ct|rth)/.test(this.getAlignment())&&0<b.titleOffset[0]?e+=b.titleOffset[0]:/(lbh|cb|rbh)/.test(this.getAlignment())&&0<b.titleOffset[2]&&(e-=b.titleOffset[2]);e!==a.y&&(a=A(a,{y:e}));this.group.align(A(c,{width:this.legendWidth,height:this.legendHeight,verticalAlign:this.proximate?"top":c.verticalAlign}),!0,a);};e.prototype.handleOverflow=function(a){var b=this,c=this.chart,e=c.renderer,g=this.options,d=g.y,f=this.padding;d=c.spacingBox.height+("top"===g.verticalAlign?
-d:d)-f;var h=g.maxHeight,m,n=this.clipRect,l=g.navigation,q=M(l.animation,!0),p=l.arrowSize||12,r=this.nav,k=this.pages,y,u=this.allItems,t=function(a){"number"===typeof a?n.attr({height:a}):n&&(b.clipRect=n.destroy(),b.contentGroup.clip());b.contentGroup.div&&(b.contentGroup.div.style.clip=a?"rect("+f+"px,9999px,"+(f+a)+"px,0)":"auto");},I=function(a){b[a]=e.circle(0,0,1.3*p).translate(p/2,p/2).add(r);c.styledMode||b[a].attr("fill","rgba(0,0,0,0.0001)");return b[a]};"horizontal"!==g.layout||"middle"===
g.verticalAlign||g.floating||(d/=2);h&&(d=Math.min(d,h));k.length=0;a>d&&!1!==l.enabled?(this.clipHeight=m=Math.max(d-20-this.titleHeight-f,0),this.currentPage=M(this.currentPage,1),this.fullHeight=a,u.forEach(function(a,b){var c=a._legendItemPos[1],e=Math.round(a.legendItem.getBBox().height),g=k.length;if(!g||c-k[g-1]>m&&(y||c)!==k[g-1])k.push(y||c),g++;a.pageIx=g-1;y&&(u[b-1].pageIx=g-1);b===u.length-1&&c+e-k[g-1]>m&&c!==y&&(k.push(c),a.pageIx=g);c!==y&&(y=c);}),n||(n=b.clipRect=e.clipRect(0,f,9999,
0),b.contentGroup.clip(n)),t(m),r||(this.nav=r=e.g().attr({zIndex:1}).add(this.group),this.up=e.symbol("triangle",0,0,p,p).add(r),I("upTracker").on("click",function(){b.scroll(-1,q);}),this.pager=e.text("",15,10).addClass("highcharts-legend-navigation"),c.styledMode||this.pager.css(l.style),this.pager.add(r),this.down=e.symbol("triangle-down",0,0,p,p).add(r),I("downTracker").on("click",function(){b.scroll(1,q);})),b.scroll(0),a=d):r&&(t(),this.nav=r.destroy(),this.scrollGroup.attr({translateY:1}),this.clipHeight=
0);return a};e.prototype.scroll=function(a,b){var e=this,g=this.chart,d=this.pages,f=d.length,h=this.currentPage+a;a=this.clipHeight;var m=this.options.navigation,n=this.pager,l=this.padding;h>f&&(h=f);0<h&&("undefined"!==typeof b&&G(b,g),this.nav.attr({translateX:l,translateY:a+this.padding+7+this.titleHeight,visibility:"visible"}),[this.up,this.upTracker].forEach(function(a){a.attr({"class":1===h?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"});}),n.attr({text:h+"/"+f}),[this.down,
this.downTracker].forEach(function(a){a.attr({x:18+this.pager.getBBox().width,"class":h===f?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"});},this),g.styledMode||(this.up.attr({fill:1===h?m.inactiveColor:m.activeColor}),this.upTracker.css({cursor:1===h?"default":"pointer"}),this.down.attr({fill:h===f?m.inactiveColor:m.activeColor}),this.downTracker.css({cursor:h===f?"default":"pointer"})),this.scrollOffset=-d[h-1]+this.initialItemY,this.scrollGroup.animate({translateY:this.scrollOffset}),
this.currentPage=h,this.positionCheckboxes(),b=B(M(b,g.renderer.globalAnimation,!0)),r(function(){c(e,"afterScroll",{currentPage:h});},b.duration));};e.prototype.setItemEvents=function(a,b,e){var g=this,d=g.chart.renderer.boxWrapper,f=a instanceof k,h="highcharts-legend-"+(f?"point":"series")+"-active",m=g.chart.styledMode;(e?[b,a.legendSymbol]:[a.legendGroup]).forEach(function(e){if(e)e.on("mouseover",function(){a.visible&&g.allItems.forEach(function(b){a!==b&&b.setState("inactive",!f);});a.setState("hover");
a.visible&&d.addClass(h);m||b.css(g.options.itemHoverStyle);}).on("mouseout",function(){g.chart.styledMode||b.css(A(a.visible?g.itemStyle:g.itemHiddenStyle));g.allItems.forEach(function(b){a!==b&&b.setState("",!f);});d.removeClass(h);a.setState();}).on("click",function(b){var e=function(){a.setVisible&&a.setVisible();g.allItems.forEach(function(b){a!==b&&b.setState(a.visible?"inactive":"",!f);});};d.removeClass(h);b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,e):c(a,"legendItemClick",
b,e);});});};e.prototype.createCheckboxForItem=function(a){a.checkbox=C("input",{type:"checkbox",className:"highcharts-legend-checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);t(a.checkbox,"click",function(b){c(a.series||a,"checkboxClick",{checked:b.target.checked,item:a},function(){a.select();});});};return e}();(/Trident\/7\.0/.test(H.navigator&&H.navigator.userAgent)||f)&&x(e.prototype,"positionItem",function(e,a){var b=this,c=function(){a._legendItemPos&&
e.call(b,a);};c();b.bubbleLegend||setTimeout(c);});d.Legend=e;return d.Legend});P(k,"Core/Series/SeriesRegistry.js",[k["Core/Globals.js"],k["Core/Options.js"],k["Core/Series/Point.js"],k["Core/Utilities.js"]],function(f,d,k,x){var B=d.defaultOptions,G=x.error,D=x.extendClass,H=x.merge,t;(function(d){function f(f,g){var l=B.plotOptions||{},c=g.defaultOptions;g.prototype.pointClass||(g.prototype.pointClass=k);g.prototype.type=f;c&&(l[f]=c);d.seriesTypes[f]=g;}d.seriesTypes={};d.getSeries=function(f,g){void 0===
g&&(g={});var l=f.options.chart;l=g.type||l.type||l.defaultSeriesType||"";var c=d.seriesTypes[l];d||G(17,!0,f,{missingModuleFor:l});l=new c;"function"===typeof l.init&&l.init(f,g);return l};d.registerSeriesType=f;d.seriesType=function(l,g,y,c,q){var n=B.plotOptions||{};g=g||"";n[l]=H(n[g],y);f(l,D(d.seriesTypes[g]||function(){},c));d.seriesTypes[l].prototype.type=l;q&&(d.seriesTypes[l].prototype.pointClass=D(k,q));return d.seriesTypes[l]};})(t||(t={}));f.seriesType=t.seriesType;f.seriesTypes=t.seriesTypes;
return t});P(k,"Core/Chart/Chart.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Axis/Axis.js"],k["Core/Globals.js"],k["Core/Legend.js"],k["Core/MSPointer.js"],k["Core/Options.js"],k["Core/Color/Palette.js"],k["Core/Pointer.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Time.js"],k["Core/Utilities.js"],k["Core/Renderer/HTML/AST.js"]],function(f,d,k,x,B,G,D,H,t,C,l,E){var g=f.animate,y=f.animObject,c=f.setAnimation,q=k.charts,n=k.doc,A=k.win,M=G.defaultOptions,z=G.time,m=t.seriesTypes,r=l.addEvent,
e=l.attr,h=l.cleanRecursively,a=l.createElement,b=l.css,w=l.defined,J=l.discardElement,O=l.erase,F=l.error,N=l.extend,R=l.find,Q=l.fireEvent,T=l.getStyle,v=l.isArray,L=l.isFunction,p=l.isNumber,K=l.isObject,S=l.isString,ba=l.merge,u=l.numberFormat,aa=l.objectEach,I=l.pick,X=l.pInt,U=l.relativeLength,ea=l.removeEvent,Y=l.splat,da=l.syncTimeout,ha=l.uniqueKey,fa=k.marginNames,ca=function(){function f(a,b,c){this.yAxis=this.xAxis=this.userOptions=this.titleOffset=this.time=this.symbolCounter=this.spacingBox=
this.spacing=this.series=this.renderTo=this.renderer=this.pointer=this.pointCount=this.plotWidth=this.plotTop=this.plotLeft=this.plotHeight=this.plotBox=this.options=this.numberFormatter=this.margin=this.legend=this.labelCollectors=this.isResizing=this.index=this.container=this.colorCounter=this.clipBox=this.chartWidth=this.chartHeight=this.bounds=this.axisOffset=this.axes=void 0;this.getArgs(a,b,c);}f.prototype.getArgs=function(a,b,c){S(a)||a.nodeName?(this.renderTo=a,this.init(b,c)):this.init(a,
b);};f.prototype.init=function(a,b){var c,e=a.series,g=a.plotOptions||{};Q(this,"init",{args:arguments},function(){a.series=null;c=ba(M,a);var d=c.chart||{};aa(c.plotOptions,function(a,b){K(a)&&(a.tooltip=g[b]&&ba(g[b].tooltip)||void 0);});c.tooltip.userOptions=a.chart&&a.chart.forExport&&a.tooltip.userOptions||a.tooltip;c.series=a.series=e;this.userOptions=a;var f=d.events;this.margin=[];this.spacing=[];this.bounds={h:{},v:{}};this.labelCollectors=[];this.callback=b;this.isResizing=0;this.options=
c;this.axes=[];this.series=[];this.time=a.time&&Object.keys(a.time).length?new C(a.time):k.time;this.numberFormatter=d.numberFormatter||u;this.styledMode=d.styledMode;this.hasCartesianSeries=d.showAxes;var h=this;h.index=q.length;q.push(h);k.chartCount++;f&&aa(f,function(a,b){L(a)&&r(h,b,a);});h.xAxis=[];h.yAxis=[];h.pointCount=h.colorCounter=h.symbolCounter=0;Q(h,"afterInit");h.firstRender();});};f.prototype.initSeries=function(a){var b=this.options.chart;b=a.type||b.type||b.defaultSeriesType;var c=
m[b];c||F(17,!0,this,{missingModuleFor:b});b=new c;"function"===typeof b.init&&b.init(this,a);return b};f.prototype.setSeriesData=function(){this.getSeriesOrderByLinks().forEach(function(a){a.points||a.data||!a.enabledDataSorting||a.setData(a.options.data,!1);});};f.prototype.getSeriesOrderByLinks=function(){return this.series.concat().sort(function(a,b){return a.linkedSeries.length||b.linkedSeries.length?b.linkedSeries.length-a.linkedSeries.length:0})};f.prototype.orderSeries=function(a){var b=this.series;
for(a=a||0;a<b.length;a++)b[a]&&(b[a].index=a,b[a].name=b[a].getName());};f.prototype.isInsidePlot=function(a,b,c){var e=c?b:a;a=c?a:b;e={x:e,y:a,isInsidePlot:0<=e&&e<=this.plotWidth&&0<=a&&a<=this.plotHeight};Q(this,"afterIsInsidePlot",e);return e.isInsidePlot};f.prototype.redraw=function(a){Q(this,"beforeRedraw");var b=this.hasCartesianSeries?this.axes:this.colorAxis||[],e=this.series,g=this.pointer,d=this.legend,f=this.userOptions.legend,h=this.isDirtyLegend,m=this.isDirtyBox,u=this.renderer,l=
u.isHidden(),n=[];this.setResponsive&&this.setResponsive(!1);c(this.hasRendered?a:!1,this);l&&this.temporaryDisplay();this.layOutTitles();for(a=e.length;a--;){var p=e[a];if(p.options.stacking||p.options.centerInCategory){var q=!0;if(p.isDirty){var r=!0;break}}}if(r)for(a=e.length;a--;)p=e[a],p.options.stacking&&(p.isDirty=!0);e.forEach(function(a){a.isDirty&&("point"===a.options.legendType?("function"===typeof a.updateTotals&&a.updateTotals(),h=!0):f&&(f.labelFormatter||f.labelFormat)&&(h=!0));a.isDirtyData&&
Q(a,"updatedData");});h&&d&&d.options.enabled&&(d.render(),this.isDirtyLegend=!1);q&&this.getStacks();b.forEach(function(a){a.updateNames();a.setScale();});this.getMargins();b.forEach(function(a){a.isDirty&&(m=!0);});b.forEach(function(a){var b=a.min+","+a.max;a.extKey!==b&&(a.extKey=b,n.push(function(){Q(a,"afterSetExtremes",N(a.eventArgs,a.getExtremes()));delete a.eventArgs;}));(m||q)&&a.redraw();});m&&this.drawChartBox();Q(this,"predraw");e.forEach(function(a){(m||a.isDirty)&&a.visible&&a.redraw();
a.isDirtyData=!1;});g&&g.reset(!0);u.draw();Q(this,"redraw");Q(this,"render");l&&this.temporaryDisplay(!0);n.forEach(function(a){a.call();});};f.prototype.get=function(a){function b(b){return b.id===a||b.options&&b.options.id===a}var c=this.series,e;var g=R(this.axes,b)||R(this.series,b);for(e=0;!g&&e<c.length;e++)g=R(c[e].points||[],b);return g};f.prototype.getAxes=function(){var a=this,b=this.options,e=b.xAxis=Y(b.xAxis||{});b=b.yAxis=Y(b.yAxis||{});Q(this,"getAxes");e.forEach(function(a,b){a.index=
b;a.isX=!0;});b.forEach(function(a,b){a.index=b;});e.concat(b).forEach(function(b){new d(a,b);});Q(this,"afterGetAxes");};f.prototype.getSelectedPoints=function(){var a=[];this.series.forEach(function(b){a=a.concat(b.getPointsCollection().filter(function(a){return I(a.selectedStaging,a.selected)}));});return a};f.prototype.getSelectedSeries=function(){return this.series.filter(function(a){return a.selected})};f.prototype.setTitle=function(a,b,e){this.applyDescription("title",a);this.applyDescription("subtitle",
b);this.applyDescription("caption",void 0);this.layOutTitles(e);};f.prototype.applyDescription=function(a,b){var e=this,c="title"===a?{color:D.neutralColor80,fontSize:this.options.isStock?"16px":"18px"}:{color:D.neutralColor60};c=this.options[a]=ba(!this.styledMode&&{style:c},this.options[a],b);var g=this[a];g&&b&&(this[a]=g=g.destroy());c&&!g&&(g=this.renderer.text(c.text,0,0,c.useHTML).attr({align:c.align,"class":"highcharts-"+a,zIndex:c.zIndex||4}).add(),g.update=function(b){e[{title:"setTitle",
subtitle:"setSubtitle",caption:"setCaption"}[a]](b);},this.styledMode||g.css(c.style),this[a]=g);};f.prototype.layOutTitles=function(a){var b=[0,0,0],c=this.renderer,e=this.spacingBox;["title","subtitle","caption"].forEach(function(a){var g=this[a],d=this.options[a],f=d.verticalAlign||"top";a="title"===a?-3:"top"===f?b[0]+2:0;if(g){if(!this.styledMode)var h=d.style.fontSize;h=c.fontMetrics(h,g).b;g.css({width:(d.width||e.width+(d.widthAdjust||0))+"px"});var m=Math.round(g.getBBox(d.useHTML).height);
g.align(N({y:"bottom"===f?h:a+h,height:m},d),!1,"spacingBox");d.floating||("top"===f?b[0]=Math.ceil(b[0]+m):"bottom"===f&&(b[2]=Math.ceil(b[2]+m)));}},this);b[0]&&"top"===(this.options.title.verticalAlign||"top")&&(b[0]+=this.options.title.margin);b[2]&&"bottom"===this.options.caption.verticalAlign&&(b[2]+=this.options.caption.margin);var g=!this.titleOffset||this.titleOffset.join(",")!==b.join(",");this.titleOffset=b;Q(this,"afterLayOutTitles");!this.isDirtyBox&&g&&(this.isDirtyBox=this.isDirtyLegend=
g,this.hasRendered&&I(a,!0)&&this.isDirtyBox&&this.redraw());};f.prototype.getChartSize=function(){var a=this.options.chart,b=a.width;a=a.height;var c=this.renderTo;w(b)||(this.containerWidth=T(c,"width"));w(a)||(this.containerHeight=T(c,"height"));this.chartWidth=Math.max(0,b||this.containerWidth||600);this.chartHeight=Math.max(0,U(a,this.chartWidth)||(1<this.containerHeight?this.containerHeight:400));};f.prototype.temporaryDisplay=function(a){var c=this.renderTo;if(a)for(;c&&c.style;)c.hcOrigStyle&&
(b(c,c.hcOrigStyle),delete c.hcOrigStyle),c.hcOrigDetached&&(n.body.removeChild(c),c.hcOrigDetached=!1),c=c.parentNode;else for(;c&&c.style;){n.body.contains(c)||c.parentNode||(c.hcOrigDetached=!0,n.body.appendChild(c));if("none"===T(c,"display",!1)||c.hcOricDetached)c.hcOrigStyle={display:c.style.display,height:c.style.height,overflow:c.style.overflow},a={display:"block",overflow:"hidden"},c!==this.renderTo&&(a.height=0),b(c,a),c.offsetWidth||c.style.setProperty("display","block","important");c=
c.parentNode;if(c===n.body)break}};f.prototype.setClassName=function(a){this.container.className="highcharts-container "+(a||"");};f.prototype.getContainer=function(){var g=this.options,d=g.chart;var f=this.renderTo;var h=ha(),m,u;f||(this.renderTo=f=d.renderTo);S(f)&&(this.renderTo=f=n.getElementById(f));f||F(13,!0,this);var l=X(e(f,"data-highcharts-chart"));p(l)&&q[l]&&q[l].hasRendered&&q[l].destroy();e(f,"data-highcharts-chart",this.index);f.innerHTML="";d.skipClone||f.offsetWidth||this.temporaryDisplay();
this.getChartSize();l=this.chartWidth;var r=this.chartHeight;b(f,{overflow:"hidden"});this.styledMode||(m=N({position:"relative",overflow:"hidden",width:l+"px",height:r+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)",userSelect:"none"},d.style));this.container=f=a("div",{id:h},m,f);this._cursor=f.style.cursor;this.renderer=new (k[d.renderer]||k.Renderer)(f,l,r,null,d.forExport,g.exporting&&g.exporting.allowHTML,this.styledMode);c(void 0,this);this.setClassName(d.className);
if(this.styledMode)for(u in g.defs)this.renderer.definition(g.defs[u]);else this.renderer.setStyle(d.style);this.renderer.chartIndex=this.index;Q(this,"afterGetContainer");};f.prototype.getMargins=function(a){var b=this.spacing,c=this.margin,e=this.titleOffset;this.resetMargins();e[0]&&!w(c[0])&&(this.plotTop=Math.max(this.plotTop,e[0]+b[0]));e[2]&&!w(c[2])&&(this.marginBottom=Math.max(this.marginBottom,e[2]+b[2]));this.legend&&this.legend.display&&this.legend.adjustMargins(c,b);Q(this,"getMargins");
a||this.getAxisMargins();};f.prototype.getAxisMargins=function(){var a=this,b=a.axisOffset=[0,0,0,0],c=a.colorAxis,e=a.margin,g=function(a){a.forEach(function(a){a.visible&&a.getOffset();});};a.hasCartesianSeries?g(a.axes):c&&c.length&&g(c);fa.forEach(function(c,g){w(e[g])||(a[c]+=b[g]);});a.setChartSize();};f.prototype.reflow=function(a){var b=this,c=b.options.chart,e=b.renderTo,g=w(c.width)&&w(c.height),d=c.width||T(e,"width");c=c.height||T(e,"height");e=a?a.target:A;delete b.pointer.chartPosition;if(!g&&
!b.isPrinting&&d&&c&&(e===A||e===n)){if(d!==b.containerWidth||c!==b.containerHeight)l.clearTimeout(b.reflowTimeout),b.reflowTimeout=da(function(){b.container&&b.setSize(void 0,void 0,!1);},a?100:0);b.containerWidth=d;b.containerHeight=c;}};f.prototype.setReflow=function(a){var b=this;!1===a||this.unbindReflow?!1===a&&this.unbindReflow&&(this.unbindReflow=this.unbindReflow()):(this.unbindReflow=r(A,"resize",function(a){b.options&&b.reflow(a);}),r(this,"destroy",this.unbindReflow));};f.prototype.setSize=
function(a,e,d){var f=this,h=f.renderer;f.isResizing+=1;c(d,f);d=h.globalAnimation;f.oldChartHeight=f.chartHeight;f.oldChartWidth=f.chartWidth;"undefined"!==typeof a&&(f.options.chart.width=a);"undefined"!==typeof e&&(f.options.chart.height=e);f.getChartSize();f.styledMode||(d?g:b)(f.container,{width:f.chartWidth+"px",height:f.chartHeight+"px"},d);f.setChartSize(!0);h.setSize(f.chartWidth,f.chartHeight,d);f.axes.forEach(function(a){a.isDirty=!0;a.setScale();});f.isDirtyLegend=!0;f.isDirtyBox=!0;f.layOutTitles();
f.getMargins();f.redraw(d);f.oldChartHeight=null;Q(f,"resize");da(function(){f&&Q(f,"endResize",null,function(){--f.isResizing;});},y(d).duration);};f.prototype.setChartSize=function(a){var b=this.inverted,c=this.renderer,e=this.chartWidth,g=this.chartHeight,d=this.options.chart,f=this.spacing,h=this.clipOffset,m,u,l,n;this.plotLeft=m=Math.round(this.plotLeft);this.plotTop=u=Math.round(this.plotTop);this.plotWidth=l=Math.max(0,Math.round(e-m-this.marginRight));this.plotHeight=n=Math.max(0,Math.round(g-
u-this.marginBottom));this.plotSizeX=b?n:l;this.plotSizeY=b?l:n;this.plotBorderWidth=d.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:f[3],y:f[0],width:e-f[3]-f[1],height:g-f[0]-f[2]};this.plotBox=c.plotBox={x:m,y:u,width:l,height:n};e=2*Math.floor(this.plotBorderWidth/2);b=Math.ceil(Math.max(e,h[3])/2);c=Math.ceil(Math.max(e,h[0])/2);this.clipBox={x:b,y:c,width:Math.floor(this.plotSizeX-Math.max(e,h[1])/2-b),height:Math.max(0,Math.floor(this.plotSizeY-Math.max(e,h[2])/2-c))};a||this.axes.forEach(function(a){a.setAxisSize();
a.setAxisTranslation();});Q(this,"afterSetChartSize",{skipAxes:a});};f.prototype.resetMargins=function(){Q(this,"resetMargins");var a=this,b=a.options.chart;["margin","spacing"].forEach(function(c){var e=b[c],g=K(e)?e:[e,e,e,e];["Top","Right","Bottom","Left"].forEach(function(e,d){a[c][d]=I(b[c+e],g[d]);});});fa.forEach(function(b,c){a[b]=I(a.margin[c],a.spacing[c]);});a.axisOffset=[0,0,0,0];a.clipOffset=[0,0,0,0];};f.prototype.drawChartBox=function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,
e=this.chartHeight,g=this.chartBackground,d=this.plotBackground,f=this.plotBorder,h=this.styledMode,m=this.plotBGImage,u=a.backgroundColor,l=a.plotBackgroundColor,n=a.plotBackgroundImage,p,q=this.plotLeft,r=this.plotTop,k=this.plotWidth,I=this.plotHeight,w=this.plotBox,y=this.clipRect,t=this.clipBox,v="animate";g||(this.chartBackground=g=b.rect().addClass("highcharts-background").add(),v="attr");if(h)var z=p=g.strokeWidth();else {z=a.borderWidth||0;p=z+(a.shadow?8:0);u={fill:u||"none"};if(z||g["stroke-width"])u.stroke=
a.borderColor,u["stroke-width"]=z;g.attr(u).shadow(a.shadow);}g[v]({x:p/2,y:p/2,width:c-p-z%2,height:e-p-z%2,r:a.borderRadius});v="animate";d||(v="attr",this.plotBackground=d=b.rect().addClass("highcharts-plot-background").add());d[v](w);h||(d.attr({fill:l||"none"}).shadow(a.plotShadow),n&&(m?(n!==m.attr("href")&&m.attr("href",n),m.animate(w)):this.plotBGImage=b.image(n,q,r,k,I).add()));y?y.animate({width:t.width,height:t.height}):this.clipRect=b.clipRect(t);v="animate";f||(v="attr",this.plotBorder=
f=b.rect().addClass("highcharts-plot-border").attr({zIndex:1}).add());h||f.attr({stroke:a.plotBorderColor,"stroke-width":a.plotBorderWidth||0,fill:"none"});f[v](f.crisp({x:q,y:r,width:k,height:I},-f.strokeWidth()));this.isDirtyBox=!1;Q(this,"afterDrawChartBox");};f.prototype.propFromSeries=function(){var a=this,b=a.options.chart,c,e=a.options.series,g,d;["inverted","angular","polar"].forEach(function(f){c=m[b.type||b.defaultSeriesType];d=b[f]||c&&c.prototype[f];for(g=e&&e.length;!d&&g--;)(c=m[e[g].type])&&
c.prototype[f]&&(d=!0);a[f]=d;});};f.prototype.linkSeries=function(){var a=this,b=a.series;b.forEach(function(a){a.linkedSeries.length=0;});b.forEach(function(b){var c=b.options.linkedTo;S(c)&&(c=":previous"===c?a.series[b.index-1]:a.get(c))&&c.linkedParent!==b&&(c.linkedSeries.push(b),b.linkedParent=c,c.enabledDataSorting&&b.setDataSortingOptions(),b.visible=I(b.options.visible,c.options.visible,b.visible));});Q(this,"afterLinkSeries");};f.prototype.renderSeries=function(){this.series.forEach(function(a){a.translate();
a.render();});};f.prototype.renderLabels=function(){var a=this,b=a.options.labels;b.items&&b.items.forEach(function(c){var e=N(b.style,c.style),g=X(e.left)+a.plotLeft,d=X(e.top)+a.plotTop+12;delete e.left;delete e.top;a.renderer.text(c.html,g,d).attr({zIndex:2}).css(e).add();});};f.prototype.render=function(){var a=this.axes,b=this.colorAxis,c=this.renderer,e=this.options,g=0,d=function(a){a.forEach(function(a){a.visible&&a.render();});};this.setTitle();this.legend=new x(this,e.legend);this.getStacks&&
this.getStacks();this.getMargins(!0);this.setChartSize();e=this.plotWidth;a.some(function(a){if(a.horiz&&a.visible&&a.options.labels.enabled&&a.series.length)return g=21,!0});var f=this.plotHeight=Math.max(this.plotHeight-g,0);a.forEach(function(a){a.setScale();});this.getAxisMargins();var h=1.1<e/this.plotWidth;var m=1.05<f/this.plotHeight;if(h||m)a.forEach(function(a){(a.horiz&&h||!a.horiz&&m)&&a.setTickInterval(!0);}),this.getMargins();this.drawChartBox();this.hasCartesianSeries?d(a):b&&b.length&&
d(b);this.seriesGroup||(this.seriesGroup=c.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.addCredits();this.setResponsive&&this.setResponsive();this.hasRendered=!0;};f.prototype.addCredits=function(a){var b=this,c=ba(!0,this.options.credits,a);c.enabled&&!this.credits&&(this.credits=this.renderer.text(c.text+(this.mapCredits||""),0,0).addClass("highcharts-credits").on("click",function(){c.href&&(A.location.href=c.href);}).attr({align:c.position.align,zIndex:8}),
b.styledMode||this.credits.css(c.style),this.credits.add().align(c.position),this.credits.update=function(a){b.credits=b.credits.destroy();b.addCredits(a);});};f.prototype.destroy=function(){var a=this,b=a.axes,c=a.series,e=a.container,g,d=e&&e.parentNode;Q(a,"destroy");a.renderer.forExport?O(q,a):q[a.index]=void 0;k.chartCount--;a.renderTo.removeAttribute("data-highcharts-chart");ea(a);for(g=b.length;g--;)b[g]=b[g].destroy();this.scroller&&this.scroller.destroy&&this.scroller.destroy();for(g=c.length;g--;)c[g]=
c[g].destroy();"title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" ").forEach(function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy());});e&&(e.innerHTML="",ea(e),d&&J(e));aa(a,function(b,c){delete a[c];});};f.prototype.firstRender=function(){var a=this,b=a.options;if(!a.isReadyToRender||a.isReadyToRender()){a.getContainer();a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();
(v(b.series)?b.series:[]).forEach(function(b){a.initSeries(b);});a.linkSeries();a.setSeriesData();Q(a,"beforeRender");H&&(a.pointer=k.hasTouch||!A.PointerEvent&&!A.MSPointerEvent?new H(a,b):new B(a,b));a.render();a.pointer.getChartPosition();if(!a.renderer.imgCount&&!a.hasLoaded)a.onload();a.temporaryDisplay(!0);}};f.prototype.onload=function(){this.callbacks.concat([this.callback]).forEach(function(a){a&&"undefined"!==typeof this.index&&a.apply(this,[this]);},this);Q(this,"load");Q(this,"render");w(this.index)&&
this.setReflow(this.options.chart.reflow);this.hasLoaded=!0;};f.prototype.addSeries=function(a,b,c){var e,g=this;a&&(b=I(b,!0),Q(g,"addSeries",{options:a},function(){e=g.initSeries(a);g.isDirtyLegend=!0;g.linkSeries();e.enabledDataSorting&&e.setData(a.data,!1);Q(g,"afterAddSeries",{series:e});b&&g.redraw(c);}));return e};f.prototype.addAxis=function(a,b,c,e){return this.createAxis(b?"xAxis":"yAxis",{axis:a,redraw:c,animation:e})};f.prototype.addColorAxis=function(a,b,c){return this.createAxis("colorAxis",
{axis:a,redraw:b,animation:c})};f.prototype.createAxis=function(a,b){var c=this.options,e="colorAxis"===a,g=b.redraw,f=b.animation;b=ba(b.axis,{index:this[a].length,isX:"xAxis"===a});var h=e?new k.ColorAxis(this,b):new d(this,b);c[a]=Y(c[a]||{});c[a].push(b);e&&(this.isDirtyLegend=!0,this.axes.forEach(function(a){a.series=[];}),this.series.forEach(function(a){a.bindAxes();a.isDirtyData=!0;}));I(g,!0)&&this.redraw(f);return h};f.prototype.showLoading=function(c){var e=this,d=e.options,f=e.loadingDiv,
h=e.loadingSpan,m=d.loading,u=function(){f&&b(f,{left:e.plotLeft+"px",top:e.plotTop+"px",width:e.plotWidth+"px",height:e.plotHeight+"px"});};f||(e.loadingDiv=f=a("div",{className:"highcharts-loading highcharts-loading-hidden"},null,e.container));h||(e.loadingSpan=h=a("span",{className:"highcharts-loading-inner"},null,f),r(e,"redraw",u));f.className="highcharts-loading";E.setElementHTML(h,I(c,d.lang.loading,""));e.styledMode||(b(f,N(m.style,{zIndex:10})),b(h,m.labelStyle),e.loadingShown||(b(f,{opacity:0,
display:""}),g(f,{opacity:m.style.opacity||.5},{duration:m.showDuration||0})));e.loadingShown=!0;u();};f.prototype.hideLoading=function(){var a=this.options,c=this.loadingDiv;c&&(c.className="highcharts-loading highcharts-loading-hidden",this.styledMode||g(c,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){b(c,{display:"none"});}}));this.loadingShown=!1;};f.prototype.update=function(a,b,c,e){var g=this,d={credits:"addCredits",title:"setTitle",subtitle:"setSubtitle",caption:"setCaption"},
f,m,u,l=a.isResponsiveOptions,n=[];Q(g,"update",{options:a});l||g.setResponsive(!1,!0);a=h(a,g.options);g.userOptions=ba(g.userOptions,a);if(f=a.chart){ba(!0,g.options.chart,f);"className"in f&&g.setClassName(f.className);"reflow"in f&&g.setReflow(f.reflow);if("inverted"in f||"polar"in f||"type"in f){g.propFromSeries();var q=!0;}"alignTicks"in f&&(q=!0);aa(f,function(a,b){-1!==g.propsRequireUpdateSeries.indexOf("chart."+b)&&(m=!0);-1!==g.propsRequireDirtyBox.indexOf(b)&&(g.isDirtyBox=!0);-1!==g.propsRequireReflow.indexOf(b)&&
(l?g.isDirtyBox=!0:u=!0);});!g.styledMode&&"style"in f&&g.renderer.setStyle(f.style);}!g.styledMode&&a.colors&&(this.options.colors=a.colors);a.time&&(this.time===z&&(this.time=new C(a.time)),ba(!0,g.options.time,a.time));aa(a,function(b,c){if(g[c]&&"function"===typeof g[c].update)g[c].update(b,!1);else if("function"===typeof g[d[c]])g[d[c]](b);else "color"!==c&&-1===g.collectionsWithUpdate.indexOf(c)&&ba(!0,g.options[c],a[c]);"chart"!==c&&-1!==g.propsRequireUpdateSeries.indexOf(c)&&(m=!0);});this.collectionsWithUpdate.forEach(function(b){if(a[b]){if("series"===
b){var e=[];g[b].forEach(function(a,b){a.options.isInternal||e.push(I(a.options.index,b));});}Y(a[b]).forEach(function(a,d){var f=w(a.id),h;f&&(h=g.get(a.id));!h&&g[b]&&(h=g[b][e?e[d]:d])&&f&&w(h.options.id)&&(h=void 0);h&&h.coll===b&&(h.update(a,!1),c&&(h.touched=!0));!h&&c&&g.collectionsWithInit[b]&&(g.collectionsWithInit[b][0].apply(g,[a].concat(g.collectionsWithInit[b][1]||[]).concat([!1])).touched=!0);});c&&g[b].forEach(function(a){a.touched||a.options.isInternal?delete a.touched:n.push(a);});}});
n.forEach(function(a){a.chart&&a.remove(!1);});q&&g.axes.forEach(function(a){a.update({},!1);});m&&g.getSeriesOrderByLinks().forEach(function(a){a.chart&&a.update({},!1);},this);q=f&&f.width;f=f&&f.height;S(f)&&(f=U(f,q||g.chartWidth));u||p(q)&&q!==g.chartWidth||p(f)&&f!==g.chartHeight?g.setSize(q,f,e):I(b,!0)&&g.redraw(e);Q(g,"afterUpdate",{options:a,redraw:b,animation:e});};f.prototype.setSubtitle=function(a,b){this.applyDescription("subtitle",a);this.layOutTitles(b);};f.prototype.setCaption=function(a,
b){this.applyDescription("caption",a);this.layOutTitles(b);};f.prototype.showResetZoom=function(){function a(){b.zoomOut();}var b=this,c=M.lang,e=b.options.chart.resetZoomButton,g=e.theme,d=g.states,f="chart"===e.relativeTo||"spaceBox"===e.relativeTo?null:this.scrollablePlotBox||"plotBox";Q(this,"beforeShowResetZoom",null,function(){b.resetZoomButton=b.renderer.button(c.resetZoom,null,null,a,g,d&&d.hover).attr({align:e.position.align,title:c.resetZoomTitle}).addClass("highcharts-reset-zoom").add().align(e.position,
!1,f);});Q(this,"afterShowResetZoom");};f.prototype.zoomOut=function(){Q(this,"selection",{resetSelection:!0},this.zoom);};f.prototype.zoom=function(a){var b=this,c,e=b.pointer,g=!1,d=b.inverted?e.mouseDownX:e.mouseDownY;!a||a.resetSelection?(b.axes.forEach(function(a){c=a.zoom();}),e.initiated=!1):a.xAxis.concat(a.yAxis).forEach(function(a){var f=a.axis,h=b.inverted?f.left:f.top,m=b.inverted?h+f.width:h+f.height,u=f.isXAxis,l=!1;if(!u&&d>=h&&d<=m||u||!w(d))l=!0;e[u?"zoomX":"zoomY"]&&l&&(c=f.zoom(a.min,
a.max),f.displayBtn&&(g=!0));});var f=b.resetZoomButton;g&&!f?b.showResetZoom():!g&&K(f)&&(b.resetZoomButton=f.destroy());c&&b.redraw(I(b.options.chart.animation,a&&a.animation,100>b.pointCount));};f.prototype.pan=function(a,c){var e=this,g=e.hoverPoints,d=e.options.chart,f=e.options.mapNavigation&&e.options.mapNavigation.enabled,h;c="object"===typeof c?c:{enabled:c,type:"x"};d&&d.panning&&(d.panning=c);var m=c.type;Q(this,"pan",{originalEvent:a},function(){g&&g.forEach(function(a){a.setState();});var c=
[1];"xy"===m?c=[1,0]:"y"===m&&(c=[0]);c.forEach(function(b){var c=e[b?"xAxis":"yAxis"][0],g=c.horiz,d=a[g?"chartX":"chartY"];g=g?"mouseDownX":"mouseDownY";var u=e[g],l=(c.pointRange||0)/2,n=c.reversed&&!e.inverted||!c.reversed&&e.inverted?-1:1,q=c.getExtremes(),r=c.toValue(u-d,!0)+l*n;n=c.toValue(u+c.len-d,!0)-l*n;var k=n<r;u=k?n:r;r=k?r:n;n=c.hasVerticalPanning();var w=c.panningState;!n||b||w&&!w.isDirty||c.series.forEach(function(a){var b=a.getProcessedData(!0);b=a.getExtremes(b.yData,!0);w||(w=
{startMin:Number.MAX_VALUE,startMax:-Number.MAX_VALUE});p(b.dataMin)&&p(b.dataMax)&&(w.startMin=Math.min(I(a.options.threshold,Infinity),b.dataMin,w.startMin),w.startMax=Math.max(I(a.options.threshold,-Infinity),b.dataMax,w.startMax));});b=Math.min(I(null===w||void 0===w?void 0:w.startMin,q.dataMin),l?q.min:c.toValue(c.toPixels(q.min)-c.minPixelPadding));l=Math.max(I(null===w||void 0===w?void 0:w.startMax,q.dataMax),l?q.max:c.toValue(c.toPixels(q.max)+c.minPixelPadding));c.panningState=w;c.isOrdinal||
(n=b-u,0<n&&(r+=n,u=b),n=r-l,0<n&&(r=l,u-=n),c.series.length&&u!==q.min&&r!==q.max&&u>=b&&r<=l&&(c.setExtremes(u,r,!1,!1,{trigger:"pan"}),e.resetZoomButton||f||u===b||r===l||!m.match("y")||(e.showResetZoom(),c.displayBtn=!1),h=!0),e[g]=d);});h&&e.redraw(!1);b(e.container,{cursor:"move"});});};return f}();N(ca.prototype,{callbacks:[],collectionsWithInit:{xAxis:[ca.prototype.addAxis,[!0]],yAxis:[ca.prototype.addAxis,[!1]],series:[ca.prototype.addSeries]},collectionsWithUpdate:["xAxis","yAxis","zAxis",
"series"],propsRequireDirtyBox:"backgroundColor borderColor borderWidth borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),propsRequireReflow:"margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft".split(" "),propsRequireUpdateSeries:"chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" ")});k.chart=function(a,b,c){return new ca(a,
b,c)};k.Chart=ca;return ca});P(k,"Mixins/LegendSymbol.js",[k["Core/Globals.js"],k["Core/Utilities.js"]],function(f,d){var k=d.merge,x=d.pick;return f.LegendSymbolMixin={drawRectangle:function(d,f){var k=d.symbolHeight,H=d.options.squareSymbol;f.legendSymbol=this.chart.renderer.rect(H?(d.symbolWidth-k)/2:0,d.baseline-k+1,H?k:d.symbolWidth,k,x(d.options.symbolRadius,k/2)).addClass("highcharts-point").attr({zIndex:3}).add(f.legendGroup);},drawLineMarker:function(d){var f=this.options,D=f.marker,H=
d.symbolWidth,t=d.symbolHeight,C=t/2,l=this.chart.renderer,E=this.legendGroup;d=d.baseline-Math.round(.3*d.fontMetrics.b);var g={};this.chart.styledMode||(g={"stroke-width":f.lineWidth||0},f.dashStyle&&(g.dashstyle=f.dashStyle));this.legendLine=l.path([["M",0,d],["L",H,d]]).addClass("highcharts-graph").attr(g).add(E);D&&!1!==D.enabled&&H&&(f=Math.min(x(D.radius,C),C),0===this.symbol.indexOf("url")&&(D=k(D,{width:t,height:t}),f=0),this.legendSymbol=D=l.symbol(this.symbol,H/2-f,d-f,2*f,2*f,D).addClass("highcharts-point").add(E),
D.isMarker=!0);}}});P(k,"Core/Series/Series.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Globals.js"],k["Mixins/LegendSymbol.js"],k["Core/Options.js"],k["Core/Color/Palette.js"],k["Core/Series/Point.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Renderer/SVG/SVGElement.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G,D,H,t){var C=f.animObject,l=f.setAnimation,E=d.hasTouch,g=d.svg,y=d.win,c=x.defaultOptions,q=D.seriesTypes,n=t.addEvent,A=t.arrayMax,M=t.arrayMin,z=t.clamp,m=t.cleanRecursively,
r=t.correctFloat,e=t.defined,h=t.erase,a=t.error,b=t.extend,w=t.find,J=t.fireEvent,O=t.getNestedProperty,F=t.isArray,N=t.isFunction,R=t.isNumber,Q=t.isString,T=t.merge,v=t.objectEach,L=t.pick,p=t.removeEvent,K=t.splat,S=t.syncTimeout;f=function(){function d(){this.zones=this.yAxis=this.xAxis=this.userOptions=this.tooltipOptions=this.processedYData=this.processedXData=this.points=this.options=this.linkedSeries=this.index=this.eventsToUnbind=this.eventOptions=this.data=this.chart=this._i=void 0;}d.prototype.init=
function(a,c){J(this,"init",{options:c});var e=this,g=a.series,d;this.eventOptions=this.eventOptions||{};this.eventsToUnbind=[];e.chart=a;e.options=c=e.setOptions(c);e.linkedSeries=[];e.bindAxes();b(e,{name:c.name,state:"",visible:!1!==c.visible,selected:!0===c.selected});var f=c.events;v(f,function(a,b){N(a)&&e.eventOptions[b]!==a&&(N(e.eventOptions[b])&&p(e,b,e.eventOptions[b]),e.eventOptions[b]=a,n(e,b,a));});if(f&&f.click||c.point&&c.point.events&&c.point.events.click||c.allowPointSelect)a.runTrackerClick=
!0;e.getColor();e.getSymbol();e.parallelArrays.forEach(function(a){e[a+"Data"]||(e[a+"Data"]=[]);});e.isCartesian&&(a.hasCartesianSeries=!0);g.length&&(d=g[g.length-1]);e._i=L(d&&d._i,-1)+1;e.opacity=e.options.opacity;a.orderSeries(this.insert(g));c.dataSorting&&c.dataSorting.enabled?e.setDataSortingOptions():e.points||e.data||e.setData(c.data,!1);J(this,"afterInit");};d.prototype.is=function(a){return q[a]&&this instanceof q[a]};d.prototype.insert=function(a){var b=this.options.index,c;if(R(b)){for(c=
a.length;c--;)if(b>=L(a[c].options.index,a[c]._i)){a.splice(c+1,0,this);break}-1===c&&a.unshift(this);c+=1;}else a.push(this);return L(c,a.length-1)};d.prototype.bindAxes=function(){var b=this,c=b.options,e=b.chart,g;J(this,"bindAxes",null,function(){(b.axisTypes||[]).forEach(function(d){e[d].forEach(function(a){g=a.options;if(c[d]===g.index||"undefined"!==typeof c[d]&&c[d]===g.id||"undefined"===typeof c[d]&&0===g.index)b.insert(a.series),b[d]=a,a.isDirty=!0;});b[d]||b.optionalAxis===d||a(18,!0,e);});});
J(this,"afterBindAxes");};d.prototype.updateParallelArrays=function(a,b){var c=a.series,e=arguments,g=R(b)?function(e){var g="y"===e&&c.toYData?c.toYData(a):a[e];c[e+"Data"][b]=g;}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(e,2));};c.parallelArrays.forEach(g);};d.prototype.hasData=function(){return this.visible&&"undefined"!==typeof this.dataMax&&"undefined"!==typeof this.dataMin||this.visible&&this.yData&&0<this.yData.length};d.prototype.autoIncrement=function(){var a=
this.options,b=this.xIncrement,c,e=a.pointIntervalUnit,g=this.chart.time;b=L(b,a.pointStart,0);this.pointInterval=c=L(this.pointInterval,a.pointInterval,1);e&&(a=new g.Date(b),"day"===e?g.set("Date",a,g.get("Date",a)+c):"month"===e?g.set("Month",a,g.get("Month",a)+c):"year"===e&&g.set("FullYear",a,g.get("FullYear",a)+c),c=a.getTime()-b);this.xIncrement=b+c;return b};d.prototype.setDataSortingOptions=function(){var a=this.options;b(this,{requireSorting:!1,sorted:!1,enabledDataSorting:!0,allowDG:!1});
e(a.pointRange)||(a.pointRange=1);};d.prototype.setOptions=function(a){var b=this.chart,g=b.options,d=g.plotOptions,f=b.userOptions||{};a=T(a);b=b.styledMode;var h={plotOptions:d,userOptions:a};J(this,"setOptions",h);var m=h.plotOptions[this.type],l=f.plotOptions||{};this.userOptions=h.userOptions;f=T(m,d.series,f.plotOptions&&f.plotOptions[this.type],a);this.tooltipOptions=T(c.tooltip,c.plotOptions.series&&c.plotOptions.series.tooltip,c.plotOptions[this.type].tooltip,g.tooltip.userOptions,d.series&&
d.series.tooltip,d[this.type].tooltip,a.tooltip);this.stickyTracking=L(a.stickyTracking,l[this.type]&&l[this.type].stickyTracking,l.series&&l.series.stickyTracking,this.tooltipOptions.shared&&!this.noSharedTooltip?!0:f.stickyTracking);null===m.marker&&delete f.marker;this.zoneAxis=f.zoneAxis;g=this.zones=(f.zones||[]).slice();!f.negativeColor&&!f.negativeFillColor||f.zones||(d={value:f[this.zoneAxis+"Threshold"]||f.threshold||0,className:"highcharts-negative"},b||(d.color=f.negativeColor,d.fillColor=
f.negativeFillColor),g.push(d));g.length&&e(g[g.length-1].value)&&g.push(b?{}:{color:this.color,fillColor:this.fillColor});J(this,"afterSetOptions",{options:f});return f};d.prototype.getName=function(){return L(this.options.name,"Series "+(this.index+1))};d.prototype.getCyclic=function(a,b,c){var g=this.chart,d=this.userOptions,f=a+"Index",h=a+"Counter",m=c?c.length:L(g.options.chart[a+"Count"],g[a+"Count"]);if(!b){var l=L(d[f],d["_"+f]);e(l)||(g.series.length||(g[h]=0),d["_"+f]=l=g[h]%m,g[h]+=1);
c&&(b=c[l]);}"undefined"!==typeof l&&(this[f]=l);this[a]=b;};d.prototype.getColor=function(){this.chart.styledMode?this.getCyclic("color"):this.options.colorByPoint?this.options.color=null:this.getCyclic("color",this.options.color||c.plotOptions[this.type].color,this.chart.options.colors);};d.prototype.getPointsCollection=function(){return (this.hasGroupedData?this.points:this.data)||[]};d.prototype.getSymbol=function(){this.getCyclic("symbol",this.options.marker.symbol,this.chart.options.symbols);};d.prototype.findPointIndex=
function(a,b){var c=a.id,e=a.x,g=this.points,d,f=this.options.dataSorting;if(c)var h=this.chart.get(c);else if(this.linkedParent||this.enabledDataSorting){var m=f&&f.matchByName?"name":"index";h=w(g,function(b){return !b.touched&&b[m]===a[m]});if(!h)return}if(h){var l=h&&h.index;"undefined"!==typeof l&&(d=!0);}"undefined"===typeof l&&R(e)&&(l=this.xData.indexOf(e,b));-1!==l&&"undefined"!==typeof l&&this.cropped&&(l=l>=this.cropStart?l-this.cropStart:l);!d&&g[l]&&g[l].touched&&(l=void 0);return l};d.prototype.updateData=
function(a,b){var c=this.options,g=c.dataSorting,d=this.points,f=[],h,m,l,n=this.requireSorting,u=a.length===d.length,p=!0;this.xIncrement=null;a.forEach(function(a,b){var m=e(a)&&this.pointClass.prototype.optionsToObject.call({series:this},a)||{};var p=m.x;if(m.id||R(p)){if(p=this.findPointIndex(m,l),-1===p||"undefined"===typeof p?f.push(a):d[p]&&a!==c.data[p]?(d[p].update(a,!1,null,!1),d[p].touched=!0,n&&(l=p+1)):d[p]&&(d[p].touched=!0),!u||b!==p||g&&g.enabled||this.hasDerivedData)h=!0;}else f.push(a);},
this);if(h)for(a=d.length;a--;)(m=d[a])&&!m.touched&&m.remove&&m.remove(!1,b);else !u||g&&g.enabled?p=!1:(a.forEach(function(a,b){d[b].update&&a!==d[b].y&&d[b].update(a,!1,null,!1);}),f.length=0);d.forEach(function(a){a&&(a.touched=!1);});if(!p)return !1;f.forEach(function(a){this.addPoint(a,!1,null,null,!1);},this);null===this.xIncrement&&this.xData&&this.xData.length&&(this.xIncrement=A(this.xData),this.autoIncrement());return !0};d.prototype.setData=function(b,c,e,g){var d=this,f=d.points,h=f&&f.length||
0,m,l=d.options,n=d.chart,u=l.dataSorting,p=null,q=d.xAxis;p=l.turboThreshold;var r=this.xData,k=this.yData,w=(m=d.pointArrayMap)&&m.length,y=l.keys,t=0,I=1,v;b=b||[];m=b.length;c=L(c,!0);u&&u.enabled&&(b=this.sortData(b));!1!==g&&m&&h&&!d.cropped&&!d.hasGroupedData&&d.visible&&!d.isSeriesBoosting&&(v=this.updateData(b,e));if(!v){d.xIncrement=null;d.colorCounter=0;this.parallelArrays.forEach(function(a){d[a+"Data"].length=0;});if(p&&m>p)if(p=d.getFirstValidPoint(b),R(p))for(e=0;e<m;e++)r[e]=this.autoIncrement(),
k[e]=b[e];else if(F(p))if(w)for(e=0;e<m;e++)g=b[e],r[e]=g[0],k[e]=g.slice(1,w+1);else for(y&&(t=y.indexOf("x"),I=y.indexOf("y"),t=0<=t?t:0,I=0<=I?I:1),e=0;e<m;e++)g=b[e],r[e]=g[t],k[e]=g[I];else a(12,!1,n);else for(e=0;e<m;e++)"undefined"!==typeof b[e]&&(g={series:d},d.pointClass.prototype.applyOptions.apply(g,[b[e]]),d.updateParallelArrays(g,e));k&&Q(k[0])&&a(14,!0,n);d.data=[];d.options.data=d.userOptions.data=b;for(e=h;e--;)f[e]&&f[e].destroy&&f[e].destroy();q&&(q.minRange=q.userMinRange);d.isDirty=
n.isDirtyBox=!0;d.isDirtyData=!!f;e=!1;}"point"===l.legendType&&(this.processData(),this.generatePoints());c&&n.redraw(e);};d.prototype.sortData=function(a){var b=this,c=b.options.dataSorting.sortKey||"y",g=function(a,b){return e(b)&&a.pointClass.prototype.optionsToObject.call({series:a},b)||{}};a.forEach(function(c,e){a[e]=g(b,c);a[e].index=e;},this);a.concat().sort(function(a,b){a=O(c,a);b=O(c,b);return b<a?-1:b>a?1:0}).forEach(function(a,b){a.x=b;},this);b.linkedSeries&&b.linkedSeries.forEach(function(b){var c=
b.options,e=c.data;c.dataSorting&&c.dataSorting.enabled||!e||(e.forEach(function(c,d){e[d]=g(b,c);a[d]&&(e[d].x=a[d].x,e[d].index=d);}),b.setData(e,!1));});return a};d.prototype.getProcessedData=function(b){var c=this.xData,e=this.yData,g=c.length;var d=0;var f=this.xAxis,h=this.options;var m=h.cropThreshold;var l=b||this.getExtremesFromAll||h.getExtremesFromAll,n=this.isCartesian;b=f&&f.val2lin;h=!(!f||!f.logarithmic);var p=this.requireSorting;if(f){f=f.getExtremes();var u=f.min;var q=f.max;}if(n&&
this.sorted&&!l&&(!m||g>m||this.forceCrop))if(c[g-1]<u||c[0]>q)c=[],e=[];else if(this.yData&&(c[0]<u||c[g-1]>q)){d=this.cropData(this.xData,this.yData,u,q);c=d.xData;e=d.yData;d=d.start;var r=!0;}for(m=c.length||1;--m;)if(g=h?b(c[m])-b(c[m-1]):c[m]-c[m-1],0<g&&("undefined"===typeof k||g<k))var k=g;else 0>g&&p&&(a(15,!1,this.chart),p=!1);return {xData:c,yData:e,cropped:r,cropStart:d,closestPointRange:k}};d.prototype.processData=function(a){var b=this.xAxis;if(this.isCartesian&&!this.isDirty&&!b.isDirty&&
!this.yAxis.isDirty&&!a)return !1;a=this.getProcessedData();this.cropped=a.cropped;this.cropStart=a.cropStart;this.processedXData=a.xData;this.processedYData=a.yData;this.closestPointRange=this.basePointRange=a.closestPointRange;};d.prototype.cropData=function(a,b,c,e,g){var d=a.length,f=0,h=d,m;g=L(g,this.cropShoulder);for(m=0;m<d;m++)if(a[m]>=c){f=Math.max(0,m-g);break}for(c=m;c<d;c++)if(a[c]>e){h=c+g;break}return {xData:a.slice(f,h),yData:b.slice(f,h),start:f,end:h}};d.prototype.generatePoints=function(){var a=
this.options,c=a.data,e=this.data,g,d=this.processedXData,f=this.processedYData,h=this.pointClass,m=d.length,l=this.cropStart||0,n=this.hasGroupedData;a=a.keys;var p=[],q;e||n||(e=[],e.length=c.length,e=this.data=e);a&&n&&(this.options.keys=!1);for(q=0;q<m;q++){var r=l+q;if(n){var k=(new h).init(this,[d[q]].concat(K(f[q])));k.dataGroup=this.groupMap[q];k.dataGroup.options&&(k.options=k.dataGroup.options,b(k,k.dataGroup.options),delete k.dataLabels);}else (k=e[r])||"undefined"===typeof c[r]||(e[r]=k=
(new h).init(this,c[r],d[q]));k&&(k.index=r,p[q]=k);}this.options.keys=a;if(e&&(m!==(g=e.length)||n))for(q=0;q<g;q++)q!==l||n||(q+=m),e[q]&&(e[q].destroyElements(),e[q].plotX=void 0);this.data=e;this.points=p;J(this,"afterGeneratePoints");};d.prototype.getXExtremes=function(a){return {min:M(a),max:A(a)}};d.prototype.getExtremes=function(a,b){var c=this.xAxis,e=this.yAxis,g=this.processedXData||this.xData,d=[],f=0,h=0;var m=0;var l=this.requireSorting?this.cropShoulder:0,n=e?e.positiveValuesOnly:!1,p;
a=a||this.stackedYData||this.processedYData||[];e=a.length;c&&(m=c.getExtremes(),h=m.min,m=m.max);for(p=0;p<e;p++){var u=g[p];var q=a[p];var r=(R(q)||F(q))&&(q.length||0<q||!n);u=b||this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||!c||(g[p+l]||u)>=h&&(g[p-l]||u)<=m;if(r&&u)if(r=q.length)for(;r--;)R(q[r])&&(d[f++]=q[r]);else d[f++]=q;}a={dataMin:M(d),dataMax:A(d)};J(this,"afterGetExtremes",{dataExtremes:a});return a};d.prototype.applyExtremes=function(){var a=this.getExtremes();
this.dataMin=a.dataMin;this.dataMax=a.dataMax;return a};d.prototype.getFirstValidPoint=function(a){for(var b=null,c=a.length,e=0;null===b&&e<c;)b=a[e],e++;return b};d.prototype.translate=function(){this.processedXData||this.processData();this.generatePoints();var a=this.options,b=a.stacking,c=this.xAxis,g=c.categories,d=this.enabledDataSorting,f=this.yAxis,h=this.points,m=h.length,l=!!this.modifyValue,n,p=this.pointPlacementToXValue(),q=!!p,k=a.threshold,w=a.startFromThreshold?k:0,y,t=this.zoneAxis||
"y",v=Number.MAX_VALUE;for(n=0;n<m;n++){var A=h[n],C=A.x,E=A.y,x=A.low,M=b&&f.stacking&&f.stacking.stacks[(this.negStacks&&E<(w?0:k)?"-":"")+this.stackKey];if(f.positiveValuesOnly&&!f.validatePositiveValue(E)||c.positiveValuesOnly&&!c.validatePositiveValue(C))A.isNull=!0;A.plotX=y=r(z(c.translate(C,0,0,0,1,p,"flags"===this.type),-1E5,1E5));if(b&&this.visible&&M&&M[C]){var N=this.getStackIndicator(N,C,this.index);if(!A.isNull){var H=M[C];var Q=H.points[N.key];}}F(Q)&&(x=Q[0],E=Q[1],x===w&&N.key===M[C].base&&
(x=L(R(k)&&k,f.min)),f.positiveValuesOnly&&0>=x&&(x=null),A.total=A.stackTotal=H.total,A.percentage=H.total&&A.y/H.total*100,A.stackY=E,this.irregularWidths||H.setOffset(this.pointXOffset||0,this.barW||0));A.yBottom=e(x)?z(f.translate(x,0,1,0,1),-1E5,1E5):null;l&&(E=this.modifyValue(E,A));A.plotY=void 0;R(E)&&(E=f.translate(E,!1,!0,!1,!0),"undefined"!==typeof E&&(A.plotY=z(E,-1E5,1E5)));A.isInside=this.isPointInside(A);A.clientX=q?r(c.translate(C,0,0,0,1,p)):y;A.negative=A[t]<(a[t+"Threshold"]||k||
0);A.category=g&&"undefined"!==typeof g[A.x]?g[A.x]:A.x;if(!A.isNull&&!1!==A.visible){"undefined"!==typeof D&&(v=Math.min(v,Math.abs(y-D)));var D=y;}A.zone=this.zones.length&&A.getZone();!A.graphic&&this.group&&d&&(A.isNew=!0);}this.closestPointRangePx=v;J(this,"afterTranslate");};d.prototype.getValidPoints=function(a,b,c){var e=this.chart;return (a||this.points||[]).filter(function(a){return b&&!e.isInsidePlot(a.plotX,a.plotY,e.inverted)?!1:!1!==a.visible&&(c||!a.isNull)})};d.prototype.getClipBox=function(a,
b){var c=this.options,e=this.chart,g=e.inverted,d=this.xAxis,f=d&&this.yAxis,h=e.options.chart.scrollablePlotArea||{};a&&!1===c.clip&&f?a=g?{y:-e.chartWidth+f.len+f.pos,height:e.chartWidth,width:e.chartHeight,x:-e.chartHeight+d.len+d.pos}:{y:-f.pos,height:e.chartHeight,width:e.chartWidth,x:-d.pos}:(a=this.clipBox||e.clipBox,b&&(a.width=e.plotSizeX,a.x=(e.scrollablePixelsX||0)*(h.scrollPositionX||0)));return b?{width:a.width,x:a.x}:a};d.prototype.setClip=function(a){var b=this.chart,c=this.options,
e=b.renderer,g=b.inverted,d=this.clipBox,f=this.getClipBox(a),h=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,a&&a.defer,f.height,c.xAxis,c.yAxis].join(),m=b[h],l=b[h+"m"];a&&(f.width=0,g&&(f.x=b.plotHeight+(!1!==c.clip?0:b.plotTop)));m?b.hasLoaded||m.attr(f):(a&&(b[h+"m"]=l=e.clipRect(g?b.plotSizeX+99:-99,g?-b.plotLeft:-b.plotTop,99,g?b.chartWidth:b.chartHeight)),b[h]=m=e.clipRect(f),m.count={length:0});a&&!m.count[this.index]&&(m.count[this.index]=!0,m.count.length+=1);if(!1!==c.clip||
a)this.group.clip(a||d?m:b.clipRect),this.markerGroup.clip(l),this.sharedClipKey=h;a||(m.count[this.index]&&(delete m.count[this.index],--m.count.length),0===m.count.length&&h&&b[h]&&(d||(b[h]=b[h].destroy()),b[h+"m"]&&(b[h+"m"]=b[h+"m"].destroy())));};d.prototype.animate=function(a){var b=this.chart,c=C(this.options.animation);if(a)this.setClip(c);else {var e=this.sharedClipKey;a=b[e];var g=this.getClipBox(c,!0);a&&a.animate(g,c);b[e+"m"]&&b[e+"m"].animate({width:g.width+99,x:g.x-(b.inverted?0:99)},
c);}};d.prototype.afterAnimate=function(){this.setClip();J(this,"afterAnimate");this.finishedAnimating=!0;};d.prototype.drawPoints=function(){var a=this.points,b=this.chart,c,e,g=this.options.marker,d=this[this.specialGroup]||this.markerGroup,f=this.xAxis,h=L(g.enabled,!f||f.isRadial?!0:null,this.closestPointRangePx>=g.enabledThreshold*g.radius);if(!1!==g.enabled||this._hasPointMarkers)for(c=0;c<a.length;c++){var m=a[c];var l=(e=m.graphic)?"animate":"attr";var n=m.marker||{};var p=!!m.marker;if((h&&
"undefined"===typeof n.enabled||n.enabled)&&!m.isNull&&!1!==m.visible){var q=L(n.symbol,this.symbol);var r=this.markerAttribs(m,m.selected&&"select");this.enabledDataSorting&&(m.startXPos=f.reversed?-r.width:f.width);var k=!1!==m.isInside;e?e[k?"show":"hide"](k).animate(r):k&&(0<r.width||m.hasImage)&&(m.graphic=e=b.renderer.symbol(q,r.x,r.y,r.width,r.height,p?n:g).add(d),this.enabledDataSorting&&b.hasRendered&&(e.attr({x:m.startXPos}),l="animate"));e&&"animate"===l&&e[k?"show":"hide"](k).animate(r);
if(e&&!b.styledMode)e[l](this.pointAttribs(m,m.selected&&"select"));e&&e.addClass(m.getClassName(),!0);}else e&&(m.graphic=e.destroy());}};d.prototype.markerAttribs=function(a,b){var c=this.options,e=c.marker,g=a.marker||{},d=g.symbol||e.symbol,f=L(g.radius,e.radius);b&&(e=e.states[b],b=g.states&&g.states[b],f=L(b&&b.radius,e&&e.radius,f+(e&&e.radiusPlus||0)));a.hasImage=d&&0===d.indexOf("url");a.hasImage&&(f=0);a={x:c.crisp?Math.floor(a.plotX)-f:a.plotX-f,y:a.plotY-f};f&&(a.width=a.height=2*f);return a};
d.prototype.pointAttribs=function(a,b){var c=this.options.marker,e=a&&a.options,g=e&&e.marker||{},d=this.color,f=e&&e.color,h=a&&a.color;e=L(g.lineWidth,c.lineWidth);var m=a&&a.zone&&a.zone.color;a=1;d=f||m||h||d;f=g.fillColor||c.fillColor||d;d=g.lineColor||c.lineColor||d;b=b||"normal";c=c.states[b];b=g.states&&g.states[b]||{};e=L(b.lineWidth,c.lineWidth,e+L(b.lineWidthPlus,c.lineWidthPlus,0));f=b.fillColor||c.fillColor||f;d=b.lineColor||c.lineColor||d;a=L(b.opacity,c.opacity,a);return {stroke:d,"stroke-width":e,
fill:f,opacity:a}};d.prototype.destroy=function(a){var b=this,c=b.chart,e=/AppleWebKit\/533/.test(y.navigator.userAgent),g,d,f=b.data||[],m,l;J(b,"destroy");this.removeEvents(a);(b.axisTypes||[]).forEach(function(a){(l=b[a])&&l.series&&(h(l.series,b),l.isDirty=l.forceRedraw=!0);});b.legendItem&&b.chart.legend.destroyItem(b);for(d=f.length;d--;)(m=f[d])&&m.destroy&&m.destroy();b.points=null;t.clearTimeout(b.animationTimeout);v(b,function(a,b){a instanceof H&&!a.survive&&(g=e&&"group"===b?"hide":"destroy",
a[g]());});c.hoverSeries===b&&(c.hoverSeries=null);h(c.series,b);c.orderSeries();v(b,function(c,e){a&&"hcEvents"===e||delete b[e];});};d.prototype.applyZones=function(){var a=this,b=this.chart,c=b.renderer,e=this.zones,g,d,f=this.clips||[],h,m=this.graph,l=this.area,n=Math.max(b.chartWidth,b.chartHeight),p=this[(this.zoneAxis||"y")+"Axis"],q=b.inverted,r,k,w,y=!1,t,v;if(e.length&&(m||l)&&p&&"undefined"!==typeof p.min){var A=p.reversed;var F=p.horiz;m&&!this.showLine&&m.hide();l&&l.hide();var E=p.getExtremes();
e.forEach(function(e,u){g=A?F?b.plotWidth:0:F?0:p.toPixels(E.min)||0;g=z(L(d,g),0,n);d=z(Math.round(p.toPixels(L(e.value,E.max),!0)||0),0,n);y&&(g=d=p.toPixels(E.max));r=Math.abs(g-d);k=Math.min(g,d);w=Math.max(g,d);p.isXAxis?(h={x:q?w:k,y:0,width:r,height:n},F||(h.x=b.plotHeight-h.x)):(h={x:0,y:q?w:k,width:n,height:r},F&&(h.y=b.plotWidth-h.y));q&&c.isVML&&(h=p.isXAxis?{x:0,y:A?k:w,height:h.width,width:b.chartWidth}:{x:h.y-b.plotLeft-b.spacingBox.x,y:0,width:h.height,height:b.chartHeight});f[u]?f[u].animate(h):
f[u]=c.clipRect(h);t=a["zone-area-"+u];v=a["zone-graph-"+u];m&&v&&v.clip(f[u]);l&&t&&t.clip(f[u]);y=e.value>E.max;a.resetZones&&0===d&&(d=void 0);});this.clips=f;}else a.visible&&(m&&m.show(!0),l&&l.show(!0));};d.prototype.invertGroups=function(a){function b(){["group","markerGroup"].forEach(function(b){c[b]&&(e.renderer.isVML&&c[b].attr({width:c.yAxis.len,height:c.xAxis.len}),c[b].width=c.yAxis.len,c[b].height=c.xAxis.len,c[b].invert(c.isRadialSeries?!1:a));});}var c=this,e=c.chart;c.xAxis&&(c.eventsToUnbind.push(n(e,
"resize",b)),b(),c.invertGroups=b);};d.prototype.plotGroup=function(a,b,c,g,d){var f=this[a],h=!f;c={visibility:c,zIndex:g||.1};"undefined"===typeof this.opacity||this.chart.styledMode||"inactive"===this.state||(c.opacity=this.opacity);h&&(this[a]=f=this.chart.renderer.g().add(d));f.addClass("highcharts-"+b+" highcharts-series-"+this.index+" highcharts-"+this.type+"-series "+(e(this.colorIndex)?"highcharts-color-"+this.colorIndex+" ":"")+(this.options.className||"")+(f.hasClass("highcharts-tracker")?
" highcharts-tracker":""),!0);f.attr(c)[h?"attr":"animate"](this.getPlotBox());return f};d.prototype.getPlotBox=function(){var a=this.chart,b=this.xAxis,c=this.yAxis;a.inverted&&(b=c,c=this.xAxis);return {translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}};d.prototype.removeEvents=function(a){a||p(this);this.eventsToUnbind.length&&(this.eventsToUnbind.forEach(function(a){a();}),this.eventsToUnbind.length=0);};d.prototype.render=function(){var a=this,b=a.chart,c=a.options,
e=C(c.animation),g=!a.finishedAnimating&&b.renderer.isSVG&&e.duration,d=a.visible?"inherit":"hidden",f=c.zIndex,h=a.hasRendered,m=b.seriesGroup,l=b.inverted;J(this,"render");var n=a.plotGroup("group","series",d,f,m);a.markerGroup=a.plotGroup("markerGroup","markers",d,f,m);g&&a.animate&&a.animate(!0);n.inverted=L(a.invertible,a.isCartesian)?l:!1;a.drawGraph&&(a.drawGraph(),a.applyZones());a.visible&&a.drawPoints();a.drawDataLabels&&a.drawDataLabels();a.redrawPoints&&a.redrawPoints();a.drawTracker&&
!1!==a.options.enableMouseTracking&&a.drawTracker();a.invertGroups(l);!1===c.clip||a.sharedClipKey||h||n.clip(b.clipRect);g&&a.animate&&a.animate();h||(g&&e.defer&&(g+=e.defer),a.animationTimeout=S(function(){a.afterAnimate();},g||0));a.isDirty=!1;a.hasRendered=!0;J(a,"afterRender");};d.prototype.redraw=function(){var a=this.chart,b=this.isDirty||this.isDirtyData,c=this.group,e=this.xAxis,g=this.yAxis;c&&(a.inverted&&c.attr({width:a.plotWidth,height:a.plotHeight}),c.animate({translateX:L(e&&e.left,
a.plotLeft),translateY:L(g&&g.top,a.plotTop)}));this.translate();this.render();b&&delete this.kdTree;};d.prototype.searchPoint=function(a,b){var c=this.xAxis,e=this.yAxis,g=this.chart.inverted;return this.searchKDTree({clientX:g?c.len-a.chartY+c.pos:a.chartX-c.pos,plotY:g?e.len-a.chartX+e.pos:a.chartY-e.pos},b,a)};d.prototype.buildKDTree=function(a){function b(a,e,g){var d;if(d=a&&a.length){var f=c.kdAxisArray[e%g];a.sort(function(a,b){return a[f]-b[f]});d=Math.floor(d/2);return {point:a[d],left:b(a.slice(0,
d),e+1,g),right:b(a.slice(d+1),e+1,g)}}}this.buildingKdTree=!0;var c=this,e=-1<c.options.findNearestPointBy.indexOf("y")?2:1;delete c.kdTree;S(function(){c.kdTree=b(c.getValidPoints(null,!c.directTouch),e,e);c.buildingKdTree=!1;},c.options.kdNow||a&&"touchstart"===a.type?0:1);};d.prototype.searchKDTree=function(a,b,c){function g(a,b,c,l){var n=b.point,p=d.kdAxisArray[c%l],q=n;var r=e(a[f])&&e(n[f])?Math.pow(a[f]-n[f],2):null;var k=e(a[h])&&e(n[h])?Math.pow(a[h]-n[h],2):null;k=(r||0)+(k||0);n.dist=e(k)?
Math.sqrt(k):Number.MAX_VALUE;n.distX=e(r)?Math.sqrt(r):Number.MAX_VALUE;p=a[p]-n[p];k=0>p?"left":"right";r=0>p?"right":"left";b[k]&&(k=g(a,b[k],c+1,l),q=k[m]<q[m]?k:n);b[r]&&Math.sqrt(p*p)<q[m]&&(a=g(a,b[r],c+1,l),q=a[m]<q[m]?a:q);return q}var d=this,f=this.kdAxisArray[0],h=this.kdAxisArray[1],m=b?"distX":"dist";b=-1<d.options.findNearestPointBy.indexOf("y")?2:1;this.kdTree||this.buildingKdTree||this.buildKDTree(c);if(this.kdTree)return g(a,this.kdTree,b,b)};d.prototype.pointPlacementToXValue=function(){var a=
this.options,b=a.pointRange,c=this.xAxis;a=a.pointPlacement;"between"===a&&(a=c.reversed?-.5:.5);return R(a)?a*(b||c.pointRange):0};d.prototype.isPointInside=function(a){return "undefined"!==typeof a.plotY&&"undefined"!==typeof a.plotX&&0<=a.plotY&&a.plotY<=this.yAxis.len&&0<=a.plotX&&a.plotX<=this.xAxis.len};d.prototype.drawTracker=function(){var a=this,b=a.options,c=b.trackByArea,e=[].concat(c?a.areaPath:a.graphPath),d=a.chart,f=d.pointer,h=d.renderer,m=d.options.tooltip.snap,l=a.tracker,n=function(b){if(d.hoverSeries!==
a)a.onMouseOver();},p="rgba(192,192,192,"+(g?.0001:.002)+")";l?l.attr({d:e}):a.graph&&(a.tracker=h.path(e).attr({visibility:a.visible?"visible":"hidden",zIndex:2}).addClass(c?"highcharts-tracker-area":"highcharts-tracker-line").add(a.group),d.styledMode||a.tracker.attr({"stroke-linecap":"round","stroke-linejoin":"round",stroke:p,fill:c?p:"none","stroke-width":a.graph.strokeWidth()+(c?0:2*m)}),[a.tracker,a.markerGroup].forEach(function(a){a.addClass("highcharts-tracker").on("mouseover",n).on("mouseout",
function(a){f.onTrackerMouseOut(a);});b.cursor&&!d.styledMode&&a.css({cursor:b.cursor});if(E)a.on("touchstart",n);}));J(this,"afterDrawTracker");};d.prototype.addPoint=function(a,b,c,e,g){var d=this.options,f=this.data,h=this.chart,m=this.xAxis;m=m&&m.hasNames&&m.names;var l=d.data,n=this.xData,p;b=L(b,!0);var q={series:this};this.pointClass.prototype.applyOptions.apply(q,[a]);var r=q.x;var k=n.length;if(this.requireSorting&&r<n[k-1])for(p=!0;k&&n[k-1]>r;)k--;this.updateParallelArrays(q,"splice",k,0,
0);this.updateParallelArrays(q,k);m&&q.name&&(m[r]=q.name);l.splice(k,0,a);p&&(this.data.splice(k,0,null),this.processData());"point"===d.legendType&&this.generatePoints();c&&(f[0]&&f[0].remove?f[0].remove(!1):(f.shift(),this.updateParallelArrays(q,"shift"),l.shift()));!1!==g&&J(this,"addPoint",{point:q});this.isDirtyData=this.isDirty=!0;b&&h.redraw(e);};d.prototype.removePoint=function(a,b,c){var e=this,g=e.data,d=g[a],f=e.points,h=e.chart,m=function(){f&&f.length===g.length&&f.splice(a,1);g.splice(a,
1);e.options.data.splice(a,1);e.updateParallelArrays(d||{series:e},"splice",a,1);d&&d.destroy();e.isDirty=!0;e.isDirtyData=!0;b&&h.redraw();};l(c,h);b=L(b,!0);d?d.firePointEvent("remove",null,m):m();};d.prototype.remove=function(a,b,c,e){function g(){d.destroy(e);f.isDirtyLegend=f.isDirtyBox=!0;f.linkSeries();L(a,!0)&&f.redraw(b);}var d=this,f=d.chart;!1!==c?J(d,"remove",null,g):g();};d.prototype.update=function(c,e){c=m(c,this.userOptions);J(this,"update",{options:c});var g=this,d=g.chart,f=g.userOptions,
h=g.initialType||g.type,l=d.options.plotOptions,n=c.type||f.type||d.options.chart.type,p=!(this.hasDerivedData||n&&n!==this.type||"undefined"!==typeof c.pointStart||"undefined"!==typeof c.pointInterval||g.hasOptionChanged("dataGrouping")||g.hasOptionChanged("pointStart")||g.hasOptionChanged("pointInterval")||g.hasOptionChanged("pointIntervalUnit")||g.hasOptionChanged("keys")),r=q[h].prototype,k,w=["eventOptions","navigatorSeries","baseSeries"],u=g.finishedAnimating&&{animation:!1},y={};p&&(w.push("data",
"isDirtyData","points","processedXData","processedYData","xIncrement","cropped","_hasPointMarkers","_hasPointLabels","nodes","layout","mapMap","mapData","minY","maxY","minX","maxX"),!1!==c.visible&&w.push("area","graph"),g.parallelArrays.forEach(function(a){w.push(a+"Data");}),c.data&&(c.dataSorting&&b(g.options.dataSorting,c.dataSorting),this.setData(c.data,!1)));c=T(f,u,{index:"undefined"===typeof f.index?g.index:f.index,pointStart:L(l&&l.series&&l.series.pointStart,f.pointStart,g.xData[0])},!p&&
{data:g.options.data},c);p&&c.data&&(c.data=g.options.data);w=["group","markerGroup","dataLabelsGroup","transformGroup"].concat(w);w.forEach(function(a){w[a]=g[a];delete g[a];});if(q[n||h]){if(f=n!==g.type,g.remove(!1,!1,!1,!0),f)if(Object.setPrototypeOf)Object.setPrototypeOf(g,q[n||h].prototype);else {f=Object.hasOwnProperty.call(g,"hcEvents")&&g.hcEvents;for(k in r)g[k]=void 0;b(g,q[n||h].prototype);f?g.hcEvents=f:delete g.hcEvents;}}else a(17,!0,d,{missingModuleFor:n||h});w.forEach(function(a){g[a]=
w[a];});g.init(d,c);if(p&&this.points){var t=g.options;!1===t.visible?(y.graphic=1,y.dataLabel=1):g._hasPointLabels||(c=t.marker,n=t.dataLabels,c&&(!1===c.enabled||"symbol"in c)&&(y.graphic=1),n&&!1===n.enabled&&(y.dataLabel=1));this.points.forEach(function(a){a&&a.series&&(a.resolveColor(),Object.keys(y).length&&a.destroyElements(y),!1===t.showInLegend&&a.legendItem&&d.legend.destroyItem(a));},this);}g.initialType=h;d.linkSeries();J(this,"afterUpdate");L(e,!0)&&d.redraw(p?void 0:!1);};d.prototype.setName=
function(a){this.name=this.options.name=this.userOptions.name=a;this.chart.isDirtyLegend=!0;};d.prototype.hasOptionChanged=function(a){var b=this.options[a],c=this.chart.options.plotOptions,e=this.userOptions[a];return e?b!==e:b!==L(c&&c[this.type]&&c[this.type][a],c&&c.series&&c.series[a],b)};d.prototype.onMouseOver=function(){var a=this.chart,b=a.hoverSeries;a.pointer.setHoverChartIndex();if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&J(this,"mouseOver");this.setState("hover");a.hoverSeries=
this;};d.prototype.onMouseOut=function(){var a=this.options,b=this.chart,c=b.tooltip,e=b.hoverPoint;b.hoverSeries=null;if(e)e.onMouseOut();this&&a.events.mouseOut&&J(this,"mouseOut");!c||this.stickyTracking||c.shared&&!this.noSharedTooltip||c.hide();b.series.forEach(function(a){a.setState("",!0);});};d.prototype.setState=function(a,b){var c=this,e=c.options,g=c.graph,d=e.inactiveOtherPoints,f=e.states,h=e.lineWidth,m=e.opacity,l=L(f[a||"normal"]&&f[a||"normal"].animation,c.chart.options.chart.animation);
e=0;a=a||"";if(c.state!==a&&([c.group,c.markerGroup,c.dataLabelsGroup].forEach(function(b){b&&(c.state&&b.removeClass("highcharts-series-"+c.state),a&&b.addClass("highcharts-series-"+a));}),c.state=a,!c.chart.styledMode)){if(f[a]&&!1===f[a].enabled)return;a&&(h=f[a].lineWidth||h+(f[a].lineWidthPlus||0),m=L(f[a].opacity,m));if(g&&!g.dashstyle)for(f={"stroke-width":h},g.animate(f,l);c["zone-graph-"+e];)c["zone-graph-"+e].animate(f,l),e+=1;d||[c.group,c.markerGroup,c.dataLabelsGroup,c.labelBySeries].forEach(function(a){a&&
a.animate({opacity:m},l);});}b&&d&&c.points&&c.setAllPointsToState(a||void 0);};d.prototype.setAllPointsToState=function(a){this.points.forEach(function(b){b.setState&&b.setState(a);});};d.prototype.setVisible=function(a,b){var c=this,e=c.chart,g=c.legendItem,d=e.options.chart.ignoreHiddenSeries,f=c.visible;var h=(c.visible=a=c.options.visible=c.userOptions.visible="undefined"===typeof a?!f:a)?"show":"hide";["group","dataLabelsGroup","markerGroup","tracker","tt"].forEach(function(a){if(c[a])c[a][h]();});
if(e.hoverSeries===c||(e.hoverPoint&&e.hoverPoint.series)===c)c.onMouseOut();g&&e.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&e.series.forEach(function(a){a.options.stacking&&a.visible&&(a.isDirty=!0);});c.linkedSeries.forEach(function(b){b.setVisible(a,!1);});d&&(e.isDirtyBox=!0);J(c,h);!1!==b&&e.redraw();};d.prototype.show=function(){this.setVisible(!0);};d.prototype.hide=function(){this.setVisible(!1);};d.prototype.select=function(a){this.selected=a=this.options.selected="undefined"===
typeof a?!this.selected:a;this.checkbox&&(this.checkbox.checked=a);J(this,a?"select":"unselect");};d.defaultOptions={lineWidth:2,allowPointSelect:!1,crisp:!0,showCheckbox:!1,animation:{duration:1E3},events:{},marker:{enabledThreshold:2,lineColor:B.backgroundColor,lineWidth:0,radius:4,states:{normal:{animation:!0},hover:{animation:{duration:50},enabled:!0,radiusPlus:2,lineWidthPlus:1},select:{fillColor:B.neutralColor20,lineColor:B.neutralColor100,lineWidth:2}}},point:{events:{}},dataLabels:{animation:{},
align:"center",defer:!0,formatter:function(){var a=this.series.chart.numberFormatter;return "number"!==typeof this.y?"":a(this.y,-1)},padding:5,style:{fontSize:"11px",fontWeight:"bold",color:"contrast",textOutline:"1px contrast"},verticalAlign:"bottom",x:0,y:0},cropThreshold:300,opacity:1,pointRange:0,softThreshold:!0,states:{normal:{animation:!0},hover:{animation:{duration:50},lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{animation:{duration:0}},inactive:{animation:{duration:50},opacity:.2}},
stickyTracking:!0,turboThreshold:1E3,findNearestPointBy:"x"};return d}();b(f.prototype,{axisTypes:["xAxis","yAxis"],coll:"series",colorCounter:0,cropShoulder:1,directTouch:!1,drawLegendSymbol:k.drawLineMarker,isCartesian:!0,kdAxisArray:["clientX","plotY"],parallelArrays:["x","y"],pointClass:G,requireSorting:!0,sorted:!0});D.series=f;return f});P(k,"Extensions/ScrollablePlotArea.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Axis/Axis.js"],k["Core/Chart/Chart.js"],k["Core/Series/Series.js"],
k["Core/Globals.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G){var D=f.stop,H=G.addEvent,t=G.createElement,C=G.merge,l=G.pick;H(k,"afterSetChartSize",function(d){var g=this.options.chart.scrollablePlotArea,f=g&&g.minWidth;g=g&&g.minHeight;if(!this.renderer.forExport){if(f){if(this.scrollablePixelsX=f=Math.max(0,f-this.chartWidth)){this.scrollablePlotBox=C(this.plotBox);this.plotWidth+=f;this.inverted?(this.clipBox.height+=f,this.plotBox.height+=f):(this.clipBox.width+=f,this.plotBox.width+=
f);var c={1:{name:"right",value:f}};}}else g&&(this.scrollablePixelsY=f=Math.max(0,g-this.chartHeight))&&(this.scrollablePlotBox=C(this.plotBox),this.plotHeight+=f,this.inverted?(this.clipBox.width+=f,this.plotBox.width+=f):(this.clipBox.height+=f,this.plotBox.height+=f),c={2:{name:"bottom",value:f}});c&&!d.skipAxes&&this.axes.forEach(function(g){c[g.side]?g.getPlotLinePath=function(){var d=c[g.side].name,f=this[d];this[d]=f-c[g.side].value;var l=B.Axis.prototype.getPlotLinePath.apply(this,arguments);
this[d]=f;return l}:(g.setAxisSize(),g.setAxisTranslation());});}});H(k,"render",function(){this.scrollablePixelsX||this.scrollablePixelsY?(this.setUpScrolling&&this.setUpScrolling(),this.applyFixed()):this.fixedDiv&&this.applyFixed();});k.prototype.setUpScrolling=function(){var d=this,g={WebkitOverflowScrolling:"touch",overflowX:"hidden",overflowY:"hidden"};this.scrollablePixelsX&&(g.overflowX="auto");this.scrollablePixelsY&&(g.overflowY="auto");this.scrollingParent=t("div",{className:"highcharts-scrolling-parent"},
{position:"relative"},this.renderTo);this.scrollingContainer=t("div",{className:"highcharts-scrolling"},g,this.scrollingParent);H(this.scrollingContainer,"scroll",function(){d.pointer&&delete d.pointer.chartPosition;});this.innerContainer=t("div",{className:"highcharts-inner-container"},null,this.scrollingContainer);this.innerContainer.appendChild(this.container);this.setUpScrolling=null;};k.prototype.moveFixedElements=function(){var d=this.container,g=this.fixedRenderer,f=".highcharts-contextbutton .highcharts-credits .highcharts-legend .highcharts-legend-checkbox .highcharts-navigator-series .highcharts-navigator-xaxis .highcharts-navigator-yaxis .highcharts-navigator .highcharts-reset-zoom .highcharts-scrollbar .highcharts-subtitle .highcharts-title".split(" "),
c;this.scrollablePixelsX&&!this.inverted?c=".highcharts-yaxis":this.scrollablePixelsX&&this.inverted?c=".highcharts-xaxis":this.scrollablePixelsY&&!this.inverted?c=".highcharts-xaxis":this.scrollablePixelsY&&this.inverted&&(c=".highcharts-yaxis");c&&f.push(c+":not(.highcharts-radial-axis)",c+"-labels:not(.highcharts-radial-axis-labels)");f.forEach(function(c){[].forEach.call(d.querySelectorAll(c),function(c){(c.namespaceURI===g.SVG_NS?g.box:g.box.parentNode).appendChild(c);c.style.pointerEvents="auto";});});};
k.prototype.applyFixed=function(){var f=this,g,k,c,q=!this.fixedDiv,n=this.options.chart,A=n.scrollablePlotArea;q?(this.fixedDiv=t("div",{className:"highcharts-fixed"},{position:"absolute",overflow:"hidden",pointerEvents:"none",zIndex:((null===(g=n.style)||void 0===g?void 0:g.zIndex)||0)+2,top:0},null,!0),null===(k=this.scrollingContainer)||void 0===k?void 0:k.parentNode.insertBefore(this.fixedDiv,this.scrollingContainer),this.renderTo.style.overflow="visible",this.fixedRenderer=g=new B.Renderer(this.fixedDiv,
this.chartWidth,this.chartHeight,null===(c=this.options.chart)||void 0===c?void 0:c.style),this.scrollableMask=g.path().attr({fill:this.options.chart.backgroundColor||"#fff","fill-opacity":l(A.opacity,.85),zIndex:-1}).addClass("highcharts-scrollable-mask").add(),H(this,"afterShowResetZoom",this.moveFixedElements),H(this,"afterLayOutTitles",this.moveFixedElements),H(d,"afterInit",function(){f.scrollableDirty=!0;}),H(x,"show",function(){f.scrollableDirty=!0;})):this.fixedRenderer.setSize(this.chartWidth,
this.chartHeight);if(this.scrollableDirty||q)this.scrollableDirty=!1,this.moveFixedElements();c=this.chartWidth+(this.scrollablePixelsX||0);g=this.chartHeight+(this.scrollablePixelsY||0);D(this.container);this.container.style.width=c+"px";this.container.style.height=g+"px";this.renderer.boxWrapper.attr({width:c,height:g,viewBox:[0,0,c,g].join(" ")});this.chartBackground.attr({width:c,height:g});this.scrollingContainer.style.height=this.chartHeight+"px";q&&(A.scrollPositionX&&(this.scrollingContainer.scrollLeft=
this.scrollablePixelsX*A.scrollPositionX),A.scrollPositionY&&(this.scrollingContainer.scrollTop=this.scrollablePixelsY*A.scrollPositionY));g=this.axisOffset;q=this.plotTop-g[0]-1;A=this.plotLeft-g[3]-1;c=this.plotTop+this.plotHeight+g[2]+1;g=this.plotLeft+this.plotWidth+g[1]+1;k=this.plotLeft+this.plotWidth-(this.scrollablePixelsX||0);n=this.plotTop+this.plotHeight-(this.scrollablePixelsY||0);q=this.scrollablePixelsX?[["M",0,q],["L",this.plotLeft-1,q],["L",this.plotLeft-1,c],["L",0,c],["Z"],["M",
k,q],["L",this.chartWidth,q],["L",this.chartWidth,c],["L",k,c],["Z"]]:this.scrollablePixelsY?[["M",A,0],["L",A,this.plotTop-1],["L",g,this.plotTop-1],["L",g,0],["Z"],["M",A,n],["L",A,this.chartHeight],["L",g,this.chartHeight],["L",g,n],["Z"]]:[["M",0,0]];"adjustHeight"!==this.redrawTrigger&&this.scrollableMask.attr({d:q});};});P(k,"Core/Axis/StackingAxis.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Utilities.js"]],function(f,d){var k=f.getDeferredAnimation,x=d.addEvent,B=d.destroyObjectProperties,
G=d.fireEvent,D=d.objectEach,H=d.pick,t=function(){function d(d){this.oldStacks={};this.stacks={};this.stacksTouched=0;this.axis=d;}d.prototype.buildStacks=function(){var d=this.axis,f=d.series,g=H(d.options.reversedStacks,!0),k=f.length,c;if(!d.isXAxis){this.usePercentage=!1;for(c=k;c--;){var q=f[g?c:k-c-1];q.setStackedPoints();q.setGroupedPoints();}for(c=0;c<k;c++)f[c].modifyStacks();G(d,"afterBuildStacks");}};d.prototype.cleanStacks=function(){if(!this.axis.isXAxis){if(this.oldStacks)var d=this.stacks=
this.oldStacks;D(d,function(d){D(d,function(g){g.cumulative=g.total;});});}};d.prototype.resetStacks=function(){var d=this,f=d.stacks;d.axis.isXAxis||D(f,function(g){D(g,function(f,c){f.touched<d.stacksTouched?(f.destroy(),delete g[c]):(f.total=null,f.cumulative=null);});});};d.prototype.renderStackTotals=function(){var d=this.axis,f=d.chart,g=f.renderer,t=this.stacks;d=k(f,d.options.stackLabels.animation);var c=this.stackTotalGroup=this.stackTotalGroup||g.g("stack-labels").attr({visibility:"visible",zIndex:6,
opacity:0}).add();c.translate(f.plotLeft,f.plotTop);D(t,function(g){D(g,function(g){g.render(c);});});c.animate({opacity:1},d);};return d}();return function(){function d(){}d.compose=function(f){x(f,"init",d.onInit);x(f,"destroy",d.onDestroy);};d.onDestroy=function(){var d=this.stacking;if(d){var f=d.stacks;D(f,function(g,d){B(g);f[d]=null;});d&&d.stackTotalGroup&&d.stackTotalGroup.destroy();}};d.onInit=function(){this.stacking||(this.stacking=new t(this));};return d}()});P(k,"Extensions/Stacking.js",[k["Core/Axis/Axis.js"],
k["Core/Chart/Chart.js"],k["Core/Globals.js"],k["Core/Series/Series.js"],k["Core/Axis/StackingAxis.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G){var D=G.correctFloat,H=G.defined,t=G.destroyObjectProperties,C=G.format,l=G.isArray,E=G.isNumber,g=G.pick;var y=function(){function c(c,g,d,f,l){var m=c.chart.inverted;this.axis=c;this.isNegative=d;this.options=g=g||{};this.x=f;this.total=null;this.points={};this.hasValidPoints=!1;this.stack=l;this.rightCliff=this.leftCliff=0;this.alignOptions={align:g.align||
(m?d?"left":"right":"center"),verticalAlign:g.verticalAlign||(m?"middle":d?"bottom":"top"),y:g.y,x:g.x};this.textAlign=g.textAlign||(m?d?"right":"left":"center");}c.prototype.destroy=function(){t(this,this.axis);};c.prototype.render=function(c){var d=this.axis.chart,f=this.options,l=f.format;l=l?C(l,this,d):f.formatter.call(this);this.label?this.label.attr({text:l,visibility:"hidden"}):(this.label=d.renderer.label(l,null,null,f.shape,null,null,f.useHTML,!1,"stack-labels"),l={r:f.borderRadius||0,text:l,
rotation:f.rotation,padding:g(f.padding,5),visibility:"hidden"},d.styledMode||(l.fill=f.backgroundColor,l.stroke=f.borderColor,l["stroke-width"]=f.borderWidth,this.label.css(f.style)),this.label.attr(l),this.label.added||this.label.add(c));this.label.labelrank=d.plotSizeY;};c.prototype.setOffset=function(c,d,f,l,k){var m=this.axis,n=m.chart;l=m.translate(m.stacking.usePercentage?100:l?l:this.total,0,0,0,1);f=m.translate(f?f:0);f=H(l)&&Math.abs(l-f);c=g(k,n.xAxis[0].translate(this.x))+c;m=H(l)&&this.getStackBox(n,
this,c,l,d,f,m);d=this.label;f=this.isNegative;c="justify"===g(this.options.overflow,"justify");var e=this.textAlign;d&&m&&(k=d.getBBox(),l=d.padding,e="left"===e?n.inverted?-l:l:"right"===e?k.width:n.inverted&&"center"===e?k.width/2:n.inverted?f?k.width+l:-l:k.width/2,f=n.inverted?k.height/2:f?-l:k.height,this.alignOptions.x=g(this.options.x,0),this.alignOptions.y=g(this.options.y,0),m.x-=e,m.y-=f,d.align(this.alignOptions,null,m),n.isInsidePlot(d.alignAttr.x+e-this.alignOptions.x,d.alignAttr.y+
f-this.alignOptions.y)?d.show():(d.alignAttr.y=-9999,c=!1),c&&x.prototype.justifyDataLabel.call(this.axis,d,this.alignOptions,d.alignAttr,k,m),d.attr({x:d.alignAttr.x,y:d.alignAttr.y}),g(!c&&this.options.crop,!0)&&((n=E(d.x)&&E(d.y)&&n.isInsidePlot(d.x-l+d.width,d.y)&&n.isInsidePlot(d.x+l,d.y))||d.hide()));};c.prototype.getStackBox=function(c,g,d,f,l,m,k){var e=g.axis.reversed,h=c.inverted,a=k.height+k.pos-(h?c.plotLeft:c.plotTop);g=g.isNegative&&!e||!g.isNegative&&e;return {x:h?g?f-k.right:f-m+k.pos-
c.plotLeft:d+c.xAxis[0].transB-c.plotLeft,y:h?k.height-d-l:g?a-f-m:a-f,width:h?m:l,height:h?l:m}};return c}();d.prototype.getStacks=function(){var c=this,d=c.inverted;c.yAxis.forEach(function(c){c.stacking&&c.stacking.stacks&&c.hasVisibleSeries&&(c.stacking.oldStacks=c.stacking.stacks);});c.series.forEach(function(f){var l=f.xAxis&&f.xAxis.options||{};!f.options.stacking||!0!==f.visible&&!1!==c.options.chart.ignoreHiddenSeries||(f.stackKey=[f.type,g(f.options.stack,""),d?l.top:l.left,d?l.height:l.width].join());});};
B.compose(f);x.prototype.setGroupedPoints=function(){this.options.centerInCategory&&(this.is("column")||this.is("columnrange"))&&!this.options.stacking&&1<this.chart.series.length&&x.prototype.setStackedPoints.call(this,"group");};x.prototype.setStackedPoints=function(c){var d=c||this.options.stacking;if(d&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var f=this.processedXData,k=this.processedYData,t=[],z=k.length,m=this.options,r=m.threshold,e=g(m.startFromThreshold&&r,0);
m=m.stack;c=c?this.type+","+d:this.stackKey;var h="-"+c,a=this.negStacks,b=this.yAxis,w=b.stacking.stacks,C=b.stacking.oldStacks,E,F;b.stacking.stacksTouched+=1;for(F=0;F<z;F++){var x=f[F];var R=k[F];var Q=this.getStackIndicator(Q,x,this.index);var B=Q.key;var v=(E=a&&R<(e?0:r))?h:c;w[v]||(w[v]={});w[v][x]||(C[v]&&C[v][x]?(w[v][x]=C[v][x],w[v][x].total=null):w[v][x]=new y(b,b.options.stackLabels,E,x,m));v=w[v][x];null!==R?(v.points[B]=v.points[this.index]=[g(v.cumulative,e)],H(v.cumulative)||(v.base=
B),v.touched=b.stacking.stacksTouched,0<Q.index&&!1===this.singleStacks&&(v.points[B][0]=v.points[this.index+","+x+",0"][0])):v.points[B]=v.points[this.index]=null;"percent"===d?(E=E?c:h,a&&w[E]&&w[E][x]?(E=w[E][x],v.total=E.total=Math.max(E.total,v.total)+Math.abs(R)||0):v.total=D(v.total+(Math.abs(R)||0))):"group"===d?(l(R)&&(R=R[0]),null!==R&&(v.total=(v.total||0)+1)):v.total=D(v.total+(R||0));v.cumulative="group"===d?(v.total||1)-1:g(v.cumulative,e)+(R||0);null!==R&&(v.points[B].push(v.cumulative),
t[F]=v.cumulative,v.hasValidPoints=!0);}"percent"===d&&(b.stacking.usePercentage=!0);"group"!==d&&(this.stackedYData=t);b.stacking.oldStacks={};}};x.prototype.modifyStacks=function(){var c=this,g=c.stackKey,d=c.yAxis.stacking.stacks,f=c.processedXData,l,k=c.options.stacking;c[k+"Stacker"]&&[g,"-"+g].forEach(function(g){for(var m=f.length,e,h;m--;)if(e=f[m],l=c.getStackIndicator(l,e,c.index,g),h=(e=d[g]&&d[g][e])&&e.points[l.key])c[k+"Stacker"](h,e,m);});};x.prototype.percentStacker=function(c,g,d){g=
g.total?100/g.total:0;c[0]=D(c[0]*g);c[1]=D(c[1]*g);this.stackedYData[d]=c[1];};x.prototype.getStackIndicator=function(c,g,d,f){!H(c)||c.x!==g||f&&c.key!==f?c={x:g,index:0,key:f}:c.index++;c.key=[d,g,c.index].join();return c};k.StackItem=y;return k.StackItem});P(k,"Series/Line/LineSeries.js",[k["Core/Color/Palette.js"],k["Core/Series/Series.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Utilities.js"]],function(f,d,k,x){var B=this&&this.__extends||function(){var d=function(f,k){d=Object.setPrototypeOf||
{__proto__:[]}instanceof Array&&function(d,f){d.__proto__=f;}||function(d,f){for(var g in f)f.hasOwnProperty(g)&&(d[g]=f[g]);};return d(f,k)};return function(f,k){function l(){this.constructor=f;}d(f,k);f.prototype=null===k?Object.create(k):(l.prototype=k.prototype,new l);}}(),G=x.defined,D=x.merge;x=function(k){function t(){var d=null!==k&&k.apply(this,arguments)||this;d.data=void 0;d.options=void 0;d.points=void 0;return d}B(t,k);t.prototype.drawGraph=function(){var d=this,l=this.options,k=(this.gappedPath||
this.getGraphPath).call(this),g=this.chart.styledMode,t=[["graph","highcharts-graph"]];g||t[0].push(l.lineColor||this.color||f.neutralColor20,l.dashStyle);t=d.getZonesGraphs(t);t.forEach(function(c,f){var n=c[0],q=d[n],t=q?"animate":"attr";q?(q.endX=d.preventGraphAnimation?null:k.xMap,q.animate({d:k})):k.length&&(d[n]=q=d.chart.renderer.path(k).addClass(c[1]).attr({zIndex:1}).add(d.group));q&&!g&&(n={stroke:c[2],"stroke-width":l.lineWidth,fill:d.fillGraph&&d.color||"none"},c[3]?n.dashstyle=c[3]:"square"!==
l.linecap&&(n["stroke-linecap"]=n["stroke-linejoin"]="round"),q[t](n).shadow(2>f&&l.shadow));q&&(q.startX=k.xMap,q.isArea=k.isArea);});};t.prototype.getGraphPath=function(d,f,k){var g=this,l=g.options,c=l.step,q,n=[],t=[],E;d=d||g.points;(q=d.reversed)&&d.reverse();(c={right:1,center:2}[c]||c&&3)&&q&&(c=4-c);d=this.getValidPoints(d,!1,!(l.connectNulls&&!f&&!k));d.forEach(function(q,m){var r=q.plotX,e=q.plotY,h=d[m-1];(q.leftCliff||h&&h.rightCliff)&&!k&&(E=!0);q.isNull&&!G(f)&&0<m?E=!l.connectNulls:
q.isNull&&!f?E=!0:(0===m||E?m=[["M",q.plotX,q.plotY]]:g.getPointSpline?m=[g.getPointSpline(d,q,m)]:c?(m=1===c?[["L",h.plotX,e]]:2===c?[["L",(h.plotX+r)/2,h.plotY],["L",(h.plotX+r)/2,e]]:[["L",r,h.plotY]],m.push(["L",r,e])):m=[["L",r,e]],t.push(q.x),c&&(t.push(q.x),2===c&&t.push(q.x)),n.push.apply(n,m),E=!1);});n.xMap=t;return g.graphPath=n};t.prototype.getZonesGraphs=function(d){this.zones.forEach(function(f,k){k=["zone-graph-"+k,"highcharts-graph highcharts-zone-graph-"+k+" "+(f.className||"")];this.chart.styledMode||
k.push(f.color||this.color,f.dashStyle||this.options.dashStyle);d.push(k);},this);return d};t.defaultOptions=D(d.defaultOptions,{});return t}(d);k.registerSeriesType("line",x);return x});P(k,"Series/Area/AreaSeries.js",[k["Core/Color/Color.js"],k["Mixins/LegendSymbol.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Utilities.js"]],function(f,d,k,x){var B=this&&this.__extends||function(){var d=function(f,g){d=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(g,c){g.__proto__=c;}||function(g,
c){for(var d in c)c.hasOwnProperty(d)&&(g[d]=c[d]);};return d(f,g)};return function(f,g){function l(){this.constructor=f;}d(f,g);f.prototype=null===g?Object.create(g):(l.prototype=g.prototype,new l);}}(),G=f.parse,D=k.seriesTypes.line;f=x.extend;var H=x.merge,t=x.objectEach,C=x.pick;x=function(d){function f(){var g=null!==d&&d.apply(this,arguments)||this;g.data=void 0;g.options=void 0;g.points=void 0;return g}B(f,d);f.prototype.drawGraph=function(){this.areaPath=[];d.prototype.drawGraph.apply(this);
var g=this,f=this.areaPath,c=this.options,l=[["area","highcharts-area",this.color,c.fillColor]];this.zones.forEach(function(d,f){l.push(["zone-area-"+f,"highcharts-area highcharts-zone-area-"+f+" "+d.className,d.color||g.color,d.fillColor||c.fillColor]);});l.forEach(function(d){var l=d[0],n=g[l],k=n?"animate":"attr",m={};n?(n.endX=g.preventGraphAnimation?null:f.xMap,n.animate({d:f})):(m.zIndex=0,n=g[l]=g.chart.renderer.path(f).addClass(d[1]).add(g.group),n.isArea=!0);g.chart.styledMode||(m.fill=C(d[3],
G(d[2]).setOpacity(C(c.fillOpacity,.75)).get()));n[k](m);n.startX=f.xMap;n.shiftUnit=c.step?2:1;});};f.prototype.getGraphPath=function(g){var d=D.prototype.getGraphPath,c=this.options,f=c.stacking,l=this.yAxis,k,t=[],z=[],m=this.index,r=l.stacking.stacks[this.stackKey],e=c.threshold,h=Math.round(l.getThreshold(c.threshold));c=C(c.connectNulls,"percent"===f);var a=function(a,b,c){var d=g[a];a=f&&r[d.x].points[m];var k=d[c+"Null"]||0;c=d[c+"Cliff"]||0;d=!0;if(c||k){var n=(k?a[0]:a[1])+c;var q=a[0]+c;
d=!!k;}else !f&&g[b]&&g[b].isNull&&(n=q=e);"undefined"!==typeof n&&(z.push({plotX:w,plotY:null===n?h:l.getThreshold(n),isNull:d,isCliff:!0}),t.push({plotX:w,plotY:null===q?h:l.getThreshold(q),doCurve:!1}));};g=g||this.points;f&&(g=this.getStackPoints(g));for(k=0;k<g.length;k++){f||(g[k].leftCliff=g[k].rightCliff=g[k].leftNull=g[k].rightNull=void 0);var b=g[k].isNull;var w=C(g[k].rectPlotX,g[k].plotX);var E=f?C(g[k].yBottom,h):h;if(!b||c)c||a(k,k-1,"left"),b&&!f&&c||(z.push(g[k]),t.push({x:k,plotX:w,
plotY:E})),c||a(k,k+1,"right");}k=d.call(this,z,!0,!0);t.reversed=!0;b=d.call(this,t,!0,!0);(E=b[0])&&"M"===E[0]&&(b[0]=["L",E[1],E[2]]);b=k.concat(b);d=d.call(this,z,!1,c);b.xMap=k.xMap;this.areaPath=b;return d};f.prototype.getStackPoints=function(d){var g=[],c=[],f=this.xAxis,l=this.yAxis,k=l.stacking.stacks[this.stackKey],E={},z=this.index,m=l.series,r=m.length,e=C(l.options.reversedStacks,!0)?1:-1,h;d=d||this.points;if(this.options.stacking){for(h=0;h<d.length;h++)d[h].leftNull=d[h].rightNull=
void 0,E[d[h].x]=d[h];t(k,function(a,e){null!==a.total&&c.push(e);});c.sort(function(a,c){return a-c});var a=m.map(function(a){return a.visible});c.forEach(function(b,d){var m=0,n,q;if(E[b]&&!E[b].isNull)g.push(E[b]),[-1,1].forEach(function(g){var f=1===g?"rightNull":"leftNull",m=0,l=k[c[d+g]];if(l)for(h=z;0<=h&&h<r;)n=l.points[h],n||(h===z?E[b][f]=!0:a[h]&&(q=k[b].points[h])&&(m-=q[1]-q[0])),h+=e;E[b][1===g?"rightCliff":"leftCliff"]=m;});else {for(h=z;0<=h&&h<r;){if(n=k[b].points[h]){m=n[1];break}h+=
e;}m=l.translate(m,0,1,0,1);g.push({isNull:!0,plotX:f.translate(b,0,0,0,1),x:b,plotY:m,yBottom:m});}});}return g};f.defaultOptions=H(D.defaultOptions,{threshold:0});return f}(D);f(x.prototype,{singleStacks:!1,drawLegendSymbol:d.drawRectangle});k.registerSeriesType("area",x);return x});P(k,"Series/Spline/SplineSeries.js",[k["Core/Series/SeriesRegistry.js"],k["Core/Utilities.js"]],function(f,d){var k=this&&this.__extends||function(){var d=function(f,k){d=Object.setPrototypeOf||{__proto__:[]}instanceof
Array&&function(d,f){d.__proto__=f;}||function(d,f){for(var l in f)f.hasOwnProperty(l)&&(d[l]=f[l]);};return d(f,k)};return function(f,k){function t(){this.constructor=f;}d(f,k);f.prototype=null===k?Object.create(k):(t.prototype=k.prototype,new t);}}(),x=f.seriesTypes.line,B=d.merge,G=d.pick;d=function(d){function f(){var f=null!==d&&d.apply(this,arguments)||this;f.data=void 0;f.options=void 0;f.points=void 0;return f}k(f,d);f.prototype.getPointSpline=function(d,f,l){var k=f.plotX||0,g=f.plotY||0,t=d[l-
1];l=d[l+1];if(t&&!t.isNull&&!1!==t.doCurve&&!f.isCliff&&l&&!l.isNull&&!1!==l.doCurve&&!f.isCliff){d=t.plotY||0;var c=l.plotX||0;l=l.plotY||0;var q=0;var n=(1.5*k+(t.plotX||0))/2.5;var x=(1.5*g+d)/2.5;c=(1.5*k+c)/2.5;var C=(1.5*g+l)/2.5;c!==n&&(q=(C-x)*(c-k)/(c-n)+g-C);x+=q;C+=q;x>d&&x>g?(x=Math.max(d,g),C=2*g-x):x<d&&x<g&&(x=Math.min(d,g),C=2*g-x);C>l&&C>g?(C=Math.max(l,g),x=2*g-C):C<l&&C<g&&(C=Math.min(l,g),x=2*g-C);f.rightContX=c;f.rightContY=C;}f=["C",G(t.rightContX,t.plotX,0),G(t.rightContY,t.plotY,
0),G(n,k,0),G(x,g,0),k,g];t.rightContX=t.rightContY=void 0;return f};f.defaultOptions=B(x.defaultOptions);return f}(x);f.registerSeriesType("spline",d);return d});P(k,"Series/AreaSpline/AreaSplineSeries.js",[k["Series/Area/AreaSeries.js"],k["Series/Spline/SplineSeries.js"],k["Mixins/LegendSymbol.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Utilities.js"]],function(f,d,k,x,B){var G=this&&this.__extends||function(){var d=function(f,k){d=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,
f){d.__proto__=f;}||function(d,f){for(var c in f)f.hasOwnProperty(c)&&(d[c]=f[c]);};return d(f,k)};return function(f,k){function g(){this.constructor=f;}d(f,k);f.prototype=null===k?Object.create(k):(g.prototype=k.prototype,new g);}}(),D=f.prototype,H=B.extend,t=B.merge;B=function(k){function l(){var d=null!==k&&k.apply(this,arguments)||this;d.data=void 0;d.points=void 0;d.options=void 0;return d}G(l,k);l.defaultOptions=t(d.defaultOptions,f.defaultOptions);return l}(d);H(B.prototype,{getGraphPath:D.getGraphPath,
getStackPoints:D.getStackPoints,drawGraph:D.drawGraph,drawLegendSymbol:k.drawRectangle});x.registerSeriesType("areaspline",B);return B});P(k,"Series/Column/ColumnSeries.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Color/Color.js"],k["Core/Globals.js"],k["Mixins/LegendSymbol.js"],k["Core/Color/Palette.js"],k["Core/Series/Series.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G,D,H){var t=this&&this.__extends||function(){var c=function(e,a){c=Object.setPrototypeOf||
{__proto__:[]}instanceof Array&&function(a,c){a.__proto__=c;}||function(a,c){for(var b in c)c.hasOwnProperty(b)&&(a[b]=c[b]);};return c(e,a)};return function(e,a){function b(){this.constructor=e;}c(e,a);e.prototype=null===a?Object.create(a):(b.prototype=a.prototype,new b);}}(),C=f.animObject,l=d.parse,E=k.hasTouch;f=k.noop;var g=H.clamp,y=H.css,c=H.defined,q=H.extend,n=H.fireEvent,A=H.isArray,M=H.isNumber,z=H.merge,m=H.pick,r=H.objectEach;H=function(e){function d(){var a=null!==e&&e.apply(this,arguments)||
this;a.borderWidth=void 0;a.data=void 0;a.group=void 0;a.options=void 0;a.points=void 0;return a}t(d,e);d.prototype.animate=function(a){var b=this,c=this.yAxis,e=b.options,d=this.chart.inverted,f={},h=d?"translateX":"translateY";if(a)f.scaleY=.001,a=g(c.toPixels(e.threshold),c.pos,c.pos+c.len),d?f.translateX=a-c.len:f.translateY=a,b.clipBox&&b.setClip(),b.group.attr(f);else {var m=b.group.attr(h);b.group.animate({scaleY:1},q(C(b.options.animation),{step:function(a,e){b.group&&(f[h]=m+e.pos*(c.pos-
m),b.group.attr(f));}}));}};d.prototype.init=function(a,b){e.prototype.init.apply(this,arguments);var c=this;a=c.chart;a.hasRendered&&a.series.forEach(function(a){a.type===c.type&&(a.isDirty=!0);});};d.prototype.getColumnMetrics=function(){var a=this,b=a.options,c=a.xAxis,e=a.yAxis,d=c.options.reversedStacks;d=c.reversed&&!d||!c.reversed&&d;var g,f={},h=0;!1===b.grouping?h=1:a.chart.series.forEach(function(b){var c=b.yAxis,d=b.options;if(b.type===a.type&&(b.visible||!a.chart.options.chart.ignoreHiddenSeries)&&
e.len===c.len&&e.pos===c.pos){if(d.stacking&&"group"!==d.stacking){g=b.stackKey;"undefined"===typeof f[g]&&(f[g]=h++);var m=f[g];}else !1!==d.grouping&&(m=h++);b.columnIndex=m;}});var l=Math.min(Math.abs(c.transA)*(c.ordinal&&c.ordinal.slope||b.pointRange||c.closestPointRange||c.tickInterval||1),c.len),k=l*b.groupPadding,n=(l-2*k)/(h||1);b=Math.min(b.maxPointWidth||c.len,m(b.pointWidth,n*(1-2*b.pointPadding)));a.columnMetrics={width:b,offset:(n-b)/2+(k+((a.columnIndex||0)+(d?1:0))*n-l/2)*(d?-1:1),paddedWidth:n,
columnCount:h};return a.columnMetrics};d.prototype.crispCol=function(a,b,c,e){var d=this.chart,g=this.borderWidth,f=-(g%2?.5:0);g=g%2?.5:1;d.inverted&&d.renderer.isVML&&(g+=1);this.options.crisp&&(c=Math.round(a+c)+f,a=Math.round(a)+f,c-=a);e=Math.round(b+e)+g;f=.5>=Math.abs(b)&&.5<e;b=Math.round(b)+g;e-=b;f&&e&&(--b,e+=1);return {x:a,y:b,width:c,height:e}};d.prototype.adjustForMissingColumns=function(a,b,c,e){var d=this,g=this.options.stacking;if(!c.isNull&&1<e.columnCount){var f=0,h=0;r(this.yAxis.stacking&&
this.yAxis.stacking.stacks,function(a){if("number"===typeof c.x&&(a=a[c.x.toString()])){var b=a.points[d.index],e=a.total;g?(b&&(f=h),a.hasValidPoints&&h++):A(b)&&(f=b[1],h=e||0);}});a=(c.plotX||0)+((h-1)*e.paddedWidth+b)/2-b-f*e.paddedWidth;}return a};d.prototype.translate=function(){var a=this,b=a.chart,e=a.options,d=a.dense=2>a.closestPointRange*a.xAxis.transA;d=a.borderWidth=m(e.borderWidth,d?0:1);var f=a.xAxis,h=a.yAxis,l=e.threshold,k=a.translatedThreshold=h.getThreshold(l),n=m(e.minPointLength,
5),q=a.getColumnMetrics(),r=q.width,t=a.barW=Math.max(r,1+2*d),p=a.pointXOffset=q.offset,y=a.dataMin,z=a.dataMax;b.inverted&&(k-=.5);e.pointPadding&&(t=Math.ceil(t));G.prototype.translate.apply(a);a.points.forEach(function(d){var w=m(d.yBottom,k),v=999+Math.abs(w),F=r,x=d.plotX||0;v=g(d.plotY,-v,h.len+v);var E=x+p,C=t,A=Math.min(v,w),B=Math.max(v,w)-A;if(n&&Math.abs(B)<n){B=n;var H=!h.reversed&&!d.negative||h.reversed&&d.negative;M(l)&&M(z)&&d.y===l&&z<=l&&(h.min||0)<l&&(y!==z||(h.max||0)<=l)&&(H=
!H);A=Math.abs(A-k)>n?w-n:k-(H?n:0);}c(d.options.pointWidth)&&(F=C=Math.ceil(d.options.pointWidth),E-=Math.round((F-r)/2));e.centerInCategory&&(E=a.adjustForMissingColumns(E,F,d,q));d.barX=E;d.pointWidth=F;d.tooltipPos=b.inverted?[g(h.len+h.pos-b.plotLeft-v,h.pos-b.plotLeft,h.len+h.pos-b.plotLeft),f.len+f.pos-b.plotTop-(x||0)-p-C/2,B]:[f.left-b.plotLeft+E+C/2,g(v+h.pos-b.plotTop,h.pos-b.plotTop,h.len+h.pos-b.plotTop),B];d.shapeType=a.pointClass.prototype.shapeType||"rect";d.shapeArgs=a.crispCol.apply(a,
d.isNull?[E,k,C,0]:[E,A,C,B]);});};d.prototype.drawGraph=function(){this.group[this.dense?"addClass":"removeClass"]("highcharts-dense-data");};d.prototype.pointAttribs=function(a,b){var c=this.options,e=this.pointAttrToOptions||{};var d=e.stroke||"borderColor";var g=e["stroke-width"]||"borderWidth",f=a&&a.color||this.color,h=a&&a[d]||c[d]||this.color||f,k=a&&a[g]||c[g]||this[g]||0;e=a&&a.options.dashStyle||c.dashStyle;var n=m(a&&a.opacity,c.opacity,1);if(a&&this.zones.length){var q=a.getZone();f=a.options.color||
q&&(q.color||a.nonZonedColor)||this.color;q&&(h=q.borderColor||h,e=q.dashStyle||e,k=q.borderWidth||k);}b&&a&&(a=z(c.states[b],a.options.states&&a.options.states[b]||{}),b=a.brightness,f=a.color||"undefined"!==typeof b&&l(f).brighten(a.brightness).get()||f,h=a[d]||h,k=a[g]||k,e=a.dashStyle||e,n=m(a.opacity,n));d={fill:f,stroke:h,"stroke-width":k,opacity:n};e&&(d.dashstyle=e);return d};d.prototype.drawPoints=function(){var a=this,b=this.chart,c=a.options,e=b.renderer,d=c.animationLimit||250,g;a.points.forEach(function(f){var h=
f.graphic,m=!!h,l=h&&b.pointCount<d?"animate":"attr";if(M(f.plotY)&&null!==f.y){g=f.shapeArgs;h&&f.hasNewShapeType()&&(h=h.destroy());a.enabledDataSorting&&(f.startXPos=a.xAxis.reversed?-(g?g.width:0):a.xAxis.width);h||(f.graphic=h=e[f.shapeType](g).add(f.group||a.group))&&a.enabledDataSorting&&b.hasRendered&&b.pointCount<d&&(h.attr({x:f.startXPos}),m=!0,l="animate");if(h&&m)h[l](z(g));if(c.borderRadius)h[l]({r:c.borderRadius});b.styledMode||h[l](a.pointAttribs(f,f.selected&&"select")).shadow(!1!==
f.allowShadow&&c.shadow,null,c.stacking&&!c.borderRadius);h&&(h.addClass(f.getClassName(),!0),h.attr({visibility:f.visible?"inherit":"hidden"}));}else h&&(f.graphic=h.destroy());});};d.prototype.drawTracker=function(){var a=this,b=a.chart,c=b.pointer,e=function(a){var b=c.getPointFromEvent(a);"undefined"!==typeof b&&(c.isDirectTouch=!0,b.onMouseOver(a));},d;a.points.forEach(function(a){d=A(a.dataLabels)?a.dataLabels:a.dataLabel?[a.dataLabel]:[];a.graphic&&(a.graphic.element.point=a);d.forEach(function(b){b.div?
b.div.point=a:b.element.point=a;});});a._hasTracking||(a.trackerGroups.forEach(function(d){if(a[d]){a[d].addClass("highcharts-tracker").on("mouseover",e).on("mouseout",function(a){c.onTrackerMouseOut(a);});if(E)a[d].on("touchstart",e);!b.styledMode&&a.options.cursor&&a[d].css(y).css({cursor:a.options.cursor});}}),a._hasTracking=!0);n(this,"afterDrawTracker");};d.prototype.remove=function(){var a=this,b=a.chart;b.hasRendered&&b.series.forEach(function(b){b.type===a.type&&(b.isDirty=!0);});G.prototype.remove.apply(a,
arguments);};d.defaultOptions=z(G.defaultOptions,{borderRadius:0,centerInCategory:!1,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{halo:!1,brightness:.1},select:{color:B.neutralColor20,borderColor:B.neutralColor100}},dataLabels:{align:void 0,verticalAlign:void 0,y:void 0},startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0,borderColor:B.backgroundColor});return d}(G);q(H.prototype,{cropShoulder:0,directTouch:!0,drawLegendSymbol:x.drawRectangle,
getSymbol:f,negStacks:!0,trackerGroups:["group","dataLabelsGroup"]});D.registerSeriesType("column",H);return H});P(k,"Series/Bar/BarSeries.js",[k["Series/Column/ColumnSeries.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Utilities.js"]],function(f,d,k){var x=this&&this.__extends||function(){var d=function(f,k){d=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,f){d.__proto__=f;}||function(d,f){for(var l in f)f.hasOwnProperty(l)&&(d[l]=f[l]);};return d(f,k)};return function(f,
k){function t(){this.constructor=f;}d(f,k);f.prototype=null===k?Object.create(k):(t.prototype=k.prototype,new t);}}(),B=k.extend,G=k.merge;k=function(d){function k(){var f=null!==d&&d.apply(this,arguments)||this;f.data=void 0;f.options=void 0;f.points=void 0;return f}x(k,d);k.defaultOptions=G(f.defaultOptions,{});return k}(f);B(k.prototype,{inverted:!0});d.registerSeriesType("bar",k);return k});P(k,"Series/Scatter/ScatterSeries.js",[k["Series/Column/ColumnSeries.js"],k["Series/Line/LineSeries.js"],
k["Core/Series/SeriesRegistry.js"],k["Core/Utilities.js"]],function(f,d,k,x){var B=this&&this.__extends||function(){var d=function(f,l){d=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,g){d.__proto__=g;}||function(d,g){for(var f in g)g.hasOwnProperty(f)&&(d[f]=g[f]);};return d(f,l)};return function(f,l){function k(){this.constructor=f;}d(f,l);f.prototype=null===l?Object.create(l):(k.prototype=l.prototype,new k);}}(),G=x.addEvent,D=x.extend,H=x.merge;x=function(f){function k(){var d=
null!==f&&f.apply(this,arguments)||this;d.data=void 0;d.options=void 0;d.points=void 0;return d}B(k,f);k.prototype.applyJitter=function(){var d=this,f=this.options.jitter,g=this.points.length;f&&this.points.forEach(function(l,c){["x","y"].forEach(function(k,n){var q="plot"+k.toUpperCase();if(f[k]&&!l.isNull){var t=d[k+"Axis"];var z=f[k]*t.transA;if(t&&!t.isLog){var m=Math.max(0,l[q]-z);t=Math.min(t.len,l[q]+z);n=1E4*Math.sin(c+n*g);l[q]=m+(t-m)*(n-Math.floor(n));"x"===k&&(l.clientX=l.plotX);}}});});};
k.prototype.drawGraph=function(){(this.options.lineWidth||0===this.options.lineWidth&&this.graph&&this.graph.strokeWidth())&&f.prototype.drawGraph.call(this);};k.defaultOptions=H(d.defaultOptions,{lineWidth:0,findNearestPointBy:"xy",jitter:{x:0,y:0},marker:{enabled:!0},tooltip:{headerFormat:'<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {series.name}</span><br/>',pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}});return k}(d);D(x.prototype,{drawTracker:f.prototype.drawTracker,
sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1});G(x,"afterTranslate",function(){this.applyJitter();});k.registerSeriesType("scatter",x);return x});P(k,"Mixins/CenteredSeries.js",[k["Core/Globals.js"],k["Core/Series/Series.js"],k["Core/Utilities.js"]],function(f,d,k){var x=k.isNumber,B=k.pick,G=k.relativeLength,D=f.deg2rad;return f.CenteredSeriesMixin={getCenter:function(){var f=this.options,k=this.chart,x=2*(f.slicedOffset||
0),l=k.plotWidth-2*x,E=k.plotHeight-2*x,g=f.center,y=Math.min(l,E),c=f.size,q=f.innerSize||0;"string"===typeof c&&(c=parseFloat(c));"string"===typeof q&&(q=parseFloat(q));f=[B(g[0],"50%"),B(g[1],"50%"),B(c&&0>c?void 0:f.size,"100%"),B(q&&0>q?void 0:f.innerSize||0,"0%")];!k.angular||this instanceof d||(f[3]=0);for(g=0;4>g;++g)c=f[g],k=2>g||2===g&&/%$/.test(c),f[g]=G(c,[l,E,y,f[2]][g])+(k?x:0);f[3]>f[2]&&(f[3]=f[2]);return f},getStartAndEndRadians:function(d,f){d=x(d)?d:0;f=x(f)&&f>d&&360>f-d?f:d+360;
return {start:D*(d+-90),end:D*(f+-90)}}}});P(k,"Series/Pie/PiePoint.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Series/Point.js"],k["Core/Utilities.js"]],function(f,d,k){var x=this&&this.__extends||function(){var d=function(f,g){d=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,c){d.__proto__=c;}||function(d,c){for(var g in c)c.hasOwnProperty(g)&&(d[g]=c[g]);};return d(f,g)};return function(f,g){function l(){this.constructor=f;}d(f,g);f.prototype=null===g?Object.create(g):
(l.prototype=g.prototype,new l);}}(),B=f.setAnimation,G=k.addEvent,D=k.defined;f=k.extend;var H=k.isNumber,t=k.pick,C=k.relativeLength;k=function(f){function l(){var d=null!==f&&f.apply(this,arguments)||this;d.labelDistance=void 0;d.options=void 0;d.series=void 0;return d}x(l,f);l.prototype.getConnectorPath=function(){var d=this.labelPosition,f=this.series.options.dataLabels,c=f.connectorShape,l=this.connectorShapes;l[c]&&(c=l[c]);return c.call(this,{x:d.final.x,y:d.final.y,alignment:d.alignment},
d.connectorPosition,f)};l.prototype.getTranslate=function(){return this.sliced?this.slicedTranslation:{translateX:0,translateY:0}};l.prototype.haloPath=function(d){var f=this.shapeArgs;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(f.x,f.y,f.r+d,f.r+d,{innerR:f.r-1,start:f.start,end:f.end})};l.prototype.init=function(){d.prototype.init.apply(this,arguments);var f=this;f.name=t(f.name,"Slice");var l=function(c){f.slice("select"===c.type);};G(f,"select",l);G(f,"unselect",
l);return f};l.prototype.isValid=function(){return H(this.y)&&0<=this.y};l.prototype.setVisible=function(d,f){var c=this,g=c.series,l=g.chart,k=g.options.ignoreHiddenPoint;f=t(f,k);d!==c.visible&&(c.visible=c.options.visible=d="undefined"===typeof d?!c.visible:d,g.options.data[g.data.indexOf(c)]=c.options,["graphic","dataLabel","connector","shadowGroup"].forEach(function(f){if(c[f])c[f][d?"show":"hide"](d);}),c.legendItem&&l.legend.colorizeItem(c,d),d||"hover"!==c.state||c.setState(""),k&&(g.isDirty=
!0),f&&l.redraw());};l.prototype.slice=function(d,f,c){var g=this.series;B(c,g.chart);t(f,!0);this.sliced=this.options.sliced=D(d)?d:!this.sliced;g.options.data[g.data.indexOf(this)]=this.options;this.graphic&&this.graphic.animate(this.getTranslate());this.shadowGroup&&this.shadowGroup.animate(this.getTranslate());};return l}(d);f(k.prototype,{connectorShapes:{fixedOffset:function(d,f,g){var l=f.breakAt;f=f.touchingSliceAt;return [["M",d.x,d.y],g.softConnector?["C",d.x+("left"===d.alignment?-5:5),d.y,
2*l.x-f.x,2*l.y-f.y,l.x,l.y]:["L",l.x,l.y],["L",f.x,f.y]]},straight:function(d,f){f=f.touchingSliceAt;return [["M",d.x,d.y],["L",f.x,f.y]]},crookedLine:function(d,f,g){f=f.touchingSliceAt;var l=this.series,c=l.center[0],k=l.chart.plotWidth,n=l.chart.plotLeft;l=d.alignment;var t=this.shapeArgs.r;g=C(g.crookDistance,1);k="left"===l?c+t+(k+n-c-t)*(1-g):n+(c-t)*g;g=["L",k,d.y];c=!0;if("left"===l?k>d.x||k<f.x:k<d.x||k>f.x)c=!1;d=[["M",d.x,d.y]];c&&d.push(g);d.push(["L",f.x,f.y]);return d}}});return k});
P(k,"Series/Pie/PieSeries.js",[k["Mixins/CenteredSeries.js"],k["Series/Column/ColumnSeries.js"],k["Core/Globals.js"],k["Mixins/LegendSymbol.js"],k["Core/Color/Palette.js"],k["Series/Pie/PiePoint.js"],k["Core/Series/Series.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Renderer/SVG/SVGRenderer.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G,D,H,t,C){var l=this&&this.__extends||function(){var c=function(d,f){c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(c,e){c.__proto__=e;}||function(c,
e){for(var d in e)e.hasOwnProperty(d)&&(c[d]=e[d]);};return c(d,f)};return function(d,f){function g(){this.constructor=d;}c(d,f);d.prototype=null===f?Object.create(f):(g.prototype=f.prototype,new g);}}(),E=f.getStartAndEndRadians;k=k.noop;var g=C.clamp,y=C.extend,c=C.fireEvent,q=C.merge,n=C.pick,A=C.relativeLength;C=function(d){function f(){var c=null!==d&&d.apply(this,arguments)||this;c.center=void 0;c.data=void 0;c.maxLabelDistance=void 0;c.options=void 0;c.points=void 0;return c}l(f,d);f.prototype.animate=
function(c){var d=this,e=d.points,f=d.startAngleRad;c||e.forEach(function(a){var b=a.graphic,c=a.shapeArgs;b&&c&&(b.attr({r:n(a.startR,d.center&&d.center[3]/2),start:f,end:f}),b.animate({r:c.r,start:c.start,end:c.end},d.options.animation));});};f.prototype.drawEmpty=function(){var c=this.startAngleRad,d=this.endAngleRad,e=this.options;if(0===this.total&&this.center){var f=this.center[0];var a=this.center[1];this.graph||(this.graph=this.chart.renderer.arc(f,a,this.center[1]/2,0,c,d).addClass("highcharts-empty-series").add(this.group));
this.graph.attr({d:t.prototype.symbols.arc(f,a,this.center[2]/2,0,{start:c,end:d,innerR:this.center[3]/2})});this.chart.styledMode||this.graph.attr({"stroke-width":e.borderWidth,fill:e.fillColor||"none",stroke:e.color||B.neutralColor20});}else this.graph&&(this.graph=this.graph.destroy());};f.prototype.drawPoints=function(){var c=this.chart.renderer;this.points.forEach(function(d){d.graphic&&d.hasNewShapeType()&&(d.graphic=d.graphic.destroy());d.graphic||(d.graphic=c[d.shapeType](d.shapeArgs).add(d.series.group),
d.delayedRendering=!0);});};f.prototype.generatePoints=function(){d.prototype.generatePoints.call(this);this.updateTotals();};f.prototype.getX=function(c,d,e){var f=this.center,a=this.radii?this.radii[e.index]||0:f[2]/2;c=Math.asin(g((c-f[1])/(a+e.labelDistance),-1,1));return f[0]+(d?-1:1)*Math.cos(c)*(a+e.labelDistance)+(0<e.labelDistance?(d?-1:1)*this.options.dataLabels.padding:0)};f.prototype.hasData=function(){return !!this.processedXData.length};f.prototype.redrawPoints=function(){var c=this,d=c.chart,
e=d.renderer,f,a,b,g,l=c.options.shadow;this.drawEmpty();!l||c.shadowGroup||d.styledMode||(c.shadowGroup=e.g("shadow").attr({zIndex:-1}).add(c.group));c.points.forEach(function(h){var m={};a=h.graphic;if(!h.isNull&&a){g=h.shapeArgs;f=h.getTranslate();if(!d.styledMode){var k=h.shadowGroup;l&&!k&&(k=h.shadowGroup=e.g("shadow").add(c.shadowGroup));k&&k.attr(f);b=c.pointAttribs(h,h.selected&&"select");}h.delayedRendering?(a.setRadialReference(c.center).attr(g).attr(f),d.styledMode||a.attr(b).attr({"stroke-linejoin":"round"}).shadow(l,
k),h.delayedRendering=!1):(a.setRadialReference(c.center),d.styledMode||q(!0,m,b),q(!0,m,g,f),a.animate(m));a.attr({visibility:h.visible?"inherit":"hidden"});a.addClass(h.getClassName(),!0);}else a&&(h.graphic=a.destroy());});};f.prototype.sortByAngle=function(c,d){c.sort(function(c,f){return "undefined"!==typeof c.angle&&(f.angle-c.angle)*d});};f.prototype.translate=function(d){this.generatePoints();var f=0,e=this.options,g=e.slicedOffset,a=g+(e.borderWidth||0),b=E(e.startAngle,e.endAngle),m=this.startAngleRad=
b.start;b=(this.endAngleRad=b.end)-m;var l=this.points,k=e.dataLabels.distance;e=e.ignoreHiddenPoint;var q,t=l.length;d||(this.center=d=this.getCenter());for(q=0;q<t;q++){var z=l[q];var x=m+f*b;!z.isValid()||e&&!z.visible||(f+=z.percentage/100);var y=m+f*b;z.shapeType="arc";z.shapeArgs={x:d[0],y:d[1],r:d[2]/2,innerR:d[3]/2,start:Math.round(1E3*x)/1E3,end:Math.round(1E3*y)/1E3};z.labelDistance=n(z.options.dataLabels&&z.options.dataLabels.distance,k);z.labelDistance=A(z.labelDistance,z.shapeArgs.r);
this.maxLabelDistance=Math.max(this.maxLabelDistance||0,z.labelDistance);y=(y+x)/2;y>1.5*Math.PI?y-=2*Math.PI:y<-Math.PI/2&&(y+=2*Math.PI);z.slicedTranslation={translateX:Math.round(Math.cos(y)*g),translateY:Math.round(Math.sin(y)*g)};var v=Math.cos(y)*d[2]/2;var C=Math.sin(y)*d[2]/2;z.tooltipPos=[d[0]+.7*v,d[1]+.7*C];z.half=y<-Math.PI/2||y>Math.PI/2?1:0;z.angle=y;x=Math.min(a,z.labelDistance/5);z.labelPosition={natural:{x:d[0]+v+Math.cos(y)*z.labelDistance,y:d[1]+C+Math.sin(y)*z.labelDistance},"final":{},
alignment:0>z.labelDistance?"center":z.half?"right":"left",connectorPosition:{breakAt:{x:d[0]+v+Math.cos(y)*x,y:d[1]+C+Math.sin(y)*x},touchingSliceAt:{x:d[0]+v,y:d[1]+C}}};}c(this,"afterTranslate");};f.prototype.updateTotals=function(){var c,d=0,e=this.points,f=e.length,a=this.options.ignoreHiddenPoint;for(c=0;c<f;c++){var b=e[c];!b.isValid()||a&&!b.visible||(d+=b.y);}this.total=d;for(c=0;c<f;c++)b=e[c],b.percentage=0<d&&(b.visible||!a)?b.y/d*100:0,b.total=d;};f.defaultOptions=q(D.defaultOptions,{center:[null,
null],clip:!1,colorByPoint:!0,dataLabels:{allowOverlap:!0,connectorPadding:5,connectorShape:"fixedOffset",crookDistance:"70%",distance:30,enabled:!0,formatter:function(){return this.point.isNull?void 0:this.point.name},softConnector:!0,x:0},fillColor:void 0,ignoreHiddenPoint:!0,inactiveOtherPoints:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,stickyTracking:!1,tooltip:{followPointer:!0},borderColor:B.backgroundColor,borderWidth:1,lineWidth:void 0,states:{hover:{brightness:.1}}});
return f}(D);y(C.prototype,{axisTypes:[],directTouch:!0,drawGraph:null,drawLegendSymbol:x.drawRectangle,drawTracker:d.prototype.drawTracker,getCenter:f.getCenter,getSymbol:k,isCartesian:!1,noSharedTooltip:!0,pointAttribs:d.prototype.pointAttribs,pointClass:G,requireSorting:!1,searchPoint:k,trackerGroups:["group","dataLabelsGroup"]});H.registerSeriesType("pie",C);return C});P(k,"Core/Series/DataLabels.js",[k["Core/Animation/AnimationUtilities.js"],k["Core/Globals.js"],k["Core/Color/Palette.js"],
k["Core/Series/Series.js"],k["Core/Series/SeriesRegistry.js"],k["Core/Utilities.js"]],function(f,d,k,x,B,G){var D=f.getDeferredAnimation;f=d.noop;B=B.seriesTypes;var H=G.arrayMax,t=G.clamp,C=G.defined,l=G.extend,E=G.fireEvent,g=G.format,y=G.isArray,c=G.merge,q=G.objectEach,n=G.pick,A=G.relativeLength,M=G.splat,z=G.stableSort;d.distribute=function(c,f,e){function g(a,b){return a.target-b.target}var a,b=!0,m=c,l=[];var k=0;var q=m.reducedLen||f;for(a=c.length;a--;)k+=c[a].size;if(k>q){z(c,function(a,
b){return (b.rank||0)-(a.rank||0)});for(k=a=0;k<=q;)k+=c[a].size,a++;l=c.splice(a-1,c.length);}z(c,g);for(c=c.map(function(a){return {size:a.size,targets:[a.target],align:n(a.align,.5)}});b;){for(a=c.length;a--;)b=c[a],k=(Math.min.apply(0,b.targets)+Math.max.apply(0,b.targets))/2,b.pos=t(k-b.size*b.align,0,f-b.size);a=c.length;for(b=!1;a--;)0<a&&c[a-1].pos+c[a-1].size>c[a].pos&&(c[a-1].size+=c[a].size,c[a-1].targets=c[a-1].targets.concat(c[a].targets),c[a-1].align=.5,c[a-1].pos+c[a-1].size>f&&(c[a-1].pos=
f-c[a-1].size),c.splice(a,1),b=!0);}m.push.apply(m,l);a=0;c.some(function(b){var c=0;if(b.targets.some(function(){m[a].pos=b.pos+c;if("undefined"!==typeof e&&Math.abs(m[a].pos-m[a].target)>e)return m.slice(0,a+1).forEach(function(a){delete a.pos;}),m.reducedLen=(m.reducedLen||f)-.1*f,m.reducedLen>.1*f&&d.distribute(m,f,e),!0;c+=m[a].size;a++;}))return !0});z(m,g);};x.prototype.drawDataLabels=function(){function d(a,b){var c=b.filter;return c?(b=c.operator,a=a[c.property],c=c.value,">"===b&&a>c||"<"===
b&&a<c||">="===b&&a>=c||"<="===b&&a<=c||"=="===b&&a==c||"==="===b&&a===c?!0:!1):!0}function f(a,b){var d=[],e;if(y(a)&&!y(b))d=a.map(function(a){return c(a,b)});else if(y(b)&&!y(a))d=b.map(function(b){return c(a,b)});else if(y(a)||y(b))for(e=Math.max(a.length,b.length);e--;)d[e]=c(a[e],b[e]);else d=c(a,b);return d}var e=this,h=e.chart,a=e.options,b=a.dataLabels,l=e.points,t,z=e.hasRendered||0,x=b.animation;x=b.defer?D(h,x,e):{defer:0,duration:0};var A=h.renderer;b=f(f(h.options.plotOptions&&h.options.plotOptions.series&&
h.options.plotOptions.series.dataLabels,h.options.plotOptions&&h.options.plotOptions[e.type]&&h.options.plotOptions[e.type].dataLabels),b);E(this,"drawDataLabels");if(y(b)||b.enabled||e._hasPointLabels){var B=e.plotGroup("dataLabelsGroup","data-labels",z?"inherit":"hidden",b.zIndex||6);B.attr({opacity:+z});!z&&(z=e.dataLabelsGroup)&&(e.visible&&B.show(!0),z[a.animation?"animate":"attr"]({opacity:1},x));l.forEach(function(c){t=M(f(b,c.dlOptions||c.options&&c.options.dataLabels));t.forEach(function(b,
f){var m=b.enabled&&(!c.isNull||c.dataLabelOnNull)&&d(c,b),l=c.dataLabels?c.dataLabels[f]:c.dataLabel,r=c.connectors?c.connectors[f]:c.connector,t=n(b.distance,c.labelDistance),w=!l;if(m){var u=c.getLabelConfig();var v=n(b[c.formatPrefix+"Format"],b.format);u=C(v)?g(v,u,h):(b[c.formatPrefix+"Formatter"]||b.formatter).call(u,b);v=b.style;var z=b.rotation;h.styledMode||(v.color=n(b.color,v.color,e.color,k.neutralColor100),"contrast"===v.color?(c.contrastColor=A.getContrast(c.color||e.color),v.color=
!C(t)&&b.inside||0>t||a.stacking?c.contrastColor:k.neutralColor100):delete c.contrastColor,a.cursor&&(v.cursor=a.cursor));var x={r:b.borderRadius||0,rotation:z,padding:b.padding,zIndex:1};h.styledMode||(x.fill=b.backgroundColor,x.stroke=b.borderColor,x["stroke-width"]=b.borderWidth);q(x,function(a,b){"undefined"===typeof a&&delete x[b];});}!l||m&&C(u)?m&&C(u)&&(l?x.text=u:(c.dataLabels=c.dataLabels||[],l=c.dataLabels[f]=z?A.text(u,0,-9999,b.useHTML).addClass("highcharts-data-label"):A.label(u,0,-9999,
b.shape,null,null,b.useHTML,null,"data-label"),f||(c.dataLabel=l),l.addClass(" highcharts-data-label-color-"+c.colorIndex+" "+(b.className||"")+(b.useHTML?" highcharts-tracker":""))),l.options=b,l.attr(x),h.styledMode||l.css(v).shadow(b.shadow),l.added||l.add(B),b.textPath&&!b.useHTML&&(l.setTextPath(c.getDataLabelPath&&c.getDataLabelPath(l)||c.graphic,b.textPath),c.dataLabelPath&&!b.textPath.enabled&&(c.dataLabelPath=c.dataLabelPath.destroy())),e.alignDataLabel(c,l,b,null,w)):(c.dataLabel=c.dataLabel&&
c.dataLabel.destroy(),c.dataLabels&&(1===c.dataLabels.length?delete c.dataLabels:delete c.dataLabels[f]),f||delete c.dataLabel,r&&(c.connector=c.connector.destroy(),c.connectors&&(1===c.connectors.length?delete c.connectors:delete c.connectors[f])));});});}E(this,"afterDrawDataLabels");};x.prototype.alignDataLabel=function(c,d,e,f,a){var b=this,g=this.chart,h=this.isCartesian&&g.inverted,m=this.enabledDataSorting,k=n(c.dlBox&&c.dlBox.centerX,c.plotX,-9999),q=n(c.plotY,-9999),r=d.getBBox(),t=e.rotation,
z=e.align,v=g.isInsidePlot(k,Math.round(q),h),x="justify"===n(e.overflow,m?"none":"justify"),p=this.visible&&!1!==c.visible&&(c.series.forceDL||m&&!x||v||e.inside&&f&&g.isInsidePlot(k,h?f.x+1:f.y+f.height-1,h));var y=function(e){m&&b.xAxis&&!x&&b.setDataLabelStartPos(c,d,a,v,e);};if(p){var C=g.renderer.fontMetrics(g.styledMode?void 0:e.style.fontSize,d).b;f=l({x:h?this.yAxis.len-q:k,y:Math.round(h?this.xAxis.len-k:q),width:0,height:0},f);l(e,{width:r.width,height:r.height});t?(x=!1,k=g.renderer.rotCorr(C,
t),k={x:f.x+(e.x||0)+f.width/2+k.x,y:f.y+(e.y||0)+{top:0,middle:.5,bottom:1}[e.verticalAlign]*f.height},y(k),d[a?"attr":"animate"](k).attr({align:z}),y=(t+720)%360,y=180<y&&360>y,"left"===z?k.y-=y?r.height:0:"center"===z?(k.x-=r.width/2,k.y-=r.height/2):"right"===z&&(k.x-=r.width,k.y-=y?0:r.height),d.placed=!0,d.alignAttr=k):(y(f),d.align(e,null,f),k=d.alignAttr);x&&0<=f.height?this.justifyDataLabel(d,e,k,r,f,a):n(e.crop,!0)&&(p=g.isInsidePlot(k.x,k.y)&&g.isInsidePlot(k.x+r.width,k.y+r.height));if(e.shape&&
!t)d[a?"attr":"animate"]({anchorX:h?g.plotWidth-c.plotY:c.plotX,anchorY:h?g.plotHeight-c.plotX:c.plotY});}a&&m&&(d.placed=!1);p||m&&!x||(d.hide(!0),d.placed=!1);};x.prototype.setDataLabelStartPos=function(c,d,e,f,a){var b=this.chart,g=b.inverted,h=this.xAxis,k=h.reversed,l=g?d.height/2:d.width/2;c=(c=c.pointWidth)?c/2:0;h=g?a.x:k?-l-c:h.width-l+c;a=g?k?this.yAxis.height-l+c:-l-c:a.y;d.startXPos=h;d.startYPos=a;f?"hidden"===d.visibility&&(d.show(),d.attr({opacity:0}).animate({opacity:1})):d.attr({opacity:1}).animate({opacity:0},
void 0,d.hide);b.hasRendered&&(e&&d.attr({x:d.startXPos,y:d.startYPos}),d.placed=!0);};x.prototype.justifyDataLabel=function(c,d,e,f,a,b){var g=this.chart,h=d.align,k=d.verticalAlign,l=c.box?0:c.padding||0,m=d.x;m=void 0===m?0:m;var n=d.y;var q=void 0===n?0:n;n=e.x+l;if(0>n){"right"===h&&0<=m?(d.align="left",d.inside=!0):m-=n;var r=!0;}n=e.x+f.width-l;n>g.plotWidth&&("left"===h&&0>=m?(d.align="right",d.inside=!0):m+=g.plotWidth-n,r=!0);n=e.y+l;0>n&&("bottom"===k&&0<=q?(d.verticalAlign="top",d.inside=
!0):q-=n,r=!0);n=e.y+f.height-l;n>g.plotHeight&&("top"===k&&0>=q?(d.verticalAlign="bottom",d.inside=!0):q+=g.plotHeight-n,r=!0);r&&(d.x=m,d.y=q,c.placed=!b,c.align(d,void 0,a));return r};B.pie&&(B.pie.prototype.dataLabelPositioners={radialDistributionY:function(c){return c.top+c.distributeBox.pos},radialDistributionX:function(c,d,e,f){return c.getX(e<d.top+2||e>d.bottom-2?f:e,d.half,d)},justify:function(c,d,e){return e[0]+(c.half?-1:1)*(d+c.labelDistance)},alignToPlotEdges:function(c,d,e,f){c=c.getBBox().width;
return d?c+f:e-c-f},alignToConnectors:function(c,d,e,f){var a=0,b;c.forEach(function(c){b=c.dataLabel.getBBox().width;b>a&&(a=b);});return d?a+f:e-a-f}},B.pie.prototype.drawDataLabels=function(){var f=this,g=f.data,e,h=f.chart,a=f.options.dataLabels||{},b=a.connectorPadding,l,q=h.plotWidth,t=h.plotHeight,z=h.plotLeft,y=Math.round(h.chartWidth/3),A,B=f.center,E=B[2]/2,v=B[1],D,p,G,M,P=[[],[]],u,S,I,X,U=[0,0,0,0],W=f.dataLabelPositioners,Y;f.visible&&(a.enabled||f._hasPointLabels)&&(g.forEach(function(a){a.dataLabel&&
a.visible&&a.dataLabel.shortened&&(a.dataLabel.attr({width:"auto"}).css({width:"auto",textOverflow:"clip"}),a.dataLabel.shortened=!1);}),x.prototype.drawDataLabels.apply(f),g.forEach(function(b){b.dataLabel&&(b.visible?(P[b.half].push(b),b.dataLabel._pos=null,!C(a.style.width)&&!C(b.options.dataLabels&&b.options.dataLabels.style&&b.options.dataLabels.style.width)&&b.dataLabel.getBBox().width>y&&(b.dataLabel.css({width:Math.round(.7*y)+"px"}),b.dataLabel.shortened=!0)):(b.dataLabel=b.dataLabel.destroy(),
b.dataLabels&&1===b.dataLabels.length&&delete b.dataLabels));}),P.forEach(function(c,g){var k=c.length,l=[],m;if(k){f.sortByAngle(c,g-.5);if(0<f.maxLabelDistance){var r=Math.max(0,v-E-f.maxLabelDistance);var w=Math.min(v+E+f.maxLabelDistance,h.plotHeight);c.forEach(function(a){0<a.labelDistance&&a.dataLabel&&(a.top=Math.max(0,v-E-a.labelDistance),a.bottom=Math.min(v+E+a.labelDistance,h.plotHeight),m=a.dataLabel.getBBox().height||21,a.distributeBox={target:a.labelPosition.natural.y-a.top+m/2,size:m,
rank:a.y},l.push(a.distributeBox));});r=w+m-r;d.distribute(l,r,r/5);}for(X=0;X<k;X++){e=c[X];G=e.labelPosition;D=e.dataLabel;I=!1===e.visible?"hidden":"inherit";S=r=G.natural.y;l&&C(e.distributeBox)&&("undefined"===typeof e.distributeBox.pos?I="hidden":(M=e.distributeBox.size,S=W.radialDistributionY(e)));delete e.positionIndex;if(a.justify)u=W.justify(e,E,B);else switch(a.alignTo){case "connectors":u=W.alignToConnectors(c,g,q,z);break;case "plotEdges":u=W.alignToPlotEdges(D,g,q,z);break;default:u=W.radialDistributionX(f,
e,S,r);}D._attr={visibility:I,align:G.alignment};Y=e.options.dataLabels||{};D._pos={x:u+n(Y.x,a.x)+({left:b,right:-b}[G.alignment]||0),y:S+n(Y.y,a.y)-10};G.final.x=u;G.final.y=S;n(a.crop,!0)&&(p=D.getBBox().width,r=null,u-p<b&&1===g?(r=Math.round(p-u+b),U[3]=Math.max(r,U[3])):u+p>q-b&&0===g&&(r=Math.round(u+p-q+b),U[1]=Math.max(r,U[1])),0>S-M/2?U[0]=Math.max(Math.round(-S+M/2),U[0]):S+M/2>t&&(U[2]=Math.max(Math.round(S+M/2-t),U[2])),D.sideOverflow=r);}}}),0===H(U)||this.verifyDataLabelOverflow(U))&&
(this.placeDataLabels(),this.points.forEach(function(b){Y=c(a,b.options.dataLabels);if(l=n(Y.connectorWidth,1)){var d;A=b.connector;if((D=b.dataLabel)&&D._pos&&b.visible&&0<b.labelDistance){I=D._attr.visibility;if(d=!A)b.connector=A=h.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-"+b.colorIndex+(b.className?" "+b.className:"")).add(f.dataLabelsGroup),h.styledMode||A.attr({"stroke-width":l,stroke:Y.connectorColor||b.color||k.neutralColor60});A[d?"attr":"animate"]({d:b.getConnectorPath()});
A.attr("visibility",I);}else A&&(b.connector=A.destroy());}}));},B.pie.prototype.placeDataLabels=function(){this.points.forEach(function(c){var d=c.dataLabel,e;d&&c.visible&&((e=d._pos)?(d.sideOverflow&&(d._attr.width=Math.max(d.getBBox().width-d.sideOverflow,0),d.css({width:d._attr.width+"px",textOverflow:(this.options.dataLabels.style||{}).textOverflow||"ellipsis"}),d.shortened=!0),d.attr(d._attr),d[d.moved?"animate":"attr"](e),d.moved=!0):d&&d.attr({y:-9999}));delete c.distributeBox;},this);},B.pie.prototype.alignDataLabel=
f,B.pie.prototype.verifyDataLabelOverflow=function(c){var d=this.center,e=this.options,f=e.center,a=e.minSize||80,b=null!==e.size;if(!b){if(null!==f[0])var g=Math.max(d[2]-Math.max(c[1],c[3]),a);else g=Math.max(d[2]-c[1]-c[3],a),d[0]+=(c[3]-c[1])/2;null!==f[1]?g=t(g,a,d[2]-Math.max(c[0],c[2])):(g=t(g,a,d[2]-c[0]-c[2]),d[1]+=(c[0]-c[2])/2);g<d[2]?(d[2]=g,d[3]=Math.min(A(e.innerSize||0,g),g),this.translate(d),this.drawDataLabels&&this.drawDataLabels()):b=!0;}return b});B.column&&(B.column.prototype.alignDataLabel=
function(d,f,e,g,a){var b=this.chart.inverted,h=d.series,k=d.dlBox||d.shapeArgs,l=n(d.below,d.plotY>n(this.translatedThreshold,h.yAxis.len)),m=n(e.inside,!!this.options.stacking);k&&(g=c(k),0>g.y&&(g.height+=g.y,g.y=0),k=g.y+g.height-h.yAxis.len,0<k&&k<g.height&&(g.height-=k),b&&(g={x:h.yAxis.len-g.y-g.height,y:h.xAxis.len-g.x-g.width,width:g.height,height:g.width}),m||(b?(g.x+=l?0:g.width,g.width=0):(g.y+=l?g.height:0,g.height=0)));e.align=n(e.align,!b||m?"center":l?"right":"left");e.verticalAlign=
n(e.verticalAlign,b||m?"middle":l?"top":"bottom");x.prototype.alignDataLabel.call(this,d,f,e,g,a);e.inside&&d.contrastColor&&f.css({color:d.contrastColor});});});P(k,"Extensions/OverlappingDataLabels.js",[k["Core/Chart/Chart.js"],k["Core/Utilities.js"]],function(f,d){var k=d.addEvent,x=d.fireEvent,B=d.isArray,G=d.isNumber,D=d.objectEach,H=d.pick;k(f,"render",function(){var d=[];(this.labelCollectors||[]).forEach(function(f){d=d.concat(f());});(this.yAxis||[]).forEach(function(f){f.stacking&&f.options.stackLabels&&
!f.options.stackLabels.allowOverlap&&D(f.stacking.stacks,function(f){D(f,function(f){d.push(f.label);});});});(this.series||[]).forEach(function(f){var k=f.options.dataLabels;f.visible&&(!1!==k.enabled||f._hasPointLabels)&&(k=function(f){return f.forEach(function(f){f.visible&&(B(f.dataLabels)?f.dataLabels:f.dataLabel?[f.dataLabel]:[]).forEach(function(g){var c=g.options;g.labelrank=H(c.labelrank,f.labelrank,f.shapeArgs&&f.shapeArgs.height);c.allowOverlap||d.push(g);});})},k(f.nodes||[]),k(f.points));});
this.hideOverlappingLabels(d);});f.prototype.hideOverlappingLabels=function(d){var f=this,k=d.length,t=f.renderer,g,y,c,q=!1;var n=function(c){var d,f=c.box?0:c.padding||0,e=d=0,g;if(c&&(!c.alignAttr||c.placed)){var a=c.alignAttr||{x:c.attr("x"),y:c.attr("y")};var b=c.parentGroup;c.width||(d=c.getBBox(),c.width=d.width,c.height=d.height,d=t.fontMetrics(null,c.element).h);var k=c.width-2*f;(g={left:"0",center:"0.5",right:"1"}[c.alignValue])?e=+g*k:G(c.x)&&Math.round(c.x)!==c.translateX&&(e=c.x-c.translateX);
return {x:a.x+(b.translateX||0)+f-(e||0),y:a.y+(b.translateY||0)+f-d,width:c.width-2*f,height:c.height-2*f}}};for(y=0;y<k;y++)if(g=d[y])g.oldOpacity=g.opacity,g.newOpacity=1,g.absoluteBox=n(g);d.sort(function(c,d){return (d.labelrank||0)-(c.labelrank||0)});for(y=0;y<k;y++){var A=(n=d[y])&&n.absoluteBox;for(g=y+1;g<k;++g){var B=(c=d[g])&&c.absoluteBox;!A||!B||n===c||0===n.newOpacity||0===c.newOpacity||B.x>=A.x+A.width||B.x+B.width<=A.x||B.y>=A.y+A.height||B.y+B.height<=A.y||((n.labelrank<c.labelrank?
n:c).newOpacity=0);}}d.forEach(function(c){if(c){var d=c.newOpacity;c.oldOpacity!==d&&(c.alignAttr&&c.placed?(c[d?"removeClass":"addClass"]("highcharts-data-label-hidden"),q=!0,c.alignAttr.opacity=d,c[c.isOld?"animate":"attr"](c.alignAttr,null,function(){f.styledMode||c.css({pointerEvents:d?"auto":"none"});c.visibility=d?"inherit":"hidden";}),x(f,"afterHideOverlappingLabel")):c.attr({opacity:d}));c.isOld=!0;}});q&&x(f,"afterHideAllOverlappingLabels");};});P(k,"Core/Responsive.js",[k["Core/Chart/Chart.js"],
k["Core/Utilities.js"]],function(f,d){var k=d.find,x=d.isArray,B=d.isObject,G=d.merge,D=d.objectEach,H=d.pick,t=d.splat,C=d.uniqueKey;f.prototype.setResponsive=function(d,f){var g=this.options.responsive,l=[],c=this.currentResponsive;!f&&g&&g.rules&&g.rules.forEach(function(c){"undefined"===typeof c._id&&(c._id=C());this.matchResponsiveRule(c,l);},this);f=G.apply(0,l.map(function(c){return k(g.rules,function(d){return d._id===c}).chartOptions}));f.isResponsiveOptions=!0;l=l.toString()||void 0;l!==
(c&&c.ruleIds)&&(c&&this.update(c.undoOptions,d,!0),l?(c=this.currentOptions(f),c.isResponsiveOptions=!0,this.currentResponsive={ruleIds:l,mergedOptions:f,undoOptions:c},this.update(f,d,!0)):this.currentResponsive=void 0);};f.prototype.matchResponsiveRule=function(d,f){var g=d.condition;(g.callback||function(){return this.chartWidth<=H(g.maxWidth,Number.MAX_VALUE)&&this.chartHeight<=H(g.maxHeight,Number.MAX_VALUE)&&this.chartWidth>=H(g.minWidth,0)&&this.chartHeight>=H(g.minHeight,0)}).call(this)&&
f.push(d._id);};f.prototype.currentOptions=function(d){function f(c,d,k,l){var n;D(c,function(c,m){if(!l&&-1<g.collectionsWithUpdate.indexOf(m)&&d[m])for(c=t(c),k[m]=[],n=0;n<Math.max(c.length,d[m].length);n++)d[m][n]&&(void 0===c[n]?k[m][n]=d[m][n]:(k[m][n]={},f(c[n],d[m][n],k[m][n],l+1)));else B(c)?(k[m]=x(c)?[]:{},f(c,d[m]||{},k[m],l+1)):k[m]="undefined"===typeof d[m]?null:d[m];});}var g=this,k={};f(d,this.options,k,0);return k};});P(k,"masters/highcharts.src.js",[k["Core/Globals.js"],k["Core/Utilities.js"],
k["Core/Renderer/HTML/AST.js"],k["Core/Series/Series.js"]],function(f,d,k,x){f.addEvent=d.addEvent;f.arrayMax=d.arrayMax;f.arrayMin=d.arrayMin;f.attr=d.attr;f.clearTimeout=d.clearTimeout;f.correctFloat=d.correctFloat;f.createElement=d.createElement;f.css=d.css;f.defined=d.defined;f.destroyObjectProperties=d.destroyObjectProperties;f.discardElement=d.discardElement;f.erase=d.erase;f.error=d.error;f.extend=d.extend;f.extendClass=d.extendClass;f.find=d.find;f.fireEvent=d.fireEvent;f.format=d.format;
f.getMagnitude=d.getMagnitude;f.getStyle=d.getStyle;f.inArray=d.inArray;f.isArray=d.isArray;f.isClass=d.isClass;f.isDOMElement=d.isDOMElement;f.isFunction=d.isFunction;f.isNumber=d.isNumber;f.isObject=d.isObject;f.isString=d.isString;f.keys=d.keys;f.merge=d.merge;f.normalizeTickInterval=d.normalizeTickInterval;f.numberFormat=d.numberFormat;f.objectEach=d.objectEach;f.offset=d.offset;f.pad=d.pad;f.pick=d.pick;f.pInt=d.pInt;f.relativeLength=d.relativeLength;f.removeEvent=d.removeEvent;f.splat=d.splat;
f.stableSort=d.stableSort;f.syncTimeout=d.syncTimeout;f.timeUnits=d.timeUnits;f.uniqueKey=d.uniqueKey;f.useSerialIds=d.useSerialIds;f.wrap=d.wrap;f.AST=k;f.Series=x;return f});k["masters/highcharts.src.js"]._modules=k;return k["masters/highcharts.src.js"]});

});

/* clsSMChart\ChartPreview.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMChart\\ChartPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-bzsii3-style";
	style.textContent = "#chart_modal.svelte-bzsii3 .modal-body.svelte-bzsii3{max-height:350px}.native_chart_header.svelte-bzsii3.svelte-bzsii3{background:#e0e0e0;height:36px}.chart_preview_container.svelte-bzsii3.svelte-bzsii3{border:1px solid #ccc;overflow:visible !important}.native_add.svelte-bzsii3.svelte-bzsii3{background:#e0e0e0;width:auto;bottom:10px\r\n    }.native_add_text.svelte-bzsii3.svelte-bzsii3{bottom:2px;left:2px}.native_remove.svelte-bzsii3.svelte-bzsii3{padding:7.5px;background:#e0e0e0;width:auto;left:220px;top:7px}#chart_header_container.svelte-bzsii3.svelte-bzsii3{background:#e0e0e0;height:38px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhcnRQcmV2aWV3LnN2ZWx0ZSIsInNvdXJjZXMiOlsiQ2hhcnRQcmV2aWV3LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8IS0tXHJcbiAqICBGaWxlIE5hbWUgICA6IENoYXJ0UHJldmlldy5zdmVsdGVcclxuICogIERlc2NyaXB0aW9uIDogUmVzcG9uc2libGUgZm9yIFByZXZpZXcgU2lkZSBmdW5jdGlvbmFsaXR5XHJcbiAqICBBdXRob3IgICAgICA6IEF5dXNoIFNyaXZhc3RhdmFcclxuICogIFBhY2thZ2UgICAgIDogY2xzU01DaGFydCAoUHJldmlldylcclxuICogIExhc3QgdXBkYXRlIDogMTUtTWFyLTIwMjFcclxuICogIExhc3QgVXBkYXRlZCBCeSA6IEF5dXNoIFNyaXZhc3RhdmFcclxuLS0+XHJcbjxzY3JpcHQ+XHJcbiAgICBpbXBvcnQgeyBhZnRlclVwZGF0ZSwgYmVmb3JlVXBkYXRlLCBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG5cdGltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSBcInN2ZWx0ZS9zdG9yZVwiO1xyXG5cdGltcG9ydCB7IFhNTFRvSlNPTiwgQUgsIG9uVXNlckFuc0NoYW5nZSB9IGZyb20gJy4uL2hlbHBlci9IZWxwZXJBSS5zdmVsdGUnO1xyXG4gICAgaW1wb3J0IENIQVJUIGZyb20gJy4vbGliL2NoYXJ0J1xyXG4gICAgaW1wb3J0IGwgZnJvbSAnLi4vc3JjL2xpYnMvTGFuZyc7XHJcbiAgICBpbXBvcnQgSGlnaGNoYXJ0cyBmcm9tICdoaWdoY2hhcnRzJztcclxuICAgIGltcG9ydCBJdGVtSGVscGVyIGZyb20gXCIuLi9oZWxwZXIvSXRlbUhlbHBlci5zdmVsdGVcIjtcclxuICAgIGV4cG9ydCBsZXQgeG1sO1xyXG5cdGV4cG9ydCBsZXQgdXhtbDtcclxuXHRleHBvcnQgbGV0IGlzUmV2aWV3O1xyXG5cdGV4cG9ydCBsZXQgc2hvd0FucztcclxuXHRleHBvcnQgbGV0IGVkaXRvclN0YXRlO1xyXG4gICAgbGV0IHN0YXRlID0ge307XHJcblxyXG4gICAgLy8gbmV3WG1sIHVzZWQgZm9yIGNvbnRhaW4gdGhlIHhtbCBpbiBqc29uIGZvcm1hdCwgY2hhcnRPYmogY29udGFpbnMgdGhlIGluc3RhbmNlIG9mIHRoZSBoaWdoY2hhcnRzXHJcbiAgICBsZXQgbmV3WG1sID0gXCJcIiwgY2hhcnRPYmogPSAnJztcclxuICAgIC8vIHVzZWQgZm9yIGNvbnRhaW4gdGhlIHggYW5kIHkgcG9pbnQgdmFsdWUgb2YgZWFjaCByb3cgb2YgJ1NldCBBbnN3ZXInIGRpYWxvZyBib3ggdGhhdCBjb21lcyB3aGVuIGtleXVwIG9uIEFEQSBidXR0b25cclxuICAgIGxldCB0ZW1wUm93VmFsID0gW107XHJcbiAgICAvLyBob2xkcyB0aGUgdXNlciBhbnN3ZXIgdmFsdWUgcGVyZm9ybWVkIHZpYSBBREEgYnV0dG9uIFxyXG4gICAgbGV0IGhvbGRVc2VyQW5zID0gW107XHJcbiAgICB3aW5kb3cuSGlnaGNoYXJ0cyA9IEhpZ2hjaGFydHM7XHJcbiAgICBsZXQgcHJldmlld19zdG9yZSA9IHdyaXRhYmxlKHtcclxuICAgICAgICB1c2VyYW5zOiAnJyxcclxuICAgICAgICBpbml0OiBmYWxzZSxcclxuICAgICAgICAvLyB1c2VkIGNvbnRhaW4gdGhlIHhtbCB2YWx1ZVxyXG4gICAgICAgIHhtbDogJycsXHJcbiAgICAgICAgbW9kYWxWaWV3TGF5b3V0OiAnJyxcclxuICAgICAgICAvLyB1c2VkIGZvciBzZXQgdGhlIGhlaWdodCBvZiB0aGUgY2hhcnQgY29udGFpbmVyXHJcbiAgICAgICAgaGVpZ2h0OiBcIjUwMFwiLFxyXG4gICAgICAgIC8vIHVzZWQgZm9yIHNldCB0aGUgd2lkdGggb2YgdGhlIGNoYXJ0IGNvbnRhaW5lclxyXG4gICAgICAgIHdpZHRoOiBcIjU1MFwiLFxyXG4gICAgICAgIC8vIHVzZWQgZm9yIHVwZGF0ZSB0aGUgeC1heGlzIHBvaW50c1xyXG4gICAgICAgIHh2YWw6IFwiXCIsXHJcbiAgICAgICAgLy8gdXNlZCBmb3IgZGVmaW5lZCB0aGUgZ2FwIGJldHdlZW4gMiBwb2ludCBvbiB5LWF4aXNcclxuICAgICAgICB5aW50ZXJ2YWw6IFwiXCIsXHJcbiAgICAgICAgLy8gdXNlZCBmb3Igc2V0IHRoZSBtYXhpbXVtIHZhbHVlIG9mIHktYXhpc1xyXG4gICAgICAgIHltYXg6IFwiXCIsXHJcbiAgICAgICAgLy8gdXNlZCBmb3Igc2V0IHRoZSBtaW5pbXVtIHZhbHVlIG9mIHktYXhpc1xyXG4gICAgICAgIHltaW46IFwiXCIsXHJcbiAgICAgICAgLy8gdXNlZCBmb3Igc2V0IHRoZSBtYXhpbXVtIHZhbHVlIG9mIHgtYXhpc1xyXG4gICAgICAgIHhtYXg6IFwiXCIsXHJcbiAgICAgICAgLy8gdXNlZCBmb3Igc2V0IHRoZSBtaW5pbXVtIHZhbHVlIG9mIHgtYXhpc1xyXG4gICAgICAgIHhtaW46IFwiXCIsXHJcbiAgICAgICAgLy8gdXNlZCBmb3Igc2V0IHRoZSBnYXAgYmV0d2VlbiAyIHBvaW50cyBvbiB4LWF4aXNcclxuICAgICAgICB4aW50ZXJ2YWw6IFwiXCIsXHJcbiAgICAgICAgLy8gdXNlZCBmb3IgYnkgZGVmYXVsdCBwbG90IHRoZSBjaGF0IHdpdGggZGVmYXVsdCBhbnN3ZXIgdmFsdWVcclxuICAgICAgICBkZWZhdWx0YW5zOiBcIlwiLFxyXG4gICAgICAgIC8vIG5vdCBjbGVhciB3aHkgaXQgaXMgdXNlZFxyXG4gICAgICAgIHNuYXBUbzogXCJcIixcclxuICAgICAgICAvLyBjb250YWlucyB0aGUgY29ycmVjdCBhbnN3ZXIgdmFsdWUgZm9yIG1hdGNoIHRoZSBhbnN3ZXJcclxuICAgICAgICBjb3JyZWN0YW5zOiBcIlwiLFxyXG4gICAgICAgIC8vIHVzZWQgZm9yIHNldCB0aGUgeC1heGlzIGxhYmVsIHZhbHVlXHJcbiAgICAgICAgeGxhYmVsOiBcIlwiLFxyXG4gICAgICAgIC8vIHVzZWQgZm9yIHNldCB0aGUgeS1heGlzIGxhYmVsIHZhbHVlXHJcbiAgICAgICAgeWxhYmVsOiBcIlwiLFxyXG4gICAgICAgIC8vIHVzZWQgZm9yIHNldCB0aGUgY2hhcnQgbGFiZWwgdmFsdWVcclxuICAgICAgICB0aXRsZTogXCJcIixcclxuICAgICAgICAvLyB1c2VkIGZvciBzZXQgdGhlIGNvbG9yIG9mIGNvbHVtbi9wb2ludCBleGNlcHQgaW4gY2FzZSBvZiBoaXN0b2dyYW1cclxuICAgICAgICBjb2xvcjogXCJcIixcclxuICAgICAgICAvLyB0aGlzIG9yIGFib3ZlIHZhbHVlIGNhbiBiZSByZW1vdmVkIGFzIGl0IGlzIGRlZmluZWQgYXQgMiBwbGFjZXMgaW4gdGhlIHNhbWUgc2NvcGVcclxuICAgICAgICBtb2R1bGVUeXBlOiBcIm5vbmVcIixcclxuICAgICAgICAvLyB1c2VkIGZvciB1cGRhdGUgdGhlIGJvZHkgcm93cyBvZiB0aGUgJ1NldCBBbnN3ZXInIGRpYWxvZ2JveCB3aGVuIHBlcmZvcm1lZCBieSB0aGUgaGVscCBvZiAnQURBJyBidXR0b25cclxuICAgICAgICBub09mUm93OiAxXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBzdWJzY3JpYmluZyB0byB0aGUgc3RhdGVcclxuICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gcHJldmlld19zdG9yZS5zdWJzY3JpYmUodmFsdWUgPT4ge1xyXG5cdFx0c3RhdGUgPSB2YWx1ZTtcclxuXHR9KTtcclxuICAgIFxyXG4gICAgLy8gdXBkYXRpbmcgbW9kdWxlIG9uIGNoYW5nZSBvZiB0aGUgeG1sXHJcbiAgICBiZWZvcmVVcGRhdGUoYXN5bmMoKT0+IHtcclxuICAgICAgICBpZiAoIWVkaXRvclN0YXRlICYmICFzdGF0ZS5pbml0KSB7XHJcbiAgICAgICAgICAgIEFILmFkZFNjcmlwdCgnJywgaXRlbVVybCArICdjbHNTTUNoYXJ0L2xpYi9oaWdoY2hhcnRfZHJhZ2dhYmxlLmpzJywgeyBjYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUuaW5pdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH19KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChzdGF0ZS5pbml0IHx8IChlZGl0b3JTdGF0ZSAmJiBlZGl0b3JTdGF0ZS5saW5rcykgKSAmJiBzdGF0ZS54bWwgIT0geG1sKSB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVhtbERhdGEoeG1sKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIHVwZGF0aW5nIHhtbCBhbmQgcmV2aWV3IG1vZGUgXHJcbiAgICBhZnRlclVwZGF0ZShhc3luYygpID0+IHtcclxuICAgICAgICBpZiAoc3RhdGUuaW5pdCB8fCAoZWRpdG9yU3RhdGUgJiYgZWRpdG9yU3RhdGUubGlua3MpKSB7XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZS54bWwgIT0geG1sKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbnN0YW5jZSBvZiBoaWdoY2hhcnRzXHJcbiAgICAgICAgICAgICAgICBsZXQgY2hhcnRzID0gSGlnaGNoYXJ0cy5jaGFydHMsIGNoYXJ0T2JqO1xyXG4gICAgICAgICAgICAgICAgY2hhcnRzLmZvckVhY2goZnVuY3Rpb24oY2hhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhcnQgJiYgY2hhcnQucmVuZGVyVG8uaWQgPT09ICdhbnN3ZXJJRDAnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0T2JqID0gY2hhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAoY2hhcnRPYmopID8gY2hhcnRPYmoucmVkcmF3KCkgOiAnJztcclxuICAgICAgICAgICAgICAgIC8vIHVzZWQgZm9yIGxvYWQgYW5kIGRyYXcgdGhlIGNoYXJ0XHJcbiAgICAgICAgICAgICAgICBDSEFSVC5yZWFkeVRoaXMoJyNjaGFydG1haW4wJywgMCwgdXhtbCk7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBibG9jayB3aWxsIG5vdCBleGVjdXRlIGFzIHRoZXJlIGFyZSBvbmx5IDMgdHlwZXMgb2YgY2hhcnQgdXNlZCBoZXJlIGFuZCB0aGV5IGFyZSBsaW5lLCBjb2x1bW4gYW5kIGhpc3RvZ3JhbVxyXG4gICAgICAgICAgICAgICAgbGV0IHJlcywgYXJyLCB1c2VyX2RhdGFfanNvbjtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdYbWwuc214bWwuY2hhcnQuX3R5cGUgPT0gJ2RvdHBsb3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gJ3wnO1xyXG4gICAgICAgICAgICAgICAgICAgIGFyciA9IEpTT04ucGFyc2UoXCJbXCIgKyBuZXdYbWwuc214bWwuY2hhcnQuX2RlZmF1bHRhbnMgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8gPSAwOyBpbmRleF9ubyA8IGFyci5sZW5ndGg7IGluZGV4X25vICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzICsgaW5kZXhfbm8gKyAnLCcgKyBhcnJbaW5kZXhfbm9dICogMTAgKyAnfCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBkZWZpbmUgdGhlIHZhcmlhYmxlIHdpdGggdmFsdWUgJ3wnXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gJ3wnO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBkZWZhdWx0IGFuc3dlciB2YWx1ZSBpbiBqc29uIGZvcm1hdFxyXG4gICAgICAgICAgICAgICAgICAgIGFyciA9IEpTT04ucGFyc2UoXCJbXCIgKyBuZXdYbWwuc214bWwuY2hhcnQuX2RlZmF1bHRhbnMgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8gPSAwOyBpbmRleF9ubyA8IGFyci5sZW5ndGg7IGluZGV4X25vICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0cyBlYWNoIGNvbHVtbnMvcG9pbnRzIHggcG9pbnQgdmFsdWUgYXMgZGVmaW5lZCBpbiBpbmRleF9ubyB2YXJpYWJsZSBhbmQgeSBwb2ludCB2YWx1ZSBhcyB2YWx1ZSBvZiBhcnIgb2JqZWN0IGRlZmluZWQgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaW5kZXhfbm8nIHNlcGFyYXRlZCBieSBjb21tYSAoLCkgd2l0aCBzdWZpeCAnfCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzICsgaW5kZXhfbm8gKyAnLCcgKyBhcnJbaW5kZXhfbm9dICsgJ3wnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXNlZCBpbiBjYXNlIHdoZW4gdXNlciBhbnN3ZXIgaXMgc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHV4bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9kYXRhX2pzb24gPSBYTUxUb0pTT04odXhtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW50cyB0aGUgJ3gnIGFuZCAneScgYXhpcyBjby1vcmRpbmF0ZSB2YWx1ZSBvZiB1c2VyIGFuc3dlciBjb2x1bW5zIG9yIHBvaW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2RhdGFfanNvbiA9IHVzZXJfZGF0YV9qc29uLnNtYW5zLmRpdi5fdXNlckFucztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0cyB0aGUgdXNlciBhbnN3ZXIgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBBSC5zZWxlY3QoJyNhbnN3ZXJJRDAnKS5zZXRBdHRyaWJ1dGUoJ3VzZXJhbnMnLCAoKHVzZXJfZGF0YV9qc29uKSA/IHVzZXJfZGF0YV9qc29uIDogcmVzKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHByZXZpZXdfc3RvcmUudXBkYXRlKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ueG1sID0geG1sO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpbml0UHJldmlldygpO1xyXG4gICAgICAgICAgICAgICAgQUguZW5hYmxlQnNBbGwoJ1tkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIl0nLCAnVG9vbHRpcCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhdGUucmV2aWV3ICE9IGlzUmV2aWV3ICYmIGVkaXRvclN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2aWV3X3N0b3JlLnVwZGF0ZSggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnJldmlldyA9IGlzUmV2aWV3O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSZXZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRSZXZpZXcoKTsgXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHVuc2V0UmV2aWV3KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBCaW5kaW5nIHNvbWUgaW5pdGlhbCBldmVudHMgZm9yIGFuc3dlciBjaGVja2luZ1xyXG4gICAgb25Nb3VudChhc3luYygpPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh1eG1sID09ICc8c21hbnMgdHlwZT1cIjM4XCI+PC9zbWFucz4nKSB7XHJcbiAgICAgICAgICAgICAgICB1eG1sID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybih7J2Vycm9yJzogZXJyb3J9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcclxuICAgICAgICAgICAgd2luZG93LmdldEhlaWdodCAmJiB3aW5kb3cuZ2V0SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNhbnN3ZXJJRDBcIikub250b3VjaG1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQUguaW5zZXJ0KGRvY3VtZW50LmhlYWQsIGA8c3R5bGU+LmhpZ2hjaGFydHMtZGF0YS1sYWJlbHN7dG9wOiAxMTVweCFpbXBvcnRhbnQ7fTwvc3R5bGU+YCwgJ2JlZm9yZWVuZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQUgubGlzdGVuKCdib2R5JywgJ2NsaWNrJywgJyNjaGFydG1haW4wJywgZnVuY3Rpb24gKGN1cnJlbnQsIGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuaWQgIT0gJ2NoYXJ0X2hlYWRlcl9jb250YWluZXInICYmIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkICE9ICdBREFfQnRuX3BvaW50JyAmJiBldmVudC50YXJnZXQuaWQgIT0gJ0FEQV9CdG5fcG9pbnQnKSB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5QW5zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgQUgubGlzdGVuKCdib2R5JywgJ21vdXNldXAnLCAnI2NoYXJ0bWFpbjAnLCBmdW5jdGlvbiAoY3VycmVudCwgZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5pZCAhPSAnY2hhcnRfaGVhZGVyX2NvbnRhaW5lcicgJiYgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQgIT0gJ0FEQV9CdG5fcG9pbnQnICYmIGV2ZW50LnRhcmdldC5pZCAhPSAnQURBX0J0bl9wb2ludCcpIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlBbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBBSC5saXN0ZW4oJ2JvZHknLCAndG91Y2hlbmQnLCAnI2NoYXJ0bWFpbjAnLCBmdW5jdGlvbiAoY3VycmVudCwgZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5pZCAhPSAnY2hhcnRfaGVhZGVyX2NvbnRhaW5lcicgJiYgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQgIT0gJ0FEQV9CdG5fcG9pbnQnICYmIGV2ZW50LnRhcmdldC5pZCAhPSAnQURBX0J0bl9wb2ludCcpIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlBbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBBSC5saXN0ZW4oJ2JvZHknLCAna2V5ZG93bicsICcjY2hhcnRtYWluMCAjZGVsZXRlX3ByZXYsICNjaGFydG1haW4wICNhZGRfcHJldicsIGZ1bmN0aW9uIChjdXJyZW50LCBldmVudCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5hbHRLZXkgJiYgKGV2ZW50LndoaWNoID09IDQ5IHx8IGV2ZW50LmtleUNvZGUgPT0gNDkpKSB7XHJcbiAgICAgICAgICAgICAgICBvcGVuTW9kYWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBBSC5saXN0ZW4oJ2JvZHknLCAna2V5ZG93bicsICcuQURBX0J0bicsIGZ1bmN0aW9uIChjdXJyZW50LCBldmVudCkge1xyXG4gICAgICAgICAgICAvLyBhcnJheSBmb3IgY29udGFpbiB0aGUgdXNlciBhbnN3ZXIgdmFsdWUgcGVyZm9ybWVkIHZpYSBBREEgZGlhbG9nIGJveFxyXG4gICAgICAgICAgICBob2xkVXNlckFucyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAodGVtcFJvd1ZhbC5sZW5ndGggKiAyKTsgaSA9IGkgKyAyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgeSBwb2ludCB2YWx1ZSBvZiBlYWNoIHJvd1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnZlcnRBcnIgPSB0ZW1wUm93VmFsLnRvU3RyaW5nKCkuc3BsaXQoXCIsXCIpW2ldO1xyXG4gICAgICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSB5IHBvaW50IHZhbHVlIGludG8gYXJyYXkgaG9sZFVzZXJBbnMgZm9yIHNldCB0aGUgdXNlciBhbnN3ZXIgdmFsdWVcclxuICAgICAgICAgICAgICAgIGhvbGRVc2VyQW5zLnB1c2goY29udmVydEFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcclxuICAgICAgICAgICAgICAgIG9wZW5Nb2RhbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIGNhbGxlZCBmb3Igb3BlbmluZyB0aGUgbW9kYWxcclxuICAgIGZ1bmN0aW9uIG9wZW5Nb2RhbCgpIHtcclxuICAgICAgICBBSC5nZXRCUygnI2NoYXJ0X21vZGFsJywgJ01vZGFsJykuc2hvdygpO1xyXG4gICAgICAgIGxvYWRNb2RhbFZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmb3IgbW9kaWZ5aW5nIGFuZCB1cGRhdGluZyB0aGUgY2hhcnQgaW4gY2FzZSBvZiBhZGFcclxuICAgIGZ1bmN0aW9uIG1vZGlmeVV4bWxPbktleSgpIHtcclxuICAgICAgICAvLyBjcmVhdGVzIHRlbXBvcmFyeSBhcnJheVxyXG4gICAgICAgIHRlbXBSb3dWYWwgPSBbXTtcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlLm1vZHVsZVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImNvbHVtblwiOlxyXG4gICAgICAgICAgICBjYXNlIFwibGluZVwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiaGlzdG9ncmFtXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJkb3RwbG90XCI6XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyBudW1iZXIgb2Ygcm93cyBleGlzdCBpbiAnU2V0IEFuc3dlcicgZGlhbG9nIGJveFxyXG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYWluRGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAvLyBsb29wcyB0aHJvdWdoIGVhY2ggcm93c1xyXG4gICAgICAgICAgICAgICAgcm93LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyBib3RoIGNvbHVtbiB3aGljaCBpcyB1c2VkIGZvciB4IGFuZCB5IHZhbHVlIG9mIGNvbHVtbi9wb2ludFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2wgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHtpdGVtLmlkfSAuZ2V0RmllbGRWYWxgKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgeCBhbmQgeSB2YWx1ZSBvZiB0aGUgY29sdW1uL3BvaW50XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBDb2wgPSBbY29sWzBdLnZhbHVlICsgXCIsXCIgKyBjb2xbMV0udmFsdWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHB1c2hlcyB0aGUgdmFsdWUgb2YgdGhlIHZhcmlhYmxlICd0ZW1wQ29sJyBpbiBhcnJheSAndGVtcFJvd1ZhbCdcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wUm93VmFsLnB1c2godGVtcENvbCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIHZhbHVlIG9mIHRoZSB1c2VyIGFuc3dlciB3aXRoIHN0b3JlZCB2YWx1ZSBpbiB0ZW1wb3JhcnkgYXJyYXkgJ3RlbXBSb3dWYWwnXHJcbiAgICAgICAgICAgICAgICBBSC5zZWxlY3QoXCIjYW5zd2VySUQwXCIpLnNldEF0dHJpYnV0ZShcInVzZXJhbnNcIiwgdGVtcFJvd1ZhbC5qb2luKCd8JykpO1xyXG4gICAgICAgICAgICAgICAgLy8gYWxsb3dzIHVzZXIgdG8gcGVyZm9ybSB0aGUgdGFzayBhbmQgc2V0cyB0aGUgaW5pdGlhbCBib3JkZXIgY29sb3Igb2YgdGhlIGNoYXJ0IGNvbnRhaW5lciBhbmQgc2hvd3MgYWRkLCBkZWxldGUsIGFuZCBBREEgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICB1bnNldFJldmlldygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFILmdldEJTKCcjY2hhcnRfbW9kYWwnLCAnTW9kYWwnKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRpbmcgcm93XHJcbiAgICBmdW5jdGlvbiB1cGRhdGVSb3cgKHR5cGUpIHtcclxuICAgICAgICBpZiAodHlwZSA9PSBcImFkZFwiKSB7XHJcbiAgICAgICAgICAgIC8vIGluY3JlYXNlcyB0aGUgcm93IGJ5IDEgaWYgJ2FkZCcgYnV0dG9uIGNsaWNrZWRcclxuICAgICAgICAgICAgc3RhdGUubm9PZlJvdyA9IHN0YXRlLm5vT2ZSb3cgKyAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAncmVtb3ZlJykge1xyXG4gICAgICAgICAgICBpZiAoc3RhdGUubm9PZlJvdyA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKFwiRGVmYXVsdCByb3cgY2FuJ3QgYmUgZGVsZXRlZFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vICBkZWNyZWFzZXMgdGhlIHJvdyBieSAxIGlmICdyZW1vdmUnIGJ1dHRvbiBjbGlja2VkIGFuZCByb3cgaXMgZ3JlYXRlciB0aGFuIDFcclxuICAgICAgICAgICAgICAgIHN0YXRlLm5vT2ZSb3cgPSBzdGF0ZS5ub09mUm93IC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsb2FkTW9kYWxWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gY3JlYXRlIHRoZSBqc29uIHdoaWNoIGlzIHJlc3BvbnNpYmxlIGZvciB0aGUgY29udGVudCBvZiB0aGUgbW9kYWxcclxuICAgIGZ1bmN0aW9uIGxvYWRNb2RhbFZpZXcoKSB7XHJcbiAgICAgICAgLy8gY3JlYXRlcyBhbiBhcnJheSB0byBjb250YWluIHRoZSByb3cgYW5kIGNvbHVtbiBmb3IgY29udGFpbiB0aGUgeCBhbmQgeSB2YWx1ZXMgb2YgY29sdW1uL3BvaW50IHVzaW5nICdTZXQgQW5zd2VyJyBkaWFsb2dib3ggdGhhdCBjb21lcyB1c2luZyBBREEgYnV0dG9uXHJcbiAgICAgICAgbGV0IG1vZGFsVmlld0xheW91dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGUubm9PZlJvdzsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSByb3cgd2l0aCBkZWZpbmVkIGRhdGEgXHJcbiAgICAgICAgICAgIG1vZGFsVmlld0xheW91dCA9IFtcclxuICAgICAgICAgICAgICAgIC4uLm1vZGFsVmlld0xheW91dCwge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHN0YXRlLm1vZHVsZVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGhvbGRVc2VyQW5zW2ldXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJldmlld19zdG9yZS51cGRhdGUoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5tb2RhbFZpZXdMYXlvdXQgPSBtb2RhbFZpZXdMYXlvdXQ7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIGZvciByZW1vdmluZyB1bndhbnRlZCBwYXRoc1xyXG4gICAgZnVuY3Rpb24gcmVzZXRQYXRocygpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgY2hhcnRzID0gSGlnaGNoYXJ0cy5jaGFydHMsIGNoYXJ0T2JqO1xyXG4gICAgICAgICAgICBjaGFydHMuZm9yRWFjaChmdW5jdGlvbihjaGFydCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYXJ0ICYmIGNoYXJ0LnJlbmRlclRvLmlkID09PSAnYW5zd2VySUQwJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0T2JqID0gY2hhcnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBjaGFydE9iai5zZXJpZXNbMF0uZGF0YSwgcGF0aHMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aHNbaW5kZXhdID0gZGF0YVtpbmRleF0uaWRcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGRvbV9wYXRoID0gQUguc2VsZWN0QWxsKCcjYW5zd2VySUQwIHBhdGhbcG9pbnQtaWRdJyksIGRvbV9wYXRoX3BvaW50cyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKCBsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRvbV9wYXRoLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgZG9tX3BhdGhfcG9pbnRzW2luZGV4XSA9IGRvbV9wYXRoW2luZGV4XS5nZXRBdHRyaWJ1dGUoJ3BvaW50LWlkJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoIGxldCBpbmRleCA9IDA7IGluZGV4IDwgZG9tX3BhdGhfcG9pbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXRocy5pbmNsdWRlcyhkb21fcGF0aF9wb2ludHNbaW5kZXhdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFILnNlbGVjdCgnW3BvaW50LWlkPVwiJytkb21fcGF0aF9wb2ludHNbaW5kZXhdKydcIl0nLCdyZW1vdmUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIGZvciBpbml0aWF0aW5nIHRoZSBwcmV2aWV3XHJcbiAgICBmdW5jdGlvbiBpbml0UHJldmlldygpIHtcclxuICAgICAgICBpZiAodHlwZW9mIEhpZ2hjaGFydHMgPT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAvLyB1c2VkIGZvciBsb2FkIGFuZCBkcmF3IHRoZSBjaGFydFxyXG4gICAgICAgICAgICBDSEFSVC5yZWFkeVRoaXMoJyNjaGFydG1haW4wJywgMCwgdXhtbCk7XHJcbiAgICAgICAgICAgIC8vIHNob3dzIHRoZSB1c2VyIGFuc3dlciBidXQgbm90IGNoYW5nZSB0aGUgYm9yZGVyIGNvbG9yIG9yIGNvbHVtbi9wb2ludCBjb2xvciBhbmQgbm90IHNob3dzIGNoZWNrIG9yIGNhbmNlbCBtYXJrXHJcbiAgICAgICAgICAgIENIQVJULnNob3dhbnNkcmFnKCcjY2hhcnRtYWluMCcsICd1JywgMCk7XHJcbiAgICAgICAgICAgIGlmIChpc1Jldmlldykge1xyXG4gICAgICAgICAgICAgICAgLy8gc2hvd3MgdGhlIHVzZXIgYW5zd2VyIGFuZCBub3QgYWxsb3dlZCB1c2VyIHRvIHBlcmZvcm0gdGhlIHRhc2tcclxuICAgICAgICAgICAgICAgIHNldFJldmlldygpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhbGxvd3MgdXNlciB0byBwZXJmb3JtIHRoZSB0YXNrIGFuZCBzZXRzIHRoZSBpbml0aWFsIGJvcmRlciBjb2xvciBvZiB0aGUgY2hhcnQgY29udGFpbmVyIGFuZCBzaG93cyBhZGQsIGRlbGV0ZSwgYW5kIEFEQSBidXR0b25cclxuICAgICAgICAgICAgICAgIHVuc2V0UmV2aWV3KClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzaG93cyBhZGQsIGRlbGV0ZSBhbmQgQURBIGJ1dHRvbnMsIHVwZGF0ZXMgdGhlIHVzZXIgYW5zd2VyIHZhbHVlLCBzZXRzIHZhbHVlIG9mIHN0YXRlcyB2YWx1ZXMgYW5kIGxvYWQgdGhlIGNoYXJ0XHJcbiAgICBmdW5jdGlvbiB1cGRhdGVYbWxEYXRhKHhtbF9kYXRhKSB7XHJcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIGpzb24gZGF0YSBvZiB4bWxcclxuICAgICAgICBuZXdYbWwgPSBYTUxUb0pTT04oeG1sX2RhdGEpO1xyXG4gICAgICAgIC8vIHVwZGF0ZXMgdGhlIHN0YXRlcyB2YWx1ZSB3aXRoIHJlbGF0ZWQgdmFsdWUgb2YgcXhtbFxyXG4gICAgICAgIHBhcnNlWG1sKG5ld1htbCk7XHJcbiAgICAgICAgbGV0IHVzZXJhbnMgPSAnJywgdWFYTUwgPSB7fTtcclxuICAgICAgICBpZiAodXhtbCkge1xyXG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUganNvbiBkYXRhIG9mIHVzZXIgYW5zd2VyXHJcbiAgICAgICAgICAgIHVhWE1MID0gWE1MVG9KU09OKHdpbmRvdy51YVhNTCk7XHJcbiAgICAgICAgICAgIGlmICggdWFYTUwgJiYgdWFYTUwuc21hbnMgJiYgdWFYTUwuc21hbnMuZGl2ICYmIHVhWE1MLnNtYW5zLmRpdi5fdXNlckFucykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mIHVzZXIgYW5zd2VyXHJcbiAgICAgICAgICAgICAgICB1c2VyYW5zID0gdWFYTUwuc21hbnMuZGl2Ll91c2VyQW5zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcmV2aWV3X3N0b3JlLnVwZGF0ZSggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5tb2R1bGVUeXBlID0gbmV3WG1sLnNteG1sLmNoYXJ0Ll90eXBlO1xyXG4gICAgICAgICAgICBpdGVtLnVzZXJhbnMgPSB1c2VyYW5zO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBzaG93cyB0aGUgYWRkLCBkZWxldGUgYW5kIEFEQSBidXR0b25zXHRcclxuICAgICAgICBBSC5zZWxlY3RBbGwoJyNjaGFydG1haW4wIC5zZXRkYXRhJywgJ2NzcycsIHtcclxuICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGhpZGVzIEFEQSBidXR0b24gaW4gTW9iaWxlIGFwcFxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcclxuICAgICAgICAgICAgQUguc2V0Q3NzKCcjY2hhcnRtYWluMCAjQURBX0J0bl9wb2ludCcsIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdub25lJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGVzIHRoZSBzdGF0ZXMgdmFsdWUgd2l0aCByZWxhdGVkIHZhbHVlIG9mIHF4bWxcclxuICAgIGZ1bmN0aW9uIHBhcnNlWG1sKFFYTUwpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyB1cGRhdGVzIHNvbWUgc3RhdGVzIHZhbHVlXHJcbiAgICAgICAgICAgIHByZXZpZXdfc3RvcmUudXBkYXRlKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mIGNoYXJ0IHR5cGVcclxuICAgICAgICAgICAgICAgIGl0ZW0ubW9kdWxlVHlwZSA9IFFYTUwuc214bWwuY2hhcnQuX3R5cGU7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgY29sb3IgdmFsdWUgZm9yIGNvbHVtbi9wb2ludCBjb2xvclxyXG4gICAgICAgICAgICAgICAgaXRlbS5jb2xvciA9IFFYTUwuc214bWwuY2hhcnQuX2NvbG9yO1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGNvcnJlY3QgYW5zd2VyIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBpdGVtLmNvcnJlY3RhbnMgPSBRWE1MLnNteG1sLmNoYXJ0Ll9jb3JyZWN0YW5zO1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGRlZmF1bHQgYW5zd2VyIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBpdGVtLmRlZmF1bHRhbnMgPSBRWE1MLnNteG1sLmNoYXJ0Ll9kZWZhdWx0YW5zO1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgaGVpZ2h0IHZhbHVlIGZvciBjaGFydCBjb250YWluZXJcclxuICAgICAgICAgICAgICAgIGl0ZW0uaGVpZ2h0ID0gUVhNTC5zbXhtbC5jaGFydC5faGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHNuYXBUbyB2YWx1ZSBmb3IgY2hhcnRcclxuICAgICAgICAgICAgICAgIGl0ZW0uc25hcFRvID0gUVhNTC5zbXhtbC5jaGFydC5fc25hcHRvO1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGl0bGUgdmFsdWUgZm9yIGNoYXJ0XHJcbiAgICAgICAgICAgICAgICBpdGVtLnRpdGxlID0gUVhNTC5zbXhtbC5jaGFydC5fdGl0bGU7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyB3aWR0aCBvZiB0aGUgY2hhcnQgY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICBpdGVtLndpZHRoID0gUVhNTC5zbXhtbC5jaGFydC5fd2lkdGg7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyB4LWF4aXMgaW50ZXJ2YWwgdmFsdWVcclxuICAgICAgICAgICAgICAgIGl0ZW0ueGludGVydmFsID0gUVhNTC5zbXhtbC5jaGFydC5feGludGVydmFsO1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgbGFiZWwgdmFsdWUgb2YgeC1heGlzXHJcbiAgICAgICAgICAgICAgICBpdGVtLnhsYWJlbCA9IFFYTUwuc214bWwuY2hhcnQuX3hsYWJlbDtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIG1heGltdW0gdmFsdWUgb2YgeC1heGlzXHJcbiAgICAgICAgICAgICAgICBpdGVtLnhtYXggPSBRWE1MLnNteG1sLmNoYXJ0Ll94bWF4O1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgbWluaW11bSB2YWx1ZSBvZiB4LWF4aXNcclxuICAgICAgICAgICAgICAgIGl0ZW0ueG1pbiA9IFFYTUwuc214bWwuY2hhcnQuX3htaW47XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgeHZhbCB2YWx1ZSBmb3IgY2hhcnRcclxuICAgICAgICAgICAgICAgIGl0ZW0ueHZhbCA9IFFYTUwuc214bWwuY2hhcnQuX3h2YWw7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyBpbnRlcnZhbCB2YWx1ZSBvZiB5LWF4aXNcclxuICAgICAgICAgICAgICAgIGl0ZW0ueWludGVydmFsID0gUVhNTC5zbXhtbC5jaGFydC5feWludGVydmFsO1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgbGFiZWwgdmFsdWUgb2YgeS1heGlzXHJcbiAgICAgICAgICAgICAgICBpdGVtLnlsYWJlbCA9IFFYTUwuc214bWwuY2hhcnQuX3lsYWJlbDtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIG1heGltdW0gdmFsdWUgb2YgeS1heGlzXHJcbiAgICAgICAgICAgICAgICBpdGVtLnltYXggPSBRWE1MLnNteG1sLmNoYXJ0Ll95bWF4O1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgbWluaW11bSB2YWx1ZSBvZiB5LWF4aXNcclxuICAgICAgICAgICAgICAgIGl0ZW0ueW1pbiA9IFFYTUwuc214bWwuY2hhcnQuX3ltaW47XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfSk7ICAgICBcclxuICAgICAgICAgICAgLy8gY3JlYXRlcyBhbiBhcnJheVxyXG4gICAgICAgICAgICBsZXQgeHZhbCA9IFtdO1xyXG4gICAgICAgICAgICAvLyBjb250YWlucyBtaW5pbXVuIHZhbHVlIG9mIHgtYXhpc1xyXG4gICAgICAgICAgICBsZXQgeG1pbiA9IHBhcnNlSW50KFFYTUwuc214bWwuY2hhcnQuX3htaW4pO1xyXG4gICAgICAgICAgICAvLyBjb250YWlucyBtYXhpbXVuIHZhbHVlIG9mIHgtYXhpc1xyXG4gICAgICAgICAgICBsZXQgeG1heCA9IHBhcnNlSW50KFFYTUwuc214bWwuY2hhcnQuX3htYXgpO1xyXG4gICAgICAgICAgICAvLyBjb250YWlucyB4LWF4aXMgaW50ZXJ2YWwgdmFsdWVcclxuICAgICAgICAgICAgbGV0IHhpbnRlcnZhbCA9IHBhcnNlSW50KFFYTUwuc214bWwuY2hhcnQuX3hpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0geG1pbjsgaW5kZXggPD0geG1heDsgaW5kZXggPSBpbmRleCArIHhpbnRlcnZhbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgcG9zc2libGUgeC1wb2ludHMgZnJvbSBtaW4gdG8gbWF4IHdpdGggc3BlY2lmaWVkIGludGVydmFsIFxyXG4gICAgICAgICAgICAgICAgeHZhbC5wdXNoKGluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjaGFuZ2UgdGhlIHh2YWwgdmFsdWUgb2YgcXhtbFxyXG4gICAgICAgICAgICBRWE1MLnNteG1sLmNoYXJ0Ll94dmFsID0gXCJbXCIgKyB4dmFsLnRvU3RyaW5nKCkgKyBcIl1cIjtcclxuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBzdGF0ZSAneHZhbCcgdmFsdWVcclxuICAgICAgICAgICAgcHJldmlld19zdG9yZS51cGRhdGUoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnh2YWwgPSBRWE1MLnNteG1sLmNoYXJ0Ll94dmFsO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybih7ICdlcnJvcic6IGVycm9yLCAnZnVuY3Rpb24nOiAncGFyc2VYTUwnLCAnRmlsZSc6ICdDaGFydFByZXZpZXcuc3ZlbHRlJyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gZm9yIGhhbmRsaW5nIHRoZSByZXZpZXcgbW9kZVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlUmV2aWV3TW9kZShtb2RlKSB7XHJcbiAgICAgICAgaWYgKG1vZGUgPT0gJ2MnKSB7XHJcbiAgICAgICAgICAgIENIQVJULnNob3dhbnNkcmFnKCcjY2hhcnRtYWluMCcsICdjJywgMSlcclxuICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT0gJ3UnKSB7XHJcbiAgICAgICAgICAgIENIQVJULnNob3dhbnNkcmFnKCcjY2hhcnRtYWluMCcsICd1JywgMSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZnVuY3Rpb24gd2hlbiB0aGUgcmV2aWV3IG1vZGUgaXMgb25cclxuICAgIGZ1bmN0aW9uIHNldFJldmlldyAoKSB7XHJcbiAgICAgICAgaXNSZXZpZXcgPSB0cnVlO1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIHNob3cgdGhlIGNvcnJlY3QgYW5zd2VyXHJcbiAgICAgICAgQ0hBUlQudGVtcFZhciA9ICdjJztcclxuICAgICAgICAvLyB1c2VkIGZvciBsb2FkIGFuZCBkcmF3IHRoZSBjaGFydFxyXG4gICAgICAgIENIQVJULnJlYWR5VGhpcyhcIiNjaGFydG1haW4wXCIsIDEsIHV4bWwpO1xyXG4gICAgICAgIC8vIHNob3dzIHRoZSBjb3JyZWN0IGFuc3dlclxyXG4gICAgICAgIENIQVJULnNob3dhbnNkcmFnKFwiI2NoYXJ0bWFpbjBcIiwgJ2MnLCAxKTtcclxuICAgICAgICAvLyBzaG93cyB0aGUgdXNlciBhbnN3ZXIgd2l0aCBjaGFuZ2VkIGNvbG9yIG9mIGNvbHVtbnMvcG9pbnRzIGFuZCBhbHNvIGNoYW5nZSB0aGUgY29sb3Igb2YgY2hhcnQgY29udGFpbmVyXHJcbiAgICAgICAgQ0hBUlQuc2hvd2Fuc2RyYWcoXCIjY2hhcnRtYWluMFwiLCAndScsIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGhpZGVzIHRoZSBhZGQsIGRlbGV0ZSBhbmQgQURBIGJ1dHRvbnNcclxuICAgICAgICBBSC5zZWxlY3RBbGwoJyNjaGFydG1haW4wIC5zZXRkYXRhJywgJ2NzcycsIHtcclxuICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gc2hvd3MgdGhlIG1lc3NhZ2UgY29ycmVjdCBvciBpbmNvcnJlY3QgYWNjb3JkaW5nIHRvIHRoZSByZXR1cm4gdmFsdWUgb2YgJ0NIQVJULmNoZWNrQW5zJyBtZXRob2RcclxuICAgICAgICBkaXNwbGF5QW5zKCk7XHJcbiAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgb2YgY3NzIHByb3BlcnRpZXMgb3BhY2l0eSBhbmQgdmlzaWJpbGl0eSBvZiBjb2x1bW5zL3BvaW50c1xyXG4gICAgICAgIEFILnNlbGVjdEFsbChcIi5oaWdoY2hhcnRzLXRyYWNrZXJcIiwgJ2NzcycgLCB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IFwiMVwiLFxyXG4gICAgICAgICAgICB2aXNpYmlsaXR5OiBcInZpc2libGVcIiBcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXNldFBhdGhzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVzcG9uc2libGUgZm9yIHNob3dpbmcgdGhlIGFuc3dlclxyXG4gICAgZnVuY3Rpb24gZGlzcGxheUFucygpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gQ0hBUlQuY2hlY2tBbnMoJyNjaGFydG1haW4wJyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZihpc19zbSkgIT0gXCJ1bmRlZmluZWRcIikgQUguc2hvd21zZyhyZXN1bHQuYW5zID8gXCJDb3JyZWN0XCIgOiBcIkluY29ycmVjdFwiLCAzMDAwKTtcclxuICAgICAgICBpZiAoZWRpdG9yU3RhdGUpIHtcclxuICAgICAgICAgICAgLy8gc2hvd3MgdGhlIGFuc3dlciBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIG9mIGl0cyBhcmd1bWVudCBwYXNzZWRcclxuICAgICAgICAgICAgc2hvd0FucyhyZXN1bHQuYW5zID8gXCJDb3JyZWN0XCI6XCJJbmNvcnJlY3RcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9uVXNlckFuc0NoYW5nZShyZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHdoZW4gdGhlIHJldmlldyBtb2RlIGlzIG9mZlxyXG4gICAgZnVuY3Rpb24gdW5zZXRSZXZpZXcgKCkge1xyXG4gICAgICAgIGlzUmV2aWV3ID0gZmFsc2U7XHJcbiAgICAgICAgLy8gdXNlZCBmb3Igc2hvdyB0aGUgdXNlciBhbnN3ZXJcclxuICAgICAgICBDSEFSVC50ZW1wVmFyID0gJ3UnO1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIGxvYWQgYW5kIGRyYXcgdGhlIGNoYXJ0XHJcbiAgICAgICAgQ0hBUlQucmVhZHlUaGlzKFwiI2NoYXJ0bWFpbjBcIiwgMCwgdXhtbCk7XHJcbiAgICAgICAgLy8gc2hvd3MgdGhlIHVzZXIgYW5zd2VyIGJ1dCBub3QgY2hhbmdlIHRoZSBib3JkZXIgY29sb3Igb3IgY29sdW1uL3BvaW50IGNvbG9yIGFuZCBub3Qgc2hvd3MgY2hlY2sgb3IgY2FuY2VsIG1hcmtcclxuICAgICAgICBDSEFSVC5zaG93YW5zZHJhZyhcIiNjaGFydG1haW4wXCIsICd1JywgMCk7XHJcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgcmVzdWx0IHN0YXR1cyBhbmQgY3JlYXRlcyB0aGUgdXNlciBhbnN3ZXIgeG1sIGFuZCBzaG93cyB0aGUgY29ycmVjdCBvciBpbmNvcnJlY3QgbWVzc2FnZSBhY2NvcmRpbmcgdG8gdGhlIHN0YXR1cyBvZiByZXN1bHQgaW4gc25hY2tiYXJcclxuICAgICAgICBDSEFSVC5jaGVja0FucyhcIiNjaGFydG1haW4wXCIpO1xyXG4gICAgICAgIC8vIHNob3dzIHRoZSAnYWRkJyAoKyksICdkZWxldGUnIGFuZCAnQURBJyBidXR0b25zXHJcbiAgICAgICAgQUguc2VsZWN0QWxsKCcjY2hhcnRtYWluMCAuc2V0ZGF0YScsICdjc3MnLCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaydcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBoaWRlcyBBREEgYnV0dG9uIGluIE1vYmlsZSBhcHBcclxuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XHJcbiAgICAgICAgICAgIEFILnNlbGVjdCgnI2NoYXJ0bWFpbjAgI0FEQV9CdG5fcG9pbnQnKS5jbGFzc0xpc3QuYWRkKCdoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldHMgdGhlIGJvcmRlciBjb2xvciBvZiB0aGUgY2hhcnQgY29udGFpbmVyXHJcbiAgICAgICAgQUguc2VsZWN0QWxsKCcjYW5zd2VySUQwJywgJ2NzcycsIHtcclxuICAgICAgICAgICAgXCJib3JkZXJcIjogXCIxcHggc29saWQgcmdiKDIwNCwgMjA0LCAyMDQpXCIgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmVzZXRQYXRocygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHdoZW4gdGhlIHJldmlldyBtb2RlIGlzIG9mZlxyXG4gICAgZnVuY3Rpb24gdXBkYXRlSW5wdXRFbG0oaW5kZXgsIGV2ZW50KSB7XHJcbiAgICAgICAgLy8gaG9sZHMgdGhlIGNoYW5nZWQgdmFsdWUgb2YgaW5wdXQgZmllbGQgd2hpY2ggdmFsdWUgY2hhbmdlZCBpbiAnU2V0IEFuc3dlcicgZGlhbG9nYm94XHJcbiAgICAgICAgaG9sZFVzZXJBbnNbaW5kZXhdID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIGxvYWRNb2RhbFZpZXcoKTtcclxuICAgIH1cclxuXHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdj5cclxuICAgIDxjZW50ZXI+XHJcbiAgICAgICAgPEl0ZW1IZWxwZXIgXHJcbiAgICAgICAgICAgIG9uOnNldFJldmlldyA9IHtzZXRSZXZpZXd9XHJcbiAgICAgICAgICAgIG9uOnVuc2V0UmV2aWV3ID0ge3Vuc2V0UmV2aWV3fVxyXG4gICAgICAgICAgICByZXZpZXdNb2RlPXtpc1Jldmlld31cclxuICAgICAgICAgICAgaGFuZGxlUmV2aWV3Q2xpY2sgPSB7aGFuZGxlUmV2aWV3TW9kZX1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxkaXYgaWQ9XCJjaGFydG1haW4wXCIgY2xhc3M9XCJ1c2VyQW5zXCI+XHJcbiAgICAgICAgICAgIHsjaWYgd2luZG93LmluTmF0aXZlfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5hdGl2ZV9jaGFydF9oZWFkZXJcIiBzdHlsZT1cIndpZHRoOntzdGF0ZS53aWR0aH1weDtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNldGRhdGEgbmF0aXZlX2FkZCBwLTIgZmxvYXQtZW5kIHBvc2l0aW9uLXJlbGF0aXZlXCIgb246Y2xpY2s9eygpID0+IENIQVJULnVwZGF0ZVBvaW50UHJldmlldygnYWRkUG9pbnQnLCAnYW5zd2VySUQwJyl9PjxzcGFuIGNsYXNzPVwiczNcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJwb3NpdGlvbi1yZWxhdGl2ZSBuYXRpdmVfYWRkX3RleHRcIj57bC5hZGR9PC9zcGFuPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNldGRhdGEgcG9zaXRpb24tcmVsYXRpdmUgbmF0aXZlX3JlbW92ZVwiIG9uOmNsaWNrPXsoKSA9PiBDSEFSVC51cGRhdGVQb2ludFByZXZpZXcoJ3JlbW92ZVBvaW50JywgJ2Fuc3dlcklEMCcpfT48c3BhbiBjbGFzcz1cInMzXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwicG9zaXRpb24tcmVsYXRpdmVcIj57bC5yZW1vdmV9PC9zcGFuPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2hhcnRfaGVhZGVyX2NvbnRhaW5lclwiIHN0eWxlPVwid2lkdGg6IHtzdGF0ZS53aWR0aH1weDtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxvYXQtZW5kIHB0LTEgcHItMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxvYXQtc3RhcnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdGFiaW5kZXg9XCIwXCIgYXJpYS1sYWJlbD17bC5hZGR9IGlkPVwiYWRkX3ByZXZcIiBjbGFzcz1cInNldGRhdGEgYnRuLWxpZ2h0IGJ0biB3LWF1dG8gaC1hdXRvIHAtMSBiZy13aGl0ZSBib3JkZXIgZmxvYXQtc3RhcnRcIiBvbjpjbGljaz17KCkgPT4gQ0hBUlQudXBkYXRlUG9pbnRQcmV2aWV3KCdhZGRQb2ludCcsICdhbnN3ZXJJRDAnKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCIgdGl0bGU9e2wuYWRkfSBjbGFzcz1cImljb21vb24tcGx1cyBzMlwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0YWJpbmRleD1cIjBcIiBhcmlhLWxhYmVsPXtsLmRlbGV0ZX0gaWQ9XCJkZWxldGVfcHJldlwiIGNsYXNzPVwic2V0ZGF0YSBidG4tbGlnaHQgYnRuIHctYXV0byBoLWF1dG8gcC0xIGJnLXdoaXRlIGJvcmRlciBtcy0xIGZsb2F0LXN0YXJ0XCIgIG9uOmNsaWNrPXsoKSA9PiBDSEFSVC51cGRhdGVQb2ludFByZXZpZXcoJ3JlbW92ZVBvaW50JywgJ2Fuc3dlcklEMCcpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIiB0aXRsZT17bC5kZWxldGV9IGNsYXNzPVwiaWNvbW9vbi1uZXctMjRweC1kZWxldGUtMSBzMlwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0YWJpbmRleD1cIjBcIiBpZD1cIkFEQV9CdG5fcG9pbnRcIiBhcmlhLWxhYmVsPXtsLm9wZW5fbW9kYWx9IGNsYXNzPXtcInNldGRhdGEgQURBX0J0biBidG4tbGlnaHQgYnRuIHctYXV0byBoLWF1dG8gcC0xIGJnLXdoaXRlIGJvcmRlciBtcy0xIGZsb2F0LXN0YXJ0XCJ9ICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCIgdGl0bGU9e2wuYWRhX2NoYXJ0X21zZ30gY2xhc3M9XCJpY29tb29uLWtleWJvYXJkLTIgczJcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgPGRpdiBpZD1cImFuc3dlcklEMFwiIHR5cGU9e3N0YXRlLm1vZHVsZVR5cGV9IHdpZHRoPXtzdGF0ZS53aWR0aH0gaGVpZ2h0PXtzdGF0ZS5oZWlnaHR9IGNsYXNzPXsnZHJhZy1yZXNpemUgY2hhcnRfcHJldmlld19jb250YWluZXIgJyArIHN0YXRlLm1vZHVsZVR5cGV9IHNuYXB0bz17c3RhdGUuc25hcFRvfSB4dmFsPXtzdGF0ZS54dmFsfSB5dmFsPXtzdGF0ZS55dmFsfSB5aW50ZXJ2YWw9e3N0YXRlLnlpbnRlcnZhbH0geW1pbj17c3RhdGUueW1pbn0geW1heD17c3RhdGUueW1heH0gZGVmYXVsdGFucz17c3RhdGUuZGVmYXVsdGFuc30gdXNlcmFucz17c3RhdGUudXNlcmFuc30gY29ycmVjdGFucz17c3RhdGUuY29ycmVjdGFuc30geGxhYmVsPXtzdGF0ZS54bGFiZWx9IHlsYWJlbD17c3RhdGUueWxhYmVsfSB0aXRsZT17c3RhdGUudGl0bGV9IGNvbG9yPXtzdGF0ZS5jb2xvcn0gc3R5bGU9XCJ3aWR0aDoge3N0YXRlLndpZHRofXB4O1wiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9jZW50ZXI+XHJcbiAgICA8ZGl2IGlkPVwiY2hhcnRfbW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiB0YWJJbmRleD1cIi0xXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZyBtb2RhbC1kaWFsb2ctY2VudGVyZWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiPntsLnNldF9hbnN9PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbG9hdC1lbmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1saWdodFwiIGlkPVwidXBkYXRlUm93XCIgb246Y2xpY2s9eygpPT4ge3VwZGF0ZVJvdyhcImFkZFwiKX19PntsLmFkZF9wb2ludH08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1saWdodCBtbC0xXCIgaWQ9XCJkZWxldGVfYnRuXCIgb246Y2xpY2s9eygpPT4ge3VwZGF0ZVJvdyhcInJlbW92ZVwiKX19PntsLmRlbF9yb3d9PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IG92ZXJmbG93LXlcIj5cclxuICAgICAgICAgICAgICAgICAgICB7I2VhY2ggIHN0YXRlLm1vZGFsVmlld0xheW91dCBhcyBkYXRhLCBpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7I2lmIGRhdGEubW9kdWxlVHlwZSA9PSAnY29sdW1uJyB8fCAgZGF0YS5tb2R1bGVUeXBlID09ICdsaW5lJyB8fCAgZGF0YS5tb2R1bGVUeXBlID09ICdoaXN0b2dyYW0nIHx8ICBkYXRhLm1vZHVsZVR5cGUgPT0gJ2RvdHBsb3QnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBtYWluRGl2IG10LTJcIiBpZD17XCJkaXZBbGxUZXh0Qm94XCIgKyAoaSl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbC02IHRleHQtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJQb2ludCBcIiArIChpICsgMSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e2l9IHJlYWRvbmx5PVwicmVhZG9ubHlcIiBjbGFzcz1cImdldEZpZWxkVmFsIGZvcm0tY29udHJvbCBtdC0yXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbC02IHRleHQtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJWYWx1ZSBcIiArIChpICsgMSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e2RhdGEudmFsdWV9IG9uOmNoYW5nZT0geyAoZSkgPT4ge3VwZGF0ZUlucHV0RWxtKGksIGUpfX0gcGxhY2Vob2xkZXI9XCJJbnNlcnQgbnVtZXJpYyBkYXRhXCIgY2xhc3M9XCJwb2ludF94XzEgZ2V0RmllbGRWYWwgZm9ybS1jb250cm9sIG10LTJcIiBpZD17XCJzZXRBbnNCeUtleVwiICsgKGkgKyAxKX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpZ2h0XCIgZGF0YS1icy1kaXNtaXNzPVwibW9kYWxcIj57bC5jYW5jZWx9PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb246Y2xpY2s9e21vZGlmeVV4bWxPbktleX0gY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiPntsLm9rX2J0bn08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuPHN0eWxlPlxyXG4gICAgI2NoYXJ0X21vZGFsIC5tb2RhbC1ib2R5IHtcclxuICAgICAgICBtYXgtaGVpZ2h0OiAzNTBweDtcclxuICAgIH1cclxuXHJcbiAgICAubmF0aXZlX2NoYXJ0X2hlYWRlciB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogI2UwZTBlMDtcclxuICAgICAgICBoZWlnaHQ6IDM2cHg7XHJcbiAgICB9XHJcblxyXG4gICAgLmNoYXJ0X3ByZXZpZXdfY29udGFpbmVyIHtcclxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG4gICAgICAgIG92ZXJmbG93OiB2aXNpYmxlICFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLm5hdGl2ZV9hZGQge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICNlMGUwZTA7IFxyXG4gICAgICAgIHdpZHRoOiBhdXRvO1xyXG4gICAgICAgIGJvdHRvbTogMTBweFxyXG4gICAgfVxyXG5cclxuICAgIC5uYXRpdmVfYWRkX3RleHQge1xyXG4gICAgICAgIGJvdHRvbTogMnB4OyBcclxuICAgICAgICBsZWZ0OiAycHg7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC5uYXRpdmVfcmVtb3ZlIHtcclxuICAgICAgICBwYWRkaW5nOiA3LjVweDsgXHJcbiAgICAgICAgYmFja2dyb3VuZDogI2UwZTBlMDsgXHJcbiAgICAgICAgd2lkdGg6IGF1dG87IFxyXG4gICAgICAgIGxlZnQ6IDIyMHB4OyBcclxuICAgICAgICB0b3A6IDdweDtcclxuICAgIH1cclxuXHJcbiAgICAjY2hhcnRfaGVhZGVyX2NvbnRhaW5lciB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogI2UwZTBlMDsgXHJcbiAgICAgICAgaGVpZ2h0OiAzOHB4O1xyXG4gICAgfVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF1a0JJLDBCQUFZLENBQUMsV0FBVyxjQUFDLENBQUMsQUFDdEIsVUFBVSxDQUFFLEtBQUssQUFDckIsQ0FBQyxBQUVELG9CQUFvQiw0QkFBQyxDQUFDLEFBQ2xCLFVBQVUsQ0FBRSxPQUFPLENBQ25CLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMsQUFFRCx3QkFBd0IsNEJBQUMsQ0FBQyxBQUN0QixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLFFBQVEsQ0FBRSxPQUFPLENBQUMsVUFBVSxBQUNoQyxDQUFDLEFBRUQsV0FBVyw0QkFBQyxDQUFDLEFBQ1QsVUFBVSxDQUFFLE9BQU8sQ0FDbkIsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSTtJQUNoQixDQUFDLEFBRUQsZ0JBQWdCLDRCQUFDLENBQUMsQUFDZCxNQUFNLENBQUUsR0FBRyxDQUNYLElBQUksQ0FBRSxHQUFHLEFBQ2IsQ0FBQyxBQUVELGNBQWMsNEJBQUMsQ0FBQyxBQUNaLE9BQU8sQ0FBRSxLQUFLLENBQ2QsVUFBVSxDQUFFLE9BQU8sQ0FDbkIsS0FBSyxDQUFFLElBQUksQ0FDWCxJQUFJLENBQUUsS0FBSyxDQUNYLEdBQUcsQ0FBRSxHQUFHLEFBQ1osQ0FBQyxBQUVELHVCQUF1Qiw0QkFBQyxDQUFDLEFBQ3JCLFVBQVUsQ0FBRSxPQUFPLENBQ25CLE1BQU0sQ0FBRSxJQUFJLEFBQ2hCLENBQUMifQ== */";
	append_dev(document_1.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[33] = list[i];
	child_ctx[35] = i;
	return child_ctx;
}

// (525:12) {:else}
function create_else_block(ctx) {
	let div2;
	let div1;
	let div0;
	let button0;
	let span0;
	let span0_title_value;
	let button0_aria_label_value;
	let t0;
	let button1;
	let span1;
	let span1_title_value;
	let button1_aria_label_value;
	let t1;
	let button2;
	let span2;
	let span2_title_value;
	let button2_aria_label_value;
	let button2_class_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			button0 = element("button");
			span0 = element("span");
			t0 = space();
			button1 = element("button");
			span1 = element("span");
			t1 = space();
			button2 = element("button");
			span2 = element("span");
			attr_dev(span0, "data-bs-toggle", "tooltip");
			attr_dev(span0, "title", span0_title_value = Lang.add);
			attr_dev(span0, "class", "icomoon-plus s2");
			add_location(span0, file, 529, 32, 22852);
			attr_dev(button0, "tabindex", "0");
			attr_dev(button0, "aria-label", button0_aria_label_value = Lang.add);
			attr_dev(button0, "id", "add_prev");
			attr_dev(button0, "class", "setdata btn-light btn w-auto h-auto p-1 bg-white border float-start");
			add_location(button0, file, 528, 28, 22621);
			attr_dev(span1, "data-bs-toggle", "tooltip");
			attr_dev(span1, "title", span1_title_value = Lang.delete);
			attr_dev(span1, "class", "icomoon-new-24px-delete-1 s2");
			add_location(span1, file, 532, 32, 23243);
			attr_dev(button1, "tabindex", "0");
			attr_dev(button1, "aria-label", button1_aria_label_value = Lang.delete);
			attr_dev(button1, "id", "delete_prev");
			attr_dev(button1, "class", "setdata btn-light btn w-auto h-auto p-1 bg-white border ms-1 float-start");
			add_location(button1, file, 531, 28, 22997);
			attr_dev(span2, "data-bs-toggle", "tooltip");
			attr_dev(span2, "title", span2_title_value = Lang.ada_chart_msg);
			attr_dev(span2, "class", "icomoon-keyboard-2 s2");
			add_location(span2, file, 535, 32, 23597);
			attr_dev(button2, "tabindex", "0");
			attr_dev(button2, "id", "ADA_Btn_point");
			attr_dev(button2, "aria-label", button2_aria_label_value = Lang.open_modal);
			attr_dev(button2, "class", button2_class_value = "setdata ADA_Btn btn-light btn w-auto h-auto p-1 bg-white border ms-1 float-start");
			add_location(button2, file, 534, 28, 23404);
			attr_dev(div0, "class", "float-start");
			add_location(div0, file, 527, 24, 22566);
			attr_dev(div1, "class", "float-end pt-1 pr-1");
			add_location(div1, file, 526, 20, 22507);
			attr_dev(div2, "id", "chart_header_container");
			set_style(div2, "width", /*state*/ ctx[2].width + "px");
			attr_dev(div2, "class", "svelte-bzsii3");
			add_location(div2, file, 525, 16, 22420);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, div0);
			append_dev(div0, button0);
			append_dev(button0, span0);
			append_dev(div0, t0);
			append_dev(div0, button1);
			append_dev(button1, span1);
			append_dev(div0, t1);
			append_dev(div0, button2);
			append_dev(button2, span2);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler_2*/ ctx[15], false, false, false),
					listen_dev(button1, "click", /*click_handler_3*/ ctx[16], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 4) {
				set_style(div2, "width", /*state*/ ctx[2].width + "px");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(525:12) {:else}",
		ctx
	});

	return block;
}

// (520:12) {#if window.inNative}
function create_if_block_1(ctx) {
	let div;
	let span2;
	let span0;
	let span1;
	let t1;
	let span5;
	let span3;
	let span4;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			span2 = element("span");
			span0 = element("span");
			span1 = element("span");
			span1.textContent = `${Lang.add}`;
			t1 = space();
			span5 = element("span");
			span3 = element("span");
			span4 = element("span");
			span4.textContent = `${Lang.remove}`;
			attr_dev(span0, "class", "s3");
			add_location(span0, file, 521, 152, 22038);
			attr_dev(span1, "class", "position-relative native_add_text svelte-bzsii3");
			add_location(span1, file, 521, 176, 22062);
			attr_dev(span2, "class", "setdata native_add p-2 float-end position-relative svelte-bzsii3");
			add_location(span2, file, 521, 20, 21906);
			attr_dev(span3, "class", "s3");
			add_location(span3, file, 522, 144, 22277);
			attr_dev(span4, "class", "position-relative");
			add_location(span4, file, 522, 168, 22301);
			attr_dev(span5, "class", "setdata position-relative native_remove svelte-bzsii3");
			add_location(span5, file, 522, 20, 22153);
			attr_dev(div, "class", "native_chart_header svelte-bzsii3");
			set_style(div, "width", /*state*/ ctx[2].width + "px");
			add_location(div, file, 520, 16, 21820);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, span2);
			append_dev(span2, span0);
			append_dev(span2, span1);
			append_dev(div, t1);
			append_dev(div, span5);
			append_dev(span5, span3);
			append_dev(span5, span4);

			if (!mounted) {
				dispose = [
					listen_dev(span2, "click", /*click_handler*/ ctx[13], false, false, false),
					listen_dev(span5, "click", /*click_handler_1*/ ctx[14], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 4) {
				set_style(div, "width", /*state*/ ctx[2].width + "px");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(520:12) {#if window.inNative}",
		ctx
	});

	return block;
}

// (561:24) {#if data.moduleType == 'column' ||  data.moduleType == 'line' ||  data.moduleType == 'histogram' ||  data.moduleType == 'dotplot'}
function create_if_block(ctx) {
	let div;
	let label0;
	let t0_value = "Point " + (/*i*/ ctx[35] + 1) + "";
	let t0;
	let t1;
	let input0;
	let input0_value_value;
	let t2;
	let label1;
	let t3_value = "Value " + (/*i*/ ctx[35] + 1) + "";
	let t3;
	let t4;
	let input1;
	let input1_value_value;
	let input1_id_value;
	let t5;
	let div_id_value;
	let mounted;
	let dispose;

	function change_handler(...args) {
		return /*change_handler*/ ctx[19](/*i*/ ctx[35], ...args);
	}

	const block = {
		c: function create() {
			div = element("div");
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
			input0.value = input0_value_value = /*i*/ ctx[35];
			input0.readOnly = "readonly";
			attr_dev(input0, "class", "getFieldVal form-control mt-2");
			add_location(input0, file, 564, 36, 25680);
			attr_dev(label0, "class", "col-6 text-body");
			add_location(label0, file, 562, 32, 25553);
			attr_dev(input1, "type", "number");
			input1.value = input1_value_value = /*data*/ ctx[33].value;
			attr_dev(input1, "placeholder", "Insert numeric data");
			attr_dev(input1, "class", "point_x_1 getFieldVal form-control mt-2 svelte-bzsii3");
			attr_dev(input1, "id", input1_id_value = "setAnsByKey" + (/*i*/ ctx[35] + 1));
			add_location(input1, file, 568, 36, 25974);
			attr_dev(label1, "class", "col-6 text-body");
			add_location(label1, file, 566, 32, 25847);
			attr_dev(div, "class", "row mainDiv mt-2 svelte-bzsii3");
			attr_dev(div, "id", div_id_value = "divAllTextBox" + /*i*/ ctx[35]);
			add_location(div, file, 561, 28, 25462);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, label0);
			append_dev(label0, t0);
			append_dev(label0, t1);
			append_dev(label0, input0);
			append_dev(div, t2);
			append_dev(div, label1);
			append_dev(label1, t3);
			append_dev(label1, t4);
			append_dev(label1, input1);
			append_dev(div, t5);

			if (!mounted) {
				dispose = listen_dev(input1, "change", change_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*state*/ 4 && input1_value_value !== (input1_value_value = /*data*/ ctx[33].value)) {
				prop_dev(input1, "value", input1_value_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(561:24) {#if data.moduleType == 'column' ||  data.moduleType == 'line' ||  data.moduleType == 'histogram' ||  data.moduleType == 'dotplot'}",
		ctx
	});

	return block;
}

// (560:20) {#each  state.modalViewLayout as data, i}
function create_each_block(ctx) {
	let if_block_anchor;
	let if_block = (/*data*/ ctx[33].moduleType == "column" || /*data*/ ctx[33].moduleType == "line" || /*data*/ ctx[33].moduleType == "histogram" || /*data*/ ctx[33].moduleType == "dotplot") && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[33].moduleType == "column" || /*data*/ ctx[33].moduleType == "line" || /*data*/ ctx[33].moduleType == "histogram" || /*data*/ ctx[33].moduleType == "dotplot") {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(560:20) {#each  state.modalViewLayout as data, i}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div11;
	let center;
	let itemhelper;
	let t0;
	let div1;
	let t1;
	let div0;
	let div0_type_value;
	let div0_width_value;
	let div0_height_value;
	let div0_class_value;
	let div0_snapto_value;
	let div0_xval_value;
	let div0_yval_value;
	let div0_yinterval_value;
	let div0_ymin_value;
	let div0_ymax_value;
	let div0_defaultans_value;
	let div0_userans_value;
	let div0_correctans_value;
	let div0_xlabel_value;
	let div0_ylabel_value;
	let div0_title_value;
	let div0_color_value;
	let t2;
	let div10;
	let div9;
	let div8;
	let div5;
	let h5;
	let t4;
	let div4;
	let div3;
	let div2;
	let button0;
	let t6;
	let button1;
	let t8;
	let div6;
	let t9;
	let div7;
	let button2;
	let t11;
	let button3;
	let current;
	let mounted;
	let dispose;

	itemhelper = new ItemHelper({
			props: {
				reviewMode: /*isReview*/ ctx[0],
				handleReviewClick: /*handleReviewMode*/ ctx[5]
			},
			$$inline: true
		});

	itemhelper.$on("setReview", /*setReview*/ ctx[6]);
	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[7]);

	function select_block_type(ctx, dirty) {
		if (window.inNative) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type();
	let if_block = current_block_type(ctx);
	let each_value = /*state*/ ctx[2].modalViewLayout;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div11 = element("div");
			center = element("center");
			create_component(itemhelper.$$.fragment);
			t0 = space();
			div1 = element("div");
			if_block.c();
			t1 = space();
			div0 = element("div");
			t2 = space();
			div10 = element("div");
			div9 = element("div");
			div8 = element("div");
			div5 = element("div");
			h5 = element("h5");
			h5.textContent = `${Lang.set_ans}`;
			t4 = space();
			div4 = element("div");
			div3 = element("div");
			div2 = element("div");
			button0 = element("button");
			button0.textContent = `${Lang.add_point}`;
			t6 = space();
			button1 = element("button");
			button1.textContent = `${Lang.del_row}`;
			t8 = space();
			div6 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t9 = space();
			div7 = element("div");
			button2 = element("button");
			button2.textContent = `${Lang.cancel}`;
			t11 = space();
			button3 = element("button");
			button3.textContent = `${Lang.ok_btn}`;
			attr_dev(div0, "id", "answerID0");
			attr_dev(div0, "type", div0_type_value = /*state*/ ctx[2].moduleType);
			attr_dev(div0, "width", div0_width_value = /*state*/ ctx[2].width);
			attr_dev(div0, "height", div0_height_value = /*state*/ ctx[2].height);
			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty("drag-resize chart_preview_container " + /*state*/ ctx[2].moduleType) + " svelte-bzsii3"));
			attr_dev(div0, "snapto", div0_snapto_value = /*state*/ ctx[2].snapTo);
			attr_dev(div0, "xval", div0_xval_value = /*state*/ ctx[2].xval);
			attr_dev(div0, "yval", div0_yval_value = /*state*/ ctx[2].yval);
			attr_dev(div0, "yinterval", div0_yinterval_value = /*state*/ ctx[2].yinterval);
			attr_dev(div0, "ymin", div0_ymin_value = /*state*/ ctx[2].ymin);
			attr_dev(div0, "ymax", div0_ymax_value = /*state*/ ctx[2].ymax);
			attr_dev(div0, "defaultans", div0_defaultans_value = /*state*/ ctx[2].defaultans);
			attr_dev(div0, "userans", div0_userans_value = /*state*/ ctx[2].userans);
			attr_dev(div0, "correctans", div0_correctans_value = /*state*/ ctx[2].correctans);
			attr_dev(div0, "xlabel", div0_xlabel_value = /*state*/ ctx[2].xlabel);
			attr_dev(div0, "ylabel", div0_ylabel_value = /*state*/ ctx[2].ylabel);
			attr_dev(div0, "title", div0_title_value = /*state*/ ctx[2].title);
			attr_dev(div0, "color", div0_color_value = /*state*/ ctx[2].color);
			set_style(div0, "width", /*state*/ ctx[2].width + "px");
			add_location(div0, file, 541, 12, 23845);
			attr_dev(div1, "id", "chartmain0");
			attr_dev(div1, "class", "userAns");
			add_location(div1, file, 518, 8, 21730);
			add_location(center, file, 511, 4, 21507);
			attr_dev(h5, "class", "modal-title");
			add_location(h5, file, 548, 20, 24582);
			attr_dev(button0, "class", "btn btn-light");
			attr_dev(button0, "id", "updateRow");
			add_location(button0, file, 552, 32, 24794);
			attr_dev(button1, "class", "btn btn-light ml-1");
			attr_dev(button1, "id", "delete_btn");
			add_location(button1, file, 553, 32, 24930);
			attr_dev(div2, "class", "float-end");
			add_location(div2, file, 551, 28, 24737);
			attr_dev(div3, "class", "col-12");
			add_location(div3, file, 550, 24, 24687);
			attr_dev(div4, "class", "row");
			add_location(div4, file, 549, 20, 24644);
			attr_dev(div5, "class", "modal-header");
			add_location(div5, file, 547, 16, 24534);
			attr_dev(div6, "class", "modal-body overflow-y svelte-bzsii3");
			add_location(div6, file, 558, 16, 25177);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-light");
			attr_dev(button2, "data-bs-dismiss", "modal");
			add_location(button2, file, 575, 20, 26399);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "btn btn-secondary");
			add_location(button3, file, 576, 20, 26508);
			attr_dev(div7, "class", "modal-footer");
			add_location(div7, file, 574, 16, 26351);
			attr_dev(div8, "class", "modal-content");
			add_location(div8, file, 546, 12, 24489);
			attr_dev(div9, "class", "modal-dialog modal-dialog-centered");
			add_location(div9, file, 545, 8, 24427);
			attr_dev(div10, "id", "chart_modal");
			attr_dev(div10, "class", "modal fade svelte-bzsii3");
			attr_dev(div10, "tabindex", "-1");
			add_location(div10, file, 544, 4, 24362);
			add_location(div11, file, 510, 0, 21496);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div11, anchor);
			append_dev(div11, center);
			mount_component(itemhelper, center, null);
			append_dev(center, t0);
			append_dev(center, div1);
			if_block.m(div1, null);
			append_dev(div1, t1);
			append_dev(div1, div0);
			append_dev(div11, t2);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, div8);
			append_dev(div8, div5);
			append_dev(div5, h5);
			append_dev(div5, t4);
			append_dev(div5, div4);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, button0);
			append_dev(div2, t6);
			append_dev(div2, button1);
			append_dev(div8, t8);
			append_dev(div8, div6);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div6, null);
			}

			append_dev(div8, t9);
			append_dev(div8, div7);
			append_dev(div7, button2);
			append_dev(div7, t11);
			append_dev(div7, button3);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler_4*/ ctx[17], false, false, false),
					listen_dev(button1, "click", /*click_handler_5*/ ctx[18], false, false, false),
					listen_dev(button3, "click", /*modifyUxmlOnKey*/ ctx[3], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const itemhelper_changes = {};
			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
			itemhelper.$set(itemhelper_changes);
			if_block.p(ctx, dirty);

			if (!current || dirty[0] & /*state*/ 4 && div0_type_value !== (div0_type_value = /*state*/ ctx[2].moduleType)) {
				attr_dev(div0, "type", div0_type_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_width_value !== (div0_width_value = /*state*/ ctx[2].width)) {
				attr_dev(div0, "width", div0_width_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_height_value !== (div0_height_value = /*state*/ ctx[2].height)) {
				attr_dev(div0, "height", div0_height_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_class_value !== (div0_class_value = "" + (null_to_empty("drag-resize chart_preview_container " + /*state*/ ctx[2].moduleType) + " svelte-bzsii3"))) {
				attr_dev(div0, "class", div0_class_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_snapto_value !== (div0_snapto_value = /*state*/ ctx[2].snapTo)) {
				attr_dev(div0, "snapto", div0_snapto_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_xval_value !== (div0_xval_value = /*state*/ ctx[2].xval)) {
				attr_dev(div0, "xval", div0_xval_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_yval_value !== (div0_yval_value = /*state*/ ctx[2].yval)) {
				attr_dev(div0, "yval", div0_yval_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_yinterval_value !== (div0_yinterval_value = /*state*/ ctx[2].yinterval)) {
				attr_dev(div0, "yinterval", div0_yinterval_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_ymin_value !== (div0_ymin_value = /*state*/ ctx[2].ymin)) {
				attr_dev(div0, "ymin", div0_ymin_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_ymax_value !== (div0_ymax_value = /*state*/ ctx[2].ymax)) {
				attr_dev(div0, "ymax", div0_ymax_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_defaultans_value !== (div0_defaultans_value = /*state*/ ctx[2].defaultans)) {
				attr_dev(div0, "defaultans", div0_defaultans_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_userans_value !== (div0_userans_value = /*state*/ ctx[2].userans)) {
				attr_dev(div0, "userans", div0_userans_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_correctans_value !== (div0_correctans_value = /*state*/ ctx[2].correctans)) {
				attr_dev(div0, "correctans", div0_correctans_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_xlabel_value !== (div0_xlabel_value = /*state*/ ctx[2].xlabel)) {
				attr_dev(div0, "xlabel", div0_xlabel_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_ylabel_value !== (div0_ylabel_value = /*state*/ ctx[2].ylabel)) {
				attr_dev(div0, "ylabel", div0_ylabel_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_title_value !== (div0_title_value = /*state*/ ctx[2].title)) {
				attr_dev(div0, "title", div0_title_value);
			}

			if (!current || dirty[0] & /*state*/ 4 && div0_color_value !== (div0_color_value = /*state*/ ctx[2].color)) {
				attr_dev(div0, "color", div0_color_value);
			}

			if (!current || dirty[0] & /*state*/ 4) {
				set_style(div0, "width", /*state*/ ctx[2].width + "px");
			}

			if (dirty[0] & /*state, updateInputElm*/ 260) {
				each_value = /*state*/ ctx[2].modalViewLayout;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div6, null);
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
			if (detaching) detach_dev(div11);
			destroy_component(itemhelper);
			if_block.d();
			destroy_each(each_blocks, detaching);
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
	validate_slots("ChartPreview", slots, []);
	let { xml } = $$props;
	let { uxml } = $$props;
	let { isReview } = $$props;
	let { showAns } = $$props;
	let { editorState } = $$props;
	let state = {};

	// newXml used for contain the xml in json format, chartObj contains the instance of the highcharts
	let newXml = "", chartObj = "";

	// used for contain the x and y point value of each row of 'Set Answer' dialog box that comes when keyup on ADA button
	let tempRowVal = [];

	// holds the user answer value performed via ADA button 
	let holdUserAns = [];

	window.Highcharts = highcharts;

	let preview_store = writable({
		userans: "",
		init: false,
		// used contain the xml value
		xml: "",
		modalViewLayout: "",
		// used for set the height of the chart container
		height: "500",
		// used for set the width of the chart container
		width: "550",
		// used for update the x-axis points
		xval: "",
		// used for defined the gap between 2 point on y-axis
		yinterval: "",
		// used for set the maximum value of y-axis
		ymax: "",
		// used for set the minimum value of y-axis
		ymin: "",
		// used for set the maximum value of x-axis
		xmax: "",
		// used for set the minimum value of x-axis
		xmin: "",
		// used for set the gap between 2 points on x-axis
		xinterval: "",
		// used for by default plot the chat with default answer value
		defaultans: "",
		// not clear why it is used
		snapTo: "",
		// contains the correct answer value for match the answer
		correctans: "",
		// used for set the x-axis label value
		xlabel: "",
		// used for set the y-axis label value
		ylabel: "",
		// used for set the chart label value
		title: "",
		// used for set the color of column/point except in case of histogram
		color: "",
		// this or above value can be removed as it is defined at 2 places in the same scope
		moduleType: "none",
		// used for update the body rows of the 'Set Answer' dialogbox when performed by the help of 'ADA' button
		noOfRow: 1
	});

	// subscribing to the state
	const unsubscribe = preview_store.subscribe(value => {
		$$invalidate(2, state = value);
	});

	// updating module on change of the xml
	beforeUpdate(async () => {
		if (!editorState && !state.init) {
			AH.addScript("", itemUrl + "clsSMChart/lib/highchart_draggable.js", {
				callback() {
					$$invalidate(2, state.init = true, state);
				}
			});
		}

		if ((state.init || editorState && editorState.links) && state.xml != xml) {
			updateXmlData(xml);
		}
	});

	// updating xml and review mode 
	afterUpdate(async () => {
		if (state.init || editorState && editorState.links) {
			if (state.xml != xml) {
				// instance of highcharts
				let charts = highcharts.charts, chartObj;

				charts.forEach(function (chart) {
					if (chart && chart.renderTo.id === "answerID0") {
						chartObj = chart;
					}
				});

				chartObj ? chartObj.redraw() : "";

				// used for load and draw the chart
				CHART.readyThis("#chartmain0", 0, uxml);

				// if block will not execute as there are only 3 types of chart used here and they are line, column and histogram
				let res, arr, user_data_json;

				if (newXml.smxml.chart._type == "dotplot") {
					res = "|";
					arr = JSON.parse("[" + newXml.smxml.chart._defaultans + "]");

					for (let index_no = 0; index_no < arr.length; index_no += 1) {
						res = res + index_no + "," + arr[index_no] * 10 + "|";
					}
				} else {
					// define the variable with value '|'
					res = "|";

					// contains the default answer value in json format
					arr = JSON.parse("[" + newXml.smxml.chart._defaultans + "]");

					for (let index_no = 0; index_no < arr.length; index_no += 1) {
						// sets each columns/points x point value as defined in index_no variable and y point value as value of arr object defined at index equals to the value of variable 'index_no' separated by comma (,) with sufix '|'
						res = res + index_no + "," + arr[index_no] + "|";
					}

					// used in case when user answer is set
					if (uxml) {
						user_data_json = XMLToJSON$1(uxml);

						// containts the 'x' and 'y' axis co-ordinate value of user answer columns or points
						user_data_json = user_data_json.smans.div._userAns;
					}

					// sets the user answer value
					AH.select("#answerID0").setAttribute("userans", user_data_json ? user_data_json : res);
				}

				preview_store.update(item => {
					item.xml = xml;
					return item;
				});

				initPreview();
				AH.enableBsAll("[data-bs-toggle=\"tooltip\"]", "Tooltip");
			}

			if (state.review != isReview && editorState) {
				preview_store.update(item => {
					item.review = isReview;
					return item;
				});

				if (isReview) {
					setReview();
				} else {
					unsetReview();
				}
			}
		}
	});

	// Binding some initial events for answer checking
	onMount(async () => {
		try {
			if (uxml == "<smans type=\"38\"></smans>") {
				$$invalidate(9, uxml = "");
			}
		} catch(error) {
			console.warn({ error });
		}

		if (window.inNative) {
			window.getHeight && window.getHeight();

			AH.select("#answerID0").ontouchmove = function (e) {
				e.preventDefault();
			};

			AH.insert(document.head, `<style>.highcharts-data-labels{top: 115px!important;}</style>`, "beforeend");
		}

		AH.listen("body", "click", "#chartmain0", function (current, event) {
			if (event.target.id != "chart_header_container" && event.target.parentNode.id != "ADA_Btn_point" && event.target.id != "ADA_Btn_point") {
				displayAns();
			}
		});

		AH.listen("body", "mouseup", "#chartmain0", function (current, event) {
			if (event.target.id != "chart_header_container" && event.target.parentNode.id != "ADA_Btn_point" && event.target.id != "ADA_Btn_point") {
				displayAns();
			}
		});

		AH.listen("body", "touchend", "#chartmain0", function (current, event) {
			if (event.target.id != "chart_header_container" && event.target.parentNode.id != "ADA_Btn_point" && event.target.id != "ADA_Btn_point") {
				displayAns();
			}
		});

		AH.listen("body", "keydown", "#chartmain0 #delete_prev, #chartmain0 #add_prev", function (current, event) {
			if (event.ctrlKey && event.altKey && (event.which == 49 || event.keyCode == 49)) {
				openModal();
			}
		});

		AH.listen("body", "keydown", ".ADA_Btn", function (current, event) {
			// array for contain the user answer value performed via ADA dialog box
			holdUserAns = [];

			for (let i = 1; i <= tempRowVal.length * 2; i = i + 2) {
				// contains the y point value of each row
				let convertArr = tempRowVal.toString().split(",")[i];

				// pushes the y point value into array holdUserAns for set the user answer value
				holdUserAns.push(convertArr);
			}

			if (event.keyCode == 13) {
				openModal();
			}
		});
	});

	// function called for opening the modal
	function openModal() {
		AH.getBS("#chart_modal", "Modal").show();
		loadModalView();
	}

	// for modifying and updating the chart in case of ada
	function modifyUxmlOnKey() {
		// creates temporary array
		tempRowVal = [];

		switch (state.moduleType) {
			case "column":
			case "line":
			case "histogram":
			case "dotplot":
				// contains number of rows exist in 'Set Answer' dialog box
				let row = document.querySelectorAll(".mainDiv");
				// loops through each rows
				row.forEach(function (item) {
					// contains both column which is used for x and y value of column/point
					let col = document.querySelectorAll(`#${item.id} .getFieldVal`);

					// contains the x and y value of the column/point
					let tempCol = [col[0].value + "," + col[1].value];

					// pushes the value of the variable 'tempCol' in array 'tempRowVal'
					tempRowVal.push(tempCol);
				});
				// updates the value of the user answer with stored value in temporary array 'tempRowVal'
				AH.select("#answerID0").setAttribute("userans", tempRowVal.join("|"));
				// allows user to perform the task and sets the initial border color of the chart container and shows add, delete, and ADA button
				unsetReview();
				break;
		}

		AH.getBS("#chart_modal", "Modal").hide();
	}

	// updating row
	function updateRow(type) {
		if (type == "add") {
			// increases the row by 1 if 'add' button clicked
			$$invalidate(2, state.noOfRow = state.noOfRow + 1, state);
		} else if (type == "remove") {
			if (state.noOfRow == 1) {
				swal("Default row can't be deleted");
			} else {
				//  decreases the row by 1 if 'remove' button clicked and row is greater than 1
				$$invalidate(2, state.noOfRow = state.noOfRow - 1, state);
			}
		}

		loadModalView();
	}

	// function create the json which is responsible for the content of the modal
	function loadModalView() {
		// creates an array to contain the row and column for contain the x and y values of column/point using 'Set Answer' dialogbox that comes using ADA button
		let modalViewLayout = [];

		for (let i = 0; i < state.noOfRow; i++) {
			// contains the row with defined data 
			modalViewLayout = [
				...modalViewLayout,
				{
					moduleType: state.moduleType,
					value: holdUserAns[i]
				}
			];
		}

		preview_store.update(item => {
			item.modalViewLayout = modalViewLayout;
			return item;
		});
	}

	// function for removing unwanted paths
	function resetPaths() {
		try {
			let charts = highcharts.charts, chartObj;

			charts.forEach(function (chart) {
				if (chart && chart.renderTo.id === "answerID0") {
					chartObj = chart;
				}
			});

			let data = chartObj.series[0].data, paths = [];

			for (let index in data) {
				paths[index] = data[index].id;
			}

			let dom_path = AH.selectAll("#answerID0 path[point-id]"), dom_path_points = [];

			for (let index = 0; index < dom_path.length; index++) {
				dom_path_points[index] = dom_path[index].getAttribute("point-id");
			}

			for (let index = 0; index < dom_path_points.length; index++) {
				if (!paths.includes(dom_path_points[index])) {
					AH.select("[point-id=\"" + dom_path_points[index] + "\"]", "remove");
				}
			}
		} catch(e) {
			console.warn(e);
		}
	}

	// function for initiating the preview
	function initPreview() {
		if (typeof highcharts == "object") {
			// used for load and draw the chart
			CHART.readyThis("#chartmain0", 0, uxml);

			// shows the user answer but not change the border color or column/point color and not shows check or cancel mark
			CHART.showansdrag("#chartmain0", "u", 0);

			if (isReview) {
				// shows the user answer and not allowed user to perform the task
				setReview();
			} else {
				// allows user to perform the task and sets the initial border color of the chart container and shows add, delete, and ADA button
				unsetReview();
			}
		}
	}

	// shows add, delete and ADA buttons, updates the user answer value, sets value of states values and load the chart
	function updateXmlData(xml_data) {
		// contains the json data of xml
		newXml = XMLToJSON$1(xml_data);

		// updates the states value with related value of qxml
		parseXml(newXml);

		let userans = "", uaXML = {};

		if (uxml) {
			// contains the json data of user answer
			uaXML = XMLToJSON$1(window.uaXML);

			if (uaXML && uaXML.smans && uaXML.smans.div && uaXML.smans.div._userAns) {
				// contains the value of user answer
				userans = uaXML.smans.div._userAns;
			}
		}

		preview_store.update(item => {
			item.moduleType = newXml.smxml.chart._type;
			item.userans = userans;
			return item;
		});

		// shows the add, delete and ADA buttons	
		AH.selectAll("#chartmain0 .setdata", "css", { display: "block" });

		// hides ADA button in Mobile app
		if (window.inNative) {
			AH.setCss("#chartmain0 #ADA_Btn_point", { display: "none" });
		}
	}

	// updates the states value with related value of qxml
	function parseXml(QXML) {
		try {
			// updates some states value
			preview_store.update(item => {
				// contains the value of chart type
				item.moduleType = QXML.smxml.chart._type;

				// contains the color value for column/point color
				item.color = QXML.smxml.chart._color;

				// contains the correct answer value
				item.correctans = QXML.smxml.chart._correctans;

				// contains the default answer value
				item.defaultans = QXML.smxml.chart._defaultans;

				// contains height value for chart container
				item.height = QXML.smxml.chart._height;

				// contains the snapTo value for chart
				item.snapTo = QXML.smxml.chart._snapto;

				// contains title value for chart
				item.title = QXML.smxml.chart._title;

				// contains width of the chart container
				item.width = QXML.smxml.chart._width;

				// contains x-axis interval value
				item.xinterval = QXML.smxml.chart._xinterval;

				// contains label value of x-axis
				item.xlabel = QXML.smxml.chart._xlabel;

				// contains maximum value of x-axis
				item.xmax = QXML.smxml.chart._xmax;

				// contains minimum value of x-axis
				item.xmin = QXML.smxml.chart._xmin;

				// contains the xval value for chart
				item.xval = QXML.smxml.chart._xval;

				// contains interval value of y-axis
				item.yinterval = QXML.smxml.chart._yinterval;

				// contains label value of y-axis
				item.ylabel = QXML.smxml.chart._ylabel;

				// contains maximum value of y-axis
				item.ymax = QXML.smxml.chart._ymax;

				// contains minimum value of y-axis
				item.ymin = QXML.smxml.chart._ymin;

				return item;
			});

			// creates an array
			let xval = [];

			// contains minimun value of x-axis
			let xmin = parseInt(QXML.smxml.chart._xmin);

			// contains maximun value of x-axis
			let xmax = parseInt(QXML.smxml.chart._xmax);

			// contains x-axis interval value
			let xinterval = parseInt(QXML.smxml.chart._xinterval);

			for (let index = xmin; index <= xmax; index = index + xinterval) {
				// contains possible x-points from min to max with specified interval 
				xval.push(index);
			}

			// change the xval value of qxml
			QXML.smxml.chart._xval = "[" + xval.toString() + "]";

			// update the state 'xval' value
			preview_store.update(item => {
				item.xval = QXML.smxml.chart._xval;
				return item;
			});
		} catch(error) {
			console.warn({
				error,
				"function": "parseXML",
				"File": "ChartPreview.svelte"
			});
		}
	}

	// function for handling the review mode
	function handleReviewMode(mode) {
		if (mode == "c") {
			CHART.showansdrag("#chartmain0", "c", 1);
		} else if (mode == "u") {
			CHART.showansdrag("#chartmain0", "u", 1);
		}
	}

	// function when the review mode is on
	function setReview() {
		$$invalidate(0, isReview = true);

		// used for show the correct answer
		$$invalidate(1, CHART.tempVar = "c", CHART);

		// used for load and draw the chart
		CHART.readyThis("#chartmain0", 1, uxml);

		// shows the correct answer
		CHART.showansdrag("#chartmain0", "c", 1);

		// shows the user answer with changed color of columns/points and also change the color of chart container
		CHART.showansdrag("#chartmain0", "u", 1);

		// hides the add, delete and ADA buttons
		AH.selectAll("#chartmain0 .setdata", "css", { display: "none" });

		// shows the message correct or incorrect according to the return value of 'CHART.checkAns' method
		displayAns();

		// sets the value of css properties opacity and visibility of columns/points
		AH.selectAll(".highcharts-tracker", "css", { opacity: "1", visibility: "visible" });

		resetPaths();
	}

	// responsible for showing the answer
	function displayAns() {
		let result = CHART.checkAns("#chartmain0");
		if (typeof is_sm != "undefined") AH.showmsg(result.ans ? "Correct" : "Incorrect", 3000);

		if (editorState) {
			// shows the answer according to the value of its argument passed
			showAns(result.ans ? "Correct" : "Incorrect");
		}

		onUserAnsChange(result);
	}

	// function when the review mode is off
	function unsetReview() {
		$$invalidate(0, isReview = false);

		// used for show the user answer
		$$invalidate(1, CHART.tempVar = "u", CHART);

		// used for load and draw the chart
		CHART.readyThis("#chartmain0", 0, uxml);

		// shows the user answer but not change the border color or column/point color and not shows check or cancel mark
		CHART.showansdrag("#chartmain0", "u", 0);

		// returns the result status and creates the user answer xml and shows the correct or incorrect message according to the status of result in snackbar
		CHART.checkAns("#chartmain0");

		// shows the 'add' (+), 'delete' and 'ADA' buttons
		AH.selectAll("#chartmain0 .setdata", "css", { display: "block" });

		// hides ADA button in Mobile app
		if (window.inNative) {
			AH.select("#chartmain0 #ADA_Btn_point").classList.add("h");
		}

		// sets the border color of the chart container
		AH.selectAll("#answerID0", "css", { "border": "1px solid rgb(204, 204, 204)" });

		resetPaths();
	}

	// function when the review mode is off
	function updateInputElm(index, event) {
		// holds the changed value of input field which value changed in 'Set Answer' dialogbox
		holdUserAns[index] = event.target.value;

		loadModalView();
	}

	const writable_props = ["xml", "uxml", "isReview", "showAns", "editorState"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ChartPreview> was created with unknown prop '${key}'`);
	});

	const click_handler = () => CHART.updatePointPreview("addPoint", "answerID0");
	const click_handler_1 = () => CHART.updatePointPreview("removePoint", "answerID0");
	const click_handler_2 = () => CHART.updatePointPreview("addPoint", "answerID0");
	const click_handler_3 = () => CHART.updatePointPreview("removePoint", "answerID0");

	const click_handler_4 = () => {
		updateRow("add");
	};

	const click_handler_5 = () => {
		updateRow("remove");
	};

	const change_handler = (i, e) => {
		updateInputElm(i, e);
	};

	$$self.$$set = $$props => {
		if ("xml" in $$props) $$invalidate(10, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(9, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("showAns" in $$props) $$invalidate(11, showAns = $$props.showAns);
		if ("editorState" in $$props) $$invalidate(12, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		afterUpdate,
		beforeUpdate,
		onMount,
		writable,
		XMLToJSON: XMLToJSON$1,
		AH,
		onUserAnsChange,
		CHART,
		l: Lang,
		Highcharts: highcharts,
		ItemHelper,
		xml,
		uxml,
		isReview,
		showAns,
		editorState,
		state,
		newXml,
		chartObj,
		tempRowVal,
		holdUserAns,
		preview_store,
		unsubscribe,
		openModal,
		modifyUxmlOnKey,
		updateRow,
		loadModalView,
		resetPaths,
		initPreview,
		updateXmlData,
		parseXml,
		handleReviewMode,
		setReview,
		displayAns,
		unsetReview,
		updateInputElm
	});

	$$self.$inject_state = $$props => {
		if ("xml" in $$props) $$invalidate(10, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(9, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
		if ("showAns" in $$props) $$invalidate(11, showAns = $$props.showAns);
		if ("editorState" in $$props) $$invalidate(12, editorState = $$props.editorState);
		if ("state" in $$props) $$invalidate(2, state = $$props.state);
		if ("newXml" in $$props) newXml = $$props.newXml;
		if ("chartObj" in $$props) chartObj = $$props.chartObj;
		if ("tempRowVal" in $$props) tempRowVal = $$props.tempRowVal;
		if ("holdUserAns" in $$props) holdUserAns = $$props.holdUserAns;
		if ("preview_store" in $$props) preview_store = $$props.preview_store;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		isReview,
		CHART,
		state,
		modifyUxmlOnKey,
		updateRow,
		handleReviewMode,
		setReview,
		unsetReview,
		updateInputElm,
		uxml,
		xml,
		showAns,
		editorState,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4,
		click_handler_5,
		change_handler
	];
}

class ChartPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document_1.getElementById("svelte-bzsii3-style")) add_css();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				xml: 10,
				uxml: 9,
				isReview: 0,
				showAns: 11,
				editorState: 12
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ChartPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[10] === undefined && !("xml" in props)) {
			console_1.warn("<ChartPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[9] === undefined && !("uxml" in props)) {
			console_1.warn("<ChartPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[0] === undefined && !("isReview" in props)) {
			console_1.warn("<ChartPreview> was created without expected prop 'isReview'");
		}

		if (/*showAns*/ ctx[11] === undefined && !("showAns" in props)) {
			console_1.warn("<ChartPreview> was created without expected prop 'showAns'");
		}

		if (/*editorState*/ ctx[12] === undefined && !("editorState" in props)) {
			console_1.warn("<ChartPreview> was created without expected prop 'editorState'");
		}
	}

	get xml() {
		throw new Error("<ChartPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<ChartPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<ChartPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<ChartPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<ChartPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<ChartPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<ChartPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<ChartPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<ChartPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<ChartPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default ChartPreview;
//# sourceMappingURL=ChartPreview-f8d6a12c.js.map
