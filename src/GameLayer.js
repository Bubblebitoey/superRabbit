/**
 * @author "Soraya Saenna"
 * @version 1.5.0
 */
var GameLayer;
GameLayer = cc.LayerColor.extend({
    init: function () {
        this._super(new cc.Color(240, 220, 175, 255));
        this.setPosition(new cc.Point(0, 0));
        this.state = GameLayer.STATES.PAUSE;

        // declare sound variable
        this.sound = true;

        // level 3000 point = 1 level
        this.point = GameLayer.STARTEXP;

        //declare variable for timer
        this.time = 0;
        this.numItem = 0;

        //add background
        this.background = new Background();
        this.background.setPosition(new cc.Point(screenWidth / 2, screenHeight / 2));
        this.addChild(this.background);

        // add player in the child
        this.player = new Player();
        this.player.setPosition(new cc.Point(screenWidth / 2, screenHeight / 2));
        this.addChild(this.player, 1);

        //addItem
        this.item = new Item();
        this.addChild(this.item);
        this.item.scheduleUpdate();

        //add carrot
        this.carrot = new Carrot();
        this.addChild(this.carrot);
        this.carrot.scheduleUpdate();

        //add obstacles
        this.obstacles = [];
        for (var i = 0; i < GameLayer.NUMOBJECT; i++) {
            this.obstacles.push(new Obstacle());
            this.addChild(this.obstacles[i]);
        }

        this.levelLabel = cc.LabelTTF.create("LV: " + this.convertLV(), 'Arial', 25);
        this.levelLabel.setPosition(new cc.Point(60, screenHeight - 50));
        this.addChild(this.levelLabel);

        this.highScore = cc.LabelTTF.create(this.player.getScoreFromLocal() == null ? "high-score: 0" : "high-score: " + this.player.getScoreFromLocal(), 'Arial', 25);
        this.highScore.setPosition(new cc.Point(screenWidth / 3, screenHeight - 50));
        this.addChild(this.highScore);

        this.playTime = cc.LabelTTF.create(cc.sys.localStorage.getItem("play") == null ? "play: 0" : "play: " + cc.sys.localStorage.getItem("play"), 'Arial', 40);
        this.playTime.setPosition(new cc.Point(100, screenHeight - 100));
        this.addChild(this.playTime);

        this.avgScore = cc.LabelTTF.create(cc.sys.localStorage.getItem("avgScore") == null ? "avg-score: 0" : "avg-score: " + cc.sys.localStorage.getItem("avgScore"), 'Arial', 25);
        this.avgScore.setPosition(new cc.Point(2 * screenWidth / 3, screenHeight - 50));
        this.addChild(this.avgScore);

        this.scoreLabel = cc.LabelTTF.create("score: 0", 'Arial', 40);
        this.scoreLabel.setPosition(new cc.Point(screenWidth / 2, screenHeight - 100));
        this.addChild(this.scoreLabel);

        this.label = cc.LabelTTF.create("Life: ", 'Arial', 40);
        this.label.setPosition(new cc.Point(screenWidth - 100, screenHeight - 100));
        this.addChild(this.label);

        this.lifeLabel = cc.LabelTTF.create(this.player.life, 'Arial', 40);
        this.lifeLabel.setPosition(new cc.Point(screenWidth - 40, screenHeight - 100));
        this.lifeLabel.setColor(cc.color(0, 0, 255));
        this.addChild(this.lifeLabel);


        this.addKeyboardHandlers();

        // sound start
        cc.audioEngine.playMusic('res/Sound/whenPlaySound.mp3', true);

        this.scheduleUpdate();
        this.player.scheduleUpdate();
        for (var i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].scheduleUpdate();
        }

        return true;
    },

    update: function () {
        // end is mean END
        if (this.state != GameLayer.STATES.END) {
            // out length
            if (this.player.checkOut()) {
                this.endGame();
            }
            // first player of press pause button
            if (this.state == GameLayer.STATES.PAUSE) {
                // stop player
                this.player.stop();
                // stop item
                this.item.stop();
                //stop carrot
                this.carrot.stop();
                // stop obstacle
                for (var i = 0; i < this.obstacles.length; i++) {
                    this.obstacles[i].stop();
                }
            }

            // Play iT!
            if (this.state == GameLayer.STATES.STARTED) {
                this.player.start();
                this.item.start();
                this.carrot.start();

                this.timer();

                for (var i = 0; i < this.obstacles.length; i++) {
                    this.obstacles[i].start();
                }

                // check hit obstacles
                for (var i = 0; i < this.obstacles.length; i++) {
                    if (this.player.hit(this.obstacles[i], 24, 24)) {
                        // random obstacle again
                        this.obstacles[i].randomPosition();

                        // playing soundEffect
                        cc.audioEngine.playEffect('res/Sound/whenHitSong.mp3');

                        // loss life.. another way of if.
                        if (this.player.lossLive()) {
                            // set life label
                            this.lifeLabel.setString(this.player.life);
                            // end this game
                            this.endGame();
                        }
                        // set life label
                        this.lifeLabel.setString(this.player.life);
                    }
                }

                // check hit item
                if (this.player.hit(this.item, 24, 24)) {
                    cc.audioEngine.playEffect('res/Sound/soundWhenCollectHeart.mp3');
                    this.player.life++;
                    this.item.hide();
                    this.point += GameLayer.UPPOINT.HEART;
                }

                // check hit carrot
                if (this.player.hit(this.carrot, 24, 35)) {
                    cc.audioEngine.playEffect('res/Sound/whenHitCarrot.mp3');
                    this.removeObstacle();
                    this.carrot.hide();
                    this.point += GameLayer.UPPOINT.CARROT;
                }

                // update label and color
                this.levelLabel.setString("LV: " + this.convertLV());
                this.scoreLabel.setString("score: " + this.player.score);
                this.lifeLabel.setString(this.player.life);
                if (this.player.life == 2) {
                    this.lifeLabel.setColor(cc.color(255, 255, 0));
                } else if (this.player.life <= 1) {
                    this.lifeLabel.setColor(cc.color(255, 0, 0));
                } else {
                    this.lifeLabel.setColor(cc.color(0, 0, 255));
                }
            }
        }
    },

    addKeyboardHandlers: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                self.onKeyDown(keyCode);
            }
        }, this);
    },

    onKeyDown: function (keyCode) {
        if (keyCode == cc.KEY.up || keyCode == cc.KEY.right || keyCode == cc.KEY.down || keyCode == cc.KEY.left) {
            if (this.state == GameLayer.STATES.PAUSE) {
                this.state = GameLayer.STATES.STARTED;
                this.player.start();
            }
            if (this.state == GameLayer.STATES.STARTED) {
                this.player.jump(keyCode);
            }
        }

        //press "d" to delete data in local storage
        if (keyCode == cc.KEY.d) {
            cc.sys.localStorage.removeItem("play");
            cc.sys.localStorage.removeItem("highScore");
            cc.sys.localStorage.removeItem("avgScore");
            cc.sys.localStorage.removeItem("name");

            cc.sys.localStorage.setItem("play", 0);
            cc.sys.localStorage.setItem("highScore", 0);
            cc.sys.localStorage.setItem("avgScore", 0);
            cc.sys.localStorage.setItem("name", "");

            this.highScore.setString("high-score: " + this.player.getScoreFromLocal());
            this.playTime.setString("play: " + cc.sys.localStorage.getItem("play"));
            this.avgScore.setString("avg-score: " + cc.sys.localStorage.getItem("avgScore"));
        }

        // auto play
        if (keyCode == cc.KEY.p) {
            this.player.schedule(this.player.autoJump, 0.15);
            console.warn("auto play: Turn ON");
        }

        // manual play
        if (keyCode == cc.KEY.o) {
            this.player.unschedule(this.player.autoJump);
            console.warn("auto play: Turn OFF");
        }

        //press "m" to mute the sound
        if (keyCode == cc.KEY.m) {
            if (this.sound) {
                cc.audioEngine.setMusicVolume(0);
                cc.audioEngine.setEffectsVolume(0);
                this.sound = false;
            } else {
                cc.audioEngine.setMusicVolume(1);
                cc.audioEngine.setEffectsVolume(1);
                this.sound = true;
            }
            console.info("Mute Sound: " + !this.sound);
        }

        //press "s" to check all information
        if (keyCode == cc.KEY.s) {
            // check state
            if (this.state == GameLayer.STATES.STARTED) {
                console.info("state: Started");
            } else if (this.state == GameLayer.STATES.PAUSE) {
                console.info("state: Pause");
            } else if (this.state == GameLayer.STATES.DEAD) {
                console.info("state: Dead");
            } else if (this.state == GameLayer.STATES.END) {
                console.info("state: End");
            }

            // game info
            console.info(this.sound ? "Music: ON" : "Music: OFF");

            // check player started
            console.info("Start Player: " + this.player.started);
            // check obstacle started
            this.obstacles.forEach(function (obstacle) {
                console.info("Start Obstacle: " + obstacle.started);
            }, this);

            // check num obstacle
            console.info("Number of obstacle: " + this.obstacles.length);
        }
    },

    addObstacle: function (update) {
        this.obstacles.push(new Obstacle);
        this.addChild(this.obstacles[this.obstacles.length - 1]);
        this.obstacles[this.obstacles.length - 1].scheduleUpdate();
        console.info("Add finish, Have: " + this.obstacles.length);
        if (update) {
            this.point += GameLayer.UPPOINT.OBSTACLE;
        }
    },

    removeObstacle: function () {
        this.obstacles[this.obstacles.length - 1].unschedule();
        this.removeChild(this.obstacles[this.obstacles.length - 1], true);
        this.obstacles.pop();
        console.info("Remove finish, Have: " + this.obstacles.length);
    },

    timer: function () {
        this.time++;
        this.player.addScore(Math.round((this.time / 10)) * this.convertLV());
        if (this.time / 60 % Obstacle.SECOND_TO_APPEAR == 0)
            this.addObstacle(true);
    },

    convertLV: function () {
        return Number(Math.floor(this.point / GameLayer.STARTEXP)).toFixed(0);
    },

    restart: function () {
        if (this.state == GameLayer.STATES.DEAD) {
            this.state = GameLayer.STATES.PAUSE;

            // player
            this.player.setPosition(new cc.Point(screenWidth / 2, screenHeight / 2));
            this.player.start();
            this.player.jump();
            this.player.score = 0;
            this.player.life = Player.lIFE;

            //set high score label
            this.highScore.setString("high-score: " + this.player.getScoreFromLocal());
            //update play time label
            this.playTime.setString("play: " + cc.sys.localStorage.getItem("play"));

            // item
            this.item.randomPos();

            //carrot
            this.carrot.randomPos();

            // point
            this.point = GameLayer.STARTEXP;

            // timer
            this.time = 0;
            this.scoreLabel.setString("score: 0");

            // remove obstacle
            for (var i = 0; i < this.obstacles.length; i++) {
                this.removeChild(this.obstacles[i], true);
            }
            // clear array
            this.obstacles.splice(0, this.obstacles.length);

            // add new object
            for (var i = 0; i < GameLayer.NUMOBJECT; i++) {
                this.addObstacle(false);
            }
        } else {
            console.error("You not DEAD!");
        }
    },

    endGame: function () {
        // change state
        this.state = GameLayer.STATES.DEAD;

        // stop player
        this.player.stop();
        //add score in to local Storage
        this.player.setScoreToLocal();

        //get info from local storage
        var play = Number(cc.sys.localStorage.getItem("play"));
        var avg = cc.sys.localStorage.getItem("avgScore");
        var score = this.player.score;

        //update player played time
        cc.sys.localStorage.setItem("play", play + 1);
        //update average score
        cc.sys.localStorage.setItem("avgScore", (((avg * play) + score) / (play + 1)).toFixed(2));

        //set high score label
        this.highScore.setString("high-score: " + this.player.getScoreFromLocal());
        //set played time label
        this.playTime.setString("play: " + cc.sys.localStorage.getItem("play"));
        //set average score
        this.avgScore.setString("avg-score: " + cc.sys.localStorage.getItem("avgScore"));

        // stop obstacle
        for (var i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].stop();
        }
        //mute background music
        cc.audioEngine.setMusicVolume(0);
        cc.audioEngine.setEffectsVolume(0);

        if (confirm("Do you want to play again (lv. " + this.convertLV() + ") !?")) {
            // un mute the music sound
            if (this.sound) {
                cc.audioEngine.setMusicVolume(1);
                cc.audioEngine.setEffectsVolume(1);
            }
            this.restart();
        } else {
            // end sound
            cc.audioEngine.end();

            // open end page
            var endPage = new EndPage();
            endPage.setPosition(new cc.Point(screenWidth / 2, screenHeight / 2));
            this.addChild(endPage, 1);

            // change status
            this.state = GameLayer.STATES.END;

            //playing end music
            cc.audioEngine.setMusicVolume(1);
            cc.audioEngine.playMusic('res/Sound/endingSound.mp3', true);
        }
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        //test local storage
        if (typeof(Storage) === "undefined") {
            console.error("your browser don't support local storage");
        } else {
            var startPage = new StartPage();
            this.addChild(startPage);
        }
    }
});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);
        console.log("GameLayer created");
    }
});

GameLayer.NUMOBJECT = 3;

GameLayer.STATES = {
    PAUSE: 1,
    STARTED: 2,
    DEAD: 3
};

GameLayer.STARTEXP = 3000;

GameLayer.UPPOINT = {
    OBSTACLE: 500,
    HEART: 750,
    CARROT: 150
};