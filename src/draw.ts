export function drawToCanvas(doc: Document, id: string) {
    const c = <HTMLCanvasElement>doc.getElementById(id);

    if (c.getContext) {
        const ctx = <CanvasRenderingContext2D>c.getContext('2d');

        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(10, 10, 50, 50);

        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        ctx.fillRect(30, 30, 50, 50);
    }
}

export function writeToParagraph(doc: Document, id: string, message: string) {
    const p = <HTMLParagraphElement>doc.getElementById(id);

    p.innerHTML = message;
}
