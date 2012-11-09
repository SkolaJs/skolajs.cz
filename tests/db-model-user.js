process.env.NODE_ENV = 'test';
var config = require('../app/config');
var app = {};
var User;
var users = [];

exports['User'] = {
  'Connecting to database...': function(test) {
    test.expect(1);

    require('../app/mongoose')(app, config);
    app.mongoose.once('open', function() {
      test.ok(true);
      test.done();
    });
  },

  'User model availability': function(test) {
    test.expect(1);
    User = app.model.User;
    test.ok(typeof User === 'function');
    test.done();
  },

  'Ensuring collection is empty': function(test) {
    test.expect(2);
    User.count({}, function(err, count) {
      test.ok(!err, err);
      test.strictEqual(count, 0);
      if (process.env.FORCE) {
        User.collection.drop(function(err) {
          test.done();
        });
      } else {
        test.done();
        if (count)
          process.exit();
      }
    });
  },

  'Recreating indexes': function(test) {
    test.expect(1);
    User.ensureIndexes(function(err) {
      test.ok(!err, err);
      test.done();
    });
  },

  'Create user': function(test) {
    test.expect(3);
    var u = new User;
    u.nickname = 'admin';
    test.strictEqual(u.getPrimaryEmail(), undefined);
    u.emails.push({email: 'admin@skolajs.cz'});
    u.emails.push({email: 'langpavel@skolajs.cz'});
    u.save(function(err) {
      test.ifError(err);
      users.push(u); // cleanup
      test.strictEqual(u.getPrimaryEmail(), 'admin@skolajs.cz');
      test.done();
    });
  },

  'Create user with duplicate mail': function(test) {
    test.expect(2);
    var u = new User;
    u.nickname = 'langpavel';
    u.emails.push({email: 'langpavel@skolajs.cz'});
    u.save(function(err) {
      if (!err) users.push(u); // cleanup
      test.ok(err);
      test.equal(err.code, 11000);
      test.done();
    });
  },

  'Create some users without email in parallel': function(test) {
    var names = ['pavel', 'petr', 'pepa', 'jarda', 'tomas', 'Žežulka',
                 'Človíček', 'pětinožka'];
    var count = names.length;
    test.expect(count);

    names.forEach(function(name) {
      var u = new User({nickname: name});
      u.save(function(err) {
        test.ifError(err);

        users.push(u);

        if ((--count) == 0)
          test.done();
      });
    });
  },

  'findOneByEmail and getPrimaryEmail': function(test) {
    test.expect(3);
    User.findOneByEmail('langpavel@skolajs.cz', function(err, user) {
      test.ifError(err);
      test.equal(user.nickname, 'admin');
      test.equal(user.getPrimaryEmail(), 'admin@skolajs.cz');
      test.done();
    });
  },

  'Delete all created users one by one': function(test) {
    var count = users.length;
    test.expect(count);

    users.forEach(function(user) {
      user.remove(function(err) {
        test.ifError(err);

        if (0 == (--count))
          test.done();
      });
    });
  },

  'mongoose connection shut down': function(test) {
    test.expect(1);
    app.mongoose.close(function() {
      test.ok(true);
      test.done();
    });
  },
  // NOW DATABASE IS CLOSED

  'loggedIn': function(test) {
    test.expect(2);
    var u = new User;
    var a = User.anonymous();
    test.strictEqual(u.loggedIn, true);
    test.strictEqual(a.loggedIn, false);
    test.done();
  },

  'setPassword': function(test) {
    test.expect(2);
    var u = new User;
    u.setPassword('test', function(err, result) {
      test.ifError(err);
      test.strictEqual(result, true);
      test.done();
    });
  },

  'validatePassword - disabled': function(test) {
    test.expect(3);
    var u = new User;
    u.validatePassword('test', function(err, result) {
      test.ok(err);
      test.ok(err instanceof Error);
      test.strictEqual(result, false);
      test.done();
    });
  },

  'validatePassword': function(test) {
    test.expect(6);
    var u = new User;
    u.setPassword('test', function(err, result) {
      test.ifError(err);
      test.strictEqual(result, true);
      u.validatePassword('bad', function(err, result) {
        test.ifError(err);
        test.strictEqual(result, false);
        u.validatePassword('test', function(err, result) {
          test.ifError(err);
          test.strictEqual(result, true);
          test.done();
        });
      });
    });
  },

  'if JSON serialization working': function(test) {
    test.expect(5);
    var u1 = new User;
    u1.nickname = 'langpavel';
    u1.emails.push({email: 'LangPavel@skolajs.cz'});
    u1.setPassword('test', function(err, result) {
      test.ifError(err);
      test.strictEqual(result, true);

      var json = JSON.stringify(u1);
      var u2 = new User(JSON.parse(json));

      test.deepEqual(u2.toObject(), u1.toObject());
      test.strictEqual(u2.nickname, u1.nickname);
      test.strictEqual(u2.emails[0].email, u1.emails[0].email);
      test.done();
    });
  },

  'anonymous user': function(test) {
    test.expect(2);
    var a = User.anonymous();
    test.strictEqual(a.toString(), 'nepřihlášený');
    test.strictEqual(a.getPrimaryEmail(), undefined);
    test.done();
  }

};
