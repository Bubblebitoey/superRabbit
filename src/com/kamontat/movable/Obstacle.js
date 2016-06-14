var Obstacle = cc.Sprite.extend({
    ctor: function () {
        this._super();
        // random obstacle pic
        this.numOfRand = Math.ceil(Math.random() * 6);
        if (this.numOfRand == 1) {
            this.initWithFile('res/Images/monsterfile/Monster1.png');
        } else if (this.numOfRand == 2) {
            this.initWithFile('res/Images/monsterfile/Monster2.png');
        } else if (this.numOfRand == 3) {
            this.initWithFile('res/Images/monsterfile/Monster3.png');
        } else if (this.numOfRand == 4) {
            this.initWithFile('res/Images/monsterfile/Monster4.png');
        } else if (this.numOfRand == 5) {
            this.initWithFile('res/Images/monsterfile/Monster5.png');
        } else {
            this.initWithFile('res/Images/monsterfile/Monster6.png');
        }


        this.x = 0;
        this.y = 0;

        this.randMoveX = Math.random() * Obstacle.SPEEDNOTOVER;
        this.randMoveY = Math.random() * Obstacle.SPEEDNOTOVER;

        this.started = true;

        while (this.randMoveX <= Obstacle.SPEEDATLEAST || this.randMoveY <= Obstacle.SPEEDATLEAST) {
            this.randMoveX = Math.random() * Obstacle.SPEEDNOTOVER;
            this.randMoveY = Math.random() * Obstacle.SPEEDNOTOVER;
        }

        this.randDir = Math.ceil(Math.random() * 2);
        this.rand = 0;
        this.randomPosition();
    },

    update: function () {
        if (this.started) {
            this.warp();
            switch (this.rand) {
                // left
                case Obstacle.DIR.LEFT:
                    if (this.randDir == 1) {
                        this.setPosition(new cc.Point(this.x + this.randMoveX, this.y + this.randMoveY));
                    } else {
                        this.setPosition(new cc.Point(this.x + this.randMoveX, this.y - this.randMoveY));
                    }
                    break;
                // up
                case Obstacle.DIR.UP:
                    if (this.randDir == 1) {
                        this.setPosition(new cc.Point(this.x + this.randMoveX, this.y - this.randMoveY));
                    } else {
                        this.setPosition(new cc.Point(this.x - this.randMoveX, this.y - this.randMoveY));
                    }
                    break;
                // right
                case Obstacle.DIR.RIGHT:
                    if (this.randDir == 1) {
                        this.setPosition(new cc.Point(this.x - this.randMoveX, this.y + this.randMoveY));
                    } else {
                        this.setPosition(new cc.Point(this.x - this.randMoveX, this.y - this.randMoveY));
                    }
                    break;
                // down
                case Obstacle.DIR.DOWN:
                    if (this.randDir == 1) {
                        this.setPosition(new cc.Point(this.x + this.randMoveX, this.y + this.randMoveY));
                    } else {
                        this.setPosition(new cc.Point(this.x - this.randMoveX, this.y + this.randMoveY));
                    }
                    break;
                // other
                default:
                    console.error("Cause Error on Update in Obstacle");
                    break;
            }
            this.x = this.getPositionX();
            this.y = this.getPositionY();
        }
    },

    warp: function () {
        if (this.x < 0 || this.y < 0 || this.x > screenWidth || this.y > screenHeight) {
            this.randomPosition();
        }
    },

    randomPosition: function () {
        this.rand = Math.ceil(Math.random() * 4);
        switch (this.rand) {
            // left
            case Obstacle.DIR.LEFT:
                this.x = 0;
                this.y = Math.ceil(Math.random() * screenHeight);
                break;
            // up
            case Obstacle.DIR.UP:
                this.x = Math.ceil(Math.random() * screenWidth);
                this.y = screenHeight;
                break;
            // right
            case Obstacle.DIR.RIGHT:
                this.x = screenWidth;
                this.y = Math.ceil(Math.random() * screenHeight);
                break;
            // down
            case Obstacle.DIR.DOWN:
                this.x = Math.ceil(Math.random() * screenWidth);
                this.y = 0;
                break;
            // other
            default:
                console.error("Cause Error on randomPosition in Obstacle");
                break;
        }
        this.setPosition(new cc.Point(this.x, this.y));
    },

    start: function () {
        this.started = true;
    },

    stop: function () {
        this.started = false;
    }
});

Obstacle.SPEEDATLEAST = 3;
Obstacle.SPEEDNOTOVER = 10;

Obstacle.SECOND_TO_APPEAR = 3;

Obstacle.DIR = {
    LEFT: 1,
    UP: 2,
    RIGHT: 3,
    DOWN: 4
};