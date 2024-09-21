import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';

const app = express();

// Configura EJS como a engine de renderização de templates
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

// Middleware para permitir dados no formato JSON
app.use(express.json());
// Middleware para permitir dados no formato URLENCODED
app.use(express.urlencoded({ extended: true }));


app.get('/users', async (req: Request, res: Response) => {
    const [rows] = await connection.query("SELECT * FROM users");
    res.render('users/index', { users: rows });
});


app.get('/users/add', (req: Request, res: Response) => {
    res.render('users/cadastro');
});


app.post('/users', async (req: Request, res: Response) => {
    const { name, email, password, role, is_active } = req.body;
    const insertQuery = "INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)";
    await connection.query(insertQuery, [name, email, password, role, is_active ? 1 : 0]);
    res.redirect('/users');
});


app.post('/users/:id/delete', async (req: Request, res: Response) => {
    const id = req.params.id;
    await connection.query("DELETE FROM users WHERE id = ?", [id]);
    res.redirect('/users');
});

app.get('/login', (req: Request, res: Response) => {
    res.render('login');
});


app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
        res.redirect('/login'); 
    
});


app.get('/', (req: Request, res: Response) => {
    res.render('index');
});


app.listen(3000, () => console.log("Server is listening on port 3000"));
