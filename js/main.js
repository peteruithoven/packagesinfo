var packages = new Packages();
var dropZone = new DropZone();
var list = new List();

dropZone.init(document.getElementById('dropzone'));
list.init(document.getElementById('list'));

dropZone.onload = function(content) {
	packages.parse(content);
	list.display(packages);
};