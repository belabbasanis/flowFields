// Use descriptive variable names and follow consistent formatting
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;

// Define the Particle class
class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
  }
  
  // Draw the particle on the canvas
  draw(context) {
    context.fillRect(this.x, this.y, 50, 50);
  }
}

// Define the Effect class
class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numberOfParticles = 50;
  }
  
  // Initialize the effect by creating a particle
  init() {
    for (let i = 0; i < this.numberOfParticles; i++){
    this.particles.push(new Particle(this));
    }
  }
  
  // Render the effect by drawing all particles on the canvas
  render(context) {
    this.particles.forEach(particle => {
      particle.draw(context);
    });
  }
}

// Create an instance of the Effect class with canvas dimensions
const effect = new Effect(canvas.width, canvas.height);

// Initialize the effect by creating a particle
effect.init();

// Render the effect by drawing all particles on the canvas
effect.render(ctx);

// Log the effect object to the console
console.log(effect);
