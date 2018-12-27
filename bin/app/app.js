define(['cfg', 'u'], function(cfg, u){

	var instance;

	/**
	* App
	*
	*/
	var App = new Class((function(){

		// private scope
		var _registered = {
			component : {},
			module : {}
		};

		var lastTimeSync = 0;

		return{

		    initialize: function() {
		    	console.log('app initialized');	
		    	this.u = u;

		    	// run heartbeat
		    	this._heartbeat();
		    },

		    register : function(type, className, classDefinition){
		    	if(typeof _registered[type][className] !== 'undefined') alert('already registered!');
		    	_registered[type][className] = classDefinition;
		    },

		    getComponent : function(component){
		    	return _registered.component[component];
		    },



		    /**
		    * Heartbeat App Component
		    */

			    _heartbeatCallbacksStorage : {},
			    _heartbeatSyncCallbacksStorage : {},

			    /**
			    * Register heartbeat callback
			    */
			    onHeartbeat : function(callbackname, callback, synchronized){
			    	if(!synchronized)
			    		this._heartbeatCallbacksStorage[callbackname] = callback;
			    	else
			    		this._heartbeatSyncCallbacksStorage[callbackname] = callback;
			    },

			    /**
			    * execute hearbeat callbacks 
			    */
			    _heartbeatCallbacks : function(storage, param){
			    	$.each(storage, function(i, callback){
			    		if(typeof callback === 'function'){
			    			callback(param);
			    		}
			    	});
			    },

			    /**
			    * Heartbeat
			    * - call callbacks,
			    * - call heartbeatSync
			    */
			    _heartbeat : function(){
			    	console.log('app->heartbeat');
			    	this._heartbeatSync();
			    	this._heartbeatCallbacks(this._heartbeatCallbacksStorage);
			    	requestAnimFrame(this._heartbeat.bind(this));
			    },

			    /**
			    * Time sync heartbeat
			    */
			    _heartbeatSync : function(){
		            var timeNow = new Date().getTime();
		            if (lastTimeSync != 0) {
		            	var elapsed = timeNow - lastTimeSync;
		            	this._heartbeatCallbacks(this._heartbeatSyncCallbacksStorage, elapsed);
		            }
		            lastTimeSync = timeNow;
			    }


		}
	})());

	return (function(){
		if(!instance) instance = new App();
		return instance;
	})();
});