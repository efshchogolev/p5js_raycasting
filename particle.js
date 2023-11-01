class Particle {
  constructor() {
    this.pos = createVector(width / 2, height / 2)
    this.diameter = 20

    this.rays = []

    for (let a = 0; a < 360; a += 0.5) {
      // луч через каждые 10 градусов
      this.rays.push(new Ray(this.pos, radians(a)))
    }
  }

  update(x, y) {
    this.pos.set(x, y)
  }

  show() {
    // for (let ray of this.rays) {
    //   ray.show()
    // }
    fill(255, 0, 0)
    ellipse(this.pos.x, this.pos.y, this.diameter)
  }

  attenuate() {
    // const length = p5.Vector.dist(this.pos.x, this.pos.y, width, height)
    for (let ray of this.rays) {
      let i = 0
      while (i < 700) {
        let FSPL = 20 * Math.log(2.4) + 10 * 2 * Math.log(i / 3) + 1 - 24
        let EIRP = 10
        let RSSI = EIRP - FSPL
        let magnitude = sqrt(ray.dir.x * ray.dir.x + ray.dir.y * ray.dir.y)
        let point = { x: 0, y: 0 }
        point.x = this.pos.x + (ray.dir.x / magnitude) * i
        point.y = this.pos.y + (ray.dir.y / magnitude) * i
        if (Math.round(RSSI) == -45) {
          ray.points[0] = point
        }
        if (Math.round(RSSI) == -50) {
          ray.points[1] = point
        }
        if (Math.round(RSSI) == -55) {
          ray.points[2] = point
        }
        if (Math.round(RSSI) == -60) {
          ray.points[3] = point
        }
        if (Math.round(RSSI) == -65) {
          ray.points[4] = point
        }
        if (Math.round(RSSI) == -70) {
          ray.points[5] = point
        }
        if (Math.round(RSSI) == -75) {
          ray.points[6] = point
        }
        if (Math.round(RSSI) == -80) {
          ray.points[7] = point
        }
        if (Math.round(RSSI) == -85) {
          ray.points[8] = point
        }
        i++
      }
      // console.log(ray.points)
      if (ray.points[0]) {
        stroke(146, 246, 77, 200) //-45
        line(this.pos.x, this.pos.y, ray.points[0].x, ray.points[0].y)
      }
      if (ray.points[1]) {
        stroke(175, 246, 75, 200) //-50
        line(ray.points[0].x, ray.points[0].y, ray.points[1].x, ray.points[1].y)
      }
      if (ray.points[2]) {
        stroke(204, 247, 76, 200) //-55
        line(ray.points[1].x, ray.points[1].y, ray.points[2].x, ray.points[2].y)
      }
      if (ray.points[3]) {
        stroke(232, 247, 76, 200) //-60
        line(ray.points[2].x, ray.points[2].y, ray.points[3].x, ray.points[3].y)
      }
      if (ray.points[4]) {
        stroke(249, 234, 76, 200) //-65
        line(ray.points[3].x, ray.points[3].y, ray.points[4].x, ray.points[4].y)
      }
      if (ray.points[5]) {
        stroke(250, 206, 76, 200) //-70
        line(ray.points[4].x, ray.points[4].y, ray.points[5].x, ray.points[5].y)
      }
      if (ray.points[6]) {
        stroke(250, 177, 76, 200) //-75
        line(ray.points[5].x, ray.points[5].y, ray.points[6].x, ray.points[6].y)
      }
      if (ray.points[7]) {
        stroke(252, 149, 76, 200) //-80
        line(ray.points[6].x, ray.points[6].y, ray.points[7].x, ray.points[7].y)
      }
      if (ray.points[8]) {
        stroke(252, 120, 76, 200)
        line(ray.points[7].x, ray.points[7].y, ray.points[8].x, ray.points[8].y)
      }
    }
  }

  look(walls) {
    for (let ray of this.rays) {
      // Проходим по всем лучам
      let points = [] // Массив точек пересечения луча со стенами
      for (let wall of walls) {
        // Проходим по всем стенам
        const pt = ray.cast(wall) // Ищем точку пересечения луча со стеной
        if (pt) {
          points.push(pt) // Если точка существует - добавляем в массив
        }
      }
      if (points) {
        points.sort((a, b) => {
          // Если точки существуют - сортируем их по приближённости к частице
          return p5.Vector.dist(this.pos, a) - p5.Vector.dist(this.pos, b)
        })
        for (var i = 0; i < points.length; i++) {
          // Луч до первой стены непрозрачен
          if (i === 0) {
            stroke(255, 255, 255)
            line(this.pos.x, this.pos.y, points[0].x, points[0].y)
          } else {
            stroke(255, 255, 255, 255 / (i + 1)) // Увеличениие прозрачности луча с каждой новой стеной
            // stroke(255 / i, 255 / (i + 1), 255 / (i + 2))
            line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y)
          }
        }
      }
    }
  }
}
