# Documentação da API - App Festas

## Introdução

Esta documentação descreve os endpoints da API RESTful para o sistema de gerenciamento de festas e eventos. A API segue a estrutura MVC e utiliza Node.js com Express e PostgreSQL.

**URL Base:** `/api` (configurado em `routes/index.js`)

**Observação sobre Autenticação:** Atualmente, a maioria das rotas que requerem autenticação ou autorização específica (como verificar se o usuário é organizador ou o dono do recurso) estão implementadas sem a verificação real por middleware. Isso está indicado nos comentários dos arquivos de rotas (`/* Temporário sem auth */` ou similar) e nos controllers. A implementação de um sistema de autenticação (ex: JWT) e middlewares de autorização é um próximo passo necessário para a segurança da aplicação.

**Formato de Dados:** A API utiliza JSON para requisições e respostas.

## 1. Usuários (`/api/usuarios`)

Gerencia usuários (organizadores e clientes).

### 1.1. Registrar Novo Usuário

- **Método:** `POST`
- **Endpoint:** `/api/usuarios/registrar`
- **Descrição:** Cria um novo usuário no sistema.
- **Autenticação:** Nenhuma.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome_completo": "Nome Sobrenome",
    "email": "usuario@exemplo.com",
    "senha": "senha123",
    "tipo_usuario": "cliente" // ou "organizador"
  }
  ```
- **Resposta de Sucesso (201):**
  ```json
  {
    "id": "uuid-gerado-aqui",
    "nome_completo": "Nome Sobrenome",
    "email": "usuario@exemplo.com",
    "tipo_usuario": "cliente",
    "data_criacao": "timestamp"
    // senha_hash NÃO é retornado
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Campos obrigatórios faltando ou tipo de usuário inválido.
  - `409 Conflict`: Email já cadastrado.
  - `500 Internal Server Error`: Erro no servidor.

### 1.2. Login de Usuário

- **Método:** `POST`
- **Endpoint:** `/api/usuarios/login`
- **Descrição:** Autentica um usuário e retorna um token JWT (placeholder).
- **Autenticação:** Nenhuma.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "email": "usuario@exemplo.com",
    "senha": "senha123"
  }
  ```
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Login bem-sucedido!",
    "token": "jwt-token-gerado-aqui",
    "usuario": {
      "id": "uuid-do-usuario",
      "nome": "Nome Sobrenome",
      "email": "usuario@exemplo.com",
      "tipo": "cliente" // ou "organizador"
    }
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Email ou senha faltando.
  - `401 Unauthorized`: Credenciais inválidas (email não encontrado ou senha incorreta).
  - `500 Internal Server Error`: Erro no servidor.

### 1.3. Buscar Usuário por ID

- **Método:** `GET`
- **Endpoint:** `/api/usuarios/:id`
- **Descrição:** Retorna informações de um usuário específico (excluindo a senha).
- **Autenticação:** *Requerida (atualmente desativada)*. Idealmente, apenas o próprio usuário ou um administrador.
- **Parâmetros de URL:**
  - `id` (UUID): ID do usuário a ser buscado.
- **Resposta de Sucesso (200):**
  ```json
  {
    "id": "uuid-do-usuario",
    "nome_completo": "Nome Sobrenome",
    "email": "usuario@exemplo.com",
    "tipo_usuario": "cliente",
    "data_criacao": "timestamp"
  }
  ```
- **Respostas de Erro:**
  - `404 Not Found`: Usuário não encontrado.
  - `500 Internal Server Error`: Erro no servidor.
  - `403 Forbidden`: (Com autenticação) Acesso não autorizado.

---

## 2. Eventos (`/api/eventos`)

Gerencia eventos criados por organizadores.

### 2.1. Criar Novo Evento

- **Método:** `POST`
- **Endpoint:** `/api/eventos/`
- **Descrição:** Cria um novo evento.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas usuários do tipo `organizador`.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "organizador_id": "uuid-do-organizador", // Temporário, virá do token JWT
    "nome_evento": "Festa Junina",
    "descricao": "Grande festa com comidas típicas e quadrilha.",
    "data_hora_inicio": "2025-06-24T18:00:00Z",
    "data_hora_fim": "2025-06-24T23:00:00Z", // Opcional
    "local_evento": "Praça Central",
    "capacidade_maxima": 500, // Opcional
    "url_imagem_capa": "http://exemplo.com/imagem.jpg" // Opcional
  }
  ```
- **Resposta de Sucesso (201):** Retorna o objeto do evento criado.
  ```json
  {
    "id": "uuid-do-evento",
    "organizador_id": "uuid-do-organizador",
    "nome_evento": "Festa Junina",
    "descricao": "Grande festa com comidas típicas e quadrilha.",
    "data_hora_inicio": "2025-06-24T18:00:00Z",
    "data_hora_fim": "2025-06-24T23:00:00Z",
    "local_evento": "Praça Central",
    "capacidade_maxima": 500,
    "url_imagem_capa": "http://exemplo.com/imagem.jpg",
    "data_criacao": "timestamp"
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Campos obrigatórios faltando ou ID do organizador inválido.
  - `403 Forbidden`: (Com autenticação) Usuário não é organizador.
  - `500 Internal Server Error`: Erro no servidor.

### 2.2. Listar Todos os Eventos

- **Método:** `GET`
- **Endpoint:** `/api/eventos/`
- **Descrição:** Retorna uma lista de todos os eventos cadastrados, ordenados por data de início.
- **Autenticação:** Nenhuma.
- **Resposta de Sucesso (200):** Retorna um array de objetos de evento.
  ```json
  [
    {
      "id": "uuid-do-evento-1",
      // ... outros campos do evento
    },
    {
      "id": "uuid-do-evento-2",
      // ... outros campos do evento
    }
  ]
  ```
- **Respostas de Erro:**
  - `500 Internal Server Error`: Erro no servidor.

### 2.3. Buscar Evento por ID

- **Método:** `GET`
- **Endpoint:** `/api/eventos/:id`
- **Descrição:** Retorna informações de um evento específico.
- **Autenticação:** Nenhuma.
- **Parâmetros de URL:**
  - `id` (UUID): ID do evento a ser buscado.
- **Resposta de Sucesso (200):** Retorna o objeto do evento.
- **Respostas de Erro:**
  - `404 Not Found`: Evento não encontrado.
  - `500 Internal Server Error`: Erro no servidor.

### 2.4. Editar Evento

- **Método:** `PUT`
- **Endpoint:** `/api/eventos/:id`
- **Descrição:** Atualiza informações de um evento existente.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o organizador que criou o evento.
- **Parâmetros de URL:**
  - `id` (UUID): ID do evento a ser editado.
- **Corpo da Requisição (JSON):** Campos a serem atualizados (pelo menos um).
  ```json
  {
    "nome_evento": "Festa Junina Universitária",
    "capacidade_maxima": 600
    // ... outros campos podem ser incluídos
  }
  ```
- **Resposta de Sucesso (200):** Retorna o objeto do evento atualizado.
- **Respostas de Erro:**
  - `404 Not Found`: Evento não encontrado.
  - `403 Forbidden`: (Com autenticação) Usuário não tem permissão para editar.
  - `500 Internal Server Error`: Erro no servidor.

### 2.5. Excluir Evento

- **Método:** `DELETE`
- **Endpoint:** `/api/eventos/:id`
- **Descrição:** Exclui um evento.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o organizador que criou o evento.
- **Parâmetros de URL:**
  - `id` (UUID): ID do evento a ser excluído.
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Evento excluído com sucesso.",
    "evento": { /* objeto do evento excluído */ }
  }
  ```
- **Respostas de Erro:**
  - `404 Not Found`: Evento não encontrado.
  - `403 Forbidden`: (Com autenticação) Usuário não tem permissão para excluir.
  - `409 Conflict`: Não é possível excluir pois existem itens associados (ex: ingressos vendidos, tipos de ingresso, atrações associadas - devido a restrições de chave estrangeira).
  - `500 Internal Server Error`: Erro no servidor.

---

## 3. Atrações (`/api/atracoes`)

Gerencia atrações (bandas, DJs, etc.) que podem ser associadas a eventos.

### 3.1. Criar Nova Atração

- **Método:** `POST`
- **Endpoint:** `/api/atracoes/`
- **Descrição:** Cria uma nova atração.
- **Autenticação:** *Opcional/Recomendada (atualmente desativada)*. Talvez apenas organizadores possam criar.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome_atracao": "Banda Falamansa",
    "genero_musical": "Forró" // Opcional
  }
  ```
- **Resposta de Sucesso (201):** Retorna o objeto da atração criada.
  ```json
  {
    "id": "uuid-da-atracao",
    "nome_atracao": "Banda Falamansa",
    "genero_musical": "Forró",
    "data_criacao": "timestamp"
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Nome da atração faltando.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `500 Internal Server Error`: Erro no servidor.

### 3.2. Listar Todas as Atrações

- **Método:** `GET`
- **Endpoint:** `/api/atracoes/`
- **Descrição:** Retorna uma lista de todas as atrações cadastradas.
- **Autenticação:** Nenhuma.
- **Resposta de Sucesso (200):** Retorna um array de objetos de atração.
- **Respostas de Erro:**
  - `500 Internal Server Error`: Erro no servidor.

### 3.3. Buscar Atração por ID

- **Método:** `GET`
- **Endpoint:** `/api/atracoes/:id`
- **Descrição:** Retorna informações de uma atração específica.
- **Autenticação:** Nenhuma.
- **Parâmetros de URL:**
  - `id` (UUID): ID da atração.
- **Resposta de Sucesso (200):** Retorna o objeto da atração.
- **Respostas de Erro:**
  - `404 Not Found`: Atração não encontrada.
  - `500 Internal Server Error`: Erro no servidor.

### 3.4. Editar Atração

- **Método:** `PUT`
- **Endpoint:** `/api/atracoes/:id`
- **Descrição:** Atualiza informações de uma atração existente.
- **Autenticação:** *Opcional/Recomendada (atualmente desativada)*.
- **Parâmetros de URL:**
  - `id` (UUID): ID da atração.
- **Corpo da Requisição (JSON):** Campos a serem atualizados.
  ```json
  {
    "nome_atracao": "Falamansa (Acústico)",
    "genero_musical": "Forró Acústico"
  }
  ```
- **Resposta de Sucesso (200):** Retorna o objeto da atração atualizada.
- **Respostas de Erro:**
  - `404 Not Found`: Atração não encontrada.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `500 Internal Server Error`: Erro no servidor.

### 3.5. Excluir Atração

- **Método:** `DELETE`
- **Endpoint:** `/api/atracoes/:id`
- **Descrição:** Exclui uma atração.
- **Autenticação:** *Opcional/Recomendada (atualmente desativada)*.
- **Parâmetros de URL:**
  - `id` (UUID): ID da atração.
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Atração excluída com sucesso.",
    "atracao": { /* objeto da atração excluída */ }
  }
  ```
- **Respostas de Erro:**
  - `404 Not Found`: Atração não encontrada.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `409 Conflict`: Não é possível excluir pois a atração está associada a um ou mais eventos.
  - `500 Internal Server Error`: Erro no servidor.

---

## 4. Associações Evento-Atração (dentro de `/api/eventos`)

Gerencia o relacionamento entre eventos e atrações.

### 4.1. Listar Atrações de um Evento

- **Método:** `GET`
- **Endpoint:** `/api/eventos/:evento_id/atracoes`
- **Descrição:** Retorna a lista de atrações associadas a um evento específico, incluindo o horário de apresentação (se houver).
- **Autenticação:** Nenhuma.
- **Parâmetros de URL:**
  - `evento_id` (UUID): ID do evento.
- **Resposta de Sucesso (200):** Retorna um array de objetos de atração com o campo `horario_apresentacao`.
  ```json
  [
    {
      "id": "uuid-da-atracao-1",
      "nome_atracao": "Banda Falamansa",
      "genero_musical": "Forró",
      "data_criacao": "timestamp",
      "horario_apresentacao": "20:00:00" // ou null
    },
    // ... outras atrações do evento
  ]
  ```
- **Respostas de Erro:**
  - `404 Not Found`: Evento não encontrado.
  - `500 Internal Server Error`: Erro no servidor.

### 4.2. Adicionar Atração a um Evento

- **Método:** `POST`
- **Endpoint:** `/api/eventos/:evento_id/atracoes`
- **Descrição:** Associa uma atração existente a um evento.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o organizador do evento.
- **Parâmetros de URL:**
  - `evento_id` (UUID): ID do evento.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "atracao_id": "uuid-da-atracao-existente",
    "horario_apresentacao": "21:30:00" // Opcional (formato HH:MM:SS)
  }
  ```
- **Resposta de Sucesso (201):** Retorna o registro da tabela `Eventos_Atracoes`.
  ```json
  {
    "evento_id": "uuid-do-evento",
    "atracao_id": "uuid-da-atracao-existente",
    "horario_apresentacao": "21:30:00"
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: `evento_id` ou `atracao_id` faltando.
  - `404 Not Found`: Evento ou Atração não encontrados.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `409 Conflict`: Associação já existe (se houver constraint unique).
  - `500 Internal Server Error`: Erro no servidor.

### 4.3. Remover Atração de um Evento

- **Método:** `DELETE`
- **Endpoint:** `/api/eventos/:evento_id/atracoes/:atracao_id`
- **Descrição:** Remove a associação entre uma atração e um evento.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o organizador do evento.
- **Parâmetros de URL:**
  - `evento_id` (UUID): ID do evento.
  - `atracao_id` (UUID): ID da atração a ser removida do evento.
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Atração removida do evento com sucesso.",
    "associacao": { /* objeto da associação removida */ }
  }
  ```
- **Respostas de Erro:**
  - `404 Not Found`: Evento não encontrado ou associação não encontrada.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `500 Internal Server Error`: Erro no servidor.

---

## 5. Tipos de Ingresso (`/api/tipos-ingresso` e dentro de `/api/eventos`)

Gerencia os diferentes tipos de ingresso disponíveis para cada evento.

### 5.1. Criar Novo Tipo de Ingresso para um Evento

- **Método:** `POST`
- **Endpoint:** `/api/eventos/:evento_id/tipos-ingresso`
- **Descrição:** Cria um novo tipo de ingresso associado a um evento específico.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o organizador do evento.
- **Parâmetros de URL:**
  - `evento_id` (UUID): ID do evento ao qual o tipo de ingresso pertence.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome_tipo": "Pista Comum",
    "preco": 50.00,
    "quantidade_total": 300
  }
  ```
- **Resposta de Sucesso (201):** Retorna o objeto do tipo de ingresso criado.
  ```json
  {
    "id": "uuid-do-tipo-ingresso",
    "evento_id": "uuid-do-evento",
    "nome_tipo": "Pista Comum",
    "preco": "50.00", // Pode vir como string dependendo da lib PG
    "quantidade_total": 300,
    "quantidade_disponivel": 300, // Inicialmente igual à total
    "data_criacao": "timestamp"
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Campos obrigatórios faltando ou inválidos (preço < 0, quantidade <= 0).
  - `404 Not Found`: Evento não encontrado.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `500 Internal Server Error`: Erro no servidor.

### 5.2. Listar Tipos de Ingresso de um Evento

- **Método:** `GET`
- **Endpoint:** `/api/eventos/:evento_id/tipos-ingresso`
- **Descrição:** Retorna a lista de tipos de ingresso disponíveis para um evento específico.
- **Autenticação:** Nenhuma.
- **Parâmetros de URL:**
  - `evento_id` (UUID): ID do evento.
- **Resposta de Sucesso (200):** Retorna um array de objetos de tipo de ingresso.
- **Respostas de Erro:**
  - `404 Not Found`: Evento não encontrado.
  - `500 Internal Server Error`: Erro no servidor.

### 5.3. Buscar Tipo de Ingresso por ID

- **Método:** `GET`
- **Endpoint:** `/api/tipos-ingresso/:id`
- **Descrição:** Retorna informações de um tipo de ingresso específico.
- **Autenticação:** Nenhuma (ou requerida dependendo da política).
- **Parâmetros de URL:**
  - `id` (UUID): ID do tipo de ingresso.
- **Resposta de Sucesso (200):** Retorna o objeto do tipo de ingresso.
- **Respostas de Erro:**
  - `404 Not Found`: Tipo de ingresso não encontrado.
  - `500 Internal Server Error`: Erro no servidor.

### 5.4. Editar Tipo de Ingresso

- **Método:** `PUT`
- **Endpoint:** `/api/tipos-ingresso/:id`
- **Descrição:** Atualiza informações de um tipo de ingresso existente.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o organizador do evento associado.
- **Parâmetros de URL:**
  - `id` (UUID): ID do tipo de ingresso.
- **Corpo da Requisição (JSON):** Campos a serem atualizados.
  ```json
  {
    "nome_tipo": "Pista Premium",
    "preco": 75.50,
    "quantidade_disponivel": 250 // Cuidado ao ajustar quantidades
  }
  ```
- **Resposta de Sucesso (200):** Retorna o objeto do tipo de ingresso atualizado.
- **Respostas de Erro:**
  - `404 Not Found`: Tipo de ingresso não encontrado.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `500 Internal Server Error`: Erro no servidor.
  - *Validações adicionais podem ser necessárias (ex: não diminuir quantidade total abaixo da vendida)*.

### 5.5. Excluir Tipo de Ingresso

- **Método:** `DELETE`
- **Endpoint:** `/api/tipos-ingresso/:id`
- **Descrição:** Exclui um tipo de ingresso.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o organizador do evento associado.
- **Parâmetros de URL:**
  - `id` (UUID): ID do tipo de ingresso.
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Tipo de ingresso excluído com sucesso.",
    "tipoIngresso": { /* objeto do tipo de ingresso excluído */ }
  }
  ```
- **Respostas de Erro:**
  - `404 Not Found`: Tipo de ingresso não encontrado.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `409 Conflict`: Não é possível excluir pois existem ingressos vendidos deste tipo.
  - `500 Internal Server Error`: Erro no servidor.

---

## 6. Ingressos Vendidos (`/api/ingressos`)

Gerencia os ingressos individuais que foram comprados pelos usuários.

### 6.1. Comprar Ingresso (Criar Ingresso Vendido)

- **Método:** `POST`
- **Endpoint:** `/api/ingressos/comprar`
- **Descrição:** Simula a compra de um ingresso, criando um registro de ingresso vendido e decrementando a quantidade disponível do tipo de ingresso. **Importante:** Idealmente, esta operação deve ser atômica (usar transações de banco de dados).
- **Autenticação:** *Requerida (atualmente desativada)*. O usuário que está comprando.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "tipo_ingresso_id": "uuid-do-tipo-ingresso",
    "usuario_id": "uuid-do-usuario-comprador" // Temporário, virá do token JWT
  }
  ```
- **Resposta de Sucesso (201):** Retorna o objeto do ingresso vendido criado.
  ```json
  {
    "id": "uuid-do-ingresso-vendido",
    "tipo_ingresso_id": "uuid-do-tipo-ingresso",
    "usuario_id": "uuid-do-usuario-comprador",
    "codigo_qr": "uuid-unico-gerado-para-qr",
    "status_pagamento": "pendente", // Ou "pago" se integrado com pagamento
    "data_compra": "timestamp"
  }
  ```
- **Respostas de Erro:**
  - `400 Bad Request`: Campos obrigatórios faltando.
  - `404 Not Found`: Usuário comprador ou Tipo de ingresso não encontrado.
  - `409 Conflict`: Ingressos esgotados para este tipo.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `500 Internal Server Error`: Erro no servidor (pode ocorrer falha ao decrementar ou ao criar).

### 6.2. Listar Ingressos de um Usuário

- **Método:** `GET`
- **Endpoint:** `/api/ingressos/usuario/:usuario_id`
- **Descrição:** Retorna a lista de ingressos comprados por um usuário específico, incluindo detalhes do evento.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o próprio usuário ou um administrador.
- **Parâmetros de URL:**
  - `usuario_id` (UUID): ID do usuário cujos ingressos serão listados.
- **Resposta de Sucesso (200):** Retorna um array de objetos de ingresso vendido com detalhes adicionais.
  ```json
  [
    {
      "id": "uuid-do-ingresso-vendido",
      "tipo_ingresso_id": "uuid-do-tipo-ingresso",
      "usuario_id": "uuid-do-usuario-comprador",
      "codigo_qr": "uuid-unico-gerado-para-qr-1",
      "status_pagamento": "pago",
      "data_compra": "timestamp",
      "nome_tipo": "Pista Comum",
      "preco": "50.00",
      "nome_evento": "Festa Junina",
      "data_hora_inicio": "2025-06-24T18:00:00Z"
    },
    // ... outros ingressos do usuário
  ]
  ```
- **Respostas de Erro:**
  - `403 Forbidden`: (Com autenticação) Acesso não autorizado.
  - `500 Internal Server Error`: Erro no servidor.

### 6.3. Buscar Ingresso Vendido por ID

- **Método:** `GET`
- **Endpoint:** `/api/ingressos/:id`
- **Descrição:** Retorna informações de um ingresso vendido específico.
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas o dono do ingresso, o organizador do evento relacionado ou um administrador.
- **Parâmetros de URL:**
  - `id` (UUID): ID do ingresso vendido.
- **Resposta de Sucesso (200):** Retorna o objeto do ingresso vendido.
- **Respostas de Erro:**
  - `404 Not Found`: Ingresso vendido não encontrado.
  - `403 Forbidden`: (Com autenticação) Acesso não autorizado.
  - `500 Internal Server Error`: Erro no servidor.

### 6.4. Validar Ingresso por Código QR

- **Método:** `GET`
- **Endpoint:** `/api/ingressos/validar/:codigo_qr`
- **Descrição:** Verifica a validade de um ingresso pelo seu código QR (usado para check-in).
- **Autenticação:** *Requerida (atualmente desativada)*. Apenas staff do evento ou organizador.
- **Parâmetros de URL:**
  - `codigo_qr` (UUID/String): Código QR do ingresso.
- **Resposta de Sucesso (200):** Indica que o ingresso é válido e retorna seus dados.
  ```json
  {
    "message": "Ingresso válido.",
    "valido": true,
    "ingresso": { /* objeto do ingresso vendido */ }
  }
  ```
- **Respostas de Erro:**
  - `404 Not Found`: Ingresso inválido ou não encontrado (`valido: false`).
  - `402 Payment Required`: Pagamento pendente ou status inválido (`valido: false`).
  - `403 Forbidden`: (Com autenticação) Permissão negada para validar.
  - `500 Internal Server Error`: Erro no servidor.
  - *Pode haver outros status para indicar que o ingresso já foi usado.*

### 6.5. Atualizar Status de Pagamento do Ingresso

- **Método:** `PATCH`
- **Endpoint:** `/api/ingressos/:id/status-pagamento`
- **Descrição:** Atualiza o status de pagamento de um ingresso vendido (ex: após confirmação de um gateway de pagamento).
- **Autenticação:** *Requerida (atualmente desativada)*. Tipicamente por um sistema automatizado (webhook de pagamento) ou administrador.
- **Parâmetros de URL:**
  - `id` (UUID): ID do ingresso vendido.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "status_pagamento": "pago" // ou "cancelado", "reembolsado"
  }
  ```
- **Resposta de Sucesso (200):** Retorna o objeto do ingresso vendido atualizado.
- **Respostas de Erro:**
  - `400 Bad Request`: Status de pagamento inválido.
  - `404 Not Found`: Ingresso vendido não encontrado.
  - `403 Forbidden`: (Com autenticação) Permissão negada.
  - `500 Internal Server Error`: Erro no servidor.

