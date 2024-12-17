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
    this.load.image()
  }
  
  // Create game objects
  function create() {
    this.add.image()
    platforms = this.physics.add.staticGroup()
    platforms.create()
  }
  
  // Update game loop
  function update() {
    
  }
  