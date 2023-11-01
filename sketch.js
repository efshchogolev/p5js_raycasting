let walls = [] // Boundary
// let ray
let particles = []

function setup() {
  createCanvas(1000, 1000)

  // Создание случайных стен
  for (let i = 0; i < 5; i++) {
    let x1 = random(width)
    let x2 = random(width)
    let y1 = random(height)
    let y2 = random(height)
    walls[i] = new Boundary(x1, y1, x2, y2, 3)
  }

  // Создание границ
  walls.push(new Boundary(0, 0, width, 0))
  walls.push(new Boundary(width, 0, width, height))
  walls.push(new Boundary(width, height, 0, height))
  walls.push(new Boundary(0, height, 0, 0))
  particles.push(new Particle())
  // particles.push(new Particle())
  // for (let particle of particles) {
  //   // particle.show()
  // }
}

let dragParticle = null

function draw() {
  background(0)
  for (let wall of walls) {
    wall.show()
  }

  for (let particle of particles) {
    particle.attenuate()
    // particle.look(walls)
    particle.show()
  }
}

function mousePressed() {
  for (let i = particles.length - 1; i >= 0; i--) {
    if (mouseInParticle(particles[i].pos, particles[i].diameter / 2)) {
      // console.log(particles.splice(i, 1))
      dragParticle = particles.splice(i, 1)
      dragParticle[0].update(mouseX, mouseY)
      particles.push(dragParticle[0])
      break
    }
  }
}

function mouseDragged() {
  if (dragParticle) {
    dragParticle[0].update(mouseX, mouseY)
  }
}

function mouseReleased() {
  dragParticle = null
}

function mouseInParticle(pos, radius) {
  return dist(mouseX, mouseY, pos.x, pos.y) < radius
}
