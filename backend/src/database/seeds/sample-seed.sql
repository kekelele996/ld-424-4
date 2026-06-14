insert into audit_logs (id, actor_id, actor_role, action, resource, metadata, created_at)
values (gen_random_uuid(), 'seed', 'Admin', 'SEED_READY', 'system', '{}', now());
