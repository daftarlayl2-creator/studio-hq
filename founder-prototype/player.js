const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function createPlayer(THREE, scene, camera) {
  const group = new THREE.Group();
  group.position.set(-3,0,2.5);
  scene.add(group);

  const skin = new THREE.MeshStandardMaterial({color:0xb98262,roughness:.95});
  const shirt = new THREE.MeshStandardMaterial({color:0x253b50,roughness:.95});
  const trousers = new THREE.MeshStandardMaterial({color:0x20252c,roughness:1});
  const shoes = new THREE.MeshStandardMaterial({color:0x15191d,roughness:1});
  const makePart=(geometry,material,x,y,z)=>{
    const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);group.add(m);return m;
  };
  // Lightweight procedural stand-in. A licensed human GLB can replace this model in a later asset pass.
  makePart(new THREE.CylinderGeometry(.25,.31,.72,8),shirt,0,1.12,0);
  makePart(new THREE.SphereGeometry(.19,10,8),skin,0,1.68,0);
  const leftLeg=makePart(new THREE.CylinderGeometry(.085,.095,.62,7),trousers,-.12,.43,0);
  const rightLeg=makePart(new THREE.CylinderGeometry(.085,.095,.62,7),trousers,.12,.43,0);
  makePart(new THREE.BoxGeometry(.17,.12,.32),shoes,-.12,.12,.08);
  makePart(new THREE.BoxGeometry(.17,.12,.32),shoes,.12,.12,.08);
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
    {minX:-0.32,maxX:-0.08,minZ:-3.0,maxZ:2.4}
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
    // Two switchback ramp surfaces follow the visible stair flights.
    if(x>=-9.58&&x<=-8.42&&z>=-3.1&&z<=.55)
      return floorHeight+.24+((z+3.1)/3.65)*2.0;
    if(x>=-8.52&&x<=-7.98&&z>=.2&&z<=.9)
      return floorHeight+2.24;
    if(x>=-8.12&&x<=-6.98&&z>=-3.1&&z<=.55)
      return floorHeight+2.34+((.55-z)/3.65)*1.93;
    return floorHeight;
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
