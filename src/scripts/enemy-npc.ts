class EnemyNPC extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture)
    {
        super(scene, x, y, texture)

        this.power = 100.0;
        this.powerDrainPerTick = 0.1;
        this.movementSpeed = 55;
        this.refocusTimer = 60;
        this.refocusCooldown = 60;
        this.direction = new Phaser.Math.Vector2(-1.0, 0.0);
        this.velocity = new Phaser.Math.Vector2(0.0, 0.0);
        this.targetPosition = new Phaser.Math.Vector2(this.body?.position.x || 0, this.body?.position.y || 0);
        this.visibilityDistance = 512;
        
        this.playerFoundSound = scene.sound.add('enemy-player-found');
        this.deathSound = scene.sound.add('enemy-bot-death');

        this.chasing = false;
        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }

    update(deltaTime: number, target: Phaser.Math.Vector2): void
    {
        this.power -= (this.powerDrainPerTick * deltaTime);

        this.setVelocity(this.velocity.x, this.velocity.y);
        this.refocusTimer -= deltaTime;
        if(this.refocusTimer < 0)
            {
                this.refocusTimer = this.refocusCooldown;

                let targetPositionX: number = 0;
                let targetPositionY: number = 0;
                if(this.body?.position.equals(target))
                    {
                        this.chasing = false;
                    }

                if(this.chasing)
                    {
                        if(this.search(target))
                            {
                                return this.chase(target);
                            }
                        targetPositionX = target.x;
                        targetPositionY = target.y;
                    }
                else
                {   
                    if(this.search(target))
                        {
                            this.playerFoundSound.play();
                            return this.chase(target);
                        }
                    targetPositionX = this.body?.position.x || 0;
                    targetPositionY = this.body?.position.y || 0;
                }

                let randomPositionX: number = Phaser.Math.Between(targetPositionX - targetPositionX / 2,
                 targetPositionX + targetPositionX / 2);
                let randomPositionY: number = Phaser.Math.Between(targetPositionY - targetPositionY / 2,
                 targetPositionY + targetPositionY / 2);

                this.targetPosition = new Phaser.Math.Vector2(randomPositionX, randomPositionY);

                let randomActionChoice: number = Phaser.Math.Between(0, 100);
                if(randomActionChoice > 25)
                    {
                        return this.patrol();
                    }
                else
                {
                    return this.idle();
                }
            }

            if(this.power < 0)
                {
                    this.deathSound.play();
                    this.destroy();
                }
    }

    idle(): void
    {
        this.velocity.x = 0.0;
        this.velocity.y = 0.0;
        this.setVelocity(this.velocity.x, this.velocity.y);
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
        console.log('patrol');
        let patrolTargetPositionX: number = this.body?.position.x || 0;
        let patrolTargetPositionY: number = this.body?.position.y || 0;

        patrolTargetPositionX -= this.targetPosition.x;
        patrolTargetPositionY -= this.targetPosition.y;

        let patrolForward: Phaser.Math.Vector2 = new Phaser.Math.Vector2(patrolTargetPositionX, patrolTargetPositionY).negate().normalize();
        this.direction = patrolForward;
        this.velocity.x = patrolForward.x * this.movementSpeed;
        this.velocity.y = patrolForward.y * this.movementSpeed;
        this.setVelocity(this.velocity.x, this.velocity.y);
    }

    chase(target: Phaser.Math.Vector2): void
    {
        console.log('chase');
        let forwardX = this.body?.position.x || 0.0;
        let forwardY = this.body?.position.y || 0.0;

        forwardX -= target.x;
        forwardY -= target.y;
        let forward = new Phaser.Math.Vector2(forwardX, forwardY).negate().normalize();
        this.direction = forward;
        this.targetPosition = target;
        this.chasing = true;

        this.velocity.x = forward.x * this.movementSpeed;
        this.velocity.y = forward.y * this.movementSpeed;
        this.setVelocity(this.velocity.x, this.velocity.y);
    }

    pause(): void
    {
        this.setVelocity(0.0, 0.0);
    }

    collectBattery(amount: number): void
    {
        this.power += amount;
    }

    velocity: Phaser.Math.Vector2;
    targetPosition: Phaser.Math.Vector2;
    direction: Phaser.Math.Vector2;
    movementSpeed: number;
    powerDrainPerTick: number;
    power: number;
    refocusTimer: number;
    refocusCooldown: number;
    visibilityDistance: number;
    chasing: boolean;

    playerFoundSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    deathSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
}

export default EnemyNPC;