import * as React from 'react';
import { useRootStore } from 'store/globals/root';
import { useTeamsStore } from 'store/locals/TeamsStore';
import {
  Button,
  ColorPicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Space,
} from 'antd';
import { observer } from 'mobx-react';
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import s from './TeamModal.module.scss';
import { TeamModel } from 'store/models/TeamModel';

type TeamModalProps = {
  close: VoidFunction;
  isOpen: boolean;
  team?: TeamModel;
};

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, close, team }) => {
  const teamsStore = useTeamsStore();
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (team) teamsStore.editTeam(team.id, values);
        else teamsStore.createTeam(values);
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

  React.useEffect(() => {
    if (team) {
      form.setFieldsValue(team);
    }
  }, [team, form]);

  const handleAfterClose = () => {
    teamsStore.loadTeamsList({ initial: true });
  };

  const confirm: PopconfirmProps['onConfirm'] = () => {
    if (team) teamsStore.deleteTeam(team.id);
    close();
  };

  return (
    <Modal
      title={team ? 'Редактирование команды' : 'Создание команды'}
      onOk={handleOk}
      open={isOpen}
      onCancel={handleCancel}
      okText={team ? 'Сохранить' : 'Создать'}
      cancelText="Отмена"
      afterClose={handleAfterClose}
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
        <Popconfirm
          title={'Удалить команду'}
          description="Вы уверены, что хотите удалить команду? Это действие нельзя отменить и оно повлечет удаление проекта, в котором задействована команда!"
          onConfirm={confirm}
          okText="Да"
          cancelText="Нет"
        >
          <Button danger icon={<DeleteOutlined />} type="dashed">
            Удалить команду
          </Button>
        </Popconfirm>
      </Form>
    </Modal>
  );
};

export default observer(TeamModal);
