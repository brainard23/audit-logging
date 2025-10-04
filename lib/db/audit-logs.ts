import { RowDataPacket, ResultSetHeader } from 'mysql2';
import getPool from './connection';
import { AuditLog, CreateAuditLogRequest } from './types';

// Audit log repository functions

export async function createAuditLog(data: CreateAuditLogRequest): Promise<AuditLog> {
  const pool = getPool();
  
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO audit_logs 
    (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.action,
      data.entity_type,
      data.entity_id || null,
      data.old_values ? JSON.stringify(data.old_values) : null,
      data.new_values ? JSON.stringify(data.new_values) : null,
      data.ip_address || null,
      data.user_agent || null,
    ]
  );

  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM audit_logs WHERE id = ?',
    [result.insertId]
  );

  const log = rows[0] as any;
  
  // Parse JSON fields (handle both string and already-parsed object)
  return {
    ...log,
    old_values: log.old_values ? (typeof log.old_values === 'string' ? JSON.parse(log.old_values) : log.old_values) : null,
    new_values: log.new_values ? (typeof log.new_values === 'string' ? JSON.parse(log.new_values) : log.new_values) : null,
  } as AuditLog;
}

export async function findAuditLogsByUserId(
  userId: number,
  limit: number = 50,
  offset: number = 0
): Promise<AuditLog[]> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [userId, limit, offset]
  );

  // Parse JSON fields for each log
  return rows.map((row: any) => ({
    ...row,
    old_values: row.old_values ? (typeof row.old_values === 'string' ? JSON.parse(row.old_values) : row.old_values) : null,
    new_values: row.new_values ? (typeof row.new_values === 'string' ? JSON.parse(row.new_values) : row.new_values) : null,
  })) as AuditLog[];
}

export async function findAuditLogById(id: number): Promise<AuditLog | null> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM audit_logs WHERE id = ?',
    [id]
  );

  if (rows.length === 0) return null;

  const log = rows[0] as any;
  return {
    ...log,
    old_values: log.old_values ? (typeof log.old_values === 'string' ? JSON.parse(log.old_values) : log.old_values) : null,
    new_values: log.new_values ? (typeof log.new_values === 'string' ? JSON.parse(log.new_values) : log.new_values) : null,
  } as AuditLog;
}

export async function findAuditLogsByAction(
  action: string,
  limit: number = 50
): Promise<AuditLog[]> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM audit_logs WHERE action = ? ORDER BY created_at DESC LIMIT ?',
    [action, limit]
  );

  return rows.map((row: any) => ({
    ...row,
    old_values: row.old_values ? (typeof row.old_values === 'string' ? JSON.parse(row.old_values) : row.old_values) : null,
    new_values: row.new_values ? (typeof row.new_values === 'string' ? JSON.parse(row.new_values) : row.new_values) : null,
  })) as AuditLog[];
}

export async function getAllAuditLogs(
  limit: number = 100,
  offset: number = 0
): Promise<AuditLog[]> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );

  return rows.map((row: any) => ({
    ...row,
    old_values: row.old_values ? (typeof row.old_values === 'string' ? JSON.parse(row.old_values) : row.old_values) : null,
    new_values: row.new_values ? (typeof row.new_values === 'string' ? JSON.parse(row.new_values) : row.new_values) : null,
  })) as AuditLog[];
}

export async function countAuditLogsByUserId(userId: number): Promise<number> {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM audit_logs WHERE user_id = ?',
    [userId]
  );

  return (rows[0] as any).count;
}
