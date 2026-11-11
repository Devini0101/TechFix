# TechFix - Sistema de Gestão de Manutenções

A **TechFix** é uma aplicação web desenvolvida para gerenciar serviços de manutenção, orçamentos e relatórios de receitas. O sistema possui controle de acesso baseado em papéis (Funcionários e Clientes), emissão de relatórios em PDF e fluxo completo de aprovação de orçamentos.

## Tecnologias Utilizadas

* **Backend:** Java 25+, Spring Boot 3, Spring Security (JWT), Hibernate/JPA, OpenPDF, Flyway.
* **Frontend:** Angular v17+, Tailwind CSS.
* **Banco de Dados:** PostgreSQL (via Docker).

---

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
* [Java 25](https://www.oracle.com/java/technologies/javase/jdk25-archive-downloads.html) ou superior
* [Node.js e NPM](https://nodejs.org/)
* [Docker e Docker Compose](https://www.docker.com/)
* [Git](https://git-scm.com/)

---

## Passo a Passo para Configuração e Execução

### 1. Clonar o Repositório

```bash
git clone [https://github.com/Devini0101/TechFix.git](https://github.com/Devini0101/TechFix.git)
```

Navegue até o diretório do projeto

```bash
cd techfix
```

2. Configurar e Iniciar o Banco de Dados

O projeto utiliza um container Docker para rodar o PostgreSQL de forma isolada e sem necessidade de configurações manuais na sua máquina.

Na raiz do backend do projeto (Techfix/backend) (onde está o arquivo docker-compose.yml), execute o comando abaixo para baixar a imagem e subir o banco em segundo plano:

``` bash
sudo docker compose up -d
```

Os dados do banco serão salvos localmente na pasta postgres-data/ (já ignorada pelo .gitignore).
Para parar o banco futuramente, use sudo docker compose down.

3. Configurar as Propriedades da Aplicação (Backend)

Navegue até a pasta backend/src/main/resources/ e abra o arquivo application.properties.

O projeto está configurado para aceitar Variáveis de Ambiente, mas assume valores padrão para facilitar o desenvolvimento local. Certifique-se de que o arquivo contém as seguintes configurações:

```bash
spring.application.name=techfix

# Configuração da Conexão com o Banco de Dados
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:techfix_db}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:root}
spring.datasource.driver-class-name=org.postgresql.Driver

# Configurações do Hibernate / JPA
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Configurações do Flyway (migrations)
spring.flyway.enabled=false
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
logging.level.org.flywaydb=DEBUG

# Chave secreta para geração do token JWT
api.security.token.secret=${JWT_SECRET:local_dev}

# Configurações de E-mail para o mailsender (Gmail)
# caso esteja utilizando um sandbox de teste de email (recomenda-se o mailtrap.io), utilize as credenciais fornecidas em sua sandbox

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${GMAIL:seu_email@gmail.com}
# Use uma "Senha de App" de 16 dígitos gerada nas configurações de segurança da sua conta Google, caso nao seja um sandbox de teste
spring.mail.password=${APPGMAILPASS:abcdefghijklmnop}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

4. Executar o Backend

Com o banco de dados rodando e o arquivo .properties configurado, abra o terminal na pasta do backend e inicie o Spring Boot:

```bash
./mvnw spring-boot:run
```
Ou caso esteja utilizando a IDE IntelliJ, navegue até a classe TechfixApplication (backend/src/main/java/com/techfix) e clique no botão de play para inicializar a classe 

Dados Iniciais (Seed): Ao iniciar pela primeira vez, o sistema rodará o DataSeeder e criará automaticamente 5 categorias, 2 funcionários e 4 clientes.
A senha padrão para todos os usuários criados automaticamente é 1234.

5. Executar o Frontend (Angular)

Abra um novo terminal, navegue até a pasta do frontend e instale as dependências. Como utilizamos algumas bibliotecas específicas de UI, recomendamos o uso da flag de retrocompatibilidade:

```bash
cd frontend
npm install --legacy-peer-deps
```

Após a instalação, inicie o servidor de desenvolvimento:

```bash
npm start
```

O frontend estará acessível em http://localhost:4200.

Acesso ao Sistema (Usuários de Teste)

Você pode fazer login na aplicação com os seguintes usuários criados pelo seed:
    
    Funcionários: maria@gmail.com | Senha: 1234, mario@gmail.com | senha: 1234
    
    Clientes: joao@gmail.com | Senha: 1234, jose@gmail.com | Senha: 1234,  joana@gmail.com | Senha: 1234, joaquina@gmail.com | Senha: 1234
