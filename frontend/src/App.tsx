import React from 'react';
import { AppRouter } from './router/AppRouter';
import { Navbar } from './components/layout/Navbar';
import { CartProvider } from './context/CartContext';
import './App.css';

const App: React.FC = () => {
    return (
        <CartProvider>
            <div>
                <Navbar />
                <AppRouter />
            </div>
        </CartProvider>
    );
};

export default App;
