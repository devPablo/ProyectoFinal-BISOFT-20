class Matrix { 
    constructor() 
    { 
        this.matrix = new Array(50);
        this.fillMatrix();

    }

    fillMatrix(){
        for (let index = 0; index < 50; index++) {
            this.getMatrix()[index] = new Array(50);
        }
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