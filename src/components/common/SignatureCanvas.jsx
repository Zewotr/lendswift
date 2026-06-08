import { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';

const SignatureCanvas = ({ onChange, error, 'data-testid': dataTestId }) => {
  const sigPadRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigPadRef.current?.clear();
    setIsEmpty(true);
    onChange?.(null);
  };

  const save = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const dataURL = sigPadRef.current.toDataURL('image/png');
      setIsEmpty(false);
      onChange?.(dataURL);
    } else {
      setIsEmpty(true);
      onChange?.(null);
    }
  };

  return (
    <div className="mb-4" data-testid={dataTestId}>
      <label className="block text-sm font-medium text-gray-700 mb-1">E‑Signature <span className="text-error">*</span></label>
      <div className="border rounded p-2 bg-white">
        <SignaturePad
          ref={sigPadRef}
          canvasProps={{ className: 'w-full h-32 border rounded', style: { touchAction: 'none' } }}
          onEnd={save}
        />
      </div>
      <button type="button" onClick={clear} className="text-sm text-gray-500 underline mt-1">Clear</button>
      {isEmpty && error && <div className="text-error text-sm mt-1">Signature required</div>}
    </div>
  );
};

export default SignatureCanvas;