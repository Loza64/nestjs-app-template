BEGIN;

-- Asigna todos los permisos disponibles al rol SUPER_ADMIN.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- Asigna solo permisos GET al rol ADMIN.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN' AND p.method = 'GET'
ON CONFLICT DO NOTHING;

COMMIT;

-- Consultas opcionales para verificar resultados.
SELECT * FROM roles;
SELECT * FROM role_permissions;
SELECT * FROM permissions;
