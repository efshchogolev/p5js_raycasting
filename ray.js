// Класс Луча
// У нас получается обёртка вектора p5 вектором p5
class Ray {
  constructor(pos, angle) {
    this.pos = pos
    this.dir = p5.Vector.fromAngle(angle) // это метод, позволяющий создать вектор по углу
    this.points = []
  }

  // Метод, определяющий направление луча
  lookAt(x, y) {
    this.dir.x = x - this.pos.x
    this.dir.y = y - this.pos.y
    this.dir.normalize() // Установка длины вектора равной 1
  }

  // show() {
  //     stroke(255)

  //     // push и pop как бы ограничивают код, т.е.
  //     // преобразования между ними(перемещение нулевой точки например)
  //     // будет сброшено после pop
  //     push()
  //     translate(this.pos.x, this.pos.y) // перемещает начальную точку (0,0) в другое место
  //     line(0, 0, this.dir.x * 10, this.dir.y * 10)

  //     pop()
  // }

  // метод, определяющий точку пересечения стены и луча
  cast(wall) {
    // Начальная точка стены
    const x1 = wall.a.x
    const y1 = wall.a.y
    // Конечная точка стены
    const x2 = wall.b.x
    const y2 = wall.b.y

    // Начальная точка луча
    const x3 = this.pos.x
    const y3 = this.pos.y
    // "Конечная" точка луча
    const x4 = this.pos.x + this.dir.x
    const y4 = this.pos.y + this.dir.y

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4) // Знаменатель для t (если = 0 => ray || wall)

    if (den == 0) {
      return
    }
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den

    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector()
      pt.x = x1 + t * (x2 - x1)
      pt.y = y1 + t * (y2 - y1)
      return pt
    } else {
      return
    }
  }
}
