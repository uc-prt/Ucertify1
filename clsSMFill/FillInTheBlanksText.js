import React from 'react';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
//import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
//import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Settings from 'material-ui/svg-icons/action/settings';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
//import FontIcon from 'material-ui/FontIcon';
import { Router, Route, hashHistory, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
/*import {  Step,  Stepper,  StepButton, StepLabel} from 'material-ui/Stepper';
import Checkbox from 'material-ui/Checkbox';*/
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Player from '../components/Player';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CircularProgress from 'material-ui/CircularProgress';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })
var self;
var arr = [];
var toolbarContent1 = "code | undo redo | styleselect | removeformat | bullist numlist outdent indent | mybutton player | equationeditor";
var toolbarContent2 = "";
var countInput = 0;
var countDropDown = 0;
var editFlag = false;
var tempId = "";
var test;
var tempDropDownCorrect = "";
var tempDragDropCorrect = [];
var tempMultiLineCorrect = [];
var tempMultiLineRows = "";
var tempMultiLineCols = "";
var tempMultiLineDefaultAns = "";
var allDragOption = [];
var dragID = 0
var dragIDvalue = [];
var dragSingle = 0;
var horizontal = false;
var vertical = true;
var playerArr = '';

export default class FillInTheBlanksText extends React.Component {
	constructor(props) {
		super(props);
		self = this;
		this.renderPlayer = this.renderPlayer.bind(this);
		this.getXml = this.getXml.bind(this);
		this.toggleView = this.toggleView.bind(this);
		this.getTitle = this.getTitle.bind(this);
		this.getStem = this.getStem.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleChangeMultiple = this.handleChangeMultiple.bind(this);
		this.getRemediation = this.getRemediation.bind(this);
		this.viewRemediation = this.viewRemediation.bind(this);
		this.fullScreen = this.fullScreen.bind(this);
		this.edit = 0;
		this.message = "";
		this.state = {
			title: "",
			stem: "",
			remediation: "",
			remediationToggle: false,
			verticalView: false,
			text: "",
			snackback: false,
			matchType: "",
			multi: "",
			ignoreType: "",
			manual_grade: "",
			totalCorrectAns: "",
			open: false,
			xmlDialog: false,
			correctAns: [],
			playerPopup: false,
			fillInTheBlanksChoice: 1,
			saveDialog: false,
			guid: "",
			valueMultiple: [],
			xml: "",
			fillDropDown: [
				{
					value: "",
					id: ""

				}
			],
			fillDragDrop: [
				{
					value: "",
					id: "",
					correct: 1

				}
			],
			fillMultiLine: [
				{
					value: "",
					id: ""

				}
			],
			dropDownCorrectAns: [],
			dropDownText: ""
		};
	}

	initEditor() {
		var that = this;
		tinymce.init({
			selector: '.tinymce-editor',
			inline: true,
			theme: 'modern',
			min_width: 100,
			resize: true,
			menubar: false,
			toolbar: false,
			elementpath: false,
			statusbar: false,
			force_br_newlines: true,
			remove_trailing_brs: true,
			forced_root_block: false,
			//extended_valid_elements : 'input[onChange|id|name|class|style|correctAns|userAns],div[class|style],span[id|contentEditable|class|style]',
			extended_valid_elements: 'span[onClick|contentEditable]',
			valid_elements: "*[*]",
			fixed_toolbar_container: '#toolbar_container',
			extended_valid_elements: 'uc:syntax,uc:ref',
			custom_elements: 'uc:syntax,~uc:ref',
			setup: function (editor) {
				editor.addButton('response', {
					text: 'Response',
					onclick: function() {
						self.handleOpen();
					}
				});
				editor.addButton('mybutton', {
					text: 'UC tags',
					type: 'menubutton',
					icon: false,
					menu: [
						{
							text: 'uc:syntax',
							onclick: function() {
								editor.focus();
								var selected = (editor.selection.getContent() == '') ? ' ' : editor.selection.getContent();
								editor.selection.setContent('<uc:syntax>' + selected + '</uc:syntax>');
							}
						},
						{
							text: 'uc:hed',
							onclick: function() {
								editor.focus();
								var selected = (editor.selection.getContent() == '') ? ' ' : editor.selection.getContent();
								editor.selection.setContent('<uc:hed>' + selected + '</uc:hed>');
							}
						},
						{
							text: 'uc:ref',
							onclick: function() {
								editor.focus();
								var selected = (editor.selection.getContent() == '') ? ' ' : editor.selection.getContent();
								editor.selection.setContent('<uc:ref>' + selected + '</uc:ref>');
							}
						},
						{
							text: 'uc:stx',
							onclick: function() {
								editor.focus();
								var selected = (editor.selection.getContent() == '') ? ' ' : editor.selection.getContent();
								editor.selection.setContent('<uc:stx>' + selected + '</uc:stx>');
							}
						},
						{
							text: 'uc:kwd',
							onclick: function() {
								editor.focus();
								var selected = (editor.selection.getContent() == '') ? ' ' : editor.selection.getContent();
								editor.selection.setContent('<uc:kwd>' + selected + '</uc:kwd>');
							}
						},
						{
							text: 'uc:cpr',
							onclick: function() {
								editor.focus();
								var selected = (editor.selection.getContent() == '') ? ' ' : editor.selection.getContent();
								editor.selection.setContent('<uc:cpr>' + selected + '</uc:cpr>');
							}
						}
					]
				});
				editor.on('focus', function (e) {
					tinymce.EditorManager.execCommand('mceVisualBlocks', false);
				});
				editor.on('blur', function (e) {
					tinymce.EditorManager.execCommand('mceVisualBlocks', true);
				});
			},
			style_formats: [
				{
					title: 'Headers', items: [
						{ title: 'Header 1', format: 'h1' },
						{ title: 'Header 2', format: 'h2' },
						{ title: 'Header 3', format: 'h3' },
						{ title: 'Header 4', format: 'h4' },
						{ title: 'Header 5', format: 'h5' },
						{ title: 'Header 6', format: 'h6' }
					]
				},
				{
					title: 'Inline', items: [
						{ title: 'Bold', icon: 'bold', format: 'bold' },
						{ title: 'Italic', icon: 'italic', format: 'italic' },
						{ title: 'Underline', icon: 'underline', format: 'underline' },
						{ title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough' },
						{ title: 'Superscript', icon: 'superscript', format: 'superscript' },
						{ title: 'Subscript', icon: 'subscript', format: 'subscript' }
					]
				},
				{
					title: 'Blocks', items: [
						{ title: 'Paragraph', format: 'p' },
						{ title: 'Blockquote', format: 'blockquote' },
						{ title: 'Div', format: 'div' }
					]
				},
				{
					title: 'Alignment', items: [
						{ title: 'Left', icon: 'alignleft', format: 'alignleft' },
						{ title: 'Center', icon: 'aligncenter', format: 'aligncenter' },
						{ title: 'Right', icon: 'alignright', format: 'alignright' },
						{ title: 'Justify', icon: 'alignjustify', format: 'alignjustify' }
					]
				}
			],
			plugins: [
				"lists link image charmap print preview anchor",
				"searchreplace code fullscreen",
				"insertdatetime media table contextmenu paste playertag"
			],
			toolbar1: toolbarContent1,
			toolbar2: toolbarContent2,

		});
		tinymce.init({
			selector: '.tinymce-editor-response',
			inline: true,
			theme: 'modern',
			min_width: 100,
			resize: true,
			menubar: false,
			toolbar: false,
			elementpath: false,
			statusbar: false,
			force_br_newlines: true,
			remove_trailing_brs: true,
			forced_root_block: false,
			//extended_valid_elements : 'input[onChange|id|name|class|style|correctAns|userAns],div[class|style],span[id|contentEditable|class|style]',
			extended_valid_elements: 'span[onClick|contentEditable]',
			valid_elements: "*[*]",
			fixed_toolbar_container: '#toolbar_container',
			extended_valid_elements: 'uc:syntax,uc:ref',
			custom_elements: 'uc:syntax,~uc:ref',
			setup: function (editor) {
				editor.addButton('response', {
					text: 'Response',
					context: 'res',
					prependToContext: true,
					onclick: function() {
						self.handleOpen();
					}
				});
			},
			style_formats: [
				{
					title: 'Headers', items: [
						{ title: 'Header 1', format: 'h1' },
						{ title: 'Header 2', format: 'h2' },
						{ title: 'Header 3', format: 'h3' },
						{ title: 'Header 4', format: 'h4' },
						{ title: 'Header 5', format: 'h5' },
						{ title: 'Header 6', format: 'h6' }
					]
				},
				{
					title: 'Inline', items: [
						{ title: 'Bold', icon: 'bold', format: 'bold' },
						{ title: 'Italic', icon: 'italic', format: 'italic' },
						{ title: 'Underline', icon: 'underline', format: 'underline' },
						{ title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough' },
						{ title: 'Superscript', icon: 'superscript', format: 'superscript' },
						{ title: 'Subscript', icon: 'subscript', format: 'subscript' }
					]
				},
				{
					title: 'Blocks', items: [
						{ title: 'Paragraph', format: 'p' },
						{ title: 'Blockquote', format: 'blockquote' },
						{ title: 'Div', format: 'div' }
					]
				},
				{
					title: 'Alignment', items: [
						{ title: 'Left', icon: 'alignleft', format: 'alignleft' },
						{ title: 'Center', icon: 'aligncenter', format: 'aligncenter' },
						{ title: 'Right', icon: 'alignright', format: 'alignright' },
						{ title: 'Justify', icon: 'alignjustify', format: 'alignjustify' }
					]
				}
			],
			plugins: [
				"lists link image charmap print preview anchor",
				"searchreplace code fullscreen",
				"insertdatetime media table contextmenu paste res"
			],
			toolbar1: "response",
			contextmenu: "resp"
		});
	}
	componentWillMount() {
		$('#save_xml').show();
		requireScript('./fillintheblanksScript.js');
	}


	handleOpen() {
		this.setState({ open: true }); /*Open Response Dialog Boz*/
	}

	handleClose() {
		/*Unset editFlag for textbox*/
		if (this.state.fillInTheBlanksChoice == 1) {
			editFlag = false;
		}
		/*END*/

		/*Restore default dropdown option*/
		if (this.state.fillInTheBlanksChoice == 2) {
			this.state.fillDropDown = [];
			this.state.fillDropDown.push({
				value: "",
				id: ""
			});
		}
		/*END*/

		/*Restore Default Drag Drop Option*/
		if (this.state.fillInTheBlanksChoice == 3) {
			this.state.fillDragDrop = [];
			this.state.fillDragDrop.push({
				value: "",
				id: "",
				correct: 1
			});
		}
		/*END*/

		/*Restore Default MultiLine Option*/
		if (this.state.fillInTheBlanksChoice == 5) {
			this.state.fillMultiLine = [];
			this.state.fillMultiLine.push({
				value: "",
				id: ""
			});
		}
		/*END*/

		this.setState({ open: false }); /*Open Response Dialog*/
	}

	insertTextbox() {
		if (editFlag == false) {
			/* Insert New textbox*/
			var correctAns = document.getElementById("input1").value;

			if (correctAns != "") {
				this.state.correctAns[countInput] = correctAns;
				this.setState({ open: false });
				tinyMCE.activeEditor.insertContent(' <span draggable="true" data-type="input" class="fillInTheBlanksText alert alert-info" data-correctAns="' + correctAns + '" id="' + countInput + '" style="padding: 5px;outline: none;line-height:40px;cursor:move" contentEditable="false">' + correctAns + '</span> ');
				this.addEvent(tinyMCE.activeEditor.dom.select('#' + countInput)[0], 'click', function() {
					self.editAns($(this).attr('id'), $(this).attr('data-correctAns'));
				});
				countInput++;
			} else {
				$("#responseDialog").effect("shake");
				this.message = "All fields are required";
				this.setState({ snackback: true });
			}
		} else {
			this.setState({ open: false });
			let editAns = document.getElementById("input1").value;
			$("#authorData").find("#" + tempId).attr("data-correctAns", editAns).html(editAns);
			editFlag = false;
			/*END*/
		}
	}

	insertDropDown() {
		var allOption = [];
		var tempOption = [];
		var selected = "";
		this.state.fillDropDown.map(function (data, i) {
			if (data.value != "") {
				if (data.value.indexOf('+') == 0) {
					allOption[i] = data.value.slice(1);
					selected = data.value.slice(1);
				} else {
					allOption[i] = data.value;
				}
			}
			if (data.value == tempDropDownCorrect) {
				tempOption[i] = "*" + data.value;
			} else {
				if (data.value != "") tempOption[i] = data.value;
			}

		});
		var correctAnsDropDown = tempDropDownCorrect;
		tempOption = $.grep(tempOption, function (n) { return n == 0 || n });
		allOption = $.grep(allOption, function (n) { return n == 0 || n });
		if (correctAnsDropDown != "") {
			this.state.dropDownCorrectAns[countDropDown] = correctAnsDropDown;
			tinyMCE.activeEditor.insertContent(' <span data-type="select" data-selected="' + selected + '" class="dropDown alert alert-info" cursor="pointer" data-correctAns="' + correctAnsDropDown + '" id="' + countInput + '" data-value="' + allOption.toString() + '" style="padding: 5px;outline: none;line-height:40px;cursor:move" contentEditable="false">' + tempOption.toString() + '|s</span> ');
			this.addEvent(tinyMCE.activeEditor.dom.select('#' + countInput)[0], 'click', function() {
				self.editModeSelect(2, $(this));
			});
			this.setState({ open: false });
			countInput++;
			this.state.fillDropDown = [];
			this.state.fillDropDown.push({
				value: "",
				id: ""
			});
			tempDropDownCorrect = "";
		} else {
			$("#responseDialog").effect("shake");
			this.message = "Please choose atleast one correct answer";
			this.setState({ snackback: true });

		}
	}

	insertDragDrop() {
		let allOption = [];
		let tempOption = [];
		let txtWidth, divWidth;
		dragIDvalue = [];
		this.state.fillDragDrop.map(function (data, i) {
			allOption[i] = data.value;
			dragIDvalue[i] = ((data.correct != 0) ? "ID" + dragID : "id");
			allDragOption[i] = "ID" + dragID;
			if (data.value != "") {
				$(".dragArea").html($(".dragArea").html() + "<div id=ID" + dragID + " class='drag-resize dragable ui-draggable' caption=" + data.value + " path='//s3.amazonaws.com/jigyaasa_content_static/' drag-single=" + dragSingle + " bgcolor='#CCFFCC' style='background-color:#CCFFCC;height:auto;max-width:110px;padding:3px 10px 3px 10px'>" + data.value + "</div>");
				txtWidth = (($(".dragArea #ID" + dragID).html().length - 2) * 7.5);
				divWidth = txtWidth + 40;
				$(".dragArea #ID" + dragID).css('max-width', divWidth + 'px');
				dragID++;
			}
		});
		allOption = $.grep(allOption, function (n) { return n == 0 || n });
		let correctAnsDragDrop = tempDragDropCorrect.toString();
		if (correctAnsDragDrop != "") {
			tinyMCE.activeEditor.insertContent(' <span data-type="dragDrop" class="alert alert-info" data-allvalue="' + allDragOption.toString() + '" data-correctAns="' + dragIDvalue.toString() + '" id="' + countInput + '" data-value="' + allOption.toString() + '" style="padding: 5px;outline: none;line-height:40px;cursor:move" contentEditable="false">' + allOption.toString() + '|d' + ((dragSingle == 0) ? "" : "s") + '</span> ');
			this.addEvent(tinyMCE.activeEditor.dom.select('#' + countInput)[0], 'click', function() {
				self.editModeDrag(3, $(this));
			});
			this.setState({ open: false });
			countInput++;
			this.state.fillDragDrop = [];
			this.state.fillDragDrop.push({
				value: "",
				id: "",
				correct: 1
			});
			tempDragDropCorrect = [];
			dragSingle = 0;
		} else {
			$("#responseDialog").effect("shake");
			this.message = "Please input atleast one correct answer";
			this.setState({ snackback: true });
		}
		/*Shuffle Drag Options*/
		var parent = $(".dragArea");
		var divs = parent.children();
		while (divs.length) {
			parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
		}
		/*END*/
	}

	insertMultiLine() {
		let correctAnsMultiLine = tempMultiLineCorrect.toString();
		if (correctAnsMultiLine != "") {
			tinyMCE.activeEditor.insertContent(' <span data-type="multiLine" class="alert alert-info" data-defaultAns="' + tempMultiLineDefaultAns + '" data-rows="' + ((tempMultiLineRows == "") ? 3 : tempMultiLineRows) + '" data-cols="' + ((tempMultiLineCols == "") ? 20 : tempMultiLineCols) + '" data-correctAns="' + correctAnsMultiLine + '" data-value="' + correctAnsMultiLine + '" id="' + countInput + '" style="padding: 5px;outline: none;line-height:40px;cursor:move" contentEditable="false">' + correctAnsMultiLine + '|{"defaultAns":"' + tempMultiLineDefaultAns + '","rows":"' + ((tempMultiLineRows == "") ? 3 : tempMultiLineRows) + '","cols":"' + ((tempMultiLineCols == "") ? 20 : tempMultiLineCols) + '"}</span> ');
			this.addEvent(tinyMCE.activeEditor.dom.select('#' + countInput)[0], 'click', function() {
				self.editModeMultiLine(5, $(this));
			});
			this.setState({ open: false });
			countInput++;
			this.state.fillMultiLine = [];
			this.state.fillMultiLine.push({
				value: "",
				id: ""
			});

			tempMultiLineCorrect = [];
		} else {
			$("#responseDialog").effect("shake");
			this.message = "Please input atleast one correct answer";
			this.setState({ snackback: true });
		}
	}

	storeAns() {
		switch (this.state.fillInTheBlanksChoice) {
			case 1: this.insertTextbox(); break;
			case 2: this.insertDropDown(); break;
			case 3: this.insertDragDrop(); break;
			case 5: this.insertMultiLine(); break;
		}
		var timer = setTimeout(function() {
			self.getData();
			clearTimeout(timer);
		}.bind(this), 500);
	}

	addEvent(node, eventName, func) {
		if ("undefined" == typeof node || null == node) {
		} else {
			if (!node.ownerDocument.addEventListener && node.ownerDocument.attachEvent) {
				node.attachEvent('on' + eventName, func);
			} else node.addEventListener(eventName, func, false);
		}
	}

	editAns(id, correctAns) {
		editFlag = true;
		this.setState({
			fillInTheBlanksChoice: 1,
			open: true
		});

		//this.setState({open: true});
		document.getElementById("input1").value = correctAns;
		tempId = id;
	}

	editModeSelect(type, data) {
		this.setState({
			fillInTheBlanksChoice: type,
			open: true
		});

		//this.setState({open:true});
		this.state.fillDropDown = [];
		let allValue = data.attr("data-value").split(",")
		$(allValue).each(function (i) {
			self.state.fillDropDown.push({
				value: allValue[i],
				id: ""
			});
		});
	}

	editModeDrag(type, data) {
		this.setState({
			fillInTheBlanksChoice: type,
			open: true
		});

		//this.setState({open:true});
		this.state.fillDragDrop = [];
		let allValue = data.attr("data-value").split(",");
		$(allValue).each(function (i) {
			self.state.fillDragDrop.push({
				value: allValue[i],
				id: "",
				correct: 1
			});
			if (allValue[i] != "") tempDragDropCorrect[i] = allValue[i];
		});
	}

	editModeMultiLine(type, data) {
		this.setState({
			fillInTheBlanksChoice: type,
			open: true
		});

		//this.setState({open:true});
		this.state.fillMultiLine = [];
		let allValue = data.attr("data-value").split(",");
		$(allValue).each(function (i) {
			self.state.fillMultiLine.push({
				value: allValue[i],
				id: ""
			});
			if (allValue[i] != "") tempMultiLineCorrect[i] = allValue[i];
		});
		$("#defaultMultiAns").val(data.attr("data-defaultans"));
		$("#multiLineRows").val(data.attr("data-rows"));
		$("#multiLineCols").val(data.attr("data-cols"));
		$("#multiLineRows").trigger("keyup");
	}

	componentWillUnmount() {
		$('#show_guid').hide();
		tinymce.remove('.tinymce-editor');
	}
	componentDidMount() {
		(editor.save == 1) ? $('#save_xml').show() : $('#save_xml').hide();
		setTimeout(function() {
			if (self.props.content_guid) {
				self.setState({ guid: self.props.content_guid });
				$('#show_guid').html(self.props.content_guid).show();
			}
			else {
				self.setState({ guid: "" });
				$('#show_guid').hide();
			}
		}.bind(this), 400)
		tinyMCE.PluginManager.add('playertag', function (editor, url) {
			editor.addButton('player', {
				text: "Playertag",
				onclick: function() {
					playerArr = '';
					$('#playerState').val('true');
					self.setState({ playerPopup: false });
					self.forceUpdate();
				}
			});
		});
		tinyMCE.PluginManager.add('res', function (editor, url) {
			editor.addMenuItem('resp', {
				text: "Add Response",
				onclick: function() {
					self.handleOpen();
				},
				context: 'insert',
				prependToContext: true
			});
		});
		(self.props.content_guid) ? $('#show_guid').html(self.props.content_guid).show() : $('#show_guid').hide();
		this.initEditor();
		setTimeout(function() {
			self.forceUpdate();
			$('br[data-mce-bogus="1"]').remove();
		}.bind(self), 2000);
		$(document).on('click', '.authoring player', function() {
			playerArr = [];
			var bookmark = tinyMCE.activeEditor.selection.getBookmark();
			$(this).each(function() {
				$.each(this.attributes, function (i) {
					if (this.specified) {
						playerArr[this.name] = this.value;
					}
				});
			});
			playerArr['obj'] = $(this);
			playerArr['bookmark'] = bookmark;
			$('#playerState').val('true');
			self.setState({ playerPopup: false });
			self.forceUpdate();
		});
		$(".activator").hide();
		$("#fillmain").on('click keyup', function() {
			var ans = checkAns("#previewArea");
			self.message = ans;
			self.setState({ snackback: true });
		});
		$("#authorData").on('keyup click', function() {
			self.getData();
		});
		$("#authorData").on('mouseup', function() {
			setTimeout(function() { self.getData() }.bind(this), 300);
		});

		$(window).scroll(function() {
			self.fixDiv();
		});
		$('div[data-text]').each(function (i, obj) {
			$(this).html('<b class="text-muted">' + $(this).attr('data-text') + '</b>');
		});
		$(".tinymce-editor").focus(function() {
			if ($(this).attr('data-text') != undefined) {
				if ($(this).attr('data-text') == $(this).text().trim()) {
					$(this).html("");
				}
			}
		}).focusout(function() {
			if ($(this).attr('data-text') != undefined) {
				if ($(this).text().trim() == '') {
					$(this).html('<b class="text-muted">' + $(this).attr('data-text') + '</b>');
				}
			}
		});
		// $("#authoringDiv").draggable();
		//$("#authoringDiv").resizable();
		$(document).on('click', '#save_xml button', function() {
			self.setState({ saveDialog: true });
			setTimeout(function() {
				(self.state.guid.length == '5') ? $('#saveAs').show() : $('#saveAs').hide();
			}.bind(self), 100);
		});

		if ((this.props.ajaxData)) {
			var response = this.props.ajaxData;
			(editor.save == 1) ? $('#save_xml').show() : $('#save_xml').hide();
			var data = response.content_text; //JSON.parse(response['content_text']);
			//var data = JSON.parse(response['content_text']);
			self.setState({
				stem: data.question,
				remediation: data.explanation,
				title: data.title
			});

			//self.setState({remediation:data.explanation});
			//self.setState({title:data.title});
			$('#title , #title_show').html(data.title);
			$('#stem , #stem_show').html(data.question);
			$('#remediation,#remediation_show').html(data.explanation);
			self.parseSpecialModule(data.special_module_xml);
			self.forceUpdate();
		}
		if (this.props.itemXML) {
			var DXML = this.defaultXML(this.props.itemXML);
			DXML = formatXml(DXML);
			console.log(DXML);
			self.parseSpecialModule(DXML);
			self.forceUpdate();
			console.log(this.state.fillInTheBlanksChoice);
		}
		self.fixDiv();
		this.setState({ valueMultiple: "1" });
		self.getData();
	}
	saveData(is_new) {
		if (editor.course != '') {
			$('#savingContent, #saveAs, #saveButton, #cancelButton').hide();
			$('#saveProcess').show();
			var content_guid = (is_new == '1') ? '' : this.state.guid;
			baseUrl = (self.props.baseUrl) ? self.props.baseUrl : baseUrl;
			(editor.save == 1) ? $('#save_xml').show() : $('#save_xml').hide();
			var response = {};
			response['question'] = self.state.stem;
			response['explanation'] = self.state.remediation;
			response['title'] = (self.state.title != undefined || self.state.title != '<br data-mce-bogus="1">') ? self.state.title : "";
			var arr = [];
			arr.push({
				answer: true,
				id: '01',
				is_correct: '1'
			});
			response['answers'] = arr;
			response['special_module_xml'] = self.state.xml;
			response['total_answers'] = '1';
			response['correct_answers'] = '1';
			var content_type = 'q';
			var content_subtype = '9';
			var content_icon = 0;
			var react_content = 'react';
			$.ajax({
				url: baseUrl + 'editor/index.php', // point to server-side PHP script 
				cache: false,
				datatype: 'json',
				data: { action: 'save', title: response['title'], question: response['question'], explanation: response['explanation'], save: response, react_content: react_content, content_type: content_type, content_subtype: content_subtype, content_guid: content_guid, content_icon: content_icon, special_module_xml: self.state.xml },
				type: 'post',
				success: function (save_response) {
					$('#savingContent, #saveAs, #saveButton,#cancelButton').show();
					$('#saveProcess').hide();
					self.setState({ saveDialog: false });
					console.log(save_response);
					var save_response = JSON.parse(save_response);
					if (!save_response['error']) {
						console.log(save_response['content_guid']);
						$('#show_guid').html(save_response['content_guid']).show();
						self.message = "Saved Data Successfully";
						self.setState({
							snackback: true,
							guid: save_response['content_guid']
						});

						//self.setState({guid:save_response['content_guid']});
					}
					else {
						self.setState({ saveDialog: false });
						self.message = save_response['error'].toString();
						self.setState({ snackback: true });
					}
				}
			});
		}
		else {
			self.setState({ saveDialog: false });
			self.message = "Please Load A Course before Save";
			self.setState({ snackback: true });
		}
	}
	defaultXML(xml) {
		switch (xml) {
			case "editor_item_5.xml":
				this.setState({ fillInTheBlanksChoice: 1 });
				return ('<smxml type="9" name="FillInTheBlank"><text matchType="1"><![CDATA[Education, then, beyond all other devices of %{human}% origin, is the great equalizer of the %{conditions}% of man.]]></text></smxml>');

				break;
			case "editor_item_6.xml":
				this.setState({ fillInTheBlanksChoice: 2 });
				return ('<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, beyond all other devices of %{person,*human,+man|s}% origin, is the great equalizer of the %{situations,*conditions|s}% of man.]]--></text></smxml>');

				break;
			case "editor_item_7.xml":
				this.setState({ fillInTheBlanksChoice: 3 });
				return ('<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, %{beyond|d}% all other devices of %{human|d}% origin, is the great equalizer of the %{conditions|d}% of man.]]--></text></smxml>');

				break;
			case "editor_item_3.xml":
				this.setState({ fillInTheBlanksChoice: 5 });
				return ('<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, beyond all other devices of %{data|{"defaultAns":"ds","rows":"2","cols":"10"}}% origin, is the great equalizer of the conditions.]]--></text></smxml>');

				break;

			case "editor_item_1.xml":
				this.setState({ fillInTheBlanksChoice: 6 });
				return ('<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="1"><!--[CDATA[Education, then, beyond all other devices of %{a+b|e}% origin, is the great equalizer of the conditions.]]--></text></smxml>');
				break;
		}
	}

	parseSpecialModule(special_module_xml) {
		var matchtype = (special_module_xml.match(/matchtype="1"/gm)) ? special_module_xml.match(/matchtype="1"/gm) : '';
		var ignoretype = (special_module_xml.match(/ignoretype="0"/gm)) ? special_module_xml.match(/ignoretype="0"/gm) : '';
		var cdata = special_module_xml.match(/\[CDATA\[[\s\S]*\]\]/gm);
		this.setState({
			matchType: matchtype,
			ignoreType: ignoretype
		});
		//this.setState({ignoreType:ignoretype});
		var correctAnsDropDown = '';
		var allOption = [];
		cdata = (cdata) ? cdata[0].replace(/^\[CDATA\[|\]\]$/gm, '') : '';
		var answerData = cdata.match(/%{[\s\S]*?}%/gm);
		cdata = cdata.replace(/\n/gm, '<br>');
		var answerType = '';
		var dragSingle = '';
		var tempOption = [];
		var options = [];
		var codetype = '';
		var dragIterator = 0;
		var tempMultiLineDefaultAns = [];
		var tempMultiLineRows = [];
		var tempMultiLineCols = [];
		var correctAnsMultiLine = [];
		if (answerData) {
			for (var i = 0; i < answerData.length; i++) {
				var allDragOption = [];
				var correctAns = [];
				var selected = "";
				var originalData = answerData[i];
				answerType = answerData[i].match(/\|(.*?)}%$/gm);
				answerType = (answerType) ? answerType[0].replace(/\||}%/gm, '') : '';
				answerData[i] = (answerType) ? answerData[i].replace(/^%{|\|(.*?)}%$/gm, '') : answerData[i].replace(/^%{|}%$/gm, '');
				if (answerType == 's') {
					options = answerData[i].split(',');
					for (var j = 0; j < options.length; j++) {
						if (options[j].match(/^\+/)) {
							selected = options[j].replace(/^\+/gm, '');
						}
						if (options[j].match(/^\*/)) {
							correctAnsDropDown = options[j].replace(/^\*/gm, '');
						}
					}
					allOption = answerData[i].toString().replace(/,\*|,\+/gm, ',').split(',');
					tempOption = answerData[i].split(',');
					cdata = cdata.replace(originalData, '<span data-type="select" data-selected="' + selected + '" class="dropDown alert alert-info" cursor="pointer" data-correctAns="' + correctAnsDropDown + '" id="' + countInput + '" data-value="' + allOption.toString() + '" style="padding: 5px;outline: none;line-height:40px;cursor:move" contentEditable="false">' + tempOption.toString() + '|s</span>');
					$('#authorData').html(self.htmlSpecialChars(cdata));
					$(document).on('click', '#' + countInput, function() {
						self.editModeSelect(2, $(this));
					});
					countInput++;
				}
				else if (answerType == 'd' || answerType == 'ds') {
					dragSingle = (answerType == 'ds') ? 1 : '';
					var allDrag = answerData[i].split(',');
					while (allDrag.length) {
						var answer = allDrag.pop();
						allDragOption.push('ID' + dragID);
						if (!answer.match(/~i$/gm)) {
							correctAns.push('ID' + dragID);
						}
						answer = answer.replace(/~i$/gm, '');
						$(".dragArea").html($(".dragArea").html() + "<div id=ID" + dragID + " class='drag-resize dragable ui-draggable' caption=" + answer.toString() + " path='//s3.amazonaws.com/jigyaasa_content_static/' drag-single=" + dragSingle + " bgcolor='#CCFFCC' style='background-color:#CCFFCC;height:auto;max-width:110px;padding:3px 10px 3px 10px'>" + answer.toString() + "</div>");
						dragID++;
					}
					cdata = cdata.replace(originalData, '<span data-type="dragDrop" class="alert alert-info" data-allvalue="' + allDragOption.toString() + '" data-correctAns="' + correctAns.toString() + '" id="' + countInput + '" data-value="' + answerData[i] + '" style="padding: 5px;outline: none;line-height:40px;cursor:move" contentEditable="false">' + answerData[i] + '|d' + ((dragSingle == 0) ? "" : "s") + '</span>');
					$('#authorData').html(self.htmlSpecialChars(cdata));
					$(document).on('click', '#' + countInput, function() {
						self.editModeDrag(3, $(this));
					});
					var parent = $(".dragArea");
					var divs = parent.children();
					while (divs.length) {
						parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
					}
					countInput++;
				}
				else if (answerType.indexOf("{") == 0 || answerType.indexOf("{") == 1) {
					tempMultiLineDefaultAns = answerData[i].match(/"defaultAns":"(.*?)"/gm);
					tempMultiLineDefaultAns = (tempMultiLineDefaultAns) ? tempMultiLineDefaultAns[0].replace(/"defaultAns":"|"$/gm, '') : '';
					tempMultiLineRows = answerData[i].match(/"rows":"(.*?)"/gm);
					tempMultiLineRows = (tempMultiLineRows) ? tempMultiLineRows[0].replace(/"rows":"|"$/gm, "") : '';
					tempMultiLineCols = answerData[i].match(/"cols":"(.*?)"/gm);
					tempMultiLineCols = (tempMultiLineCols) ? tempMultiLineCols[0].replace(/"cols":"|"$/gm, "") : '';
					correctAnsMultiLine = answerData[i].split('|')[0];
					cdata = cdata.replace(originalData, ' <span data-type="multiLine" class="alert alert-info" data-defaultAns="' + tempMultiLineDefaultAns + '" data-rows="' + ((tempMultiLineRows == "") ? 3 : tempMultiLineRows) + '" data-cols="' + ((tempMultiLineCols == "") ? 20 : tempMultiLineCols) + '" data-correctAns="' + correctAnsMultiLine + '" id="' + countInput + '" style="padding: 5px;outline: none;line-height:40px;cursor:move" contentEditable="false">' + correctAnsMultiLine + '|{"defaultAns":"' + tempMultiLineDefaultAns + '","rows":"' + ((tempMultiLineRows == "") ? 3 : tempMultiLineRows) + '","cols":"' + ((tempMultiLineCols == "") ? 20 : tempMultiLineCols) + '"}</span> ');
					$('#authorData').html(self.htmlSpecialChars(cdata));
					$(document).on('click', '#' + countInput, function() {
						//	self.editMode(5,$(self));
					});
					countInput++;
				}
				else if ((answerType == '') || answerType == 'c') {
					codetype = (answerType == 'c') ? 1 : '';
					cdata = cdata.replace(originalData, '<span draggable="true" data-type="input" class="fillInTheBlanksText alert alert-info" data-correctAns="' + answerData[i] + '" id="' + countInput + '" style="padding: 5px;outline: none;line-height:40px;cursor:move"  contentEditable="false">' + answerData[i] + '</span>');
					$('#authorData').html(self.htmlSpecialChars(cdata));
					$(document).on('click', '#' + countInput, function() {
						self.editAns($(this).attr('id'), $(this).attr('data-correctAns'));
					});
					countInput++;
				}
			}
		}
		else {
			$('#authorData').html(self.htmlSpecialChars(cdata));
		}
		var timer = setTimeout(function() {
			self.getData();
			clearTimeout(timer);
		}.bind(this), 500);
	}
	htmlSpecialChars(data) {
		var tags = data.match(/<[^>]*>/gm);
		var tag = '';
		if (tags) {
			for (var i = 0; i < tags.length; i++) {
				if (!tags[i].match(/<span|<\/span|<br>/gm)) {
					tag = tags[i];
					tags[i] = tags[i].replace(/</g, "&lt;").replace(/>/g, "&gt;");
					data = data.replace(tag, tags[i]);
				}
			}
		}
		return data;
	}

	renderPlayer() {
		$('#preview player').empty();
		tag_player($('#preview'));
		$('#preview').find('player').addClass('hidecontent');
		$('.body img').each(function() {
			if (!$(this).attr('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
				$(this).attr('src', '//s3.amazonaws.com/jigyaasa_content_static/' + $(this).attr('src'));
			}
		});
	}
	fixDiv() {
		var fixedArea = $('#fixedArea');
		var authoringSection = $("#authoringSection");
		var authoringParentWidth = $('#fixedArea').parent().width();
		if ($(window).scrollTop() > 20) {
			fixedArea.css({
				'position': 'fixed',
				'top': '46px',
				'z-index': '999',
				'width': authoringParentWidth
			});
			authoringSection.css({
				'paddingTop': '125px'
			});

		} else {
			fixedArea.css({
				'position': 'relative',
				'top': 'auto'
			});
			authoringSection.css({
				'paddingTop': '0'
			});

		}

	}
	reverseHtmlSpecialChars(data) {
		var tags = data.match(/&lt;(.*?)&gt;/gm);
		var tag = '';
		if (tags) {
			for (var i = 0; i < tags.length; i++) {
				tag = tags[i];
				tags[i] = tags[i].replace(/&lt;/g, "<").replace(/&gt;/g, ">");
				data = data.replace(tag, tags[i]);
			}
		}
		return data;
	}
	getTitle(e) {
		var content = tinyMCE.activeEditor.getContent({ format: 'raw' });
		document.getElementById('title_show').innerHTML = get_ucsyntax(content);
		(content.match(/<uc:syntax/gm)) ? prettyPrint() : '';
		self.setState({ title: tinyMCE.activeEditor.getContent({ format: 'raw' }) });
	}

	getStem(e) {
		var content = tinyMCE.activeEditor.getContent({ format: 'raw' });
		document.getElementById('stem_show').innerHTML = get_ucsyntax(content);
		(content.match(/<uc:syntax/gm)) ? prettyPrint() : '';
		self.setState({ stem: tinyMCE.activeEditor.getContent({ format: 'raw' }) });
	}
	getRemediation(e) {
		var content = tinyMCE.activeEditor.getContent({ format: 'raw' });
		document.getElementById('remediation_show').innerHTML = get_ucsyntax(content);
		(content.match(/<uc:syntax/gm)) ? prettyPrint() : '';
		self.setState({ remediation: tinyMCE.activeEditor.getContent({ format: 'raw' }) });
	}
	fillReady(fillid) {
		/* $BeginBlock testMode */
		readyFill(fillid);
		//showdragans(fillid, 'u');
		/* $EndBlock testMode */
		/* $BeginBlock reviewMode */
		//showdragans(fillid, 'u', 1);
		$('#sm_controller button').on('click', function() {
			$('#sm_controller button').removeClass("active");
			$(this).addClass('active');
		});
		/* $EndBlock reviewMode */
	}

	getData(e) {
		//var str = new DOMParser().parseFromString(e.target.innerHTML,"text/html");
		this.setState({
			matchType: "0",
			ignoreType: "0",
			multi: "",
			remediationToggle: false
		});

		//this.setState({ignoreType:"0"});
		//this.setState({multi:""});
		//this.setState({remediationToggle:false});
		for (let i = 0; i < this.state.valueMultiple.length; i++) {
			if (this.state.valueMultiple[i] == "1") {
				this.setState({ matchType: "1" });
				break;
			}
		}
		for (let i = 0; i < this.state.valueMultiple.length; i++) {
			if (this.state.valueMultiple[i] == "2") {
				this.setState({ ignoreType: "1" });
				break;
			}
		}
		for (let i = 0; i < this.state.valueMultiple.length; i++) {
			if (this.state.valueMultiple[i] == "3") {
				this.setState({ multi: "multiple" });
				break;
			}
		}
		if (this.state.fillInTheBlanksChoice == 1 || this.state.fillInTheBlanksChoice == 2 || this.state.fillInTheBlanksChoice == 3 || this.state.fillInTheBlanksChoice == 5) {
			var data = (!(tinyMCE.activeEditor.getContent({ format: 'raw' })) ? "" : tinyMCE.activeEditor.getContent({ format: 'raw' }));
			//data = data.replace(/<p>|<\/p>/g,'');
			this.setState({ text: data });
			var str = this.state.text;
			arr = str.match(/<span(.*?)>(.*?)<\/span>/gi);
			if (arr) {
				for (var i = 0; i < arr.length; i++) {
					var inputId = arr[i].match(/id="(.*?)"/g);
					var allValue = arr[i].match(/value="(.*?)"/g);
					var correctAnsValue = arr[i].match(/correctans="(.*?)"/g);
					var type = arr[i].match(/type="(.*?)"/g);
					var defaultAns = arr[i].match(/defaultans="(.*?)"/g);
					var rows = arr[i].match(/rows="(.*?)"/g);
					var cols = arr[i].match(/cols="(.*?)"/g);
					var codetype = arr[i].match(/codetype="(.*?)"/g);
					var selected = arr[i].match(/selected="(.*?)"/g);
					if (inputId) {
						inputId = inputId.toString().replace(/id=|"/g, '');
					}
					if (correctAnsValue) {
						correctAnsValue = correctAnsValue.toString().replace(/correctans=|"/g, '');
					}
					if (defaultAns) {
						defaultAns = defaultAns.toString().replace(/defaultans=|"/g, '');
					}
					if (rows) {
						rows = rows.toString().replace(/rows=|"/g, '');
					}
					if (cols) {
						cols = cols.toString().replace(/cols=|"/g, '');
					}
					if (selected) {
						selected = selected.toString().replace(/selected=|"/g, '');
					}
					if (allValue) {
						allValue = allValue.toString().replace(/value=|"/g, '');
						var optionValue = allValue.split(",");
						var showOption = "";
						optionValue.map(function (data, i) {
							showOption = showOption + "<option value=" + (i + 1) + " " + ((selected == data) ? 'selected="selected"' : 'no') + " correctans=" + ((correctAnsValue == data) ? "1" : "0") + " userans=''>" + data + "</option>";
						});
					}
					if (type) {
						type = type.toString().replace(/type=|"/g, '');
					}
					if (codetype) {
						codetype = codetype.toString().replace(/codetype=|"/g, '');
					}

					if (type == "input") {
						str = str.replace(arr[i], "<div id=elem" + inputId + " class='fillelement' style='display:inline-block'><input class='fillintheblank form-control' id=elem" + inputId + " anskey='" + correctAnsValue + "' userans='' defaultans='' haskeywords='' codetype='" + codetype + "' hasnotkeywords='' keywordtype='' autocomplete=off data-role=none style='width:150px' type='text' /> </div>");
					}

					if (type == "select") {
						str = str.replace(arr[i], "<div id=elem" + inputId + " class='fillelement' style='display:inline-block'><select class='fillintheblank form-control' data-role='none' style='width:150px' autocomplete='off'><option value='0'>Please Select</option>" + showOption + "</select></div>");
					}

					if (type == "dragDrop") {
						str = str.replace(arr[i], "<div id=elem" + inputId + " class='drag-resize dropable ui-droppable ui-draggable' path='//s3.amazonaws.com/jigyaasa_content_static/' anskey=" + correctAnsValue + " caption='' userans='' droped='' bgcolor='#FFFFCC' style='display:inline-block;background-color: rgb(204, 255, 204); min-width: 50px; height: 30px; padding: 3px 10px 5px;vertical-align:middle'></div>");
						let _maxWidth = [];
						$(".dragArea div").each(function (i) {
							_maxWidth[i] = $(this).css("max-width").replace("px", '');
						});
						$("#fillmain [id^='elem']").each(function() {
							$(this).css({ "max-width": Math.max(..._maxWidth) });
						})
						//$("#fillmain #elem"+inputId).css({"max-width":Math.max(..._maxWidth)});

					}

					if (type == "multiLine") {
						str = str.replace(arr[i], "<div id=elem" + inputId + " class='fillelement' style='display:inline-block'><textarea class='textarea' rows='" + rows + "' cols='" + cols + "' anskey='" + correctAnsValue + "' value='' userans='' defaultans='" + defaultAns + "' haskeywords='' hasnotkeywords='' keywordtype='1' autocomplete='off' data-role='none'></textarea></div>");
					}
					document.getElementById("previewArea").innerHTML = self.reverseHtmlSpecialChars(str);
				}
			} else {
				document.getElementById("previewArea").innerHTML = self.reverseHtmlSpecialChars(str);
			}
			(self.reverseHtmlSpecialChars(str).match(/<pre/gm)) ? prettyPrint() : '';
			this.fillReady("#fillmain");
			modeOn();
			var parent = $(".dragArea");
			var divs = parent.children();
			for (let i = 0; i < divs.length; i++) {
				divs.removeClass("ui-draggable-disabled");
			}

			/* Show Drag Area with valid option */
			$(".dragArea div").hide();
			//$(".footerstr").hide();
			$("#authorData [data-type='dragDrop']").each(function (i) {
				$(".footerstr").show();
				let showDragOption = $(this).attr('data-allvalue').split(",");
				$(showDragOption).each(function (j) {
					$(".dragArea div[id='" + showDragOption[j] + "']").show();
				});
			});
			/*END*/
			this.parseXml();
		}
	}
	parseXml() {
		var cdata = this.state.text;
		var arr = cdata.match(/<span(.*?)>(.*?)<\/span>/g);
		if (arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].match(/type="(.*?)"/g)) {
					var hell = arr[i].replace(/<span(.*?)>|<\/span>/g, '')
					var cdata = cdata.replace(arr[i], "%{" + hell + "}%");
				}
				//var correctAnsValue = arr[i].match(/correctans="(.*?)"/g);
				//var correctAnsValue = correctAnsValue.toString().replace(/correctans=|"/g,'');
			}
		}
		//	var cdata = new DOMParser().parseFromString(cdata,"text/html");
		//	cdata = cdata.documentElement.textContent;
		cdata = cdata.replace(/<br>|<br\/>/gm, '\n');
		var str = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="9" name="FillInTheBlank"><text matchtype="' + this.state.matchType + '" ignoretype="' + this.state.ignoreType + '"><!--[CDATA[' + cdata + ']]--></text></smxml>';
		var myXml = formatXml(str);
		this.setState({ xml: self.reverseHtmlSpecialChars(myXml) });
	}

	updateDialog(getValue) {
		this.setState({ fillInTheBlanksChoice: getValue });
	}
	addDropDownOption() {
		this.state.fillDropDown.push({
			value: "",
			id: ""
		});
		this.forceUpdate();
	}
	saveXml() {
		$("#authorData, .dragArea, #previewArea").html('');
		this.setState({ xml: this.state.xml });
		this.parseSpecialModule(this.state.xml);
		this.setState({ xmlDialog: false });
	}
	addMultiLineOption() {
		this.state.fillMultiLine.push({
			value: "",
			id: ""
		});
		this.forceUpdate();
	}
	addDragDropOption() {
		this.state.fillDragDrop.push({
			value: "",
			id: "",
			correct: 1
		});
		this.forceUpdate();
	}
	storeDropDownOption(i, e) {
		this.state.fillDropDown[i.i].value = e.target.value;
		this.state.fillDropDown[i.i].id = countDropDown;
		this.forceUpdate();
	}
	storeDragDropOption(i, e) {
		tempDragDropCorrect[i.i] = e.target.value;
		this.state.fillDragDrop[i.i].value = e.target.value;
		this.state.fillDragDrop[i.i].id = countDropDown;
		this.forceUpdate();
	}
	storeMultiLineOption(i, e) {
		tempMultiLineCorrect[i.i] = e.target.value;
		this.state.fillMultiLine[i.i].value = e.target.value;
		this.state.fillMultiLine[i.i].id = countDropDown;
		this.forceUpdate();
	}
	storeDropDownAns(e) {
		tempDropDownCorrect = e.target.value;
	}
	storeDragDropAns(i, e) {
		((e.target.checked == false) ? this.state.fillDragDrop[i.i].correct = 0 : this.state.fillDragDrop[i.i].correct = 1);
		self.forceUpdate();
	}
	storeMultiLineDefaultAns(e) {
		tempMultiLineDefaultAns = e.target.value;
	}

	storeMultiLineRows(e) {
		tempMultiLineRows = e.target.value;
	}

	storeMultiLineCols(e) {
		tempMultiLineCols = e.target.value;
	}

	getXml() {
		this.getData();
		this.setState({ xmlDialog: true });
	}
	setXml() {
		this.getData();
		this.setState({ xmlDialog: true });
	}

	setDragSingle(e) {
		dragSingle = ((e.target.checked == true) ? 1 : 0);
	}
	handleChange(value) {
		switch (value) {
			case 1:
				return (
					<div>
						<TextField
							hintText={(($("#input1").html() != "") ? "Write correct answer here" : "")}
							id="input1"
							style={{ margin: "5px" }}
							autoFocus={true}
						/>
						<div>*For multiple correct answer seprate the answer with comma (,) without space</div>
						<Card containerStyle={{ marginTop: "10px" }} zDepth={0}>
							<CardHeader
								title="Settings"
								titleStyle={{ fontSize: "16px" }}
								actAsExpander={true}
								showExpandableButton={true}
								style={{ width: "160px", border: "solid 1px #000", borderRadius: "3px", padding: "6px" }}
							/>
							<CardText expandable={true}>
								<RadioButtonGroup name="moreOptions">
									<RadioButton
										value="codeType"
										label="Code Type"
									/>
								</RadioButtonGroup>
							</CardText>
						</Card>
					</div>
				);
			case 2:
				return (
					<div>
						<FloatingActionButton
							mini={true}
							style={{ margin: "5px", float: "right" }}
							onClick={this.addDropDownOption.bind(this)}
						>
							<ContentAdd />
						</FloatingActionButton>
						{this.state.fillDropDown.map(function (data, i) {
							return (
								<div key={i}>
									<input
										type="radio"
										name="dropdownCorrectAns"
										value={data.value}
										onClick={self.storeDropDownAns.bind(self)}
									/>
									<TextField
										hintText="Write Option here"
										id={"dropDown" + i}
										autoFocus={true}
										onChange={self.storeDropDownOption.bind(self, { i })}
										style={{ margin: "5px" }}
										value={data.value}
									/>
								</div>
							);
						})}
						<div>*For choosing correct answer select any one radio from your given option</div>
					</div>
				);
			case 3:
				return (
					<div>
						<div style={{ margin: "5px", float: "left", paddingTop: "9px" }}>
							<label for="drag_single">Drag Single</label>
							<input
								style={{ marginLeft: "12px" }}
								type="checkbox"
								onClick={this.setDragSingle.bind(this)}
								id="drag_single"
							/>
						</div>
						<FloatingActionButton
							mini={true}
							style={{ margin: "5px", float: "right" }}
							onClick={this.addDragDropOption.bind(this)}
						>
							<ContentAdd />
						</FloatingActionButton>
						{this.state.fillDragDrop.map(function (data, i) {
							return (
								<div style={{ clear: "both" }} key={i}>
									<input
										type="checkbox"
										defaultChecked="true"
										name="dragDropCorrectAns"
										value={data.value}
										onClick={self.storeDragDropAns.bind(self, { i })}
									/>
									<TextField
										hintText="Write Options here"
										id={"dragDrop" + i}
										autoFocus={true}
										onChange={self.storeDragDropOption.bind(self, { i })}
										style={{ margin: "5px" }}
										value={data.value}
									/>
								</div>
							);
						})}
						<div>*By default all your given option is correct answer</div>
						<div>*For choosing incorrect answer unselect the checkbox from your given option</div>
					</div>
				);
			case 4:
				return (
					<div><h2>Under Development</h2></div>
				);
			case 5:
				return (
					<div>
						<TextField
							hintText={(($("#defaultMultiAns").html() != "") ? "Default Answer" : "")}
							id="defaultMultiAns"
							style={{ margin: "5px" }}
							onChange={this.storeMultiLineDefaultAns.bind(this)}
						/>
						<TextField
							hintText={(($("#multiLineRows").html() != "") ? "Rows" : "")}
							id="multiLineRows"
							pattern="[0-9]"
							style={{ margin: "5px", width: "40px" }}
							onChange={this.storeMultiLineRows.bind(this)}
						/>
						<TextField
							hintText={(($("#multiLineCols").html() != "") ? "Cols" : "")}
							id="multiLineCols"
							style={{ margin: "5px", width: "40px" }}
							onChange={this.storeMultiLineCols.bind(this)}
						/>
						<FloatingActionButton
							mini={true}
							style={{ margin: "5px", float: "right" }}
							onClick={this.addMultiLineOption.bind(this)}
						>
							<ContentAdd />
						</FloatingActionButton>
						<br />
						{this.state.fillMultiLine.map(function (data, i) {
							return (
								<div key={i}>
									<TextField
										hintText="Write Options here"
										id={"multiLine" + i}
										autoFocus={true}
										onChange={self.storeMultiLineOption.bind(self, { i })}
										style={{ margin: "5px" }}
										value={data.value}
									/>
								</div>
							);
						})}
						<div>*By default all your given option is correct answer</div>
					</div>
				);
		}
	}
	handleChangeMultiple(event, value) {
		this.setState({
			valueMultiple: value,
		});
		self.getData();
	}
	viewRemediation() {
		this.setState({ remediationToggle: !this.state.remediationToggle });
		var timer = setTimeout(function() {
			if (this.state.remediationToggle == true) {
				modeOn("on");
				showdragans('#fillmain', 'u', 1);
			} else {
				$("#fillmain").find('.draggable').draggable();
				modeOn();
				this.getData();
			}
			clearTimeout(timer);
		}.bind(this), 300);

	}
	horizontalView() {
		horizontal = true;
		vertical = false;
		this.forceUpdate();
	}

	verticalView() {
		vertical = true;
		horizontal = false;
		this.forceUpdate();
	}
	toggleView() {
		this.setState({ verticalView: !this.state.verticalView });
		var timer = setTimeout(function() {
			$("#fixedArea").css({ 'width': $('#fixedArea').parent().width() });
			clearTimeout(timer);
		}.bind(this), 100);

	}

	fullScreen() {
		if ($("#authoringDiv").hasClass("col-lg-6") || $("#authoringDiv").css("display") == "none") {
			$("#authoringDiv").toggle();
			if (this.state.verticalView == false) {
				this.setState({ verticalView: true });
			} else {
				this.setState({ verticalView: false });
				var timer = setTimeout(function() {
					let wid = $('#fixedArea').parent().width();
					$("#fixedArea").css({
						transition: "width 0.5s",
						WebkitTransition: "width 0.5s",
						MozTransition: "width 0.5s",
						OTransition: "width 0.5s",
						width: wid,

					});
					clearTimeout(timer);
				}.bind(this), 200);

			}
		}
	}

	render() {
		const actionSave = [
			<FlatButton
				id="cancelButton"
				label="Cancel"
				primary={true}
				onClick={() => this.setState({ saveDialog: false })}
			/>,
			<FlatButton
				id="saveAs"
				label="Save As New"
				primary={true}
				onClick={this.saveData.bind(this, '1')}
			/>,
			<FlatButton
				id="saveButton"
				label="Save"
				primary={true}
				keyboardFocused={true}
				onClick={this.saveData.bind(this, '0')}
			/>
		];
		const contentStyle = { margin: '0 16px' };
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.handleClose.bind(this)}
			/>,
			<FlatButton
				label="Done"
				primary={true}
				onClick={this.storeAns.bind(this)}
			/>
		];
		const actionsxml = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={() => this.setState({ xmlDialog: false })}
			/>,
			<FlatButton
				label="Done"
				primary={true}
				keyboardFocused={true}
				onClick={this.saveXml.bind(this)}
			/>
		];
		return (
			<div style={{ padding: "0 2px 0 2px" }} class="col-lg-12">
				<link rel="stylesheet" href="./css/fillintheblank.css" />
				<div id="authoringDiv" style={{ padding: "0 2px 0 2px" }} class={((this.state.verticalView == true) ? "col-lg-12" : "col-lg-6")}>
					<Card zDepth={3} style={{ padding: "5px 3px 5px 3px" }}>
						<div id="fixedArea">
							<CardHeader
								style={{ backgroundColor: "#00bcd4", margin: "0" }}
								id="authoringHeader"
								title={<div style={{ fontSize: "18px", color: "#FFF" }}>Authoring</div>}
							>
								<IconMenu
									iconButtonElement={
										<IconButton style={{ padding: "0", height: "20px", width: "20px" }} iconStyle={{ fill: "#fff", color: "#fff" }}>
											<MoreVertIcon />
										</IconButton>
									}
									targetOrigin={{ horizontal: 'right', vertical: 'top' }}
									anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
									style={{ float: "right", position: "relative", left: "9px" }}
								>
									<MenuItem onClick={this.renderPlayer} id="player_render" primaryText="Render Player" />
								</IconMenu>
								<div onClick={this.getXml} style={{ float: "right", border: "solid 1px #fff", borderRadius: "3px", padding: "3px 9px", color: "#fff", cursor: "pointer" }}>XML</div>
								<Toggle
									label="Toggle View"
									labelStyle={{ color: "#fff", fontWeight: "normal" }}
									toggled={this.state.verticalView}
									onToggle={this.toggleView}
									style={{ maxWidth: "140px", float: "right", marginRight: "4px" }}
								/>
							</CardHeader>
							<div id="toolbar_container" style={{ width: "100%", height: "67px" }}></div>
						</div>
						<div id="authoringSection" style={contentStyle}>
							<div>
								<div
									class="tinymce-editor"
									contentEditable={true}
									id="title"
									data-text="Title"
									style={{ borderBottom: "1px solid #e7e7e7", margin: "10px 0 5px 0" }}
									onKeyUp={this.getTitle}
								></div>
								<br />
								<div
									class="tinymce-editor"
									contentEditable={true}
									id="stem"
									data-text="Stem"
									style={{ borderBottom: "1px solid #e7e7e7", margin: "5px 0 5px 0" }}
									onKeyUp={this.getStem}
								></div>
								<br />
								<Dialog
									title={
										<div style={{ height: "60px", color: "#000" }}>
											<div style={{ float: "left", paddingTop: "10px", paddingLeft: "13px" }}>Choose Fill in the Blanks type</div>
											<DropDownMenu
												style={{ float: "right", border: "solid 1px #000", borderRadius: "3px", backgroundColor: "#fff" }}
												labelStyle={{ color: "#000" }}
												underlineStyle={{ display: "none" }}
												value={this.state.fillInTheBlanksChoice}
												onChange={this.handleChange}
											>
												<MenuItem value={1} primaryText="Fill in the blanks (with text)" onClick={this.updateDialog.bind(this, 1)} />
												<MenuItem value={2} primaryText="Fill in the blanks (with drop downs)" onClick={this.updateDialog.bind(this, 2)} />
												<MenuItem value={3} primaryText="Fill in the blanks (with drag drop)" onClick={this.updateDialog.bind(this, 3)} />
												<MenuItem value={4} primaryText="Short text" onClick={this.updateDialog.bind(this, 4)} />
												<MenuItem value={5} primaryText="Fill in the blanks (with multiline)" onClick={this.updateDialog.bind(this, 5)} />
											</DropDownMenu>
										</div>}
									actions={actions}
									modal={false}
									titleStyle={{ padding: "6px" }}
									open={this.state.open}
									onRequestClose={this.handleClose}
									autoScrollBodyContent={true}
								>
									<div id="responseDialog">{this.handleChange(this.state.fillInTheBlanksChoice)}</div>
								</Dialog>
								<div style={{ textAlign: "right", backgroundColor: "#4c4c4c" }}>
									<span style={{ position: "relative", bottom: "7px", color: "#fff", fontSize: "17px" }}>Settings</span>
									<IconMenu
										iconButtonElement={<IconButton iconStyle={{ color: "#fff" }}><Settings /></IconButton>}
										onChange={this.handleChangeMultiple}
										value={this.state.valueMultiple}
										multiple={true}
									>
										<MenuItem value="1" primaryText="Case-Insensitive" />
										<MenuItem value="2" primaryText="Ignore special characters" />
										<MenuItem value="3" primaryText="Multi" />
										<MenuItem value="4" primaryText="Answer by keywords" />
									</IconMenu>
								</div>
								<div
									class="tinymce-editor-response"
									id="authorData"
									style={{ height: "300px", border: "solid 1px #E0E0E0", padding: "0 8px", overflow: "auto" }}
									contentEditable={true}>
								</div>
								<div
									class="tinymce-editor"
									contentEditable={true}
									id="remediation"
									data-text="Remediation"
									onKeyUp={this.getRemediation}
									style={{ borderBottom: "1px solid #e7e7e7", margin: "5px 0 5px 0", whiteSpace: "pre-line" }}
								></div>
								<br />
							</div>
						</div>
					</Card>
				</div>
				<div id="preview" style={{ padding: "0 2px 0 2px" }} class={((this.state.verticalView == true) ? "col-lg-12" : "col-lg-6")}>
					<Card zDepth={3} style={{ padding: "5px 3px 5px 3px" }}>
						<CardHeader
							style={{ backgroundColor: "#00bcd4", margin: "0", height: "58px" }}
							textStyle={{ paddingRight: "0", width: "100%" }}
							id="previewHeader"
							title={
								<div>
									<div style={{ fontSize: "18px", color: "#FFF", float: "left", cursor: "pointer" }} onClick={this.fullScreen}>Preview</div>
									<div class="pull-right"><Toggle label="Remediation" labelStyle={{ color: "#FFF", fontWeight: "normal", fontSize: "17px" }} toggled={this.state.remediationToggle} onToggle={this.viewRemediation}></Toggle></div>
								</div>
							}
						/>

						<div id="previewSection" class="px-2">
							<div id="title_show" style={{ whiteSpace: "pre-line", wordWrap: "break-word" }}></div>
							<div id="stem_show" style={{ padding: "10px 0 10px 0", whiteSpace: "pre-line", wordWrap: "break-word", fontSize: "18px" }}></div>
							<center>
								<div class="btn-group clearfix review h" id="sm_controller" data-toggle="buttons-radio">
									<button type="button" class="btn btn-light correct-ans" id="reviewCorrectAns" onClick={() => showdragans('#fillmain', 'c', 1)}>Correct Answer</button>
									<button type="button" class="btn btn-light your-ans active" id="reviewUserAns" onClick={() => showdragans('#fillmain', 'u', 1)}>Your Answer</button>
								</div>
							</center>
							<center>
								<div id="fillmain">
									<div
										is={true}
										id="previewArea"
										class="string"
										matchtype={this.state.matchType}
										multi={this.state.multi}
										ignoretype={this.state.ignoreType}
										manual_grade={this.state.manual_grade}
										totalcorrectans={this.state.totalCorrectAns}
										style={{ padding: "10px 8px", maxHeight: "400px", overflow: "auto" }}
									></div>
									<div style={{ color: "#b94a48", marginTop: "5px" }} class="smnotes">
										{((this.state.matchType == "0") ? "*Exact matching is required." : "*Matching is case-insensitive.")}
									</div>
									<div class="footerstr">
										<div class="arrow-up"></div>
										<center class="dragArea"></center>
									</div>
								</div>
							</center>
							<div id="remediation_show" style={{ whiteSpace: "pre-line", wordWrap: "break-word" }}></div>
						</div>
					</Card>
					<Snackbar
						open={this.state.snackback}
						message={this.message}
						autoHideDuration={4000}
						onRequestClose={() => this.setState({ snackback: !this.state.snackback })}
					/>
					<Dialog
						title="XML"
						titleStyle={{ color: "#000" }}
						autoScrollBodyContent={true}
						bodyStyle={{ minHeight: "350px" }}
						actions={actionsxml}
						modal={false}
						open={this.state.xmlDialog}
						onRequestClose={() => this.setState({ xmlDialog: false })}
					>
						<div><textarea id="xml_Dialog" style={{ width: "100%", margin: "3px 0", minHeight: "300px", border: "0px", resize: "none", outline: "none", boxShadow: "none" }} onChange={(e) => this.setState({ xml: e.target.value })}>{this.state.xml}</textarea></div>
					</Dialog>
				</div>
				<Dialog
					title="Confirmation"
					actions={actionSave}
					modal={false}
					contentStyle={{ width: "450px" }}
					style={{ height: "100px" }}
					open={this.state.saveDialog}
					onRequestClose={() => this.setState({ saveDialog: false })}
				>
					<center id="saveProcess" style={{ "display": "none" }}>
						<CircularProgress size={60} thickness={2} />
						<h3>Saving Data...</h3>
					</center>
					<div id="savingContent">
						Do you want to save this content ?
		        </div>
				</Dialog>
				<input type="hidden" id="playerState" />
				{($('#playerState').val() == "true") ? <Player visible={this.state.playerPopup} value={playerArr} /> : ''}
			</div>

		);
	}
}
