let player;
let mapgen;
let obstacles;

function setup() {
    createCanvas(1920, 1080)

    player = new Player("P" + random())
    
    mapgen = new MapGeneartor(width, height*20, 10)
    obstacles = mapgen.obstacles
    stickmans = []
    player.controller.position.set(mapgen.spawnPosition.x, mapgen.spawnPosition.y)
}

function draw() {
    background(220)

    player.update()
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].draw(player.camera.offsets.x, player.camera.offsets.y)
    }

    player.draw()
}