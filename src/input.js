import * as THREE from 'three';
import { getCameraDirection, getCameraRight } from './scene.js';

// Input state
const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
};

// Mouse state
const mouse = {
    x: 0,
    y: 0,
    moveX: 0,
    moveY: 0,
    locked: false
};

// Camera reference
let camera;

// Initialize input handling
export function initInput(cameraRef) {
    camera = cameraRef;
    
    // Keyboard event listeners
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    
    // Mouse event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    
    // Click to lock pointer
    document.addEventListener('click', () => {
        if (!mouse.locked) {
            document.body.requestPointerLock();
        }
    });
}

// Handle key down events
function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.forward = true;
            break;
        case 'KeyS':
        case 'ArrowDown':
            keys.backward = true;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'KeyD':
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'Space':
            keys.jump = true;
            break;
    }
}

// Handle key up events
function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.forward = false;
            break;
        case 'KeyS':
        case 'ArrowDown':
            keys.backward = false;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'KeyD':
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'Space':
            keys.jump = false;
            break;
    }
}

// Handle mouse movement
function onMouseMove(event) {
    if (mouse.locked) {
        mouse.moveX = event.movementX || 0;
        mouse.moveY = event.movementY || 0;
        
        // Update mouse position
        mouse.x += mouse.moveX;
        mouse.y += mouse.moveY;
    }
}

// Handle pointer lock change
function onPointerLockChange() {
    mouse.locked = document.pointerLockElement === document.body;
}

// Get the current input state with camera-relative movement
export function getInput() {
    // Get camera directions
    const cameraForward = getCameraDirection();
    const cameraRight = getCameraRight();
    
    // Initialize movement vector
    const moveDirection = new THREE.Vector3(0, 0, 0);
    
    // Apply camera-relative movement
    if (keys.forward) moveDirection.add(cameraForward);
    if (keys.backward) moveDirection.sub(cameraForward);
    if (keys.right) moveDirection.add(cameraRight);
    if (keys.left) moveDirection.sub(cameraRight);
    
    // Normalize if there's movement
    if (moveDirection.lengthSq() > 0) {
        moveDirection.normalize();
    }
    
    // Create direction object
    const direction = {
        forward: -moveDirection.z, // Negate z for correct forward direction
        right: moveDirection.x,
        up: 0
    };
    
    // Set jump
    if (keys.jump) direction.up = 1;
    
    // Mouse movement (for camera rotation)
    const mouseLook = {
        x: mouse.moveX,
        y: mouse.moveY
    };
    
    // Reset mouse movement after reading
    mouse.moveX = 0;
    mouse.moveY = 0;
    
    return {
        direction,
        mouseLook,
        jump: keys.jump,
        moveVector: moveDirection // Add the raw movement vector for character rotation
    };
}