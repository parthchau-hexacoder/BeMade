import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DesignProvider } from './app/providers/DesignProvider.tsx'
import { Design3DProvider } from './app/providers/Design3DProvider.tsx'
import { UIProvider } from './app/providers/UIProvider.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <UIProvider>
        <DesignProvider>
          <Design3DProvider>
          <App />
          </Design3DProvider>
        </DesignProvider>
      </UIProvider>
    </BrowserRouter>
)
