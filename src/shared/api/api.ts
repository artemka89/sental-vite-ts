const API_URL = "https://api.github.com";
export const USER_PER_PAGE = 20;

export interface SearchingUser {
  id: string;
  login: string;
  avatar_url: string;
}

export interface SearchingUsers {
  total_count: number;
  items: SearchingUser[];
}

export interface User {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface Repo {
  name: string;
  html_url: string;
}

async function fetchUserData<R>(
  url: string,
  login: string
): Promise<R | undefined> {
  try {
    if (typeof login !== "string") {
      throw new TypeError("username must be a string");
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const user: Promise<R> = await response.json();
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    return undefined;
  }
}

export async function getUserData(login: string) {
  const user = await fetchUserData<User>(`${API_URL}/users/${login}`, login);
  const repos = await fetchUserData<Repo[]>(
    `${API_URL}/users/${login}/repos`,
    login
  );

  return { user, repos };
}

export async function searchUser(login: string, page = 1) {
  const url = `${API_URL}/search/users?q=${login}&per_page=${USER_PER_PAGE}&page=${page}`;

  const response = await fetchUserData<SearchingUsers>(url, login);
  return response;
}
