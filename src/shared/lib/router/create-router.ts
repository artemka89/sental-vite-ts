export interface Route {
  path: string;
  element: () => HTMLElement;
  redirect?: string;
}

class AppRouter {
  private container: HTMLElement | null = null;
  private routes: Route[] = [];

  public createRouter = (routes: Route[], container: HTMLElement) => {
    this.routes = routes;
    this.container = container;

    window.addEventListener("popstate", (event) => {
      if (event.state) {
        this.handleLocation();
      }
    });

    window.addEventListener("load", () => {
      history.pushState(
        location.pathname,
        "",
        `${location.pathname}${location.search}`
      );
    });

    this.handleLocation();
  };

  public createLink = ({
    to,
    children,
    className,
  }: {
    to: string;
    children?: Node | string;
    className?: string;
  }) => {
    const link = document.createElement("a");
    link.href = to;

    const handleClick = (event: MouseEvent) => {
      const href = link.getAttribute("href");
      if (!href) return;

      event.preventDefault();
      history.pushState(href, "", href);
      this.handleLocation(href);
    };

    link.addEventListener("click", handleClick);

    if (className) {
      link.className = className;
    }

    if (!children) return link;

    if (typeof children === "string") {
      link.textContent = children;
      return link;
    }

    link.appendChild(children);

    return link;
  };

  private handleLocation = (path = location.pathname) => {
    if (!this.container) return;

    for (const route of this.routes) {
      if (path === route.path || path === route.redirect) {
        if (route.redirect) {
          history.pushState(route.redirect, "", route.redirect);
        }
        const element = route.element();
        this.container.innerHTML = "";
        this.container.appendChild(element);
        return;
      } else {
        const element = this.routes
          .find((route) => route.path === "*")
          ?.element();

        if (element) {
          this.container.innerHTML = "";
          this.container.appendChild(element);
        }
      }
    }
  };
}

const appRouter = new AppRouter();

export const createRouter = appRouter.createRouter;
export const Link = appRouter.createLink;
