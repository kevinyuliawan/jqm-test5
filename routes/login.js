var User = require('../models/user');

exports.get = function(req, res){
  // handle a logout if specified in query, coming from the logout button
  if(req.query.out == 'true'){
    console.log('req.query.out is: ' + req.query.out);
    req.session.destroy();
  };

  res.render('login', { 
    title: 'Login', 
    pageid: 'loginpage',
    logout: req.query.out,
    navbar: false
   });
};

exports.post = function(req, res){
  // get the values from the form
  var submitted = req.body.email;
  var submittedPass = req.body.password;
  var submittedType = 'email'; // default value

  // check if there's an @ sign in the submitted email box; if not, then it is a phone number
  if (submitted.indexOf('@') == -1){submittedType = 'phone'};

  // callback for when user is found, need to verify their password
  function found(user){
    if (user.password == submittedPass)
      {
        // initialize session's variables from the user object
        req.session.username = user.firstname;
        req.session.email = user.email;
        req.session.phone = user.phone;
        req.session.profiles = user.profiles;
        req.session.uid = user._id;
        res.redirect('/home')
      }
    else
      renderIncorrectLogin();
  }

  function renderIncorrectLogin(){
    res.render('login', {title: 'Login', pageid: 'loginpage', error: true, navbar: false});
  }

  // build the mongo query using the submitted type and what's submitted
  var query = {};
  query[submittedType] = submitted;

  User.model.findOne(query, function(err, user){
    if (err){res.redirect('/error'); console.log('The error: ' + err)}
    else if (user != null){console.log('Successful find: ' + user); found(user)}
    else {console.log('No user found; request was: ' + submitted + ' and type was: ' + submittedType); renderIncorrectLogin()};
  });

};