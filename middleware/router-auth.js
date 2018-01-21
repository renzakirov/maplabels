export default function ({ store, redirect, route }) {
  store.state.user && route.name == 'index' ? redirect('/map-edit') : ''
  !store.state.user && route.name != 'index' ? redirect('/') : ''
  // store.state.user == null && isAdminRoute(route) ? redirect('/index') : ''
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path == '/index')) {
    return true
  }
}
