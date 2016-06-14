var res = {
    dot_png: 'res/Images/Dot.png',
    heart_png: 'res/Images/Heart.png',
    carrot_png: 'res/Images/Carrot.png',
    startPage_jpg: 'res/Images/StartPage.png',
    endPage_jpg: 'res/Images/EndPage.jpg',

    monster1_png: 'res/Images/monsterfile/Monster1.png',
    monster2_png: 'res/Images/monsterfile/Monster2.png',
    monster3_png: 'res/Images/monsterfile/Monster3.png',
    monster4_png: 'res/Images/monsterfile/Monster4.png',
    monster5_png: 'res/Images/monsterfile/Monster5.png',
    monster6_png: 'res/Images/monsterfile/Monster6.png',

    playSound_fall: 'res/Sound/whenPlaySound.mp3',
    hitHeartSound_fall: 'res/Sound/soundWhenCollectHeart.mp3',
    hitSound_fall: 'res/Sound/whenHitSong.mp3'

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
