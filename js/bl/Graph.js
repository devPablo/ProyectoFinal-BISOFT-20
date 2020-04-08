// Definimos la clase Grafo la cual almacena:
//      - El número de vertices (ubicaciones del mapa)
//      - Una lista de adyacencia que posee Aristas (Edge) 
class Graph { 
    constructor(pnVertices) 
    { 
        this.nVertices =  pnVertices
        this.locations = new Map();
    }
    getNVertices(){
        return this.nVertices;
    }

    setNVertices(pnVertices){
        this.nVertices = pnVertices;
    }

    getLocations(){
        return this.locations;
    }

    setLocations(plocations){
        this.locations = plocations;
    }

    //Esta función está encargada de validar si el vertice
    //que se intenta agregar ya existe 
    //True: Existe, False: No existe 
    valNewVertice(newVertice) { 
        (this.getLocations().get(newVertice) == 'undefined') ? false : true;
    } 

    //Esta función permite añadir un vertice con su lista de 
    //aristas adyacentes (inicialmente vacia)

    addVertice(newVertice){
        this.getLocations().set(newVertice, []);
    }

    //Esta funcion valida que la arista que se va añadir 
    //no exista
    valNewEdge(overtice, dvertice){
        //Validamos que la lista de aristas no esté vacía para no tener
        //que recorrer el for innecesariamente
        if(!this.getLocations().get(overtice).length == 0){
            //Iteramos por las aristas de nuestro vertice de origen
            for (let i = 0; i < this.getLocations().get(overtice).length; i++){
                //Si existe una arista de nuestro vertice de origen igual a la que 
                //se envia por parametro retornamos true (ya existe)
                if (this.getLocations().get(overtice)[i].getEdge() == dvertice){
                    return true;
                }
            }
        }
        //Si nunca la encuentra retorna false (no existe) 
        return false;
    }

    //Esta función se encarga de añadir una arista al
    //vertice que está siendo mapeado
    //recibe el vertice de origen, vertice destino, el costo
    //y true o false para saber si es reciproco o no
    addEdge(overtice, dvertice, pcost, pflat){
        var edge = new Edge(dvertice, pcost);
        if (pflat == true){
            this.getLocations().get(overtice).push(edge);
            var edge = new Edge(overtice, pcost);
            this.getLocations().get(dvertice).push(edge);
        }else{
            this.getLocations().get(overtice).push(edge);
        }
    }

    //Esta función es para testear el grafo
    printGraph() { 
        //Itero los vertices
        for (var i of this.getLocations().keys())  {  
            //Inicializo el string que guardará la info
            var conc = ""; 
  
            //Obtengo las atistas de los vertices e
            //itero a traves de ellas
            for (var j of this.getLocations().get(i))
                //j = [edge, edge, edge] 
                conc += " Vertice destino: " + j.getEdge() + ", Costo: " + j.getCost(); 
  
            // print the vertex and its adjacency list 
            console.log("Vertice origen: " + i + " ---> " + conc); 
        }
    } 
    
    // bfs(v) 
    // dfs(v) 
}