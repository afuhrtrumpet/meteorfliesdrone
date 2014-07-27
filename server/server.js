MAX_COMMANDS = 20;
// file scope
var timerId;

// file scope
var lastTick = 0;

var currentCommand;

// file scope
var processQueue = function() {

    // the now of this tick
    var now = new Date().getTime();

    Aux.upsert({_id: 'tickNow'}, {$set: { time:now }});

    var newCommands = Commands.find({time:{$gt:lastTick}}).fetch();


    // track ids we are about to delete
//    var remove = [];

    // process every command in the collection
    newCommands.each(function(c){
        console.log(c);

//        remove.push(c._id);
    });


//    remove.each(function(r){
//        Commands.remove(r);
//    });

    lastTick = now;

		if (currentCommand) {
			Commands.remove(currentCommand);
			OldCommands.insert(currentCommand);
			if ( OldCommands.find().count() + Commands.find().count() > MAX_COMMANDS) {
				var commandToRemove = OldCommands.findOne({}, {sort: {time: 1}});
				console.log("Removing old: " + commandToRemove);
				OldCommands.remove(commandToRemove);
			}
			console.log("Removed: " + currentCommand);
		}

		currentCommand = Commands.findOne({}, {sort: {time: 1}});
		if (currentCommand) {
			console.log("Processing: " + currentCommand.command);
			Meteor.call('processCommand', currentCommand.command);
		} else {
			Meteor.call('stop');
		}

		Aux.upsert({_id:'currentCommand'}, {$set:{current:currentCommand ? currentCommand._id : ""}});
};

// -- constants --

// how often to issue a new command in ms
COMMAND_INTERVAL = 1000;


if (Meteor.isServer){

    Meteor.startup(function(){
        timerId = Meteor.setInterval(processQueue, COMMAND_INTERVAL);
    });
}



//var Pusher = Meteor.require('pusher');


var pubnub = Meteor.require("pubnub").init({
    publish_key   : "pub-c-015aeef8-c80f-44cc-8021-68b5296297fb",
    subscribe_key : "sub-c-261b8d52-1543-11e4-8bd3-02ee2ddab7fe"
});



Meteor.startup(function() {


    if( Aux.findOne('server') )
    {

//        var message = { "some" : "data" };
//        pubnub.publish({
//            channel   : 'my_channel',
//            message   : message,
//            callback  : function(e) { console.log( "SUCCESS!", e ); },
//            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
//        });


//        Pusher.url = "http://3851f071c179b8816524:c3336a8c1c792c5e57cc@api.pusherapp.com/apps/83143";
//
//        Pusher['test_channel'].trigger('my_event', {
//            message: 'hello world'
//        });
    }

});
