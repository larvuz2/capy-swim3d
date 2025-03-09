import * as dat from 'dat.gui';
import { cameraParams } from './camera.js';

// Create a params object to store all adjustable parameters
export const params = {
    // Physics parameters
    gravity: -18.5,
    
    // Character movement parameters
    movementSpeed: 1.0,
    jumpForce: 1.0,
    maxVelocity: 2.4,
    
    // Character physics parameters
    linearDamping: 1.0,
    angularDamping: 0.25,
    friction: 1.0,
    restitution: 1.0,
    
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
    const cameraFolder = gui.addFolder('Camera');
    
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
    
    // Add camera parameters
    cameraFolder.add(cameraParams, 'distance').min(1).max(20).step(0.1).name('Camera Distance');
    cameraFolder.add(cameraParams, 'height').min(1).max(15).step(0.1).name('Camera Height');
    cameraFolder.add(cameraParams, 'minHeight').min(1).max(10).step(0.1).name('Min Height');
    cameraFolder.add(cameraParams, 'angle').min(0).max(Math.PI/2).step(0.01).name('Camera Angle');
    cameraFolder.add(cameraParams, 'smoothness').min(0.01).max(1).step(0.01).name('Camera Smoothness');
    cameraFolder.add(cameraParams, 'rotationSpeed').min(0.0005).max(0.01).step(0.0005).name('Rotation Speed');
    cameraFolder.add(cameraParams, 'lookAtHeight').min(0).max(5).step(0.1).name('Look At Height');
    
    // Open all folders by default
    physicsFolder.open();
    movementFolder.open();
    characterPhysicsFolder.open();
    cameraFolder.open();
    
    // Position the GUI on the right side
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '10px';
    gui.domElement.style.right = '10px';
    
    return gui;
}