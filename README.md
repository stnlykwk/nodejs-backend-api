# Back-end Assessment

This application was created for a take-home assessment and consists of two back-end APIs - one to show the server is up `(/api/ping)` and one to retrieve blog posts from an external API `(/api/posts)`.  
  
This is the first back-end server I created from scratch. From the Express skeleton to unit tests to caching - all were a first to me.  In total, I spent an estimated 10-15 hours over 5 days to complete this project, using various StackOverflow/Medium/etc. posts along with official documentation.  
  
I used `express` to generate a skeleton project and developed on top of it. Manual API testing was done using `Postman` and unit testing was done using `mocha`, `chai`, and `nock`. To minimize external API calls, caching was implemented using `node-cache` and each item will be cached for 15 minutes.  
  
## Usage
1. In the terminal, navigate to the project directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server - it is run on port 3000
4. Navigate to `http://localhost:3000/api/ping` for Route 1 (ping)
5. Navigate to `http://localhost:3000/api/posts?tags=history,tech&sortBy=likes&direction=desc` for Route 2 (posts)
    * valid `sortBy` parameters: "id", "reads", "likes", "popularity"
    * valid `direction` parameters: "desc", "asc"
6. Run `npm test` to run unit tests