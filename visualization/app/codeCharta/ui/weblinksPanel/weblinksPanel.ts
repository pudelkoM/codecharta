import "../rangeSlider/rangeSlider";
import "../statisticSettingsPanel/statisticSettingsPanel";
import "../aggregateSettingsPanel/aggregateSettingsPanel";
import "../../core/core.module";
import "../layoutSwitcher/layoutSwitcher";

import angular from "angular";

import {weblinksPanelComponent} from "./weblinksPanel.component";

angular.module("app.codeCharta.ui.weblinksPanel", ["app.codeCharta.core"])
    .component(weblinksPanelComponent.selector, weblinksPanelComponent);


