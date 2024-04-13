import 'phaser';
class PlayGame extends Phaser.Scene {
 image: Phaser.GameObjects.Image;
 constructor() {
 super("PlayGame");
 }
 preload(): void {
 this.load.image('logo', 'assets/woodpecker.png'); 
 }
 create(): void {
 this.image = this.add.image(400, 300, 'logo');
 }
 update(): void {
 this.image.rotation += 0.01; 
 }
}
let configObject: Phaser.Types.Core.GameConfig = {
 scale: {
 mode: Phaser.Scale.FIT,
 autoCenter: Phaser.Scale.CENTER_BOTH,
 parent: 'game',
 width: 800,
 height: 600
 },
 scene: PlayGame
};
new Phaser.Game(configObject);