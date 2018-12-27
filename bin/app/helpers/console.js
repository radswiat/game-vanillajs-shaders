define(function(){

	var instance;

	/**
	* Console Class. Overwrite default console.log.
	*
	* @class Console
	* @constructor
	*/
	var Console = new Class({

		initialize : function(){
			this.console = window.console;
		},

		log : function(string){
			this.console.log(string);
		},

		warn : function(string){
			this.console.warn(string);
		},

		error : function(string){
			this.console.error(string);
		},

		info : function(string){
			this.console.info(string);
		}

	});

	return (function(){
		if(!instance){ instance = new Console(); window.console = instance; }
		return instance;
	})();

});