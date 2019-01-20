#version 300 es

precision highp float;
precision highp int;
uniform vec3 bunnyPosition;

out vec4 out_FragColor; 

// HINT: YOU WILL NEED TO PASS IN THE CORRECT VARYING (SHARED) VARIABLE)
in vec3 interpolatedNormal;
in vec3 interpolatedNormalEgg;
uniform float t2;

void main() {

  // HINT: YOU WILL NEED TO SET YOUR OWN DISTANCE THRESHOLD
    vec3 colour = normalize(interpolatedNormalEgg);
    colour.x += sin(t2);
    colour.y += sin(t2);
    colour.z += sin(t2);
    float distance_threshold = 3.0;
    if (distance(bunnyPosition, interpolatedNormal)<distance_threshold){
  // Set constant color red
        out_FragColor = vec4(colour, 1.0); // REPLACE ME
        }
        else{
            out_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }

}
