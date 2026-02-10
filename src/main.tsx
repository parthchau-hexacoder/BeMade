import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DesignProvider } from './app/providers/DesignProvider.tsx'
import { Design3DProvider } from './app/providers/Design3DProvider.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <DesignProvider>
      <Design3DProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Design3DProvider>
    </DesignProvider>
)
