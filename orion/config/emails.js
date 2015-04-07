// We will use a secure method to set the MAIL_URL
// We can use any method we want
// Only the admin can see and change this values

orion.config.add('MAIL_URL', 'email');
orion.config.add('MAIL_FROM', 'email');

if (Meteor.isServer && orion.config.get('MAIL_URL')) {
	process.env.MAIL_URL = orion.config.get('MAIL_URL');
}