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

// Get the current input state
export function getInput() {
    // Calculate movement direction based on camera orientation
    const direction = {
        forward: 0,
        right: 0,
        up: 0
    };
    
    // Forward/backward movement (inverted)
    if (keys.forward) direction.forward -= 1;
    if (keys.backward) direction.forward += 1;
    
    // Left/right movement
    if (keys.right) direction.right += 1;
    if (keys.left) direction.right -= 1;
    
    // Jump
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
        jump: keys.jump
    };
}