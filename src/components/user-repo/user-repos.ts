import { Repo } from "../../shared/api/api";
import styles from "./user-repos.module.css";

interface UserRepoProps {
  repos: Repo[];
  container: HTMLElement;
}

export const UserRepos = ({ repos, container }: UserRepoProps) => {
  const repoWrapper = document.createElement("div");
  repoWrapper.classList.add(styles.repoWrapper);

  const list = document.createElement("ul");
  list.classList.add(styles.repoList);

  if (repos.length > 5) {
    repoWrapper.style.paddingRight = "5px";
  }

  repos.forEach((repo) => {
    const repoItem = createRepoItem(repo);
    list.appendChild(repoItem);
  });

  repoWrapper.appendChild(list);

  function createRepoItem(repo: Repo) {
    const repoLink = document.createElement("a");
    repoLink.classList.add(styles.repoItem);
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.textContent = repo.name;

    const repoItem = document.createElement("li");
    repoItem.appendChild(repoLink);

    return repoItem;
  }

  container.appendChild(repoWrapper);
};
