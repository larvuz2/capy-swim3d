import { initScene, render } from './scene.js';
import { initPhysics, updatePhysics } from './physics.js';
import { createCharacter, updateCharacter } from './character.js';
import { initInput, getInput } from './input.js';
import { initGUI } from './gui.js';
import { initThirdPersonCamera, updateCamera } from './camera.js';
import * as THREE from 'three';

// Initialize the application
async function init() {
    // Initialize the scene
    const { scene, camera, renderer } = initScene();
    
    // Initialize the physics world
    const world = await initPhysics();
    
    // Initialize input handling
    initInput(camera);
    
    // Create the character
    const character = createCharacter(scene, world);
    
    // Initialize the third-person camera
    const thirdPersonCamera = initThirdPersonCamera(camera, character.mesh);
    
    // Initialize the GUI
    const gui = initGUI(world, character);
    
    // Create a clock for animation timing
    const clock = new THREE.Clock();
    
    // Make sure no axis helpers are visible
    scene.traverse((object) => {
        if (object instanceof THREE.AxesHelper || 
            object instanceof THREE.GridHelper || 
            (object instanceof THREE.LineSegments && object.type === 'LineSegments')) {
            scene.remove(object);
            console.log('Removed helper object from scene');
        }
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Get delta time for animations
        const deltaTime = clock.getDelta();
        
        // Get input state
        const input = getInput();
        
        // Update character based on input
        updateCharacter(character, input, deltaTime);
        
        // Update camera
        updateCamera();
        
        // Step the physics simulation
        updatePhysics(world);
        
        // Render the scene
        render(scene, camera, renderer);
    }
    
    // Start the animation loop
    animate();
}

// Start the application
init().catch(console.error); 