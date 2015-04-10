Template.invitation.onRendered(function() {
  this.subscribe('entity', 'events', { _id: Router.current().params.eventId });
  this.subscribe('entity', 'emails', { _id: Router.current().params.emailId });

  this.autorun(function() {
    var event = orion.entities.events.collection.findOne(Router.current().params.eventId);
    var email = orion.entities.emails.collection.findOne(Router.current().params.emailId);
    var userId = Meteor.userId();
    if (userId && event && email) {
      if (email.userId != userId) {
        // The person who opened this invitation is not the one who is logged in
        // We will prompt logout with that account.
        return;
      }
      if (event.userIsInvitedOrRsvp(userId)) {
        // User is logged in and its invited or he respond an invitation to this event.
        // We will redirected him to the event page.
        Router.go('event.static', { _id: event._id });
      }
    }
  })
})

Template.invitation.helpers({
  event: function () {
    return orion.entities.events.collection.findOne(Router.current().params.eventId);
  },
  email: function () {
    return orion.entities.emails.collection.findOne(Router.current().params.emailId);
  },
  emailDoesntMatch: function() {
    var email = orion.entities.emails.collection.findOne(Router.current().params.emailId);
    var userId = Meteor.userId();
    return (email && userId && email != userId);
  },
  isInvitedOrRsvp: function() {
    // This returns if the invitation exists
    var event = orion.entities.events.collection.findOne(Router.current().params.eventId);
    var email = orion.entities.emails.collection.findOne(Router.current().params.emailId);
    if (!event || !email) return;
    return event.userIsInvitedOrRsvp(email.userId);
  },
  getLoginQuery: function() {
    return { redirect: Router.current().url };
  },
});

Template.invitation.events({
  'click .btn-logout': function() {
    Meteor.logout();
  }
})