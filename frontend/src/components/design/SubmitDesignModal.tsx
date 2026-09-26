import { Form, Input, Modal } from 'antd';

interface FormValues {
  comment: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (comment: string) => void;
}

export function SubmitDesignModal({ open, loading, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm<FormValues>();

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values.comment);
  };

  return (
    <Modal
      title="提交设计方案"
      open={open}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={onCancel}
      okText="提交审核"
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="comment"
          label="提交说明"
          rules={[{ required: true, whitespace: true, message: '请填写本次提交的说明' }]}
        >
          <Input.TextArea rows={4} placeholder="说明本版调整内容，提交后将生成新版本快照并进入业主审核" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
