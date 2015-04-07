/**
 * This method returns the event url with slug
 */
Meteor.methods({
	getEventUrl: function (eventId) {
		check(eventId, String);
		return orion.entities.events.collection.findOne(eventId).getUrl();
	}
});