import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { withRouter } from 'react-router-dom'

import UsuarioService from '../app/service/usuarioService'
import { mensagemErro, mensagemSucesso } from '../components/toastr'

class CadastroUsuario extends React.Component {

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor() {
        super();
        this.service = new UsuarioService();
    }


    cadastrar = () => {

        const { nome, email, senha, senhaRepeticao } = this.state;
        const usuario = { nome, email, senha, senhaRepeticao }

        try {
            this.service.validar(usuario);
        } catch (error) {
            const erros = error.mensagens;
            erros.forEach(element => {
                mensagemErro(element);
            });
            return false;
        }

        this.service.salvar(usuario)
            .then(response => {
                mensagemSucesso('Usuário Cadastrado com sucesso! Faça o login para acessar o sistema.')
                this.props.history.push('/login')
            }).catch(err => {
                mensagemErro(err.response.data)
            })
    }

    cancelar = () => {
        this.props.history.push('/login')
    }


    render() {
        return (
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label="Nome: *" htmlFor="inputNome">
                                <input type="text"
                                    className="form-control"
                                    id="inputNome"
                                    name="nome"
                                    onChange={e => this.setState({ nome: e.target.value })} />
                            </FormGroup>
                            <FormGroup label="Email: *" htmlFor="inputEmail">
                                <input type="email"
                                    className="form-control"
                                    id="inputEmail"
                                    name="email"
                                    onChange={e => this.setState({ email: e.target.value })} />
                            </FormGroup>
                            <FormGroup label="Senha: *" htmlFor="inputSenha">
                                <input type="password"
                                    className="form-control"
                                    id="inputSenha"
                                    name="senha"
                                    onChange={e => this.setState({ senha: e.target.value })} />
                            </FormGroup>
                            <FormGroup label="Repita a Senha: *" htmlFor="inputRepitaSenha">
                                <input type="password"
                                    className="form-control"
                                    id="inputRepitaSenha"
                                    name="repitaSenha"
                                    onChange={e => this.setState({ senhaRepeticao: e.target.value })} />
                            </FormGroup>
                            <button type="button" onClick={this.cadastrar} className="btn btn-success"><i className="pi pi-save"></i>Salvar</button>
                            <button type="button" onClick={this.cancelar} className="btn btn-danger" ><i className="pi pi-times"></i>Cancelar</button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroUsuario)