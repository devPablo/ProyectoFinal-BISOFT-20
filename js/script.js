const svg = document.querySelector('#svg');
let paths = Array.from(svg.getElementsByTagName("path"));
const environment = document.querySelector('#environment');
const edgeForm = document.querySelector('#edgeForm');
const btnCreateEdge = document.querySelector('#btnCreateEdge');
const table = document.querySelector('#table');

/* FLAGS */
let FLAG_ADJACENCIES = false;
let FLAG_SHORTEST_PATH = false;

btnCreateEdge.addEventListener('click', () => {
    executeBtnCreateEdge();
});
const inputCost = document.querySelector('#inputCost');
const directions = document.querySelectorAll('.direction');

/* Adjacency Form */
const adjacencyForm = document.querySelector('#adjacencyForm');
const btnShowAdjacencies = document.querySelector('#btnShowAdjacencies');
btnShowAdjacencies.addEventListener('click', () => {
    filterAdjacency(document.querySelector('#inputAdjacencyCountry').value);
    closeAdjacencyForm();
});
const showAdjancencies = document.querySelector('#showAdjacencies');
showAdjancencies.addEventListener('click', () => {
    if (FLAG_ADJACENCIES) {
        showAllMap();
    } else {
        showAdjacencyForm();
    }
});

/* Shortest Path Form */
const shortestPathForm = document.querySelector('#shortestPathForm');
const btnShowShortestPath = document.querySelector('#btnShowShortestPath');
const showShortestPath = document.querySelector('#showShortestPath');
btnShowShortestPath.addEventListener('click', () => {
    let data = executeDijkstra();
    showDijkstraPath(data);
});
showShortestPath.addEventListener('click', () => {
    if (FLAG_SHORTEST_PATH) {
        showAllMap();
    } else {
        showShortestPathForm();
    }
});


document.querySelector('body').addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {
        if (edgeForm.style.display == 'inline-block') {
            closeEdgeForm();
        }
        closeAdjacencyForm();
        closeShortestPathsForm();
    }
});

for (let i = 0; i < 2; i++) {
    directions[i].addEventListener('click', (e) => {
        e = e.target;
        resetDirectionSelected();
        e.classList.add('directionSelected');
        e.setAttribute('selected', true);
    });
}

let selectedCountries = [];
let selectedVertex = [];
let controller = new Controller(25);

updatePathsListener();
buildTable();

function createVertex(x, y, ele) {
    let repeated = false;
    selectedCountries.forEach(e => {
        if (e.innerText == ele.getAttribute('data-id')) {
            repeated = true;
        }
    });
    if (!repeated) {
        let div = document.createElement('div');
        div.classList.add('vertexForm');
        div.style.top = y - 20;
        div.style.left = x - 20;
        div.innerText = ele.getAttribute('data-id');

        div.setAttribute('x', x);
        div.setAttribute('y', y);
        div.setAttribute('selected', false);
        div.setAttribute('connections', '');

        environment.appendChild(div);
        selectedCountries.push(div);

        controller.addNewVertice(ele.getAttribute('data-id'));

        div.addEventListener('click', (e) => {
            e.target.setAttribute('selected', true);
            selectedVertex.push(e.target);
            playSound();
            checkCreateEdge();
        });
    }
}

function checkCreateEdge() {
    if (selectedVertex.length == 2) {
        showEdgeForm();
    }
}

function createEdge(source, destination, cost, bidirectional) {
    let line;
    let connections = source.innerText + ',' + destination.innerText + ';';
    if (bidirectional == 'true') {
        bidirectional = true;
        connections = source.innerText + ',' + destination.innerText + ';' + '' + destination.innerText + ',' + source.innerText + ';';
        line = `<line class="edge bidirectional" x1="${parseInt(source.getAttribute('x'))}" y1="${parseInt(source.getAttribute('y'))}" x2="${parseInt(destination.getAttribute('x'))}" y2="${parseInt(destination.getAttribute('y'))}" cost="${cost}" connections="${connections}" />`
    } else {
        line = `<line class="edge" x1="${parseInt(source.getAttribute('x'))}" y1="${parseInt(source.getAttribute('y'))}" x2="${parseInt(destination.getAttribute('x'))}" y2="${parseInt(destination.getAttribute('y'))}" cost="${cost}" connections="${connections}" />`
    }
    svg.innerHTML += line;
    updatePathsListener();

    controller.addNewEdge(source.innerText, destination.innerText, cost, bidirectional);
    buildTable();
}



function updatePathsListener() {
    paths = Array.from(svg.getElementsByTagName("path"));
    paths.forEach(e => {
        e.removeAttribute('style');
        e.classList.add('country');
        e.addEventListener('click', (x) => {
            let ele = x.target;
            if (selectedCountries.length < 25) {
                createVertex(x.x, x.y, ele);
            }
        });
    });
}

function playSound() {
    let audio = new Audio('./resources/pop.flac');
    audio.play();
}

// Edge Form

function showEdgeForm() {
    edgeForm.style.display = 'inline-block';
    inputCost.focus();
}

function closeEdgeForm() {
    edgeForm.style.display = 'none';
    resetDirectionSelected();
    inputCost.value = '';
    selectedVertex = [];
}

function executeBtnCreateEdge() {
    let cost = inputCost.value;
    let bidirectional = (document.querySelectorAll('.direction')[1].childNodes[0].getAttribute('selected'));
    createEdge(selectedVertex[0], selectedVertex[1], cost, bidirectional);
    closeEdgeForm();
}

function resetDirectionSelected() {
    directions[0].childNodes[0].classList.remove('directionSelected');
    directions[0].childNodes[0].setAttribute('selected', false);
    directions[1].childNodes[0].classList.remove('directionSelected');
    directions[1].childNodes[0].setAttribute('selected', false);
}

/* Adjacencies */
function getAdjacencies(country) {
    let adjacencies = [];
    let data = [];
    controller.getGraphCountryEdge(country).forEach(e => {
        data.push(e.edge)
        data.push(e.cost);

        for (let i = 0; i < environment.childNodes.length; i++) {
            if (environment.childNodes[i].innerText == e.edge) {
                data.push(environment.childNodes[i].getAttribute('x'));
                data.push(environment.childNodes[i].getAttribute('y'));
            }
        }

        adjacencies.push(data);
        data = [];
    });
    return adjacencies;
}

function filterAdjacency(country) {
    let adjacencies = getAdjacencies(country);
    let nameAdjacencyList = buildNameAdjacencyList(adjacencies);

    // Remove vertex
    environment.childNodes.forEach(e => {
        if (!nameAdjacencyList.includes(e.innerText) && e.innerText != country) {
            e.style.display = 'none';
        }
    });


    // Remove SVG line
    for (let i = 0; i < svg.childNodes.length; i++) {
        if (svg.childNodes[i].tagName == 'line') {
            if ((svg.childNodes[i].getAttribute('connections').split(';')[0].split(',')[0] != country) && (svg.childNodes[i].getAttribute('connections').length < 12)) {
                svg.childNodes[i].style.display = 'none';
            } else {
                let data = [];
                svg.childNodes[i].getAttribute('connections').split(';').forEach(e => {
                    e.split(',').forEach(f => { data.push(f) });
                });
                if (!data.includes(country)) {
                    svg.childNodes[i].style.display = 'none';
                }
            }
        }
    }

    FLAG_ADJACENCIES = true;
    showAdjancencies.classList.add('disable');
    showAdjancencies.innerText = 'Quit Adjacencies';
}

function buildNameAdjacencyList(adjacencies) {
    let data = [];
    adjacencies.forEach(e => { data.push(e[0]) });
    return data;
}

/* Show Adjacency Form */
function showAdjacencyForm() {
    adjacencyForm.style.display = 'inline-block';
    document.querySelector('#inputAdjacencyCountry').focus();
}

function closeAdjacencyForm() {
    document.querySelector('#inputAdjacencyCountry').value = '';
    adjacencyForm.style.display = 'none';
}

/* Show Entire Map (Vertex & Edge) */
function showAllMap() {
    FLAG_ADJACENCIES = false;
    FLAG_SHORTEST_PATH = false;

    showAdjancencies.classList.remove('disable');
    showAdjancencies.innerText = 'Show Adjacencies';

    showShortestPath.classList.remove('disable');
    showShortestPath.innerText = 'Show Shortest Path';

    environment.childNodes.forEach(e => {
        e.style.display = 'inline-block';
    });

    svg.childNodes.forEach(e => {
        if (e.tagName == 'path' || e.tagName == 'line') {
            e.style.display = 'inline-block';
        }
    });
    buildTable();
}

/* Dijkstra */

function setAdjacencyMatrix() {
    let matrix = controller.getGlobalMatrix();
    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {
            if (matrix[i][j] == undefined) {
                matrix[i][j] = Infinity;
            }
        }
    }
}

function executeDijkstra() {
    setAdjacencyMatrix();
    let originCode = document.querySelector('#inputShortestPathCountryOrigin').value.toUpperCase();
    let destinationCode = document.querySelector('#inputShortestPathCountryDestination').value.toUpperCase();

    let origin = controller.hash(originCode);
    let destination = controller.hash(destinationCode);

    let matrix = controller.getGlobalMatrix();

    var shortestPathInfo = controller.dijkstra(matrix, matrix.length, origin);
    var path = controller.dijkstraBuildPath(shortestPathInfo, destination);
    closeShortestPathsForm();
    path.unshift(origin);
    return path;
}

function showDijkstraPath(data) {
    let vertex = [];
    let countries = [];
    let costs = [];

    data.forEach(e => {
        vertex.push(parseInt(e));
    });

    environment.childNodes.forEach(e => {
        if (!vertex.includes(controller.hash(e.innerText))) {
            e.style.display = 'none';
        } else {
            countries.push(e.innerText);
        }
    });

    // Remove SVG line
    let lineToShow = [];

    for (let j = 0, k = 1; j < vertex.length; j++, k++) {
        for (let i = 0; i < svg.childNodes.length; i++) {
            if (svg.childNodes[i].tagName == 'line') {
                if ((controller.hash(svg.childNodes[i].getAttribute('connections').split(';')[0].split(',')[0]) == vertex[j]) &&
                    (controller.hash(svg.childNodes[i].getAttribute('connections').split(';')[0].split(',')[1]) == vertex[k])) {
                    if (!lineToShow.includes(svg.childNodes[i])) {
                        lineToShow.push(svg.childNodes[i]);
                        costs.push(svg.childNodes[i].getAttribute('cost'));
                    }
                } else {
                    if (svg.childNodes[i].getAttribute('connections').length == 12) {
                        if ((controller.hash(svg.childNodes[i].getAttribute('connections').split(';')[1].split(',')[0]) == vertex[j]) &&
                            (controller.hash(svg.childNodes[i].getAttribute('connections').split(';')[1].split(',')[1]) == vertex[k])) {
                            if (!lineToShow.includes(svg.childNodes[i])) {
                                lineToShow.push(svg.childNodes[i]);
                                costs.push(svg.childNodes[i].getAttribute('cost'));
                            }
                        }
                    }
                }
            }
        }
    }

    svg.childNodes.forEach(e => {
        if (e.tagName == 'line') {
            if (!lineToShow.includes(e)) {
                e.style.display = 'none';
            }
        }
    });

    buildDijkstraTable(countries, costs);
    FLAG_SHORTEST_PATH = true;
    showShortestPath.classList.add('disable');
    showShortestPath.innerText = 'Quit Shortest Path';
}

/* Show Shortest Path Form */
function showShortestPathForm() {
    shortestPathForm.style.display = 'inline-block';
    document.querySelector('#inputShortestPathCountryOrigin').focus();
}

function closeShortestPathsForm() {
    document.querySelector('#inputShortestPathCountryOrigin').value = '';
    document.querySelector('#inputShortestPathCountryDestination').value = '';
    shortestPathForm.style.display = 'none';
}

function buildDijkstraTable(countries, costs) {
    document.querySelector('#divTable').style.display = 'inline-block';
    document.querySelector('#tableBody').innerHTML = '';
    for (let i = 0; i < costs.length; i++) {
        let tr = document.createElement('tr');

        let tdOrigin = document.createElement('td');
        tdOrigin.innerText = countries[i];
        
        let tdDestination = document.createElement('td');
        tdDestination.innerText = countries[i+1];
        
        let tdCost = document.createElement('td');
        tdCost.innerText = costs[i];

        tr.appendChild(tdOrigin);
        tr.appendChild(tdDestination);
        tr.appendChild(tdCost);

        document.querySelector('#tableBody').appendChild(tr);
    }
}

function buildTable() {
    let countries = [];
    let costs = [];
    environment.childNodes.forEach(e => {
        controller.findLocation(e.innerText).edge.forEach(f => {
            countries.push(e.innerText);
            countries.push(f.edge);
            costs.push(f.cost);
        });
    });

    console.log(countries, costs);

    document.querySelector('#tableBody').innerHTML = '';
    for (let i = 0, j = 0; i < costs.length; i++, j += 2) {
        let tr = document.createElement('tr');

        let tdOrigin = document.createElement('td');
        tdOrigin.innerText = countries[j];
        
        let tdDestination = document.createElement('td');
        tdDestination.innerText = countries[j+1];
        
        let tdCost = document.createElement('td');
        tdCost.innerText = costs[i];

        tr.appendChild(tdOrigin);
        tr.appendChild(tdDestination);
        tr.appendChild(tdCost);

        document.querySelector('#tableBody').appendChild(tr);
    }
}