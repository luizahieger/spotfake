import Express from 'express';
import { User, criarTabelas } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = Express();
app.use(Express.json());
app.use(cors());

//criarTabelas() 

app.post('/registro', async function (req, res) {
    try {
        const { nome, sobrenome, email, senha, dataNascimento } = req.body;

        // Verifica se todos os campos foram enviados
        if (!nome || !sobrenome || !email || !senha || !dataNascimento) {
            res.status(406).send('todos os campos devem ser preenchidos');
            return;
        }

        // Verifica se o usuário já existe
        if (await User.findOne({ where: { email: email } })) {
            res.status(400).send('Usuario ja cadastrado');
            return;
        }

        const senhaSegura = bcrypt.hashSync(senha, 10);

        await User.create({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: senhaSegura,
            dataNascimento: dataNascimento,
        });

        res.status(201).send('ok usuario criado');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro interno no servidor');
    }
});

app.post('/login', async function (req, res) {
    try {
        const { email, senha } = req.body;

        // Verifica se todos os campos foram preenchidos
        if (!email || !senha) {
            res.status(406).send('todos os campos devem ser preenchidos');
            return;
        }

        // Verifica se o usuário existe
        const usuario = await User.findOne({ where: { email: email } });
        if (!usuario) {
            res.status(404).send('este usuario não está cadastrado');
            return;
        }

        // Compara a senha enviada com a senha do banco de dados
        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaCorreta) {
            res.status(403).send('senha incorreta');
            return;
        }

        // Cria um token de autenticação
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
        );

        // Devolve a resposta com o token
        res.status(200).json({ msg: 'voce foi logado', token: token });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('houve um problema');
    }
});

app.get('/:email/', async function (req, res) {
    try {
        const { email } = req.params


        const usuario = await User.findOne({ where: { email: email } })
        if(!usuario){
            res.status(404).send('usuario não encontrado')
        }

        res.status(200).send(usuario);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro interno no servidor');
    }
});

app.post('/:email/foto_perfil', async function (req, res) {
    try {
        const { url } = req.body;
        const { email } = req.params

        // Verifica se todos os campos foram enviados
        if (!url) {
            res.status(406).send('o campo deve ser preenchido');
            return;
        }

        // Verifica se o usuário já existe
        const usuario = await User.findOne({ where: { email: email } })
        if(!usuario){
            res.status(404).send('usuario não encontrado')
        }


        await usuario.update({
            foto: url,
        });

        res.status(200).send('usuario atualizado');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro interno no servidor');
    }
});

app.put('/:email/nova_senha', async function (req, res) {
    try {
        const { senha } = req.body;
        const { email } = req.params

        // Verifica se todos os campos foram enviados
        if (!senha) {
            res.status(406).send('o campo deve ser preenchido');
            return;
        }

        // Verifica se o usuário já existe
        const usuario = await User.findOne({ where: { email: email } })
        if(!usuario){
            res.status(404).send('usuario não encontrado')
        }

        const senhaSegura = bcrypt.hashSync(senha, 10);

        await usuario.update({
            senha: senhaSegura,
        });

        res.status(200).send('usuario atualizado');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro interno no servidor');
    }
});

app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});