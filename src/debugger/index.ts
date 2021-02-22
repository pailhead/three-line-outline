import {
  BufferAttribute,
  BufferGeometry,
  CylinderBufferGeometry,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  SphereBufferGeometry,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OutlineMesh } from '../OutlineMesh'

document.body.style.margin = '0'

const scene = new Scene()
const camera = new PerspectiveCamera(60, 1, 1, 1000)
const renderer = new WebGLRenderer()
const resolution = new Vector2()
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

camera.position.z = 20

const onResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  resolution.set(window.innerWidth, window.innerHeight)
  camera.updateProjectionMatrix()
}

onResize()
window.addEventListener('resize', onResize)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

// const pg = new PlaneBufferGeometry(2, 2, 1, 1)
const pg = new SphereBufferGeometry(1, 32, 16)
const cg = new CylinderBufferGeometry(1, 5, 10, 3, 1, false)

const pm = new Mesh(
  pg,
  new MeshBasicMaterial({
    color: 'red',
    polygonOffset: true,
    polygonOffsetUnits: 2,
    polygonOffsetFactor: 1,
  }),
)
const cm = new Mesh(
  cg,
  new MeshBasicMaterial({
    color: 'red',
    polygonOffset: true,
    polygonOffsetUnits: 2,
    polygonOffsetFactor: 1,
  }),
)

// const po = new OutlineMesh(pm)
const co = new OutlineMesh(cm)
// po.add(pm)
// co.add(cm)

console.log(co)

// po.position.x = 2
co.position.x = -2
// scene.add(po)
scene.add(co)

// const g = new BufferGeometry()
// g.setAttribute(
//   'position',
//   new BufferAttribute(
//     new Float32Array([0, -1, 0, 0, 0, -1, 0, 0, 1, 1, 0, 0]),
//     3,
//   ),
// )
// g.setIndex(new BufferAttribute(new Uint16Array([0, 2, 1, 1, 2, 3]), 1))
// // scene.add(new Mesh(g))
// const om = new OutlineMesh(new Mesh(g))
// om.position.y = 1
// scene.add(om)
// console.log(om)

// scene.add(new GridHelper(100, 100))
