orion.dictionary.addDefinition('siteName', 'basic', {
	type: String,
	label: 'Site Name'
});

orion.dictionary.addDefinition('user1', 'basic1', 
	orion.attribute('user', {
        label: 'Group'
    }, {
        publicationName: 'youCanPutAfnyStringYouWantHere',
    })
);

orion.dictionary.addDefinition('users1', 'basic2', 
	orion.attribute('users', {
        label: 'Group'
    }, {
        publicationName: 'youCanPutAnyStringYfouWantHere',
    })
);