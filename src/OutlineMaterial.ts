import { Color, ShaderMaterial } from 'three'
import vertexShader from './glsl/outline.vert'
import fragmentShader from './glsl/outline.frag'

const PI_INV = 1 / Math.PI

export class OutlineMaterial extends ShaderMaterial {
  constructor(private _angleThreshold = 0, outline = true, color = '#ffffff') {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uAngleThresh: { value: 0 },
        uOutline: { value: 0 },
        uColor: { value: new Color() },
      },
    })
    this.angleThreshold = _angleThreshold
    this.outline = outline
    this.color.setStyle(color)
  }
  set angleThreshold(degrees: number) {
    this._angleThreshold = degrees
    this.uniforms.uAngleThresh.value = ((degrees / 180) * Math.PI) % Math.PI
  }
  get angleThreshold(): number {
    return this._angleThreshold
  }
  set outline(outline: boolean) {
    this.uniforms.uOutline.value = Number(outline)
  }
  get outline(): boolean {
    return Boolean(this.uniforms.uOutline.value)
  }
  get color(): Color {
    return this.uniforms.uColor.value
  }
}
