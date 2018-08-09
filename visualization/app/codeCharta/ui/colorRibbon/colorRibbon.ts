import angular from "angular";
import "../../core/core.module";
import "../codeMap/codeMap";

import {colorRibbonComponent} from "./colorRibbonComponent";

angular.module("app.codeCharta.ui.colorRibbon",["app.codeCharta.core.settings", "app.codeCharta.ui.codeMap"]);

angular.module("app.codeCharta.ui.colorRibbon").component(
    colorRibbonComponent.selector, colorRibbonComponent
);