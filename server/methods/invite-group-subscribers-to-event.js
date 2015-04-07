Meteor.methods({
	inviteGroupSubscribersToEvent: function (options) {
		check(options, {
			eventId: String
		});

		if (!this.userId) {
			throw new Meteor.Error('no-permissions', 'You must be logged in to send reminders');
		}

		// To check if the user has permissions to send add the subscribers
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

		// the user has permissions, now we get the subscribers
		var subscribers = orion.entities.groups.collection.findOne(event.group).subscribers || [];
		// remove the subscribed that has responded
		subscribers = _.difference(subscribers, event.rsvpYes, event.rsvpNo);
		// then we get the emails ids
		var emailsIds = _.pluck(orion.entities.emails.collection.find({ userId: { $in: subscribers } }).fetch(), '_id');
		// now we add the emails ids to the event
		orion.entities.events.collection.update(event._id, { $addToSet: { invitations: { $each: emailsIds } } });
	}
});