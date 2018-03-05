"use strict";

import * as d3 from "d3";
import {CodeMap, CodeMapNode} from "./model/CodeMap";
import {HierarchyNode} from "d3-hierarchy";
import * as deepcopy from "deepcopy";

export interface KVObject {
    [key: string]: number
}

/**
 * Calculates the deltas between given maps and modifies the data structure
 */
export class DeltaCalculatorService {

    /* @ngInject */
    constructor() {

    }

    private insertNodesIntoMapsAndHashmaps(firstLeafHashMap: Map<string, CodeMapNode>, secondLeafHashMap: Map<string, CodeMapNode>, firstMap: CodeMap, secondMap: CodeMap) {
        firstLeafHashMap.forEach((node, path) => {
            if (!secondLeafHashMap.has(path)) {
                // insert node into secondHashMap and secondMap
                let addedNode = this.deepcopy2(node);
                secondLeafHashMap.set(path, addedNode);
                this.insertNodeIntoMapByPath(addedNode, secondMap);
            }
        });
    }

    private insertNodeIntoMapByPath(node: CodeMapNode, insertMap: CodeMap) {
        let pathArray: string[] = node.path.split("/");

        let insertPathArray: string[] = pathArray.slice(2, pathArray.length - 1);
        let currentPathArray: string[] = pathArray.slice(0, 2);
        let current = insertMap.root;


        while (insertPathArray.length > 0) {

            let childFoundSteppingIntoIt = false;

            if (current.children) {

                for (let i = 0; i < current.children.length && !childFoundSteppingIntoIt; i++) {
                    let child = current.children[i];
                    if (child.name === insertPathArray[0]) {
                        // step into existing folder
                        current = child;
                        currentPathArray.push(insertPathArray[0]);
                        insertPathArray = insertPathArray.slice(1);
                        childFoundSteppingIntoIt = true;
                    }
                }

            } else {
                current.children = [];
            }

            if (!childFoundSteppingIntoIt) {
                //create new folder and start again
                currentPathArray.push(insertPathArray[0])

                let folder = {
                    name: insertPathArray[0],
                    path: currentPathArray.join("/"),
                    children: []
                }
                current.children.push(folder);
                current = folder;


                insertPathArray = insertPathArray.slice(1);
            }

        }

        // insert node
        if (!current.children) {
            current.children = [];
        }
        current.children.push(node);

    }

    public fillMapsWithNonExistingNodesFromOtherMap(leftMap: CodeMap, rightMap: CodeMap) {

        //null checks
        if(!leftMap || !rightMap || !leftMap.root || !rightMap.root){
            return;
        }

        //remove cross origin nodes from maps
        this.removeCrossOriginNodes(leftMap);
        this.removeCrossOriginNodes(rightMap);

        //build hash maps for fast search indices
        let firstLeafHashMap = new Map<string, CodeMapNode>();
        d3.hierarchy(leftMap.root).leaves().forEach((node: HierarchyNode<CodeMapNode>) => {
            firstLeafHashMap.set(node.data.path, node.data);
        });

        let secondLeafHashMap = new Map<string, CodeMapNode>();
        d3.hierarchy(rightMap.root).leaves().forEach((node: HierarchyNode<CodeMapNode>) => {
            secondLeafHashMap.set(node.data.path, node.data);
        });

        //insert nodes from the other map
        this.insertNodesIntoMapsAndHashmaps(firstLeafHashMap, secondLeafHashMap, leftMap, rightMap);
        this.insertNodesIntoMapsAndHashmaps(secondLeafHashMap, firstLeafHashMap, rightMap, leftMap);

        //calculate deltas between leaves
        firstLeafHashMap.forEach((node, path) => {
            let otherNode = secondLeafHashMap.get(path);
            otherNode.deltas = this.calculateAttributeListDelta(node.attributes, otherNode.attributes);
            node.deltas = this.calculateAttributeListDelta(otherNode.attributes, node.attributes);
        });

    }

    private removeCrossOriginNodes(map: CodeMap) {

            let mapRoot = d3.hierarchy<CodeMapNode>(map.root);
            mapRoot.each((node) => {
                if (node.data.children) {
                    node.data.children = node.data.children.filter(x => (x.origin === map.fileName));
                }
            });

    }

    private deepcopy(nodes: HierarchyNode<CodeMapNode>): HierarchyNode<CodeMapNode> {

        //deepcopy
        let copy: HierarchyNode<CodeMapNode> = deepcopy.default(nodes.copy()); //Hm this seems to be doing the right thing. First shallow copy then a deep copy ?!

        //make own attributes 0
        for (let property in copy.data.attributes) {
            if (copy.data.attributes.hasOwnProperty(property)) {
                copy.data.attributes[property] = 0;
            }
        }

        ////make all ancestors attributes 0
        copy.each((node) => {
            for (var property in node.data.attributes) {
                if (node.data.attributes.hasOwnProperty(property)) {
                    node.data.attributes[property] = 0;
                }
            }
        });

        return copy;

    }

    private deepcopy2(node: CodeMapNode): CodeMapNode {

        let h = d3.hierarchy(node);
        return this.deepcopy(h).data;

    }

    private calculateAttributeListDelta(first: KVObject, second: KVObject) {
        let deltas = {};
        for (var key in second) {
            if (key) {
                let firstValue = first[key] ? first[key] : 0; //assume zero if no value in first
                let secondValue = second[key];
                let delta = secondValue - firstValue;
                deltas[key] = delta;
            }
        }
        return deltas;
    }

}
