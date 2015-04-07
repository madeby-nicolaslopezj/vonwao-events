Meteor.methods({
	subscribeToGroup: function (options) {
		check(options, {
			groupId: String
		});

		if (!this.userId) {
			throw new Meteor.Error('logged-out', 'You must be logged in to subscribe');
		}

		// Get the group
		var group = orion.entities.groups.collection.findOne(options.groupId);
		if (!group) {
			throw new Meteor.Error('not-found', 'Group not found');
		}

		// Check if the group is public
		if (!group.isPublic()) {
			throw new Meteor.Error('no-permissions', 'This group is not public');
		}

		// Everything is ok, lets subscribe
		orion.entities.groups.collection.update(group._id, { $addToSet: { subscribers: this.userId } });
	}
});