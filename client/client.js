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
Template.commandList.commands = [
	"Back 5 seconds 0.5 speed",
	"Front 2 seconds .75 speed",
	"Left 3 seconds .1 speed"
];

Template.buttons.events({
    'click i':function(e) {

        // this.name is the name as set in the array above
        Meteor.call('pressButton', this.name);
    }
});
