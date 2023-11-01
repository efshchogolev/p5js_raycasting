// Класс Стены (Границы)
class Boundary {
  constructor(x1, y1, x2, y2, att) {
    this.a = createVector(x1, y1)
    this.b = createVector(x2, y2)
    this.att = att
  }

  // Функция, рисующая стену
  show() {
    stroke(255) // Цвет
    line(this.a.x, this.a.y, this.b.x, this.b.y)
  }
}
