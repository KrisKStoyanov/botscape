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
        //(this.debugDirection);
    }

    update(deltaTime: number): void
    {
        //console.log('updating');
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
    }

    search(target: Phaser.Math.Vector2): boolean
    {
        let targetNormalized: Phaser.Math.Vector2 = new Phaser.Math.Vector2(target.x, target.y).normalize();
        let originNormalized: Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.body?.position.x, this.body?.position.y).normalize();
        let dp = (originNormalized.dot(targetNormalized));
        console.log(dp);

        return (dp === 0);
        //let dp = this.direction.dot(target);
        // if(dp === 0)
        //     {
        //         console.log('visible');
        //         return true;
        //     }
        //     else 
        //     {
        //         console.log('invisible');
        //         return false;
        //     }
    }

    patrol(): void
    {
        this.direction = this.direction.normalize();
        this.setVelocity(this.direction.x * this.movementSpeed, this.direction.y * this.movementSpeed);
    }

    chase(target: Phaser.Math.Vector2): void
    {
        let forwardX = this.body?.position.x || 0.0;
        let forwardY = this.body?.position.y || 0.0;

        forwardX -= target.x;
        forwardY -= target.y;
        let forward = new Phaser.Math.Vector2(forwardX, forwardY).negate().normalize();
        this.direction = forward;

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