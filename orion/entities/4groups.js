orion.addEntity('groups', {
    name: {
        type: String,
        optional: true,
    },
    slug: {
        type: String,
        label: "Slug",
        regEx: /^[a-z0-9A-Z_-]*$/,
        unique: true
    },
    community: orion.attribute('hasOne', {
        label: 'Community',
    }, {
        entity: 'communities',
        titleField: 'name',
        publicationName: 'groupsCommunitiesPubAdmin',
        aditionalFields: ['admins'],
        filter: function(userId) {
            return { admins: userId };
        }
    }),
    privacy: {
        type: String,
        autoform: {
            noselect: true,
            options: {
                'public': 'Public: Anyone can join',
                'closed': 'Closed: only admin can add people to groups',
            }
        }
    },
    subscribers: orion.attribute('users', {
        label: 'Subscribers',
        optional: true,
    }, {
        publicationName: 'usedfrajsneansk'
    }),
}, {
    icon: 'list-ul',
    sidebarName: 'Groups',
    pluralName: 'Groups',
    singularName: 'Group',
    tableColumns: [
        { data:'name', title: 'Name' },
        orion.attributeColumn('users', 'subscribers', 'Subscribers'),
        orion.attributeColumn('hasOne', 'community', 'Community'),
    ],
});

if (Meteor.isClient) {
    // TODO: subscribe only to groups with permissions 
    orion.admin.addAdminSubscription('entity', 'groups', {  });
}

orion.users.permissions.createCustomEntityPermission({
    entity: 'groups',
    name: 'community-admin',
    indexFilter: function(userId) {
        var communitiesIds = _.pluck(orion.entities.communities.collection.find({ admins: userId }).fetch(), '_id');
        return { community: { $in: communitiesIds } };
    },
    update: function(userId, doc, fields, modifier) {
        var communitiesIds = _.pluck(orion.entities.communities.collection.find({ admins: userId }).fetch(), '_id');
        return _.contains(communitiesIds, doc.community);
    },
    create: function(userId, doc) {
        if (orion.entities.communities.collection.find({ admins: userId }).count()) {
            return true;
        }
        return false;
    },
    remove: function(userId, doc) {
        var communitiesIds = _.pluck(orion.entities.communities.collection.find({ admins: userId }).fetch(), '_id');
        return _.contains(communitiesIds, doc.community);
    },
    fields: function(userId) {
        return ['name', 'slug', 'privacy', 'subscribers'];
    }
});

orion.entities.groups.collection.helpers({
    isPublic: function () {
        return this.privacy == 'public';
    },
    userIsSubscribed: function(userId) {
        return _.contains(this.subscribers, userId);
    }
});