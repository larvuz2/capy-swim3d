# GLB Model Instructions

## Important: Place Your GLB Model Here

The code is now configured to prioritize loading the GLB model format. Please place your `capybara.glb` file directly in this directory (models/).

## Model Requirements

- The model should be named `capybara.glb`
- It should be placed directly in the models/ directory
- The model should be properly scaled to fit the character capsule

## Visibility Settings

The code has been updated to ensure:
1. The capsule collider remains invisible (opacity 0)
2. The GLB model is fully visible (opacity 1)
3. The GLB model is properly attached as a child of the capsule

## Debugging

If you're still having issues seeing the model:
1. Check the browser console for any loading errors
2. Verify that your GLB file is correctly placed in the models/ directory
3. Make sure your GLB file is a valid 3D model

The code includes extensive debugging to help identify any issues with model loading.