import * as THREE from 'three';
import './style.css';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b8d8);
scene.fog = new THREE.Fog(0x87b8d8, 45, 180);

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 500);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
document.querySelector<HTMLDivElement>('#app')!.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffe9c7, 0x34515e, 2));
const sun = new THREE.DirectionalLight(0xfff0d0, 3);
sun.position.set(-20, 35, 15); sun.castShadow = true; scene.add(sun);

// Protótipo: praia de Troia. Modelos provisórios serão substituídos por GLB depois.
const sand = new THREE.Mesh(new THREE.PlaneGeometry(120, 100), new THREE.MeshStandardMaterial({ color: 0xc9a66b, roughness: 1 }));
sand.rotation.x = -Math.PI / 2; sand.position.z = 20; sand.receiveShadow = true; scene.add(sand);
const sea = new THREE.Mesh(new THREE.PlaneGeometry(200, 130), new THREE.MeshStandardMaterial({ color: 0x1f6f8b, roughness: .35, metalness: .05 }));
sea.rotation.x = -Math.PI / 2; sea.position.set(0, -.15, -80); scene.add(sea);

const achilles = new THREE.Mesh(new THREE.CapsuleGeometry(.55, 1.35, 6, 12), new THREE.MeshStandardMaterial({ color: 0x7b3426 }));
achilles.position.y = 1.25; achilles.castShadow = true; scene.add(achilles);

const keys = new Set<string>();
addEventListener('keydown', e => keys.add(e.code)); addEventListener('keyup', e => keys.delete(e.code));
let firstPerson = false;
addEventListener('keydown', e => { if (e.code === 'KeyV' && !e.repeat) firstPerson = !firstPerson; });

const clock = new THREE.Clock();
function loop(){ requestAnimationFrame(loop); const dt=Math.min(clock.getDelta(),.05); const speed=6*dt;
 if(keys.has('KeyW')) achilles.position.z-=speed; if(keys.has('KeyS')) achilles.position.z+=speed; if(keys.has('KeyA')) achilles.position.x-=speed; if(keys.has('KeyD')) achilles.position.x+=speed;
 const target=firstPerson?new THREE.Vector3(achilles.position.x,2.1,achilles.position.z-.15):new THREE.Vector3(achilles.position.x,4.5,achilles.position.z+8);
 camera.position.lerp(target,.12); camera.lookAt(achilles.position.x,1.4,achilles.position.z-4); renderer.render(scene,camera); }
loop();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
