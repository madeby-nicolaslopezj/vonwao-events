Meteor.methods({
	sendReminder: function (options) {
		check(options, {
			eventId: String
		});

		if (!this.userId) {
			throw new Meteor.Error('no-permissions', 'You must be logged in to send reminders');
		}

		// to check if the user has permissions to send reminder email
		var communitiesIds = _.pluck(orion.entities.communities.collection.find({ admins: this.userId }).fetch(), '_id') || [];
        var groupsIds = _.pluck(orion.entities.groups.collection.find({ community: { $in: communitiesIds } }).fetch(), '_id') || [];
		var event = orion.entities.events.collection.findOne({ _id: options.eventId, $or: [ { group: { $in: groupsIds } }, { host: this.userId } ] });
		if (!event) {
			throw new Meteor.Error('not-found', 'Event not found');
		}
		if (!event.reminderTemplate) {
			throw new Meteor.Error('no-template', 'Event has no reminder template');
		}

		event.rsvpYes = event.rsvpYes || [];
		var emails = Meteor.users.find({ _id: { $in: event.rsvpYes } }).map(function(user) {
			return user.emails[0].address;
		});

		var reminderTemplate = orion.entities.emailTemplates.collection.findOne(event.reminderTemplate);

		event.url = event.getUrl();
		var html = reminderTemplate.getHtml(event);

		this.unblock();

		emails.map(function(email) {
			Email.send({
				from: orion.config.get('MAIL_FROM'),
				to: email,
				subject: 'Reminder of ' + event.name,
				html: html
			})
		});
	}
});