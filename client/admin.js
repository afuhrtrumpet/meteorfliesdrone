Template.adminPanel.events({
	'click #takeoff': function() {
		Meteor.call('takeoff', this.name);
	},

	'click #land': function() {
		Meteor.call('land', this.name);
	}
});
