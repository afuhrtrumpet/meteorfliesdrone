Package.describe({summary: "A node.js client for controlling Parrot AR Drone 2.0 quad-copters."});

Npm.depends({
	'ar-drone': '0.3.2'
});

Package.on_use(function(api) {
	api.add_files("ar-drone.js", "server");
	api.export('arDrone');
});
