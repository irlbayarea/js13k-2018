export function drawToCanvas(doc: Document, id: string) {
  const c = doc.getElementById(id) as HTMLCanvasElement;

  if (c.getContext) {
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;

    const rect1X = 10;
    const rect1Y = 10;
    const rect1W = 50;
    const rect1H = 50;

    const rect1: number[] = [rect1X, rect1Y, rect1W, rect1H];

    const rect1Xi = 0;
    const rect1Yi = 1;
    const rect1Wi = 2;
    const rect1Hi = 3;

    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(
      rect1[rect1Xi],
      rect1[rect1Yi],
      rect1[rect1Wi],
      rect1[rect1Hi]
    );

    const rect2X = 30;
    const rect2Y = 30;
    const rect2W = 50;
    const rect2H = 50;

    const rect2: number[] = [rect2X, rect2Y, rect2W, rect2H];

    const rect2Xi = 0;
    const rect2Yi = 1;
    const rect2Wi = 2;
    const rect2Hi = 3;

    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx.fillRect(
      rect2[rect2Xi],
      rect2[rect2Yi],
      rect2[rect2Wi],
      rect2[rect2Hi]
    );
  }
}

export function writeToParagraph(doc: Document, id: string, message: string) {
  const p = doc.getElementById(id) as HTMLParagraphElement;

  p.innerHTML = message;
}

export function writeWordsOnCanvas(doc: Document, id: string, message: string) {
  const c = doc.getElementById(id) as HTMLCanvasElement;

  if (c.getContext) {
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = '12px serif';
    ctx.fillText(
      message,
      1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1,
      1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
    );
  }
}
