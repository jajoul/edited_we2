import { defineConfig } from "umi";

export default defineConfig({
  ssr: false,
  hash: true,
  routes: [
    { path: "/", component: "index", exact: "true" },
    { path: "/login", component: "Login/Login" },
    { path: "/signup", component: "SignUp/SignUp" },
    {
      path: "/insight-web",
      component: "InsightWeb/InsightWeb",
    },
    {
      path: "/insight-web/search",
      component: "InsightWebSearch/InsightWebSearch",
    },
    { path: "/new-chanel", component: "NewChanel/NewChanel" },
    { path: "/new-chanel/:id", component: "NewChanel/NewChanel" },
    { path: "/new-topic/:id", component: "NewTopic/NewTopic" },
    { path: "/channel/:id", component: "Channel/Channel" },
    { path: "/topic/:id", component: "Topic/Topic" },
    { path: "/topic/edit/:id", component: "NewTopic/NewTopic" },
    { path: "/topics/:filter", component: "Topics/Topics" },
    { path: "/forgot-pass", component: "ForgotPassword/ForgotPassword" },
    { path: "/my-channel", component: "MyChannel/MyChannel" },
    { path: "/my-world", component: "MyWorld/MyWorld" },
    { path: "/my-world/followings", component: "MyWorld/Following" },
    { path: "/my-world/commented", component: "MyWorld/CommentedLiked" },
    { path: "/my-world/liked", component: "MyWorld/CommentedLiked" },
    { path: "/my-world/activities", component: "MyWorld/Activities" },
    { path: "/journey", component: "Journey/Journey" },
    { path: "/journey/live", component: "Journey/JourneyLive" },
    { path: "*", component: "Notfound/Notfound" },
  ],
  npmClient: "yarn",
  jsMinifier: 'terser',
  links: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap', rel: 'stylesheet' },
  ],
});
