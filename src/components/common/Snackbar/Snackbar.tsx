
import { observer } from 'mobx-react';
import * as React from 'react';
import { SnackbarMessageGoalsType } from 'entities/snackbar';
import { useRootStore } from 'store/globals/root';

import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { notification } from 'antd';

type Props = {
  isVisible: boolean;
};

const Snackbar: React.FC<Props> = ({ isVisible }) => {
  const store = useRootStore();
  
  React.useEffect(() => {
    if (isVisible) {
      const snackbarMessage = store.snackbarStore.snackbarMessage.value;
      const icon = snackbarMessage?.goal === SnackbarMessageGoalsType.success ? (
        <CheckCircleOutlined style={{ color: '#52c41a' }} />
      ) : (
        <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
      );

      notification.open({
        message: snackbarMessage?.text,
        icon: icon,
        duration: 3, // Установите длительность уведомления
      });
    }
  }, [isVisible, store.snackbarStore.snackbarMessage.value]);

  return null
};

export default observer(Snackbar);
