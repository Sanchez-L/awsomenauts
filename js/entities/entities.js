//sets the size of my player and show up on screen
game.playerEntity = me.Entity.extend({
    init: function(x, y, settings) {
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
        this.type = "PlayerEntity";
        this.now = new Date().getTime();
        this.health = game.data.playerHealth;
        this.lastHit = this.now;
        this.dead = false;
        this.body.setVelocity(game.data.moveSpeed, 15);
        //keeps track on what direction my player is facing
        this.facing = "right";
        this.lastAttack = new Date().getTime();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [39]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 159);
        this.renderable.setCurrentAnimation("idle");
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },
    update: function(delta) {
        this.now = new Date().getTime();
        
        if(this.health <= 0) {
            this.dead = true;
        }
        
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


        //this checks if a left button is pressed.

        //this checks if the player jumps
        if (me.input.isKeyPressed('jump')) {
//            console.log(me.state);
//            me.state.change(1);
            //me.state.change(me.state.MENU);
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
                // play some audio 
                me.audio.play("jump");
            } else if (me.input.isKeyPressed('jump')) {
                if (!this.body.jumping && !this.body.falling) {
                    // set current vel to the maximum defined value
                    // gravity will then do the rest
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    // set the jumping flag
                    this.body.jumping = true;
                    // play some audio 
                    me.audio.play("jump");
                }
            }
        }
        //these are my controlles for my player
        //me.collision.check(this, true, this.collideHandler.bind(this), true);
        //this is the position between mario and whatever he hits or lands on 

        if (me.input.isKeyPressed("attack")) {

            console.log("attack1");
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

        me.collision.check(this, true, this.collideHandler.bind(this), true);

        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    collideHandler: function(response) {
        //console.log(response.b.type);
        if (response.b.type === 'EnemyBaseEntity') {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            if (ydif < -40 && xdif < 70 && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if (xdif > -35 && this.facing === 'right' && (xdif < 0)) {
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x - 1;
            } else if (xdif < 70 && this.facing === 'left' && (xdif > 0)) {
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x + 1;
            }
            console.log(this.now + " " + this.lastHit);
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                console.log("tower hit");
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
        } else if (response.b.type === 'EnemyCreep') {
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;

            if (xdif > 0) {
                //this.pos.x = this.pos.x + 1;
                if (this.facing === "left") {
                    this.body.vel.x = 0;
                }
            } else {
                //this.pos.x = this.pos.x - 1;
                if (this.facing === "right") {
                    this.body.vel.x = 0;
                }
            }

            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttack
                   && (Math.abs(ydif) <=40) &&
                   (((xdif>0 ) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
                   ){
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
        }
    }
});

game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return(new me.Rect(0, 0, 100, 70)).toPolygon();
                }

            }]);
        this.broken = false;
        this.health = game.data.playerBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerBase";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    onCollision: function() {

    }
});

game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return(new me.Rect(0, 0, 100, 70)).toPolygon();

                }
            }]);
        this.broken = false;
        this.health = game.data.enemyBasehealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "EnemyBaseEntity";
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    },
    loseHealth: function() {
        this.health--;
    }
});

game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 32,
                height: 64,
                spriteWidth: "32",
                spriteHeight: "64",
                getShape: function() {
                    return (new me.Rect(0, 0, 32, 64)).toPolygon();
                }
            }]);
        this.health = game.data.enemyCreepHealth;
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.alwaysUpdate = true;
        //this line of code lets us know if the creep is attacking
        this.attacking = false;
        //keep track of when our creep last attcked anything
        this.lastAttacking = new Date().getTime();
        //keep track of last time our creepe hitted anything
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);

        this.type = "EnemyCreep";

        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    update: function(delta) {
        
        if (this.health <= 0) {
            me.game.world.removeChild(this);
        }

        this.now = new Date().getTime();

        this.body.vel.x -= this.body.accel.x * me.timer.tick;

        me.collision.check(this, true, this.collideHandler.bind(this), true);

        this.body.update(delta);


        this._super(me.Entity, "update", [delta]);

        return true;
    },
    collideHandler: function(response) {
        console.log(this.health);
        if (response.b.type === 'PlayerBase') {
            this.attacking = true;

            this.lastAttacking = this.now;
            this.body.vel.x = 0;
            //keeps moving the creep  to the right to mainatain its position
            this.pos.x = this.pos.x + 1;
            //this line of code checks that it has been at least 1 second since the creep hit a base
            if ((this.now - this.lastHit >= 1000)) {
                //updates the last hit timer
                this.lastHit = this.now;
                //makes the player base call its lose health function and passes
                //damage of 1
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        } else if (response.b.type === 'PlayerEntity') {
            var xdif = this.pos.x - response.b.pos.x;

            this.attacking = true;

            this.lastAttacking = this.now;

            if (xdif > 0) {
                //keeps moving the creep  to the right to mainatain its position
                this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;
            }
            //this line of code checks that it has been at least 1 second since the creep hit a something
            if ((this.now - this.lastHit >= 1000) && xdif > 0) {
                //updates the last hit timer
                this.lastHit = this.now;
                //makes the player call its lose health function and passes
                //damage of 1
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }
    }
});

game.GameManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
    },
    update: function() {
        this.now = new Date().getTime();
        
        if(game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPLayer(0, 420);
        }

        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);

        }
        return true;
    }
});