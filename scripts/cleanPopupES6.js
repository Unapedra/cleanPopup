class CleanPopup{
	constructor(title, message, options){
		this.title = title;
		this.message = message;
		this.options = Object.assign({}, this.defaults, options);
		
		this._container;
		this._content;
		
		this._initializePopup();
	}
	
	get defaults(){
		return {
			permanent: false,
			autofadeTime: 0,
			target: '',
			url: false,
			buttons: false,
			callbacks: false
		};
	}
	
	get container(){
		return this._container;
	}
	
	set container(c){
		this._container = c;
	}
	
	get content(){
		return this._content;
	}
	
	set content(c){
		this._content = c;
	}
	
	_initializePopup(){
		this._initializeContainer();
		this._initializeContent();
		this._insertContentIntoContainer();
	}
	
	_insertContentIntoContainer(){
		this.container.append(this.content);
	}
	
	_initializeContainer(){
		this.container = $('<div class="lock_control" data-target="' + this.options.target + '"></div>');
	}
	
	_initializeContent(){
		this.content = $('<div class="notification"></div>');
		this._constructContent();
	}
	
	_constructContent(){
		this._constructCloseControl();
		this._constructTitle();
		this._constructMessage();
		this._constructLoadingStatus()
		this._constructButtonsList();
	}

	_constructCloseControl(){
		if(!this.options.permanent){
			let ref = this;
			
			let closeItem = $('<span class="x_close_dialog"></span>').on('click', function(){
				ref.removePopup();
			});
			
			this.content.append(closeItem);
		}
	}

	_constructTitle(){
		if(this.title !== undefined && this.title.trim() !== '') this.content.append('<h3 class="notification_title">' + this.title + '</h3>');
	}
	
	_constructMessage(){
		if(this.message !== undefined && this.message.trim() !== ''){
			// If it has not been added yet, we add the main message container
			if(this.content.find(".notification_message").length == 0) this.content.append('<div class="notification_message"></div>')
			// We add our message
			this.content.find(".notification_message").html(this.message)
			// And once the default message is loaded, we load external content - if any
			this._loadExternalContent();
		}
	}
	
	_loadExternalContent(){
		// External URL options, so we can load external pages (or scripts)
		if (this.options.url && this.options.url.src !== undefined && this.options.url.src.trim() != false){
			if(this.content.find(".notification_message").length == 0) this.content.append('<div class="notification_message"></div>');
			
			this.content.find(".notification_message").load(this.options.url.src.trim(), (this.options.url.params === undefined ? false : this.options.url.params), function(){
				// We center it again because the size of the element may change after loading the content
				this.content.center()
			})
		}
	}
	
	_constructButtonsList(){
		// We check the buttons set and add them 
		if (this.options.buttons) {
			let butUl = $('<ul class="notification_buttons"></ul>')
			
			for(let but of this.options.buttons){
				butUl.append(this._constructButton(but));
			}
			
			this.content.append(butUl)
		}
	}
	
	_constructLoadingStatus(){
		// Extra options: Loading & Loaded
		if (this.options.loading) this.content.append($('<div class="waiting loading"><div class="bullet"></div><div class="bullet"></div><div class="bullet"></div><div class="bullet"></div></div>'));
		else if (this.options.loaded) this.content.append($('<div class="waiting loaded"></div>'));
	}
	
	_constructButton(oButton){
		let b = $('<li class="button '+(oButton.extraClass ? oButton.extraClass : '')+'">' + (oButton.txt ? oButton.txt : '') + '</li>');
		let ref = this;
		
		b.on('click', function() {
			// If we click on button, we call the callback if it's a function
			if (oButton.pressed && typeof oButton.pressed === 'function') oButton.pressed();
			// By default, we close the popup whenever we click a button if not specified otherwise
			if (oButton.close !== false) ref.removePopup();
		});
	
		return b;
	}
	
	removePopup(){
		// We remove the content from the body
		this.container.remove();
		// If defined, we call the function when we close the popup
		if(this.options.callbacks && typeof this.options.callbacks.closed === 'function') this.options.callbacks.closed()
	}
	
	show(){
		// We add it to the body...
		$('body').append(this.container);
		
		//... and we center it
		this.content.center()
		
		// If defined, we call the function when we open the popup
		if(this.options.callbacks && typeof this.options.callbacks.opened === 'function') this.options.callbacks.opened()
		
		// And if an autofadeTime is set, we dismiss the Popup automatically
		if(this.options.autofadeTime){
			let ref = this;
			
			setTimeout(function() {
				ref.removePopup();
			}, parseInt(this.options.autofadeTime));
		}
	}
}

// JQuery plugin to be able to center the objects on DOM
jQuery.fn.center = function() {
	this.css("position", "absolute");
	this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
	
	return this;
}