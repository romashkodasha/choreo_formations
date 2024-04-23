import { Logo } from 'components/common';
import * as React from 'react';
import s from './RegisterPage.module.scss';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { RoutesEnum } from 'config/routes';

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className={s.page}>
      <div className={s['login-form']}>
        <Logo size="m" />
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          className={s.form}
        >
          <Form.Item
            name="nickname"
            label="Nickname"
            tooltip="What do you want others to call you?"
            rules={[
              {
                required: true,
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ]}
          >
            <Input className={s.input}/>
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'Введен неправильный формат!',
              },
              {
                required: true,
                message: 'Введите ваш email!',
              },
            ]}
          >
            <Input className={s.input}/>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password className={s.input} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The new password that you entered do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password className={s.input} />
          </Form.Item>

          <Form.Item className={s.button}>
            <Button
              type="primary"
              htmlType="submit"
              className={s.button}
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
          <Form.Item className={s.login}>Уже есть аккаунт?{' '}<Link to={RoutesEnum.auth}>Войти!</Link></Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
