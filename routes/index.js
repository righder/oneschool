var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path')
var Cart = require('../models/cart');
var courModel = require('../models/course');
var blogModel = require('../models/blog');
var csrf = require("csurf");
var passport = require("passport");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var course = courModel.find({});
var blog = blogModel.find({});

router.use(express.static(path.join(__dirname, './public/')));

// var csrfProtection = csrf();
// router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('shop/index', { title: 'Zapprep' });
});

// signup view
router.get('/user/signup', function (req, res, next) {
  var messages = req.flash("error");
  res.render('user/signup', {
    messages: messages,
    hasErrors: messages.length > 0,
  });
});
router.post("/user/signup", passport.authenticate("local.signup", {
  successRedirect: "/",
  failureRedirect: "/user/signup",
  failureFlash: true,
})
);

// signin view
router.get("/user/signin", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signin", {
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post("/user/signin", passport.authenticate("local.signin", {
  successRedirect: "/",
  failureRedirect: "/user/signup",
  failureFlash: true,
})
);
//admin view
router.get("/user/Admin", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/Admin", {
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post("/user/Admin", passport.authenticate("local.signin", {
  successRedirect: "/user/admin1",
  failureRedirect: "Admin",
  failureFlash: true,
})
);

//admin memeber course entry 

router.get('/user/admin1', function (req, res, next) {
  res.render('user/admin1');
});

var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({
  storage: storage
})

router.post('/user/admin1', upload.single('file'), function (req, res, next) {
  var courseDetails = new courModel({
    title: req.body.uname,
    name: req.body.yname,
    description: req.body.desc,
    link: req.body.ulink,
    image: req.file.filename,

  });
  courseDetails.save()
  res.render('user/confirm');
});

//contact view
router.get('/other/contact', function (req, res, next) {
  res.render('other/contact');
});
//forgot password view
router.get('/user/forgot', function (req, res, next) {
  res.render('user/forgot');
});

//course index
router.get('/other/courses', function (req, res, next) {

  course.exec(function (err, docs) {
    if (err) throw err;
    res.render('other/courses', { title: 'Employee Records', records: docs });
  });
});

router.post('/other/courses', function (req, res, next) {

  course.exec(function (err, docs) {
    if (err) throw err;
    res.render('other/enroll', { title: 'Employee Records', records: docs });
  });
})

// enroll index
router.get('/other/enroll/:id', function (req, res, next) {

  var productId = req.params.id;
  var c = courModel.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }

    res.render('other/enroll', { title: 'Employee Records', records: product });

  })


});

router.post('/other/enroll/:id', function (req, res, next) {

  var productId = req.params.id;

  var c = courModel.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }

    res.render('other/dashboard', { records: product });

  })
})


// dashbosrd save

router.get('/add-to-cart/', function (req, res, next) {
  // var productId = req.params.id;
  // var cart = new Cart(req.session.cart ? req.session.cart : {});

  // Product.findById(productId, function (err, product) {
  //   if (err) {
  //     return res.redirect("/");
  //   }
  //   cart.add(product, product.id);
  //   req.session.cart = cart;
  //   console.log(req.session.cart);
  //   res.redirect("/");
  // });

})



//blog entry

router.get('/user/user/blogsubmit', function (req, res, next) {
  res.render('user/blogsubmit');
});

var storage = multer.diskStorage({
  destination: "./public/uphold",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({
  storage: storage
})

router.post('/user/user/blogsubmit', upload.single('file'), function (req, res, next) {
  var blogDetails = new blogModel({
    title: req.body.un,
    name: req.body.yn,
    description: req.body.de,
    image: req.file.filename,

  });
  blogDetails.save()
  res.redirect('/');
});

//Blog index
router.get('/other/blogs', function (req, res, next) {

  blog.exec(function (err, docs) {
    if (err) throw err;
    res.render('other/blogs', { title: 'Zapprep', records: docs });
  });
});

router.post('/other/blogs', function (req, res, next) {

  blog.exec(function (err, docs) {
    if (err) throw err;
    res.render('other/blogs', { title: 'Employee Records', records: docs });
  });
})

// ------------- forgot password --------------


module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}