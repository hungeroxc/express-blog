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

// 首页读取数据并渲染
app.get('/', (req, res) => {
    // 读取数据
    Article.find({}, (err, articles) => {
        res.render('index', {articles})
    })
})

// 跳转新增文章页面
app.get('/articles/new', (req, res) => {
    res.render('new', {
        title: 'Add Article'
    })
})


// 新增文章路由
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
            req.flash('success', 'Article Added')
            res.redirect('/')
        }
    })
})

// 点击文章标题查看文章
app.get('/articles/:id', (req, res) => {
    const params = req.params
    Article.findById(params.id, (err, article) => {
        if(err) throw err
        res.render('show', {article})
    })
})

// 跳转修改页面
app.get('/articles/:id/edit', (req, res) => {
    const params = req.params
    Article.findById(params.id, (err, article) => {
        if(err) throw err
        res.render('edit', {
            article,
            title: 'Edit Article'
        })
    })
})

// 修改文章
app.post('/articles/update/:id', (req, res) => {
    const query = {_id: req.params.id}
    Article.update(query, req.body, err => {
        if(err) {
            console.log(err)
            return
        } else {
            // 此处会跳转首页
            req.flash('success', 'Article updated')
            res.redirect('/')
        }
    })
})

// 删除文章
app.delete('/articles/:id', (req, res) => {
    const query = {_id: req.params.id}
    Article.remove(query, err => {
        if(err) {
            console.log(err)
            return
        }
        req.flash('success', 'Article Deleted')
        res.send('success')
    })
})




app.listen(3000, () => {
    console.log('Server started on port 3000')
})

