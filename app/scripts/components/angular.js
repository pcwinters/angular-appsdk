
Ext.define('Angular.Component', {
	
	extend: 'Ext.Component',
	alias: 'widget.angular',
	initComponent: function() {
		this.callParent(arguments);
		this.on('render', function(){
			debugger
			//this.update();
			element = this.getEl();
			angular.bootstrap(element.dom, [this.module]);
		}, this);
		

	},
	constructor: function(config){
		config = config || {};
		this.module = config.module;
		this.callParent(arguments);
	},

	/**
	 * @cfg {String} [module=undefined]
	 * Defines the angular module/app to bootstrap.
	 */
	module: null,

});
