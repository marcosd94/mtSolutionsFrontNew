export const CONSTANTES = {
    LOGIN: {
        route: "login",
        routeArr: ["","login"],
        nombre: "Login"
    },
    DASHBOARD: {
        route: "dashboard",
        routeArr: ["","dashboard"],
        permiso: "V_PAG_INICIAL",
        nombre: "Pagina de inicio"
    },
    USUARIO: {
        route: "usuario",
        routeArr: ["", "usuario"],
        permiso: "V_PAG_USUARIO",
        nombre: "Pagina de usuario"
    },
    CREAR_USUARIO: {
      route: "crear_usuario",
      routeArr: ["","usuario", "crear_usuario"],
      permiso: "F_CREATE_USER",
      nombre: "Pagina alta de usuario"
    },
    EDITAR_USUARIO: {
      route: "editar_usuario",
      routeArr: ["", "usuario", "editar_usuario"],
      permiso: "F_EDIT_USER",
      nombre: "Pagina edicion de usuario"
    }
}
