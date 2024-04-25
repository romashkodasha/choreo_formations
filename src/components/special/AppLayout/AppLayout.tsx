import { observer } from 'mobx-react';
import * as React from 'react';
import { useRootStoreInit } from 'store/hooks';
import * as ui from './ui';
import * as config from './config';
import { useLocation, useOutlet } from 'react-router-dom';
import { RoutePath } from 'config/router';

const AppLayout: React.FC = () => {
    const { appState } = useRootStoreInit();
    const location = useLocation();
    const outlet = useOutlet();

    const { withHeader } = config.LAYOUT_CONFIG[location.pathname as RoutePath];

    if (appState.loading) {
        return (<ui.Loader />)
    }

    if (withHeader) {
        return (<ui.PageWithHeader>{outlet}</ui.PageWithHeader>)
    }

    return (<ui.PageWrapper key={location.key}>{outlet}</ui.PageWrapper>)
}

export default observer(AppLayout);