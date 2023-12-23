const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,

    //新增
    buttons: state => state.user.buttons,
    menus: state => state.user.menus,

    dept: state => state.user.dept,
    post: state => state.user.post,
    roles: state => state.user.roles
}
export default getters
