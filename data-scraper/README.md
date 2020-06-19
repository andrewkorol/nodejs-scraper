Establish connection to MySql DB:

1. Install MySql db on your machine with 'root' user and your password
2. Install MySql Workbench on your machine and create new schema 'parsedb';
3. Set your password for 'root' user in ormconfig.json under 'password' field

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

Technologies used: 
    NodeJs - i had some experiense with it and it's comfortable for such purpose;
    MySql DB - usefull open-source library with good performance;

How to use the app:
1. Go to `startup.ts` file
2. There in `start()` method you can find methods and queue you can work with. 
3. There are comment describing that it performs above each item. Uncomment one of them, save the changes and run `npm start` to make the things going :)
4. You need to wait while one queue will process all messages before run next queue. You can watch the progrees for each queue here: http://rabbit.twopointzero.eu:15672/#/queues