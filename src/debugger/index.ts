import {
  BoxBufferGeometry,
  Clock,
  CylinderBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TorusKnotBufferGeometry,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OutlineMaterial } from '../OutlineMaterial'
import { OutlineMesh } from '../OutlineMesh'
import * as dat from 'dat.gui'

const gui = new dat.GUI()

document.body.style.margin = '0'

const clock = new Clock()
const scene = new Scene()
const camera = new PerspectiveCamera(60, 1, 1, 1000)
const renderer = new WebGLRenderer({ antialias: true })
const resolution = new Vector2()
document.body.appendChild(renderer.domElement)
renderer.setClearColor(0xffffff)

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

const bg = new BoxBufferGeometry(1, 1, 1)
const cg = new CylinderBufferGeometry(1, 2, 2, 32, 1, false)
const tg = new TorusKnotBufferGeometry(1, 0.1, 128, 32, 2, 3)

const m = new MeshBasicMaterial({
  transparent: true,
  opacity: 0.5,
  polygonOffset: true,
  polygonOffsetUnits: 2,
  polygonOffsetFactor: 1,
})

gui.add(m, 'opacity', 0, 1)

const pm = new Mesh(bg, m)
const cm = new Mesh(cg, m)
const tm = new Mesh(tg, m)

const mat = new OutlineMaterial(60, true, '#000')
gui.add(mat, 'angleThreshold', 0, 180)

const po = new OutlineMesh(pm, mat)
const co = new OutlineMesh(cm, mat)
const to = new OutlineMesh(tm, mat)
po.add(pm)
co.add(cm)
to.add(tm)

po.position.x = 4
co.position.x = -4
scene.add(po)
scene.add(co)
scene.add(to)

function animate() {
  const dt = clock.getDelta()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  to.rotation.x += dt
  to.rotation.z += dt
}
animate()
