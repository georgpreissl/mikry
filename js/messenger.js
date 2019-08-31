class Messenger {


	constructor(options){

		self = this;

        this.defaultOptions = {
            label: 'OK',
            elParent: $('body'),
            el: $('<section class="sec_message">\
				<p class="lg"></p>\
				<button class="btn">OK</button>\
			</section>')
        };
        this.options = $.extend(true, this.defaultOptions, options);

	    this.options.elParent.append(this.options.el);
	    this.options.el.find('button').click(function(e) {
			self.hide();
		});
	}

	show(obj) {
	    $('.sec_message').find('p').text(obj.msg);
	    this.options.el.find('button').text(obj.label !== undefined ? obj.label : this.options.label);
	    obj.showButton == false ? this.options.el.find('button').hide() : this.options.el.find('button').show();
	    
		$('body').addClass('message_visible');
	}

	hide() {
	    $('body').removeClass('message_visible');
	}



}