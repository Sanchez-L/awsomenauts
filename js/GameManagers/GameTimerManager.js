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
            game.data.gold += game.data.exp1 + 1;
            console.log("CurrentGold: " + game.data.gold);
        }
    },
    playerRespawnCheck: function() {
        if (game.data.player.dead) {
            this.
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(70, 770);
        }
    },
    creepTimerCheck: function() {
        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 2300, 770, {});
            me.game.world.addChild(creepe, 5);
        }
    }
});
