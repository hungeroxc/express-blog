const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')

// 设置post路由读取数据的中间件
app.use(bodyParser.urlencoded({extended: false}))


// 设置模板地址
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎
app.set('view engine', 'pug')


// 链接数据库
mongoose.connect("mongodb://localhost/express-blog")
// 获取connection
const db = mongoose.connection
// 链接成功监听
db.once('open', () => {
    console.log('Connected to Mongodb')
})
// 链接出错监听
db.on('error', err => {
    console.log(err)
})

// 引入session库，以中间件的形式使用
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// 显示更改信息
app.use(require('connect-flash')())
app.use((req,res,next) => {
    res.locals.messages = require('express-messages')(req, res)
    next()
})

// 导入数据
let Article = require('./models/articles')


// 静态文件中间件
app.use(express.static(path.join(__dirname, 'public')))

// 使用article路由
const articles = require('./routes/articles')
app.use('/articles', articles)

// 首页读取数据并渲染
app.get('/', (req, res) => {
    // 读取数据
    Article.find({}, (err, articles) => {
        res.render('articles/index', {articles})
    })
})




app.listen(3000, () => {
    console.log('Server started on port 3000')
})

