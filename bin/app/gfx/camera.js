define(['app', 'glMatrix'], function(app, glm){

	/**
	* mat4. Exposing mat4 from glm.
	*
	* @property mat4
	* @type functions
	* @private
	*/
	var mat4 = glm.mat4;


	/**
	* mat3. Exposing mat4 from glm.
	*
	* @property mat3
	* @type functions
	* @private
	*/
    var mat3 = glm.mat3;

	/**
	* userKeysComponent. App component for user key input handling.
	*
	* @property userKeysComponent
	* @type class instance
	* @private
	*/
	var userKeysComponent = new (app.getComponent('UserKeysComponent'));


	/**
	* u. Expose app utils.
	*
	* @property u
	* @type functions
	* @private
	*/
    var u = app.u;

	var lastTime = 0;

	/**
	* Camera Class
	*
	*/
	var Camera = new Class({


		/**
		* Initialize Camera
		*/
		initialize : function(){

			// pitch value
			this.pitch = 0;

			// pitch rate
			this.pitchRate = 0;

			// yaw
			this.yaw = 0;

			// yaw rate
			this.yawRate = 0;

			// xPos
			this.xPos = 0;

			// yPos
			this.yPos = 0;

			// zPos
			this.zPos = 0;

			// speed
			this.speed = 0;

			// jogging angle
			this.joggingAngle = 0;

			// initialize funcionts
			this.bindKeyEvents();
		},

		/**
		* Bind Key Events
		* - bind function to key events, using key component 
		*/
		bindKeyEvents : function(){
			var self = this;
			userKeysComponent.register('Uparrow', this.onCamera.bind(this, 'cameraMoveUp'));
			userKeysComponent.register('Leftarrow', this.onCamera.bind(this, 'cameraMoveLeft'));
			userKeysComponent.register('Rightarrow', this.onCamera.bind(this, 'cameraMoveRight'));
			userKeysComponent.register('Downarrow', this.onCamera.bind(this, 'cameraMoveDown'));
			userKeysComponent.register('q', this.onCamera.bind(this, 'cameraPitchUp'));
			userKeysComponent.register('e', this.onCamera.bind(this, 'cameraPitchDown'));
		},

		/**
		* Functions for specific key events
		*/
		onCamera : function(action, elapsed){
			var actions = {};

			actions.cameraMoveUp = function(elapsed){
				console.info('up');
				this.speed = 0.009;
				this.xPos -= Math.sin(u.degToRad(this.yaw)) * this.speed * elapsed;
				this.zPos -= Math.cos(u.degToRad(this.yaw)) * this.speed * elapsed;
				this.joggingAngle += elapsed * 0.6; 
				this.yPos = Math.sin(u.degToRad(this.joggingAngle)) / 30 + 0.4
			}

			actions.cameraMoveLeft = function(){
				console.info('left');
				this.yawRate = 0.1;
				this.yaw += this.yawRate * elapsed;
			}

			actions.cameraMoveRight = function(){
				console.info('right');
				this.yawRate = -0.1;
				this.yaw += this.yawRate * elapsed;
			}

			actions.cameraMoveDown = function(){
				console.info('down');
                this.speed = -0.009;
				this.xPos -= Math.sin(u.degToRad(this.yaw)) * this.speed * elapsed;
				this.zPos -= Math.cos(u.degToRad(this.yaw)) * this.speed * elapsed;
				this.joggingAngle += elapsed * 0.6; 
				this.yPos = Math.sin(u.degToRad(this.joggingAngle)) / 20 + 0.4
			}

			actions.cameraPitchUp = function(){
				this.pitchRate = 0.06;
				this.pitch += this.pitchRate * elapsed;
			}

			actions.cameraPitchDown = function(){
				this.pitchRate = -0.06;
				this.pitch += this.pitchRate * elapsed;
			}

			// if exists, do callback
			u.doCallback(actions[action], elapsed, this);
		},

		/**
		* Looping function for camera
		* - its integrated with renderer engine loop.
		* - beeing called from engine->drawScene->[camera]->onRenderer()
		*/
		onHeartbeat : function(){
			var timeNow = new Date().getTime();
			if (lastTime != 0) {
				var elapsed = timeNow - lastTime;
				if (this.speed != 0) {
					this.xPos -= Math.sin(u.degToRad(this.yaw)) * this.speed * elapsed;
					this.zPos -= Math.cos(u.degToRad(this.yaw)) * this.speed * elapsed;

					this.joggingAngle += elapsed * 0.6; 
					this.yPos = Math.sin(u.degToRad(this.joggingAngle)) / 20 + 0.4
				}

				this.yaw += this.yawRate * elapsed;
				this.pitch += this.pitchRate * elapsed;
			}
			lastTime = timeNow;
		},

		getPosition : function(type){
			var toReturn = null;
			switch(type){
				case 'x':
					toReturn = this.xPos;
					break;
				case 'y' :
					toReturn = this.yPos;
					break;
				case 'z' :
					toReturn = this.zPos;
					break;
				case 'yaw' :
					toReturn = this.yaw;
					break;
				case 'pitch' :
					toReturn = this.pitch;
					break;
			}
			return toReturn;
		},

		/**
		* onRenderer. Called by renderer. Allow to modify renderer this attributes that are pass throught.
		* - this allow to modify renderer itself without modifying renderer directly.
		*
		*/
		onRenderer : function(state, gl, mvMatrix, pMatrix){

			var self = this;

			//this.onHeartbeat();

			var states = {

				onRenderStart : function(){
					mat4.perspective(pMatrix, 45*Math.PI/180, gl.viewportWidth / gl.viewportHeight, 0.01, 1000.0);
				},

				onRender : function(){
					// rotate
					mat4.rotate(mvMatrix, mvMatrix, u.degToRad(-self.getPosition('pitch')), [1, 0, 0]);
					mat4.rotate(mvMatrix, mvMatrix, u.degToRad(-self.getPosition('yaw')), [0, 1, 0]);
					// forward, backward
					mat4.translate(mvMatrix,mvMatrix, [ -self.getPosition('x') , -self.getPosition('y'), -self.getPosition('z') ]);
				},

				onRenderEnd : function(){

				}

			}

			states[state]();
			
			

            // lol, pikowanie 
            //mat4.rotate(mvMatrix, mvMatrix, degToRad(yaw), [0, 0, 1]);

		}

	});


	return Camera;

});




			// if actions exists
			//if(typeof actions[action] === 'function'){
			//	actions[action].apply(this);
			//}