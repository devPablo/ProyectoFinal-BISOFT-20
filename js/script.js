const svg = document.querySelector('#svg');
const paths = Array.from(svg.getElementsByTagName("path"));
paths.forEach(e => {
    e.removeAttribute('style');
    e.classList.add('country');
    e.addEventListener('click', (x) => {
        console.log(x.target.getAttribute('data-id'));
    });
});