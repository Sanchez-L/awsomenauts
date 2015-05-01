game.LoadProfile = me.ScreenObject.extend({
    /**	
     *  action to perform on state change
     */
    onResetEvent: function() {
        me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("load-screen")), -10); // TODO
        document.getElementById("input").style.visiblity = "visible";
        document.getElementById("load").style.visiblity = "visible";


        me.input.bindKey(me.input.KEY.B);
        me.input.bindKey(me.input.KEY.Q );
        me.input.bindKey(me.input.KEY.E);
        me.input.bindKey(me.input.KEY.W );
        me.input.bindKey(me.input.KEY.A );

        me.game.world.addChild(new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [10, 10, 300, 50]);
                this.font = new me.Font("Ariel", 26, "blue");
            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "ENTER YOUR USERNAME AND PASSWORD", this.pos.x, this.pos.y);
            }
        })));
    },
    /**	
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        document.getElementById("input").style.visiblity = "visible";
        document.getElementById("load").style.visiblity = "visible";
    }
});








