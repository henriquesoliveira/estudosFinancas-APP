import LocalStorageService from "./localStorageService";

export const USUARIO_LOGADO = '_usuario_logado'

export default class AuthService {
    static isUsuarioAutenticado() {
        const usuarioLogado = LocalStorageService.obterItem(USUARIO_LOGADO)
        return usuarioLogado && usuarioLogado.id;
    }

    static removerUsuarioAutenticado(){
        LocalStorageService.removerItem(USUARIO_LOGADO)
    }

    static logar(usuario){
        LocalStorageService.addItem(USUARIO_LOGADO, usuario)
    }

    static obterUsuarioAutenticado(){
        return LocalStorageService.obterItem(USUARIO_LOGADO)
    }
}