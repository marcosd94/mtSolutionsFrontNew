import { PermisoDTO } from './permisoDTO';
export interface UsuarioDTO {
    username?: string;
    password?: string;
    authorities?: PermisoDTO[];
    accountNonExpired?: boolean;
    accountNonLocked?: boolean;
    credentialsNonExpired?: boolean;
    enabled?: boolean;
}