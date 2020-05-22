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

What was done:
    Parsing given source sitemap, collecting products and scraping data for each product. Given collection 
        inserts to MySql db without duplications;

What goes to backlog:
    Missed fields
    Scraping data from all sources at the same time

Notes: 
1. To run parser with specific souce, add it to helpers/sources.ts array and insert it's index to the parce() method in index.ts file;