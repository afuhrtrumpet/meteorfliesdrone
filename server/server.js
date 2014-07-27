// file scope
var timerId;

// file scope
var lastTick = 0;

var mostRecentCommand;

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

		if (mostRecentCommand) {
			Commands.remove(mostRecentCommand);
			console.log("Removed: " + mostRecentCommand);
		}

		mostRecentCommand = Commands.findOne({}, {sort: {time: 1}});
		if (mostRecentCommand) {
			console.log("Processing: " + mostRecentCommand.command);
			Meteor.call('processCommand', mostRecentCommand.command);
		} else {
			Meteor.call('stop');
		}
};

// -- constants --

// how often to issue a new command in ms
COMMAND_INTERVAL = 1000;

if (Meteor.isServer){

    Meteor.startup(function(){
        timerId = Meteor.setInterval(processQueue, COMMAND_INTERVAL);
    });
}



Pusher = Meteor.require('pusher');

Meteor.startup(function() {

});
