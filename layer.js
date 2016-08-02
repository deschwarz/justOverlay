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

            var globalName = 'layer';

            var config = {
                initClass: 'js-init-' + globalName, //inits function of layer
                wrapperClass: globalName + '-wrapper', //needs for toggling show/hide)
                indexContentClass: globalName + '-index', //needs for Basic-CSS
                contentClass: globalName + '-content', //place html-content of Layer here
                contentOrigin: globalName + '-origin',
                closeElement: globalName + '-close',
                closeElementText: 'X',
                isScrolling: globalName + '-scrolling'
            };

            var options = {

                styleClass: '',
                close: 'button', //button, overlay
                
                customStyle: {
                    padding: '',
                    backgroundOverlay: '',
                    border: ''
                }
            };

            /**
             * 
             */
            var init = function() {
                buildElement(); 
                openLayer();
                closeLayer();
            };

            /**
             * 
             */
            var buildElement = function() {
                buildMarkup('div', config.wrapperClass);
                buildMarkup('div', config.closeElement);
            };

            /**
             * position wrapper to start of body 
             * and other builded element as child of wrapper
             */
            var buildMarkup = function(sElement, sClassName) {
                var oElement = document.createElement(sElement),
                    sParent = '.' + config.wrapperClass;  

                oElement.className = sClassName; // name class

                if ($(oElement).hasClass(config.wrapperClass)) {
                    sParent = 'body';
                }
                $(sParent).prepend(oElement);
            };

            /**
             * 
             */
            var openLayer = function() {
                $('body').find('*[data-' + globalName +']').on('click', function(e) {
                    e.preventDefault();
                    var sDataId = $(this).data(globalName), // get layer id
                        sDataIdSelektor = '#' + sDataId,
                        sIdentifyClass = globalName + '-' + sDataId; // flag opened Layer (get class from layer id)
                        
                    //check layer has opened before
                    if (!$('.' + config.wrapperClass).hasClass(sIdentifyClass)) {
                        
                    var sInnerHtml =   '<div class=' + config.contentClass + '>'
                                    +   '<div class=' + config.contentOrigin + '>' 
                                    +      $(sDataIdSelektor).html()
                                    +   '</div>' 
                                    + '</div>'

                        //wrap users layer-content into divs
                        $(sDataIdSelektor).html(sInnerHtml);

                        //move users layer-content to layer wrapper and add index-content class
                        $(sDataIdSelektor).addClass(config.indexContentClass).appendTo('.' + config.wrapperClass);

                        //move and place close-element and text this
                        $('.' + config.closeElement).text(config.closeElementText).prependTo('.' + config.indexContentClass);
                    }
                    
                    //show wrapper and this layer
                    $('.' + config.wrapperClass).addClass(sIdentifyClass).add(sDataIdSelektor).show();

                    hasScrollContent(sDataIdSelektor);
                });

            };

            /**
             * 
             */
            var closeLayer = function() {
                $('.' + config.closeElement).on('click', function() {
                    $(this).parents('.' + config.indexContentClass).add('.' + config.wrapperClass).hide();
                });
            };

            /**
             * fires scroll class to avoid overflow
             */
            var hasScrollContent = function(elementId) {
                if($(elementId).children('.' + config.contentClass).outerHeight(true) > $(elementId).outerHeight(true)) {
                    $(elementId).addClass(config.isScrolling);
                }
            };

            /**
             * init if init class exists
             */
            if (document.getElementsByClassName(config.initClass).length) {
                init();
            } else {
                console.log('erro: no ' + config.initClass +' found')
            }
        };
        
        Layer();

    } (jQuery);
});

