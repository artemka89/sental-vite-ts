export interface Route {
  path: string;
  element: () => HTMLElement;
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
    Object.values(this.routes).forEach(async (route) => {
      if (path === route.path && this.container) {
        const element = route.element();
        this.container.innerHTML = "";
        this.container.appendChild(element);
      }
    });
  };
}

const appRouter = new AppRouter();

export const createRouter = appRouter.createRouter;
export const Link = appRouter.createLink;
