import styles from "./avatar.module.css";

export const Avatar = (imageUrl: string, userLogin: string) => {
  const avatarImg = document.createElement("img");
  avatarImg.src = imageUrl;
  avatarImg.alt = userLogin;

  const avatar = document.createElement("div");
  avatar.classList.add(styles.avatar);
  avatar.appendChild(avatarImg);

  return avatar;
};
