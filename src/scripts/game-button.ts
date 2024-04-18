class GameButton extends Phaser.GameObjects.Image
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: Function)
    {
        super(scene, x, y, texture);

        this.setInteractive({useHandCursor: true});
        this.on('pointerover', () => this.enterButtonHoverState());
        this.on('pointerout', () => this.enterButtonRestState());
        this.on('pointerdown', () => this.enterButtonActiveState());
        this.on('pointerup', () => 
            {
                this.enterButtonHoverState();
                callback();
            });
    }

    enterButtonHoverState(): void
    {
        this.setScale(0.9);
    }
    enterButtonRestState(): void
    {
        this.setScale(1.0);
    }
    enterButtonActiveState(): void
    {
        this.setScale(0.8);
    }

    pressed: boolean;
}

export default GameButton;

