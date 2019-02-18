import { combineReducers } from "redux";
import { signedOutReducer } from "./auth/reducers";
import { signInStatusResult } from "./auth/reducers";

import { labelsResult } from "./sidebar/reducers";
import { messagesResult, emailMessageResult, pageTokens, searchQuery } from "./messagelist/reducers";

export default combineReducers({
  signedOutReducer,
  signInStatusResult,
  labelsResult,
  messagesResult,
  emailMessageResult,
  pageTokens,
  searchQuery
});
