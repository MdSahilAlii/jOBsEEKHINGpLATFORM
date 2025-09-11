import { useCallback, useEffect } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { TbCloudUpload, TbX } from 'react-icons/tb';
import FileExtensionWithPreview from '@/components/FileExtensionWithPreview';
import { useNotificationContext } from '@/context/useNotificationContext';
import { formatBytes } from '@/helpers/file';
import clsx from 'clsx';
import { Link } from 'react-router';
const isFileWithPreview = file => {
  return 'preview' in file && typeof file.preview === 'string';
};
const FileUploader = props => {
  const {
    files,
    setFiles,
    onUpload,
    accept = {
      'image/*': []
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;
  const {
    showNotification
  } = useNotificationContext();
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
      showNotification({
        message: 'Cannot upload more than 1 file at a time',
        variant: 'danger'
      });
      return;
    }
    if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
      showNotification({
        message: `Cannot upload more than ${maxFileCount} files`,
        variant: 'danger'
      });
      return;
    }
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    const updatedFiles = files ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({
        file
      }) => {
        showNotification({
          message: `File ${file.name} was rejected`,
          variant: 'danger'
        });
      });
    }
    if (onUpload && updatedFiles.length > 0 && updatedFiles.length <= maxFileCount) {
      const target = updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;
      onUpload(updatedFiles).then(() => {
        showNotification({
          message: `${target} uploaded`,
          variant: 'success'
        });
        setFiles([]);
      }).catch(() => {
        showNotification({
          message: `Failed to upload ${target}`,
          variant: 'danger'
        });
      });
    }
  }, [files, maxFileCount, multiple, onUpload, setFiles]);
  const onRemove = index => {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };
  useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach(file => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);
  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;
  return <div>
            <Dropzone onDrop={onDrop} accept={accept} maxSize={maxSize} minSize={9} maxFiles={maxFileCount} multiple={maxFileCount > 1 || multiple} disabled={isDisabled}>
                {({
        getRootProps,
        getInputProps
      }) => <div className={clsx('dropzone', className)} {...getRootProps()} {...dropzoneProps}>
                        <input {...getInputProps()} />
                        <div className="dz-message needsclick">
                            <div className="avatar-lg mx-auto mb-3">
                <span className="avatar-title bg-info-subtle text-info rounded-circle">
                  <TbCloudUpload className="fs-24" />
                </span>
                            </div>
                            <h4 className="mb-2">Drop files here or click to upload.</h4>
                            <p className="text-muted fst-italic mb-3">You can drag images here, or browse files via the
                                button below.</p>
                            <button type="button" className="btn btn-sm shadow btn-default">
                                Browse Images
                            </button>
                        </div>
                    </div>}
            </Dropzone>

            {!!files?.length && files?.map((file, index) => <FileCard key={index} file={file} onRemove={() => onRemove(index)} />)}
        </div>;
};
const FileCard = ({
  file,
  onRemove
}) => {
  return <div className="dropzone-previews mt-3">
            <Card className="mt-1 mb-0 border-dashed border">
                <div className="p-2">
                    <Row className="align-items-center">
                        <Col xs="auto">{isFileWithPreview(file) && <FilePreview file={file} />}</Col>
                        <Col className="ps-0">
                            <Link to="" className="fw-semibold">
                                {file.name}
                            </Link>
                            <p className="mb-0 text-muted">{formatBytes(file.size)}</p>
                        </Col>
                        <Col xs="auto">
                            <Button variant="link" size="sm" className="text-danger" onClick={onRemove}>
                                <TbX />
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>;
};
const FilePreview = ({
  file
}) => {
  if (file.type.startsWith('image/')) {
    return <img src={file.preview} alt={file.name} width={32} height={32} loading="lazy" className="avatar-sm rounded bg-light" />;
  }
  return <FileExtensionWithPreview extension={file.name.split('.').pop() ?? ''} />;
};
export default FileUploader;