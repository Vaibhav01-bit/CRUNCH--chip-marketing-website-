# Performance Optimization Strategy: "Crispy Speed" 🚀

**Goal**: Deliver a lightning-fast, buttery-smooth 60fps experience on mobile while keeping the brand's premium 3D flavor.

## 1. Executive Summary & Audit Findings
The website currently loads heavy assets upfront.
- **Critical bottleneck**: Large PNG assets (~600KB - 800KB each) in `public/assets`.
- **Render blocking**: Multiple 3D Canvases (`Hero`, `Retailers`, `Flavor`, `Footer`) might be initializing simultaneously.
- **Mobile Tax**: High pixel density rendering (`dpr`) on mobile GPUs drains battery and slows scroll.

---

## 2. Quick Wins (High Impact, Low Effort)

### 🥑 Image Optimization (Priority: Critical)
Convert all texture assets from PNG to **WebP**. This typically reduces file size by **70-90%** without visible quality loss.
- `chip-single.png` (600KB -> ~45KB)
- `story-macro.png` (786KB -> ~60KB)
- **Action**: Batch convert all assets in `public/assets`.

### 📦 Lazy Loading 3D Sections
Currently, React might try to bundle all components.
- **Action**: Use `React.lazy()` and `<Suspense>` for heavy 3D components (`Retailers`, `FlavorExperience`, `FooterSections`).
- **Benefit**: The initial Hero load will be much smaller. The other sections will load only when the user scrolls near them.

### 📱 Mobile GPU Caps
Limit the Device Pixel Ratio (DPR) for the 3D Canvas.
- **Current**: Defaults to native (can be 3.0+ on iPhones).
- **Optimization**: Cap at 1.5 or 2.
  ```jsx
  <Canvas dpr={[1, 1.5]}> ... </Canvas>
  ```
- **Benefit**: Massive FPS boost on high-end mobile phones, prevents overheating.

---

## 3. 3D Animation Optimizations

### Geometry & Materials
- **Texture Reuse**: Ensure we aren't creating new Textures every render. (Already using `useTexture` which caches, but good to verify).
- **Geometry Instancing**: For particles (Spice, Salt, Chip Rain), use `<Instances>` or `instancedMesh`. **Do not** map over 100s of individual mesh components.
- **Shadows**: Real-time shadows are expensive.
  - **Mobile**: Disable `castShadow` / `receiveShadow` or use `ContactShadows` (which is a single bake) instead of real lights.

### Render Loop
- **On-Demand Rendering**: If a section is static (not animating), stop the render loop using `frameloop="demand"`.
- **Visibility Checks**: Use `useInView` to **pause** the 3D animation loop when the component is off-screen.
  ```jsx
  const { ref, inView } = useInView();
  return <Canvas frameloop={inView ? "always" : "never"}>...</Canvas>
  ```

---

## 4. Mobile-First UX Tweaks
- **Disable Heavy Interactions**: On touch devices, remove "hover" logic (raycasting) as it adds CPU overhead on every frame.
- **Simplify Particles**: Reduce particle counts by 50% on mobile screens.
  ```js
  const count = isMobile ? 50 : 150;
  ```

---

## 5. Code & Bundle Strategy
- **Audit Imports**: Check if we are importing the entire `lodash` or `three/examples` when only small parts are needed.
- **Vite Config**: Ensure manual chunks for vendor libraries (`three`, `react-dom`).

## 6. Action Plan
1.  [ ] **Compress**: Convert `public/assets/*.png` to `.webp`.
2.  [ ] **Lazy Load**: Wrap 3D sections in `React.lazy`.
3.  [ ] **Limit DPR**: Update all `<Canvas>` tags to `dpr={[1, 1.5]}`.
4.  [ ] **Pause Off-Screen**: Implement `useInView` to stop rendering hidden 3D scenes.
5.  [ ] **Mobile Instancing**: Reduce particle counts based on screen width.

Let's start frying these optimizations! 🥔💨
