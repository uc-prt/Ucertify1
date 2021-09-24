/**
 *  Filename    : ValidateItems.js
 *  @Author     : Saquib Ajaz <saquib.ajaz@ucertify.com>
 *  @Version    : 1.0
 *  Last update : 29 May 2020
 *  Last updated by: Dharmendra Mishra
 */
import l from "./language.js";
// importing JUI
import JUI from '../javscript_helper/JUI';
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

export default smVal;
