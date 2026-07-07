// Shared persistent user store — bridges AdminPortal (create/edit) and LoginScreen (auth)

export const USERS_STORE_KEY = 'saucam_staff_users_v1';

export interface StaffUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'Teller' | 'Branch Manager' | 'Compliance Officer';
  assignedCountry: string;
  assignedBranch: string;
  email: string;
  lastActive: string;
  status: 'Active' | 'Disabled';
}

export const defaultUsers: StaffUser[] = [
  { id: '1', name: 'Jessica Martinez', username: 'jessica.m', password: 'teller123', role: 'Teller',             assignedCountry: 'Nigeria',        assignedBranch: 'Downtown Main Office',    email: 'jessica.m@saucam.com',  lastActive: '2 minutes ago',  status: 'Active'   },
  { id: '2', name: 'Emeka Okonkwo',    username: 'emeka.o',   password: 'teller123', role: 'Teller',             assignedCountry: 'Nigeria',        assignedBranch: 'Victoria Island Branch', email: 'emeka.o@saucam.com',    lastActive: '15 minutes ago', status: 'Active'   },
  { id: '3', name: 'Mary Okafor',      username: 'mary.o',    password: 'comply123', role: 'Compliance Officer', assignedCountry: 'All Countries',   assignedBranch: 'All Branches',           email: 'mary.o@saucam.com',     lastActive: '1 hour ago',     status: 'Active'   },
  { id: '4', name: 'Chioma Nwosu',     username: 'chioma.n',  password: 'manage123', role: 'Branch Manager',     assignedCountry: 'Nigeria',        assignedBranch: 'Lekki Branch',           email: 'chioma.n@saucam.com',   lastActive: '3 hours ago',    status: 'Active'   },
  { id: '5', name: 'Bolaji Adeyemi',   username: 'bolaji.a',  password: 'teller123', role: 'Teller',             assignedCountry: 'Nigeria',        assignedBranch: 'Ikeja Branch',           email: 'bolaji.a@saucam.com',   lastActive: '2 days ago',     status: 'Disabled' },
];

export function getUsers(): StaffUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORE_KEY);
    if (raw) return JSON.parse(raw) as StaffUser[];
  } catch {}
  persistUsers(defaultUsers);
  return [...defaultUsers];
}

export function persistUsers(users: StaffUser[]): void {
  localStorage.setItem(USERS_STORE_KEY, JSON.stringify(users));
}

export function authenticateUser(username: string, password: string): StaffUser | null {
  const users = getUsers();
  const u = users.find((x) => x.username.toLowerCase() === username.toLowerCase() && x.password === password && x.status === 'Active');
  return u ?? null;
}
