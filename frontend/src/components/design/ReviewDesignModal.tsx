import { Form, Input, Modal, Radio } from 'antd';

interface FormValues {
  approved: boolean;
  comment: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (approved: boolean, comment: string) => void;
}

export function ReviewDesignModal({ open, loading, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm<FormValues>();

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values.approved, values.comment);
  };

  return (
    <Modal
      title="业主审核设计方案"
      open={open}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={onCancel}
      okText="提交审核结果"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={{ approved: true }}
      >
        <Form.Item name="approved" label="审核结论">
          <Radio.Group>
            <Radio.Button value={true}>通过（锁定该版本）</Radio.Button>
            <Radio.Button value={false}>驳回（进入修改）</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="comment"
          label="审核意见"
          rules={[{ required: true, whitespace: true, message: '请填写审核意见' }]}
        >
          <Input.TextArea rows={4} placeholder="通过或驳回都需要填写意见，将随版本记录保存" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
