Template.adminPanel.events({
	'click #Takeoff': function() {
		Meteor.call('takeoff', this.name);
	},

	'click #Land': function() {
		Meteor.call('land', this.name);
	},

	'click #Emergency': function() {
		Meteor.call('emergency', this.name);
	},

	'click #Calibrate': function() {
		Meteor.call('calibrate', this.name);
	},

	'click #Up': function() {
		Meteor.call('up', this.name);
	},

	'click #Down': function() {
		Meteor.call('down', this.name);
	}

});

Template.adminPanel.controls = [
{
	id: "Takeoff",
	btntype: "btn-danger"
},
{
	id: "Land",
	btntype: "btn-primary"
},
{
	id: "Emergency",
	btntype: "btn-warning"
},
{
	id: "Up",
	btntype: "btn-primary"
},
{
	id: "Down",
	btntype: "btn-danger"
}
];

Template.adminPanel.modes = [
{
	id: "Default",
	btntype: "btn-primary"
},
{
	id: "Democracy",
	btntype: "btn-primary"
}
];
