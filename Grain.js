class Grain {
   
    constructor(num, buffer, positionx, positiony,attack,release,spread, rate){
        // console.log(rate);
       this.num = num;
        this.now = context.currentTime; //update the time value
        //create the source
        this.source = context.createBufferSource();
        this.source.playbackRate.value = this.source.playbackRate.value * rate;
        this.source.buffer = buffer;
        
        //create the gain for enveloping
        this.gain = context.createGain();
        this.gain.connect(master);


        this.source.connect(this.gain);
        //update the position and calcuate the offset
        
        this.positionx = positionx;
        this.positiony = positiony;

        this.offset = this.positionx * (buffer.duration / CANVASWIDTH); //pixels to seconds
        
        //update and calculate the amplitude
        this.amp = this.positiony / CANVASHEIGHT;
        this.amp = map(this.amp,0.0,1.0,1.0,0.0) * 0.7;
        
        //playback rate
        this.rate = rate;


        //parameters
        this.attack = attack * 0.4;
        this.release = release * 1.5;

        if(this.release < 0){
            this.release = 0.1; // 0 - release causes mute for some reason
        }
        this.spread = spread;
    
        this.randomoffset = (Math.random() * this.spread) - (this.spread / 2); //in seconds
        ///envelope

        this.alive = true;
        this.timeBorn = millis();
        this.lifespan = 500.0;

    }


    checkLife(currentTime){
        console.log(currentTime);
        const timeElapsed = currentTime - this.timeBorn;
        console.log(timeElapsed, this.lifespan);
        const val = 10;
        if(timeElapsed > this.lifespan){
            console.log('should return true');
            this.alive = false;
        }
        

        
        
    }


    display(){
        	//drawing the lines
	stroke(random(125) + 125, random(250), random(250)); //,(this.amp + 0.8) * 255
	// p.strokeWeight(this.amp * 5);
	this.randomoffsetinpixels = this.randomoffset / (buffer.duration / CANVASWIDTH);
	//p.background();
	line(this.positionx + this.randomoffsetinpixels, 0,this.positionx + this.randomoffsetinpixels, CANVASHEIGHT);

    }


    play(){
        const dur = this.attack + this.release;
        console.log(dur);
        this.source.start(this.now, this.offset + this.randomoffset, dur); //parameters (when,offset,duration)
        // this.source.start();
        
         this.gain.gain.setValueAtTime(0.0, this.now);
         this.gain.gain.linearRampToValueAtTime(this.amp,this.now + this.attack);
         this.gain.gain.linearRampToValueAtTime(0,this.now + (this.attack +  this.release) );
        
        //garbage collection
         this.source.stop(this.now + this.attack + this.release + 0.1); 
        var tms = (this.attack + this.release) * 1000; //calculate the time in miliseconds
        setTimeout(() => {
            this.gain.disconnect();
            // if(yes === 1){
            //     that.panner.disconnect();
            // }
        },tms + 200);
    }
}
