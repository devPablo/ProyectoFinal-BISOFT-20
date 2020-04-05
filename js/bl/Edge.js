// Definimos la clase Arista la cual almacena:
//      - La arista apuntada por un vertice
//      - La distancia entre la arista y el vertice
class Edge { 
    constructor(pedge, pcost) 
    { 
        this.edge = pedge; 
        this.cost = pcost;
    }

    getEdge(){
        return this.edge;
    }

    setEdge(pedge){
        this.edge = pedge;
    }

    getCost(){
        return this.cost;
    }

    setCost(pcost){
        this.cost = pcost;
    }
} 