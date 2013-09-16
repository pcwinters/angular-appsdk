angular-appsdk
==============

Angular bindings and directives for the Rally App SDK

Configs
-------
Ext components and widgets are created in code, but we want to leverage Angular's support for attributes. 
While angular makes it easy enough to define interpolated, evaluated, and isolate scope bound attributes,
it's not simple to do this dynamically nor where the value type is unknown.

### Interpolation
This is the default behavior for config attributes. Standard attributes will be compiled and evaluated as strings.
```
<ext-component title="My title is {{someVar}}"/>
```

### Evaluation
Using the prefix 'e-' in hungarian style notation, the value of the attribute will be assumed to be an expression 
evaluated on the parent scope.
```
<ext-component e-title="'My title is '+someVar"/>
```

### Binding
Perhaps the least likely scenario is to set up two-way property binding. The title will be set to the value of the 
parent scope, and a two-way binding will be set up with the component's property.
```
<ext-component b-title="someVar"/>
```

### Special attributes
In order to configure components with some reasonable defaults, there are a few special directive attributes.

- bindTo: A variable name on the parent scope to bind the ext component to.
- renderTo:
  - false or empty: Doesn't set the config at all (You'll probably need to use 'add'
  - true: sets 'renderTo' to the directives HTML element
  - string: passes the id through to the Ext renderTo config
- add:
  - false or empty: No behavior. You probably want to use 'renderTo' in this case
  - true: Adds this component to the parent directive (assuming the parent is a container)
  - string: Add this component to the component found at given property on the parent scope (Least likely)

Motivation
----------
The goal is to be able to do the following

```javascript
$scope.title = 'Border Layout';
```
```html
<ext-component bindTo="panelVar" xtype="panel" width="500" height="500" title="{{title}}" layout="border" renderTo="true">
	<ext-component title="South Region is resizable" xtype="panel" region="south" height="100" split="true" margins="0 5 5 5"/>	
	<ext-component title="West Region is collapsible" xtype="panel" region="west" width="200" collapsible="true" margins="5 0 0 5" id="west-region-container" layout="fit"/>
	<ext-component title="Center Region" xtype="panel" region="center" layout="fit" margins="5 5 0 0"/>
</ext-component>
```

Instead of this

```javascript
var panelVar = Ext.create('Ext.panel.Panel', {
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

TODO
- [ ] Hungarian style attribute evaluation
- [ ] Virtual element directives that add to parent 'items'
- [ ] Ext containers with compilable html templates
