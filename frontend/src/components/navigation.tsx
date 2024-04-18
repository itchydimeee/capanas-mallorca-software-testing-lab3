import { useNavigate } from 'react-router-dom';

function useNavigation () {
  const navigate = useNavigate();

  function navigateTo(path: string) {
    navigate(path);
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
    navigateTo('/user')
  }

  return {
    ToCreatePogs,
    ToLogin,
    ToAdminLogin,
    ToReadPogs,
    ToUserPage
  };
}

export default useNavigation;
