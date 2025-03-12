import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { routes } from './routes';

function App() {
  const routeElement = useRoutes(routes);

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="app">{routeElement}</div>
      </ThemeProvider>
    </>
  );
}

export default App;
