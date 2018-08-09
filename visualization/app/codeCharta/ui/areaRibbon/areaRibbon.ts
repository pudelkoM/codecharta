import angular from "angular";
import "../../core/core.module";
import "../codeMap/codeMap";

import {areaRibbonComponent} from "./areaRibbonComponent";

angular.module("app.codeCharta.ui.areaRibbon",["app.codeCharta.core.settings", "app.codeCharta.ui.codeMap"]);

angular.module("app.codeCharta.ui.areaRibbon").component(
    areaRibbonComponent.selector, areaRibbonComponent
);