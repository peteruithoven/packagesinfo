function Packages() {
	
	var paramRegExp = /(\S[^:]*): (.*)/;
	
	this.lines = [];
	this.packages = {};
	this.length = 0;
	var _self = this;

	this.parse = function(content) {
		_self.lines = content.split("\n");
		_self.packages = {};
		_self.length = 0;
		var package = {};
		for(var i = 0;i<_self.lines.length;i++) {
			var line = 	_self.lines[i];
			var paramMatch = line.match(paramRegExp);
			
			if(paramMatch !== null) {
				//console.log("  paramMatch: ",paramMatch);
				var name = paramMatch[1];
				var value = paramMatch[2];
				if(name === "Package") {
					package = {};
					_self.packages[value] = package;
					_self.length++;
				}
				package[name] = value;
				switch(name) {
					case "Installed-Size":
						package.installedSize = Number.parseInt(value);
						break;
				}
			}
			// ToDo: Add other description lines
		}
		console.log("  _self.packages: ",_self.packages);
		for (var packageName in _self.packages) {
			checkDependencies(packageName);
			checkTotalSize(packageName);
		}
	};
	function checkDependencies(packageName) {
		//console.log("  checkDependencies: ",packageName);
		var package = _self.packages[packageName];
		
		if(package === undefined) return [];
		
		if(package.Depends !== undefined) {
			if(package.dependencies === undefined) {
				package.dependencies = package.Depends.split(", ");
			}
			if(package.totalDependencies === undefined) {
				package.totalDependencies = package.dependencies;
				
				for (var i = 0; i<package.dependencies.length;i++) {
					var dependencyName = package.dependencies[i];
					var subTotalDependencies = checkDependencies(dependencyName);
					concatUnique(package.totalDependencies,subTotalDependencies);
				}
			}
		} else {
			package.totalDependencies = [];
		}
		return package.totalDependencies;
	}
	// concat array b to array a, withoud duplicates
	function concatUnique(a,b) {
		var c = [];
		c.concat(a);
		for (var i = 0;i<b.length;i++) {
			if(!contains(c,b[i])) {
				c.push(b[i]);
			}
		}
	}
	function contains(array,value) {
		for (var i = 0; i<array.length;i++) {
			if(array[i] === value) return true;
		}
		return false;
	}
	function checkTotalSize(packageName) {
		
		//console.log("  checkTotalSize: ",packageName);
		var package = _self.packages[packageName];
		if(package === undefined) return 0;
		
		var totalSize = getSize(packageName);
		//console.log("  totalSize: ",totalSize);
		for (var i = 0; i<package.totalDependencies.length;i++) {
			var dependencyName = package.totalDependencies[i];
			totalSize += getSize(dependencyName);
			//console.log("  >totalSize: ",totalSize);
		}
		//console.log("  >>totalSize: ",totalSize);
		return package.totalSize = totalSize;
	}
	function getSize(packageName) {
		var package = _self.packages[packageName];
		if(package === undefined) return 0;
		return package.installedSize;
	}
}
