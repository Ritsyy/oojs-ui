/**
 * Container for content that is overlaid and positioned absolutely.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.LabeledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [tail=true] Show tail pointing to origin of popup
 * @cfg {string} [align='center'] Alignment of popup to origin
 * @cfg {jQuery} [$container] Container to prevent popup from rendering outside of
 * @cfg {boolean} [autoClose=false] Popup auto-closes when it loses focus
 * @cfg {jQuery} [$autoCloseIgnore] Elements to not auto close when clicked
 * @cfg {boolean} [head] Show label and close button at the top
 */
OO.ui.PopupWidget = function OoUiPopupWidget( config ) {
	// Config intialization
	config = config || {};

	// Parent constructor
	OO.ui.PopupWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.LabeledElement.call( this, this.$( '<div>' ), config );
	OO.ui.ClippableElement.call( this, this.$( '<div>' ), config );

	// Properties
	this.visible = false;
	this.$popup = this.$( '<div>' );
	this.$head = this.$( '<div>' );
	this.$body = this.$clippable;
	this.$tail = this.$( '<div>' );
	this.$container = config.$container || this.$( 'body' );
	this.autoClose = !!config.autoClose;
	this.$autoCloseIgnore = config.$autoCloseIgnore;
	this.transitionTimeout = null;
	this.tail = false;
	this.align = config.align || 'center';
	this.closeButton = new OO.ui.ButtonWidget( { '$': this.$, 'frameless': true, 'icon': 'close' } );
	this.onMouseDownHandler = OO.ui.bind( this.onMouseDown, this );

	// Events
	this.closeButton.connect( this, { 'click': 'onCloseButtonClick' } );

	// Initialization
	this.useTail( config.tail !== undefined ? !!config.tail : true );
	this.$body.addClass( 'oo-ui-popupWidget-body' );
	this.$tail.addClass( 'oo-ui-popupWidget-tail' );
	this.$head
		.addClass( 'oo-ui-popupWidget-head' )
		.append( this.$label, this.closeButton.$element );
	if ( !config.head ) {
		this.$head.hide();
	}
	this.$popup
		.addClass( 'oo-ui-popupWidget-popup' )
		.append( this.$head, this.$body );
	this.$element.hide()
		.addClass( 'oo-ui-popupWidget' )
		.append( this.$popup, this.$tail );
};

/* Setup */

OO.inheritClass( OO.ui.PopupWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.PopupWidget, OO.ui.LabeledElement );
OO.mixinClass( OO.ui.PopupWidget, OO.ui.ClippableElement );

/* Events */

/**
 * @event hide
 */

/**
 * @event show
 */

/* Methods */

/**
 * Handles mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.PopupWidget.prototype.onMouseDown = function ( e ) {
	if (
		this.visible &&
		!$.contains( this.$element[0], e.target ) &&
		( !this.$autoCloseIgnore || !this.$autoCloseIgnore.has( e.target ).length )
	) {
		this.hide();
	}
};

/**
 * Bind mouse down listener.
 */
OO.ui.PopupWidget.prototype.bindMouseDownListener = function () {
	// Capture clicks outside popup
	this.getElementWindow().addEventListener( 'mousedown', this.onMouseDownHandler, true );
};

/**
 * Handles close button click events.
 */
OO.ui.PopupWidget.prototype.onCloseButtonClick = function () {
	if ( this.visible ) {
		this.hide();
	}
};

/**
 * Unbind mouse down listener.
 */
OO.ui.PopupWidget.prototype.unbindMouseDownListener = function () {
	this.getElementWindow().removeEventListener( 'mousedown', this.onMouseDownHandler, true );
};

/**
 * Check if the popup is visible.
 *
 * @return {boolean} Popup is visible
 */
OO.ui.PopupWidget.prototype.isVisible = function () {
	return this.visible;
};

/**
 * Set whether to show a tail.
 *
 * @return {boolean} Make tail visible
 */
OO.ui.PopupWidget.prototype.useTail = function ( value ) {
	value = !!value;
	if ( this.tail !== value ) {
		this.tail = value;
		if ( value ) {
			this.$element.addClass( 'oo-ui-popupWidget-tailed' );
		} else {
			this.$element.removeClass( 'oo-ui-popupWidget-tailed' );
		}
	}
};

/**
 * Check if showing a tail.
 *
 * @return {boolean} tail is visible
 */
OO.ui.PopupWidget.prototype.hasTail = function () {
	return this.tail;
};

/**
 * Show the context.
 *
 * @fires show
 * @chainable
 */
OO.ui.PopupWidget.prototype.show = function () {
	if ( !this.visible ) {
		this.setClipping( true );
		this.$element.show();
		this.visible = true;
		this.emit( 'show' );
		if ( this.autoClose ) {
			this.bindMouseDownListener();
		}
	}
	return this;
};

/**
 * Hide the context.
 *
 * @fires hide
 * @chainable
 */
OO.ui.PopupWidget.prototype.hide = function () {
	if ( this.visible ) {
		this.setClipping( false );
		this.$element.hide();
		this.visible = false;
		this.emit( 'hide' );
		if ( this.autoClose ) {
			this.unbindMouseDownListener();
		}
	}
	return this;
};

/**
 * Updates the position and size.
 *
 * @param {number} width Width
 * @param {number} height Height
 * @param {boolean} [transition=false] Use a smooth transition
 * @chainable
 */
OO.ui.PopupWidget.prototype.display = function ( width, height, transition ) {
	var widget = this,
		padding = 10,
		originOffset = Math.round( this.$element.offset().left ),
		containerLeft = Math.round( this.$container.offset().left ),
		containerWidth = this.$container.innerWidth(),
		containerRight = containerLeft + containerWidth,
		popupOffset = width * ( { 'left': 0, 'center': -0.5, 'right': -1 } )[this.align],
		popupLeft = popupOffset - padding,
		popupRight = popupOffset + padding + width + padding,
		overlapLeft = ( originOffset + popupLeft ) - containerLeft,
		overlapRight = containerRight - ( originOffset + popupRight );

	// Prevent transition from being interrupted
	clearTimeout( this.transitionTimeout );
	if ( transition ) {
		// Enable transition
		this.$element.addClass( 'oo-ui-popupWidget-transitioning' );
	}

	if ( overlapRight < 0 ) {
		popupOffset += overlapRight;
	} else if ( overlapLeft < 0 ) {
		popupOffset -= overlapLeft;
	}

	// Position body relative to anchor and resize
	this.$popup.css( {
		'left': popupOffset,
		'width': width,
		'height': height === undefined ? 'auto' : height
	} );

	if ( transition ) {
		// Prevent transitioning after transition is complete
		this.transitionTimeout = setTimeout( function () {
			widget.$element.removeClass( 'oo-ui-popupWidget-transitioning' );
		}, 200 );
	} else {
		// Prevent transitioning immediately
		this.$element.removeClass( 'oo-ui-popupWidget-transitioning' );
	}

	return this;
};
