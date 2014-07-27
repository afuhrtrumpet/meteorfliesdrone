Meteor.startup(function() {
	var client = arDrone.createClient();

	Meteor.methods({
		takeoff: function() {
			console.log("Taking off");
			client.takeoff();
		},

		land: function() {
			console.log("Landing");
			client.stop();
			client.land();
		},

		processCommand: function(cmd) {
			console.log("Command is: " + cmd);
			client.stop();
			switch(cmd.toLowerCase()) {
				case "forward":
					client.front(0.5);
					console.log("Going forward");
					break;
				case "back":
					client.back(0.5);
					console.log("Going back");
					break;
				case "left":
					client.left(0.5);
					console.log("Going left");
					break;
				case "right":
					client.right(0.5);
					console.log("Going right");
					break;
				case "clockwise":
					client.clockwise(0.5);
					console.log("Going clockwise");
					break;
				case "counterclockwise":
					client.counterClockwise(0.5);
					console.log("Going counter clockwise");
					break;
			}
		},

		stop: function() {
			console.log("Stopping");
			client.stop();
		}
	});
});
