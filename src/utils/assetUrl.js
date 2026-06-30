export const assetUrl = (path) => {
  if (typeof path !== 'string' || !path.startsWith('/')) return path
  return `${import.meta.env.BASE_URL}${path.slice(1)}`
}

export const withBaseAssetUrls = (value) => {
  if (Array.isArray(value)) return value.map(withBaseAssetUrls)

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, withBaseAssetUrls(item)]),
    )
  }

  return assetUrl(value)
}
