# containers para uma aplicação completa

Definir os containers necessários para a completa execução do projeto a partir de containers hospedados em uma vps. Premissas:
- um container para cada aplicação, além do container específico para o banco de dados (inicialmente o mysql)
- containers independentes, permitindo desligar ou ligar cada um sem comprometer o funcionamento dos demais containers (exceto pela dependências do banco de dados e da api)
- conexão entre eles via rede

## lista de containers
- mysql
- api (node js / express)
- web (next js / react js)
- adm (react js)

## criando os containers
GitHub Copilot: Para criar um sistema de containers conectados via rede, vamos usar Docker e Docker Compose. Vamos criar cinco containers: um para o banco de dados MySQL, um para a API (usando Express), um para a aplicação React, um para a aplicação Next.js chamada "web-lawyer" e outro para a aplicação Next.js chamada "backend". 

1. **Instalar Docker e Docker Compose**: Certifique-se de que Docker e Docker Compose estão instalados na sua máquina.

2. **Estrutura de Diretórios**:
```
logicinfo/
├── api/                    (node js / express)
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
├── adm/                    (react js)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── App.js
├── web/                    (next js)
│   ├── Dockerfile
│   ├── package.json
│   └── pages/
│       └── index.js
├── volumes/
│   └── mysql/
├── docker-compose.adm.yml
├── docker-compose.api.yml
├── docker-compose.mysql.yml
└── docker-compose.web.yml
```

3. **Criar as aplicações em react e next**:
   para criar as aplicações basta usar a seguinte sintaxe de comando
```yaml
npx create-react-app [project-name]
npx create-next-app@latest [project-name]
```
4. **Arquivos `docker-compose.yml`**:

- **MySQL** (`docker-compose.mysql.yml`):
```yaml  
services:
  mysql:
    image: mysql:8.0
    container_name: logicinfo_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: logicinfo
      MYSQL_USER: ael
      MYSQL_PASSWORD: root
      TZ: "America/Sao_Paulo"
    ports:
      - "3306:3306"
    volumes:
      - ./volumes/mysql:/var/lib/mysql

networks:
  - logicinfo-network
    ```

- **API** (`docker-compose.api.yml`):
```yaml
services:
  api:
    build: ./api
    container_name: logicinfo_api
    ports:
      - "3000:3000"
    networks:
      - logicinfo-network

networks:
  logicinfo-network:
    external: true
    ```

- **Web** (`docker-compose.web.yml`):
```yaml
  services:
    web:
      build: ./web
      container_name: logicinfo_web
      ports:
        - "3001:3000"
      networks:
        - logicinfo-network

  networks:
    logicinfo-network:
      external: true
    ```

- **adm** (`docker-compose.adm.yml`):
    ```yaml
services:
  adm:
    build: ./adm
    container_name: logicinfo_adm
    ports:
      - "3003:3000"
    networks:
      - logicinfo-network

networks:
  logicinfo-network:
    external: true
    ```

5. **Configurar o Dockerfile para cada serviço**:

- **API** (`api/Dockerfile`):
    ```Dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
    ```

- **Web** (`web/Dockerfile`):
    ```Dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
    ```

- **adm** (`backend/Dockerfile`):
```Dockerfile
  FROM node:20
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  EXPOSE 3000
  CMD ["npm", "start"]
```

2. **códigos dos apps**:

    - **API** (`api/index.js`):
```javascript
import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.API_PORT || 3001
app.use(cors())
app.use(express.json())

const dbConfig = {
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'logicinfo',
  port: 3306
}

app.get('/databases', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.query('SHOW DATABASES')
    res.json(rows)
  } catch (error) {
    res.status(500).send(error.toString())
  }
})

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`)
})
```

- **Web** (`web\src\app\page.js`):
```javascript
'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import styles from "./page.module.css"

export default function Home() {
  const [databases, setDatabases] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/databases')
      .then(response => response.json())
      .then(data => setDatabases(data))
  }, [])

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1>web</h1>
        <h1>Databases</h1>
        <ul>
          {databases.map((db, index) => (
            <li key={index}>{db.Database}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}
```

- **adm** (`adm\src\App.js`):
```javascript
import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [databases, setDatabases] = useState([])

  const baseUrl = process.env.REACT_APP_API_URL || 3000

  useEffect(() => {
    fetch(`${baseUrl}/databases`)
      .then(response => response.json())
      .then(data => setDatabases(data))
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Adm</h1>
        <h1>Databases</h1>
      <ul>
        {databases.map((db, index) => (
          <li key={index}>{db.Database}</li>
        ))}
      </ul>
      </header>
    </div>
  )
}

export default App

        ```
1. **Executar o projeto**:
    - **Criar a rede** (`web-lawyer/pages/index.js`):
    ```javascript
    docker network create logicinfo-network
    ```
   
2. **Comandos de Terminal**:

- **Construir e iniciar os containers**:
    ```sh
    docker-compose -f docker-compose.mysql.yml up --build
    docker-compose -f docker-compose.api.yml up --build
    docker-compose -f docker-compose.web.yml up --build
    docker-compose -f docker-compose.adm.yml up --build
    ```

- **Parar os containers**:
    ```sh
    docker-compose -f docker-compose.mysql.yml down
    docker-compose -f docker-compose.api.yml down
    docker-compose -f docker-compose.web.yml down
    docker-compose -f docker-compose.adm.yml down
    ```

- **Listar containers em execução**:
    ```sh
    docker ps
    ```

- **Acessar logs de um container específico**:
    ```sh
    docker logs <container_id>
    ```

- **Acessar o terminal de um container**:
    ```sh
    docker exec -it <container_id> /bin/bash
    ```

- **Remover a rede**:
    ```sh
    docker network rm logicinfo-network
    ```

### Explicação

- **Arquivos `docker-compose.yml` separados**: Permitem que cada serviço seja gerenciado de forma independente, facilitando o desenvolvimento e a manutenção.

- **Rede externa**: A rede `logicinfo-network` é definida como externa para que todos os serviços possam se comunicar entre si, mesmo sendo iniciados separadamente.

Essa configuração permite que cada serviço seja iniciado ou parado de forma independente, mantendo a possibilidade de comunicação entre eles através da rede Docker.



### Explicação

- **Criar a rede**: O comando `docker network create logicinfo-network` cria a rede Docker chamada `logicinfo-network`.
- **Usar a rede externa**: Definindo `external: true` no arquivo `docker-compose.yml`, você informa ao Docker Compose que a rede já existe e deve ser usada.
- **Remover a rede**: O comando `docker network rm logicinfo-network` remove a rede Docker quando ela não é mais necessária.

Essa configuração permite que os containers se conectem através da rede `logicinfo-network`, que é criada e gerenciada manualmente.