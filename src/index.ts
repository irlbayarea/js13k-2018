class DocumentBodyNamer {
  constructor(public name: string) {}
}

const namer = new DocumentBodyNamer('Hello World!');
document.body.innerHTML = namer.name;
