import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { useState } from "react";
import { NavLink } from "react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Login = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="bg-slate-50 p-10 rounded-xl shadow-xs flex flex-col justify-center items-center gap-5">
                <div>
                    <h1 className="font-bold text-2xl">
                        Sign in to manage your tasks
                    </h1>
                </div>
                <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <FieldSet className="w-full max-w-xs">
                            <FieldGroup>
                                {/*username*/}
                                <Field>
                                    <FieldLabel
                                        className="text-[16px]"
                                        htmlFor="username"
                                    >
                                        Username
                                    </FieldLabel>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="enter your username"
                                    />
                                </Field>
                                {/*password*/}
                                <Field>
                                    <FieldLabel
                                        className="text-[16px]"
                                        htmlFor="password"
                                    >
                                        Password
                                    </FieldLabel>

                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={
                                                isPasswordVisible
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••••••••"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setIsPasswordVisible(
                                                    (prevState) => !prevState,
                                                )
                                            }
                                            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                                        >
                                            {isPasswordVisible ? (
                                                <EyeOffIcon size={16} />
                                            ) : (
                                                <EyeIcon size={16} />
                                            )}
                                            <span className="sr-only">
                                                {isPasswordVisible
                                                    ? "Hide password"
                                                    : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Button
                            disabled={isLogin}
                            onClick={() => setIsLogin(true)}
                            className="w-full mt-10"
                        >
                            {isLogin ? "Signing in..." : "Sign in"}
                            {isLogin ? <Spinner /> : <></>}
                        </Button>
                    </form>

                    <div className="flex items-center justify-center mt-5">
                        <h1 className="text-black/50">
                            Dont have an account yet?
                            <NavLink
                                to="/register"
                                className="ml-2 text-black hover:underline"
                            >
                                Sign up
                            </NavLink>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
