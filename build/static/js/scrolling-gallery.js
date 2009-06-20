/*
*	Scrolling Gallery
*	Creates a scrolling image gallery that can load its contents dynamically
*	
*	Requires jQuery library (http://www.jquery.com)
*	
*	Taylan Pince (taylanpince at gmail dot com) - June 20, 2009
*/

$.namespace("core.ScrollingGallery");

core.ScrollingGallery = $.Class.extend({

    selector : "",
    total : 0,
    path : "",
    position: 1,
    
    image_template : '<li><a href="%(path)%(num).jpg" target="_blank" title="%(title)"><img src="%(path)%(num).th.jpg" alt="" /></a></li>',

    render_template : function(template, values) {
        for (val in values) {
            var re = new RegExp("%\\(" + val + "\\)", "g");
        
            template = template.replace(re, values[val]);
        }
    
        return template;
    },
    
    reset : function() {
        this.position = 4;
        
        $(this.selector).find("ul").animate({
            "left": "0px"
        }, {
            "duration": 1000
        });
        
        setTimeout(this.show_next.bind(this), 6000);
    },
    
    show_next : function() {
        $(this.selector).find("ul").animate({
            "left": ((this.position - 3) * -180) + "px"
        }, {
            "duration": 1000,
            "complete": this.load_next.bind(this)
        });
        
        this.position++;
    },
    
    load_next : function() {
        if ($(this.selector).find("li").size() < this.total) {
            $(this.render_template(this.image_template, {
                "path": this.path,
                "num": this.position + 1,
                "title": (this.position >= 14) ? "Photo Credit: Joel Pollack, BizBash" : ""
            })).appendTo($(this.selector).find("ul")).find("a").lightBox();
            
            setTimeout(this.show_next.bind(this), 5000);
        } else if (this.position == this.total) {
            setTimeout(this.reset.bind(this), 5000);
        }
    },

    init : function(selector, total, path) {
        this.selector = selector;
        this.total = total;
        this.path = path;
        this.position = ($(this.selector).find("li").size() > 0) ? $(this.selector).find("li").size() : 1;
        
        $(this.selector).find("ul").css("width", (180 * this.total) + "px").find("a").each(function() {
            $(this).lightBox();
        });
        
        this.load_next();
    }

});
