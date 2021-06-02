/*
Author: Saquib, Updesh
Date: 10/03/2016
*/
var UCLIB = {};
var sinfo = true;
var ajax_eId = "#fillmain";
jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

function readyFill(fillid)
{
	var drag_id = "";
	var drop_target = "";
	var distance = 80, step = 5;
	$(fillid +' select').on('change',function(){
		$(fillid).trigger('click');
	});
	dragOption = {
		appendTo: "body",
		zIndex:100,
		revert: function(is_valid_drop){
            if(!is_valid_drop){
            	/*
            	if(sinfo)
            	{
            		sinfo = false;
            		setTimeout(function(){
            			sinfo = true;
            		}, 60*1000)
            		if(typeof(showmsg) == 'function') showmsg('While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.', 3);
            		if(typeof(bindDialog) == 'function') bindDialog({click:this, wd:450, ht:225, data:'<div title="How to drop?"><img src="'+$(this).attr('path')+'how-to-drop-final_000BeI.gif" /></div>'});
            	}*/
            	/*if(!!$("#error")[0].play)
            	{
            		try{$("#error")[0].currentTime = 0;}catch(err){}
            		$("#error")[0].play();
            	}*/
				return true;
            }
        },
        helper: function(e){
			var target = this;
			if($(e.target).hasClass("dropable"))
			{
				target = $(fillid).find('#'+$(e.target).attr('droped'));
			}
			img = {"width":$(target).outerWidth(),"height":'auto'};
			$(this).draggable("option", "cursorAt", {
				left: Math.floor(img.width / 2),
				top: -10
			});
			var cl = $(this).clone().css({width:img.width+"px",height:img.height+"px","position":"absolute","text-align":"center"});
			if($.browser.msie)
			{
				var c = "transparent";
				if(cl.text() != "")
				{
					c = cl.css('background-color');
				}
				cl = $('<div id="'+cl.attr('id')+'" class="drag-resize"></div>').text(cl.text()).css({width:img.width+"px",height:img.height+"px","position":"absolute","background-color":c});
			}
			return cl;
		},
	    start: function(e){
			$(this).data("drag_enable",true);
		},
		stop: function(e)
		{
			if($(this).hasClass('dropable'))
			{
				/*if(!!$("#delete")[0].play)
				{
					try{$("#delete")[0].currentTime = 0;}catch(err){}
					$("#delete")[0].play();
				}*/
				if($(this).data("drag_enable")) $(fillid).find('#'+$(this).attr('droped')).draggable('enable');
				$(this).css({"background-color":$(this).attr('bgcolor')}).text($(this).attr('caption')).attr("droped","").attr("userans","").draggable('destroy');
			}
			drag_id = this.id;
			if($('#' + drag_id).hasClass('dropable'))
			{	
				var rel_id = $('#' + drop_target).attr('droped');
				if($('#' + rel_id).attr('drag-single') == 1)
				{
					$('#' + rel_id).draggable({ disabled: true });
				
				}

			}
			else
			{
				if($('#' + drag_id).attr('drag-single') == 1 && drop_target != "")
				{
					$('#' + drag_id).draggable({ disabled: true });
				}
			}
			setTimeout(function(){checkAns("#previewArea")},100);
			drop_target="";
		},
		scroll: 'true',
		refreshPositions: true,
		cursor: "default"
	};
	$(fillid).find('.dragable').draggable();
	$(fillid).find('.dropable').each(function()
	{
		var pre_id = $(this).attr('droped');
		if($('#' + pre_id).attr('drag-single') == 1)
		{
			$('#'+ pre_id).draggable({ disabled: true });
		}
	});
	$(fillid).find('.dragable').draggable(dragOption);
	$(fillid).find('[droped*=ID]').draggable($.extend(dragOption,{revert:false})).each(function(){
		if($(fillid).find('#'+$(this).attr('droped')).attr('multi_drag') == "0")
		{
			$(fillid).find('#'+$(this).attr('droped')).draggable('disable');
		}
	});
	$(fillid).find('.dropable').droppable({
		tolerance: "pointer",
		drop: function( event, ui ) {
			/*if(!!$("#success")[0].play)
			{
				try{$("#success")[0].currentTime = 0;}catch(err){}
				$("#success")[0].play();
			}*/
			var drop_id = $(ui.draggable).attr('droped')?$(ui.draggable).attr('droped'):$(ui.draggable).attr('id');
			if($.trim($(this).attr("droped")) != "")
			{
				$(fillid).find('#'+$(this).attr("droped")).draggable('enable');
			}
			if($.browser.msie && $(fillid).find('#'+drop_id).text() == "")
			{
				$(ui.draggable).css("background-color","transparent");
			}
			$(this).html($(ui.draggable).html()).attr('userans',drop_id).css({"background-color":$(ui.draggable).css("background-color")})
			.draggable($.extend(dragOption,{revert:false}))
			.attr({'droped':drop_id,'path':$(ui.draggable).attr('path')});
			drop_target = event.target.id;
			checkAns("#previewArea");
		}
	}).mouseenter(function(){$(this).addClass("drop-hover")}).mouseleave(function(){$(this).removeClass("drop-hover")});
}

function showdragans(fillid, ansType, review)
{
	if(typeof review === "undefined") review = 0;
	$(fillid).find('select,input,textarea,.dropable').each(function(){
		showchilddragans(fillid, this, ansType, review);
	});
}
 
function showchilddragans(fillid, pElem, ansType, review)
{
	var is_correct = -2;
	if($(pElem).hasClass('dropable'))
	{
		$(pElem).html($(pElem).attr('caption')).css({"background-color":$(pElem).attr("bgcolor")});
		if(ansType == 'c')
		{
			var ansKey = $(pElem).attr('anskey').split(',');
			$.each(ansKey, function(index, value){
				if(value.trim() != "")
				{
					$anskey = $(fillid).find('#'+value);
					if($anskey.length > 0) $(pElem).text($anskey.attr('caption')).css({"background-color":$anskey.attr("bgcolor")});
					return false;
				}
			});
		}
		else if(ansType == 'u')
		{
			is_correct = -1;
			if($(pElem).attr('userans').trim() != "")
			{
				$userans = $(fillid).find('#'+$(pElem).attr('userans'));
				if($userans.length > 0) $(pElem).text($userans.attr('caption')).css({"background-color":$userans.attr("bgcolor")});
			}
			var cans = $(pElem).attr('anskey');
			var uans = $(pElem).attr('userans');
			if(uans != "" && cans.indexOf(uans) > -1)
			{
				is_correct = 1;
			}
		}
	}
	if($(pElem).parent().hasClass('fillelement'))
	{
		if(pElem.nodeName == "SELECT")
		{
			is_correct = -1;
			totalcorrect = $(pElem).find("[correctans='1']").length;
			a = 0;
			//var myLength = $(pElem).find("option").length);
			//myLength = myLength -1;
			$(pElem).find("option").each(function(){
				$(this).removeAttr("selected");
				if(ansType=='c')
				{
					if($(this).attr("correctans")>0) $(this).attr("selected","selected");
				}
				else if(ansType=='u')
				{
					if($(this).attr("userans")>0) $(this).attr("selected","selected");
					if($(this).is(":selected") && $(this).attr('correctans')==1)
					{
						a++;
					}
				}
			});
			if(totalcorrect==a) is_correct = 1;
			if($(pElem).find(':selected').length < 1) $(pElem).find("option:first").attr("selected","selected");
		}
		else if(pElem.nodeName == "INPUT" || pElem.nodeName == "TEXTAREA")
		{
			if(typeof(pElem.type) == "undefined")
			{
				this.type = 'text';
			}
			if(ansType=='c')
			{
				$(pElem).val($(pElem).attr("anskey"));
			}
			else if(ansType=='u')
			{
				if($(pElem).attr("userans") == "" && $(pElem).attr("defaultAns") !== "")
				{
					$(pElem).val($(pElem).attr("defaultAns"));
				}
				else 
				{
					$(pElem).val($(pElem).attr("userans"));
				}
				is_correct = fillTestText(fillid, pElem);
			}
		}
	}
	if(ansType == 'u' && review==1) 
	{
		if(is_correct != -2 && parseInt($(fillid).attr("manual_grade")) != 1)
		{
			var correct_incorrect_mark = markUserAnswer(is_correct);
			if($(pElem).hasClass('dropable')) {
				$(pElem).append(correct_incorrect_mark);
				$(pElem).attr('as', is_correct);
			} else {
				$(pElem).parent().append(correct_incorrect_mark);
				$(pElem).parent().attr('as', is_correct);
			}
		}
	}
	else
	{
		$(fillid).find('.correct_incorrect_icon_fill').remove();
	}
}

function fillTestText(fillid, pElem)
{
	var is_correct = -1, anskey = $(pElem).attr("anskey").trim(), userans = $(pElem).val().trim(),
	haskey = $(pElem).attr('haskeywords'),hasnkey = $(pElem).attr('hasnotkeywords'),codetype = $(pElem).attr("codetype") ;
	if(codetype == 1)
	{
		var regex_code = [/\s+/g,/\;$/,/"/g];
		var regex_replace = ["","","'"];
		for(var l=0; l<regex_code.length; l++) 
		{
			userans = userans.replace(regex_code[l],regex_replace[l]);
			anskey = anskey.replace(regex_code[l],regex_replace[l]);
		}
	}
	if($(fillid).attr('matchtype') == 1)
	{
		anskey = anskey.toLowerCase();
		userans = userans.toLowerCase();
	}
	if($(fillid).attr('ignoretype') == 1)
	{
		if($(fillid).attr('multi') != 0)
		{
			var ans = [];
			$(anskey.split(',')).each(function(index, val){
				ans.push(val.replace(/[^a-zA-Z0-9]/gi, ""));
			});
			anskey = ans.join(',');
		}
		else
		{
			anskey = anskey.replace(/[^a-zA-Z0-9]/gi, "");
		}
		userans = userans.replace(/[^a-zA-Z0-9]/gi, "");
	}
	if($(pElem).attr('keywordtype') == 1 && haskey.length > 0 && hasnkey.length > 0)
	{
		var valid = 0 ,valid_is = 0;
		$(haskey.split(',')).each(function(index, val){
			if(userans.indexOf(val) != -1) valid++;
		});
		$(hasnkey.split(',')).each(function(index, val){
			if(userans.indexOf(val) != -1) valid_is++;
		});
		if(haskey.split(',').length == valid && valid_is == 0) userans = anskey;
	}
	if($(fillid).attr('multi') != 0)
	{	
		if(anskey.substr(0, 1) != ",")
		{
			anskey = ","+anskey;
		}
		if(anskey.substr(-1, 1) != ",")
		{
			anskey += ",";
		}
		userans = ","+userans+",";
		if(userans != "" && anskey.indexOf(userans) != -1)
		{
			is_correct = 1;
		}
	}
	else
	{
		if(userans == anskey) is_correct = 1;
	}
	return is_correct;
}

function markUserAnswer(is_correct)
{
	if(is_correct == 1)
	{
		var droped_value_indicator_html = '<span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold" style="color:green;">';
	}
	else
	{
		var droped_value_indicator_html = '<span class="icomoon-new-24px-cancel-circle-1 font-weight-bold" style="color:red;">';
	}
	
	if($(ajax_eId).find('.prettyprint').length > 0)
	{
	    var correct_incorrect_mark = '<span class="correct_incorrect_icon_fill" style="position:absolute;width:18px;height:18px;right:-1px;bottom:22px;background:none;border-radius:12px;font-size: 18px;"> '  + droped_value_indicator_html + '</span></span>'
	}
	else
	{
		var correct_incorrect_mark = '<span class="correct_incorrect_icon_fill" style="position:absolute;width:19px;height:19px;right:-9px;top:-9px;background:white;border-radius:15px 12px 12px;font-size: 21px;"> '  + droped_value_indicator_html + '</span></span>'
	}
	return correct_incorrect_mark;
}

function checkAns( fillid ) {
	userAnsXML = "<smans type='9'>\n";
	result = true;
	temp = 0;
	$(fillid).find('select,input,textarea,.dropable').each(function(){
		userAnsXML = checkChildAnswer(fillid, this, userAnsXML);
	});
	userAnsXML += "</smans>";
	$("#special_module_user_xml").val(userAnsXML);
	if(parseInt($(fillid).attr('manual_grade')) != 1)
	{
		if(result)
		{
			$("#answer").prop("checked", true);
			return "Correct";
			if(typeof(is_sm) != "undefined") showmsg("Correct", 3);
		}
		else
		{
			$("#answer").prop("checked", false);
			return "Incorrect";
			if(typeof(is_sm) != "undefined") showmsg("Incorrect", 3);
			
		}
	}
}

function checkChildAnswer(fillid, pElem, userAnsXML)
{
	if($(pElem).hasClass('dropable'))
	{
		var ansKey = $(pElem).attr('anskey').split(',');
		if($.inArray($(pElem).attr('userans'),ansKey) == -1)
		{
			result = false;
		}
		else temp++;
		if(typeof calculatePoint != "undefined")
		{
			calculatePoint($(fillid).attr('totalcorrectans'), temp);
		}
		userAnsXML += "<div id='"+$(pElem).attr("id")+"' userAns='"+$(pElem).attr('userans')+"'></div>\n";
	}
	else if($(pElem).parent().hasClass('fillelement'))
	{
		if(pElem.nodeName == "SELECT")
		{
			uAnsSel = "";
			a = 0;
			totalcorrect = $(pElem).find("[correctans='1']").length;
			$(pElem).find("option").each(function(index,value){
				if($(this).is(":selected"))
				{
					a++;
					if($(this).attr("correctans") != 1)
					{
						result = false;
					}
					else
					{
						temp++;
					}
					uAnsSel = uAnsSel+(index)+",";
				}
			});
			if(a != totalcorrect) result = false;
			if(typeof calculatePoint != "undefined")
			{
				calculatePoint($(fillid).attr('totalcorrectans'), temp);
			}
			userAnsXML += "<div id='"+$(pElem).parent().attr("id")+"' userAns='"+uAnsSel+"'></div>\n";
		}
		else if(pElem.nodeName == "INPUT" || pElem.nodeName == "TEXTAREA")
		{
			var anskey = $(pElem).attr("anskey").trim(), userans = $(pElem).val().trim(), codetype = $(pElem).attr("codetype") ;
			if(codetype == 1)
			{
				var regex_code = [/\s+/g,/\;$/,/"/g];
				var regex_replace = ["","","'"];
				for(var l=0; l<regex_code.length; l++) 
				{
					userans = userans.replace(regex_code[l],regex_replace[l]);
					anskey = anskey.replace(regex_code[l],regex_replace[l]);
				}
			}
			if($(fillid).attr('matchtype') == 1)
			{
				anskey = anskey.toLowerCase();
				userans = userans.toLowerCase();
			}
			if($(fillid).attr('ignoretype') == 1)
			{
				if($(fillid).attr('multi') != 0)
				{
					var ans = [];
					$(anskey.split(',')).each(function(index, val){
						ans.push(val.replace(/[^a-zA-Z0-9]/gi, ""));
					});
					anskey = ans.join(',');
				}
				else
				{
					anskey = anskey.replace(/[^a-zA-Z0-9]/gi, "");
				}
				userans = userans.replace(/[^a-zA-Z0-9]/gi, "");
			}
			
			if($(fillid).attr('multi') != 0)
			{
				if(anskey.substr(0, 1) != ",")
				{
					anskey = ","+anskey;
				}
				if(anskey.substr(-1, 1) != ",")
				{
					anskey += ",";
				}
				userans = ","+userans+",";
				if(userans == "" || anskey.indexOf(userans) == -1)
				{
					result = false;
				}
				else temp++;
			}
			else
			{
				var haskey = $(pElem).attr('haskeywords'), 
				hasnkey	   = $(pElem).attr('hasnotkeywords');
				if($(pElem).attr('keywordtype') == 1 && haskey.length > 0 && hasnkey.length > 0)
				{
					var valid = 0 ,valid_is = 0;
					$(haskey.split(',')).each(function(index, val){
						if(userans.indexOf(val) != -1) valid++;
					});
					$(hasnkey.split(',')).each(function(index, val){
						if(userans.indexOf(val) != -1) valid_is++;
					});
					if(haskey.split(',').length != valid || valid_is != 0)
					{
						result = false;
					}
					else temp++;
				}
				else
				{
					if(anskey != userans)
					{
						result = false;
					}
					else temp++;
				}
			}
			if(typeof calculatePoint != "undefined")
			{
				calculatePoint($(fillid).attr('totalcorrectans'), temp);
			}
			userAnsXML += "<div id='"+$(pElem).parent().attr("id")+"' userAns='"+$(pElem).val()+"'></div>\n";
		}
	}
	return userAnsXML;
}


/* ajax based code */

var labBinded = true;
function modeOn(modeType) {
	console.log('jcopdjpvjdopcvjpojfpejcpojcopj');
	if (typeof modeType == "undefined") {
		//modeType = 1;
	}
	$('.test, .review').addClass('h');
	if (modeType) {
		$('.review').removeClass('h');
		unBindLab();
		showdragans(ajax_eId, 'u',1);
		$('#sm_controller button').each(function(){
			if($(this).hasClass('your-ans btn-primary')) {showdragans(ajax_eId, 'u',1);}
			else if($(this).hasClass('correct-ans btn-primary')) {showdragans(ajax_eId, 'c',1);}
		});
	} else {
		$('.test').removeClass('h');
		bindLab();
		//showdragans(ajax_eId, 'u');
	}
}

function bindLab() {
   labBinded = true;
   $(ajax_eId).find('select,input,textarea').removeAttr('disabled');
   readyFill(ajax_eId);
}

function unBindLab() {
	labBinded = false;
	$(ajax_eId).find('input,select,textarea').each(function() {
		if (this.nodeName == "INPUT" || this.nodeName == "TEXTAREA") { 
			$(this).attr('userans', $(this).val()); 
		}
		else if (this.nodeName == "SELECT") {
			$(this).find("option").each(function(index,value){
				$(this).is(":selected") ? $(this).attr('userans', 1) : $(this).attr('userans', '');
			});
		}
	});
	$(ajax_eId).find('select,input,textarea').attr('disabled','disabled');
	$(ajax_eId).find('.dragable .dropable').off('click dragenter mouseenter mouseleave touchstart keyup');
	$(ajax_eId).find('.dragable').draggable("destroy");
	$(ajax_eId).find('.dropable').each(function(){
		if($(this).hasClass('ui-draggable')) $(this).draggable("destroy");
	});

	$('#sm_controller button').click(function() {
		$('#sm_controller button').removeClass("btn-primary");
		$(this).addClass('btn-primary');
	});
	
}
/*ajax based code*/

var delPreSpaces = {
	loopGaurd : 0,
	withLines : function ( fillid ) {

		if ( delPreSpaces.loopGaurd > 0 ) { 
        	activate(1);
			$(fillid).hide();
		}

	    var ln = $('.linenums li').length,cr = true,li_arr = [];

		if ( ln == 0 && delPreSpaces.loopGaurd <= 4 ) {
			delPreSpaces.loopGaurd ++;
	        setTimeout(function(){delPreSpaces.withLines(fillid)},1000);
	        return false;
	     } else {
	     	this.showFillModule( fillid );
	     }

		$('.linenums li').each(function(i, val){
			if($(this).find('span').html() == "&nbsp;" || $(this).find('span').html() == "") $(this).remove();
			else {li_arr.push($(this));}
		});

		$(li_arr).each(function(i, val){

			if ($(val).children().hasClass('fillelement') || $(val).children().hasClass('dropable')) {
				var ht;
				$(val).children().each(function(){
					($(this).html() == "") ? $(this).remove() : ht = $(this);
				});
			    $(val).prev().append(ht).append($(val).next().html());
			    $(val).next().remove();
			    $(val).remove();
			}
		});	
	},
	withoutLines : function ( fillid ) {

		var fill_pre = $(fillid).find('.fillelement,.dropable');
		var pre_prv  = $.trim(fill_pre.prev().html());
		var pre_nxt  = $.trim(fill_pre.next().html());
		
		if ( delPreSpaces.loopGaurd > 0 ) { 
	        activate(1);
			$(fillid).hide();
		}

	    var ln  = $(fillid).find('.kwd').length;

		if ( ln == 0 && delPreSpaces.loopGaurd <= 4 ) {
			delPreSpaces.loopGaurd ++;
	        setTimeout(function(){ delPreSpaces.withoutLines(fillid) }, 1000);
	        return false;
	    } else {
	     	this.showFillModule( fillid );
	    }

		if ( pre_prv == "" && pre_nxt == "" ) {
			fill_pre.prev().remove();
			fill_pre.next().remove();
		}

		if ( pre_prv != "" && pre_nxt != "" ) {
			fill_pre.prev().html(pre_prv);
			fill_pre.next().html(pre_nxt);
	    }
	},

	showFillModule : function ( fillid ) {
		activate(0);
		if ( typeof quizPlayerStatic != "undefined" ) {
			setTimeout( function() { 
				if ( typeof QuizPlayer != "undefined" )
				   QuizPlayer.setNewHeight( quizPlayerStatic ); 
			},10 );
		}
		$(fillid).show();
	}

};

function pre_fill( fillid ) {
	var fill_pre = $(fillid).find('.fillelement,.dropable');
	if ($(fillid).find('.prettyprint').length > 0) {
		activate(1);
		$(fillid).hide();
		if($(fillid).find('pre').hasClass('lg')) $(fillid).css('width', 930);
	    setTimeout(function(){
	    	if ($(fillid).find('pre').hasClass('linenums')) {
	    		delPreSpaces.withLines(fillid);
	    	} else {
	    		delPreSpaces.withoutLines(fillid);
	    	}
	    	delPreSpaces.showFillModule( fillid );
	    },1000);
	}
}