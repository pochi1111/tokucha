const express = require('express');
const mysql = require('mysql');
const app = express();
const session = require("express-session");
const bodyParser = require('body-parser'); // body-parser
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret:"my_secret_key",resave:false,saveUninitialized:false,}));

//↓でmysqlに接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kuni7921',
  database: 'tokucha'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});
//ここまで
//ここまでは設定や接続など

app.get('/', (req, res) => {
  connection.query(
    "select * from maincomment",
    (error,results) => {
      res.render("home.ejs",{commentdata:results});
    }
  );
});

app.get("/login",(req,res) => {
  res.render("login.ejs");
});

app.post('/check', 
  (req, res) => {
    let comment = req.body.comment;
    let upuser = req.body.upuser;
    let comment_length = comment.length;
    let upuser_length = upuser.length;
    if (comment_length != 0 && upuser_length != 0){
      connection.query(
        'INSERT INTO maincomment (comment,user) VALUES (?, ?)',
        [comment,upuser],
        (error, results) => {
          res.redirect('/');
        }
      );
    }else{
      //ここに空字だった時の処理
      res.redirect("/")
    }
  }
);

app.listen(3000);



//実行には
//nodemon app.js          //<<<node app.js>>>//
//停止はctrl+C
//net start mysql57
//mysql --user=root --password
//net stop mysql57
//exit;
//IP =>  192.168.11.4

//maincommentクエリのカラム
//id,comment,user

//DESCRIBE テーブル名;でカラム一覧を表示