Template.headline.helpers({
  release: function () {
    return Meteor.release ? "0.9.4-pre.6" : "(checkout)";
  }
});

Meteor.startup(function () {
  // XXX this is broken by the new multi-page layout.  Also, it was
  // broken before the multi-page layout because it had illegible
  // colors. Just turn it off for now. We'll fix it and turn it on
  // later.
  // prettyPrint();

  //mixpanel tracking
  mixpanel.track('docs');

  // returns a jQuery object suitable for setting scrollTop to
  // scroll the page, either directly for via animate()
  var scroller = function() {
    return $("html, body").stop();
  };

  var sections = [];
  _.each($('#main h1, #main h2, #main h3'), function (elt) {
    var classes = (elt.getAttribute('class') || '').split(/\s+/);
    if (_.indexOf(classes, "nosection") === -1)
      sections.push(elt);
  });

  for (var i = 0; i < sections.length; i++) {
    var classes = (sections[i].getAttribute('class') || '').split(/\s+/);
    if (_.indexOf(classes, "nosection") !== -1)
      continue;
    sections[i].prev = sections[i-1] || sections[i];
    sections[i].next = sections[i+1] || sections[i];
    $(sections[i]).waypoint({offset: 30});
  }
  var section = document.location.hash.substr(1) || sections[0].id;
  Session.set('section', section);
  if (section) {
    // WebKit will scroll down to the #id in the URL asynchronously
    // after the page is rendered, but Firefox won't.
    Meteor.setTimeout(function() {
      var elem = $('#'+section);
      if (elem.length)
        scroller().scrollTop(elem.offset().top);
    }, 0);
  }

  var ignore_waypoints = false;
  var lastTimeout = null;
  $('h1, h2, h3').waypoint(function (evt, dir) {
    if (!ignore_waypoints) {
      var active = (dir === "up") ? this.prev : this;
      if (active.id) {
        if (lastTimeout)
          Meteor.clearTimeout(lastTimeout);
        lastTimeout = Meteor.setTimeout(function () {
          Session.set("section", active.id);
        }, 200);
      }
    }
  });

  window.onhashchange = function () {
    scrollToSection(location.hash);
  };

  var scrollToSection = function (section) {
    if (! $(section).length)
      return;

    ignore_waypoints = true;
    Session.set("section", section.substr(1));
    scroller().animate({
      scrollTop: $(section).offset().top
    }, 500, 'swing', function () {
      window.location.hash = section;
      ignore_waypoints = false;
    });
  };

  $('#main, #nav').delegate("a[href^='#']", 'click', function (evt) {
    evt.preventDefault();
    var sel = $(this).attr('href');
    scrollToSection(sel);

    mixpanel.track('docs_navigate_' + sel);
  });

  // Make external links open in a new tab.
  $('a:not([href^="#"])').attr('target', '_blank');

  // Hide menu by tapping on background
  $('#main').on('click', function () {
    hideMenu();
  });
});

var hideMenu = function () {
  $('#nav').removeClass('show');
  $('#menu-ico').removeClass('hidden');
};

var toc = [
  {name: "Meteor " + Template.headline.release(), id: "top"}, [
    "Quick start",
    "Seven principles",
    "Resources"
  ],
  "Concepts", [
    "What is Meteor?",
    "Structuring your app",
    "Data and security",
    "Reactivity",
    "Live HTML templates",
    "Using packages",
    "Namespacing",
    "Deploying",
    "Writing packages"
  ],

  "API", [
    "Core", [
      "Meteor.isClient",
      "Meteor.isServer",
      "Meteor.isCordova",
      "Meteor.startup",
      "Meteor.wrapAsync",
      "Meteor.absoluteUrl",
      "Meteor.settings",
      "Meteor.release"
    ],

    "Publish and subscribe", [
      "Meteor.publish", [
        {instance: "this", name: "userId", id: "publish_userId"},
        {instance: "this", name: "added", id: "publish_added"},
        {instance: "this", name: "changed", id: "publish_changed"},
        {instance: "this", name: "removed", id: "publish_removed"},
        {instance: "this", name: "ready", id: "publish_ready"},
        {instance: "this", name: "onStop", id: "publish_onstop"},
        {instance: "this", name: "error", id: "publish_error"},
        {instance: "this", name: "stop", id: "publish_stop"},
        {instance: "this", name: "connection", id: "publish_connection"}
      ],
      "Meteor.subscribe"
    ],

    {name: "Methods", id: "methods_header"}, [
      "Meteor.methods", [
        {instance: "this", name: "userId", id: "method_userId"},
        {instance: "this", name: "setUserId", id: "method_setUserId"},
        {instance: "this", name: "isSimulation", id: "method_issimulation"},
        {instance: "this", name: "unblock", id: "method_unblock"},
        {instance: "this", name: "connection", id: "method_connection"}
      ],
      "Meteor.Error",
      "Meteor.call",
      "Meteor.apply"
    ],

    {name: "Check", id: "check_package"}, [
      "check",
      "Match.test",
      {name: "Match patterns", style: "noncode"}
    ],

    {name: "Server connections", id: "connections"}, [
      "Meteor.status",
      "Meteor.reconnect",
      "Meteor.disconnect",
      "Meteor.onConnection",
      "DDP.connect"
    ],

    {name: "Collections", id: "collections"}, [
      "Mongo.Collection", [
        {instance: "collection", name: "find"},
        {instance: "collection", name: "findOne"},
        {instance: "collection", name: "insert"},
        {instance: "collection", name: "update"},
        {instance: "collection", name: "upsert"},
        {instance: "collection", name: "remove"},
        {instance: "collection", name: "allow"},
        {instance: "collection", name: "deny"}
      ],

      "Mongo.Cursor", [
        {instance: "cursor", name: "forEach"},
        {instance: "cursor", name: "map"},
        {instance: "cursor", name: "fetch"},
        {instance: "cursor", name: "count"},
        {instance: "cursor", name: "observe"},
        {instance: "cursor", name: "observeChanges", id: "observe_changes"}
      ],
      {type: "spacer"},
      {name: "Mongo.ObjectID", id: "mongo_object_id"},
      {type: "spacer"},
      {name: "Selectors", style: "noncode"},
      {name: "Modifiers", style: "noncode"},
      {name: "Sort specifiers", style: "noncode"},
      {name: "Field specifiers", style: "noncode"}
    ],

    "Session", [
      "Session.set",
      {name: "Session.setDefault", id: "session_set_default"},
      "Session.get",
      "Session.equals"
    ],

    {name: "Accounts", id: "accounts_api"}, [
      "Meteor.user",
      "Meteor.userId",
      "Meteor.users",
      "Meteor.loggingIn",
      "Meteor.logout",
      "Meteor.logoutOtherClients",
      "Meteor.loginWithPassword",
      {name: "Meteor.loginWith<Service>", id: "meteor_loginwithexternalservice"},
      {type: "spacer"},

      {name: "{{currentUser}}", id: "template_currentuser"},
      {name: "{{loggingIn}}", id: "template_loggingin"},
      {type: "spacer"},

      "Accounts.config",
      "Accounts.ui.config",
      "Accounts.validateNewUser",
      "Accounts.onCreateUser",
      "Accounts.validateLoginAttempt",
      "Accounts.onLogin",
      {name: "Accounts.onLoginFailure", id: "accounts_onlogin"}
    ],

    {name: "Passwords", id: "accounts_passwords"}, [
      "Accounts.createUser",
      "Accounts.changePassword",
      "Accounts.forgotPassword",
      "Accounts.resetPassword",
      "Accounts.setPassword",
      "Accounts.verifyEmail",
      {type: "spacer"},

      "Accounts.sendResetPasswordEmail",
      "Accounts.sendEnrollmentEmail",
      "Accounts.sendVerificationEmail",
      {type: "spacer"},

      {name: "Accounts.onResetPasswordLink", id: "Accounts-onResetPasswordLink"},
      {name: "Accounts.onEnrollmentLink", id: "Accounts-onEnrollmentLink"},
      {name: "Accounts.onEmailVerificationLink", id: "Accounts-onEmailVerificationLink"},
      {type: "spacer"},

      "Accounts.emailTemplates"
    ],

    {name: "Templates", id: "templates_api"}, [
      {prefix: "Template", instance: "myTemplate", id: "templates_api"}, [
        {name: "events", id: "template_events"},
        {name: "helpers", id: "template_helpers"},
        {name: "rendered", id: "template_rendered"},
        {name: "created", id: "template_created"},
        {name: "destroyed", id: "template_destroyed"}
      ],
      {name: "Template instances", id: "template_inst"}, [
        {instance: "template", name: "findAll", id: "template_findAll"},
        {instance: "template", name: "$", id: "template_$"},
        {instance: "template", name: "find", id: "template_find"},
        {instance: "template", name: "firstNode", id: "template_firstNode"},
        {instance: "template", name: "lastNode", id: "template_lastNode"},
        {instance: "template", name: "data", id: "template_data"},
        {instance: "template", name: "autorun", id: "template_autorun"},
        {instance: "template", name: "view", id: "template_view"}
      ],
      "Template.registerHelper",
      "Template.instance",
      "Template.currentData",
      "Template.parentData",
      "Template.body",
      {name: "{{> Template.dynamic}}", id: "template_dynamic"},
      {type: "spacer"},
      {name: "Event maps", style: "noncode"}
    ],
    "Blaze", [
      "Blaze.render",
      "Blaze.renderWithData",
      "Blaze.remove",
      "Blaze.getData",
      "Blaze.toHTML",
      "Blaze.toHTMLWithData",
      "Blaze.View", [
        "Blaze.currentView",
        "Blaze.getView",
        "Blaze.With",
        "Blaze.If",
        "Blaze.Unless",
        "Blaze.Each"
      ],
      "Blaze.Template",
      "Blaze.isTemplate",
      {type: "spacer"},
      {name: "Renderable content", id: "renderable_content", style: "noncode"}
     ],

    "Timers", [
      "Meteor.setTimeout",
      "Meteor.setInterval",
      "Meteor.clearTimeout",
      "Meteor.clearInterval"
    ],

    "Tracker", [
      "Tracker.autorun",
      "Tracker.flush",
      "Tracker.nonreactive",
      "Tracker.active",
      "Tracker.currentComputation",
      "Tracker.onInvalidate",
      "Tracker.afterFlush",
      "Tracker.Computation", [
        {instance: "computation", name: "stop", id: "computation_stop"},
        {instance: "computation", name: "invalidate", id: "computation_invalidate"},
        {instance: "computation", name: "onInvalidate", id: "computation_oninvalidate"},
        {instance: "computation", name: "stopped", id: "computation_stopped"},
        {instance: "computation", name: "invalidated", id: "computation_invalidated"},
        {instance: "computation", name: "firstRun", id: "computation_firstrun"}
      ],
      "Tracker.Dependency", [
        {instance: "dependency", name: "changed", id: "dependency_changed"},
        {instance: "dependency", name: "depend", id: "dependency_depend"},
        {instance: "dependency", name: "hasDependents", id: "dependency_hasdependents"}
      ]
    ],

    {name: "ReactiveVar", id: "reactivevar_pkg"}, [
      "ReactiveVar",
      {instance: "reactiveVar", name: "get", id: "reactivevar_get"},
      {instance: "reactiveVar", name: "set", id: "reactivevar_set"}
    ],

    // "Environment Variables", [
    //   "Meteor.EnvironmentVariable", [
    //     {instance: "env_var", name: "get", id: "env_var_get"},
    //     {instance: "env_var", name: "withValue", id: "env_var_withvalue"},
    //     {instance: "env_var", name: "bindEnvironment", id: "env_var_bindenvironment"}
    //   ]
    //],

    {name: "EJSON", id: "ejson"}, [
      {name: "EJSON.parse", id: "ejson_parse"},
      {name: "EJSON.stringify", id: "ejson_stringify"},
      {name: "EJSON.fromJSONValue", id: "ejson_from_json_value"},
      {name: "EJSON.toJSONValue", id: "ejson_to_json_value"},
      {name: "EJSON.equals", id: "ejson_equals"},
      {name: "EJSON.clone", id: "ejson_clone"},
      {name: "EJSON.newBinary", id: "ejson_new_binary"},
      {name: "EJSON.isBinary", id: "ejson_is_binary"},
      {name: "EJSON.addType", id: "ejson_add_type"},
      [
        {instance: "customType", id: "ejson_type_typeName", name: "typeName"},
        {instance: "customType", id: "ejson_type_toJSONValue", name: "toJSONValue"},
        {instance: "customType", id: "ejson_type_clone", name: "clone"},
        {instance: "customType", id: "ejson_type_equals", name: "equals"}
      ]
    ],


    "HTTP", [
      "HTTP.call",
      {name: "HTTP.get"},
      {name: "HTTP.post"},
      {name: "HTTP.put"},
      {name: "HTTP.del"}
    ],
    "Email", [
      "Email.send"
    ],
    {name: "Assets", id: "assets"}, [
      {name: "Assets.getText", id: "assets_getText"},
      {name: "Assets.getBinary", id: "assets_getBinary"}
    ],

    {name: "package.js", id: "packagejs"}, [
      {name: "Package.describe", id: "packagedescription"},
      {name: "Package.onUse", id: "packagedefinition"}, [
        {name: "api.versionsFrom", id: "pack_versions"},
        {name: "api.use", id: "pack_use"},
        {name: "api.imply", id: "pack_api_imply"},
        {name: "api.export", id: "pack_export"},
        {name: "api.addFiles", id: "pack_addFiles"}
      ],
      {name: "Package.onTest", id: "packagetests"},
      {name: "Npm.depends", id: "Npm-depends"},
      {name: "Npm.require", id: "Npm-require"},
      {name: "Cordova.depends", id: "Cordova-depends"},
      {name: "Package.registerBuildPlugin", id: "Package-registerBuildPlugin"}, [
        {name: "Plugin.registerSourceHandler", id: "Plugin-registerSourceHandler"}
      ]
    ],

    {name: "mobile-config.js", id: "mobileconfigjs"}, [
      {name: "App.info", id: "App-info"},
      {name: "App.set", id: "App-set"},
      {name: "App.configurePlugin", id: "App-configurePlugin"},
      {name: "App.icons", id: "App-icons"},
      {name: "App.launchScreens", id: "App-launchScreens"}
    ]
  ],

  "Packages", [ [
    "accounts-ui",
    "appcache",
    "audit-argument-checks",
    "browser-policy",
    "coffeescript",
    "fastclick",
    "force-ssl",
    "jquery",
    "less",
    "oauth-encryption",
    "random",
    "spiderable",
    "stylus",
    "showdown",
    "underscore",
    "webapp"
  ] ],

  "Command line", [ [
    "meteor help",
    "meteor run",
    "meteor create",
    "meteor deploy",
    "meteor logs",
    "meteor update",
    "meteor add",
    "meteor remove",
    "meteor list",
    "meteor mongo",
    "meteor reset",
    "meteor build",
    "meteor search",
    "meteor show",
    "meteor publish",
    "meteor publish-for-arch",
    "meteor publish-release",
    "meteor test-packages",
    "meteor admin"
  ] ]
];

var name_to_id = function (name) {
  var x = name.toLowerCase().replace(/[^a-z0-9_,.]/g, '').replace(/[,.]/g, '_');
  return x;
};

Template.nav.helpers({
  sections: function () {
    var ret = [];
    var walk = function (items, depth) {
      _.each(items, function (item) {
        // Work around (eg) accidental trailing commas leading to spurious holes
        // in IE8.
        if (!item)
          return;
        if (item instanceof Array)
          walk(item, depth + 1);
        else {
          if (typeof(item) === "string")
            item = {name: item};
          ret.push(_.extend({
            type: "section",
            id: item.name && name_to_id(item.name) || undefined,
            depth: depth,
            style: ''
          }, item));
        }
      });
    };

    walk(toc, 1);
    return ret;
  },

  type: function (what) {
    return this.type === what;
  },

  maybe_current: function () {
    return Session.equals("section", this.id) ? "current" : "";
  }
});

Template.nav_section.helpers({
  depthIs: function (n) {
    return this.depth === n;
  }
});

// Show hidden TOC when menu icon is tapped
Template.nav.events({
  'click #menu-ico' : function () {
    $('#nav').addClass('show');
    $('#menu-ico').addClass('hidden');
  },
  // Hide TOC when selecting an item
  'click a' : function () {
    hideMenu();
  }
});

UI.registerHelper('dstache', function() {
  return '{{';
});

UI.registerHelper('tstache', function() {
  return '{{{';
});

UI.registerHelper('lt', function () {
  return '<';
});

check_links = function() {
  var body = document.body.innerHTML;

  var id_set = {};

  body.replace(/id\s*=\s*"(.*?)"/g, function(match, id) {
    if (! id) return;
    if (id_set['$'+id]) {
      console.log("ERROR: Duplicate id: "+id);
    } else {
      id_set['$'+id] = true;
    }
  });

  body.replace(/"#(.*?)"/g, function(match, frag) {
    if (! frag) return;
    if (! id_set['$'+frag]) {
      var suggestions = [];
      _.each(_.keys(id_set), function(id) {
        id = id.slice(1);
        if (id.slice(-frag.length) === frag ||
            frag.slice(-id.length) === id) {
          suggestions.push(id);
        }
      });
      var msg = "ERROR: id not found: "+frag;
      if (suggestions.length > 0) {
        msg += " -- suggest "+suggestions.join(', ');
      }
      console.log(msg);
    }
  });

  return "DONE";
};

var basicTypes = ["String", "Number", "Boolean", "Function", "Any", "Object",
  "Array", "null", "undefined", "Integer", "Error"];

// are all types either normal types or links?
check_types = function () {
  $(".new-api-box .type").each(function () {
    var typeSpan = this;

    var typesPipeSeparated =
      $(typeSpan).text().replace(/, or /g, "|").replace(/( or )/g, "|")
        .replace(/, /g, "|");

    _.each(typesPipeSeparated.split("|"), function (text) {
      if (! text) {
        console.log(typeSpan);
        return;
      }

      text = text.replace(/^\s+|\s+$/g, '');

      if (_.contains(basicTypes, text)) {
        return; // all good
      }

      var hasLink = false;
      $(typeSpan).find("a").each(function () {
        if ($(this).text().replace(/^\s+|\s+$/g, '') === text) {
          hasLink = true;
        }
      });

      if (! hasLink) {
        console.log("No link for: " + text);
      }
    });
  });
};
