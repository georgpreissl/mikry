function Messenger(elParent,el) {
	self = this;
	if (el == undefined) {
		el = $('<section class="sec_message">\
			<p class="lg"></p>\
			<button class="btn">OK</button>\
		</section>');
	}
    this.el = el;
    elParent.append(this.el);
    this.el.find('button').click(function(e) {
		self.hide();
	});
}

Messenger.prototype.show = function(msg) {
    $('.sec_message').find('p').text(msg);
	$('body').addClass('message_visible');
}

Messenger.prototype.hide = function() {
    $('body').removeClass('message_visible');
}