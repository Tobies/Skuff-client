class Obstacle {

    constructor(x, y, width, height) {
        this.x = x
        this.y = y 
        this.width = width
        this.height = height
    }

    AABBCollision(obstacle) {
        return (
            this.x < obstacle.x + obstacle.width &&
            this.x + this.width > obstacle.x &&
            this.y < obstacle.y + obstacle.height &&
            this.height + this.y > obstacle.y
        ) 
    }

    draw(xOffset=0, yOffset=0) {
        stroke(255, 0, 0)
        strokeWeight(5)
        noFill()
        rect(this.x - xOffset, this.y - yOffset, this.width, this.height)
    }

}

class MapGeneartor {

    constructor(w, h, seed) {
        this.width = w
        this.height = h
        this.obstacles = []
        this.spawnPosition = {x:this.width/2, y:this.height-5}
        randomSeed(seed)
        this.generate()
    }

    clamp(value, min_value, max_value){
        return max(min(value, max_value), min_value)
    }


    generate() {
        var border = 0.1
        var platform = 0.3
        this.obstacles.push(new Obstacle(0, 0, this.width*border, this.height))
        this.obstacles.push(new Obstacle(this.width - this.width*border, 0, this.width*border, this.height))
        this.obstacles.push(new Obstacle(0, this.height, this.width, 100))

        var lastPoint = this.height - 100
        var x = this.width/2
        while (lastPoint > 0) {
            x = this.clamp(x + (-0.5 + random())*this.width*platform, this.width*border, this.width*(1-border)-this.width*platform)
            this.obstacles.push(new Obstacle(
                x,
                lastPoint,
                this.clamp(
                    this.width*platform,
                    0,
                    this.width*(1-border)-x
                ),
                50
            ))
            lastPoint -= 200
        }
        

    }

}