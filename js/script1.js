const video = document.querySelector('video');
let streamStarted = false;
let paused = false;
function toggleDevice(){
    if(streamStarted){
        paused ? video.play() : video.pause();
        paused = !paused;
    }else{
        accessCamera();
    }
}
async function accessCamera(){
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        video.srcObject = stream;
        streamStarted = true;
    }else{
        alert('no camera detected');
    }
}
// a short fetch call
function syntaxHighlight(json) {
    console.log('run syntax highlight');
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
async function fetchUrl(url) {
    console.log('run fetch');
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();
    return data;
}
async function output(loc) {
    console.log('run output');
    var inp = await fetchStock(loc);
    var str = syntaxHighlight(JSON.stringify(inp, undefined, 2));
    document.getElementById('stockData').appendChild(document.createElement('pre')).innerHTML = str;
}
const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 }, false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
console.log(html5QrcodeScanner);
function onScanSuccess(decodedText, decodedResult) {
    document.querySelector('#result span').innerHTML = decodedText;
    html5QrcodeScanner.html5Qrcode.stop();
}
function onScanFailure(error) {

}
  

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', ()=>{
//         navigator.serviceWorker.register('/sw.js')
//             .then(reg => {
//                 console.log('sw registered')
//             }).catch(err =>{
//                 console.log('registration failed', err);
//             })
//     });
// }