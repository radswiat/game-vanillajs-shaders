define(function(){

	/**
	* Static Helpers - functions
	*/
	var helper = {

		/**
		* Helper
		* @method getShader
		*/
		getShader : function(gl, id) {
		    var shaderScript = document.getElementById(id);
		    if (!shaderScript) {
		        return null;
		    }
		    var str = "";
		    var k = shaderScript.firstChild;
		    while (k) {
		        if (k.nodeType == 3) {
		            str += k.textContent;
		        }
		        k = k.nextSibling;
		    }
		    var shader;
		    if (shaderScript.type == "x-shader/x-fragment") {
		        shader = gl.createShader(gl.FRAGMENT_SHADER);
		    } else if (shaderScript.type == "x-shader/x-vertex") {
		        shader = gl.createShader(gl.VERTEX_SHADER);
		    } else {
		        return null;
		    }
		    gl.shaderSource(shader, str);
		    gl.compileShader(shader);
		    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		        alert(gl.getShaderInfoLog(shader));
		        return null;
		    }
		    return shader;
		},

        /**
        * Send matrix to shader
        */
        setMatrixUniforms : function(gl, shaderProgram, pMatrix, mvMatrix) {
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        },


        /**
        * Set object vertex to shader
        */
        setShaderVertex : function(gl, shaderProgram, attribute, vertex) {
            gl.vertexAttribPointer(shaderProgram[attribute], vertex.itemSize, gl.FLOAT, false, 0, 0);
        },
	};


	return helper;

});