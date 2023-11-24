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
    const calculateColor = (RSSI) => {
      const colors = [
        { r: 252, g: 120, b: 76 },
        { r: 252, g: 149, b: 76 },
        { r: 250, g: 177, b: 76 },
        { r: 250, g: 206, b: 76 },
        { r: 249, g: 234, b: 76 },
        { r: 232, g: 247, b: 76 },
        { r: 204, g: 247, b: 76 },
        { r: 175, g: 246, b: 75 },
        { r: 146, g: 246, b: 77 },
      ]

      const index = Math.floor((RSSI + 85) / 5)
      return colors[index] || { r: 0, g: 0, b: 0 }
    }

    for (let i = startDist; i < endDist; i++) {
      const FSPL = 20 * Math.log(2.4) + 10 * 2 * Math.log(i / 3) + 1 - 24
      const EIRP = 10
      const RSSI = EIRP - FSPL - obstAtt
      const magnitude = Math.sqrt(ray.dir.x * ray.dir.x + ray.dir.y * ray.dir.y)
      const point = { point: { x: 0, y: 0 }, r: 0, g: 0, b: 0 }
      point.point.x = this.pos.x + (ray.dir.x / magnitude) * i
      point.point.y = this.pos.y + (ray.dir.y / magnitude) * i

      if (-85 <= Math.floor(RSSI) && Math.floor(RSSI) <= -45 && point) {
        const color = calculateColor(Math.floor(RSSI))
        ray.points[Math.floor((RSSI + 85) / 5)] = { ...point, ...color }
      }
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
        //объединение точек пересечения и изменения цвета
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
