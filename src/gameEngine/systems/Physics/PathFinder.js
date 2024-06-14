import { TileType } from "../../../data/enums";

class Node {
    nodeX;
    nodeY;
    walkable;
    parent;
    gCost;
    hCost;
    fCost;

    constructor(x, y, walkable) {
        this.nodeX = x;
        this.nodeY = y;
        this.walkable = walkable;
    }
}

export default class PathFinder {
    #searchList = [];
    #processedList = [];
    #nodeGrid;

    constructor(dungeonLevel) {
        this.#nodeGrid = [];
        for (let tile of dungeonLevel.grid) {
            const { x, y } = tile.position;
            const tileUnit = dungeonLevel.findTile(x, y).entity;
            const walkable = tile.type === TileType.floor && !tileUnit;
            this.#nodeGrid.push(new Node(x, y, walkable));
        }
    }

    #inSearch(node) {
        const nodeInSearch = this.#searchList.find(searchNode => node.nodeX === searchNode.nodeX && node.nodeY === searchNode.nodeY)
        
        return nodeInSearch;
    }

    #inProcessed(node) {
        const nodeInProcessed = this.#processedList.find(processedNode => node.nodeX === processedNode.nodeX && node.nodeY === processedNode.nodeY)
        
        return nodeInProcessed;
    }


    getPath(start, end) {
        const { x, y } = start;

        const startNode = this.#nodeGrid.find(node => node.nodeX === x && node.nodeY === y);
        
        this.#updateNodeCosts(startNode, start, end);
        this.#searchList.push(startNode);

        while (this.#searchList.length > 0) {
            // Get the most efficient unprocessed node (lowest fCost, lowest hCost if tied)
            this.#searchList.sort((a, b) => {
                if (a.f === b.f) {
                    return a.hCost - b.hCost;
                } else {
                    return a.fCost - b.fCost;
                }
            });

            const mostEfficientNode = this.#searchList.shift();
            this.#processedList.push(mostEfficientNode);

            if (mostEfficientNode.hCost === 1) {
                // End found, generate returned array
                const nodePath = [];
                
                nodePath.unshift(mostEfficientNode);
                let i = mostEfficientNode.gCost;
                
                while (i > 1) {
                    // Backtrack from the end node to the first path node
                    const nextPathNode = nodePath[0].parent;
                    nodePath.unshift(nextPathNode);
                    i = nextPathNode.gCost;
                }

                // Create a position object list from the path node list
                const path = nodePath.map(node => {
                    return {x: node.nodeX, y: node.nodeY};
                })

                // Delete start if its the first path node
                if (path[0].x === start.x && path[0].y === start.y) path.shift();
                // Add end if it's walkable
                const endNode = this.#nodeGrid.find(node => node.nodeX === end.x && node.nodeY === end.y);
                if (endNode.walkable) {
                    path.push(end);
                }

                if (path.length > 0) {
                    return path;
                } else {
                    return null;
                }
                
            } else {
                this.#getAdjacentNodes(mostEfficientNode, start, end);
            }
        }
        // If no more nodes to search and end not found, return a null path
        return null;
    }

    #getAdjacentNodes(parent, start, end) {
        for (let gridX = parent.nodeX - 1; gridX <= parent.nodeX + 1; gridX++) {
            for (let gridY = parent.nodeY - 1; gridY <= parent.nodeY + 1; gridY++) {
                
                if ((Math.abs(gridX - parent.nodeX) === 1 && Math.abs(gridY - parent.nodeY) === 1)) {
                    // Ignore diagonal tiles
                    continue;
                }
                
                const foundNode = this.#nodeGrid.find(node => node.nodeX === gridX && node.nodeY === gridY);

                if (foundNode) {
                    if (foundNode.walkable && !this.#inProcessed(foundNode)) {
                        const inSearch = this.#inSearch(foundNode);
                        if (inSearch) {
                            if (inSearch.gCost > parent.gCost + 1) {
                                this.#updateNodeCosts(inSearch, start, end, parent);
                            }
                        } else {
                            this.#updateNodeCosts(foundNode, start, end, parent);
                            this.#searchList.push(foundNode);
                        }
                    }            
                }
            }
        }
    }

    #updateNodeCosts(node, start, end, parent = null) {
        const { nodeX, nodeY } = node;
        if (parent) {
            node.parent = parent;
            node.gCost = parent.gCost + 1;
        } else {
            node.gCost = Math.abs(nodeX - start.x) + Math.abs(nodeY - start.y);
        }
        
        node.hCost = Math.pow(Math.abs(nodeX - end.x), 2) + Math.pow(Math.abs(nodeY - end.y), 2);

        node.fCost = node.gCost + node.hCost;
    }
}

