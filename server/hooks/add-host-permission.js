/**
 * We will set the permission to the community admins
 */ 
orion.entities.events.collection.after.update(function (userId, doc, fieldNames, modifier, options) {
	if (!doc.host) return;

	// Now we update the users permissions
	// We need to check if the user is not a community admin.
	// That permission is greater and may cause problems if it has both
	Meteor.users.update({ _id: doc.host, permissions: { $ne: 'entity.events.community-admin' } }, { $addToSet: { permissions: 'entity.events.possible-host' }})
});

orion.entities.events.collection.after.insert(function (userId, doc) {
	if (!doc.host) return;

	// Now we update the users permissions
	// We need to check if the user is not a community admin.
	// That permission is greater and may cause problems if it has both
	Meteor.users.update({ _id: doc.host, permissions: { $ne: 'entity.events.community-admin' } }, { $addToSet: { permissions: 'entity.events.possible-host' }})
});