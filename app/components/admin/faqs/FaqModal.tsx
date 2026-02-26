import { useState, useEffect } from "react";
import { Faq, faqService } from "@/app/services/faq.service";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    faq?: Faq | null;
    onSuccess: () => void;
};

export default function FaqModal({ isOpen, onClose, faq, onSuccess }: Props) {
    const { token } = useAuth();
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (faq) {
            setQuestion(faq.question);
            setAnswer(faq.answer);
            setIsActive(faq.isActive);
        } else {
            setQuestion("");
            setAnswer("");
            setIsActive(true);
        }
    }, [faq, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        try {
            const payload = { question, answer, isActive };
            if (faq) {
                await faqService.updateFaq(faq._id, payload, token);
                toast.success("FAQ updated successfully");
            } else {
                await faqService.createFaq(payload, token);
                toast.success("FAQ created successfully");
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {faq ? "Edit FAQ" : "Add New FAQ"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        x
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question
                        </label>
                        <textarea
                            required
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Answer
                        </label>
                        <textarea
                            required
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                            rows={5}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-700">
                            Active (Visible to public)
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : faq ? "Update FAQ" : "Save FAQ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
