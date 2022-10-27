import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
const role = localStorage.getItem('role')

let routes = [
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    meta: { requiresAuth: false, title: 'Sahifa Topilmadi' },
    component: () => import("../components/NotFound/NotFound.vue")
  },
  {
    path: '/',
    name: 'login',
    meta: { requiresAuth: false, title: "Login", },
    component: () => import("../views/Login/Login.vue")
  },
  {
    path: '/home',
    name: 'home',
    meta: { requiresAuth: false, title: "Loading", },
    component: HomeView
  },
  {
    path: '/main',
    name: 'main',
    meta: { requiresAuth: true, title: "Asosiy", role: ["admin"] },
    component: () => import('../views/Main.vue')
  },
  {
    path: '/ombor/:id',
    name: 'ombor',
    meta: { requiresAuth: true, title: "Ombor", role: ["admin"] },
    component: () => import('../views/Omborlar/Ombor.vue')
  },
  {
    path: '/omborlar',
    name: 'omborlar',
    meta: { requiresAuth: true, title: "Omborlar", role: ["admin"] },
    component: () => import('../views/Omborlar/Omborlar.vue')
  },
  {
    path: '/filiallar',
    name: 'filiallar',
    meta: { requiresAuth: true, title: "Filiallar", role: ["admin"] },
    component: () => import('../views/Filiallar/Filiallar.vue')
  },
  {
    path: '/filial/:id',
    name: 'filial',
    meta: { requiresAuth: true, title: "Filial", role: ["admin"] },
    component: () => import('../views/Filiallar/FilialHistory.vue')
  },
  {
    path: '/statistic/:id',
    name: 'statistic',
    meta: { requiresAuth: true, title: "Hisobotlar", role: ["admin", "branch_admin"] },
    component: () => import('../views/Statistic/Statistic.vue')
  },
  {
    path: '/statistics',
    name: 'statistics',
    meta: { requiresAuth: true, title: "Hisobotlar", role: ["admin"] },
    component: () => import('../views/AdminStatistic/Statistic.vue')
  },
  {
    path: '/hodimlar/:id',
    name: 'hodimlar',
    meta: { requiresAuth: true, title: "Hodimlar", role: ["admin", "branch_admin"] },
    component: () => import('../views/Hodimlar/Hodimlar.vue')
  },
  {
    path: '/hodim/:id',
    name: 'hodim',
    meta: { requiresAuth: true, title: "Hodim haqida", role: ["admin", "branch_admin"] },
    component: () => import('../views/Hodimlar/HodimHaqida.vue')
  },
  {
    path: '/mijozlar',
    name: 'mijozlar',
    meta: { requiresAuth: true, title: "Mijozlar" },
    component: () => import('../views/Mijozlar/Mijozlar.vue')
  },
  {
    path: '/mijoz/:id',
    name: 'mijoz',
    meta: { requiresAuth: true, title: "Mijoz" },
    component: () => import('../views/Mijozlar/Mijoz.vue')
  },
  {
    path: '/nasiyalar',
    name: 'Nasiyalar',
    meta: { requiresAuth: true, title: "Nasiyalar", role: ["branch_admin", "seller"] },
    component: () => import('../views/Nasiya/Nasiyalar.vue')
  },
  {
    path: '/nasiya/:id/:order_id',
    name: 'Nasiya',
    meta: { requiresAuth: true, title: "Nasiyalar", role: ["branch_admin", "seller"] },
    component: () => import('../views/Nasiya/NasiyaTarix.vue')
  },
  {
    path: '/return',
    name: 'Return',
    meta: { requiresAuth: true, title: "Mahsulot qaytarb olish", role: ["branch_admin", "seller"] },
    component: () => import('../views/Vozvrat/Vozvrat.vue')
  },
  {
    path: '/taminotchi/:id',
    name: 'taminotchi',
    meta: { requiresAuth: true, title: "Ta'minotchi", role: ["admin"] },
    component: () => import("../views/Ta'minotchilar/Ta'minotchi.vue")
  },
  {
    path: '/taminotchilar',
    name: 'taminotchilar',
    meta: { requiresAuth: true, title: "Ta'minotchilar", role: ["admin"] },
    component: () => import("../views/Ta'minotchilar/Ta'minotchilar.vue")
  },
  {
    path: '/taminotlar',
    name: 'taminotlar',
    meta: { requiresAuth: true, title: "Ta'minotlar", role: ["admin"] },
    component: () => import("../views/Ta'minotchilar/Ta'minotlar.vue")
  },
  {
    path: '/taminot/:id',
    name: 'taminot',
    meta: { requiresAuth: true, title: "Ta'minot", role: ["admin"] },
    component: () => import("../views/Ta'minotchilar/Ta'minot.vue")
  },
  {
    path: '/taminot/:id',
    name: 'taminot',
    meta: { requiresAuth: true, title: "Ta'minot", role: ["branch_admin"] },
    component: () => import("../views/Ta'minotchilar/Ta'minotForBranch.vue")
  },
  {
    path: '/categories',
    name: 'categories',
    meta: { requiresAuth: true, title: "Kategoriyalar", role: ["branch_admin"] },
    component: () => import("../views/Categories/Categories.vue")
  },
  {
    path: '/categoryProducts/:id',
    name: 'categoryProducts',
    meta: { requiresAuth: true, title: "Kategoriya mahsulotlari", role: ["branch_admin"] },
    component: () => import("../views/Categories/CategoryProducts.vue")
  },
  {
    path: '/expense',
    name: 'expense',
    meta: { requiresAuth: true, title: "Chiqim", role: ["branch_admin"] },
    component: () => import('../views/Chiqim/Expense.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { requiresAuth: true, title: "Sozlamalar" },
    component: () => import('../views/Setting.vue')
  },
  {
    path: '/kassa',
    name: 'kassa',
    meta: { requiresAuth: true, title: "Kassa", role: ["branch_admin", "seller"] },
    component: () => import('../views/Kassa/Kassa.vue')
  },
  {
    path: '/admin/:id',
    name: 'admin',
    meta: { requiresAuth: true, title: "Admin", role: ["branch_admin"] },
    component: () => import('../views/Admin/Admin.vue')
  },
  {
    path: '/benefit',
    name: 'benefit',
    meta: { requiresAuth: true, title: "Foydani hisoblash", role: ["branch_admin"] },
    component: () => import('../views/Foyda/Foyda.vue')
  },
]

routes = routes.filter((item) => {
  if (item.meta.role) {
    if (item.meta.role.includes(role)) {
      return item
    }
  } else {
    return item
  }
})

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('access_token') !== null

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next('/')
    }
  }
  next()
})

export default router