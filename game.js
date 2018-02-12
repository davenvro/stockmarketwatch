var game = new Phaser.Game(16*32, 600, Phaser.AUTO, document.getElementById('playerBoard'));
game.state.add('Game',Game);
game.state.start('Game');
var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
/*  game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png'); // this will be the sprite of the players */
};
