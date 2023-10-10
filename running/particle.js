class Particle {
    constructor() {
        this.pos = createVector(width / 2, height / 2)

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
        fill(255)
        ellipse(this.pos.x, this.pos.y, 4)
        for (let ray of this.rays) {
            ray.show()
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
                    return (
                        p5.Vector.dist(this.pos, a) -
                        p5.Vector.dist(this.pos, b)
                    )
                })
                for (var i = 0; i < points.length; i++) {
                    // Луч до первой стены непрозрачен
                    if (i === 0) {
                        stroke(255, 255, 255)
                        line(this.pos.x, this.pos.y, points[0].x, points[0].y)
                    } else {
                        stroke(255, 255, 255, 255 / (i + 1)) // Увеличениие прозрачности луча с каждой новой стеной
                        line(
                            points[i - 1].x,
                            points[i - 1].y,
                            points[i].x,
                            points[i].y
                        )
                    }
                }
            }
        }
    }
}
