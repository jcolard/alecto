---
name: Alekto
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede8'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#59413f'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#8d706e'
  outline-variant: '#e1bfbc'
  surface-tint: '#b12a2e'
  primary: '#ae282c'
  on-primary: '#ffffff'
  primary-container: '#d04141'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb3ae'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5e5c58'
  on-tertiary: '#ffffff'
  tertiary-container: '#777470'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ae'
  on-primary-fixed: '#410005'
  on-primary-fixed-variant: '#8f0d19'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e6e2dc'
  tertiary-fixed-dim: '#cac6c1'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#484743'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.1'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  body-lg:
    fontFamily: EB Garamond
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: EB Garamond
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-xl:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1'
  label-md:
    fontFamily: Archivo Narrow
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Archivo Narrow
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
spacing:
  unit: 4px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 48px
  xl: 80px
  margin-safe: 24px
---

## Brand & Style
The design system is built on the friction between archival history and raw, youthful energy. It rejects the sanitized "flat" aesthetic of modern SaaS in favor of a visceral, anti-flat experience that feels physical, heavy, and aged. The target audience is a generation of readers seeking a digital space that feels as permanent and textured as a physical library.

The style is a fusion of **Neo-Brutalism** and **Tactile Skeuomorphism**. It utilizes high-contrast composition, heavy borders, and organic textures to simulate the experience of handling old paper, wood, and clay. The emotional response is one of "curated chaos"—an environment that feels alive, intentional, and intellectually stimulating.

## Colors
The palette is rooted in natural pigments and industrial materials.
- **Primary (Brick Red):** Used for critical actions, highlights, and "stamped" elements. It should feel like drying ink or red clay.
- **Secondary (Anthracite):** The "ink" of the system. Used for heavy borders, dense backgrounds, and primary metadata.
- **Tertiary (Clay):** A transitional mid-tone used for secondary text and structural elements that require less visual weight than Anthracite.
- **Neutral (Ecru Paper):** The foundational surface. This is not a flat hex code; it should always be paired with a subtle "paper grain" overlay (5-10% opacity) to give the UI a non-digital substrate.

## Typography
The system relies on a sharp dichotomy:
1. **The Organic (EB Garamond):** Used for the soul of the content—titles, quotes, and long-form reading. It should feel literary and human.
2. **The Structured (Archivo Narrow):** Used for the "machine" of the library—metadata, buttons, UI labels, and navigation. It must be set in heavy weights (Bold/Black) to contrast against the elegant serif.

Use "tight" line heights for display text to create a sense of density and "loose" line heights for body text to ensure readability on the textured background.

## Layout & Spacing
This design system rejects standard 12-column grids in favor of **Asymmetric Tension**. Layouts should feel like an open scrapbook or a curated gallery wall.

- **The Overlap:** Elements (images, text blocks, tags) should frequently overlap or be offset by small, inconsistent increments (e.g., 8px or 12px) to break the digital "perfection."
- **Breakpoints:**
  - **Desktop:** Large, generous whitespace on one side, dense content clusters on the other.
  - **Mobile:** Single-column, but with "imperfect" padding where the left and right margins are slightly different (e.g., Left: 24px, Right: 20px) to maintain the tactile feel.
- **Rhythm:** Use the 4px base unit, but avoid perfect symmetry. If a component has 32px top padding, try 28px bottom padding to simulate manual placement.

## Elevation & Depth
Depth is created through physical stacking and texture rather than light-source shadows.
- **Tonal Layers:** Use the Neutral (Ecru) as the base, with Clay or Anthracite elements sitting "on top" like cut-out pieces of cardstock.
- **Hard Shadows:** Instead of soft blurs, use "Block Shadows." These are solid offsets (usually 4px or 8px) in Anthracite with 100% opacity, creating a 3D effect reminiscent of print-making.
- **Inner Texture:** All primary surfaces should feature a noise/grain filter. Larger surfaces should incorporate "imperfections" like subtle coffee ring stains or frayed edges in the corner assets.
- **Frames:** Image containers should have 2px solid Anthracite borders, often slightly "misaligned" with the image inside (simulating a misprinted lithograph).

## Shapes
The shape language is strictly **Sharp (0px)**. All corners are 90 degrees to maintain the brutalist, architectural feel. 

To introduce variety, use "Imperfect Frames"—shapes that are slightly sheared (1-2 degrees) or have hand-drawn, jagged border-image masks. Containers should look like they were cut with a knife, not rendered by a computer.

## Components
- **Asymmetric Tags:** Metadata tags use Archivo Narrow. They should vary in width and be "tacked" onto elements at slight angles. Use the Brick Red for active states.
- **Textured Image Frames:** Book covers and audio thumbnails should have a 1px inner "white" highlight and a 2px outer Anthracite border. Apply a grain overlay and a subtle "distress" mask to the edges.
- **Analog Audio Player:** The player should mimic a high-end vintage turntable or tape deck. Use heavy Archivo labels. The progress bar should be thick (8px) and look like a physical slider etched into the "clay" surface.
- **Buttons:** Rectangular with no radius. Primary buttons use a thick 4px block shadow. On hover, the button should "sink" (translate 4px down and right) to meet its shadow, simulating a physical press.
- **Book-Style Reader:** Horizontal pagination only. Use a "gutter" shadow in the center of the screen to simulate the fold of a physical book. Navigation is handled via large, Archivo-labeled "PREVIOUS" and "NEXT" zones at the bottom corners.
- **Checkboxes/Radios:** These should look like hand-drawn "X" marks or heavy stamped circles using the Brick Red primary color.