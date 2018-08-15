export function drawToCanvas(doc: Document, id: string) {
    const c = doc.getElementById(id) as HTMLCanvasElement;

    if (c.getContext) {
        const ctx = c.getContext('2d') as CanvasRenderingContext2D;

        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(10, 11, 50, 51);

        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        ctx.fillRect(30, 31, 52, 53);
    }
}

export function writeToParagraph(doc: Document, id: string, message: string) {
    const p = doc.getElementById(id) as HTMLParagraphElement;

    p.innerHTML = message;
}
