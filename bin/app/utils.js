define(function(){

	/**
	* Helping Static Functions for Common use
	*/
	var u = {

		isFunction : function(func){
			if(typeof func === 'function') return true;
			return false;
		},

		doCallback : function(func, params, context){
			if(typeof func === 'function'){
				if(context){
					func.apply(context, [params]);
				}else{
					func(params);
				}
			}else{
				return false;
			}
		},

		degToRad : function(degrees) {
			return degrees * Math.PI / 180; 
		}
	};

	return u;

});