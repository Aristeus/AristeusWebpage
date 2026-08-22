const USERS_KEY = 'aristeus_users';
const SESSION_KEY = 'aristeus_session';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface Session {
  userId: string;
  email: string;
  name: string;
}

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function register(name: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  
  if (users.some(u => u.email === email)) {
    return { success: false, error: 'Este correo ya está registrado' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  };

  users.push(newUser);
  saveUsers(users);

  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
  saveSession(session);

  return { success: true };
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Credenciales incorrectas. Verifica tu correo y contraseña.' };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };
  saveSession(session);

  return { success: true };
}

export function logout(): void {
  clearSession();
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function getCurrentUser(): Session | null {
  return getSession();
}
