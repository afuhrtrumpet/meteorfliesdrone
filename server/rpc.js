Meteor.startup(function () {
    Meteor.methods({

        pressButton : function(name) {

            var o = {
                time: new Date().getTime(),
                command: name
            };

            Commands.insert(o);
        }

    });
});