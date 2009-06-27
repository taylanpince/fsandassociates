/*
*	Gallery
*	Creates a scrolling image gallery with LightBox support
*	
*	Requires jQuery library (http://www.jquery.com)
*	
*	Taylan Pince (taylanpince at gmail dot com) - June 27, 2009
*/

$.namespace("core.Gallery");

core.Gallery = $.Class.extend({

    selector : "",
    
    do_rollback : function() {
        $(this.selector).find("ul").animate({
            "left": "0px"
        }, {
            "duration": "slow",
            "complete": this.begin_scroll.bind(this)
        })
    },
    
    rollback : function() {
        setTimeout(this.do_rollback.bind(this), 2000);
    },
    
    begin_scroll : function() {
        $(this.selector).find("ul").animate({
            "left": "-" + ($(this.selector).find("ul").width() - $("body").width()) + "px"
        }, {
            "duration": $(this.selector).find("ul").width() * 30,
            "easing": "linear",
            "complete": this.rollback.bind(this)
        });
    },

    init : function(selector) {
        this.selector = selector;

        $(this.selector).find("a").lightBox();
        
        this.begin_scroll();
    }

});
