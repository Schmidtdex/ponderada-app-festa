CREATE TABLE Usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    tipo_usuario VARCHAR(10) NOT NULL CHECK (tipo_usuario IN ('organizador', 'cliente')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tabela de usuários, onde cada usuário tem um ID único, nome completo, email (único), senha (hash) e tipo (organizador ou cliente)
-- A data de criação é registrada automaticamente, e o tipo de usuário é restrito a 'organizador' ou 'cliente'

CREATE TABLE Eventos (
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
 -- Tabela de eventos, onde cada evento é associado a um organizador (usuário) e pode ter uma imagem de capa
-- e uma capacidade máxima. A data de criação é registrada automaticamente.
-- A data e hora de início e fim do evento são obrigatórias, assim como o nome e o local do evento

CREATE TABLE Atracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_atracao TEXT NOT NULL,
    genero_musical TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tabela de atrações, onde cada atração tem um ID único, nome e gênero musical (opcional)

CREATE TABLE Eventos_Atracoes (
    evento_id UUID REFERENCES Eventos(id) ON DELETE CASCADE,
    atracao_id UUID REFERENCES Atracoes(id) ON DELETE CASCADE,
    horario_apresentacao TIME,
    PRIMARY KEY (evento_id, atracao_id)
);
-- Tabela de relacionamento entre eventos e atrações, onde cada evento pode ter várias atrações e vice-versa
-- A data e hora de apresentação da atração no evento são opcionais

CREATE TABLE Tipos_Ingresso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID REFERENCES Eventos(id) ON DELETE CASCADE,
    nome_tipo VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    quantidade_total INTEGER NOT NULL,
    quantidade_disponivel INTEGER NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tabela de tipos de ingresso, onde cada tipo de ingresso é associado a um evento específico
-- Cada tipo de ingresso tem um nome, preço, quantidade total e quantidade disponível

CREATE TABLE Ingressos_Vendidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_ingresso_id UUID REFERENCES Tipos_Ingresso(id) NOT NULL,
    usuario_id UUID REFERENCES Usuarios(id) NOT NULL,
    codigo_qr TEXT UNIQUE NOT NULL,
    status_pagamento VARCHAR(20) DEFAULT 'pendente',
    data_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tabela de ingressos vendidos, onde cada ingresso vendido é associado a um tipo de ingresso e a um usuário
-- Cada ingresso tem um código QR único, status de pagamento (pode ser 'pendente', 'pago', 'cancelado') e data de compra