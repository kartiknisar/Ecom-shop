
const express = require('express');

const { handleErrors } = require('./middlewares')
const userRepo = require('../../repository/users')
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUSer } = require('./validators')


const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});




router.post('/signup', [
  requirePasswordConfirmation,
  requirePassword,
  requireEmail,
],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    // create a user in our user repo to represent this person
    const user = await userRepo.create({ email, password });

    //store the id of that user inside the users cookie
    req.session.userId = user.id; //added by cookie session

    //res.send('Account Created')
    res.redirect('/admin/products')
  });


router.get('/signout', (req, res) => {

  req.session = null;

  res.send('you are logged out ')
})

router.get('/signin', (req, res) => {

  res.send(signinTemplate({}));

});

router.post('/signin', [requireEmailExists, requireValidPasswordForUSer],
  handleErrors(signinTemplate),
  async (req, res) => {

    const { email } = req.body;

    const user = await userRepo.getOneBy({ email })

    req.session.userId = user.id;
    res.redirect('/admin/products')
    //res.send("you are signed in")

  });

module.exports = router;