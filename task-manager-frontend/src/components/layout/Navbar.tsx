import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const {logout, isAuthenticated } = useAuth()
    return (
        <nav>
            <ul>
                { isAuthenticated ? (
                    <>
                        <li><button onClick={logout}>Sair</button></li>
                    </>
                ) : (
                <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Cadastrar</Link></li>
                </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar;