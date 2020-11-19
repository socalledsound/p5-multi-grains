const drop = document.querySelector('#drop');
let buffer;
let soundFileData;
let soundFileDatas = [];
let nextTrackNumber = 0;

//init web audio context
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
const context = new AudioContext();
//master gain node
const master = context.createGain();
master.connect(context.destination);


drop.addEventListener("dragover",function(e){
    //prevents from loading the file in a new page
        e.preventDefault();
    },false);
    drop.addEventListener('drop',function(e){
        console.log(e);
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        console.log(file);
        const reader = new FileReader();
        reader.onload = function(e){
            let array = e.target.result;
            context.decodeAudioData(array,function(b){
                
                buffer = b;
                console.log(buffer);
                console.log(b);
                soundFileData = buffer.getChannelData(0);
                if(soundFileDatas.length < numTracks){
                    soundFileDatas.push(soundFileData)
                }
                
    
            },function(){
                console.log('loading failed');
                alert('loading failed');
            });
        }
        reader.readAsArrayBuffer(file);
    },false);