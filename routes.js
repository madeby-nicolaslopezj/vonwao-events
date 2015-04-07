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

/**
 * Send emails to invitees in the admin
 */
Router.route('/admin/e/events/:_id/send-email', {
	name: 'sendEmailToInvitees',
	controller: orion.RouteController,  
	onBeforeAction: orion.users.ensureRoutePermissions('entity.events')
});