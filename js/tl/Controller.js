class Controller {
    constructor(nVertices) 
    { 
        this.graph = new Graph(nVertices);
    }

    getGraph(){
        return this.graph;
    }

    setGraph(pgraph){
        this.graph = pgraph;
    }

    //True: Se añadió, False: Ya existe y no se añadió
    addNewVertice(pnewVertice){
        if (!this.getGraph().valNewVertice(pnewVertice)){
            this.getGraph().addVertice(pnewVertice);
            return true; //Se logró añadir el vertice
        }
        return false; //El vertice ya existe
    }


    addNewEdge(overtice, dvertice, pcost, pflat){
        if(!this.getGraph().valNewEdge(overtice, dvertice) && !this.getGraph().valNewEdge(dvertice, overtice)){
            this.getGraph().addEdge(overtice, dvertice, pcost, pflat);
            return 0; //Se puede enlazar hacia ambos lados
        }else if(!this.getGraph().valNewEdge(overtice, dvertice) && this.getGraph().valNewEdge(dvertice, overtice)){
            this.getGraph().addEdge(overtice, dvertice, pcost, false);
            return -1; // Solo se puede enlazar de origen a destino
        }
        return -2; // Solo se puede enlazar de destino hacia origen
    }

    print(){
        this.getGraph().printGraph();
    }
}