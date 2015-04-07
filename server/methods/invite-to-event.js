Meteor.methods({
	inviteToEvent: function (options) {
		// We need the eventId and the email of the invited person
		check(options, {
			eventId: String,
			email: String
		});

		// Get the event we are inviting to
		var event = orion.entities.events.collection.findOne(options.eventId);
		if (!event) {
			throw new Meteor.Error('not-found', 'Event not found');
		}

		// Find the id of the email in the registered emails
		var email = orion.entities.emails.collection.findOne({ email: options.email });
		var emailId = email && email._id;

		// Check if the users has responded
		if (email && email.userId) {
			if (_.contains(event.rsvpYes, email.userId) || _.contains(event.rsvpNo, email.userId)) {
				throw new Meteor.Error('user-has-responded', 'This person has responded to a invitation of this event.');
			}
		}

		// Check if the user is invited
		if (emailId) {
			if (_.contains(event.invitations, emailId)) {
				throw new Meteor.Error('user-has-invitation', 'This person has a pending invitation.');
			}
		}

		// Register the email if its not registered
		if (!emailId) {
			emailId = orion.entities.emails.collection.insert({ email: options.email });
		}

		// If the event is invite-only no invitations are permited
		if (event.privacy == 'invite-only') {
			throw new Meteor.Error('permissions-invite-only', 'Only admin can invite people to this events, if you are a admin add people in the admin panel.');
		}

		// If the event is open-invite only invited users can invite, so we will check if it is invited
		if (event.privacy == 'open-invite') {
			var found = false;
			// Get the registered emails that belongs to the current user
			orion.entities.emails.collection.find({ userId: this.userId }).forEach(function (item) {
				// If the id of the email is on the invitations object of the event we are ok
				if (_.contains(event.invitations, item._id)) {
					found = true;
				}
			});
			// Check if the user has responded
			if (_.contains(event.rsvpYes, this.userId) || _.contains(event.rsvpNo, this.userId)) {
				found = true;
			}
			if (!found) {
				throw new Meteor.Error('permissions-open-invite', 'Only invited people can invite to this event.');
			}
		}

		// No problems, so we can add the user to the event
		orion.entities.events.collection.update(event._id, { $addToSet: { invitations: emailId } });
	}
});