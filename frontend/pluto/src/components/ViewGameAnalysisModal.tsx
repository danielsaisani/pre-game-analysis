import { Modal } from "./ui/modal";

interface ViewGameAnalysisModalProps {
    onClose: (closed: boolean) => void
}

export function ViewGameAnalysisModal({ onClose }: ViewGameAnalysisModalProps) {

    return (
        <Modal onClose={onClose}>
            <div className="space-y-4">
            </div>
        </Modal>
    )
}