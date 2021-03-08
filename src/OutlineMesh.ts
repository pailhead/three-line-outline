/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ArrowHelper,
  BoxBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three'
import { OutlineMaterial } from './OutlineMaterial'

interface IEdge {
  a: number
  b: number
  n0: Vector3
  n1: Vector3
}
interface IEdgeArrays {
  vArray: number[]
  n0Array: number[]
  n1Array: number[]
  otherVertArray: number[]
}
const NULL_VECTOR = new Vector3()
const WELD_FACTOR = 1000

export class OutlineMesh extends LineSegments {
  constructor(mesh: Mesh, outlineMaterial = new OutlineMaterial()) {
    super(new BufferGeometry(), outlineMaterial)
    this._extractGeometry(mesh.geometry)
  }

  private _extractGeometry(geometry: BufferGeometry): void {
    const { vArray, n0Array, n1Array, otherVertArray } = geometry.index
      ? this._extractIndexed(geometry)
      : this._extractSoup(geometry)
    const g = this.geometry as BufferGeometry
    g.setAttribute('position', new BufferAttribute(new Float32Array(vArray), 3))
    g.setAttribute('aN0', new BufferAttribute(new Float32Array(n0Array), 3))
    g.setAttribute('aN1', new BufferAttribute(new Float32Array(n1Array), 3))
    g.setAttribute(
      'aOtherVert',
      new BufferAttribute(new Float32Array(otherVertArray), 4),
    )
  }

  private _extractIndexed(geometry: BufferGeometry): IEdgeArrays {
    const { weldedIndices, weldedVertices } = this._weldIndexed(
      geometry.index!,
      geometry.attributes.position as BufferAttribute,
    )
    const edges = this._extractEdgesFromIndex(weldedIndices, weldedVertices)
    const vArray: number[] = []
    const n0Array: number[] = []
    const n1Array: number[] = []
    const otherVertArray: number[] = []

    const sg = new BoxBufferGeometry(0.1, 0.1, 0.1)
    const sm = new MeshBasicMaterial({ color: 'red' })
    for (let i = 0; i < weldedVertices.length / 3; i++) {
      const m = new Mesh(sg, sm)
      m.position.fromArray(weldedVertices, i * 3)
    }
    edges.forEach(({ a, b, n0, n1 }, i) => {
      const extract = (index: number, n0: Vector3, n1: Vector3) => {
        const _index = index * 3
        n0Array.push(...n0.toArray())
        n1Array.push(...n1.toArray())
        for (let i = 0; i < 3; i++) vArray.push(weldedVertices[_index + i])
      }
      extract(a, n0, n1)
      extract(b, n0, n1)
      for (let i = 0; i < 3; i++) otherVertArray.push(weldedVertices[b * 3 + i])
      otherVertArray.push(0)
      for (let i = 0; i < 3; i++) otherVertArray.push(weldedVertices[a * 3 + i])
      otherVertArray.push(1)
    })
    return { vArray, n0Array, n1Array, otherVertArray }
  }

  private _weldIndexed(
    indexBuffer: BufferAttribute,
    positionBuffer: BufferAttribute,
  ) {
    const map: Record<string, number> = {}
    const weldedVerticesMap: Record<number, number> = {}
    const weldedVertices: number[] = []
    const weldedIndices: number[] = []

    for (let v = 0, c = 0; v < positionBuffer.count; v++) {
      const v3 = v * 3
      const xyz = [
        positionBuffer.array[v3],
        positionBuffer.array[v3 + 1],
        positionBuffer.array[v3 + 2],
      ].map((v) => Math.round(v * WELD_FACTOR))
      const key = xyz.join(':')
      if (map[key] === undefined) {
        map[key] = c++
        weldedVertices.push(
          positionBuffer.array[v3],
          positionBuffer.array[v3 + 1],
          positionBuffer.array[v3 + 2],
        )
      }
      weldedVerticesMap[v] = map[key]
    }
    for (let t = 0; t < indexBuffer.count; t += 3)
      for (let i = 0; i < 3; i++) {
        const source = indexBuffer.array[t + i]
        weldedIndices.push(weldedVerticesMap[source])
      }

    return { weldedVertices, weldedIndices }
  }

  private _extractEdgesFromIndex(
    indexBuffer: number[],
    positionBuffer: number[],
  ): IEdge[] {
    const faceNormals: Vector3[] = []
    const av = new Vector3()
    const bv = new Vector3()
    const cv = new Vector3()

    for (let t = 0; t < indexBuffer.length; ) {
      const normal = new Vector3()
      av.fromArray(positionBuffer, indexBuffer[t++] * 3)
      bv.fromArray(positionBuffer, indexBuffer[t++] * 3)
      cv.fromArray(positionBuffer, indexBuffer[t++] * 3)
      normal.crossVectors(bv.sub(av), cv.sub(av))
      faceNormals.push(normal.normalize())
    }

    const edgeFaceMap: Record<number, Record<number, number>> = {}
    const halfEdges: [number, number][] = []

    for (let t = 0; t < indexBuffer.length / 3; t++) {
      const offset = t * 3
      for (let curr = 0; curr < 3; curr++) {
        const next = (curr + 1) % 3
        const a = indexBuffer[offset + curr]
        const b = indexBuffer[offset + next]
        if (!edgeFaceMap[a]) edgeFaceMap[a] = {}
        edgeFaceMap[a][b] = t
        halfEdges.push([a, b])
      }
    }

    const edges: IEdge[] = []
    const duplicateMap: Record<number, Record<number, boolean>> = {}

    halfEdges.forEach(([a, b]) => {
      if (!duplicateMap[a]) duplicateMap[a] = {}
      if (!duplicateMap[b]) duplicateMap[b] = {}

      if (duplicateMap[a][b]) return

      const f0 = edgeFaceMap[a][b]
      const f1 = edgeFaceMap[b][a]

      const isOutline = f0 !== undefined && f1 !== undefined
      const n0 = isOutline ? faceNormals[f0] : NULL_VECTOR
      const n1 = isOutline ? faceNormals[f1] : NULL_VECTOR

      edges.push({ a, b, n0, n1 })
      duplicateMap[a][b] = true
      duplicateMap[b][a] = true
    })

    return edges
  }

  private _extractSoup(geometry: BufferGeometry): IEdgeArrays {
    const triangleCount = geometry.attributes.position.count
    const edgeMap = {}

    for (let t = 0; t < triangleCount; t++) {
      geometry.attributes.position.array
    }
    const vArray: number[] = []
    const n0Array: number[] = []
    const n1Array: number[] = []
    const otherVertArray: number[] = []
    // const weldedVertices: number[] = []

    return { vArray, n0Array, n1Array, otherVertArray }
  }
}
