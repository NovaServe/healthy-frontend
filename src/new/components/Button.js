import React from 'react';
import { Link } from 'react-router-dom';

function Button({title, link}) {
    return (
        <Link to={link}>
            <button className='btn-custom'>{title}</button>
        </Link>
    );
}

export default Button;