const config = {
    type: Phaser.AUTO,    // Phaser will use WebGL if available, otherwise Canvas
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300}, 
            debug: false
        }
    },
    scene: { preload, create, update } // Game scenes
  };
  
  // Start the Phaser game
  const game = new Phaser.Game(config);
  
  // Load assets
  function preload() {
    this.load.image('spike', 'assets/spike.jpeg');
    this.load.image('ground', 'assets/ground.png')
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 49,    
      frameHeight: 49,
    })
  };
  
  // Create game objects
  function create() {

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 560, 'spike');
    platforms.create(400, 600, 'ground').setScale(2).refreshBody();;

    player = this.physics.add.sprite(100, 450, 'player');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms)

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'stand',
      frames: [{key: 'player', frame: 1}],
      frameRate: 20
    })

    controls = this.input.keyboard.createCursorKeys()
  };
  
  // Update game loop
  function update() {
    
    if(controls.right.isDown) {
      player.setVelocityX(100);
      player.anims.play('right', true)
    }
    else if(controls.left.isDown) {
      player.setVelocityX(-100);
      player.anims.play('right', true)
    }
    else {
      player.setVelocityX(0);
      player.anims.play('stand', true)
    }
    if (controls.up.isDown && player.body.touching.down) {
      player.setVelocityY(-200);
      
    }
    if(!player.body.touching.down) {
      player.anims.play('up', true);
    }
    
  };
  