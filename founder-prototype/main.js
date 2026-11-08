import { createPlayer } from "./player.js";
import { createBuilding } from "./building.js";

const mount=document.querySelector("#world");
const intro=document.querySelector("#intro");
const startButton=document.querySelector("#start");
const cameraButton=document.querySelector("#cameraToggle");
const resetButton=document.querySelector("#reset");
const notice=document.querySelector("#notice");
const cameraLabel=document.querySelector("#cameraLabel");
const positionLabel=document.querySelector("#positionLabel");
const fpsLabel=document.querySelector("#fpsLabel");
const crosshair=document.querySelector("#crosshair");
const elevatorPanel=document.createElement("section");
elevatorPanel.className="elevator-panel hidden";
elevatorPanel.setAttribute("aria-label","Elevator floor selector");
elevatorPanel.innerHTML='<p class="eyebrow">MOUNADEV HQ · ELEVATOR</p><h2>Select a floor</h2><div class="floor-options"><button data-floor="0">00 <span>Reception</span></button><button data-floor="1">01 <span>Technology</span></button><button data-floor="2">02 <span>Business</span></button><button data-floor="3">03 <span>Executive</span></button><button data-floor="4">R <span>Rooftop</span></button></div><p class="elevator-hint">Press 0–4 or choose a destination. Esc closes.</p>';
document.querySelector("#app").appendChild(elevatorPanel);
const floorNames=["GROUND · RECEPTION","01 · TECHNOLOGY","02 · BUSINESS","03 · EXECUTIVE","ROOFTOP"];
const floorHeights=[0,4.29,8.49,12.69,17.02];
let currentFloor=0;

if(!window.THREE){notice.textContent="Three.js could not load. Check the local lib/three.min.js file.";throw new Error("Three.js unavailable");}
const THREE=window.THREE;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x292f31);
scene.fog=new THREE.Fog(0x292f31,24,58);
const camera=new THREE.PerspectiveCamera(70,1,.1,100);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:"low-power"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.35));
renderer.shadowMap.enabled=false;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xb3aa98,0x202526,.82));
const sun=new THREE.DirectionalLight(0xe2c9a0,.42);sun.position.set(-5,10,6);scene.add(sun);
const warmFill=new THREE.PointLight(0xd7ae73,.20,18);warmFill.position.set(-4,3,-2);scene.add(warmFill);
const coolFill=new THREE.PointLight(0x78918e,.12,16);coolFill.position.set(5,3,2);scene.add(coolFill);

const mat=(color,roughness=.88,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const floorMat=mat(0x383b38),wallMat=mat(0x777873),darkMat=mat(0x202728),woodMat=mat(0x604a38),goldMat=mat(0xa88755,.58,.25);
const glassMat=new THREE.MeshStandardMaterial({color:0x78939a,roughness:.22,metalness:.12,transparent:true,opacity:.42});
const trimMat=mat(0x8c887e),leafMat=mat(0x526653),potMat=mat(0x303735);
function box(w,h,d,material,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);scene.add(m);return m;}
function cylinder(rt,rb,h,material,x,y,z,segments=10){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material);m.position.set(x,y,z);scene.add(m);return m;}
function label(text,x,y,z,w=5,h=1){
 const c=document.createElement("canvas");c.width=1024;c.height=256;const ctx=c.getContext("2d");
 ctx.fillStyle="#17232d";ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle="#c49a4b";ctx.fillRect(0,0,12,c.height);
 ctx.font="700 94px Arial";ctx.fillStyle="#f1eee6";ctx.fillText(text,52,158);
 const tex=new THREE.CanvasTexture(c);tex.anisotropy=1;
 const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}));
 m.position.set(x,y,z);scene.add(m);return m;
}
function plant(x,z,scale=1){
 cylinder(.34*scale,.4*scale,.48*scale,potMat,x,.24*scale,z,9);
 cylinder(.025*scale,.025*scale,1.1*scale,leafMat,x,.92*scale,z,6);
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leaf=new THREE.Mesh(new THREE.ConeGeometry(.13*scale,.8*scale,5),leafMat);leaf.position.set(x+Math.cos(a)*.22*scale,1.02*scale,z+Math.sin(a)*.22*scale);leaf.rotation.z=Math.cos(a)*-.45;leaf.rotation.x=Math.sin(a)*.45;scene.add(leaf);}
}
function seat(x,z,rotation=0){
 const base=box(2.2,.42,.82,woodMat,x,.43,z);base.rotation.y=rotation;
 const back=box(2.2,.85,.18,darkMat,x,.99,z-.32);back.rotation.y=rotation;
 const cushion=box(2.05,.12,.72,mat(0x52616b),x,.7,z);cushion.rotation.y=rotation;
}
const floorMesh=new THREE.Mesh(new THREE.PlaneGeometry(24,24),floorMat);floorMesh.rotation.x=-Math.PI/2;floorMesh.position.y=-.04;scene.add(floorMesh);
// Perimeter walls and warm architectural trim.
box(24,4,.35,wallMat,0,2,-8);box(24,4,.35,wallMat,0,2,8);
box(.35,4,16,wallMat,-12,2,0);box(.35,4,16,wallMat,12,2,0);
box(24,.14,.42,darkMat,0,3.86,-7.78);box(24,.14,.42,darkMat,0,3.86,7.78);
box(.42,.14,16,darkMat,-11.78,3.86,0);box(.42,.14,16,darkMat,11.78,3.86,0);
box(23.5,.08,.12,goldMat,0,.04,-7.72);box(23.5,.08,.12,goldMat,0,.04,7.72);
box(.12,.08,15.5,goldMat,-11.72,.04,0);box(.12,.08,15.5,goldMat,11.72,.04,0);
// Reception counter and feature wall.
box(5.2,1.2,1.25,woodMat,-5,.6,-4.7);
box(5.35,.12,1.32,goldMat,-5,1.25,-4.7);
box(5.2,.12,1.25,darkMat,-5,.08,-4.7);
label("MOUNADEV  HQ",-5,2.65,-7.78,6.8,1.35);
box(7,.06,.12,goldMat,-5,1.92,-7.72);
box(.12,2.2,.12,darkMat,-8.3,2.2,-7.72);box(.12,2.2,.12,darkMat,-1.7,2.2,-7.72);
// Lounge seating, side table and a calm feature panel.
seat(5.2,-4.9,0);seat(8.4,-4.9,0);
box(1.25,.45,1.1,woodMat,6.8,.34,-2.6);cylinder(.12,.12,.04,goldMat,6.8,.58,-2.6,12);
box(4.8,1.9,.12,glassMat,9.5,1.75,-7.78);
box(2.2,.08,.12,goldMat,9.5,2.85,-7.7);
// Meeting table in the center-right zone.
box(3.2,.16,1.55,woodMat,2.1,.95,2.0);
for(const x of [.9,3.3])for(const z of [1.5,2.5])box(.12,.9,.12,darkMat,x,.45,z);
for(const x of [.65,3.55])for(const z of [1.15,2.85]){box(.72,.85,.72,darkMat,x,.43,z);box(.72,.12,.72,mat(0x4d5852),x,.9,z);}
box(2.6,.08,.12,goldMat,2.1,1.08,2);
// Glass divider and decorative planters.
box(.12,2.5,5.4,glassMat,-.2,1.25,-.3);box(.16,.1,5.5,goldMat,-.2,2.5,-.3);
plant(-9,-6,.95);plant(-9,5,1.05);plant(9,5,1.05);plant(-.9,-6,.8);
plant(10,-1,.8);
// Lighting fixtures: emissive strips, deliberately no expensive real-time shadows.
const glow=new THREE.MeshStandardMaterial({color:0x9b8059,emissive:0x59462b,emissiveIntensity:.16});
for(const x of [-7,-2,3,8]){box(2.1,.045,.22,glow,x,3.72,0);box(.045,.045,1.5,goldMat,x,3.7,0);}
// Small floor inlays help orient the player.
for(const z of [-6,0,6])box(7,.012,.035,goldMat,0,.015,z);
const buildingLayout=createBuilding(THREE,scene);
const player=createPlayer(THREE,scene,camera);
function selectFloor(index){
 if(!Number.isInteger(index)||index<0||index>4)return;
 currentFloor=index;player.setFloor(floorHeights[index],9.8,0);
 elevatorPanel.classList.add("hidden");
 notice.textContent="Arrived · "+floorNames[index];
}
function toggleElevator(){
 if(!active)return;
 const p=player.position;
 const distance=Math.hypot(p.x-9.8,p.z);
 if(distance>2.6){notice.textContent="Find the elevator near the east side of the building";return;}
 elevatorPanel.classList.toggle("hidden");
 if(!elevatorPanel.classList.contains("hidden")){
  if(document.pointerLockElement)document.exitPointerLock();
  notice.textContent="Elevator ready · choose a floor";
 }
}
elevatorPanel.querySelectorAll("[data-floor]").forEach(button=>button.addEventListener("click",()=>selectFloor(Number(button.dataset.floor))));
let active=false,last=performance.now(),frameCount=0,fpsStart=last;
function setCameraMode(mode){player.setCameraMode(mode);cameraLabel.textContent=mode==="first"?"FIRST PERSON":"THIRD PERSON";cameraButton.textContent=mode==="first"?"1P":"3P";crosshair.classList.toggle("visible",mode==="first"&&active);}
function resize(){const w=mount.clientWidth||innerWidth,h=mount.clientHeight||innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
window.addEventListener("resize",resize);resize();
startButton.addEventListener("click",()=>{active=true;intro.classList.add("hidden");notice.textContent="Arrow keys move · Mouse look · E elevator · V change view";renderer.domElement.focus();if(renderer.domElement.requestPointerLock&&matchMedia("(pointer:fine)").matches)renderer.domElement.requestPointerLock();});
cameraButton.addEventListener("click",()=>setCameraMode(player.cameraMode==="first"?"third":"first"));
resetButton.addEventListener("click",()=>{player.reset();currentFloor=0;elevatorPanel.classList.add("hidden");notice.textContent="Position reset · Ground floor";});
document.addEventListener("pointerlockchange",()=>{if(active&&document.pointerLockElement!==renderer.domElement)notice.textContent="Mouse released · click and drag to look";});
document.addEventListener("keydown",e=>{
 if(e.code==="KeyV"&&!e.repeat)setCameraMode(player.cameraMode==="first"?"third":"first");
 if(e.code==="KeyE"&&!e.repeat)toggleElevator();
 if(elevatorPanel.classList.contains("hidden")===false&&["Digit0","Digit1","Digit2","Digit3","Digit4"].includes(e.code)){
  selectFloor(Number(e.code.slice(-1)));
 }
 if(e.code==="Escape"&&active){
  if(!elevatorPanel.classList.contains("hidden"))elevatorPanel.classList.add("hidden");
  notice.textContent="Mouse released · click and drag to look";
 }
});
renderer.domElement.addEventListener("click",()=>{if(active&&document.pointerLockElement!==renderer.domElement&&renderer.domElement.requestPointerLock&&matchMedia("(pointer:fine)").matches)renderer.domElement.requestPointerLock();});
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.04);last=now;if(active&&elevatorPanel.classList.contains("hidden"))player.update(dt);renderer.render(scene,camera);frameCount++;if(now-fpsStart>1000){fpsLabel.textContent=Math.round(frameCount*1000/(now-fpsStart))+" FPS";frameCount=0;fpsStart=now;}const p=player.position;positionLabel.textContent=floorNames[currentFloor]+" · X "+p.x.toFixed(1)+" · Z "+p.z.toFixed(1);}
requestAnimationFrame(animate);setCameraMode("third");
