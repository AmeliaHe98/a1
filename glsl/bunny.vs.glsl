#version 300 es

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 bunnyPosition;

uniform float time;

//uniform bool explode;
// Create shared variable for the vertex and fragment shaders
out vec3 interpolatedNormal;

void main() {
    // Set shared variable to vertex normal
    interpolatedNormal = normal;

    // HINT: USE bunnyPosition HERE

    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
    vec4 newVector = modelMatrix*vec4(position+normal*sin(time),1.0);
    newVector.x += bunnyPosition.x;
    newVector.y += bunnyPosition.y;
    newVector.z += bunnyPosition.z;
    gl_Position = projectionMatrix * viewMatrix * newVector;

}
