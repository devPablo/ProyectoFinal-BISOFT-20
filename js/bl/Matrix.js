class Matrix { 
    constructor() 
    { 
        this.matrix = [50][50];
    }

    getMatrix(){
        return this.matrix;
    }

    setMatrix(pmatrix){
        this.matrix = pmatrix;
    }

    pushEdge(oindex, dindex, cost){
        this.getMatrix()[dindex][oindex] = cost;
    }

}