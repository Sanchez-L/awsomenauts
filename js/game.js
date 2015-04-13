
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0,
                //global variable for enemy base heath
                enemyBaseHealth: 50,
                //globalvariable for player base health
                playerBaseHealth: 50,
                //global variable for enemy creep health
                eneyCreepHealth: 30,
                //global variable for player health
                playerHealth: 30,
                //global variable for enemy creep attack
                enemyCreepAttack: 5,
                //global variable for player attack
                playerAttack: 5,
                //global variable for player attack timer
                playerAttackTimer: 1000,
                //global variable for enemy creep attack timer
                enemyCreepAttackTimer: 1000,
                //global variable for playermove speed
                playerMoveSpeed: 5,
                //global variable for creep move speed
                creepMoveSpeed: 5,
                //global variable for game timer manager
                gameTimerManager: "",
                //global variable for hero death manager
                HeroDeathManager: "",
                //global variable for player
                player: "",
                //global variable for exp
                exp: 0,
                //global variable for gold
                gold: 0,
                //global variable for exp1
                exp1: 0,
                //global variable for exp2
                exp2: 0,
                //global variable for exp3
                exp3: 0,
                //global variable for exp4
                exp4: 0
                
                        
	},
	
	
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen",  me.video.CANVAS, 1067, 600, true, '1.0')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(this, debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
                //this line reisters my player
                me.pool.register("player", game.playerEntity, true);
                //this line registers my player base
                me.pool.register("PlayerBase", game.PlayerBaseEntity);
                //this line registers my enemy base
                me.pool.register("EnemyBase", game.EnemyBaseEntity);
                //this line registers my enemy creep
                me.pool.register("EnemyCreep", game.EnemyCreep, true);
                //this line registers my game timer manager
                me.pool.register("GameTimerManager", game.GameTimerManager);
                ///this line registers my hero death manager
                me.pool.register("HeroDeathManager", game.HeroDeathManager);
                
                //sets the screen to title
		me.state.set(me.state.MENU, new game.TitleScreen());
                //sets the screen in play mode
		me.state.set(me.state.PLAY, new game.PlayScreen());

		// Starts the game.
		me.state.change(me.state.MENU);
	}
};
