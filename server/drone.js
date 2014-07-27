var IMPACT_VALUE = 0.15;
var ROTATE_VALUE = 0.3;


var bindMeteorCalls = function() {
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


            // clears emergency
            emergency: function() {
                console.log("Emergency");
                client.disableEmergency();
                client.stop();
                client.land();
            },

            calibrate: function() {
                // must be 0
                client.calibrate(0);
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
                    case "up":
                        client.up(IMPACT_VALUE);
                        console.log("Going up");
                        break;
                    case "down":
                        client.down(IMPACT_VALUE);
                        console.log("Going down");
                        break;
                    case "clockwise":
                        client.clockwise(ROTATE_VALUE);
                        console.log("Going clockwise");
                        break;
                    case "counterclockwise":
                        client.counterClockwise(ROTATE_VALUE);
                        console.log("Going counter clockwise");
                        break;

                }

                Meteor.setTimeout(function(){
                    client.stop();
                    console.log('autostop');
                }, 1000);
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

            emergency: function() {

                pubnub.publish({
                    channel   : 'drone_commands',
                    message   : {m:'emergency'},
                    callback  : function(e) { console.log( "SUCCESS!", e ); },
                    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                });

            },

            calibrate: function() {

                pubnub.publish({
                    channel   : 'drone_commands',
                    message   : {m:'calibrate'},
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
};



// file scope
var pubnub = Meteor.require("pubnub").init({
    publish_key   : "pub-c-015aeef8-c80f-44cc-8021-68b5296297fb",
    subscribe_key : "sub-c-261b8d52-1543-11e4-8bd3-02ee2ddab7fe"
});

var Fiber = Meteor.require('fibers');



Meteor.setTimeout(
    function(){
        console.log('cinderella');


        if( Aux.findOne('server') ) {
            console.log("starting as server in drone.js");

            pubnub.subscribe({
                channel  : 'drone_commands',
                callback : function(message) {

                    console.log(message);

                    new Fiber(function() {
                        Meteor.call(message.m, message.p);
                    }).run();
                }
            });

        } else {
            console.log('started as client in drone.js');
        }

        bindMeteorCalls();



    }, 2000);


