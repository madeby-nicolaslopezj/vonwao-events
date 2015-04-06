/**
 * This methods add registered users emails to the emails database
 */

Meteor.methods({
	syncEmails: function () {
		var users = Meteor.users.find().map(function(user) {
			var emails = _.pluck(user.emails, 'address');
			emails.map(function(email) {
				orion.entities.emails.collection.upsert({ email: email }, { $set: { userId: user._id } });
			});
		})
	}
});