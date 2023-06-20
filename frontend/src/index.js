import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import ThemeProvider from "./Contexts/ThemeContext";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import RefreshProvider from "./Contexts/RefreshContext";
import keycloak from "./Keycloack";
import { ReactKeycloakProvider } from "@react-keycloak/web";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReactKeycloakProvider authClient={keycloak}>
    <BrowserRouter>
      <ThemeProvider>
        <RefreshProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </RefreshProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ReactKeycloakProvider>
);
