define(['app'], function(app){

	var keysMap = {'Backspace': 8, 'Tab': 9, 'Enter': 13, 'Shift': 16, 'Ctrl': 17, 'Alt': 18, 'Pause': 19, 'Capslock': 20, 'Esc': 27, 'Pageup': 33, 'Pagedown': 34, 'End': 35, 'Home': 36, 'Leftarrow': 37, 'Uparrow': 38, 'Rightarrow': 39, 'Downarrow': 40, 'Insert': 45, 'Delete': 46, '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57, 'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71, 'h': 72, 'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79, 'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84, 'u': 85, 'v': 86, 'w': 87, 'x': 88, 'y': 89, 'z': 90, '0numpad': 96, '1numpad': 97, '2numpad': 98, '3numpad': 99, '4numpad': 100, '5numpad': 101, '6numpad': 102, '7numpad': 103, '8numpad': 104, '9numpad': 105, 'Multiply': 106, 'Plus': 107, 'Minut': 109, 'Dot': 110, 'Slash1': 111, 'F1': 112, 'F2': 113, 'F3': 114, 'F4': 115, 'F5': 116, 'F6': 117, 'F7': 118, 'F8': 119, 'F9': 120, 'F10': 121, 'F11': 122, 'F12': 123, 'equal': 187, 'Coma': 188, 'Slash': 191, 'Backslash': 220 }
	var _registeredKeyCallbacks = {};
	var _pressedKeys = {};

	var UserKeysComponent = new Class({
	
		initialize : function(){
			
			var self = this;

			bindKeyEvents();

			function bindKeyEvents(){
				$(window).on('keydown', self._handleKeyPress.bind(self));
				$(window).on('keyup', self._handleKeyPressEnd.bind(self));
			}


        	app.onHeartbeat('keyControllerComponent', function(elapsed){
	            self._executeCalbacks(elapsed);
        	}, true);

		},

		/**
		* Handle user press key
		*/
		_handleKeyPress : function(event){
			var keycode = event.which;
			this._registerKeyPress(keycode);
		},

		/**
		* Handle user release key
		*/
		_handleKeyPressEnd : function(event){
			var keycode = event.which;
			console.warn('keyup: ' + keycode)
			this._unregisterKeyPress(keycode);
		},

		/**
		* Register pressed key to storage
		*/
		_registerKeyPress : function(keycode){
			_pressedKeys[keycode] = true;
		},

		/**
		* Unregister pressed key - on release
		*/
		_unregisterKeyPress : function(keycode){
			delete _pressedKeys[keycode];
		},

		/**
		* Execute callbacks for each pressed key's
		*/
		_executeCalbacks : function(elapsed){
			var self = this;
			$.each(_pressedKeys, function(keycode, bool){
				self._executeCallback(keycode, elapsed);
			});
		},

		_executeCallback : function(keycode, elapsed){

			var registedArray = _registeredKeyCallbacks[keycode];
			if(typeof registedArray !== 'undefined'){
				$.each(registedArray, function(i, callback){
					console.warn(i);
					if(typeof callback === 'function'){
						callback(elapsed);
					}
				})
			}
		},

		register : function(keyname, callback){
			var registedArray = _registeredKeyCallbacks[keysMap[keyname]];
			if(typeof _registeredKeyCallbacks[keysMap[keyname]] === 'undefined') _registeredKeyCallbacks[keysMap[keyname]] = [];
			_registeredKeyCallbacks[keysMap[keyname]].push(callback);
		},


	});

	app.register('component', 'UserKeysComponent', UserKeysComponent);
});