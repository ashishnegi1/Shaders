import * as THREE from 'three';
import'./style.css';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthTexture from './textures/earth.jpg';
import starsTexture from './textures/stars.jpg';
import sunTexture from './textures/sun.jpg';
import mercuryTexture from './textures/mercury.jpg';
import venusTexture from './textures/venus.jpg';
import marsTexture from './textures/mars.jpg';
import jupiterTexture from './textures/jupiter.jpg';
import saturnTexture from './textures/saturn.jpg';
import saturnRingTexture from './textures/saturnRings.png';
import uranusTexture from './textures/uranus.jpg';
import neptuneTexture from './textures/neptune.jpg';

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 1, 1000);
camera.position.z = 150;
scene.add(camera);

// create background
const textureLoader = new THREE.TextureLoader();

const bgGeometry = new THREE.SphereGeometry(300, 128, 128);
const bgMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(starsTexture),
  side: THREE.BackSide,
});
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bgMesh);

// add sun
const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
const sunMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(sunTexture),
  side: THREE.BackSide,
  roughness: 0.4,
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

// add planets
function createPlanet(size, distance, texture, ring){

  const geometry = new THREE.SphereGeometry(size, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geometry, material);
  const group = new THREE.Object3D();
  group.add(mesh);
  mesh.position.x = distance;

  const orbitGeometry = new THREE.RingGeometry( distance - 0.025, distance + 0.025, 100 );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = -0.5 * Math.PI;
  group.add(orbit);
  
  if(ring){
    const ringGeometry = new THREE.RingGeometry( ring.innerRadius, ring.outerRadius, 32 );
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    group.add(ringMesh);
    ringMesh.position.x = distance;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  scene.add(group);
  return {group, mesh};
}

const mercury = createPlanet(1, 20, mercuryTexture);
const venus = createPlanet(2, 27, venusTexture);
const earth = createPlanet(2.2, 35, earthTexture);
const mars = createPlanet(1.5, 42, marsTexture);
const jupiter = createPlanet(4.5, 57, jupiterTexture);
const saturn = createPlanet(4, 72, saturnTexture, {
  innerRadius:4,
  outerRadius: 7,
  texture: saturnRingTexture,
});
const uranus = createPlanet(3, 100, uranusTexture);
const neptune = createPlanet(3, 142, neptuneTexture);

// Lights
const light = new THREE.PointLight(0xffffff, 3, 1000, 0.1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.1;
scene.add(ambientLight);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Resize
window.addEventListener("resize", () => {
  // update size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update camera
  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
})

function animate() {

  //Self-rotation
  sunMesh.rotateY(0.003);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);

  //Around-sun-rotation
  mercury.group.rotateY(0.04);
  venus.group.rotateY(0.015);
  earth.group.rotateY(0.01);
  mars.group.rotateY(0.008);
  jupiter.group.rotateY(0.002);
  saturn.group.rotateY(0.0009);
  uranus.group.rotateY(0.0004);
  neptune.group.rotateY(0.0001);


  controls.update();
  renderer.render(scene, camera);
  // window.requestAnimationFrame(loop);
}
// loop();

renderer.setAnimationLoop(animate);