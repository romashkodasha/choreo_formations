import { ScreenSpinner } from 'components/common/ScreenSpinner';
import { PageWrapper } from '..';
import * as React from 'react';

const Loader: React.FC = () => {
    return (<PageWrapper><ScreenSpinner/></PageWrapper>)
}

export default React.memo(Loader);