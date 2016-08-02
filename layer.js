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
                isScrolling: globalName + '-scrolling',
                dataAttrName: 'data-' + globalName,
                customOptions: globalName + '-custom'

            };

            var defaultOptions = {

                styleClass: '',
                close: 'button', //button, overlay
                
                //Style
                padding: '15',
                backgroundOverlay: '',
                border_width: ''
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
                $('body').find('*[' + config.dataAttrName +']').on('click', function(e) {
                    e.preventDefault();
                    var sDataId = $(this).data(globalName), // get layer id
                        sDataIdSelektor = '#' + sDataId,
                        sIdentifyClass = globalName + '-' + sDataId, // flag opened Layer (get class from layer id)
                        sInnerHtml = ''
                        
                    //check layer has opened before
                    if (!$('.' + config.wrapperClass).hasClass(sIdentifyClass)) {
                        
                    sInnerHtml  =   '<div class=' + config.contentClass + '>'
                                +       '<div class=' + config.contentOrigin + '>' 
                                +       $(sDataIdSelektor).html()
                                +       '</div>' 
                                +   '</div>'

                        //wrap users layer-content into divs
                        $(sDataIdSelektor).html(sInnerHtml);

                        //move users layer-content to layer wrapper and add index-content class
                        $(sDataIdSelektor).addClass(config.indexContentClass).appendTo('.' + config.wrapperClass);

                        //move and place close-element and text this
                        $('.' + config.closeElement).text(config.closeElementText).prependTo('.' + config.indexContentClass);

                        //add custom css
                        //@TODO function this
                        console.log(sDataIdSelektor)
                        $(sDataIdSelektor).css({
                            'box-shadow': '0 0 0 ' + insertOptions(sDataId).border_width + 'px rgba(255,255,255,0.5)'
                        });
                        $(sDataIdSelektor).find('.' + config.contentOrigin).css('padding',insertOptions(sDataId).padding + 'px');
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
             * read custom options from data attribut and overwrite defaultOptions()
             */
            var insertOptions = function(id) {
                var customData = $('body').find('*[' + config.dataAttrName + '=' + id + ']').data(config.customOptions);

                if (!customData) {
                    return false;
                }

                var replaceOptions = $.parseJSON(
                        '{"' + customData.replace(/=/g,'":"').replace(/,/g,'","').replace(/ /g,'') + '"}'
                    ),
                    custom = $.extend({}, defaultOptions, replaceOptions);

                return custom;
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

