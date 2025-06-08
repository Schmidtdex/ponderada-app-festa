# Descritivo do Projeto
### Visão geral:
Este projeto consite no desenvolvimento de uma plataforma digital  para o gerenciamento completo de festas e eventos universitários, inspirada em funcionalidades oferecidas por aplicativos como o Blacktag. O sistema visa conectar organizadores de eventos a seu público, facilitando a divulgação, venda de ingressos e o fornecimento de informações detalhadas sobre cada ocasião, como line-up de artistas e detalhes sobre serviços como open bar.
### Funcionalidades da Plataforma:
* Cadastro e gerenciamento de eventos: nome, descrição do evento , data, horário de início e fim, local, capacidade máxima e URL para imagem de capa
* Gestão da line-up: Cadastro de artistas e atrações com nome e gênero musical
* Sistema de ingressos: Criação de múltiplos tipos de ingresso por evento (ex: Pista, VIP, Camarote, Lote 1, Lote 2) com preços e quantidades totais específicas
* Perfil de usuários: Cadastro seguro de usuários com distinção entre perfis: Organizador e Cliente

### Para executar o projeto localmente basta dar um node server.js


##  Configuração do Banco de Dados
Para que a aplicação funcione corretamente, é necessário configurar a conexão com um banco de dados PostgreSQL.
Crie um arquivo .env, contendo:
DB_USER=seu_usuario_postgres
DB_HOST=localhost
DB_DATABASE=app_festas_db
DB_PASSWORD=sua_senha_postgres
DB_PORT=5432

Pronto, seu banco de dados esta configurado!!

# Testando a API

Iniciar o Servidor: Execute o seguinte comando na raiz do projeto:

node server.js

Agora utilizando a ferramenta de teste Postman  para enviar requisições aos endpoints
exemplos de uso: Crie um Evento: Use POST para /api/eventos com os dados do evento
Liste Eventos: Use GET para /api/eventos para ver o evento criado.
Compre um Ingresso: Use POST para /api/ingressos/comprar com o tipo_ingresso_id e o usuario_id do cliente.

Páginas Implementadas
Login e Registro

/registro e /login

Organizador

1.
Dashboard (/organizador/dashboard)

•
Estatísticas de eventos e vendas

•
Gráficos e métricas visuais

•
Ações rápidas



2.
Criar Evento (/organizador/eventos/criar)

•
Formulário completo de criação

•
Upload de imagens

•
Validações em tempo real



3.
Gerenciar Eventos (/organizador/eventos)

•
Lista de todos os eventos

•
Ações de editar, excluir, visualizar

•
Filtros e busca

(Detalhe importante para acessar essas views é necessário realizar login como organizador, a medida que há uma verificação usando um token JWT, o qual é salvo nos cookies do site após o login, podendo assim acessar diferentes rotas)

