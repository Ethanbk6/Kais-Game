const config = {
    type: Phaser.AUTO,    // Phaser will use WebGL if available, otherwise Canvas
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    physics: {
        default: 'matter',
        matter: {
            gravity: {y: 1}, 
            debug: false
        }
    },
    scene: { preload, create, update } // Game scenes
  };
  
  // Start the Phaser game
  const game = new Phaser.Game(config);
  
  // Load assets
  function preload() {
    this.load.image('spike', 'assets/spike.png');
    this.load.image('ground', 'assets/ground.png')
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 49,    
      frameHeight: 49,
    })
  };
  

  let isOnGround = false; // Track if the player is on the ground
  // Create game objects
  function create() { 
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, true, true);

    const spike = this.matter.add.image(500, 570, 'spike', null, { isStatic: true });
  
    // Set a custom collision shape for the spike (if it's triangular)
    spike.setCollisionCategory(1); // Set custom collision category (optional)
    const spikeBody = this.matter.add.fromVertices(400, 570, [
      { x: 0, y: 30 },   // top tip
      { x: 15, y: 0 },   // Top tip
      { x: 30, y: 30 }   // Bottom-right
    ], { isStatic: true });
    
    // Attach the body to the spike image
    spike.setExistingBody(spikeBody);
    
    // Add ground
    const ground = this.matter.add.image(400, 610, 'ground', null, { isStatic: true });
    ground.setScale(2).setStatic(true);

    // Create the player
    player = this.matter.add.sprite(100, 450, 'player');
    player.setFixedRotation(); // Prevent rotation on collision

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'stand',
      frames: [{key: 'player', frame: 1}],
      frameRate: 20
    })

     // Detect collisions with the ground
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === player.body || pair.bodyB === player.body) {
          if (pair.bodyA === ground.body || pair.bodyB === ground.body) {
            isOnGround = true; // Player is on the ground
          }
        }
      });
    });

    // Detect when the player leaves the ground
    this.matter.world.on('collisionend', (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === player.body || pair.bodyB === player.body) {
          if (pair.bodyA === ground.body || pair.bodyB === ground.body) {
            isOnGround = false; // Player is no longer on the ground
          }
        }
      });
    });

    controls = this.input.keyboard.createCursorKeys()
  };
  
  // Update game loop
  function update() {
    if(controls.up.isDown && isOnGround) {
      player.setVelocityY(-8);
    }
    else {
      player.setVelocityX(0);
      player.anims.play('walk', true)
    }
    if(!isOnGround){
      player.anims.play('up', true)
    }
  };
  