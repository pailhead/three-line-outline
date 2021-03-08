# three-line-outline

This is a geometric implementation of outlines for three.js. It's running in the vertex shader rather than pixel shader and shows/hides geometric lines if one adjacent face is facing away from the camera while the other faces towards.

I found this useful when rendering mechanical parts for CAD viewers.

This is WIP, currently works with indexed geometry only.

## Example

https://dusanbosnjak.com/test/outline/

## Usage

[![NPM](https://nodei.co/npm/three-line-outline.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/three-line-outline/)

Something like this (see `/debugger`):

```
const myMesh = new Mesh(new CylinderGeometry)
const myOutline = new OutlineMesh(myMesh)
```

![test](https://media.giphy.com/media/gsxhTDtWzxEN7SNroS/giphy.gif)
