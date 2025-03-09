# 3D Models Directory

This directory is where you should place your 3D model files for the capybara character.

## Required Files

1. Place your capybara GLTF/GLB file in this directory:
   - `capybara.glb` (preferred) or `capybara.gltf`

2. If your GLTF file references external textures, place them in the `textures/` subdirectory:
   - `textures/capybara_texture.png` (or whatever texture files your model requires)

## Model Requirements

- The model should be properly scaled to fit the character capsule (approximately 1.5 units tall)
- The model should be centered at the origin (0,0,0)
- The model should face the positive Z direction (forward)
- If possible, the model should include an idle animation

## Supported Formats

While GLTF/GLB is the preferred format for Three.js, the following formats are also supported:
- GLTF/GLB (recommended)
- FBX
- OBJ (with MTL materials)
- DAE (Collada)

## Adding Your Own Models

1. Export your model from your 3D software in GLTF/GLB format
2. Place the file in this directory
3. If needed, adjust the scale and position in the `loadCapybaraModel` function in `src/character.js` 