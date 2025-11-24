import React from 'react';
import { AppRouter } from './router/AppRouter';
import { Navbar } from './components/layout/Navbar';
import './App.css';

const App: React.FC = () => {
    return (
        <div>
            <Navbar />
            <AppRouter />
        </div>
    );
};

export default App;
