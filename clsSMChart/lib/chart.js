/**
 *  File Name   : chart.js
 *  Author      : Ayush Srivastava
 *  Function    : Chart
 *  Version     : 1.0
 *  Packege     : clsSMChart (Preview)
 *  Last update : 15 Mar 2021
 *  Dependency  : JUI
 */

// importing JUI
import JUI from '../../src/libs/javscript_helper/JUI';
import { XMLToJSON } from '../../helper/HelperAI.svelte';
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
}

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
}

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
}

// sets the value '0' of argument variable 'review' if it is undefined and shows the correct answer or user answer according to the value of argument variable 'ansType' and 'c' for correct answer and 'u' for user answer
CHART.showansdrag = function(mid, ansType, review) {
    if (typeof review === "undefined") review = 0;
    let elements = JS.select(mid).children;
    for (let index = 0; index < elements.length; index++) {
        CHART.showchildansdrag(mid, elements[index], ansType, review);
    }
}

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
}

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
}

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
}

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
}

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
}

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
                })
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
                })
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

}

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
}

// used for access the 'CHART' where it will be import
export default CHART;