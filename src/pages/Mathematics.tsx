
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Mathematics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new unified Subjects page
    navigate('/subjects', { replace: true });
  }, [navigate]);

  return null;
};

export default Mathematics;
