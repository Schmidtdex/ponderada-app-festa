CREATE TABLE IF NOT EXISTS Usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    tipo_usuario VARCHAR(10) NOT NULL CHECK (tipo_usuario IN ('organizador', 'cliente')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizador_id UUID REFERENCES Usuarios(id) NOT NULL,
    nome_evento TEXT NOT NULL,
    descricao TEXT,
    data_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_hora_fim TIMESTAMP WITH TIME ZONE,
    local_evento TEXT NOT NULL,
    capacidade_maxima INTEGER,
    url_imagem_capa TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Atracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_atracao TEXT NOT NULL,
    genero_musical TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Eventos_Atracoes (
    evento_id UUID REFERENCES Eventos(id) ON DELETE CASCADE,
    atracao_id UUID REFERENCES Atracoes(id) ON DELETE CASCADE,
    horario_apresentacao TIME,
    PRIMARY KEY (evento_id, atracao_id)
);

CREATE TABLE IF NOT EXISTS Tipos_Ingresso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID REFERENCES Eventos(id) ON DELETE CASCADE,
    nome_tipo VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    quantidade_total INTEGER NOT NULL,
    quantidade_disponivel INTEGER NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Ingressos_Vendidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_ingresso_id UUID REFERENCES Tipos_Ingresso(id) NOT NULL,
    usuario_id UUID REFERENCES Usuarios(id) NOT NULL,
    codigo_qr TEXT UNIQUE NOT NULL,
    status_pagamento VARCHAR(20) DEFAULT 'pendente',
    data_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



ALTER TABLE Usuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_self_access ON Usuarios;
CREATE POLICY user_self_access ON Usuarios
FOR ALL
USING (auth.uid() = id);


ALTER TABLE Eventos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS organizador_manage_eventos ON Eventos;
CREATE POLICY organizador_manage_eventos ON Eventos
FOR ALL
USING (auth.uid() = organizador_id);

DROP POLICY IF EXISTS clientes_view_eventos ON Eventos;
CREATE POLICY clientes_view_eventos ON Eventos
FOR SELECT
USING (true); 

