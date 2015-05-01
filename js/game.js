
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
                enemyCreepHealth: 30,
                //global variable for player health
                playerHealth: 100,
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
                heroDeathManager: "",
                //global variable for player
                player: "",
                //global variable for exp
                exp: 0,
                //global variable for gold
                gold: 0,
                //global variable for abiity1
                ability1: 0,
                //global variable for abiity2
                ability2: 0,
                //global variable for abiity3
                ability3: 0,
                //global variable for skill
                skill1: 0,
                //global variable for skill2
                skill2: 0,
                //global variable for skill3
                skill3: 0,
                //global variable for exp1
                exp1: 0,
                //global variable for exp2
                exp2: 0,
                //global variable for exp3
                exp3: 0,
                //global variable for exp4
                exp4: 0,
                //global variable for win
                win: "",
                //global variable for pause 
                pausePos: "",
                 //global variable for buy screen
                buyscreen: "",
                 //global variable for buy text
                buyText: ""
                
                        
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
        

        me.state.SPENDEXP = 112;
        me.state.NEW= 113;
        me.state.LOAD = 114;

        console.log(game.data.exp);
        console.log(game.data.exp2);

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
                //this line registers my expierance manager 
                me.pool.register("ExperienceManager", game.experienceManager);
                //sets the spend gold manager  
                me.pool.register("SpendGold", game.SpendGold);
                //sets the screen to title
		me.state.set(me.state.MENU, new game.TitleScreen());
                //sets the screen in play mode
		me.state.set(me.state.PLAY, new game.PlayScreen());
                //sets the screen to spend mode
                me.state.set(me.state.SPENDEXP, new game.SpendExp());
                //sets the screen to load mode
                me.state.set(me.state.LOAD, new game.LoadProfile());
                //sets the screen to new mode
                me.state.set(me.state.NEW, new game.NewProfile());
		// Starts the game.
		me.state.change(me.state.MENU);
	}
};
