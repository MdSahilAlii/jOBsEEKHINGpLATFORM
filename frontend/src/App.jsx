import { useRoutes } from 'react-router';
import { routes } from '@/routes';
// import signup from '@/pages/signup';
const App = () => {
  
  return useRoutes(routes);
};
export default App;