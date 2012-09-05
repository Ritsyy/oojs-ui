/**
 * VisualEditor user interface Tool class.
 *
 * @copyright 2011-2012 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * Creates an ve.ui.Tool object.
 *
 * @class
 * @abstract
 * @constructor
 * @param {ve.ui.Toolbar} toolbar
 * @param {String} name
 */
ve.ui.Tool = function ve_ui_Tool( toolbar, name, title ) {
	this.toolbar = toolbar;
	this.name = name;
	this.title = title;
	this.$ = $( '<div class="ve-ui-tool"></div>' ).attr( 'title', this.title );
};

/* Static Members */

ve.ui.Tool.tools = {};

/* Methods */

ve.ui.Tool.prototype.updateState = function () {
	throw new Error( 'Tool.updateState not implemented in this subclass:' + this.constructor );
};

ve.ui.Tool.prototype.clearState = function () {
	this.$.removeClass( 've-ui-toolbarButtonTool-down' );
};
