import { useNavigate } from 'react-router-dom';

function useNavigation () {
  const navigate = useNavigate();

  function navigateTo(path: string) {
    navigate(path);
  }

  function ToUserPogs() {
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
    ToUserPogs,
    ToLogin,
    ToSignUp,
    ToReadPogs
  };
}

export default useNavigation;
