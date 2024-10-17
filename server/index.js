import Express from 'express'

const app = Express()

app.get('/pegar', function (req, res){
    res.send('enviar mensagem')
})

app.get('/pegaroutracoisa', function (req, res){
    res.send('enviar outra mensagem')
})



app.listen(8000)