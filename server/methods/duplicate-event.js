Meteor.methods({
	duplicateEvent: function (options) {
		check(options, {
			eventId: String
		});

		if (!this.userId) {
			throw new Meteor.Error('no-permissions', 'You must be logged in to send reminders');
		}

		// To check if the user has permissions to duplicate the event
		// We will get the communities that the user is admin, then
		// the group that belongs to that community and get the events that
		// belong to some of those groups
		// We will also check if the user is host
		// No event will be returned if the user isn't admin or host
		var communitiesIds = _.pluck(orion.entities.communities.collection.find({ admins: this.userId }).fetch(), '_id') || [];
        var groupsIds = _.pluck(orion.entities.groups.collection.find({ community: { $in: communitiesIds } }).fetch(), '_id') || [];
		var event = orion.entities.events.collection.findOne({ _id: options.eventId, $or: [ { group: { $in: groupsIds } }, { host: this.userId } ] });
		if (!event) {
			throw new Meteor.Error('no-permissions', 'You have no permissions to perform this action');
		}

		// Now we can duplicate the event
		var newEvent = event;
		// We need to make the slug unique, then we can change it
		newEvent.slug = new Mongo.ObjectID()._str
		// Remove the people that responded no
		newEvent.rsvpNo = [];
		// Move the people that responded yes to the invited
		// Check if the invitations and rsvp are arrays
		newEvent.invitations = newEvent.invitations || [];
		newEvent.rsvpYes = newEvent.rsvpYes || [];
		// Get the emails id of the users
		orion.entities.emails.collection.find({ userId: { $in: newEvent.rsvpYes } }).forEach(function (item) {
			newEvent.invitations.push(item._id);
		});
		// Now remove the rsvpYes users
		newEvent.rsvpYes = [];
		// Remove the updated at and created at and _id
		delete newEvent._id;
		delete newEvent.updatedAt;
		delete newEvent.createdAt;

		return orion.entities.events.collection.insert(newEvent);
	}
});