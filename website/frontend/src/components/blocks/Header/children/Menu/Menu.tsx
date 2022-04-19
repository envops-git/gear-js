import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApi } from 'hooks';
import { routes } from 'routes';
import clsx from 'clsx';
import styles from './Menu.module.scss';

type Props = {
  openSidebar: () => void;
};

type ClassNameProps = {
  isActive: boolean;
};

const links = [
  { to: routes.explorer, text: 'Explorer' },
  { to: routes.editor, text: '</> IDE' },
  { to: routes.mailbox, text: 'Mailbox' },
];

const Menu = ({ openSidebar }: Props) => {
  const { isApiReady } = useApi();

  const getClassName = ({ isActive }: ClassNameProps) => clsx(styles.link, isActive && styles.active);

  const getItems = () =>
    links.map(({ to, text }) => (
      <li key={text}>
        <NavLink className={getClassName} to={to} children={text} />
      </li>
    ));

  return (
    <ul className={styles.menu}>
      <li>
        <span className={styles.link} onClick={openSidebar}>
          {isApiReady ? localStorage.chain : 'Loading...'}
        </span>
      </li>
      {getItems()}
    </ul>
  );
};

export { Menu };
