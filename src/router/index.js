import { createRouter, createWebHistory } from "vue-router";
import FormView from "../views/FormView.vue";
import ResultView from "../views/ResultView.vue";
import HistoryView from "../views/HistoryView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "form",
      component: FormView,
    },
    {
      path: "/result",
      name: "result",
      component: ResultView,
    },
    {
      path: "/history",
      name: "history",
      component: HistoryView,
    },
  ],
});

export default router;
