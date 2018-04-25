export const formatCurrency = (val, format = true) =>
  `${format ? '$' : ''}${parseInt(val.toString())
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    .replace('.00', '')}`

export const formatSeriesLabel = (label, val, format = true) =>
  `<b>${label}: </b>${formatCurrency(val, format)}`
