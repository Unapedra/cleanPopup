'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CleanPopup = function () {
	function CleanPopup(title, message, options) {
		_classCallCheck(this, CleanPopup);

		this.title = title;
		this.message = message;
		this.options = Object.assign({}, this.defaults, options);

		this._container;
		this._content;

		this._initializePopup();
	}

	_createClass(CleanPopup, [{
		key: '_initializePopup',
		value: function _initializePopup() {
			this._initializeContainer();
			this._initializeContent();
			this._insertContentIntoContainer();
		}
	}, {
		key: '_insertContentIntoContainer',
		value: function _insertContentIntoContainer() {
			this.container.append(this.content);
		}
	}, {
		key: '_initializeContainer',
		value: function _initializeContainer() {
			this.container = $('<div class="lock_control" data-target="' + this.options.target + '"></div>');
		}
	}, {
		key: '_initializeContent',
		value: function _initializeContent() {
			this.content = $('<div class="notification"></div>');
			this._constructContent();
		}
	}, {
		key: '_constructContent',
		value: function _constructContent() {
			this._constructCloseControl();
			this._constructTitle();
			this._constructMessage();
			this._constructLoadingStatus();
			this._constructButtonsList();
		}
	}, {
		key: '_constructCloseControl',
		value: function _constructCloseControl() {
			var _this = this;

			if (!this.options.permanent) {
				(function () {
					var ref = _this;

					var closeItem = $('<span class="x_close_dialog"></span>').on('click', function () {
						ref.removePopup();
					});

					_this.content.append(closeItem);
				})();
			}
		}
	}, {
		key: '_constructTitle',
		value: function _constructTitle() {
			if (this.title !== undefined && this.title.trim() !== '') this.content.append('<h3 class="notification_title">' + this.title + '</h3>');
		}
	}, {
		key: '_constructMessage',
		value: function _constructMessage() {
			if (this.message !== undefined && this.message.trim() !== '') {
				// If it has not been added yet, we add the main message container
				if (this.content.find(".notification_message").length == 0) this.content.append('<div class="notification_message"></div>');
				// We add our message
				this.content.find(".notification_message").html(this.message);
				// And once the default message is loaded, we load external content - if any
				this._loadExternalContent();
			}
		}
	}, {
		key: '_loadExternalContent',
		value: function _loadExternalContent() {
			// External URL options, so we can load external pages (or scripts)
			if (this.options.url && this.options.url.src !== undefined && this.options.url.src.trim() != false) {
				if (this.content.find(".notification_message").length == 0) this.content.append('<div class="notification_message"></div>');

				this.content.find(".notification_message").load(this.options.url.src.trim(), this.options.url.params === undefined ? false : this.options.url.params, function () {
					// We center it again because the size of the element may change after loading the content
					this.content.center();
				});
			}
		}
	}, {
		key: '_constructButtonsList',
		value: function _constructButtonsList() {
			// We check the buttons set and add them 
			if (this.options.buttons) {
				var butUl = $('<ul class="notification_buttons"></ul>');

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.options.buttons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var but = _step.value;

						butUl.append(this._constructButton(but));
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				this.content.append(butUl);
			}
		}
	}, {
		key: '_constructLoadingStatus',
		value: function _constructLoadingStatus() {
			// Extra options: Loading & Loaded
			if (this.options.loading) this.content.append($('<div class="waiting loading"><div class="bullet"></div><div class="bullet"></div><div class="bullet"></div><div class="bullet"></div></div>'));else if (this.options.loaded) this.content.append($('<div class="waiting loaded"></div>'));
		}
	}, {
		key: '_constructButton',
		value: function _constructButton(oButton) {
			var b = $('<li class="button ' + (oButton.extraClass ? oButton.extraClass : '') + '">' + (oButton.txt ? oButton.txt : '') + '</li>');
			var ref = this;

			b.on('click', function () {
				// If we click on button, we call the callback if it's a function
				if (oButton.pressed && typeof oButton.pressed === 'function') oButton.pressed();
				// By default, we close the popup whenever we click a button if not specified otherwise
				if (oButton.close !== false) ref.removePopup();
			});

			return b;
		}
	}, {
		key: 'removePopup',
		value: function removePopup() {
			// We remove the content from the body
			this.container.remove();
			// If defined, we call the function when we close the popup
			if (this.options.callbacks && typeof this.options.callbacks.closed === 'function') this.options.callbacks.closed();
		}
	}, {
		key: 'show',
		value: function show() {
			var _this2 = this;

			// We add it to the body...
			$('body').append(this.container);

			//... and we center it
			this.content.center();

			// If defined, we call the function when we open the popup
			if (this.options.callbacks && typeof this.options.callbacks.opened === 'function') this.options.callbacks.opened();

			// And if an autofadeTime is set, we dismiss the Popup automatically
			if (this.options.autofadeTime) {
				(function () {
					var ref = _this2;

					setTimeout(function () {
						ref.removePopup();
					}, parseInt(_this2.options.autofadeTime));
				})();
			}
		}
	}, {
		key: 'defaults',
		get: function get() {
			return {
				permanent: false,
				autofadeTime: 0,
				target: '',
				url: false,
				buttons: false,
				callbacks: false
			};
		}
	}, {
		key: 'container',
		get: function get() {
			return this._container;
		},
		set: function set(c) {
			this._container = c;
		}
	}, {
		key: 'content',
		get: function get() {
			return this._content;
		},
		set: function set(c) {
			this._content = c;
		}
	}]);

	return CleanPopup;
}();

// JQuery plugin to be able to center the objects on DOM


jQuery.fn.center = function () {
	this.css("position", "absolute");
	this.css("top", Math.max(0, ($(window).height() - $(this).outerHeight()) / 2 + $(window).scrollTop()) + "px");
	this.css("left", Math.max(0, ($(window).width() - $(this).outerWidth()) / 2 + $(window).scrollLeft()) + "px");

	return this;
};