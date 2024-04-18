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

  function ToSignUp() {
    navigateTo('/signup');
  }

  function ToReadPogs() {
    navigateTo('/readPogs');
  }

  return {
    ToCreatePogs,
    ToLogin,
    ToSignUp,
    ToReadPogs
  };
}

export default useNavigation;
