orion.config.add('MAIL_URL', 'email');
orion.config.add('MAIL_FROM', 'email');

if (Meteor.isServer && orion.config.get('MAIL_URL')) {
	process.env.MAIL_URL = orion.config.get('MAIL_URL');
}