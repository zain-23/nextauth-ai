"use client";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ToastAction } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useDebounce } from "@/helpers/useDebounceValue";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const username = form.watch("username");
  const debounceUsename = useDebounce(username, 1000);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debounceUsename) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debounceUsename}`
          );
          setUsernameMessage(response.data.message);
          toast({
            title: "Username is available",
            description: usernameMessage,
          });
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ??
              "Error checking username try again"
          );
          toast({
            title: "Username must be unique",
            description: usernameMessage,
            variant: "destructive",
          });
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debounceUsename]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        variant: "default",
        description: response.data.message,
      });
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error(`Error is signup ${error}`);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Sign failed",
        variant: "destructive",
        description: axiosError.response?.data.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <CardHeader className="space-y-3">
              <CardTitle>
                <h4 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
                  Join Mystery Message.
                </h4>
              </CardTitle>
              <CardDescription className="text-center">
                Sign up to start adventure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          disabled={isCheckingUsername}
                        />
                        {isCheckingUsername ? (
                          <Loader className="animate-spin w-5 absolute right-3 top-[25%]" />
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex justify-center gap-x-3 items-center"
                size={"lg"}
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : null}
                Sign up
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
