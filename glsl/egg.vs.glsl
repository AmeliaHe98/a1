#version 300 es
uniform vec3 bunnyPosition;
out vec3 interpolatedNormal;
out vec3 interpolatedNormalEgg;

// HINT: YOU WILL NEED TO PASS IN THE CORRECT UNIFORM AND CREATE THE CORRECT SHARED VARIABLE

void main() {

  	// HINT: BE MINDFUL OF WHICH COORDINATE SYSTEM THE BUNNY'S POSITION IS IN
    interpolatedNormalEgg =normal;
    interpolatedNormal = vec3(modelMatrix * vec4( position, 1.0 ));

    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
