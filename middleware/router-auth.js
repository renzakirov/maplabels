export default function ({ store, redirect, route }) {
  store.state.user != null && route.name == 'index' ? redirect('/map-edit') : ''
  store.state.user == null && isAdminRoute(route) ? redirect('/index') : ''
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path == '/mapmake')) {
    return true
  }
}
