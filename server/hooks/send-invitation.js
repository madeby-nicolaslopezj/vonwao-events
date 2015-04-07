/**
 * Send a invitation by email each time a new invitation is added to the array
 * using the update method
 */
orion.entities.events.collection.after.update(function (userId, doc, fieldNames, modifier, options) {
	// No invitation template, no email
	if (!doc.invitationTemplate) return;
	
	// Get the difference of the previews invitations array and the current invitations array
	var newIds = _.difference(doc.invitations, this.previous.invitations);
	// If there are no new invitations we dont need to go on.
	if (!newIds) return;

	// We will get the event becouse using the provided "doc" we can't have the collection helpers we defined
	var doc = orion.entities.events.collection.findOne(doc._id);
	// Get the email address of the invited people
	var emails = _.pluck(orion.entities.emails.collection.find({ _id: { $in: newIds } }).fetch(), 'email');
	// Get the template
	var invitationTemplate = orion.entities.emailTemplates.collection.findOne(doc.invitationTemplate);

	// We will add the url to the event object to use it in the email
	doc.url = doc.getUrl();
	// Converts the template to html using the specified entity.
	// Notice: this is not blaze, this just uses a string.replace, so we have some rules
	// 1 - No spaces between braces. Like this: {{name}}
	// 2 - No functions, helpers, the parser will only recognize the attributes of the current event
	var html = invitationTemplate.getHtml(doc);

	emails.map(function(email) {
		// Send the email one by one
		// We do it this way to prevent that recipents see everyone email address
		Email.send({
			from: orion.config.get('MAIL_FROM'),
			to: email,
			subject: 'You are invited to ' + doc.name,
			html: html
		})
	});
});

/**
 * Send a invitation by email to all invited emails when the event is created
 */
orion.entities.events.collection.after.insert(function (userId, doc) {
	// No invitation template, no email
	if (!doc.invitationTemplate) return;
	
	// The id of the emails that we are going to send the emails
	var newIds = doc.invitations;
	// Maybe the event was created without inviting people
	if (!newIds) return;

	// We will get the event becouse using the provided "doc" we can't have the collection helpers we defined
	var doc = orion.entities.events.collection.findOne(doc._id);
	// Get the email address of the invited people
	var emails = _.pluck(orion.entities.emails.collection.find({ _id: { $in: newIds } }).fetch(), 'email');
	// Get the template
	var invitationTemplate = orion.entities.emailTemplates.collection.findOne(doc.invitationTemplate);

	// We will add the url to the event object to use it in the email
	doc.url = doc.getUrl();
	// Converts the template to html using the specified entity.
	// Notice: this is not blaze, this just uses a string.replace, so we have some rules
	// 1 - No spaces between braces. Like this: {{name}}
	// 2 - No functions, helpers, the parser will only recognize the attributes of the current event
	var html = invitationTemplate.getHtml(doc);

	emails.map(function(email) {
		// Send the email one by one
		// We do it this way to prevent that recipents see everyone email address
		Email.send({
			from: orion.config.get('MAIL_FROM'),
			to: email,
			subject: 'You are invited to ' + doc.name,
			html: html
		})
	});
});