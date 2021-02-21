import { CylinderBufferGeometry, Mesh, Plane, PlaneBufferGeometry } from 'three'
import { OutlineMesh } from './OutlineMesh'

describe('OutlineMesh', () => {
  describe('Instantiation', () => {
    it('Should instantiate without errors', () => {
      const plane = new Mesh(new PlaneBufferGeometry())
      const outlineMesh = new OutlineMesh(plane)
      expect(outlineMesh).toBeInstanceOf(OutlineMesh)
    })
    describe('Data', () => {
      it('Should create 5 edges out of the plane', () => {
        const plane = new Mesh(new PlaneBufferGeometry())
        const outlineMesh = new OutlineMesh(plane)
        const { geometry } = outlineMesh
        const { position, aN0, aN1 } = geometry.attributes
        const segCount = 5
        const vertCount = segCount * 2
        expect(position.count).toBe(vertCount)
        expect(aN0.count).toBe(vertCount)
        expect(aN1.count).toBe(vertCount)
      })
      it('Should create 13 edges out of an open cylinder', () => {
        const cg = new CylinderBufferGeometry(1, 1, 1, 3, 1, true, 0, 3)
        const cylinder = new Mesh(cg)
        const outlineMesh = new OutlineMesh(cylinder)
        const { position } = outlineMesh.geometry.attributes
        const segCount = 13
        const vertCount = segCount * 2
        expect(position.count).toBe(vertCount)
      })
    })
  })
})
