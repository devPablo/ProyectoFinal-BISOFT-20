const svg = document.querySelector('#svg');
let paths = Array.from(svg.getElementsByTagName("path"));
const environment = document.querySelector('#environment');
let selectedCountries = [];

updatePathsListener();


function createVertex(x, y, name) {
    if (!selectedCountries.includes(name)) {
        let div = document.createElement('div');
        div.classList.add('vertexForm');
        div.style.top = y-20;
        div.style.left = x-20;
        div.innerText = name;

        div.setAttribute('x', x-20);
        div.setAttribute('y', y-20);
        div.setAttribute('selected', false);

        environment.appendChild(div);
        selectedCountries.push(div);

        div.addEventListener('click', (e) => {
            e.target.setAttribute('selected', true);
            playSound();
            checkCreateEdge();
        });
    }
}

function checkCreateEdge() {
    let vertex = [];
    for (let i = 0; i < selectedCountries.length; i++) {
        if (selectedCountries[i].attributes.selected.value == 'true') {
            vertex.push(selectedCountries[i]);
        }
    }
    console.log(vertex);
    if (vertex.length == 2) {
        selectedCountries.forEach(e => {
            e.setAttribute('selected', false);
        })
        createEdge(vertex[0], vertex[1]);
    }
}

function createEdge(source, destination) {
    console.log(source, destination)
    let line = `<line x1="${source.getAttribute('x')}" y1="${source.getAttribute('y')}" x2="${destination.getAttribute('x')}" y2="${destination.getAttribute('y')}" style="stroke:rgb(255,0,0);stroke-width:2" />`
    svg.innerHTML += line;
    updatePathsListener();
}

function playSound() {
    let audio = new Audio('./resources/pop.flac');
    audio.play();
}

function updatePathsListener() {
    paths = Array.from(svg.getElementsByTagName("path"));
    paths.forEach(e => {
        e.removeAttribute('style');
        e.classList.add('country');
        e.addEventListener('click', (x) => {
            console.log('x: ', x.x, 'y: ', x.y);
            let name = x.target.getAttribute('data-id');
            createVertex(x.x, x.y, name);
        });
    });
}