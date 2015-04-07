AutoForm.hooks({
	sendEmailToInviteesForm: {
		onSubmit: function (insertDoc, updateDoc, currentDoc) {
			var self = this;
			var options = insertDoc;
			options.eventId = Router.current().params._id;
			Meteor.call('sendEmailToInvitees', options, function(error, response) {
				if (error) {
					self.done(new Error(error.reason));
				} else {
					self.done();
					alert('Email sent');
				}
			})
			return false;
		}
	}
});