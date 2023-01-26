// import { useSelector } from "react-redux";
// import { selectCurrentToken } from "../ActionsReducers/TokenSlice";

// import { useHistory } from "react-router-dom";

// export default function useAuth() {
//   const token = useSelector(selectCurrentToken);
//   let isUser = null;
//   let isTrainer = null;
//   let status = null;

//   const history = useHistory();
//   if (!token) {
//     history.push("/whopsnoaccess");
//   }
//   if (token) {
//     const decodedToken = jwt_decode(token);
//     const { username, role } = decodedToken;
//     isUser = role === "user";
//     isTrainer = role === "trainer";

//     if (isUser) {
//       status = "user";
//     }
//     if (isTrainer) {
//       status = "trainer";
//     }
//   }

//   return { username, roles, isUser, isTrainer, status };
// }
