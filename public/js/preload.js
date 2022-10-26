let body = document.getElementById('the-body')
setTimeout(loadBody(), '10000')
function loadBody() {
    body.classList.remove('is-preload')
}