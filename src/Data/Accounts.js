let nextId = 1;
export const generateId = (prefix = 'id') => `${prefix}_${nextId++}`;

export const initialUsers = [
  {
    _id: generateId('user'),
    name: "Edward Barry Robert",
    email: "Edward_BR@rocketmail.com",
    passwordHash: "E92f47e3",
    role: "customer",
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId('user'),
    name: "Keiko Villanueva",
    email: "keikomori@gmail.com",
    passwordHash: "K3ikoMori2025",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];