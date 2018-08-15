class DocumentBodyNamer {
  constructor(public name: string) {}
}

const namer = new DocumentBodyNamer('Hello World! I"m helping!');
document.body.innerHTML = namer.name;
