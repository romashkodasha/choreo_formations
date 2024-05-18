import * as React from 'react';
import { useLocalStore } from 'store/hooks';
import { useRootStore } from 'store/globals/root';
import { TeamsStore } from 'store/locals/TeamsStore';
import { Button, ColorPicker, Form, Input, Modal, Space } from 'antd';
import { observer } from 'mobx-react';
import { ITeam, IMember } from 'store/locals/TeamStore/types';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import s from './CreateTeamModal.module.scss';

type CreateTeamModalProps = {
  close: VoidFunction;
  isOpen: boolean;
};

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, close }) => {
  const rootStore = useRootStore();
  const teamsStore = useLocalStore(() => new TeamsStore(rootStore));
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        teamsStore.createTeam(values);
        form.resetFields();
        close();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    close();
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={'Создание команды'}
        onOk={handleOk}
        open={isOpen}
        onCancel={handleCancel}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Введите название команды' }]}
          >
            <Input placeholder="Название команды" />
          </Form.Item>
          <Form.List name="members">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space key={key} className={s.member} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'color']}
                      rules={[{ required: true, message: '' }]}
                    >
                      <ColorPicker
                        disabledAlpha
                        onChange={(color) => {
                          const colorHex = color.toHex();
                          form.setFieldValue(
                            ['members', name, 'color'],
                            colorHex
                          );
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[
                        { required: true, message: 'Введите имя участника' },
                      ]}
                    >
                      <Input placeholder="Имя участника" />
                    </Form.Item>
                    <Button
                      icon={<MinusCircleOutlined />}
                      shape="circle"
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Добавить участника
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default observer(CreateTeamModal);
