import { createPlayer } from "./player.js";

const mount = document.querySelector("#world");
const intro = document.querySelector("#intro");
const startButton = document.querySelector("#start");
const cameraButton = document.querySelector("#cameraToggle");
const resetButton = document.querySelector("#reset");
const notice = document.querySelector("#notice");
const cameraLabel = document.querySelector("#cameraLabel");
const positionLabel = document.querySelector("#positionLabel");
const fpsLabel = document.querySelector("#fpsLabel");
const crosshair = document.querySelector("#crosshair");

if (!window.THREE) {
  notice.textContent = "Three.js could not load. Check the local lib/three.min.js file.";
  throw new Error("Three.js unavailable");
}

const THREE = window.THREE;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9aa9b4);
scene.fog = new THREE.Fog(0x9aa9b4, 18, 48);
const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.shadowMap.enabled = false;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdce9f2, 0x59616a, 1.7));
const sun = new THREE.DirectionalLight(0xffedcf, 1.15);
sun.position.set(-5, 10, 6);
scene.add(sun);

const mat = (color, roughness=0.9) => new THREE.MeshStandardMaterial({ color, roughness });
const floorMat = mat(0x777d80);
const wallMat = mat(0xe2e0d8);
const darkMat = mat(0x26313a);
const woodMat = mat(0x795b42);
const glassMat = new THREE.MeshStandardMaterial({color:0x9ac4d2,roughness:.25,metalness:.1});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(24,24), floorMat);
floor.rotation.x = -Math.PI/2;
floor.position.y = -0.04;
scene.add(floor);

function box(w,h,d,material,x,y,z){
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y,z); scene.add(mesh); return mesh;
}
// Small, bounded test lobby. The collision system uses the same wall/furniture footprint.
box(24,4,.35,wallMat,0,2,-8);
box(24,4,.35,wallMat,0,2,8);
box(.35,4,16,wallMat,-12,2,0);
box(.35,4,16,wallMat,12,2,0);
box(5,1.2,1.1,woodMat,-5,.6,-4.5);
box(.16,1.3,.16,darkMat,-7.2,1.3,-4.5);
box(.16,1.3,.16,darkMat,-2.8,1.3,-4.5);
box(2.6,.12,1.1,darkMat,5,.9,-5);
box(2.4,1.8,.12,glassMat,5,1.9,-7.78);
box(1.2,1.2,1.2,darkMat,8,.6,4);
box(1.2,1.2,1.2,darkMat,-8,.6,4);
box(2.5,.12,1.2,woodMat,0,1.1,4.7);
box(.12,1.1,.12,darkMat,-1,0.55,4.7);
box(.12,1.1,.12,darkMat,1,0.55,4.7);

const player = createPlayer(THREE, scene, camera);
let active = false;
let last = performance.now();
let frameCount = 0;
let fpsStart = last;

function setCameraMode(mode) {
  player.setCameraMode(mode);
  cameraLabel.textContent = mode === "first" ? "FIRST PERSON" : "THIRD PERSON";
  cameraButton.textContent = mode === "first" ? "1P" : "3P";
  crosshair.classList.toggle("visible", mode === "first" && active);
}
function setNotice(message){ notice.textContent = message; }
function resize(){
  const w = mount.clientWidth || innerWidth, h = mount.clientHeight || innerHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h,false);
}
window.addEventListener("resize", resize); resize();

startButton.addEventListener("click",()=>{
  active = true; intro.classList.add("hidden"); setNotice("WASD move · Mouse drag to look · V change view");
  renderer.domElement.focus();
  if (renderer.domElement.requestPointerLock && matchMedia("(pointer:fine)").matches) renderer.domElement.requestPointerLock();
});
cameraButton.addEventListener("click",()=>setCameraMode(player.cameraMode === "first" ? "third" : "first"));
resetButton.addEventListener("click",()=>{player.reset();setNotice("Position reset");});
document.addEventListener("pointerlockchange",()=>{
  if(active && document.pointerLockElement !== renderer.domElement) setNotice("Mouse released · click and drag to look");
});
document.addEventListener("keydown",e=>{
  if(e.code==="KeyV") setCameraMode(player.cameraMode==="first"?"third":"first");
  if(e.code==="Escape" && active) setNotice("Mouse released · click and drag to look");
});
renderer.domElement.addEventListener("click",()=>{
  if(active && document.pointerLockElement !== renderer.domElement && renderer.domElement.requestPointerLock && matchMedia("(pointer:fine)").matches) renderer.domElement.requestPointerLock();
});

function animate(now){
  requestAnimationFrame(animate);
  const dt = Math.min((now-last)/1000,.04); last=now;
  if(active) player.update(dt, now);
  renderer.render(scene,camera);
  frameCount++;
  if(now-fpsStart>1000){fpsLabel.textContent=Math.round(frameCount*1000/(now-fpsStart))+" FPS";frameCount=0;fpsStart=now;}
  const p=player.position;
  positionLabel.textContent="X "+p.x.toFixed(1)+" · Z "+p.z.toFixed(1);
}
requestAnimationFrame(animate);
setCameraMode("third");
