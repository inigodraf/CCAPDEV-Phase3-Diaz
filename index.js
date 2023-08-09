const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const SignupModel = require('./src/models/signupSchema');
const PostModel = require('./src/models/postSchema');
const CommentModel = require('./src/models/commentsSchema'); 
const bcrypt = require('bcrypt');
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
//const session = require('express-session');
const defaultUser = {
  _id: 'user', 
  username: 'user1', 
};

mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("CONNECTION OPEN!!!")
  })
  .catch(err => {
    console.log("CONNECTION ERROR!!!")
    console.log(err)
  });

/*
  app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy((username, password, done) => {
    SignupModel.authenticate()(username, password, (err, user) => {
      if (err) {
        console.error('Authentication error:', err);
        return done(err, false);
      }
      if (!user) {
        console.log('Authentication failed: Incorrect username or password');
        return done(null, false);
      }
      console.log('Authentication successful for user:', user.username);
      return done(null, user);
    });
  }));

passport.serializeUser(SignupModel.serializeUser());
passport.deserializeUser(SignupModel.deserializeUser());
*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'pictures')));
app.use(express.static(path.join(__dirname, 'src')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/start', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/tickets', (req, res) => {
  res.render('tickets');
});

/*
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
*/


app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new SignupModel({ username, password: hashedPassword });
    await newUser.save();

    console.log('New user saved:', newUser);

    res.redirect('/home');
  } catch (error) {
    console.error('Error saving user:', error);
    res.render('error', { error });
  }
});


  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    SignupModel.findOne({ username })
      .then(user => {
        if (user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              console.error('Error during password comparison:', err);
              res.render('error', { error: err });
            } else if (result) {
              res.redirect('/home');
            } else {
              res.render('login', { error: 'Invalid username or password.' });
            }
          });
        } else {
          res.render('login', { error: 'Invalid username or password.' });
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        res.render('error', { error });
      });
  });

  app.get('/getposts', async (req, res) => {
    try {
      const posts = await PostModel.find()
        .populate('user', 'username')
        .sort({ createdAt: -1 });
  
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'An error occurred while fetching posts' });
    }
  });

    app.get('/logout', (req, res) => {
      res.redirect('/start');
    });


    app.get('/home', async (req, res) => {
      try {
        const posts = await PostModel.find()
          .populate('user', 'username')
          .sort({ createdAt: -1 });
    
        console.log('Fetched posts:', posts); 
    
        res.render('home', { posts, defaultUser });
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.render('error', { error });
      }
    });


    app.post('/createpost', async (req, res) => {
      const { text } = req.body;
  
      try {
          const newPost = new PostModel({ text });
          await newPost.save();
  
          console.log('New post saved:', newPost);
          res.status(200).json({ text: newPost.text });
      } catch (error) {
          console.error('Error creating post:', error);
          res.status(500).json({ error: 'An error occurred while creating the post' });
      }
  });

app.delete('/deletepost', async (req, res) => {
    const postId = req.params.postId;
  
    try {
      const result = await PostModel.deleteOne({ _id: postId });
  
      if (result.deletedCount > 0) {
        console.log('Post deleted successfully');
        res.json({ success: true });
      } else {
        console.error('Failed to delete post');
        res.json({ success: false });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'An error occurred while deleting the post' });
    }
  });

  app.post('/submitcomment', async (req, res) => {
    const { postId, comment } = req.body;
  
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const newComment = new CommentModel({ postId, comment });
      await newComment.save();
  
      console.log('New comment saved:', newComment);
      res.json({ success: true });
    } catch (error) {
      console.error('Error submitting comment:', error);
      res.status(500).json({ error: 'An error occurred while submitting the comment' });
    }
  });
  

async function createDefaultPosts() {
  try {
    const defaultPosts = [
      { text: 'is this real?', username: '_rfxxxx' },
      { text: 'Hello Im mrBest', username: 'MrBest' },
      { text: 'JDM NUMBA WAN', username: 'Bamon Rautista' },
      { text: 'Lmao', username: 'balak obaka' },
      { text: 'Better than X', username: '_mdg' },
    ];

    for (const post of defaultPosts) {
      const user = await SignupModel.findOne({ username: post.username });
      if (!user) continue; 

      const newPost = new PostModel({ user, text: post.text });
      await newPost.save();
      console.log('New default post saved:', newPost);
    }
  } catch (error) {
    console.error('Error creating default posts:', error);
  }
}

createDefaultPosts();



app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});
