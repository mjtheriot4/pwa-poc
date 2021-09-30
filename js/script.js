var isReady = false;
var isScanning = false;
var cameraId, stack, matched;
const html5QrCode = new Html5Qrcode("reader");
const config = {fps: 4,  qrbox: 200}
const button = document.querySelector('#actions .startStop');
const markScanned = document.querySelector('.markScanned');
const markUnscanned = document.querySelector('.markUnscanned');
const message = document.querySelector('.message');
function fetchStack(){
	fetch('js/data.json').then(res=>{
		if (!res.ok) {
			const message = `An error has occured: ${res.status}`;
			throw new Error(message);
		}
		return res.json();
	}).then(res=>{
		stack = res
		printStack(stack);
	})
}
function syntaxHighlight(json) {
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
function printStack(list){
	const newList = list.map(item => item.name +": "+ item.isScanned);
	document.querySelector('pre').innerHTML = syntaxHighlight(JSON.stringify(newList, null, 2));
}
function getReady() {
	Html5Qrcode.getCameras().then(devices => {
		if (!devices || devices.length == 0) {return;}
		cameraId = devices[0].id;
		startScanner()
		this.isReady = true;
	});
}
function stopScanner(){
	html5QrCode.stop().then((res)=>{
		document.getElementById('reader').innerHTML = '';
	})
	isScanning = false;
	button.innerHTML = 'Start';

}
function startScanner(){
	html5QrCode.start(cameraId, config, onScanSuccess).then(()=>{
		isScanning = true;
		button.innerHTML = 'Stop';
	});
}
function onScanSuccess(decodedText, decodedResult) {
	document.querySelector('#result span').innerHTML = decodedText;
	lookup(decodedText);
	stopScanner();
}
function lookup(item){
	const match = stack.find(i => item == i.name );
	matched = match;
	message.className = 'message open';
	if (!!match){
		message.innerHTML = 'MATCHED! ';
		message.innerHTML += match.name;
		button.disabled = true;
		if(match.isScanned){
			markScanned.disabled = true;
			markUnscanned.disabled = false;
		}else{
			markScanned.disabled = false;
			markUnscanned.disabled = true;
		}
	}else{
		message.innerHTML = 'NO MATCH!'
	}
}
function resetCurrent(){
	matched = null;
	button.disabled = false;
	markScanned.disabled = true;
	markUnscanned.disabled = true;
	printStack(stack);
}
fetchStack();
button.addEventListener('click', (e)=>{
	if(isReady === false){ getReady() }
	else if(isScanning === false){ startScanner() }
	else{ stopScanner() }
});
markScanned.addEventListener('click', (e)=>{
	matched.isScanned = true;
	resetCurrent();
});
markUnscanned.addEventListener('click', (e)=>{
	matched.isScanned = false;
	resetCurrent();
});

//********** */ offline stuff */ ***********
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