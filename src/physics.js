import * as RAPIER from '@dimforge/rapier3d-compat';

// Store the physics objects
const physicsObjects = [];

// Initialize the physics world
export async function initPhysics() {
    // Initialize Rapier
    await RAPIER.init();
    
    // Create a physics world
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);
    
    // Create the ground
    createGround(world);
    
    // Create obstacles
    createObstacles(world);
    
    return world;
}

// Create the ground plane
function createGround(world) {
    // Create a ground collider
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(50.0, 0.1, 50.0);
    groundColliderDesc.setTranslation(0, -0.1, 0);
    
    // Add the ground collider to the world
    const groundCollider = world.createCollider(groundColliderDesc);
    
    // Store the ground physics object
    physicsObjects.push({
        collider: groundCollider,
        type: 'ground'
    });
}

// Create physics obstacles
function createObstacles(world) {
    // Create box obstacles
    const boxPositions = [
        { x: -8, y: 1, z: -5 },
        { x: 8, y: 1, z: -7 },
        { x: 0, y: 1, z: -15 },
        { x: -5, y: 1, z: 10 },
        { x: 10, y: 1, z: 5 }
    ];
    
    boxPositions.forEach(position => {
        // Create a rigid body for the box
        const boxRigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
        boxRigidBodyDesc.setTranslation(position.x, position.y, position.z);
        const boxRigidBody = world.createRigidBody(boxRigidBodyDesc);
        
        // Create a collider for the box
        const boxColliderDesc = RAPIER.ColliderDesc.cuboid(1.0, 1.0, 1.0);
        const boxCollider = world.createCollider(boxColliderDesc, boxRigidBody);
        
        // Store the box physics object
        physicsObjects.push({
            rigidBody: boxRigidBody,
            collider: boxCollider,
            type: 'obstacle'
        });
    });
    
    // Create a ramp
    const rampRigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
    rampRigidBodyDesc.setTranslation(0, 0.5, 10);
    rampRigidBodyDesc.setRotation({ x: Math.PI / 12, y: 0, z: 0 });
    const rampRigidBody = world.createRigidBody(rampRigidBodyDesc);
    
    const rampColliderDesc = RAPIER.ColliderDesc.cuboid(5.0, 0.5, 2.5);
    const rampCollider = world.createCollider(rampColliderDesc, rampRigidBody);
    
    physicsObjects.push({
        rigidBody: rampRigidBody,
        collider: rampCollider,
        type: 'ramp'
    });
}

// Update the physics world
export function updatePhysics(world) {
    // Step the physics world
    world.step();
}

// Create a physics body for the character
export function createCharacterBody(world, position) {
    // Create a dynamic rigid body for the character
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.x, position.y, position.z)
        .setLinearDamping(0.5)
        .setAngularDamping(0.5);
    
    const rigidBody = world.createRigidBody(bodyDesc);
    
    // Create a capsule collider for the character
    const capsuleHeight = 1.0; // Height of the cylindrical part
    const capsuleRadius = 0.5; // Radius of the capsule
    
    const colliderDesc = RAPIER.ColliderDesc.capsule(capsuleHeight / 2, capsuleRadius);
    colliderDesc.setFriction(0.7);
    colliderDesc.setRestitution(0.2);
    
    const collider = world.createCollider(colliderDesc, rigidBody);
    
    return { rigidBody, collider };
}

// Check if the character is grounded
export function isGrounded(world, characterBody, offset = 0.1) {
    // Create a ray from the character's position downward
    const position = characterBody.rigidBody.translation();
    const rayOrigin = { x: position.x, y: position.y, z: position.z };
    const rayDirection = { x: 0, y: -1, z: 0 };
    
    // Cast the ray
    const ray = new RAPIER.Ray(rayOrigin, rayDirection);
    const hit = world.castRay(ray, offset + 0.6, true); // 0.6 is slightly more than capsule radius + half height
    
    return hit !== null;
}