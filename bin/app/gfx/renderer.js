define(['app', './camera', './helpers', 'glMatrix', './gfx.objects'], function(app, Camera, helpers, glm, GFX_OBJECTS){

	/**
	* Instance of RendererWebGL. Singleton pattern.
	*
	* @property instance
	* @type class instance
	* @private
	*/
	var instance;


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
	* u. Expose app utils.
	*
	* @property u
	* @type functions
	* @private
	*/
    var u = app.u;


	/**
	* userKeysComponent. App component for user key input handling.
	*
	* @property userKeysComponent
	* @type class instance
	* @private
	*/
	var userKeysComponent = new (app.getComponent('UserKeysComponent'));


	/**
	* userInputSettings. App component for form(input, checkbox) settings of the WebGL.
	* - automaticly generate input, checkbox for registered settings.
	*
	* @property userInputSettings
	* @type class instance
	* @private
	*/
	var userInputSettings = new (app.getComponent('UserInputSettings'));


	/**
	* camera. Gfx component for handling the camera.
	*
	* @property camera
	* @type class instance
	* @private
	*/
    var camera = new Camera();
	

	/**
	* mvMatrixStack. For buffering mvMatrix.
	* - local private variable
	*
	* @property mvMatrixStack
	* @type matrix
	* @private
	*/
    var mvMatrixStack = [];


	/**
	* canvas
	*
	* @property canvas
	* @type js object
	* @private
	*/
    var canvas = document.getElementById("canvas-board");
	var lastTime = 0;
	var xRotCube = 0;
	var xRotSpeed = 0;
	var yRotCube = 0;
	var yRotSpeed = 0;
	var zRot = -5.0;
	var filter = 0;


	/**
	* World serttings
	*/
	var settings = {
		world : {
			cubesize : 2
		}
	} 




	/**
	* WebGL Renderer
	* Main functions:
	* - @initialize - initialize variables, shaders, buffers, textures etc
	* - @initWebgl - init webgl context
	* - @initShaders - init shaders for webgl
	* - @initBuffers - init object buffers, create object verticles
	* - @initTextures - init textures ( 1 for now )
	* - @drawScene - draw scene
	* - @engine - loop
	*/
    var RendererWebGL = new Class({


        /**
        * Set WebGL.
        * - set canvas size
        * - init webgl
        * - init buffers to write
        * 
        * @method WebGL
        * @private
        */
		initialize : function(){

			var self = this;

            this.gl;
            this.shaderProgram;
            this.mvMatrix = mat4.create();
            this.pMatrix = mat4.create();
            
            var cubeVertexPositionBuffer;
            var cubeVertexColorBuffer;
            var cubeVertexIndexBuffer; // for 3d
            var cubeVertexTextureCoordBuffer;
            var cubeVertexNormalBuffer;
            var cubeVertexTexture;

            this.cubeVertexTexturesPack = {};

            // init WebGL
            this.initWebGL();

            // init Shaders
            this.initShaders();

            // init Buffers
            this.initBuffers();

            // init Textures
            this.initTextures();

            // init user keys
            this.initKeys();

            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.enable(this.gl.DEPTH_TEST);

            // renderer loop
        	app.onHeartbeat('render', function(){
	            self.drawScene();
	            self.animate();
        	});
		},


        /**
        * Initialize webGL
        * - greate context
        * - set width/height equal to canvas size
        * - @set gl 
        */
        initWebGL : function() {
            try {
                this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                this.gl.viewportWidth = canvas.width;
                this.gl.viewportHeight = canvas.height;
            } catch (e) {
            }
            if (!this.gl) {
                alert("Could not initialise WebGL, sorry :-(");
            }
        },

        /**
        * Initialize Textures
        * - load texture
        * - handleLoadedTexture
        */
        initTextures : function(){
        	var self = this;
        	var preloadingTexturesCount = 0;
        	$('body').append('<div id="overlay"></div><div id="preloader"><div><span>Loading...</span></div></div>');


        	//var cubeVertexTexturesPack = {};
        	// cubeVertexTexturesPack
        	var texturesUrls = [
        		{
        			name : 'grass',
        			uri  : 'bin/res/gfx/grass.png'
        		},
        		{
        			name : 'crate',
        			uri  : 'bin/res/gfx/crate.gif'
        		},
        		{
        			name : 'sky',
        			uri  : 'bin/res/gfx/sky.gif'
        		},
        		{
        			name : 'sky_tree',
        			uri  : 'bin/res/gfx/sky_tree.gif'
        		},
        		{
        			name : 'select',
        			uri  : 'bin/res/gfx/select.gif'
        		}
        	];

        	$.each(texturesUrls, function(i, texture){
	            self.cubeVertexTexturesPack[texture.name] = self.gl.createTexture();
	            self.cubeVertexTexturesPack[texture.name].image = new Image();
	            self.cubeVertexTexturesPack[texture.name].image.onload = function(){
	                handleLoadedTexture(self.cubeVertexTexturesPack[texture.name], i);
	            }
	            self.cubeVertexTexturesPack[texture.name].image.src = texture.uri;
	            preloadingTexturesCount++;

	            //
	            
	            
        	});

            function handleLoadedTexture(texture, index){
                self.gl.bindTexture(self.gl.TEXTURE_2D, texture);
                self.gl.pixelStorei(self.gl.UNPACK_FLIP_Y_WEBGL, true);
                self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, self.gl.RGBA, self.gl.UNSIGNED_BYTE, texture.image);
                self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.LINEAR);
                self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.LINEAR);
				//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
				//gl.generateMipmap(gl.TEXTURE_2D);
                self.gl.bindTexture(self.gl.TEXTURE_2D, null);

                preloadingTexturesCount--;

                if(!preloadingTexturesCount){
		        	$('body').find('#overlay').remove();
		        	$('body').find('#preloader').remove();
                }
            }

            return;

        },

        /**
        * Initialize shaders
        *
        * @method initShaders()
        * @protected
        */
        initShaders : function() {
            
            // get fragment & vertex Shader
            var fragmentShader = helpers.getShader(this.gl, "shader-fs");
            var vertexShader = helpers.getShader(this.gl, "shader-vs");

            // create program
            this.shaderProgram = this.gl.createProgram();

            // attach shaders and link program
            this.gl.attachShader(this.shaderProgram, vertexShader);
            this.gl.attachShader(this.shaderProgram, fragmentShader);
            this.gl.linkProgram(this.shaderProgram);

            if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
                alert("Could not initialise shaders");
            }

            // use program
            this.gl.useProgram(this.shaderProgram);

            // vertex matrix position
            this.shaderProgram.vertexPositionAttribute  = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

            // vertex matrix texture
            this.shaderProgram.textureCoordAttribute  = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
            this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

            // vertex color matrix
            //this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
            //this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

	        this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
	        this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
	        this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
	        this.shaderProgram.uScale = this.gl.getUniformLocation(this.shaderProgram, "uScale");

        },

        /**
        * init single buffer
        */
        initBuffer : function(params){

        	// output vertex buffer
        	var vertexBuffer = this.gl.createBuffer();

        	// handle default values
        	params.bufferSize = params.bufferSize || 'Float32Array';
        	bufferCallback = params.bufferCallback || function(param){ return param; }
	        
	        // bind current buffer
	        this.gl.bindBuffer(this.gl[params.bufferType], vertexBuffer);

	        // switch for diffrent buffer sizes
	        switch(params.bufferSize){
	        	case 'Uint16Array' :
	        		this.gl.bufferData(this.gl[params.bufferType], new Uint16Array(bufferCallback(GFX_OBJECTS[params.object][params.objectType].array(params.objectTypeParam))), this.gl.STATIC_DRAW);
	        		break;
	        	case 'Float32Array' :
	        		this.gl.bufferData(this.gl[params.bufferType], new Float32Array(bufferCallback(GFX_OBJECTS[params.object][params.objectType].array(params.objectTypeParam))), this.gl.STATIC_DRAW);
	        		break;
	        }
	        
	        vertexBuffer.itemSize = GFX_OBJECTS[params.object][params.objectType].itemSize;
	        vertexBuffer.numItems = GFX_OBJECTS[params.object][params.objectType].numItems;

	        return vertexBuffer;
        },

        /**
        * Initialize buffers
        * - create buffer for the object
        * - set the object vertices
        * @method: initBuffers
        * @private
        */
        initBuffers : function() {

        	// cube vertex position
        	cubeVertexPositionBuffer = this.initBuffer({
        		object 			: 'cube',
        		objectType 		: 'object',
        		objectTypeParam : settings.world.cubesize,
        		bufferType 		: 'ARRAY_BUFFER'
        	});

        	// cube vertex colors
        	cubeVertexColorBuffer = this.initBuffer({
        		object 			: 'cube',
        		objectType 		: 'color',
        		objectTypeParam : settings.world.cubesize,
        		bufferType 		: 'ARRAY_BUFFER',
        		bufferCallback 	: function(colorArray){
			        var unpackedColors = [];
			        $.each(GFX_OBJECTS.cube.color, function(i, color){
			            for (var j=0; j < 4; j++) {
			                unpackedColors = unpackedColors.concat(color);
			            } 	
			        });
			        return unpackedColors;
        		}
        	});
        	
        	// cube vertext texture
        	cubeVertexTextureCoordBuffer = this.initBuffer({
        		object 			: 'cube',
        		objectType 		: 'texture',
        		objectTypeParam : settings.world.cubesize,
        		bufferType 		: 'ARRAY_BUFFER'
        	});


        	// cube vertext index element array
        	cubeVertexIndexBuffer = this.initBuffer({
        		object 			: 'cube',
        		objectType 		: 'element',
        		objectTypeParam : settings.world.cubesize,
        		bufferType 		: 'ELEMENT_ARRAY_BUFFER',
        		bufferSize 		: 'Uint16Array'
        	});

        },

        drawCube : function(params){
        	var self = this;
            this.bufferMatrix(function(){

            	mat4.translate(self.mvMatrix,self.mvMatrix, [ params.position.x*settings.world.cubesize*2, params.position.y, params.position.z*settings.world.cubesize*2 ]); 

                // rotate
                mat4.rotate(self.mvMatrix, self.mvMatrix, u.degToRad(xRotCube), [1, 0, 0.0]);
                mat4.rotate(self.mvMatrix, self.mvMatrix, u.degToRad(yRotCube), [0, 1, 0.0]);

                if(params.scale)
                mat4.scale(self.mvMatrix, self.mvMatrix, params.scale);

                // set position buffer
                self.gl.bindBuffer(self.gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
                helpers.setShaderVertex(self.gl, self.shaderProgram, 'vertexPositionAttribute', cubeVertexPositionBuffer);

	            // set texture buffer
				self.gl.bindBuffer(self.gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
				helpers.setShaderVertex(self.gl, self.shaderProgram, 'textureCoordAttribute', cubeVertexTextureCoordBuffer);
				self.gl.activeTexture(self.gl.TEXTURE0);
				self.gl.bindTexture(self.gl.TEXTURE_2D, self.cubeVertexTexturesPack[params.texture]);
				self.gl.uniform1i(self.shaderProgram.samplerUniform, 0);

				// set element buffer
	            self.gl.bindBuffer(self.gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
                helpers.setMatrixUniforms(self.gl, self.shaderProgram, self.pMatrix, self.mvMatrix );

                
                //self.gl.uniformMatrix3fv(self.shaderProgram.uScale, false, uScale);

                if(params.blend){
		            self.gl.blendFunc(self.gl.SRC_ALPHA, self.gl.ONE_MINUS_SRC_ALPHA);
		            self.gl.enable ( self.gl.BLEND ) ;
                }else{
                	self.gl.disable ( self.gl.BLEND ) ;
                }

                self.gl.drawElements(self.gl.TRIANGLES, cubeVertexIndexBuffer.numItems, self.gl.UNSIGNED_SHORT, 0);

            });
        },

        /**
        * Draw Scene
        *
        */
        drawScene : function() {

        	var self = this;

            // allow camera to modify context
            // - restrict access to context by passing through certain attributes only
        	camera.onRenderer('onRenderStart', this.gl, this.mvMatrix, this.pMatrix);

        	// set viewport & clear webgl context
        	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            // set perspective - has been moved to camera
            mat4.identity(this.mvMatrix);

            // allow camera to modify context
            // - restrict access to context by passing through certain attributes only
            camera.onRenderer('onRender', this.gl, this.mvMatrix, this.pMatrix);

            //mat4.rotate(this.mvMatrix, this.mvMatrix, u.degToRad(camera.getPosition('yaw')), [0, 1, 0]);


            // draw cubes
            var range = 20;
            for(var x = -range; x < range; x++){
        		for(var z = -range; z < range; z++){
        			this.drawCube({
        				position : {
        					x : x, 
        					y : -4, 
        					z : z
        				},
        				texture : 'grass'
        			});
        		}
            }

			this.drawCube({
				position : {
					x : -1, 
					y : 0, 
					z : -3
				},
				texture : 'select'
			});

			this.drawCube({
				position : {
					x : 1, 
					y : 0, 
					z : -3
				},
				texture : 'select',
				blend : true
			});

			// sky box cube
			this.drawCube({
				scale : [200,200,200],
				position : {
					x : 0, 
					y : 225, 
					z : -6
				},
				texture : 'sky_tree',
				blend : false
			});	

            // allow camera to modify context
            // - restrict access to context by passing through certain attributes only
            camera.onRenderer('onRenderEnd', this.gl,  this.mvMatrix, this.pMatrix);

        },


        /**
        * Init User input keys
        * - a, d, w, s
        */
        initKeys : function(){
            userKeysComponent.register('a', function(){
                yRotSpeed -= 2;
            });
            userKeysComponent.register('s', function(){
                xRotSpeed += 2;
            });
            userKeysComponent.register('w', function(){
                xRotSpeed -= 2;
            });
            userKeysComponent.register('d', function(){
                yRotSpeed += 2;
            });
        },


        /**
        * Execute callback on buffered matrix
        * - restore matrix after execution
        */
        bufferMatrix : function(callback) {
            var copy = mat4.create();
            mat4.copy(copy, this.mvMatrix);
            mvMatrixStack.push(copy);
            callback();
            if (mvMatrixStack.length == 0) {
                throw "Invalid popMatrix!";
            }
            this.mvMatrix = mvMatrixStack.pop();
        },

        /**
        * Animate
        * - xRoteCube & yRoteCube
        */
        animate : function() {
            var timeNow = new Date().getTime();
            if (lastTime != 0) {
                var elapsed = timeNow - lastTime;
                xRotCube += (xRotSpeed * elapsed) / 1000.0;
                yRotCube += (yRotSpeed * elapsed) / 1000.0;
            }
            lastTime = timeNow;
        },

	});

	// singleton return
	return (function(){
		if(!instance) instance = new RendererWebGL();
		return instance;
	})();

});