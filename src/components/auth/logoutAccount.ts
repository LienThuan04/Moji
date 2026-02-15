import { authService } from "@/services/authService";
import { store } from "@/redux/store";
import { clearState } from "@/redux/slice/accountSlide";
import { toast } from "sonner";

export const LogOutAccount = async () => {
    try {
        const res = await authService.signOut();
        console.log("Logout response:", res);
        store.dispatch(clearState());
        if (res && (res as any).message) {
            toast.success((res as any).message);
        } else {
            toast.error("Error logging out. Please try again.");
        }
    } catch (error: any) {
        console.log("Logout error:", error?.message ?? error);
        toast.error("Error logging out. Please try again.");
    }
};