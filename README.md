Para executar este projeto, você precisará apenas instalar o Docker e o Docker Compose.

Download Docker: https://docs.docker.com/engine/install/

Download docker compose: https://docs.docker.com/compose/install/

- Execute no terminal

```zsh
docker compose up --build
```

Se não quiser usar o Docker e tiver o Node 21+ instalado é só rodar os comandos

```zsh
npm install

npm run start & npm run web-socket
```

Após rodar o projeto, rode o front-end:
 - https://github.com/guilhermefrag/chat-with-grpc-front