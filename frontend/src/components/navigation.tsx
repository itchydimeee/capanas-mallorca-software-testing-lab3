import { useNavigate } from 'react-router-dom';

interface Pog {
  id: number;
  name: string;
  ticker_symbol: string;
  price: number;
  color: string;
}

function useNavigation(cart: Pog[] = []) {
  const navigate = useNavigate();

  function navigateTo(path: string, state?: any) {
    navigate(path, { state });
  }

  function ToCreatePogs() {
    navigateTo('/pogs');
  }

  function ToLogin() {
    navigateTo('/login');
  }

  function ToAdminLogin() {
    navigateTo('/adminLogin');
  }

  function ToReadPogs() {
    navigateTo('/readPogs');
  }

  function ToUserPage() {
    navigateTo('/user');
  }

  function toCheckout() {
    navigateTo('/checkout', { state: { cart } });
  }

  return { ToCreatePogs, ToLogin, ToAdminLogin, ToReadPogs, ToUserPage, toCheckout };
}

export default useNavigation;