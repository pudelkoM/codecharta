import angular from "angular";
import "../../core/core.module";
import "../codeMap/codeMap";

import {heightRibbonComponent} from "./heightRibbonComponent";

angular.module("app.codeCharta.ui.heightRibbon",["app.codeCharta.core.settings", "app.codeCharta.ui.codeMap"]);

angular.module("app.codeCharta.ui.heightRibbon").component(
    heightRibbonComponent.selector, heightRibbonComponent
);