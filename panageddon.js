/*
 * L.Panageddon extends the Leaflet to add auto-panning feature.
 */

L.PanageddonMap = L.Map.extend({

	initialize: function (id, options) { // (HTMLElement or String, Object)
		this.activePathes = [];
		return L.Map.prototype.initialize.call(this, id, options);
	},

	setPanBox: function (bbox, options) {
		console.log('setting pan box');
		return this;
	},

	addDefaults: function (options) {

		if(!options.startingAngle) {
			options.startingAngle = 90;
		}

		if(!options.duration) {
			options.duration = 2.0;
		}

		if(!options.groundInterval) {
			options.groundInterval = .05;
		}

		if(!options.refreshRate) {
			options.refreshRate = 2;
		}

		if(!options.bbox) {
			options.bbox = [-90, -180, 90, 180];
		}
	},

	_bounce: function (options) {

		this.addDefaults(options);
		var self = this;
		var startingPosition = this.getCenter();
		var startingZoom = this.getZoom();
		var currentAngle = options.startingAngle;
		var position = [startingPosition.lat, startingPosition.lng];
		var dx = options.groundInterval * Math.cos(currentAngle * (180 / Math.PI));
		var dy = options.groundInterval * Math.sin(currentAngle * (180 / Math.PI));
		var dirtyY = false;
		var dirtyX = false;
		return function () {
			console.log('bounce: ' + position.toString());
		 	dirtyY = position[0] < options.bbox[0] || position[0] > options.bbox[2];
		 	dirtyX = position[1] < options.bbox[1] || position[1] > options.bbox[3];
		 	
		 	if (dirtyX || dirtyY) {
		 		if (options.edgeMethod === 'reverse') {
		 			dx = dx * -1;
		 			dy = dy * -1;
		 		} 

		 		if (dirtyX && options.edgeMethod === 'reflect') {
		 			dx = dx * -1;
		 		} 

		 		if (dirtyY && options.edgeMethod === 'reflect') {
		 			dy = dy * -1;
		 		}

		 		if (options.edgeMethod === 'repeat') {
		 			position = [startingPosition.lat, startingPosition.lng];
		 			self.setView(position, startingZoom, {
		 				pan : {animate:false}
		 			});
		 			return;
		 		}
		 	} 

	 		position[0] = Number((position[0] + dy).toFixed(6));
	 		position[1] = Number((position[1] + dx).toFixed(6));
			self.panTo(position, {animate: true, duration: options.duration, easeLinearity: 1.0});
		}
	},

	bounce: function (options) {
		var func = this._bounce(options);
		this.activePathes.push(setInterval(func, options.refreshRate * 1000 + 100));
	},

	_spiral: function (options) {
		this.addDefaults(options);
		var self = this;
		var startingPosition = this.getCenter();

		var centerX = startingPosition.lng;
		var radiusX = .05;
		var dx = 0;
		
		var centerY = startingPosition.lat;
		var radiusY = .05;
		var dy = 0;


		var dirtyY = false;
		var dirtyX = false;
		var i = 0;
		var growthRate = 1;
		var angle = 0;
		return function () {
			i = i + growthRate;
			angle = 0.1 * i;
	        dx = (radiusX + radiusY * angle) * Math.cos(angle);
	        dy = (radiusX + radiusY * angle) * Math.sin(angle);

		 	dirtyY = centerY + dy < options.bbox[0] || centerY + dy > options.bbox[2];
		 	dirtyX = centerX + dx < options.bbox[1] || centerX + dx > options.bbox[3];
		 	
		 	if (dirtyX || dirtyY) {
		 		growthRate = growthRate * -1;
		 	} 

	 		y = Number((centerY + dy).toFixed(6));
	 		x = Number((centerX + dx).toFixed(6));
	 		console.log('spiral: ' + y.toString() + x.toString());
			self.panTo([y,x], {animate: true, duration: options.duration, easeLinearity: 1.0});
		}
	},

	spiral: function (options) {
		var func = this._spiral(options);
		this.activePathes.push(setInterval(func, options.refreshRate * 1000 + 100));
	}

});

L.panageddonMap = function (id, options) {
	return new L.PanageddonMap(id, options);
};

