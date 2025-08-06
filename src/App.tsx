import {
  ApolloProviderWrapper,
  MSWProvider,
  ThemeProvider,
} from "@app/providers";
import { UsersPage } from "@pages/users";
import "./App.css";

function App() {
  return (
    <MSWProvider>
      <ApolloProviderWrapper>
        <ThemeProvider>
          <div className="App">
            <UsersPage />
          </div>
        </ThemeProvider>
      </ApolloProviderWrapper>
    </MSWProvider>
  );
}

export default App;
