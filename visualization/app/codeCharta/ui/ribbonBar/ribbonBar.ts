import angular from "angular";
import "../../core/core.module";
import "../codeMap/codeMap";

import {ribbonBarComponent} from "./ribbonBarComponent";

angular.module("app.codeCharta.ui.ribbonBar",["app.codeCharta.core.settings", "app.codeCharta.ui.codeMap"]);

angular.module("app.codeCharta.ui.ribbonBar").component(
    ribbonBarComponent.selector, ribbonBarComponent
);