Template.group.onRendered(function() {
	var self = this;
	self.autorun(function () {
		var communitySlug = Router.current().params.communitySlug;
		var slug = Router.current().params.slug;

		self.subscribe('entity', 'communities', { slug: communitySlug })
		self.subscribe('entity', 'groups', { slug: slug })
		var group = orion.entities.groups.collection.findOne({ slug: slug });
		if (group) {
			self.subscribe('entity', 'events', { group: group._id })
		}
	});
})

Template.group.helpers({
	community: function () {
		var communitySlug = Router.current().params.communitySlug;
		return orion.entities.communities.collection.findOne({ slug: communitySlug });
	},
	group: function () {
		var slug = Router.current().params.slug;
		return orion.entities.groups.collection.findOne({ slug: slug });
	},
	events: function() {
		var slug = Router.current().params.slug;
		var group = orion.entities.groups.collection.findOne({ slug: slug });
		return group && orion.entities.events.collection.find({ group: group._id });
	},
	userIsSubscribed: function() {
		var slug = Router.current().params.slug;
		var group = orion.entities.groups.collection.findOne({ slug: slug });
		return group && group.userIsSubscribed(Meteor.userId());
	}
});

Template.group.events({
	'click .subscribe-btn': function () {
		var slug = Router.current().params.slug;
		var group = orion.entities.groups.collection.findOne({ slug: slug });
		Meteor.call('subscribeToGroup', { groupId: group._id }, function(error, response) {
			if (error) {
				console.log(error);
				alert(error.reason);
			}
		})
	},
	'click .unsubscribe-btn': function () {
		var slug = Router.current().params.slug;
		var group = orion.entities.groups.collection.findOne({ slug: slug });
		Meteor.call('unsubscribeFromGroup', { groupId: group._id }, function(error, response) {
			if (error) {
				console.log(error);
				alert(error.reason);
			}
		})
	}
});

Template.groupEvent.helpers({
	communitySlug: function () {
		return Router.current().params.communitySlug;
	},
	groupSlug: function () {
		return Router.current().params.slug;
	}
});