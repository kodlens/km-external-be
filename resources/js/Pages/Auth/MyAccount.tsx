import { App, Avatar, Button, Card, Col, Divider, Form, Input, Row, Select, Typography } from "antd";
import { SaveOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { PageProps } from "@/types";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function MyAccount({ auth }: PageProps) {
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { modal } = App.useApp();

  const loadAuthUser = () => {
    form.setFieldsValue({
      username: auth.user.username,
      lname: auth.user.lname,
      fname: auth.user.fname,
      mname: auth.user.mname,
      sex: auth.user.sex,
    });
  };

  useEffect(() => {
    loadAuthUser();
  }, []);

  const submit = (values: any) => {
    setErrors({});
    setLoading(true);

    axios
      .patch("/my-account-update", values)
      .then((res) => {
        if (res.data.status === "updated") {
          modal.success({
            title: "Updated!",
            content: <div>Your account was updated successfully.</div>,
            onOk() {
              router.reload();
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
            <Avatar size={52} icon={<UserOutlined />} className="bg-slate-700" />
            <div>
              <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
                My Account
              </Typography.Title>
              <Typography.Text style={{ color: "rgba(255,255,255,0.75)" }}>
                Update your profile details.
              </Typography.Text>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 md:px-8">
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            onFinish={submit}
            initialValues={{
              username: "",
              lname: "",
              fname: "",
              mname: "",
              sex: "",
            }}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="USERNAME"
                  name="username"
                  validateStatus={errors?.username ? "error" : ""}
                  help={errors?.username ? errors?.username[0] : "Read-only username"}
                >
                  <Input placeholder="Username" disabled size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="sex"
                  label="SEX"
                  validateStatus={errors?.sex ? "error" : ""}
                  help={errors?.sex ? errors?.sex[0] : ""}
                >
                  <Select
                    size="large"
                    placeholder="Select sex"
                    options={[
                      { value: "MALE", label: "MALE" },
                      { value: "FEMALE", label: "FEMALE" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="LAST NAME"
                  name="lname"
                  validateStatus={errors?.lname ? "error" : ""}
                  help={errors?.lname ? errors?.lname[0] : ""}
                >
                  <Input placeholder="Last name" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="FIRST NAME"
                  name="fname"
                  validateStatus={errors?.fname ? "error" : ""}
                  help={errors?.fname ? errors?.fname[0] : ""}
                >
                  <Input placeholder="First name" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="MIDDLE NAME"
                  name="mname"
                  validateStatus={errors?.mname ? "error" : ""}
                  help={errors?.mname ? errors?.mname[0] : ""}
                >
                  <Input placeholder="Middle name" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Divider className="my-2" />

            <Button
              htmlType="submit"
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              loading={loading}
              className="w-full md:w-auto"
            >
              Save Changes
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}
