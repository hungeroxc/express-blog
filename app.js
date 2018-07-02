const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')

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

// 设置模板地址
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎
app.set('view engine', 'pug')


app.get('/', (req, res) => {
    let articles = [
        {
            id: 1,
            title: 'title one',
            author: 'oxc'
        },
        {
            id: 2,
            title: 'title two',
            author: 'oxc'
        },
        {
            id: 3,
            title: 'title three',
            author: 'oxc'
        }
    ]
    res.render('index', {articles})
})

app.get('/articles/new', (req, res) => {
    res.render('new', {
        title: 'Add Article'
    })
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})

