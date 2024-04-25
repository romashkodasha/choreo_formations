import * as React from 'react';

import s from './AuthPage.module.scss';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Logo, ScreenSpinner } from 'components/common';
import { Link } from 'react-router-dom';
import { RoutePath } from 'config/router';
import { useRouterStore, useUserStore } from 'store/hooks';
import { observer } from 'mobx-react';

const AuthPage: React.FC = () => {
  const userStore = useUserStore();
  const { replace } = useRouterStore();

  const onFinish = (values: any) => {
    userStore.login(values);
  };

  if (userStore.meta.isLoading) {
    return <ScreenSpinner />;
  }

  React.useEffect(() => {
    if (userStore.meta.isLoaded) {
      replace(RoutePath.root);
    }
  }, [userStore.meta.isLoaded, replace]);

  return (
    <div className={s.page}>
      <div className={s.loginForm}>
        <Logo size="m" />
        <Form
          name="normal_login"
          className={s.form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Введите имя пользователя!' }]}
          >
            <Input
              prefix={<UserOutlined className={s['site-form-item-icon']} />}
              placeholder="Имя пользователя"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите ваш пароль!' }]}
          >
            <Input
              prefix={<LockOutlined className={s['site-form-item-icon']} />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Запомнить меня</Checkbox>
            </Form.Item>

            <Link className={s['login-form-forgot']} to={''}>
              Восстановить пароль
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={s['login-form-button']}
            >
              Войти
            </Button>
            или <Link to={RoutePath.register}>зарегистрироваться!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default observer(AuthPage);
