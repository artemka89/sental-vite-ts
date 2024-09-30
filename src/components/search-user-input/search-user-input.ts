import {
  SearchingUsers,
  SearchingUser,
  USER_PER_PAGE,
} from "../../shared/api/api";
import { debounce } from "../../shared/lib/debounce";
import styles from "./search-user-input.module.css";

interface SearchUserInputProps {
  getSearchingUsers: (
    value: string,
    page?: number
  ) => Promise<SearchingUsers | undefined>;
  onClickItem: (login: string) => void;
  container: HTMLElement;
}

export const SearchUserInput = ({
  getSearchingUsers,
  onClickItem,
  container,
}: SearchUserInputProps) => {
  let isOpenPopup = false;
  let isLoading = false;
  let totalPages = 1;
  let currentPage = 1;
  let observer: IntersectionObserver;

  const popupFade = document.createElement("div");
  popupFade.classList.add(styles.popupFade);

  const searchUsers = document.createElement("div");
  searchUsers.classList.add(styles.searchUsers);

  const searchWrapper = document.createElement("div");
  searchWrapper.classList.add(styles.searchWrapper);

  const input = document.createElement("input");
  input.classList.add(styles.input);
  input.placeholder = "Enter user login";
  input.addEventListener("keyup", debounce(onInputHandler, 500));
  input.addEventListener("click", togglePopupFade.bind(null, true));

  const searchingItemList = document.createElement("ul");

  const endElement = document.createElement("div");
  endElement.classList.add(styles.endElement);

  const popup = document.createElement("div");
  popup.classList.add(styles.popup);
  popup.append(searchingItemList, endElement);

  searchWrapper.append(popupFade, input, popup);
  searchUsers.append(searchWrapper);

  async function onInputHandler(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    clearItems();

    if (!value) {
      showPopup(false);
      return;
    }

    const searchingUsers = await getSearchingUsersData(value, currentPage);
    if (!searchingUsers) return;
    addItems(searchingUsers.items);

    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          if (
            isLoading ||
            currentPage > totalPages ||
            !searchingItemList.hasChildNodes()
          )
            return;

          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              const searchingUsers = await getSearchingUsersData(
                value,
                currentPage
              );
              if (!searchingUsers) return;
              addItems(searchingUsers.items);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        }
      );
    }

    if (!isOpenPopup) {
      showPopup(true);
      searchingItemList.addEventListener("click", onClickItemHandler);
    }
  }

  async function getSearchingUsersData(value: string, page = 1) {
    isLoading = true;
    const searchingUsers = await getSearchingUsers(value, page);
    isLoading = false;
    if (!searchingUsers) return;

    totalPages = Math.ceil(searchingUsers.total_count / USER_PER_PAGE);
    if (totalPages > 1) {
      currentPage += 1;
    }

    return searchingUsers;
  }

  function onClickWithoutPopup(event: MouseEvent) {
    const clickedElement = (event.target as HTMLLIElement).offsetParent;

    if (clickedElement !== popup && event.target !== input) {
      togglePopupFade(false);
      showPopup(false);
    }
  }

  function onClickItemHandler(event: Event) {
    const target = event.target as HTMLLIElement;

    if (target.tagName !== "LI") {
      return;
    }

    const username = target.textContent;

    if (username) {
      onClickItem(username);
      showPopup(false);
      togglePopupFade(false);
      history.pushState({ login: username }, "", `?login=${username}`);
    }
  }

  function showPopup(value: boolean) {
    isOpenPopup = value;
    if (value) {
      popup.style.display = "block";
      window.addEventListener("click", onClickWithoutPopup);
      observer.observe(endElement);
    } else {
      clearItems();
      input.value = "";
      popup.style.display = "none";
      searchingItemList.removeEventListener("click", onClickItemHandler);
      window.removeEventListener("click", onClickWithoutPopup);
      observer.disconnect();
    }
  }

  function addItems(searchingValues: SearchingUser[]) {
    if (searchingValues.length === 0) {
      const listItem = document.createElement("li");
      listItem.classList.add(styles.notFound);
      listItem.textContent = "No users found";
      searchingItemList.appendChild(listItem);
      return;
    }
    searchingValues.forEach((login) => {
      const listItem = document.createElement("li");
      listItem.classList.add(styles.listItem);
      listItem.textContent = login.login;
      listItem.id = login.id;
      searchingItemList.appendChild(listItem);
    });
  }

  function clearItems() {
    searchingItemList.innerHTML = "";
    currentPage = 1;
  }

  function togglePopupFade(value: boolean) {
    if (value) {
      window.addEventListener("click", onClickWithoutPopup);
      popupFade.style.visibility = "visible";
      popupFade.style.opacity = "1";
    } else {
      popupFade.style.opacity = "0";
      setTimeout(() => {
        popupFade.style.visibility = "hidden";
      }, 300);
    }
  }

  container.appendChild(searchUsers);
};
