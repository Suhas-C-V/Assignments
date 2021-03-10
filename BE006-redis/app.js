const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
const app = express();

//redis client
let client = redis.createClient();

client.on('connect', ()=>{
    console.log('Redis connected...');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//home page
app.get('/',(req,res)=>{
  res.render('home');
});

//Search user
app.post('/users/find', (req,res)=>{
    var id = req.body.id;

    client.hgetall(id, (err,data)=>{
        if(!data){
          res.send('User does not exit!');
        }else{
          data.id = id;
          res.render('details',{user:data});
        }
    });
});

//add user
app.get('/users/add',(req,res)=>{
    res.render('adduser');
});

app.post('/users/add', (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;

  // client.setex(id, [
  //     'name', name,
  //     'email', email,
  //     'phone', phone
  // ])

  client.hmset(id, [
      'name', name,
      'email', email,
      'phone', phone
  ], (err, reply) => {
      if (err) {
          console.log(err)
      } else {
          console.log(reply)
          res.redirect('/')
      }
  });
});

//update user
app.get('/users/update/:id',(req,res)=>{
    var id = req.params.id;
    console.log(id);
    res.render('updateuser',{id:id});
});

app.post('/users/update/:id', (req, res) =>{
  var id = req.params.id;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  client.hmset(id, [
      'name', name,
      'email', email,
      'phone', phone
  ], (err, reply) => {
      if (err) {
          console.log(err)
      } else {
          console.log(reply)
          res.redirect('/')
      }
  })
})

//delete
app.delete('/users/delete/:id', function (req, res, next) {
  client.del(req.params.id)
  res.redirect('/')
})

app.listen(4000, ()=>{
  console.log('App started on port 4000!!');
});