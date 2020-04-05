const svg = document.querySelector('#svg');
const paths = Array.from(svg.getElementsByTagName("path"));
const environment = document.querySelector('#environment');
let selectedCountries = [];

paths.forEach(e => {
    e.removeAttribute('style');
    e.classList.add('country');
    e.addEventListener('click', (x) => {
        console.log('x: ', x.x, 'y: ', x.y);
        let name = x.target.getAttribute('data-id');
        createVertex(x.x, x.y, name);
    });
});


function createVertex(x, y, name) {
    if (!selectedCountries.includes(name)) {
        let div = document.createElement('div');
        div.classList.add('vertexForm');
        div.style.position = 'absolute';
        div.style.top = y - 20;
        div.style.left = x - 20;
        div.innerText = name;
        environment.appendChild(div);
        selectedCountries.push(name);
    }
}