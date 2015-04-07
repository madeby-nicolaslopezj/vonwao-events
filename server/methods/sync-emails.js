/**
 * This methods add registered users emails to the emails database
 */
Meteor.methods({
	syncEmails: function () {
		// Get all the users
		var users = Meteor.users.find().map(function(user) {
			// Get all the emails
			var emails = _.pluck(user.emails, 'address');
			emails.map(function(email) {
				// Insert the email into the emails database with its respective userId.
				// If the email was already in the database, the userId will be updated
				orion.entities.emails.collection.upsert({ email: email }, { $set: { userId: user._id } });
			});
		})
	}
});