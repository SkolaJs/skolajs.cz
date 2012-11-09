if (!process.env.TEST_MAIL) {
  console.warn('TEST_MAIL environment variable is not set, ' +
               'mailer test will NOT be executed');

  return;
}


process.env.NODE_ENV = 'test';
var config = require('../app/config');
var app = {};

exports['User'] = {
  'Is mailer available': function(test) {
    test.expect(1);

    require('../app/mailer')(app, config);
    test.ok(app.sendMail);

    test.done();
  },

  'Can mailer send emails': function(test) {
    test.expect(3);

    var mailOptions = {
      from: 'Nodemailer Test ✔ <langpavel@phpskelet.org>',
      to: 'langpavel@gmail.com',
      subject: 'Hello from Nodemailer unit test ✔',
      text: 'Hello from unit test ✔',
      html: '<b>Hello</b> from unit test <big>✔</big>'
    };

    app.sendMail(mailOptions, function(error, response) {
      test.ifError(error);
      test.ok(response);
      test.deepEqual(response.failedRecipients, []);
      test.done();
    });
  },

  'Close the transport': function(test) {
    test.expect(1);
    app.sendMail.close(function(error) {
      test.ifError(error);
      test.done();
    });
  },

  'Email defaults': function(test) {
    test.expect(3);

    var mailOptions = {
      to: 'langpavel@gmail.com',
      html: '<b>Hello</b> from unit test <big>✔</big>'
    };

    app.sendMail(mailOptions, function(error, response) {
      test.ifError(error);
      test.ok(response);
      test.deepEqual(response.failedRecipients, []);
      test.done();
    });
  },

  'Finally, close the transport again': function(test) {
    test.expect(1);
    app.sendMail.close(function(error) {
      test.ifError(error);
      test.done();
    });
  }

};
