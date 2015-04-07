Template.community.onRendered(function() {
	var self = this;
	self.autorun(function () {
		var slug = Router.current().params.slug;
		self.subscribe('entity', 'communities', { slug: slug })
		var community = orion.entities.communities.collection.findOne({ slug: slug });
		if (community) {
			self.subscribe('entity', 'groups', { community: community._id })
		}
	});
})

Template.community.helpers({
	community: function () {
		var slug = Router.current().params.slug;
		return orion.entities.communities.collection.findOne({ slug: slug });
	},
	groups: function() {
		var slug = Router.current().params.slug;
		var community = orion.entities.communities.collection.findOne({ slug: slug });
		return community && orion.entities.groups.collection.find({ community: community._id });
	}
});

Template.communityGroup.helpers({
	communitySlug: function () {
		return Router.current().params.slug;
	}
});