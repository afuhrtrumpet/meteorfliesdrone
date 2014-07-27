Template.buttons.events({
    'click i':function(e) {

        // this.name is the name as set in the array above
        Meteor.call('pressButton', this.name, Meteor.userId());
    }
});

//Placeholder, remove once we have actual data
Template.commandList.commands = function() {

		return OldCommands.find({}, {sort: {time: 1}}).fetch().concat(Commands.find({}, {sort: {time: 1}, limit: 20}).fetch());
/*
    // how far back the command log goes
    var commandHistoryTime = 8000;

    var aux = Aux.findOne('tickNow');

    if( aux && aux.time )
    {
        var filterAfter = Aux.findOne('tickNow').time - commandHistoryTime;

        // select commands that are newer than a timestamp, and sort so most recent are on the bottom
        var commands = Commands.find({time:{$gt:filterAfter}}, {sort: {time: 1}}).fetch();

        var results = [];

        commands.each(function(c){
            results.push(JSON.stringify(c));
        });

        return results;
    }
    else
    {
        return [];
    }*/
};

Template.commandList.tickNow = function() {
    var o = Aux.findOne('tickNow');

    if( o && o.time )
        return o.time;

    return 0;
}

Template.commandList.username = function(userId) {
	return Meteor.user().username;
};

Template.commandList.currentCommand = function() {
	var selected = Aux.findOne('currentCommand').current;
	return this._id == selected	? "currentCommand" : "";
};
Template.buttons.events({
    'click i':function(e) {

        // this.name is the name as set in the array above
        Meteor.call('pressButton', this.name);
    }
});

Template.adminPanel.events({
	'click #takeoff': function() {
		Meteor.call('takeoff', this.name);
	},

	'click #land': function() {
		Meteor.call('land', this.name);
	},
  'click #modeDemocracy' : function() {
    Meteor.call('changeMode', 'Democracy');
  },
  'click #modeDefault' : function() {
    Meteor.call('changeMode:', 'Default');
  }
});

Template.main.userLoggedIn = function () {
		return 1 || Meteor.userId();
};
