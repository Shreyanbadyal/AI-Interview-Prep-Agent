import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth_action";
const AuthLayout = ({ children }: { children: ReactNode }) => {

    return (
        <div className="auth-layout">
            {children}
        </div>
    );

}
export default AuthLayout;