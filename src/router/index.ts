import { createRouter, createWebHistory } from 'vue-router';
import FinalePhaseComponent from '@/components/FinalePhaseComponent.vue';
import GroupComponent from '@/components/GroupComponent.vue';
import HomeComponent from '@/components/HomeComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import ScoreBoardComponent from '@/components/ScoreBoardComponent.vue';
import SignupComponent from '@/components/SignupComponent.vue';
import useYakStore from '@/store';

const routes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/home',
    name: 'home',
    component: HomeComponent,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupComponent,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/groups/:groupName',
    name: 'groups',
    component: GroupComponent,
    props: true,
  },
  {
    path: '/score_board',
    name: 'score_board',
    component: ScoreBoardComponent,
  },
  {
    path: '/finale_phase',
    name: 'finale_phase',
    component: FinalePhaseComponent,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const yakStore = useYakStore();

  if (to.meta.allowAnonymous && !from.meta.allowAnonymous) {
    yakStore.eraseAuthState();
    next();
  } else {
    next();
  }
});

export default router;
