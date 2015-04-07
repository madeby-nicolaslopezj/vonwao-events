Template.eventAdminActions.onRendered(function() {
	this.$('[title]').tooltip();
})

Template.eventAdminActions.events({
	'click .send-reminder-btn': function () {
		Meteor.call('sendReminder', { eventId: this._id }, function(error, response) {
			if (error) {
				console.log(error);
				alert(error.reason);
			} else {
				alert('Reminder sent');
			}
		});
	},
	'click .invite-group-subscribers-btn': function() {
		Meteor.call('inviteGroupSubscribersToEvent', { eventId: this._id }, function(error, response) {
			if (error) {
				console.log(error);
				alert(error.reason);
			}
		});
	}
});