const express = require('express')
const app = express()
const path = require('path')

// 设置模板地址
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎
app.set('views engine', 'pug')


app.get('/', (req, res) => {
    res.send('ok')
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})

