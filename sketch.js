const CANVASWIDTH = 1000;
const CANVASHEIGHT = 800;
const numTracks = 8;
const tracks = Array.from({length: numTracks});
const TRACKHEIGHT = CANVASHEIGHT/numTracks;


//settings defaults, later add knobs
let attack = 0.40;
let release = 0.40;
let density = 1.0;
let spread = 1.2;
let reverb = 0.5;
let pan = 0.1;
let trans = 1.25;


let pauses1 = [250, 250, 250, 125, 1000];
let pauseCount1 = 0;

let pauses2 = [100, 100, 100, 250];
let pauseCount2 = 0;

const voices = [];
const grains = [];
let voiceTracks = Array.from({length: numTracks});
voiceTracks.forEach((track, i) => {
    voiceTracks[i] = [];
});
// console.log(voiceTracks);

let grainDensity = 50, randomGrains = 50, grainCount = 0;



// console.log(pauses1, pauses2);
createSequentialGrain(pauses1, pauseCount1, 0, 0.5);


createSequentialGrain(pauses2, pauseCount2, 1, 2.0);

createSequentialGrain(pauses1, pauseCount1, 2, 2.0);

createSequentialGrain(pauses2, pauseCount2, 3, 2.0);




function setup(){
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    background(0);
}

function draw(){
   
    background(0);
    if(soundFileData){
        soundFileDatas.forEach((soundFileData, i) =>{
            drawWaveform(soundFileData, i);
        })
       
    } else {
        drawPlaceholders();
    }

    voiceTracks.forEach((track, i) => {
        if(track.length  > 0){
            track.forEach((voice) => {
                voice.grains.forEach(grain => {
                    grain.checkLife(millis());
                    // console.log(grain.alive);
                    if(grain.alive){
                        grain.display(i);
                    } else {
                        voice.grains.splice(grain.num,1);
                    }    
                })
            })
        }
    })


}



function createSequentialGrain(pauseArray, count, bufnum, rate){
    if(soundFileDatas[bufnum]){
        // console.log(bufnum);
        let v = new Voice(random(200), bufnum, attack, release, spread, density);
        v.addGrain(random(50, width-50), random(0, height), rate);
        voiceTracks[bufnum].push(v);
        
        count++
    }
    // console.log(pauseArray, count)
        setTimeout(() => createSequentialGrain(pauseArray, count, bufnum, rate), pauseArray[count % pauseArray.length])
}



function createRandomGrain(){
    // grainDensity = Math.floor(Math.random() * randomGrains + grainDensity);
  
    if(soundFileData){
    let v = new Voice(random(200), bufnum, attack, release, spread, density);
    v.addGrain(random(0, width), random(0, height));
    // grainCount++
    voices.push(v);
    }
}



function mousePressed(){
    grainDensity = Math.floor(Math.random() * randomGrains + grainDensity);
    let v = new Voice(random(200), bufnum, attack, release, spread, density);
    v.addGrain(mouseX, mouseY);
    grainCount++
    voices.push(v);
    const interval = random(100);
    // setTimeout( () => addGrain(v), interval);
}

function addGrain(v){
    v.addGrain(mouseX, mouseY);
    if(grainCount < grainDensity){
        const interval = random(100);
        setTimeout( () => addGrain(v), interval);
    }
}


function drawWaveform(soundFileData, trackNumber){
    const step = Math.ceil( soundFileData.length / width );
    const trackOffset = TRACKHEIGHT * trackNumber;
    const amp = (TRACKHEIGHT / 2); // 200
    

    for( var i=0; i < width; i++ ){
        var min = 1.0;
        var max = -1.0;
     
        for( j=0; j < step; j++) {
            
            var datum = soundFileData[(i * step) + j]; 

            if (datum < min){
                min = datum;
            }else if(datum > max){
                max = datum;
            }
                       
        }
        stroke(255);

        // i = 0 ...1000;
        //amp = 200
        //1 + min 
        rect(i, ((1 + min ) * amp) + trackOffset, 1, (Math.max(1, (max-min) * amp )));
        // ellipse(i, (1+min)*amp, 1, Math.max(1,(max-min)*amp))
    }
}

function drawPlaceholders(){
    tracks.forEach((track, i) => {
        
        stroke(255);
        text(`track ${i+1}`, 20, (i+1) * TRACKHEIGHT - TRACKHEIGHT * 0.75);
        line(0, (i+1) * TRACKHEIGHT, CANVASWIDTH, (i+1) * TRACKHEIGHT);
    })
    
}