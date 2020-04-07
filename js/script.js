const svg = document.querySelector('#svg');
let paths = Array.from(svg.getElementsByTagName("path"));
const environment = document.querySelector('#environment');
const edgeForm = document.querySelector('#edgeForm');
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
        div.style.top = y-20;
        div.style.left = x-20;
        div.innerText = ele.getAttribute('data-id');

        div.setAttribute('x', x-10);
        div.setAttribute('y', y-10);
        div.setAttribute('selected', false);

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
        console.log(selectedVertex);
        createEdge(selectedVertex[0], selectedVertex[1], true);
        selectedVertex = [];
    }
}

function createEdge(source, destination, bidirectional) {
    let line;
    if (bidirectional) {
        line = `<line class="edge bidirectional" x1="${parseInt(source.getAttribute('x'))}" y1="${parseInt(source.getAttribute('y'))}" x2="${parseInt(destination.getAttribute('x'))}" y2="${parseInt(destination.getAttribute('y'))}" />`
    } else {
        line = `<line class="edge" x1="${parseInt(source.getAttribute('x'))}" y1="${parseInt(source.getAttribute('y'))}" x2="${parseInt(destination.getAttribute('x'))}" y2="${parseInt(destination.getAttribute('y'))}" />`
    }
    svg.innerHTML += line;
    updatePathsListener();

    controller.addNewEdge(source.innerText, destination.innerText, 100, true);
}



function updatePathsListener() {
    paths = Array.from(svg.getElementsByTagName("path"));
    paths.forEach(e => {
        e.removeAttribute('style');
        e.classList.add('country');
        e.addEventListener('click', (x) => {
            console.log('x: ', x.x, 'y: ', x.y);
            let ele = x.target;
            createVertex(x.x, x.y, ele);
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
}

function closeEdgeForm() {
    edgeForm.style.display = 'none';
}