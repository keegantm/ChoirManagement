import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: global styles
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root') // Matches the `id="root"` in `public/index.html`
);
