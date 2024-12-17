const config = {
    type: Phaser.AUTO,    // Phaser will use WebGL if available, otherwise Canvas
    width: 800,           // Game canvas width
    height: 600,          // Game canvas height
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
    this.load.image('player', 'assets/player.png');
  };
  
  // Create game objects
  function create() {

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 300, 'spike');

    player = this.physics.add.sprite();
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'Left',
    })

    controls = this.input.keyboard.createCursorKeys()

    //if(controls.left.isUp)()
  };
  
  // Update game loop
  function update() {
    
  };
  