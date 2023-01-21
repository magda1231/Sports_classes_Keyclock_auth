import Cookies from "universal-cookie";

export const Authenticate = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");

  return fetch("http://localhost:3003/userpage", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token.accessToken,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setRes(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
