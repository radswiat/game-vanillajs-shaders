define(['app'], function(app){

	var UserInputSettings = new Class({
		initialize : function(){
			this.$element = $('#canvas-tools');
		},

		register : function(name, type, value, range){
			var tpl = '';
			switch(type){
				case 'checkbox':
					tpl = $('<div class="toolitem slideThree"><input id="slideThree" type="checkbox" name="check" value="None" checked=checked><label for="slideThree"></label><span></span></div>');
					break;
				case 'input':
					tpl = $('<div class="toolitem input"><input class="simpleslider" type="text" value="" name=""><span><b></b></span></div>');
					break;
			}
			tpl.find('input').attr('name', name);
			tpl.find('span').prepend(name);
			this.$element.append(tpl);

			tpl.find('input[type=text]').simpleSlider({
				range : range,
				value : value
			}).bind("slider:changed", function(event, data){
				tpl.find('input').val(data.value);
				tpl.find('span').find('b').html(Math.round(data.value*100)/100);
			})

			
		},

		get : function(name){
			var input = this.$element.find('input[name="'+name+'"]');
			if(input.attr('type') === 'text'){
				return input.val();
			}else if(input.attr('type') === 'checkbox'){
				return input.is(':checked');
			}
			
		}

	});

	app.register('component', 'UserInputSettings', UserInputSettings);
});



