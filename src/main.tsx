import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.scss';
import './styles/fonts/fonts.scss';
import App from './App';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#8895D6',

        colorBgContainer: '#E9EDFF',
      },
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ConfigProvider>
);
