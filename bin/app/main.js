require.config({
    baseUrl: 'bin/app/',
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        jquery: '../lib/jquery',
        glMatrix: '../lib/gl-matrix',
        //glMatrixOld : '../lib/gl-matrix-old',
        animFrame : '../lib/requestAnimationFrame',
        image : '../lib/image',
        // ui lib
        simpleslider : '../lib/simple-slider.min',
        //class : '../lib/class',
        cfg : 'config',
        u : 'utils',
        console : 'helpers/console',
        shims : {
            glMatrix : {
    
            }
        }
    }
});

window.Class = JSCLASS.Class;
window.Module = JSCLASS.Module;
window.Interface = JSCLASS.Interface;

define(['jquery', 'animFrame', 'console'], function($){



   require(['app', 'simpleslider', 'comp/keyController.comp', 'comp/userInputSettings.comp'], function(App){

        require(['gfx/renderer'], function(){

        });

    });
});