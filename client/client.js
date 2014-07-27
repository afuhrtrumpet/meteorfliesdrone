var currentTime;

Template.main.democracy = function() {
	var mode = Aux.findOne("Mode");
	console.log(mode);
	if( mode && mode.name ) {
		return mode.name == "Democracy";
	} else {
		return false; // someting weng wrong juse use this
	}
};

Template.modeHeading.mode = function() {
	var mode = Aux.findOne("Mode");
	if (mode) {
		return mode.name;
	} else {
		return "Default";
	}
};

Template.modeHeading.timeLeft = function() {
	var mode = Aux.findOne("Mode");
	if (mode && mode.name == "Democracy") {
		var startTime = Aux.findOne("democracyStart");
		var currentTime = Aux.findOne("currentTime");
		if (startTime && currentTime) {
			var endTime = 5000 + startTime.time;
			if (endTime > currentTime.time)
				return endTime - currentTime.time;
		}
	}
	return false;
};

var graphData = {
	labels: ["Forward", "Back", "Left", "Right", "Clockwise", "Counterclockwise"],
	datasets: [{
		label: "Votes",
		data: [0, 0, 0, 0, 0, 0]
	}]
};

var barChart;

Deps.autorun(function() {
	currentTime = Date.now();
	var mode = Aux.findOne("Mode");
	$('#barGraph').attr('hidden', !mode || mode.name != "Democracy");
	var votes = Votes.find().fetch();
	if (barChart) {
		//if ($("barGraph").length == 0) barChart = undefined;
		//else {
			for (var i in votes) {
				barChart.datasets[0].bars[graphData.labels.indexOf(votes[i].name)].value = votes[i].vote;
			}
			barChart.update();
		//}
	}
	else if ($("#barGraph").length > 0 && !barChart) {
		console.log(graphData);
		var ctx = $("#barGraph").get(0).getContext("2d");
		barChart = new Chart(ctx).Bar(graphData, {});
	}
});

Template.buttons.events({

	'mousedown i': function(e) {
//		console.log($(e.target));
		$(e.target).addClass("clicked");
	},

	'mouseup i': function(e) {
		$(e.target).removeClass("clicked");
        Meteor.call('pressButton', this.name, Meteor.userId());
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
	if( Meteor.user() )
    {
        return Meteor.user().username;
    }
    return "";
};

Template.commandList.currentCommand = function() {
	var selected = Aux.findOne('currentCommand').current;
	return this._id == selected	? "currentCommand" : "";
};

Template.commandList.commandIcon = function() {
	switch (this.command) {
		case "Counterclockwise":
			return "fa-rotate-left";
			break;
		case "Forward":
			return "fa-chevron-circle-up";
			break;
		case "Clockwise":
			return "fa-rotate-right";
			break;
		case "Left":
			return "fa-chevron-circle-left";
			break;
		case "Back":
			return "fa-chevron-circle-down";
			break;
		case "Right":
			return "fa-chevron-circle-right";
			break;
	}
}

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
