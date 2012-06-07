
(function(window) {

	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(item){
			for (var i = 0, l = this.length; i < l; i++){
				if (this[i] === item) {
					return i;
				}
			}
			return -1;
		}
	}
	
	if(!Date.now){
		Date.now = function(){
			return new Date().valueOf();
		}
	}

	
}(window))

