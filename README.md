# Projeto Dino-Runner - Flask API

Este projeto é uma API desenvolvida com Flask e conectada a um banco de dados DockerNet. O ambiente é configurado com suporte a CORS, variáveis de ambiente e debug remoto.


## 📦 Requisitos

Instale as dependências com:
```bash
pip install -r requirements.txt
```

Lista de dependências (`requirements.txt`):
```
comm==0.2.2
db==0.1.1
debugpy==1.8.13
Flask==3.1.1
flask-cors==5.0.1
Flask-SQLAlchemy==3.1.1
psycopg2-binary==2.9.10
python-dotenv==1.1.0
```


## 🚀 Como rodar o projeto

1. Clone o repositório e sincronize com a branch `main`:
```bash
git pull origin main
```

2. Acesse a pasta do backend:
```bash
cd back
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Crie um arquivo `.env` dentro da pasta `back` com suas variáveis de ambiente. Exemplo de estrutura:
```
FLASK_ENV=development
DATABASE_URL=postgresql://usuario:senha@localhost:5432/seubanco
SECRET_KEY=sua_chave_secreta
```

5. Inicie o servidor com:

```bash
python app.py
```
