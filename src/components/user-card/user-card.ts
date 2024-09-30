import { User } from "../../shared/api/api";
import styles from "./user-card.module.css";

interface UserCardProps {
  user: User;
  avatar: (imageUrl: string, userLogin: string) => HTMLElement;
  container: HTMLElement;
}

export const UserCard = ({ user, avatar, container }: UserCardProps) => {
  const avatarElement = avatar(user.avatar_url, user.login);

  const name = document.createElement("h2");
  name.classList.add(styles.username);
  name.textContent = user.login;

  const repoLink = document.createElement("a");
  repoLink.classList.add(styles.repoLink);
  repoLink.href = user.html_url;
  repoLink.target = "_blank";
  repoLink.appendChild(name);

  const cardHeader = document.createElement("div");
  cardHeader.classList.add(styles.cardHeader);
  cardHeader.append(avatarElement, repoLink);

  const repositories = document.createElement("li");
  repositories.classList.add(styles.infoItem);
  repositories.textContent = `Repositories: ${user.public_repos}`;

  const followers = document.createElement("li");
  followers.classList.add(styles.infoItem);
  followers.textContent = `Followers: ${user.followers}`;

  const following = document.createElement("li");
  following.classList.add(styles.infoItem);
  following.textContent = `Following: ${user.following}`;

  const infoList = document.createElement("ul");
  infoList.classList.add(styles.infoList);
  infoList.append(repositories, followers, following);

  const card = document.createElement("div");
  card.classList.add(styles.card);
  card.append(cardHeader, infoList);

  container.appendChild(card);
};
