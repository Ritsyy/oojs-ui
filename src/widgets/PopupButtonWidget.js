/**
 * Button that shows and hides a popup.
 *
 * @class
 * @extends OO.ui.ButtonWidget
 * @mixins OO.ui.PopuppableElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.PopupButtonWidget = function OoUiPopupButtonWidget( config ) {
	// Parent constructor
	OO.ui.PopupButtonWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.PopuppableElement.call( this, config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-popupButtonWidget' )
		.append( this.popup.$element );
};

/* Inheritance */

OO.inheritClass( OO.ui.PopupButtonWidget, OO.ui.ButtonWidget );

OO.mixinClass( OO.ui.PopupButtonWidget, OO.ui.PopuppableElement );

/* Methods */

/**
 * Handles mouse click events.
 *
 * @method
 * @param {jQuery.Event} e Mouse click event
 */
OO.ui.PopupButtonWidget.prototype.onClick = function ( e ) {
	// Skip clicks within the popup
	if ( $.contains( this.popup.$element[0], e.target ) ) {
		return;
	}

	if ( !this.disabled ) {
		if ( this.popup.isVisible() ) {
			this.hidePopup();
		} else {
			this.showPopup();
		}
		OO.ui.ButtonWidget.prototype.onClick.call( this );
	}
	return false;
};