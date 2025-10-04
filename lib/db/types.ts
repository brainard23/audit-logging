// Database entity types

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

// Request types for creating/updating entities
export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface CreateAuditLogRequest {
  user_id: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
}
