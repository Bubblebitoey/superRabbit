/**
 * Created by bubblebitoey on 8/5/59.
 */

var Carrot = cc.Sprite.extend({
        ctor: function () {
            this._super();
            this.initWithFile("res/Images/Carrot.png");
            this.randomPos();
            this.time = 0;
            this.appear = true;
            this.started = false;
        },

        randomPos: function () {
            var x = 75 + (Math.random() * (screenWidth - 175));
            var y = 75 + (Math.random() * (screenHeight - 175));
            this.setPosition(new cc.Point(x, y));

            this.time = 0;
            this.appear = true;
        },

        hide: function () {
            this.setPosition(new cc.Point(-99, -99));

            this.time = 0;
            this.appear = false;
        },

        update: function () {
            this.time++;
            if (this.started) {
                // every 3 second
                if (this.time / 60 % Carrot.SECOND_TO_APPEAR == 0) {
                    if (this.appear) {
                        this.hide();
                    } else {
                        this.randomPos();
                    }
                }
            }
        },

        /**
         * if want to start
         */
        start: function () {
            this.started = true;
        },

        /**
         * if want to stop
         */
        stop: function () {
            this.started = false;
            // reset time
            this.time = 0;
        }
    }
);

Carrot.SECOND_TO_APPEAR = 2;
