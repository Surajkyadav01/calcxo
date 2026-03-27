import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyDialogProps {
  onClose: () => void;
}

const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-popover rounded-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-popover-foreground">Privacy Policy</h2>
          <button onClick={onClose} className="text-muted-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="text-sm text-popover-foreground space-y-3 leading-relaxed">
          <p className="font-medium">Terms & Conditions</p>
          <p>
            This Calculator app is designed for personal use. By using this app, you agree to the following terms:
          </p>
          <p>
            <strong>1. Data Privacy:</strong> All calculations are performed locally on your device. We do not collect, store, or transmit any of your calculation data to external servers.
          </p>
          <p>
            <strong>2. History:</strong> Your calculation history is stored locally in your browser session. It is automatically cleared when you close the app or use the "Clear history" option.
          </p>
          <p>
            <strong>3. No Personal Data:</strong> This app does not require any personal information, login, or registration. Your privacy is fully protected.
          </p>
          <p>
            <strong>4. Accuracy:</strong> While we strive for accuracy, this calculator is provided "as is" without warranty. Please verify critical calculations independently.
          </p>
          <p>
            <strong>5. Third Party:</strong> This app does not use any third-party analytics or tracking services.
          </p>
          <p>
            <strong>6. Updates:</strong> We may update these terms from time to time. Continued use of the app constitutes acceptance of any changes.
          </p>
          <p className="text-muted-foreground text-xs mt-4">
            Last updated: March 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyDialog;
