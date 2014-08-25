angular-appsdk
==============

Angular bindings and directives for the Rally App SDK and ExtJS. The goal of this project is to support smooth and 
seamless interoperability of AngularJS and the ExtJS based App SDK. While it might be useful as a general angular/ext 
adapter, the primary purpose is to support the patterns and style of usage observed within Rally app development.

TODO
----
Much of this repo and library is a work in progress. There aren't any special Angular-EXT adapters or bindings yet, but this will be the place for them.

Angular's Digest and Ext Events
-------------------------------
Angular recalculates values and performs new actions according to its digest cycle. In order to notify angular when
an ext event has occured, all ext components created will have global event listeners attached to them that perform
a $digest as well as $emit those events on the parent scope.

```var extComponent = $rally.bind($scope, Ext.create(...));```

### TODO
[ ] - Determine what scope events are emitted to. Isolate wouldn't make sense, they'll probably need to be prefixed (if emitted at all).

DataStores
----------
WIP. Conceptually, data stores can be adapted to provide angular promises.

Motivation
----------
To allow the App SDK to effortlessly include angular apps and components.
