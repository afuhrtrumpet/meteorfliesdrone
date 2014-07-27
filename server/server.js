// file scope
var processQueue = function() {

    var newCommands = Commands.find().fetch();

    // track ids we are about to delete
    var remove = [];

    // process every command in the collection
    newCommands.each(function(c){
        console.log(c);

        remove.push(c._id);
    });


    remove.each(function(r){
        Commands.remove(r);
    });

};


// file scope
var timerId;

// -- constants --

// how often to issue a new command in ms
COMMAND_INTERVAL = 1000;

if (Meteor.isServer){

    Meteor.startup(function(){
        timerId = Meteor.setInterval(processQueue, COMMAND_INTERVAL);
    });
}