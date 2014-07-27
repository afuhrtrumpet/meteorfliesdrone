Meteor.startup(function () {
    Meteor.methods({

        pressButton : function(name) {

            var o = {
                time: new Date().getTime(),
                command: name
            };

            Commands.insert(o);
        },

        erase : function()
        {
            Commands.find().fetch().each(function(doomed){
                Commands.remove(doomed._id);
            });

        }

    });
});
