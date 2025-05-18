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
    return jsonify([{"id": u.id, "nome": u.nome, "record": u.record} for u in usuarios])

@main.route("/usuarios/criar", methods=["POST"])
def criar_usuario():
    dados = request.get_json()

    nome = dados.get('nome')
    record = dados.get('record')

    if not nome:
        return jsonify({"erro": "O nome do usuário é obrigatório!"}), 400

    novo_usuario = Usuario(nome=nome, record=record)

    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({
        "mensagem": "Usuário criado com sucesso.",
        "usuario": {
            "id": novo_usuario.id,
            "nome": novo_usuario.nome,
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
    usuario.record = dados.get('record', usuario.record)

    db.session.commit()

    return jsonify({
        "mensagem": "Usuário atualizado com sucesso.",
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "record": usuario.record
        }
    }), 200

@main.route("/usuarios/ordenar-record/<int:limite>", methods=["GET"])
def ordenar_usuarios_por_record(limite):
    usuarios = Usuario.query.order_by(Usuario.record.desc()).limit(limite).all()
    return jsonify([{"id": u.id, "nome": u.nome, "record": u.record} for u in usuarios])

@main.route("/usuarios/game/<string:name>", methods=["PUT"])
def atualizar_usuario_por_nome(name):
    dados = request.get_json()
    novo_record = dados.get('record')

    if novo_record is None:
        return jsonify({"erro": "Campo 'record' é obrigatório."}), 400

    usuario = Usuario.query.filter_by(nome=name).first()

    if usuario:
        if novo_record > usuario.record:
            usuario.record = novo_record
            db.session.commit()
            mensagem = "Record atualizado com sucesso."
            atualizado = True
        else:
            atualizado = False
            mensagem = "Novo record não é maior que o atual. Nenhuma alteração feita."

        return jsonify({
            "mensagem": mensagem,
            "atualizado": atualizado,
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "record": usuario.record
            }
        }), 200

    else:
        novo_usuario = Usuario(nome=name, record=novo_record)
        db.session.add(novo_usuario)
        db.session.commit()
        atualizado = False
        return jsonify({
            "mensagem": "Usuário criado com sucesso.",
            "atualizado": atualizado,
            "usuario": {
                "id": novo_usuario.id,
                "nome": novo_usuario.nome,
                "record": novo_usuario.record
            }
        }), 201
