
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/services', component: () => import('pages/ServiceList.vue') },
      { path: '/login', component: () => import('components/Login.vue') },
      { path: '/providerservices', component: () => import('pages/ProviderService2.vue') },
      { path: '/addservice', component: () => import('pages/AddService.vue') },
      { path: '/newrequest', component: () => import('pages/newrequest.vue') },
      { path: '/userrequests', component: () => import('pages/userservicelist.vue') },
      { path: '/bookinglist', component: () => import('pages/Bookinglist.vue') },
      { path: '/wallet', component: () => import('pages/wallet.vue') },
     ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
