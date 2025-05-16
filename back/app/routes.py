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
    senha = dados.get('senha')

    if not nome or not email:
        return jsonify({"erro": "Nome e e-mail são obrigatórios."}), 400

    novo_usuario = Usuario(nome=nome, email=email, record=record, senha=senha)

    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({
        "mensagem": "Usuário criado com sucesso.",
        "usuario": {
            "id": novo_usuario.id,
            "nome": novo_usuario.nome,
            "email": novo_usuario.email,
            "senha": novo_usuario.senha,

            "record": novo_usuario.record
        }
    }), 201

@main.route("/usuarios/<int:id>", methods=["PUT"])
def atualizar_usuario(id):
    dados = request.get_json()

    usuario = Usuario.query.get(id)

    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    usuario.nome = dados.get('nome', usuario.nome)
    usuario.email = dados.get('email', usuario.email)
    usuario.record = dados.get('record', usuario.record)
    usuario.senha = dados.get('senha', usuario.senha)

    db.session.commit()

    return jsonify({
        "mensagem": "Usuário atualizado com sucesso.",
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "senha": usuario.senha,
            "record": usuario.record
        }
    }), 200

@main.route("/login", methods=["POST"])
def login():
    dados = request.get_json()

    email = dados.get('email')
    senha = dados.get('senha')

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios."}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or usuario.senha != senha:
        return jsonify({"erro": "Email ou senha incorretos."}), 401

    return jsonify({
        "mensagem": "Login bem-sucedido.",
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "senha": usuario.senha,
            "record": usuario.record
        }
    }), 200

@main.route("/usuarios/ordenar-record", methods=["GET"])
def ordenar_usuarios_por_record():
    usuarios = Usuario.query.order_by(Usuario.record.desc()).all()
    return jsonify([{"id": u.id, "nome": u.nome, "email": u.email, "record": u.record} for u in usuarios])