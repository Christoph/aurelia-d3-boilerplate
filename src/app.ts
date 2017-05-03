import {Router, RouterConfiguration} from "aurelia-router"

export class App {
  router = Router;

  configureRouter(config: RouterConfiguration, router) {
      this.router = router;

      config.title = "Contacts";
      config.map([
          { route: "", moduleId: "empty/no-selection", title: "Select" },
          { route: "vis/", moduleId: "vis/vis", title: "Vis", name: "vis" }
      ]);
  }
}
