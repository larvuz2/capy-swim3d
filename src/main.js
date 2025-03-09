import { initScene, render } from './scene.js';
import { initPhysics, updatePhysics } from './physics.js';
import { createCharacter, updateCharacter } from './character.js';
import { initInput, getInput } from './input.js';

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
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Get input state
        const input = getInput();
        
        // Update character based on input
        updateCharacter(character, input);
        
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