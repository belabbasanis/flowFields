// Use descriptive variable names and follow consistent formatting
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 0.8;

// Define the Particle class
class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX;
    this.speedY;
    this.speedModifier = Math.floor(Math.random() * 5 - 2);
    this.history = [{x: this.x, y: this.y}];
    this.maxLength = Math.floor(Math.random() * 240 + 10);
    this.angle = 0;
    this.timer = this.maxLength * 2;
    this.colors = ['#d9ed92', '#b5e48c', '#599d98c', '#76c893', '#52b69a'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
  }
  
  // Draw the particle on the canvas
  draw(context) {
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++){
        context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.strokeStyle = this.color;
    context.stroke();
  }
  update(){
    this.timer--;
    if (this.timer >= 1){
        let x = Math.floor (this.x / this.effect.cellSize);
        let y = Math.floor (this.y / this.effect.cellSize);
        let index = y * this.effect.cols + x;
        this.angle = this.effect.flowField[index];
    
        this.speedX = Math.cos(this.angle);
        this.speedY = Math.sin(this.angle);
        this.x += this.speedX * this.speedModifier;
        this.y += this.speedY * this.speedModifier;
        
        this.history.push({x: this.x, y:this.y});
        if (this.history.length > this.maxLength){
            this.history.shift();
        }
    } else if (this.history.length > 1) {
        this.history.shift();
    } else {
        this.reset();
    }
    
  }
  reset(){
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [{x: this.x, y: this.y}];
    this.timer = this.maxLength * 2;
  }
}

// Define the Effect class
class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numberOfParticles = 10000;
    this.cellSize = 24;
    this.rows;
    this.cols;
    this.flowField = [];
    this.curve = 0.7;
    this.zoom = 0.3;
    this.debug = true;
    this.init();

    window.addEventListener('keydown', e => {
        if (e.key === 'd') this.debug = !this.debug;
    })
  }
  
  
  init() {
    // Create flow field
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.flowField = [];
    for (let y =0; y < this.rows; y++){
        for (let x = 0; x < this.cols; x++){
            let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
            this.flowField.push(angle);
        }
    }
    console.log(this.flowField);

    // Initialize the effect by creating a particle
    for (let i = 0; i < this.numberOfParticles; i++){
    this.particles.push(new Particle(this));
    }
  }
  drawGrid(context){
    context.save();
    context.strokeStyle = '#22577a';
    context.lineWidth = 0.5;
    for (let c = 0; c < this.cols; c++){
        context.beginPath();
        context.moveTo(this.cellSize * c, 0);
        context.lineTo(this.cellSize * c, this.height);
        context.stroke();
    }
    for (let r = 0; r < this.rows; r++){
        context.beginPath();
        context.moveTo(0, this.cellSize * r);
        context.lineTo(this.width,this.cellSize * r);
        context.stroke();
    }
    context.restore();
  }

  // Render the effect by drawing all particles on the canvas
  render(context) {
    if (this.debug) this.drawGrid(context);
    this.drawGrid(context);
    this.particles.forEach(particle => {
      particle.draw(context);
      particle.update();
    });
  }
}

// Create an instance of the Effect class with canvas dimensions
const effect = new Effect(canvas.width, canvas.height);



// Log the effect object to the console
console.log(effect);


function animate(){
    // Render the effect by drawing all particles on the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}
animate();