import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { routes } from './routes';
import './App.css';

function App() {
  const routeElement = useRoutes(routes);

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="font-primary">{routeElement}</div>
      </ThemeProvider>
    </>
  );
}

export default App;
