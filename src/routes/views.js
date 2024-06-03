import { Router } from 'express';
import { isAdmin, isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = Router();

router.get('/api/products', isAuthenticated, (req, res) => {
    const products = [
        { id: 1, title: 'Producto 1', price: 100 },
        { id: 2, title: 'Producto 2', price: 200 },
    ];

    const userName = req.session.user.userName

    res.render('products', { products, userName });
});

router.get('/admin', isAdmin, (req, res) => {
    res.send('Pagina de administrador: solo accesible para administradores')
})

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

export default router;