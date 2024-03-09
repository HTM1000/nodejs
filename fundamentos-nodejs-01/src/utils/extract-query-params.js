export function extractQueryParams(query) {
  return query.substr(1).split('&').reduce((queryparams, param) => {
    const [key, value] = param.split('=')

    queryparams[key] = value

    return queryparams
  }, {})
}