game.GameTimerManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();
        this.goldTimerCheck();
        this.creepTimerCheck();
        this.playerRespawnCheck();

        return true;
    },
    goldTimerCheck: function() {
        if (Math.round(this.now / 1000) % 20 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += 1;
            console.log("CurrentGold: " + game.data.gold);
        }
    },
    
    playerRspawnCheck: function() {
        if (game.data.player.dead) {

            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
        }
    },
    
    creepTimerCheck: function() {
        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 5000, 0, {});
            me.game.world.addChild(creepe, 5);
        }
    }
});

game.heroDeathManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
    },
    update: function() {
        if (game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);
        }
        return true;
    }
});

game.ExperienceManager = Object.extend({
    init: function(x, y, settings) {
        this.always = true;
        this.gameOver = false;
    },
    
    update: function() {
        if(game.data.win === true && !this.gameOver){
            this.gameOver(true);
        }else if(game.data.win === false && !this.gameOver) {
            this.gameOver(false);
        }
        console.log(game.data.exp);
        
        return true;
    },
    
    gameOver: function(win){
        if(win){
            game.data.exp += 10;
        }else{
            game.data.exp +=1;
        }
        
        game.data.exp += 10;
        this.gameOver = false;
         me.save.exp = game.data.exp;
    }
});

