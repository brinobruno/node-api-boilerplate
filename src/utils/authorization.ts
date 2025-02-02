type Permission = {
  [role: string]: {
    [resource: string]: string[] // Allowed actions
  }
}

export const permissions: Permission = {
  admin: {
    Review: ['GET', 'CREATE', 'UPDATE', 'DELETE', 'PUT'],
    User: ['GET', 'CREATE', 'UPDATE', 'DELETE', 'PUT'],
    Feedback: ['GET', 'CREATE', 'UPDATE', 'DELETE', 'PUT'],
  },
  client: {
    Review: ['GET', 'CREATE'],
    Feedback: ['GET', 'CREATE'],
  },
}

export function isAuthorized(
  role: string,
  resource: string,
  action: string
): boolean {
  return permissions[role]?.[resource]?.includes(action) || false
}
