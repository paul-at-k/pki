/* --- BEGIN COPYRIGHT BLOCK ---
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Copyright (C) 2013 Red Hat, Inc.
 * All rights reserved.
 * --- END COPYRIGHT BLOCK ---
 *
 * @author Endi S. Dewata
 */

var UserModel = Model.extend({
    urlRoot: "/tps/rest/admin/users",
    parseResponse: function(response) {

        var attrs = {};
        if (response.Attributes) {
            var attributes = response.Attributes.Attribute;
            attributes = attributes == undefined ? [] : [].concat(attributes);

            _(attributes).each(function(attribute) {
                var name = attribute.name;
                var value = attribute.value;
                attrs[name] = value;
            });
        }

        return {
            id: response.id,
            userID: response.UserID,
            fullName: response.FullName,
            email: response.Email,
            state: response.State,
            type: response.Type,
            attributes: attrs
        };
    },
    createRequest: function(attributes) {
        var attrs = [];
        _(attributes.attributes).each(function(value, name) {
            attrs.push({
                name: name,
                value: value
            });
        });

        return {
            id: this.id,
            UserID: attributes.userID,
            FullName: attributes.fullName,
            Email: attributes.email,
            State: attributes.state,
            Type: attributes.type,
            Attributes: {
                Attribute: attrs
            }
        };
    }
});

var UserCollection = Collection.extend({
    model: UserModel,
    urlRoot: "/tps/rest/admin/users",
    getEntries: function(response) {
        return response.entries;
    },
    getLinks: function(response) {
        return response.Link;
    },
    parseEntry: function(entry) {
        return new UserModel({
            id: entry.id,
            userID: entry.UserID,
            fullName: entry.FullName
        });
    }
});

var UserPage = EntryPage.extend({
    initialize: function(options) {
        var self = this;
        UserPage.__super__.initialize.call(self, options);
        self.parentPage = options.parentPage;
    },
    loadField: function(input) {
        var self = this;

        var name = input.attr("name");
        if (name != "tpsProfiles") {
            UserPage.__super__.loadField.call(self, input);
            return;
        }

        var attributes = self.entry.attributes;
        if (attributes) {
            var value = attributes.tpsProfiles;
            input.val(value);
        }
    },
    saveField: function(input) {
        var self = this;

        var name = input.attr("name");
        if (name != "tpsProfiles") {
            UserPage.__super__.saveField.call(self, input);
            return;
        }

        var attributes = self.entry.attributes;
        if (attributes == undefined) {
            attributes = {};
            self.entry.attributes = attributes;
        }
        attributes.tpsProfiles = input.val();
    },
    close: function() {
        var self = this;
        if (self.parentPage) {
            self.parentPage.open();
        } else {
            UserPage.__super__.close.call(self);
        }
    }
});

var UsersTable = ModelTable.extend({
    initialize: function(options) {
        var self = this;
        UsersTable.__super__.initialize.call(self, options);
        self.parentPage = options.parentPage;
    },
    open: function(item, column) {
        var self = this;

        var page = new UserPage({
            el: self.parentPage.$el,
            url: "user.html",
            model: self.collection.get(item.entry.id),
            editable: ["fullName", "email", "tpsProfiles"]
        });

        page.open();
    },
    add: function() {
        var self = this;

        var page = new UserPage({
            el: self.parentPage.$el,
            url: "user.html",
            model: new UserModel(),
            mode: "add",
            editable: ["userID", "fullName", "email", "tpsProfiles"],
            parentPage: self.parentPage
        });

        page.open();
    }
});

var UsersPage = Page.extend({
    load: function() {
        var self = this;

        var table = new UsersTable({
            el: $("table[name='users']"),
            collection: new UserCollection(),
            parentPage: self
        });

        table.render();
    }
});
