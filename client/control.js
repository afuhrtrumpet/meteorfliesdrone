Template.queue.rendered = function() {

    console.log("queue rendered");
}

Template.queue.events({
        'click #up_button':function(e) {
//            console.log('up');
            Commands.insert( {button:'up'} );
        }
});
