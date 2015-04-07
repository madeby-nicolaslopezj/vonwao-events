// We need to setup routes after all the other routes
// becouse they could cause problems
Meteor.startup(function () {
	Router.route('/', {
		name: 'home',
		layoutTemplate: 'layout',
	});

	Router.route('/:slug', {
		name: 'community',
		layoutTemplate: 'layout',
	});

	Router.route('/:communitySlug/:slug', {
		name: 'group',
		layoutTemplate: 'layout',
	});

	Router.route('/:communitySlug/:groupSlug/:slug', {
		name: 'event',
		layoutTemplate: 'layout',
	});
});