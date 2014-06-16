function List() {

	var _element;
	var _self = this;

	this.init = function(element) {
		_element = element;
	};
	this.display = function(packages) {
		
		var tr = document.createElement("tr");
		createCell(tr,"Package:");
		createCell(tr,"Installed-Size:");
		createCell(tr,"Total Installed-Size:");
		createCell(tr,"Total Dependencies:");
		_element.appendChild(tr);
		
		for (var packageName in packages.packages) {
			var package = packages.packages[packageName]
			
			var tr = document.createElement("tr");
			createCell(tr,packageName);
			createCell(tr,filesize(package.installedSize));
			createCell(tr,"("+filesize(package.totalSize)+")");
			createCell(tr,"<span class='dependencies'>("+package.totalDependencies.join(",")+")</span>");
			_element.appendChild(tr);
		}
		
		var tr = document.createElement("tr");
		createCell(tr,"Total:");
		var totalSize = 0;
		for (var packageName in packages.packages) {
			totalSize += packages.packages[packageName].installedSize;
		}
		createCell(tr,filesize(totalSize));
		
		_element.appendChild(tr);
	}
	function createCell(row,content) {
		var td = document.createElement("td");
		td.innerHTML = content;
		row.appendChild(td);
	}
}
