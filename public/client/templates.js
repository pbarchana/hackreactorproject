angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("client/views/dataCenter.html","<!-- Loading gif -->\n<div ng-show=\"loading\" class=\"loading\">\n  <img src=\"img/ajax-loader.gif\"></img>\n</div>\n\n<!-- Content -->\n<div class=\"content\">\n  <div map class=\"google-map\" latitude=\"43.074688\" longitude=\"-89.384294\" loading=\"loading\" nwdata=\"ctldata\" selected-node=\"selectedNode\" connections=\"connections\"></div>\n</div>\n\n<!-- Side Panel -->\n<div class=\"side-panel\" style=\"overflow-y: scroll\">\n  \n  <!-- Search -->\n  <div class=\"input-group search\">\n    <input placeholder=\"search for node\" type=\"text\" ng-model=\"liveSearch\" class=\"form-control\">\n    <span class=\"input-group-btn\">\n      <button class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button>\n    </span>\n  </div>\n\n  <!-- Node View -->\n  <div ng-show=\"selectedNode && !liveSearch\" ng-controller=\"accordionController\">\n    <accordion close-others=\"oneAtATime\">\n      <!-- Title -->\n      <div class=\"summary\">\n        <div class=\"header\">{{ selectedNode.name }}</div>\n        <div>Data Center</div>\n        <div>{{ selectedNode.location }}</div>\n      </div>\n      <!-- Info -->\n      <div class=\"divider\">NODE INFO</div>\n      <accordion-group heading=\"Attributes\" is-open=\"true\">\n        <div ng-repeat=\"(key, value) in selectedNode\" ng-include=\"\'tree_item_renderer.html\'\"></div>\n      </accordion-group>\n      <!-- Connections -->\n      <div class=\"divider\">CONNECTIONS</div>\n    </accordion>\n  </div><!-- /accordianCtrl -->\n\n  <!-- List view -->\n  <div ng-show=\"liveSearch || !selectedNode\">\n    <div class=\"summary\" ng-click=\"select(node)\" ng-repeat=\"node in ctldata | filter:liveSearch\">\n      <div class=\"header\">{{ node.name }}</div>\n      <div>Data Center</div>\n      <div>{{ node.location }}\n    </div>\n  </div>\n\n</div><!-- /.sidePanel");
$templateCache.put("client/views/main.html","<!-- Loading gif -->\n<div ng-show=\"loading\" class=\"loading\">\n  <img src=\"img/ajax-loader.gif\"></img>\n</div>\n\n<!-- Content -->\n<div network-graph class=\"content\" loading=\"loading\" nwdata=\"ctldata\"></div>\n\n<!-- Side Panel -->\n<div class=\"side-panel\" style=\"overflow-y: scroll\">\n  \n  <!-- Search -->\n  <div class=\"input-group search\">\n    <input placeholder=\"search for node\" type=\"text\" ng-model=\"liveSearch\" class=\"form-control\">\n    <span class=\"input-group-btn\">\n      <button class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button>\n    </span>\n  </div>\n\n  <!-- List View -->\n  <div ng-show=\"liveSearch || !selectedNode\">\n    <div class=\"summary\" ng-click=\"select(node)\" ng-repeat=\"node in ctldata.nodes | filter:liveSearch\">\n      <div class=\"header\">{{ node.type }}</div>\n      <div>UUID: {{ formatUUID(node.attributes.UUID) }}\n    </div>\n  </div>\n\n  <!-- Node View -->\n  <div ng-show=\"selectedNode && !liveSearch\" ng-controller=\"accordionController\">\n    <accordion close-others=\"oneAtATime\">\n      <!-- Summary -->\n      <div class=\"summary\">\n        <div class=\"header\">{{ selectedNode.type }}</div>\n        <div>Platform: {{ selectedNode.attributes.platform }}</div>\n        <div>Vendor: {{ selectedNode.attributes.cVendor }}</div>\n        <div>UUID: {{ formatUUID(selectedNode.attributes.UUID) }}</div>\n      </div>\n      <!-- Node Info -->\n      <div class=\"divider\">NODE INFO</div>\n      <accordion-group heading=\"Attributes\" is-open=\"false\">\n        <div ng-repeat=\"(key, value) in selectedNode.attributes\" ng-include=\"\'tree_item_renderer.html\'\"></div>\n      </accordion-group>\n      <accordion-group heading=\"Components\" is-open=\"false\">\n        <div ng-repeat=\"(key, value) in selectedNode.components\" ng-include=\"\'tree_item_renderer.html\'\"></div>\n      </accordion-group>\n      <!-- Connections -->\n      <div class=\"divider\">NODE INFO</div>\n      <div class=\"summary\" ng-click=\"select(node)\" ng-repeat=\"node in ctldata.nodes | filter:liveSearch\">\n        <div class=\"header\">{{ node.type }}</div>\n        <div>UUID: {{ formatUUID(node.attributes.UUID) }}\n      </div>\n    </accordion>\n  </div><!-- /.AccordianCtrl -->\n \n</div><!-- /.sidePanel");
$templateCache.put("client/views/zoomIn.html","<div>Inside zoomIn view</div>\n\n<!-- Loading gif -->\ndiv ng-show=\"loading\" class=\"loading\">\n  <img src=\"img/ajax-loader.gif\"></img>\n</div\n\n<!-- Content -->\n<div zoom-in class=\"content\" loading=\"loading\" nwdata=\"ctldata\"></div>\n\n<div class=\"side-panel\" style=\"overflow-y: scroll\">\n\n  <!-- Search -->\n  <div class=\"input-group search\">\n    <input placeholder=\"search for node\" type=\"text\" ng-model=\"liveSearch\" class=\"form-control\">\n    <span class=\"input-group-btn\">\n      <button class=\"btn btn-default\" type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button>\n    </span>\n  </div>\n  \n  <!-- List View -->\n  <div ng-show=\"liveSearch || !selectedNode\">\n    <div class=\"summary\" ng-click=\"select(node)\" ng-repeat=\"node in ctldata.nodes | filter:liveSearch\">\n      <div class=\"header\">{{ node.type }}</div>\n      <div>UUID: {{ formatUUID(node.attributes.UUID) }}\n    </div>\n  </div>\n\n  <!-- Node View -->\n  <div ng-show=\"selectedNode && !liveSearch\" ng-controller=\"accordionController\">\n    <accordion close-others=\"oneAtATime\">\n      <!-- Summary -->\n      <div class=\"summary\">\n        <div class=\"header\">{{ selectedNode.type }}</div>\n        <div>Platform: {{ selectedNode.attributes.platform }}</div>\n        <div>Vendor: {{ selectedNode.attributes.cVendor }}</div>\n        <div>UUID: {{ formatUUID(selectedNode.attributes.UUID) }}</div>\n      </div>\n      <!-- Node Info -->\n      <div class=\"divider\">NODE INFO</div>\n      <accordion-group heading=\"Attributes\" is-open=\"false\">\n        <div ng-repeat=\"(key, value) in selectedNode.attributes\" ng-include=\"\'tree_item_renderer.html\'\"></div>\n      </accordion-group>\n      <accordion-group heading=\"Components\" is-open=\"false\">\n        <div ng-repeat=\"(key, value) in selectedNode.components\" ng-include=\"\'tree_item_renderer.html\'\"></div>\n      </accordion-group>\n      <!-- Connections -->\n      <div class=\"divider\">NODE INFO</div>\n    </accordion>\n  </div><!-- /.AccordianCtrl -->\n\n</div><!-- /.sidePanel\n");}]);