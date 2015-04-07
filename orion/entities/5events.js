orion.addEntity('events', {
    name: {
        type: String,
    },
    slug: {
        type: String,
        label: "Slug",
        regEx: /^[a-z0-9A-Z_-]*$/,
        unique: true
    },
    group: orion.attribute('hasOne', {
        label: 'Group',
    }, {
        entity: 'groups',
        titleField: 'name',
        publicationName: 'eventsGroupsPubAdmin',
        aditionalFields: ['community'],
        filter: function(userId) {
            var communitiesId = _.pluck(orion.entities.communities.collection.find({ admins: userId }).fetch(), '_id');
            return { community: { $in: communitiesId } };
        }
    }),
    host: orion.attribute('user', {
        label: 'Host',
        optional: true,
    }, {
        publicationName: 'eventshostadmin'
    }),
    privacy: {
        type: String,
        autoform: {
            noselect: true,
            options: {
                'public': 'Public: Anyone can join the event',
                'open-invite': 'Open Invite: Anyone invited can invite other friends by email',
                'invite-only': 'Invite Only: Only the event admins (hosts) can invite additional people',
            }
        }
    },
    invitationTemplate: orion.attribute('hasOne', {
        label: 'Invitation Email Template',
        optional: true,
    }, {
        entity: 'emailTemplates',
        titleField: 'name',
        publicationName: 'emailTemplatesInvitationPub',
        aditionalFields: ['type'],
        filter: function() {
            return { type: 'invitation' };
        }
    }),
    reminderTemplate: orion.attribute('hasOne', {
        label: 'Reminder Email Template',
        optional: true,
    }, {
        entity: 'emailTemplates',
        titleField: 'name',
        publicationName: 'emailTemplatesReminderPub',
        aditionalFields: ['type'],
        filter: function() {
            return { type: 'reminder' };
        }
    }),
    location: {
        type: String,
    },
    startsAt: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: 'bootstrap-datetimepicker'
            }
        }
    },
    endsAt: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: 'bootstrap-datetimepicker'
            }
        }
    },
    invitations: orion.attribute('hasMany', {
        label: 'Invitations',
        optional: true,
    }, {
        entity: 'emails',
        titleField: 'email',
        publicationName: 'eventsEmailsPub',
        createFilter: function(input) {
            var match, regex;
            regex = SimpleSchema.RegEx.Email;
            match = input.match(regex);
            if (match) return !this.options.hasOwnProperty(match[0]);
            return false;
        },
        create: function(input) {
            var newEmail = { email: input };
            var emailId = orion.entities.emails.collection.insert(newEmail);
            newEmail._id = emailId;
            return newEmail;
        }
    }),
    rsvpYes: orion.attribute('users', {
        label: 'RSVP Yes',
        optional: true,
    }, {
        publicationName: 'acceptedUsersPub'
    }),
    rsvpNo: orion.attribute('users', {
        label: 'RSVP No',
        optional: true,
    }, {
        publicationName: 'rejectedUsersPub'
    })
}, {
    icon: 'calendar-o',
    sidebarName: 'Events',
    pluralName: 'Events',
    singularName: 'Event',
    tableColumns: [
        { data:'name', title: 'Name' },
        orion.attributeColumn('hasOne', 'group', 'Group'),
        orion.attributeColumn('hasMany', 'invitations', 'Invitations'),
        orion.attributeColumn('users', 'rsvpYes', 'RSVP Yes'),
        orion.attributeColumn('users', 'rsvpNo', 'RSVP No'),
        { tmpl: Meteor.isClient && Template.eventAdminActions, title: 'Actions' }
    ],
});

orion.users.permissions.createCustomEntityPermission({
    entity: 'events',
    name: 'community-admin',
    indexFilter: function(userId) {
        var communitiesIds = _.pluck(orion.entities.communities.collection.find({ admins: userId }).fetch(), '_id');
        var groupsIds = _.pluck(orion.entities.groups.collection.find({ community: { $in: communitiesIds } }).fetch(), '_id');
        return { group: { $in: groupsIds } };
    },
    update: function(userId, doc, fields, modifier) {
        var communitiesIds = _.pluck(orion.entities.communities.collection.find({ admins: userId }).fetch(), '_id');
        var groupsIds = _.pluck(orion.entities.groups.collection.find({ community: { $in: communitiesIds } }).fetch(), '_id');
        return { group: { $in: groupsIds } };
    },
    create: function(userId, doc) {
        if (orion.entities.communities.collection.find({ admins: userId }).count()) {
            return true;
        }
        return false;
    },
    remove: function(userId, doc) {
        var communitiesIds = _.pluck(orion.entities.communities.collection.find({ admins: userId }).fetch(), '_id');
        var groupsIds = _.pluck(orion.entities.groups.collection.find({ community: { $in: communitiesIds } }).fetch(), '_id');
        return _.contains(groupsIds, doc.group);
    }
});

orion.users.permissions.createCustomEntityPermission({
    entity: 'events',
    name: 'possible-host',
    indexFilter: function(userId) {
        return { host: userId };
    },
    update: function(userId, doc, fields, modifier) {
        return { host: userId };
    },
    create: function(userId, doc) {
        return false;
    },
    remove: function(userId, doc) {
        return false;
    },
    fields: function(userId) {
        return ['name', 'slug', 'privacy', 'location', 'startsAt', 'endsAt', 'invitations', 'rsvpYes', 'rsvpNo'];
    }
});

orion.entities.events.collection.helpers({
    getUrl: function() {
        var group = orion.entities.groups.collection.findOne(this.group);
        var community = orion.entities.communities.collection.findOne(group.community);
        return Router.url('event', { slug: this.slug, groupSlug: group.slug, communitySlug: community.slug });
    },
    isPublic: function () {
        return this.privacy == 'public';
    },
    isOpenInvite: function() {
        return this.privacy == 'open-invite';
    },
    isInviteOnly: function() {
        return this.privacy == 'invite-only';
    },
    userIsInvitedOrRsvp: function(userId) {
        return this.userRsvp(userId) || this.userIsInvited(userId);
    },
    userIsInvited: function(userId) {
        if (!userId) return false;
        var event = this;
        var found = false;
        // If we call this from the client we must be subscribed to the user emails, 
        // this is automatically done with the logged in user, but we may have problems
        // if we check for others users without subscribing.
        orion.entities.emails.collection.find({ userId: userId }).forEach(function (item) {
            if (_.contains(event.invitations, item._id)) {
                found = true;
            }
        });
        return found;
    },
    userRsvp: function(userId) {
        return this.userRsvpYes(userId) || this.userRsvpNo(userId);
    },
    userRsvpYes: function(userId) {
        return _.contains(this.rsvpYes, userId)
    },
    userRsvpNo: function(userId) {
        return _.contains(this.rsvpNo, userId)
    }
});

