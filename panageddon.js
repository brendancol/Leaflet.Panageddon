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

	start: function(panType, speed) {
		if (panType === 'bounce') {
			this.setInterval(this.bounce(), speed * 1000 + 100);
		}
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

		var self = this;
		var startingPosition = this.getCenter();
		var position = [startingPosition.lat, startingPosition.lng];
		var dx = options.groundInterval * Math.cos(options.startingAngle * (180 / Math.PI));
		var dy = options.groundInterval * Math.sin(options.startingAngle * (180 / Math.PI));
		return function () {
			console.log('bounce: ' + position.toString());
			self.panTo(position, {animate: true, duration: options.duration, easeLinearity: 1.0});
		 	position[0] = Number((position[0] + dy).toFixed(6));
		 	position[1] = Number((position[1] + dx).toFixed(6));
		}
	},

	bounce: function (options) {
		var func = this._bounce(options);
		this.activePathes.push(setInterval(func, options.speed * 1000 + 100));
	}

});

L.panageddonMap = function (id, options) {
	return new L.PanageddonMap(id, options);
};

