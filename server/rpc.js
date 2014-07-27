// file scope
var pubnub = Meteor.require("pubnub").init({
    publish_key   : "pub-c-015aeef8-c80f-44cc-8021-68b5296297fb",
    subscribe_key : "sub-c-261b8d52-1543-11e4-8bd3-02ee2ddab7fe"
});



Meteor.startup(function () {
    Meteor.methods({

        pressButton : function(name, userId) {

            Votes.update({name:name},{$inc:{vote:1}});
            var o = {
                time: new Date().getTime(),
                command: name,
                userId: userId
            };

            console.log(name);

            if( Aux.findOne('Mode') && Aux.findOne('Mode').name === "Default") {
                Commands.insert(o);
            } else {
                DemocracyCommands.insert(o);
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

            DemocracyCommands.find().fetch().each(function(doomed) {
              DemocracyCommands.remove(doomed._id);
            });
        },

        setServer : function(val)
        {
            if( val ) {
                Aux.insert({server:true, _id:'server'});
            } else {
                Aux.remove('server');
            }
        }

    });

		Meteor.call('erase');
});
