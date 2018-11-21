const express = require('express');

// initialize our express app
const app = express();
app.engine('pug', require('pug').__express)
app.set('views', './views')
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

let port = 8080;

const users = [
  {
    id: '1',
    name: 'Dmitriy',
    position: 'Frontend Developer',
    status: true
  },{
    id: '2',
    name: 'Oleg',
    position: 'Backend Developer',
    status: true
  },{
    id: '3',
    name: 'Alex',
    position: 'QA',
    status: true
  },{
    id: '4',
    name: 'Anton',
    position: 'SEO',
    status: true
  }
];

app.get('/', function (request, response) {
  response.render('index', { users: users });
});

app.get('/user', function (request, response) {
  const user = users.filter(item => {
    return item.id == request.query.id
  })
  response.render('index', { users: user });
});

app.get('/add', function (request, response) {
  const user = users.filter(item => {
    return item.id == request.query.id
  });

  if(user.length) {
    response.render('index', { message: `User with ID ${request.query.id} is exist` });
  } else if(request.query.id && request.query.name && request.query.position) {
    const newUser = {
      id: request.query.id,
      name: request.query.name,
      position: request.query.position,
      status: true
    }
    users.push(newUser);
    response.render('index', { message: `You add new user ${request.query.name}` });
  } else {
    response.render('index', { message: 'Not valid data' });
  }
});

app.get('/delete', function (request, response) {
  const deleteUserKey = users.findIndex((item) => {
    return item.id == request.query.id
  });

  if(deleteUserKey) {
    users.splice(deleteUserKey, 1);
    response.render('index', { message: `User ${request.query.name} was delete` });
  }
});

/**
 * Rest API
 */

 app.get('/rest/user/:id', function(request, response) {
   const user = users.filter(item => {
     return item.id == request.params.id
   })
   response.render('index', { users: user });
 });

 app.post('/rest/add', function(request, response) {
   const user = users.filter(item => {
     return item.id == request.param('id')
   });

   if(user.length) {
     response.send(`User with ID ${request.params.id} is exist`);
   } else if(request.param('id') && request.param('name') && request.param('position')) {
     const newUser = {
       id: request.param('id'),
       name: request.param('name'),
       position: request.param('position')
     }
     users.push(newUser);
     response.send(`You add new user ${request.param('name')}`);
   } else {
     response.send('Not valid data');
   }
 });


 app.patch('/rest/:id', function (request, response) {
   const patchUserKey = users.findIndex((item) => {
     return item.id == request.params.id
   });

   if(patchUserKey) {
     response.send(`User ${users[patchUserKey].name} was trigger`);
     users[patchUserKey].status = !users[patchUserKey].status;
   }
 });

 app.delete('/rest/:id', function (request, response) {
   const deleteUserKey = users.findIndex((item) => {
     return item.id == request.params.id
   });

   if(deleteUserKey) {
     response.send(`User ${users[deleteUserKey].name} was delete`);
     users.splice(deleteUserKey, 1);
   }
 });

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
