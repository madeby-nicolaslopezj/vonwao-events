# Event Managment
A project made for @vonwao. The most complex orion proyect until now

## Schema

We have 5 entities:

- **Communities**: Top level groups. They have admin users.
- **Groups**: Something like "sub-community". They have subscribers
- **Events**: They belong to a group. They have invitations, rsvpYes and rsvpNo (also other events attributes)
- **Emails**: We save all the emails that we use here, some of them belong to users. The invitations of a event is a array of emails ids - not users- because we want to invite people that its not registered.
- **Email Templates**: We can create templates to send to users, for example when they are invited to a event.
