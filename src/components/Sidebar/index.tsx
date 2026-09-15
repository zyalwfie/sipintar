import React, { useEffect, useRef, useState } from 'react';
import {
  FiBookOpen,
  FiChevronDown,
  FiFileText,
  FiGrid,
  FiMenu,
  FiUsers,
} from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { pathname } = useLocation();
  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (window.innerWidth >= 1024) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-shrink-0 flex-col overflow-y-hidden bg-black transition-[margin,transform] duration-300 ease-in-out dark:bg-boxdark lg:static ${
        sidebarOpen ? 'translate-x-0 lg:ml-0' : '-translate-x-full lg:-ml-72.5'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/dashboard" className="text-white">
          <div className="text-2xl font-bold leading-none">SIPINTAR</div>
          <div className="mt-1 text-xs font-medium text-white/70">
            Sistem Pengadaan Internal
          </div>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-bodydark1 transition hover:bg-graydark hover:text-white"
          title="Tutup sidebar"
        >
          <FiMenu size={20} />
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('dashboard') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FiGrid size={18} />
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/pengadaan"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.startsWith('/pengadaan') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FiFileText size={18} />
                  Pengadaan
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/manajemen-pengguna"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('manajemen-pengguna') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FiUsers size={18} />
                  Manajemen Pengguna
                </NavLink>
              </li>

              <SidebarLinkGroup activeCondition={pathname.includes('glossary')}>
                {(handleClick, open) => (
                  <React.Fragment>
                    <NavLink
                      to="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('glossary') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                      onClick={(event) => {
                        event.preventDefault();
                        sidebarExpanded
                          ? handleClick()
                          : setSidebarExpanded(true);
                      }}
                    >
                      <FiBookOpen size={18} />
                      Glossary
                      <FiChevronDown
                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${
                          open && 'rotate-180'
                        }`}
                        size={18}
                      />
                    </NavLink>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        open
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <ul className="mb-5.5 mt-4 flex min-h-0 flex-col gap-2.5 overflow-hidden pl-6">
                        <li>
                          <NavLink
                            to="/glossary/data-pegawai"
                            className={({ isActive }) =>
                              'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                              (isActive && '!text-white')
                            }
                          >
                            Data Pegawai
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/glossary/template-dokumen"
                            className={({ isActive }) =>
                              'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                              (isActive && '!text-white')
                            }
                          >
                            Template Dokumen
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
