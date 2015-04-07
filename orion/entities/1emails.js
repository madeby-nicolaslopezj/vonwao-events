// In this entity we will save all the emails that we use in the system
// If the email belongs to a user it should be automatically setted
// We need this entity because we want to invite people that are not registered
orion.addEntity('emails', {
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        unique: true
    },
    userId: orion.attribute('user', {
        label: 'Owner',
        optional: true,
    }, {
        publicationName: 'emailsasdfasuser'
    }),
}, {
    icon: 'envelope',
    sidebarName: 'Emails',
    pluralName: 'Emails',
    singularName: 'Email',
    tableColumns: [
        { data:'email', title: 'Email' },
        orion.attributeColumn('user', 'userId', 'User'),
    ],
});

// null beacouse the client its automatically subscribed
if (Meteor.isServer) {
    Meteor.publish(null, function() {
        // publish my emails
        return orion.entities.emails.collection.find({ userId: this.userId });
    })
}