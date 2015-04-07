# Event Management
A project made for @vonwao. The most complex orion proyect yet.

## Schema

We have 5 entities:

- **Communities**: Top level groups. They have admin users.
- **Groups**: Something like "sub-community". They have subscribers.
- **Events**: They belong to a group. They have invitations, rsvpYes and rsvpNo (also other events attributes).
- **Emails**: We save all the emails that we use here, some of them belong to users. The invitations of a event is a array of emails ids - not users- because we want to invite people that its not registered.
- **Email Templates**: We can create templates to send to users, for example when they are invited to a event.

## Permissions

We have different type of users:

- **Global Admin**: The admin of the site, can do everything. They have to set and community admins.
- **Community Admin**: They can create groups and events, but they must belong to their community.
- **Event host**: They have power only on their events, they can invite people, send emails, etc.
- **Registered users**: They can say they are or not going to go to a event. They can subscribe to a public group.
- **Non registered users (emails)**: They can be invited to events, but they have to register to respond.

## Getting Started

To start to use the sistem do the following steps:

- Navigate to ```/admin``` to create the admin account.
- Logout and create other users.
- Create a community and set some admins.
- Create some email templates and set the ```MAIL_URL``` in the config section.
- Login as a community admin and create some groups and events (the global admin can also do this, but this way is more fun).
- Create some public, open-invite and invite-only events.
- Go to the home path and use the site.




