//sets the size of my player and show up on screen
game.playerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y);
        this.setPlayerTimer();
        this.setAttributes();
        this.setFlags();
        this.type = "PlayerEntity";


        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.addAnimation();


    },
    //it sets the super class
    setSuper: function(x, y) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
    },
    
    setPlayerTimer: function() {
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
    },
    
    setAttributes: function() {
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 15);
        this.attack = game.playerAttack;
    },
    
    setFlags: function() {
        //keeps track on what direction my player is facing
        this.dead = false;
        this.facing = "right";
    },
    
    addAnimation: function() {
        this.renderable.addAnimation("idle", [39]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 159);
        this.renderable.setCurrentAnimation("idle");
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },
    
    update: function(delta) {
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressedAndMove();
        this.setAnimations();
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    checkIfDead: function() {
        if (this.health <= 0) {
            return true;
        }
        return false;
    },
    
    checkKeyPressedAndMove: function() {
        //check if right button is pressed
        if (me.input.isKeyPressed("right")) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            //this line says to unflip the animation when going right
            this.facing = "right";
            this.flipX(true);
        } else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
            //this line says to unflip the animation when going right
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false);
        }
        else {
            this.body.vel.x = 0;
        }
        //this checks if the player jumps
        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling) {
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
            }
        }
    },
    
    setAnimations: function() {
        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {

                console.log("attack2");
                //sets the currnt animation to attack and thenn go back to idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //makes it so that the next time we start this sequence we begin
                //from the first animation not wherever we switched to another animation
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            this.collideWithEnemyBase(response);
        } else if (response.b.type === 'EnemyCreep') {
            this.collideWithEnemyCreep(response);
        }

    },
    
    collideWithEnemyBase: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;

        if (ydif < -40 && xdif < 70 && xdif > -35) {
            this.body.falling = false;
            this.body.vel.y = -1;
        }
        else if (xdif > -35 && this.facing === 'right' && (xdif < 0)) {
            this.body.vel.x = 0;
        } else if (xdif < 70 && this.facing === 'left' && (xdif > 0)) {
            this.body.vel.x = 0;
        }
        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
            this.lastHit = this.now;
            response.b.loseHealth(game.data.playerAttack);
        }
    },
    
    collideWithEnemyCreep: function(response) {
        var xdif = this.pos.x - response.b.pos.x;
        var ydif = this.pos.y - response.b.pos.y;

        this.stopMovement(xdif);

        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);
        };
    },
    
    stopMovement: function(xdif) {
        if (xdif > 0) {
            if (this.facing === "left") {
                this.body.vel.x = 0;
            }
        } else {
            if (this.facing === "right") {
                this.body.vel.x = 0;
            }
        }
    },
    
    checkAttack: function(xdif, ydif) {
        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttack
                && (Math.abs(ydif) <= 40) &&
                (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                ) {
            this.lastHit = this.now;
            //the creeps health is less than our attack ecucate code in if statement
            return true;
        }
        return false;
    },

    hitCreep: function(response) {
        if (response.b.health <= game.data.playerAttack) {
                //adds one gold for a creep kill
                game.data.gold += 1;
                console.log("Current Gold:" + game.data.gold);
            }
            response.b.loseHealth(game.data.playerAttack);
    }
});