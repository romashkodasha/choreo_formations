import cn from 'classnames';
import * as React from 'react';

import s from './ScreenSpinner.module.scss';

type Props = {
  withoutPadding?: boolean;
  className?: string;
};

const ScreenSpinner: React.FC<Props> = ({ withoutPadding = false, className }) => {
  return (
    <div className={cn(s.screen, withoutPadding && s['screen_without-padding'])}>
      <div className={cn(s.spinner, className)} />
    </div>
  );
};

export default React.memo(ScreenSpinner);
