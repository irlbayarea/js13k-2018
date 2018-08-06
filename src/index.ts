class DocumentBodyNamer {
  name: string
}

(function(){
  const namer = new DocumentBodyNamer();
  namer.name = 'Hello World!';
  document.body.innerHTML = namer.name;
})();
