import * as React from 'react';

import s from './Header.module.scss';
import { Logo, ThemeEnum } from 'components/common';

const Header: React.FC = () => {
    return (<div className={s.header}><Logo size="m" theme={ThemeEnum.white}/></div>)
}

export default React.memo(Header);