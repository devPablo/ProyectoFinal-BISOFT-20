class HashMapClose { 
    constructor(pkeys, plocations) 
    { 
        this.key = pkeys
        this.locations = plocations
    }

    getKeys(){
        return this.key;
    }

    setKeys(pkeys){
        this.key = pkeys;
    }

    getLocations(){
        return this.locations;
    }

    setLocations(plocations){
        this.locations = plocations;
    }

    //La funcion get recibe la llave y devuelve los valores {BR, egde}
    get(pkey){
        //pkey: Puede ser USA
        //Se llama a la funcion de Hash para conocer la posición y retorna la Location
        return this.getLocations()[this.hash(pkey)];
    }

    //La funcion de hash recibe la llave y devuelve la posición del arreglo
    hash(pkey){
        let cont = 0;
        for (let i = 0; i<pkey.length; i++){
            switch(pkey[i]){
                case 'A':
                    cont = 1;
                break;
                case 'E':
                    cont = 2;
                break;
                case 'I':
                    cont = 3;
                break;
                case 'O':
                    cont = 4;
                break;
                case 'U':
                    cont = 5;
                break;   
            }
        } 
        return (pkey.charCodeAt()%50+cont);
    }

    //Setea un edge en la posición del arreglo que le llama
    push(pkey, pnewedge){
        this.getLocations()[this.hash(pkey)].getEdge().push(pnewedge);
    }

    set(pnewvertice, pvalues){
        this.getKeys().push(pnewvertice);
        this.getLocations()[this.hash(pnewvertice)] = new Location(pvalues);
    }

    keys(){
        return this.getKeys();
    }
}