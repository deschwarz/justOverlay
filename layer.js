/**
 * layer.js
 *
 * A simple layer helper method
 *
 * @author d.schwarz
 */
$(function() {
    +function($) {

        'use strict';

        function Layer() {

            // console.log(this)

            var globalName = 'layer';

            var config = {
                initClass: 'js-init-' + globalName, //inits function of layer
                // overlayClass: globalName + '-overlay', //needs for fixed overlay
                wrapperClass: globalName + '-wrapper', //needs for toggling show/hide)
                contentClass: globalName + '-content' //needs for styling
            };

            //get layer id
            // var layerId = $('.' + config.initClass).attr('id');

            //get initial name
            // var layerDataName = $('body').find('*[data-' + globalName +']').data(globalName);

            var defaultOptions = {
                //@TODO initial Werte finden
                width: 800,
                height: 600,
                margin: 10,
                background: '???'
            };

            var init = function() {
                console.log('inited')
                defineLayerElements(); 
                onClickLink();
                $('.' + config.initClass).show();
            };

            var defineLayerElements = function() {
                var wrapperElement = markup('div', config.wrapperClass);
                    // overlayElement = markup('div', config.overlayClass);
            };

            /**
             * 
             */
            var markup = function(sElement, sClassName) {
                var oElement = document.createElement(sElement), // build div
                    sParent = '.' + config.wrapperClass;  

                oElement.className = sClassName;    // name  class

                //position wrapper to start of body 
                // and other builded element as child of wrapper
                if ($(oElement).hasClass(config.wrapperClass)) {
                    sParent = 'body';
                }
                $(sParent).prepend(oElement);
            };

            /**
             * 
             */
            var onClickLink = function() {
                $('body').find('*[data-' + globalName +']').on('click', function(e) {
                    console.log('sdfljk')
                    e.preventDefault();
                    var sDataId = $(this).data(globalName); // get layer id

                    //move layer content to layer wrapper and add content class
                    $('#' + sDataId).addClass(config.contentClass).appendTo('.' + config.wrapperClass);

                    $('.' + config.wrapperClass).show();


                });
                

            };

            //is users input valid
            // 
            console.log()
            if (document.getElementsByClassName(config.initClass).length) {
                init();
            } else {
                console.log('erro: no ' + config.initClass +' found')
            }
        };
        
        Layer();

    } (jQuery);
});

