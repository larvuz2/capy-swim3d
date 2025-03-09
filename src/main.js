import { initScene, render, camera, controls } from './scene.js';
import { initPhysics, updatePhysics } from './physics.js';
import { createCharacter, updateCharacter } from './character.js';
import { initInput, getInput } from './input.js';

// Initialize the application
async function init() {
    // Initialize the scene
    const { scene, renderer } = initScene();
    
    // Initialize the physics world
    const world = await initPhysics();
    
    // Initialize input handling
    initInput(camera);
    
    // Create the character
    const character = createCharacter(scene, world);
    
    // Set initial camera position behind character
    const initialOffset = { x: 0, y: 2, z: 5 };
    camera.position.set(
        character.mesh.position.x + initialOffset.x,
        character.mesh.position.y + initialOffset.y,
        character.mesh.position.z + initialOffset.z
    );
    
    // Set initial camera target to character
    controls.target.copy(character.mesh.position);
    controls.update();
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Get input state with camera-relative movement
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