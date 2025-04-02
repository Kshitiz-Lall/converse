import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { routes } from './routes';
import './App.css';
import { Toaster } from 'sonner';

function App() {
  const routeElement = useRoutes(routes);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster richColors />
        <div className="font-primary">{routeElement}</div>
      </ThemeProvider>
    </>
  );
}

export default App;
