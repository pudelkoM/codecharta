import {SettingsService} from "../../core/settings/settings.service";
import "./displaySettingsPanel.component.scss";

export class DisplaySettingsPanelController {

    public fanoutDepth: boolean[] = [];

    /* @ngInject */
    constructor(
        private settingsService: SettingsService
    ) {
        for (var depth = 1; depth < 5; depth++) {
            this.fanoutDepth[depth] = this.settingsService.settings.fanoutDepths.includes(depth);
        }
    }

    apply() {
        this.settingsService.settings.fanoutDepths = [];

        for (var depth = 1; depth < 5; depth++) {
            if(this.fanoutDepth[depth]) {
                this.settingsService.settings.fanoutDepths.push(depth);
            }
        }

        this.settingsService.applySettings();
    }

}

export const displaySettingsPanelComponent = {
    selector: "displaySettingsPanelComponent",
    template: require("./displaySettingsPanel.component.html"),
    controller: DisplaySettingsPanelController
};



