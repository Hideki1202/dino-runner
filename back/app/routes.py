from flask import Blueprint, request, jsonify
from .models import Usuario
from . import db

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return 'API Flask + PostgreSQL funcionando!'

@main.route('/usuarios')
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{"id": u.id, "nome": u.nome, "email": u.email, "record": u.record} for u in usuarios])

@main.route("/usuarios/criar", methods=["POST"])
def criar_usuario():
    dados = request.get_json()

    nome = dados.get('nome')
    email = dados.get('email')
    record = dados.get('record')

    if not nome or not email:
        return jsonify({"erro": "Nome e e-mail são obrigatórios."}), 400

    novo_usuario = Usuario(nome=nome, email=email, record=record)

    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({
        "mensagem": "Usuário criado com sucesso.",
        "usuario": {
            "id": novo_usuario.id,
            "nome": novo_usuario.nome,
            "email": novo_usuario.email,
            "record": novo_usuario.record
        }
    }), 201