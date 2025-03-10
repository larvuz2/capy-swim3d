import { initScene, render } from './scene.js';
import { initPhysics, updatePhysics } from './physics.js';
import { createCharacter, updateCharacter } from './character.js';
import { initInput, getInput } from './input.js';
import { initGUI } from './gui.js';
import { initThirdPersonCamera, updateCamera } from './camera.js';
import * as THREE from 'three';

// Debug flag
const DEBUG = true;

// Initialize the application
async function init() {
    if (DEBUG) console.log('Initializing application...');
    
    // Initialize the scene
    const { scene, camera, renderer } = initScene();
    
    // Initialize the physics world
    const world = await initPhysics();
    
    // Initialize input handling
    initInput(camera);
    
    // Create the character
    if (DEBUG) console.log('Creating character...');
    const character = createCharacter(scene, world);
    
    // Initialize the third-person camera
    const thirdPersonCamera = initThirdPersonCamera(camera, character.mesh);
    
    // Initialize the GUI
    const gui = initGUI(world, character);
    
    // Create a clock for animation timing
    const clock = new THREE.Clock();
    
    if (DEBUG) {
        // Log scene information for debugging
        console.log('Scene initialized with:', scene.children.length, 'objects');
        console.log('Character mesh:', character.mesh);
        
        // Add a helper to visualize the character position
        const axesHelper = new THREE.AxesHelper(2);
        character.mesh.add(axesHelper);
        
        // Add a helper to visualize the light direction
        const directionalLight = scene.children.find(child => child instanceof THREE.DirectionalLight);
        if (directionalLight) {
            const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
            scene.add(lightHelper);
        }
    }
    
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
    if (DEBUG) console.log('Starting animation loop...');
    animate();
}

// Start the application
init().catch(error => {
    console.error('Error initializing application:', error);
    
    // Display error on screen for easier debugging
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.fontFamily = 'Arial, sans-serif';
    errorDiv.style.zIndex = '1000';
    errorDiv.innerHTML = `<h3>Error</h3><p>${error.message}</p>`;
    document.body.appendChild(errorDiv);
});