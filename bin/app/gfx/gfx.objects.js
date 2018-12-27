define(function(){

	// object verticles algorithm



	var GFX_OBJECTS = {

		cube : {

			object : {
				itemSize : 3,
				numItems : 24,
				array : function (size){return [

		            // Front face
		            -size, -size,  size,
		             size, -size,  size,
		             size,  size,  size,
		            -size,  size,  size,

		            // Back face
		            -size, -size, -size,
		            -size,  size, -size,
		             size,  size, -size,
		             size, -size, -size,

		            // Top face
		            -size,  size, -size,
		            -size,  size,  size,
		             size,  size,  size,
		             size,  size, -size,

		            // Bottom face
		            -size, -size, -size,
		             size, -size, -size,
		             size, -size,  size,
		            -size, -size,  size,

		            // Right face
		             size, -size, -size,
		             size,  size, -size,
		             size,  size,  size,
		             size, -size,  size,

		            // Left face
		            -size, -size, -size,
		            -size, -size,  size,
		            -size,  size,  size,
		            -size,  size, -size
		        ];}
			},
			color : {
				itemSize : 4,
				numItems : 24,
				array : function (size){return [
		            [1.0, 0.0, 0.0, 0.1], // Front face
		            [1.0, 1.0, 0.0, 1.0], // Back face
		            [0.0, 1.0, 0.0, 1.0], // Top face
		            [1.0, 0.5, 0.5, 1.0], // Bottom face
		            [1.0, 0.0, 1.0, 1.0], // Right face
		            [0.0, 0.0, 1.0, 1.0]  // Left face
				]}
			},
			texture : {
				itemSize : 2,
				numItems : 24,
				array : function (size){return [
				      // Front face
				      0.0, 0.0,
				      1.0, 0.0,
				      1.0, 1.0,
				      0.0, 1.0,

				      // Back face
				      1.0, 0.0,
				      1.0, 1.0,
				      0.0, 1.0,
				      0.0, 0.0,

				      // Top face
				      0.0, 1.0,
				      0.0, 0.0,
				      1.0, 0.0,
				      1.0, 1.0,

				      // Bottom face
				      1.0, 1.0,
				      0.0, 1.0,
				      0.0, 0.0,
				      1.0, 0.0,

				      // Right face
				      1.0, 0.0,
				      1.0, 1.0,
				      0.0, 1.0,
				      0.0, 0.0,

				      // Left face
				      0.0, 0.0,
				      1.0, 0.0,
				      1.0, 1.0,
				      0.0, 1.0
			    ]}
			},
			element : {
				itemSize : 1,
				numItems : 36,
				array : function (size){return [
		            0, 1, 2,      0, 2, 3,    // Front face
		            4, 5, 6,      4, 6, 7,    // Back face
		            8, 9, 10,     8, 10, 11,  // Top face
		            12, 13, 14,   12, 14, 15, // Bottom face
		            16, 17, 18,   16, 18, 19, // Right face
		            20, 21, 22,   20, 22, 23  // Left face
			    ]}
			},
			light : {
				itemSize : 3,
				numItems : 24,
				array : function (size){return [
		            // Front face
		             0.0,  0.0,  1.0,
		             0.0,  0.0,  1.0,
		             0.0,  0.0,  1.0,
		             0.0,  0.0,  1.0,

		            // Back face
		             0.0,  0.0, -1.0,
		             0.0,  0.0, -1.0,
		             0.0,  0.0, -1.0,
		             0.0,  0.0, -1.0,

		            // Top face
		             0.0,  1.0,  0.0,
		             0.0,  1.0,  0.0,
		             0.0,  1.0,  0.0,
		             0.0,  1.0,  0.0,

		            // Bottom face
		             0.0, -1.0,  0.0,
		             0.0, -1.0,  0.0,
		             0.0, -1.0,  0.0,
		             0.0, -1.0,  0.0,

		            // Right face
		             1.0,  0.0,  0.0,
		             1.0,  0.0,  0.0,
		             1.0,  0.0,  0.0,
		             1.0,  0.0,  0.0,

		            // Left face
		            -1.0,  0.0,  0.0,
		            -1.0,  0.0,  0.0,
		            -1.0,  0.0,  0.0,
		            -1.0,  0.0,  0.0
			    ]}
			}
		}
	}

	return GFX_OBJECTS;
});


/*			object : {
				itemSize : 3,
				numItems : 12,
				array : [
		            // Front face
		            -1.0, -1.0,  1.0,
		             1.0, -1.0,  1.0,
		             1.0, -1.0, -1.0,
		            -1.0, -1.0, -1.0,

		            1.0, -1.0,  1.0,
		            3.0, -1.0,  1.0,
		            3.0, -1.0, -1.0,
		            1.0, -1.0, -1.0,

		            3.0, -1.0,  1.0,
		            5.0, -1.0,  1.0,
		            5.0, -1.0, -1.0,
		            3.0, -1.0, -1.0
*/
		            /*

						object pattern math
						x, y, z
						x, y, z
						x, y, z
						x, y, z


						1.0, -1.0,  1.0,
			            -1.0, -1.0,  1.0,
			             
			             1.0, -1.0, -1.0,
			            -1.0, -1.0, -1.0,

						1, -1.0, 1.0
                                       1     [10, 10],
						createSquere( pos,   grid,  ) 


						1 , 2 , 3 , 4 , 5
						6 , 7 , 8 , 9 , 10

						xPos = 8 / 5





						function createSquere(   x,    y,   z  ){
							var xPos = grid.x;
							var yPos = grid.y;

							var array = [];
							array.push(x,-y,z);
							array.push(-x,-y,z);
							array.push(x,-y,-z);
							array.push(-x,-y,-z);
							return array;
						}




						createSquere(1.0, 1.0, 1.0);

						function createSquere(   x,    y,   z  ){
							var array = [];
							array.push(x,-y,z);
							array.push(-x,-y,z);
							array.push(x,-y,-z);
							array.push(-x,-y,-z);
							return array;
						}
						
						x, y, z

		            */