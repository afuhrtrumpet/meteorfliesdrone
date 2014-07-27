Meteor.startup(function () {
    Meteor.methods({

        pressButton : function(name, userId) {

            var o = {
                time: new Date().getTime(),
                command: name,
								userId: userId
            };

            Commands.insert(o);
						while (OldCommands.count() > 0 && OldCommands.find().count() + Commands.find().count() > MAX_COMMANDS) {
							var commandToRemove = OldCommands.findOne({}, {sort: {time: 1}});
							console.log("Removing old: " + commandToRemove);
							OldCommands.remove(commandToRemove);
						}
        },

        erase : function()
        {
            Commands.find().fetch().each(function(doomed){
                Commands.remove(doomed._id);
            });

						OldCommands.find().fetch().each(function(doomed) {
							OldCommands.remove(doomed._id);
						});

        }

    });

		Meteor.call('erase');
});
