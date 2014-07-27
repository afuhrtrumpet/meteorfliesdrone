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


    // track ids we are about to delete
//    var remove = [];

    // process every command in the collection
    //newCommands.each(function(c){
     //   console.log(c);

//        remove.push(c._id);
    //);


//    remove.each(function(r){
//        Commands.remove(r);
//    });

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
       Votes.remove({});
      Votes.insert({
        name : "Forward",
        vote: 0});
      Votes.insert({
        name: "Back",
        vote: 0});
      Votes.insert({
        name: "Left",
        vote: 0});
      Votes.insert({
        name :"Right",
        vote: 0});
      Votes.insert({
        name : "Clockwise",
        vote: 0});
      Votes.insert({
        name : "Counterclockwise",
        vote: 0});
  console.log(newCommands.length);
  if(newCommands.length < 1) {
    Meteor.call('stop');
  }
  else {
   var commands = {}
   var remove = [];
   newCommands.each(function(c){
     remove.push(c._id);
     if (!(c.command in commands)) {
       commands[c.command] = 1;
     }
     else {commands[c.command] = commands[c.command] + 1;
     }
   });

  var sort_array = [];
  for (var key in commands) {
    sort_array.push({key:key, value:commands[key]});
  }
  sort_array.sort(function(y,x){ return x.value - y.value});
  item = sort_array[0].key;
  console.log("sortaray: "+JSON.stringify(sort_array));
  console.log("democracy chose : " + item);
  Meteor.call("processCommand", item);
  // Remove new commands
  remove.each(function(r){
    Commands.remove(r);
  });
  }
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
       Votes.remove({});
      Votes.insert({
        name : "Forward",
        vote: 0});
      Votes.insert({
        name: "Back",
        vote: 0});
      Votes.insert({
        name: "Left",
        vote: 0});
      Votes.insert({
        name :"Right",
        vote: 0});
      Votes.insert({
        name : "Clockwise",
        vote: 0});
      Votes.insert({
        name : "Counterclockwise",
        vote: 0});
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
  },
  getMode : function() {
    return mode;
  }
});


if (Meteor.isServer){
    Meteor.startup(function(){
        timerId = Meteor.setInterval(processQueue, COMMAND_INTERVAL);
    });
}



//var Pusher = Meteor.require('pusher');

// file scope
var pubnub = Meteor.require("pubnub").init({
    publish_key   : "pub-c-015aeef8-c80f-44cc-8021-68b5296297fb",
    subscribe_key : "sub-c-261b8d52-1543-11e4-8bd3-02ee2ddab7fe"
});

var Fiber = Meteor.require('fibers');


Meteor.startup(function() {

    if( Aux.findOne('server') )
    {


    } else {
        // starting in client mode (Aka the thing that runs

        pubnub.subscribe({
            channel  : 'drone',
            callback : function(message) {


                new Fiber(function() {
                    Commands.insert(message);
                }).run();




//                console.log( " > ", message );
            }
        });

    }

});
