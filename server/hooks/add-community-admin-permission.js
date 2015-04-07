/**
 * We will set the permission to the community admins
 */ 
orion.entities.communities.collection.after.update(function (userId, doc, fieldNames, modifier, options) {
	// We need to ensure that it is a array
	var admins = doc.admins || [];
	// Now we update the users permissions
	Meteor.users.update({ _id: { $in: admins } }, { $pull: { permissions: 'entity.events.possible-host' } }, { multi: true })
	Meteor.users.update({ _id: { $in: admins } }, { $addToSet: { permissions: { $each: ['entity.groups.community-admin', 'entity.events.community-admin'] } }}, { multi: true })
});

orion.entities.communities.collection.after.insert(function (userId, doc) {
	// We need to ensure that it is a array
	var admins = doc.admins || [];
	// Now we update the users permissions
	Meteor.users.update({ _id: { $in: admins } }, { $pull: { permissions: 'entity.events.possible-host' } }, { multi: true })
	Meteor.users.update({ _id: { $in: admins } }, { $addToSet: { permissions: { $each: ['entity.groups.community-admin', 'entity.events.community-admin'] } }}, { multi: true })
});