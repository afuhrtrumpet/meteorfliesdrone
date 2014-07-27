var IMPACT_VALUE = 0.3;


Meteor.startup(function() {
    var client = arDrone.createClient();





    if( Aux.findOne('server') ) {
        // josh's computer

        Meteor.methods({
            takeoff: function() {
                // Only call drone commands if we are on the "server" instance

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
    } else {

        Meteor.methods({
            takeoff: function() {
                pubnub.publish({
                    channel   : 'drone_commands',
                    message   : {m:'takeoff'},
                    callback  : function(e) { console.log( "SUCCESS!", e ); },
                    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                });
            },

            land: function() {

                pubnub.publish({
                    channel   : 'drone_commands',
                    message   : {m:'land'},
                    callback  : function(e) { console.log( "SUCCESS!", e ); },
                    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                });

            },

            processCommand: function(cmd) {

                pubnub.publish({
                    channel   : 'drone_commands',
                    message   : {m:'processCommand', p:cmd},
                    callback  : function(e) { console.log( "SUCCESS!", e ); },
                    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                });
            },

            stop: function() {
                pubnub.publish({
                    channel   : 'drone_commands',
                    message   : {m:'stop'},
                    callback  : function(e) { console.log( "SUCCESS!", e ); },
                    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                });
            }

        });

    }
});



// file scope
var pubnub = Meteor.require("pubnub").init({
    publish_key   : "pub-c-015aeef8-c80f-44cc-8021-68b5296297fb",
    subscribe_key : "sub-c-261b8d52-1543-11e4-8bd3-02ee2ddab7fe"
});

var Fiber = Meteor.require('fibers');


Meteor.startup(function() {


    if( Aux.findOne('server') ) {

        pubnub.subscribe({
            channel  : 'drone_commands',
            callback : function(message) {

                console.log(message);

                new Fiber(function() {
                    Meteor.call(message.m, message.p);
                }).run();

//                console.log( " > ", message );
            }
        });

    }


});
