import { App, Avatar, Button, Card, Divider, Form, Input, Typography } from "antd";
import { LockOutlined, SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { modal } = App.useApp();

  const submit = (values: any) => {
    setErrors({});
    setLoading(true);

    axios
      .post("/change-password", values)
      .then((res) => {
        if (res.data.status === "changed") {
          modal.success({
            title: "Success!",
            content: <div>Password successfully changed.</div>,
            onOk() {
              form.setFieldsValue({
                old_password: "",
                password: "",
                password_confirmation: "",
              });
            },
          });
        }
      })
      .catch((err) => {
        if (err?.response?.status === 422) {
          setErrors(err.response.data.errors);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
      <Card className="border-0 shadow-sm" bodyStyle={{ padding: 0 }}>
        <div className="bg-slate-900 px-6 py-6 text-white md:px-8">
          <div className="flex items-center gap-4">
            <Avatar size={52} icon={<LockOutlined />} className="bg-slate-700" />
            <div>
              <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
                Change Password
              </Typography.Title>
              <Typography.Text style={{ color: "rgba(255,255,255,0.75)" }}>
                Keep your account secure with a strong password.
              </Typography.Text>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 md:px-8">
          <Form
            form={form}
            layout="vertical"
            onFinish={submit}
            autoComplete="off"
            initialValues={{
              old_password: "",
              password: "",
              password_confirmation: "",
            }}
          >
            <Form.Item
              label="CURRENT PASSWORD"
              name="old_password"
              validateStatus={errors?.old_password ? "error" : ""}
              help={errors?.old_password ? errors?.old_password[0] : ""}
            >
              <Input.Password placeholder="Current password" size="large" />
            </Form.Item>

            <Form.Item
              label="NEW PASSWORD"
              name="password"
              validateStatus={errors?.password ? "error" : ""}
              help={errors?.password ? errors?.password[0] : ""}
            >
              <Input.Password placeholder="New password" size="large" />
            </Form.Item>

            <Form.Item
              label="CONFIRM NEW PASSWORD"
              name="password_confirmation"
              validateStatus={errors?.password_confirmation ? "error" : ""}
              help={errors?.password_confirmation ? errors?.password_confirmation[0] : ""}
            >
              <Input.Password placeholder="Confirm new password" size="large" />
            </Form.Item>

            <Divider className="my-2" />

            <Button
              htmlType="submit"
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              loading={loading}
              className="w-full md:w-auto"
            >
              Update Password
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}
