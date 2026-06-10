import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { compressImage } from '../../utils/imageCompression';

const FileUpload = ({
  label,
  name,
  onChange,
  accept = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSize = 5 * 1024 * 1024,
  maxFiles = 3,
  required = false,
  'data-testid': dataTestId,
}) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);

  const simulateUpload = (fileId) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // 1. Handle rejections from dropzone
    if (rejectedFiles.length) {
      const rejectErrors = rejectedFiles.map(rej => {
        let errorMsg = rej.errors[0].message;
        if (rej.errors[0].code === 'file-too-large') {
          errorMsg = `File is larger than ${maxSize / (1024 * 1024)}MB`;
        }
        if (rej.errors[0].code === 'file-invalid-type') {
          errorMsg = `File type must be ${accept.join(', ')}`;
        }
        return { name: rej.file.name, error: errorMsg };
      });
      setErrors(rejectErrors);
      return;
    }

    // 2. Process accepted files
    const processed = [];
    for (const file of acceptedFiles) {
      // Manual size check (reject original if > maxSize)
      if (file.size > maxSize) {
        setErrors(prev => [...prev, { name: file.name, error: `File is larger than ${maxSize / (1024 * 1024)}MB` }]);
        continue;
      }
      // Manual type check
      const isTypeValid = accept.some(type => {
        if (type.endsWith('/*')) return file.type.startsWith(type.split('/')[0]);
        return file.type === type;
      });
      if (!isTypeValid) {
        setErrors(prev => [...prev, { name: file.name, error: `File type must be ${accept.join(', ')}` }]);
        continue;
      }

      let processedFile = file;
      if (file.type.startsWith('image/')) {
        try {
          processedFile = await compressImage(file);
        } catch (err) {
         alert('Compression failed', err);
        }
      }
      processedFile.uploadId = `${name}-${Date.now()}-${Math.random()}`;
      processed.push(processedFile);
    }

    const newFiles = [...files, ...processed].slice(0, maxFiles);
    setFiles(newFiles);
    setErrors(prev => prev.filter(e => !processed.some(f => f.name === e.name)));
    onChange?.(newFiles);

    for (const file of processed) {
      await simulateUpload(file.uploadId);
    }
    onChange?.(newFiles, true);
  }, [files, onChange, maxFiles, name, maxSize, accept]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: true,
  });

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
    const removedId = files[index].uploadId;
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[removedId];
      return newProgress;
    });
  };

  const getPreview = (file) => {
    if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded" />;
    }
    if (file.type === 'application/pdf') {
      return <div className="w-16 h-16 bg-red-100 flex items-center justify-center rounded">PDF</div>;
    }
    return <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">📄</div>;
  };

  const allUploaded = files.length > 0 && files.every(f => uploadProgress[f.uploadId] === 100);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} data-testid={dataTestId} />
        {isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <p>Drag & drop or click to upload (max {maxFiles} files, {maxSize / (1024 * 1024)}MB each)</p>
        )}
      </div>
      {errors.length > 0 && errors.map((err, i) => (
        <div key={i} className="text-error text-sm mt-1" role="alert">{err.name}: {err.error}</div>
      ))}
      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 border rounded">
              {getPreview(file)}
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500" data-testid={`${name}-size`}>
                  {(file.size / 1024).toFixed(0)} KB
                </p>
                {uploadProgress[file.uploadId] !== undefined && uploadProgress[file.uploadId] < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${uploadProgress[file.uploadId]}%` }} />
                  </div>
                )}
                {uploadProgress[file.uploadId] === 100 && <p className="text-xs text-accent mt-1">✓ Uploaded</p>}
              </div>
              <button type="button" onClick={() => removeFile(idx)} className="text-error text-sm">Remove</button>
            </div>
          ))}
        </div>
      )}
      {required && files.length === 0 && (
        <div className="text-error text-sm mt-1">At least one file required</div>
      )}
      {required && files.length > 0 && !allUploaded && (
        <div className="text-warning text-sm mt-1">Waiting for upload to complete...</div>
      )}
    </div>
  );
};

export default FileUpload;