// In this entity we will save the email templates
// The content is editable with froala
// In the editor you can write {{name}} and a parser
// will change it to the event name - it works with all event
// attributes plus "url".
// Notice: this is not blaze, this just uses a string.replace, so we have some rules
// 1 - No spaces between braces. Like this: {{name}}
// 2 - No functions, helpers, the parser will only recognize the attributes of the current event
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
        // Simple parser, will convert 
        // {{name}} -> My event
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