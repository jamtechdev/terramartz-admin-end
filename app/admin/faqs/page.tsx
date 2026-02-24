import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import FaqList from "@/app/components/admin/faqs/FaqList";

export default function FaqsPage() {
    return (
        <div>
            <DashboardHeader title="FAQ Management" />
            <FaqList />
        </div>
    );
}
