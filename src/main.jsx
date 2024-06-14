import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import { Provider } from 'react-redux'

import gameEngine from "./gameEngine/GameEngine.js";

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <Provider store={store}>
        <App gameEngine={gameEngine}/>
    </Provider>
</React.StrictMode>
)
