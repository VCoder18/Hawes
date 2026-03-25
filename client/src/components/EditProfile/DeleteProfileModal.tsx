interface DeleteProfileModalProps {
  isOpen: boolean;
  username: string;
  confirmationValue: string;
  onConfirmationChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteProfileModal({
  isOpen,
  username,
  confirmationValue,
  onConfirmationChange,
  onClose,
  onConfirm,
}: DeleteProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Delete Profile</h2>
        <p className="text-gray-600 text-sm">
          This action cannot be undone. To confirm, please type your username below.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type your username: <span className="text-red-500 font-bold">@{username}</span>
          </label>
          <input
            type="text"
            value={confirmationValue}
            onChange={(e) => onConfirmationChange(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
