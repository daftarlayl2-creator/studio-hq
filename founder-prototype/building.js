// Multi-storey architectural greybox. Elevator floor selection is wired in the prototype;
// stair traversal and upper-floor collision remain deferred until dedicated QA.
export function createBuilding(THREE, scene) {
  const mat=(color,roughness=.9,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
  const stone=mat(0x777873),graphite=mat(0x303735),floor=mat(0x383b38),wood=mat(0x604a38),bronze=mat(0xa88755,.58,.25),glass=new THREE.MeshStandardMaterial({color:0x78939a,roughness:.3,transparent:true,opacity:.34});
  const addBox=(w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);scene.add(o);return o;};
  const sign=(title,x,y,z)=>{
    const c=document.createElement("canvas");c.width=512;c.height=128;const g=c.getContext("2d");
    g.fillStyle="#202625";g.fillRect(0,0,512,128);g.fillStyle="#a88755";g.fillRect(0,0,8,128);
    g.font="700 38px Arial";g.fillStyle="#dedbd2";g.fillText(title,28,80);
    const t=new THREE.CanvasTexture(c);t.anisotropy=1;
    const o=new THREE.Mesh(new THREE.PlaneGeometry(4.6,1.15),new THREE.MeshBasicMaterial({map:t}));o.position.set(x,y,z);scene.add(o);
  };
  const levels=[
    {y:4.2,name:"01  TECHNOLOGY",rooms:["DEVELOPMENT","AI & AUTOMATION","TECH SUPPORT","DESIGN STUDIO"]},
    {y:8.4,name:"02  BUSINESS",rooms:["SALES & LEADS","CUSTOMER SUPPORT","OPERATIONS","FINANCE"]},
    {y:12.6,name:"03  EXECUTIVE",rooms:["FOUNDER OFFICE","CEO OFFICE","MANAGER","BOARDROOM"]}
  ];
  for(let i=0;i<levels.length;i++){
    const {y,name,rooms}=levels[i];
    // Slab and restrained bronze edge reveal.
    addBox(23.7,.18,15.7,floor,0,y,0);
    addBox(23.7,.045,.08,bronze,0,y+.11,-7.82);
    // Rear and side walls; south face remains open in this cutaway preview.
    addBox(23.7,3.45,.22,stone,0,y+1.82,-7.82);
    addBox(.22,3.45,15.7,stone,-11.82,y+1.82,0);
    addBox(.22,3.45,15.7,stone,11.82,y+1.82,0);
    // Low room dividers establish four readable team zones.
    addBox(.16,2.35,6.1,graphite,-3.9,y+1.25,-3.9);
    addBox(.16,2.35,6.1,graphite,3.9,y+1.25,-3.9);
    addBox(3.0,2.35,.16,graphite,-2.4,y+1.25,-.65);
    addBox(3.0,2.35,.16,graphite,2.4,y+1.25,-.65);
    // Door gaps are left around the central passage.
    addBox(6.8,.16,.16,bronze,0,y+2.48,-.65);
    // Simple desks / meeting tables, intentionally low polygon.
    for(const x of [-8.2,-5.9,5.9,8.2]){
      addBox(1.45,.12,.82,wood,x,y+.82,3.1);
      addBox(.1,.78,.1,graphite,x-.55,y+.39,3.1);
      addBox(.1,.78,.1,graphite,x+.55,y+.39,3.1);
    }
    sign(name,0,y+3.05,-7.68,4.6,1.15);
    for(let j=0;j<rooms.length;j++){
      const x=[-7.4,-2.4,2.4,7.4][j];
      sign(rooms[j],x,y+2.05,-.78);
    }
    // Glass meeting-room frontage with visible bronze top frame.
    addBox(4.2,2.25,.09,glass,7.4,y+1.2,-5.1);
    addBox(4.3,.08,.16,bronze,7.4,y+2.38,-5.1);
  }
  // Elevator core is represented as a clear vertical architectural landmark.
  for(const x of [8.8,10.8])for(const z of [-1.25,1.25])addBox(.18,20.2,.18,bronze,x,10.0,z);
  addBox(2.2,20.0,.12,glass,9.8,10.0,-1.25);
  addBox(2.2,20.0,.12,glass,9.8,10.0,1.25);
  // West-side elevator landing doors: leave a clear opening at every floor.
  for(let level=0;level<5;level++){
    const baseY=level*4.2;
    for(const z of [-.92,.92])addBox(.12,3.45,.66,glass,8.8,baseY+1.82,z);
    addBox(.12,.18,1.18,bronze,8.8,baseY+3.52,0);
  }
  // East shaft wall remains closed for a safe, readable cutaway.
  addBox(.12,16.4,2.5,glass,10.8,8.25,0);
  // Switchback stair flights beside the lift core. These are visual greybox steps;
  // walking / floor transitions are deliberately not enabled in this pass.
  for(let level=0;level<4;level++){
    const baseY=level*4.2;
    for(let i=0;i<12;i++){
      addBox(1.05,.16,.34,graphite,-9.0,baseY+.16+i*.175,-2.85+i*.29);
      addBox(1.05,.16,.34,graphite,-7.55,baseY+2.26+i*.175,.34-i*.29);
    }
    addBox(2.5,.16,1.25,wood,-8.25,baseY+2.12,.55);
  }
  // Rooftop terrace and parapet, with a shaded pergola.
  const roofY=16.9;
  addBox(23.7,.2,15.7,floor,0,roofY,0);
  addBox(23.7,1.05,.22,stone,0,roofY+.58,-7.82);
  addBox(23.7,1.05,.22,stone,0,roofY+.58,7.82);
  addBox(.22,1.05,15.7,stone,-11.82,roofY+.58,0);
  addBox(.22,1.05,15.7,stone,11.82,roofY+.58,0);
  for(const x of [-5,5])addBox(.18,2.7,.18,wood,x,roofY+1.35,0);
  for(const z of [-3.2,3.2])addBox(10,.18,.18,wood,0,roofY+2.7,z);
  for(const x of [-8,-4,4,8]){
    addBox(1.1,.55,1.1,graphite,x,roofY+.38,5.1);
    addBox(.72,.08,.72,mat(0x526653),x,roofY+.7,5.1);
  }
  sign("ROOFTOP TERRACE",0,roofY+2.0,-7.68);
  return {levels:levels.map((l,i)=>({index:i+1,name:l.name,elevation:l.y})),roofElevation:roofY};
}
