import * as THREE from 'three';
import { params } from './gui.js';

// Camera parameters
export const cameraParams = {
    distance: 5.4,      // Distance behind character (updated)
    height: 1.5,        // Height above character (updated)
    smoothness: 0.1,    // Camera smoothness (0-1)
    rotationSpeed: 0.002, // Mouse rotation sensitivity
    lookAtHeight: 1.9,  // Height offset for lookAt point (updated)
    minPolarAngle: 0.1,  // Minimum angle (looking up)
    maxPolarAngle: Math.PI / 2 - 0.1, // Maximum angle (looking down)
};

let camera;
let target;
let mouseX = 0;
let mouseY = 0;
let targetRotationY = 0;
let currentRotationY = 0;
let verticalAngle = 0;

// Initialize the third-person camera
export function initThirdPersonCamera(cameraRef, targetRef) {
    camera = cameraRef;
    target = targetRef;
    
    // Set initial camera position
    updateCameraPosition();
    
    // Add mouse event listener for camera rotation
    document.addEventListener('mousemove', onMouseMove);
    
    return { updateCamera };
}

// Handle mouse movement
function onMouseMove(event) {
    // Only rotate camera if pointer is locked
    if (document.pointerLockElement === document.body) {
        mouseX = event.movementX || 0;
        mouseY = event.movementY || 0;
        
        // Update target rotation based on mouse X movement
        targetRotationY -= mouseX * cameraParams.rotationSpeed;
        
        // Update vertical angle based on mouse Y movement (with limits)
        verticalAngle -= mouseY * cameraParams.rotationSpeed;
        verticalAngle = Math.max(cameraParams.minPolarAngle, 
                                Math.min(cameraParams.maxPolarAngle, verticalAngle));
    }
}

// Update camera position and rotation
function updateCameraPosition() {
    if (!target || !camera) return;
    
    // Smoothly interpolate the horizontal rotation
    currentRotationY = THREE.MathUtils.lerp(
        currentRotationY,
        targetRotationY,
        cameraParams.smoothness
    );
    
    // Get target position (character position)
    const targetPosition = target.position.clone();
    
    // Calculate camera position behind and above the character
    // Using negative sin/cos for the X/Z to position camera behind character
    const cameraX = targetPosition.x - Math.sin(currentRotationY) * cameraParams.distance;
    const cameraY = targetPosition.y + cameraParams.height; // Position camera above character
    const cameraZ = targetPosition.z - Math.cos(currentRotationY) * cameraParams.distance;
    
    // Set desired camera position
    const desiredPosition = new THREE.Vector3(cameraX, cameraY, cameraZ);
    
    // Smoothly move camera to desired position
    camera.position.lerp(desiredPosition, cameraParams.smoothness);
    
    // Calculate lookAt point (slightly above character)
    const lookAtPoint = targetPosition.clone().add(
        new THREE.Vector3(0, cameraParams.lookAtHeight, 0)
    );
    
    // Make camera look at the character
    camera.lookAt(lookAtPoint);
}

// Update function to be called in animation loop
export function updateCamera() {
    updateCameraPosition();
    
    // Return the current rotation for character movement
    return {
        rotationY: currentRotationY
    };
}

// Get current camera rotation
export function getCameraRotation() {
    return currentRotationY;
}