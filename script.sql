BEGIN;

-- Inserta los roles base si no existen.
INSERT INTO roles (name) VALUES
  ('ADMIN'),
  ('USER')
ON CONFLICT (name) DO NOTHING;

-- Asigna todos los permisos disponibles al rol ADMIN.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

-- Asigna solo permisos GET al rol USER.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'USER' AND p.method = 'GET'
ON CONFLICT DO NOTHING;

-- Marca el primer usuario como administrador si existe.
-- Si prefieres usar otro usuario, cambia el valor de `u.id`.
UPDATE users u
SET role_id = (SELECT id FROM roles WHERE name = 'ADMIN')
WHERE u.id = 1;

COMMIT;

-- Consultas opcionales para verificar resultados.
SELECT * FROM roles;
SELECT * FROM role_permissions;
SELECT * FROM permissions;
