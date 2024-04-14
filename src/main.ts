import 'phaser';

const screenWidth = 800;
const screenHeight = 600;

class PlayGame extends Phaser.Scene 
{
    image: Phaser.GameObjects.Image;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    batteries: Phaser.Physics.Arcade.StaticGroup;
    enemyNPCs: Phaser.Physics.Arcade.Group;
    power: number;
    maxPower: number;
    speed: number;
    powerText: Phaser.GameObjects.Text;
    titleText: Phaser.GameObjects.Text;
    startButton: Phaser.GameObjects.Image;
    helpButton: Phaser.GameObjects.Image;
    
    startedGame: boolean;
    endedGame: boolean;

    powerBar: Phaser.GameObjects.Image;
    powerBarOutline: Phaser.GameObjects.Image;

    upKey: Phaser.Input.Keyboard.Key | undefined;
    downKey: Phaser.Input.Keyboard.Key | undefined;
    leftKey: Phaser.Input.Keyboard.Key | undefined;
    rightKey: Phaser.Input.Keyboard.Key | undefined;
    holdKey: Phaser.Input.Keyboard.Key | undefined;

    constructor() 
    {
        super("PlayGame");
    }
    startGame(): void
    {
        this.toggleEndMenu(false);
        this.toggleHelpMenu(false);
        this.toggleStartMenu(false);

        this.powerBar.setVisible(true);
        this.powerBarOutline.setVisible(true);

        this.power = 50;
        this.maxPower = 100;
        this.speed = 100;
        
        this.player.setRandomPosition(0, 0, 800, 600);
        this.player.setVisible(true);
        this.player.setActive(true);

        this.startedGame = true;
        this.endedGame = false;
    }
    endGame(): void
    {
        this.player.setVisible(false);
        this.player.setActive(false);

        this.toggleEndMenu(true);

        this.startedGame = false;
        this.endedGame = true;
    }
    toggleHelpMenu(activate: boolean): void
    {
        //this.toggleStartMenu(false);
    }
    toggleStartMenu(activate: boolean): void
    {
        this.titleText.setPosition(this.cameras.main.scrollX + screenWidth / 2, this.cameras.main.scrollY + screenHeight / 4);
        this.startButton.setPosition(this.cameras.main.scrollX + screenWidth / 2, this.cameras.main.scrollY + screenHeight / 2);
        this.helpButton.setPosition(this.cameras.main.scrollX + screenWidth / 2, this.cameras.main.scrollY + screenHeight / 2 + this.startButton.height);
        
        this.titleText.setActive(activate);
        this.titleText.setVisible(activate);
        this.startButton.setActive(activate);
        this.startButton.setVisible(activate);
    }
    toggleEndMenu(activate: boolean): void
    {
        this.toggleStartMenu(activate);
    }

    enterStartButtonHoverState(): void
    {
        this.startButton.setScale(0.9);
    }
    enterStartButtonRestState(): void
    {
        this.startButton.setScale(1.0);
    }
    enterStartButtonActiveState(): void
    {
        this.startButton.setScale(0.8);
    }

    enterHelpButtonHoverState(): void
    {
        this.helpButton.setScale(0.9);
    }
    enterHelpButtonRestState(): void
    {
        this.helpButton.setScale(1.0);
    }
    enterHelpButtonActiveState(): void
    {
        this.helpButton.setScale(0.8);
    }

    playerCollectBattery(player: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody, 
        battery: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody): void
    {
        battery.destroy();

        this.power += 2;
        //this.powerText.setText('Power: ' + this.power);
    }
    enemyCollectBattery(player: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody, 
        battery: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody): void
    {
        battery.destroy();
    }

    dischargePower(player: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody, 
        enemy: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody): void
    {
        this.power -= 1;
        //this.powerText.setText('Power: ' + this.power);
    }
    drainPower(amount: number): void
    {
        this.power -= this.time.timeScale * amount;
    }
    preload(): void 
    {
        this.load.image('logo', 'assets/woodpecker.png'); 
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('tile-1', 'assets/tile-1.png');
        this.load.image('battery', 'assets/battery.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('power-bar', 'assets/power-bar.png');
        this.load.image('power-bar-outline', 'assets/power-bar-outline.png');
        this.load.image('start-button', 'assets/start-button.png');
        this.load.image('help-button', 'assets/help-button.png');
    }
    create(): void 
    {
        this.startedGame = false;
        this.endedGame = false;
        
        this.add.image(screenWidth / 2, screenHeight / 2, 'background');

        this.titleText = this.add.text(screenWidth / 2, screenHeight / 4, 'Dayglow', { fontSize: '64px', color: '#000'});
        this.titleText.setOrigin(0.5, 0.5);

        // this.startButton = new Phaser.GameObjects.Image(this, 400, 300, 'start-button');
        // this.add.existing(this.startButton);
        this.startButton = this.add.image(screenWidth / 2, screenHeight / 2, 'start-button');
        this.startButton.setInteractive({useHandCursor: true});

        this.helpButton = this.add.image(screenWidth / 2, screenHeight / 2 + this.startButton.height, 'help-button');
        this.helpButton.setInteractive({useHandCursor: true});

        this.startButton.on('pointerover', () => this.enterStartButtonHoverState());
        this.startButton.on('pointerout', () => this.enterStartButtonRestState());
        this.startButton.on('pointerdown', () => this.enterStartButtonActiveState());
        this.startButton.on('pointerup', () => 
            {
                this.startGame();
                this.enterStartButtonHoverState();
            });

        this.helpButton.on('pointerover', () => this.enterHelpButtonHoverState());
        this.helpButton.on('pointerout', () => this.enterHelpButtonRestState());
        this.helpButton.on('pointerdown', () => this.enterHelpButtonActiveState());
        this.helpButton.on('pointerup', () => 
            {
                this.toggleHelpMenu(true);
                this.enterHelpButtonHoverState();
            });

        //this.powerText = this.add.text(0, 0, 'Power: ' + this.power, { fontSize: '32px', color: '#000'});
        this.powerBar = this.add.image(0, 0, 'power-bar');
        this.powerBar.setOrigin(0.5, this.powerBar.originY);
        this.powerBarOutline = this.add.image(0, 0, 'power-bar-outline');
        this.powerBar.setVisible(false);
        this.powerBarOutline.setVisible(false);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 400, 'tile-1');
        this.platforms.create(425, 400, 'tile-1');
        this.platforms.create(450, 400, 'tile-1');
        this.platforms.create(475, 400, 'tile-1');
        this.platforms.setVisible(false);

        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setVisible(false);
        this.player.setActive(false);
        
        this.batteries = this.physics.add.staticGroup();
        this.batteries.create(300, 360, 'battery');
        this.batteries.create(300, 560, 'battery');
        this.batteries.create(360, 360, 'battery');
        this.batteries.setVisible(false);

        this.enemyNPCs = this.physics.add.group();
        this.enemyNPCs.create(520, 500, 'enemy');
        this.enemyNPCs.setVisible(false);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.batteries, this.playerCollectBattery, undefined, this);
        this.physics.add.collider(this.player, this.enemyNPCs, this.dischargePower, undefined, this);
        this.physics.add.overlap(this.enemyNPCs, this.batteries, this.enemyCollectBattery, undefined, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{key: 'player', frame: 4}],
            frameRate: 20
        })

        this.upKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.leftKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.downKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.rightKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.holdKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update(): void 
    {
        if(this.player.active === true)
            {
                this.cameras.main.setScroll(this.player.x - screenWidth / 2, this.player.y - screenHeight / 2);
            //this.powerText.setPosition(this.player.x - screenWidth / 2, this.player.y - screenHeight / 2);

            this.powerBar.setPosition(this.player.x - screenWidth / 2 + this.powerBar.width, 
                this.player.y - screenHeight / 2 + this.powerBar.height);
            this.powerBarOutline.setPosition(this.player.x - screenWidth / 2 + this.powerBarOutline.width,
                this.player.y - screenHeight / 2 + this.powerBarOutline.height);
        
            this.powerBar.setCrop(0, 0, (this.power / this.maxPower) * this.powerBar.width, this.powerBar.height);
                
            if(this.upKey?.isDown)
                {
                    this.player.setVelocityY(-this.speed);
                }
            else if(this.downKey?.isDown)
                {
                    this.player.setVelocityY(this.speed);
                }
            else if(this.leftKey?.isDown)
                {
                    this.player.setVelocityX(-this.speed);
                }
            else if(this.rightKey?.isDown)
                {
                    this.player.setVelocityX(this.speed);
                }
            else{
                    this.player.setVelocity(0.0, 0.0);
                }

                this.drainPower(0.1);
            }
        

        if(this.power < 0)
        {
            this.endGame();
        }
    }
}
let configObject: Phaser.Types.Core.GameConfig = 
{
    type: Phaser.AUTO,
    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    render: 
    {

    },
    scale: 
    {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: screenWidth,
        height: screenHeight
    },
    scene: PlayGame
};

new Phaser.Game(configObject);