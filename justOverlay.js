+function($, undefined) {
console.log(1)

    'use strict';

    /**
     * { function_description }
     *
     * @class      Layer (name)
     * @param      {<type>}  $Element         The element
     * @param      {<type>}  oExternalConfig  The o external configuration
     */
    var Layer = function($Element, oExternalConfig) {

        var oSelf = this;

        oSelf.sGlobalPrefix = 'jo',

        oSelf.oConfig = {
            
            oClasses: {
                initClass: oSelf.sGlobalPrefix + '-init', //inits function of justOverlay
                wrapperClass: oSelf.sGlobalPrefix + '-wrapper', //needs for toggling show/hide)
                indexClass: oSelf.sGlobalPrefix + '-index', //needs for Basic-CSS
                contentClass: oSelf.sGlobalPrefix + '-content', //place html-content of Layer here
                contentOrigin: oSelf.sGlobalPrefix + '-origin',
                isScrolling: oSelf.sGlobalPrefix + '-scrolling',
                dataLayerId: 'data-' + oSelf.sGlobalPrefix + '-id',
                customOptions: oSelf.sGlobalPrefix + '-custom',
                closeElement: oSelf.sGlobalPrefix + '-close',
                // openElement: $Element.attr('id'),
                closeElementText: 'X'
            },

            oOptions: {
                styleClass: '',
                close: 'button', //button, overlay
                
                //Style
                padding: '10',
                backgroundOpacity: '75',
                borderWidth: '2'
            }

        };

        // extend default config with js init object
        $.extend(oSelf.oConfig.oOptions, oExternalConfig);

        // the element related to this instance
        oSelf.$Element = $Element;

        oSelf.init();
    };

    /**
     * { function_description }
     */
    Layer.prototype.init = function() {

        var oSelf = this;

        //build main wrapper
        if (!$('.'+oSelf.oConfig.oClasses.wrapperClass).length) {
            oSelf.buildMarkup('div', oSelf.oConfig.oClasses.wrapperClass, $('body'));
        }

        //on click: open layer
        oSelf.bindEvent(oSelf.$Element, 'click');


    };

    /**
    * { function_description }
    *
    * @param      {<type>}  sElement  The s element
    * @param      {<type>}  sEvent    The s event
    */
    Layer.prototype.bindEvent = function(sElement, sEvent) {

        var oSelf = this;

        $(sElement).on(sEvent,  function(e) {
            console.log('clicked')

            switch (sElement) {
                case oSelf.$Element:
                    e.preventDefault();
                    oSelf.openLayer($(this));
                    break;
                case '.' + oSelf.oConfig.oClasses.closeElement:
                    e.stopPropagation();
                    oSelf.closeLayer();
                    break;   
                case '.' + oSelf.oConfig.oClasses.wrapperClass:
                    e.stopPropagation();
                    if ($(e.target).hasClass(oSelf.oConfig.oClasses.wrapperClass)) {
                        oSelf.closeLayer();
                    }
            }
        });
        // return oSelf;
    };

    /**
    * Builds a markup.
    * position wrapper to start of body 
    * and other builded element as child of wrapper
    *
    * @param      {<type>}  sElement        The s element
    * @param      {<type>}  sClassName      The s class name
    * @param      {<type>}  $PrependParent  The prepend parent
    */
    Layer.prototype.buildMarkup = function(sElement, sClassName, $PrependParent) {
        var oElement = document.createElement(sElement);
        oElement.className = sClassName; // name class
        $PrependParent.prepend(oElement);
    };

     /**
      * Opens a layer.
      *
      * @param      {<type>}  $This   The this
      */
    Layer.prototype.openLayer = function($This) {
        var oSelf = this,
            sDataId = oSelf.$Element.attr('id') // get layer id (for corresponding layer template data-jo-id)
            $LayerContent = $('body').find('[' + oSelf.oConfig.oClasses.dataLayerId + '~=' + sDataId + ']'),
            sIdentifyClass = oSelf.sGlobalPrefix + '-generated-' + $LayerContent.attr(oSelf.oConfig.oClasses.dataLayerId).replace(/ /g,''), // flag opened Layer in wrapper (get class from id)
            sInnerHtml = '',
            sWrapperClass = '.' + oSelf.oConfig.oClasses.wrapperClass;

        //check layer has opened before
        if (!$(sWrapperClass).hasClass(sIdentifyClass)) {
            console.log($LayerContent)
            sInnerHtml  =   '<div class=' + oSelf.oConfig.oClasses.contentClass + '>'
                        +       '<div class=' + oSelf.oConfig.oClasses.contentOrigin + '>' 
                        +       $LayerContent.html()
                        +       '</div>' 
                        +   '</div>'

            //wrap users layer-content into divs
            $LayerContent.html(sInnerHtml);

            //move users layer-content to layer wrapper and add index-content class
            $LayerContent.addClass(oSelf.oConfig.oClasses.indexClass).appendTo(sWrapperClass);
            //build close-element and text this
            oSelf.buildMarkup('div', oSelf.oConfig.oClasses.closeElement, $LayerContent); 

            $LayerContent.children('.' + oSelf.oConfig.oClasses.closeElement).text(oSelf.oConfig.oClasses.closeElementText);


        }
        
        oSelf.customOptions($This, $LayerContent);

        //show wrapper and this layer
        $(sWrapperClass).addClass(sIdentifyClass).add($LayerContent).show();

        oSelf.hasScrollContent($LayerContent);

        //on click: close layer
        $('.' + oSelf.oConfig.oClasses.closeElement).unbind('click'); //before unbind event close
        oSelf.bindEvent('.' + oSelf.oConfig.oClasses.closeElement, 'click');

    };

     /**
      * Closes a layer.
      *
      * @param      {<type>}  $This   The this
      */
    Layer.prototype.closeLayer = function() {
        var oSelf = this;
        $('.' + oSelf.oConfig.oClasses.indexClass).add('.' + oSelf.oConfig.oClasses.wrapperClass).hide();
    };

     /**
      * read custom options from data attribut and overwrite oOptions
      *
      * @param      {<type>}   $This   The this
      * @return     {boolean}  { description_of_the_return_value }
      */
    Layer.prototype.customOptions = function($This,$LayerContent) {
        var oSelf = this,
            sCustomData = $This.data(oSelf.oConfig.oClasses.customOptions),
            replaceOptions = {};
            
        // oSelf.oOptions = oSelf.oConfig.oOptions;  
        if (sCustomData) {
            // return false;
        

        replaceOptions = $.parseJSON(
            '{"' + sCustomData.replace(/=/g,'":"').replace(/,/g,'","').replace(/ /g,'') + '"}'
        );

        oSelf.oConfig.oOptions = $.extend({}, oSelf.oConfig.oOptions, replaceOptions);
        }


        //element index replace border Width
        $LayerContent.css({
            'box-shadow': '0 0 0 ' + oSelf.oConfig.oOptions.borderWidth + 'px rgba(119, 119, 119, 0.5)'
        });
        //element origin replace padding 
        $LayerContent.find('.' + oSelf.oConfig.oClasses.contentOrigin).css('padding',oSelf.oConfig.oOptions.padding + 'px');
        //element wrapper replace background opacity
        $('.' + oSelf.oConfig.oClasses.wrapperClass).css('background','rgba(0, 0, 0,' + oSelf.oConfig.oOptions.backgroundOpacity/100 + ')');

        // option close on overlay or button
        if(oSelf.oConfig.oOptions.close === 'overlay') {
            oSelf.bindEvent('.' + oSelf.oConfig.oClasses.wrapperClass, 'click');
        } else {
            $('.' + oSelf.oConfig.oClasses.wrapperClass).unbind('click');
        }

         if(oSelf.oConfig.oOptions.styleClass) {
            $('.' + oSelf.oConfig.oClasses.indexClass).addClass(oSelf.oConfig.oOptions.styleClass);
         } else {
            $('.' + oSelf.oConfig.oClasses.indexClass).attr('class',oSelf.oConfig.oClasses.indexClass);
         }

    };

    /**
     * Determines if it has scroll content.
     * fires scroll class to avoid overflow
     *
     * @param      {<type>}  elementId  The element identifier
     */

    Layer.prototype.hasScrollContent = function(elementId) {
        var oSelf = this;
        if($(elementId).children('.' + oSelf.oConfig.oClasses.contentClass).outerHeight(true) > $(elementId).outerHeight(true)) {
            $(elementId).addClass(oSelf.oConfig.oClasses.isScrolling);
        }
    };

    /**
     * { function_description }
     *
     * @class      JustOverlay (name)
     * @param      {<type>}  oConfig  The o configuration
     * @return     {<type>}  { description_of_the_return_value }
     */
    function JustOverlay(oConfig) {

        // var $Self = $(this);

        // // get the data which is maybe bound to .data('aidu.javascriptclass');
        // var oData = $Self.data('aidu.javascriptclass');

        // if (!oData) {

        //      so we create a new instance of JavaScriptClass
        //     * and bind the object to .data('aidu.javascriptclass') 
        //     $Self.data('aidu.javascriptclass', (oData = new
        //         Layer($Self, oConfig)));
        // }

        return this.each(function() {
            var $Self = $(this);
            sThisId = $Self.attr('id');
            
            if (sThisId) {
                var layer = new Layer($Self);
            }
        });

    }


    $.fn.justOverlay = JustOverlay;

}(jQuery);