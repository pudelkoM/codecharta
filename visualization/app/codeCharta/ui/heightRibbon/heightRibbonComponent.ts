import  "./heightRibbon.scss"
import {IAngularEvent, IRootScopeService, ITimeoutService} from "angular";
import {SettingsService} from "../../core/settings/settings.service";
import {DataModel, DataService, DataServiceSubscriber} from "../../core/data/data.service";
import $ from "jquery";
import {
    CodeMapBuildingTransition,
    CodeMapMouseEventService,
    CodeMapMouseEventServiceSubscriber
} from "../codeMap/codeMap.mouseEvent.service";
import {codeMapBuilding} from "../codeMap/rendering/codeMapBuilding";

export class heightRibbonController implements DataServiceSubscriber, CodeMapMouseEventServiceSubscriber{
    public metrics: string[];

    public hoveredAreaValue: number;
    public hoveredHeightValue: number;
    public hoveredColorValue: number;
    public hoveredHeightDelta: number;
    public hoveredAreaDelta: number;
    public hoveredColorDelta: number;
    public hoveredDeltaColor: string;
    constructor(
        private $element: Element,
        private dataService: DataService,
        private settingsService: SettingsService,
        private $rootScope: IRootScopeService

    ) {
        this.initAnimations();
        this.metrics = dataService.data.metrics.sort();
        this.dataService.subscribe(this);
        CodeMapMouseEventService.subscribe($rootScope, this);
    }
    onDataChanged(data: DataModel, event: IAngularEvent) {
        this.metrics = data.metrics.sort();
    }
    public changeMargin(){
        this.settingsService.settings.dynamicMargin = false;
        this.settingsService.applySettings();
    }
    public notify() {
        this.settingsService.applySettings();
    }

    onBuildingRightClicked(building: codeMapBuilding, x: number, y: number, event: IAngularEvent) {
    }

    onBuildingHovered(data: CodeMapBuildingTransition, event: angular.IAngularEvent) {

        if(data && data.to && data.to.node && data.to.node.attributes) {
            this.hoveredAreaValue = data.to.node.attributes[this.settingsService.settings.areaMetric];
            this.hoveredColorValue = data.to.node.attributes[this.settingsService.settings.colorMetric];
            this.hoveredHeightValue = data.to.node.attributes[this.settingsService.settings.heightMetric];

            if(data.to.node.deltas){

                this.hoveredAreaDelta = data.to.node.deltas[this.settingsService.settings.areaMetric];
                this.hoveredColorDelta = data.to.node.deltas[this.settingsService.settings.colorMetric];
                this.hoveredHeightDelta = data.to.node.deltas[this.settingsService.settings.heightMetric];

                this.hoveredDeltaColor = this.getHoveredDeltaColor();
            }
            else {
                this.hoveredAreaDelta = null;
                this.hoveredColorDelta = null;
                this.hoveredHeightDelta = null;
                this.hoveredDeltaColor = null;
            }
        } else {
            this.hoveredAreaValue = null;
            this.hoveredColorValue = null;
            this.hoveredHeightValue = null;
            this.hoveredHeightDelta = null;
            this.hoveredAreaDelta = null;
            this.hoveredColorDelta = null;
        }
    }

    onBuildingSelected(data: CodeMapBuildingTransition, event: angular.IAngularEvent) {
    }

    private getHoveredDeltaColor() {
        let colors = {
            0: "green",
            1: "red"
        };

        if (this.hoveredHeightDelta > 0) {
            return colors[Number(this.settingsService.settings.deltaColorFlipped)];
        } else if (this.hoveredHeightDelta < 0) {
            return colors[Number(!this.settingsService.settings.deltaColorFlipped)];
        } else {
            return "inherit";
        }
    }

    private initAnimations() {
        $(document).ready(function(){
            let start = 40;
            let target = 500;
            let visible = false;
            $("test-field-component .panel-button").click(function(){
                $("test-field-component .panel-button").animate({top: visible ? target+"px" : start+"px"}, "fast");
                visible = !visible;
            });
        });
    }
}


export const heightRibbonComponent = {
    selector: "heightRibbonComponent",
    template: require("./heightRibbon.html"),
    controller: heightRibbonController
};
