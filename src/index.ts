class DocumentBodyNamer {
  public name: string;
}

const namer = new DocumentBodyNamer();
namer.name = 'Hello World!';
document.body.innerHTML = namer.name;
