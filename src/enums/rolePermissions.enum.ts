import { Role } from './role.enum';
import { Permissions } from './permissions.enum';

const UserPermissions = [
  Permissions.CREATE_PLAYLIST,
  Permissions.COPY_PLAYLIST,
  Permissions.UPDATE_YOUR_PLAYLIST,
  Permissions.DELETE_YOUR_PLAYLIST,
  Permissions.GET_PUBLIC_PlAYLISTS,
  Permissions.GET_MOVIES,
  Permissions.GET_GENRES,
  Permissions.GET_DIRECTORS,
];

export const RolePermissions = {
  [Role.User]: [...UserPermissions],
  [Role.Admin]: [
    ...UserPermissions,
    Permissions.USERS_CRUD,
    Permissions.GET_REPORTS,
    Permissions.DELETE_REPORTS,
    Permissions.MOVIES_CUD,
    Permissions.GENRES_CUD,
    Permissions.DIRECTORS_CUD,
  ],
};
