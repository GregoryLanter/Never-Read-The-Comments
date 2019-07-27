
## Technology
Here we have a full stack application that uses 1. express, 2. express-handlebars, 3. mongoose, 4. cheerio and 5. axios
The program uses two colletions one for the article and one for the notes. When a note is saved the article associated with the note is updated with the new notes ID.

## Functionality
The user can request a scrape atrictles from the hockey news.  
Then the user can save any of the articles they choose.
The user can view the saved articles and add comments.
The user may remove comments or articles from the saved data.

### Future development
Right now the when comments are deleted they are deleted in the notes collection but the ID stay in the article collection. The code there is not working
Right now the program doesn't check to see if the user has aready saved an article so they can save mutiple instances of the same article.

### Deployment 
The program is deployed at https://intense-forest-15859.herokuapp.com/
