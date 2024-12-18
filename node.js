const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
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
}

let isOnGround = false; // Track if the player is on the ground
let spikes = []; // To track all spikes that are spawned
let player;
let controls;
let spawnTimer;

// Create game objects
function create() {
  this.matter.world.setBounds(0, 0, 800, 600, 32, false, true, true, true);

  // Add ground
  const ground = this.matter.add.image(400, 610, 'ground', null, { isStatic: true });
  ground.setScale(2).setStatic(true);

  // Create the player
  player = this.matter.add.sprite(150, 450, 'player');
  player.setFixedRotation(); // Prevent rotation on collision

  // Player animations
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
    frames: [{ key: 'player', frame: 1 }],
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

  controls = this.input.keyboard.createCursorKeys();

  // Spike spawn timer
  spawnTimer = this.time.addEvent({
    delay: 2000, // Spawn spikes every 2 seconds
    callback: spawnSpike,
    callbackScope: this,
    loop: true,
  });
}

// Update game loop
function update() {
  // Player movement (left/right)
  /*if (controls.right.isDown) {
    player.setVelocityX(4);
  } else if (controls.left.isDown) {
    player.setVelocityX(-4);
  } else {
    player.setVelocityX(0);
  }*/

  // Player jumping (up)
  if (controls.up.isDown && isOnGround) {
    player.setVelocityY(-8);
  } else {
    player.anims.play('walk', true);
  }
  if (!isOnGround) {
    player.anims.play('up', true);
  }

  // Move spikes to the left and remove them when they go off-screen
  spikes.forEach((spike, index) => {
    spike.x -= 6; // Move spike left

    if (spike.x < -50) {
      spike.destroy();
      spikes.splice(index, 1); // Remove from the array
    }

    // Collision detection between player and spikes
    if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), spike.getBounds())) {
      console.log("Game Over! Player hit a spike.");
      // Handle game over (reset game or stop movement)
      this.scene.restart();
    }
  });
}

// Function to spawn spikes
function spawnSpike() {
  const spike = this.matter.add.image(800, 570, 'spike', null, { isStatic: false });

  // Set a custom collision shape for the spike (if it's triangular)
  const spikeBody = this.matter.add.fromVertices(800, 600, [
    { x: 0, y: 30 }, // top tip
    { x: 15, y: 0 }, // Top tip
    { x: 30, y: 30 } // Bottom-right
  ], { isStatic: false });

  // Attach the body to the spike image
  spike.setExistingBody(spikeBody);

  // Set a velocity to move the spike left
  spike.setVelocityX(-6);

  // Add the spike to the array for later management
  spikes.push(spike);
}
