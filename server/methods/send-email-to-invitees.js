Meteor.methods({
	sendEmailToInvitees: function (options) {
		console.log(options);

		check(options, {
			eventId: String,
			subject: String,
			content: String,
			sendToInvited: Boolean,
			sendToRsvpYes: Boolean
		});

		if (!options.sendToInvited && !options.sendToRsvpYes) {
			throw new Meteor.Error('no-recievers', 'You have to select at least a group of recievers.');
		}

		if (!this.userId) {
			throw new Meteor.Error('no-permissions', 'You must be logged in to send emails.');
		}

		// To check if the user has permissions to send emails
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

		var emails = [];

		// If we want to send to rsvpYes we search the users and add their emails to the array
		if (options.sendToRsvpYes) {
			Meteor.users.find({ _id: { $in: event.rsvpYes } }).forEach(function (user) {
				emails.push(user.emails[0].address);
			});
		}

		// If you want to send it to invited people we search the invited emails and add them to the array
		if (options.sendToInvited) {
			orion.entities.emails.collection.find({ _id: { $in: event.invitations } }).forEach(function (item) {
				emails.push(item.email);
			});
		}

		this.unblock();

		emails.map(function(email) {
			// Send the email one by one
			// We do it this way to prevent that recipents see everyone email address
			Email.send({
				from: orion.config.get('MAIL_FROM'),
				to: email,
				subject: options.subject,
				html: options.content
			})
		});

	}
});