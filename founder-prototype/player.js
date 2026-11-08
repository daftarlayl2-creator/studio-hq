const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function createPlayer(THREE, scene, camera) {
  const group = new THREE.Group();
  group.position.set(-3,0,2.5);
  scene.add(group);

  const skin = new THREE.MeshStandardMaterial({color:0xb98262,roughness:.95});
  const shirt = new THREE.MeshStandardMaterial({color:0x253b50,roughness:.95});
  const trousers = new THREE.MeshStandardMaterial({color:0x20252c,roughness:1});
  const shoes = new THREE.MeshStandardMaterial({color:0x15191d,roughness:1});
  const hair = new THREE.MeshStandardMaterial({color:0x252321,roughness:1});
  const detail = new THREE.MeshStandardMaterial({color:0xd7c6a5,roughness:.8});
  const makePart=(geometry,material,x,y,z)=>{
    const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);group.add(m);return m;
  };
  // Lightweight procedural stand-in. A licensed human GLB can replace this model in a later asset pass.
  makePart(new THREE.CylinderGeometry(.25,.31,.72,10),shirt,0,1.12,0);
  makePart(new THREE.CylinderGeometry(.105,.12,.16,8),skin,0,1.57,0);
  const head=makePart(new THREE.SphereGeometry(.19,12,10),skin,0,1.76,0);
  const hairCap=makePart(new THREE.SphereGeometry(.198,12,7,0,Math.PI*2,0,Math.PI*.52),hair,0,1.81,-.005);
  hairCap.scale.set(1.02,.88,1.02);
  // Minimal face details make the placeholder read as a person from close range.
  for(const x of [-.072,.072])makePart(new THREE.SphereGeometry(.018,6,6),detail,x,1.78,.174);
  makePart(new THREE.SphereGeometry(.025,7,6),skin,0,1.72,.19);
  makePart(new THREE.SphereGeometry(.035,7,6),hair,-.19,1.76,0);
  makePart(new THREE.SphereGeometry(.035,7,6),hair,.19,1.76,0);
  // Shirt collar and a restrained front placket.
  makePart(new THREE.BoxGeometry(.16,.07,.22),detail,0,1.43,.17);
  makePart(new THREE.BoxGeometry(.035,.38,.018),detail,0,1.14,.315);
  const leftLeg=makePart(new THREE.CylinderGeometry(.085,.095,.62,7),trousers,-.12,.43,0);
  const rightLeg=makePart(new THREE.CylinderGeometry(.085,.095,.62,7),trousers,.12,.43,0);
  makePart(new THREE.BoxGeometry(.19,.13,.34),shoes,-.12,.12,.08);
  makePart(new THREE.BoxGeometry(.19,.13,.34),shoes,.12,.12,.08);
  makePart(new THREE.SphereGeometry(.09,7,6),skin,-.32,.78,0);
  makePart(new THREE.SphereGeometry(.09,7,6),skin,.32,.78,0);
  const leftArm=makePart(new THREE.CylinderGeometry(.075,.09,.62,7),shirt,-.32,1.12,0);
  const rightArm=makePart(new THREE.CylinderGeometry(.075,.09,.62,7),shirt,.32,1.12,0);
  leftArm.rotation.z=-.12;rightArm.rotation.z=.12;
  makePart(new THREE.SphereGeometry(.045,7,6),skin,0,1.67,.18);

  const obstacles=[
    {minX:-7.8,maxX:-2.2,minZ:-5.55,maxZ:-3.85},
    {minX:4.0,maxX:6.4,minZ:-5.5,maxZ:-4.25},
    {minX:7.25,maxX:9.55,minZ:-5.35,maxZ:-4.35},
    {minX:6.1,maxX:7.5,minZ:-3.25,maxZ:-1.95},
    {minX:7.35,maxX:8.65,minZ:3.35,maxZ:4.65},
    {minX:-8.65,maxX:-7.35,minZ:3.35,maxZ:4.65},
    {minX:-1.35,maxX:1.35,minZ:4.0,maxZ:5.4},
    {minX:0.35,maxX:3.85,minZ:1.1,maxZ:2.9},
    // Glass divider sections leave a clear central passage between z=-1.05 and z=0.45.
    {minX:-0.32,maxX:-0.08,minZ:-3.0,maxZ:-1.05},
    {minX:-0.32,maxX:-0.08,minZ:0.45,maxZ:2.4}
  ];
  const radius=.34;
  let activeObstacles=obstacles;
  const keys=new Set();
  let yaw=0, pitch=0, verticalVelocity=0, grounded=true, walkPhase=0;
  let floorHeight=0;
  let cameraMode="third";
  let dragging=false,lastX=0,lastY=0;
  const canvas=document.querySelector("#world canvas");

  function collides(x,z){
    if(x < -11.25+radius || x > 11.25-radius || z < -7.25+radius || z > 7.25-radius) return true;
    return activeObstacles.some(o=>x+radius>o.minX&&x-radius<o.maxX&&z+radius>o.minZ&&z-radius<o.maxZ);
  }
  function walkableHeight(x,z){
    // Only expose the next deck when the avatar is physically at its stair landing.
    const candidates=[floorHeight];
    const onFirstFlight=x>=-9.58&&x<=-8.42&&z>=-2.99&&z<=.49;
    const onLanding=x>=-9.52&&x<=-6.98&&z>=.36&&z<=1.18;
    const onSecondFlight=x>=-8.12&&x<=-6.98&&z>=-2.99&&z<=.49;
    for(let level=0;level<4;level++){
      const base=floorHeight+level*4.2;
      // Match the top surfaces of the 12 physical treads (0.29m spacing, 0.175m rise).
      if(onFirstFlight)candidates.push(base+.24+clamp((z+2.85)/.29,0,11)*.175);
      if(onLanding)candidates.push(base+2.2);
      if(onSecondFlight)candidates.push(base+2.2+clamp((.34-z)/.29,0,11)*(1.92/11));
      const nextDeck=base+4.2;
      if(group.position.y>=nextDeck-.58&&group.position.y<=nextDeck+.58)
        candidates.push(nextDeck);
    }
    let nearest=candidates[0],distance=Math.abs(group.position.y-nearest);
    for(let i=1;i<candidates.length;i++){
      const next=Math.abs(group.position.y-candidates[i]);
      if(next<distance){nearest=candidates[i];distance=next;}
    }
    return nearest;
  }
  function pointerMove(e){
    if(document.pointerLockElement===canvas){yaw-=e.movementX*.0022;pitch=clamp(pitch+e.movementY*.0022,-1.15,1.15);}
    else if(dragging){yaw-=(e.clientX-lastX)*.006;pitch=clamp(pitch+(e.clientY-lastY)*.006,-1.15,1.15);lastX=e.clientX;lastY=e.clientY;}
  }
  canvas.addEventListener("pointerdown",e=>{if(document.pointerLockElement!==canvas){dragging=true;lastX=e.clientX;lastY=e.clientY;}});
  window.addEventListener("pointerup",()=>dragging=false);
  window.addEventListener("pointermove",pointerMove);
  window.addEventListener("keydown",e=>{keys.add(e.code);if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault();});
  window.addEventListener("keyup",e=>keys.delete(e.code));
  window.addEventListener("blur",()=>{keys.clear();dragging=false;});

  function setCameraMode(mode){cameraMode=mode;}
  function update(dt){
    const forward=(keys.has("KeyW")||keys.has("ArrowUp")?1:0)-(keys.has("KeyS")||keys.has("ArrowDown")?1:0);
    const side=(keys.has("KeyD")||keys.has("ArrowRight")?1:0)-(keys.has("KeyA")||keys.has("ArrowLeft")?1:0);
    const moving=forward!==0||side!==0;
    const speed=keys.has("ShiftLeft")||keys.has("ShiftRight")?5.2:2.8;
    if(moving){
      const length=Math.hypot(forward,side)||1;
      const fx=(Math.sin(yaw)*forward+Math.cos(yaw)*side)/length;
      const fz=(-Math.cos(yaw)*forward+Math.sin(yaw)*side)/length;
      // Substep movement to prevent tunnelling through thin collision surfaces.
      const dx=fx*speed*dt, dz=fz*speed*dt;
      const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dz))/.08));
      for(let i=0;i<steps;i++){
        const sx=dx/steps, sz=dz/steps;
        const nx=group.position.x+sx;
        if(!collides(nx,group.position.z))group.position.x=nx;
        const nz=group.position.z+sz;
        if(!collides(group.position.x,nz))group.position.z=nz;
      }
      // Turn the avatar toward the actual travel vector (including strafing).
      group.rotation.y=Math.atan2(fx,fz);
      walkPhase+=dt*(speed>3?12:8);
    }
    if(keys.has("Space")&&grounded){verticalVelocity=5.0;grounded=false;}
    const supportY=walkableHeight(group.position.x,group.position.z);
    if(group.position.y<=supportY+.16&&verticalVelocity<=0){
      group.position.y=supportY;verticalVelocity=0;grounded=true;
    }else{
      verticalVelocity-=13.5*dt;
      group.position.y+=verticalVelocity*dt;
      if(group.position.y<supportY){group.position.y=supportY;verticalVelocity=0;grounded=true;}
    }
    const swing=moving?Math.sin(walkPhase)*.16:0;
    leftArm.rotation.x=swing;
    rightArm.rotation.x=-swing;
    leftLeg.rotation.x=-swing;
    rightLeg.rotation.x=swing;

    const eyeY=group.position.y+(cameraMode==="first"?1.58:1.48);
    const target=new THREE.Vector3(group.position.x,eyeY,group.position.z);
    if(cameraMode==="first"){
      group.visible=false;
      camera.position.copy(target);
      camera.up.set(0,1,0);camera.rotation.order="YXZ";camera.rotation.z=0;camera.rotation.y=yaw;camera.rotation.x=-pitch;
    }else{
      group.visible=true;
      const distance=4.3;
      const horizontal=Math.cos(pitch)*distance;
      camera.position.set(
        target.x+Math.sin(yaw)*horizontal,
        target.y+1.0+Math.sin(pitch)*distance,
        target.z+Math.cos(yaw)*horizontal
      );
      camera.lookAt(target.x,target.y+.15,target.z);
    }
  }
  function reset(){
    // Clear central-west aisle, away from glass and furniture.
    group.position.set(-3.2,0,2.7);
    floorHeight=0;activeObstacles=obstacles;yaw=0;pitch=0;verticalVelocity=0;grounded=true;
    group.rotation.y=Math.PI;
  }
  function setFloor(height,x=9.8,z=0,nextObstacles=obstacles){
    floorHeight=height;activeObstacles=nextObstacles;group.position.set(x,height,z);verticalVelocity=0;grounded=true;
    keys.clear();
  }
  return {update,reset,setCameraMode,setFloor,get floorHeight(){return floorHeight;},get cameraMode(){return cameraMode;},get position(){return group.position;}};
}
