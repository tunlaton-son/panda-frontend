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
  Form,
} from "semantic-ui-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  username: z.string().min(5),
  password: z.string().min(8),
  retypePassword: z.string().min(8),
});

type FormFields = z.infer<typeof schema>;

const Signup = () => {

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      retypePassword: "",
    },
    resolver: zodResolver(schema),
  });

  const getUserByEmail = async (email: string) => {
    try {
      const res = await axios.get(`/api/v1/auth/email/${email}`);

      return res.data;
    } catch (e) {
      console.log(e);
    }
  };

  const getUserByUsername = async (username: string) => {
    try {
      const res = await axios.get(`/api/v1/auth/username/${username}`);

      return res.data;
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      let isValid = true;
      const email = await getUserByEmail(data.email);
      if (email) {
        setError("email", { message: "This email already taken." });
        isValid = false;
      }

      const username = await getUserByUsername(data.username);
      if (username) {
        setError("username", { message: "This username already taken." });
        isValid = false;
      }

      if (isValid) {
        const res = await axios.post("/api/v1/auth", data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container text className="mt-[200px]">
      <div className="w-full flex flex-row justify-center">
        <Card>
          <CardContent className="w-full flex flex-col gap-2">
            <CardHeader>Sign Up</CardHeader>
            <Button basic>
              <Image
                src="/icons/google-icon.png"
                className="w-5 h-5 mr-2 mb-1"
              />
              Sign up with Google
            </Button>
            <div className="w-full flex justify-center mt-[16px] mb-[16px]">
              <div className="separator">OR</div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full flex flex-col gap-y-2 mb-2">
              <Input
                  type="name"
                  className="w-full"
                  placeholder="Name"
                  name="name"
                  disabled={isSubmitting}
                  onChange={async (e, { name, value }) => {
                    setValue(name, value);
                  }}
                />
                {errors.email && (
                  <span className="text-sm text-red-600">
                    {errors?.name?.message}
                  </span>
                )}
                <Input
                  type="email"
                  className="w-full"
                  placeholder="Email"
                  name="email"
                  disabled={isSubmitting}
                  onChange={async (e, { name, value }) => {
                    setValue(name, value);
                  }}
                />
                {errors.email && (
                  <span className="text-sm text-red-600">
                    {errors.email.message}
                  </span>
                )}
                <Input
                  type="text"
                  className="w-full"
                  placeholder="Username"
                  name="username"
                  disabled={isSubmitting}
                  onChange={async (e, { name, value }) => {
                    setValue(name, value);
                  }}
                />
                {errors.username && (
                  <span className="text-sm text-red-600">
                    {errors.username.message}
                  </span>
                )}
                <Input
                  type="password"
                  className="w-full"
                  placeholder="Password"
                  name="password"
                  disabled={isSubmitting}
                  onChange={async (e, { name, value }) => {
                    setValue(name, value);
                  }}
                />
                {errors.password && (
                  <span className="text-sm text-red-600">
                    {errors.password.message}
                  </span>
                )}
                <Input
                  type="password"
                  className="w-full"
                  name="retypePassword"
                  placeholder="Retype-password"
                  disabled={isSubmitting}
                  onChange={async (e, { name, value }) => {
                    setValue(name, value);
                  }}
                />
                {errors.retypePassword && (
                  <span className="text-sm text-red-600">
                    {errors.retypePassword.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                primary
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div
                    className="w-full flex justify-center"
                  >
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
            <div className="w-full flex justify-end">
              <a href="/sign-in" className="hover:underline text-sm">
                <span className="text-black">Already have an account?</span>{" "}
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Signup;
