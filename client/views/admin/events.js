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
	}
});