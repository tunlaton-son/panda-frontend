import React from "react";
import { Container } from "semantic-ui-react";
import {
  FeedSummary,
  FeedLabel,
  FeedEvent,
  FeedDate,
  FeedContent,
  CardHeader,
  CardContent,
  Card,
  Feed,
  Input,
  CardGroup,
  Button,
  Icon,
  Image,
} from "semantic-ui-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type FormFields = z.infer<typeof schema>;

const Signin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const { login } = useAuth();
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await axios.post("/api/v1/auth/authenticate", data);

      if (res.status !== 200) {
        toast.error("Login Fail!");
        return;
      }

      login(res.data.token);
      toast.success("Login Success!");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Container text className="mt-[200px]">
      <div className="w-full flex flex-row justify-center">
        <Card>
          <CardContent className="w-full flex flex-col gap-2">
            <CardHeader>Sign In</CardHeader>
            <Button basic>
              <Image
                src="/icons/google-icon.png"
                className="w-5 h-5 mr-2 mb-1"
              />
              Continue with Google
            </Button>
            <div className="w-full flex justify-center mt-[16px] mb-[16px]">
              <div className="separator">OR</div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full flex flex-col gap-y-2 mb-2">
                <Input
                  type="text"
                  disabled={isSubmitting}
                  className="w-full"
                  name="username"
                  onChange={async (e, { name, value }) => {
                    setValue(name, value);
                  }}
                  placeholder="Username"
                />
                <Input
                  type="password"
                  disabled={isSubmitting}
                  className="w-full"
                  placeholder="Password"
                  name="password"
                  onChange={async (e, { name, value }) => {
                    setValue(name, value);
                  }}
                />
              </div>
              <Button
                type="submit"
                primary
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-full flex justify-center">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="w-full flex justify-end">
              <a href="/sign-up" className="hover:underline text-sm">
                <span className="text-black">New to AI Blog?</span> Sign up
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Signin;
