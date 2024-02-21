import React, { useRef, ElementRef, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Main from "./Main";
import Navbar from "./components/navigations/Navbar";
import { Container } from "semantic-ui-react";
import { Toaster, toast } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { usePositionStore } from "./store/positionStore";

const queryClient = new QueryClient();

function App() {
  const { setTopRef, setBottomRef } = usePositionStore();
  const topRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    setTopRef(topRef);
    setBottomRef(bottomRef);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div className="fixed top-0 w-full z-10">
          <Navbar />
        </div>
        <Toaster richColors position="top-center" />
        <Container text className="mt-[57px]">
          <Main />
        </Container>
      </div>
    </QueryClientProvider>
  );
}

export default App;
