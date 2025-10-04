import { RowDataPacket, ResultSetHeader } from 'mysql2';
import getPool from './connection';
import { User, CreateUserRequest } from './types';

// User repository functions

export async function createUser(email: string, passwordHash: string): Promise<User> {
  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );

  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE id = ?',
    [result.insertId]
  );

  return rows[0] as User;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  return rows.length > 0 ? (rows[0] as User) : null;
}

export async function findUserById(id: number): Promise<User | null> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );

  return rows.length > 0 ? (rows[0] as User) : null;
}

export async function updateUserPassword(id: number, passwordHash: string): Promise<void> {
  const pool = getPool();
  await pool.execute(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, id]
  );
}

export async function deleteUser(id: number): Promise<void> {
  const pool = getPool();
  await pool.execute('DELETE FROM users WHERE id = ?', [id]);
}

export async function getAllUsers(): Promise<User[]> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users ORDER BY created_at DESC'
  );

  return rows as User[];
}
