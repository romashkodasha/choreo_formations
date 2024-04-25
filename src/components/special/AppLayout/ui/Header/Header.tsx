import * as React from 'react';

import s from './Header.module.scss';

const Header: React.FC = () => {
    return (<div className={s.header}>Header</div>)
}

export default React.memo(Header);