import React from 'react'
import Login from '../views/login'
import CadastroUsuario from '../views/cadastroUsuario'
import ConsultaLancamento from '../views/lancamentos/consultaLancamento'
import Home from '../views/home'
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom'
import CadastroLancamentos from '../views/lancamentos/cadastroLancamentos'
import {AuthConsumer} from './provedorAutenticacao'
function RotaAutenticada({ component: Component, isUsuarioAutenticado, ...props }) {
    return (
        <Route {...props} render={(componentProps) => {
            if (isUsuarioAutenticado) {
                return (
                    <Component{...componentProps} />
                )
            } else {
                return (
                    <Redirect to={{ pathname: '/login', state: { from: componentProps.location } }} />
                )
            }
        }} />
    )
}

function Rotas(props) {
    return (
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/cadastro-usuario" component={CadastroUsuario} />

                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/home" component={Home} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/consulta-lancamento" component={ConsultaLancamento} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/cadastro-lancamento/:id?" component={CadastroLancamentos} />
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        {
            (context) => (
                <Rotas isUsuarioAutenticado={context.isAutenticado} />
            )
        }

    </AuthConsumer>
)