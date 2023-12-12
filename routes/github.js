const router = require("express").Router()
const isLoggedIn = require('../middleware/authorization')
const{passport} = require("../middleware/passport")
module.exports = router


//Github Authorization
router.get('/', passport.authenticate(
    'github', 
    {
        scope: ['user', 'user:email']
    }
))

//Github Profile
router.get('/profile', isLoggedIn, (req,res) => {
    res.render('profile', {
        user: req.user
    })
})

//Github Account Link
router.get('/connect', passport.authorize(
    'github',
    {
        scope: ['user', 'user:email']
    })
)

//Github Account Unlink
router.get('/unlink', (req,res) => {
    var user = req.user

    //Sets the token property to null to disconnect the user

    user.github.token = null
    user.save((err) => {
        if(err) throw err
        res.redirect('/auth/github/profile')
    })
})

//Github Callback
router.get('/callback', passport.authenticate(
    'github',
    {
        successRedirect: '/auth/github/profile',
        failureRedirect: '/home'
    }
))