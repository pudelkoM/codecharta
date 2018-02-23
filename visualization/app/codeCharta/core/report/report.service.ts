"use strict";
import {DataService} from "../data/data.service";
import {HierarchyNode} from "d3-hierarchy";
import * as d3 from "d3";
import {CodeMap, CodeMapNode} from "../data/model/CodeMap";
import {TEST_FILE_CONTENT, TEST_FILE_DATA} from "../data/data.mocks";

export class ReportService {

    public static SELECTOR = "reportService";

    /* @ngInject */
    constructor(private $rootScope, private dataService: DataService) {

    }

    public generateCSVReport(map: CodeMap = this.dataService.data.renderMap): string {

        if(!map.root) {
            return "";
        }

        let hierarchy: HierarchyNode<CodeMapNode> = d3.hierarchy(map.root);
        let metrics: string[] = this.dataService.getMetricsFromMap(map).sort();

        //Header
        let result = "path";
        metrics.forEach((m) => {
           result += ","+m;
        });
        result += "\n";

        //Body
        hierarchy.leaves().sort((a,b) => {
            if(a.data.name.toLowerCase() < b.data.name.toLowerCase()){
                return -1;
            } else if(a.data.name.toLowerCase() > b.data.name.toLowerCase()){
                return 1;
            } else {
                return 0;
            }
        }).forEach((leaf: HierarchyNode<CodeMapNode>) => {
            let path: HierarchyNode<CodeMapNode>[] = hierarchy.path(leaf);
            let resultPath = "";

            path.forEach((node)=>{
                resultPath += "/" + node.data.name;
            });

            metrics.forEach((metric)=>{
                resultPath += "," + leaf.data.attributes[metric];
            });

            result += resultPath+"\n";
        });

        return result;

    }

}