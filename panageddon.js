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

	_bounce: function (options) {

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

		bounceOptions['bbox'];

		var self = this;
		var startingPosition = this.getCenter();
		var position = [startingPosition.lat, startingPosition.lng];
		var dx = options.groundInterval * Math.cos(options.startingAngle * (180 / Math.PI));
		var dy = options.groundInterval * Math.sin(options.startingAngle * (180 / Math.PI));
		return function () {
			console.log('bounce: ' + position.toString());
			console.log('bbox' + options.bbox.toString());
		 	position[0] = Number((position[0] + dy).toFixed(6));
		 	position[1] = Number((position[1] + dx).toFixed(6));

		 	if (position[0] < options.bbox[0] || 
		 		position[0] > options.bbox[2] ||
		 		position[1] < options.bbox[1] || 
		 		position[1] > options.bbox[3]) {
		 		dx = dx * -1;
		 		dy = dy * -1;
		 		position[0] = Number((position[0] + dy).toFixed(6));
		 		position[1] = Number((position[1] + dx).toFixed(6));
		 		console.log('changing direction!!!');

		 	}

			self.panTo(position, {animate: true, duration: options.duration, easeLinearity: 1.0});
		}
	},

	bounce: function (options) {
		var func = this._bounce(options);
		this.activePathes.push(setInterval(func, options.refreshRate * 1000 + 100));
	}

});

L.panageddonMap = function (id, options) {
	return new L.PanageddonMap(id, options);
};

