#version 300 es

precision highp float;
precision highp int;
out vec4 out_FragColor;

// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
in vec3 interpolatedNormal;

void main() {
  // Set final rendered color to red
  out_FragColor = vec4(interpolatedNormal, 1.0); // REPLACE ME
}
