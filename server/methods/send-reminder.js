Meteor.methods({
	sendReminder: function (options) {
		check(options, {
			eventId: String
		});

		if (!this.userId) {
			throw new Meteor.Error('no-permissions', 'You must be logged in to send reminders');
		}

		// To check if the user has permissions to send reminder email
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

		// No emails without template
		if (!event.reminderTemplate) {
			throw new Meteor.Error('no-template', 'Event has no reminder template');
		}

		// We need to check if rsvpYes is an array
		event.rsvpYes = event.rsvpYes || [];

		// Get the first emails of all the users in the rsvpYes list
		var emails = Meteor.users.find({ _id: { $in: event.rsvpYes } }).map(function(user) {
			return user.emails[0].address;
		});

		// Fetch the reminder template
		var reminderTemplate = orion.entities.emailTemplates.collection.findOne(event.reminderTemplate);

		// We will add the url to the event object to use it in the email
		event.url = event.getStaticUrl();
		// Converts the template to html using the specified entity.
		// Notice: this is not blaze, this just uses a string.replace, so we have some rules
		// 1 - No spaces between braces. Like this: {{name}}
		// 2 - No functions, helpers, the parser will only recognize the attributes of the current event
		var html = reminderTemplate.getHtml(event);

		// We don't want to make the user wait till we send all the emails
		this.unblock();

		emails.map(function(email) {
			// Send the email one by one
			// We do it this way to prevent that recipents see everyone email address
			Email.send({
				from: orion.config.get('MAIL_FROM'),
				to: email,
				subject: 'Reminder of ' + event.name,
				html: html
			})
		});
	}
});