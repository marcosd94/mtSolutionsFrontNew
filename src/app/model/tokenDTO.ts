import { UsuarioDTO } from './usuarioDTO';
export interface TokenDTO {
    token?: string;
    mensaje?: string;
    enable?: boolean;
    user: string;
    userDetail: UsuarioDTO;
}