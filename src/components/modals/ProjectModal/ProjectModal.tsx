import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TeamsStore } from 'store/locals/TeamsStore';
import { useProjectsStore } from 'store/locals/ProjectsStore';
import { useLocalStore } from 'store/hooks';
import { useRootStore } from 'store/globals/root';

type ProjectModalProps = {
  close: VoidFunction;
  isOpen: boolean;
};
const ProjectModal: React.FC<ProjectModalProps> = ({ close, isOpen }) => {
  const projectsStore = useProjectsStore();
  const rootStore = useRootStore();
  const teamsStore = useLocalStore(() => new TeamsStore(rootStore));
  const [form] = Form.useForm();

  React.useEffect(() => {
    const init = async () => {
      await teamsStore.loadTeamsList({ initial: true });
    };

    void init();
  }, [teamsStore]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        projectsStore.createProject(values);
        console.log(values);
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

  const handleAfterClose = () => {
    projectsStore.loadProjectsList({ initial: true });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      title="Создание проекта"
      okText="Создать"
      cancelText="Отмена"
      afterClose={handleAfterClose}
    >
      <Form form={form}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Введите название проекта' }]}
        >
          <Input placeholder="Название проекта" />
        </Form.Item>
        <Form.Item
          name="id_team"
          rules={[{ required: true, message: 'Укажите команду' }]}
        >
          <Select
            placeholder="Команда"
            options={teamsStore.teams.map((t) => ({ value: t.id, label: t.name }))}
          />
        </Form.Item>
        <Form.Item name="width" label="Ширина сцены" initialValue={10}>
          <InputNumber min={5} max={20} />
        </Form.Item>
        <Form.Item name="height" label="Глубина сцены" initialValue={10}>
          <InputNumber min={5} max={20} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default observer(ProjectModal);
