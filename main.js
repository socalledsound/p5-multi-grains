let buffer,buffer2; 

// for the audio buffer
let data = [];
//for the
let drawingData = [];
//
let voicesmono = [];
let isLoaded = false;

let X = 0, Y = 0;

let mouseState = false;

//control initial settings
let attack = 0.40;
let release = 0.40;
let density = 100.0;
let spread = 1.2 * 4;
let reverb = 0.5;
let pan = 0.1;
let trans = 1;


function playSound(context, master){
    let offSet = grains.mouseX * (buffer.duration / w);
    console.log(offSet);
    let amp = grains.mouseY /h;
    amp = grains.map(amp, 0.0, 1.0, 1.0, 0.0) * 0.7;
    console.log(amp);
    
    let dur =  (attack * 0.4) + (release * 1.5);
    
    let randomoffset = (Math.random() * spread) - (spread / 2);

    let now = context.currentTime;

    const gain = context.createGain();
    gain.connect(master);

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);

    offSet = offSet + randomoffset;
    console.log(offSet);

    source.start(now, offSet + randomoffset, dur);

    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(amp, now + attack);
    gain.gain.linearRampToValueAtTime(0, now + (attack +  release) );
    

    source.stop(now + dur/2 + 0.1); 
}

//constants for the view, for now
const w = 1000;
const h = 800;

// get DOM
const drop = document.querySelector('#drop');
const canvasContainer1 = document.querySelector('#canvas-container-1');
const canvasContainer2 = document.querySelector('#canvas-container-2');
drop.style.opacity = '1.0';
canvasContainer1.style.opacity = '0.0';
canvasContainer2.style.opacity = '0.0';

//this will be the p5 grainsDisplay sketch
let grains;


    //mouse events
    canvasContainer2.addEventListener('mousedown', ()=>{
        mouseState = true;
		
		if(mouseState){
			let v = new Voice();
			v.playMouse(grains);
            voicesmono.push(v); //have in the array
            // const density = Math.floor(Math.random() * 100 + 1);
            // for(let i = 0; i < density; i++){
            //     setTimeout(()=> {
            //         playSound(context, master)
            //     }, Math.random()*1000);
            // }
            
		}
    })
    canvasContainer2.addEventListener('mouseup', () => {
        mouseState = false;
        console.log(voicesmono);
		for(var i = 0; i < voicesmono.length;i++){
			voicesmono[i].stop();
			voicesmono.splice(i, 1);
        }
        console.log(voicesmono);
		setTimeout(function(){
            // const waveform = new p5(displayWaveform, canvasContainer1);
			// grains.background(0, 0);
		},300);
    })
	
    canvasContainer2.addEventListener('mousemove', ()=> {
		X = grains.mouseX;
		Y = grains.mouseY;
	});
	//safety for when the mouse is out of the canvas
	document.addEventListener('mousemove', (e) => {
		if(e.target.id !== 'canvasContainer2'){
			for(var i = 0; i < voicesmono.length;i++){
				voicesmono[i].stop();
				voicesmono.splice(i);
				setTimeout(function(){
                    //  grains.background(0, 120);
                    //  const waveform = new p5(displayWaveform, canvasContainer1);
                    //  voicesmono.forEach(voice => {
                    //      voice.grains.forEach(grain => {
                    //         grain.play();
                    //         grain.display();
                    //      })
                    //  })

                    
				},300);
			}
		}
    });


