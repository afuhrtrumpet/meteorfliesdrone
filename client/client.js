Template.main.democracy = function() {
	var mode = Aux.findOne("Mode");
	console.log(mode);
	if( mode && mode.name ) {
		return mode.name == "Democracy";
	} else {
		return false; // someting weng wrong juse use this
	}
};

var graphData = {
	labels: ["Forward", "Back", "Left", "Right", "Clockwise", "Counterclockwise"],
	datasets: [{
		label: "Votes",
		data: [0, 0, 0, 0, 0, 0]
	}]
};

Deps.autorun(function() {
	var votes = Votes.find().fetch();
	for (var i in votes) {
		graphData.datasets[0].data[graphData.labels.indexOf(votes[i].name)] = votes[i].vote;
	}

	if ($("#barGraph").length > 0) {
		console.log(graphData);
		var ctx = $("#barGraph").get(0).getContext("2d");
		var barChart = new Chart(ctx).Bar(graphData, {});
	}
});

Template.buttons.events({
    'click i':function(e) {
        // this.name is the name as set in the array above
        Meteor.call('pressButton', this.name, Meteor.userId());
  //      Votes.update({
  //        name :this.name
  //      },
 //       {$inc : {vote : 1}},function(err,c){console.log(this.name+"  "+c);});
    }
});

//Placeholder, remove once we have actual data
Template.commandList.commands = function() {

		return Commands.find({}, {sort: {time: -1}}).fetch().concat(OldCommands.find({}, {sort: {time: -1}}).fetch());
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
    Meteor.call('changeMode', 'Default');
  }
});

Template.main.userLoggedIn = function () {
		return 1 || Meteor.userId();
};
