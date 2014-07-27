Template.main.userLoggedIn = function () {
		return 1 || Meteor.userId();
};

Template.main.isAdmin = function () {
	var user = Meteor.user();
	return ( user && user.username === 'admin' );
};

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});
