'use client';
import { roleAcions } from '@/lib/redux/features/roleSlice';
import { useAppSelector, useAppStore } from '@/lib/redux/hook';
import { CTRole } from '@/lib/types/client.types';
import { getActionCP } from '@/lib/utils/client.utils';
import { ACTIONTYPE, dateConverter } from '@/lib/utils/global.utils';
import React, { useRef } from 'react';

const RoleRows = ({
  roles,
  actions,
  curUserRoleId,
}: {
  roles: string;
  actions: ACTIONTYPE[];
  curUserRoleId: string;
}) => {
  const parsedRoles = JSON.parse(roles) as CTRole[];
  // CODE to store roles in redux-store
  const initializedData = useRef(false);
  const store = useAppStore();
  if (!initializedData.current) {
    store.dispatch(roleAcions.storeRoles(parsedRoles));
    initializedData.current = true;
  }

  const rolesData = useAppSelector((st) => st.roles);

  const ActionJSX = getActionCP(actions);

  return (
    <>
      {rolesData.roles.length > 0 &&
        rolesData.roles.map((role, i) => (
          <tr key={role._id.toString()}>
            <td className='py-5 px-4 text-left'>{i + 1}</td>
            <td className='py-5 px-4 text-left capitalize'>{role.name}</td>
            <td className='py-5 px-4 text-left '>
              <span className='capitalize'>
                {role.permissions.map((per) => per.name).join(' | ')}
              </span>
              {role.permissions.length === 0 &&
                'No Permissions Assinged to this role.'}
            </td>
            <td className='py-5 px-4 text-left'>
              {dateConverter(role.createdAt)}
            </td>
            <td className='py-5 px-4 text-left'>
              {dateConverter(role.updatedAt)}
            </td>
            {ActionJSX.length > 0 && (
              <td className='py-5 px-4 text-left'>
                {curUserRoleId !== role._id && (
                  <div className='flex items-center gap-2'>
                    {ActionJSX.map(
                      (JSX, i) =>
                        JSX && <JSX key={i} id={role._id} title='role' />
                    )}
                  </div>
                )}
                {curUserRoleId === role._id && '-'}
              </td>
            )}
          </tr>
        ))}
      {rolesData.roles.length === 0 && (
        <tr>
          <td colSpan={6} className='py-5 px-4 text-center'>
            No Roles Found!!
          </td>
        </tr>
      )}
    </>
  );
};

export default RoleRows;
