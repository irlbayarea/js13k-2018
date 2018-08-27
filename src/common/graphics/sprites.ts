import { state } from '../../index';
import { Rectangle } from '../math/math';
import { Vec2 } from '../math/vec2';

/**
 * The Sprite class references a particular image to be drawn.
 */
export class Sprite {
  constructor(
    private readonly spriteSheet: SpriteSheet,
    private readonly sourceRect: Rectangle
  ) {}

  /**
   * Renders this sprite centered at the given position.
   */
  public render(position: Vec2, width: number) {
    this.spriteSheet.render(
      new Rectangle(
        width,
        width,
        position.x - width / 2,
        position.y - width / 2
      ),
      this.sourceRect
    );
  }
}

/**
 * A SpriteSheet object represents a sprite sheet, having a source image
 * composed of "cells". The cells are the smallest regions that can be
 * referenced in the sheet, and each sprite from a sheet is made up of one or
 * more adjacent cells.
 */
export class SpriteSheet {
  private isLoaded = false;
  private readonly image: HTMLImageElement;

  /**
   * @param image
   * @param cellWidth
   * @param cellHeight
   */
  constructor(imageUri: string) {
    this.image = new Image();
    this.image.onload = () => (this.isLoaded = true);
    this.image.src = imageUri;
    // console.log(image);
  }

  /**
   * Renders an arbitrary region of this sprite sheet to an arbitrary target
   * rectangle.
   *
   * @param target A rectangle describing where to render the sprite.
   * @param source A rectangle describing where to get this sprite from this
   *               sheet.
   */
  public render(targetRect: Rectangle, sourceRect: Rectangle) {
    if (!this.isLoaded) {
      return;
    }

    state.draw.context.imageSmoothingEnabled = false;
    state.draw.context.drawImage(
      this.image,
      sourceRect.left,
      sourceRect.top,
      sourceRect.width,
      sourceRect.height,
      targetRect.left,
      targetRect.top,
      targetRect.width,
      targetRect.height
    );
  }
}
