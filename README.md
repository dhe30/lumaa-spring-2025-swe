1. Clone this repository on your local machine 
2. cd into ./backend and create a .env file with the following variables: 
```
DB_CONNECTION_URL=postgresql://user:password@db:5432/todo
JWT_SECRET_KEY=<key>
JWT_EXPIRES_IN=1h
```
3. Replace \<key\> within the .env file with a random sequence of > 32 characters, for example: 
```
JWT_SECRET_KEY=yunkkibhyt63683gf8369f07tv7t79263yfg73tf39ydia
```
4. Go to the root directory (where the docker-compose file resides) and run the following command: 
```
docker-compose up --build
```
5. After a few minutes, the web app should be served on: [localhost:5174](http://localhost:5174/)

### Video example:

[![Video example:](https://img.youtube.com/vi/f200dvGvkig/0.jpg)](https://youtu.be/f200dvGvkig)

Salary: $22/hr