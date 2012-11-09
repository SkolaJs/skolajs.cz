[SkolaJs.cz] website
==================


Prerequisites:
--------------
* [node] 0.8
* [redis] 2.6.3
* [mongodb] 2.2.1

[node]: http://nodejs.org/
[redis]: http://redis.io/
[mongodb]: http://www.mongodb.org/


How to setup development environment:
-------------------------------------

1. Setup prerequisites

2. Clone repository:
   ```
     $ git clone git://github.com/SkolaJs/skolajs.cz.git
   ```

3. Run development environment setup script.
   ```
     $ ./setup-env
   ```
   This will copy all `*.example.*` files
   This will create git pre-commit jslint validation hook too

4. Edit (or review) configuration files. You should setup nodemailer there.
   ```
     $ editor ./data/redis.conf
     $ editor ./data/mongo.conf
     $ editor ./config.js
     $ editor ./config-test.js
   ```

5. Run database servers.
   ```
     $ ./data/start
   ```
   *OR*
   ```
     $ ./data/run-redis
     $ ./data/run-mongo
   ```
   *Note:* mongo can boot longer.
   *Note:* in default configuration redis run as daemon but mongo doesn't. 
   `./data/start` script starts mongo in background too

6. It is good idea to run tests now:
   ```
     $ make test
   ```
   *OR* if you want to test nodemailer setup too
   ```
     $ TEST_MAIL=yes make test
   ```

7. Start server in development mode
   ```
     $ ./development
   ```

8. Go throught code and then open an [issue] or even better pull request
   
9. **Be happy! :-)**

[SkolaJs.cz]: http://skolajs.cz/
[issue]: https://github.com/SkolaJs/skolajs.cz/issues
[nodeunit]: https://github.com/caolan/nodeunit
