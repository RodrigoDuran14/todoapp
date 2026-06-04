import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="email" label="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Iniciar sesión
      </Button>
    </form>
  );
};

export default LoginForm;