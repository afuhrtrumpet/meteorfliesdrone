// Mode enum
var ModeEnum = {
  DEMOCRACY : 0,
  ANARCHY : 1,
  DEFAULT = 2
};

var mode = ModeEnum.DEFAULT;
// file scope
var timerId;

// file scope
var lastTick = 0;

var mostRecentCommand;

// file scope
var processQueue = function() {
  if (mode == ModeEnum.DEFAULT) {
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
  }
  else if (mode == ModeEnum.DEMOCRACY) {
   // Use democracy
  }
};

// -- constants --

// how often to issue a new command in ms
COMMAND_INTERVAL = 1000; // DEFAULT

Meteor.methods({
  changeMode : function(newMode) {
    if (newMode == "Democracy") {
      mode = ModeEnum.DEMOCRACY;
      COMMAND_INTERVAL = 5000;
    }
    if (newMode == "Default") {
      mode = ModeEnum.DEFAULT;
      COMMAND_INTERVAL = 1000;
    }
  }
});

if (Meteor.isServer){
    Meteor.startup(function(){
        timerId = Meteor.setInterval(processQueue, COMMAND_INTERVAL);
    });
}

