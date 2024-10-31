import Express from 'express';
import { User, criarTabelas } from './db.js'
import bycript from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const app = Express()
app.use(Express.json())
app.use(cors())

// app.get('/pegar', function (req, res) {
//     res.send('enviar esta mensagem')
// })

// app.get('/pegar2', function (req, res) {
//     res.send('Mensagem 2')
// })

// criarTabelas() 

app.post('/registro', async function (req, res) {
    // verificar se todos os campos foram enviados
    try {
        const { nome, sobrenome, email, senha, dataNascimento } = req.body
        if (!nome || !sobrenome || !email || !senha || !dataNascimento) {
            res.status(406).send('todos os campos devem ser preenchidos')
            return
        }
        if (await User.findOne({ where: { email: email } })) {
            res.status(400).send('usuario ja cadastrado')
            return
        }
        const senhaSegura = bycript.hashSync(senha, 10)

        const novoUsuario = User.create({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: senhaSegura,
            dataNascimento: dataNascimento,
        })
        res.status(201).send('ok usuario criado')
    } catch (erro) {
        console.log(erro)
    }
})

app.post('/login', async function (req, res) {
    // validar informações

    try {
        const { email, senha } = req.body
        if (!email || !senha) {
            res.status(406).send('todos os campos devem ser preenchidos')
            return  
        }
        // verificar a existencia do usuario

        const usuario = await User.findOne({ where: { email: email } })
        if (!usuario) {
            res.status(404).send('este usuario não está cadastrado')
            return
        }

        // compara a senha enviada com a senha do banco de dados

        const senhaCorreta = bcryptjs.compareSync(senha, usuario.senha)
        if (!senhaCorreta) {
            res.status(403).send('senha incorreta')
            return
        }
        // criar eum token de autenticação
        const token = jwt.sign(
            {
                nome: usuario.nome,
                email: usuario.email,
                status: usuario.status
            },
            'chavecriptografiasupersegura',
            {
                expiresIn: "30d"
            }
        )

        console.log(token)

        // devolver a resposta com o token  

        res.status(200).send({ msg: 'voce foi logado', token: token })

    } catch (erro) {
        console.log(erro)
        res.status(500).send('houve um problema')
    }
})

app.listen(8000)