MAX_COMMANDS = 20;
// Mode enum
var ModeEnum = {
  DEMOCRACY : 0,
  ANARCHY : 1,
  DEFAULT : 2
};

var mode = ModeEnum.DEFAULT;
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

    // process every command in the collection
    newCommands.each(function(c){
        console.log(c);
    });


    lastTick = now;

  if (mode == ModeEnum.DEFAULT) {
		if (currentCommand) {
			Commands.remove(currentCommand);
			OldCommands.insert(currentCommand);
			/*if ( OldCommands.find().count() + Commands.find().count() > MAX_COMMANDS) {
				var commandToRemove = OldCommands.findOne({}, {sort: {time: 1}});
				console.log("Removing old: " + commandToRemove);
				OldCommands.remove(commandToRemove);
			}*/
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
  }
  else if (mode == ModeEnum.DEMOCRACY) {
   // Use democracyi
  if(newCommands.length < 1) {
    Meteor.call('stop');
  }
   var commands = {}
   var remove = [];
   newCommands.each(function(c){
     remove.push(c._id);
     if (c.name in commands) {
       commands[c.name] = 1;
     }
     else {commands[c.name] = commands[c.name] + 1;
     }
   });
  var sort_array = [];
  for (var key in commands) {
    sort_array.push({key:key, value:commands[key]});
  }
  sort_array.sort(function(x,y){ return x.value - y.value});
  item = sort_array[0].key;
  console.log("democracy chose : " + item);
  Meteor.call("processCommand", item);
  // Remove new commands
  remove.each(function(r){
    Commands.remove(r);
  });
  }
};

// -- constants --

// how often to issue a new command in ms
COMMAND_INTERVAL = 1000; // DEFAULT

Meteor.methods({
  changeMode : function(newMode) {
    console.log(newMode);
    console.log(mode);
    if (newMode == "Democracy" && mode != ModeEnum.DEMOCRACY) {
      mode = ModeEnum.DEMOCRACY;
      COMMAND_INTERVAL = 5000;
      Meteor.clearInterval(timerId);
      timerId = Meteor.setInterval(processQueue, COMMAND_INTERVAL);
    }
    if (newMode == "Default" && mode != ModeEnum.DEFAULT) {
      mode = ModeEnum.DEFAULT;
      COMMAND_INTERVAL = 1000;
      Meteor.clearInterval(timerId);
      timerId = Meteor.setInterval(processQueue, COMMAND_INTERVAL);
    }
  }
});


if (Meteor.isServer){

    if(! Aux.findOne('server') ) {
        Meteor.startup(function(){
            timerId = Meteor.setInterval(processQueue, COMMAND_INTERVAL);
        });
    }
}
