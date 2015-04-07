Meteor.methods({
	joinPublicEvent: function (options) {
		check(options, {
			eventId: String
		});

		// Get the event we are inviting to
		var event = orion.entities.events.collection.findOne(options.eventId);
		if (!event) {
			throw new Meteor.Error('not-found', 'Event not found');
		}

		// Check if the user has responded
		if (_.contains(event.rsvpYes, this.userId)) {
			throw new Meteor.Error('user-responded', 'The user already going to this event.');
		}

		// Remove the previews rsvp of the user in this event
		orion.entities.events.collection.update(event._id, { $pull: { rsvpYes: this.userId, rsvpNo: this.userId } });

		// We are ok, respond the invitation
		orion.entities.events.collection.update(event._id, { $addToSet: { rsvpYes: this.userId } });

		// Now we have to delete the invitation
		orion.entities.emails.collection.find({ userId: this.userId }).forEach(function (item) {
			orion.entities.events.collection.update(event._id, { $pull: { invitations: item._id } });
		});
	}
});