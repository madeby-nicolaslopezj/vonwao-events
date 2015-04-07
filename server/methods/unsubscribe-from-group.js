Meteor.methods({
	unsubscribeFromGroup: function (options) {
		check(options, {
			groupId: String
		});

		if (!this.userId) {
			throw new Meteor.Error('logged-out', 'You must be logged in to unsubscribe');
		}

		// Get the group
		var group = orion.entities.groups.collection.findOne(options.groupId);
		if (!group) {
			throw new Meteor.Error('not-found', 'Group not found');
		}

		// Check if the user is subscribed
		if (!group.userIsSubscribed(this.userId)) {
			throw new Meteor.Error('not-subscribed', 'You are not subscribed to this group');
		}

		// Everything is ok, lets unsubscribe
		orion.entities.groups.collection.update(group._id, { $pull: { subscribers: this.userId } });
	}
});