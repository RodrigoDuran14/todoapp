import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="text" label="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <Input type="email" label="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Registrarse
      </Button>
    </form>
  );
};

export default RegisterForm;