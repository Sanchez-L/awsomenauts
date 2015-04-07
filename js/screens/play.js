game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // resets the score
        game.data.score = 0;
        //loads my map
        me.levelDirector.loadLevel("map1");
        //pulls my player from entities
        var player = me.pool.pull("player", 0, 420, {});
        //places my player on my world
        me.game.world.addChild(player, 5);

        this.resetPlayer(0, 420);

        var gamemanager = me.pool.pull("GameManager", 0, 0, {});
        me.game.world.addChild(gamemanager, 0);

        //helps me move my player to the right
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        //helps my player move to the left
        me.input.bindKey(me.input.KEY.LEFT, "left");
        //helps my player jumo up
        me.input.bindKey(me.input.KEY.UP, "jump");
        //this code binds my player to attack
        me.input.bindKey(me.input.KEY.SPACE, "attack");

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    },
    resetPlayer: function(x, y) {
        game.data.player = me.pool.pull("player", x, y, {});
        me.game.world.addChild(game.data.player, 5);
    }
});
