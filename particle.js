class Particle {
  constructor() {
    this.pos = createVector(width / 2, height / 2)
    this.diameter = 20

    this.rays = []

    for (let a = 0; a < 360; a += 1) {
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

  attenuate(ray, startDist = 0, endDist = 700, obstAtt = 0) {
    // const length = p5.Vector.dist(this.pos.x, this.pos.y, width, height)
    // for (let ray of this.rays) {
    // let i = startDist
    for (let i = startDist; i < endDist; i++) {
      let FSPL = 20 * Math.log(2.4) + 10 * 2 * Math.log(i / 3) + 1 - 24
      let EIRP = 10
      let RSSI = EIRP - FSPL - obstAtt
      let magnitude = sqrt(ray.dir.x * ray.dir.x + ray.dir.y * ray.dir.y)
      let point = { x: 0, y: 0, r: 0, g: 0, b: 0 }
      point.x = this.pos.x + (ray.dir.x / magnitude) * i
      point.y = this.pos.y + (ray.dir.y / magnitude) * i
      if (Math.round(RSSI) == -45) {
        point.r = 146
        proint.g = 246
        point.b = 77
        ray.points[0] = point
      } else if (Math.round(RSSI) == -50) {
        point.r = 175
        proint.g = 246
        point.b = 75
        ray.points[1] = point
      } else if (Math.round(RSSI) == -55) {
        point.r = 204
        proint.g = 247
        point.b = 76
        ray.points[2] = point
      } else if (Math.round(RSSI) == -60) {
        point.r = 232
        proint.g = 247
        point.b = 76
        ray.points[3] = point
      } else if (Math.round(RSSI) == -65) {
        point.r = 249
        proint.g = 234
        point.b = 76
        ray.points[4] = point
      } else if (Math.round(RSSI) == -70) {
        point.r = 250
        proint.g = 206
        point.b = 76
        ray.points[5] = point
      } else if (Math.round(RSSI) == -75) {
        point.r = 250
        proint.g = 177
        point.b = 76
        ray.points[6] = point
      } else if (Math.round(RSSI) == -80) {
        point.r = 252
        proint.g = 149
        point.b = 76
        ray.points[7] = point
      } else if (Math.round(RSSI) == -85) {
        point.r = 252
        proint.g = 120
        point.b = 76
        ray.points[8] = point
      }
      // i++
    }
    // console.log(ray.points)
    return ray.points
    // if (ray.points[0]) {
    //   stroke(146, 246, 77, 200) //-45
    //   line(this.pos.x, this.pos.y, ray.points[0].x, ray.points[0].y)
    // }
    // if (ray.points[1]) {
    //   stroke(175, 246, 75, 200) //-50
    //   line(ray.points[0].x, ray.points[0].y, ray.points[1].x, ray.points[1].y)
    // }
    // if (ray.points[2]) {
    //   stroke(204, 247, 76, 200) //-55
    //   line(ray.points[1].x, ray.points[1].y, ray.points[2].x, ray.points[2].y)
    // }
    // if (ray.points[3]) {
    //   stroke(232, 247, 76, 200) //-60
    //   line(ray.points[2].x, ray.points[2].y, ray.points[3].x, ray.points[3].y)
    // }
    // if (ray.points[4]) {
    //   stroke(249, 234, 76, 200) //-65
    //   line(ray.points[3].x, ray.points[3].y, ray.points[4].x, ray.points[4].y)
    // }
    // if (ray.points[5]) {
    //   stroke(250, 206, 76, 200) //-70
    //   line(ray.points[4].x, ray.points[4].y, ray.points[5].x, ray.points[5].y)
    // }
    // if (ray.points[6]) {
    //   stroke(250, 177, 76, 200) //-75
    //   line(ray.points[5].x, ray.points[5].y, ray.points[6].x, ray.points[6].y)
    // }
    // if (ray.points[7]) {
    //   stroke(252, 149, 76, 200) //-80
    //   line(ray.points[6].x, ray.points[6].y, ray.points[7].x, ray.points[7].y)
    // }
    // if (ray.points[8]) {
    //   stroke(252, 120, 76, 200)
    //   line(ray.points[7].x, ray.points[7].y, ray.points[8].x, ray.points[8].y)
    // }
    // }
  }

  look(walls) {
    for (let ray of this.rays) {
      // Проходим по всем лучам
      let points = [] // Массив точек пересечения луча со стенами
      // let wallAtt = 0
      for (let wall of walls) {
        // console.log(wallAtt, wall.att)
        // Проходим по всем стенам
        const pt = ray.cast(wall) // Ищем точку пересечения луча со стеной
        if (pt) {
          points.push({ point: pt, wall })
          // wallAtt -= wall.att // Если точка существует - добавляем в массив
        }
      }

      if (points) {
        points.sort((a, b) => {
          // Если точки существуют - сортируем их по приближённости к частице
          return (
            p5.Vector.dist(this.pos, a.point) -
            p5.Vector.dist(this.pos, b.point)
          )
        })
        // console.log(points[0])
        if (points.length === 1) {
          this.attenuate(
            ray,
            0,
            dist(this.pos.x, this.pos.y, points[0].point.x, points[0].point.y),
            0
          )
        } else {
          let entersectPoint = 0
          let distBeforeIntersect = 0
          let distAfterIntersect = 0
          let wallAttenuation = 0
          for (let i = 0; i < points.length; i++) {
            if (i === 0) {
              entersectPoint = points[i]
              distBeforeIntersect = dist(this.pos, points[i])
              this.attenuate(ray, 0, distBeforeIntersect, 0)
              // console.log(ray.points)
            } else {
              distAfterIntersect = dist(entersectPoint, points[i])
              // console.log(entersectPoint.wall)
              wallAttenuation -= entersectPoint.wall.att
              this.attenuate(
                ray,
                distBeforeIntersect,
                distAfterIntersect,
                wallAttenuation
              )
              entersectPoint = points[i]
              distBeforeIntersect = distAfterIntersect
            }
          }
        }
        // if (points.length > 1) {
        //   for (let i = 0; i < points.length - 1; i++) {
        //     let startPointsDistance
        //     let endPointsDistance
        //     // Луч до первой стены непрозрачен
        //     if (i === 0) {
        //       endPointsDistance = dist(
        //         this.pos.x,
        //         this.pos.y,
        //         points[i].point.x,
        //         points[i].point.y
        //       )
        //       this.attenuate(ray, 0, endPointsDistance, 0)
        //     } else if (i === 1) {
        //       startPointsDistance = dist(
        //         this.pos.x,
        //         this.pos.y,
        //         points[i].point.x,
        //         points[i].point.y
        //       )
        //       endPointsDistance = dist(
        //         points[i - 1].point.x,
        //         points[i - 1].point.y,
        //         points[i].point.x,
        //         points[i].point.y
        //       )
        //       this.attenuate(
        //         ray,
        //         startPointsDistance,
        //         endPointsDistance,
        //         wallAtt
        //       )
        //     } else {
        //       startPointsDistance = dist(
        //         this.pos.x,
        //         this.pos.y,
        //         points[i].point.x,
        //         points[i].point.y
        //       )
        //       endPointsDistance = dist(
        //         points[i].point.x,
        //         points[i].point.y,
        //         points[i + 1].point.x,
        //         points[i + 1].point.y
        //       )
        //       this.attenuate(
        //         ray,
        //         startPointsDistance,
        //         endPointsDistance,
        //         wallAtt
        //       )
        //     }
        //   }
        // } else {
        //   this.attenuate(
        //     ray,
        //     0,
        //     dist(this.pos.x, this.pos.y, points[0].point.x, points[0].point.y),
        //     0
        //   )
        // }

        //рисование линий
        for (let i = 0; i < ray.points.length; i++) {
          if (i === 0 && ray.points[0]) {
            stroke(146, 246, 77, 200) //-45
            line(this.pos.x, this.pos.y, ray.points[0].x, ray.points[0].y)
          } else {
            if (i === 1 && ray.points[1] && ray.points[0]) {
              stroke(175, 246, 75, 200) //-50
              line(
                ray.points[i - 1].x,
                ray.points[i - 1].y,
                ray.points[i].x,
                ray.points[i].y
              )
            }
            if (i === 2 && ray.points[2] && ray.points[1]) {
              stroke(204, 247, 76, 200) //-55
              line(
                ray.points[i - 1].x,
                ray.points[i - 1].y,
                ray.points[i].x,
                ray.points[i].y
              )
            }
            if (i === 3 && ray.points[3] && ray.points[2]) {
              stroke(232, 247, 76, 200) //-60
              line(
                ray.points[i - 1].x,
                ray.points[i - 1].y,
                ray.points[i].x,
                ray.points[i].y
              )
            }
            if (i === 4 && ray.points[4] && ray.points[3]) {
              stroke(249, 234, 76, 200) //-65
              line(
                ray.points[i - 1].x,
                ray.points[i - 1].y,
                ray.points[i].x,
                ray.points[i].y
              )
            }
            if (i === 5 && ray.points[5] && ray.points[4]) {
              stroke(250, 206, 76, 200) //-70
              line(
                ray.points[i - 1].x,
                ray.points[i - 1].y,
                ray.points[i].x,
                ray.points[i].y
              )
            }
            if (i === 6 && ray.points[6] && ray.points[5]) {
              stroke(250, 177, 76, 200) //-75
              line(
                ray.points[i - 1].x,
                ray.points[i - 1].y,
                ray.points[i].x,
                ray.points[i].y
              )
            }
            if (i === 7 && ray.points[7] && ray.points[6]) {
              stroke(252, 149, 76, 200) //-80
              line(
                ray.points[i - 1].x,
                ray.points[i - 1].y,
                ray.points[i].x,
                ray.points[i].y
              )
            }
            if (i === 8 && ray.points[8] && ray.points[7]) {
              stroke(252, 120, 76, 200)
              line(
                ray.points[i - 1].x,
                ray.points[i - 1].y,
                ray.points[i].x,
                ray.points[i].y
              )
            }
          }
        }
      }
      ray.points = []
    }
  }
}
