/**
 * The TabIndexedElement class is an attribute mixin used to add additional functionality to an
 * element created by another class. The mixin provides a ‘tabIndex’ property, which specifies the
 * order in which users will navigate through the focusable elements via the "tab" key.
 *
 *     @example
 *     // TabIndexedElement is mixed into the ButtonWidget class
 *     // to provide a tabIndex property.
 *     var button1 = new OO.ui.ButtonWidget( {
 *         label : 'fourth',
 *         tabIndex : 4
 *     } );
 *     var button2 = new OO.ui.ButtonWidget( {
 *         label : 'second',
 *         tabIndex : 2
 *     } );
 *     var button3 = new OO.ui.ButtonWidget( {
 *         label : 'third',
 *         tabIndex : 3
 *     } );
 *     var button4 = new OO.ui.ButtonWidget( {
 *         label : 'first',
 *         tabIndex : 1
 *     } );
 *     $( 'body' ).append( button1.$element, button2.$element, button3.$element, button4.$element );
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$tabIndexed] tabIndexed node, assigned to #$tabIndexed, omit to use #$element
 * @cfg {number|null} [tabIndex=0] Tab index value. Use 0 to use default ordering, use -1 to
 *  prevent tab focusing, use null to suppress the `tabindex` attribute.
 */
OO.ui.TabIndexedElement = function OoUiTabIndexedElement( config ) {
	// Configuration initialization
	config = $.extend( { tabIndex: 0 }, config );

	// Properties
	this.$tabIndexed = null;
	this.tabIndex = null;

	// Events
	this.connect( this, { disable: 'onDisable' } );

	// Initialization
	this.setTabIndex( config.tabIndex );
	this.setTabIndexedElement( config.$tabIndexed || this.$element );
};

/* Setup */

OO.initClass( OO.ui.TabIndexedElement );

/* Methods */

/**
 * Set the element with `tabindex` attribute.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $tabIndexed Element to set tab index on
 * @chainable
 */
OO.ui.TabIndexedElement.prototype.setTabIndexedElement = function ( $tabIndexed ) {
	var tabIndex = this.tabIndex;
	// Remove attributes from old $tabIndexed
	this.setTabIndex( null );
	// Force update of new $tabIndexed
	this.$tabIndexed = $tabIndexed;
	this.tabIndex = tabIndex;
	return this.updateTabIndex();
};

/**
 * Set tab index value.
 *
 * @param {number|null} tabIndex Tab index value or null for no tab index
 * @chainable
 */
OO.ui.TabIndexedElement.prototype.setTabIndex = function ( tabIndex ) {
	tabIndex = typeof tabIndex === 'number' ? tabIndex : null;

	if ( this.tabIndex !== tabIndex ) {
		this.tabIndex = tabIndex;
		this.updateTabIndex();
	}

	return this;
};

/**
 * Update the `tabindex` attribute, in case of changes to tab index or
 * disabled state.
 *
 * @chainable
 */
OO.ui.TabIndexedElement.prototype.updateTabIndex = function () {
	if ( this.$tabIndexed ) {
		if ( this.tabIndex !== null ) {
			// Do not index over disabled elements
			this.$tabIndexed.attr( {
				tabindex: this.isDisabled() ? -1 : this.tabIndex,
				// ChromeVox and NVDA do not seem to inherit this from parent elements
				'aria-disabled': this.isDisabled().toString()
			} );
		} else {
			this.$tabIndexed.removeAttr( 'tabindex aria-disabled' );
		}
	}
	return this;
};

/**
 * Handle disable events.
 *
 * @private
 * @param {boolean} disabled Element is disabled
 */
OO.ui.TabIndexedElement.prototype.onDisable = function () {
	this.updateTabIndex();
};

/**
 * Get tab index value.
 *
 * @return {number|null} Tab index value
 */
OO.ui.TabIndexedElement.prototype.getTabIndex = function () {
	return this.tabIndex;
};
