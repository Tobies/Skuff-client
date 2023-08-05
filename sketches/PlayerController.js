const physics = {
    acceleration: 30,
    moveClamp:13,
    deAcceleration:2,
    fallClamp: -40, 
    minFallSpeed: 20, 
    maxFallSpeed: 60,
    jumpHeight: 30,
    coyoteTimeThreshold:2,
    jumpBuffer:2,
    fastFallModifier:3
}



class PlayerController {
    constructor() {
        this.velocity = createVector(0, 0)
        this.position = createVector(0, 0)
        this.rawMovement = createVector(0, 0)
        this.lastPosition = createVector(0, 0)

        this.hitbox = {width: 50, height:100}

        this.inputs = {jumpDown: false, jumpUp: false, x:0, bufferedJump:false, coyote:true}

        this.jumpingThisFrame = false 
        this.landingThisFrame = false

        this.grounded = false //Should always update first by downwards collision
        
        this.lastGrounded = frameCount
        this.lastJumpPressed = frameCount

        this.collisions = {up:false, down:false, right:false, left:false}
        
        this.coyote = true

        this.currentHorizontalSpeed = 0
        this.currentVerticalSpeed = 0

        this.fallSpeed = 1

        this.reachedJumpPeak = false

        this.obstacleToAnchor = null


    }

    gatherInput() {
        this.inputs.jumpDown = keyIsDown(32)
        this.inputs.jumpUp = !keyIsDown(32)
        this.inputs.x = (keyIsDown(65) ? -1 : 0) + (keyIsDown(68) ? 1 : 0)
        this.lastJumpPressed = this.inputs.jumpDown ? frameCount : this.lastJumpPressed
        this.inputs.bufferedJump = this.collisions.down && this.lastJumpPressed + physics.jumpBuffer > frameCount
        this.inputs.coyote = this.coyote && !this.collisions.down && this.lastGrounded + physics.coyoteTimeThreshold > frameCount;
    }

    checkCollisions() {
        this.grounded = false
        this.landingThisFrame = false
        if (this.collisions.down && !this.grounded) {
            this.lastGrounded = frameCount
        } else if (!this.collisions.down && this.grounded) {
            this.coyote = true 
            this.landingThisFrame = true
        }

        this.collisions.up = false
        this.collisions.down = this.grounded
        this.collisions.right = false
        this.collisions.left = false


        var collisionPoints = [
            {collider:"right" , x:this.position.x +this.hitbox.width * 0.5, y:this.position.y + this.hitbox.height*0.125, width:1, height:this.hitbox.height * 0.75},   // right
            {collider:"left"  , x:this.position.x - this.hitbox.width* 0.5 , y:this.position.y + this.hitbox.height * 0.125, width:1, height:this.hitbox.height * 0.75},   // left
            {collider:"up"    , x:this.position.x -this.hitbox.width * 0.25 , y:this.position.y, width:this.hitbox.width*0.5, height:1},   // up
            {collider:"down"  , x:this.position.x -this.hitbox.width * 0.25, y:this.position.y+this.hitbox.height, width:this.hitbox.width*0.5, height:1},   // down
        ]
        var collisionPoint;
        for (var i = 0; i < obstacles.length; i++) {
            for (var j = 0; j < collisionPoints.length; j++) {
                collisionPoint = collisionPoints[j]
                if (obstacles[i].AABBCollision(collisionPoint)) {
                    this.collisions[collisionPoint.collider] = true
                    if (collisionPoint.collider == "down") {
                        this.obstacleToAnchor = obstacles[i]
                    }
                }
            }
        }
    }

    calculateHorizontalMovement() {
        if (this.inputs.x != 0) {
            this.currentHorizontalSpeed = this.currentHorizontalSpeed +  this.inputs.x * physics.acceleration
            this.currentHorizontalSpeed = max(min(this.currentHorizontalSpeed, physics.moveClamp), -physics.moveClamp)
        } else {
            this.currentHorizontalSpeed =  this.currentHorizontalSpeed / physics.deAcceleration
        }
        
        this.currentHorizontalSpeed = (this.currentHorizontalSpeed > 0 && this.collisions.right || this.currentHorizontalSpeed < 0 && this.collisions.left) ? 0 : this.currentHorizontalSpeed
        
    }
    
    applyGravity() {
        if (this.collisions.down) {
            if (this.currentVerticalSpeed < 0) {
                this.currentVerticalSpeed = 0
            }
        } else {
            var fallSpeed = this.reachedJumpPeak && this.currentVerticalSpeed > 0 ? this.fallSpeed * physics.fastFallModifier : this.fallSpeed
            this.currentVerticalSpeed -= fallSpeed
            if (this.currentVerticalSpeed < physics.fallClamp) {
                this.currentVerticalSpeed = physics.fallClamp
            }
        }   
    }
    
    calculateVerticalMovement() {
        this.applyGravity()
        if (this.inputs.jumpDown && this.coyote || this.inputs.bufferedJump) {
            this.currentVerticalSpeed = physics.jumpHeight
            this.reachedJumpPeak = false
            this.coyote = false 
            this.lastGrounded = -99999
            this.jumpingThisFrame = true
        } else {
            this.jumpingThisFrame = false
        }
        if (!this.collisions.down && this.inputs.jumpUp && !this.reachedJumpPeak && this.velocity.y > 0) {
            this.reachedJumpPeak = true
        }
        
        this.currentVerticalSpeed = (this.collisions.up && this.currentVerticalSpeed > 0) ? 0 : this.currentVerticalSpeed
    }
    
    applyMovementCalculations() {
        this.rawMovement.set(this.currentHorizontalSpeed, -this.currentVerticalSpeed)
        this.position.add(this.rawMovement)
        if (this.obstacleToAnchor != null) {
            this.position.set(this.position.x, this.obstacleToAnchor.y-this.hitbox.height-1)
            this.obstacleToAnchor = null
        }
    }
    
    update() {
        this.velocity.set(this.position.x - this.lastPosition.x, this.position.y - this.lastPosition.y)
        this.lastPosition.set(this.position.x, this.position.y)
        this.gatherInput()
        this.checkCollisions()
        this.calculateHorizontalMovement()
        this.calculateVerticalMovement()
        this.applyMovementCalculations()
    }
    
    draw() {
        stroke(0, 0, 255)
        strokeWeight(5)
        point(this.position.x, this.position.y)
        stroke(0, 255, 0)
        noFill()
        rect(this.position.x, this.position.y, this.hitbox.width, this.hitbox.height)
    }
}
