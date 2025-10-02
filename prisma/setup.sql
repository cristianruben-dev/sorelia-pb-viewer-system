-- Script de configuración inicial para Sorelia PowerBI Viewer
-- Ejecutar después de la migración de Prisma

-- 1. Insertar configuración del sistema por defecto
INSERT INTO
    system_config (
        id,
        key,
        value,
        "createdAt",
        "updatedAt"
    )
VALUES (
        'clzk' || substr(md5(random()::text), 1, 20),
        'site_title',
        'Sistema Visualizador',
        NOW(),
        NOW()
    ),
    (
        'clzk' || substr(md5(random()::text), 1, 20),
        'site_logo',
        '',
        NOW(),
        NOW()
    ),
    (
        'clzk' || substr(md5(random()::text), 1, 20),
        'site_favicon',
        '',
        NOW(),
        NOW()
    )
ON CONFLICT (key) DO NOTHING;

-- 2. Insertar usuario administrador
INSERT INTO
    users (
        id,
        name,
        email,
        password,
        role,
        active,
        "createdAt",
        "updatedAt"
    )
VALUES (
        'clzkij0vrqhisp7l99nfp4c3m',
        'Cristian Figueroa',
        'cristian.figueroa@inssoftmx.com',
        '$2b$10$EI9.lLbbdSmH1N2cPWaf2eypUeFmhn8NmUYGMZ2v1ezp.95M7gq0S',
        'admin',
        true,
        NOW(),
        NOW()
    )
ON CONFLICT (email) DO NOTHING;

-- Fin del script
-- Credenciales del admin:
-- Email: cristian.figueroa@inssoftmx.com
-- Password: Crfe2608