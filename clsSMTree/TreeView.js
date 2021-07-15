//import J from 'jquery';
const J = require('jquery');
// const jstree = require('../../../ux/js/jstree.min.js');
var ucTree = {};
ucTree.tempVar = 'u';
ucTree.userAnsXML = "";
ucTree.context_options = false;
var ajax_eId = "#treemain0";
ucTree.initSMANS = "";
ucTree.labBinded = true;
// Called after selecting the option in contextmenu
ucTree.contextAction = function (obj) {
    var treeid = "#" + obj.reference.closest('[id^="treemain"]').attr("id"),
        lcrt = AI.find(treeid, '.treeall'),
        // id of draggable element on which contextmenu event fired 
        id = obj.reference.parentNode.getAttribute('id'),
        // find available tree structure on Droppable area 
        tree = lcrt.jstree(true)._model.data;
    // Assigned cseq in tree structure received after selecting the contextmenu dialog option    
    tree[id].li_attr.cseq = obj.item.seq;
    // set the attribute cseq of draggable element on which contextmenu event fired  
    obj.reference.parentNode.setAttribute('cseq', obj.item.seq);
    // set the icon for draggable element on which contextmenu event fired according to selected value from contextmenu bar
    lcrt.jstree(true).set_icon(id, obj.item.icon);
    // Calls for check the answer
    ucTree.checkAns(treeid, lcrt);
};

// Remove the draggable element from droppable conatiner to draggable container
ucTree.deleteList = function (obj) {
    var treeid = "#" + obj.reference.closest('[id^="treemain"]').getAttribute("id"),
        /* Container element where elements are dropped after drag */
        lcrt = J(treeid).find('.treeall'),
        /* Container element of draggable element from where element is dragged for perform the operation */
        lall = J(treeid).find('.treecorrect'),
        /* Id of draggable element on which contextmenu event fired */
        id = obj.reference.parentNode.getAttribute('id');
    // Cut the draggable element on which contextmenu event fired from droppable area    
    lcrt.jstree(true).cut(id);
    // Paste the draggable element on which contextmenu event fired on draggable area
    lall.jstree(true).paste('#');
    // Delete the draggable element on which contextmenu event fired from droppable area
    lcrt.jstree(true).delete_node(id);
};

// Used to copy the draggable element
ucTree.copyNode = function (obj, delandpaste) {
    let treeId = "#treemain0";
    let treeCorrect = AI.find(treeId, '.treecorrect');
    obj.currentTarget;
    // Copy the current target element according to their id on Draggable area
    treeCorrect.jstree(true).copy(obj.currentTarget.id);
    // Calls delandpaste() according to the value of variable delandpaste
    delandpaste && delandpaste();
}

// Used to pase the Draggable element on Droppable area
ucTree.pasteNode = function (obj, fun, handleDeleteCallback) {
    let treeId = "#treemain0";
    let treeAll = AI.find(treeId, '.treeall');
    // Paste the current target element according to their id on Droppable area
    treeAll.jstree(true).paste(obj.currentTarget.id);
    // Calls fun() according to the value of variable fun
    fun && fun();
    // Calls handleDeleteCallback() according to the value of variable handleDeleteCallback
    handleDeleteCallback && handleDeleteCallback();
}

// /used to handle the element when it is deleted on droppable area
ucTree.handleDelete = function (obj, deleteCallBack, pasteCallback) {
    let treeId = "#treemain0";
    let treeAll = AI.find(treeId, '.treeall');
    let id = obj.currentTarget;
    try {
        // used for paste the element back to draggable area
        treeAll.jstree(true).cut(id);
        // used for delete the element from droppable area
        treeAll.jstree(true).delete_node(id);
    } catch (Exception) {
        console.log("Error" + Exception);
    }
    // Calls deleteCallBack() method according to the value of deleteCallBack variable
    deleteCallBack && deleteCallBack();
    // Calls pasteCallback() method according to the value of pasteCallback variable
    pasteCallback && pasteCallback();
}

// Initialize the tree
ucTree.treeInit = function (treeid, contextmenu) {
    contextmenu = contextmenu || false;
    // configaration for droppable area
    var jOptions = {
        "core": {
            // Allow the operations create, rename, delete, move or copy 
            "check_callback": true
        },
        "checkbox": {
            // a boolean indicating if checkboxes should cascade down and have an undetermined state. Defaults to true 
            "three_state": false
        },
        "plugins": ["checkbox"]
    };
    if (contextmenu) {
        // Assign the contextmenu options to ucTree.context_options
        ucTree.context_options = contextmenu;
    }
    var lcrt = AI.find(treeid, '.treeall');
    var lall = AI.find(treeid, '.treecorrect');
    // Applied configaration on Droppable container to access the operations
    lcrt.jstree(jOptions);
    lcrt.on("move_node.jstree", function (event, data) {
        var _jst = lcrt.jstree(true);
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
        if (_jst.get_selected().length > 0) {
            // deselect the node if it is selected
            _jst.deselect_node(AI.find(treeid, '#' + data.old_parent));
        }
    }).on("copy_node.jstree", function (event, data) {
        var _jst = lcrt.jstree(true);
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
        _jst.open_node(AI.find(treeid, '#' + data.parent));
    }).on("delete_node.jstree", function (event, data) {
        var _jst = lcrt.jstree(true);
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
        // deselect the node if it is selected
        _jst.deselect_node(AI.find(treeid, '#' + data.parent));
    }).on("changed.jstree", function (event, data) {
        var _jst = lcrt.jstree(true);
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
        if (typeof (data.parent) == "undefined" && data.node.li_attr.tid.length < 3) {
            // deselect the node if it is selected
            _jst.deselect_node(AI.find(treeid, '#' + data.node.id));
        } else {
            // deselect the parent node if it is selected
            _jst.deselect_node(AI.find(treeid, '#' + data.parent));
        }
    }).on("open_node.jstree", function () {
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
    });
    // configaration for draggable area
    lall.jstree({
        "core": {
            // Allow the operations create, rename, delete, move or copy if it is true otherwise these operations will be prevented 
            "check_callback": function (callback, node) {
                if (callback == "copy_node" && ucTree.isTidExists(node.li_attr.tid, lall)) {
                    return false;
                }
                if (callback == "delete_node" && node.li_attr.multi == "1") {
                    return false;
                }
                return true;
            }
        },
        "plugins": ["wholerow"]
    });
    // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
    ucTree.removePchecbox(treeid);
    var timer6 = setTimeout(function () {
        // calls the showans method
        ucTree.showans(treeid, 'u');
        clearTimeout(timer6);
    }, 0)
}

// used to initialized tree plugin and bind some required events that needed
ucTree.readyThis = function (treeid, contextmenu) {
    contextmenu = contextmenu || false;
    var lcrt = AI.find(treeid, '.treeall');
    var lall = AI.find(treeid, '.treecorrect');
    var jOptions = {
        "core": {
            // Allow the operations create, rename, delete, move or copy if it is true otherwise these operations will be prevented 
            check_callback: function (op, node, parent) {
                if (parent.li_attr) {
                    if (parent.li_attr.correctans) {
                        return true
                    } else {
                        if (window.inNative) window.postMessage('hint___Not an editable zone');
                        return false;
                    }
                }
            }
        },
        "checkbox": {
            // a boolean indicating if checkboxes should cascade down and have an undetermined state. Defaults to true 
            "three_state": false
        },
        // Defines all the active types in the tree 
        "types": {
            "#": {
                // disable max_depth checking in the tree 
                "max_depth": 2,
                // A string or array. Defines valid root node types (could be "all" , "none" , or an array of type strings) 
                "valid_children": ["item"]
            }
        },
        // The dnd plugin enables drag'n'drop support for jstree, also using foreign nodes and drop targets. 
        "dnd": {
            // The number of milliseconds to wait before checking if a move is valid upon hovering a node 
            "open_timeout": 1,
            // prevent from being drag
            "is_draggable": function () {
                return false; //data.li_attr.tid.length > 2
            }
        },
        "plugins": [typeof inNative != "undefined" ? "" : "dnd", typeof inNative != "undefined" ? "" : "checkbox", "types"]
    };
    // If contextmenu option exists then enter in this block
    if (contextmenu) {
        // assign contextmenu data into variable ucTree.context_options
        ucTree.context_options = contextmenu;
        jOptions['contextmenu'] = {
            // a boolean indicating if the node should be selected when the context menu is invoked on it 
            "select_node": false,
            // a boolean indicating if the menu should be shown aligned with the node. Defaults to true, otherwise the mouse coordinates are used  
            "show_at_node": false,
            // an object of actions, or a function that accepts a node and a callback function and calls the callback function with an object of actions available for that node 
            "items": function (node) {
                return node.li_attr.tid.length > 2 ? contextmenu : {};
            }
        };
        // Adds contextmenu plugin in available plugin options
        jOptions['plugins'].push('contextmenu');
    }
    // Applied the configaration to Droppabe area's elements
    lcrt.jstree(jOptions);
    // 'move_node.jstree' event is called only at the end of Drag & Drop (equivalent to Drop event). 
    lcrt.on("move_node.jstree", function (event, data) {
        var jstValue = lcrt.jstree(true);
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
        // opens a node, revealing its children. If the node is not loaded it will be loaded and opened once ready 
        jstValue.open_node(AI.find(treeid, '#' + data.parent));
        if (jstValue.get_selected().length > 0) {
            // deselect the node if it is selected
            jstValue.deselect_node(AI.find(treeid, '#' + data.old_parent));
        }
        ucTree.checkAns(treeid, lcrt);
        var timer1 = setTimeout(function () {
            // Click the element having id delNodes
            document.querySelector("#delNodes").click();
            clearTimeout(timer1);
        }, 100);
        // 'copy_node.jstree' event triggered when a node is copied 
    }).on("copy_node.jstree", function (event, data) {
        var jstValue = lcrt.jstree(true);
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
        // opens a node, revealing its children. If the node is not loaded it will be loaded and opened once ready 
        jstValue.open_node(AI.find(treeid, '#' + data.parent));
        // called for check the answer 
        ucTree.checkAns(treeid, lcrt);
        var timer2 = setTimeout(function () {
            // Click the element having id delNodes
            document.querySelector("#delNodes").click();
            clearTimeout(timer2);
        }, 100);
        // 'delete_node.jstree' event triggered when a node is deleted 
    }).on("delete_node.jstree", function (event, data) {
        var jstValue = lcrt.jstree(true);
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
        // deselect the node if it is selected
        jstValue.deselect_node(AI.find(treeid, '#' + data.parent));
        // called for check the answer
        ucTree.checkAns(treeid, lcrt);
        var timer3 = setTimeout(function () {
            // Click the element having id delNodes
            document.querySelector("#delNodes").click();
            clearTimeout(timer3);
        }, 100);
        // 'changed.jstree' event triggered when selection changes 
    }).on("changed.jstree", function (event, data) {
        var jstValue = lcrt.jstree(true);
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
        if (typeof (data.parent) == "undefined" && data.node.li_attr.tid.length < 3) {
            // deselect the node if it is selected
            jstValue.deselect_node(AI.find(treeid, '#' + data.node.id));
        } else {
            // deselect the node if it is selected
            jstValue.deselect_node(AI.find(treeid, '#' + data.parent));
        }
        // Calls for checking the answer
        ucTree.checkAns(treeid, lcrt);
        // 'open_node.jstree' event triggered when a node is opened (if there is an animation it will not be completed yet) 
    }).on("open_node.jstree", function () {
        // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
        ucTree.removePchecbox(treeid);
    });
    // Applied the configaration to Draggabe area's elements
    lall.jstree({
        "core": {
            // Allow the operations create, rename, delete, move or copy if it is true otherwise these operations will be prevented 
            "check_callback": function (callback, node) {
                if (callback == "copy_node" && ucTree.isTidExists(node.li_attr.tid, lall)) {
                    //what they are trying to do
                    return false;
                }
                if (callback == "delete_node" && node.li_attr.multi == "1") {
                    return false;
                }
                return true;
            }
        },
        // Defines all the active types in the tree 
        "types": {
            "#": {
                // disable max_depth checking in the tree 
                "max_depth": 1
            }
        },
        "plugins": ["wholerow", typeof inNative != "undefined" ? "" : "dnd", "types"]
    });
    // Responsible for hide those checkboxes which meets the conditions described in ucTree.removePchecbox method
    ucTree.removePchecbox(treeid);
    ucTree.showans(treeid, 'u');
    ucTree.checkAns(treeid, lcrt);
}

// Used for hiding the checkboxes from jstree according to matched condition
ucTree.removePchecbox = function (treeid) {
    var timer4 = setTimeout(function () {
        AI.find(treeid, '[tid]', 'all').forEach((_this)=> {
            if (AI.find(treeid, '.treeall').getAttribute('data-showcheckbox') == "0" || _this.getAttribute('tid').length < 3) {
                // hide the element having class 'jstree-checkbox' in tree
                AI.find(_this, '> a > .jstree-checkbox', {action: 'hide'});
            }
        });
        clearTimeout(timer4);
    }, 100);
}

// checks if tid exists in the list of all draagable elements and return true or false accordingly
ucTree.isTidExists = function (tid, tree) {
    // assign the reference of all available draggable data to tree
    tree = J.jstree.reference(tree)._model.data;
    var istree = false;
    J.each(tree, function (index, value) {
        if (index != '#' && value.li_attr.tid == tid) {
            istree = true;
            return false;
        }
    });
    return istree;
}

// find the tid of given id
ucTree.getTid = function (id, tree) {
    return tree[id].li_attr.tid;
}

// returns an array object with properties id and sequence
ucTree.getId = function (tid, tree, type, arr) {
    arr = arr || false;
    var ret = [];
    // loops through the properties of tree object
    for (let i in tree) {
        if (i != '#') {
            if (tree[i].li_attr.tid == tid) {
                if (arr) {
                    var ans = "";
                    if (type == "c") {
                        // assign the correctans attributes value to ans after finding the correctans attributes of the element inside the Droppable area where draggable element dragged
                        ans = tree[tree[i].parent].li_attr.correctans;
                    } else if (type == "u") {
                        // assign the userans attributes value to ans after finding the userans attributes of the element inside the Droppable area where draggable element dragged
                        ans = tree[tree[i].parent].li_attr.userans;
                    }

                    var seq = false;
                    if (tree[i].li_attr.multi == "1") {
                        if (ans) {
                            // assign the array object to matching variable after search in ans variable where {} find with any value between {}
                            var matching = ans.match(/\{(.*?)\}/g);
                            // loops through the properties of matching object
                            for (let i in matching) {
                                if (matching[i] == '{1}') {
                                    seq = '1'
                                } else if (matching[i] == '{2}') {
                                    seq = '2'
                                }
                            }
                        }
                        if (seq && ans.indexOf('{' + seq + '}' + tree[i].li_attr.tid) != -1) {
                            // If seq is defined and '{' + seq + '}' + tree[i].li_attr.tid is found in ans variable then set the tp object with properties id and seq 
                            let tp = {
                                'id': i,
                                'seq': seq
                            };
                            // push the tp object into ret array
                            ret.push(tp);
                        }
                    } else if (ans.indexOf('{' + tree[i].li_attr.seq + '}' + tree[i].li_attr.tid) != -1) {
                        // if '{' + tree[i].li_attr.seq + '}' + tree[i].li_attr.tid is found in ans variable then set the tp object with properties id and seq  
                        let tp = {
                            'id': i,
                            'seq': tree[i].li_attr.seq
                        };
                        // push the tp object into ret array
                        ret.push(tp);
                    } else {
                        console.log("entered")
                    }

                } else {
                    return i;
                }
            }
        }
    }
    return ret.length > 0 ? ret : null;
}

// used for check the answer
ucTree.checkAns = function (treeid, elemnt) {
    if (!ucTree.labBinded) {
        return false;
    }
    if (window.inNative) {
        window.postMessage('height___' + AI.select("#treemain0").clientHeight, '*'); // increases the height of react native outer container
    }
    if (ucTree.tempVar == 'u') {
        try {
            let userAnswers = null;
            let inNativeIsCorrect = null;
            let checkCorrect = null;
            ucTree.userAnsXML = AI.parseHtml('<smans type="7"></smans');
            ucTree.result = true;
            ucTree.temp = 0;
            var tree = J.jstree.reference(elemnt)._model.data;
            J.each(tree, function (index, value) {
                if (index != '#' || tree[index].icon == "icomoon-database") {
                    // set the userAnsXML to ucTree.userAnsXML returned from ucTree.checkChildAns method
                    ucTree.userAnsXML = ucTree.checkChildAns(treeid, value, tree, ucTree.userAnsXML, elemnt);
                }
            });
            
            userAnswers = (formatXml(ucTree.userAnsXML.xml ? ucTree.userAnsXML.xml : (new XMLSerializer()).serializeToString(ucTree.userAnsXML[0])));
            let result = {
                uXml: userAnswers,
                ans: ucTree.result,
            };
            
            // Used in native for show the answer
            if (window.inNative) {
                window.postMessage(JSON.stringify({
                    userAnswers,
                    inNativeIsCorrect: ucTree.result
                }), "*");
            }
            return result;
        } catch (event) {
            console.warn(event);
        }
    }
}

/* 
    set the result by using the varible ucTree.result and returns the userAnsXML
    here passed arguments have this meaning:
    treeid     : its container which holds all the data of module such as draggable container, droppable                      container, headings of these fields etc.
    pElem      : draggable element which is dropped on droppable container
    tree       : all details of trees that exits on droppable container
    userAnsXML : User answer xml
    elemnt     : droppable area's container
*/
ucTree.checkChildAns = function (treeid, pElem, tree, userAnsXML, elemnt) {
    if (ucTree.tempVar == 'u') {
        if (typeof (pElem.li_attr.correctans) !== "undefined") {
            // filter the array and returns the array for which callback returns true
            var cans = pElem.li_attr.correctans.split(',').filter((n)=> {
                return (n)
            });
            //sort the cans array in assending order
            cans = cans.sort().toString();
            // entered in this block if droppable element has any draggable children
            if (pElem.children.length > 0) {
                var uans = [];
                pElem.children.forEach((i, v)=> {
                    if (typeof (tree[v].li_attr.cseq) != "undefined" && tree[v].li_attr.cseq != "0" && tree[v].li_attr.cseq != "*") {
                        // push the tid with some addition in cans array if contextmenu option selected on target draggable element
                        uans.push('{' + tree[v].li_attr.cseq + '}' + ucTree.getTid(v, tree));
                    } else if (AI.find(AI.select(treeid).querySelector('#' + v), '> a > .jstree-checkbox','visible').length > 0 && J.jstree.reference(elemnt).is_selected(AI.find(treeid, '#' + v))) {
                        // push the tid with some addition in cans array if checkbox is used in tree structure instead of image
                        uans.push('*' + ucTree.getTid(v, tree));
                    } else {
                        // push the tid in cans array
                        uans.push(ucTree.getTid(v, tree));
                    }
                });

                if (typeof calculatePoint != "undefined" || window.inNative) {
                    AI.selectAll(cans.split(',')).forEach((val, i)=> {
                        // Increases the value of variable ucTree.temp if any data exist in cans and uans array
                        if (uans.indexOf(val) != -1) ucTree.temp++;
                    });
                    // Checks if it is not native then sets the number of correct answer performed by user in data-totalcorrectans attribute of preview container
                    if (!window.inNative) calculatePoint(J(treeid).attr('data-totalcorrectans'), ucTree.temp);
                }

                // sorts the uans array in assending order
                uans = uans.sort().toString();
                if (ucTree.userAnsXML.find('#' + pElem.li_attr.tid).length > 0) {
                    //sets the attribute 'uans' to element with id 'pElem.li_attr.tid' inside 'ucTree.userAnsXML' 
                    ucTree.userAnsXML.find('#' + pElem.li_attr.tid).attr('uans', uans);
                } else {
                    // append the div element with attribute 'id' and 'uans' having values pElem.li_attr.tid and uans
                    ucTree.userAnsXML.append('<div id="' + pElem.li_attr.tid + '" uans="' + uans + '"></div>');
                }

                if (pElem.li_attr.userans) {
                    if (pElem.li_attr.userans.length == cans.length) {
                        if (pElem.li_attr.userans.match(/\{2}/g) || pElem.li_attr.userans.match(/\*/g)) {
                            // assign the value in 'uans' variable
                            uans = pElem.li_attr.userans;
                        }
                    }
                }
                // at the time of answer checking '*' keyword is replaced
                cans = cans.replace(/\*/gm, '');
                if (cans != uans) {
                    ucTree.result = false;
                    // sets the attribute 'as' with value 0 of element with tid equals to pElem.li_attr.tid if cans != uans 
                    AI.select('[tid="' + pElem.li_attr.tid + '"]').setAttribute('as', 0);
                } else {
                    // sets the attribute 'as' with value 1 of element with tid equals to pElem.li_attr.tid
                    AI.select('[tid="' + pElem.li_attr.tid + '"]').setAttribute('as', 1);
                }
            } else {
                ucTree.result = false;
                // sets the attribute 'as' with value 0 of element with tid equals to pElem.li_attr.tid if calculatePoint is not defined
                AI.select('[tid="' + pElem.li_attr.tid + '"]').setAttribute('as', 0);
            }
        }
    }
    return userAnsXML;
}

// Shows what is correct and what you have performed
ucTree.showans = function (treeid, type) {
    if (type == "c") {
        // hides the draggable elements from Draggable container and adds border on its parent element that is 'J('.treecorrect_outer')
        AI.selectAll(".treecorrect_outer", 'addClass', "treecorrect_outer_border");
        AI.setCss(".treecorrect", {
            display: "none"
        });
    }
    // Assign the userxml value in the variable special_module_user_xml_temp
    //var special_module_user_xml_temp = AI.select('#special_module_user_xml').value;
    // Droppable area container where data will be drop for correct answer
    var tree1 = J.jstree.reference('.treeall');
    // Draggable area container from where data will be drag and drop on Droppable area for correct answer
    var tree2 = J.jstree.reference('.treecorrect');
    tree1._model.data.forEach((value, index)=> {
        if (index != '#') {
            // Calls the method 'ucTree.showChildAns' if index is not equals to '#'
            ucTree.showChildAns(treeid, value, tree1, tree2, type);
        }
    });
    if (type == "c") {
        var timer5 = setTimeout(function () {
            // Shows the Draggable elements on Draggable area container and removes border from it's parent
            AI.selectAll(".treecorrect_outer", 'removeClass', "treecorrect_outer_border");
            AI.setCss(".treecorrect", {
                display: "block"
            });
            // clear the timeout
            clearTimeout(timer5);
        }, 100);
    }
    //checkes that is userxml changed
    //ISSPECIALMODULEUSERXMLCHANGE = 1;
    // assign the userxml data in J('#special_module_user_xml') for access it further
    //J('#special_module_user_xml').val(special_module_user_xml_temp);
}

// shows the answer and manage the cut copy etc functionality
ucTree.showChildAns = function (treeid, pElem, tree1, tree2, type) {
    if (typeof (pElem.li_attr.correctans) != "undefined" || typeof (pElem.li_attr.userans) != "undefined") {
        if (pElem.children.length > 0) {
            // cut a node from Droppable container 
            tree1.cut(pElem.children);
            // copy or move the previously cut or copied nodes to draggable container 
            tree2.paste('#');
            // remove a node from Droppable container 
            tree1.delete_node(pElem.children);
        }
    }
    var sel = [],
        cicon = [];
    if (type == 'c' && typeof (pElem.li_attr.correctans) !== "undefined") {
        var cans = pElem.li_attr.correctans.split(',');
        // filter the array and returns the array for which callback returns true
        cans = cans.filter((n)=> {
            return (n)
        });
        var cid = [];
        for (let i in cans) {
            if (cans[i].indexOf('*') === 0) {
                // removes the * if it exists at the very first character of cans[i] string
                cans[i] = cans[i].replace('*', '');
                // push the data of cans[i] in sel after removing * from index 0
                sel.push(cans[i]);
            } else if (cans[i].match(/\{.+?\}/)) {
                // removes the all data between every {} encluding open and closing curly brace from cans[i]
                cans[i] = cans[i].replace(/\{.+?\}/, '');
                // push the data of cans[i] into cicon after removing all data between {} including both curly brace from cans[i]
                cicon.push(cans[i]);
            }
            // push the data in cid array after retun from ucTree.getId method
            cid.push(ucTree.getId(cans[i], tree2._model.data));
        }
        // filter the array and returns the array for which callback returns true
        cid = cid.filter((n)=> {
            return (n)
        });
        // cut a node from Draggable container 
        tree2.cut(cid);
        // copy or move the previously cut or copied nodes to droppable container 
        tree1.paste(pElem.id);
    } else if (type == 'u' && typeof (pElem.li_attr.userans) !== "undefined") {
        var uans = pElem.li_attr.userans.split(',');
        // filter the array and returns the array for which callback returns true
        uans = uans.filter((n)=> {
            return (n)
        });
        var uid = [];
        // loops through the properties of uans object
        for (let index in uans) {
            if (uans[index].indexOf('*') === 0) {
                // removes the * if it exists at the very first character of uans[index] string
                uans[index] = uans[index].replace('*', '');
                sel.push(uans[index]);
            } else if (uans[index].match(/\{.+?\}/)) {
                // removes the all data between every {} encluding open and closing curly brace from uans[index]
                uans[index] = uans[index].replace(/\{.+?\}/, '');
                cicon.push(uans[index]);
            }
            // push the data in uid array after retun from ucTree.getId method
            uid.push(ucTree.getId(uans[index], tree2._model.data));
        }
        // filter the array and returns the array for which callback returns true
        uid = uid.filter((n)=> {
            return (n)
        });
        // cut a node from Draggable container
        tree2.cut(uid);
        // copy or move the previously cut or copied nodes to droppable container 
        tree1.paste(pElem.id);
    }

    if (sel.length > 0) {
        let sid = [];
        // loops through the properties of sel object
        for (let index in sel) {
            // joins 2 array first one 'sid' and second on retuned by ucTree.getId method and assign to sid array
            sid = sid.concat(ucTree.getId(sel[index], tree1._model.data, type, true))
        }
        // filter the array and returns the array for which callback returns true
        sid = sid.filter((n)=> {
            return (n)
        });
        // select a node, passing the second argument true will prevent 'changed.jstree' event from being triggered 
        tree1.select_node(sid, true);
    }

    if (cicon.length > 0) {
        let sid = [];
        // loops through the properties of cicon object
        for (let index in cicon) {
            // joins 2 array first one 'sid' and second on retuned by ucTree.getId method and assign to sid array
            sid = sid.concat(ucTree.getId(cicon[index], tree1._model.data, type, true));
        }
        // filter the array and returns the array for which callback returns true
        sid = sid.filter((n)=> { return (n) });

        var tr = tree1._model.data;
        // loops through the properties of sid object
        for (let index in sid) {
            // assign the cseq of Droppable area's element
            tr[sid[index].id].li_attr.cseq = sid[index].seq;
            // set the node icon for a node
            tree1.set_icon(sid[index].id, ucTree.context_options['opt' + (sid[index].seq - 1)]['icon']);
        }
    }
}

// hide/show the button of currect answer and your answer and checks the answer and shows if argument 'on' passed in case of calling it
ucTree.modeOn = function (modeType) {
    // initially hides the buttons inside the element with id sm_controller
    AI.selectAll('.test, .review', 'addClass', 'h');
    if (modeType) {
        // shows the buttons inside the element with id sm_controller
        AI.selectAll('.review', 'removeClass', 'h');
        // disabled the drggable option and pushed the user data in uans array
        ucTree.unBindLab();
        // shows the user answer
        ucTree.showans(ajax_eId, 'u');
        // J('#sm_controller button').each(function () {
        //     if (J(this).hasClass('your-ans btn-light')) {
        //         // shows the user answer if button inside the element has id: 'sm_controller' have 'your-ans' and 'btn-light' class 
        //         ucTree.showans(ajax_eId, 'u');
        //     } else if (J(this).hasClass('correct-ans btn-light')) {
        //         // shows the correct answer after click on correct answer button
        //         ucTree.showans(ajax_eId, 'c');
        //     }
        // });
    } else {
        //removes the h class from draggable container
        AI.selectAll('.test', 'removeClass', 'h');
        // Enables to drag and drop the element for matching the answer and completing the task
        ucTree.bindLab();
        // shows the user answer
        ucTree.showans(ajax_eId, 'u');
    }
}

// Used for disabled the drggable option if review mode is on and pushed the user data in uans array
ucTree.unBindLab = function () {
    ucTree.labBinded = false;
    // For droppable area's container element
    var elemnt = AI.find(ajax_eId, '.treeall');
    // For draggable area's container element
    var lall = AI.find(ajax_eId, '.treecorrect');
    elemnt.jstree()['settings']['dnd'].check_while_dragging = false;
    // disabled the draggable element from being drag from droppable container
    elemnt.jstree()['settings']['dnd'].is_draggable = false;
    lall.jstree()['settings']['dnd'].check_while_dragging = false;
    // disabled the draggable element from being drag from draggable container
    lall.jstree()['settings']['dnd'].is_draggable = false;
    var tree = J.jstree.reference(elemnt)._model.data;
    J.each(tree, function (index, value) {
        if (index != '#') {
            let uans = [];
            J.each(value.children, function (i, v) {
                if (typeof (tree[v].li_attr.cseq) != "undefined" && tree[v].li_attr.cseq != "0" && tree[v].li_attr.cseq != "*") {
                    // push tid of draggable element with sequence if it is defined for answer matching
                    uans.push('{' + tree[v].li_attr.cseq + '}' + ucTree.getTid(v, tree));
                } else if (J(ajax_eId).find('#' + v).find('> a > .jstree-checkbox:visible').length > 0 && J.jstree.reference(elemnt).is_selected(J(ajax_eId).find('#' + v))) {
                    // push the tid with some addition in cans array if checkbox is used in tree structure instead of image
                    uans.push('*' + ucTree.getTid(v, tree));
                } else {
                    // push the tid in cans array
                    uans.push(ucTree.getTid(v, tree));
                }
            });
            uans = uans.sort().toString();
            if (typeof (value.li_attr.correctans) != 'undefined') {
                if (uans.length >= 0) {
                    // set the useranswer
                    value.li_attr.userans = uans;
                }
            }
        }
    });
    // hides the context menu if right-click performed on Droppable area's container
    J(elemnt).on({
        "contextmenu": function (event) {
            event.preventDefault();
            if (event.which == '3' || event.which == '2') {
                J('.jstree-contextmenu.jstree-default-contextmenu').css('display', 'none');
            }
        }
    });
    // Add the class active on correct answer or your answer button which is clicked
    J('#sm_controller button').click(function () {
        J('#sm_controller button').removeClass("active");
        J(this).addClass('active');
    });
}

// Enables to drag and drop the element for matching the answer and completing the task
ucTree.bindLab = function () {
    ucTree.labBinded = true;
    // For droppable area's container element
    var lcrt = AI.find(ajax_eId, '.treeall');
    // For draggable area's container element
    var lall = AI.find(ajax_eId, '.treecorrect');
    lcrt.jstree()['settings']['dnd'].check_while_dragging = true;
    lcrt.jstree()['settings']['dnd'].is_draggable = false;
    lall.jstree()['settings']['dnd'].check_while_dragging = true;
    // enabled the draggable element from being drag from draggable container
    lall.jstree()['settings']['dnd'].is_draggable = true;
    // hides the context menu if right-click performed on Draggable area's container
    J(lcrt).on({
        "contextmenu": function (event) {
            event.preventDefault();
            if (event.which == '3' || event.which == '2') {
                J('.jstree-contextmenu.jstree-default-contextmenu').css('display', 'block');
            }
        }
    });
}
// By using this it can be used in that file where this file imported
export default ucTree;