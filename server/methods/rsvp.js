Meteor.methods({
	rsvp: function (options) {
		check(options, {
			eventId: String,
			rsvp: Boolean
		});

		// Get the event we are inviting to
		var event = orion.entities.events.collection.findOne(options.eventId);
		if (!event) {
			throw new Meteor.Error('not-found', 'Event not found');
		}

		// We need to check if the user is invited or has responded
		var found = false;
		var emailsId = [];
		// Get the registered emails that belongs to the current user
		orion.entities.emails.collection.find({ userId: this.userId }).forEach(function (item) {
			// If the id of the email is on the invitations object of the event we are ok
			if (_.contains(event.invitations, item._id)) {
				found = true;
			}
			emailsId.push(item._id);
		});
		// Check if the user has responded
		if (_.contains(event.rsvpYes, this.userId) || _.contains(event.rsvpNo, this.userId)) {
			found = true;
		}
		if (!found) {
			throw new Meteor.Error('not-invited', 'The user is not invited to this event.');
		}

		// Remove the previews rsvp of the user in this event
		orion.entities.events.collection.update(event._id, { $pull: { rsvpYes: this.userId, rsvpNo: this.userId } });

		// We are ok, respond the invitation
		if (options.rsvp) {
			orion.entities.events.collection.update(event._id, { $addToSet: { rsvpYes: this.userId } });
		} else {
			orion.entities.events.collection.update(event._id, { $addToSet: { rsvpNo: this.userId } });
		}
		// Now we have to delete the invitation
		emailsId.map(function(id) {
			orion.entities.events.collection.update(event._id, { $pull: { invitations: id } });
		})
	}
});