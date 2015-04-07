Meteor.users.after.insert(function() {
	Meteor.call('syncEmails');
})

Meteor.users.after.update(function() {
	Meteor.call('syncEmails');
})