import { RowDataPacket, ResultSetHeader } from 'mysql2';
import getPool from './connection';
import { Profile, UpdateProfileRequest } from './types';

// Profile repository functions

export async function createProfile(userId: number): Promise<Profile> {
  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO profiles (user_id) VALUES (?)',
    [userId]
  );

  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM profiles WHERE id = ?',
    [result.insertId]
  );

  return rows[0] as Profile;
}

export async function findProfileByUserId(userId: number): Promise<Profile | null> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM profiles WHERE user_id = ?',
    [userId]
  );

  return rows.length > 0 ? (rows[0] as Profile) : null;
}

export async function findProfileById(id: number): Promise<Profile | null> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM profiles WHERE id = ?',
    [id]
  );

  return rows.length > 0 ? (rows[0] as Profile) : null;
}

export async function updateProfile(
  userId: number,
  updates: UpdateProfileRequest
): Promise<Profile | null> {
  const pool = getPool();
  
  // Build dynamic update query
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.first_name !== undefined) {
    fields.push('first_name = ?');
    values.push(updates.first_name);
  }
  if (updates.last_name !== undefined) {
    fields.push('last_name = ?');
    values.push(updates.last_name);
  }
  if (updates.bio !== undefined) {
    fields.push('bio = ?');
    values.push(updates.bio);
  }
  if (updates.avatar_url !== undefined) {
    fields.push('avatar_url = ?');
    values.push(updates.avatar_url);
  }

  if (fields.length === 0) {
    return findProfileByUserId(userId);
  }

  values.push(userId);

  await pool.execute(
    `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = ?`,
    values
  );

  return findProfileByUserId(userId);
}

export async function deleteProfile(userId: number): Promise<void> {
  const pool = getPool();
  await pool.execute('DELETE FROM profiles WHERE user_id = ?', [userId]);
}

export async function getAllProfiles(): Promise<Profile[]> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM profiles ORDER BY created_at DESC'
  );

  return rows as Profile[];
}
