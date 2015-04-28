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

        this.resetPlayer(0, 420);

        var gameTimerManager = me.pool.pull("GameTimerManager", 0, 0, {});
        me.game.world.addChild(gameTimerManager, 0);
        
        var heroDeathManager = me.pool.pull("HeroDeathManager", 0, 0, {});
        me.game.world.addChild(heroDeathManager, 0);

        var experienceManager = me.pool.pull("ExperienceManager", 0, 0, {});
        me.game.world.addChild(experienceManager, 0);
        
        var SpendGold= me.pool.pull("SpendGold", 0, 0, {});
        me.game.world.addChild(SpendGold, 0);
        
        //helps me add a button for buying
        me.input.bindKey(me.input.KEY.B, "buy");
        //helps create a button for the skill 1
        me.input.bindKey(me.input.KEY.SHIFT, "skill1");
        //helps create a button for the skill 2
        me.input.bindKey(me.input.KEY.Z, "skill2");
        //helps create a button for the skill 3
        me.input.bindKey(me.input.KEY.X, "skill3");
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
    onDestroyEvent: function() {
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
