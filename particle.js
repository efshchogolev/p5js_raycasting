class Particle {
  constructor() {
    this.pos = createVector(width / 2, height / 2)
    this.diameter = 20

    this.rays = []

    for (let a = 0; a < 360; a += 1) {
      // for (let a = 0; a < 360; a += 36) {
      // луч через каждые 10 градусов
      // if (a === 36) {
      this.rays.push(new Ray(this.pos, radians(a)))
      // }
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

  attenuate(ray, startDist, endDist, obstAtt = 0) {
    // const length = p5.Vector.dist(this.pos.x, this.pos.y, width, height)
    // for (let ray of this.rays) {
    // let i = startDist
    for (let i = startDist; i < endDist; i++) {
      let FSPL = 20 * Math.log(2.4) + 10 * 2 * Math.log(i / 3) + 1 - 24
      let EIRP = 10
      let RSSI = EIRP - FSPL - obstAtt
      let magnitude = sqrt(ray.dir.x * ray.dir.x + ray.dir.y * ray.dir.y)
      let point = { point: { x: 0, y: 0 }, r: 0, g: 0, b: 0 }
      point.point.x = this.pos.x + (ray.dir.x / magnitude) * i
      point.point.y = this.pos.y + (ray.dir.y / magnitude) * i

      if (-85 <= Math.floor(RSSI) && Math.floor(RSSI) <= -80 && point) {
        point.r = 252
        point.g = 120
        point.b = 76
        // ray.points.push(point)
        ray.points[8] = point
      } else if (-80 <= Math.floor(RSSI) && Math.floor(RSSI) <= -75 && point) {
        point.r = 252
        point.g = 149
        point.b = 76
        // console.log(point)
        // ray.points.push(point)
        ray.points[7] = point
      } else if (-75 <= Math.floor(RSSI) && Math.floor(RSSI) <= -70 && point) {
        point.r = 250
        point.g = 177
        point.b = 76
        ray.points[6] = point
      } else if (-70 <= Math.floor(RSSI) && Math.floor(RSSI) <= -65 && point) {
        point.r = 250
        point.g = 206
        point.b = 76
        // ray.points.push(point)
        ray.points[5] = point
      } else if (-65 <= Math.floor(RSSI) && Math.floor(RSSI) <= -60 && point) {
        point.r = 249
        point.g = 234
        point.b = 76
        // ray.points.push(point)
        ray.points[4] = point
      } else if (-60 <= Math.floor(RSSI) && Math.floor(RSSI) <= -55 && point) {
        point.r = 232
        point.g = 247
        point.b = 76
        // ray.points.push(point)
        ray.points[3] = point
      } else if (-55 <= Math.floor(RSSI) && Math.floor(RSSI) <= -50 && point) {
        point.r = 204
        point.g = 247
        point.b = 76
        // ray.points.push(point)
        ray.points[2] = point
      } else if (-50 <= Math.floor(RSSI) && Math.floor(RSSI) <= -45 && point) {
        point.r = 175
        point.g = 246
        point.b = 75
        // ray.points.push(point)
        ray.points[1] = point
      } else if (-45 <= Math.floor(RSSI) && point) {
        point.r = 146
        point.g = 246
        point.b = 77
        // ray.points.push(point)
        ray.points[0] = point
      }
      // i++
    }
    return ray.points
  }

  look(walls) {
    for (let ray of this.rays) {
      // Проходим по всем лучам
      let points = [] // Массив точек пересечения луча со стенами
      let entersectPoints = []
      // let wallAtt = 0
      for (let wall of walls) {
        // Проходим по всем стенам
        const pt = ray.cast(wall) // Ищем точку пересечения луча со стеной
        if (pt) {
          points.push({ point: pt, wall })
          // Если точка существует - добавляем в массив
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
        let entersectPoint = 0
        let distBeforeIntersect = 0
        let distAfterIntersect = 0
        let wallAttenuation = 0
        let distForCalc = 0
        // points.pop()
        // console.log('новый луч')
        points.forEach((element, index, array) => {
          //первый участок (считаем атт)
          if (index === 0) {
            entersectPoint = element
            entersectPoints.push(entersectPoint)
            distAfterIntersect = p5.Vector.dist(this.pos, element.point)
            this.attenuate(ray, 0, distAfterIntersect, wallAttenuation)
          } else {
            //считаем атт на остальных участках
            distBeforeIntersect += distAfterIntersect
            wallAttenuation += entersectPoint.wall.att
            distAfterIntersect = dist(
              entersectPoint.point.x,
              entersectPoint.point.y,
              element.point.x,
              element.point.y
            )
            distForCalc =
              dist(
                entersectPoint.point.x,
                entersectPoint.point.y,
                element.point.x,
                element.point.y
              ) + distBeforeIntersect
            // console.log(distBeforeIntersect, '- dbi')
            // console.log(distAfterIntersect, '- dai')
            // console.log(distForCalc, '- dfc')
            entersectPoint = element
            entersectPoints.push(entersectPoint)
            this.attenuate(
              ray,
              distBeforeIntersect,
              distForCalc,
              wallAttenuation
            )
          }
        })
        // }
        //объединение точек пересечения и изменения цвета

        // ray.points = ray.points.concat(entersectPoints)
        // console.log(ray.points)
        // сортировка точек цвета с пересечением
        ray.points.sort((a, b) => {
          if (a && b) {
            return (
              dist(this.pos.x, this.pos.y, a.point.x, a.point.y) -
              dist(this.pos.x, this.pos.y, b.point.x, b.point.y)
            )
          }
        })

        // даём точкам пересечения цвета точек перелома, которые идут до точек пересечения
        let editedPoints = ray.points
        //   .map((point, index) => {
        //   if (index === 0 && !point.r) {
        //     point.r = 146
        //     point.g = 246
        //     point.b = 77
        //     return point
        //   }
        //   if (!point.r) {
        //     point.r = ray.points[index - 1].r
        //     point.g = ray.points[index - 1].g
        //     point.b = ray.points[index - 1].b
        //     return point
        //   }
        //   return point
        // })
        //рисование линий
        for (let i = 0; i < editedPoints.length; i++) {
          if (editedPoints[i]) {
            if (i === 0) {
              push()
              stroke(
                editedPoints[i].r,
                editedPoints[i].g,
                editedPoints[i].b
                // 200
              ) //-45
              strokeWeight(10)
              line(
                this.pos.x,
                this.pos.y,
                editedPoints[i].point.x,
                editedPoints[i].point.y
              )
              pop()
            }
            // return
            else {
              push()
              strokeWeight(10)
              stroke(
                editedPoints[i].r,
                editedPoints[i].g,
                editedPoints[i].b
                // 200
              )
              line(
                editedPoints[i - 1].point.x,
                editedPoints[i - 1].point.y,
                editedPoints[i].point.x,
                editedPoints[i].point.y
              )
              pop()
            }
          }
        }
        editedPoints = []
      }
      ray.points = []
    }
  }
}
