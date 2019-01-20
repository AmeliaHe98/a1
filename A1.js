/*
 * UBC CPSC 314, Vjan2019
 * Assignment 1 Template
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

// SETUP RENDERER & SCENE
var container = document.createElement( 'div' );
document.body.appendChild( container );

var canvas = document.createElement("canvas");
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor(0XAFEEEE); // green background colour
container.appendChild( renderer.domElement );
var scene = new THREE.Scene();

// SETUP CAMERA
var w = window.innerWidth, h = window.innerHeight;
var camera = new THREE.PerspectiveCamera(45,w/h,1,1000); // view angle, aspect ratio, near, far
camera.position.z=150;
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxesHelper(5) ;
scene.add(worldFrame);

// FLOOR WITH PATTERN
var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2, 2);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// UNIFORMS
var bunnyPosition = {type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};
var time = {type: 'f', value: 0};
var t2 = {type: 'f', value: 0};
//var explode = new Boolean(false);

// MATERIALS: specifying uniforms and shaders
var bunnyMaterial = new THREE.ShaderMaterial({
    uniforms: { bunnyPosition: bunnyPosition,
                time:time,
                //explode:explode,
    }
});
var eggMaterial = new THREE.ShaderMaterial({
    uniforms: { bunnyPosition: bunnyPosition,
                                            t2:t2,
    }
    });

// LOAD SHADERS
var shaderFiles = [
  'glsl/bunny.vs.glsl',
  'glsl/bunny.fs.glsl',
  'glsl/egg.vs.glsl',
  'glsl/egg.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  bunnyMaterial.vertexShader = shaders['glsl/bunny.vs.glsl'];
  bunnyMaterial.fragmentShader = shaders['glsl/bunny.fs.glsl'];

  eggMaterial.vertexShader = shaders['glsl/egg.vs.glsl'];
  eggMaterial.fragmentShader = shaders['glsl/egg.fs.glsl'];
})

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

// LOAD BUNNY
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var manager = new THREE.LoadingManager();
          manager.onProgress = function (item, loaded, total) {
    console.log( item, loaded, total );
  };

  var onProgress = function (xhr) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function (xhr) {
  };

  var loader = new THREE.OBJLoader( manager );
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = worldFrame;
    scene.add(object);

  }, onProgress, onError);
}

loadOBJ('obj/bunny.obj', bunnyMaterial, 20, 0,-0.7,0, 0,0,0);
loadOBJ('obj/bunny.obj', bunnyMaterial, 20, 0,0,10, 0,0,0);

// CREATE GIANT EGG
var geometry = new THREE.SphereGeometry(70, 80, 20);

var colors = [];
for (var i=0; i<geometry.vertices.length;i++){
    colors[i]=new THREE.Color();
    colors[i].setHSL(Math.random(), 1.0, 0.5);
}
geometry.colors=colors
var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
material = new THREE.PointsMaterial({size:8, transparent: true, opacity:0.7, vertexColors:true});
mesh = new THREE.Points(geometry,material)

var geometry2 = new THREE.Geometry();
geometry2.colors=colors;
var vertices = mesh.geometry.vertices;
vertices.forEach(function (p){
                 var particle = new THREE.Vector3(p.x, p.y, p.z);
                 particle.vy = 0.05 + Math.random()*0.5;
                 geometry2.vertices.push(particle);
                 });
mesh2 = new THREE.Points(geometry2,material);
scene.add(mesh2);
mesh2.sortParticles = true;
//var egg = new THREE.Mesh(eggGeometry, eggMaterial);
//mesh.position.set(5.0, 0.3, 5.0);
//mesh.scale.set(0.3, 0.4, 0.3);
//mesh.parent = worldFrame;
//scene.add(mesh);
renderer.render(scene, camera);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    bunnyPosition.value.z -= 0.1;
  else if (keyboard.pressed("S"))
    bunnyPosition.value.z += 0.1;

  if (keyboard.pressed("A"))
    bunnyPosition.value.x -= 0.1;
  else if (keyboard.pressed("D"))
    bunnyPosition.value.x += 0.1;
  
  if (keyboard.pressed("X")){
      var eggGeometry = new THREE.SphereGeometry(1, 32, 32);
      var egg = new THREE.Mesh(eggGeometry, eggMaterial);
      egg.position.set(bunnyPosition.value.x, bunnyPosition.value.y, bunnyPosition.value.z);
      egg.scale.set(0.3, 0.4, 0.3);
      egg.parent = worldFrame;
      scene.add(egg);
  }
    if (keyboard.pressed("Z")){

            time.value +=0.1;
        }
    if (keyboard.pressed("C")){
        
        t2.value +=0.1;
    }

  bunnyMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
  eggMaterial.needsUpdate = true;
  //mesh2.needsUpdate = true;
}
//animate()
//function animate(){
//    requestAnimationFrame(animate);
//    mesh.rotation.x +=0.0015;
//    mesh.rotation.y +=0.005;
//    renderer.render(scene,camera)l
//}
//</script>
//<script src="http://mrdoob.github.com/three.js/examples/js/controls/OrbitControls.js">
//controls = new THREE.OrbitControls(camera);
//controls.addEventListener('change', render);
//function render

// SETUP UPDATE CALL-BACK
update();
var y = 100;
function update() {
  checkKeyboard();
    //requestAnimationFrame(animate);
    requestAnimationFrame(update);
    //mesh.rotation.x -=0.05;
    //mesh.rotation.y -=0.05;
    mesh2.rotation.x +=0.0015;
    mesh2.rotation.y +=0.005;
    
    var geometry = mesh2.geometry;
    geometry.vertices.forEach(function (v) {
                     v.y -= v.vy;
                              if(v.y<=0)(v.vy =0);                   });
    geometry.verticesNeedUpdate = true;
    
  renderer.render(scene, camera);
}



