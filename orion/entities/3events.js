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
}, {
    icon: 'calendar-o',
    sidebarName: 'Events',
    pluralName: 'Events',
    singularName: 'Event',
    tableColumns: [
        { data:'name', title: 'Name' },
        orion.attributeColumn('hasOne', 'group', 'Group'),
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