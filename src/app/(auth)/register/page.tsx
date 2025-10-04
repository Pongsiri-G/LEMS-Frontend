import CustomInput from "@/src/components/CustomInput";
import {Button, Link} from "@heroui/react";

export default function RegisterPage() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-[400px]">
        <h1 className="text-2xl font-semibold mb-10 text-center">Register</h1>
        <form className="w-full max-w-md space-y-4">
            <CustomInput
                label="Full Name"
                type="text"
                placeholder="Your name"
                svgSrc="/icons/user-round.svg"
                isRequired
            />
            <CustomInput
                label="Email"
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
            <CustomInput
                label="Confirm Password"
                type="password"
                placeholder="********"
                svgSrc="/icons/password.svg"
                isRequired
            />
            <CustomInput
                label="Phone Number"
                type="tel"
                placeholder="0xxxxxxxxx"
                svgSrc="/icons/phone.svg"
                isRequired
            />
            <div className="text-center">
                <Button color="primary" type="submit" className="mt-5 w-1/2">
                    Register
                </Button>
                <p className="pt-2">Already have an account?&nbsp;
                <Link href="/login" size="sm" underline="always">
                Login
                </Link>
                </p>
            </div>
            
        </form>
    </div>
  );
}
