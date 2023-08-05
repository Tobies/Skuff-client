class Player {
    constructor(name) {
        this.networkManager = new NetworkManager("10.0.0.2", 25565)
        this.controller = new PlayerController()
        this.stickman = new Stickman(this.controller.position.x, this.controller.position.y)
        this.visibleStickmen = []
        this.camera = new Camera(this.controller.position.x, this.controller.position.y, width, height)
        this.networkManager.login(name)
    }

    handleErrors() {
        if (this.networkManager.output.error) {
            this.networkManager.destroy()
        }
        return !this.networkManager.output.error
    }

    updateStickman() {
        if (this.networkManager.output.name != null && this.stickman.name == null) {
            this.stickman.name = this.networkManager.output.name
        }
        this.stickman.x = this.camera.offsets.midX
        this.stickman.y = this.camera.offsets.midY
        if (this.controller.inputs.x != 0) {
            this.stickman.enableWalkingAnimation()
            this.stickman.direction = this.controller.inputs.x
        } else {
            this.stickman.enableIdleAnimation()
        }
    }

    sendUpdatePacket() {
        this.networkManager.sendPacket(1, [this.controller.position.x, this.controller.position.y, this.controller.inputs.x])
    }

    removeStickmen() {
        var stickmenToRemove = []
        for (var stickman in this.visibleStickmen) {
            if (!(stickman in this.networkManager.output.players)) {
                stickmenToRemove.push(stickman)
            }
        }
        for (var i = 0; i < stickmenToRemove.length; i++) {
            delete this.visibleStickmen[stickmenToRemove[i]]
        }
    }

    updateStickmen() {
        for (var stickman in this.networkManager.output.players) {
            if (!(stickman in this.visibleStickmen)) {
                this.visibleStickmen[stickman] = new Stickman(0, 0)
                this.visibleStickmen[stickman].name = stickman
            }
            this.visibleStickmen[stickman].x = floor(float(this.networkManager.output.players[stickman].x))
            this.visibleStickmen[stickman].y = floor(float(this.networkManager.output.players[stickman].y))
            if (float(this.networkManager.output.players[stickman].vx) != 0) {
                this.visibleStickmen[stickman].enableWalkingAnimation()
                this.visibleStickmen[stickman].direction = float(this.networkManager.output.players[stickman].vx)
            } else {
                this.visibleStickmen[stickman].enableIdleAnimation()
            }
            this.visibleStickmen[stickman].update()
        }
    }

    drawVisibleStickmen() {
        
        for (var stickman in this.visibleStickmen) {
            this.visibleStickmen[stickman].draw(this.camera.offsets.x, this.camera.offsets.y)
        }
    }

    updateCamera() {
        this.camera.updateLocation(this.controller.position.x, this.controller.position.y)
        this.camera.calculateOffsets()
    }

    update() {
        if (this.handleErrors()) {
            this.updateCamera()
            this.updateStickman()
            this.controller.update()
            this.networkManager.update()
            this.removeStickmen()
            this.updateStickmen()
            this.stickman.update()
            this.sendUpdatePacket()
        }
    }

    draw() {
        this.stickman.draw()
        this.drawVisibleStickmen()
    }
}