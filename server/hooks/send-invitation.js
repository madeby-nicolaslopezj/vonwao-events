orion.entities.events.collection.after.update(function (userId, doc, fieldNames, modifier, options) {
	if (!doc.invitationTemplate) return;
	
	var newIds = _.difference(doc.invitations, this.previous.invitations);
	if (!newIds) return;

	var doc = orion.entities.events.collection.findOne(doc._id);
	var emails = _.pluck(orion.entities.emails.collection.find({ _id: { $in: newIds } }).fetch(), 'email');
	var invitationTemplate = orion.entities.emailTemplates.collection.findOne(doc.invitationTemplate);

	doc.url = doc.getUrl();
	var html = invitationTemplate.getHtml(doc);

	emails.map(function(email) {
		Email.send({
			from: orion.config.get('MAIL_FROM'),
			to: email,
			subject: 'You are invited to ' + doc.name,
			html: html
		})
	});
});

orion.entities.events.collection.after.insert(function (userId, doc) {
	if (!doc.invitationTemplate) return;
	
	var newIds = doc.invitations;
	if (!newIds) return;

	var doc = orion.entities.events.collection.findOne(doc._id);
	var emails = _.pluck(orion.entities.emails.collection.find({ _id: { $in: newIds } }).fetch(), 'email');
	var invitationTemplate = orion.entities.emailTemplates.collection.findOne(doc.invitationTemplate);

	doc.url = doc.getUrl();
	var html = invitationTemplate.getHtml(doc);

	emails.map(function(email) {
		Email.send({
			from: orion.config.get('MAIL_FROM'),
			to: email,
			subject: 'You are invited to ' + doc.name,
			html: html
		})
	});
});