import { useNavigate } from 'react-router-dom';

interface Pog {
  quantity: number;
  id: number;
  name: string;
  ticker_symbol: string;
  price: number;
  color: string;
}

const useNavigation = (onCheckout?: (selectedPogs: Pog[]) => void) => {
  const navigate = useNavigate()

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
  function ToInventory() {
    navigateTo('/inventory')
  }

  const ToCheckout = (selectedPogs: Pog[]) => {
    if (onCheckout) {
      onCheckout(selectedPogs)
    } else {
      navigate('/checkout', { state: { selectedPogs } })
    }
  }

  return { ToCreatePogs, ToLogin, ToAdminLogin, ToReadPogs, ToUserPage, ToCheckout, ToInventory };
}

export default useNavigation;