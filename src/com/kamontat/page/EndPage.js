/**
 * Created by bubblebitoey on 7/5/59.
 */

var EndPage = cc.Sprite.extend({
    ctor: function () {
        this._super();
        this.initWithFile("res/Images/EndPage.jpg");

        this.scoreLabel = cc.LabelTTF.create("High-Score: " + "(" + cc.sys.localStorage.getItem("name") + ") " + cc.sys.localStorage.getItem("highScoreLabel"), 'Arial', 40);
        this.scoreLabel.setPosition(new cc.Point(screenWidth - 200, screenHeight - 370));
        this.addChild(this.scoreLabel);

        this.playLabel = cc.LabelTTF.create("Play (Time): " + cc.sys.localStorage.getItem("play"), 'Arial', 40);
        this.playLabel.setPosition(new cc.Point(screenWidth - 200, screenHeight - 420));
        this.addChild(this.playLabel);

        this.avgLabel = cc.LabelTTF.create("Avg-Score: " + Number(cc.sys.localStorage.getItem("avgScoreLabel")).toFixed(2), 'Arial', 40);
        this.avgLabel.setPosition(new cc.Point(screenWidth - 200, screenHeight - 470));
        this.addChild(this.avgLabel);
    }
});
