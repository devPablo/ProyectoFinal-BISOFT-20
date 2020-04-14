class Controller {
    constructor(nVertices) {
        this.graph = new Graph(nVertices);
    }

    getGraph() {
        return this.graph;
    }

    setGraph(pgraph) {
        this.graph = pgraph;
    }

    //True: Se añadió, False: Ya existe y no se añadió
    addNewVertice(pnewVertice) {
        if (!this.getGraph().valNewVertice(pnewVertice)) {
            this.getGraph().addVertice(pnewVertice);
            return true; //Se logró añadir el vertice
        }
        return false; //El vertice ya existe
    }


    addNewEdge(overtice, dvertice, pcost, pflat) {
        if (!this.getGraph().valNewEdge(overtice, dvertice) && !this.getGraph().valNewEdge(dvertice, overtice)) {
            this.getGraph().addEdge(overtice, dvertice, pcost, pflat);
            return 0; //Se puede enlazar hacia ambos lados
        } else if (!this.getGraph().valNewEdge(overtice, dvertice) && this.getGraph().valNewEdge(dvertice, overtice)) {
            this.getGraph().addEdge(overtice, dvertice, pcost, false);
            return -1; // Solo se puede enlazar de origen a destino
        }
        return -2; // Solo se puede enlazar de destino hacia origen
    }

    findLocation(country) {
        return this.getGraph().getLocations().get(country);
    }

    getGraphCountryEdge(country) {
        return this.getGraph().getLocations().get(country).getEdge();
    }
    
    getGlobalMatrix() {
        return this.getGraph().getLocations().getMatrix().getMatrix();
    }

    hash(key) {
        return this.getGraph().getLocations().hash(key)
    }

    print() {
        this.getGraph().printGraph();
    }

    dijkstra(edges, numVertices, startVertex) {
        var done = new Array(numVertices);
        done[startVertex] = true;
        var pathLengths = new Array(numVertices);
        var predecessors = new Array(numVertices);
        for (var i = 0; i < numVertices; i++) {
            pathLengths[i] = edges[startVertex][i];
            if (edges[startVertex][i] != Infinity) {
                predecessors[i] = startVertex;
            }
        }
        pathLengths[startVertex] = 0;
        for (var i = 0; i < numVertices - 1; i++) {
            var closest = 0;
            var closestDistance = Infinity;
            for (var j = 0; j < numVertices; j++) {
                if (!done[j] && pathLengths[j] < closestDistance) {
                    closestDistance = pathLengths[j];
                    closest = j;
                }
            }
            done[closest] = true;
            for (var j = 0; j < numVertices; j++) {
                if (!done[j]) {
                    var possiblyCloserDistance = pathLengths[closest] + edges[closest][j];
                    if (possiblyCloserDistance < pathLengths[j]) {
                        pathLengths[j] = possiblyCloserDistance;
                        predecessors[j] = closest;
                    }
                }
            }
        }
        return {
            "startVertex": startVertex,
            "pathLengths": pathLengths,
            "predecessors": predecessors
        };
    }

    dijkstraBuildPath(shortestPathInfo, endVertex) {
        var path = [];
        while (endVertex != shortestPathInfo.startVertex) {
            path.unshift(endVertex);
            endVertex = shortestPathInfo.predecessors[endVertex];
        }
        return path;
    }
}