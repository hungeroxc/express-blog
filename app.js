const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

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

// 导入数据
let Article = require('./models/articles')


// 静态文件中间件
app.use(express.static(path.join(__dirname, 'public')))

// 首页读取数据并渲染
app.get('/', (req, res) => {
    // 读取数据
    Article.find({}, (err, articles) => {
        res.render('index', {articles})
    })
})

app.get('/articles/new', (req, res) => {
    res.render('new', {
        title: 'Add Article'
    })
})

// 创建文章路由
app.post('/articles/create',  (req, res) => {
    let article = new Article()
    const {title, author, body} = req.body
    article.title = title
    article.author = author
    article.body = body

    article.save(err => {
        if(err) {
            console.log(err)
            return
        } else {
            // 此处会跳转首页
            res.redirect('/')
        }
    })
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})

