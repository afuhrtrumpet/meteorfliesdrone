var IMPACT_VALUE = 0.3;

// Only call drone commands if we are on the "server" instance
if( Aux.findOne('server') )
{
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
                        client.front(IMPACT_VALUE);
                        console.log("Going forward");
                        break;
                    case "back":
                        client.back(IMPACT_VALUE);
                        console.log("Going back");
                        break;
                    case "left":
                        client.left(IMPACT_VALUE);
                        console.log("Going left");
                        break;
                    case "right":
                        client.right(IMPACT_VALUE);
                        console.log("Going right");
                        break;
                    case "clockwise":
                        client.clockwise(IMPACT_VALUE);
                        console.log("Going clockwise");
                        break;
                    case "counterclockwise":
                        client.counterClockwise(IMPACT_VALUE);
                        console.log("Going counter clockwise");
                        break;
                }
            },

            stop: function() {
                client.stop();
            }
        });
    });
}