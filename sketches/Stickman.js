const stickIndexes = {body:0, rightLeg:1, rightLegExtention:2, leftLeg:3, leftLegExtention:4, rightArm:5, rightArmExtention:6, leftArm:7, leftArmExtention:8, headOffset:9}
const walkingFrames = [
    [ 0, 31, 31, -15.5, -41, 0, 0, 0, 0, 5 ],
    [ 0, 56.5, -10.5, -15.5, -77, 0, 0, 0, 0, 10.5 ],
    [ 0, 0, 0, 25.5, -56.5, 0, 0, 0, 0, 0 ],
    [ 0, -15.5, -20.5, 36, -31, 0, 0, 0, 0, 0 ],
    [ 0, -31, -41, 36, 31, 0, 0, 0, 0, 5 ],
    [ 0, -36, -77, 51.5, -10.5, 0, 0, 0, 0, 10.5 ],
    [ 0, 20.5, -77, -5, -10.5, 0, 0, 0, 0, 0 ],
    [ 0, 46.5, -31, -25.5, -36, 0, 0, 0, 0, 5 ],
];
const walkingHandFrames = [
    [ 0, 0, 0, 0, 0, -41, -25.5, 25.5, 51.5, 0 ],
    [ 0, 0, 0, 0, 0, -25.5, 0, 15.5, 31, 0 ],
    [ 0, 0, 0, 0, 0, -5, 20.5, 0, -5, 0 ],
    [ 0, 0, 0, 0, 0, 15.5, 46.5, -41, -10.5, 0 ],
    [ 0, 0, 0, 0, 0, 36, 67, -61.5, -41, 0 ],
    [ 0, 0, 0, 0, 0, 15.5, 46.5, -41, -10.5, 0 ],
    [ 0, 0, 0, 0, 0, -5, 20.5, 0, -5, 0 ],
    [ 0, 0, 0, 0, 0, -25.5, 0, 15.5, 31, 0 ],
]
const swingFrames = [
    [ 0, 0, 0, 0, 0, 72, 221, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 60, 72, 0, 0, 0 ],
]
const idleFrames = [
    [ 0, 20.5,  0, -10, -15, 2,   25, -22.5,   0,   0 ],
    [ -1, 30.5, -5, -0, -25, 2, 17.5,   -19, 0.5, 0.5 ]
]
class AnimationLayer {
    constructor(frames, legs, arms, body, headOffset, lerpAmount) {
        this.frames = frames 
        this.step = 0
        this.frame = 0
        this.legs = legs
        this.arms = arms
        this.body = body
        this.headOffset = headOffset
        this.lerpAmount = lerpAmount
        this.shouldTick = false
    }

    tick() {
        if (this.shouldTick) {
            if (frameCount % 3 == 0) {
                this.step+= 1
                if (this.step >= this.lerpAmount) {
                    this.step = 0
                    this.frame += 1
                    if (this.frame >= this.frames.length) {
                        this.frame = 0
                        this.step = 0
                    }
                }
                
            }
        }
    }
    
    outputFrames() {
        return {frames: this.frames, step: this.step, frame: this.frame, legs: this.legs, arms: this.arms, body: this.body, headOffset: this.headOffset, lerpAmount:this.lerpAmount}
    }

}

class Head {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
        this.sticks = [
            new Stick(this.x, this.y, 0, 50, this.color, [         //Body
                new Stick(this.x, this.y, 20, 20, this.color, [  //Upper Right Leg
                    new Stick(this.x, this.y, 20, 20, this.color) //Lower Right Leg
                ]),
                new Stick(this.x, this.y, -10, 20, this.color, [ //Upper Left Leg
                    new Stick(this.x, this.y, -35, 20, this.color) //Lower Left Leg
                ])
            ]),
            new Stick(this.x, this.y, 15, 20, this.color, [      //Upper Right Arm
                new Stick(this.x, this.y, 20, 20, this.color, [])    // Lower Right Arm
            ]),
            new Stick(this.x, this.y, -15, 20, this.color, [     //Upper Left Arm
                new Stick(this.x, this.y, -5, 20, this.color)   // Lower Left Arm
            ]),
        ]
    }

    update() {
        for (var i = 0; i < this.sticks.length; i++) {
            this.sticks[i].x = this.x
            this.sticks[i].y = this.y
            this.sticks[i].update();
        }
    }
    draw(direction, xOffset=0, yOffset=0) {
        stroke(this.color.r, this.color.g, this.color.b);
        strokeWeight(25)
        point(this.x - xOffset, this.y -yOffset - 12.5)
        strokeWeight(5)
        for (var i = 0; i < this.sticks.length; i++) {
            this.sticks[i].draw(direction, xOffset, yOffset)
        }
    }

}

class Stick {
    constructor(x, y, angle, length, color, sticks = [], img=null) {
        this.x = x
        this.y = y
        this.angle = angle
        this.length = length
        this.color = color
        this.end = this.getEnd()
        this.sticks = sticks
        this.img = img
    }


    update() {
        this.end = this.getEnd();
        if (frameCount % 3 == 0) {
            this.step += 1
            if (this.step >= 3) {
                this.step = 0
                this.frame += 1
                if (this.frame >= frames.length) {
                    this.frame = 0
                    this.step = 0
                }
            }
            
        }
        for (var i = 0; i < this.sticks.length; i++) {
            this.sticks[i].x = this.end.x;
            this.sticks[i].y = this.end.y;
            this.sticks[i].update();
        }

    }
    draw(direction, xOffset=0, yOffset=0) {
        for (var i = 0; i < this.sticks.length; i++) {
            this.sticks[i].draw(direction, xOffset, yOffset);
        }
        stroke(this.color.r, this.color.g, this.color.b)
        strokeWeight(5)
        line(this.x -xOffset, this.y -yOffset, this.end.x -xOffset, this.end.y-yOffset)
        var flipped = direction >= 0
        var rotationAngle = (flipped ? 90 : -90)
        if (this.img) {
            push()
            translate(this.end.x-xOffset, this.end.y-yOffset)
            rotate(-this.angle + rotationAngle); 
            if (!flipped) {
                scale(-1, 1)
            }
            image(this.img, -this.img.width/2, -this.img.height/2)
            pop()
        }
    }
    
    getEnd() {
        return {x:this.x + sin(this.angle)*this.length, y:this.y + cos(this.angle)*this.length}
    }
}

class Stickman {
    constructor(x, y) {
        this.x = x 
        this.y = y
        this.head = new Head(this.x, this.y, {r:0, g:0, b:0})
        this.direction = 1
        this.animationLayers = [
            new AnimationLayer(walkingFrames, true, false, false, true, 2),
            new AnimationLayer(walkingHandFrames, false, true, false, false, 2),
            new AnimationLayer(swingFrames, false, true, false, false, 3),
            new AnimationLayer(idleFrames, true, true, true, true, 20)
        ]

    }

    lerpToPosition(animationFrames, step, frame, legs=false, arms=false, headOffset=false, body=false, lerpAmount=3) {
        var frame1 = animationFrames[frame]
        var frame2 = animationFrames[frame+1 < animationFrames.length ? frame+1 : 0]
        var anglesArray = []
        for (var i = 0; i < frame1.length; i++) {
            anglesArray.push(frame1[i] + ((frame2[i] - frame1[i])/lerpAmount)*step)
        }

        if (body) {
            this.head.sticks[0].angle = anglesArray[0];
        }

        if (legs) {
            this.head.sticks[0].sticks[0].angle = anglesArray[1] * (this.direction >= 0 ? 1 : -1);
            this.head.sticks[0].sticks[0].sticks[0].angle = anglesArray[2] * (this.direction >= 0 ? 1 : -1);
    
            this.head.sticks[0].sticks[1].angle = anglesArray[3] * (this.direction >= 0 ? 1 : -1);
            this.head.sticks[0].sticks[1].sticks[0].angle = anglesArray[4] * (this.direction >= 0 ? 1 : -1);
        }
        
        if (arms) {
            this.head.sticks[1].angle = anglesArray[5] * (this.direction >= 0 ? 1 : -1);
            this.head.sticks[1].sticks[0].angle = anglesArray[6] * (this.direction >= 0 ? 1 : -1);
    
            this.head.sticks[2].angle = anglesArray[7] * (this.direction >= 0 ? 1 : -1);
            this.head.sticks[2].sticks[0].angle = anglesArray[8] * (this.direction >= 0 ? 1 : -1);
        }

        if (headOffset) {
            this.head.y = this.y + anglesArray[9]
        }
    }

    disableAnimations() {
        for (var i = 0; i < this.animationLayers.length; i++) {
            this.animationLayers[i].shouldTick = false
        }
    }

    enableWalkingAnimation() {
        this.disableAnimations()
        this.animationLayers[0].shouldTick = true
        this.animationLayers[1].shouldTick = true
    }

    enableIdleAnimation() {
        this.disableAnimations()
        this.animationLayers[3].shouldTick = true
    }

    update() {
        angleMode(DEGREES)
        var output;
        for (var i = 0; i < this.animationLayers.length; i++) {
            if (this.animationLayers[i].shouldTick) {
                this.animationLayers[i].tick();
                output = this.animationLayers[i].outputFrames();
                this.lerpToPosition(output.frames, output.step, output.frame, output.legs, output.arms, output.headOffset, output.body, output.lerpAmount)
            }
        }
        this.head.x = this.x
        this.head.y = this.y
        this.head.update();
    }

    draw(xOffset = 0, yOffset = 0) {
        this.head.draw(this.direction, xOffset, yOffset);
        if (this.name != null) {
            fill(0)
            textSize(15);
            strokeWeight(1)
            textAlign(CENTER);
            text(this.name, this.x-xOffset, this.y-yOffset - 30);
        }
    }

}
