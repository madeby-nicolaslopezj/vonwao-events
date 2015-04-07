orion.addEntity('emailTemplates', {
    name: {
        type: String,
        unique: true
    },
    content: orion.attribute('froala', {
        label: 'Content'
    }),
    type: {
        type: String,
        autoform: {
            noselect: true,
            options: {
                'invitation': 'Invitation email',
                'reminder': 'Reminder email',
                // add more here as you wish
            }
        }
    }
}, {
    icon: 'envelope',
    sidebarName: 'Email Templates',
    pluralName: 'Templates',
    singularName: 'Template',
    tableColumns: [
        { data:'name', title: 'Name' },
        { data:'type', title: 'Type' },
    ],
});

orion.entities.emailTemplates.collection.helpers({
    getHtml: function(data) {
        data = data || {};
        var html = this.content;
        _.keys(data).map(function(key) {
            var value = data[key];
            var regex = new RegExp('{{' + key + '}}', 'g');
            html = html.replace(regex, value);
        })
        return html;
    }
});