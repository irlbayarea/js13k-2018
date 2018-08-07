class DocumentBodyNamer {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const namer = new DocumentBodyNamer('Hello World!');
document.body.innerHTML = namer.name;
