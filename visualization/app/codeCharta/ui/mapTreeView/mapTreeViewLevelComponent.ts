import {SettingsServiceSubscriber, SettingsService, Settings} from "../../core/settings/settings.service";
import {IRootScopeService, ITimeoutService} from "angular";
import {CodeMap, CodeMapNode} from "../../core/data/model/CodeMap";
import {hierarchy, HierarchyNode} from "d3-hierarchy";
import {node} from "../codeMap/rendering/node";
import {CodeMapRenderService} from "../codeMap/codeMap.render.service";
import {NodeContextMenuComponent} from "../nodeContextMenu/nodeContextMenu.component";
import {CodeMapActionsService} from "../codeMap/codeMap.actions.service";

export interface MapTreeViewHoverEventSubscriber {
    onShouldHoverNode(node: CodeMapNode);
    onShouldUnhoverNode(node: CodeMapNode);
}

export class MapTreeViewLevelController {

    public node: CodeMapNode = null;
    public depth: number = 0;
    public collapsed: boolean = true;

    /* @ngInject */
    constructor(
        private $rootScope: IRootScopeService,
        private codeMapActionsService: CodeMapActionsService
    ) {

    }

    static subscribeToHoverEvents($rootScope: IRootScopeService, subscriber: MapTreeViewHoverEventSubscriber){
        $rootScope.$on("should-hover-node", (event, args)=>subscriber.onShouldHoverNode(args));
        $rootScope.$on("should-unhover-node", (event, args)=>subscriber.onShouldUnhoverNode(args));
    }

    getFolderColor() {
        if(!this.node) {
            return "#000";
        }
        return this.node.markingColor ? "#" + this.node.markingColor.substr(2) : "#000";
    }

    onMouseEnter() {
        this.$rootScope.$broadcast("should-hover-node", this.node);
    }

    onMouseLeave() {
        this.$rootScope.$broadcast("should-unhover-node", this.node);
    }

    onRightClick($event) {
        NodeContextMenuComponent.hide(this.$rootScope);
        NodeContextMenuComponent.show(this.$rootScope, this.node.path, $event.clientX, $event.clientY);
    }

    onFolderClick() {
        this.collapsed = !this.collapsed;
    }

    onLabelClick() {
        this.codeMapActionsService.isolateNode(this.node);
    }

    onEyeClick() {
        this.codeMapActionsService.toggleNodeVisibility(this.node);
    }

    isLeaf(node: CodeMapNode = this.node): boolean {
        return !(node && node.children && node.children.length > 0);
    }

    sortByFolder(node: CodeMapNode) {
        if(!(node && node.children && node.children.length > 0)){
            return 0;
        } else {
            return 1;
        }
    }

}

export const mapTreeViewLevelComponent = {
    selector: "mapTreeViewLevelComponent",
    template: require("./mapTreeViewLevel.html"),
    controller: MapTreeViewLevelController,
    bindings: {
        node: "<",
        depth: "<"
    }
};




