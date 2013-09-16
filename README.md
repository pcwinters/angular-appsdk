angular-appsdk
==============

Angular bindings and directives for the Rally App SDK

The end-goal is to be able to do this

```html
<ext-component xtype="panel" width="500" height="500" title="Border Layout" layout="border">
	<ext-component title="South Region is resizable" xtype="panel" region="south" height="100" split="true" margins="0 5 5 5"/>	
	<ext-component title="West Region is collapsible" xtype="panel" region="west" width="200" collapsible="true" margins="5 0 0 5" id="west-region-container" layout="fit"/>
	<ext-component title="Center Region" xtype="panel" region="center" layout="fit" margins="5 5 0 0"/>
</ext-component>
```

Instead of this

```javascript
Ext.create('Ext.panel.Panel', {
    width: 500,
    height: 300,
    title: 'Border Layout',
    layout: 'border',
    items: [{
        title: 'South Region is resizable',
        region: 'south',     // position for region
        xtype: 'panel',
        height: 100,
        split: true,         // enable resizing
        margins: '0 5 5 5'
    },{
        // xtype: 'panel' implied by default
        title: 'West Region is collapsible',
        region:'west',
        xtype: 'panel',
        margins: '5 0 0 5',
        width: 200,
        collapsible: true,   // make collapsible
        id: 'west-region-container',
        layout: 'fit'
    },{
        title: 'Center Region',
        region: 'center',     // center region is required, no width/height specified
        xtype: 'panel',
        layout: 'fit',
        margins: '5 5 0 0'
    }],
    renderTo: Ext.getBody()
});
```