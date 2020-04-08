const svg = document.querySelector('#svg');
let paths = Array.from(svg.getElementsByTagName("path"));
const environment = document.querySelector('#environment');
const edgeForm = document.querySelector('#edgeForm');
const btnCreateEdge = document.querySelector('#btnCreateEdge');
btnCreateEdge.addEventListener('click', () => {
    executeBtnCreateEdge();
});
const inputCost = document.querySelector('#inputCost');
const directions = document.querySelectorAll('.direction');
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
        connections = source.innerText + ',' + destination.innerText + ';' + '' + destination.innerText + ',' + source.innerText + ';';
        line = `<line class="edge bidirectional" x1="${parseInt(source.getAttribute('x'))}" y1="${parseInt(source.getAttribute('y'))}" x2="${parseInt(destination.getAttribute('x'))}" y2="${parseInt(destination.getAttribute('y'))}" cost="${cost}" connections="${connections}" />`
    } else {
        line = `<line class="edge" x1="${parseInt(source.getAttribute('x'))}" y1="${parseInt(source.getAttribute('y'))}" x2="${parseInt(destination.getAttribute('x'))}" y2="${parseInt(destination.getAttribute('y'))}" cost="${cost}" connections="${connections}" />`
    }
    svg.innerHTML += line;
    updatePathsListener();

    controller.addNewEdge(source.innerText, destination.innerText, cost, bidirectional);
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
}

function executeBtnCreateEdge() {
    let cost = inputCost.value;
    let bidirectional = (document.querySelectorAll('.direction')[1].childNodes[0].getAttribute('selected'));
    createEdge(selectedVertex[0], selectedVertex[1], cost, bidirectional);
    selectedVertex = [];
    inputCost.value = '';
    resetDirectionSelected();
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
    controller.getGraph().getLocations().get(country).forEach(e => {
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
    console.log(nameAdjacencyList);

    // Remove vertex
    environment.childNodes.forEach(e => {
        if (!nameAdjacencyList.includes(e.innerText) && e.innerText != country) {
            e.style.display = 'none';
        }
    });


    // Remove SVG line
    for (let i = 0; i < svg.childNodes.length; i++) {
        if (svg.childNodes[i].tagName == 'line') {
            let connectionList = svg.childNodes[i].getAttribute('connections').split(';');
            if (svg.childNodes[i].getAttribute('connections').split(';')[0].split(',')[0] != country) {
                svg.childNodes[i].style.display = 'none';
            }
        }
    }
}

function buildNameAdjacencyList(adjacencies) {
    let data = [];
    adjacencies.forEach(e => { data.push(e[0]) });
    return data;
}