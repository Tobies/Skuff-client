class Camera {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.offsets = {x:0, y:0}
    }

    updateLocation(x, y) {
        this.x = x
        this.y = y
    }

    calculateOffsets() {
        this.offsets = {x:this.x - this.w/2, y: this.y - this.h/2, midX : this.w/2, midY: this.h/2}
    }
}