class EnemyNPC extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture)
    {
        super(scene, x, y, texture)

        this.movementSpeed = 35;
        this.powerDrainPerHit = 0.1;
        this.refocusTimer = 20;
        this.refocusCooldown = 20;
        this.direction = new Phaser.Math.Vector2(-1.0, 0.0);
        this.visibilityDistance = 512;
        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }

    update(deltaTime: number): void
    {
        this.refocusTimer -= deltaTime;
        if(this.refocusTimer < 0)
            {
                this.refocusTimer = this.refocusCooldown;
                //console.log('refocusing');

                // scan for target

                // if target is found chase after it

                // if no target is found patrol to a random location

                // on destination repeat
                //this.idle();
            }
    }

    idle(): void
    {
        this.setVelocity(0.0, 0.0);
        console.log('idle');
    }

    search(target: Phaser.Math.Vector2): boolean
    {
        let currentDirection = new Phaser.Math.Vector2(this.direction.x, this.direction.y).normalize();
        let directionToObserveX = this.body?.position.x || 0;
        let directionToObserveY = this.body?.position.y || 0;
        let directionToObserve = new Phaser.Math.Vector2(directionToObserveX - target.x, directionToObserveY - target.y).negate().normalize();
        let dp = (directionToObserve.dot(currentDirection));
        
        return (dp > 0.66);
    }

    patrol(): void
    {
        this.direction = this.direction.normalize();
        this.setVelocity(this.direction.x * this.movementSpeed, this.direction.y * this.movementSpeed);
    }

    chase(target: Phaser.Math.Vector2): void
    {
        console.log('chasing');
        let forwardX = this.body?.position.x || 0.0;
        let forwardY = this.body?.position.y || 0.0;

        forwardX -= target.x;
        forwardY -= target.y;
        let forward = new Phaser.Math.Vector2(forwardX, forwardY).negate().normalize();
        //this.direction = forward;

        this.setVelocity(forward.x * this.movementSpeed, forward.y * this.movementSpeed);
    }

    direction: Phaser.Math.Vector2;
    movementSpeed: number;
    powerDrainPerTick: number;
    powerDrainPerHit: number;
    refocusTimer: number;
    refocusCooldown: number;
    visibilityDistance: number;
}

export default EnemyNPC;