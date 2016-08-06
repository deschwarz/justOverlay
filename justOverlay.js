+function($, undefined) {

    'use strict';

    var Layer = function($Element, oExternalConfig) {

        var oSelf = this;

        oSelf.sGlobalName = 'jo',

        oSelf.oConfig = {
            
            oClasses: {
                initClass: oSelf.sGlobalName + '-init', //inits function of justOverlay
                wrapperClass: oSelf.sGlobalName + '-wrapper', //needs for toggling show/hide)
                indexContentClass: oSelf.sGlobalName + '-index', //needs for Basic-CSS
                contentClass: oSelf.sGlobalName + '-content', //place html-content of Layer here
                contentOrigin: oSelf.sGlobalName + '-origin',
                closeElement: oSelf.sGlobalName + '-close',
                closeElementText: 'X',
                isScrolling: oSelf.sGlobalName + '-scrolling',
                dataAttrName: 'data-' + oSelf.sGlobalName,
                customOptions: oSelf.sGlobalName + '-custom',
                linkClass: oSelf.sGlobalName + '-open-this'
            },

            oOptions: {
                styleClass: '',
                close: 'button', //button, overlay
                
                //Style
                padding: '15',
                backgroundOverlay: '',
                border_width: ''
            }

        };

        // extend default config with js init object
        $.extend(oSelf.oConfig.oOptions, oExternalConfig);

        // the element related to this instance
        oSelf.$Element = $Element;

        oSelf.init();
        oSelf.bindEvents();

    };

    Layer.prototype.init = function() {
       
        var oSelf = this;
        oSelf.linkClass();
        oSelf.buildElement();
        oSelf.buildMarkup();

    };

    Layer.prototype.bindEvents = function() {

        var oSelf = this;

        $(document).on('click', '.' + oSelf.oConfig.oClasses.linkClass, oSelf, function(e){
            e.preventDefault();
            oSelf.openLayer($(this));
        });



        $(document).on('click', '.' + oSelf.oConfig.oClasses.closeElement, oSelf, function(){
            oSelf.closeLayer($(this));
        });

    };

    /**
     * 
     */
    Layer.prototype.linkClass = function() {
        var oSelf = this;

        //build class to all layer links
        $(document).find('*[' + oSelf.oConfig.oClasses.dataAttrName +']').addClass(oSelf.oConfig.oClasses.linkClass);
    };

    /**
     * 
     */
    Layer.prototype.buildElement = function() {
        var oSelf = this;

        oSelf.buildMarkup('div', oSelf.oConfig.oClasses.wrapperClass);
        oSelf.buildMarkup('div', oSelf.oConfig.oClasses.closeElement);
    };

    /**
     * position wrapper to start of body 
     * and other builded element as child of wrapper
     */
    Layer.prototype.buildMarkup = function(sElement, sClassName) {
        var oSelf = this,
            oElement = document.createElement(sElement),
            sParent = '.' + oSelf.oConfig.oClasses.wrapperClass;  

        oElement.className = sClassName; // name class

        if ($(oElement).hasClass(oSelf.oConfig.oClasses.wrapperClass)) {
            sParent = 'body';
        }
        $(sParent).prepend(oElement);
    };

    /**
     * 
     */
    Layer.prototype.openLayer = function($This) {
        var oSelf = this,
            sDataId = $This.data(oSelf.sGlobalName), // get layer name (corresponding id)
            sDataIdSelektor = '#' + sDataId,
            sIdentifyClass = oSelf.GlobalName + '-' + sDataId, // flag opened Layer (get class from justOverlay id)
            sInnerHtml = '',
            sWrapperClass = '.' + oSelf.oConfig.oClasses.wrapperClass;

        //check justOverlay has opened before
        if (!$(sWrapperClass).hasClass(sIdentifyClass)) {
            
            sInnerHtml  =   '<div class=' + oSelf.oConfig.oClasses.contentClass + '>'
                        +       '<div class=' + oSelf.oConfig.oClasses.contentOrigin + '>' 
                        +       $(sDataIdSelektor).html()
                        +       '</div>' 
                        +   '</div>'

            //wrap users layer-content into divs
            $(sDataIdSelektor).html(sInnerHtml);

            //move users layer-content to layer wrapper and add index-content class
            $(sDataIdSelektor).addClass(oSelf.oConfig.oClasses.indexContentClass).appendTo(sWrapperClass);

            //move and place close-element and text this
            $('.' + oSelf.oConfig.oClasses.closeElement).text(oSelf.oConfig.oClasses.closeElementText).prependTo('.' + oSelf.oConfig.oClasses.indexContentClass);

            //add custom css
            //@TODO function this
            console.log('sDataIdSelektor:',sDataIdSelektor)
            $(sDataIdSelektor).css({
                'box-shadow': '0 0 0 ' + oSelf.insertOptions($This).border_width + 'px rgba(255,255,255,0.5)'
            });
            $(sDataIdSelektor).find('.' + oSelf.oConfig.oClasses.contentOrigin).css('padding',oSelf.insertOptions($This).padding + 'px');
        }
        
        //show wrapper and this layer
        $(sWrapperClass).addClass(sIdentifyClass).add(sDataIdSelektor).show();

        oSelf.hasScrollContent(sDataIdSelektor);
        
    };

    /**
     * 
     */
    Layer.prototype.closeLayer = function($This) {
        var oSelf = this;
        $This.parents('.' + oSelf.oConfig.oClasses.indexContentClass).add('.' + oSelf.oConfig.oClasses.wrapperClass).hide();
    };


    /**
     * read custom options from data attribut and overwrite oOptions
     */
    Layer.prototype.insertOptions = function($This) {
        var oSelf = this,
            customData = $This.data(oSelf.oConfig.oClasses.customOptions);

        if (!customData) {
            return false;
        }

        var replaceOptions = $.parseJSON(
            '{"' + customData.replace(/=/g,'":"').replace(/,/g,'","').replace(/ /g,'') + '"}'
        );

        return $.extend({}, oSelf.oOptions, replaceOptions);
    };

    /**
    * fires scroll class to avoid overflow
    */
    Layer.prototype.hasScrollContent = function(elementId) {
        var oSelf = this;
        if($(elementId).children('.' + oSelf.oConfig.oClasses.contentClass).outerHeight(true) > $(elementId).outerHeight(true)) {
            $(elementId).addClass(oSelf.oConfig.oClasses.isScrolling);
        }
    };

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


        var layer = new Layer();

    }


    $.fn.justOverlay = JustOverlay;

}(jQuery);