# OneTab — Inside MacBook adaptation

Original geometry and assembly transforms: https://github.com/Pulkit7070/inside-macbook
Copyright (c) 2026 Pulkit Saraf, MIT. See ../LICENSE-inside-macbook.txt.

OneTab adaptations: scroll-driven staggered explosion and reassembly, responsive camera, dark lighting, six content chapters, reduced-motion and WebGL fallback. Original 20 assemblies retained. This is an illustrative model, not a CAD model or repair guide. No Apple imagery or soundtrack redistributed.

Build with Node, React 19.2.8, React DOM 19.2.8, Three 0.185.1, @react-three/fiber 9.7.0, @react-three/drei 10.7.8 and esbuild:

npx esbuild source/entry.jsx --bundle --format=esm --minify --jsx=automatic --outfile=scene.js
