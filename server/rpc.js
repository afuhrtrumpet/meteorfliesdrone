// file scope
var pubnub = Meteor.require("pubnub").init({
    publish_key   : "pub-c-015aeef8-c80f-44cc-8021-68b5296297fb",
    subscribe_key : "sub-c-261b8d52-1543-11e4-8bd3-02ee2ddab7fe"
});



Meteor.startup(function () {
    Meteor.methods({

        pressButton : function(name) {

            Votes.update({name:name},{$inc:{vote:1}});
            var o = {
                time: new Date().getTime(),
                command: name,
								userId: Meteor.userId()
            };

						/*while (OldCommands.count() > 0 && OldCommands.find().count() + Commands.find().count() > MAX_COMMANDS) {
							var commandToRemove = OldCommands.findOne({}, {sort: {time: 1}});
							console.log("Removing old: " + commandToRemove);
							OldCommands.remove(commandToRemove);
						}*/
//            Commands.insert(o);

            pubnub.publish({
                channel   : 'drone',
                message   : o,
                callback  : function(e) { console.log( "SUCCESS!", e ); },
                error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
            });

        },

        erase : function()
        {
            Commands.find().fetch().each(function(doomed){
                Commands.remove(doomed._id);
            });

						OldCommands.find().fetch().each(function(doomed) {
							OldCommands.remove(doomed._id);
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
