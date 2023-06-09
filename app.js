const express = require('express');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');
const http = require('http');
const https = require('https');
const morgan = require('morgan'); //logging
const helmet = require('helmet');
const hpp = require('hpp');
const { sequelize } = require('./models');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config(); // process.env
const passport = require('passport');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const searchRouter = require('./routes/search');
const userRouter = require('./routes/user');
const subsRouter = require('./routes/subs');
// const mypageRouter = require('./routes/mypage');
const profileRouter = require('./routes/profile');
const paymentRouter = require('./routes/payment');
const donateRouter = require('./routes/donate');

const fs = require('fs');

const ssl_options = {
   ca: fs.readFileSync('/etc/letsencrypt/live/www.givou.site/fullchain.pem'),
   key: fs.readFileSync('/etc/letsencrypt/live/www.givou.site/privkey.pem'),
   cert: fs.readFileSync('/etc/letsencrypt/live/www.givou.site/cert.pem'),
};

const cors = require('cors');
const passportConfig = require('./passport');
const { isLoggedIn } = require('./middlewares');

const app = express();
const corsConfig = {
   //origin: 'http://www.givou.site/',
   origin: true,
   credentials: true,
};

app.use(cors(corsConfig));
passportConfig();

app.set('httpPort', 7010);
app.set('httpsPort', 8010);

app.use(morgan('dev')); // 개발모드 logging
app.use(helmet({ contentSecurityPolicy: false }));
app.use(hpp());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
sequelize
   .sync({ force: false }) // 개발 시 true 배포 시 false
   .then(() => {
      console.log('DB 연결 성공');
   })
   .catch(err => {
      console.error(err);
   });

app.use(express.static(path.join(__dirname, 'public'))); // front에서 접근 가능한 폴더
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use('/img', express.static(path.join(__dirname, 'uploadsSubs')));
app.use('/img', express.static(path.join(__dirname, 'uploadsProfileImage')));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form 요청 // req.body 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
   session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
         httpOnly: false,
         secure: false,
         path: '/',
         maxAge: 60 * 60 * 24 * 7,
         sameSite: 'strict',
      },
      name: 'token',
   }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/search', searchRouter);
app.use('/user', userRouter);
app.use('/subs', subsRouter);
app.use('/payment', paymentRouter);
app.use('/profile', profileRouter);
app.use('/donate', donateRouter);
// const options = {
//   key: fs.readFileSync("config/172.30.1.8-key.pem"),
//   cert: fs.readFileSync("config/172.30.1.8.pem"),
// };

app.get('/', (req, res) => {
   res.cookie('test', 'test2');
   res.send('test');
});

app.get('/im', (req, res) => {
   res.sendFile(__dirname + '/test.html');
});

app.get('/', (req, res) => {
   res.cookie('test', 'test2');
});

app.post('/test', (req, res) => {
   res.send('test');
});

app.use((req, res, next) => {
   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
   error.status = 404;
   next(error);
});

app.use((err, req, res, next) => {
   res.locals.message = err.message;
   res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
   res.status(err.status || 500);
   res.send('error');
});

app.listen(app.get('httpPort'), () => {
   console.log(app.get('httpPort'), '번 포트에서 대기중');
});

const httpsServer = https.createServer(ssl_options, app);

httpsServer.listen(app.get('httpsPort'), () => {
   console.log('https 서버 리슨');
});
