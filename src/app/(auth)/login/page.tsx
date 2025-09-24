import CustomInput from "@/src/components/CustomInput";
import {Button, Link} from "@heroui/react";

export default function LoginPage(){
    return (
        <div className="p-6 bg-white rounded-xl shadow-lg w-[400px]">
            <h1 className="text-3xl font-semibold mb-5 text-center">Login</h1>
            <div className="text-center">
                <Button color="primary" type="submit" className="mb-2 w-[280px]">
                    Register
                </Button>
                <Button color="primary" type="submit" className="mb-8 w-[280px]">
                    Register
                </Button>
                <p className="text-2xl text-center">Or</p>
            </div>
            <form className="w-full max-w-md space-y-4">
                <CustomInput
                    label="Email KU"
                    type="email"
                    placeholder="you@ku.th"
                    svgSrc="/icons/mail.svg"
                    isRequired
                />
                <CustomInput
                    label="Password"
                    type="password"
                    placeholder="********"
                    svgSrc="/icons/password.svg"
                    isRequired
                />
                <div className="text-center">
                    <Button color="primary" type="submit" className="mt-5 w-1/2">
                        Login
                    </Button>
                    <p className="pt-2">Don't have an account&nbsp;
                    <Link href="/register" size="sm" underline="always">
                    Register
                    </Link>
                    </p>
                </div>
                
            </form>
        </div>
      );
}