/**
 * Declarations for external / browser-provided library functions that are not
 * found our versions of those libraries.
 */

interface CanvasRenderingContext2D {
  resetTransform(): void;
}

/**
 * Allow importing png assets.
 */
// declare module '*.png' {
//   const content: any;
//   export default content;
// }
declare module '*.png';
