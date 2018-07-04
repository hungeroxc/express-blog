const express = require('express')
const { check, validationResult } = require('express-validator/check')

const router = express.Router()

let Article = require('../models/articles')

// 首页读取数据并渲染
router.get('/', (req, res) => {
    // 读取数据
    Article.find({}, (err, articles) => {
        res.render('articles/index', {articles})
    })
})

// 跳转新增文章页面
router.get('/new', (req, res) => {
    res.render('articles/new', {
        title: 'Add Article'
    })
})


// 新增文章路由
router.post('/create', [
    // 验证
    check('title').isLength({min: 1}).withMessage('Title is required'),
    check('body').isLength({min: 1}).withMessage('Body is required'),
    check('author').isLength({min: 1}).withMessage('Author is required')
],  (req, res) => {
    // 先判断验证结果
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.render('articles/new', {
            errors: errors.array(),
            title: 'Add Article',
        })
    } else {
        const article = new Article()
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
    }
})

// 点击文章标题查看文章
router.get('/:id', (req, res) => {
    const params = req.params
    Article.findById(params.id, (err, article) => {
        if(err) throw err
        res.render('articles/show', {article})
    })
})

// 跳转修改页面
router.get('/:id/edit', (req, res) => {
    const params = req.params
    Article.findById(params.id, (err, article) => {
        if(err) throw err
        res.render('articles/edit', {
            article,
            title: 'Edit Article'
        })
    })
})

// 修改文章
router.post('/update/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router
