import { Logo } from 'components/common';
import * as React from 'react';
import s from './RegisterPage.module.scss';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { RoutePath } from 'config/router';
import { useUserStore } from 'store/hooks';
import { observer } from 'mobx-react';

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const userStore = useUserStore();

  const onFinish = (values: any) => {
    userStore.register({
      name: values.username,
      password: values.password,
      email: values.email,
    });
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
            name="username"
            label="Имя пользователя"
            rules={[
              {
                required: true,
                message: 'Введите имя пользователя!',
                whitespace: true,
              },
            ]}
          >
            <Input className={s.input} />
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
            <Input className={s.input} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              {
                required: true,
                message: 'Введите ваш пароль!',
              },
            ]}
            hasFeedback
          >
            <Input.Password className={s.input} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Подтверждение пароля"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Подтвердите ваш пароль!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password className={s.input} />
          </Form.Item>

          <Form.Item className={s.button}>
            <Button type="primary" htmlType="submit" className={s.button}>
              Зарегистрироваться
            </Button>
          </Form.Item>
          <Form.Item className={s.login}>
            Уже есть аккаунт? <Link to={RoutePath.auth}>Войти!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default observer(RegisterPage);
