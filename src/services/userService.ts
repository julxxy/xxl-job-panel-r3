function formatPermissionToString(permission: number[] | string[] | undefined): string {
  if (Array.isArray(permission) && permission.length > 0) {
    return permission.join(',')
  }
  return ''
}

function formatPermissionToList(permission: string | number[] | undefined): number[] {
  if (Array.isArray(permission)) return permission.map(Number).filter(n => !isNaN(n))

  if (!permission || permission.trim() === '') return []

  return permission
    .split(',')
    .map(s => Number(s))
    .filter(n => !isNaN(n))
}

export { formatPermissionToString, formatPermissionToList }
