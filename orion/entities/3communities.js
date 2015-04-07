// Communities
orion.addEntity('communities', {
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
    // The admin of the community can create groups and events
    admins: orion.attribute('users', {
        label: 'Admins',
        optional: true,
    }, {
        publicationName: 'userajsneansk' // It doesn't matter what we put here but it has to be unique
    }),
}, {
    icon: 'users',
    sidebarName: 'Communities',
    pluralName: 'Communities',
    singularName: 'Community',
    tableColumns: [
        { data:'name', title: 'Name' },
        orion.attributeColumn('users', 'admins', 'Admins'),
    ],
});

if (Meteor.isClient) {
    orion.admin.addAdminSubscription('entity', 'communities', { admins: Meteor.userId() });
}