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
        optional: true,
    }, {
        entity: 'groups',
        titleField: 'name',
        publicationName: 'eventsGroupsPubAdmin',
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