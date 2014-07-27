Template.buttons.options = [
{
	name: "Counterclockwise",
	icon: "fa-rotate-left"
},
{
	name: "Forward",
	icon: "fa-chevron-circle-up"
},
{
	name: "Clockwise",
	icon: "fa-rotate-right"
},
{
	name: "Left",
	icon: "fa-chevron-circle-left"
},
{
	name: "Back",
	icon: "fa-chevron-circle-down"
},
{
	name: "Right",
	icon: "fa-chevron-circle-right"
}
];

//Placeholder, remove once we have actual data
Template.commandList.commands = function() {

    // how far back the command log goes
    var commandHistoryTime = 8000;

    var filterAfter = Aux.findOne('tickNow').time - commandHistoryTime;

    // select commands that are newer than a timestamp, and sort so most recent are on the bottom
    var commands = Commands.find({time:{$gt:filterAfter}}, {sort: {time: 1}}).fetch();

    var results = [];

    commands.each(function(c){
        results.push(JSON.stringify(c));
    });

    return results;
};

Template.commandList.tickNow = function() {
    return Aux.findOne('tickNow').time;
}

Template.buttons.events({
    'click i':function(e) {

        // this.name is the name as set in the array above
        Meteor.call('pressButton', this.name);
    }
});
