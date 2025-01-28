import { Modal } from "./modal";

interface ViewGameAnalysisModalProps {
    onClose: (closed: boolean) => void
    onSubmit: (data: { name: string; email: string; phone: string, phone_extension: string }) => void
}

export function ViewGameAnalysisModal({ onClose }: ViewGameAnalysisModalProps) {

    return (
        <Modal onClose={onClose}>
            <div className="space-y-4">
            </div>
        </Modal>
    )
}