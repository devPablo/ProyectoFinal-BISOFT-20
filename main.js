c = new Controller(6);

var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F' ]; 
for (var i = 0; i < vertices.length; i++) { 
    console.log("Enlace existoso de vertice: " + vertices[i] + " " + c.addNewVertice(vertices[i])); 
    
}

console.log("Enlace existoso de vertice F: " + c.addNewVertice("F")); 

console.log("Se logró un doble enlace 1 " + c.addNewEdge('A','B',100,false)); // true

console.log("Se logró un doble enlace 2 " + c.addNewEdge('A','C',200,true)); // 0


console.log("Se logró un doble enlace 3 " + c.addNewEdge('B','A',100,true)); // -1


c.print();
