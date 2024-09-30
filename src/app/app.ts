import { Avatar } from "../components/avatar/avatar";
import { SearchUserInput } from "../components/search-user-input/search-user-input";
import { UserCard } from "../components/user-card/user-card";
import { UserRepos } from "../components/user-repo/user-repos";
import { getUserData, searchUser } from "../shared/api/api";

export function App() {
  const getUser = async (login: string) => {
    const data = await getUserData(login);
    userContent.innerHTML = "";
    if (!data.user) return;
    UserCard({ user: data.user, avatar: Avatar, container: userContent });
    if (!data.repos) return;
    UserRepos({ repos: data.repos, container: userContent });
  };

  const userQuery = new URLSearchParams(location.search);

  if (userQuery.has("login")) {
    const param = userQuery.get("login");
    if (param) {
      getUser(param);
    }
  }

  const title = document.createElement("h1");
  title.textContent = "GITHUB REPO";
  title.classList.add("title");

  const container = document.createElement("div");
  container.classList.add("container");
  container.append(title);

  const userContent = document.createElement("div");
  userContent.classList.add("userContent");

  SearchUserInput({
    getSearchingUsers: searchUser,
    onClickItem: getUser,
    container,
  });

  container.append(userContent);

  const main = document.createElement("main");
  main.classList.add("main");
  main.appendChild(container);

  return main;
}
