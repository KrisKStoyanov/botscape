class EnemyNPC extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture)
    {
        super(scene, x, y, texture)

        this.movementSpeed = 35;
        this.powerDrainPerHit = 0.1;
        this.refocusTimer = 60;
        this.refocusCooldown = 60;
        this.direction = new Phaser.Math.Vector2(-1.0, 0.0);
        this.targetPosition = new Phaser.Math.Vector2(this.body?.position.x || 0, this.body?.position.y || 0);
        this.visibilityDistance = 512;
        this.chasing = false;
        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }

    update(deltaTime: number, target: Phaser.Math.Vector2): void
    {
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
        console.log('patrol');
        let patrolTargetPositionX: number = this.body?.position.x || 0;
        let patrolTargetPositionY: number = this.body?.position.y || 0;

        patrolTargetPositionX -= this.targetPosition.x;
        patrolTargetPositionY -= this.targetPosition.y;

        let patrolForward: Phaser.Math.Vector2 = new Phaser.Math.Vector2(patrolTargetPositionX, patrolTargetPositionY).negate().normalize();
        this.direction = patrolForward;
        this.setVelocity(patrolForward.x * this.movementSpeed, patrolForward.y * this.movementSpeed);
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

        this.setVelocity(forward.x * this.movementSpeed, forward.y * this.movementSpeed);
    }

    targetPosition: Phaser.Math.Vector2;
    direction: Phaser.Math.Vector2;
    movementSpeed: number;
    powerDrainPerTick: number;
    powerDrainPerHit: number;
    refocusTimer: number;
    refocusCooldown: number;
    visibilityDistance: number;
    chasing: boolean;
}

export default EnemyNPC;