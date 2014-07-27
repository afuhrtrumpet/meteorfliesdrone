Template.main.userLoggedIn = function () {
		return Meteor.userId();
};

Template.main.isAdmin = function () {
	var user = Meteor.user();
	return ( user && user.username === 'admin' );
};

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Template.main.instanceIsServer = function () {
    if(Aux.findOne('server')){
        return true;
    } else {
        return false;
    }
};
