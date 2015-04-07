Template.home.onRendered(function() {
	this.subscribe('entity', 'communities');
})

Template.home.helpers({
	communities: function () {
		return orion.entities.communities.collection.find();
	}
});