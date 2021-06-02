module.exports = `/**
 * jQuery.contextMenu - Show a custom context when right clicking something
 * Jonas Arnklint, http://github.com/arnklint/jquery-contextMenu
 * Released into the public domain
 * Date: Jan 14, 2011
 * @author Jonas Arnklint
 * @version 1.7
 *
*/
// Making a local '$' alias of jQuery to support jQuery.noConflict
(function(jQuery) {
  jQuery.fn.contextMenu = function ( name, actions, options ) {
    var me = this,
    win = jQuery(window),
    menu = jQuery('<ul id="'+name+'" class="context-menu rem_matchLine"></ul>').hide().appendTo('body'),
    activeElement = null, // last clicked element that responds with contextMenu
    hideMenu = function() {
      jQuery('.context-menu:visible').each(function() {
        jQuery(this).trigger("closed");
        jQuery(this).hide();
        jQuery('body').unbind('click', hideMenu);
      });
    },
    default_options = {
      disable_native_context_menu: false, // disables the native contextmenu everywhere you click
      leftClick: false // show menu on left mouse click instead of right
    },
    options = jQuery.extend(default_options, options);

    jQuery(document).bind('contextmenu', function(e) {
      if (options.disable_native_context_menu) {
        e.preventDefault();
      }
      hideMenu();
    });

    jQuery.each(actions, function(me, itemOptions) {
      if (itemOptions.link) {
        var link = itemOptions.link;
      } else {
        var link = '<a href="javascript:;">'+me+'</a>';
      }

      var menuItem = jQuery('<li>' + link + '</li>');

      if (itemOptions.klass) {
        menuItem.attr("class", itemOptions.klass);
      }
      
      if (itemOptions.icon) {
        menuItem.children('a').prepend("<span class='"+itemOptions.icon+"' style='margin-right: 5px;vertical-align: middle;'></span>");
      }

      menuItem.appendTo(menu).bind('click', function(e) {
        itemOptions.click(activeElement);
        e.preventDefault();
      });
    });

    // fix for ie mouse button bug
    var mouseEvent = 'contextmenu click';
    if (jQuery.browser.msie && options.leftClick) {
      mouseEvent = 'click';
    } else if (jQuery.browser.msie && !options.leftClick) {
      mouseEvent = 'contextmenu';
    }

    var mouseEventFunc = function(e){
      // Hide any existing context menus
      hideMenu();

      var correctButton = ( (options.leftClick && e.button == 0) || (options.leftClick == false && e.button == 2) );
      if (jQuery.browser.msie) correctButton = true;

      if( correctButton ){

        activeElement = jQuery(this); // set clicked element

        if (options.showMenu) {
          options.showMenu.call(menu, activeElement);
        }

        // Bind to the closed event if there is a hideMenu handler specified
        if (options.hideMenu) {
          menu.bind("closed", function() {
            options.hideMenu.call(menu, activeElement);
          });
        }

        menu.css({
          visibility: 'hidden',
          position: 'absolute',
          zIndex: 1100
        });

        // include margin so it can be used to offset from page border.
        var mWidth = menu.outerWidth(true),
          mHeight = menu.outerHeight(true),
          xPos = ((e.pageX - win.scrollLeft()) + mWidth < win.width()) ? e.pageX : e.pageX - mWidth,
          yPos = ((e.pageY - win.scrollTop()) + mHeight < win.height()) ? e.pageY : e.pageY - mHeight;

        menu.show(0, function() {
          jQuery('body').bind('click', hideMenu);
        }).css({
          visibility: 'visible',
          top: yPos + 'px',
          left: xPos + 'px',
          zIndex: 1000
        }).attr({"tp":e.pageY,"lt":e.pageX});

        return false;
      }
    }

    if (options.delegateEventTo) {
      return me.on(mouseEvent, options.delegateEventTo, mouseEventFunc)
    } else {
      return me.bind(mouseEvent, mouseEventFunc);
    }
  }
  jQuery(':not(.context-menu)').click(function() {
    if(jQuery(".context-menu").is(":visible")){
        jQuery('.context-menu').hide();
    }
});
})(jQuery);

`;
