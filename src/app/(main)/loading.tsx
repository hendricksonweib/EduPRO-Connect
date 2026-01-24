import { LogoLoading } from "@/components/logo-loading"

export default function Loading() {
    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <LogoLoading size={150} />
        </div>
    );
}

