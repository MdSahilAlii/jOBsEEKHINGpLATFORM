import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Modal, ModalBody, ModalHeader, ModalTitle, Row } from 'react-bootstrap';
import Feedback from 'react-bootstrap/Feedback';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
const AddEditModal = ({
  eventData,
  isEditable,
  onAddEvent,
  onRemoveEvent,
  onUpdateEvent,
  open,
  toggle
}) => {
  const schema = yup.object({
    title: yup.string().required('Please provide a valid event name')
  });
  const {
    handleSubmit,
    setValue,
    reset,
    register,
    formState: {
      errors
    }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmitEvent = data => {
    if (isEditable) {
      onUpdateEvent(data);
    } else {
      onAddEvent(data);
    }
  };
  useEffect(() => {
    if (eventData?.title) {
      setValue('title', String(eventData.title));
    }
  }, [eventData]);
  useEffect(() => {
    if (!open) reset();
  }, [open]);
  return <Modal show={open} onHide={toggle} centered>
            <Form onSubmit={handleSubmit(onSubmitEvent)}>
                <ModalHeader>
                    <ModalTitle as="h4">{isEditable ? 'Edit' : 'Create'} Event</ModalTitle>
                    <button type="button" className="btn-close" onClick={toggle}></button>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={12}>
                            <FormGroup className="mb-2">
                                <FormLabel>Event Name</FormLabel>
                                <FormControl type="text" placeholder="Insert Event Name" isInvalid={!!errors.title} {...register('title')} />
                                <Feedback type="invalid">{errors.title?.message}</Feedback>
                            </FormGroup>
                        </Col>
                    </Row>

                    <div className="d-flex flex-wrap align-items-center gap-2">
                        {isEditable && <Button variant="danger" type="button" onClick={onRemoveEvent}>
                                Delete
                            </Button>}

                        <Button variant="light" type="button" className="ms-auto" onClick={toggle}>
                            Close
                        </Button>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </div>
                </ModalBody>
            </Form>
        </Modal>;
};
export default AddEditModal;