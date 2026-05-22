import { useLocation } from 'react-router-dom';
import ErrorPage from '@/pages/ErrorPage';

export default function ErrorPageWrapper() {
  const location = useLocation();
  const errorCode = (location.state?.errorCode || 404) as 404 | 403 | 500 | 503;

  return <ErrorPage errorCode={errorCode} />;
}
