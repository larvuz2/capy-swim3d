import * as dat from 'dat.gui';

// Create a params object to store all adjustable parameters
export const params = {
    // Physics parameters
    gravity: -9.81,
    
    // Character movement parameters
    movementSpeed: 5.0,
    jumpForce: 10.0,
    maxVelocity: 10.0,
    
    // Character physics parameters
    linearDamping: 0.5,
    angularDamping: 0.5,
    friction: 0.7,
    restitution: 0.2,
    
    // Air control
    airControlFactor: 0.2
};

// Initialize the GUI
export function initGUI(world, character) {
    // Create a new GUI instance
    const gui = new dat.GUI({ width: 300 });
    
    // Create folders for different parameter categories
    const physicsFolder = gui.addFolder('Physics');
    const movementFolder = gui.addFolder('Movement');
    const characterPhysicsFolder = gui.addFolder('Character Physics');
    
    // Add physics parameters
    physicsFolder.add(params, 'gravity').min(-20).max(0).step(0.1).name('Gravity').onChange((value) => {
        // Update the world gravity when the slider changes
        world.gravity.y = value;
    });
    
    // Add movement parameters
    movementFolder.add(params, 'movementSpeed').min(1).max(15).step(0.1).name('Movement Speed');
    movementFolder.add(params, 'jumpForce').min(1).max(20).step(0.1).name('Jump Force');
    movementFolder.add(params, 'maxVelocity').min(1).max(20).step(0.1).name('Max Velocity');
    movementFolder.add(params, 'airControlFactor').min(0).max(1).step(0.01).name('Air Control');
    
    // Add character physics parameters
    characterPhysicsFolder.add(params, 'linearDamping').min(0).max(1).step(0.01).name('Linear Damping').onChange((value) => {
        character.physicsBody.rigidBody.setLinearDamping(value);
    });
    
    characterPhysicsFolder.add(params, 'angularDamping').min(0).max(1).step(0.01).name('Angular Damping').onChange((value) => {
        character.physicsBody.rigidBody.setAngularDamping(value);
    });
    
    characterPhysicsFolder.add(params, 'friction').min(0).max(1).step(0.01).name('Friction').onChange((value) => {
        character.physicsBody.collider.setFriction(value);
    });
    
    characterPhysicsFolder.add(params, 'restitution').min(0).max(1).step(0.01).name('Restitution').onChange((value) => {
        character.physicsBody.collider.setRestitution(value);
    });
    
    // Open all folders by default
    physicsFolder.open();
    movementFolder.open();
    characterPhysicsFolder.open();
    
    // Position the GUI on the right side
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '10px';
    gui.domElement.style.right = '10px';
    
    return gui;
}