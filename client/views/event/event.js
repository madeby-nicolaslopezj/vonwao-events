Template.event.onRendered(function() {
	var self = this;
	self.autorun(function () {
		var communitySlug = Router.current().params.communitySlug;
		var groupSlug = Router.current().params.groupSlug;
		var slug = Router.current().params.slug;
		self.subscribe('entity', 'communities', { slug: communitySlug })
		self.subscribe('entity', 'groups', { slug: groupSlug })
		self.subscribe('entity', 'events', { slug: slug })
	});
})

Template.event.helpers({
	community: function () {
		var communitySlug = Router.current().params.communitySlug;
		return orion.entities.communities.collection.findOne({ slug: communitySlug });
	},
	group: function () {
		var groupSlug = Router.current().params.groupSlug;
		return orion.entities.groups.collection.findOne({ slug: groupSlug });
	},
	event: function() {
		var slug = Router.current().params.slug;
		return orion.entities.events.collection.findOne({ slug: slug });
	},
	getCountOf: function(kw) {
		var options = (kw && kw.hash) || {};
		var count = (options.array && options.array.length) || 0;
		var text = count == 1 ? options.singular : options.plural;
		return count + ' ' + text;
	},
	getLoginQuery: function() {
		return { redirect: Router.current().url };
	},
	userIsInvitedOrRsvp: function() {
		var slug = Router.current().params.slug;
		var event = orion.entities.events.collection.findOne({ slug: slug });
		return event && event.userIsInvitedOrRsvp(Meteor.userId());
	},
	userIsInvited: function() {
		var slug = Router.current().params.slug;
		var event = orion.entities.events.collection.findOne({ slug: slug });
		return event && event.userIsInvited(Meteor.userId());
	},
	userRsvpYes: function() {
		var slug = Router.current().params.slug;
		var event = orion.entities.events.collection.findOne({ slug: slug });
		return event && event.userRsvpYes(Meteor.userId());
	},
	userRsvpNo: function() {
		var slug = Router.current().params.slug;
		var event = orion.entities.events.collection.findOne({ slug: slug });
		return event && event.userRsvpNo(Meteor.userId());
	}
});

Template.event.events({
	'click .join-event-btn': function () {
		var slug = Router.current().params.slug;
		var event = orion.entities.events.collection.findOne({ slug: slug });
		Meteor.call('joinPublicEvent', { eventId: event._id }, function(error, response) {
			if (error) {
				console.log(error);
				alert(error.reason);
			}
		})
	},
	'click .rsvp-yes-btn': function() {
		var slug = Router.current().params.slug;
		var event = orion.entities.events.collection.findOne({ slug: slug });
		Meteor.call('rsvp', { eventId: event._id, rsvp: true }, function(error, response) {
			if (error) {
				console.log(error);
				alert(error.reason);
			}
		})
	},
	'click .rsvp-no-btn': function() {
		var slug = Router.current().params.slug;
		var event = orion.entities.events.collection.findOne({ slug: slug });
		Meteor.call('rsvp', { eventId: event._id, rsvp: false }, function(error, response) {
			if (error) {
				console.log(error);
				alert(error.reason);
			}
		})
	},
	'click .invite-btn': function() {
		var email = $('.invite-email-input').val();
		var slug = Router.current().params.slug;
		var event = orion.entities.events.collection.findOne({ slug: slug });
		Meteor.call('inviteToEvent', { eventId: event._id, email: email }, function(error, response) {
			if (error) {
				console.log(error);
				alert(error.reason);
			} else {
				$('.invite-email-input').val('');
			}
		})
	}
});