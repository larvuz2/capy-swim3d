import * as THREE from 'three';
import { params } from './gui.js';

// Camera parameters
export const cameraParams = {
    distance: 10,      // Distance behind character
    height: 7,         // Height above character
    minHeight: 3,      // Minimum height from ground
    angle: 0.3,        // Camera angle (in radians) - looking down at character
    smoothness: 0.1,   // Camera smoothness (0-1)
    rotationSpeed: 0.002, // Mouse rotation sensitivity
    lookAtHeight: 1.5, // Height offset for lookAt point
};

let camera;
let target;
let mouseX = 0;
let mouseY = 0;
let targetRotationY = 0;
let currentRotationY = 0;

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
    
    // Calculate horizontal distance based on height and angle
    const horizontalDistance = cameraParams.distance;
    
    // Calculate camera position in a way that ensures it's above the character
    // Use spherical coordinates for better control
    const phi = Math.PI/2 - cameraParams.angle; // Angle from y-axis (0 = directly above)
    const theta = currentRotationY; // Horizontal angle
    
    // Convert spherical to cartesian coordinates
    const x = horizontalDistance * Math.sin(phi) * Math.sin(theta) + targetPosition.x;
    const z = horizontalDistance * Math.sin(phi) * Math.cos(theta) + targetPosition.z;
    
    // Calculate height ensuring it's always above the character and ground
    const effectiveHeight = Math.max(cameraParams.height, cameraParams.minHeight);
    const y = targetPosition.y + effectiveHeight;
    
    // Set desired camera position
    const desiredPosition = new THREE.Vector3(x, y, z);
    
    // Smoothly move camera to desired position
    camera.position.lerp(desiredPosition, cameraParams.smoothness);
    
    // Calculate lookAt point (at character position plus lookAtHeight)
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