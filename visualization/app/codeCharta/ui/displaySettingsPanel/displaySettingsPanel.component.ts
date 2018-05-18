import {SettingsService} from "../../core/settings/settings.service";
import "./displaySettingsPanel.component.scss";

export class DisplaySettingsPanelController {

    public fanoutDepth: boolean[] = [];

    /* @ngInject */
    constructor(
        private settingsService: SettingsService
    ) {
        this.fanoutDepth[1] = this.settingsService.settings.fanoutDepths.includes(1);
        this.fanoutDepth[2] = this.settingsService.settings.fanoutDepths.includes(2);
        this.fanoutDepth[3] = this.settingsService.settings.fanoutDepths.includes(3);
        this.fanoutDepth[4] = this.settingsService.settings.fanoutDepths.includes(4);
    }

    apply() {
        this.settingsService.settings.fanoutDepths = [];
        if(this.fanoutDepth[1]) {
            this.settingsService.settings.fanoutDepths.push(1);
        }
        if(this.fanoutDepth[2]) {
            this.settingsService.settings.fanoutDepths.push(2);
        }
        if(this.fanoutDepth[3]) {
            this.settingsService.settings.fanoutDepths.push(3);
        }
        if(this.fanoutDepth[4]) {
            this.settingsService.settings.fanoutDepths.push(4);
        }
        this.settingsService.applySettings();
    }

}

export const displaySettingsPanelComponent = {
    selector: "displaySettingsPanelComponent",
    template: require("./displaySettingsPanel.component.html"),
    controller: DisplaySettingsPanelController
};



